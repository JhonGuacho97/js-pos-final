<?php

namespace App\Exports;

use App\Models\Purchase;
use App\Models\Warehouse;
use Maatwebsite\Excel\Concerns\FromView;

class PurchasesWarehouseReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $storeId = currentStoreId();
        $warehouseId = request()->get('warehouse_id');
        $supplierId = request()->get('supplier_id');
        if (isset($warehouseId) && $warehouseId != 'null') {
            $purchasesQuery = Purchase::whereWarehouseId($warehouseId)->with('warehouse', 'supplier');
        } elseif (isset($supplierId) && $supplierId != 'null') {
            $purchasesQuery = Purchase::whereSupplierId($supplierId)->with('warehouse', 'supplier');
        } else {
            $purchasesQuery = Purchase::with('warehouse', 'supplier');
        }
        if ($storeId) {
            $purchasesQuery->whereIn('warehouse_id', Warehouse::where('store_id', $storeId)->active()->pluck('id'));
        }
        $purchases = $purchasesQuery->get();

        return view('excel.purchase-report-excel', ['purchases' => $purchases]);
    }
}
