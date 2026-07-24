<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * IMPORTANTE: 'quantity' en sale_items / purchase_items sigue significando
     * SIEMPRE unidades base (igual que hoy), para no romper reportes, stock,
     * devoluciones, transferencias, etc. Las columnas nuevas son solo trazabilidad:
     * qué presentación eligió el cajero y cuánto vendía esa presentación,
     * para poder reimprimir/mostrar "2 Cajas" en vez de "48 unidades".
     */
    public function up(): void
    {
        Schema::table('sale_items', function (Blueprint $table) {
            $table->unsignedBigInteger('product_presentation_id')->nullable()->after('product_id');
            $table->decimal('presentation_quantity', 15, 4)->nullable()->after('quantity');
            $table->decimal('presentation_equivalence', 15, 4)->nullable()->after('presentation_quantity');

            $table->foreign('product_presentation_id')->references('id')->on('product_presentations')->onDelete('set null');
        });

        Schema::table('purchase_items', function (Blueprint $table) {
            $table->unsignedBigInteger('product_presentation_id')->nullable()->after('product_id');
            $table->decimal('presentation_quantity', 15, 4)->nullable()->after('quantity');
            $table->decimal('presentation_equivalence', 15, 4)->nullable()->after('presentation_quantity');

            $table->foreign('product_presentation_id')->references('id')->on('product_presentations')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sale_items', function (Blueprint $table) {
            $table->dropForeign(['product_presentation_id']);
            $table->dropColumn(['product_presentation_id', 'presentation_quantity', 'presentation_equivalence']);
        });

        Schema::table('purchase_items', function (Blueprint $table) {
            $table->dropForeign(['product_presentation_id']);
            $table->dropColumn(['product_presentation_id', 'presentation_quantity', 'presentation_equivalence']);
        });
    }
};
