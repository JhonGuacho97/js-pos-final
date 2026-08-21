<?php

namespace App\Services;

use App\Jobs\EmitirFacturaJob;
use App\Models\ElectronicInvoice;
use App\Models\Sale;
use Illuminate\Support\Facades\Log;

class ElectronicInvoiceRequestService
{
    public function request(Sale $sale, ?string $documentType): bool
    {
        if ($documentType !== ElectronicInvoice::FACTURA) {
            return false;
        }

        $claimed = Sale::whereKey($sale->id)
            ->whereNull('electronic_invoice_requested_at')
            ->update([
                'electronic_invoice_requested_type' => $documentType,
                'electronic_invoice_requested_at' => now(),
            ]);

        if (! $claimed) {
            return false;
        }

        try {
            EmitirFacturaJob::dispatch($sale->id, $documentType);
        } catch (\Throwable $exception) {
            Sale::whereKey($sale->id)->update([
                'electronic_invoice_requested_type' => null,
                'electronic_invoice_requested_at' => null,
            ]);
            Log::error("No se pudo encolar la factura de la venta {$sale->id}: {$exception->getMessage()}");

            return false;
        }

        return true;
    }
}
