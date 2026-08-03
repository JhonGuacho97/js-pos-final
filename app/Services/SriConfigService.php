<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Crypt;

class SriConfigService
{
    public static function get(): array
    {
        $settings = Setting::pluck('value', 'key');

        $ambiente = (int) ($settings['sri_ambiente'] ?? 1);

        return [
            'ambiente' => $ambiente,
            'ruc' => $settings['sri_ruc'] ?? '',
            'razon_social' => $settings['sri_razon_social'] ?? '',
            'nombre_comercial' => $settings['sri_nombre_comercial'] ?? '',
            'dir_matriz' => $settings['sri_dir_matriz'] ?? '',
            'estab' => $settings['sri_estab'] ?? '001',
            'pto_emi' => $settings['sri_pto_emi'] ?? '001',
            'obligado_contabilidad' => $settings['sri_obligado_contabilidad'] ?? 'NO',
            // Vacío por defecto -- el sistema puede usarse para negocios que
            // no estén bajo RIMPE, en cuyo caso esto simplemente no aplica y
            // no se agrega ninguna etiqueta al XML.
            'regimen_rimpe' => $settings['sri_regimen_rimpe'] ?? '',
            'certificado_path' => $settings['sri_certificado_path'],
            'certificado_clave' => !empty($settings['sri_certificado_clave'])
                ? Crypt::decryptString($settings['sri_certificado_clave'])
                : null,

            'wsdl_recepcion' => match ($ambiente) {
                1 => 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
                2 => 'https://cel.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
                default => throw new \RuntimeException('Ambiente SRI inválido.'),
            },

            'wsdl_autorizacion' => match ($ambiente) {
                1 => 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',
                2 => 'https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',
                default => throw new \RuntimeException('Ambiente SRI inválido.'),
            },
        ];
    }
}