<?php

namespace Tests\Feature;

use App\Http\Controllers\API\ProductAPIController;
use App\Models\Product;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/** Actual controller/Eloquent serialization; the database exists ONLY in RAM. */
class PosCatalogPerformanceTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config([
            'database.default' => 'pos_catalog_memory',
            'database.connections.pos_catalog_memory' => [
                'driver' => 'sqlite', 'database' => ':memory:', 'prefix' => '', 'foreign_key_constraints' => false,
            ],
        ]);
        $this->assertSame(':memory:', DB::connection()->getDatabaseName());
        Storage::shouldReceive('url')->andReturn('https://example.test/barcode.png');
        $tables = [
            'products' => ['store_id', 'main_product_id', 'product_category_id', 'brand_id', 'product_unit', 'sale_unit', 'purchase_unit', 'product_price', 'product_cost', 'stock_alert', 'order_tax', 'tax_type', 'is_kit', 'manage_presentations'],
            'main_products' => ['store_id'],
            'product_categories' => ['store_id'], 'brands' => ['store_id'],
            'warehouses' => ['store_id', 'is_active'],
            'manage_stocks' => ['warehouse_id', 'product_id', 'quantity', 'alert'],
            'variation_products' => ['main_product_id', 'product_id', 'variation_id', 'variation_type_id'],
            'variations' => [], 'variation_types' => ['variation_id'],
            'base_units' => [], 'units' => ['base_unit'],
            'product_warehouse_prices' => ['product_id', 'warehouse_id', 'price'],
            'presentation_types' => ['presentation_family_id'],
            'product_presentations' => ['product_id', 'presentation_type_id', 'variation_type_id', 'equivalence', 'price', 'cost', 'sort', 'is_base_unit', 'is_default'],
            'presentation_warehouse_prices' => ['product_presentation_id', 'warehouse_id', 'price'],
            'product_kit_items' => ['kit_product_id', 'component_product_id', 'component_product_presentation_id', 'quantity'],
            'media' => ['model_id', 'order_column'],
        ];
        foreach ($tables as $name => $columns) {
            Schema::create($name, function (Blueprint $table) use ($name, $columns) {
                $table->id(); $table->string('name')->nullable();
                foreach ($columns as $column) $table->double($column)->nullable();
                $table->string('code')->nullable();
                if ($name === 'media') {
                    $table->string('model_type'); $table->string('collection_name');
                }
                $table->timestamps();
            });
        }
        DB::table('warehouses')->insert([
            ['id' => 1, 'name' => 'Active', 'store_id' => 1, 'is_active' => 1],
            ['id' => 2, 'name' => 'Inactive', 'store_id' => 1, 'is_active' => 0],
            ['id' => 3, 'name' => 'Other store', 'store_id' => 2, 'is_active' => 1],
        ]);
        DB::table('product_categories')->insert(['id' => 1, 'name' => 'Category']);
        DB::table('brands')->insert(['id' => 1, 'name' => 'Brand']);
        DB::table('base_units')->insert(['id' => 1, 'name' => 'Unit']);
        DB::table('units')->insert(['id' => 1, 'name' => 'Unit', 'base_unit' => 1]);
        DB::table('variations')->insert(['id' => 1, 'name' => 'Size']);
        DB::table('variation_types')->insert(['id' => 1, 'name' => 'Small', 'variation_id' => 1]);
        DB::table('presentation_types')->insert(['id' => 1, 'name' => 'Box', 'presentation_family_id' => 1]);
    }

    private function seedProducts(int $from, int $to, int $store = 1, int $warehouse = 1): void
    {
        for ($id = $from; $id <= $to; $id++) {
            DB::table('main_products')->insert(['id' => $id, 'name' => "Product $id", 'store_id' => $store]);
            DB::table('products')->insert([
                'id' => $id, 'name' => "Product $id", 'code' => "P$id", 'store_id' => $store,
                'main_product_id' => $id, 'brand_id' => 1, 'product_category_id' => 1,
                'product_unit' => 1, 'sale_unit' => 1, 'purchase_unit' => 1,
                'product_price' => 10, 'product_cost' => 2, 'tax_type' => 1,
                'is_kit' => 0, 'manage_presentations' => 1,
            ]);
            DB::table('variation_products')->insert(['id' => $id, 'product_id' => $id, 'main_product_id' => $id, 'variation_id' => 1, 'variation_type_id' => 1]);
            DB::table('manage_stocks')->insert(['product_id' => $id, 'warehouse_id' => $warehouse, 'quantity' => 7]);
            DB::table('product_warehouse_prices')->insert(['product_id' => $id, 'warehouse_id' => $warehouse, 'price' => 12]);
            DB::table('product_presentations')->insert([
                'id' => $id, 'product_id' => $id, 'presentation_type_id' => 1,
                'equivalence' => 6, 'price' => 60, 'cost' => null, 'sort' => 0,
            ]);
            DB::table('presentation_warehouse_prices')->insert(['product_presentation_id' => $id, 'warehouse_id' => $warehouse, 'price' => 65]);
        }
    }

    private function catalog(int $warehouse = 1, int $store = 1): array
    {
        $request = Request::create('/api/products', 'GET', ['warehouse_id' => $warehouse, 'page' => ['size' => 0]]);
        $request->attributes->set('current_store_id', $store);
        $this->app->instance('request', $request);
        DB::flushQueryLog(); DB::enableQueryLog();
        $collection = $this->app->make(ProductAPIController::class)->index($request);
        $result = $collection->resolve($request);
        $queries = count(DB::getQueryLog()); DB::disableQueryLog();
        return [$result['data'] ?? $result, $queries];
    }

    public function test_list_queries_do_not_grow_per_product_and_prices_and_presentations_are_preserved(): void
    {
        $this->seedProducts(1, 1);
        [$one, $oneQueries] = $this->catalog();
        $this->seedProducts(2, 25);
        [$many, $manyQueries] = $this->catalog();
        $this->assertCount(25, $many);
        $this->assertLessThanOrEqual($oneQueries + 1, $manyQueries, "1 product: $oneQueries queries; 25 products: $manyQueries");
        $this->assertLessThan(30, $manyQueries);
        $attributes = $many[0]['attributes'];
        $this->assertEquals(12, $attributes['effective_price']);
        $this->assertEquals(7, $attributes['stock']->quantity);
        $this->assertSame('Size', $attributes['variation_product']['variation_name']);
        $this->assertSame('Small', $attributes['variation_product']['variation_type_name']);
        $this->assertSame('Box', $attributes['presentations'][0]['name']);
        $this->assertEquals(65, $attributes['presentations'][0]['effective_price']);
        $this->assertEquals(12, $attributes['presentations'][0]['effective_cost']);
    }

    public function test_active_warehouse_summary_matches_the_previous_shape_and_excludes_inactive_warehouses(): void
    {
        $this->seedProducts(1, 1);
        DB::table('manage_stocks')->insert(['product_id' => 1, 'warehouse_id' => 2, 'quantity' => 99]);
        [$catalog] = $this->catalog();
        $summary = $catalog[0]['attributes']['warehouse'];
        $this->assertCount(1, $summary);
        $this->assertSame(['total_quantity', 'warehouse_id', 'name'], array_keys($summary[0]));
        $this->assertEquals(7, $summary[0]['total_quantity']);
        $this->assertSame('Active', $summary[0]['name']);
    }

    public function test_store_filter_is_preserved_and_foreign_warehouse_is_rejected(): void
    {
        $this->seedProducts(1, 1);
        $this->seedProducts(2, 2, 2, 3);
        [$catalog] = $this->catalog();
        $this->assertCount(1, $catalog);
        $this->assertEquals(1, $catalog[0]['id']);
        $this->expectException(\Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException::class);
        $this->catalog(3, 1);
    }

    public function test_kit_stock_is_recalculated_from_current_components_without_modifying_inventory(): void
    {
        $this->seedProducts(1, 3);
        DB::table('products')->where('id', 3)->update(['is_kit' => 1, 'manage_presentations' => 0]);
        DB::table('product_kit_items')->insert([
            ['kit_product_id' => 3, 'component_product_id' => 1, 'quantity' => 2],
            ['kit_product_id' => 3, 'component_product_id' => 2, 'quantity' => 1],
        ]);
        [$catalog] = $this->catalog();
        $kit = collect($catalog)->firstWhere('id', 3)['attributes'];
        $this->assertEquals(3, $kit['stock']->quantity);
        $this->assertEquals(3, $kit['in_stock']);
        $this->assertCount(2, $kit['kit_items']);
        $this->assertEquals(7, DB::table('manage_stocks')->where('product_id', 3)->value('quantity'));
        DB::table('manage_stocks')->where('product_id', 1)->update(['quantity' => 2]);
        [$updated] = $this->catalog();
        $this->assertEquals(1, collect($updated)->firstWhere('id', 3)['attributes']['in_stock']);
        // The sale path without eager-loaded relations still uses live quantities.
        $this->assertEquals(1, Product::findOrFail(3)->buildableQuantity(1));
    }
}
