<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * El índice único electronic_invoices_tipo_secuencial_unique (ver
 * 2026_08_08_000004_add_unique_secuencial_index_to_electronic_invoices)
 * es sobre (tipo_comprobante, secuencial) SOLO -- asumía una única
 * tienda emitiendo, donde un secuencial repetido siempre era un bug.
 *
 * Con SriXmlService::proximoSecuencial() ahora calculando el secuencial
 * POR TIENDA (cada tienda tiene su propio RUC/estab/pto_emi ante el
 * SRI -- ver SriConfigService::get()), es exactamente correcto que la
 * Tienda A y la Tienda B tengan cada una su propia factura
 * "000000001" -- son numeraciones independientes. El índice viejo
 * rechazaría esa segunda fila como si fuera un duplicado real.
 *
 * store_id nullable en el índice: MySQL no exige unicidad entre NULLs
 * en un índice único, así que comprobantes históricos previos a que
 * existiera esta columna (si los hubiera) no chocan entre sí -- no es
 * el caso ideal, pero preserva el comportamiento de antes para esas
 * filas en vez de romper una migración en instalaciones con datos
 * viejos.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('electronic_invoices', function (Blueprint $table) {
            $table->dropUnique('electronic_invoices_tipo_secuencial_unique');
            $table->unique(
                ['store_id', 'tipo_comprobante', 'secuencial'],
                'electronic_invoices_store_tipo_secuencial_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::table('electronic_invoices', function (Blueprint $table) {
            $table->dropUnique('electronic_invoices_store_tipo_secuencial_unique');
            $table->unique(['tipo_comprobante', 'secuencial'], 'electronic_invoices_tipo_secuencial_unique');
        });
    }
};
