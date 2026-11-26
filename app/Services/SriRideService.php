<?php
namespace App\Services;
use App\Models\ElectronicInvoice;
use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Services\SriConfigService;
use Illuminate\Support\Facades\Storage;

class SriRideService
{
    private const LEYENDAS_RIMPE = [
        'EMPRENDEDOR' => 'CONTRIBUYENTE RÉGIMEN RIMPE',
        'NEGOCIO_POPULAR' => 'CONTRIBUYENTE NEGOCIO POPULAR - RÉGIMEN RIMPE',
    ];

    public function generarPdf(ElectronicInvoice $factura): string
    {
        $venta = $factura->sale()->with(['customer', 'saleItems.product'])->first();

        // Generar QR con la clave de acceso (formato que reconoce el lector del SRI)
        $qrSvg = QrCode::format('svg')
            ->size(200)
            ->generate($factura->clave_acceso);
        $qrBase64 = 'data:image/svg+xml;base64,' . base64_encode($qrSvg);

        $notaDebitoData = $factura->tipo_comprobante === ElectronicInvoice::NOTA_DEBITO
            ? $this->extraerNotaDebitoData($factura)
            : null;

        $sriConfig = SriConfigService::get($factura->store_id);
        // El comprobante conserva la identidad utilizada al emitirse. No se
        // reemplaza con la configuración actual porque podría haber cambiado.
        $sriConfig['provider_ruc'] = $factura->provider_ruc;
        $logoBase64 = $this->obtenerLogoBase64($sriConfig, $factura->store_id);
        $resumen = $notaDebitoData
            ? null
            : $this->resumenTributario($factura, $venta->saleItems, 'infoFactura', $sriConfig, [
                'fecha' => $venta->fechaEmisionSri(),
                'descuento' => $venta->saleItems->sum(fn ($item) => $item->descuentoSri()),
                'total' => (float) $venta->grand_total,
                'pagos' => $venta->pagosSri(),
            ]);

        $pdf = Pdf::loadView('sri.ride', [
            'factura' => $factura,
            'venta' => $venta,
            'sri' => $sriConfig,
            'qrBase64' => $qrBase64,
            'logoBase64' => $logoBase64,
            'notaDebitoData' => $notaDebitoData,
            'resumen' => $resumen,
            'leyendaRimpe' => $this->leyendaRimpe($factura, $sriConfig),
        ])->setPaper('a4', 'portrait')->setOption([
            'tempDir' => public_path(),
            'chroot' => public_path(),
        ]);

        return $pdf->output();
    }

    public function guardarYObtenerRuta(ElectronicInvoice $factura): string
    {
        $pdfContent = $this->generarPdf($factura);
        $nombreArchivo = "rides/factura_{$factura->clave_acceso}.pdf";
        Storage::disk('local')->put($nombreArchivo, $pdfContent);

        // Ruta absoluta real, no la ruta relativa al disco -- para que
        // cualquiera que reciba esto (como el adjunto de un correo)
        // pueda usarla directo con file_exists()/attach() sin tener que
        // saber en qué disco de Storage vive.
        return Storage::disk('local')->path($nombreArchivo);
    }

    /**
     * RIDE de Nota de Crédito -- misma idea que generarPdf() pero
     * partiendo de CreditNote en vez de Sale, con su propia plantilla
     * (referencia al documento que corrige, motivo, sin datos de pago).
     */
    public function generarPdfNotaCredito(ElectronicInvoice $comprobante): string
    {
        $creditNote = $comprobante->creditNote()
            ->with(['customer', 'creditNoteItems.product'])
            ->first();

        $qrSvg = QrCode::format('svg')
            ->size(200)
            ->generate($comprobante->clave_acceso);
        $qrBase64 = 'data:image/svg+xml;base64,' . base64_encode($qrSvg);

        $sriConfig = SriConfigService::get($comprobante->store_id);
        $sriConfig['provider_ruc'] = $comprobante->provider_ruc;
        $logoBase64 = $this->obtenerLogoBase64($sriConfig, $comprobante->store_id);

        $conceptoTexto = match ($creditNote->concepto) {
            'POR_DEVOLUCION' => 'Por Devolución',
            'POR_DESCUENTO' => 'Por Descuento',
            'POR_CORRECCION_PRECIO' => 'Por Corrección de Precio',
            'POR_ERROR_FACTURACION' => 'Por Error de Facturación',
            default => 'Otro',
        };

        $resumen = $this->resumenTributario($comprobante, $creditNote->creditNoteItems, 'infoNotaCredito', $sriConfig, [
            'fecha' => optional($creditNote->date)->format('d/m/Y'),
            'descuento' => $creditNote->creditNoteItems->sum(fn ($item) => $item->descuentoSri()),
            'total' => (float) $creditNote->grand_total,
            'pagos' => [],
        ]);

        $pdf = Pdf::loadView('sri.ride-nota-credito', [
            'comprobante' => $comprobante,
            'creditNote' => $creditNote,
            'sri' => $sriConfig,
            'qrBase64' => $qrBase64,
            'logoBase64' => $logoBase64,
            'conceptoTexto' => $conceptoTexto,
            'resumen' => $resumen,
            'leyendaRimpe' => $this->leyendaRimpe($comprobante, $sriConfig),
        ])->setPaper('a4', 'portrait')->setOption([
            'tempDir' => public_path(),
            'chroot' => public_path(),
        ]);

        return $pdf->output();
    }

    public function guardarYObtenerRutaNotaCredito(ElectronicInvoice $comprobante): string
    {
        $pdfContent = $this->generarPdfNotaCredito($comprobante);
        $nombreArchivo = "rides/nota_credito_{$comprobante->clave_acceso}.pdf";
        Storage::disk('local')->put($nombreArchivo, $pdfContent);

        return Storage::disk('local')->path($nombreArchivo);
    }

    /**
     * Prefiere el logo subido en la propia Configuración SRI
     * (sri_logo, pensado específicamente para el RIDE) sobre el logo
     * general de la app (getLogoUrl(), pensado para sidebar/login/
     * emails) -- así el RIDE no depende de que alguien haya subido el
     * logo "de branding general" sin saber que también alimentaba el
     * comprobante fiscal.
     */
    private function obtenerLogoBase64(array $sriConfig, ?int $storeId = null): string
    {
        $logoUrl = $sriConfig['logo_url'] ?? '';
        if (empty($logoUrl)) {
            $logoUrl = getLogoUrl($storeId);
        }
        $urlPath = parse_url($logoUrl, PHP_URL_PATH);
        $urlPath = ltrim(str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $urlPath), DIRECTORY_SEPARATOR);
        $logoPath = public_path($urlPath);

        if (!file_exists($logoPath)) {
            return '';
        }

        $logoMime = mime_content_type($logoPath);
        $logoData = base64_encode(file_get_contents($logoPath));

        return "data:{$logoMime};base64,{$logoData}";
    }

    /**
     * Totales del RIDE según la Tabla 21 de la ficha técnica: un subtotal
     * por cada tarifa, total descuento, IVA por tarifa y valor total. Se
     * leen del XML que se envió al SRI para que el RIDE muestre exactamente
     * lo autorizado (aunque el sistema haya cambiado después). Si todavía
     * no hay XML, se calculan desde las líneas con el mismo criterio que
     * usa SriXmlService.
     */
    private function resumenTributario(ElectronicInvoice $comprobante, $items, string $nodoInfo, array $sriConfig, array $respaldo): array
    {
        $xpath = $this->xpathComprobante($comprobante);

        if ($xpath) {
            $info = "//*[local-name()=\"{$nodoInfo}\"]";
            $texto = static fn (string $expr, $ctx = null): string => trim((string) ($ctx
                ? $xpath->evaluate("string({$expr})", $ctx)
                : $xpath->evaluate("string({$expr})")));
            $tarifas = [];

            foreach ($xpath->query("{$info}/*[local-name()=\"totalConImpuestos\"]/*[local-name()=\"totalImpuesto\"]") as $nodo) {
                if ($texto('*[local-name()="codigo"]', $nodo) !== '2') {
                    continue;
                }
                $codigo = $texto('*[local-name()="codigoPorcentaje"]', $nodo);
                $tarifas[$codigo] = [
                    'base' => (float) $texto('*[local-name()="baseImponible"]', $nodo),
                    'valor' => (float) $texto('*[local-name()="valor"]', $nodo),
                ];
            }

            $pagos = [];
            foreach ($xpath->query("{$info}/*[local-name()=\"pagos\"]/*[local-name()=\"pago\"]") as $nodo) {
                $pagos[] = [
                    'formaPago' => $texto('*[local-name()="formaPago"]', $nodo),
                    'total' => (float) $texto('*[local-name()="total"]', $nodo),
                ];
            }

            $descuento = $nodoInfo === 'infoFactura'
                ? (float) $texto("{$info}/*[local-name()=\"totalDescuento\"]")
                : (float) $xpath->evaluate('sum(//*[local-name()="detalle"]/*[local-name()="descuento"])');
            $total = $nodoInfo === 'infoFactura'
                ? (float) $texto("{$info}/*[local-name()=\"importeTotal\"]")
                : (float) $texto("{$info}/*[local-name()=\"valorModificacion\"]");

            return $this->armarResumen(
                $tarifas,
                (float) $texto("{$info}/*[local-name()=\"totalSinImpuestos\"]"),
                $descuento,
                $total,
                $pagos,
                $texto("{$info}/*[local-name()=\"fechaEmision\"]") ?: $respaldo['fecha']
            );
        }

        $tarifas = array_map(
            fn ($t) => ['base' => $t['base'], 'valor' => $t['valor']],
            SriXmlService::totalesPorTarifa($items)
        );

        return $this->armarResumen(
            $tarifas,
            array_sum(array_column($tarifas, 'base')),
            (float) $respaldo['descuento'],
            (float) $respaldo['total'],
            $respaldo['pagos'],
            $respaldo['fecha']
        );
    }

    private function armarResumen(array $tarifas, float $subtotal, float $descuento, float $total, array $pagos, ?string $fecha): array
    {
        ksort($tarifas, SORT_NATURAL);
        $subtotales = [];
        $ivas = [];

        foreach ($tarifas as $codigo => $t) {
            $etiqueta = SriCatalogo::etiquetaIva((string) $codigo);
            $subtotales[] = ['label' => "Subtotal {$etiqueta}", 'valor' => $t['base']];

            if (!in_array((string) $codigo, ['0', '6', '7'], true)) {
                $ivas[] = ['label' => "IVA {$etiqueta}", 'valor' => $t['valor']];
            }
        }

        return [
            'subtotales' => $subtotales,
            'subtotal' => $subtotal,
            'descuento' => $descuento,
            'ivas' => $ivas,
            'total' => $total,
            'pagos' => array_map(fn ($p) => [
                'texto' => SriCatalogo::textoFormaPago((string) $p['formaPago']),
                'total' => (float) $p['total'],
            ], $pagos),
            'fecha_emision' => $fecha,
        ];
    }

    /**
     * Anexo 22: la leyenda RIMPE también debe constar en el RIDE. Se toma
     * del XML emitido; si no lo tiene, de la configuración actual.
     */
    private function leyendaRimpe(ElectronicInvoice $comprobante, array $sriConfig): ?string
    {
        $xpath = $this->xpathComprobante($comprobante);
        $leyenda = $xpath
            ? trim((string) $xpath->evaluate('string(//*[local-name()="infoTributaria"]/*[local-name()="contribuyenteRimpe"])'))
            : '';

        if ($leyenda === '' && !$xpath) {
            $leyenda = self::LEYENDAS_RIMPE[$sriConfig['regimen_rimpe'] ?? ''] ?? '';
        }

        return $leyenda !== '' ? $leyenda : null;
    }

    private function xpathComprobante(ElectronicInvoice $comprobante): ?\DOMXPath
    {
        $xml = $comprobante->xml_autorizado ?: $comprobante->xml_firmado;
        if (!$xml) {
            return null;
        }

        $dom = new \DOMDocument();
        if (!@$dom->loadXML($xml, LIBXML_NONET)) {
            return null;
        }

        return new \DOMXPath($dom);
    }

    /**
     * La nota de débito conserva sus motivos dentro del XML firmado y
     * autorizado. Se leen desde ese documento para producir un RIDE fiel,
     * sin confundirlos con las líneas originales de la venta.
     */
    private function extraerNotaDebitoData(ElectronicInvoice $comprobante): array
    {
        $xml = $comprobante->xml_autorizado ?: $comprobante->xml_firmado;
        $dom = new \DOMDocument();

        if (!$xml || !@$dom->loadXML($xml, LIBXML_NONET)) {
            throw new \RuntimeException('No fue posible leer el XML de la nota de débito.');
        }

        $xpath = new \DOMXPath($dom);
        $value = static fn (string $expression): string => trim((string) $xpath->evaluate("string({$expression})"));
        $motivos = [];

        foreach ($xpath->query('//*[local-name()="motivos"]/*[local-name()="motivo"]') as $motivo) {
            $motivos[] = [
                'razon' => trim((string) $xpath->evaluate('string(*[local-name()="razon"])', $motivo)),
                'valor' => (float) $xpath->evaluate('string(*[local-name()="valor"])', $motivo),
            ];
        }

        return [
            'fecha_emision' => $value('//*[local-name()="infoNotaDebito"]/*[local-name()="fechaEmision"]'),
            'numero_documento_modificado' => $value('//*[local-name()="infoNotaDebito"]/*[local-name()="numDocModificado"]'),
            'fecha_documento_modificado' => $value('//*[local-name()="infoNotaDebito"]/*[local-name()="fechaEmisionDocSustento"]'),
            'subtotal' => (float) $value('//*[local-name()="infoNotaDebito"]/*[local-name()="totalSinImpuestos"]'),
            'iva' => (float) $xpath->evaluate('sum(//*[local-name()="infoNotaDebito"]/*[local-name()="impuestos"]/*[local-name()="impuesto"]/*[local-name()="valor"])'),
            'tarifa' => (float) $value('(//*[local-name()="infoNotaDebito"]/*[local-name()="impuestos"]/*[local-name()="impuesto"]/*[local-name()="tarifa"])[1]'),
            'total' => (float) $value('//*[local-name()="infoNotaDebito"]/*[local-name()="valorTotal"]'),
            'motivos' => $motivos,
        ];
    }
}
