<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Models\BaseUnit;
use App\Models\ManageStock;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Consultas operativas del inventario actual.
 *
 * ManageStock es la fuente de verdad de la existencia por producto/bodega.
 * Este controlador no modifica cantidades: los cambios siguen pasando por
 * compras, ventas, transferencias y ajustes para conservar la trazabilidad.
 */
class ManageStockAPIController extends AppBaseController
{
    public function stockReport(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'warehouse_id' => ['required', 'integer', 'exists:warehouses,id'],
            'search' => ['nullable', 'string', 'max:120'],
            'category_id' => ['nullable', 'integer'],
            'status' => ['nullable', 'in:all,healthy,low,critical,out,negative'],
            'page.size' => ['nullable', 'integer', 'min:5', 'max:100'],
            'page.number' => ['nullable', 'integer', 'min:1'],
            'sort' => ['nullable', 'string'],
        ]);

        $warehouseId = (int) $validated['warehouse_id'];
        $this->authorizeWarehouseAccess($warehouseId);

        $baseQuery = ManageStock::query()
            ->with(['product.productCategory', 'product.variationType', 'warehouse'])
            ->where('manage_stocks.warehouse_id', $warehouseId)
            ->whereHas('product', function (Builder $query) {
                if ($storeId = $this->currentStoreId()) {
                    $query->where('store_id', $storeId);
                }
            });

        $this->applyProductFilters($baseQuery, $request);

        // El resumen conserva búsqueda/categoría, pero no el filtro de estado:
        // así los indicadores continúan explicando la composición completa.
        $summaryStocks = (clone $baseQuery)->get();
        $summary = $this->buildSummary($summaryStocks, $warehouseId);

        $this->applyStatusFilter($baseQuery, $request->get('status'));
        $this->applySort($baseQuery, $request->get('sort'));

        $perPage = (int) $request->input('page.size', 10);
        $page = (int) $request->input('page.number', 1);
        $stocks = $baseQuery->paginate($perPage, ['*'], 'page', $page);
        $units = BaseUnit::query()->pluck('name', 'id');

        $rows = $stocks->getCollection()->map(fn (ManageStock $stock) =>
            $this->stockRow($stock, $units, $warehouseId)
        )->values();

        return response()->json([
            'success' => true,
            'data' => $rows,
            'summary' => $summary,
            'meta' => [
                'current_page' => $stocks->currentPage(),
                'last_page' => $stocks->lastPage(),
                'per_page' => $stocks->perPage(),
                'total' => $stocks->total(),
            ],
        ]);
    }

    private function applyProductFilters(Builder $query, Request $request): void
    {
        $search = trim((string) $request->get('search', ''));
        if ($search !== '') {
            $query->whereHas('product', function (Builder $productQuery) use ($search) {
                $productQuery->where(function (Builder $searchQuery) use ($search) {
                    $like = '%'.$search.'%';
                    $searchQuery->where('code', 'like', $like)
                        ->orWhere('product_code', 'like', $like)
                        ->orWhere('name', 'like', $like);
                });
            });
        }

        if ($request->filled('category_id')) {
            $query->whereHas('product', fn (Builder $productQuery) =>
                $productQuery->where('product_category_id', (int) $request->get('category_id'))
            );
        }
    }

    private function applyStatusFilter(Builder $query, ?string $status): void
    {
        if (!$status || $status === 'all') {
            return;
        }

        if ($status === 'negative') {
            $query->where('manage_stocks.quantity', '<', 0);
            return;
        }

        if ($status === 'out') {
            $query->where('manage_stocks.quantity', '=', 0);
            return;
        }

        $query->whereHas('product', function (Builder $productQuery) use ($status) {
            $threshold = 'CAST(COALESCE(products.stock_alert, 0) AS DECIMAL(20,4))';
            if ($status === 'critical') {
                $productQuery->whereRaw('manage_stocks.quantity > 0')
                    ->whereRaw("manage_stocks.quantity <= {$threshold} * 0.5");
            } elseif ($status === 'low') {
                $productQuery->whereRaw("manage_stocks.quantity > {$threshold} * 0.5")
                    ->whereRaw("manage_stocks.quantity <= {$threshold}");
            } elseif ($status === 'healthy') {
                $productQuery->whereRaw("manage_stocks.quantity > {$threshold}");
            }
        });
    }

    private function applySort(Builder $query, ?string $sort): void
    {
        $descending = str_starts_with((string) $sort, '-');
        $field = ltrim((string) $sort, '-');
        $direction = $descending ? 'desc' : 'asc';

        if ($field === 'quantity') {
            $query->orderBy('manage_stocks.quantity', $direction);
        } elseif ($field === 'updated_at') {
            $query->orderBy('manage_stocks.updated_at', $direction);
        } else {
            $query->latest('manage_stocks.updated_at');
        }
    }

    private function stockRow(ManageStock $stock, $units, int $warehouseId): array
    {
        $product = $stock->product;
        $quantity = $product->is_kit
            ? (float) $product->buildableQuantity($warehouseId)
            : (float) $stock->quantity;
        $threshold = (float) ($product->stock_alert ?? 0);

        return [
            'id' => $stock->id,
            'product_id' => $product->id,
            'code' => $product->code,
            'product_code' => $product->product_code,
            'name' => $product->name,
            'variation_label' => $product->variationType?->name,
            'category_id' => $product->product_category_id,
            'category_name' => $product->productCategory?->name ?? 'Sin categoría',
            'unit_name' => $units->get($product->product_unit, ''),
            'quantity' => round($quantity, 4),
            'stock_alert' => round($threshold, 4),
            'shortage' => round(max($threshold - $quantity, 0), 4),
            'status' => $this->stockStatus($quantity, $threshold),
            'product_cost' => (float) $product->product_cost,
            'product_price' => (float) $product->product_price,
            'cost_value' => round($quantity * (float) $product->product_cost, 2),
            'retail_value' => round($quantity * (float) $product->product_price, 2),
            'is_kit' => (bool) $product->is_kit,
            'updated_at' => optional($stock->updated_at)->toIso8601String(),
        ];
    }

    private function buildSummary($stocks, int $warehouseId): array
    {
        $summary = [
            'products' => 0,
            'units' => 0.0,
            'healthy' => 0,
            'low' => 0,
            'critical' => 0,
            'out' => 0,
            'negative' => 0,
            'cost_value' => 0.0,
            'retail_value' => 0.0,
        ];

        foreach ($stocks as $stock) {
            $product = $stock->product;
            $quantity = $product->is_kit
                ? (float) $product->buildableQuantity($warehouseId)
                : (float) $stock->quantity;
            $status = $this->stockStatus($quantity, (float) ($product->stock_alert ?? 0));
            $summary['products']++;
            $summary['units'] += $quantity;
            $summary[$status]++;
            $summary['cost_value'] += $quantity * (float) $product->product_cost;
            $summary['retail_value'] += $quantity * (float) $product->product_price;
        }

        $summary['units'] = round($summary['units'], 4);
        $summary['cost_value'] = round($summary['cost_value'], 2);
        $summary['retail_value'] = round($summary['retail_value'], 2);

        return $summary;
    }

    private function stockStatus(float $quantity, float $threshold): string
    {
        if ($quantity < 0) {
            return 'negative';
        }
        if ($quantity == 0.0) {
            return 'out';
        }
        if ($threshold > 0 && $quantity <= $threshold * 0.5) {
            return 'critical';
        }
        if ($threshold > 0 && $quantity <= $threshold) {
            return 'low';
        }

        return 'healthy';
    }
}
