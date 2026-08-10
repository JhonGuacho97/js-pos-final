<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A qué tiendas puede ACCEDER (ver/operar) un usuario -- distinto de qué
 * ROL tiene en cada una (eso ya lo resuelve Spatie vía model_has_roles
 * + store_id, ver add_teams_support_to_permission_tables). Un usuario
 * sin ninguna fila acá no tiene acceso a ninguna tienda; no hay "ve
 * todo por defecto" a este nivel -- a diferencia de user_warehouse,
 * donde "ninguna fila" sí significa "ve todas las sucursales de sus
 * tiendas" (mismo comportamiento que el actual default_warehouse_id
 * nulo). El acceso a una tienda siempre es explícito.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_store', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('store_id');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('store_id')->references('id')->on('stores')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->unique(['user_id', 'store_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_store');
    }
};
