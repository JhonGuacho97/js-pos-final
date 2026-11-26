<?php

namespace Tests\Unit;

use App\Models\Customer;
use App\Models\ElectronicInvoice;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Services\SriCatalogo;
use App\Services\SriRideService;
use App\Services\SriXmlService;
use Illuminate\Database\Eloquent\Collection;
use Tests\TestCase;

/**
 * Reglas de la ficha técnica del SRI (esquema offline 2.34) que el sistema
 * debe respetar al armar el XML y el RIDE.
 */
class SriFichaTecnicaTest extends TestCase
{
    public function test_tabla_17_codigos_de_iva(): void
    {
        $this->assertSame('0', SriCatalogo::codigoPorcentajeIva(0));
        $this->assertSame('5', SriCatalogo::codigoPorcentajeIva(5));
        $this->assertSame('2', SriCatalogo::codigoPorcentajeIva(12));
        $this->assertSame('10', SriCatalogo::codigoPorcentajeIva(13));
        $this->assertSame('4', SriCatalogo::codigoPorcentajeIva(15));
    }

    public function test_tarifa_desconocida_detiene_la_emision(): void
    {
        $this->expectException(\RuntimeException::class);
        SriCatalogo::codigoPorcentajeIva(7);
    }

    public function test_tabla_24_transferencia_y_cheque_usan_el_codigo_20(): void
    {
        $this->assertSame('20', Sale::codigoFormaPagoSri(Sale::BANK_TRANSFER));
        $this->assertSame('20', Sale::codigoFormaPagoSri(Sale::CHEQUE));
        $this->assertSame('01', Sale::codigoFormaPagoSri(Sale::CASH));
    }

    public function test_totales_separados_por_tarifa(): void
    {
        $items = new Collection([
            $this->item(15, 11.50, 1.50),
            $this->item(0, 4.00, 0),
            $this->item(15, 23.00, 3.00),
        ]);

        $this->assertSame([
            '0' => ['base' => 4.0, 'valor' => 0.0, 'tarifa' => 0.0],
            '4' => ['base' => 30.0, 'valor' => 4.5, 'tarifa' => 15.0],
        ], SriXmlService::totalesPorTarifa($items));
    }

    public function test_consumidor_final_mayor_a_50_no_se_factura(): void
    {
        $final = new Customer(['name' => 'Consumidor Final', 'es_consumidor_final' => true]);
        $identificado = new Customer(['name' => 'Maria', 'identification' => '1317342465']);

        $this->assertTrue(SriXmlService::excedeConsumidorFinal($this->sale($final, 50.01)));
        $this->assertFalse(SriXmlService::excedeConsumidorFinal($this->sale($final, 50.00)));
        $this->assertFalse(SriXmlService::excedeConsumidorFinal($this->sale($identificado, 500)));
    }

    public function test_el_ride_toma_subtotales_pagos_fecha_y_leyenda_del_xml(): void
    {
        $factura = new ElectronicInvoice([
            'tipo_comprobante' => ElectronicInvoice::FACTURA,
            'xml_autorizado' => '<?xml version="1.0" encoding="UTF-8"?><factura id="comprobante"><infoTributaria><contribuyenteRimpe>CONTRIBUYENTE NEGOCIO POPULAR - RÉGIMEN RIMPE</contribuyenteRimpe></infoTributaria><infoFactura><fechaEmision>24/11/2026</fechaEmision><totalSinImpuestos>34.00</totalSinImpuestos><totalDescuento>1.00</totalDescuento><totalConImpuestos><totalImpuesto><codigo>2</codigo><codigoPorcentaje>0</codigoPorcentaje><baseImponible>4.00</baseImponible><valor>0.00</valor></totalImpuesto><totalImpuesto><codigo>2</codigo><codigoPorcentaje>4</codigoPorcentaje><baseImponible>30.00</baseImponible><valor>4.50</valor></totalImpuesto></totalConImpuestos><importeTotal>38.50</importeTotal><pagos><pago><formaPago>20</formaPago><total>38.50</total></pago></pagos></infoFactura></factura>',
        ]);

        $service = app(SriRideService::class);
        $resumen = $this->invocar($service, 'resumenTributario', [$factura, new Collection(), 'infoFactura', [], [
            'fecha' => 'x', 'descuento' => 0, 'total' => 0, 'pagos' => [],
        ]]);

        $this->assertSame([
            ['label' => 'Subtotal 0%', 'valor' => 4.0],
            ['label' => 'Subtotal 15%', 'valor' => 30.0],
        ], $resumen['subtotales']);
        $this->assertSame([['label' => 'IVA 15%', 'valor' => 4.5]], $resumen['ivas']);
        $this->assertSame(1.0, $resumen['descuento']);
        $this->assertSame(38.5, $resumen['total']);
        $this->assertSame('24/11/2026', $resumen['fecha_emision']);
        $this->assertSame('OTROS CON UTILIZACIÓN DEL SISTEMA FINANCIERO', $resumen['pagos'][0]['texto']);
        $this->assertSame(
            'CONTRIBUYENTE NEGOCIO POPULAR - RÉGIMEN RIMPE',
            $this->invocar($service, 'leyendaRimpe', [$factura, []])
        );
    }

    private function item(float $tarifa, float $subTotal, float $iva): SaleItem
    {
        $item = new SaleItem(['tax_value' => $tarifa, 'sub_total' => $subTotal, 'tax_amount' => $iva]);
        $item->setRelation('sale', new Sale(['tax_rate' => 0]));

        return $item;
    }

    private function sale(Customer $customer, float $total): Sale
    {
        $sale = new Sale(['grand_total' => $total]);
        $sale->setRelation('customer', $customer);

        return $sale;
    }

    private function invocar(object $objeto, string $metodo, array $args)
    {
        $m = new \ReflectionMethod($objeto, $metodo);
        $m->setAccessible(true);

        return $m->invokeArgs($objeto, $args);
    }
}
