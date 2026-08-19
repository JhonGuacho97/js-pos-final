<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class AddSriConfigPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Se ejecuta automaticamente desde DatabaseSeeder.
     */
    public function run(): void
    {
        $permissionExist = Permission::whereName('manage_sri_config')->exists();
        if (! $permissionExist) {
            Permission::create([
                'name' => 'manage_sri_config',
                'display_name' => 'Manage SRI Configuration',
            ]);
        }
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
