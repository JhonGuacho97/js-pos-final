<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Models\PresentationWarehousePrice;
use App\Models\Product;
use App\Models\ProductPresentation;
use App\Models\ProductWarehousePrice;
use App\Models\Warehouse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Overrides de precio por sucursal.
 *
 * El precio "general" sigue viviendo en products.product_price y en
 * product_presentations.price. Aquí solo se manejan las EXCEPCIONES por
 * sucursal: si no hay fila para una sucursal, esa sucursal usa el precio
 * general (ver Product::priceForWarehouse / ProductPresentation::priceForWarehouse).
 */
class WarehousePriceAPIController extends AppBaseController
{
    /**
     * GET /api/products/{product}/warehouse-prices
     * Devuelve todas las sucursales con su precio (override o general).
     */
    public function forProduct($productId): JsonResponse
    {
        $product = Product::findOrFail($productId);
        $overrides = $product->warehousePrices()->pluck('price', 'warehouse_id');

        $data = Warehouse::orderBy('name')->get()->map(fn (Warehouse $warehouse) => [
            'warehouse_id' => $warehouse->id,
            'warehouse_name' => $warehouse->name,
            'general_price' => (float) $product->product_price,
            'price' => $overrides->has($warehouse->id) ? (float) $overrides[$warehouse->id] : null,
        ])->values();

        return $this->sendResponse($data, 'Product warehouse prices retrieved successfully');
    }

    /**
     * PUT /api/products/{product}/warehouse-prices
     * Body: { "prices": [{ "warehouse_id": 1, "price": 12.5 }, { "warehouse_id": 2, "price": null }] }
     * price = null (o vacío) borra el override -> esa sucursal vuelve a usar el precio general.
     */
    public function updateForProduct(Request $request, $productId): JsonResponse
    {
        $product = Product::findOrFail($productId);

        $request->validate([
            'prices' => 'required|array',
            'prices.*.warehouse_id' => 'required|exists:warehouses,id',
            'prices.*.price' => 'nullable|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();
            $this->syncOverrides(
                $request->get('prices'),
                fn ($warehouseId) => ProductWarehousePrice::where('product_id', $product->id)
                    ->where('warehouse_id', $warehouseId),
                fn ($warehouseId, $price) => ProductWarehousePrice::updateOrCreate(
                    ['product_id' => $product->id, 'warehouse_id' => $warehouseId],
                    ['price' => $price]
                )
            );
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }

        return $this->sendSuccess('Product warehouse prices updated successfully');
    }

    /**
     * GET /api/product-presentations/{presentation}/warehouse-prices
     */
    public function forPresentation($presentationId): JsonResponse
    {
        $presentation = ProductPresentation::findOrFail($presentationId);
        $overrides = $presentation->warehousePrices()->pluck('price', 'warehouse_id');

        $data = Warehouse::orderBy('name')->get()->map(fn (Warehouse $warehouse) => [
            'warehouse_id' => $warehouse->id,
            'warehouse_name' => $warehouse->name,
            'general_price' => (float) $presentation->price,
            'price' => $overrides->has($warehouse->id) ? (float) $overrides[$warehouse->id] : null,
        ])->values();

        return $this->sendResponse($data, 'Presentation warehouse prices retrieved successfully');
    }

    /**
     * PUT /api/product-presentations/{presentation}/warehouse-prices
     */
    public function updateForPresentation(Request $request, $presentationId): JsonResponse
    {
        $presentation = ProductPresentation::findOrFail($presentationId);

        $request->validate([
            'prices' => 'required|array',
            'prices.*.warehouse_id' => 'required|exists:warehouses,id',
            'prices.*.price' => 'nullable|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();
            $this->syncOverrides(
                $request->get('prices'),
                fn ($warehouseId) => PresentationWarehousePrice::where('product_presentation_id', $presentation->id)
                    ->where('warehouse_id', $warehouseId),
                fn ($warehouseId, $price) => PresentationWarehousePrice::updateOrCreate(
                    ['product_presentation_id' => $presentation->id, 'warehouse_id' => $warehouseId],
                    ['price' => $price]
                )
            );
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }

        return $this->sendSuccess('Presentation warehouse prices updated successfully');
    }

    /**
     * Recorre las filas enviadas por el frontend: borra el override si viene
     * price vacío, o lo crea/actualiza si viene un valor.
     */
    private function syncOverrides(array $prices, \Closure $findQuery, \Closure $upsert): void
    {
        foreach ($prices as $row) {
            $warehouseId = $row['warehouse_id'];
            $price = $row['price'] ?? null;

            if ($price === null || $price === '') {
                $findQuery($warehouseId)->delete();
                continue;
            }

            $upsert($warehouseId, $price);
        }
    }
}
