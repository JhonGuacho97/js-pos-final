<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Hoy el selector de "Unidad de venta" en Presentaciones junta TODAS
     * las variantes de TODOS los grupos (tallas, colores, presentaciones,
     * lo que sea) en una sola lista larga. Este campo deja marcar cuáles
     * grupos son específicamente para presentaciones de venta (ej. "Caja",
     * "Six Pack", "Unidad"), para poder filtrar esa lista y que no crezca
     * sin control a medida que se agregan más variantes de otro tipo.
     */
    public function up(): void
    {
        Schema::table('variations', function (Blueprint $table) {
            $table->boolean('is_presentation')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('variations', function (Blueprint $table) {
            $table->dropColumn('is_presentation');
        });
    }
};
