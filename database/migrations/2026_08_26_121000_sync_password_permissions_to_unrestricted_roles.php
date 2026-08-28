<?php

use App\Models\Role;
use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

return new class extends Migration
{
    public function up(): void
    {
        $newNames = ['change_user_passwords', 'change_customer_passwords'];
        $baselinePermissionCount = Permission::whereNotIn('name', $newNames)->count();
        $permissions = Permission::whereIn('name', $newNames)->get();

        $roles = Role::withCount([
            'permissions as baseline_permissions_count' => fn ($query) => $query->whereNotIn('name', $newNames),
        ])->having('baseline_permissions_count', '>=', $baselinePermissionCount)
            ->get();

        Role::where('name', Role::ADMIN)->get()->each(
            fn (Role $role) => $roles->push($role)
        );

        $roles->unique('id')->each(
            fn (Role $role) => $role->givePermissionTo($permissions)
        );

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function down(): void
    {
        // No se revocan permisos: podrían haber sido asignados manualmente
        // a un rol después de desplegar esta versión.
    }
};
