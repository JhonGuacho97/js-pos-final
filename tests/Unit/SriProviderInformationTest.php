<?php

namespace Tests\Unit;

use App\Services\SriSequenceService;
use App\Services\SriXmlService;
use App\Services\SriRideService;
use App\Models\ElectronicInvoice;
use Tests\TestCase;

class SriProviderInformationTest extends TestCase
{
    public function test_it_adds_the_provider_ruc_with_the_exact_sri_field_name(): void
    {
        $dom = new \DOMDocument('1.0', 'UTF-8');
        $root = $dom->createElement('factura');
        $dom->appendChild($root);

        $customer = (object) [
            'email' => 'cliente@example.com',
            'phone' => null,
            'address' => null,
        ];

        $this->invokeAdditionalInformation($dom, $root, $customer, [
            'software_origin' => 'TERCERO',
            'provider_ruc' => '1790012345001',
        ]);

        $xpath = new \DOMXPath($dom);
        $provider = $xpath->query('/factura/infoAdicional/campoAdicional[@nombre="RUC Proveedor"]')->item(0);

        $this->assertNotNull($provider);
        $this->assertSame('1790012345001', $provider->textContent);
    }

    public function test_it_omits_provider_ruc_for_own_software(): void
    {
        $dom = new \DOMDocument('1.0', 'UTF-8');
        $root = $dom->createElement('factura');
        $dom->appendChild($root);

        $this->invokeAdditionalInformation($dom, $root, null, [
            'software_origin' => 'PROPIO',
            'provider_ruc' => '',
        ]);

        $xpath = new \DOMXPath($dom);
        $this->assertSame(0, $xpath->query('//campoAdicional[@nombre="RUC Proveedor"]')->length);
        $this->assertSame(0, $xpath->query('/factura/infoAdicional')->length);
    }

    public function test_it_refuses_third_party_software_without_a_valid_provider_ruc(): void
    {
        $dom = new \DOMDocument('1.0', 'UTF-8');
        $root = $dom->createElement('notaCredito');
        $dom->appendChild($root);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('RUC de 13 dígitos del proveedor tecnológico');

        $this->invokeAdditionalInformation($dom, $root, null, [
            'software_origin' => 'TERCERO',
            'provider_ruc' => '',
        ]);
    }

    public function test_it_reads_debit_note_motives_and_totals_from_the_legal_xml(): void
    {
        $invoice = new ElectronicInvoice([
            'tipo_comprobante' => ElectronicInvoice::NOTA_DEBITO,
            'xml_autorizado' => '<?xml version="1.0"?><notaDebito><infoNotaDebito><numDocModificado>001-001-000000010</numDocModificado><fechaEmisionDocSustento>10/09/2026</fechaEmisionDocSustento><totalSinImpuestos>10.00</totalSinImpuestos><impuestos><impuesto><tarifa>15.00</tarifa><valor>1.50</valor></impuesto></impuestos><valorTotal>11.50</valorTotal></infoNotaDebito><motivos><motivo><razon>Interés por mora</razon><valor>10.00</valor></motivo></motivos></notaDebito>',
        ]);

        $service = app(SriRideService::class);
        $method = new \ReflectionMethod($service, 'extraerNotaDebitoData');
        $method->setAccessible(true);
        $data = $method->invoke($service, $invoice);

        $this->assertSame('001-001-000000010', $data['numero_documento_modificado']);
        $this->assertSame(10.0, $data['subtotal']);
        $this->assertSame(1.5, $data['iva']);
        $this->assertSame(11.5, $data['total']);
        $this->assertSame('Interés por mora', $data['motivos'][0]['razon']);
    }

    private function invokeAdditionalInformation(
        \DOMDocument $dom,
        \DOMElement $root,
        $customer,
        array $config
    ): void {
        $service = new SriXmlService(new SriSequenceService());
        $method = new \ReflectionMethod($service, 'agregarInformacionAdicional');
        $method->setAccessible(true);
        $method->invoke($service, $dom, $root, $customer, $config);
    }
}
