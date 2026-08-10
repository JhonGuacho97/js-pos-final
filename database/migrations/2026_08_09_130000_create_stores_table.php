<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Fase 1 de la migración multitienda -- entidad raíz "Store" (negocio/
 * tienda independiente). Todavía no se le agrega ninguna FK desde otras
 * tablas en esta migración (eso se hace en migraciones separadas, una
 * por tabla, para que cada una sea reversible por sí sola).
 *
 * Los datos fiscales (RUC, razón social, certificado SRI, etc.) NO viven
 * acá -- siguen en `settings`, ahora con `store_id` (ver migración
 * add_store_id_to_settings_table), porque esa tabla ya es el mecanismo
 * key-value que usa todo el código existente (SriConfigService, etc.).
 * Esta tabla es solo la identidad mínima de la tienda.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
