<?php

namespace App\Exports;

use App\Models\ManageStock;
use App\Models\Warehouse;
use Maatwebsite\Excel\Concerns\FromView;

class StockReportExport implements FromView
{
    public function __construct(private readonly array $filters = [])
    {
    }

    public function view(): \Illuminate\Contracts\View\View
    {
        $storeId = currentStoreId();
        $warehouseId = $this->filters['warehouse_id'] ?? request()->get('warehouse_id');

        $stocksQuery = ManageStock::whereWarehouseId($warehouseId)
            ->with('product.productCategory', 'warehouse');
        if ($storeId) {
            $stocksQuery->whereIn('warehouse_id', Warehouse::where('store_id', $storeId)->active()->pluck('id'));
        }

        $search = trim((string) ($this->filters['search'] ?? ''));
        if ($search !== '') {
            $stocksQuery->whereHas('product', function ($query) use ($search) {
                $like = '%'.$search.'%';
                $query->where(function ($nested) use ($like) {
                    $nested->where('code', 'like', $like)
                        ->orWhere('product_code', 'like', $like)
                        ->orWhere('name', 'like', $like);
                });
            });
        }
        if (!empty($this->filters['category_id'])) {
            $stocksQuery->whereHas('product', fn ($query) =>
                $query->where('product_category_id', (int) $this->filters['category_id'])
            );
        }

        $status = $this->filters['status'] ?? 'all';
        if ($status === 'negative') {
            $stocksQuery->where('quantity', '<', 0);
        } elseif ($status === 'out') {
            $stocksQuery->where('quantity', '=', 0);
        } elseif (in_array($status, ['healthy', 'low', 'critical'], true)) {
            $stocksQuery->whereHas('product', function ($query) use ($status) {
                $threshold = 'CAST(COALESCE(products.stock_alert, 0) AS DECIMAL(20,4))';
                if ($status === 'healthy') {
                    $query->whereRaw("manage_stocks.quantity > {$threshold}");
                } elseif ($status === 'critical') {
                    $query->whereRaw('manage_stocks.quantity > 0')
                        ->whereRaw("manage_stocks.quantity <= {$threshold} * 0.5");
                } else {
                    $query->whereRaw("manage_stocks.quantity > {$threshold} * 0.5")
                        ->whereRaw("manage_stocks.quantity <= {$threshold}");
                }
            });
        }
        $stocks = $stocksQuery->get();

        return view('excel.stock-report-excel', ['stocks' => $stocks]);
    }
}
