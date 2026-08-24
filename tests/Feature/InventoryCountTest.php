<?php

namespace Tests\Feature;

use App\Models\BaseUnit;
use App\Models\Brand;
use App\Models\InventoryCount;
use App\Models\ManageStock;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Store;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class InventoryCountTest extends TestCase
{
    use DatabaseTransactions;

    public function test_it_creates_a_blind_snapshot_and_hides_expected_stock_from_counter(): void
    {
        [$store, $warehouse, $counter] = $this->context(['perform_inventory_counts']);
        $product = $this->productWithStock($store, $warehouse, 12);
        Sanctum::actingAs($counter, ['*']);

        $created = $this->withHeader('X-Store-Id', $store->id)->postJson('/api/inventory-counts', [
            'warehouse_id' => $warehouse->id,
            'blind_count' => true,
        ])->assertCreated()->json('data');

        $this->assertDatabaseHas('inventory_count_items', [
            'inventory_count_id' => $created['id'],
            'product_id' => $product->id,
            'expected_quantity' => 12,
        ]);
        $this->withHeader('X-Store-Id', $store->id)
            ->getJson('/api/inventory-counts/'.$created['id'])
            ->assertOk()
            ->assertJsonPath('items.data.0.expected_quantity', null)
            ->assertJsonPath('items.data.0.current_quantity', null);

        $itemId = InventoryCount::findOrFail($created['id'])->items()->value('id');
        $this->withHeader('X-Store-Id', $store->id)
            ->patchJson("/api/inventory-counts/{$created['id']}/items/{$itemId}", ['counted_quantity' => 0])
            ->assertOk()
            ->assertJsonPath('data.counted_quantity', 0)
            ->assertJsonPath('data.difference', null);
        $this->withHeader('X-Store-Id', $store->id)
            ->getJson('/api/inventory-counts/'.$created['id'].'?item_status=pending')
            ->assertOk()
            ->assertJsonCount(0, 'items.data');
    }

    public function test_approval_creates_adjustment_and_updates_stock_only_after_review(): void
    {
        [$store, $warehouse, $user] = $this->context(['perform_inventory_counts', 'approve_inventory_counts']);
        $product = $this->productWithStock($store, $warehouse, 10);
        Sanctum::actingAs($user, ['*']);
        $headers = ['X-Store-Id' => $store->id];

        $countId = $this->withHeaders($headers)->postJson('/api/inventory-counts', [
            'warehouse_id' => $warehouse->id,
        ])->assertCreated()->json('data.id');
        $itemId = InventoryCount::findOrFail($countId)->items()->where('product_id', $product->id)->value('id');

        $this->withHeaders($headers)->patchJson("/api/inventory-counts/{$countId}/items/{$itemId}", [
            'counted_quantity' => 7,
            'notes' => 'Tres unidades faltantes',
        ])->assertOk();
        $this->assertSame(10.0, (float) ManageStock::where('product_id', $product->id)->value('quantity'));

        $this->withHeaders($headers)->postJson("/api/inventory-counts/{$countId}/submit")->assertOk();
        $this->withHeaders($headers)->postJson("/api/inventory-counts/{$countId}/approve")
            ->assertOk()->assertJsonPath('data.status', InventoryCount::COMPLETED);

        $this->assertSame(7.0, (float) ManageStock::where('product_id', $product->id)->value('quantity'));
        $this->assertDatabaseHas('adjustment_items', [
            'product_id' => $product->id,
            'quantity' => 3,
            'method_type' => 2,
        ]);
        $this->assertNotNull(InventoryCount::find($countId)->adjustment_id);
    }

    public function test_approval_is_blocked_if_stock_changed_after_count_started(): void
    {
        [$store, $warehouse, $user] = $this->context(['perform_inventory_counts', 'approve_inventory_counts']);
        $product = $this->productWithStock($store, $warehouse, 10);
        Sanctum::actingAs($user, ['*']);
        $headers = ['X-Store-Id' => $store->id];
        $countId = $this->withHeaders($headers)->postJson('/api/inventory-counts', ['warehouse_id' => $warehouse->id])->json('data.id');
        $itemId = InventoryCount::findOrFail($countId)->items()->value('id');
        $this->withHeaders($headers)->patchJson("/api/inventory-counts/{$countId}/items/{$itemId}", ['counted_quantity' => 8])->assertOk();
        $this->withHeaders($headers)->postJson("/api/inventory-counts/{$countId}/submit")->assertOk();

        ManageStock::where('product_id', $product->id)->update(['quantity' => 9]);

        $this->withHeaders($headers)->postJson("/api/inventory-counts/{$countId}/approve")
            ->assertUnprocessable()
            ->assertJsonFragment(['El stock cambió después de iniciar el conteo en 1 producto(s). Cancele este conteo y genere uno nuevo.']);
        $this->assertSame(InventoryCount::REVIEW, InventoryCount::find($countId)->status);
        $this->assertDatabaseMissing('inventory_counts', ['id' => $countId, 'adjustment_id' => 1]);
        $this->assertSame(9.0, (float) ManageStock::where('product_id', $product->id)->value('quantity'));
    }

    public function test_count_items_are_paginated_without_repeating_the_first_page(): void
    {
        [$store, $warehouse, $counter] = $this->context(['perform_inventory_counts']);
        foreach (range(1, 23) as $index) {
            $this->productWithStock($store, $warehouse, $index);
        }
        Sanctum::actingAs($counter, ['*']);
        $headers = ['X-Store-Id' => $store->id];

        $countId = $this->withHeaders($headers)->postJson('/api/inventory-counts', [
            'warehouse_id' => $warehouse->id,
        ])->assertCreated()->json('data.id');

        $firstPage = $this->withHeaders($headers)
            ->getJson("/api/inventory-counts/{$countId}?page=1&per_page=10")
            ->assertOk()
            ->assertJsonPath('items.current_page', 1)
            ->assertJsonPath('items.last_page', 3)
            ->assertJsonCount(10, 'items.data')
            ->json('items.data');

        $secondPage = $this->withHeaders($headers)
            ->getJson("/api/inventory-counts/{$countId}?page=2&per_page=10")
            ->assertOk()
            ->assertJsonPath('items.current_page', 2)
            ->assertJsonPath('items.last_page', 3)
            ->assertJsonCount(10, 'items.data')
            ->json('items.data');

        $this->assertEmpty(array_intersect(
            array_column($firstPage, 'id'),
            array_column($secondPage, 'id')
        ));
    }

    public function test_creator_can_cancel_an_active_count_with_audited_reason(): void
    {
        [$store, $warehouse, $counter] = $this->context(['perform_inventory_counts']);
        $this->productWithStock($store, $warehouse, 5);
        Sanctum::actingAs($counter, ['*']);
        $headers = ['X-Store-Id' => $store->id];
        $countId = $this->withHeaders($headers)->postJson('/api/inventory-counts', [
            'warehouse_id' => $warehouse->id,
        ])->assertCreated()->json('data.id');

        $this->withHeaders($headers)->postJson("/api/inventory-counts/{$countId}/cancel", [
            'cancel_reason' => 'Se seleccionó la bodega equivocada',
        ])->assertOk()->assertJsonPath('data.status', InventoryCount::CANCELLED);

        $this->assertDatabaseHas('inventory_counts', [
            'id' => $countId,
            'status' => InventoryCount::CANCELLED,
            'cancel_reason' => 'Se seleccionó la bodega equivocada',
            'cancelled_by' => $counter->id,
        ]);
        $this->assertNotNull(InventoryCount::findOrFail($countId)->cancelled_at);
    }

    public function test_performer_cannot_cancel_another_users_count_or_a_count_in_review(): void
    {
        [$store, $warehouse, $creator] = $this->context(['perform_inventory_counts']);
        $this->productWithStock($store, $warehouse, 5);
        Sanctum::actingAs($creator, ['*']);
        $headers = ['X-Store-Id' => $store->id];
        $countId = $this->withHeaders($headers)->postJson('/api/inventory-counts', [
            'warehouse_id' => $warehouse->id,
        ])->assertCreated()->json('data.id');

        $other = User::create([
            'first_name' => 'Otro', 'last_name' => 'Contador', 'email' => Str::random(10).'@example.test',
            'phone' => '0977777777', 'password' => bcrypt('secret123'), 'status' => true,
        ]);
        $other->stores()->attach($store->id);
        setPermissionsTeamId($store->id);
        $other->givePermissionTo(Permission::firstOrCreate(['name' => 'perform_inventory_counts', 'guard_name' => 'web']));
        Sanctum::actingAs($other, ['*']);

        $this->withHeaders($headers)->postJson("/api/inventory-counts/{$countId}/cancel", [
            'cancel_reason' => 'Intento no autorizado',
        ])->assertForbidden();

        InventoryCount::whereKey($countId)->update(['status' => InventoryCount::REVIEW]);
        Sanctum::actingAs($creator, ['*']);
        $this->withHeaders($headers)->postJson("/api/inventory-counts/{$countId}/cancel", [
            'cancel_reason' => 'Ya fue enviado a revisión',
        ])->assertForbidden();
        $this->assertSame(InventoryCount::REVIEW, InventoryCount::findOrFail($countId)->status);
    }

    public function test_approver_can_cancel_a_count_in_review_but_not_a_completed_count(): void
    {
        [$store, $warehouse, $approver] = $this->context(['perform_inventory_counts', 'approve_inventory_counts']);
        $this->productWithStock($store, $warehouse, 5);
        Sanctum::actingAs($approver, ['*']);
        $headers = ['X-Store-Id' => $store->id];
        $countId = $this->withHeaders($headers)->postJson('/api/inventory-counts', [
            'warehouse_id' => $warehouse->id,
        ])->assertCreated()->json('data.id');
        InventoryCount::whereKey($countId)->update(['status' => InventoryCount::REVIEW]);

        $this->withHeaders($headers)->postJson("/api/inventory-counts/{$countId}/cancel", [
            'cancel_reason' => 'Diferencias que requieren un conteo nuevo',
        ])->assertOk()->assertJsonPath('data.status', InventoryCount::CANCELLED);

        InventoryCount::whereKey($countId)->update(['status' => InventoryCount::COMPLETED]);
        $this->withHeaders($headers)->postJson("/api/inventory-counts/{$countId}/cancel", [
            'cancel_reason' => 'No debe poder cancelarse',
        ])->assertUnprocessable();
    }

    private function context(array $permissions): array
    {
        $suffix = Str::lower(Str::random(10));
        $store = Store::create(['name' => "Conteo {$suffix}", 'slug' => "conteo-{$suffix}", 'is_active' => true]);
        $warehouse = Warehouse::create([
            'store_id' => $store->id, 'name' => "Bodega {$suffix}", 'phone' => '0999999999',
            'country' => 'Ecuador', 'city' => 'Manta', 'email' => "count-{$suffix}@example.test",
        ]);
        $user = User::create([
            'first_name' => 'Inventario', 'last_name' => 'Tester', 'email' => "counter-{$suffix}@example.test",
            'phone' => '0988888888', 'password' => bcrypt('secret123'), 'status' => true,
        ]);
        $user->stores()->attach($store->id);
        setPermissionsTeamId($store->id);
        $user->givePermissionTo(collect($permissions)->map(fn ($name) => Permission::firstOrCreate([
            'name' => $name, 'guard_name' => 'web',
        ]))->all());

        return [$store, $warehouse, $user];
    }

    private function productWithStock(Store $store, Warehouse $warehouse, float $quantity): Product
    {
        $suffix = Str::upper(Str::random(8));
        $category = ProductCategory::create(['store_id' => $store->id, 'name' => "Categoría {$suffix}"]);
        $brand = Brand::create(['store_id' => $store->id, 'name' => "Marca {$suffix}"]);
        $unit = BaseUnit::firstOrCreate(['name' => "Unidad {$suffix}"]);
        $product = Product::create([
            'store_id' => $store->id, 'name' => "Producto {$suffix}", 'code' => "SKU{$suffix}",
            'product_code' => "BAR{$suffix}", 'product_category_id' => $category->id,
            'brand_id' => $brand->id, 'product_cost' => 2, 'product_price' => 4,
            'product_unit' => (string) $unit->id, 'warehouse_id' => $warehouse->id,
            'stock_alert' => 2, 'barcode_symbol' => Product::CODE128,
        ]);
        ManageStock::create(['warehouse_id' => $warehouse->id, 'product_id' => $product->id, 'quantity' => $quantity]);

        return $product;
    }
}
