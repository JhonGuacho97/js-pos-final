<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class AddKardexPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Corre con: php artisan db:seed --class=AddKardexPermissionSeeder
     * Después, asigna el permiso desde Roles/Permisos al rol que
     * corresponda.
     */
    public function run(): void
    {
        $permissionExist = Permission::whereName('manage_kardex')->exists();
        if (! $permissionExist) {
            Permission::create([
                'name' => 'manage_kardex',
                'display_name' => 'Manage Kardex',
            ]);
        }
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
