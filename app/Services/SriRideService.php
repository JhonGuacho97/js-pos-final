<?php
namespace App\Services;
use App\Models\ElectronicInvoice;
use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Services\SriConfigService;
use Illuminate\Support\Facades\Storage;

class SriRideService
{
    private const FORMAS_PAGO_TEXTO = [
        '01' => 'EFECTIVO',
        '15' => 'TRANSFERENCIA / COMPENSACIÓN',
        '16' => 'TARJETA DE DÉBITO',
        '17' => 'DINERO ELECTRÓNICO',
        '19' => 'TARJETA DE CRÉDITO',
        '20' => 'OTROS',
    ];

    public function generarPdf(ElectronicInvoice $factura): string
    {
        $venta = $factura->sale()->with(['customer', 'saleItems.product'])->first();

        // Generar QR con la clave de acceso (formato que reconoce el lector del SRI)
        $qrSvg = QrCode::format('svg')
            ->size(200)
            ->generate($factura->clave_acceso);
        $qrBase64 = 'data:image/svg+xml;base64,' . base64_encode($qrSvg);

        $formaPagoTexto = self::FORMAS_PAGO_TEXTO[$venta->formaPagoSri()] ?? 'OTROS';

        $logoBase64 = $this->obtenerLogoBase64();

        $pdf = Pdf::loadView('sri.ride', [
            'factura' => $factura,
            'venta' => $venta,
            'sri' => SriConfigService::get(),
            'qrBase64' => $qrBase64,
            'logoBase64' => $logoBase64,
            'formaPagoTexto' => $formaPagoTexto,
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
     * Obtiene el logo de la empresa como data URI base64, usando el mismo
     * helper getLogoUrl() que ya usa el flujo de venta (pdf.sale-pdf).
     */
    private function obtenerLogoBase64(): string
    {
        $logoUrl = getLogoUrl();
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
}