<?php

namespace App\Http\Requests;

use App\Models\ElectronicInvoice;
use App\Models\Sale;
use Illuminate\Foundation\Http\FormRequest;

class OfflineCreateSaleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = Sale::$rules;
        $rules['customer_id'] = ['nullable', 'required_without:offline_customer_uuid', 'exists:customers,id'];
        $rules['offline_customer_uuid'] = ['nullable', 'required_without:customer_id', 'uuid'];
        $rules['requested_electronic_document'] = ['nullable', 'in:' . ElectronicInvoice::FACTURA];

        return $rules;
    }
}
