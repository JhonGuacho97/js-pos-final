<?php

use App\Models\Role;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

return new class extends Migration
{
    public function up(): void
    {
        $previousPermissionCount = Permission::count();
        $unrestrictedRoleIds = $previousPermissionCount > 0
            ? Role::withCount('permissions')
                ->having('permissions_count', '>=', $previousPermissionCount)
                ->pluck('id')
            : collect();

        Schema::create('customer_password_reset_tokens', function (Blueprint $table) {
            $table->foreignId('store_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('email');
            $table->string('token');
            $table->timestamp('created_at')->nullable();

            $table->primary(['store_id', 'email']);
            $table->index('created_at');
        });

        $permissions = collect([
            'change_user_passwords' => 'Cambiar contraseñas de usuarios',
            'change_customer_passwords' => 'Cambiar contraseñas de clientes',
        ])->map(fn ($displayName, $name) => Permission::firstOrCreate(
            ['name' => $name, 'guard_name' => 'web'],
            ['display_name' => $displayName]
        ));

        Role::whereIn('id', $unrestrictedRoleIds)
            ->orWhere('name', Role::ADMIN)
            ->get()
            ->each(
            fn (Role $role) => $role->givePermissionTo($permissions)
        );

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_password_reset_tokens');

        Permission::whereIn('name', [
            'change_user_passwords',
            'change_customer_passwords',
        ])->delete();

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
};
