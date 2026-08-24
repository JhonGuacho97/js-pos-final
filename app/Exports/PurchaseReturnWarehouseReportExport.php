<?php

namespace App\Exports;

use App\Models\PurchaseReturn;
use App\Models\Warehouse;
use Maatwebsite\Excel\Concerns\FromView;

class PurchaseReturnWarehouseReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $storeId = currentStoreId();
        $warehouseId = request()->get('warehouse_id');
        $supplierId = request()->get('supplier_id');
        if (isset($warehouseId) && $warehouseId != 'null') {
            $purchaseReturnsQuery = PurchaseReturn::whereWarehouseId($warehouseId)->with('warehouse', 'supplier');
        } elseif (isset($supplierId) && $supplierId != 'null') {
            $purchaseReturnsQuery = PurchaseReturn::whereSupplierId($supplierId)->with('warehouse', 'supplier');
        } else {
            $purchaseReturnsQuery = PurchaseReturn::with('warehouse', 'supplier');
        }
        if ($storeId) {
            $purchaseReturnsQuery->whereIn('warehouse_id', Warehouse::where('store_id', $storeId)->active()->pluck('id'));
        }
        $purchaseReturns = $purchaseReturnsQuery->get();

        return view('excel.purchase-return-report-excel', ['purchaseReturns' => $purchaseReturns]);
    }
}
