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
        Schema::table('sale_items', function (Blueprint $table) {
            $table->decimal('catalog_price', 16, 4)->nullable()->after('product_price');
            $table->string('price_override_reason', 120)->nullable()->after('catalog_price');
            $table->foreignId('price_overridden_by')->nullable()->after('price_override_reason')
                ->constrained('users')->nullOnDelete();
        });

        $permission = Permission::firstOrCreate(
            ['name' => 'override_pos_price', 'guard_name' => 'web'],
            ['display_name' => 'Modificar precio en el POS']
        );

        $originalStoreId = getPermissionsTeamId();
        Role::where('name', Role::ADMIN)->get()->each(function (Role $role) use ($permission) {
            setPermissionsTeamId($role->store_id);
            $role->givePermissionTo($permission);
        });
        setPermissionsTeamId($originalStoreId);

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function down(): void
    {
        Schema::table('sale_items', function (Blueprint $table) {
            $table->dropConstrainedForeignId('price_overridden_by');
            $table->dropColumn(['catalog_price', 'price_override_reason']);
        });

        // El permiso no se elimina: puede estar asignado legítimamente a roles.
    }
};
