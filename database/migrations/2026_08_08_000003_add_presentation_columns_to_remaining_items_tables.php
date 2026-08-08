<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Mismo patrón que 2026_07_01_195100_add_presentation_columns_to_items_tables.php
 * (sale_items / purchase_items) y 2026_08_08_000002_..._credit_note_items...
 * -- transferencias, devoluciones y ajustes se quedaron fuera de esos
 * cambios y por eso nunca aplicaban la equivalencia de presentación.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transfer_items', function (Blueprint $table) {
            $table->unsignedBigInteger('product_presentation_id')->nullable()->after('product_id');
            $table->decimal('presentation_quantity', 15, 4)->nullable()->after('quantity');
            $table->decimal('presentation_equivalence', 15, 4)->nullable()->after('presentation_quantity');
            $table->foreign('product_presentation_id')->references('id')->on('product_presentations')->onDelete('set null');
        });

        Schema::table('sale_return_items', function (Blueprint $table) {
            $table->unsignedBigInteger('product_presentation_id')->nullable()->after('product_id');
            $table->decimal('presentation_quantity', 15, 4)->nullable()->after('quantity');
            $table->decimal('presentation_equivalence', 15, 4)->nullable()->after('presentation_quantity');
            $table->foreign('product_presentation_id')->references('id')->on('product_presentations')->onDelete('set null');
        });

        Schema::table('purchases_return_items', function (Blueprint $table) {
            $table->unsignedBigInteger('product_presentation_id')->nullable()->after('product_id');
            $table->decimal('presentation_quantity', 15, 4)->nullable()->after('quantity');
            $table->decimal('presentation_equivalence', 15, 4)->nullable()->after('presentation_quantity');
            $table->foreign('product_presentation_id')->references('id')->on('product_presentations')->onDelete('set null');
        });

        Schema::table('adjustment_items', function (Blueprint $table) {
            $table->unsignedBigInteger('product_presentation_id')->nullable()->after('product_id');
            $table->decimal('presentation_quantity', 15, 4)->nullable()->after('quantity');
            $table->decimal('presentation_equivalence', 15, 4)->nullable()->after('presentation_quantity');
            $table->foreign('product_presentation_id')->references('id')->on('product_presentations')->onDelete('set null');
        });
    }

    public function down(): void
    {
        foreach (['transfer_items', 'sale_return_items', 'purchases_return_items', 'adjustment_items'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropForeign(['product_presentation_id']);
                $table->dropColumn(['product_presentation_id', 'presentation_quantity', 'presentation_equivalence']);
            });
        }
    }
};
