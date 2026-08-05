<?php

namespace App\Services;

use App\Models\CreditNote;
use App\Models\ElectronicInvoice;
use App\Models\ManageStock;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Cuando una Nota de Crédito por devolución se crea, el stock se ajusta
 * de inmediato (el producto ya volvió físicamente). Pero si el SRI
 * termina rechazando ese comprobante (NO_AUTORIZADA/DEVUELTA), el
 * documento nunca llegó a ser válido -- y como la validación de
 * cantidad disponible ya excluye esos estados rechazados al sumar "ya
 * acreditado", dejar el stock sin revertir permitiría que una nota
 * corregida posterior vuelva a ajustarlo, duplicando el conteo.
 */
class CreditNoteStockRollbackService
{
    public static function revertirSiAplica(ElectronicInvoice $factura): void
    {
        if ($factura->tipo_comprobante !== ElectronicInvoice::NOTA_CREDITO || !$factura->credit_note_id) {
            return;
        }

        // Si el estado ya estaba en un rechazo definitivo antes de esta
        // llamada, ya se revirtió (o nunca se ajustó) -- no revertir
        // dos veces.
        if (in_array($factura->getOriginal('estado'), [
            ElectronicInvoice::NO_AUTORIZADA,
            ElectronicInvoice::DEVUELTA,
        ])) {
            return;
        }

        $creditNote = CreditNote::with('creditNoteItems')->find($factura->credit_note_id);

        if (!$creditNote || !in_array($creditNote->concepto, CreditNote::CONCEPTOS_QUE_TOCAN_STOCK) || !$creditNote->warehouse_id) {
            return;
        }

        DB::transaction(function () use ($creditNote) {
            foreach ($creditNote->creditNoteItems as $item) {
                $stock = ManageStock::where('warehouse_id', $creditNote->warehouse_id)
                    ->where('product_id', $item->product_id)
                    ->first();

                if ($stock) {
                    $stock->update(['quantity' => max(0, $stock->quantity - $item->quantity)]);
                }
            }
        });

        Log::info("CreditNoteStockRollbackService: revertido el stock de la nota de crédito {$creditNote->id} por rechazo del SRI.");
    }
}
