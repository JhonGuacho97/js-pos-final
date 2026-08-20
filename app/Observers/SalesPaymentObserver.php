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
}
