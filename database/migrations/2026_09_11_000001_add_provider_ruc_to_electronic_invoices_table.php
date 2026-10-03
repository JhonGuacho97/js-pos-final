<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('electronic_invoices', function (Blueprint $table) {
            // Snapshot legal: un comprobante histórico no debe cambiar si
            // posteriormente cambia el proveedor configurado.
            $table->string('provider_ruc', 13)->nullable()->after('ambiente');
        });
    }

    public function down(): void
    {
        Schema::table('electronic_invoices', function (Blueprint $table) {
            $table->dropColumn('provider_ruc');
        });
    }
};
