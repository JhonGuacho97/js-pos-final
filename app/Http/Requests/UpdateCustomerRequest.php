<?php

namespace App\Http\Requests;

use App\Models\Customer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('customer');
        $rules = Customer::$rules;

        $rules['email'] = [
            'required',
            'email',
            Rule::unique('customers', 'email')
                ->where(fn ($query) => $query->where('store_id', currentStoreId()))
                ->ignore($id),
        ];
        $rules['identification'] = [
            'nullable',
            Rule::unique('customers', 'identification')
                ->where(fn ($query) => $query->where('store_id', currentStoreId()))
                ->ignore($id),
        ];

        return $rules;
    }
}