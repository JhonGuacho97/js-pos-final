<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Models\AdjustmentItem;
use App\Models\BaseUnit;
use App\Models\InventoryCount;
use App\Models\InventoryCountItem;
use App\Models\ManageStock;
use App\Models\ProductCategory;
use App\Repositories\AdjustmentRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InventoryCountAPIController extends AppBaseController
{
    public function __construct(private readonly AdjustmentRepository $adjustments)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $query = InventoryCount::query()
            ->where('store_id', $this->requireCurrentStoreId())
            ->with(['warehouse:id,name', 'category:id,name', 'creator:id,first_name,last_name'])
            ->withCount([
                'items',
                'items as counted_items_count' => fn ($q) => $q->whereNotNull('counted_quantity'),
                'items as difference_items_count' => fn ($q) => $q->where('difference', '<>', 0),
            ]);

        if ($warehouseId = $this->restrictedWarehouseId()) {
            $query->where('warehouse_id', $warehouseId);
        }
        if ($request->filled('warehouse_id')) {
            $this->authorizeWarehouseAccess($request->integer('warehouse_id'));
            $query->where('warehouse_id', $request->integer('warehouse_id'));
        }
        if ($request->input('status') === 'active') {
            $query->whereIn('status', [InventoryCount::DRAFT, InventoryCount::COUNTING]);
        } elseif ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }
        if ($search = trim((string) $request->input('search'))) {
            $query->where(function ($q) use ($search) {
                $q->where('reference_code', 'like', "%{$search}%")
                    ->orWhereHas('warehouse', fn ($warehouse) => $warehouse->where('name', 'like', "%{$search}%"));
            });
        }

        $perPage = min(50, max(10, $request->integer('per_page', 15)));
        $paginator = $query->latest('id')->paginate($perPage);
        $paginator->setCollection($paginator->getCollection()->map(fn (InventoryCount $count) => $this->serializeCount($count)));

        $summaryQuery = InventoryCount::query()->where('store_id', $this->requireCurrentStoreId());
        if ($warehouseId = $this->restrictedWarehouseId()) {
            $summaryQuery->where('warehouse_id', $warehouseId);
        }
        $summary = $summaryQuery->selectRaw('status, COUNT(*) as total')->groupBy('status')->pluck('total', 'status');

        return response()->json(array_merge($paginator->toArray(), [
            'summary' => $summary,
            'permissions' => [
                'can_perform' => $request->user()->can('perform_inventory_counts'),
                'can_approve' => $request->user()->can('approve_inventory_counts'),
            ],
        ]));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'warehouse_id' => ['required', 'integer', 'exists:warehouses,id'],
            'product_category_id' => ['nullable', 'integer', 'exists:product_categories,id'],
            'blind_count' => ['sometimes', 'boolean'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);
        $storeId = $this->requireCurrentStoreId();
        $this->authorizeWarehouseAccess((int) $data['warehouse_id']);

        if (! empty($data['product_category_id'])) {
            $belongs = ProductCategory::whereKey($data['product_category_id'])->where('store_id', $storeId)->exists();
            abort_unless($belongs, 403, 'La categoría no pertenece a la tienda activa.');
        }

        $count = DB::transaction(function () use ($data, $storeId, $request) {
            $count = InventoryCount::create([
                'store_id' => $storeId,
                'warehouse_id' => $data['warehouse_id'],
                'product_category_id' => $data['product_category_id'] ?? null,
                'reference_code' => 'TEMP-'.str()->uuid(),
                'status' => InventoryCount::DRAFT,
                'blind_count' => $data['blind_count'] ?? true,
                'notes' => $data['notes'] ?? null,
                'created_by' => $request->user()->id,
            ]);
            $count->update(['reference_code' => sprintf('IC-%s-%06d', now('America/Guayaquil')->format('Ym'), $count->id)]);

            $stocks = ManageStock::query()
                ->where('warehouse_id', $data['warehouse_id'])
                ->whereHas('product', function ($product) use ($storeId, $data) {
                    $product->where('store_id', $storeId)->where('is_kit', false);
                    if (! empty($data['product_category_id'])) {
                        $product->where('product_category_id', $data['product_category_id']);
                    }
                })
                ->orderBy('product_id')
                ->get(['product_id', 'quantity']);

            if ($stocks->isEmpty()) {
                throw ValidationException::withMessages([
                    'warehouse_id' => 'No existen productos con stock registrado para el alcance seleccionado.',
                ]);
            }

            $now = now();
            InventoryCountItem::insert($stocks->map(fn (ManageStock $stock) => [
                'inventory_count_id' => $count->id,
                'product_id' => $stock->product_id,
                'expected_quantity' => $stock->quantity,
                'created_at' => $now,
                'updated_at' => $now,
            ])->all());

            return $count;
        });

        return response()->json([
            'success' => true,
            'message' => 'Conteo físico creado. El stock esperado quedó congelado para auditoría.',
            'data' => $this->serializeCount($count->loadCount('items')->load(['warehouse:id,name', 'category:id,name'])),
        ], 201);
    }

    public function show(InventoryCount $inventoryCount, Request $request): JsonResponse
    {
        $this->authorizeCount($inventoryCount);
        $inventoryCount->load([
            'warehouse:id,name', 'category:id,name', 'creator:id,first_name,last_name',
            'submitter:id,first_name,last_name', 'approver:id,first_name,last_name',
            'adjustment:id,reference_code',
        ])->loadCount([
            'items',
            'items as counted_items_count' => fn ($q) => $q->whereNotNull('counted_quantity'),
            'items as difference_items_count' => fn ($q) => $q->where('difference', '<>', 0),
        ]);

        $items = $inventoryCount->items()->with([
            'product:id,name,code,product_code,product_category_id,product_unit',
            'product.productCategory:id,name', 'product.variationType',
            'counter:id,first_name,last_name',
        ]);
        if ($search = trim((string) $request->input('search'))) {
            $items->whereHas('product', fn ($q) => $q
                ->where('name', 'like', "%{$search}%")
                ->orWhere('code', 'like', "%{$search}%")
                ->orWhere('product_code', 'like', "%{$search}%"));
        }
        match ($request->input('item_status')) {
            'pending' => $items->whereNull('counted_quantity'),
            'match' => $items->whereNotNull('counted_quantity')->where('difference', 0),
            'difference' => $items->where('difference', '<>', 0),
            default => null,
        };

        $canRevealExpected = ! $inventoryCount->blind_count
            || in_array($inventoryCount->status, [InventoryCount::REVIEW, InventoryCount::COMPLETED, InventoryCount::CANCELLED], true)
            || $request->user()->can('approve_inventory_counts');

        $perPage = min(100, max(10, $request->integer('per_page', 50)));
        $paginator = $items->orderBy('id')->paginate($perPage);
        $pageItems = $paginator->getCollection();
        $currentStocks = ManageStock::where('warehouse_id', $inventoryCount->warehouse_id)
            ->whereIn('product_id', $pageItems->pluck('product_id'))->pluck('quantity', 'product_id');
        $units = BaseUnit::whereIn('id', $pageItems->pluck('product.product_unit')->filter()->unique())
            ->pluck('name', 'id');
        $paginator->setCollection($pageItems->map(function (InventoryCountItem $item) use ($canRevealExpected, $currentStocks, $units) {
            $current = (float) ($currentStocks[$item->product_id] ?? 0);
            $unit = $units[$item->product->product_unit] ?? '';

            return [
                'id' => $item->id,
                'product' => [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'code' => $item->product->code,
                    'product_code' => $item->product->product_code,
                    'category' => $item->product->productCategory?->name,
                    'variation' => $item->product->variationType?->name,
                    'unit' => $unit,
                ],
                'expected_quantity' => $canRevealExpected ? $item->expected_quantity : null,
                'counted_quantity' => $item->counted_quantity,
                'difference' => $canRevealExpected ? $item->difference : null,
                'current_quantity' => $canRevealExpected ? $current : null,
                'has_stock_conflict' => $canRevealExpected && round($current, 4) !== round($item->expected_quantity, 4),
                'notes' => $item->notes,
                'counted_at' => $item->counted_at?->toIso8601String(),
                'counter' => $item->counter ? trim($item->counter->first_name.' '.$item->counter->last_name) : null,
            ];
        }));

        $countData = $this->serializeCount($inventoryCount);
        if (! $canRevealExpected) {
            $countData['difference_items_count'] = null;
        }

        return response()->json([
            'data' => $countData,
            'items' => $paginator,
            'permissions' => [
                'can_perform' => $request->user()->can('perform_inventory_counts'),
                'can_approve' => $request->user()->can('approve_inventory_counts'),
            ],
        ]);
    }

    public function updateItem(InventoryCount $inventoryCount, InventoryCountItem $item, Request $request): JsonResponse
    {
        $this->authorizeCount($inventoryCount);
        abort_unless($item->inventory_count_id === $inventoryCount->id, 404);
        $this->assertEditable($inventoryCount);
        $data = $request->validate([
            'counted_quantity' => ['required', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $item->update([
            'counted_quantity' => $data['counted_quantity'],
            'difference' => round((float) $data['counted_quantity'] - $item->expected_quantity, 4),
            'notes' => $data['notes'] ?? null,
            'counted_by' => $request->user()->id,
            'counted_at' => now(),
        ]);
        if ($inventoryCount->status === InventoryCount::DRAFT) {
            $inventoryCount->update(['status' => InventoryCount::COUNTING]);
        }

        $item = $item->fresh();
        $canRevealDifference = ! $inventoryCount->blind_count || $request->user()->can('approve_inventory_counts');

        return response()->json([
            'success' => true,
            'message' => 'Cantidad registrada.',
            'data' => [
                'id' => $item->id,
                'counted_quantity' => $item->counted_quantity,
                'difference' => $canRevealDifference ? $item->difference : null,
                'notes' => $item->notes,
                'counted_at' => $item->counted_at?->toIso8601String(),
            ],
        ]);
    }

    public function submit(InventoryCount $inventoryCount, Request $request): JsonResponse
    {
        $this->authorizeCount($inventoryCount);
        $this->assertEditable($inventoryCount);
        $pending = $inventoryCount->items()->whereNull('counted_quantity')->count();
        if ($pending > 0) {
            throw ValidationException::withMessages(['items' => "Faltan {$pending} productos por contar."]);
        }
        $inventoryCount->update([
            'status' => InventoryCount::REVIEW,
            'submitted_by' => $request->user()->id,
            'submitted_at' => now(),
        ]);

        return response()->json(['success' => true, 'message' => 'Conteo enviado a revisión.', 'data' => $this->serializeCount($inventoryCount)]);
    }

    public function approve(InventoryCount $inventoryCount, Request $request): JsonResponse
    {
        $this->authorizeCount($inventoryCount);
        if ($inventoryCount->status !== InventoryCount::REVIEW) {
            throw ValidationException::withMessages(['status' => 'Solo se puede aprobar un conteo en revisión.']);
        }

        $result = DB::transaction(function () use ($inventoryCount, $request) {
            $count = InventoryCount::whereKey($inventoryCount->id)->lockForUpdate()->firstOrFail();
            $items = $count->items()->lockForUpdate()->get();
            $stocks = ManageStock::where('warehouse_id', $count->warehouse_id)
                ->whereIn('product_id', $items->pluck('product_id'))->lockForUpdate()->get()->keyBy('product_id');

            $conflicts = $items->filter(fn (InventoryCountItem $item) =>
                round((float) optional($stocks->get($item->product_id))->quantity, 4) !== round($item->expected_quantity, 4)
            );
            if ($conflicts->isNotEmpty()) {
                throw ValidationException::withMessages([
                    'stock' => 'El stock cambió después de iniciar el conteo en '.$conflicts->count().' producto(s). Cancele este conteo y genere uno nuevo.',
                ]);
            }

            $adjustmentItems = $items->filter(fn (InventoryCountItem $item) => abs((float) $item->difference) > 0.00001)
                ->map(fn (InventoryCountItem $item) => [
                    'product_id' => $item->product_id,
                    'quantity' => abs((float) $item->difference),
                    'method_type' => $item->difference > 0 ? AdjustmentItem::METHOD_ADDITION : AdjustmentItem::METHOD_SUBTRACTION,
                ])->values()->all();

            $adjustment = null;
            if ($adjustmentItems !== []) {
                $adjustment = $this->adjustments->storeAdjustment([
                    'warehouse_id' => $count->warehouse_id,
                    'adjustment_items' => $adjustmentItems,
                ]);
            }
            $count->update([
                'status' => InventoryCount::COMPLETED,
                'approved_by' => $request->user()->id,
                'approved_at' => now(),
                'adjustment_id' => $adjustment?->id,
            ]);

            return [$count, $adjustment];
        });

        return response()->json([
            'success' => true,
            'message' => $result[1] ? 'Conteo aprobado y existencias ajustadas.' : 'Conteo aprobado sin diferencias de inventario.',
            'data' => $this->serializeCount($result[0]->fresh(['warehouse:id,name', 'adjustment:id,reference_code'])),
        ]);
    }

    public function cancel(InventoryCount $inventoryCount): JsonResponse
    {
        $this->authorizeCount($inventoryCount);
        if (in_array($inventoryCount->status, [InventoryCount::COMPLETED, InventoryCount::CANCELLED], true)) {
            throw ValidationException::withMessages(['status' => 'Este conteo ya no se puede cancelar.']);
        }
        $inventoryCount->update(['status' => InventoryCount::CANCELLED]);

        return response()->json(['success' => true, 'message' => 'Conteo cancelado.', 'data' => $this->serializeCount($inventoryCount)]);
    }

    private function authorizeCount(InventoryCount $count): void
    {
        abort_unless($count->store_id === $this->requireCurrentStoreId(), 403, 'No tiene acceso a este conteo.');
        $this->authorizeWarehouseAccess($count->warehouse_id);
    }

    private function assertEditable(InventoryCount $count): void
    {
        if (! in_array($count->status, [InventoryCount::DRAFT, InventoryCount::COUNTING], true)) {
            throw ValidationException::withMessages(['status' => 'El conteo ya no admite cambios.']);
        }
    }

    private function serializeCount(InventoryCount $count): array
    {
        $items = (int) ($count->items_count ?? 0);
        $counted = (int) ($count->counted_items_count ?? 0);

        return [
            'id' => $count->id,
            'reference_code' => $count->reference_code,
            'status' => $count->status,
            'blind_count' => $count->blind_count,
            'notes' => $count->notes,
            'warehouse' => $count->warehouse ? ['id' => $count->warehouse->id, 'name' => $count->warehouse->name] : null,
            'category' => $count->category ? ['id' => $count->category->id, 'name' => $count->category->name] : null,
            'items_count' => $items,
            'counted_items_count' => $counted,
            'difference_items_count' => (int) ($count->difference_items_count ?? 0),
            'progress' => $items > 0 ? round(($counted / $items) * 100, 1) : 0,
            'creator' => $count->creator ? trim($count->creator->first_name.' '.$count->creator->last_name) : null,
            'submitter' => $count->submitter ? trim($count->submitter->first_name.' '.$count->submitter->last_name) : null,
            'approver' => $count->approver ? trim($count->approver->first_name.' '.$count->approver->last_name) : null,
            'adjustment' => $count->adjustment ? ['id' => $count->adjustment->id, 'reference_code' => $count->adjustment->reference_code] : null,
            'created_at' => $count->created_at?->toIso8601String(),
            'submitted_at' => $count->submitted_at?->toIso8601String(),
            'approved_at' => $count->approved_at?->toIso8601String(),
        ];
    }
}
