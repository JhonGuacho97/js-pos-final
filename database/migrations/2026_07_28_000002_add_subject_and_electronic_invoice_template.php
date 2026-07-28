<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\MailTemplate;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mail_templates', function (Blueprint $table) {
            $table->string('subject')->nullable()->after('template_name');
        });

        // Asunto por defecto para las plantillas ya existentes (Venta,
        // Devolución de venta), que hasta ahora usaban un asunto fijo
        // escrito directo en el código.
        MailTemplate::where('type', MailTemplate::MAIL_TYPE_SALE)
            ->whereNull('subject')
            ->update(['subject' => 'Venta al cliente']);

        MailTemplate::where('type', MailTemplate::MAIL_TYPE_SALE_RETURN)
            ->whereNull('subject')
            ->update(['subject' => 'Devolución de venta']);

        // Plantilla nueva para Documentos Electrónicos -- inactiva por
        // defecto, para que el usuario la revise y active cuando esté
        // conforme con el contenido.
        $yaExiste = MailTemplate::where('type', MailTemplate::MAIL_TYPE_ELECTRONIC_INVOICE)->exists();

        if (!$yaExiste) {
            MailTemplate::create([
                'template_name' => 'Documentos Electrónicos',
                'subject' => 'Documento Electrónico: {{NUMERO DE COMPROBANTE}}',
                'type' => MailTemplate::MAIL_TYPE_ELECTRONIC_INVOICE,
                'status' => MailTemplate::INACTIVE,
                'content' => '<p style="text-align:center;"><strong>{{NOMBRE DE LA EMPRESA}}</strong></p>'
                    . '<p><strong>Estimado cliente,</strong></p>'
                    . '<p>Mediante el presente correo le notificamos que el día {{FECHA EMISION}} '
                    . 'se ha generado el comprobante electrónico {{TIPO DOCUMENTO}} No {{NUMERO DOCUMENTO}}, '
                    . 'el cual lo hemos adjuntado para su descarga tanto en formato xml como en pdf.</p>'
                    . '<p>Si tiene alguna duda o problema con el acceso a sus comprobantes, '
                    . 'le recomendamos que se ponga en contacto con nosotros.</p>',
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('mail_templates', function (Blueprint $table) {
            $table->dropColumn('subject');
        });
    }
};
