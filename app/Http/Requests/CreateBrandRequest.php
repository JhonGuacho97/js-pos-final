<?php

namespace App\Http\Requests;

use App\Models\Brand;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateBrandRequest extends FormRequest
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
        // Brand::$rules trae 'unique:brands' global -- el unique real en
        // BD es compuesto (store_id, name) desde harden_store_scoped_
        // constraints, así que crear "Bebidas" en la tienda B fallaba
        // con "already taken" apenas ese nombre ya existía en la tienda
        // A. Mismo fix que CreateRoleRequest.
        $rules = Brand::$rules;
        $rules['name'] = [
            'required',
            Rule::unique('brands', 'name')->where(fn ($query) => $query->where('store_id', currentStoreId())),
        ];

        return $rules;
    }
}
