<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Costo de UNA presentación completa (ej. costo de la caja de 24), no
     * por unidad -- simétrico con product_presentations.price, que ya
     * guarda el precio de la presentación completa.
     *
     * Nullable a propósito: si no se llena, el margen se calcula con el
     * costo del producto base × la equivalencia (ver
     * ProductPresentation::effectiveCost()). Solo hace falta llenarlo
     * cuando el costo real difiere de esa cuenta simple (ej. descuento
     * por volumen al comprar por caja).
     */
    public function up(): void
    {
        Schema::table('product_presentations', function (Blueprint $table) {
            $table->decimal('cost', 15, 4)->nullable()->after('price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_presentations', function (Blueprint $table) {
            $table->dropColumn('cost');
        });
    }
};
