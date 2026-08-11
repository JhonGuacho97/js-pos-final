<?php

namespace App\Http\Requests;

use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateRoleRequest extends FormRequest
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
        // Role::$rules trae 'unique:roles' a secas (global) -- pero en
        // modo teams el mismo nombre de rol existe legítimamente una
        // vez POR TIENDA (ver Role::unrestrictedRoleIds(), roles
        // 'admin'/'Vendedorr' repetidos con distinto store_id). Sin
        // este where, crear/editar un rol en la tienda activa fallaba
        // con "The name has already been taken" apenas ESE MISMO
        // nombre ya existía en OTRA tienda -- coincide con el unique
        // compuesto real en BD (store_id, name, guard_name), ver
        // harden_store_scoped_constraints.
        $rules = Role::$rules;
        $rules['name'] = [
            'required',
            Rule::unique('roles', 'name')->where(fn ($query) => $query->where('store_id', currentStoreId())),
        ];

        return $rules;
    }

    /**
     * @return string[]
     */
    public function messages(): array
    {
        return [
            'permissions.required' => 'Please select any permission',
        ];
    }
}
