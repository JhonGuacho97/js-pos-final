<?php

namespace App\Http\Requests;

use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoleRequest extends FormRequest
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
        // unique:roles,name,{id} a secas (global, sin store_id) fallaba
        // con "The name has already been taken" apenas se editaba un
        // rol cuyo nombre YA existía en OTRA tienda -- que es el caso
        // normal en modo teams (ver Role::unrestrictedRoleIds(): 'admin'
        // y 'Vendedorr' existen una vez por tienda a propósito). Mismo
        // fix que CreateRoleRequest, agregando el where por store_id
        // real de la fila -- necesario para no chocar contra la fila
        // que se está editando (con nombre sin cambios, ->ignore() ya
        // la excluye, pero el where por store_id sigue haciendo falta
        // para no comparar contra otras tiendas).
        $rules = Role::$rules;
        $rules['name'] = [
            'required',
            Rule::unique('roles', 'name')
                ->where(fn ($query) => $query->where('store_id', currentStoreId()))
                ->ignore($this->route('role.id')),
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
