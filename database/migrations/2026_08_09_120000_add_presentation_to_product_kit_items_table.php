<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_kit_items', function (Blueprint $table) {
            // Presentación específica del componente elegida para la
            // receta (ej. "Heineken 330ml -- Caja") -- opcional, un
            // componente sin presentaciones (o donde no se eligió una)
            // sigue funcionando en unidades base, como antes.
            $table->unsignedBigInteger('component_product_presentation_id')->nullable()->after('component_product_id');
            $table->foreign('component_product_presentation_id')->references('id')
                ->on('product_presentations')
                ->onUpdate('cascade')
                ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::table('product_kit_items', function (Blueprint $table) {
            $table->dropForeign(['component_product_presentation_id']);
            $table->dropColumn('component_product_presentation_id');
        });
    }
};
