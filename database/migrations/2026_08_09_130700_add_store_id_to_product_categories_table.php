<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// product_categories.name sigue con unique GLOBAL en esta fase (dos
// tiendas no podrían tener cada una una categoría "Bebidas" todavía).
// Se reemplaza por unique(store_id, name) en Fase 2, una vez poblado
// store_id -- mismo motivo que la primary key de Spatie (no se puede
// re-scopear un índice único usando una columna aún sin backfillear).
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_categories', function (Blueprint $table) {
            $table->unsignedBigInteger('store_id')->nullable()->after('id');
            $table->foreign('store_id')->references('id')->on('stores')
                ->onUpdate('cascade')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::table('product_categories', function (Blueprint $table) {
            $table->dropForeign(['store_id']);
            $table->dropColumn('store_id');
        });
    }
};
