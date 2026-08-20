<?php

namespace App\Observers;

use App\Models\SaleReturn;
use App\Services\CashControlService;

class SaleReturnObserver
{
    public function created(SaleReturn $saleReturn): void
    {
        if ($saleReturn->reference_code) {
            app(CashControlService::class)->recordSaleReturn($saleReturn);
        }
    }

    public function updated(SaleReturn $saleReturn): void
    {
        if ($saleReturn->reference_code && ! $saleReturn->cash_movement_id) {
            app(CashControlService::class)->recordSaleReturn($saleReturn);
        }
    }
}
