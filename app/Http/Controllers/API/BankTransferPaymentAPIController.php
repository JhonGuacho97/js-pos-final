<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Models\SalesPayment;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class BankTransferPaymentAPIController extends AppBaseController
{
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'status' => ['nullable', Rule::in(['PENDING', 'VERIFIED', 'OBSERVED'])],
            'warehouse_id' => ['nullable', 'integer'],
            'user_id' => ['nullable', 'integer'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'mixed' => ['nullable', Rule::in(['0', '1'])],
            'reference_state' => ['nullable', Rule::in(['missing', 'duplicate'])],
        ]);

        $query = $this->filteredQuery($request);
        $summaryQuery = clone $query;

        $summary = [
            'count' => (clone $summaryQuery)->count(),
            'amount' => (float) (clone $summaryQuery)->sum('amount'),
            'pending' => (clone $summaryQuery)->where('reconciliation_status', SalesPayment::RECONCILIATION_PENDING)->count(),
            'verified' => (clone $summaryQuery)->where('reconciliation_status', SalesPayment::RECONCILIATION_VERIFIED)->count(),
            'observed' => (clone $summaryQuery)->where('reconciliation_status', SalesPayment::RECONCILIATION_OBSERVED)->count(),
            'mixed' => (clone $summaryQuery)->whereHas('sale.payments', fn (Builder $payments) => $payments
                ->selectRaw('sale_id')->groupBy('sale_id')->havingRaw('COUNT(*) > 1'))->count(),
            'missing_reference' => (clone $summaryQuery)->where(fn (Builder $q) => $q->whereNull('reference')->orWhere('reference', ''))->count(),
        ];

        $payments = $query->latest('payment_date')->latest('id')->paginate(getPageSize($request));
        $data = collect($payments->items())->map(fn (SalesPayment $payment) => $this->transform($payment));

        return response()->json([
            'data' => $data,
            'summary' => $summary,
            'meta' => [
                'current_page' => $payments->currentPage(),
                'last_page' => $payments->lastPage(),
                'per_page' => $payments->perPage(),
                'from' => $payments->firstItem(),
                'to' => $payments->lastItem(),
                'total' => $payments->total(),
            ],
        ]);
    }

    public function show(SalesPayment $salesPayment): JsonResponse
    {
        $this->authorizePayment($salesPayment);
        abort_unless((int) $salesPayment->payment_type === SalesPayment::BANK_TRANSFER, 404);

        $salesPayment->load($this->relations());

        return response()->json(['data' => $this->transform($salesPayment)]);
    }

    public function reconcile(Request $request, SalesPayment $salesPayment): JsonResponse
    {
        $this->authorizePayment($salesPayment);
        abort_unless((int) $salesPayment->payment_type === SalesPayment::BANK_TRANSFER, 404);

        $validated = $request->validate([
            'status' => ['required', Rule::in([
                SalesPayment::RECONCILIATION_PENDING,
                SalesPayment::RECONCILIATION_VERIFIED,
                SalesPayment::RECONCILIATION_OBSERVED,
            ])],
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        if ($validated['status'] === SalesPayment::RECONCILIATION_OBSERVED && trim((string) ($validated['note'] ?? '')) === '') {
            return response()->json(['message' => 'Indica el motivo de la observación.', 'errors' => ['note' => ['Indica el motivo de la observación.']]], 422);
        }

        $isReviewed = $validated['status'] !== SalesPayment::RECONCILIATION_PENDING;
        $salesPayment->update([
            'reconciliation_status' => $validated['status'],
            'reconciliation_note' => trim((string) ($validated['note'] ?? '')) ?: null,
            'reconciled_at' => $isReviewed ? now() : null,
            'reconciled_by' => $isReviewed ? Auth::id() : null,
        ]);

        return response()->json([
            'message' => 'Estado de la transferencia actualizado.',
            'data' => $this->transform($salesPayment->fresh()->load($this->relations())),
        ]);
    }

    private function filteredQuery(Request $request): Builder
    {
        $storeId = $this->currentStoreId();
        $restrictedWarehouse = $this->restrictedWarehouseId();
        $query = SalesPayment::query()
            ->where('payment_type', SalesPayment::BANK_TRANSFER)
            ->with($this->relations());

        $this->scopeSalesPaymentsToCurrentStore($query);

        if ($restrictedWarehouse) {
            $query->whereHas('sale', fn (Builder $sale) => $sale->where('warehouse_id', $restrictedWarehouse));
        }
        if ($request->filled('warehouse_id')) {
            $this->authorizeWarehouseAccess($request->integer('warehouse_id'));
            $query->whereHas('sale', fn (Builder $sale) => $sale->where('warehouse_id', $request->integer('warehouse_id')));
        }
        if ($request->filled('user_id')) {
            $query->whereHas('sale', fn (Builder $sale) => $sale->where('user_id', $request->integer('user_id')));
        }
        if ($request->filled('status')) {
            $query->where('reconciliation_status', $request->string('status'));
        }
        if ($request->filled('start_date')) {
            $query->whereDate('payment_date', '>=', $request->date('start_date'));
        }
        if ($request->filled('end_date')) {
            $query->whereDate('payment_date', '<=', $request->date('end_date'));
        }
        if ($request->filled('search')) {
            $search = trim((string) $request->input('search'));
            $query->where(function (Builder $q) use ($search) {
                $q->where('reference', 'like', "%{$search}%")
                    ->orWhereHas('sale', function (Builder $sale) use ($search) {
                        $sale->where('reference_code', 'like', "%{$search}%")
                            ->orWhereHas('customer', fn (Builder $customer) => $customer
                                ->where('name', 'like', "%{$search}%")
                                ->orWhere('identification', 'like', "%{$search}%"))
                            ->orWhereHas('electronicInvoice', fn (Builder $invoice) => $invoice
                                ->where('secuencial', 'like', "%{$search}%")
                                ->orWhere('clave_acceso', 'like', "%{$search}%")
                                ->orWhere('numero_autorizacion', 'like', "%{$search}%"));
                    });
            });
        }
        if ($request->input('mixed') === '1') {
            $query->whereHas('sale.payments', fn (Builder $payments) => $payments
                ->selectRaw('sale_id')->groupBy('sale_id')->havingRaw('COUNT(*) > 1'));
        }
        if ($request->input('mixed') === '0') {
            $query->whereHas('sale.payments', fn (Builder $payments) => $payments
                ->selectRaw('sale_id')->groupBy('sale_id')->havingRaw('COUNT(*) = 1'));
        }
        if ($request->input('reference_state') === 'missing') {
            $query->where(fn (Builder $q) => $q->whereNull('reference')->orWhere('reference', ''));
        }
        if ($request->input('reference_state') === 'duplicate') {
            $query->whereNotNull('reference')->where('reference', '<>', '')
                ->whereExists(function ($duplicate) use ($storeId, $restrictedWarehouse) {
                    $duplicate->selectRaw('1')->from('sales_payments as duplicate_payment')
                        ->join('sales as duplicate_sale', 'duplicate_sale.id', '=', 'duplicate_payment.sale_id')
                        ->join('warehouses as duplicate_warehouse', 'duplicate_warehouse.id', '=', 'duplicate_sale.warehouse_id')
                        ->whereColumn('duplicate_payment.reference', 'sales_payments.reference')
                        ->where('duplicate_payment.payment_type', SalesPayment::BANK_TRANSFER)
                        ->whereColumn('duplicate_payment.id', '<>', 'sales_payments.id')
                        ->when($storeId, fn ($q, $id) => $q->where('duplicate_warehouse.store_id', $id))
                        ->when($restrictedWarehouse, fn ($q, $id) => $q->where('duplicate_sale.warehouse_id', $id));
                });
        }

        return $query;
    }

    private function authorizePayment(SalesPayment $payment): void
    {
        $payment->loadMissing('sale');
        $this->authorizeWarehouseAccess($payment->sale?->warehouse_id);
    }

    private function relations(): array
    {
        return ['sale.customer', 'sale.warehouse', 'sale.user', 'sale.payments', 'sale.electronicInvoice', 'reconciledBy'];
    }

    private function transform(SalesPayment $payment): array
    {
        $sale = $payment->sale;
        $duplicateCount = 0;
        if (trim((string) $payment->reference) !== '') {
            $duplicates = SalesPayment::query()
                ->where('payment_type', SalesPayment::BANK_TRANSFER)
                ->where('reference', $payment->reference);
            $this->scopeSalesPaymentsToCurrentStore($duplicates);
            if ($warehouse = $this->restrictedWarehouseId()) {
                $duplicates->whereHas('sale', fn (Builder $sale) => $sale->where('warehouse_id', $warehouse));
            }
            $duplicateCount = $duplicates->count();
        }

        return [
            'id' => $payment->id,
            'payment_date' => $payment->payment_date,
            'created_at' => $payment->created_at,
            'amount' => (float) $payment->amount,
            'reference' => $payment->reference,
            'missing_reference' => trim((string) $payment->reference) === '',
            'duplicate_count' => $duplicateCount,
            'reconciliation_status' => $payment->reconciliation_status ?: SalesPayment::RECONCILIATION_PENDING,
            'reconciliation_note' => $payment->reconciliation_note,
            'reconciled_at' => $payment->reconciled_at,
            'reconciled_by' => $payment->reconciledBy ? trim($payment->reconciledBy->first_name . ' ' . $payment->reconciledBy->last_name) : null,
            'sale' => [
                'id' => $sale?->id,
                'reference_code' => $sale?->reference_code,
                'grand_total' => (float) ($sale?->grand_total ?? 0),
                'customer' => $sale?->customer ? ['name' => $sale->customer->name, 'identification' => $sale->customer->identification] : null,
                'warehouse' => $sale?->warehouse ? ['id' => $sale->warehouse->id, 'name' => $sale->warehouse->name] : null,
                'cashier' => $sale?->user ? trim($sale->user->first_name . ' ' . $sale->user->last_name) : null,
                'electronic_document' => $sale?->electronicInvoice?->numeroComprobante(),
                'is_mixed' => ($sale?->payments?->count() ?? 0) > 1,
                'payments' => $sale?->payments?->map(fn (SalesPayment $row) => [
                    'payment_type' => (int) $row->payment_type,
                    'amount' => (float) $row->amount,
                    'reference' => $row->reference,
                ])->values() ?? [],
            ],
        ];
    }
}
