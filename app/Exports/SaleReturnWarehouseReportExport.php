<?php

namespace App\Exports;

use App\Models\SaleReturn;
use App\Models\Warehouse;
use Maatwebsite\Excel\Concerns\FromView;

class SaleReturnWarehouseReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $storeId = currentStoreId();
        $warehouseId = request()->get('warehouse_id');
        if (isset($warehouseId) && $warehouseId != 'null') {
            $saleReturnsQuery = SaleReturn::whereWarehouseId($warehouseId)->with('warehouse', 'customer');
        } else {
            $saleReturnsQuery = SaleReturn::with('warehouse', 'customer');
        }
        if ($storeId) {
            $saleReturnsQuery->whereIn('warehouse_id', Warehouse::where('store_id', $storeId)->pluck('id'));
        }
        $saleReturns = $saleReturnsQuery->get();

        return view('excel.sale-return-report-excel', ['saleReturns' => $saleReturns]);
    }
}
