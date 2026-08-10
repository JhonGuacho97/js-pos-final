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

/**
 * Reenvía un comprobante que ya fue firmado y generado, sin volver a
 * generar clave de acceso ni secuencial -- a propósito, distinto de
 * "reintentar" un rechazo real (que sí regenera todo desde cero).
 *
 * Se usa específicamente para el caso de ERROR_TEMPORAL_SRI: como no
 * sabemos con certeza si el SRI llegó a procesar el envío anterior
 * antes de fallar internamente, reenviar el MISMO comprobante es más
 * seguro que generar uno nuevo -- si el SRI ya lo tenía guardado, el
 * peor caso es un "SECUENCIAL REGISTRADO", que nos confirma que sí
 * había funcionado.
 */
class ReenviarComprobanteJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 1; // el reintento en sí ya lo maneja este Job a mano, no Laravel

    private const MAX_REINTENTOS_AUTOMATICOS = 3;

    public function __construct(
        public int $electronicInvoiceId
    ) {
    }

    public function handle(SriSoapService $soapService): void
    {
        $factura = ElectronicInvoice::find($this->electronicInvoiceId);

        if (!$factura) {
            Log::warning("ReenviarComprobanteJob: factura {$this->electronicInvoiceId} no encontrada.");
            return;
        }

        // Si ya cambió de estado por otro camino (por ejemplo, un
        // reintento manual mientras este job esperaba su turno), no
        // hacer nada -- evita pisarse.
        if (!$factura->esErrorTemporalSri()) {
            return;
        }

        if (empty($factura->xml_firmado)) {
            Log::error("ReenviarComprobanteJob: factura {$factura->id} no tiene xml_firmado, no se puede reenviar.");
            return;
        }

        $factura->increment('intentos');

        $respuesta = $soapService->enviarComprobante($factura->xml_firmado, $factura->store_id);

        Log::info("ReenviarComprobanteJob intento {$factura->intentos} para clave {$factura->clave_acceso}: " . $respuesta['estado']);

        if ($respuesta['estado'] === 'ERROR_TEMPORAL_SRI') {
            if ($factura->intentos >= self::MAX_REINTENTOS_AUTOMATICOS) {
                // Se agotaron los reintentos automáticos -- queda en
                // ERROR_TEMPORAL_SRI, disponible para reintento manual
                // desde Documentos Electrónicos.
                $factura->update(['mensajes_sri' => $respuesta['mensajes']]);
                Log::warning("Comprobante {$factura->id}: agotados los reintentos automáticos por error temporal del SRI, queda disponible para reintento manual.");
                return;
            }

            $factura->update(['mensajes_sri' => $respuesta['mensajes']]);
            self::dispatch($factura->id)->delay(now()->addMinutes(5 * $factura->intentos));
            return;
        }

        if ($respuesta['estado'] === 'DEVUELTA') {
            \App\Services\CreditNoteStockRollbackService::revertirSiAplica($factura);
            $factura->update([
                'estado'       => ElectronicInvoice::DEVUELTA,
                'mensajes_sri' => $respuesta['mensajes'],
            ]);
            Log::warning("Comprobante {$factura->id} DEVUELTO por el SRI tras reenviar.");
            return;
        }

        // 'RECIBIDA' -- el reenvío sí funcionó esta vez
        $factura->update(['estado' => ElectronicInvoice::RECIBIDA, 'enviado_sri_at' => now()]);
        AutorizarFacturaJob::dispatch($factura->id)->delay(now()->addSeconds(5));
    }
}
