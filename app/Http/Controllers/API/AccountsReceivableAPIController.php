<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreateSalePaymentRequest;
use App\Models\Sale;
use App\Models\CollectionActivity;
use App\Models\Customer;
use App\Repositories\SalesPaymentRepository;
use App\Services\AccountsReceivableService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AccountsReceivableAPIController extends AppBaseController
{
    public function __construct(
        private readonly AccountsReceivableService $receivables,
        private readonly SalesPaymentRepository $payments
    ) {}

    public function index(Request $request): JsonResponse
    {
        $query = $this->scopedQuery($request)->with(['customer', 'warehouse', 'latestCollectionActivity.user']);
        $paginator = $query->orderByRaw('payment_due_date IS NULL')
            ->orderBy('payment_due_date')
            ->orderByDesc('id')
            ->paginate(min(100, max(10, (int) $request->input('per_page', 15))));

        $paginator->setCollection($paginator->getCollection()
            ->map(fn (Sale $sale) => $this->receivables->serialize($sale))
            ->filter(fn (array $sale) => $sale['balance'] > 0)
            ->values());

        return response()->json($paginator);
    }

    public function summary(Request $request): JsonResponse
    {
        $sales = $this->scopedQuery($request)->with(['customer', 'warehouse'])->get();

        return response()->json(['data' => $this->receivables->summary($sales)]);
    }

    public function customers(Request $request): JsonResponse
    {
        $rows = $this->scopedQuery($request)
            ->with(['customer', 'warehouse', 'latestCollectionActivity.user'])
            ->orderBy('payment_due_date')
            ->get()
            ->map(fn (Sale $sale) => $this->receivables->serialize($sale))
            ->filter(fn (array $sale) => $sale['balance'] > 0)
            ->groupBy(fn (array $sale) => $sale['customer']['id'] ?? 0)
            ->map(function ($documents) {
                $first = $documents->first();
                $overdue = $documents->where('collection_status', 'overdue');
                $latest = $documents->pluck('latest_activity')->filter()->sortByDesc('contacted_at')->first();

                return [
                    'customer' => $first['customer'],
                    'documents' => $documents->count(),
                    'total_receivable' => round($documents->sum('balance'), 2),
                    'overdue_balance' => round($overdue->sum('balance'), 2),
                    'overdue_documents' => $overdue->count(),
                    'max_days_overdue' => (int) $documents->max('days_overdue'),
                    'next_due_date' => $documents->pluck('payment_due_date')->filter()->sort()->first(),
                    'latest_activity' => $latest,
                ];
            })
            ->sortByDesc(fn (array $row) => [$row['overdue_balance'], $row['total_receivable']])
            ->values();

        $page = max(1, $request->integer('page', 1));
        $perPage = min(100, max(10, $request->integer('per_page', 15)));
        $paginator = new LengthAwarePaginator(
            $rows->forPage($page, $perPage)->values(),
            $rows->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        return response()->json($paginator);
    }

    public function customerStatement(Customer $customer, Request $request): JsonResponse
    {
        $documents = $this->scopedQuery($request)
            ->where('customer_id', $customer->id)
            ->with([
                'customer', 'warehouse', 'payments' => fn ($query) => $query->orderBy('payment_date')->orderBy('id'),
                'latestCollectionActivity.user',
            ])
            ->orderBy('payment_due_date')
            ->orderBy('date')
            ->get()
            ->map(fn (Sale $sale) => array_merge($this->receivables->serialize($sale), ['payments' => $sale->payments]))
            ->filter(fn (array $sale) => $sale['balance'] > 0)
            ->values();

        if ($documents->isEmpty()) {
            throw ValidationException::withMessages(['customer' => 'El cliente no tiene documentos pendientes en esta tienda.']);
        }

        $overdue = $documents->where('collection_status', 'overdue');
        $statementSummary = [
            'documents' => $documents->count(),
            'total_receivable' => round($documents->sum('balance'), 2),
            'overdue' => round($overdue->sum('balance'), 2),
            'due_today' => round($documents->where('collection_status', 'due_today')->sum('balance'), 2),
            'current' => round($documents->whereNotIn('collection_status', ['overdue', 'due_today'])->sum('balance'), 2),
        ];

        return response()->json(['data' => [
            'customer' => $documents->first()['customer'],
            'profile' => $this->receivables->customerProfile($customer),
            'summary' => $statementSummary,
            'documents' => $documents,
        ]]);
    }

    public function collectCustomer(Customer $customer, Request $request): JsonResponse
    {
        $data = $request->validate([
            'payment_date' => ['required', 'date'],
            'payment_type' => ['required', 'integer', 'in:1,2,3,4'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'reference' => ['nullable', 'string', 'max:255'],
        ]);

        $documents = $this->scopedQuery($request)
            ->where('customer_id', $customer->id)
            ->with(['customer', 'warehouse'])
            ->orderByRaw('payment_due_date IS NULL')
            ->orderBy('payment_due_date')
            ->orderBy('date')
            ->get()
            ->map(fn (Sale $sale) => ['sale' => $sale, 'balance' => $this->receivables->serialize($sale)['balance']])
            ->filter(fn (array $row) => $row['balance'] > 0)
            ->values();
        $total = round($documents->sum('balance'), 2);
        if ($documents->isEmpty() || round((float) $data['amount'], 2) > $total) {
            throw ValidationException::withMessages([
                'amount' => 'El cobro no puede superar el saldo consolidado de $'.number_format($total, 2, '.', '').'.',
            ]);
        }

        $allocations = DB::transaction(function () use ($documents, $data) {
            $remaining = round((float) $data['amount'], 2);
            $applied = [];
            foreach ($documents as $document) {
                if ($remaining <= 0) break;
                $amount = min($remaining, (float) $document['balance']);
                $payment = $this->payments->storeSalePayment([
                    'payment_date' => $data['payment_date'],
                    'payment_type' => $data['payment_type'],
                    'amount' => $amount,
                    'received_amount' => $amount,
                    'reference' => $data['reference'] ?? null,
                ], $document['sale']);
                $applied[] = [
                    'sale_id' => $document['sale']->id,
                    'reference_code' => $document['sale']->reference_code,
                    'amount' => round((float) $payment->amount, 2),
                ];
                $remaining = round($remaining - $amount, 2);
            }
            return $applied;
        });

        return response()->json([
            'success' => true,
            'message' => 'Cobro distribuido correctamente.',
            'data' => ['amount' => round((float) $data['amount'], 2), 'allocations' => $allocations],
        ], 201);
    }

    public function show(Sale $sale): JsonResponse
    {
        $this->authorizeWarehouseAccess($sale->warehouse_id);
        $sale = $this->receivables->withBalances(Sale::query())
            ->with([
                'customer',
                'warehouse',
                'payments' => fn ($query) => $query->latest('payment_date')->latest('id'),
                'collectionActivities' => fn ($query) => $query->with('user')->latest('contacted_at')->latest('id'),
            ])
            ->findOrFail($sale->id);

        return response()->json([
            'data' => array_merge($this->receivables->serialize($sale), [
                'payments' => $sale->payments,
                'activities' => $sale->collectionActivities
                    ->map(fn (CollectionActivity $activity) => $this->receivables->serializeActivity($activity))
                    ->values(),
            ]),
        ]);
    }

    public function storeActivity(Sale $sale, Request $request): JsonResponse
    {
        $this->authorizeWarehouseAccess($sale->warehouse_id);
        $current = $this->receivables->withBalances(Sale::query())
            ->with(['customer', 'warehouse'])
            ->findOrFail($sale->id);
        $balance = $this->receivables->serialize($current)['balance'];
        if ($balance <= 0) {
            throw ValidationException::withMessages([
                'sale' => 'La cuenta ya está liquidada y no admite nuevas gestiones de cobro.',
            ]);
        }
        $data = $request->validate([
            'type' => ['required', 'in:contact,promise,note'],
            'note' => ['required', 'string', 'max:2000'],
            'promised_payment_date' => ['nullable', 'required_if:type,promise', 'date'],
            'promised_amount' => ['nullable', 'required_if:type,promise', 'numeric', 'min:0.01'],
        ]);
        if ($data['type'] === CollectionActivity::PROMISE && (float) $data['promised_amount'] > $balance) {
            throw ValidationException::withMessages([
                'promised_amount' => 'El monto prometido no puede superar el saldo pendiente.',
            ]);
        }

        $activity = $sale->collectionActivities()->create(array_merge($data, [
            'customer_id' => $sale->customer_id,
            'user_id' => $request->user()->id,
            'contacted_at' => now(),
        ]));
        $activity->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Seguimiento registrado correctamente.',
            'data' => $this->receivables->serializeActivity($activity),
        ], 201);
    }

    public function collect(Sale $sale, CreateSalePaymentRequest $request): JsonResponse
    {
        $this->authorizeWarehouseAccess($sale->warehouse_id);
        $payment = $this->payments->storeSalePayment($request->validated(), $sale);

        return response()->json([
            'success' => true,
            'message' => 'Cobro registrado correctamente.',
            'data' => $payment,
        ], 201);
    }

    public function updateTerms(Sale $sale, Request $request): JsonResponse
    {
        $this->authorizeWarehouseAccess($sale->warehouse_id);
        $data = $request->validate([
            'payment_due_date' => ['required', 'date'],
            'payment_terms_days' => ['nullable', 'integer', 'min:0', 'max:3650'],
            'collection_note' => ['nullable', 'string', 'max:2000'],
        ]);
        $sale->update($data);

        return response()->json(['success' => true, 'message' => 'Condiciones de cobro actualizadas.']);
    }

    private function scopedQuery(Request $request)
    {
        $query = $this->receivables->outstandingQuery();
        $this->scopeQueryToCurrentStore($query);
        if ($warehouse = $this->restrictedWarehouseId()) {
            $query->where('warehouse_id', $warehouse);
        } elseif ($request->filled('warehouse_id')) {
            $query->where('warehouse_id', $request->integer('warehouse_id'));
        }

        if ($request->filled('customer_id')) $query->where('customer_id', $request->integer('customer_id'));
        if ($request->filled('search')) {
            $search = trim($request->string('search'));
            $query->where(function ($nested) use ($search) {
                $nested->where('reference_code', 'like', "%{$search}%")
                    ->orWhereHas('customer', fn ($customer) => $customer
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('identification', 'like', "%{$search}%"));
            });
        }

        $today = now('America/Guayaquil')->toDateString();
        if ($request->input('status') === 'overdue') $query->whereDate('payment_due_date', '<', $today);
        if ($request->input('status') === 'due_today') $query->whereDate('payment_due_date', $today);
        if ($request->input('status') === 'current') $query->whereDate('payment_due_date', '>', $today);

        return $query;
    }
}
