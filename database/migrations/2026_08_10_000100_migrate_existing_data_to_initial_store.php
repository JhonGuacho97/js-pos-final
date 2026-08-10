<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Artisan;

/**
 * Fase 2 de la migración multitienda. Ver
 * database/seeders/MigrateToInitialStoreSeeder.php para el detalle
 * completo de qué se migra y por qué. Sin down() real -- es una
 * migración de DATOS, no de esquema; revertir "quién pertenece a qué
 * tienda" de forma segura y genérica no es posible una vez que puede
 * haber datos NUEVOS ya asociados a la store creada acá (ver el mismo
 * patrón en 2026_08_08_000001_consolidate_and_sync_permissions.php).
 */
return new class extends Migration
{
    public function up(): void
    {
        Artisan::call('db:seed', ['--class' => 'MigrateToInitialStoreSeeder', '--force' => true]);
    }

    public function down(): void
    {
        //
    }
};
