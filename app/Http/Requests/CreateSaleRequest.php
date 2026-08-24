<?php

namespace App\Http\Requests;

use App\Models\Sale;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Class CreateSaleRequest
 */
class CreateSaleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return array_merge(Sale::$rules, [
            'requested_electronic_document' => ['nullable', 'in:01'],
            'payments' => ['nullable', 'array'],
            'payments.*.amount' => ['required_with:payments', 'numeric', 'min:0.01'],
            'payments.*.payment_type' => ['required_with:payments', 'integer', 'in:1,2,3,4'],
        ]);
    }
}
