<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CollectionActivity extends BaseModel
{
    public const CONTACT = 'contact';
    public const PROMISE = 'promise';
    public const NOTE = 'note';

    protected $fillable = [
        'sale_id', 'customer_id', 'user_id', 'type', 'note',
        'promised_payment_date', 'promised_amount', 'contacted_at',
    ];

    protected $casts = [
        'promised_payment_date' => 'date',
        'promised_amount' => 'double',
        'contacted_at' => 'datetime',
    ];

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
