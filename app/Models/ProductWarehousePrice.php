<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\ProductWarehousePrice
 *
 * Override del precio base de un producto (products.product_price) para una
 * sucursal específica. Si no existe fila aquí para un producto+sucursal, se
 * usa el precio general del producto.
 *
 * @property int $id
 * @property int $product_id
 * @property int $warehouse_id
 * @property float $price
 */
class ProductWarehousePrice extends BaseModel
{
    use HasFactory;

    protected $table = 'product_warehouse_prices';

    protected $fillable = [
        'product_id',
        'warehouse_id',
        'price',
    ];

    protected $casts = [
        'product_id' => 'integer',
        'warehouse_id' => 'integer',
        'price' => 'float',
    ];

    public static $rules = [
        'product_id' => 'required|exists:products,id',
        'warehouse_id' => 'required|exists:warehouses,id',
        'price' => 'required|numeric|min:0',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id', 'id');
    }
}
