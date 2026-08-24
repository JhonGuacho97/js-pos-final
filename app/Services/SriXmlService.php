<?php

namespace App\Services;

use App\Models\CreditNote;
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
        $this->nodo($dom, $infoFact, 'totalDescuento', $this->decimal2($sale->discount ?? 0));

        // totalConImpuestos
        $totalConImp = $dom->createElement('totalConImpuestos');
        // Mismo criterio que en subtotalSinIvaSri(): el IVA vive por
        // producto (Inclusivo/Exclusivo), no en un campo global de la
        // venta -- sumar $sale->tax_amount acá era el mismo bug que en
        // el RIDE, solo que directo en el XML que se manda al SRI.
        $ivaFactura = $sale->saleItems->sum(fn ($item) => $item->valorIvaSri());
        $itemConIvaFactura = $sale->saleItems->first(fn ($item) => ($item->tax_value ?: $sale->tax_rate) > 0);
        $tarifaFactura = $itemConIvaFactura
            ? ($itemConIvaFactura->tax_value ?: $sale->tax_rate)
            : ($sale->tax_rate ?? 0);
        $this->agregarTotalImpuesto(
            $dom,
            $totalConImp,
            $sale->subtotalSinIvaSri(),
            $ivaFactura,
            $tarifaFactura
        );
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

        // ── infoAdicional ─────────────────────────
        // Importante: createElement($tag, $valor) escapa MENOS
        // caracteres que createTextNode() (así lo advierte la propia
        // documentación de PHP) -- si el correo/teléfono/dirección del
        // cliente tuviera un "&" suelto, podía romper el XML igual que
        // pasó con la dirección de la empresa. Se arma con
        // createTextNode(), el mismo patrón seguro que usa nodo().
        $infoAdicional = $dom->createElement('infoAdicional');
        $hasAdicional = false;

        if ($customer->email) {
            $campo = $dom->createElement('campoAdicional');
            $campo->setAttribute('nombre', 'Email');
            $campo->appendChild($dom->createTextNode((string) $customer->email));
            $infoAdicional->appendChild($campo);
            $hasAdicional = true;
        }

        if ($customer->phone) {
            $campo = $dom->createElement('campoAdicional');
            $campo->setAttribute('nombre', 'Telefono');
            $campo->appendChild($dom->createTextNode((string) $customer->phone));
            $infoAdicional->appendChild($campo);
            $hasAdicional = true;
        }

        if ($customer->address) {
            $campo = $dom->createElement('campoAdicional');
            $campo->setAttribute('nombre', 'Direccion');
            $campo->appendChild($dom->createTextNode((string) $customer->address));
            $infoAdicional->appendChild($campo);
            $hasAdicional = true;
        }

        if ($hasAdicional) {
            $factura->appendChild($infoAdicional);
        }

        return [
            'xml' => $dom->saveXML(),
            'clave_acceso' => $claveAcceso,
            'secuencial' => $secuencial,
            'store_id' => $storeId,
            'ambiente' => (int) $cfg['ambiente'],
            'estab' => $cfg['estab'],
            'pto_emi' => $cfg['pto_emi'],
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
        $tarifa = $sale->tax_rate ?? 15;
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
            $facturaOrigen->created_at->format('d/m/Y')
        );
        $this->nodo($dom, $infoND, 'totalSinImpuestos', $this->decimal2($totalSinImp));

        // impuestos
        $impuestos = $dom->createElement('impuestos');
        $impuesto = $dom->createElement('impuesto');
        $this->nodo($dom, $impuesto, 'codigo', '2');
        $this->nodo($dom, $impuesto, 'codigoPorcentaje', $this->codigoPorcentaje($tarifa));
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

        return [
            'xml' => $dom->saveXML(),
            'clave_acceso' => $claveAcceso,
            'secuencial' => $secuencial,
            'store_id' => $storeId,
            'ambiente' => (int) $cfg['ambiente'],
            'estab' => $cfg['estab'],
            'pto_emi' => $cfg['pto_emi'],
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
            optional($sale?->created_at)->format('d/m/Y') ?: $fechaEmision
        );

        $totalSinImp = $creditNote->subtotalSinIvaSri();
        $this->nodo($dom, $infoNC, 'totalSinImpuestos', $this->decimal2($totalSinImp));
        $this->nodo($dom, $infoNC, 'valorModificacion', $this->decimal2($creditNote->grand_total ?? 0));
        $this->nodo($dom, $infoNC, 'moneda', 'DOLAR');

        // totalConImpuestos -- mismo criterio que Factura: el IVA vive
        // por producto (Inclusivo/Exclusivo), se suma real de las líneas.
        $totalConImp = $dom->createElement('totalConImpuestos');
        $ivaNota = $creditNote->creditNoteItems->sum(fn ($item) => $item->valorIvaSri());
        $itemConIva = $creditNote->creditNoteItems->first(
            fn ($item) => ($item->tax_value ?: $creditNote->tax_rate) > 0
        );
        $tarifaNota = $itemConIva
            ? ($itemConIva->tax_value ?: $creditNote->tax_rate)
            : ($creditNote->tax_rate ?? 0);
        $this->agregarTotalImpuesto($dom, $totalConImp, $totalSinImp, $ivaNota, $tarifaNota);
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

        // ── infoAdicional ─────────────────────────
        $infoAdicional = $dom->createElement('infoAdicional');
        $hasAdicional = false;

        if ($customer->email) {
            $campo = $dom->createElement('campoAdicional');
            $campo->setAttribute('nombre', 'Email');
            $campo->appendChild($dom->createTextNode((string) $customer->email));
            $infoAdicional->appendChild($campo);
            $hasAdicional = true;
        }

        if ($customer->phone) {
            $campo = $dom->createElement('campoAdicional');
            $campo->setAttribute('nombre', 'Telefono');
            $campo->appendChild($dom->createTextNode((string) $customer->phone));
            $infoAdicional->appendChild($campo);
            $hasAdicional = true;
        }

        if ($customer->address) {
            $campo = $dom->createElement('campoAdicional');
            $campo->setAttribute('nombre', 'Direccion');
            $campo->appendChild($dom->createTextNode((string) $customer->address));
            $infoAdicional->appendChild($campo);
            $hasAdicional = true;
        }

        if ($hasAdicional) {
            $notaCredito->appendChild($infoAdicional);
        }

        return [
            'xml' => $dom->saveXML(),
            'clave_acceso' => $claveAcceso,
            'secuencial' => $secuencial,
            'store_id' => $storeId,
            'ambiente' => (int) $cfg['ambiente'],
            'estab' => $cfg['estab'],
            'pto_emi' => $cfg['pto_emi'],
        ];
    }

    // ─────────────────────────────────────────────
    // HELPERS PRIVADOS
    // ─────────────────────────────────────────────

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

        foreach ($creditNote->creditNoteItems as $item) {
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

        foreach ($sale->saleItems as $item) {
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

    private function agregarTotalImpuesto(
        \DOMDocument $dom,
        \DOMElement $parent,
        float $base,
        float $valorIva,
        float $tarifa
    ): void {
        $totalImp = $dom->createElement('totalImpuesto');
        $this->nodo($dom, $totalImp, 'codigo', '2');
        $this->nodo($dom, $totalImp, 'codigoPorcentaje', $this->codigoPorcentaje($tarifa));
        $this->nodo($dom, $totalImp, 'baseImponible', $this->decimal2($base));
        $this->nodo($dom, $totalImp, 'valor', $this->decimal2($valorIva));
        $parent->appendChild($totalImp);
    }

    private function codigoPorcentaje(float $tarifa): string
    {
        return match ((int) $tarifa) {
            0 => '0',
            12 => '2',
            14 => '3',
            15 => '4',
            5 => '5',
            default => '4',
        };
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
