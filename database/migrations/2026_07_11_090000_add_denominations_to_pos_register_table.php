<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Guarda el conteo de billetes/monedas de apertura y cierre de caja.
     * Se guarda como JSON (en vez de una tabla aparte) porque siempre viaja
     * junto a su registro de caja, nunca se consulta suelto, y su forma
     * (lista de {value, quantity, subtotal}) no necesita normalizarse.
     * Formato: [{"value": 20, "quantity": 2, "subtotal": 40}, ...]
     */
    public function up(): void
    {
        Schema::table('pos_register', function (Blueprint $table) {
            $table->json('opening_denominations')->nullable()->after('cash_in_hand');
            $table->json('closing_denominations')->nullable()->after('cash_in_hand_while_closing');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pos_register', function (Blueprint $table) {
            $table->dropColumn(['opening_denominations', 'closing_denominations']);
        });
    }
};
