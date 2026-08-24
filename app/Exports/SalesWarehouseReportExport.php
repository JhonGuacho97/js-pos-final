<?php

namespace App\Exports;

use App\Models\Sale;
use App\Models\Warehouse;
use Maatwebsite\Excel\Concerns\FromView;

class SalesWarehouseReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $storeId = currentStoreId();
        $warehouseId = request()->get('warehouse_id');
        if (isset($warehouseId) && $warehouseId != 'null') {
            $salesQuery = Sale::whereWarehouseId($warehouseId)->with('warehouse', 'customer');
        } else {
            $salesQuery = Sale::with('warehouse', 'customer');
        }
        if ($storeId) {
            $salesQuery->whereIn('warehouse_id', Warehouse::where('store_id', $storeId)->active()->pluck('id'));
        }
        $sales = $salesQuery->get();

        return view('excel.sale-report-excel', ['sales' => $sales]);
    }
}
