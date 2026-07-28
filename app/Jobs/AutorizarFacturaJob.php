<?php

namespace App\Jobs;

use App\Models\ElectronicInvoice;
use App\Services\SriSoapService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class AutorizarFacturaJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Backoff en segundos para cada reintento sucesivo.
     * Índice 0 = después del intento 1, índice 1 = después del intento 2, etc.
     */
    private const BACKOFF_SEGUNDOS = [5, 15, 30, 60, 120];

    public int $tries = 6; // 1 intento inicial + 5 reintentos

    public function __construct(
        public int $electronicInvoiceId
    ) {}

    /**
     * Backoff dinámico — Laravel llama a este método automáticamente
     * para decidir cuánto esperar antes del siguiente intento.
     */
    public function backoff(): array
    {
        return self::BACKOFF_SEGUNDOS;
    }

    public function handle(SriSoapService $soapService): void
    {
        $factura = ElectronicInvoice::find($this->electronicInvoiceId);

        if (!$factura) {
            Log::warning("AutorizarFacturaJob: factura {$this->electronicInvoiceId} no encontrada.");
            return;
        }

        // Si ya está en un estado final, no hacer nada (evita carreras)
        if (in_array($factura->estado, [
            ElectronicInvoice::AUTORIZADA,
            ElectronicInvoice::NO_AUTORIZADA,
        ])) {
            return;
        }

        $factura->increment('intentos');

        $resultado = $soapService->consultarAutorizacion($factura->clave_acceso);

        Log::info("AutorizarFacturaJob intento {$factura->intentos} para clave {$factura->clave_acceso}: " . $resultado['estado']);

        switch ($resultado['estado']) {
            case ElectronicInvoice::AUTORIZADA:
                $factura->update([
                    'estado'              => ElectronicInvoice::AUTORIZADA,
                    'numero_autorizacion' => $resultado['numero_autorizacion'] ?: $factura->clave_acceso,
                    'fecha_autorizacion'  => $resultado['fecha_autorizacion']
                        ? \Carbon\Carbon::parse($resultado['fecha_autorizacion'])
                        : now(),
                    'xml_autorizado'      => $resultado['xml_autorizado'],
                    'mensajes_sri'        => $resultado['mensajes'],
                ]);

                // Envía el correo al cliente con el RIDE (PDF) y el XML
                // autorizado adjuntos -- respeta la plantilla y el
                // estado activo/inactivo configurados en Documentos
                // Electrónicos, igual que ya hace el correo de venta.
                SendRideEmailJob::dispatch($factura->id);
                break;

            case ElectronicInvoice::NO_AUTORIZADA:
                $factura->update([
                    'estado'       => ElectronicInvoice::NO_AUTORIZADA,
                    'mensajes_sri' => $resultado['mensajes'],
                ]);
                break;

            case 'EN_PROCESO':
            default:
                // Si se acabaron los intentos, marcar como no autorizada
                // con un mensaje explicativo, en vez de dejarla pendiente para siempre.
                if ($factura->intentos >= $this->tries) {
                    $factura->update([
                        'estado'       => ElectronicInvoice::NO_AUTORIZADA,
                        'mensajes_sri' => [[
                            'identificador'        => 'TIMEOUT',
                            'mensaje'              => 'Tiempo de espera agotado',
                            'informacionAdicional' => 'El SRI no autorizó el comprobante después de ' . $this->tries . ' intentos.',
                            'tipo'                 => 'ERROR',
                        ]],
                    ]);
                    return;
                }

                // Lanzar excepción para que Laravel reintente con el backoff configurado
                throw new \Exception("Comprobante {$factura->clave_acceso} aún EN_PROCESO, reintentando...");
        }
    }

    /**
     * Se ejecuta cuando el job falla definitivamente (agotó $tries).
     */
    public function failed(\Throwable $exception): void
    {
        $factura = ElectronicInvoice::find($this->electronicInvoiceId);

        if ($factura && $factura->estaPendiente()) {
            $factura->update([
                'estado'       => ElectronicInvoice::NO_AUTORIZADA,
                'mensajes_sri' => [[
                    'identificador'        => 'JOB_FAILED',
                    'mensaje'              => 'Error al procesar autorización',
                    'informacionAdicional' => $exception->getMessage(),
                    'tipo'                 => 'ERROR',
                ]],
            ]);
        }

        Log::error("AutorizarFacturaJob falló definitivamente: " . $exception->getMessage());
    }
}