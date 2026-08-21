<?php

namespace Tests\Feature;

use App\Models\ElectronicInvoice;
use App\Models\SriSequenceAdjustment;
use App\Models\Store;
use App\Services\SriSequenceService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class SriSequenceServiceTest extends TestCase
{
    use DatabaseTransactions;

    public function test_it_adjusts_and_reserves_the_next_sequence_without_allowing_decreases(): void
    {
        $store = $this->store();
        $service = app(SriSequenceService::class);

        $initial = $service->listForSeries($store->id, 1, '001', '001');
        $this->assertSame('000000001', $initial[0]['proximo_formateado']);

        $adjusted = $service->adjustLastUsed(
            $store->id,
            1,
            '001',
            '001',
            ElectronicInvoice::FACTURA,
            120,
            'Migración desde el facturador anterior',
            null,
            '127.0.0.1',
            'PHPUnit'
        );

        $this->assertSame('000000121', $adjusted['proximo_formateado']);
        $this->assertSame('000000121', $service->reserveNext($store->id, 1, '001', '001', ElectronicInvoice::FACTURA));
        $this->assertSame('000000122', $service->reserveNext($store->id, 1, '001', '001', ElectronicInvoice::FACTURA));
        $this->assertSame(1, SriSequenceAdjustment::where('store_id', $store->id)->count());

        $this->expectException(ValidationException::class);
        $service->adjustLastUsed(
            $store->id,
            1,
            '001',
            '001',
            ElectronicInvoice::FACTURA,
            100,
            'Intento de disminuir la numeración',
            null,
            null,
            null
        );
    }

    public function test_it_keeps_independent_counters_by_environment_series_and_document_type(): void
    {
        $store = $this->store();
        $service = app(SriSequenceService::class);

        $this->assertSame('000000001', $service->reserveNext($store->id, 1, '001', '001', ElectronicInvoice::FACTURA));
        $this->assertSame('000000001', $service->reserveNext($store->id, 2, '001', '001', ElectronicInvoice::FACTURA));
        $this->assertSame('000000001', $service->reserveNext($store->id, 1, '001', '002', ElectronicInvoice::FACTURA));
        $this->assertSame('000000001', $service->reserveNext($store->id, 1, '001', '001', ElectronicInvoice::NOTA_CREDITO));
    }

    private function store(): Store
    {
        return Store::create([
            'name' => 'Sequence Test Store',
            'slug' => 'sequence-test-' . uniqid(),
            'is_active' => true,
        ]);
    }
}
