<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\CustomerAccount;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class CustomerPasswordManagementTest extends TestCase
{
    use DatabaseTransactions;

    public function test_customer_password_requires_its_permission_and_can_create_catalog_access(): void
    {
        [$store, $actor] = $this->actorContext();
        $customer = $this->customer($store);
        Sanctum::actingAs($actor, ['*']);
        $payload = ['password' => 'ClienteNueva123', 'password_confirmation' => 'ClienteNueva123'];

        $this->withHeader('X-Store-Id', $store->id)
            ->postJson("/api/customers/{$customer->id}/change-password", $payload)
            ->assertForbidden();

        setPermissionsTeamId($store->id);
        $actor->givePermissionTo(Permission::firstOrCreate([
            'name' => 'change_customer_passwords',
            'guard_name' => 'web',
        ]));

        $this->withHeader('X-Store-Id', $store->id)
            ->postJson("/api/customers/{$customer->id}/change-password", $payload)
            ->assertOk()
            ->assertJsonPath('message', 'Acceso al catálogo creado y contraseña establecida correctamente.');

        $account = CustomerAccount::where('customer_id', $customer->id)->firstOrFail();
        $this->assertTrue(Hash::check('ClienteNueva123', $account->password));
        $this->assertSame($store->id, $account->store_id);
    }

    public function test_user_password_change_is_protected_by_the_new_independent_permission(): void
    {
        [$store, $actor] = $this->actorContext(['manage_users']);
        $target = $this->user('destino');
        $target->stores()->attach($store->id);
        Sanctum::actingAs($actor, ['*']);
        $payload = ['password' => 'UsuarioNueva123', 'password_confirmation' => 'UsuarioNueva123'];

        $this->withHeader('X-Store-Id', $store->id)
            ->postJson("/api/users/{$target->id}/change-password", $payload)
            ->assertForbidden();

        setPermissionsTeamId($store->id);
        $actor->givePermissionTo(Permission::firstOrCreate([
            'name' => 'change_user_passwords',
            'guard_name' => 'web',
        ]));

        $this->withHeader('X-Store-Id', $store->id)
            ->postJson("/api/users/{$target->id}/change-password", $payload)
            ->assertOk();

        $this->assertTrue(Hash::check('UsuarioNueva123', $target->fresh()->password));
    }

    private function actorContext(array $permissions = []): array
    {
        $suffix = Str::lower(Str::random(10));
        $store = Store::create(['name' => "Claves {$suffix}", 'slug' => "claves-{$suffix}", 'is_active' => true]);
        $actor = $this->user('actor-'.$suffix);
        $actor->stores()->attach($store->id);
        setPermissionsTeamId($store->id);
        foreach ($permissions as $permission) {
            $actor->givePermissionTo(Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']));
        }

        return [$store, $actor];
    }

    private function user(string $suffix): User
    {
        return User::create([
            'first_name' => 'Prueba',
            'last_name' => 'Claves',
            'email' => "{$suffix}-".Str::lower(Str::random(6)).'@example.test',
            'phone' => '0987654321',
            'password' => Hash::make('Anterior123'),
            'status' => true,
        ]);
    }

    private function customer(Store $store): Customer
    {
        $suffix = Str::lower(Str::random(8));
        return Customer::create([
            'store_id' => $store->id,
            'identification' => Str::upper(Str::random(10)),
            'tipo_identificacion' => Customer::TIPO_CEDULA,
            'es_consumidor_final' => false,
            'name' => 'Cliente contraseña',
            'email' => "cliente-{$suffix}@example.test",
            'phone' => '0991234567',
            'country' => 'Ecuador',
            'city' => 'Manta',
            'address' => 'Dirección de prueba',
        ]);
    }
}
