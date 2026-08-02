<?php

namespace App\Jobs;

use App\Models\ElectronicInvoice;
use App\Models\Sale;
use App\Services\SriFirmaService;
use App\Services\SriSoapService;
use App\Services\SriXmlService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class EmitirFacturaJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public array $backoff = [10, 30];

    public function __construct(
        public int    $saleId,
        public string $tipoComprobante = ElectronicInvoice::FACTURA,
        public array  $motivos = [],           // solo para nota de débito
        public ?int   $facturaOrigenId = null  // solo para nota de débito
    ) {}

    public function handle(
        SriXmlService   $xmlService,
        SriFirmaService $firmaService,
        SriSoapService  $soapService
    ): void {
        $sale = Sale::with(['customer', 'saleItems.product', 'saleItems.sale'])
            ->find($this->saleId);

        if (!$sale) {
            Log::warning("EmitirFacturaJob: venta {$this->saleId} no encontrada.");
            return;
        }

        // Generar XML según tipo de comprobante
        try {
            $result = match ($this->tipoComprobante) {
                ElectronicInvoice::FACTURA     => $this->generarFactura($xmlService, $sale),
                ElectronicInvoice::NOTA_DEBITO => $this->generarNotaDebito($xmlService),
                default => throw new \RuntimeException(
                    "Tipo de comprobante no soportado: {$this->tipoComprobante}"
                ),
            };
        } catch (\Throwable $e) {
            Log::error("EmitirFacturaJob: error generando XML: " . $e->getMessage());
            return;
        }

        // Crear registro PENDIENTE
        $factura = ElectronicInvoice::create([
            'sale_id'          => $sale->id,
            'tipo_comprobante' => $this->tipoComprobante,
            'clave_acceso'     => $result['clave_acceso'],
            'secuencial'       => $result['secuencial'],
            'estado'           => ElectronicInvoice::PENDIENTE,
        ]);

        // Firmar
        try {
            $xmlFirmado = $firmaService->firmar($result['xml']);
        } catch (\Throwable $e) {
            Log::error("Error firmando comprobante {$factura->id}: " . $e->getMessage());
            $factura->update([
                'estado'       => ElectronicInvoice::NO_AUTORIZADA,
                'mensajes_sri' => [[
                    'identificador'        => 'FIRMA_ERROR',
                    'mensaje'              => 'Error al firmar el comprobante',
                    'informacionAdicional' => $e->getMessage(),
                    'tipo'                 => 'ERROR',
                ]],
            ]);
            return;
        }

        $factura->update(['xml_firmado' => $xmlFirmado, 'xml_firmado_at' => now()]);

        // Enviar al SRI
        $respuesta = $soapService->enviarComprobante($xmlFirmado);

        if ($respuesta['estado'] === 'ERROR_TEMPORAL_SRI') {
            $factura->update([
                'estado'       => ElectronicInvoice::ERROR_TEMPORAL_SRI,
                'mensajes_sri' => $respuesta['mensajes'],
            ]);
            Log::warning("Comprobante {$factura->id}: error temporal del SRI al enviar, se reintentará automáticamente en unos minutos.");
            ReenviarComprobanteJob::dispatch($factura->id)->delay(now()->addMinutes(5));
            return;
        }

        if ($respuesta['estado'] === 'DEVUELTA') {
            $factura->update([
                'estado'       => ElectronicInvoice::DEVUELTA,
                'mensajes_sri' => $respuesta['mensajes'],
            ]);
            Log::warning("Comprobante {$factura->id} DEVUELTO por el SRI.");
            return;
        }

        $factura->update(['estado' => ElectronicInvoice::RECIBIDA, 'enviado_sri_at' => now()]);
        AutorizarFacturaJob::dispatch($factura->id)->delay(now()->addSeconds(5));
    }

    // ─────────────────────────────────────────────
    // GENERADORES POR TIPO
    // ─────────────────────────────────────────────

    private function generarFactura(SriXmlService $xmlService, Sale $sale): array
    {
        // Verificar que no exista ya una factura para esta venta
        $existente = ElectronicInvoice::where('sale_id', $sale->id)
            ->where('tipo_comprobante', ElectronicInvoice::FACTURA)
            ->whereNotIn('estado', [
                ElectronicInvoice::DEVUELTA,
                ElectronicInvoice::NO_AUTORIZADA,
                ElectronicInvoice::ERROR_TEMPORAL_SRI,
            ])
            ->first();

        if ($existente) {
            throw new \RuntimeException(
                "La venta {$sale->id} ya tiene una factura electrónica activa."
            );
        }

        return $xmlService->generarXmlFactura($sale);
    }

    private function generarNotaDebito(SriXmlService $xmlService): array
    {
        if (!$this->facturaOrigenId) {
            throw new \RuntimeException(
                "Se requiere facturaOrigenId para emitir una nota de débito."
            );
        }

        if (empty($this->motivos)) {
            throw new \RuntimeException(
                "Se requieren motivos para emitir una nota de débito."
            );
        }

        $facturaOrigen = ElectronicInvoice::find($this->facturaOrigenId);

        if (!$facturaOrigen) {
            throw new \RuntimeException(
                "Factura origen {$this->facturaOrigenId} no encontrada."
            );
        }

        if (!$facturaOrigen->estaAutorizada()) {
            throw new \RuntimeException(
                "La factura origen debe estar autorizada para emitir una nota de débito."
            );
        }

        return $xmlService->generarXmlNotaDebito($facturaOrigen, $this->motivos);
    }

    public function failed(\Throwable $exception): void
    {
        Log::error("EmitirFacturaJob falló para venta {$this->saleId}: " . $exception->getMessage());
    }
}