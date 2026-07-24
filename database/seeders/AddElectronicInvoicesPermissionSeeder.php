<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class AddElectronicInvoicesPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Corre con: php artisan db:seed --class=AddElectronicInvoicesPermissionSeeder
     * Después, asigna el permiso desde Roles/Permisos al rol que
     * corresponda (por ejemplo, Admin o Contador).
     */
    public function run(): void
    {
        $permissionExist = Permission::whereName('manage_electronic_invoices')->exists();
        if (! $permissionExist) {
            Permission::create([
                'name' => 'manage_electronic_invoices',
                'display_name' => 'Manage Electronic Invoices',
            ]);
        }
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
