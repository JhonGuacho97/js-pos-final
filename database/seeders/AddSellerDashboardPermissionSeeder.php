<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class AddSellerDashboardPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Se ejecuta automaticamente desde DatabaseSeeder.
     */
    public function run(): void
    {
        // Si ya habías corrido una versión anterior de este seeder (con el
        // nombre viejo "manage_seller_dashboard") y se lo asignaste a un
        // rol, esto lo renombra en el lugar -- así el rol no pierde el
        // permiso que ya le habías dado.
        $oldPermission = Permission::whereName('manage_seller_dashboard')->first();
        if ($oldPermission) {
            $oldPermission->update([
                'name' => 'manage_my-sales',
                'display_name' => 'Manage Seller Dashboard',
            ]);
            app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

            return;
        }

        $permissionExist = Permission::whereName('manage_my-sales')->exists();
        if (! $permissionExist) {
            Permission::create([
                'name' => 'manage_my-sales',
                'display_name' => 'Manage Seller Dashboard',
            ]);
        }
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
