<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Sub-alcance OPCIONAL dentro de una tienda a la que el usuario ya tiene
 * acceso (user_store). Reemplaza a users.default_warehouse_id (relación
 * 1-a-1) por una relación N-a-N real, preservando la misma semántica que
 * ya existe hoy: cero filas para un usuario en una tienda = ve todas las
 * sucursales de esa tienda (igual que default_warehouse_id = null
 * actualmente); una o más filas = restringido a esas sucursales exactas.
 *
 * default_warehouse_id en `users` NO se elimina en esta migración -- se
 * deja intacto y se migra su valor a esta tabla en la Fase 2, para no
 * romper el comportamiento actual (AppBaseController::
 * restrictedWarehouseId()) hasta que el código que lo reemplaza esté
 * implementado y probado.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_warehouse', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('warehouse_id');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('warehouse_id')->references('id')->on('warehouses')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->unique(['user_id', 'warehouse_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_warehouse');
    }
};
