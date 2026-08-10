<?php

namespace App\Exports;

use App\Models\Sale;
use App\Models\Warehouse;
use Maatwebsite\Excel\Concerns\FromView;

class ProductSaleReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $storeId = currentStoreId();
        $productId = request()->get('product_id');

        $salesQuery = Sale::whereHas('saleItems', function ($q) use ($productId) {
            $q->where('product_id', '=', $productId);
        })->with(['saleItems.product', 'customer']);
        if ($storeId) {
            $salesQuery->whereIn('warehouse_id', Warehouse::where('store_id', $storeId)->pluck('id'));
        }
        $sales = $salesQuery->get();

        return view('excel.product-sale-report-excel', ['sales' => $sales, 'productId' => $productId]);
    }
}
