<?php

namespace App\Services;

use App\Models\CreditNote;
use App\Models\Customer;
use App\Models\ElectronicInvoice;
use App\Models\Sale;

class SriXmlService
{
    public function __construct(private SriSequenceService $sequenceService)
    {
    }

    // ─────────────────────────────────────────────
    // CLAVE DE ACCESO (49 dígitos)
    // ─────────────────────────────────────────────

    public function generarClaveAcceso(
        string $fechaEmision,  // formato dd/mm/yyyy
        string $tipoDoc,       // '01' factura, '05' nota débito
        string $secuencial,    // 9 dígitos: '000000001'
        ?int $storeId = null,
        ?array $config = null
    ): string {

        $cfg = $config ?? SriConfigService::get($storeId);
        // ddmmyyyy
        $fecha = str_replace('/', '', $fechaEmision);
        $ruc = $cfg['ruc'];
        $ambiente = (string) $cfg['ambiente'];
        $estab = $cfg['estab'];
        $ptoEmi = $cfg['pto_emi'];
        $codNum = str_pad(random_int(0, 99999999), 8, '0', STR_PAD_LEFT);
        $tipoEmision = '1';

        // 48 dígitos base
        $base = $fecha . $tipoDoc . $ruc . $ambiente
            . $estab . $ptoEmi . $secuencial
            . $codNum . $tipoEmision;

        return $base . $this->modulo11($base);
    }

    private function modulo11(string $cadena): string
    {
        $pesos = [2, 3, 4, 5, 6, 7];
        $digits = array_reverse(str_split($cadena));
        $suma = 0;

        foreach ($digits as $i => $digit) {
            $suma += (int) $digit * $pesos[$i % 6];
        }

        $resultado = 11 - ($suma % 11);

        if ($resultado === 11)
            return '0';
        if ($resultado === 10)
            return '1';

        return (string) $resultado;
    }

    // ─────────────────────────────────────────────
    // SECUENCIAL
    // ─────────────────────────────────────────────

    public function proximoSecuencial(
        string $tipoDoc,
        ?int $storeId = null,
        ?array $config = null
    ): string
    {
        if ($storeId === null) {
            throw new \RuntimeException('No se pudo resolver la tienda para reservar el secuencial SRI.');
        }

        $cfg = $config ?? SriConfigService::get($storeId);

        return $this->sequenceService->reserveNext(
            $storeId,
            (int) $cfg['ambiente'],
            (string) $cfg['estab'],
            (string) $cfg['pto_emi'],
            $tipoDoc
        );
    }

    // ─────────────────────────────────────────────
    // GENERAR XML FACTURA (versión 2.1.0)
    // ─────────────────────────────────────────────

    public function generarXmlFactura(Sale $sale): array
    {
        $this->validarCalculos($sale);

        // La venta ya sabe a qué tienda pertenece por su almacén -- se
        // deriva acá, una sola vez, y se propaga a todo lo que necesite
        // la config SRI de esta emisión (secuencial, clave de acceso,
        // firma, envío), en vez de que cada paso adivine por su cuenta.
        $storeId = $sale->warehouse?->store_id;

        $cfg = SriConfigService::get($storeId);
        $secuencial = $this->proximoSecuencial(ElectronicInvoice::FACTURA, $storeId, $cfg);
        $fechaEmision = $sale->fechaEmisionSri();
        $claveAcceso = $this->generarClaveAcceso(
            $fechaEmision,
            ElectronicInvoice::FACTURA,
            $secuencial,
            $storeId,
            $cfg
        );
        $customer = $sale->customer;

        $dom = new \DOMDocument('1.0', 'UTF-8');
        $dom->formatOutput = true;

        // ── Raíz ──────────────────────────────────
        $factura = $dom->createElement('factura');
        $factura->setAttribute('id', 'comprobante');
        $factura->setAttribute('version', '2.1.0');
        $dom->appendChild($factura);

        // ── infoTributaria ────────────────────────
        $infoTrib = $dom->createElement('infoTributaria');
        $this->nodo($dom, $infoTrib, 'ambiente', $cfg['ambiente']);
        $this->nodo($dom, $infoTrib, 'tipoEmision', '1');
        $this->nodo($dom, $infoTrib, 'razonSocial', $cfg['razon_social']);
        $this->nodo($dom, $infoTrib, 'nombreComercial', $cfg['nombre_comercial']);
        $this->nodo($dom, $infoTrib, 'ruc', $cfg['ruc']);
        $this->nodo($dom, $infoTrib, 'claveAcceso', $claveAcceso);
        $this->nodo($dom, $infoTrib, 'codDoc', ElectronicInvoice::FACTURA);
        $this->nodo($dom, $infoTrib, 'estab', $cfg['estab']);
        $this->nodo($dom, $infoTrib, 'ptoEmi', $cfg['pto_emi']);
        $this->nodo($dom, $infoTrib, 'secuencial', $secuencial);
        $this->nodo($dom, $infoTrib, 'dirMatriz', $cfg['dir_matriz']);
        $this->agregarContribuyenteRimpe($dom, $infoTrib, $cfg);
        $factura->appendChild($infoTrib);

        // ── infoFactura ───────────────────────────
        $infoFact = $dom->createElement('infoFactura');
        $this->nodo($dom, $infoFact, 'fechaEmision', $fechaEmision);
        $this->nodo($dom, $infoFact, 'dirEstablecimiento', $cfg['dir_matriz']);
        $this->nodo($dom, $infoFact, 'obligadoContabilidad', $cfg['obligado_contabilidad']);
        $this->nodo($dom, $infoFact, 'tipoIdentificacionComprador', $customer->tipoIdentificacionSri());
        $this->nodo($dom, $infoFact, 'razonSocialComprador', $customer->razonSocialSri());
        $this->nodo($dom, $infoFact, 'identificacionComprador', $customer->identificacionSri());
        $this->nodo($dom, $infoFact, 'totalSinImpuestos', $this->decimal2($sale->subtotalSinIvaSri()));
        // Tabla 21: "Total descuento" suma los descuentos de las líneas. El
        // descuento global de la venta no puede llegar acá (validarCalculos
        // bloquea la emisión si se usó), así que siempre valía 0.
        $this->nodo($dom, $infoFact, 'totalDescuento', $this->decimal2(
            $sale->saleItems->sum(fn ($item) => $item->descuentoSri())
        ));

        // totalConImpuestos -- un <totalImpuesto> por cada tarifa usada en
        // las líneas (0%, 15%...). Antes se sumaba todo bajo una sola
        // tarifa y una venta mixta declaraba mal sus bases.
        $totalConImp = $dom->createElement('totalConImpuestos');
        $this->agregarTotalesPorTarifa($dom, $totalConImp, $sale->saleItems);
        $infoFact->appendChild($totalConImp);

        $this->nodo($dom, $infoFact, 'propina', '0.00');
        $this->nodo($dom, $infoFact, 'importeTotal', $this->decimal2($sale->grand_total ?? 0));
        $this->nodo($dom, $infoFact, 'moneda', 'DOLAR');

        // pagos
        $pagos = $dom->createElement('pagos');
        foreach ($sale->pagosSri() as $payment) {
            $pago = $dom->createElement('pago');
            $this->nodo($dom, $pago, 'formaPago', $payment['formaPago']);
            $this->nodo($dom, $pago, 'total', $this->decimal2($payment['total']));
            $this->nodo($dom, $pago, 'plazo', '0');
            $this->nodo($dom, $pago, 'unidadTiempo', 'dias');
            $pagos->appendChild($pago);
        }
        $infoFact->appendChild($pagos);
        $factura->appendChild($infoFact);

        // ── detalles ──────────────────────────────
        $detalles = $dom->createElement('detalles');

        foreach ($sale->saleItems as $item) {
            $detalle = $dom->createElement('detalle');
            $this->nodo($dom, $detalle, 'codigoPrincipal', $item->codigoPrincipalSri());
            $this->nodo($dom, $detalle, 'descripcion', $item->descripcionSri());
            $this->nodo($dom, $detalle, 'cantidad', $this->decimal6($item->quantity ?? 1));
            $this->nodo($dom, $detalle, 'precioUnitario', $this->decimal6($item->precioUnitarioSri()));
            $this->nodo($dom, $detalle, 'descuento', $this->decimal2($item->descuentoSri()));
            $this->nodo($dom, $detalle, 'precioTotalSinImpuesto', $this->decimal2($item->precioTotalSinImpuestoSri()));

            // impuestos del item
            $impuestos = $dom->createElement('impuestos');
            $impuesto = $dom->createElement('impuesto');
            $this->nodo($dom, $impuesto, 'codigo', '2');
            $this->nodo($dom, $impuesto, 'codigoPorcentaje', $item->codigoPorcentajeIvaSri());
            $this->nodo($dom, $impuesto, 'tarifa', $this->decimal2($item->tarifaIvaSri()));
            $this->nodo($dom, $impuesto, 'baseImponible', $this->decimal2($item->precioTotalSinImpuestoSri()));
            $this->nodo($dom, $impuesto, 'valor', $this->decimal2($item->valorIvaSri()));
            $impuestos->appendChild($impuesto);
            $detalle->appendChild($impuestos);
            $detalles->appendChild($detalle);
        }

        $factura->appendChild($detalles);

        $this->agregarInformacionAdicional($dom, $factura, $customer, $cfg);

        return [
            'xml' => $dom->saveXML(),
            'clave_acceso' => $claveAcceso,
            'secuencial' => $secuencial,
            'store_id' => $storeId,
            'ambiente' => (int) $cfg['ambiente'],
            'estab' => $cfg['estab'],
            'pto_emi' => $cfg['pto_emi'],
            'provider_ruc' => $cfg['provider_ruc'],
        ];
    }

    // ─────────────────────────────────────────────
    // GENERAR XML NOTA DE DÉBITO (versión 1.0.0)
    // ─────────────────────────────────────────────

    public function generarXmlNotaDebito(
        ElectronicInvoice $facturaOrigen,
        array $motivos  // [['razon' => 'Interés mora', 'valor' => 10.00]]
    ): array {
        // store_id ya es un snapshot guardado en la factura origen (ver
        // migración add_store_context_to_electronic_invoices_table) --
        // no hace falta derivarlo de nuevo desde la venta/almacén.
        $storeId = $facturaOrigen->store_id;
        $this->exigirCompradorIdentificado($facturaOrigen->sale?->customer, 'nota de débito');
        $tarifa = $facturaOrigen->sale?->tax_rate ?? 15;
        $codigoPorcentaje = SriCatalogo::codigoPorcentajeIva((float) $tarifa);

        $cfg = SriConfigService::get($storeId);
        $secuencial = $this->proximoSecuencial(ElectronicInvoice::NOTA_DEBITO, $storeId, $cfg);
        // now() sin timezone usa UTC (config('app.timezone')) -- después de
        // las 19:00 hora Ecuador ya es el día siguiente en UTC, y esta
        // fecha va en el comprobante legal enviado al SRI.
        $fechaEmision = now('America/Guayaquil')->format('d/m/Y');
        $claveAcceso = $this->generarClaveAcceso(
            $fechaEmision,
            ElectronicInvoice::NOTA_DEBITO,
            $secuencial,
            $storeId,
            $cfg
        );
        $sale = $facturaOrigen->sale;
        $customer = $sale->customer;

        $totalSinImp = collect($motivos)->sum('valor');
        $iva = round($totalSinImp * $tarifa / 100, 2);
        $total = round($totalSinImp + $iva, 2);

        $dom = new \DOMDocument('1.0', 'UTF-8');
        $dom->formatOutput = true;

        // ── Raíz ──────────────────────────────────
        $notaDebito = $dom->createElement('notaDebito');
        $notaDebito->setAttribute('version', '1.0.0');
        $notaDebito->setAttribute('id', 'comprobante');
        $dom->appendChild($notaDebito);

        // ── infoTributaria ────────────────────────
        $infoTrib = $dom->createElement('infoTributaria');
        $this->nodo($dom, $infoTrib, 'ambiente', $cfg['ambiente']);
        $this->nodo($dom, $infoTrib, 'tipoEmision', '1');
        $this->nodo($dom, $infoTrib, 'razonSocial', $cfg['razon_social']);
        $this->nodo($dom, $infoTrib, 'nombreComercial', $cfg['nombre_comercial']);
        $this->nodo($dom, $infoTrib, 'ruc', $cfg['ruc']);
        $this->nodo($dom, $infoTrib, 'claveAcceso', $claveAcceso);
        $this->nodo($dom, $infoTrib, 'codDoc', ElectronicInvoice::NOTA_DEBITO);
        $this->nodo($dom, $infoTrib, 'estab', $cfg['estab']);
        $this->nodo($dom, $infoTrib, 'ptoEmi', $cfg['pto_emi']);
        $this->nodo($dom, $infoTrib, 'secuencial', $secuencial);
        $this->nodo($dom, $infoTrib, 'dirMatriz', $cfg['dir_matriz']);
        $this->agregarContribuyenteRimpe($dom, $infoTrib, $cfg);
        $notaDebito->appendChild($infoTrib);

        // ── infoNotaDebito ────────────────────────
        $infoND = $dom->createElement('infoNotaDebito');
        $this->nodo($dom, $infoND, 'fechaEmision', $fechaEmision);
        $this->nodo($dom, $infoND, 'tipoIdentificacionComprador', $customer->tipoIdentificacionSri());
        $this->nodo($dom, $infoND, 'razonSocialComprador', $customer->razonSocialSri());
        $this->nodo($dom, $infoND, 'identificacionComprador', $customer->identificacionSri());
        $this->nodo($dom, $infoND, 'obligadoContabilidad', $cfg['obligado_contabilidad']);
        $this->nodo($dom, $infoND, 'codDocModificado', '01');
        $this->nodo(
            $dom,
            $infoND,
            'numDocModificado',
            $cfg['estab'] . '-' . $cfg['pto_emi'] . '-' . $facturaOrigen->secuencial
        );
        $this->nodo(
            $dom,
            $infoND,
            'fechaEmisionDocSustento',
            // La fecha de emisión de la factura es la de la venta (la misma
            // que lleva su XML). created_at está en UTC y después de las
            // 19:00 de Ecuador ya marca el día siguiente.
            $sale->fechaEmisionSri()
        );
        $this->nodo($dom, $infoND, 'totalSinImpuestos', $this->decimal2($totalSinImp));

        // impuestos
        $impuestos = $dom->createElement('impuestos');
        $impuesto = $dom->createElement('impuesto');
        $this->nodo($dom, $impuesto, 'codigo', '2');
        $this->nodo($dom, $impuesto, 'codigoPorcentaje', $codigoPorcentaje);
        $this->nodo($dom, $impuesto, 'tarifa', $this->decimal2($tarifa));
        $this->nodo($dom, $impuesto, 'baseImponible', $this->decimal2($totalSinImp));
        $this->nodo($dom, $impuesto, 'valor', $this->decimal2($iva));
        $impuestos->appendChild($impuesto);
        $infoND->appendChild($impuestos);

        $this->nodo($dom, $infoND, 'valorTotal', $this->decimal2($total));

        // pagos
        $pagos = $dom->createElement('pagos');
        $pago = $dom->createElement('pago');
        $this->nodo($dom, $pago, 'formaPago', '01');
        $this->nodo($dom, $pago, 'total', $this->decimal2($total));
        $this->nodo($dom, $pago, 'plazo', '0');
        $this->nodo($dom, $pago, 'unidadTiempo', 'dias');
        $pagos->appendChild($pago);
        $infoND->appendChild($pagos);
        $notaDebito->appendChild($infoND);

        // ── motivos ───────────────────────────────
        $motivosNode = $dom->createElement('motivos');
        foreach ($motivos as $m) {
            $motivo = $dom->createElement('motivo');
            $this->nodo($dom, $motivo, 'razon', $m['razon']);
            $this->nodo($dom, $motivo, 'valor', $this->decimal2($m['valor']));
            $motivosNode->appendChild($motivo);
        }
        $notaDebito->appendChild($motivosNode);

        $this->agregarInformacionAdicional($dom, $notaDebito, $customer, $cfg);

        return [
            'xml' => $dom->saveXML(),
            'clave_acceso' => $claveAcceso,
            'secuencial' => $secuencial,
            'store_id' => $storeId,
            'ambiente' => (int) $cfg['ambiente'],
            'estab' => $cfg['estab'],
            'pto_emi' => $cfg['pto_emi'],
            'provider_ruc' => $cfg['provider_ruc'],
        ];
    }

    // ─────────────────────────────────────────────
    // GENERAR XML NOTA DE CRÉDITO (versión 1.1.0)
    // ─────────────────────────────────────────────

    public function generarXmlNotaCredito(CreditNote $creditNote): array
    {
        $this->validarCalculosNotaCredito($creditNote);

        $storeId = $creditNote->warehouse?->store_id;

        $cfg = SriConfigService::get($storeId);
        $secuencial = $this->proximoSecuencial(ElectronicInvoice::NOTA_CREDITO, $storeId, $cfg);
        $fechaEmision = optional($creditNote->date)->format('d/m/Y') ?: now('America/Guayaquil')->format('d/m/Y');
        $claveAcceso = $this->generarClaveAcceso(
            $fechaEmision,
            ElectronicInvoice::NOTA_CREDITO,
            $secuencial,
            $storeId,
            $cfg
        );
        $sale = $creditNote->sale;
        $customer = $creditNote->customer;

        $dom = new \DOMDocument('1.0', 'UTF-8');
        $dom->formatOutput = true;

        // ── Raíz ──────────────────────────────────
        $notaCredito = $dom->createElement('notaCredito');
        $notaCredito->setAttribute('id', 'comprobante');
        $notaCredito->setAttribute('version', '1.1.0');
        $dom->appendChild($notaCredito);

        // ── infoTributaria ────────────────────────
        $infoTrib = $dom->createElement('infoTributaria');
        $this->nodo($dom, $infoTrib, 'ambiente', $cfg['ambiente']);
        $this->nodo($dom, $infoTrib, 'tipoEmision', '1');
        $this->nodo($dom, $infoTrib, 'razonSocial', $cfg['razon_social']);
        $this->nodo($dom, $infoTrib, 'nombreComercial', $cfg['nombre_comercial']);
        $this->nodo($dom, $infoTrib, 'ruc', $cfg['ruc']);
        $this->nodo($dom, $infoTrib, 'claveAcceso', $claveAcceso);
        $this->nodo($dom, $infoTrib, 'codDoc', ElectronicInvoice::NOTA_CREDITO);
        $this->nodo($dom, $infoTrib, 'estab', $cfg['estab']);
        $this->nodo($dom, $infoTrib, 'ptoEmi', $cfg['pto_emi']);
        $this->nodo($dom, $infoTrib, 'secuencial', $secuencial);
        $this->nodo($dom, $infoTrib, 'dirMatriz', $cfg['dir_matriz']);
        $this->agregarContribuyenteRimpe($dom, $infoTrib, $cfg);
        $notaCredito->appendChild($infoTrib);

        // ── infoNotaCredito ────────────────────────
        $infoNC = $dom->createElement('infoNotaCredito');
        $this->nodo($dom, $infoNC, 'fechaEmision', $fechaEmision);
        $this->nodo($dom, $infoNC, 'dirEstablecimiento', $cfg['dir_matriz']);
        $this->nodo($dom, $infoNC, 'tipoIdentificacionComprador', $customer->tipoIdentificacionSri());
        $this->nodo($dom, $infoNC, 'razonSocialComprador', $customer->razonSocialSri());
        $this->nodo($dom, $infoNC, 'identificacionComprador', $customer->identificacionSri());
        $this->nodo($dom, $infoNC, 'obligadoContabilidad', $cfg['obligado_contabilidad']);

        // Documento que se está corrigiendo -- '01' Factura, '05' Nota
        // de Débito, según lo que guardó la nota al crearse.
        $codDocModificado = $creditNote->tipo_comprobante_modificado === 'NOTA DE DEBITO'
            ? ElectronicInvoice::NOTA_DEBITO
            : ElectronicInvoice::FACTURA;
        $this->nodo($dom, $infoNC, 'codDocModificado', $codDocModificado);
        $this->nodo($dom, $infoNC, 'numDocModificado', $creditNote->numero_comprobante_modificado);
        $this->nodo(
            $dom,
            $infoNC,
            'fechaEmisionDocSustento',
            // Fecha de la venta = fecha de emisión de la factura que se
            // corrige (created_at está en UTC, ver nota de débito).
            $sale?->date ? $sale->fechaEmisionSri() : $fechaEmision
        );

        $totalSinImp = $creditNote->subtotalSinIvaSri();
        $this->nodo($dom, $infoNC, 'totalSinImpuestos', $this->decimal2($totalSinImp));
        $this->nodo($dom, $infoNC, 'valorModificacion', $this->decimal2($creditNote->grand_total ?? 0));
        $this->nodo($dom, $infoNC, 'moneda', 'DOLAR');

        // totalConImpuestos -- mismo criterio que Factura: el IVA vive
        // por producto (Inclusivo/Exclusivo), se suma real de las líneas.
        $totalConImp = $dom->createElement('totalConImpuestos');
        $this->agregarTotalesPorTarifa($dom, $totalConImp, $creditNote->creditNoteItems);
        $infoNC->appendChild($totalConImp);

        $this->nodo($dom, $infoNC, 'motivo', $creditNote->motivo);
        $notaCredito->appendChild($infoNC);

        // ── detalles ──────────────────────────────
        $detalles = $dom->createElement('detalles');

        foreach ($creditNote->creditNoteItems as $item) {
            $detalle = $dom->createElement('detalle');
            // Nota de Crédito usa <codigoInterno>, no <codigoPrincipal>
            // como Factura -- diferencia real del esquema del SRI.
            $this->nodo($dom, $detalle, 'codigoInterno', $item->codigoPrincipalSri());
            $this->nodo($dom, $detalle, 'descripcion', $item->descripcionSri());
            $this->nodo($dom, $detalle, 'cantidad', $this->decimal6($item->quantity ?? 1));
            $this->nodo($dom, $detalle, 'precioUnitario', $this->decimal6($item->precioUnitarioSri()));
            $this->nodo($dom, $detalle, 'descuento', $this->decimal2($item->descuentoSri()));
            $this->nodo($dom, $detalle, 'precioTotalSinImpuesto', $this->decimal2($item->precioTotalSinImpuestoSri()));

            $impuestos = $dom->createElement('impuestos');
            $impuesto = $dom->createElement('impuesto');
            $this->nodo($dom, $impuesto, 'codigo', '2');
            $this->nodo($dom, $impuesto, 'codigoPorcentaje', $item->codigoPorcentajeIvaSri());
            $this->nodo($dom, $impuesto, 'tarifa', $this->decimal2($item->tarifaIvaSri()));
            $this->nodo($dom, $impuesto, 'baseImponible', $this->decimal2($item->precioTotalSinImpuestoSri()));
            $this->nodo($dom, $impuesto, 'valor', $this->decimal2($item->valorIvaSri()));
            $impuestos->appendChild($impuesto);
            $detalle->appendChild($impuestos);
            $detalles->appendChild($detalle);
        }

        $notaCredito->appendChild($detalles);

        $this->agregarInformacionAdicional($dom, $notaCredito, $customer, $cfg);

        return [
            'xml' => $dom->saveXML(),
            'clave_acceso' => $claveAcceso,
            'secuencial' => $secuencial,
            'store_id' => $storeId,
            'ambiente' => (int) $cfg['ambiente'],
            'estab' => $cfg['estab'],
            'pto_emi' => $cfg['pto_emi'],
            'provider_ruc' => $cfg['provider_ruc'],
        ];
    }

    // ─────────────────────────────────────────────
    // HELPERS PRIVADOS
    // ─────────────────────────────────────────────

    /**
     * Añade la información adicional común a todos los comprobantes. El RUC
     * del proveedor solo aplica cuando el emisor declara usar un sistema
     * proporcionado por un tercero.
     */
    private function agregarInformacionAdicional(
        \DOMDocument $dom,
        \DOMElement $comprobante,
        $customer,
        array $cfg
    ): void {
        $softwareOrigin = (string) ($cfg['software_origin'] ?? 'PROPIO');
        $providerRuc = preg_replace('/\D/', '', (string) ($cfg['provider_ruc'] ?? ''));

        if ($softwareOrigin === 'TERCERO' && strlen($providerRuc) !== 13) {
            throw new \RuntimeException(
                'Configura el RUC de 13 dígitos del proveedor tecnológico antes de emitir comprobantes electrónicos.'
            );
        }

        $campos = [
            'RUC Proveedor' => $softwareOrigin === 'TERCERO' ? $providerRuc : null,
            'Email' => $customer?->email,
            'Telefono' => $customer?->phone,
            'Direccion' => $customer?->address,
        ];

        $infoAdicional = $dom->createElement('infoAdicional');

        foreach ($campos as $nombre => $valor) {
            if ($valor === null || trim((string) $valor) === '') {
                continue;
            }

            $campo = $dom->createElement('campoAdicional');
            $campo->setAttribute('nombre', $nombre);
            // createTextNode escapa correctamente caracteres como "&".
            $campo->appendChild($dom->createTextNode((string) $valor));
            $infoAdicional->appendChild($campo);
        }

        if ($infoAdicional->hasChildNodes()) {
            $comprobante->appendChild($infoAdicional);
        }
    }

    /**
     * Verifica que cantidad × precio − descuento coincida con lo que se
     * va a reportar como "sin impuestos", y que el IVA calculado
     * coincida con la tarifa configurada -- ANTES de pedir un
     * secuencial nuevo. Pensada para atrapar inconsistencias como la
     * que encontramos en una prueba manual (un producto marcado como
     * "Sin IVA" pero con el monto guardado incluyendo el IVA de
     * todas formas), que el SRI rechazaría con su código de error 52
     * "Error en diferencias" -- mejor frenarla acá que gastar un
     * secuencial en una factura que se va a devolver.
     */
    /**
     * Misma validación que validarCalculos() para Factura, pero para
     * Nota de Crédito -- se agrega ahora que también hay un recálculo
     * autoritativo en CreditNoteRepository::storeCreditNote(), como una
     * segunda capa de defensa antes de gastar un secuencial (por si en
     * el futuro algo escribe en la tabla sin pasar por ese repositorio).
     */
    private function validarCalculosNotaCredito(CreditNote $creditNote): void
    {
        $tolerancia = 0.02;
        $this->exigirCompradorIdentificado($creditNote->customer, 'nota de crédito');

        foreach ($creditNote->creditNoteItems as $item) {
            // Tarifa fuera de la Tabla 17: se detiene acá, antes de gastar
            // un secuencial.
            $item->codigoPorcentajeIvaSri();

            // Con presentación (Six Pack/Caja/...), product_price queda
            // guardado al precio DE LA PRESENTACIÓN (ej. $30 la caja),
            // pero 'quantity' se convierte a unidades base de inventario
            // ANTES de guardarse (ej. 24 si la caja trae 24 unidades) --
            // ver CreditNoteRepository/SaleRepository::calculationSaleItems().
            // Cruzar quantity(24) × product_price($30) da $720 en vez de
            // los $30 reales: hay que usar presentation_quantity, que es
            // la que de verdad está en la misma escala que product_price.
            $cantidadParaValidar = $item->product_presentation_id
                ? $item->presentation_quantity
                : $item->quantity;

            $bruto = round(
                ($cantidadParaValidar * $item->product_price) - ($item->discount_amount ?? 0),
                2
            );
            $base = $item->precioTotalSinImpuestoSri();
            $iva = $item->valorIvaSri();

            $esperado = ($item->tax_type == Sale::INCLUSIVE) ? ($base + $iva) : $base;

            if (abs($bruto - $esperado) > $tolerancia) {
                throw new \RuntimeException(
                    "No se puede emitir: el producto \"{$item->product?->name}\" tiene una inconsistencia de cálculo ".
                    "(cantidad × precio − descuento = \${$bruto}, pero se reportaría \${$esperado} entre base e IVA). ".
                    'Revisá el campo "Impuesto Inclusivo/Exclusivo" configurado en ese producto antes de reintentar.'
                );
            }

            $tarifa = ($item->tax_value > 0) ? $item->tax_value : ($creditNote->tax_rate ?? 0);
            $ivaEsperado = round($base * $tarifa / 100, 2);

            if (abs($ivaEsperado - $iva) > $tolerancia) {
                throw new \RuntimeException(
                    "No se puede emitir: el IVA del producto \"{$item->product?->name}\" no coincide con su tarifa configurada ".
                    "(esperado \${$ivaEsperado} al {$tarifa}%, pero hay \${$iva} guardado)."
                );
            }
        }

        // Mismo criterio que validarCalculos() para Factura -- ver ese
        // comentario. Acá 'valorModificacion' hace de importeTotal.
        $totalSinImpuestos = $creditNote->subtotalSinIvaSri();
        $totalImpuesto = round($creditNote->creditNoteItems->sum(fn ($item) => $item->valorIvaSri()), 2);
        $valorModificacionEsperado = round($totalSinImpuestos + $totalImpuesto, 2);
        $valorModificacionDeclarado = round($creditNote->grand_total ?? 0, 2);

        if (abs($valorModificacionEsperado - $valorModificacionDeclarado) > $tolerancia) {
            throw new \RuntimeException(
                "No se puede emitir: el total de la nota de crédito (\${$valorModificacionDeclarado}) no coincide ".
                "con la suma de bases + IVA por línea (\${$valorModificacionEsperado}). Esto pasa cuando se usan los ".
                'campos globales "Descuento" o "Flete" del formulario -- el sistema no puede repartirlos de forma '.
                'confiable entre las líneas del comprobante SRI todavía. Aplicá el descuento directamente en cada '.
                'producto en vez de a nivel de nota, o contactá soporte.'
            );
        }
    }

    private function validarCalculos(Sale $sale): void
    {
        $tolerancia = 0.02; // margen de redondeo aceptable

        // Numeral 9.10 de la ficha técnica: sobre USD 50 la factura debe
        // llevar los datos del comprador.
        if (self::excedeConsumidorFinal($sale)) {
            throw new \RuntimeException(
                'No se puede emitir: una factura de más de USD '.number_format(SriCatalogo::MAXIMO_CONSUMIDOR_FINAL, 2).
                ' no puede ir a "Consumidor final". Asigna a la venta un cliente con cédula o RUC y reintenta.'
            );
        }

        foreach ($sale->saleItems as $item) {
            // Tarifa fuera de la Tabla 17: se detiene acá, antes de gastar
            // un secuencial.
            $item->codigoPorcentajeIvaSri();

            // Con presentación (Six Pack/Caja/...), product_price queda
            // guardado al precio DE LA PRESENTACIÓN (ej. $30 la caja),
            // pero 'quantity' se convierte a unidades base de inventario
            // ANTES de guardarse (ej. 24 si la caja trae 24 unidades) --
            // ver SaleRepository::calculationSaleItems(). Cruzar
            // quantity(24) × product_price($30) da $720 en vez de los
            // $30 reales: hay que usar presentation_quantity, que es la
            // que de verdad está en la misma escala que product_price.
            $cantidadParaValidar = $item->product_presentation_id
                ? $item->presentation_quantity
                : $item->quantity;

            $bruto = round(
                ($cantidadParaValidar * $item->product_price) - ($item->discount_amount ?? 0),
                2
            );
            $base = $item->precioTotalSinImpuestoSri();
            $iva = $item->valorIvaSri();

            // "cantidad × precio" significa cosas distintas según el tipo
            // de impuesto -- comparar siempre el MISMO concepto fiscal
            // contra el mismo concepto, nunca bruto contra neto:
            //   - Exclusivo: el precio YA es neto -> cantidad × precio == base
            //   - Inclusivo: el precio incluye IVA -> cantidad × precio == base + iva
            $esperado = ($item->tax_type == Sale::INCLUSIVE) ? ($base + $iva) : $base;

            if (abs($bruto - $esperado) > $tolerancia) {
                throw new \RuntimeException(
                    "No se puede emitir: el producto \"{$item->product?->name}\" tiene una inconsistencia de cálculo ".
                    "(cantidad × precio − descuento = \${$bruto}, pero se reportaría \${$esperado} entre base e IVA). ".
                    'Revisá el campo "Impuesto Inclusivo/Exclusivo" configurado en ese producto antes de reintentar.'
                );
            }

            // Esta relación sí vale igual para los dos tipos: el IVA
            // reportado siempre debe ser la tarifa aplicada sobre la base.
            $tarifa = ($item->tax_value > 0) ? $item->tax_value : ($sale->tax_rate ?? 0);
            $ivaEsperado = round($base * $tarifa / 100, 2);

            if (abs($ivaEsperado - $iva) > $tolerancia) {
                throw new \RuntimeException(
                    "No se puede emitir: el IVA del producto \"{$item->product?->name}\" no coincide con su tarifa configurada ".
                    "(esperado \${$ivaEsperado} al {$tarifa}%, pero hay \${$iva} guardado)."
                );
            }
        }

        // ── Consistencia a nivel de cabecera ──────────
        // El XML declara 'totalSinImpuestos' (suma de bases por línea) y
        // 'totalImpuesto.valor' (suma de IVA por línea) por separado, y el
        // SRI espera que 'importeTotal' = esa suma. Eso siempre cuadra
        // cuando el descuento/flete/impuesto vive por línea -- pero
        // 'discount', 'shipping' y 'tax_amount' de la VENTA (los campos
        // "Descuento", "Flete" e "Impuesto de la orden" del formulario)
        // se aplican sobre el total global y nunca se reflejan en las
        // líneas, así que si se usa cualquiera de esos tres, el XML queda
        // aritméticamente inconsistente sin que nada lo detectara antes.
        // No existe hoy una forma segura de repartir esos valores por
        // línea sin arriesgar corromper otro cálculo ya validado, así que
        // se bloquea la emisión con un mensaje accionable en vez de
        // mandar al SRI un comprobante que no cuadra.
        $totalSinImpuestos = $sale->subtotalSinIvaSri();
        $totalImpuesto = round($sale->saleItems->sum(fn ($item) => $item->valorIvaSri()), 2);
        $importeTotalEsperado = round($totalSinImpuestos + $totalImpuesto, 2);
        $importeTotalDeclarado = round($sale->grand_total ?? 0, 2);

        if (abs($importeTotalEsperado - $importeTotalDeclarado) > $tolerancia) {
            throw new \RuntimeException(
                "No se puede emitir: el total de la venta (\${$importeTotalDeclarado}) no coincide con la suma de ".
                "bases + IVA por línea (\${$importeTotalEsperado}). Esto pasa cuando se usan los campos globales ".
                '"Descuento", "Flete" o "Impuesto de la orden" del formulario de venta -- el sistema no puede '.
                'repartirlos de forma confiable entre las líneas del comprobante SRI todavía. '.
                'Aplicá el descuento/impuesto directamente en cada producto en vez de a nivel de venta, o contactá soporte.'
            );
        }
    }

    private function nodo(\DOMDocument $dom, \DOMElement $parent, string $tag, $value): void
    {
        $node = $dom->createElement($tag);
        $node->appendChild($dom->createTextNode((string) $value));
        $parent->appendChild($node);
    }

    /**
     * <contribuyenteRimpe> -- obligatoria SOLO para contribuyentes bajo
     * régimen RIMPE (Anexo 22 de la ficha técnica del SRI). Configurable
     * porque este mismo sistema puede usarse para negocios que no estén
     * bajo RIMPE -- en ese caso $cfg['regimen_rimpe'] queda vacío y esta
     * etiqueta simplemente no se agrega, sin afectar en nada al resto.
     */
    private function agregarContribuyenteRimpe(\DOMDocument $dom, \DOMElement $infoTrib, array $cfg): void
    {
        $textos = [
            'EMPRENDEDOR' => 'CONTRIBUYENTE RÉGIMEN RIMPE',
            'NEGOCIO_POPULAR' => 'CONTRIBUYENTE NEGOCIO POPULAR - RÉGIMEN RIMPE',
        ];

        $texto = $textos[$cfg['regimen_rimpe'] ?? ''] ?? null;

        if ($texto) {
            $this->nodo($dom, $infoTrib, 'contribuyenteRimpe', $texto);
        }
    }

    public static function excedeConsumidorFinal(Sale $sale): bool
    {
        $customer = $sale->customer;

        return $customer
            && $customer->tipoIdentificacionSri() === Customer::TIPO_CONSUMIDOR_FINAL
            && round((float) $sale->grand_total, 2) > SriCatalogo::MAXIMO_CONSUMIDOR_FINAL;
    }

    /**
     * Ficha técnica (tabla de tipos de identificación): las notas de
     * crédito y de débito deben identificar al receptor con RUC, cédula,
     * pasaporte o identificación del exterior, nunca "Consumidor final".
     * Además, desde el 01/01/2026 una factura a consumidor final ya no se
     * puede corregir con nota de crédito (Resolución NAC-DGERCGC25-00000017).
     */
    private function exigirCompradorIdentificado(?Customer $customer, string $documento): void
    {
        if (!$customer || $customer->tipoIdentificacionSri() === Customer::TIPO_CONSUMIDOR_FINAL) {
            throw new \RuntimeException(
                "No se puede emitir: el SRI no permite una {$documento} a \"Consumidor final\". ".
                'El comprobante debe ir a un cliente identificado con cédula, RUC o pasaporte.'
            );
        }
    }

    /**
     * Un <totalImpuesto> por cada código de tarifa presente en las líneas,
     * con la suma de sus bases e IVA. Así una venta con productos al 0% y
     * al 15% declara cada base en su tarifa, como pide la Tabla 21.
     */
    private function agregarTotalesPorTarifa(\DOMDocument $dom, \DOMElement $parent, $items): void
    {
        foreach (self::totalesPorTarifa($items) as $codigo => $total) {
            $totalImp = $dom->createElement('totalImpuesto');
            $this->nodo($dom, $totalImp, 'codigo', '2');
            $this->nodo($dom, $totalImp, 'codigoPorcentaje', (string) $codigo);
            $this->nodo($dom, $totalImp, 'baseImponible', $this->decimal2($total['base']));
            $this->nodo($dom, $totalImp, 'valor', $this->decimal2($total['valor']));
            $parent->appendChild($totalImp);
        }
    }

    /**
     * @return array<string, array{base: float, valor: float, tarifa: float}>
     */
    public static function totalesPorTarifa($items): array
    {
        $totales = [];

        foreach ($items as $item) {
            $codigo = $item->codigoPorcentajeIvaSri();
            $totales[$codigo] ??= ['base' => 0.0, 'valor' => 0.0, 'tarifa' => $item->tarifaIvaSri()];
            $totales[$codigo]['base'] = round($totales[$codigo]['base'] + $item->precioTotalSinImpuestoSri(), 2);
            $totales[$codigo]['valor'] = round($totales[$codigo]['valor'] + $item->valorIvaSri(), 2);
        }

        ksort($totales, SORT_NATURAL);

        return $totales;
    }

    private function decimal2(float $valor): string
    {
        return number_format($valor, 2, '.', '');
    }

    private function decimal6(float $valor): string
    {
        return number_format($valor, 6, '.', '');
    }
}
