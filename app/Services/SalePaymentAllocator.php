<?php

namespace App\Services;

use App\Models\SalesPayment;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class SalePaymentAllocator
{
    /**
     * Convierte montos entregados en montos realmente aplicados a la venta.
     * El excedente solo puede salir de efectivo porque representa vuelto.
     */
    public function allocate(array $payments, float $grandTotal): array
    {
        $totalTendered = collect($payments)->sum(fn ($payment) => (float) ($payment['amount'] ?? 0));
        $remainingChange = max(0, round($totalTendered - $grandTotal, 2));
        $allocated = [];

        foreach ($payments as $payment) {
            $tendered = round((float) ($payment['amount'] ?? 0), 2);
            $type = (int) ($payment['payment_type'] ?? 0);
            if ($tendered <= 0) {
                continue;
            }
            if (! in_array($type, [
                SalesPayment::CASH,
                SalesPayment::CHEQUE,
                SalesPayment::BANK_TRANSFER,
                SalesPayment::OTHER,
            ], true)) {
                throw new UnprocessableEntityHttpException('La forma de pago seleccionada no es válida.');
            }

            $applied = $tendered;
            if ($remainingChange > 0 && $type === SalesPayment::CASH) {
                $deduction = min($remainingChange, $applied);
                $applied = round($applied - $deduction, 2);
                $remainingChange = round($remainingChange - $deduction, 2);
            }

            if ($applied > 0) {
                $allocated[] = [
                    'payment_type' => $type,
                    'amount' => $applied,
                    'received_amount' => $tendered,
                ];
            }
        }

        if ($remainingChange > 0.009) {
            throw new UnprocessableEntityHttpException(
                'El monto entregado supera el total y el excedente no puede devolverse porque no corresponde a efectivo.'
            );
        }

        return $allocated;
    }
}
