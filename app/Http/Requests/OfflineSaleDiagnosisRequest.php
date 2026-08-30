<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OfflineSaleDiagnosisRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'warehouse_id' => ['required', 'integer', 'exists:warehouses,id'],
            'sale_items' => ['required', 'array', 'min:1'],
            'sale_items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'sale_items.*.product_presentation_id' => ['nullable', 'integer', 'exists:product_presentations,id'],
            'sale_items.*.quantity' => ['required', 'numeric', 'min:0.01'],
        ];
    }
}
