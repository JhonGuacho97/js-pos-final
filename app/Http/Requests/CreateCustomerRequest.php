<?php

namespace App\Http\Requests;

use App\Models\Customer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Class CreateCustomerRequest
 */
class CreateCustomerRequest extends FormRequest
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
        $rules = Customer::$rules;
        $rules['email'] = [
            'required',
            'email',
            Rule::unique('customers', 'email')->where(fn ($query) => $query->where('store_id', currentStoreId())),
        ];
        $rules['identification'] = [
            'nullable',
            Rule::unique('customers', 'identification')->where(fn ($query) => $query->where('store_id', currentStoreId())),
        ];

        return $rules;
    }
}
