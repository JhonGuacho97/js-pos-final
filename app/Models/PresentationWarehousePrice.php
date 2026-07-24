<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\PresentationWarehousePrice
 *
 * Override del precio de una presentación (product_presentations.price) para
 * una sucursal específica. Si no existe fila aquí para una presentación+
 * sucursal, se usa el precio general de la presentación.
 *
 * @property int $id
 * @property int $product_presentation_id
 * @property int $warehouse_id
 * @property float $price
 */
class PresentationWarehousePrice extends BaseModel
{
    use HasFactory;

    protected $table = 'presentation_warehouse_prices';

    protected $fillable = [
        'product_presentation_id',
        'warehouse_id',
        'price',
    ];

    protected $casts = [
        'product_presentation_id' => 'integer',
        'warehouse_id' => 'integer',
        'price' => 'float',
    ];

    public static $rules = [
        'product_presentation_id' => 'required|exists:product_presentations,id',
        'warehouse_id' => 'required|exists:warehouses,id',
        'price' => 'required|numeric|min:0',
    ];

    public function presentation(): BelongsTo
    {
        return $this->belongsTo(ProductPresentation::class, 'product_presentation_id', 'id');
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id', 'id');
    }
}
