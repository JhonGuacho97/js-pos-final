<?php

namespace App\Services;

use App\Models\ManageStock;
use App\Models\Product;
use App\Models\Warehouse;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class OfflineSaleStockDiagnosisService
{
    /**
     * Comprueba una venta offline contra el inventario autoritativo sin
     * escribir nada. Las necesidades se agrupan por producto físico para
     * detectar correctamente líneas repetidas y componentes de kits.
     */
    public function diagnose(array $saleItems, int $warehouseId, int $storeId): array
    {
        $productIds = collect($saleItems)->pluck('product_id')->filter()->unique()->values();
        $products = Product::query()
            ->where('store_id', $storeId)
            ->whereIn('id', $productIds)
            ->with([
                'presentations.presentationType',
                'presentations.variationType',
                'kitItems.component',
                'kitItems.presentation',
            ])
            ->get()
            ->keyBy('id');

        $items = [];
        $requirements = [];

        foreach (array_values($saleItems) as $index => $saleItem) {
            $productId = (int) ($saleItem['product_id'] ?? 0);
            $product = $products->get($productId);
            if (! $product) {
                throw new UnprocessableEntityHttpException('Uno de los productos ya no está disponible en esta tienda.');
            }

            $presentationQuantity = (float) ($saleItem['quantity'] ?? 0);
            $presentationId = ! empty($saleItem['product_presentation_id'])
                ? (int) $saleItem['product_presentation_id']
                : null;
            $presentation = $presentationId
                ? $product->presentations->firstWhere('id', $presentationId)
                : null;

            if ($presentationId && (! $product->manage_presentations || ! $presentation)) {
                throw new UnprocessableEntityHttpException("La presentación seleccionada para {$product->name} ya no está disponible.");
            }

            $equivalence = $presentation ? (float) $presentation->equivalence : 1.0;
            $baseQuantity = $presentationQuantity * $equivalence;
            $item = [
                'line' => $index,
                'product_id' => $product->id,
                'product_name' => $product->name,
                'product_code' => $product->code,
                'presentation_id' => $presentation?->id,
                'presentation_name' => $presentation?->displayName() ?? 'Unidad',
                'presentation_quantity' => $presentationQuantity,
                'presentation_equivalence' => $equivalence,
                'base_quantity' => $baseQuantity,
                'unit_name' => $product->getProductUnitName(),
                'has_conflict' => false,
            ];
            $items[$index] = $item;

            foreach ($product->resolverMovimientoStock($baseQuantity) as $movement) {
                $stockProductId = (int) $movement['product_id'];
                if (! isset($requirements[$stockProductId])) {
                    $requirements[$stockProductId] = [
                        'required_quantity' => 0.0,
                        'source_lines' => [],
                    ];
                }
                $requirements[$stockProductId]['required_quantity'] += (float) $movement['quantity'];
                $requirements[$stockProductId]['source_lines'][] = $index;
            }
        }

        $stockProductIds = array_keys($requirements);
        $stockProducts = Product::query()
            ->where('store_id', $storeId)
            ->whereIn('id', $stockProductIds)
            ->get()
            ->keyBy('id');
        $stocks = ManageStock::query()
            ->where('warehouse_id', $warehouseId)
            ->whereIn('product_id', $stockProductIds)
            ->get()
            ->keyBy('product_id');

        $conflicts = [];
        foreach ($requirements as $stockProductId => $requirement) {
            $available = (float) ($stocks->get($stockProductId)?->quantity ?? 0);
            $required = (float) $requirement['required_quantity'];
            if ($required <= $available + 0.000001) {
                continue;
            }

            $sourceLines = array_values(array_unique($requirement['source_lines']));
            foreach ($sourceLines as $sourceLine) {
                $items[$sourceLine]['has_conflict'] = true;
            }

            $stockProduct = $stockProducts->get($stockProductId);
            $sources = collect($sourceLines)->map(fn (int $line) => $items[$line])->values()->all();
            $conflicts[] = [
                'stock_product_id' => (int) $stockProductId,
                'stock_product_name' => $stockProduct?->name ?? 'Producto no disponible',
                'stock_product_code' => $stockProduct?->code,
                'requested_quantity' => round($required, 4),
                'available_quantity' => round($available, 4),
                'shortage_quantity' => round(max(0, $required - $available), 4),
                'unit_name' => $stockProduct?->getProductUnitName(),
                'is_kit_component' => collect($sources)->contains(fn (array $source) => (int) $source['product_id'] !== (int) $stockProductId),
                'sources' => $sources,
            ];
        }

        $warehouse = Warehouse::query()
            ->where('store_id', $storeId)
            ->find($warehouseId);

        return [
            'can_sync' => count($conflicts) === 0,
            'warehouse' => [
                'id' => $warehouseId,
                'name' => $warehouse?->name ?? 'Almacén',
            ],
            'items' => array_values($items),
            'conflicts' => $conflicts,
            'checked_at' => now()->toIso8601String(),
        ];
    }
}
