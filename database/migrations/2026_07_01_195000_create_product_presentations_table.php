<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Flag opcional en products: activa/desactiva el uso de presentaciones
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('manage_presentations')->default(false)->after('quantity_limit');
        });

        Schema::create('product_presentations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');

            // Reutiliza el catálogo de nombres ya existente (Unidad, Caja, Six Pack...)
            // en vez de duplicarlo. No participa en la relación producto<->variante de stock.
            $table->unsignedBigInteger('variation_type_id');

            // Cuántas unidades base representa esta presentación (ej: Caja = 24)
            $table->decimal('equivalence', 15, 4)->default(1);

            // Precio propio de la presentación (NO se calcula multiplicando)
            $table->decimal('price', 15, 4);

            // Marca cuál presentación es la "unidad base" de inventario.
            // Necesario para que el motor de stock sepa programáticamente
            // cuál es la referencia de 1 unidad, sin inferirlo del nombre.
            $table->boolean('is_base_unit')->default(false);

            $table->boolean('is_default')->default(false);
            $table->integer('sort')->default(0);
            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->foreign('variation_type_id')->references('id')->on('variation_types')->onDelete('cascade');

            // Un producto no puede tener la misma presentación (ej. "Caja") dos veces
            $table->unique(['product_id', 'variation_type_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_presentations');

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('manage_presentations');
        });
    }
};
