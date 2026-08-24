<?php

namespace App\Exports;

use App\Models\Purchase;
use App\Models\Warehouse;
use Maatwebsite\Excel\Concerns\FromView;

class ProductPurchaseReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $storeId = currentStoreId();
        $productId = request()->get('product_id');

        $purchasesQuery = Purchase::whereHas('purchaseItems', function ($q) use ($productId) {
            $q->where('product_id', '=', $productId);
        })->with(['purchaseItems.product', 'supplier']);
        if ($storeId) {
            $purchasesQuery->whereIn('warehouse_id', Warehouse::where('store_id', $storeId)->active()->pluck('id'));
        }
        $purchases = $purchasesQuery->get();

        return view('excel.product-purchases-report-excel', ['purchases' => $purchases, 'productId' => $productId]);
    }
}
