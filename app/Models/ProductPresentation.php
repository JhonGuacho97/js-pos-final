<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\ProductPresentation
 *
 * Representa una forma de VENTA/COMPRA de un producto (Unidad, Six Pack, Caja...)
 * que comparte un único inventario base (products -> manage_stocks).
 * No debe confundirse con VariationProduct, que representa productos distintos
 * (con stock propio) como Camiseta-Rojo vs Camiseta-Azul.
 *
 * @property int $id
 * @property int $product_id
 * @property int $variation_type_id
 * @property float $equivalence
 * @property float $price
 * @property bool $is_base_unit
 * @property bool $is_default
 * @property int $sort
 * @property-read \App\Models\Product $product
 * @property-read \App\Models\VariationType $variationType
 */
class ProductPresentation extends BaseModel implements JsonResourceful
{
    use HasFactory, HasJsonResourcefulData;

    protected $table = 'product_presentations';

    const JSON_API_TYPE = 'product_presentations';

    protected $fillable = [
        'product_id',
        'variation_type_id',
        'presentation_type_id',
        'equivalence',
        'price',
        'cost',
        'is_base_unit',
        'is_default',
        'sort',
    ];

    protected $casts = [
        'product_id' => 'integer',
        'variation_type_id' => 'integer',
        'presentation_type_id' => 'integer',
        'equivalence' => 'float',
        'price' => 'float',
        'cost' => 'float',
        'is_base_unit' => 'boolean',
        'is_default' => 'boolean',
        'sort' => 'integer',
    ];

    public static $rules = [
        'product_id' => 'required|exists:products,id',
        'presentation_type_id' => 'required_without:variation_type_id|nullable|exists:presentation_types,id',
        'variation_type_id' => 'required_without:presentation_type_id|nullable|exists:variation_types,id',
        'equivalence' => 'required|numeric|min:0.0001',
        'price' => 'required|numeric|min:0',
        'cost' => 'nullable|numeric|min:0',
        'is_base_unit' => 'boolean',
        'is_default' => 'boolean',
        'sort' => 'nullable|integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }

    public function variationType(): BelongsTo
    {
        return $this->belongsTo(VariationType::class, 'variation_type_id', 'id');
    }

    public function presentationType(): BelongsTo
    {
        return $this->belongsTo(PresentationType::class, 'presentation_type_id', 'id');
    }

    public function warehousePrices(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PresentationWarehousePrice::class, 'product_presentation_id', 'id');
    }

    /**
     * Precio efectivo de esta presentación para una sucursal dada.
     * Si no hay override para esa sucursal, cae al precio general.
     */
    public function priceForWarehouse(?int $warehouseId): float
    {
        if (empty($warehouseId)) {
            return (float) $this->price;
        }

        if ($this->relationLoaded('warehousePrices')) {
            $override = $this->warehousePrices->firstWhere('warehouse_id', $warehouseId);
        } else {
            $override = $this->warehousePrices()->where('warehouse_id', $warehouseId)->first();
        }

        return $override ? (float) $override->price : (float) $this->price;
    }

    /**
     * Costo real de esta presentación completa. Si no se cargó un costo
     * explícito (caso normal), cae al costo del producto base multiplicado
     * por la equivalencia -- la cuenta simple que el sistema ya hacía
     * antes de que existiera este campo.
     */
    public function effectiveCost(): float
    {
        if ($this->cost !== null) {
            return (float) $this->cost;
        }

        $baseCost = $this->relationLoaded('product')
            ? $this->product?->product_cost
            : $this->product()->value('product_cost');

        return (float) ($baseCost ?? 0) * (float) $this->equivalence;
    }

    public function prepareAttributes(): array
    {
        $effectiveCost = $this->effectiveCost();
        $effectivePrice = $this->priceForWarehouse(request()->get('warehouse_id'));

        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'variation_type_id' => $this->variation_type_id,
            'presentation_type_id' => $this->presentation_type_id,
            'presentation_family_id' => $this->presentationType?->presentation_family_id,
            'name' => $this->presentationType?->name ?? $this->variationType?->name ?? '',
            'equivalence' => $this->equivalence,
            'price' => $this->price,
            'effective_price' => $effectivePrice,
            'cost' => $this->cost,
            'effective_cost' => $effectiveCost,
            'margin' => round($effectivePrice - $effectiveCost, 4),
            'is_base_unit' => $this->is_base_unit,
            'is_default' => $this->is_default,
            'sort' => $this->sort,
        ];
    }

    public function prepareLinks(): array
    {
        return [];
    }
}
