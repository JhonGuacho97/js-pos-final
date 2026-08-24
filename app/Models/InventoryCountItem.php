<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryCountItem extends BaseModel
{
    protected $fillable = [
        'inventory_count_id', 'product_id', 'expected_quantity',
        'counted_quantity', 'difference', 'counted_by', 'counted_at', 'notes',
    ];

    protected $casts = [
        'expected_quantity' => 'float',
        'counted_quantity' => 'float',
        'difference' => 'float',
        'counted_at' => 'datetime',
    ];

    public function inventoryCount(): BelongsTo { return $this->belongsTo(InventoryCount::class); }
    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
    public function counter(): BelongsTo { return $this->belongsTo(User::class, 'counted_by'); }
}
