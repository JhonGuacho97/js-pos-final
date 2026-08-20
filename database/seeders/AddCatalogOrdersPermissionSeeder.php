<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class AddCatalogOrdersPermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permission = Permission::firstOrCreate(
            ['name' => 'manage_catalog_orders'],
            ['display_name' => 'Manage Catalog Orders']
        );

        app(PermissionRegistrar::class)->forgetCachedPermissions();
        Role::where('name', Role::ADMIN)->get()->each(
            fn (Role $role) => $role->givePermissionTo($permission)
        );
    }
}
