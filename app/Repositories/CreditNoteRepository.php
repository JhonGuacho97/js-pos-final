<?php

namespace App\Repositories;

use App\Models\CreditNote;
use App\Models\CreditNoteItem;
use App\Models\ElectronicInvoice;
use App\Models\ManageStock;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleReturnItem;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class CreditNoteRepository extends BaseRepository
{
    protected $fieldSearchable = [
        'date',
        'reference_code',
        'motivo',
        'concepto',
        'note',
    ];

    public function model(): string
    {
        return CreditNote::class;
    }

    public function storeCreditNote(array $input): CreditNote
    {
        try {
            DB::beginTransaction();

            // lockForUpdate() bloquea esta fila hasta el commit -- si
            // dos notas de crédito para la misma factura se crean casi
            // al mismo tiempo, la segunda espera a que la primera
            // termine antes de calcular su propio disponible, evitando
            // que ambas pasen la validación y juntas excedan el total.
            $sale = Sale::with(['electronicInvoice', 'saleItems', 'payments'])
                ->where('id', $input['sale_id'])
                ->lockForUpdate()
                ->first();

            if (empty($sale)) {
                throw new UnprocessableEntityHttpException('La factura seleccionada no existe.');
            }

            // Se calcula UNA sola vez acá (no en el loop de inserción de
            // más abajo) porque 'quantity' de cada item calculado ya
            // viene en UNIDADES BASE (conversión de presentación
            // aplicada, igual que SaleItem.quantity) -- tanto la
            // validación de disponible como el descuento de stock más
            // abajo necesitan esa misma escala para comparar
            // correctamente contra lo vendido.
            $calculatedItems = array_map(
                fn ($item) => $this->calculationCreditNoteItem($item),
                $input['credit_note_items']
            );

            // ── Total de la nota: SIEMPRE recalculado en servidor desde
            // la suma real de líneas, nunca confiado del payload del
            // frontend (mismo criterio que SaleRepository::storeSaleItems).
            $subTotalAmount = array_sum(array_column($calculatedItems, 'sub_total'));

            $discount = (float) ($input['discount'] ?? 0);
            if ($discount < 0 || $discount > $subTotalAmount) {
                throw new UnprocessableEntityHttpException('El descuento no puede ser mayor al subtotal de la nota.');
            }
            $grandTotal = $subTotalAmount - $discount;

            $taxRate = (float) ($input['tax_rate'] ?? 0);
            if ($taxRate < 0 || $taxRate > 100) {
                throw new UnprocessableEntityHttpException('Por favor ingrese una tarifa de impuesto entre 0 y 100.');
            }
            $taxAmount = $grandTotal * $taxRate / 100;
            $grandTotal += $taxAmount;

            $shipping = (float) ($input['shipping'] ?? 0);
            if ($shipping < 0 || $shipping > $grandTotal) {
                throw new UnprocessableEntityHttpException('El flete no puede ser mayor al total de la nota.');
            }
            $grandTotal += $shipping;
            $grandTotal = round($grandTotal, 2);

            // ── Validación de disponible para acreditar ──
            // El techo correcto es el valor ORIGINAL de la factura
            // menos lo YA acreditado en notas de crédito válidas --
            // nunca el saldo pendiente de cobro, que es un concepto de
            // caja/cuentas por cobrar completamente independiente. Una
            // factura ya cobrada al 100% debe poder seguir aceptando
            // devoluciones o correcciones igual.
            //
            // Cuentan todas las notas existentes para esta factura,
            // EXCEPTO las que el SRI ya rechazó de forma permanente
            // (NO_AUTORIZADA/DEVUELTA) -- esas nunca llegaron a ser un
            // documento fiscal válido, así que no deben "gastar"
            // disponible. Una nota sin emitir todavía SÍ cuenta, para
            // no permitir crear varias que sumadas excedan el total
            // antes de que ninguna se termine de emitir.
            $yaAcreditado = CreditNote::where('sale_id', $input['sale_id'])
                ->noCanceladas()
                ->where(function ($q) {
                    $q->whereDoesntHave('electronicInvoice')
                        ->orWhereHas('electronicInvoice', function ($qe) {
                            $qe->whereNotIn('estado', [
                                ElectronicInvoice::NO_AUTORIZADA,
                                ElectronicInvoice::DEVUELTA,
                            ]);
                        });
                })
                ->sum('grand_total');

            $montoDisponible = round(($sale->grand_total ?? 0) - $yaAcreditado, 2);
            $totalNota = $grandTotal;

            if ($totalNota > $montoDisponible + 0.02) { // margen de redondeo
                throw new UnprocessableEntityHttpException(
                    "El total de la nota (\${$totalNota}) supera el monto disponible para acreditar de esta factura ".
                    "(\${$montoDisponible} de \${$sale->grand_total} original, ya se acreditaron \${$yaAcreditado})."
                );
            }

            // ── Validación de cantidad devuelta ────────
            // Solo aplica si el concepto realmente implica devolver
            // mercadería -- no tiene sentido para descuentos o
            // correcciones, que no representan productos físicos.
            //
            // Importante: "ya devuelto" tiene que sumar TANTO las notas
            // de crédito anteriores COMO las devoluciones de venta
            // (SaleReturn) -- son dos mecanismos distintos para
            // registrar el MISMO evento real (mercadería físicamente
            // devuelta), y si no se consideran juntos, alguien podría
            // devolver el mismo producto por los dos caminos y el
            // sistema sumaría el stock dos veces.
            //
            // Todas las cantidades comparadas acá están en UNIDADES BASE:
            // $vendidoPorProducto viene de SaleItem.quantity (ya en base),
            // $yaAcreditadoPorProducto de CreditNoteItem.quantity (ahora
            // también en base, ver calculationCreditNoteItem), y
            // $calculatedItems[]['quantity'] igual -- antes se comparaba
            // esto último todavía en unidades de PRESENTACIÓN, permitiendo
            // acreditar de más si el item se agregó con una presentación
            // con equivalencia > 1.
            if (in_array($input['concepto'], CreditNote::CONCEPTOS_QUE_TOCAN_STOCK)) {
                $vendidoPorProducto = $sale->saleItems->groupBy('product_id')
                    ->map(fn ($items) => $items->sum('quantity'));

                $yaAcreditadoPorProducto = CreditNoteItem::whereHas('creditNote', function ($q) use ($input) {
                    $q->where('sale_id', $input['sale_id'])
                        ->where('concepto', CreditNote::CONCEPTO_DEVOLUCION)
                        ->noCanceladas();
                })
                    ->get()
                    ->groupBy('product_id')
                    ->map(fn ($items) => $items->sum('quantity'));

                $yaDevueltoPorSaleReturn = SaleReturnItem::whereHas('saleReturn', function ($q) use ($input) {
                    $q->where('sale_id', $input['sale_id']);
                })
                    ->get()
                    ->groupBy('product_id')
                    ->map(fn ($items) => $items->sum('quantity'));

                foreach ($calculatedItems as $calculado) {
                    $productId = $calculado['product_id'];
                    $vendido = $vendidoPorProducto->get($productId, 0);
                    $yaAcreditado = $yaAcreditadoPorProducto->get($productId, 0)
                        + $yaDevueltoPorSaleReturn->get($productId, 0);
                    $disponible = $vendido - $yaAcreditado;

                    if ($calculado['quantity'] > $disponible + 0.001) {
                        throw new UnprocessableEntityHttpException(
                            "No se puede devolver {$calculado['quantity']} unidades de ese producto -- ".
                            "la factura solo tiene {$disponible} disponibles para devolver ".
                            "(ya se vendieron {$vendido}, y ya se devolvieron {$yaAcreditado} entre notas de crédito ".
                            "y devoluciones de venta anteriores)."
                        );
                    }
                }
            }

            $creditNoteInput = Arr::only($input, [
                'date', 'sale_id', 'customer_id', 'warehouse_id', 'credit_note_category_id',
                'vendedor', 'generar_como', 'concepto', 'motivo',
                'discount', 'shipping', 'note',
            ]);
            $creditNoteInput['tax_rate'] = $taxRate;
            $creditNoteInput['tax_amount'] = round($taxAmount, 2);
            $creditNoteInput['grand_total'] = $grandTotal;
            // Ignora cualquier 'status' que mande el frontend (antes se
            // guardaba un valor fijo sin significado) -- toda nota nueva
            // arranca ACTIVA, el único otro estado posible es CANCELADA,
            // que solo se puede llegar a través de cancelarCreditNote().
            $creditNoteInput['status'] = CreditNote::STATUS_ACTIVA;

            $creditNoteInput['tipo_comprobante_modificado'] = $sale->electronicInvoice
                ? ($sale->electronicInvoice->tipo_comprobante === '05' ? 'NOTA DE DEBITO' : 'FACTURA')
                : 'FACTURA';
            $creditNoteInput['numero_comprobante_modificado'] = $sale->electronicInvoice
                ? $sale->electronicInvoice->numeroComprobante()
                : $sale->reference_code;

            $creditNote = CreditNote::create($creditNoteInput);
            $creditNote->reference_code = 'NC_' . now()->timestamp . $creditNote->id;
            $creditNote->save();

            // Reutiliza el mismo indicador que ya usa Devolución de
            // Venta en el listado de Ventas -- así la factura muestra
            // que tuvo una devolución, sin importar por cuál de los
            // dos caminos se registró.
            if (in_array($input['concepto'], CreditNote::CONCEPTOS_QUE_TOCAN_STOCK)) {
                $sale->update(['is_return' => 1]);
            }

            foreach ($calculatedItems as $calculado) {
                CreditNoteItem::create([
                    'credit_note_id' => $creditNote->id,
                    'product_id' => $calculado['product_id'],
                    'product_presentation_id' => $calculado['product_presentation_id'],
                    'presentation_quantity' => $calculado['presentation_quantity'],
                    'presentation_equivalence' => $calculado['presentation_equivalence'],
                    'product_price' => $calculado['product_price'],
                    'net_unit_price' => $calculado['net_unit_price'],
                    'tax_type' => $calculado['tax_type'],
                    'tax_value' => $calculado['tax_value'],
                    'tax_amount' => $calculado['tax_amount'],
                    'discount_type' => $calculado['discount_type'],
                    'discount_value' => $calculado['discount_value'],
                    'discount_amount' => $calculado['discount_amount'],
                    'sale_unit' => $calculado['sale_unit'],
                    'quantity' => $calculado['quantity'],
                    'sub_total' => $calculado['sub_total'],
                ]);

                // Solo se toca stock si el concepto es una devolución
                // física de mercadería -- descuentos, correcciones de
                // precio o errores de facturación no mueven inventario.
                // $calculado['quantity'] ya está en unidades base (ver
                // calculationCreditNoteItem), igual que hace SaleRepository
                // al descontar stock -- antes acá se usaba $item['quantity']
                // crudo (unidades de presentación), descuadrando el
                // inventario cuando la presentación tenía equivalencia > 1.
                if ($creditNote->tocaStock() && !empty($input['warehouse_id'])) {
                    // Si el producto devuelto es un kit (ej. "Pack Cerveza +
                    // Michelada"), la devolución física es de cada
                    // componente real, no del kit en sí -- ver
                    // Product::resolverMovimientoStock().
                    $productoDevuelto = Product::with('kitItems')->find($calculado['product_id']);
                    $movimientos = $productoDevuelto
                        ? $productoDevuelto->resolverMovimientoStock($calculado['quantity'])
                        : [['product_id' => $calculado['product_id'], 'quantity' => $calculado['quantity']]];

                    foreach ($movimientos as $movimiento) {
                        $stock = ManageStock::where('warehouse_id', $input['warehouse_id'])
                            ->where('product_id', $movimiento['product_id'])
                            ->lockForUpdate()
                            ->first();

                        if ($stock) {
                            $stock->update(['quantity' => $stock->quantity + $movimiento['quantity']]);
                        } else {
                            ManageStock::create([
                                'warehouse_id' => $input['warehouse_id'],
                                'product_id' => $movimiento['product_id'],
                                'quantity' => $movimiento['quantity'],
                            ]);
                        }
                    }

                    if ($productoDevuelto && $productoDevuelto->is_kit) {
                        $productoDevuelto->syncKitStock($input['warehouse_id']);
                    }
                }
            }

            // Una nota generada como SALDO liquida parte de la factura.
            // Mantener payment_status sincronizado evita que una deuda ya
            // cubierta siga apareciendo en cartera como pendiente.
            if ($creditNote->generar_como === CreditNote::GENERAR_SALDO) {
                $sale->refreshPaymentStatus();
            }

            DB::commit();

            return $creditNote->load('creditNoteItems', 'customer', 'warehouse', 'sale', 'category');
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Cancela/anula una nota de crédito que quedó "huérfana" -- creada
     * por error, o cuya emisión ante el SRI nunca se completó (falló,
     * o ni siquiera se intentó). Antes no existía ningún camino para
     * revertir esto: la nota quedaba para siempre descontando saldo
     * disponible de la factura y, si el concepto era POR_DEVOLUCION,
     * con el stock ya incrementado sin posibilidad de deshacerlo salvo
     * editando la base de datos a mano.
     *
     * Solo se puede cancelar si CreditNote::puedeCancelarse() es true
     * (sin comprobante electrónico, o con uno que falló/fue rechazado
     * -- nunca si ya está autorizada o en trámite ante el SRI).
     */
    public function cancelarCreditNote(int $creditNoteId): CreditNote
    {
        try {
            DB::beginTransaction();

            $creditNote = CreditNote::with('electronicInvoice', 'creditNoteItems')
                ->lockForUpdate()
                ->findOrFail($creditNoteId);

            if (!$creditNote->puedeCancelarse()) {
                throw new UnprocessableEntityHttpException(
                    'Esta nota de crédito no se puede cancelar: ya está anulada, o tiene un '.
                    'comprobante electrónico autorizado o en trámite ante el SRI.'
                );
            }

            // Revierte el stock que esta nota había incrementado --
            // misma cantidad en unidades base (CreditNoteItem.quantity)
            // que se sumó en storeCreditNote(). Si el disponible actual
            // no alcanza para revertir (porque esa mercadería ya se
            // volvió a vender o transferir), se bloquea la cancelación
            // en vez de dejar el stock en negativo.
            if ($creditNote->tocaStock() && $creditNote->warehouse_id) {
                foreach ($creditNote->creditNoteItems as $item) {
                    // Mismo criterio que al crear la nota: si el producto es
                    // un kit, revertir es revertir cada componente real.
                    $productoItem = Product::with('kitItems')->find($item->product_id);
                    $movimientos = $productoItem
                        ? $productoItem->resolverMovimientoStock($item->quantity)
                        : [['product_id' => $item->product_id, 'quantity' => $item->quantity]];

                    foreach ($movimientos as $movimiento) {
                        $stock = ManageStock::where('warehouse_id', $creditNote->warehouse_id)
                            ->where('product_id', $movimiento['product_id'])
                            ->lockForUpdate()
                            ->first();

                        $disponible = $stock->quantity ?? 0;
                        if ($disponible < $movimiento['quantity']) {
                            throw new UnprocessableEntityHttpException(
                                "No se puede cancelar: el stock del producto #{$movimiento['product_id']} ".
                                "ya se movió (disponible {$disponible}, se necesita revertir {$movimiento['quantity']})."
                            );
                        }

                        $stock->update(['quantity' => $disponible - $movimiento['quantity']]);
                    }

                    if ($productoItem && $productoItem->is_kit) {
                        $productoItem->syncKitStock($creditNote->warehouse_id);
                    }
                }
            }

            $creditNote->update(['status' => CreditNote::STATUS_CANCELADA]);
            if ($creditNote->generar_como === CreditNote::GENERAR_SALDO && $creditNote->sale) {
                $creditNote->sale->refreshPaymentStatus();
            }

            // Si esta era la única nota/devolución que marcaba la venta
            // como "con devolución", se limpia el indicador -- si quedan
            // otras notas activas que también tocan stock, se deja como
            // estaba (todavía es cierto que la venta tuvo una devolución).
            if ($creditNote->tocaStock() && $creditNote->sale) {
                $quedanOtras = CreditNote::where('sale_id', $creditNote->sale_id)
                    ->where('id', '!=', $creditNote->id)
                    ->noCanceladas()
                    ->whereIn('concepto', CreditNote::CONCEPTOS_QUE_TOCAN_STOCK)
                    ->exists();
                $tieneSaleReturn = SaleReturnItem::whereHas('saleReturn', function ($q) use ($creditNote) {
                    $q->where('sale_id', $creditNote->sale_id);
                })->exists();

                if (!$quedanOtras && !$tieneSaleReturn) {
                    $creditNote->sale->update(['is_return' => 0]);
                }
            }

            DB::commit();

            return $creditNote->fresh(['creditNoteItems', 'customer', 'warehouse', 'sale', 'category']);
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Busca una factura por su número de comprobante o código de
     * referencia interno, para autocompletar los datos del cliente, el
     * saldo pendiente, y los productos de la venta original.
     */
    /**
     * Lista las facturas de un cliente puntual, con su saldo pendiente
     * -- usado por el modal "Listado de Comprobante" que se abre al
     * elegir un cliente y presionar el botón de buscar.
     */
    public function facturasDeCliente(int $customerId, int $perPage, int $page, string $search = '', ?int $warehouseId = null): array
    {
        $query = Sale::with(['electronicInvoice', 'payments'])
            ->where('customer_id', $customerId)
            ->latest();

        if ($warehouseId) {
            $query->where('warehouse_id', $warehouseId);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('reference_code', 'like', "%{$search}%")
                    ->orWhereHas('electronicInvoice', function ($qe) use ($search) {
                        $qe->where('secuencial', 'like', "%{$search}%");
                    });
            });
        }

        $ventas = $query->paginate($perPage, ['*'], 'page', $page);

        $ventas->getCollection()->transform(function (Sale $sale) {
            $ei = $sale->electronicInvoice;
            $pagado = $sale->payments->sum('amount');

            return [
                'sale_id' => $sale->id,
                'nro_orden' => str_pad((string) $sale->id, 9, '0', STR_PAD_LEFT),
                'numero_comprobante' => $ei ? $ei->numeroComprobante() : $sale->reference_code,
                'fecha_emision' => optional($sale->date)->format('Y-m-d'),
                'tipo_comprobante' => $ei
                    ? ($ei->tipo_comprobante === '05' ? 'NOTA DE DEBITO' : 'FACTURA')
                    : 'FACTURA',
                'forma_pago' => self::FORMA_PAGO_LABELS[$sale->payment_type] ?? 'OTRO',
                'total' => $sale->grand_total,
                'saldo' => $sale->dueAmount($sale->id),
            ];
        });

        return [
            'data' => $ventas->getCollection()->values(),
            'current_page' => $ventas->currentPage(),
            'last_page' => $ventas->lastPage(),
            'total' => $ventas->total(),
        ];
    }

    private const FORMA_PAGO_LABELS = [
        1 => 'EFECTIVO',
        2 => 'CHEQUE',
        3 => 'TRANSFERENCIA',
        4 => 'OTRO',
    ];

    public function buscarFactura(string $busqueda, ?int $warehouseId = null): ?array
    {
        $limpio = trim($busqueda);

        // El número real del comprobante ("001-001-000000063") no es
        // una columna en sí -- se arma de estab+ptoEmi+secuencial. Si
        // viene con guiones (o sin ellos, todo junto), se extrae el
        // secuencial real para buscar por coincidencia exacta, en vez
        // de depender de que el texto aparezca por casualidad como
        // substring dentro de la clave de acceso.
        $secuencialBuscado = null;
        if (preg_match('/^\d{3}-\d{3}-(\d{9})$/', $limpio, $m)) {
            $secuencialBuscado = $m[1];
        } elseif (preg_match('/^\d{15}$/', $limpio)) {
            $secuencialBuscado = substr($limpio, 6, 9);
        }

        $sale = Sale::with(['customer', 'electronicInvoice', 'payments', 'saleItems.product'])
            ->where(function ($q) use ($limpio, $secuencialBuscado) {
                $q->where('reference_code', 'like', "%{$limpio}%")
                    ->orWhereHas('electronicInvoice', function ($qe) use ($limpio, $secuencialBuscado) {
                        $qe->where('clave_acceso', 'like', "%{$limpio}%");
                        if ($secuencialBuscado) {
                            $qe->orWhere('secuencial', $secuencialBuscado);
                        } else {
                            $qe->orWhere('secuencial', 'like', "%{$limpio}%");
                        }
                    });
            })
            ->when($warehouseId, fn ($q) => $q->where('warehouse_id', $warehouseId))
            ->first();

        if (!$sale) {
            return null;
        }

        $pagado = $sale->payments->sum('amount');
        $saldo = $sale->dueAmount($sale->id);

        return [
            'sale_id' => $sale->id,
            'numero_comprobante' => $sale->electronicInvoice
                ? $sale->electronicInvoice->numeroComprobante()
                : $sale->reference_code,
            'tipo_comprobante' => $sale->electronicInvoice
                ? ($sale->electronicInvoice->tipo_comprobante === '05' ? 'NOTA DE DEBITO' : 'FACTURA')
                : 'FACTURA',
            'customer_id' => $sale->customer_id,
            'customer' => $sale->customer,
            'warehouse_id' => $sale->warehouse_id,
            'saldo' => $saldo,
            'grand_total' => $sale->grand_total,
            // Los productos de la factura original, listos para
            // precargar en la tabla -- el usuario puede ajustar
            // cantidades, quitar líneas, o agregar productos nuevos
            // aparte con el buscador (para casos especiales).
            'sale_items' => $sale->saleItems->map(fn ($item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'code' => $item->product?->code,
                'name' => $item->product?->name,
                'product_unit' => $item->product?->product_unit,
                'product_price' => $item->product_price,
                'net_unit_price' => $item->net_unit_price,
                'fix_net_unit' => $item->net_unit_price,
                'tax_type' => $item->tax_type,
                'tax_value' => $item->tax_value,
                'tax_amount' => $item->tax_amount,
                'discount_type' => $item->discount_type,
                'discount_value' => $item->discount_value,
                'discount_amount' => $item->discount_amount,
                'sale_unit' => $item->getRawOriginal('sale_unit'),
                'quantity' => $item->quantity,
                'sub_total' => $item->sub_total,
                'newItem' => '',
            ]),
        ];
    }

    /**
     * Recalcula net_unit_price/tax_amount/sub_total en el SERVIDOR, sin
     * confiar en lo que manda el frontend -- mismo cálculo autoritativo
     * que usa SaleRepository::calculationSaleItems() para una venta.
     *
     * Importante: si esto no existiera, un usuario podría ajustar la
     * cantidad en la tabla (que es justo el flujo que se espera que
     * haga al armar una devolución parcial) y el sistema confiaría
     * ciegamente en cualquier sub_total/tax_amount que el navegador
     * haya calculado -- sin ninguna garantía de que el cálculo
     * Inclusivo/Exclusivo se hizo bien, antes de firmar y mandar ese
     * número al SRI.
     */
    private function calculationCreditNoteItem(array $item): array
    {
        $productPrice = (float) ($item['product_price'] ?? 0);
        // 'quantity' que llega acá es la cantidad de la PRESENTACIÓN
        // elegida (ej: 2 cajas), igual que en SaleRepository::calculationSaleItems
        // -- se usa tal cual para el cálculo monetario (el precio también
        // es el de esa presentación), y solo al final se convierte a
        // unidades base para 'quantity' (stock, validación de disponible).
        $quantity = (float) ($item['quantity'] ?? 0);
        $discountType = (int) ($item['discount_type'] ?? Sale::FIXED);
        $discountValue = (float) ($item['discount_value'] ?? 0);
        $taxType = (int) ($item['tax_type'] ?? Sale::EXCLUSIVE);
        $taxValue = (float) ($item['tax_value'] ?? 0);

        $netUnitPrice = $productPrice;
        $perItemDiscountAmount = 0;
        $discountAmount = 0;

        if ($discountType === Sale::PERCENTAGE) {
            if ($discountValue < 0 || $discountValue > 100) {
                throw new UnprocessableEntityHttpException('El descuento debe estar entre 0 y 100.');
            }
            $discountAmount = ($discountValue * $productPrice / 100) * $quantity;
            $perItemDiscountAmount = $quantity > 0 ? $discountAmount / $quantity : 0;
            $netUnitPrice -= $perItemDiscountAmount;
        } elseif ($discountType === Sale::FIXED) {
            if ($discountValue < 0 || $discountValue > $productPrice) {
                throw new UnprocessableEntityHttpException('El descuento no puede ser mayor al precio del producto.');
            }
            $discountAmount = $discountValue * $quantity;
            $perItemDiscountAmount = $discountValue;
            $netUnitPrice -= $perItemDiscountAmount;
        }

        if ($taxValue < 0 || $taxValue > 100) {
            throw new UnprocessableEntityHttpException('La tarifa de IVA debe estar entre 0 y 100.');
        }

        $perItemTaxAmount = 0;
        $taxAmount = 0;

        if ($taxType === Sale::EXCLUSIVE) {
            $taxAmount = (($netUnitPrice * $taxValue) / 100) * $quantity;
            $perItemTaxAmount = $quantity > 0 ? $taxAmount / $quantity : 0;
        } elseif ($taxType === Sale::INCLUSIVE) {
            $taxAmount = ($netUnitPrice * $taxValue) / (100 + $taxValue) * $quantity;
            $perItemTaxAmount = $quantity > 0 ? $taxAmount / $quantity : 0;
            $netUnitPrice -= $perItemTaxAmount;
        }

        $subTotal = ($netUnitPrice + $perItemTaxAmount) * $quantity;

        // Equivalencia de presentación (caja/six-pack/etc.) -- mismo
        // patrón que SaleRepository::calculationSaleItems(). Antes esto no
        // se aplicaba acá: si se devolvía "1 caja = 6u", el stock solo
        // recibía +1 en vez de +6, y 'quantity' quedaba en una escala
        // distinta a la de SaleItem.quantity (unidades base), rompiendo la
        // comparación de "cantidad disponible para devolver".
        $presentationQuantity = $quantity;
        $equivalence = 1;

        if (!empty($item['product_presentation_id'])) {
            $product = Product::whereId($item['product_id'])->first();
            if ($product && $product->manage_presentations) {
                $presentation = $product->presentations()->whereId($item['product_presentation_id'])->first();
                if (!$presentation) {
                    throw new UnprocessableEntityHttpException('Presentación inválida para el producto ' . $product->name);
                }
                $equivalence = $presentation->equivalence;
            }
        }

        return [
            'product_id' => $item['product_id'],
            'product_presentation_id' => $item['product_presentation_id'] ?? null,
            'presentation_quantity' => $presentationQuantity,
            'presentation_equivalence' => $equivalence,
            'product_price' => $productPrice,
            'net_unit_price' => $netUnitPrice,
            'tax_type' => $taxType,
            'tax_value' => $taxValue,
            'tax_amount' => $taxAmount,
            'discount_type' => $discountType,
            'discount_value' => $discountValue,
            'discount_amount' => $discountAmount,
            'sale_unit' => is_array($item['sale_unit'] ?? null) ? ($item['sale_unit']['id'] ?? 1) : ($item['sale_unit'] ?? 1),
            // A partir de acá 'quantity' pasa a representar unidades base
            // de inventario, igual que en SaleItem -- todo lo que compara
            // o descuenta stock más abajo depende de esto.
            'quantity' => $presentationQuantity * $equivalence,
            'sub_total' => $subTotal,
        ];
    }
}
