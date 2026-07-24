<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Nullable a propósito: si no se asigna nada, el usuario sigue viendo
     * el almacén por defecto global (Ajustes), exactamente como hoy. Solo
     * cuando se le asigna uno puntual a un usuario, el POS respeta ese en
     * vez del global.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('default_warehouse_id')->nullable();
            $table->foreign('default_warehouse_id')
                ->references('id')->on('warehouses')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['default_warehouse_id']);
            $table->dropColumn('default_warehouse_id');
        });
    }
};
