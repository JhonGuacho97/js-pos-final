<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreateCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Http\Resources\CustomerCollection;
use App\Http\Resources\CustomerResource;
use App\Imports\CustomerImport;
use App\Models\Customer;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SalesPayment;
use App\Repositories\CustomerRepository;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Prettus\Validator\Exceptions\ValidatorException;

/**
 * Class CustomerAPIController
 */
class CustomerAPIController extends AppBaseController
{
    /** @var CustomerRepository */
    private $customerRepository;

    public function __construct(CustomerRepository $customerRepository)
    {
        $this->customerRepository = $customerRepository;
    }

    public function index(Request $request): CustomerCollection
    {
        $perPage = getPageSize($request);
        $customersQuery = $this->customerRepository;
        if ($storeId = $this->currentStoreId()) {
            $customersQuery->where('store_id', $storeId);
        }
        $customers = $customersQuery->paginate($perPage);
        CustomerResource::usingWithCollection();

        return new CustomerCollection($customers);
    }

    /**
     * @throws ValidatorException
     */
    public function store(CreateCustomerRequest $request): CustomerResource
    {
        $input = $request->all();
        if (! empty($input['dob'])) {
            $input['dob'] = $input['dob'] ?? date('Y/m/d');
        }
        $input['store_id'] = $input['store_id'] ?? $this->requireCurrentStoreId();
        $customer = $this->customerRepository->create($input);

        return new CustomerResource($customer);
    }

    public function show($id): CustomerResource
    {
        $customer = $this->customerRepository->find($id);
        $this->authorizeStoreOwnership($customer);

        return new CustomerResource($customer);
    }

    /**
     * @throws ValidatorException
     */
    public function update(UpdateCustomerRequest $request, $id): CustomerResource
    {
        $this->authorizeStoreOwnership($this->customerRepository->find($id));
        $input = $request->all();
        if (! empty($input['dob'])) {
            $input['dob'] = $input['dob'] ?? date('Y/m/d');
        }
        $customer = $this->customerRepository->update($input, $id);

        return new CustomerResource($customer);
    }

    public function destroy($id): JsonResponse
    {
        $this->authorizeStoreOwnership($this->customerRepository->find($id));
        if (getSettingValue('default_customer') == $id) {
            return $this->SendError('Default customer can\'t be deleted');
        }
        $this->customerRepository->delete($id);

        return $this->sendSuccess('Customer deleted successfully');
    }

    public function bestCustomersPdfDownload(): JsonResponse
    {
        $month = Carbon::now('America/Guayaquil')->month;
        $topCustomers = Customer::leftJoin('sales', 'customers.id', '=', 'sales.customer_id')
            ->whereMonth('date', $month)
            ->select('customers.*', DB::raw('sum(sales.grand_total) as grand_total'))
            ->groupBy('customers.id')
            ->orderBy('grand_total', 'desc')
            ->latest()
            ->take(5)
            ->withCount('sales')
            ->get();

        $data = [];

        if (Storage::exists('pdf/best-customers.pdf')) {
            Storage::delete('pdf/best-customers.pdf');
        }

        $pdf = PDF::loadView('pdf.best-customers-pdf', compact('topCustomers'))->setOptions([
            'tempDir' => public_path(),
            'chroot' => public_path(),
        ]);
        Storage::disk(config('app.media_disc'))->put('pdf/best-customers.pdf', $pdf->output());
        $data['best_customers_pdf_url'] = Storage::url('pdf/best-customers.pdf');

        return $this->sendResponse($data, 'pdf retrieved Successfully');
    }

    public function pdfDownload(Customer $customer): JsonResponse
    {
        $customer = $customer->load('sales.payments');

        $salesData = [];

        $salesData['totalSale'] = $customer->sales->count();

        $salesData['totalAmount'] = $customer->sales->sum('grand_total');

        $salesData['totalPaid'] = 0;

        foreach ($customer->sales as $sale) {
            $salesData['totalPaid'] = $salesData['totalPaid'] + $sale->payments->sum('amount');
        }

        $salesData['totalSalesDue'] = $salesData['totalAmount'] - $salesData['totalPaid'];

        $data = [];

        if (Storage::exists('pdf/customers-report-'.$customer->id.'.pdf')) {
            Storage::delete('pdf/customers-report-'.$customer->id.'.pdf');
        }

        $pdf = PDF::loadView('pdf.customers-report-pdf', compact('customer', 'salesData'))->setOptions([
            'tempDir' => public_path(),
            'chroot' => public_path(),
        ]);
        Storage::disk(config('app.media_disc'))->put('pdf/customers-report-'.$customer->id.'.pdf', $pdf->output());
        $data['customers_report_pdf_url'] = Storage::url('pdf/customers-report-'.$customer->id.'.pdf');

        return $this->sendResponse($data, 'pdf retrieved Successfully');
    }

    public function customerSalesPdfDownload(Customer $customer): JsonResponse
    {
        $customer = $customer->load('sales.payments');

        $data = [];

        if (Storage::exists('pdf/customer-sales-'.$customer->id.'.pdf')) {
            Storage::delete('pdf/customer-sales-'.$customer->id.'.pdf');
        }

        $pdf = PDF::loadView('pdf.customer-sales-pdf', compact('customer'))->setOptions([
            'tempDir' => public_path(),
            'chroot' => public_path(),
        ]);
        Storage::disk(config('app.media_disc'))->put('pdf/customer-sales-'.$customer->id.'.pdf', $pdf->output());
        $data['customers_sales_pdf_url'] = Storage::url('pdf/customer-sales-'.$customer->id.'.pdf');

        return $this->sendResponse($data, 'pdf retrieved Successfully');
    }

    private const FORMA_PAGO_LABELS = [
        1 => 'EFECTIVO',
        2 => 'CHEQUE',
        3 => 'TRANSFERENCIA',
        4 => 'OTRO',
    ];

    /**
     * Resumen de ventas de un cliente -- una fila por venta. Usado por
     * el modal de "Historial de Ventas" que se abre desde Crear Venta.
     */
    public function salesSummary(Request $request, Customer $customer): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->get('search');

        $query = Sale::where('customer_id', $customer->id)
            ->with(['electronicInvoice', 'payments'])
            ->latest();

        if ($search) {
            $searchNumerico = ltrim($search, '0') ?: '0';
            $query->where(function ($q) use ($search, $searchNumerico) {
                $q->where('reference_code', 'like', "%{$search}%")
                    ->orWhere('id', 'like', "%{$searchNumerico}%")
                    ->orWhereHas('electronicInvoice', function ($qe) use ($search) {
                        $qe->where('secuencial', 'like', "%{$search}%")
                            ->orWhere('clave_acceso', 'like', "%{$search}%");
                    });
            });
        }

        $ventas = $query->paginate($perPage, ['*'], 'page', (int) $request->input('page', 1));

        $ventas->getCollection()->transform(function (Sale $sale) {
            $ei = $sale->electronicInvoice;

            $tipoDocumento = 'RECIBO ELECTRONICO';
            if ($ei) {
                $tipoDocumento = $ei->tipo_comprobante === '05'
                    ? 'NOTA DE DEBITO ELECTRONICA'
                    : 'FACTURA ELECTRONICA';
            }

            $formasPago = $sale->payments->isNotEmpty()
                ? $sale->payments->pluck('payment_type')
                    ->map(fn ($tipo) => self::FORMA_PAGO_LABELS[$tipo] ?? 'OTRO')
                    ->unique()
                    ->implode(' + ')
                : (self::FORMA_PAGO_LABELS[$sale->payment_type] ?? 'OTRO');

            return [
                'nro_orden' => str_pad((string) $sale->id, 9, '0', STR_PAD_LEFT),
                'nro_documento' => $ei ? $ei->numeroComprobante() : $sale->reference_code,
                'fecha_venta' => optional($sale->created_at)->format('Y-m-d'),
                'tipo_documento' => $tipoDocumento,
                'canal_venta' => 'VENTA DIRECTA',
                'forma_pago' => $formasPago,
                'total' => $sale->grand_total,
            ];
        });

        return response()->json(['success' => true, 'data' => $ventas]);
    }

    /**
     * Detalle de ventas de un cliente -- una fila por línea de
     * producto, a través de todas sus ventas.
     */
    public function salesDetail(Request $request, Customer $customer): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->get('search');

        $query = SaleItem::whereHas('sale', function ($q) use ($customer) {
            $q->where('customer_id', $customer->id);
        })
            ->with(['sale.electronicInvoice', 'product'])
            ->latest('id');

        if ($search) {
            $searchNumerico = ltrim($search, '0') ?: '0';
            $query->where(function ($q) use ($search, $searchNumerico) {
                $q->whereHas('product', function ($qp) use ($search) {
                    $qp->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%");
                })
                    ->orWhereHas('sale', function ($qs) use ($search, $searchNumerico) {
                        $qs->where('reference_code', 'like', "%{$search}%")
                            ->orWhere('id', 'like', "%{$searchNumerico}%")
                            ->orWhereHas('electronicInvoice', function ($qe) use ($search) {
                                $qe->where('secuencial', 'like', "%{$search}%")
                                    ->orWhere('clave_acceso', 'like', "%{$search}%");
                            });
                    });
            });
        }

        $items = $query->paginate($perPage, ['*'], 'page', (int) $request->input('page', 1));

        $items->getCollection()->transform(function (SaleItem $item) {
            $sale = $item->sale;
            $ei = $sale?->electronicInvoice;

            $unidadMedida = $item->product ? $item->product->getProductUnitName() : null;

            return [
                'nro_orden' => str_pad((string) $sale?->id, 9, '0', STR_PAD_LEFT),
                'nro_documento' => $ei ? $ei->numeroComprobante() : $sale?->reference_code,
                'fecha_venta' => optional($sale?->created_at)->format('Y-m-d'),
                'codigo_producto' => $item->product?->code,
                'producto' => $item->product?->name,
                'unidad_medida' => is_array($unidadMedida) ? ($unidadMedida['name'] ?? '') : $unidadMedida,
                'unidades' => $item->quantity,
                'precio' => $item->product_price,
                'descuento' => $item->discount_amount,
                'iva' => $item->tax_amount,
                'subtotal' => $item->sub_total,
                'total' => $item->sub_total + $item->tax_amount,
            ];
        });

        return response()->json(['success' => true, 'data' => $items]);
    }

    public function customerQuotationsPdfDownload(Customer $customer): JsonResponse
    {
        $customer = $customer->load('quotations');

        $data = [];

        if (Storage::exists('pdf/customer-quotations-'.$customer->id.'.pdf')) {
            Storage::delete('pdf/customer-quotations-'.$customer->id.'.pdf');
        }

        $pdf = PDF::loadView('pdf.customer-quotations-pdf', compact('customer'))->setOptions([
            'tempDir' => public_path(),
            'chroot' => public_path(),
        ]);
        Storage::disk(config('app.media_disc'))->put('pdf/customer-quotations-'.$customer->id.'.pdf', $pdf->output());
        $data['customers_quotations_pdf_url'] = Storage::url('pdf/customer-quotations-'.$customer->id.'.pdf');

        return $this->sendResponse($data, 'pdf retrieved Successfully');
    }

    public function customerReturnsPdfDownload(Customer $customer): JsonResponse
    {
        $customer = $customer->load('salesReturns');

        $data = [];

        if (Storage::exists('pdf/customer-returns-'.$customer->id.'.pdf')) {
            Storage::delete('pdf/customer-returns-'.$customer->id.'.pdf');
        }

        $pdf = PDF::loadView('pdf.customer-returns-pdf', compact('customer'))->setOptions([
            'tempDir' => public_path(),
            'chroot' => public_path(),
        ]);
        Storage::disk(config('app.media_disc'))->put('pdf/customer-returns-'.$customer->id.'.pdf', $pdf->output());
        $data['customers_returns_pdf_url'] = Storage::url('pdf/customer-returns-'.$customer->id.'.pdf');

        return $this->sendResponse($data, 'pdf retrieved Successfully');
    }

    public function customerPaymentsPdfDownload($id): JsonResponse
    {
        $saleIds = [];

        $sales = Sale::whereCustomerId($id)->get();

        foreach ($sales as $sale) {
            $saleIds[] = $sale->id;
        }

        $payments = SalesPayment::whereIn('sale_id', $saleIds)->with('sale')->get();

        $data = [];

        if (Storage::exists('pdf/customer-payments-'.$id.'.pdf')) {
            Storage::delete('pdf/customer-payments-'.$id.'.pdf');
        }

        $pdf = PDF::loadView('pdf.customer-payments-pdf', compact('payments'))->setOptions([
            'tempDir' => public_path(),
            'chroot' => public_path(),
        ]);
        Storage::disk(config('app.media_disc'))->put('pdf/customer-payments-'.$id.'.pdf', $pdf->output());
        $data['customers_payments_pdf_url'] = Storage::url('pdf/customer-payments-'.$id.'.pdf');

        return $this->sendResponse($data, 'pdf retrieved Successfully');
    }

    public function importCustomers(Request $request)
    {
        Excel::import(new CustomerImport(), request()->file('file'));

        return $this->sendSuccess('Customers imported successfully');
    }
}
