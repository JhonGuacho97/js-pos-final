<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CatalogOrderStatusHistory extends BaseModel
{
    protected $fillable = [
        'catalog_order_id', 'user_id', 'from_status', 'to_status', 'note',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(CatalogOrder::class, 'catalog_order_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
