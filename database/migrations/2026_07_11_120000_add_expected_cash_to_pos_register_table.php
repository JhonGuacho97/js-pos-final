<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Guarda cuánto efectivo se ESPERABA en caja al momento del cierre
     * (apertura + ventas en efectivo - devoluciones en efectivo), calculado
     * una sola vez en closeRegister(). Así el reporte puede mostrar la
     * diferencia (sobrante/faltante) de cada registro sin tener que volver
     * a sumar ventas/devoluciones fila por fila cada vez que se abre la
     * tabla de reportes.
     */
    public function up(): void
    {
        Schema::table('pos_register', function (Blueprint $table) {
            $table->decimal('expected_cash', 15, 4)->nullable()->after('cash_in_hand_while_closing');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pos_register', function (Blueprint $table) {
            $table->dropColumn('expected_cash');
        });
    }
};
