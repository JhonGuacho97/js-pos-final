<?php

namespace App\Exports;

use App\Models\Product;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromView;

class TopSellingProductReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $storeId = currentStoreId();
        if (request()->get('start_date') && request()->get('start_date') && request()->get('start_date') != 'null' && request()->get('start_date') != 'null') {
            // El rango lo elige el usuario en su calendario local (Ecuador),
            // pero sale_items.created_at se guarda en UTC real -- convertir
            // antes de comparar, si no el filtro queda corrido hasta 5 horas.
            $startDate = Carbon::parse(request()->get('start_date'), 'America/Guayaquil')->startOfDay()->utc()->toDateTimeString();
            $endDate = Carbon::parse(request()->get('end_date'), 'America/Guayaquil')->endOfDay()->utc()->toDateTimeString();
            $topSelling = Product::leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
                ->where('sale_items.created_at', '>=', $startDate)
                ->where('sale_items.created_at', '<=', $endDate)
                ->when($storeId, function ($q) use ($storeId) {
                    $q->where('products.store_id', $storeId);
                })
                ->selectRaw('products.*, COALESCE(sum(sale_items.sub_total),0) grand_total')
                ->selectRaw('products.*, COALESCE(sum(sale_items.quantity),0) total_quantity')
                ->groupBy('products.id')
                ->orderBy('total_quantity', 'desc')
                ->latest()
                ->take(10)
                ->get();
        } else {
            $topSelling = Product::leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
                ->when($storeId, function ($q) use ($storeId) {
                    $q->where('products.store_id', $storeId);
                })
                ->selectRaw('products.*, COALESCE(sum(sale_items.sub_total),0) grand_total')
                ->selectRaw('products.*, COALESCE(sum(sale_items.quantity),0) total_quantity')
                ->groupBy('products.id')
                ->orderBy('total_quantity', 'desc')
                ->latest()
                ->take(10)
                ->get();
        }

        $topSellingProducts = [];
        foreach ($topSelling as $topSelling) {
            if ($topSelling->total_quantity != 0) {
                $topSellingProducts[] = $topSelling->prepareTopSellingReport();
            }
        }

        return view('excel.top-selling-product-report-excel', ['topSellingProducts' => $topSellingProducts]);
    }
}
