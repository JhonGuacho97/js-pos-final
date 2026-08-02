<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Services\SriConfigService;

/**
 * App\Models\ElectronicInvoice
 *
 * @property int $id
 * @property int $sale_id
 * @property string $tipo_comprobante
 * @property string $clave_acceso
 * @property string|null $numero_autorizacion
 * @property string $secuencial
 * @property string $estado
 * @property string|null $xml_firmado
 * @property string|null $xml_autorizado
 * @property \Illuminate\Support\Carbon|null $fecha_autorizacion
 * @property array|null $mensajes_sri
 * @property int $intentos
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Sale $sale
 * @method static \Illuminate\Database\Eloquent\Builder|ElectronicInvoice newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ElectronicInvoice newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ElectronicInvoice query()
 * @method static \Illuminate\Database\Eloquent\Builder|ElectronicInvoice whereClaveAcceso($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElectronicInvoice whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElectronicInvoice whereEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElectronicInvoice whereFechaAutorizacion($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElectronicInvoice whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElectronicInvoice whereIntentos($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElectronicInvoice whereMensajesSri($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElectronicInvoice whereNumeroAutorizacion($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElectronicInvoice whereSaleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElectronicInvoice whereSecuencial($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElectronicInvoice whereTipoComprobante($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElectronicInvoice whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElectronicInvoice whereXmlAutorizado($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElectronicInvoice whereXmlFirmado($value)
 * @mixin \Eloquent
 */
class ElectronicInvoice extends BaseModel
{
    use HasFactory;

    protected $table = 'electronic_invoices';

    // ── Tipos de comprobante ──────────────────────
    const FACTURA = '01';
    const NOTA_DEBITO = '05';

    // ── Estados del comprobante ───────────────────
    const PENDIENTE = 'PENDIENTE';
    const RECIBIDA = 'RECIBIDA';
    const AUTORIZADA = 'AUTORIZADA';
    const NO_AUTORIZADA = 'NO_AUTORIZADA';
    const DEVUELTA = 'DEVUELTA';

    // El SRI tuvo un problema interno propio (HTTP 500, PersistenceException,
    // GenericJDBCException, NullPointerException, soap:Server) -- NO es un
    // rechazo real del comprobante, es su infraestructura fallando. Se
    // mantiene separado de NO_AUTORIZADA/DEVUELTA a propósito, para no
    // confundir al usuario haciéndole pensar que su factura está mal.
    const ERROR_TEMPORAL_SRI = 'ERROR_TEMPORAL_SRI';

    protected $fillable = [
        'sale_id',
        'tipo_comprobante',
        'clave_acceso',
        'numero_autorizacion',
        'secuencial',
        'estado',
        'xml_firmado',
        'xml_firmado_at',
        'enviado_sri_at',
        'xml_autorizado',
        'fecha_autorizacion',
        'correo_enviado_at',
        'mensajes_sri',
        'intentos',
    ];

    protected $casts = [
        'mensajes_sri' => 'array',
        'fecha_autorizacion' => 'datetime',
        'xml_firmado_at' => 'datetime',
        'enviado_sri_at' => 'datetime',
        'correo_enviado_at' => 'datetime',
        'intentos' => 'integer',
    ];

    // ── Relaciones ────────────────────────────────

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class, 'sale_id', 'id');
    }

    // ── Helpers de estado ─────────────────────────

    public function estaAutorizada(): bool
    {
        return $this->estado === self::AUTORIZADA;
    }

    public function estaPendiente(): bool
    {
        return in_array($this->estado, [self::PENDIENTE, self::RECIBIDA]);
    }

    public function estaRechazada(): bool
    {
        return in_array($this->estado, [self::NO_AUTORIZADA, self::DEVUELTA]);
    }

    /**
     * Distinto de estaRechazada() a propósito -- esto es un problema
     * del SRI, no del comprobante en sí.
     */
    public function esErrorTemporalSri(): bool
    {
        return $this->estado === self::ERROR_TEMPORAL_SRI;
    }

    public function puedeReintentarse(): bool
    {
        return ($this->estaRechazada() || $this->esErrorTemporalSri()) && $this->intentos < 5;
    }

    /**
     * Arma la "ruta de emisión" del comprobante -- los 6 pasos por los
     * que pasa, con su estado y el momento exacto en que ocurrió cada
     * uno (cuando ya pasó). Pensado para mostrar un stepper visual,
     * igual que ya se usa para el estado de un pedido de e-commerce.
     */
    public function rutaEmision(): array
    {
        $fallo = $this->esErrorTemporalSri() || $this->estado === self::NO_AUTORIZADA || $this->estado === self::DEVUELTA;

        return [
            [
                'clave' => 'registrado',
                'titulo' => 'Registrado',
                'descripcion' => 'Comprobante registrado en el sistema.',
                'estado' => 'completado',
                'timestamp' => $this->created_at,
            ],
            [
                'clave' => 'construido',
                'titulo' => 'Construido',
                'descripcion' => 'XML sin firmar generado correctamente.',
                'estado' => 'completado',
                'timestamp' => $this->created_at,
            ],
            [
                'clave' => 'firmado',
                'titulo' => 'Firmado',
                'descripcion' => 'XML firmado con el certificado configurado.',
                'estado' => $this->xml_firmado_at ? 'completado' : ($fallo ? 'error' : 'pendiente'),
                'timestamp' => $this->xml_firmado_at,
            ],
            [
                'clave' => 'enviado',
                'titulo' => 'Enviado al SRI',
                'descripcion' => 'El SRI recibe el comprobante.',
                'estado' => $this->enviado_sri_at
                    ? 'completado'
                    : ($this->esErrorTemporalSri() ? 'error' : ($this->xml_firmado_at ? 'en_proceso' : 'pendiente')),
                'timestamp' => $this->enviado_sri_at,
            ],
            [
                'clave' => 'autorizacion',
                'titulo' => 'Autorización',
                'descripcion' => 'El SRI autoriza el comprobante.',
                'estado' => $this->estaAutorizada()
                    ? 'completado'
                    : ($this->estado === self::NO_AUTORIZADA || $this->estado === self::DEVUELTA ? 'error' : ($this->enviado_sri_at ? 'en_proceso' : 'pendiente')),
                'timestamp' => $this->fecha_autorizacion,
            ],
            [
                'clave' => 'correo',
                'titulo' => 'Correo',
                'descripcion' => 'Envío del comprobante al cliente.',
                'estado' => $this->correo_enviado_at
                    ? 'completado'
                    : ($this->estaAutorizada() ? 'sin_enviar' : 'pendiente'),
                'timestamp' => $this->correo_enviado_at,
            ],
        ];
    }

    // ── Helpers de mensajes SRI ───────────────────

    public function mensajesErrores(): array
    {
        if (empty($this->mensajes_sri)) {
            return [];
        }

        return collect($this->mensajes_sri)
            ->where('tipo', 'ERROR')
            ->values()
            ->toArray();
    }

    public function mensajesAdvertencias(): array
    {
        if (empty($this->mensajes_sri)) {
            return [];
        }

        return collect($this->mensajes_sri)
            ->where('tipo', 'ADVERTENCIA')
            ->values()
            ->toArray();
    }

    public function primerError(): ?string
    {
        $errores = $this->mensajesErrores();

        return $errores[0]['mensaje'] ?? null;
    }

    // ── Helpers de formato ────────────────────────

    /**
     * Número de comprobante en formato 001-001-000000001
     * para mostrar en el RIDE y en la UI.
     */
    public function numeroComprobante(): string
    {
        $cfg = SriConfigService::get();

        return $cfg['estab'] . '-' . $cfg['pto_emi'] . '-' . $this->secuencial;
    }

    /**
     * Número de autorización formateado para el RIDE.
     * Si aún no está autorizado retorna la clave de acceso.
     */
    public function numeroAutorizacionRide(): string
    {
        return $this->numero_autorizacion ?? $this->clave_acceso;
    }
}