<?php

namespace App\Http\Requests;

use App\Models\SalesPayment;
use Illuminate\Foundation\Http\FormRequest;

class CreateSalePaymentRequest extends FormRequest
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
        return array_merge(SalesPayment::$rules, [
            'reference' => ['nullable', 'string', 'max:100', 'required_if:payment_type,3'],
        ]);
    }
}
