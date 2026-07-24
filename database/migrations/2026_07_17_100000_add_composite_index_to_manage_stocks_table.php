<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * product_id y warehouse_id ya estaban indexados por separado (vienen
     * de las llaves foráneas), pero la consulta que más se repite en todo
     * el sistema (cargar productos de UN almacén puntual, en POS/Compras/
     * Productos) los filtra a los DOS juntos -- un índice compuesto ahí
     * es mucho más rápido que dos índices sueltos, sobre todo con
     * catálogos grandes.
     */
    public function up(): void
    {
        Schema::table('manage_stocks', function (Blueprint $table) {
            $table->index(['product_id', 'warehouse_id'], 'manage_stocks_product_warehouse_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('manage_stocks', function (Blueprint $table) {
            $table->dropIndex('manage_stocks_product_warehouse_index');
        });
    }
};
