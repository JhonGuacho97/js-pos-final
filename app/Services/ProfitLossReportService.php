<?php

namespace App\Services;

use App\Models\Expense;
use App\Models\Purchase;
use App\Models\PurchaseReturn;
use App\Models\Sale;
use App\Models\SaleReturn;
use App\Models\SalesPayment;
use App\Models\Warehouse;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class ProfitLossReportService
{
    public function generate(string $startDate, string $endDate, ?int $storeId, ?int $warehouseId = null): array
    {
        $start = Carbon::parse($startDate)->startOfDay();
        $end = Carbon::parse($endDate)->endOfDay();
        $days = $start->diffInDays($end) + 1;
        $previousEnd = $start->copy()->subDay();
        $previousStart = $previousEnd->copy()->subDays($days - 1);

        $current = $this->window($start->toDateString(), $end->toDateString(), $storeId, $warehouseId, true);
        $previous = $this->window($previousStart->toDateString(), $previousEnd->toDateString(), $storeId, $warehouseId, false);

        $current['comparison'] = [
            'start_date' => $previousStart->toDateString(),
            'end_date' => $previousEnd->toDateString(),
            'net_sales' => $this->comparison($current['net_sales'], $previous['net_sales']),
            'gross_profit' => $this->comparison($current['gross_profit'], $previous['gross_profit']),
            'expenses' => $this->comparison($current['expenses'], $previous['expenses']),
            'net_profit' => $this->comparison($current['net_profit'], $previous['net_profit']),
        ];

        // Compatibilidad con la vista/API anterior.
        $current['sales'] = $current['gross_sales'];
        $current['sale_returns'] = $current['sales_returns'];
        $current['Revenue'] = $current['net_invoice_sales'];
        $current['product_cost'] = $current['cost_of_goods_sold'];

        return $current;
    }

    private function window(string $start, string $end, ?int $storeId, ?int $warehouseId, bool $withDetails): array
    {
        $warehouseIds = $this->warehouseIds($storeId, $warehouseId);
        $sales = Sale::whereBetween('date', [$start, $end])
            ->when($warehouseIds !== null, fn ($query) => $query->whereIn('warehouse_id', $warehouseIds))
            ->with(['saleItems.product.productCategory', 'warehouse', 'payments'])
            ->get();
        $returns = SaleReturn::whereBetween('date', [$start, $end])
            ->when($warehouseIds !== null, fn ($query) => $query->whereIn('warehouse_id', $warehouseIds))
            ->with(['saleReturnItems.product.productCategory', 'warehouse'])
            ->get();
        $expenses = Expense::whereBetween('date', [$start, $end])
            ->when($warehouseIds !== null, fn ($query) => $query->whereIn('warehouse_id', $warehouseIds))
            ->with(['expenseCategory', 'warehouse'])
            ->get();

        $grossSales = round((float) $sales->sum('grand_total'), 2);
        $salesReturns = round((float) $returns->sum('grand_total'), 2);
        $salesTax = round((float) $sales->sum(fn ($sale) =>
            (float) $sale->tax_amount + (float) $sale->saleItems->sum('tax_amount')
        ), 2);
        $returnsTax = round((float) $returns->sum(fn ($return) =>
            (float) $return->tax_amount + (float) $return->saleReturnItems->sum('tax_amount')
        ), 2);
        $netTaxes = round($salesTax - $returnsTax, 2);
        $netInvoiceSales = round($grossSales - $salesReturns, 2);
        $netSales = round($netInvoiceSales - $netTaxes, 2);
        $saleCost = round((float) $sales->sum(fn ($sale) => $sale->saleItems->sum('total_cost')), 2);
        $returnCost = round((float) $returns->sum(fn ($return) => $return->saleReturnItems->sum('total_cost')), 2);
        $costOfGoodsSold = round($saleCost - $returnCost, 2);
        $grossProfit = round($netSales - $costOfGoodsSold, 2);
        $expenseTotal = round((float) $expenses->sum('amount'), 2);
        $netProfit = round($grossProfit - $expenseTotal, 2);
        $transactionCount = $sales->count();

        $paymentsReceived = round((float) SalesPayment::whereBetween('payment_date', [$start, $end])
            ->when($warehouseIds !== null, fn ($query) => $query->whereHas('sale', fn ($sale) => $sale->whereIn('warehouse_id', $warehouseIds)))
            ->sum('amount'), 2);
        $purchaseReturns = round((float) PurchaseReturn::whereBetween('date', [$start, $end])
            ->when($warehouseIds !== null, fn ($query) => $query->whereIn('warehouse_id', $warehouseIds))
            ->sum('grand_total'), 2);
        $purchases = round((float) Purchase::whereBetween('date', [$start, $end])
            ->when($warehouseIds !== null, fn ($query) => $query->whereIn('warehouse_id', $warehouseIds))
            ->sum('grand_total') - $purchaseReturns, 2);
        $selectedSalesPaid = round((float) $sales->sum(fn ($sale) => $sale->payments->sum('amount')), 2);
        $outstanding = round(max(0, $netInvoiceSales - $selectedSalesPaid), 2);

        $estimatedLines = $sales->sum(fn ($sale) => $sale->saleItems->where('cost_is_estimated', true)->count());
        $totalCostLines = $sales->sum(fn ($sale) => $sale->saleItems->count());

        $data = [
            'start_date' => $start,
            'end_date' => $end,
            'gross_sales' => $grossSales,
            'sales_returns' => $salesReturns,
            'net_invoice_sales' => $netInvoiceSales,
            'taxes' => $netTaxes,
            'net_sales' => $netSales,
            'cost_of_goods_sold' => $costOfGoodsSold,
            'gross_profit' => $grossProfit,
            'gross_margin_percent' => $this->margin($grossProfit, $netSales),
            'expenses' => $expenseTotal,
            'net_profit' => $netProfit,
            'net_margin_percent' => $this->margin($netProfit, $netSales),
            'transactions' => $transactionCount,
            'average_ticket' => $transactionCount > 0 ? round($netInvoiceSales / $transactionCount, 2) : 0,
            'sales_payment_amount' => $paymentsReceived,
            'purchase_returns' => $purchaseReturns,
            'payments_received' => round($paymentsReceived + $purchaseReturns, 2),
            'outstanding_receivables' => $outstanding,
            'purchases' => $purchases,
            'cost_quality' => [
                'estimated_lines' => $estimatedLines,
                'total_lines' => $totalCostLines,
                'status' => $estimatedLines === 0 ? 'exact' : ($estimatedLines === $totalCostLines ? 'estimated' : 'mixed'),
            ],
        ];

        if ($withDetails) {
            $data['trend'] = $this->trend($start, $end, $sales, $returns, $expenses);
            $data['expense_breakdown'] = $this->expenseBreakdown($expenses);
            $data['product_profitability'] = $this->productProfitability($sales, $returns);
            $data['category_profitability'] = $this->categoryProfitability($data['product_profitability']);
            $data['warehouse_profitability'] = $this->warehouseProfitability($sales, $returns, $expenses);
        }

        return $data;
    }

    private function trend(string $start, string $end, Collection $sales, Collection $returns, Collection $expenses): array
    {
        $days = Carbon::parse($start)->diffInDays(Carbon::parse($end)) + 1;
        $granularity = $days <= 31 ? 'daily' : ($days <= 120 ? 'weekly' : 'monthly');
        $bucket = function ($date) use ($granularity) {
            $carbon = Carbon::parse($date);
            return match ($granularity) {
                'weekly' => $carbon->startOfWeek()->format('Y-m-d'),
                'monthly' => $carbon->format('Y-m'),
                default => $carbon->format('Y-m-d'),
            };
        };

        $rows = [];
        foreach ($sales as $sale) {
            $key = $bucket($sale->date);
            $revenue = (float) $sale->grand_total
                - (float) $sale->tax_amount
                - (float) $sale->saleItems->sum('tax_amount');
            $rows[$key]['net_sales'] = ($rows[$key]['net_sales'] ?? 0) + $revenue;
            $rows[$key]['cost'] = ($rows[$key]['cost'] ?? 0) + (float) $sale->saleItems->sum('total_cost');
        }
        foreach ($returns as $return) {
            $key = $bucket($return->date);
            $revenue = (float) $return->grand_total
                - (float) $return->tax_amount
                - (float) $return->saleReturnItems->sum('tax_amount');
            $rows[$key]['net_sales'] = ($rows[$key]['net_sales'] ?? 0) - $revenue;
            $rows[$key]['cost'] = ($rows[$key]['cost'] ?? 0) - (float) $return->saleReturnItems->sum('total_cost');
        }
        foreach ($expenses as $expense) {
            $key = $bucket($expense->date);
            $rows[$key]['expenses'] = ($rows[$key]['expenses'] ?? 0) + (float) $expense->amount;
        }

        $keys = collect(array_keys($rows))->sort()->values();
        return [
            'granularity' => $granularity,
            'labels' => $keys->all(),
            'net_sales' => $keys->map(fn ($key) => round($rows[$key]['net_sales'] ?? 0, 2))->all(),
            'gross_profit' => $keys->map(fn ($key) => round(($rows[$key]['net_sales'] ?? 0) - ($rows[$key]['cost'] ?? 0), 2))->all(),
            'net_profit' => $keys->map(fn ($key) => round(($rows[$key]['net_sales'] ?? 0) - ($rows[$key]['cost'] ?? 0) - ($rows[$key]['expenses'] ?? 0), 2))->all(),
        ];
    }

    private function expenseBreakdown(Collection $expenses): array
    {
        $total = max((float) $expenses->sum('amount'), 0.0001);
        return $expenses->groupBy(fn ($expense) => $expense->expenseCategory?->name ?: 'Sin categoría')
            ->map(fn ($rows, $name) => [
                'name' => $name,
                'amount' => round((float) $rows->sum('amount'), 2),
                'percent' => round(((float) $rows->sum('amount') / $total) * 100, 1),
            ])->sortByDesc('amount')->values()->all();
    }

    private function productProfitability(Collection $sales, Collection $returns): array
    {
        $rows = [];
        foreach ($sales as $sale) {
            $lineRevenue = (float) $sale->saleItems->sum(fn ($item) => (float) $item->sub_total - (float) $item->tax_amount);
            $invoiceRevenue = (float) $sale->grand_total - (float) $sale->tax_amount - (float) $sale->saleItems->sum('tax_amount');
            $allocation = $lineRevenue != 0.0 ? $invoiceRevenue / $lineRevenue : 0;
            foreach ($sale->saleItems as $item) {
                $id = $item->product_id;
                $rows[$id] ??= [
                    'product_id' => $id,
                    'name' => $item->product?->name ?: 'Producto eliminado',
                    'category' => $item->product?->productCategory?->name ?: 'Sin categoría',
                    'quantity' => 0, 'revenue' => 0, 'cost' => 0,
                ];
                $rows[$id]['quantity'] += (float) $item->quantity;
                $rows[$id]['revenue'] += ((float) $item->sub_total - (float) $item->tax_amount) * $allocation;
                $rows[$id]['cost'] += (float) $item->total_cost;
            }
        }
        foreach ($returns as $return) {
            $lineRevenue = (float) $return->saleReturnItems->sum(fn ($item) => (float) $item->sub_total - (float) $item->tax_amount);
            $returnRevenue = (float) $return->grand_total - (float) $return->tax_amount - (float) $return->saleReturnItems->sum('tax_amount');
            $allocation = $lineRevenue != 0.0 ? $returnRevenue / $lineRevenue : 0;
            foreach ($return->saleReturnItems as $item) {
                $id = $item->product_id;
                $rows[$id] ??= [
                    'product_id' => $id,
                    'name' => $item->product?->name ?: 'Producto eliminado',
                    'category' => $item->product?->productCategory?->name ?: 'Sin categoría',
                    'quantity' => 0, 'revenue' => 0, 'cost' => 0,
                ];
                $rows[$id]['quantity'] -= (float) $item->quantity;
                $rows[$id]['revenue'] -= ((float) $item->sub_total - (float) $item->tax_amount) * $allocation;
                $rows[$id]['cost'] -= (float) $item->total_cost;
            }
        }

        return collect($rows)->map(function ($row) {
            $row['quantity'] = round($row['quantity'], 2);
            $row['revenue'] = round($row['revenue'], 2);
            $row['cost'] = round($row['cost'], 2);
            $row['profit'] = round($row['revenue'] - $row['cost'], 2);
            $row['margin_percent'] = $this->margin($row['profit'], $row['revenue']);
            return $row;
        })->sortByDesc('profit')->values()->all();
    }

    private function categoryProfitability(array $products): array
    {
        return collect($products)->groupBy('category')->map(function ($rows, $category) {
            $revenue = (float) $rows->sum('revenue');
            $cost = (float) $rows->sum('cost');
            $profit = $revenue - $cost;
            return [
                'name' => $category,
                'revenue' => round($revenue, 2),
                'cost' => round($cost, 2),
                'profit' => round($profit, 2),
                'margin_percent' => $this->margin($profit, $revenue),
            ];
        })->sortByDesc('profit')->values()->all();
    }

    private function warehouseProfitability(Collection $sales, Collection $returns, Collection $expenses): array
    {
        $names = collect();
        foreach ([$sales, $returns, $expenses] as $records) {
            foreach ($records as $record) {
                $names->put((int) $record->warehouse_id, $record->warehouse?->name ?: 'Sucursal');
            }
        }

        return $names->map(function ($name, $warehouseId) use ($sales, $returns, $expenses) {
            $warehouseSales = $sales->where('warehouse_id', $warehouseId);
            $warehouseReturns = $returns->where('warehouse_id', $warehouseId);
            $revenue = (float) $warehouseSales->sum(fn ($sale) =>
                (float) $sale->grand_total - (float) $sale->tax_amount - (float) $sale->saleItems->sum('tax_amount')
            ) - (float) $warehouseReturns->sum(fn ($return) =>
                (float) $return->grand_total - (float) $return->tax_amount - (float) $return->saleReturnItems->sum('tax_amount')
            );
            $cost = (float) $warehouseSales->sum(fn ($sale) => $sale->saleItems->sum('total_cost'))
                - (float) $warehouseReturns->sum(fn ($return) => $return->saleReturnItems->sum('total_cost'));
            $expense = (float) $expenses->where('warehouse_id', $warehouseId)->sum('amount');
            $profit = $revenue - $cost - $expense;
            return [
                'warehouse_id' => (int) $warehouseId,
                'name' => $name ?: 'Sucursal',
                'net_sales' => round($revenue, 2),
                'expenses' => round($expense, 2),
                'net_profit' => round($profit, 2),
                'margin_percent' => $this->margin($profit, $revenue),
            ];
        })->sortByDesc('net_profit')->values()->all();
    }

    private function warehouseIds(?int $storeId, ?int $warehouseId): ?array
    {
        if ($warehouseId) {
            return [$warehouseId];
        }
        return $storeId ? Warehouse::where('store_id', $storeId)->pluck('id')->all() : null;
    }

    private function margin(float $profit, float $revenue): float
    {
        return $revenue != 0.0 ? round(($profit / $revenue) * 100, 1) : 0.0;
    }

    private function comparison(float $current, float $previous): array
    {
        $percent = $previous == 0.0 ? ($current == 0.0 ? 0.0 : 100.0) : (($current - $previous) / abs($previous)) * 100;
        return ['current' => $current, 'previous' => $previous, 'change' => round($current - $previous, 2), 'percent' => round($percent, 1)];
    }
}
