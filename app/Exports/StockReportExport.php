<?php

namespace App\Exports;

use App\Models\ManageStock;
use App\Models\Warehouse;
use Maatwebsite\Excel\Concerns\FromView;

class StockReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $storeId = currentStoreId();
        $warehouseId = request()->get('warehouse_id');

        $stocksQuery = ManageStock::whereWarehouseId($warehouseId)->with('product', 'warehouse');
        if ($storeId) {
            $stocksQuery->whereIn('warehouse_id', Warehouse::where('store_id', $storeId)->pluck('id'));
        }
        $stocks = $stocksQuery->get();

        return view('excel.stock-report-excel', ['stocks' => $stocks]);
    }
}
