<?php

namespace Tests\Feature;

use App\Models\BaseUnit;
use App\Models\Brand;
use App\Models\ManageStock;
use App\Models\PresentationFamily;
use App\Models\PresentationType;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\ProductPresentation;
use App\Models\Store;
use App\Models\User;
use App\Models\Warehouse;
use App\Services\OfflineSaleStockDiagnosisService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class OfflineSaleStockDiagnosisTest extends TestCase
{
    use DatabaseTransactions;

    /** @test */
    public function it_reports_every_line_that_collectively_exceeds_available_stock(): void
    {
        [$store, $warehouse, $product] = $this->productWithStock(12);

        $diagnosis = app(OfflineSaleStockDiagnosisService::class)->diagnose([
            ['product_id' => $product->id, 'quantity' => 7],
            ['product_id' => $product->id, 'quantity' => 6],
        ], $warehouse->id, $store->id);

        $this->assertFalse($diagnosis['can_sync']);
        $this->assertCount(1, $diagnosis['conflicts']);
        $this->assertSame(13.0, (float) $diagnosis['conflicts'][0]['requested_quantity']);
        $this->assertSame(12.0, (float) $diagnosis['conflicts'][0]['available_quantity']);
        $this->assertSame(1.0, (float) $diagnosis['conflicts'][0]['shortage_quantity']);
        $this->assertTrue($diagnosis['items'][0]['has_conflict']);
        $this->assertTrue($diagnosis['items'][1]['has_conflict']);
    }

    /** @test */
    public function it_accepts_exact_stock_and_uses_the_authoritative_presentation_equivalence(): void
    {
        [$store, $warehouse, $product] = $this->productWithStock(24, true);
        $family = PresentationFamily::create([
            'store_id' => $store->id,
            'name' => 'Cajas ' . Str::random(5),
            'slug' => 'cajas-' . Str::lower(Str::random(8)),
        ]);
        $type = PresentationType::create([
            'store_id' => $store->id,
            'presentation_family_id' => $family->id,
            'name' => 'Caja',
            'slug' => 'caja-' . Str::lower(Str::random(8)),
            'default_equivalence' => 12,
        ]);
        $presentation = ProductPresentation::create([
            'product_id' => $product->id,
            'presentation_type_id' => $type->id,
            'equivalence' => 12,
            'price' => 10,
            'is_default' => true,
        ]);

        $diagnosis = app(OfflineSaleStockDiagnosisService::class)->diagnose([
            [
                'product_id' => $product->id,
                'product_presentation_id' => $presentation->id,
                'presentation_equivalence' => 99,
                'quantity' => 2,
            ],
        ], $warehouse->id, $store->id);

        $this->assertTrue($diagnosis['can_sync']);
        $this->assertSame(12.0, (float) $diagnosis['items'][0]['presentation_equivalence']);
        $this->assertSame(24.0, (float) $diagnosis['items'][0]['base_quantity']);
        $this->assertSame('Caja', $diagnosis['items'][0]['presentation_name']);
    }

    /** @test */
    public function the_diagnosis_endpoint_reports_conflicts_without_creating_a_sale(): void
    {
        [$store, $warehouse, $product] = $this->productWithStock(3);
        $salesBefore = DB::table('sales')->count();
        $user = User::create([
            'first_name' => 'Offline',
            'last_name' => 'Diagnosis',
            'email' => Str::uuid() . '@example.test',
            'phone' => '0987654321',
            'password' => bcrypt('secret123'),
            'status' => true,
        ]);
        $user->stores()->attach($store->id);
        setPermissionsTeamId($store->id);
        $user->givePermissionTo(Permission::firstOrCreate(['name' => 'manage_pos_screen', 'guard_name' => 'web']));
        $token = $user->createToken('offline-sync:phpunit', [
            'offline-sales:sync',
            "store:{$store->id}",
        ], now()->addDay())->plainTextToken;

        $this->withToken($token)->withHeaders([
            'X-Store-Id' => $store->id,
            'Origin' => rtrim(config('app.url'), '/'),
            'Referer' => rtrim(config('app.url'), '/') . '/',
        ])->postJson('/api/offline-sync/sales/diagnose', [
            'warehouse_id' => $warehouse->id,
            'sale_items' => [['product_id' => $product->id, 'quantity' => 5]],
        ])->assertOk()
            ->assertJsonPath('data.can_sync', false)
            ->assertJsonPath('data.conflicts.0.stock_product_id', $product->id)
            ->assertJsonPath('data.conflicts.0.shortage_quantity', 2);

        $this->assertSame($salesBefore, DB::table('sales')->count());
    }

    private function productWithStock(float $quantity, bool $presentations = false): array
    {
        $suffix = Str::upper(Str::random(8));
        $store = Store::create(['name' => "Offline {$suffix}", 'slug' => 'offline-' . Str::lower($suffix), 'is_active' => true]);
        $warehouse = Warehouse::create([
            'store_id' => $store->id,
            'name' => "Bodega {$suffix}",
            'phone' => '0999999999',
            'country' => 'Ecuador',
            'city' => 'Manta',
            'email' => "offline-{$suffix}@example.test",
        ]);
        $category = ProductCategory::create(['store_id' => $store->id, 'name' => "Categoría {$suffix}"]);
        $brand = Brand::create(['store_id' => $store->id, 'name' => "Marca {$suffix}"]);
        $unit = BaseUnit::firstOrCreate(['name' => "Unidad {$suffix}"]);
        $product = Product::create([
            'store_id' => $store->id,
            'name' => "Producto {$suffix}",
            'code' => "SKU{$suffix}",
            'product_code' => "BAR{$suffix}",
            'product_category_id' => $category->id,
            'brand_id' => $brand->id,
            'product_cost' => 1,
            'product_price' => 2,
            'product_unit' => (string) $unit->id,
            'warehouse_id' => $warehouse->id,
            'stock_alert' => 1,
            'barcode_symbol' => Product::CODE128,
            'manage_presentations' => $presentations,
        ]);
        ManageStock::create(['warehouse_id' => $warehouse->id, 'product_id' => $product->id, 'quantity' => $quantity]);

        return [$store, $warehouse, $product];
    }
}
