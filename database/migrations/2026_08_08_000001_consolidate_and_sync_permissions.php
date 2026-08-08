<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Artisan;

/**
 * Prerequisito para reactivar los middleware `permission:...` en
 * routes/api.php: garantiza que todos los slugs de permiso referenciados
 * por las rutas existan y estén sincronizados con el rol admin, incluso
 * en instalaciones donde nunca se corrió `php artisan db:seed` completo.
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
