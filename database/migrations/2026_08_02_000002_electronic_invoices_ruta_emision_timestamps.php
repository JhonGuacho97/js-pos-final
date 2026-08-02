<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Marcas de tiempo para la "ruta de emisión" del comprobante --
 * "Registrado" y "Construido" ya se pueden inferir de created_at
 * (nacen prácticamente en el mismo instante), "Autorización" ya existe
 * como fecha_autorizacion. Estas 3 son las que faltaban.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('electronic_invoices', function (Blueprint $table) {
            $table->timestamp('xml_firmado_at')->nullable()->after('xml_firmado');
            $table->timestamp('enviado_sri_at')->nullable()->after('xml_firmado_at');
            $table->timestamp('correo_enviado_at')->nullable()->after('fecha_autorizacion');
        });
    }

    public function down(): void
    {
        Schema::table('electronic_invoices', function (Blueprint $table) {
            $table->dropColumn(['xml_firmado_at', 'enviado_sri_at', 'correo_enviado_at']);
        });
    }
};
