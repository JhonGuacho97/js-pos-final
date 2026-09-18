<?php

namespace Tests\Feature;

use App\Models\BaseUnit;
use App\Models\Brand;
use App\Models\Customer;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\ProductPresentation;
use App\Models\PresentationFamily;
use App\Models\PresentationType;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Sale;
use App\Models\Store;
use App\Models\Variation;
use App\Models\VariationType;
use App\Models\Warehouse;
use App\Models\User;
use App\Repositories\PurchaseRepository;
use App\Repositories\SaleRepository;
use App\Repositories\VariationRepository;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Permission;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Tests\TestCase;

class PresentationCalculationIntegrityTest extends TestCase
{
    use DatabaseTransactions;

    public function test_purchase_uses_presentation_quantity_for_money_and_base_quantity_for_stock(): void
    {
        [$product, $presentation] = $this->presentationProduct(21, 30, 24);

        $item = app(PurchaseRepository::class)->calculationPurchaseItems($this->line(
            $product,
            $presentation,
            5,
            ['product_cost' => 21]
        ));

        $this->assertSame(5.0, (float) $item['presentation_quantity']);
        $this->assertSame(24.0, (float) $item['presentation_equivalence']);
        $this->assertSame(120.0, (float) $item['quantity']);
        $this->assertSame(105.0, (float) $item['sub_total']);
    }

    public function test_sale_rejects_an_unauthorized_presentation_price_override(): void
    {
        [$product, $presentation] = $this->presentationProduct(21, 30, 24);

        $this->expectException(UnprocessableEntityHttpException::class);
        app(SaleRepository::class)->calculationSaleItems($this->line(
            $product,
            $presentation,
            5,
            ['product_price' => 999]
        ));
    }

    public function test_authorized_price_override_is_calculated_and_audited(): void
    {
        [$product, $presentation] = $this->presentationProduct(21, 30, 24);
        $store = Store::findOrFail($product->store_id);
        $suffix = Str::lower(Str::random(8));
        $user = User::create([
            'first_name' => 'Supervisor',
            'last_name' => 'POS',
            'email' => "supervisor-{$suffix}@example.test",
            'phone' => '0999999999',
            'password' => bcrypt('secret123'),
            'status' => true,
        ]);
        $user->stores()->attach($store->id);
        setPermissionsTeamId($store->id);
        $user->givePermissionTo(Permission::firstOrCreate([
            'name' => 'override_pos_price',
            'guard_name' => 'web',
        ], ['display_name' => 'Modificar precio en el POS']));
        Auth::login($user);

        $item = app(SaleRepository::class)->calculationSaleItems($this->line(
            $product,
            $presentation,
            5,
            ['product_price' => 27, 'price_override_reason' => 'Precio acordado']
        ));

        $this->assertSame(30.0, (float) $item['catalog_price']);
        $this->assertSame(27.0, (float) $item['product_price']);
        $this->assertSame('Precio acordado', $item['price_override_reason']);
        $this->assertSame($user->id, $item['price_overridden_by']);
        $this->assertSame(5.0, (float) $item['presentation_quantity']);
        $this->assertSame(120.0, (float) $item['quantity']);
        $this->assertSame(135.0, (float) $item['sub_total']);
        Auth::logout();
    }

    public function test_sale_quantity_limit_counts_presentations_without_confusing_them_with_stock_units(): void
    {
        [$product, $presentation] = $this->presentationProduct(21, 30, 24);
        $product->update(['quantity_limit' => 5]);
        $store = Store::findOrFail($product->store_id);
        $suffix = Str::lower(Str::random(10));
        $warehouse = Warehouse::create([
            'store_id' => $store->id,
            'name' => "Warehouse {$suffix}",
            'email' => "warehouse-{$suffix}@example.test",
            'phone' => '0999999999',
            'country' => 'Ecuador',
            'city' => 'Manabi',
            'is_active' => true,
        ]);
        $customer = Customer::create([
            'store_id' => $store->id,
            'name' => "Customer {$suffix}",
            'email' => "customer-{$suffix}@example.test",
            'phone' => '0999999999',
            'country' => 'Ecuador',
            'city' => 'Manabi',
            'address' => 'Manta',
        ]);
        $sale = Sale::create([
            'date' => now()->toDateString(),
            'customer_id' => $customer->id,
            'warehouse_id' => $warehouse->id,
            'status' => Sale::COMPLETED,
            'payment_status' => Sale::UNPAID,
            'payment_type' => 1,
        ]);

        app(SaleRepository::class)->storeSaleItems($sale, [
            'warehouse_id' => $warehouse->id,
            'sale_items' => [$this->line($product, $presentation, 2, [
                'product_price' => 30,
                'sale_unit' => (int) $product->product_unit,
            ])],
            'discount' => 0,
            'tax_rate' => 0,
            'shipping' => 0,
            'payment_status' => Sale::UNPAID,
            'paid_amount' => 0,
            'payment_type' => 1,
        ]);

        $item = $sale->saleItems()->firstOrFail();
        $this->assertSame(2.0, (float) $item->presentation_quantity);
        $this->assertSame(48.0, (float) $item->quantity);
    }

    public function test_purchase_item_exposes_presentation_traceability_to_the_frontend(): void
    {
        $item = new PurchaseItem([
            'product_presentation_id' => 8,
            'presentation_quantity' => 5,
            'presentation_equivalence' => 24,
        ]);
        $item->setRelation('product', new Product(['code' => 'TEST', 'name' => 'Test']));

        $attributes = $item->prepareAttributes();

        $this->assertSame(8, $attributes['product_presentation_id']);
        $this->assertSame(5.0, (float) $attributes['presentation_quantity']);
        $this->assertSame(24.0, (float) $attributes['presentation_equivalence']);
    }

    public function test_presentation_catalog_is_independent_from_product_variations(): void
    {
        $suffix = Str::upper(Str::random(8));
        $store = Store::create(['name' => "Catalog {$suffix}", 'slug' => 'catalog-' . Str::lower($suffix), 'is_active' => true]);
        $category = ProductCategory::create(['store_id' => $store->id, 'name' => "Tabaco {$suffix}"]);
        $brand = Brand::create(['store_id' => $store->id, 'name' => "Brand {$suffix}"]);
        $unit = BaseUnit::firstOrCreate(['name' => "Unit {$suffix}"]);
        $family = PresentationFamily::create(['store_id' => $store->id, 'name' => 'Tabaco', 'slug' => 'tabaco']);
        $type = PresentationType::create([
            'store_id' => $store->id,
            'presentation_family_id' => $family->id,
            'name' => 'Cajetilla',
            'slug' => 'cajetilla',
            'default_equivalence' => 20,
        ]);
        $product = Product::create([
            'store_id' => $store->id,
            'name' => "Cigarrillo {$suffix}",
            'code' => "CIG{$suffix}",
            'product_code' => "BAR{$suffix}",
            'product_category_id' => $category->id,
            'brand_id' => $brand->id,
            'product_cost' => .1,
            'product_price' => .2,
            'product_unit' => (string) $unit->id,
            'barcode_symbol' => Product::CODE128,
            'manage_presentations' => true,
        ]);

        $presentation = ProductPresentation::create([
            'product_id' => $product->id,
            'presentation_type_id' => $type->id,
            'equivalence' => 20,
            'price' => 3.5,
            'is_default' => true,
        ]);

        $attributes = $presentation->prepareAttributes();

        $this->assertNull($presentation->variation_type_id);
        $this->assertSame('Cajetilla', $attributes['name']);
        $this->assertSame($family->id, $attributes['presentation_family_id']);
        $this->assertSame(20.0, (float) $attributes['equivalence']);
    }

    public function test_variation_marked_for_sales_is_available_in_the_presentation_catalog(): void
    {
        $suffix = Str::upper(Str::random(8));
        $store = Store::create([
            'name' => "Presentation bridge {$suffix}",
            'slug' => 'presentation-bridge-'.Str::lower($suffix),
            'is_active' => true,
        ]);

        $variation = app(VariationRepository::class)->store([
            'store_id' => $store->id,
            'name' => 'Empaques',
            'is_presentation' => true,
            'variation_types' => [
                ['name' => 'Unidad'],
                ['name' => 'Caja x12'],
            ],
        ]);

        $family = PresentationFamily::where('store_id', $store->id)
            ->where('slug', 'legacy-'.$variation->id)
            ->firstOrFail();

        $this->assertTrue($family->is_active);
        $this->assertSame(['Unidad', 'Caja x12'], $family->types()->pluck('name')->all());
        $this->assertTrue($family->types()->where('is_active', true)->count() === 2);

        app(VariationRepository::class)->update([
            'name' => 'Empaques',
            'is_presentation' => false,
            'variation_types' => $variation->fresh('variation_types')->variation_types
                ->map(fn (VariationType $type) => ['id' => $type->id, 'name' => $type->name])
                ->all(),
            'deleted_variation_types' => [],
        ], $variation->id);

        $this->assertFalse($family->fresh()->is_active);
        $this->assertSame(0, $family->types()->where('is_active', true)->count());
    }

    private function line(Product $product, ProductPresentation $presentation, float $quantity, array $overrides): array
    {
        return array_merge([
            'product_id' => $product->id,
            'product_presentation_id' => $presentation->id,
            'quantity' => $quantity,
            'discount_type' => Purchase::FIXED,
            'discount_value' => 0,
            'tax_type' => Purchase::EXCLUSIVE,
            'tax_value' => 0,
            'purchase_unit' => null,
            'sale_unit' => null,
        ], $overrides);
    }

    private function presentationProduct(float $cost, float $price, float $equivalence): array
    {
        $suffix = Str::upper(Str::random(8));
        $store = Store::create(['name' => "Presentation {$suffix}", 'slug' => "presentation-".Str::lower($suffix), 'is_active' => true]);
        $category = ProductCategory::create(['store_id' => $store->id, 'name' => "Category {$suffix}"]);
        $brand = Brand::create(['store_id' => $store->id, 'name' => "Brand {$suffix}"]);
        $unit = BaseUnit::firstOrCreate(['name' => "Unit {$suffix}"]);
        $variation = Variation::create(['store_id' => $store->id, 'name' => "Presentations {$suffix}", 'is_presentation' => true]);
        $type = VariationType::create(['store_id' => $store->id, 'variation_id' => $variation->id, 'name' => 'Caja']);
        $product = Product::create([
            'store_id' => $store->id,
            'name' => "Product {$suffix}",
            'code' => "SKU{$suffix}",
            'product_code' => "BAR{$suffix}",
            'product_category_id' => $category->id,
            'brand_id' => $brand->id,
            'product_cost' => $cost / $equivalence,
            'product_price' => $price / $equivalence,
            'product_unit' => (string) $unit->id,
            'stock_alert' => 0,
            'barcode_symbol' => Product::CODE128,
            'manage_presentations' => true,
        ]);
        $presentation = ProductPresentation::create([
            'product_id' => $product->id,
            'variation_type_id' => $type->id,
            'equivalence' => $equivalence,
            'price' => $price,
            'cost' => $cost,
            'is_default' => true,
        ]);

        return [$product, $presentation];
    }
}
