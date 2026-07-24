<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Crypt;

class SriConfigController extends AppBaseController
{
    // ── Obtener configuración actual ──────────────────────────────────────

    public function index(): JsonResponse
    {
        $keys = [
            'sri_ruc',
            'sri_razon_social',
            'sri_nombre_comercial',
            'sri_dir_matriz',
            'sri_estab',
            'sri_pto_emi',
            'sri_ambiente',
            'sri_obligado_contabilidad',
            'sri_certificado_path',
        ];

        $settings = Setting::whereIn('key', $keys)
            ->pluck('value', 'key')
            ->toArray();

        // Verificar si el certificado existe y está vigente
        $certInfo = null;
        if (!empty($settings['sri_certificado_path'])) {
            $certInfo = $this->obtenerInfoCertificado(
                $settings['sri_certificado_path']
            );
        }

        return $this->sendResponse([
            'config' => $settings,
            'cert_info' => $certInfo,
        ], 'Configuración SRI obtenida correctamente.');
    }

    // ── Subir y validar el certificado .p12 ──────────────────────────────

    // public function subirCertificado(Request $request): JsonResponse
    // {
    //     $validator = Validator::make($request->all(), [
    //         'certificado' => 'required|file|mimes:p12,pfx|max:2048',
    //         'clave'       => 'required|string',
    //     ], [
    //         'certificado.mimes' => 'El archivo debe ser un certificado .p12 o .pfx',
    //         'certificado.max'   => 'El certificado no debe superar 2MB',
    //         'clave.required'    => 'La clave del certificado es obligatoria',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => $validator->errors()->first(),
    //         ], 422);
    //     }

    //     $archivo = $request->file('certificado');
    //     $clave   = $request->input('clave');

    //     // Leer y validar el .p12 con la clave proporcionada
    //     $certData = file_get_contents($archivo->getRealPath());
    //     $certs    = [];

    //     if (!openssl_pkcs12_read($certData, $certs, $clave)) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'La clave del certificado es incorrecta o el archivo está dañado.',
    //         ], 422);
    //     }

    //     // Extraer información del certificado
    //     $certInfo = openssl_x509_parse($certs['cert']);
    //     $vencido  = $certInfo['validTo_time_t'] < time();

    //     if ($vencido) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'El certificado está vencido desde ' .
    //                 date('d/m/Y', $certInfo['validTo_time_t']) . '.',
    //         ], 422);
    //     }

    //     // Guardar el archivo en storage (reemplaza el anterior si existe)
    //     $rutaAnterior = Setting::where('key', 'sri_certificado_path')->value('value');
    //     if ($rutaAnterior && Storage::disk('local')->exists($rutaAnterior)) {
    //         Storage::disk('local')->delete($rutaAnterior);
    //     }

    //     $nombreArchivo = 'certificados/' . uniqid('cert_') . '.p12';
    //     Storage::disk('local')->put($nombreArchivo, $certData);

    //     // Extraer datos del certificado para autocompletar el formulario
    //     $subject = $certInfo['subject'] ?? [];
    //     $ruc     = $this->extraerRuc($certInfo);

    //     // Guardar clave y ruta en settings
    //     $this->guardarSetting('sri_certificado_path', $nombreArchivo);
    //     $this->guardarSetting('sri_certificado_clave', $clave);

    //     return $this->sendResponse([
    //         'titular'      => $certInfo['subject']['CN'] ?? 'Desconocido',
    //         'valid_hasta'  => date('d/m/Y H:i', $certInfo['validTo_time_t']),
    //         'vencido'      => false,
    //         'ruc_detectado' => $ruc,
    //         'razon_social'  => $certInfo['subject']['CN'] ?? '',
    //         'cert_path'    => $nombreArchivo,
    //     ], 'Certificado subido y validado correctamente.');
    // }

    public function subirCertificado(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'certificado' => 'required|file|max:2048',
            'clave' => 'required|string',
        ], [
            'certificado.required' => 'Debe seleccionar un certificado.',
            'certificado.file' => 'El archivo enviado no es válido.',
            'certificado.max' => 'El certificado no debe superar 2 MB.',
            'clave.required' => 'La clave del certificado es obligatoria.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
            ], 422);
        }

        $archivo = $request->file('certificado');
        $clave = $request->input('clave');

        // Validar extensión
        $extension = strtolower($archivo->getClientOriginalExtension());

        if (!in_array($extension, ['p12', 'pfx'])) {
            return response()->json([
                'success' => false,
                'message' => 'El archivo debe ser un certificado .p12 o .pfx.',
            ], 422);
        }

        // Leer el archivo
        $certData = file_get_contents($archivo->getRealPath());
        $certs = [];

        // Validar que sea un PKCS#12 válido y que la clave sea correcta
        if (!openssl_pkcs12_read($certData, $certs, $clave)) {
            return response()->json([
                'success' => false,
                'message' => 'La clave del certificado es incorrecta o el archivo está dañado.',
            ], 422);
        }

        // Extraer información del certificado
        $certInfo = openssl_x509_parse($certs['cert']);

        if (!$certInfo) {
            return response()->json([
                'success' => false,
                'message' => 'No fue posible leer la información del certificado.',
            ], 422);
        }

        // Verificar vencimiento
        if (($certInfo['validTo_time_t'] ?? 0) < time()) {
            return response()->json([
                'success' => false,
                'message' => 'El certificado está vencido desde ' .
                    date('d/m/Y', $certInfo['validTo_time_t']) . '.',
            ], 422);
        }

        // Eliminar certificado anterior
        $rutaAnterior = Setting::where('key', 'sri_certificado_path')->value('value');

        if ($rutaAnterior && Storage::disk('local')->exists($rutaAnterior)) {
            Storage::disk('local')->delete($rutaAnterior);
        }

        // Guardar nuevo certificado
        $nombreArchivo = 'certificados/' . uniqid('cert_') . '.p12';
        Storage::disk('local')->put($nombreArchivo, $certData);

        // Extraer datos
        $ruc = $this->extraerRuc($certInfo);

        // Guardar configuración
        $this->guardarSetting('sri_certificado_path', $nombreArchivo);
        $this->guardarSetting(
            'sri_certificado_clave',
            Crypt::encryptString($clave)
        );

        return $this->sendResponse([
            'titular' => $certInfo['subject']['CN'] ?? 'Desconocido',
            'valid_hasta' => date('d/m/Y H:i', $certInfo['validTo_time_t']),
            'vencido' => false,
            'ruc_detectado' => $ruc,
            'razon_social' => $certInfo['subject']['CN'] ?? '',
            'cert_path' => $nombreArchivo,
        ], 'Certificado subido y validado correctamente.');
    }

    // ── Guardar configuración SRI ─────────────────────────────────────────

    public function guardarConfig(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'sri_ruc' => 'required|digits:13',
            'sri_razon_social' => 'required|string|max:300',
            'sri_nombre_comercial' => 'nullable|string|max:300',
            'sri_dir_matriz' => 'required|string|max:300',
            'sri_estab' => 'required|digits:3',
            'sri_pto_emi' => 'required|digits:3',
            'sri_ambiente' => 'required|in:1,2',
            'sri_obligado_contabilidad' => 'required|in:SI,NO',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
            ], 422);
        }

        $campos = [
            'sri_ruc',
            'sri_razon_social',
            'sri_nombre_comercial',
            'sri_dir_matriz',
            'sri_estab',
            'sri_pto_emi',
            'sri_ambiente',
            'sri_obligado_contabilidad',
        ];

        foreach ($campos as $campo) {
            $this->guardarSetting($campo, $request->input($campo, ''));
        }

        // Limpiar caché de config para que config/sri.php tome los nuevos valores
        \Illuminate\Support\Facades\Artisan::call('config:clear');

        return $this->sendResponse([], 'Configuración SRI guardada correctamente.');
    }

    // ── Verificar estado del certificado actual ───────────────────────────

    public function verificarCertificado(): JsonResponse
    {
        $certPath = Setting::where('key', 'sri_certificado_path')->value('value');
        // $certClave = Setting::where('key', 'sri_certificado_clave')->value('value');

        $certClave = Crypt::decryptString(
            Setting::where('key', 'sri_certificado_clave')
                ->value('value')
        );

        if (!$certPath || !Storage::disk('local')->exists($certPath)) {
            return response()->json([
                'success' => false,
                'message' => 'No hay certificado configurado.',
            ], 404);
        }

        $info = $this->obtenerInfoCertificado($certPath, $certClave);

        return $this->sendResponse($info, 'Estado del certificado obtenido.');
    }

    // ── Helpers privados ──────────────────────────────────────────────────

    private function guardarSetting(string $key, string $value): void
    {
        Setting::updateOrCreate(['key' => $key], ['value' => $value]);
    }

    private function obtenerInfoCertificado(
        string $certPath,
        ?string $certClave = null
    ): array {
        $fullPath = Storage::disk('local')->path($certPath);

        if (!file_exists($fullPath)) {
            return ['valido' => false, 'mensaje' => 'Archivo no encontrado'];
        }

        // if (!$certClave) {
        //     $certClave = Setting::where('key', 'sri_certificado_clave')->value('value');
        // }

        if (!$certClave) {
            $certClave = Crypt::decryptString(
                Setting::where('key', 'sri_certificado_clave')
                    ->value('value')
            );
        }

        $certData = file_get_contents($fullPath);
        $certs = [];

        if (!openssl_pkcs12_read($certData, $certs, $certClave)) {
            return ['valido' => false, 'mensaje' => 'No se pudo leer el certificado'];
        }

        $certInfo = openssl_x509_parse($certs['cert']);
        $vencido = $certInfo['validTo_time_t'] < time();

        return [
            'valido' => !$vencido,
            'titular' => $certInfo['subject']['CN'] ?? 'Desconocido',
            'valid_hasta' => date('d/m/Y H:i', $certInfo['validTo_time_t']),
            'vencido' => $vencido,
            'mensaje' => $vencido
                ? 'Certificado vencido el ' . date('d/m/Y', $certInfo['validTo_time_t'])
                : 'Certificado válido hasta ' . date('d/m/Y', $certInfo['validTo_time_t']),
        ];
    }

    private function extraerRuc(array $certInfo): string
    {
        // Uanataca y Security Data guardan el RUC en distintos campos
        // Intentar extraer de serialNumber, OU, o CN
        $subject = $certInfo['subject'] ?? [];

        // TINEC-XXXXXXXXX001 (patrón Uanataca)
        if (isset($subject['serialNumber'])) {
            $serial = $subject['serialNumber'];
            if (preg_match('/(\d{13})/', $serial, $matches)) {
                return $matches[1];
            }
        }

        // Algunos certificados tienen el RUC en OU
        if (isset($subject['OU'])) {
            if (preg_match('/(\d{13})/', $subject['OU'], $matches)) {
                return $matches[1];
            }
        }

        return '';
    }
}