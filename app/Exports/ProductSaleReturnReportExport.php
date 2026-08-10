<?php

namespace App\Exports;

use App\Models\SaleReturn;
use App\Models\Warehouse;
use Maatwebsite\Excel\Concerns\FromView;

class ProductSaleReturnReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $storeId = currentStoreId();
        $productId = request()->get('product_id');

        $saleReturnsQuery = SaleReturn::whereHas('saleReturnItems', function ($q) use ($productId) {
            $q->where('product_id', '=', $productId);
        })->with(['saleReturnItems.product', 'customer']);
        if ($storeId) {
            $saleReturnsQuery->whereIn('warehouse_id', Warehouse::where('store_id', $storeId)->pluck('id'));
        }
        $saleReturns = $saleReturnsQuery->get();

        return view('excel.product-sale-returns-report-excel',
            ['saleReturns' => $saleReturns, 'productId' => $productId]);
    }
}
