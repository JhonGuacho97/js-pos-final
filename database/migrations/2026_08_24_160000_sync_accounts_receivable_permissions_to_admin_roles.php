<?php

use App\Models\Role;
use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

return new class extends Migration
{
    public function up(): void
    {
        $permissions = Permission::whereIn('name', [
            'view_accounts_receivable',
            'collect_accounts_receivable',
            'manage_accounts_receivable',
        ])->get();

        Role::where('name', Role::ADMIN)->get()->each(
            fn (Role $role) => $role->givePermissionTo($permissions)
        );

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function down(): void
    {
        // No se revocan permisos al revertir: podrían haber sido asignados
        // legítimamente antes de esta migración.
    }
};
