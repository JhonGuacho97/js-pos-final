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
            'manage_cash_control' => 'Manage Cash Control',
            'reverse_cash_movement' => 'Reverse Cash Movement',
            'transfer_cash' => 'Transfer Cash',
            'review_cash_closure' => 'Review Cash Closure',
        ])->map(fn ($displayName, $name) => Permission::firstOrCreate(
            ['name' => $name], ['display_name' => $displayName]
        ));

        if ($admin = Role::whereName(Role::ADMIN)->first()) {
            $admin->givePermissionTo($permissions);
        }
    }
}
