<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CreditNote extends BaseModel implements JsonResourceful
{
    use HasFactory, HasJsonResourcefulData;

    public const JSON_API_TYPE = 'credit_notes';

    // ── Conceptos (deciden si se toca stock) ──────
    const CONCEPTO_DEVOLUCION = 'POR_DEVOLUCION';
    const CONCEPTO_DESCUENTO = 'POR_DESCUENTO';
    const CONCEPTO_CORRECCION_PRECIO = 'POR_CORRECCION_PRECIO';
    const CONCEPTO_ERROR_FACTURACION = 'POR_ERROR_FACTURACION';
    const CONCEPTO_OTRO = 'OTRO';

    // Solo este concepto ajusta stock -- los demás son ajustes
    // puramente contables/de facturación, sin movimiento de mercadería.
    const CONCEPTOS_QUE_TOCAN_STOCK = [self::CONCEPTO_DEVOLUCION];

    // ── Generar como ───────────────────────────────
    const GENERAR_SALDO = 'SALDO';
    const GENERAR_ANTICIPO = 'ANTICIPO';

    protected $fillable = [
        'date',
        'sale_id',
        'tipo_comprobante_modificado',
        'numero_comprobante_modificado',
        'customer_id',
        'warehouse_id',
        'credit_note_category_id',
        'vendedor',
        'generar_como',
        'concepto',
        'motivo',
        'tax_rate',
        'tax_amount',
        'discount',
        'shipping',
        'grand_total',
        'status',
        'note',
        'reference_code',
    ];

    protected $casts = [
        'date' => 'date',
        'tax_rate' => 'double',
        'tax_amount' => 'double',
        'discount' => 'double',
        'shipping' => 'double',
        'grand_total' => 'double',
    ];

    public static $rules = [
        'date' => 'required',
        'sale_id' => 'required|exists:sales,id',
        'customer_id' => 'required|exists:customers,id',
        'concepto' => 'required|string',
        'generar_como' => 'required|string',
        'motivo' => 'required|string',
    ];

    // ── Relaciones ─────────────────────────────────

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class, 'sale_id', 'id');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'id');
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id', 'id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(CreditNoteCategory::class, 'credit_note_category_id', 'id');
    }

    public function creditNoteItems(): HasMany
    {
        return $this->hasMany(CreditNoteItem::class, 'credit_note_id', 'id');
    }

    public function electronicInvoice(): HasOne
    {
        return $this->hasOne(ElectronicInvoice::class, 'credit_note_id', 'id');
    }

    /**
     * Suma la base real de cada línea (igual criterio que
     * Sale::subtotalSinIvaSri() -- cada item ya sabe si su producto es
     * Inclusivo o Exclusivo, no depende de un campo global).
     */
    public function subtotalSinIvaSri(): float
    {
        $items = $this->creditNoteItems;

        if ($items->isNotEmpty()) {
            return round(
                $items->sum(fn (CreditNoteItem $item) => $item->precioTotalSinImpuestoSri()),
                2
            );
        }

        return round(($this->grand_total ?? 0) - ($this->tax_amount ?? 0), 2);
    }

    // ── Helpers ────────────────────────────────────

    public function tocaStock(): bool
    {
        return in_array($this->concepto, self::CONCEPTOS_QUE_TOCAN_STOCK);
    }

    public function prepareLinks(): array
    {
        return [];
    }

    public function prepareAttributes(): array
    {
        return [
            'date' => optional($this->date)->format('Y-m-d'),
            'sale_id' => $this->sale_id,
            'tipo_comprobante_modificado' => $this->tipo_comprobante_modificado,
            'numero_comprobante_modificado' => $this->numero_comprobante_modificado,
            'customer_id' => $this->customer_id,
            'customer_name' => $this->customer?->name,
            'customer' => $this->customer,
            'warehouse_id' => $this->warehouse_id,
            'warehouse_name' => $this->warehouse?->name,
            'credit_note_category_id' => $this->credit_note_category_id,
            'category_name' => $this->category?->name,
            'vendedor' => $this->vendedor,
            'generar_como' => $this->generar_como,
            'concepto' => $this->concepto,
            'motivo' => $this->motivo,
            'tax_rate' => $this->tax_rate,
            'tax_amount' => $this->tax_amount,
            'discount' => $this->discount,
            'shipping' => $this->shipping,
            'grand_total' => $this->grand_total,
            'status' => $this->status,
            'note' => $this->note,
            'reference_code' => $this->reference_code,
            'credit_note_items' => $this->creditNoteItems,
            'created_at' => optional($this->created_at)->format('Y-m-d H:i:s'),
        ];
    }
}
