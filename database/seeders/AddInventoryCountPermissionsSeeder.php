<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class AddInventoryCountPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        foreach ([
            'view_inventory_counts' => 'View Inventory Counts',
            'perform_inventory_counts' => 'Perform Inventory Counts',
            'approve_inventory_counts' => 'Approve Inventory Counts',
        ] as $name => $displayName) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web'], ['display_name' => $displayName]);
        }
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
