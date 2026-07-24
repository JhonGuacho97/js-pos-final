<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Cuando el cierre no cuadra (sobrante o faltante), el cajero puede
     * dejar registrado el motivo -- para que quien revise el reporte después
     * no tenga que adivinar por qué faltó o sobró dinero.
     */
    public function up(): void
    {
        Schema::table('pos_register', function (Blueprint $table) {
            $table->string('discrepancy_reason')->nullable()->after('closing_denominations');
            $table->text('discrepancy_note')->nullable()->after('discrepancy_reason');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pos_register', function (Blueprint $table) {
            $table->dropColumn(['discrepancy_reason', 'discrepancy_note']);
        });
    }
};
