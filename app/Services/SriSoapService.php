<?php

namespace App\Services;

use App\Models\ElectronicInvoice;
use Illuminate\Support\Facades\Log;
use App\Services\SriConfigService;

class SriSoapService
{
    private string $wsdlRecepcion;
    private string $wsdlAutorizacion;

    public function __construct()
    {

        $config = SriConfigService::get();

        $this->wsdlRecepcion = $config['wsdl_recepcion'];
        $this->wsdlAutorizacion = $config['wsdl_autorizacion'];
    }

    // ─────────────────────────────────────────────
    // ENVIAR COMPROBANTE (RECEPCIÓN)
    // ─────────────────────────────────────────────

    /**
     * Envía el XML firmado al SRI para validación inicial.
     * Retorna ['estado' => 'RECIBIDA'|'DEVUELTA', 'mensajes' => [...]]
     */
    public function enviarComprobante(string $xmlFirmado): array
    {
        try {
            $client = $this->crearClienteSoap($this->wsdlRecepcion);

            // El XML va como bytes (base64 lo maneja el cliente SOAP internamente
            // al detectar el tipo xsd:base64Binary en el WSDL)
            $xmlBytes = $xmlFirmado;

            $response = $client->validarComprobante([
                'xml' => $xmlBytes,
            ]);

            return $this->parsearRespuestaRecepcion($response);
        } catch (\SoapFault $e) {
            Log::error('SRI SOAP Fault (recepción): ' . $e->getMessage());

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
    public function consultarAutorizacion(string $claveAcceso): array
    {
        try {
            $client = $this->crearClienteSoap($this->wsdlAutorizacion);

            $response = $client->autorizacionComprobante([
                'claveAccesoComprobante' => $claveAcceso,
            ]);

            return $this->parsearRespuestaAutorizacion($response);
        } catch (\SoapFault $e) {
            Log::error('SRI SOAP Fault (autorización): ' . $e->getMessage());

            return [
                'estado' => 'ERROR',
                'mensaje' => $e->getMessage(),
            ];
        } catch (\Exception $e) {
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
        return new \SoapClient($wsdl, [
            'connection_timeout' => 30,
            'trace' => true,
            'exceptions' => true,
            'cache_wsdl' => WSDL_CACHE_NONE,
            'stream_context' => stream_context_create([
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true,
                ],
            ]),
        ]);
    }
}