<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A diferencia de las demás migraciones add_store_id_to_*, acá
 * store_id se queda nullable PERMANENTEMENTE (no es un nullable
 * temporal hasta la Fase 2): una fila con store_id = NULL es el valor
 * de sistema/legacy (fallback), una fila con store_id puesto es el
 * override específico de esa tienda. Se elige extender la tabla
 * existente en vez de crear una `store_settings` nueva porque
 * Setting::pluck('value','key') y Setting::where('key', ...) se usan en
 * decenas de puntos del código (SriConfigService, SettingRepository,
 * etc.) -- agregar una columna filtrable es mucho menos invasivo que
 * migrar todo ese acceso a una tabla distinta.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->unsignedBigInteger('store_id')->nullable()->after('id');
            $table->foreign('store_id')->references('id')->on('stores')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->index(['store_id', 'key']);
        });
    }

    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            // Orden obligatorio en MySQL: primero la FK (el índice la
            // sostiene, no se puede borrar el índice mientras la FK lo
            // use), después el índice compuesto (si no, Mysql no lo
            // borra al dropear store_id -- lo demueve a un índice de una
            // sola columna pero conservando el nombre autogenerado
            // original, que después choca si la migración se re-corre),
            // y recién al final la columna.
            $table->dropForeign(['store_id']);
            $table->dropIndex(['store_id', 'key']);
            $table->dropColumn('store_id');
        });
    }
};
