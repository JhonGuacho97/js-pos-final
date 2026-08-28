<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class AddCashControlPermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = collect([
            'manage_cash_control' => 'Gestionar control de cajas',
            'view_own_cash_session' => 'Ver mi turno de caja',
            'create_cash_income' => 'Registrar ingreso de caja',
            'create_cash_expense' => 'Registrar egreso de caja',
            'withdraw_cash' => 'Registrar retiro de efectivo',
            'view_cash_supervision' => 'Supervisar turnos y movimientos de cajas abiertas',
            'view_cash_closures' => 'Ver cierres de caja',
            'manage_cash_registers' => 'Gestionar cajas físicas',
            'reverse_cash_movement' => 'Revertir movimiento de caja',
            'transfer_cash' => 'Transferir efectivo entre cajas',
            'review_cash_closure' => 'Revisar cierres de caja',
        ])->map(fn ($displayName, $name) => Permission::updateOrCreate(
            ['name' => $name], ['display_name' => $displayName]
        ));

        if ($admin = Role::whereName(Role::ADMIN)->first()) {
            $admin->givePermissionTo($permissions);
        }
    }
}
