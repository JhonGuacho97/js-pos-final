<?php

namespace App\Http\Requests;

use App\Models\Supplier;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Class UpdateCustomerRequest
 */
class UpdateSupplierRequest extends FormRequest
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
        $rules = Supplier::$rules;
        $rules['email'] = [
            'required',
            'email',
            Rule::unique('suppliers', 'email')
                ->where(fn ($query) => $query->where('store_id', currentStoreId()))
                ->ignore($this->route('supplier')),
        ];

        return $rules;
    }
}
