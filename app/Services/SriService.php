<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class SriService
{
    public function searchByIdentificationSRI(string $identification)
    {
        $length = mb_strlen($identification);

        if (!in_array($length, [10, 13])) {
            abort(422, 'Identificación inválida. Debe ser cédula (10 dígitos) o RUC (13 dígitos).');
        }

        $data = $this->consultarApi($identification);

        return $length === 13
            ? $this->mapRuc($data)
            : $this->mapCedula($data);
    }

    private const API_URL = 'https://apiconsult.zampisoft.com/api/consultar';

    /**
     * Tiempo total que se espera al proveedor. La cédula se consulta contra
     * el Registro Civil y tarda bastante más que el RUC: con el límite
     * anterior (5 s con full + 10 s sin él) la consulta de cédula se cortaba
     * y terminaba en "Error del servidor". Se mantiene por debajo de los
     * 30 s de max_execution_time habituales en el hosting.
     */
    private const MAX_WAIT_SECONDS = 25;

    private function consultarApi(string $identification): array
    {
        $deadline = microtime(true) + self::MAX_WAIT_SECONDS;
        $url = self::API_URL;
        $params = ['identificacion' => $identification];

        // Ya no se envía full=true: no está documentado, la documentación
        // lo asocia a respuestas 503 y además obligaba a una segunda consulta
        // (que también se cobra) cada vez que fallaba.
        $response = $this->llamarProveedor($url, $params, $deadline);

        // 202: el proveedor sigue procesando. Según su documentación se
        // consulta la misma solicitud por GET (Location si la envía),
        // respetando Retry-After y sin repetir la consulta original.
        while ($response !== null && $response->status() === 202) {
            $wait = min(max((int) ($response->header('Retry-After') ?: 2), 1), 5);
            if (microtime(true) + $wait >= $deadline) {
                abort(503, 'El servicio de identificación sigue procesando la consulta. Intenta nuevamente en unos segundos.');
            }
            sleep($wait);

            $location = $response->header('Location');
            if ($location) {
                $url = str_starts_with($location, 'http')
                    ? $location
                    : 'https://apiconsult.zampisoft.com/' . ltrim($location, '/');
                $params = [];
            }

            $response = $this->llamarProveedor($url, $params, $deadline);
        }

        if ($response === null) {
            abort(503, 'El servicio de identificación no respondió a tiempo. Intenta nuevamente.');
        }

        if ($response->failed()) {
            $this->handleApiError($response);
        }

        $data = $response->json();

        if (!is_array($data)) {
            \Log::error('ApiConsult: respuesta no es JSON', [
                'identificacion' => $identification,
                'status' => $response->status(),
                'body' => mb_substr($response->body(), 0, 500),
            ]);
            abort(503, 'El servicio de identificación devolvió una respuesta inesperada. Intenta nuevamente.');
        }

        \Log::info('ApiConsult response', $data);

        if (empty($data['success'])) {
            abort(404, $data['error'] ?? 'No encontrado en los registros.');
        }

        return $data;
    }

    private function llamarProveedor(string $url, array $params, float $deadline)
    {
        $timeout = max(1, (int) floor($deadline - microtime(true)));

        try {
            // Sin retry(): cada consulta nueva al proveedor se cobra.
            return Http::acceptJson()
                ->connectTimeout(min(10, $timeout))
                ->timeout($timeout)
                ->get($url, ['token' => config('services.apiconsult.token')] + $params);
        } catch (\Exception $e) {
            \Log::error('ApiConsult connection error: ' . $e->getMessage(), [
                'identificacion' => $params['identificacion'] ?? null,
            ]);
            return null;
        }
    }

    private function mapCedula(array $data): array
    {
        $persona = $data['persona'] ?? $data;
        $nombre = trim((string) ($persona['nombre'] ?? ''));

        if ($nombre === '') {
            abort(404, 'No encontrado en los registros.');
        }

        return [
            'name' => trim($nombre),
            'email' => $persona['email'] ?? null,
            'phone' => $persona['celular'] ?? null,
            'address' => $this->resolveAddress($persona),
            'city' => $this->resolveCity($persona),
            'country' => 'ECUADOR',
        ];
    }

    private function mapRuc(array $data): array
    {
        $razonSocial = $data['razonSocial'] ?? null;

        if (empty($razonSocial)) {
            abort(404, 'No encontrado en los registros.');
        }

        $matriz = collect($data['establecimientos'] ?? [])
            ->firstWhere('matriz', 'SI');

        $direccionCompleta = $matriz['direccionCompleta']
            ?? ($data['establecimientos'][0]['direccionCompleta'] ?? null);

        return [
            'name' => trim($razonSocial),
            'email' => null,
            'phone' => null,
            'address' => $direccionCompleta ? str_replace('/', ', ', $direccionCompleta) : null,
            'city' => $this->resolveCityFromDireccionCompleta($direccionCompleta),
            'country' => 'ECUADOR',
        ];
    }

    private function resolveAddress(array $persona): ?string
    {
        if (!empty($persona['direccion']['calle'])) {
            return $persona['direccion']['calle'];
        }
        if (!empty($persona['direccion']['domicilio'])) {
            return $persona['direccion']['domicilio'];
        }
        if (trim((string) ($persona['calleDomicilio'] ?? '')) !== '') {
            return trim(trim($persona['calleDomicilio']) . ' ' . trim((string) ($persona['numeracionDomicilio'] ?? '')));
        }
        if (!empty($persona['lugarDomicilio'])) {
            return str_replace('/', ', ', $persona['lugarDomicilio']);
        }

        return null;
    }

    private function resolveCity(array $persona): ?string
    {
        if (!empty($persona['direccion']['canton'])) {
            return $persona['direccion']['canton'];
        }
        if (!empty($persona['lugarDomicilio'])) {
            $partes = explode('/', $persona['lugarDomicilio']);
            return trim($partes[1] ?? $partes[0] ?? '');
        }

        return null;
    }

    private function resolveCityFromDireccionCompleta(?string $direccionCompleta): ?string
    {
        if (empty($direccionCompleta)) {
            return null;
        }

        $partes = explode('/', $direccionCompleta);
        return trim($partes[1] ?? $partes[0] ?? '');
    }

    private function handleApiError($response)
    {
        $status = $response->status();

        \Log::error('ApiConsult API error', [
            'status' => $status,
            'body' => $response->json() ?? $response->body(),
        ]);

        $messages = [
            400 => 'Identificación inválida. Revisa los dígitos de la cédula o RUC.',
            401 => 'Token de autenticación incorrecto. Contacta al administrador del sistema.',
            402 => 'Saldo insuficiente en el servicio de consultas. Contacta al administrador del sistema.',
            403 => 'La cuenta del servicio de consultas no tiene permiso o está inactiva. Contacta al administrador del sistema.',
            404 => 'No se encontró información para esa identificación.',
            429 => 'Demasiadas consultas seguidas. Espera unos segundos e intenta de nuevo.',
        ];

        // Los 5xx del proveedor se devuelven como 503: es su servicio el que
        // falla, no el nuestro, y así el mensaje llega claro al usuario.
        $code = $status >= 500 ? 503 : (isset($messages[$status]) ? $status : 502);

        abort($code, $messages[$status] ?? 'El servicio de identificación no está disponible temporalmente. Intenta más tarde.');
    }
}