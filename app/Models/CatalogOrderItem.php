<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CatalogOrderItem extends BaseModel
{
    protected $fillable = [
        'catalog_order_id', 'product_id', 'product_presentation_id',
        'product_name', 'variant_name', 'presentation_name',
        'presentation_equivalence', 'quantity', 'unit_price', 'line_total', 'notes',
    ];

    protected $casts = [
        'presentation_equivalence' => 'float',
        'quantity' => 'float',
        'unit_price' => 'float',
        'line_total' => 'float',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(CatalogOrder::class, 'catalog_order_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function presentation(): BelongsTo
    {
        return $this->belongsTo(ProductPresentation::class, 'product_presentation_id');
    }
}
