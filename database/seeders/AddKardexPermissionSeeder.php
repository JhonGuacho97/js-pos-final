<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class AddKardexPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Se ejecuta automaticamente desde DatabaseSeeder.
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
