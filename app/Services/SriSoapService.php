<?php

namespace App\Services;

use App\Models\ElectronicInvoice;
use Illuminate\Support\Facades\Log;
use App\Services\SriConfigService;

class SriSoapService
{
    private string $wsdlRecepcion;
    private string $wsdlAutorizacion;
    private string $ambiente;

    /**
     * Igual que SriFirmaService: sin constructor -- este servicio se
     * inyecta por DI en el handle() de cada Job antes de que el Job
     * tenga oportunidad de indicar a qué tienda pertenece la operación,
     * así que la config (WSDL/ambiente) se carga recién al llamar
     * enviarComprobante()/consultarAutorizacion(), con el $storeId que
     * el llamador ya conoce.
     */
    private function cargarConfig(?int $storeId): void
    {
        $config = SriConfigService::get($storeId);

        $this->wsdlRecepcion = $config['wsdl_recepcion'];
        $this->wsdlAutorizacion = $config['wsdl_autorizacion'];
        $this->ambiente = (string) ($config['ambiente'] ?? '');
    }

    /**
     * Contexto común que se agrega a cada línea del log del SRI --
     * así cualquier entrada del log dice, de un vistazo, QUÉ operación
     * fue, EN QUÉ ambiente, y A QUÉ comprobante corresponde.
     */
    private function sriLogContext(string $operation, ?string $claveAcceso = null): array
    {
        return [
            'operation' => $operation,
            'ambiente' => $this->ambiente == '2' ? 'PRODUCCION' : 'PRUEBAS',
            'clave_acceso' => $claveAcceso,
        ];
    }

    /**
     * A qué canal de Slack corresponde cada operación -- así "enviar"
     * y "consultar" quedan en hilos separados, como ya lo tenía
     * armado un colega.
     */
    private function canalSlackParaOperacion(string $operation): string
    {
        return match ($operation) {
            'enviarComprobante' => 'sri_recepcion',
            'consultarAutorizacion' => 'sri_autorizacion',
            default => 'sri_recepcion',
        };
    }

    /**
     * Registra una respuesta SOAP exitosa (aunque el SRI haya
     * rechazado el comprobante -- "exitosa" acá significa que la
     * comunicación en sí funcionó, no que el comprobante haya sido
     * aceptado). Va al archivo de siempre Y a Slack a la vez.
     */
    private function logSriResponse(array $context, \SoapClient $client, array $resultado): void
    {
        $canalSlack = $this->canalSlackParaOperacion($context['operation'] ?? '');

        Log::stack(['sri', $canalSlack])->debug('SRI SOAP response', [
            ...$context,
            'success' => true,
            'estado_resultante' => $resultado['estado'] ?? null,
            'raw_request' => $client->__getLastRequest(),
            'raw_response' => $client->__getLastResponse(),
        ]);
    }

    /**
     * Registra una falla de comunicación real (SoapFault, timeout,
     * conexión rechazada, etc.) -- a diferencia de logSriResponse,
     * acá la comunicación en sí no llegó a completarse bien. También
     * va a ambos canales.
     */
    private function logSriException(array $context, \Throwable $e, ?\SoapClient $client = null): void
    {
        $canalSlack = $this->canalSlackParaOperacion($context['operation'] ?? '');

        Log::stack(['sri', $canalSlack])->warning('SRI SOAP exception', [
            ...$context,
            'success' => false,
            'exception' => $e->getMessage(),
            'raw_request' => $client?->__getLastRequest(),
        ]);
    }

    /**
     * Detecta si un fallo es un problema interno del PROPIO SRI (su
     * servidor Java/Hibernate cayéndose al procesar la petición) y no
     * un rechazo real de nuestro comprobante. Estas firmas son las que
     * el SRI deja ver cuando su infraestructura falla -- no tienen
     * nada que ver con la calidad de la firma ni de los datos que
     * mandamos.
     */
    private function esFalloTemporalSri(string $mensaje): bool
    {
        $firmas = [
            'PersistenceException',
            'GenericJDBCException',
            'NullPointerException',
            'soap:Server',
            'Internal Server Error',
            'HTTP/1.1 500',
            'HTTP/1.0 500',
        ];

        foreach ($firmas as $firma) {
            if (stripos($mensaje, $firma) !== false) {
                return true;
            }
        }

        return false;
    }

    // ─────────────────────────────────────────────
    // ENVIAR COMPROBANTE (RECEPCIÓN)
    // ─────────────────────────────────────────────

    /**
     * Envía el XML firmado al SRI para validación inicial.
     * Retorna ['estado' => 'RECIBIDA'|'DEVUELTA', 'mensajes' => [...]]
     */
    public function enviarComprobante(string $xmlFirmado, ?int $storeId = null): array
    {
        $this->cargarConfig($storeId);

        preg_match('/<claveAcceso>(.*?)<\/claveAcceso>/', $xmlFirmado, $claveMatch);
        $claveAcceso = $claveMatch[1] ?? null;
        $context = $this->sriLogContext('enviarComprobante', $claveAcceso);

        $client = null;

        try {
            $client = $this->crearClienteSoap($this->wsdlRecepcion);

            // El XML va como bytes (base64 lo maneja el cliente SOAP internamente
            // al detectar el tipo xsd:base64Binary en el WSDL)
            $xmlBytes = $xmlFirmado;

            $response = $client->validarComprobante([
                'xml' => $xmlBytes,
            ]);

            $resultado = $this->parsearRespuestaRecepcion($response);
            $this->logSriResponse($context, $client, $resultado);

            return $resultado;
        } catch (\SoapFault $e) {
            $this->logSriException($context, $e, $client);
            Log::error('SRI SOAP Fault (recepción): ' . $e->getMessage());

            if ($this->esFalloTemporalSri($e->getMessage())) {
                return [
                    'estado' => 'ERROR_TEMPORAL_SRI',
                    'mensajes' => [
                        [
                            'identificador' => 'ERROR_TEMPORAL_SRI',
                            'mensaje' => 'El servidor del SRI tuvo un problema interno temporal.',
                            'informacionAdicional' => 'No es un error de tu comprobante -- se puede reintentar. Detalle técnico: ' . $e->getMessage(),
                            'tipo' => 'ADVERTENCIA',
                        ]
                    ],
                ];
            }

            return [
                'estado' => 'DEVUELTA',
                'mensajes' => [
                    [
                        'identificador' => 'SOAP_FAULT',
                        'mensaje' => $e->getMessage(),
                        'tipo' => 'ERROR',
                    ]
                ],
            ];
        } catch (\Exception $e) {
            $this->logSriException($context, $e, $client);
            Log::error('Error enviando comprobante al SRI: ' . $e->getMessage());

            return [
                'estado' => 'DEVUELTA',
                'mensajes' => [
                    [
                        'identificador' => 'CONNECTION_ERROR',
                        'mensaje' => 'No se pudo conectar al servidor del SRI: ' . $e->getMessage(),
                        'tipo' => 'ERROR',
                    ]
                ],
            ];
        }
    }

    // ─────────────────────────────────────────────
    // CONSULTAR AUTORIZACIÓN
    // ─────────────────────────────────────────────

    /**
     * Consulta el estado de autorización de un comprobante ya recibido.
     * Retorna ['estado' => 'AUTORIZADO'|'NO AUTORIZADO'|'EN PROCESO', ...]
     */
    public function consultarAutorizacion(string $claveAcceso, ?int $storeId = null): array
    {
        $this->cargarConfig($storeId);

        $context = $this->sriLogContext('consultarAutorizacion', $claveAcceso);

        $client = null;

        try {
            $client = $this->crearClienteSoap($this->wsdlAutorizacion);

            $response = $client->autorizacionComprobante([
                'claveAccesoComprobante' => $claveAcceso,
            ]);

            $resultado = $this->parsearRespuestaAutorizacion($response);
            $this->logSriResponse($context, $client, $resultado);

            return $resultado;
        } catch (\SoapFault $e) {
            $this->logSriException($context, $e, $client);
            Log::error('SRI SOAP Fault (autorización): ' . $e->getMessage());

            if ($this->esFalloTemporalSri($e->getMessage())) {
                return [
                    'estado' => 'ERROR_TEMPORAL_SRI',
                    'mensaje' => 'El servidor del SRI tuvo un problema interno temporal: ' . $e->getMessage(),
                ];
            }

            return [
                'estado' => 'ERROR',
                'mensaje' => $e->getMessage(),
            ];
        } catch (\Exception $e) {
            $this->logSriException($context, $e, $client);
            Log::error('Error consultando autorización SRI: ' . $e->getMessage());

            return [
                'estado' => 'ERROR',
                'mensaje' => 'No se pudo conectar al servidor del SRI: ' . $e->getMessage(),
            ];
        }
    }

    // ─────────────────────────────────────────────
    // PARSEO DE RESPUESTAS
    // ─────────────────────────────────────────────

    private function parsearRespuestaRecepcion($response): array
    {
        // El SRI devuelve "RespuestaRecepcionComprobante", no "RespuestaSolicitud"
        $raiz = $response->RespuestaRecepcionComprobante ?? null;

        $estado = $raiz->estado ?? 'DEVUELTA';
        $mensajes = [];

        $comprobantes = $raiz->comprobantes ?? null;

        if ($comprobantes && isset($comprobantes->comprobante)) {
            $comprobante = $comprobantes->comprobante;
            $comprobanteList = is_array($comprobante) ? $comprobante : [$comprobante];

            foreach ($comprobanteList as $comp) {
                $mensajesNode = $comp->mensajes->mensaje ?? null;

                if ($mensajesNode) {
                    $mensajeList = is_array($mensajesNode) ? $mensajesNode : [$mensajesNode];

                    foreach ($mensajeList as $msg) {
                        $mensajes[] = [
                            'identificador' => (string) ($msg->identificador ?? ''),
                            'mensaje' => (string) ($msg->mensaje ?? ''),
                            'informacionAdicional' => (string) ($msg->informacionAdicional ?? ''),
                            'tipo' => (string) ($msg->tipo ?? 'INFORMATIVO'),
                        ];
                    }
                }
            }
        }

        return [
            'estado' => (string) $estado,
            'mensajes' => $mensajes,
        ];
    }

    private function parsearRespuestaAutorizacion($response): array
    {
        $numeroComprobantes = $response->RespuestaAutorizacionComprobante->numeroComprobantes ?? 0;

        if ($numeroComprobantes == 0) {
            return [
                'estado' => 'NO_ENCONTRADO',
                'mensaje' => 'No se encontró el comprobante con esa clave de acceso.',
            ];
        }

        $autorizaciones = $response->RespuestaAutorizacionComprobante->autorizaciones->autorizacion ?? null;

        // Puede venir como array si hay múltiples autorizaciones (reintentos previos)
        $autorizacion = is_array($autorizaciones) ? $autorizaciones[0] : $autorizaciones;

        $estado = (string) ($autorizacion->estado ?? 'EN PROCESO');

        $mensajes = [];
        $mensajesNode = $autorizacion->mensajes->mensaje ?? null;

        if ($mensajesNode) {
            $mensajeList = is_array($mensajesNode) ? $mensajesNode : [$mensajesNode];

            foreach ($mensajeList as $msg) {
                $mensajes[] = [
                    'identificador' => (string) ($msg->identificador ?? ''),
                    'mensaje' => (string) ($msg->mensaje ?? ''),
                    'informacionAdicional' => (string) ($msg->informacionAdicional ?? ''),
                    'tipo' => (string) ($msg->tipo ?? 'INFORMATIVO'),
                ];
            }
        }

        return [
            'estado' => $this->normalizarEstado($estado),
            'numero_autorizacion' => (string) ($autorizacion->numeroAutorizacion ?? ''),
            'fecha_autorizacion' => (string) ($autorizacion->fechaAutorizacion ?? ''),
            'ambiente' => (string) ($autorizacion->ambiente ?? ''),
            'xml_autorizado' => $this->extraerXmlAutorizado($autorizacion),
            'mensajes' => $mensajes,
        ];
    }

    /**
     * El SRI puede devolver "AUTORIZADO" o "AUTORIZADA" según la versión
     * del WSDL. Normalizamos a los estados que usa nuestro modelo.
     */
    private function normalizarEstado(string $estadoSri): string
    {
        $estadoSri = strtoupper(trim($estadoSri));

        return match (true) {
            str_contains($estadoSri, 'AUTORIZAD') => ElectronicInvoice::AUTORIZADA,
            str_contains($estadoSri, 'NO AUTORIZAD') => ElectronicInvoice::NO_AUTORIZADA,
            str_contains($estadoSri, 'PROCESO') => 'EN_PROCESO',
            default => 'EN_PROCESO',
        };
    }

    /**
     * El XML autorizado viene como string con entidades XML escapadas
     * (&lt; en vez de <). Hay que decodificarlo antes de guardarlo.
     */
    private function extraerXmlAutorizado($autorizacion): ?string
    {
        $xmlRaw = $autorizacion->comprobante ?? null;

        if (!$xmlRaw) {
            return null;
        }

        return html_entity_decode((string) $xmlRaw, ENT_QUOTES | ENT_XML1, 'UTF-8');
    }

    // ─────────────────────────────────────────────
    // CLIENTE SOAP
    // ─────────────────────────────────────────────

    private function crearClienteSoap(string $wsdl): \SoapClient
    {
        // 'connection_timeout' solo cubre el tiempo de conectar -- si el
        // SRI acepta la conexión pero no responde, sin un timeout de
        // socket la petición puede quedar colgada mucho más tiempo,
        // agotando workers PHP-FPM en hosting compartido. Se deja el
        // ini_set sin restaurar a propósito: el timeout debe seguir
        // vigente durante las llamadas reales (send/receive), que
        // ocurren después de que este método retorna, no durante la
        // construcción del cliente.
        ini_set('default_socket_timeout', '30');

        return new \SoapClient($wsdl, [
            'connection_timeout' => 30,
            'trace' => true,
            'exceptions' => true,
            'cache_wsdl' => WSDL_CACHE_NONE,
            'stream_context' => stream_context_create([
                'ssl' => [
                    // Antes deshabilitado por completo -- exponía la
                    // comunicación con el SRI a interceptación/alteración
                    // (MITM) sin que el cliente lo detectara. Los WSDL
                    // del SRI usan certificados públicos válidos, no hay
                    // razón real para desactivar la verificación.
                    'verify_peer' => true,
                    'verify_peer_name' => true,
                    'allow_self_signed' => false,
                ],
            ]),
        ]);
    }
}