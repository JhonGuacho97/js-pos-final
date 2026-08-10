<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// customers.identification y customers.email son unique GLOBAL hoy --
// eso bloquearía exactamente el escenario que la decisión de "cartera
// separada por tienda" habilita a propósito (la misma persona registrada
// como cliente en dos tiendas distintas, cada una con su propia fila).
// Se reemplaza por unique(store_id, identification)/(store_id, email) en
// Fase 2, una vez poblado store_id.
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->unsignedBigInteger('store_id')->nullable()->after('id');
            $table->foreign('store_id')->references('id')->on('stores')
                ->onUpdate('cascade')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropForeign(['store_id']);
            $table->dropColumn('store_id');
        });
    }
};
