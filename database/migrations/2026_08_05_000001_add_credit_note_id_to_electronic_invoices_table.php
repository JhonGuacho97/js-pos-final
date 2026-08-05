<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('electronic_invoices', function (Blueprint $table) {
            // Nullable -- Factura y Nota de Débito siguen usando solo
            // sale_id como hasta ahora. Solo se completa para Nota de
            // Crédito, donde hace falta para diferenciar cuál
            // comprobante corresponde a cuál nota específica cuando
            // una misma factura tiene varias notas de crédito (sale_id
            // + tipo_comprobante ya no alcanza para identificarla).
            $table->unsignedBigInteger('credit_note_id')->nullable()->after('sale_id');
            $table->foreign('credit_note_id')
                ->references('id')
                ->on('credit_notes')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('electronic_invoices', function (Blueprint $table) {
            $table->dropForeign(['credit_note_id']);
            $table->dropColumn('credit_note_id');
        });
    }
};
