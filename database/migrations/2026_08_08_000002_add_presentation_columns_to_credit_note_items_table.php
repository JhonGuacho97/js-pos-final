<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Mismo patrón que 2026_07_01_195100_add_presentation_columns_to_items_tables.php
 * (sale_items / purchase_items) -- credit_note_items se quedó fuera de ese
 * cambio y por eso nunca aplicaba la equivalencia de presentación al
 * devolver un producto vendido por caja/six-pack/etc.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('credit_note_items', function (Blueprint $table) {
            $table->unsignedBigInteger('product_presentation_id')->nullable()->after('product_id');
            $table->decimal('presentation_quantity', 15, 4)->nullable()->after('quantity');
            $table->decimal('presentation_equivalence', 15, 4)->nullable()->after('presentation_quantity');

            $table->foreign('product_presentation_id')->references('id')->on('product_presentations')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('credit_note_items', function (Blueprint $table) {
            $table->dropForeign(['product_presentation_id']);
            $table->dropColumn(['product_presentation_id', 'presentation_quantity', 'presentation_equivalence']);
        });
    }
};
