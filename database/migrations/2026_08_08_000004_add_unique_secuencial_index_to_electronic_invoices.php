<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * proximoSecuencial() calcula MAX(secuencial)+1 sin lock -- dos emisiones
 * casi simultáneas pueden calcular el mismo secuencial (con clave_acceso
 * distintas, así que la unicidad existente en esa columna no lo detecta).
 * Este índice único no elimina la carrera de por sí, pero convierte un
 * secuencial duplicado (violación de la numeración exigida por el SRI)
 * de una corrupción silenciosa a un error de BD explícito y detectable.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('electronic_invoices', function (Blueprint $table) {
            $table->unique(['tipo_comprobante', 'secuencial'], 'electronic_invoices_tipo_secuencial_unique');
        });
    }

    public function down(): void
    {
        Schema::table('electronic_invoices', function (Blueprint $table) {
            $table->dropUnique('electronic_invoices_tipo_secuencial_unique');
        });
    }
};
