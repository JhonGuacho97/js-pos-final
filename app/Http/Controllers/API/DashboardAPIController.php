<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Resources\SaleCollection;
use App\Http\Resources\SaleResource;
use App\Models\BaseUnit;
use App\Models\Customer;
use App\Models\Expense;
use App\Models\ManageStock;
use App\Models\POSRegister;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseReturn;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SaleReturn;
use App\Models\SalesPayment;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardAPIController extends AppBaseController
{
    public function getPurchaseSalesCounts(): JsonResponse
    {
        $data = [];
        // ✅ Usa la fecha actual de Guayaquil explícitamente
        $today = Carbon::now('America/Guayaquil')->toDateString();

        $data['today_sales'] = (float) $this->scopeQueryToCurrentStore(Sale::whereDate('date', $today))->sum('grand_total');
        $data['today_purchases'] = (float) $this->scopeQueryToCurrentStore(Purchase::whereDate('date', $today))->sum('grand_total');
        $data['today_sale_return'] = (float) $this->scopeQueryToCurrentStore(SaleReturn::whereDate('date', $today))->sum('grand_total');
        $data['today_purchase_return'] = (float) $this->scopeQueryToCurrentStore(PurchaseReturn::whereDate('date', $today))->sum('grand_total');
        $data['today_sales_received_count'] = (float) $this->scopeSalesPaymentsToCurrentStore(SalesPayment::whereDate('payment_date', $today))->sum('amount');
        $data['today_expense_count'] = (float) $this->scopeQueryToCurrentStore(Expense::whereDate('date', $today))->sum('amount');

        return $this->sendResponse($data, 'Sales Purchase Count Retrieved Successfully');
    }

    /**
     * Panorama de "hoy" para la cabecera + tarjeta de ventas + fila de
     * operaciones del dashboard nuevo: totales de hoy y su delta contra
     * el promedio diario de los 7 días anteriores (mismo baseline para
     * las 4 métricas, para no mezclar criterios distintos entre
     * tarjetas). "Cajeros activos" son cajas (pos_register) sin cerrar
     * ahora mismo -- no hay columna de última actividad en este sistema,
     * así que es "caja abierta", no presencia real.
     *
     * sales/sale_returns.date son columnas DATE puras, ya en calendario
     * de Guayaquil -- se comparan directo, sin conversión UTC (ver
     * getPurchaseSalesCounts() arriba, mismo criterio). customers.created_at
     * SÍ es timestamp UTC real y necesita el límite de día convertido,
     * igual que POSRegisterAPIController::getRegisterDetails().
     */
    public function getTodayOverview(): JsonResponse
    {
        $today = Carbon::now('America/Guayaquil')->toDateString();
        $sevenDaysAgo = Carbon::now('America/Guayaquil')->subDays(7)->toDateString();
        $yesterday = Carbon::now('America/Guayaquil')->subDay()->toDateString();

        $todaySaleIds = $this->scopeQueryToCurrentStore(Sale::whereDate('date', $today))->pluck('id');
        $totalSales = (float) Sale::whereIn('id', $todaySaleIds)->sum('grand_total');
        $transactionCount = $todaySaleIds->count();
        $itemsSold = (float) SaleItem::whereIn('sale_id', $todaySaleIds)->sum('quantity');
        $avgBasket = $transactionCount > 0 ? round($totalSales / $transactionCount, 2) : 0.0;

        $refundsAmount = (float) $this->scopeQueryToCurrentStore(SaleReturn::whereDate('date', $today))->sum('grand_total');

        $startOfTodayUtc = Carbon::now('America/Guayaquil')->startOfDay()->utc()->toDateTimeString();
        $endOfTodayUtc = Carbon::now('America/Guayaquil')->endOfDay()->utc()->toDateTimeString();
        $newCustomersCount = Customer::whereBetween('created_at', [$startOfTodayUtc, $endOfTodayUtc])
            ->when($this->currentStoreId(), function ($q, $storeId) {
                $q->where('store_id', $storeId);
            })
            ->count();

        // Promedio diario de los últimos 7 días ANTES de hoy (no incluye
        // hoy), mismo criterio para las 4 métricas con delta.
        $last7DaysSales = (float) $this->scopeQueryToCurrentStore(
            Sale::whereBetween('date', [$sevenDaysAgo, $yesterday])
        )->sum('grand_total');
        $last7DaysTransactionCount = (int) $this->scopeQueryToCurrentStore(
            Sale::whereBetween('date', [$sevenDaysAgo, $yesterday])
        )->count();
        $last7DaysRefunds = (float) $this->scopeQueryToCurrentStore(
            SaleReturn::whereBetween('date', [$sevenDaysAgo, $yesterday])
        )->sum('grand_total');
        $startOfWindowUtc = Carbon::now('America/Guayaquil')->subDays(7)->startOfDay()->utc()->toDateTimeString();
        $endOfWindowUtc = Carbon::now('America/Guayaquil')->subDay()->endOfDay()->utc()->toDateTimeString();
        $last7DaysNewCustomers = Customer::whereBetween('created_at', [$startOfWindowUtc, $endOfWindowUtc])
            ->when($this->currentStoreId(), function ($q, $storeId) {
                $q->where('store_id', $storeId);
            })
            ->count();

        $avgDailySales = $last7DaysSales / 7;
        $avgDailyTransactions = $last7DaysTransactionCount / 7;
        $avgDailyRefunds = $last7DaysRefunds / 7;
        $avgDailyNewCustomers = $last7DaysNewCustomers / 7;

        $percentVsAvg = function ($today, $avg) {
            if ($avg <= 0) {
                return $today > 0 ? 100.0 : 0.0;
            }

            return round((($today - $avg) / $avg) * 100, 1);
        };

        $activeCashiersCount = POSRegister::whereNull('closed_at')
            ->when($this->currentStoreId(), function ($q, $storeId) {
                $q->whereHas('warehouse', function ($qw) use ($storeId) {
                    $qw->where('store_id', $storeId);
                });
            })
            ->distinct('user_id')
            ->count('user_id');

        $lowStockCount = ManageStock::where('alert', true)
            ->when($this->currentStoreId(), function ($q, $storeId) {
                $q->whereHas('warehouse', function ($qw) use ($storeId) {
                    $qw->where('store_id', $storeId);
                });
            })
            ->count();

        $data = [
            'total_sales' => $totalSales,
            'total_sales_vs_avg_percent' => $percentVsAvg($totalSales, $avgDailySales),
            'transaction_count' => $transactionCount,
            'transaction_count_vs_avg_percent' => $percentVsAvg($transactionCount, $avgDailyTransactions),
            'avg_basket' => $avgBasket,
            'items_sold' => $itemsSold,
            'refunds_amount' => $refundsAmount,
            'refunds_vs_avg_percent' => $percentVsAvg($refundsAmount, $avgDailyRefunds),
            'new_customers_count' => $newCustomersCount,
            'new_customers_vs_avg_percent' => $percentVsAvg($newCustomersCount, $avgDailyNewCustomers),
            'active_cashiers_count' => $activeCashiersCount,
            'low_stock_count' => $lowStockCount,
        ];

        return $this->sendResponse($data, 'Today overview retrieved successfully');
    }

    /**
     * Desglose por hora de HOY, para las sparklines de la tarjeta de
     * ventas y las 3 tarjetas laterales. created_at es timestamp UTC
     * real -- se limita el rango con el mismo patrón de
     * POSRegisterAPIController::getRegisterDetails(), y se agrupa por
     * hora EN PHP (Carbon::setTimezone()), no con HOUR()/CONVERT_TZ() en
     * SQL, porque nada más en esta app depende de que MySQL tenga
     * cargadas las tablas de zonas horarias.
     */
    public function getTodayHourlyBreakdown(): JsonResponse
    {
        $startOfTodayUtc = Carbon::now('America/Guayaquil')->startOfDay()->utc();
        $endOfTodayUtc = Carbon::now('America/Guayaquil')->endOfDay()->utc();
        $currentHour = (int) Carbon::now('America/Guayaquil')->format('H');

        $sales = $this->scopeQueryToCurrentStore(
            Sale::whereBetween('created_at', [$startOfTodayUtc, $endOfTodayUtc])
        )->get(['created_at', 'grand_total']);

        $refunds = $this->scopeQueryToCurrentStore(
            SaleReturn::whereBetween('created_at', [$startOfTodayUtc, $endOfTodayUtc])
        )->get(['created_at', 'grand_total']);

        $newCustomers = Customer::whereBetween('created_at', [$startOfTodayUtc, $endOfTodayUtc])
            ->when($this->currentStoreId(), function ($q, $storeId) {
                $q->where('store_id', $storeId);
            })
            ->get(['created_at']);

        $hours = range(0, $currentHour);
        $salesByHour = array_fill_keys($hours, 0.0);
        $transactionsByHour = array_fill_keys($hours, 0);
        $refundsByHour = array_fill_keys($hours, 0.0);
        $newCustomersByHour = array_fill_keys($hours, 0);

        foreach ($sales as $sale) {
            $hour = Carbon::parse($sale->created_at)->setTimezone('America/Guayaquil')->hour;
            if (array_key_exists($hour, $salesByHour)) {
                $salesByHour[$hour] += (float) $sale->grand_total;
                $transactionsByHour[$hour]++;
            }
        }

        foreach ($refunds as $refund) {
            $hour = Carbon::parse($refund->created_at)->setTimezone('America/Guayaquil')->hour;
            if (array_key_exists($hour, $refundsByHour)) {
                $refundsByHour[$hour] += (float) $refund->grand_total;
            }
        }

        foreach ($newCustomers as $customer) {
            $hour = Carbon::parse($customer->created_at)->setTimezone('America/Guayaquil')->hour;
            if (array_key_exists($hour, $newCustomersByHour)) {
                $newCustomersByHour[$hour]++;
            }
        }

        $data = [
            'hours' => array_map(fn ($h) => str_pad((string) $h, 2, '0', STR_PAD_LEFT), $hours),
            'sales' => array_values($salesByHour),
            'transactions' => array_values($transactionsByHour),
            'refunds' => array_values($refundsByHour),
            'new_customers' => array_values($newCustomersByHour),
        ];

        return $this->sendResponse($data, 'Today hourly breakdown retrieved successfully');
    }

    /**
     * Ventana actual de $period días (incluye hoy) vs. la ventana anterior
     * de igual longitud, alineadas por índice de día (día 1 de la actual
     * contra día 1 de la anterior) -- así se lee el gráfico "current vs
     * previous" de la sección Rendimiento. Generaliza getWeekSalePurchases()
     * (7 días fijos) a un período elegible, y agrega ticket promedio +
     * margen bruto con la MISMA fórmula que ReportAPIController::
     * getProfitLossReport() (costo por presentación vía effectiveCost()
     * cuando el item lo tiene, costo base si no).
     *
     * date es columna DATE pura ya en calendario de Guayaquil -- sin
     * conversión UTC, mismo criterio que el resto de este controlador.
     */
    public function getPerformanceNetSales(Request $request): JsonResponse
    {
        $days = match ($request->get('period')) {
            '7d' => 7,
            '30d' => 30,
            default => 14,
        };

        $today = Carbon::now('America/Guayaquil')->toDateString();
        $currentStart = Carbon::now('America/Guayaquil')->subDays($days - 1)->toDateString();
        $previousEnd = Carbon::now('America/Guayaquil')->subDays($days)->toDateString();
        $previousStart = Carbon::now('America/Guayaquil')->subDays(($days * 2) - 1)->toDateString();

        $currentWindow = $this->windowPerformanceMetrics($currentStart, $today);
        $previousWindow = $this->windowPerformanceMetrics($previousStart, $previousEnd);

        $currentDates = array_map(
            fn ($d) => $d->format('Y-m-d'),
            iterator_to_array(CarbonPeriod::create($currentStart, $today))
        );

        $percentChange = function ($current, $previous) {
            if ($previous <= 0) {
                return $current > 0 ? 100.0 : 0.0;
            }

            return round((($current - $previous) / $previous) * 100, 1);
        };

        $data = [
            'dates' => $currentDates,
            'net_sales_current' => array_values($currentWindow['daily_sales']),
            'net_sales_previous' => array_values($previousWindow['daily_sales']),
            'net_sales_total_current' => $currentWindow['net_sales'],
            'net_sales_total_previous' => $previousWindow['net_sales'],
            'net_sales_vs_previous_percent' => $percentChange($currentWindow['net_sales'], $previousWindow['net_sales']),
            'avg_basket_current' => $currentWindow['avg_basket'],
            'avg_basket_previous' => $previousWindow['avg_basket'],
            'avg_basket_vs_previous_percent' => $percentChange($currentWindow['avg_basket'], $previousWindow['avg_basket']),
            'gross_margin_percent_current' => $currentWindow['gross_margin_percent'],
            'gross_margin_percent_previous' => $previousWindow['gross_margin_percent'],
            'gross_margin_vs_previous_percent' => $percentChange($currentWindow['gross_margin_percent'], $previousWindow['gross_margin_percent']),
        ];

        return $this->sendResponse($data, 'Performance net sales retrieved successfully');
    }

    private function windowPerformanceMetrics(string $start, string $end): array
    {
        $sales = $this->scopeQueryToCurrentStore(Sale::whereBetween('date', [$start, $end]))
            ->get(['id', 'date', 'grand_total']);
        $transactionCount = $sales->count();

        // OJO: 'date' está en $casts como Carbon (ver Sale::$casts), así que
        // groupBy('date') agrupa por la representación en string COMPLETA
        // ("2026-08-14 00:00:00", con hora) y no por el día calendario --
        // hay que formatear explícito o el lookup de más abajo (keys
        // "Y-m-d") nunca hace match y todos los días salen en 0 aunque el
        // total general sí sea correcto.
        $salesByDate = $sales->groupBy(fn ($sale) => $sale->date->format('Y-m-d'))
            ->map(fn ($group) => (float) $group->sum('grand_total'));
        $returnsByDate = $this->scopeQueryToCurrentStore(SaleReturn::whereBetween('date', [$start, $end]))
            ->get(['date', 'grand_total'])
            ->groupBy(fn ($return) => $return->date->format('Y-m-d'))
            ->map(fn ($group) => (float) $group->sum('grand_total'));

        $dailySales = [];
        foreach (CarbonPeriod::create($start, $end) as $date) {
            $key = $date->format('Y-m-d');
            $dailySales[$key] = round($salesByDate->get($key, 0.0) - $returnsByDate->get($key, 0.0), 2);
        }

        $totalSales = (float) $salesByDate->sum();
        $totalReturns = (float) $returnsByDate->sum();
        $netSales = round($totalSales - $totalReturns, 2);
        $avgBasket = $transactionCount > 0 ? round($totalSales / $transactionCount, 2) : 0.0;

        $productCost = 0.0;
        if ($sales->isNotEmpty()) {
            $saleItems = SaleItem::whereIn('sale_id', $sales->pluck('id'))
                ->with('productPresentation', 'product')
                ->get();
            foreach ($saleItems as $saleItem) {
                if ($saleItem->product_presentation_id && $saleItem->productPresentation) {
                    $productCost += $saleItem->productPresentation->effectiveCost() * (float) $saleItem->presentation_quantity;
                } elseif ($saleItem->product) {
                    $productCost += $saleItem->product->product_cost * $saleItem->quantity;
                }
            }
        }

        $grossProfit = $netSales - $productCost;
        $grossMarginPercent = $netSales > 0 ? round(($grossProfit / $netSales) * 100, 1) : 0.0;

        return [
            'daily_sales' => $dailySales,
            'net_sales' => $netSales,
            'transaction_count' => $transactionCount,
            'avg_basket' => $avgBasket,
            'gross_margin_percent' => $grossMarginPercent,
        ];
    }

    /**
     * Mezcla de categorías (dona) para la sección Rendimiento: suma de
     * sale_items.sub_total agrupada por categoría del producto, para la
     * ventana actual de $period días (incluye hoy). Top 6 categorías +
     * "Otros" con el resto, igual que el gráfico de referencia.
     */
    public function getCategoryMix(Request $request): JsonResponse
    {
        $days = match ($request->get('period')) {
            '7d' => 7,
            '30d' => 30,
            default => 14,
        };

        $today = Carbon::now('America/Guayaquil')->toDateString();
        $start = Carbon::now('America/Guayaquil')->subDays($days - 1)->toDateString();

        $saleIds = $this->scopeQueryToCurrentStore(Sale::whereBetween('date', [$start, $today]))->pluck('id');

        $rows = SaleItem::whereIn('sale_id', $saleIds)
            ->join('products', 'products.id', '=', 'sale_items.product_id')
            ->leftJoin('product_categories', 'product_categories.id', '=', 'products.product_category_id')
            ->selectRaw('COALESCE(product_categories.name, ?) as category_name, SUM(sale_items.sub_total) as total', ['Sin categoría'])
            ->groupBy('category_name')
            ->orderByDesc('total')
            ->get();

        $top = $rows->take(6);
        $rest = $rows->slice(6);
        $restTotal = round((float) $rest->sum('total'), 2);

        $data = $top->map(fn ($row) => [
            'category_name' => $row->category_name,
            'total' => round((float) $row->total, 2),
        ])->values()->toArray();

        if ($restTotal > 0) {
            $data[] = [
                'category_name' => 'Otros',
                'total' => $restTotal,
            ];
        }

        $grandTotal = round((float) $rows->sum('total'), 2);

        return $this->sendResponse([
            'categories' => $data,
            'total' => $grandTotal,
        ], 'Category mix retrieved successfully');
    }

    public function getAllPurchaseSalesCounts(): JsonResponse
    {
        $data = [];

        $data['all_sales_count'] = (float) $this->scopeQueryToCurrentStore(Sale::query())->sum('grand_total');
        $data['all_sale_return_count'] = (float) $this->scopeQueryToCurrentStore(SaleReturn::query())->sum('grand_total');
        $data['all_purchase_return_count'] = (float) $this->scopeQueryToCurrentStore(PurchaseReturn::query())->sum('grand_total');
        $data['all_purchases_count'] = (float) $this->scopeQueryToCurrentStore(Purchase::query())->sum('grand_total') - $data['all_purchase_return_count'];
        $data['all_sales_received_count'] = (float) $this->scopeSalesPaymentsToCurrentStore(SalesPayment::query())->sum('amount');
        $data['all_expense_count'] = (float) $this->scopeQueryToCurrentStore(Expense::query())->sum('amount');

        return $this->sendResponse($data, 'All Sales Purchase and returns Count Retrieved Successfully');
    }

    /**
     * Eager-loading agregado para el feed de actividad del dashboard nuevo
     * (Insights de catálogo), que hace polling cada 30s -- sin esto cada
     * refetch dispara N+1 (customer/warehouse/user por cada venta). El
     * límite por defecto se queda en 5 (compatibilidad con quien ya
     * consuma esto), el feed de actividad pide más vía ?limit=.
     */
    public function getRecentSales(Request $request): SaleCollection
    {
        $limit = (int) $request->get('limit', 5);
        $recentSales = $this->scopeQueryToCurrentStore(Sale::query())
            ->with(['customer', 'warehouse', 'user'])
            ->latest()
            ->take($limit)
            ->get();
        SaleResource::usingWithCollection();

        return new SaleCollection($recentSales);
    }

    public function getTopSellingProducts(): JsonResponse
    {
        $month = Carbon::now('America/Guayaquil')->month;
        $year = Carbon::now('America/Guayaquil')->year;
        $topSellings = Product::leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
            ->whereMonth('sale_items.created_at', $month)
            ->whereYear('sale_items.created_at', $year)
            ->when($this->currentStoreId(), function ($q, $storeId) {
                $q->where('products.store_id', $storeId);
            })
            ->selectRaw('products.*, COALESCE(sum(sale_items.sub_total),0) grand_total')
            ->selectRaw('products.*, COALESCE(sum(sale_items.quantity),0) total_quantity')
            ->groupBy('products.id')
            ->orderBy('total_quantity', 'desc')
            ->latest()
            ->take(5)
            ->get();
        $data = [];
        foreach ($topSellings as $topSelling) {
            $data[] = $topSelling->prepareTopSelling();
        }

        return $this->sendResponse($data, 'Top Selling Products Retrieved Successfully');
    }

    public function getWeekSalePurchases(): JsonResponse
    {
        $count = 7;
        $days = [];
        $date = Carbon::tomorrow();
        for ($i = 0; $i < $count; $i++) {
            $days[] = $date->subDay()->format('Y-m-d');
        }
        $day['days'] = array_reverse($days);
        $sales = $this->scopeQueryToCurrentStore(Sale::whereBetween('date', [$day['days'][0], $day['days'][6]]))
            ->orderBy('date', 'desc')
            ->groupBy('date')
            ->get([
                DB::raw('DATE_FORMAT(date,"%Y-%m-%d") as week'),
                DB::raw('SUM(grand_total) as grand_total'),
            ])->keyBy('week');
        $period = CarbonPeriod::create($day['days'][0], $day['days'][6]);
        $data['dates'] = array_map(function ($datePeriod) {
            return $datePeriod->format('Y-m-d');
        }, iterator_to_array($period));

        $data['sales'] = array_map(function ($datePeriod) use ($sales) {
            $week = $datePeriod->format('Y-m-d');

            return $sales->has($week) ? $sales->get($week)->grand_total : 0;
        }, iterator_to_array($period));

        $purchases = $this->scopeQueryToCurrentStore(Purchase::whereBetween('date', [$day['days'][0], $day['days'][6]]))
            ->orderBy('date', 'desc')
            ->groupBy('date')
            ->get([
                DB::raw('DATE_FORMAT(date,"%Y-%m-%d") as week'),
                DB::raw('SUM(grand_total) as grand_total'),
            ])->keyBy('week');
        $data['purchases'] = array_map(function ($datePeriod) use ($purchases) {
            $week = $datePeriod->format('Y-m-d');

            return $purchases->has($week) ? $purchases->get($week)->grand_total : 0;
        }, iterator_to_array($period));

        return $this->sendResponse($data, 'Week of Sales Purchase Retrieved Successfully');
    }

    public function getYearlyTopSelling(): JsonResponse
    {
        $year = Carbon::now('America/Guayaquil')->year;
        $topSellings = Product::leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
            ->whereYear('sale_items.created_at', $year)
            ->when($this->currentStoreId(), function ($q, $storeId) {
                $q->where('products.store_id', $storeId);
            })
            ->selectRaw('products.*, COALESCE(sum(sale_items.sub_total),0) grand_total')
            ->selectRaw('products.*, COALESCE(sum(sale_items.quantity),0) total_quantity')
            ->groupBy('products.id')
            ->orderBy('total_quantity', 'desc')
            ->take(5)
            ->get();
        $data = [];
        foreach ($topSellings as $topSelling) {
            $variationLabel = optional($topSelling->variationType)->name;
            $data['name'][] = $variationLabel ? "{$topSelling->name} - {$variationLabel}" : $topSelling->name;
            $data['total_quantity'][] = $topSelling->total_quantity;
        }

        return $this->sendResponse($data, 'Yearly TopSelling Products Retrieved Successfully');
    }

    public function getTopCustomer(): JsonResponse
    {
        $month = Carbon::now('America/Guayaquil')->month;
        $topCustomers = Customer::leftJoin('sales', 'customers.id', '=', 'sales.customer_id')
            ->whereMonth('date', $month)
            ->when($this->currentStoreId(), function ($q, $storeId) {
                $q->where('customers.store_id', $storeId);
            })
            ->select('customers.*', DB::raw('sum(sales.grand_total) as grand_total'))
            ->groupBy('customers.id')
            ->orderBy('grand_total', 'desc')
            ->latest()
            ->take(5)
            ->get();
        $data = [];
        foreach ($topCustomers as $topCustomer) {
            $data['name'][] = $topCustomer->name;
            $data['grand_total'][] = (float) $topCustomer->grand_total;
        }

        return $this->sendResponse($data, 'Top Customers Retrieved Successfully');
    }

    /**
     * Top de productos vendidos para "Insights de catálogo", generalizando
     * getTopSellingProducts() (arriba, fijo al mes actual vía
     * sale_items.created_at) a un período elegible sobre sales.date --
     * mismo criterio sin conversión UTC que el resto del dashboard nuevo.
     * No se toca getTopSellingProducts() para no arriesgar a quien ya la
     * consuma.
     */
    public function getTopProducts(Request $request): JsonResponse
    {
        $limit = (int) $request->get('limit', 10);
        $today = Carbon::now('America/Guayaquil')->toDateString();
        $start = match ($request->get('period')) {
            '7d' => Carbon::now('America/Guayaquil')->subDays(6)->toDateString(),
            '14d' => Carbon::now('America/Guayaquil')->subDays(13)->toDateString(),
            '30d' => Carbon::now('America/Guayaquil')->subDays(29)->toDateString(),
            default => $today, // 'today'
        };

        $saleIds = $this->scopeQueryToCurrentStore(Sale::whereBetween('date', [$start, $today]))->pluck('id');

        $topSellings = Product::leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
            ->whereIn('sale_items.sale_id', $saleIds)
            ->when($this->currentStoreId(), function ($q, $storeId) {
                $q->where('products.store_id', $storeId);
            })
            ->selectRaw('products.*, COALESCE(sum(sale_items.sub_total),0) grand_total')
            ->selectRaw('COALESCE(sum(sale_items.quantity),0) total_quantity')
            ->groupBy('products.id')
            ->orderBy('total_quantity', 'desc')
            ->take($limit)
            ->get();

        $data = [];
        $rank = 1;
        foreach ($topSellings as $product) {
            $data[] = [
                'rank' => $rank++,
                'product_id' => $product->id,
                'code' => $product->code,
                'name' => $product->name,
                'variation_type_name' => optional($product->variationType)->name,
                'total_quantity' => (float) $product->total_quantity,
                'grand_total' => (float) $product->grand_total,
                'sale_unit' => isset($product->getSaleUnitName()['short_name']) ? $product->getSaleUnitName()['short_name'] : null,
                'image' => $product->image_url,
                'product_category_name' => optional($product->productCategory)->name,
            ];
        }

        return $this->sendResponse($data, 'Top products retrieved successfully');
    }

    /**
     * ?limit= opcional (default 10, sin cambio de comportamiento) + 'total'
     * en la respuesta -- para "Insights de catálogo" que quiere mostrar
     * "X productos con stock bajo" aunque solo liste unos pocos. 'total'
     * cuenta TODAS las alertas activas, no las limitadas por $limit.
     */
    public function stockAlerts(Request $request): JsonResponse
    {
        $limit = (int) $request->get('limit', 10);
        $baseQuery = ManageStock::where('alert', true)
            ->when($this->currentStoreId(), function ($q, $storeId) {
                $q->whereHas('warehouse', function ($qw) use ($storeId) {
                    $qw->where('store_id', $storeId);
                });
            });

        $total = (clone $baseQuery)->count();
        $manageStocks = (clone $baseQuery)->with('warehouse')->limit($limit)->latest()->get();

        $productResponse = [];
        foreach ($manageStocks as $stock) {
            $product = Product::where('id', $stock->product_id)->first();
            if (!empty($product)) {
                $productUnitName = BaseUnit::whereId($product->product_unit)->value('name');
                $stock['product_unit_name'] = $productUnitName;
                $product->setAttribute('stock', $stock);
                $product->setAttribute('variation_type_name', optional($product->variationType)->name);
                $productResponse[] = $product;
                $product = null;
                $stock = null;
            }
        }

        return $this->sendResponse(['items' => $productResponse, 'total' => $total], 'Stocks retrieved successfully');
    }

    /**
     * Ventas por hora y día de la semana, últimos 7 días (hoy incluido),
     * para el mapa de calor de "Insights". 'date' es columna DATE pura ya
     * en calendario de Guayaquil -- sin conversión UTC -- se usa para el
     * día de la semana; 'created_at' SÍ es timestamp UTC real y se
     * convierte a Guayaquil para la hora, mismo criterio que
     * getTodayHourlyBreakdown().
     */
    public function getSalesHeatmap(): JsonResponse
    {
        $today = Carbon::now('America/Guayaquil')->toDateString();
        $start = Carbon::now('America/Guayaquil')->subDays(6)->toDateString();

        $sales = $this->scopeQueryToCurrentStore(Sale::whereBetween('date', [$start, $today]))
            ->get(['date', 'created_at', 'grand_total']);

        // 0=lunes .. 6=domingo, coincide con 'days' de abajo.
        $matrix = array_fill(0, 7, array_fill(0, 24, 0.0));
        foreach ($sales as $sale) {
            $dayIndex = $sale->date->dayOfWeekIso - 1;
            $hour = Carbon::parse($sale->created_at)->setTimezone('America/Guayaquil')->hour;
            $matrix[$dayIndex][$hour] += (float) $sale->grand_total;
        }

        $max = 0.0;
        foreach ($matrix as $row) {
            $max = max($max, max($row));
        }

        $data = [
            'days' => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            'hours' => array_map(fn ($h) => str_pad((string) $h, 2, '0', STR_PAD_LEFT), range(0, 23)),
            'matrix' => $matrix,
            'max' => round($max, 2),
        ];

        return $this->sendResponse($data, 'Sales heatmap retrieved successfully');
    }

    /**
     * Cajeros con turno hoy, para el panel "Shift" de Insights: cualquier
     * caja TODAVÍA abierta (sin importar cuándo se abrió -- mismo
     * criterio que active_cashiers_count en getTodayOverview(), porque
     * acá una caja puede quedar abierta de un día para otro) MÁS
     * cualquier caja que se abrió Y cerró hoy (para no perder el turno de
     * alguien que ya hizo cierre de caja). Se agrupa por usuario por si
     * tuvo más de una caja en el día; 'status' es "on" si tiene AL MENOS
     * una caja todavía sin cerrar.
     */
    public function getActiveShifts(): JsonResponse
    {
        $today = Carbon::now('America/Guayaquil')->toDateString();
        $startOfTodayUtc = Carbon::now('America/Guayaquil')->startOfDay()->utc()->toDateTimeString();
        $endOfTodayUtc = Carbon::now('America/Guayaquil')->endOfDay()->utc()->toDateTimeString();

        $registers = POSRegister::with('user')
            ->where(function ($q) use ($startOfTodayUtc, $endOfTodayUtc) {
                $q->whereNull('closed_at')
                    ->orWhereBetween('created_at', [$startOfTodayUtc, $endOfTodayUtc]);
            })
            ->when($this->currentStoreId(), function ($q, $storeId) {
                $q->whereHas('warehouse', function ($qw) use ($storeId) {
                    $qw->where('store_id', $storeId);
                });
            })
            ->get()
            ->groupBy('user_id');

        $data = [];
        foreach ($registers as $userId => $userRegisters) {
            $user = $userRegisters->first()->user;
            if (!$user) {
                continue;
            }

            $isOn = $userRegisters->contains(fn ($register) => is_null($register->closed_at));

            $userSales = $this->scopeQueryToCurrentStore(Sale::whereDate('date', $today))
                ->where('user_id', $userId)
                ->get(['id', 'grand_total']);

            $data[] = [
                'user_id' => $userId,
                'name' => trim($user->first_name . ' ' . $user->last_name),
                'status' => $isOn ? 'on' : 'off',
                'sales_amount' => (float) $userSales->sum('grand_total'),
                'transaction_count' => $userSales->count(),
            ];
        }

        usort($data, fn ($a, $b) => $b['sales_amount'] <=> $a['sales_amount']);

        return $this->sendResponse($data, 'Active shifts retrieved successfully');
    }
}
