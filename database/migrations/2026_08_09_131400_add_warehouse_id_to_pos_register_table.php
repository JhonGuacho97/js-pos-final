<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * pos_register nunca tuvo warehouse_id -- hoy la caja solo se ata a
 * user_id. Esto es un gap real e independiente de multitienda (dos
 * aperturas simultáneas del mismo usuario en dos sucursales ya no se
 * podrían distinguir), no solo un requisito nuevo. Nullable por ahora:
 * el back-fill de las cajas ya cerradas (Fase 2) no tiene una fuente de
 * verdad 100% confiable -- se infiere de warehouse_id de las ventas
 * hechas durante esa sesión, y puede quedar NULL si una caja no tuvo
 * ninguna venta asociada.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pos_register', function (Blueprint $table) {
            $table->unsignedBigInteger('warehouse_id')->nullable()->after('user_id');
            $table->foreign('warehouse_id')->references('id')->on('warehouses')
                ->onUpdate('cascade')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::table('pos_register', function (Blueprint $table) {
            $table->dropForeign(['warehouse_id']);
            $table->dropColumn('warehouse_id');
        });
    }
};
