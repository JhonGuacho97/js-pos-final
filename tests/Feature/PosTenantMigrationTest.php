<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\OrganizationSubscription;
use App\Models\PresentationFamily;
use App\Models\Setting;
use App\Models\Store;
use App\Models\User;
use App\Models\Variation;
use App\Models\VariationType;
use App\Services\SriConfigService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Permission;
use Tests\CreatesSaaSTenant;
use Tests\TestCase;

class PosTenantMigrationTest extends TestCase
{
    use DatabaseTransactions, CreatesSaaSTenant;

    public function test_optional_contact_fields_cannot_create_a_customer_in_another_tenant(): void
    {
        [$organization, $store, $actor] = $this->tenant();
        [, $foreignStore] = $this->tenant();
        Sanctum::actingAs($actor, ['*']);

        $response = $this->withHeaders($this->headers($store))->postJson('/api/customers', [
            'store_id' => $foreignStore->id, 'name' => 'Cliente sin correo',
            'email' => ' N/A ', 'phone' => 'Sin teléfono',
            'country' => 'Ecuador', 'city' => 'Manta', 'address' => 'Centro',
        ])->assertCreated();

        $id = $response->json('data.id');
        $this->assertDatabaseHas('customers', ['id' => $id, 'store_id' => $store->id, 'email' => null, 'phone' => 'Sin teléfono']);
        $this->assertDatabaseMissing('customers', ['id' => $id, 'store_id' => $foreignStore->id]);

        $this->withHeaders($this->headers($store))->putJson('/api/customers/'.$id, [
            'name' => 'Cliente actualizado', 'email' => '', 'phone' => null,
            'country' => 'Ecuador', 'city' => 'Manta', 'address' => 'Centro',
        ])->assertOk();
        $this->assertDatabaseHas('customers', ['id' => $id, 'email' => null, 'phone' => null]);
    }

    public function test_customer_email_uniqueness_remains_scoped_to_the_store(): void
    {
        [, $store, $actor] = $this->tenant();
        [, $otherStore, $otherActor] = $this->tenant();
        $payload = ['name' => 'Cliente', 'email' => 'same@example.test', 'phone' => 'N/A', 'country' => 'Ecuador', 'city' => 'Manta', 'address' => 'Centro'];
        Sanctum::actingAs($actor, ['*']);
        $this->withHeaders($this->headers($store))->postJson('/api/customers', $payload)->assertCreated();
        $this->withHeaders($this->headers($store))->postJson('/api/customers', $payload)->assertUnprocessable();
        Sanctum::actingAs($otherActor, ['*']);
        $this->withHeaders($this->headers($otherStore))->postJson('/api/customers', $payload)->assertCreated();
    }

    public function test_expired_organization_can_read_but_cannot_create_customers(): void
    {
        [$organization, $store, $actor] = $this->tenant();
        OrganizationSubscription::where('organization_id', $organization->id)->update(['current_period_ends_at' => now()->subDay()]);
        Sanctum::actingAs($actor, ['*']);
        $before = DB::table('customers')->count();
        $this->withHeaders($this->headers($store))->getJson('/api/customers')->assertOk();
        $this->withHeaders($this->headers($store))->postJson('/api/customers', [
            'name' => 'No debe guardarse', 'country' => 'Ecuador', 'city' => 'Manta', 'address' => 'Centro',
        ])->assertStatus(402);
        $this->assertSame($before, DB::table('customers')->count());
    }

    public function test_presentation_bridge_and_catalog_only_expose_the_active_store(): void
    {
        [, $store, $actor] = $this->tenant();
        [, $foreignStore, $foreignActor] = $this->tenant();
        Sanctum::actingAs($foreignActor, ['*']);
        $this->withHeaders($this->headers($foreignStore))->postJson('/api/variations', [
            'name' => 'Empaques ajenos', 'is_presentation' => true, 'variation_types' => [['name' => 'Caja ajena']],
        ])->assertCreated();
        Sanctum::actingAs($actor, ['*']);
        $this->withHeaders($this->headers($store))->postJson('/api/variations', [
            'store_id' => $foreignStore->id, 'name' => 'Empaques propios', 'is_presentation' => true, 'variation_types' => [['name' => 'Caja propia']],
        ])->assertCreated();
        $this->withHeaders($this->headers($store))->getJson('/api/presentation-catalog')->assertOk()
            ->assertJsonFragment(['name' => 'Caja propia'])->assertJsonMissing(['name' => 'Caja ajena']);
        $this->assertDatabaseHas('variations', ['name' => 'Empaques propios', 'store_id' => $store->id]);
    }

    public function test_updating_a_variation_cannot_change_options_of_another_variation(): void
    {
        [, $store, $actor] = $this->tenant();
        $first = Variation::create(['store_id' => $store->id, 'name' => 'Primera']);
        $second = Variation::create(['store_id' => $store->id, 'name' => 'Segunda']);
        $option = VariationType::create(['store_id' => $store->id, 'variation_id' => $second->id, 'name' => 'Intacta']);
        Sanctum::actingAs($actor, ['*']);
        $this->withHeaders($this->headers($store))->putJson('/api/variations/'.$first->id, [
            'name' => 'Intento de cambio', 'variation_types' => [['id' => $option->id, 'name' => 'Alterada']],
        ])->assertUnprocessable();
        $this->assertSame('Intacta', $option->fresh()->name);
        $this->assertSame('Primera', $first->fresh()->name);
    }

    public function test_sri_provider_defaults_and_overrides_do_not_leak_between_tenants(): void
    {
        [, $store] = $this->tenant();
        [, $otherStore] = $this->tenant();
        config(['saas.sri_software_origin' => 'TERCERO', 'saas.sri_provider_ruc' => '1790012345001']);
        Setting::create(['store_id' => $store->id, 'key' => 'sri_software_origin', 'value' => 'PROPIO']);
        Setting::create(['store_id' => $store->id, 'key' => 'sri_provider_ruc', 'value' => '1799999999001']);
        $first = SriConfigService::get($store->id);
        $second = SriConfigService::get($otherStore->id);
        $this->assertSame('PROPIO', $first['software_origin']);
        $this->assertSame('', $first['provider_ruc']);
        $this->assertSame('TERCERO', $second['software_origin']);
        $this->assertSame('1790012345001', $second['provider_ruc']);
    }

    private function tenant(): array
    {
        $organization = $this->subscribedOrganization();
        $suffix = Str::lower(Str::random(10));
        $store = Store::create(['organization_id' => $organization->id, 'name' => 'Tienda '.$suffix, 'slug' => $suffix, 'is_active' => true]);
        $actor = User::create(['first_name' => 'Pruebas', 'last_name' => 'POS', 'email' => $suffix.'@example.test', 'password' => bcrypt('secret123'), 'status' => true]);
        $actor->stores()->attach($store->id);
        $organization->users()->attach($actor->id, ['role' => 'OWNER', 'status' => 'ACTIVE']);
        setPermissionsTeamId($store->id);
        foreach (['manage_customers', 'manage_variations'] as $name) {
            $actor->givePermissionTo(Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']));
        }

        return [$organization, $store, $actor];
    }

    private function headers(Store $store): array
    {
        return ['X-Store-Id' => $store->id, 'X-Organization-Id' => $store->organization_id];
    }
}
