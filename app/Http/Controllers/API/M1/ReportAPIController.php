<?php

namespace App\Http\Controllers\API\M1;

use App\Http\Controllers\AppBaseController;
use App\Models\Brand;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleReturn;
use App\Models\SalesPayment;
use Carbon\Carbon;

class ReportAPIController extends AppBaseController
{
    public function getTodaySalesOverallReport()
    {
        $data = [];
        $storeId = $this->currentStoreId();
        $today = Carbon::today('America/Guayaquil');
        // sale_items.created_at es un timestamp real en UTC -- whereDate()
        // sobre esa columna compara contra SU fecha en UTC, no en Ecuador,
        // así que hay que filtrar por el rango UTC equivalente al día local.
        $todayStartUtc = $today->copy()->utc();
        $todayEndUtc = $today->copy()->endOfDay()->utc();
        $salesDiscount = $this->scopeQueryToCurrentStore(Sale::where('date', $today))->sum('discount');
        $salesTax = $this->scopeQueryToCurrentStore(Sale::where('date', $today))->sum('tax_amount');
        $salesShippingAmount = $this->scopeQueryToCurrentStore(Sale::where('date', $today))->sum('shipping');
        $totalGrandTotalAmount = $this->scopeQueryToCurrentStore(Sale::where('date', $today))->sum('grand_total');

        $data['today_sales_cash_payment'] = $this->scopeSalesPaymentsToCurrentStore(SalesPayment::where('payment_date', $today)->where('payment_type',
            SalesPayment::CASH))->sum('amount');
        $data['today_sales_cheque_payment'] = $this->scopeSalesPaymentsToCurrentStore(SalesPayment::where('payment_date', $today)->where('payment_type',
            SalesPayment::CHEQUE))->sum('amount');
        $data['today_sales_bank_transfer_payment'] = $this->scopeSalesPaymentsToCurrentStore(SalesPayment::where('payment_date', $today)->where('payment_type',
            SalesPayment::BANK_TRANSFER))->sum('amount');
        $data['today_sales_other_payment'] = $this->scopeSalesPaymentsToCurrentStore(SalesPayment::where('payment_date', $today)->where('payment_type',
            SalesPayment::OTHER))->sum('amount');

        $data['today_sales_total_amount'] = $totalGrandTotalAmount;
        $data['today_sales_total_return_amount'] = $this->scopeQueryToCurrentStore(SaleReturn::where('date', $today))->sum('grand_total');
        $data['today_sales_payment_amount'] = $this->scopeSalesPaymentsToCurrentStore(SalesPayment::where('payment_date', $today))->sum('amount');

        $productsData = Product::leftJoin('sale_items', 'products.id', '=',
            'sale_items.product_id')
            ->whereBetween('sale_items.created_at', [$todayStartUtc, $todayEndUtc])
            ->when($storeId, function ($q) use ($storeId) {
                $q->where('products.store_id', $storeId);
            })
            ->selectRaw('products.*, COALESCE(sum(sale_items.sub_total),0) grand_total')
            ->selectRaw('products.*, COALESCE(sum(sale_items.quantity),0) total_quantity')
            ->groupBy('products.id')
            ->get();

        $productsSold = [];
        $data['all_grand_total_amount'] = 0;

        foreach ($productsData as $key => $product) {
            $productsSold[] = $product->prepareProductReport();
            $data['all_grand_total_amount'] = $data['all_grand_total_amount'] + $product->grand_total;
        }
        $data['today_total_products_sold'] = $productsSold;

        $data['today_brand_report'] = Brand::leftJoin('products', 'brands.id', '=',
            'products.brand_id')->leftJoin('sale_items', 'products.id', '=',
                'sale_items.product_id')
            ->whereBetween('sale_items.created_at', [$todayStartUtc, $todayEndUtc])
            ->when($storeId, function ($q) use ($storeId) {
                $q->where('brands.store_id', $storeId);
            })
            ->selectRaw('brands.*, COALESCE(sum(sale_items.sub_total),0) grand_total')
            ->selectRaw('brands.*, COALESCE(sum(sale_items.quantity),0) total_quantity')
            ->groupBy('brands.id')
            ->get();

        $data['all_tax_amount'] = $salesTax;
        $data['all_discount_amount'] = $salesDiscount;
        $data['all_shipping_amount'] = $salesShippingAmount;
        $data['all_grand_total_amount'] = $totalGrandTotalAmount;

        return $this->sendResponse($data, 'Today sales register overall report retrieved successfully');
    }
}
