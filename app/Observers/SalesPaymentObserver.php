<?php

namespace App\Observers;

use App\Models\SalesPayment;
use App\Services\CashControlService;

class SalesPaymentObserver
{
    public function __construct(private readonly CashControlService $cashControl) {}

    public function created(SalesPayment $payment): void
    {
        $this->cashControl->recordSalePayment($payment);
    }

    public function updated(SalesPayment $payment): void
    {
        if ($payment->wasChanged(['amount', 'payment_type'])) {
            $this->cashControl->replaceSalePaymentMovement($payment);
        }
    }

    public function deleted(SalesPayment $payment): void
    {
        $this->cashControl->removeSalePaymentMovement($payment);
    }
}
