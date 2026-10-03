<?php

namespace App\Http\Requests;

use App\Models\Customer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCustomerRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $email = trim((string) $this->input('email', ''));

        if ($email === '' || in_array(strtoupper($email), ['N/A', 'NA', 'NO APLICA', 'SIN CORREO', '-'], true)) {
            $email = null;
        }

        $this->merge(['email' => $email]);
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $routeCustomer = $this->route('customer');
        $customer = $routeCustomer instanceof Customer
            ? $routeCustomer
            : Customer::find($routeCustomer);
        $id = $customer?->id ?? $routeCustomer;
        $rules = Customer::$rules;

        $rules['email'] = [
            'nullable',
            'string',
            'max:255',
            Rule::unique('customers', 'email')
                ->where(fn ($query) => $query->where('store_id', currentStoreId()))
                ->ignore($id),
        ];
        $rules['phone'] = ['nullable', 'string', 'max:50'];
        $rules['identification'] = [
            'nullable',
            Rule::unique('customers', 'identification')
                ->where(fn ($query) => $query->where('store_id', currentStoreId()))
                ->ignore($id),
        ];
        // El correo del registro comercial puede quedar vacío o contener una
        // referencia como "N/A". La unicidad de acceso al catálogo solo
        // corresponde cuando el valor sí es una dirección válida.
        if (filter_var($this->input('email'), FILTER_VALIDATE_EMAIL)) {
            $rules['email'][] = Rule::unique('customer_accounts', 'email')
                ->where(fn ($query) => $query->where('store_id', currentStoreId()))
                ->ignore($customer?->account()->value('id'));
        }

        return $rules;
    }
}
