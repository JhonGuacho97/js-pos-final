<?php

namespace App\Exports;

use App\Models\PurchaseReturn;
use App\Models\Warehouse;
use Maatwebsite\Excel\Concerns\FromView;

class ProductPurchaseReturnReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $storeId = currentStoreId();
        $productId = request()->get('product_id');

        $purchaseReturnsQuery = PurchaseReturn::whereHas('purchaseReturnItems', function ($q) use ($productId) {
            $q->where('product_id', '=', $productId);
        })->with(['purchaseReturnItems.product', 'supplier']);
        if ($storeId) {
            $purchaseReturnsQuery->whereIn('warehouse_id', Warehouse::where('store_id', $storeId)->active()->pluck('id'));
        }
        $purchaseReturns = $purchaseReturnsQuery->get();

        return view('excel.product-purchase-return-report-excel',
            ['purchaseReturns' => $purchaseReturns, 'productId' => $productId]);
    }
}
