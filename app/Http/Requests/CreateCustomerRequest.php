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
    protected function prepareForValidation(): void
    {
        $email = trim((string) $this->input('email', ''));

        if ($email === '' || in_array(strtoupper($email), ['N/A', 'NA', 'NO APLICA', 'SIN CORREO', '-'], true)) {
            $email = null;
        }

        $this->merge(['email' => $email]);
    }

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
            'nullable',
            'string',
            'max:255',
            Rule::unique('customers', 'email')->where(fn ($query) => $query->where('store_id', currentStoreId())),
        ];
        $rules['phone'] = ['nullable', 'string', 'max:50'];
        $rules['identification'] = [
            'nullable',
            Rule::unique('customers', 'identification')->where(fn ($query) => $query->where('store_id', currentStoreId())),
        ];

        return $rules;
    }
}
