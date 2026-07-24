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
        Schema::create('presentation_warehouse_prices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_presentation_id');
            $table->unsignedBigInteger('warehouse_id');
            $table->decimal('price', 15, 4);
            $table->timestamps();

            $table->foreign('product_presentation_id', 'presentation_wh_prices_presentation_foreign')
                ->references('id')->on('product_presentations')->onDelete('cascade');
            $table->foreign('warehouse_id', 'presentation_wh_prices_warehouse_foreign')
                ->references('id')->on('warehouses')->onDelete('cascade');

            // Una presentación solo puede tener UN precio override por sucursal.
            $table->unique(['product_presentation_id', 'warehouse_id'], 'presentation_wh_prices_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presentation_warehouse_prices');
    }
};
