<?php

namespace App\Http\Requests;

use App\Models\ProductCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductCategoryRequest extends FormRequest
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
        $rules = ProductCategory::$rules;
        $rules['name'] = [
            'required',
            Rule::unique('product_categories', 'name')
                ->where(fn ($query) => $query->where('store_id', currentStoreId()))
                ->ignore($this->route('product_category')),
        ];

        return $rules;
    }
}
