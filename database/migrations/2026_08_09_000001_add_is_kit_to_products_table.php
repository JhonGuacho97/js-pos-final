<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Un kit/combo (ej. "Pack Cerveza + Michelada") es un producto
            // normal en todo lo demás (precio, impuesto, código) pero no
            // tiene stock propio -- su disponibilidad se calcula en vivo a
            // partir de sus componentes (ver product_kit_items) y su venta
            // descuenta stock de esos componentes, no de sí mismo.
            $table->boolean('is_kit')->default(false)->after('manage_presentations');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('is_kit');
        });
    }
};
