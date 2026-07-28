<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Antes, borrar una Sale borraba en cascada su ElectronicInvoice --
     * eso hacía que el sistema "olvidara" que ese secuencial ya se le
     * había mandado al SRI, y el siguiente intento volvía a chocar con
     * "ERROR SECUENCIAL REGISTRADO". Más importante todavía: una factura
     * ya autorizada por el SRI es un documento fiscal -- no debería
     * poder desaparecer solo porque se borró la venta que la originó.
     *
     * Ahora: sale_id queda nullable, y borrar la venta solo desvincula
     * la factura electrónica (la deja en null), sin borrar su historial.
     */
    public function up(): void
    {
        Schema::table('electronic_invoices', function (Blueprint $table) {
            $table->dropForeign(['sale_id']);
        });

        Schema::table('electronic_invoices', function (Blueprint $table) {
            $table->unsignedBigInteger('sale_id')->nullable()->change();
        });

        Schema::table('electronic_invoices', function (Blueprint $table) {
            $table->foreign('sale_id')
                ->references('id')
                ->on('sales')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('electronic_invoices', function (Blueprint $table) {
            $table->dropForeign(['sale_id']);
        });

        Schema::table('electronic_invoices', function (Blueprint $table) {
            $table->unsignedBigInteger('sale_id')->nullable(false)->change();
        });

        Schema::table('electronic_invoices', function (Blueprint $table) {
            $table->foreign('sale_id')
                ->references('id')
                ->on('sales')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }
};
