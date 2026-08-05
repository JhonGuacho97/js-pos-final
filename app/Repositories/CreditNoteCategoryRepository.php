<?php

namespace App\Repositories;

use App\Models\CreditNoteCategory;

class CreditNoteCategoryRepository extends BaseRepository
{
    protected $fieldSearchable = [
        'name',
        'description',
    ];

    public function model(): string
    {
        return CreditNoteCategory::class;
    }
}
