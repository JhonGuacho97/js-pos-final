<?php

namespace Tests\Feature;

use App\Models\BaseUnit;
use App\Models\Brand;
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
use App\Repositories\PurchaseRepository;
use App\Repositories\SaleRepository;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Str;
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

    public function test_sale_uses_authoritative_presentation_price_without_mixing_base_units(): void
    {
        [$product, $presentation] = $this->presentationProduct(21, 30, 24);

        $item = app(SaleRepository::class)->calculationSaleItems($this->line(
            $product,
            $presentation,
            5,
            ['product_price' => 999]
        ));

        $this->assertSame(30.0, (float) $item['product_price']);
        $this->assertSame(5.0, (float) $item['presentation_quantity']);
        $this->assertSame(120.0, (float) $item['quantity']);
        $this->assertSame(150.0, (float) $item['sub_total']);
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
