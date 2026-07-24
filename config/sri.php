<?php
// config/sri.php

$getSetting = function (string $key, $default = null) {
    try {
        return \App\Models\Setting::where('key', $key)->value('value') ?? $default;
    } catch (\Throwable $e) {
        return $default;
    }
};

return [
    'ambiente' => (int) $getSetting('sri_ambiente', env('SRI_AMBIENTE', 1)),
    'ruc' => $getSetting('sri_ruc', env('SRI_RUC', '')),
    'razon_social' => $getSetting('sri_razon_social', env('SRI_RAZON_SOCIAL', '')),
    'nombre_comercial' => $getSetting('sri_nombre_comercial', env('SRI_NOMBRE_COMERCIAL', '')),
    'dir_matriz' => $getSetting('sri_dir_matriz', env('SRI_DIR_MATRIZ', '')),
    'estab' => $getSetting('sri_estab', env('SRI_ESTAB', '001')),
    'pto_emi' => $getSetting('sri_pto_emi', env('SRI_PTO_EMI', '001')),
    'certificado_path' => $getSetting('sri_certificado_path', env('SRI_CERTIFICADO_PATH', '')),
    'certificado_clave' => $getSetting('sri_certificado_clave', env('SRI_CERTIFICADO_CLAVE', '')),
    'obligado_contabilidad' => $getSetting('sri_obligado_contabilidad', env('SRI_OBLIGADO_CONTABILIDAD', 'NO')),

    'wsdl_recepcion' => [
        1 => 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
        2 => 'https://cel.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
    ],
    'wsdl_autorizacion' => [
        1 => 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',
        2 => 'https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',
    ],
];