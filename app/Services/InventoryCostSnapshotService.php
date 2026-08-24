<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductPresentation;
use App\Models\SaleItem;

class InventoryCostSnapshotService
{
    public function forSale(
        Product $product,
        float $baseQuantity,
        ?ProductPresentation $presentation = null,
        ?float $presentationQuantity = null,
        bool $estimated = false
    ): array {
        if ($product->is_kit) {
            $costPerBaseUnit = $this->kitUnitCost($product);
            $totalCost = $costPerBaseUnit * $baseQuantity;
        } elseif ($presentation) {
            $presentationQuantity ??= $baseQuantity / max((float) $presentation->equivalence, 0.0001);
            $totalCost = $presentation->effectiveCost() * $presentationQuantity;
            $costPerBaseUnit = $baseQuantity > 0 ? $totalCost / $baseQuantity : 0;
        } else {
            $costPerBaseUnit = (float) $product->product_cost;
            $totalCost = $costPerBaseUnit * $baseQuantity;
        }

        return [
            'unit_cost' => round($costPerBaseUnit, 6),
            'total_cost' => round($totalCost, 4),
            'cost_is_estimated' => $estimated,
        ];
    }

    public function forReturn(int $saleId, array $returnItem): array
    {
        $source = SaleItem::where('sale_id', $saleId)
            ->where('product_id', $returnItem['product_id'])
            ->when(
                ! empty($returnItem['product_presentation_id']),
                fn ($query) => $query->where('product_presentation_id', $returnItem['product_presentation_id']),
                fn ($query) => $query->whereNull('product_presentation_id')
            )
            ->first();

        $baseQuantity = (float) ($returnItem['quantity'] ?? 0);
        if ($source && $source->unit_cost !== null) {
            return [
                'unit_cost' => round((float) $source->unit_cost, 6),
                'total_cost' => round((float) $source->unit_cost * $baseQuantity, 4),
                'cost_is_estimated' => (bool) $source->cost_is_estimated,
            ];
        }

        $product = Product::with(['kitItems.component', 'kitItems.presentation.product'])
            ->findOrFail($returnItem['product_id']);
        $presentation = ! empty($returnItem['product_presentation_id'])
            ? ProductPresentation::with('product')->find($returnItem['product_presentation_id'])
            : null;

        return $this->forSale(
            $product,
            $baseQuantity,
            $presentation,
            (float) ($returnItem['presentation_quantity'] ?? $baseQuantity),
            true
        );
    }

    private function kitUnitCost(Product $kit): float
    {
        $items = $kit->relationLoaded('kitItems')
            ? $kit->kitItems
            : $kit->kitItems()->with(['component', 'presentation.product'])->get();

        return (float) $items->sum(function ($item) {
            $componentCost = $item->presentation
                ? $item->presentation->effectiveCost()
                : (float) ($item->component?->product_cost ?? 0);

            return $componentCost * (float) $item->quantity;
        });
    }
}
