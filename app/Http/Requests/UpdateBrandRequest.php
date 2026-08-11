<?php

namespace App\Http\Requests;

use App\Models\Brand;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBrandRequest extends FormRequest
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
        $rules = Brand::$rules;
        $rules['name'] = [
            'required',
            Rule::unique('brands', 'name')
                ->where(fn ($query) => $query->where('store_id', currentStoreId()))
                ->ignore($this->route('id')),
        ];

        return $rules;
    }
}
