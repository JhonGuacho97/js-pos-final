<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Hoy electronic_invoices ni siquiera guarda el estab/pto_emi usados --
 * SriXmlService los vuelve a leer del config global vigente cada vez
 * que se necesita mostrar/reconstruir el comprobante. Eso es un
 * problema incluso sin multitienda (un comprobante ya emitido no debería
 * cambiar retroactivamente de establecimiento si alguien edita el config
 * después), y se vuelve crítico en cuanto exista más de una tienda: sin
 * este snapshot, no habría forma de saber bajo qué RUC/establecimiento
 * se emitió realmente un comprobante histórico.
 *
 * store_id se agrega DENORMALIZADO acá (no solo derivado vía
 * warehouse_id -> warehouses.store_id) para que el futuro índice único
 * de Fase 2 -- (store_id, estab, pto_emi, tipo_comprobante, secuencial)
 * -- no necesite un JOIN. El secuencial hoy es único solo por
 * tipo_comprobante a nivel de TODA la instalación (ver migración
 * 2026_08_08_000004_add_unique_secuencial_index_to_electronic_invoices);
 * ese índice se reemplaza recién en Fase 2, una vez pobladas estas
 * columnas para las filas existentes -- cambiarlo ahora, con las
 * columnas nuevas todavía vacías, quitaría la única protección real
 * contra secuenciales duplicados que existe hoy sin poner nada
 * funcional en su lugar todavía.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('electronic_invoices', function (Blueprint $table) {
            $table->unsignedBigInteger('store_id')->nullable()->after('sale_id');
            $table->unsignedBigInteger('warehouse_id')->nullable()->after('store_id');
            $table->string('estab', 3)->nullable()->after('warehouse_id');
            $table->string('pto_emi', 3)->nullable()->after('estab');

            $table->foreign('store_id')->references('id')->on('stores')
                ->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('warehouse_id')->references('id')->on('warehouses')
                ->onUpdate('cascade')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::table('electronic_invoices', function (Blueprint $table) {
            $table->dropForeign(['store_id']);
            $table->dropForeign(['warehouse_id']);
            $table->dropColumn(['store_id', 'warehouse_id', 'estab', 'pto_emi']);
        });
    }
};
