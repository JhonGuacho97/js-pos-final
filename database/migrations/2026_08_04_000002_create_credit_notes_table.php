<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('credit_notes', function (Blueprint $table) {
            $table->id();
            $table->date('date');

            // Documento que se está corrigiendo -- toda nota de
            // crédito referencia siempre a un comprobante original.
            $table->unsignedBigInteger('sale_id');
            $table->foreign('sale_id')->references('id')
                ->on('sales')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            // Guardados aparte (no recalculados desde sale_id) para que
            // la nota de crédito quede con una foto fija de a qué
            // comprobante corregía, aunque la venta original cambie.
            $table->string('tipo_comprobante_modificado')->default('FACTURA');
            $table->string('numero_comprobante_modificado')->nullable();

            $table->unsignedBigInteger('customer_id');
            $table->foreign('customer_id')->references('id')
                ->on('customers')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            // Solo se usa si el concepto implica devolución física de
            // mercadería -- para otros conceptos (descuento, corrección
            // de precio, error) queda vacío y no se toca stock.
            $table->unsignedBigInteger('warehouse_id')->nullable();
            $table->foreign('warehouse_id')->references('id')
                ->on('warehouses')
                ->onUpdate('cascade')
                ->onDelete('set null');

            $table->unsignedBigInteger('credit_note_category_id')->nullable();
            $table->foreign('credit_note_category_id')->references('id')
                ->on('credit_note_categories')
                ->onUpdate('cascade')
                ->onDelete('set null');

            $table->string('vendedor')->nullable();

            // SALDO = se aplica contra lo pendiente de esa factura.
            // ANTICIPO = queda como saldo a favor del cliente.
            $table->string('generar_como')->default('SALDO');

            // POR_DEVOLUCION = ajusta stock. Los demás (DESCUENTO,
            // CORRECCION_PRECIO, ERROR_FACTURACION, OTRO) no tocan stock.
            $table->string('concepto')->default('POR_DEVOLUCION');
            $table->text('motivo');

            $table->double('tax_rate')->nullable();
            $table->double('tax_amount')->nullable();
            $table->double('discount')->nullable();
            $table->double('shipping')->nullable();
            $table->double('grand_total')->nullable();
            $table->integer('status')->nullable();
            $table->text('note')->nullable();
            $table->string('reference_code')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('credit_notes');
    }
};
