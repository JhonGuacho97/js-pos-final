<?php

namespace Tests\Feature;

use App\Models\CatalogSetting;
use App\Models\Customer;
use App\Models\Sale;
use App\Models\Setting;
use App\Models\Store;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class WarehouseActivationTest extends TestCase
{
    use DatabaseTransactions;

    public function test_regular_selectors_only_return_active_warehouses(): void
    {
        [$store, $active, $inactive, $user] = $this->context();
        Sanctum::actingAs($user, ['*']);

        $response = $this->withHeader('X-Store-Id', $store->id)
            ->getJson('/api/warehouses?include_inactive=1&page[size]=50')
            ->assertOk();

        $ids = collect($response->json('data'))->pluck('id')->map(fn ($id) => (int) $id);
        $this->assertTrue($ids->contains($active->id));
        $this->assertFalse($ids->contains($inactive->id));
    }

    public function test_manager_can_see_inactive_warehouses_in_administration(): void
    {
        [$store, $active, $inactive, $user] = $this->context(['manage_warehouses']);
        Sanctum::actingAs($user, ['*']);

        $response = $this->withHeader('X-Store-Id', $store->id)
            ->getJson('/api/warehouses?include_inactive=1&page[size]=50')
            ->assertOk();

        $ids = collect($response->json('data'))->pluck('id')->map(fn ($id) => (int) $id);
        $this->assertTrue($ids->contains($active->id));
        $this->assertTrue($ids->contains($inactive->id));
    }

    public function test_disabling_a_warehouse_moves_defaults_and_excludes_its_metrics(): void
    {
        [$store, $warehouse, $replacement, $user] = $this->context(['manage_warehouses']);
        $replacement->update(['is_active' => true]);
        $customer = $this->customer($store);
        Sale::create([
            'date' => now()->toDateString(),
            'customer_id' => $customer->id,
            'warehouse_id' => $warehouse->id,
            'grand_total' => 25,
            'status' => 1,
            'payment_status' => 1,
            'reference_code' => 'SA_'.Str::upper(Str::random(8)),
        ]);
        Setting::updateOrCreate(
            ['store_id' => $store->id, 'key' => 'default_warehouse'],
            ['value' => (string) $warehouse->id]
        );
        CatalogSetting::create([
            'store_id' => $store->id,
            'warehouse_id' => $warehouse->id,
            'is_enabled' => false,
        ]);
        Sanctum::actingAs($user, ['*']);

        $this->withHeader('X-Store-Id', $store->id)
            ->putJson('/api/warehouses/'.$warehouse->id, [
                'name' => $warehouse->name,
                'email' => $warehouse->email,
                'phone' => $warehouse->phone,
                'country' => $warehouse->country,
                'city' => $warehouse->city,
                'zip_code' => $warehouse->zip_code,
                'is_active' => false,
            ])->assertOk()->assertJsonPath('data.attributes.is_active', false);

        $this->assertSame((string) $replacement->id, Setting::where('store_id', $store->id)
            ->where('key', 'default_warehouse')->value('value'));
        $this->assertSame($replacement->id, CatalogSetting::where('store_id', $store->id)->value('warehouse_id'));
        $this->withHeader('X-Store-Id', $store->id)
            ->getJson('/api/warehouse-report')
            ->assertOk()
            ->assertJsonPath('data.sale_count', 0);
    }

    public function test_last_active_warehouse_cannot_be_disabled(): void
    {
        [$store, $warehouse, $inactive, $user] = $this->context(['manage_warehouses']);
        $warehouse->update(['is_active' => false]);
        $inactive->update(['is_active' => true]);
        Sanctum::actingAs($user, ['*']);

        $this->withHeader('X-Store-Id', $store->id)
            ->putJson('/api/warehouses/'.$inactive->id, [
                'name' => $inactive->name,
                'email' => $inactive->email,
                'phone' => $inactive->phone,
                'country' => $inactive->country,
                'city' => $inactive->city,
                'zip_code' => $inactive->zip_code,
                'is_active' => false,
            ])->assertStatus(422);

        $this->assertTrue($inactive->fresh()->is_active);
    }

    private function context(array $permissions = []): array
    {
        $suffix = Str::lower(Str::random(10));
        $store = Store::create(['name' => "Bodegas {$suffix}", 'slug' => "bodegas-{$suffix}", 'is_active' => true]);
        $active = $this->warehouse($store, "Activa {$suffix}", true);
        $inactive = $this->warehouse($store, "Alterna {$suffix}", false);
        $user = User::create([
            'first_name' => 'Warehouse',
            'last_name' => 'Tester',
            'email' => "warehouse-user-{$suffix}@example.test",
            'phone' => '0988888888',
            'password' => bcrypt('secret123'),
            'status' => true,
        ]);
        $user->stores()->attach($store->id);
        setPermissionsTeamId($store->id);
        foreach ($permissions as $permission) {
            $user->givePermissionTo(Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']));
        }

        return [$store, $active, $inactive, $user];
    }

    private function warehouse(Store $store, string $name, bool $active): Warehouse
    {
        $suffix = Str::lower(Str::random(10));

        return Warehouse::create([
            'store_id' => $store->id,
            'name' => $name,
            'phone' => '0999999999',
            'country' => 'Ecuador',
            'city' => 'Manta',
            'email' => "warehouse-{$suffix}@example.test",
            'zip_code' => '130802',
            'is_active' => $active,
        ]);
    }

    private function customer(Store $store): Customer
    {
        $suffix = Str::lower(Str::random(10));

        return Customer::create([
            'store_id' => $store->id,
            'identification' => Str::random(10),
            'name' => 'Cliente prueba',
            'email' => "customer-{$suffix}@example.test",
            'phone' => '0999999999',
            'country' => 'Ecuador',
            'city' => 'Manta',
            'address' => 'Prueba',
        ]);
    }
}
