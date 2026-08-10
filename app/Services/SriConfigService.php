<?php

namespace App\Services;

use App\Models\Setting;
use App\Models\Store;
use Illuminate\Support\Facades\Crypt;

class SriConfigService
{
    /**
     * $storeId explícito -- lo que SIEMPRE deben mandar los Jobs
     * (EmitirFacturaJob, AutorizarFacturaJob, ReenviarComprobanteJob,
     * SendRideEmailJob) y los servicios SRI, derivándolo del propio
     * modelo que están procesando (Sale->warehouse->store_id,
     * ElectronicInvoice->store_id, CreditNote->warehouse->store_id) --
     * esos SIEMPRE saben a qué tienda pertenecen sin necesitar contexto
     * de request, a diferencia de currentStoreId() que dentro de un Job
     * en cola siempre es null.
     *
     * Si no se pasa nada (llamador con contexto HTTP real, o código
     * viejo sin actualizar), cae al mismo criterio de antes:
     * currentStoreId() y, si tampoco hay, la única Store existente
     * cuando solo hay una.
     */
    public static function get(?int $storeId = null): array
    {
        // Cada key de settings puede tener una fila store_id NULL
        // (fallback) y una fila store_id=<tienda> (override) -- ver
        // MigrateToInitialStoreSeeder::backfillSettings().
        if ($storeId === null) {
            $storeId = currentStoreId();
        }
        if ($storeId === null) {
            $storeId = Store::count() === 1 ? Store::value('id') : null;
        }

        // Igual que el resto de lugares que leen Setting por tienda: sin
        // $storeId resuelto (2+ tiendas, contexto ambiguo) no se puede
        // dejar la query sin filtrar -- devolvería filas de TODAS las
        // tiendas y pluck() se quedaría con la del store_id más alto,
        // sin relación con la operación real en curso. whereNull acá
        // restringe al fallback de sistema.
        $query = Setting::query()->orderBy('store_id');
        if ($storeId !== null) {
            $query->where(function ($q) use ($storeId) {
                $q->whereNull('store_id')->orWhere('store_id', $storeId);
            });
        } else {
            $query->whereNull('store_id');
        }
        $settings = $query->get()->pluck('value', 'key');

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