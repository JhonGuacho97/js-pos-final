<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_kit_items', function (Blueprint $table) {
            $table->id();

            // El producto "kit" (ej. "Pack Cerveza + Michelada").
            $table->unsignedBigInteger('kit_product_id');
            $table->foreign('kit_product_id')->references('id')
                ->on('products')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            // Un producto real, vendible/comprable por separado, que se
            // descuenta de su propio stock cuando se vende el kit.
            $table->unsignedBigInteger('component_product_id');
            $table->foreign('component_product_id')->references('id')
                ->on('products')
                ->onUpdate('cascade')
                ->onDelete('restrict');

            // Cuántas unidades BASE del componente consume 1 unidad del kit.
            $table->decimal('quantity', 15, 4);

            $table->timestamps();

            $table->unique(['kit_product_id', 'component_product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_kit_items');
    }
};
