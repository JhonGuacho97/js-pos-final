<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Models\Setting;
use App\Services\SriService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Crypt;

class SriConfigController extends AppBaseController
{
    public function __construct(protected SriService $sriService)
    {
    }

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
        try {
            $certs = \App\Services\SriFirmaService::leerPkcs12ConFallback(
                $archivo->getRealPath(),
                $clave
            );
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'La clave del certificado es incorrecta o el archivo está dañado.',
            ], 422);
        }

        $certData = file_get_contents($archivo->getRealPath());

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

        // El certificado NUNCA trae nombre comercial ni dirección de
        // matriz -- esos son datos del registro de RUC, no del
        // certificado en sí. Se consultan al SRI (mismo servicio que
        // ya se usa para validar identificación de clientes) para
        // traerlos reales. Si la consulta falla (sin internet, RUC
        // recién habilitado, etc.), no bloqueamos la subida del
        // certificado -- solo esos campos quedan sin autocompletar.
        $razonSocial = $certInfo['subject']['CN'] ?? '';
        $direccionMatriz = null;
        $datosSriDisponibles = false;

        if ($ruc) {
            try {
                $datosRuc = $this->sriService->searchByIdentificationSRI($ruc);
                $razonSocial = $datosRuc['name'] ?? $razonSocial;
                $direccionMatriz = $datosRuc['address'] ?? null;
                $datosSriDisponibles = true;
            } catch (\Throwable $e) {
                // Seguimos sin esos datos, no es motivo para rechazar
                // el certificado -- el usuario los puede llenar a mano.
                // (Por ejemplo, si el servicio de consulta de RUC se
                // quedó sin créditos -- eso no debe frenar nunca la
                // subida del certificado.)
            }
        }

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
            'datos_sri_disponibles' => $datosSriDisponibles,
            'razon_social' => $razonSocial,
            'dir_matriz' => $direccionMatriz,
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
        // según el emisor y el tipo de certificado.
        $subject = $certInfo['subject'] ?? [];

        // organizationIdentifier: TINEC-XXXXXXXXX001 -- es donde
        // UANATACA guarda el RUC real en certificados de persona
        // natural. OJO: "serialNumber" en estos certificados suele
        // traer la CÉDULA (10 dígitos), no el RUC -- por eso este
        // campo se revisa primero.
        if (isset($subject['organizationIdentifier'])) {
            if (preg_match('/(\d{13})/', $subject['organizationIdentifier'], $matches)) {
                return $matches[1];
            }
        }

        // TINEC-XXXXXXXXX001 (patrón Uanataca, otros tipos de certificado)
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

        // Último respaldo: recorrer TODOS los valores del subject por
        // si el campo organizationIdentifier vino con otro nombre de
        // clave (ej. el OID crudo "2.5.4.97") según la versión de
        // OpenSSL del servidor -- buscamos 13 dígitos que empiecen
        // igual que la cédula/RUC ya detectados en otros campos, para
        // no confundirnos con otro número de 13 dígitos que no sea el
        // RUC.
        $cedula = null;
        if (isset($subject['serialNumber']) && preg_match('/(\d{10})/', $subject['serialNumber'], $m)) {
            $cedula = $m[1];
        }
        foreach ($subject as $valor) {
            if (!is_string($valor)) {
                continue;
            }
            if (preg_match('/(\d{13})/', $valor, $matches)) {
                if (!$cedula || str_starts_with($matches[1], $cedula)) {
                    return $matches[1];
                }
            }
        }

        return '';
    }
}