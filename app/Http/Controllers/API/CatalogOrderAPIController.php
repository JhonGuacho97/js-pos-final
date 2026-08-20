<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Models\CatalogOrder;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Sale;
use App\Models\Setting;
use App\Repositories\SaleRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class CatalogOrderAPIController extends AppBaseController
{
    public function __construct(private readonly SaleRepository $saleRepository)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $storeId = $this->requireCurrentStoreId();
        $data = $request->validate([
            'search' => 'nullable|string|max:100',
            'status' => ['nullable', Rule::in(CatalogOrder::STATUSES)],
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
            'per_page' => 'nullable|integer|min:5|max:100',
            'page' => 'nullable|integer|min:1',
        ]);

        $base = CatalogOrder::query()->where('store_id', $storeId);
        if ($warehouseId = $this->restrictedWarehouseId()) {
            $base->where('warehouse_id', $warehouseId);
        }

        $summary = (clone $base)
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $orders = $base
            ->with(['warehouse:id,name', 'assignee:id,first_name,last_name', 'sale:id,reference_code'])
            ->withCount('items')
            ->when($data['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($data['search'] ?? null, function ($query, $search) {
                $term = '%'.trim($search).'%';
                $query->where(function ($nested) use ($term) {
                    $nested->where('reference', 'like', $term)
                        ->orWhere('customer_name', 'like', $term)
                        ->orWhere('customer_phone', 'like', $term);
                });
            })
            ->when($data['date_from'] ?? null, fn ($query, $date) => $query->whereDate('created_at', '>=', $date))
            ->when($data['date_to'] ?? null, fn ($query, $date) => $query->whereDate('created_at', '<=', $date))
            ->latest()
            ->paginate($data['per_page'] ?? 15);

        return response()->json([
            'data' => collect($orders->items())->map(fn (CatalogOrder $order) => $this->summaryPayload($order))->values(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ],
            'summary' => collect(CatalogOrder::STATUSES)->mapWithKeys(
                fn ($status) => [$status => (int) ($summary[$status] ?? 0)]
            ),
        ]);
    }

    public function show(CatalogOrder $catalogOrder): JsonResponse
    {
        $this->authorizeOrder($catalogOrder);
        $catalogOrder->load([
            'warehouse:id,name',
            'assignee:id,first_name,last_name',
            'sale:id,reference_code,grand_total,status,payment_status',
            'items',
            'statusHistory.user:id,first_name,last_name',
        ]);

        return $this->sendResponse($this->detailPayload($catalogOrder), 'Pedido obtenido.');
    }

    public function updateStatus(Request $request, CatalogOrder $catalogOrder): JsonResponse
    {
        $this->authorizeOrder($catalogOrder);
        $data = $request->validate([
            'status' => ['required', Rule::in(CatalogOrder::STATUSES)],
            'note' => 'nullable|string|max:1000',
        ]);

        DB::transaction(function () use ($catalogOrder, $data) {
            $order = CatalogOrder::whereKey($catalogOrder->id)->lockForUpdate()->firstOrFail();
            if (!$order->canTransitionTo($data['status'])) {
                throw new UnprocessableEntityHttpException('Ese cambio de estado no está permitido para el pedido actual.');
            }

            $from = $order->status;
            $timestampColumn = [
                CatalogOrder::CONFIRMED => 'confirmed_at',
                CatalogOrder::PREPARING => 'preparing_at',
                CatalogOrder::COMPLETED => 'completed_at',
                CatalogOrder::CANCELLED => 'cancelled_at',
            ][$data['status']] ?? null;

            $changes = ['status' => $data['status']];
            if ($timestampColumn) {
                $changes[$timestampColumn] = now();
            }
            if ($data['status'] === CatalogOrder::CONFIRMED && !$order->assigned_to) {
                $changes['assigned_to'] = Auth::id();
            }
            $order->update($changes);
            $order->statusHistory()->create([
                'user_id' => Auth::id(),
                'from_status' => $from,
                'to_status' => $data['status'],
                'note' => $data['note'] ?? null,
            ]);
        });

        return $this->show($catalogOrder->fresh());
    }

    public function updateNotes(Request $request, CatalogOrder $catalogOrder): JsonResponse
    {
        $this->authorizeOrder($catalogOrder);
        $data = $request->validate(['internal_notes' => 'nullable|string|max:3000']);
        $catalogOrder->update($data);

        return $this->sendResponse(['internal_notes' => $catalogOrder->internal_notes], 'Nota interna actualizada.');
    }

    public function convertToSale(CatalogOrder $catalogOrder): JsonResponse
    {
        $this->authorizeOrder($catalogOrder);

        $sale = DB::transaction(function () use ($catalogOrder) {
            $order = CatalogOrder::with(['items.product', 'items.presentation'])
                ->whereKey($catalogOrder->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($order->sale_id) {
                return Sale::findOrFail($order->sale_id);
            }
            if (!in_array($order->status, [CatalogOrder::CONFIRMED, CatalogOrder::PREPARING], true)) {
                throw new UnprocessableEntityHttpException('Confirma el pedido antes de convertirlo en venta.');
            }

            $customer = $this->defaultCustomerForStore($order->store_id);
            if (!$customer) {
                throw new UnprocessableEntityHttpException('Configura un cliente predeterminado para esta tienda antes de convertir pedidos.');
            }

            $saleItems = $order->items->map(function ($item) use ($order) {
                $product = $item->product;
                if (!$product || (int) $product->store_id !== (int) $order->store_id) {
                    throw new UnprocessableEntityHttpException("El producto {$item->product_name} ya no está disponible en esta tienda.");
                }

                $currentPrice = $item->presentation
                    ? $item->presentation->priceForWarehouse($order->warehouse_id)
                    : $product->priceForWarehouse($order->warehouse_id);
                if (abs((float) $currentPrice - (float) $item->unit_price) > 0.0001) {
                    throw new UnprocessableEntityHttpException("El precio de {$item->product_name} cambió desde que se creó el pedido. Revisa el pedido antes de generar la venta.");
                }

                return [
                    'product_id' => $product->id,
                    'product_presentation_id' => $item->product_presentation_id,
                    'presentation_equivalence' => $item->presentation_equivalence,
                    'product_price' => $item->unit_price,
                    'tax_type' => Sale::INCLUSIVE,
                    'tax_value' => (float) ($product->order_tax ?? 0),
                    'tax_amount' => 0,
                    'discount_type' => Sale::FIXED,
                    'discount_value' => 0,
                    'discount_amount' => 0,
                    'sale_unit' => $product->getRawOriginal('sale_unit'),
                    'quantity' => $item->quantity,
                    'sub_total' => $item->line_total,
                ];
            })->all();

            $sale = $this->saleRepository->storeSale([
                'customer_id' => $customer->id,
                'warehouse_id' => $order->warehouse_id,
                'tax_rate' => 0,
                'tax_amount' => 0,
                'discount' => 0,
                'shipping' => $order->delivery_fee,
                'grand_total' => $order->grand_total,
                'received_amount' => 0,
                'paid_amount' => 0,
                'payment_type' => Sale::OTHER,
                'status' => Sale::ORDERED,
                'payment_status' => Sale::UNPAID,
                'note' => $this->saleNote($order),
                'sale_items' => $saleItems,
            ]);

            $order->update(['sale_id' => $sale->id]);
            $order->statusHistory()->create([
                'user_id' => Auth::id(),
                'from_status' => $order->status,
                'to_status' => $order->status,
                'note' => "Venta {$sale->reference_code} generada desde el pedido.",
            ]);

            return $sale;
        });

        return $this->sendResponse([
            'sale_id' => $sale->id,
            'reference_code' => $sale->reference_code,
            'grand_total' => (float) $sale->grand_total,
        ], 'Venta generada correctamente.');
    }

    private function authorizeOrder(CatalogOrder $order): void
    {
        abort_unless((int) $order->store_id === $this->requireCurrentStoreId(), 403, 'No tiene acceso a este pedido.');
        $this->authorizeWarehouseAccess((int) $order->warehouse_id);
    }

    private function defaultCustomerForStore(int $storeId): ?Customer
    {
        $customerId = Setting::where('store_id', $storeId)->where('key', 'default_customer')->value('value')
            ?: Setting::whereNull('store_id')->where('key', 'default_customer')->value('value');

        return Customer::where('store_id', $storeId)
            ->where(function ($query) use ($customerId) {
                if ($customerId) {
                    $query->whereKey($customerId)->orWhere('es_consumidor_final', true);
                } else {
                    $query->where('es_consumidor_final', true);
                }
            })
            ->orderByRaw('id = ? desc', [(int) $customerId])
            ->first();
    }

    private function saleNote(CatalogOrder $order): string
    {
        return collect([
            "Pedido del catálogo {$order->reference}",
            "Cliente: {$order->customer_name}",
            "Teléfono: {$order->customer_phone}",
            'Entrega: '.($order->fulfillment_type === 'delivery' ? 'Domicilio' : 'Retiro en tienda'),
            $order->delivery_address ? "Dirección: {$order->delivery_address}" : null,
            $order->payment_method ? "Pago previsto: {$order->payment_method}" : null,
            $order->notes ? "Observaciones: {$order->notes}" : null,
        ])->filter()->implode("\n");
    }

    private function summaryPayload(CatalogOrder $order): array
    {
        return [
            'id' => $order->id,
            'reference' => $order->reference,
            'status' => $order->status,
            'customer_name' => $order->customer_name,
            'customer_phone' => $order->customer_phone,
            'fulfillment_type' => $order->fulfillment_type,
            'grand_total' => (float) $order->grand_total,
            'items_count' => $order->items_count,
            'warehouse' => $order->warehouse?->name,
            'assignee' => $order->assignee ? trim($order->assignee->first_name.' '.$order->assignee->last_name) : null,
            'sale' => $order->sale ? ['id' => $order->sale->id, 'reference_code' => $order->sale->reference_code] : null,
            'created_at' => $order->created_at?->toIso8601String(),
        ];
    }

    private function detailPayload(CatalogOrder $order): array
    {
        return array_merge($this->summaryPayload($order), [
            'delivery_address' => $order->delivery_address,
            'payment_method' => $order->payment_method,
            'notes' => $order->notes,
            'internal_notes' => $order->internal_notes,
            'subtotal' => (float) $order->subtotal,
            'delivery_fee' => (float) $order->delivery_fee,
            'confirmed_at' => $order->confirmed_at?->toIso8601String(),
            'preparing_at' => $order->preparing_at?->toIso8601String(),
            'completed_at' => $order->completed_at?->toIso8601String(),
            'cancelled_at' => $order->cancelled_at?->toIso8601String(),
            'items' => $order->items->map(fn ($item) => [
                'id' => $item->id,
                'product_name' => $item->product_name,
                'variant_name' => $item->variant_name,
                'presentation_name' => $item->presentation_name,
                'quantity' => (float) $item->quantity,
                'unit_price' => (float) $item->unit_price,
                'line_total' => (float) $item->line_total,
                'notes' => $item->notes,
            ]),
            'history' => $order->statusHistory->map(fn ($history) => [
                'id' => $history->id,
                'from_status' => $history->from_status,
                'to_status' => $history->to_status,
                'note' => $history->note,
                'user' => $history->user ? trim($history->user->first_name.' '.$history->user->last_name) : 'Sistema',
                'created_at' => $history->created_at?->toIso8601String(),
            ]),
        ]);
    }
}
