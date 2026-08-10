<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductKitItem extends Model
{
    protected $table = 'product_kit_items';

    protected $fillable = [
        'kit_product_id',
        'component_product_id',
        'component_product_presentation_id',
        'quantity',
    ];

    protected $casts = [
        'quantity' => 'float',
    ];

    public function kitProduct(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'kit_product_id', 'id');
    }

    public function component(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'component_product_id', 'id');
    }

    public function presentation(): BelongsTo
    {
        return $this->belongsTo(ProductPresentation::class, 'component_product_presentation_id', 'id');
    }

    public function prepareAttributes(): array
    {
        return [
            'id' => $this->id,
            'component_product_id' => $this->component_product_id,
            'component_name' => $this->component?->name,
            'component_code' => $this->component?->code,
            'component_product_presentation_id' => $this->component_product_presentation_id,
            'component_presentation_name' => $this->presentation?->variationType?->name,
            'component_presentation_equivalence' => $this->component_product_presentation_id ? (float) $this->presentation?->equivalence : null,
            'quantity' => $this->quantity,
        ];
    }
}
