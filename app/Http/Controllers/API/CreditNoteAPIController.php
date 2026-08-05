<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Jobs\EmitirFacturaJob;
use App\Models\CreditNote;
use App\Models\ElectronicInvoice;
use App\Repositories\CreditNoteRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CreditNoteAPIController extends AppBaseController
{
    private CreditNoteRepository $creditNoteRepository;

    public function __construct(CreditNoteRepository $creditNoteRepository)
    {
        $this->creditNoteRepository = $creditNoteRepository;
    }

    public function index(Request $request): JsonResponse
    {
        $perPage = getPageSize($request);
        $search = $request->get('search');

        $query = CreditNote::with(['customer', 'sale', 'category'])->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('reference_code', 'like', "%{$search}%")
                    ->orWhere('numero_comprobante_modificado', 'like', "%{$search}%")
                    ->orWhere('motivo', 'like', "%{$search}%");
            });
        }

        $creditNotes = $query->paginate($perPage, ['*'], 'page', (int) $request->input('page', 1));

        $creditNotes->getCollection()->transform(fn (CreditNote $cn) => $cn->prepareAttributes() + ['id' => $cn->id]);

        return response()->json(['success' => true, 'data' => $creditNotes]);
    }

    public function show(CreditNote $creditNote): JsonResponse
    {
        $creditNote->load(['customer', 'sale', 'warehouse', 'category', 'creditNoteItems.product', 'electronicInvoice']);

        $ei = $creditNote->electronicInvoice;

        return response()->json([
            'success' => true,
            'data' => $creditNote->prepareAttributes() + [
                'id' => $creditNote->id,
                'electronic_invoice_estado' => $ei?->estado,
                'electronic_invoice_mensajes' => $ei?->mensajes_sri,
                'electronic_invoice_numero_autorizacion' => $ei?->numero_autorizacion,
                'electronic_invoice_id' => $ei?->id,
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'date' => 'required',
            'sale_id' => 'required|exists:sales,id',
            'customer_id' => 'required|exists:customers,id',
            'concepto' => 'required|string',
            'generar_como' => 'required|string',
            'motivo' => 'required|string',
            'credit_note_items' => 'required|array|min:1',
            'credit_note_items.*.product_id' => 'required|exists:products,id',
            'credit_note_items.*.quantity' => 'required|numeric|min:0.01',
        ]);

        $creditNote = $this->creditNoteRepository->storeCreditNote($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Nota de crédito creada correctamente.',
            'data' => $creditNote->prepareAttributes() + ['id' => $creditNote->id],
        ], 201);
    }

    /**
     * Dispara la emisión electrónica de la nota de crédito ante el SRI
     * -- reutiliza EmitirFacturaJob (mismo firmado, envío, logs y
     * clasificación de errores que ya usa Factura/Nota de Débito).
     */
    public function emitir(CreditNote $creditNote): JsonResponse
    {
        $existente = ElectronicInvoice::where('credit_note_id', $creditNote->id)
            ->whereNotIn('estado', [
                ElectronicInvoice::DEVUELTA,
                ElectronicInvoice::NO_AUTORIZADA,
                ElectronicInvoice::ERROR_TEMPORAL_SRI,
            ])
            ->first();

        if ($existente) {
            return response()->json([
                'success' => false,
                'message' => 'Esta nota de crédito ya tiene un comprobante electrónico activo.',
            ], 422);
        }

        EmitirFacturaJob::dispatch(
            $creditNote->sale_id,
            ElectronicInvoice::NOTA_CREDITO,
            [],
            null,
            $creditNote->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Emisión en proceso. El comprobante se generará en unos segundos.',
        ]);
    }

    /**
     * Facturas de un cliente puntual, para el modal "Listado de
     * Comprobante" que se abre al presionar el botón de buscar.
     */
    public function facturasDeCliente(Request $request, int $customer): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $page = (int) $request->input('page', 1);
        $search = (string) $request->get('search', '');

        $resultado = $this->creditNoteRepository->facturasDeCliente($customer, $perPage, $page, $search);

        return response()->json(['success' => true, 'data' => $resultado]);
    }

    /**
     * Busca una factura por número de comprobante o código interno,
     * para autocompletar el cliente y el saldo al armar la nota nueva.
     */
    public function buscarFactura(Request $request): JsonResponse
    {
        $request->validate(['busqueda' => 'required|string']);

        $resultado = $this->creditNoteRepository->buscarFactura($request->get('busqueda'));

        if (!$resultado) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontró ninguna factura con ese número.',
            ], 404);
        }

        return response()->json(['success' => true, 'data' => $resultado]);
    }
}
