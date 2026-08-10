<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Artisan;

/**
 * Agrega el permiso manage_stores (pantalla nueva de administración de
 * tiendas) y lo sincroniza al rol admin -- misma seeder idempotente que
 * ya se usa para esto, ver 2026_08_08_000001_consolidate_and_sync_permissions.php.
 */
return new class extends Migration
{
    public function up(): void
    {
        Artisan::call('db:seed', ['--class' => 'EnsureAllPermissionsSyncedSeeder', '--force' => true]);
    }

    public function down(): void
    {
        //
    }
};
