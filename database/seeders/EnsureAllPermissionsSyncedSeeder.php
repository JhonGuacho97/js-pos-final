<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

/**
 * Consolida todos los permisos referenciados por las rutas de la API
 * (algunos de los cuales solo se crean vía DatabaseSeeder, que no siempre
 * corre en instalaciones existentes) y vuelve a sincronizar TODOS los
 * permisos existentes al rol admin. Idempotente -- segura de correr
 * varias veces y en cualquier instalación (nueva o existente).
 */
class EnsureAllPermissionsSyncedSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'manage_roles' => 'Manage Roles',
            'manage_brands' => 'Manage Brands',
            'manage_currency' => 'Manage Currency',
            'manage_warehouses' => 'Manage Warehouses',
            'manage_units' => 'Manage Units',
            'manage_product_categories' => 'Manage Product Categories',
            'manage_products' => 'Manage Products',
            'manage_suppliers' => 'Manage Suppliers',
            'manage_customers' => 'Manage Customers',
            'manage_users' => 'Manage Users',
            'manage_expense_categories' => 'Manage Expense Categories',
            'manage_expenses' => 'Manage Expenses',
            'manage_adjustments' => 'Manage Adjustments',
            'manage_transfers' => 'Manage Transfers',
            'manage_setting' => 'Manage Setting',
            'manage_dashboard' => 'Manage Dashboard',
            'manage_pos_screen' => 'Manage Pos Screen',
            'manage_purchase' => 'Manage Purchase',
            'manage_sale' => 'Manage Sale',
            'manage_purchase_return' => 'Manage Purchase Return',
            'manage_sale_return' => 'Manage Sale Return',
            'manage_login_logs' => 'Manage Login Logs',
            'manage_language' => 'Manage Language',
        ];

        foreach ($permissions as $name => $displayName) {
            Permission::firstOrCreate(
                ['name' => $name],
                ['display_name' => $displayName]
            );
        }

        /** @var Role $adminRole */
        $adminRole = Role::whereName(Role::ADMIN)->first();

        if (empty($adminRole)) {
            $adminRole = Role::create([
                'name' => 'admin',
                'display_name' => ' Admin',
            ]);
        }

        $allPermissions = Permission::pluck('name', 'id');
        $adminRole->syncPermissions($allPermissions);
    }
}
