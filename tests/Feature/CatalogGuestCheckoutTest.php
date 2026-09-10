<?php

namespace Tests\Feature;

use App\Models\BaseUnit;
use App\Models\Brand;
use App\Models\CatalogOrder;
use App\Models\CatalogSetting;
use App\Models\Customer;
use App\Models\CustomerAccount;
use App\Models\ManageStock;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Store;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Tests\TestCase;

class CatalogGuestCheckoutTest extends TestCase
{
    use DatabaseTransactions;

    public function test_guest_can_create_an_order_and_is_saved_as_a_customer_without_an_account(): void
    {
        $store = $this->catalogStore();
        $product = $this->productWithStock($store, $store->warehouses()->firstOrFail(), 20);
        $payload = $this->guestPayload($product);

        $response = $this->postJson(route('catalog.orders.store', $store), $payload)
            ->assertCreated()
            ->assertJsonPath('message', 'Pedido registrado correctamente.');

        $customer = Customer::where('store_id', $store->id)
            ->where('email', $payload['customer_email'])
            ->firstOrFail();
        $order = CatalogOrder::where('reference', $response->json('data.reference'))->firstOrFail();

        $this->assertSame($customer->id, $order->customer_id);
        $this->assertSame($payload['customer_name'], $order->customer_name);
        $this->assertSame('0991234567', $order->customer_phone);
        $this->assertSame(0, CustomerAccount::where('customer_id', $customer->id)->count());
        $this->assertDatabaseHas('catalog_order_status_histories', [
            'catalog_order_id' => $order->id,
            'to_status' => CatalogOrder::PENDING,
        ]);
    }

    public function test_repeated_guest_checkout_reuses_the_store_customer(): void
    {
        $store = $this->catalogStore();
        $product = $this->productWithStock($store, $store->warehouses()->firstOrFail(), 20);
        $payload = $this->guestPayload($product);

        $this->postJson(route('catalog.orders.store', $store), $payload)->assertCreated();
        $payload['customer_phone'] = '+593 99 123 4567';
        $payload['customer_city'] = 'Portoviejo';
        $this->postJson(route('catalog.orders.store', $store), $payload)->assertCreated();

        $this->assertSame(1, Customer::where('store_id', $store->id)->count());
        $this->assertSame(2, CatalogOrder::where('store_id', $store->id)->count());
        $this->assertDatabaseHas('customers', [
            'store_id' => $store->id,
            'email' => $payload['customer_email'],
            'phone' => '0991234567',
            'city' => 'Portoviejo',
        ]);
    }

    public function test_the_same_guest_identity_is_isolated_between_stores(): void
    {
        $firstStore = $this->catalogStore();
        $secondStore = $this->catalogStore();
        $firstProduct = $this->productWithStock($firstStore, $firstStore->warehouses()->firstOrFail(), 10);
        $secondProduct = $this->productWithStock($secondStore, $secondStore->warehouses()->firstOrFail(), 10);
        $payload = $this->guestPayload($firstProduct);

        $this->postJson(route('catalog.orders.store', $firstStore), $payload)->assertCreated();
        $payload['items'][0]['product_id'] = $secondProduct->id;
        $this->postJson(route('catalog.orders.store', $secondStore), $payload)->assertCreated();

        $this->assertSame(2, Customer::where('email', $payload['customer_email'])->count());
        $this->assertSame(1, Customer::where('store_id', $firstStore->id)->where('email', $payload['customer_email'])->count());
        $this->assertSame(1, Customer::where('store_id', $secondStore->id)->where('email', $payload['customer_email'])->count());
    }

    public function test_conflicting_customer_identifiers_are_rejected_without_creating_an_order(): void
    {
        $store = $this->catalogStore();
        $product = $this->productWithStock($store, $store->warehouses()->firstOrFail(), 10);
        $first = $this->customer($store, 'Cliente Uno', 'uno@example.test', '0991111111', '1111111111');
        $second = $this->customer($store, 'Cliente Dos', 'dos@example.test', '0992222222', '2222222222');
        $payload = $this->guestPayload($product);
        $payload['customer_phone'] = $first->phone;
        $payload['customer_email'] = $second->email;
        $payload['customer_identification'] = '';

        $this->postJson(route('catalog.orders.store', $store), $payload)
            ->assertUnprocessable()
            ->assertJsonPath('message', 'El correo, teléfono o identificación pertenecen a clientes diferentes. Verifica los datos.');

        $this->assertSame(2, Customer::where('store_id', $store->id)->count());
        $this->assertSame(0, CatalogOrder::where('store_id', $store->id)->count());
    }

    public function test_invalid_cross_store_product_does_not_create_a_customer(): void
    {
        $store = $this->catalogStore();
        $otherStore = $this->catalogStore();
        $foreignProduct = $this->productWithStock($otherStore, $otherStore->warehouses()->firstOrFail(), 10);

        $this->postJson(route('catalog.orders.store', $store), $this->guestPayload($foreignProduct))
            ->assertUnprocessable()
            ->assertJsonPath('message', 'Uno de los productos ya no está disponible.');

        $this->assertSame(0, Customer::where('store_id', $store->id)->count());
        $this->assertSame(0, CatalogOrder::where('store_id', $store->id)->count());
    }

    public function test_catalog_account_endpoints_are_no_longer_exposed(): void
    {
        $this->assertFalse(Route::has('catalog.account.register'));
        $this->assertFalse(Route::has('catalog.account.login'));
        $this->assertFalse(Route::has('catalog.account.orders'));
    }

    private function guestPayload(Product $product): array
    {
        return [
            'customer_name' => 'Cliente del catálogo',
            'customer_phone' => '0991234567',
            'customer_email' => 'cliente-'.Str::lower(Str::random(8)).'@example.test',
            'customer_identification_type' => Customer::TIPO_CEDULA,
            'customer_identification' => Str::upper(Str::random(10)),
            'customer_city' => 'Manta',
            'privacy_consent' => true,
            'fulfillment_type' => 'pickup',
            'payment_method' => 'Efectivo',
            'items' => [[
                'product_id' => $product->id,
                'presentation_id' => null,
                'quantity' => 2,
            ]],
        ];
    }

    private function customer(Store $store, string $name, string $email, string $phone, string $identification): Customer
    {
        return Customer::create([
            'store_id' => $store->id,
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'identification' => $identification,
            'tipo_identificacion' => Customer::TIPO_CEDULA,
            'es_consumidor_final' => false,
            'country' => 'Ecuador',
            'city' => 'Manta',
            'address' => 'Retiro en tienda',
        ]);
    }

    private function catalogStore(): Store
    {
        $suffix = Str::lower(Str::random(10));
        $store = Store::create([
            'name' => "Catálogo {$suffix}",
            'slug' => "catalogo-{$suffix}",
            'is_active' => true,
        ]);
        $warehouse = Warehouse::create([
            'store_id' => $store->id,
            'name' => "Bodega {$suffix}",
            'phone' => '0999999999',
            'country' => 'Ecuador',
            'city' => 'Manta',
            'email' => "bodega-{$suffix}@example.test",
            'zip_code' => '130802',
            'is_active' => true,
        ]);
        CatalogSetting::create([
            'store_id' => $store->id,
            'warehouse_id' => $warehouse->id,
            'is_enabled' => true,
            'whatsapp_number' => '0999999999',
        ]);

        return $store;
    }

    private function productWithStock(Store $store, Warehouse $warehouse, float $quantity): Product
    {
        $suffix = Str::upper(Str::random(8));
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
            'product_cost' => 2,
            'product_price' => 4,
            'product_unit' => (string) $unit->id,
            'stock_alert' => 2,
            'barcode_symbol' => Product::CODE128,
            'catalog_visible' => true,
        ]);
        ManageStock::create([
            'warehouse_id' => $warehouse->id,
            'product_id' => $product->id,
            'quantity' => $quantity,
        ]);

        return $product;
    }
}
