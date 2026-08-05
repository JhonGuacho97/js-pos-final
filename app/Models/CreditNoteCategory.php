<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CreditNoteCategory extends BaseModel implements JsonResourceful
{
    use HasFactory, HasJsonResourcefulData;

    public const JSON_API_TYPE = 'credit_note_categories';

    protected $fillable = [
        'name',
        'description',
    ];

    public static $rules = [
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
    ];

    public function creditNotes(): HasMany
    {
        return $this->hasMany(CreditNote::class);
    }

    public function prepareLinks(): array
    {
        return [];
    }

    public function prepareAttributes(): array
    {
        return [
            'name' => $this->name,
            'description' => $this->description,
        ];
    }
}
