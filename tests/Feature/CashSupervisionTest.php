<?php

namespace Tests\Feature;

use App\Models\CashMovement;
use App\Models\CashRegister;
use App\Models\POSRegister;
use App\Models\Store;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class CashSupervisionTest extends TestCase
{
    use DatabaseTransactions;

    public function test_supervisor_can_view_paginated_movements_from_another_open_session(): void
    {
        [$store, $warehouse, $supervisor] = $this->context(['view_cash_supervision']);
        $cashier = $this->user('cajero');
        $cashier->stores()->attach($store->id);
        $session = $this->openSession($store, $warehouse, $cashier);

        foreach (range(1, 12) as $position) {
            $this->movement($session, $supervisor, [
                'amount' => 2,
                'balance_after' => 20 + ($position * 2),
                'reference' => "ING-{$position}",
            ]);
        }

        Sanctum::actingAs($supervisor, ['*']);
        $response = $this->withHeader('X-Store-Id', $store->id)
            ->getJson("/api/cash-control/sessions/{$session->id}/movements?per_page=5&page=2")
            ->assertOk()
            ->assertJsonPath('current_page', 2)
            ->assertJsonPath('per_page', 5)
            ->assertJsonPath('total', 12)
            ->assertJsonPath('session.id', $session->id)
            ->assertJsonPath('summary.opening_cash', 20)
            ->assertJsonPath('summary.manual_income', 24);

        $this->assertCount(5, $response->json('data'));
    }

    public function test_cashier_with_only_own_session_permission_cannot_supervise_another_session(): void
    {
        [$store, $warehouse, $cashier] = $this->context(['view_own_cash_session']);
        $otherCashier = $this->user('otro-cajero');
        $otherCashier->stores()->attach($store->id);
        $session = $this->openSession($store, $warehouse, $otherCashier);

        Sanctum::actingAs($cashier, ['*']);
        $this->withHeader('X-Store-Id', $store->id)
            ->getJson("/api/cash-control/sessions/{$session->id}/movements")
            ->assertForbidden();
    }

    public function test_supervisor_cannot_view_a_session_from_another_store_or_a_closed_session(): void
    {
        [$store, $warehouse, $supervisor] = $this->context(['view_cash_supervision']);
        $cashier = $this->user('cajero-local');
        $cashier->stores()->attach($store->id);
        $closed = $this->openSession($store, $warehouse, $cashier);
        $closed->update(['closed_at' => now()]);

        setPermissionsTeamId($store->id);
        Sanctum::actingAs($supervisor, ['*']);
        $this->withHeader('X-Store-Id', $store->id)
            ->getJson("/api/cash-control/sessions/{$closed->id}/movements")
            ->assertNotFound();

        [$otherStore, $otherWarehouse] = $this->context();
        $otherCashier = $this->user('cajero-externo');
        $otherCashier->stores()->attach($otherStore->id);
        $foreign = $this->openSession($otherStore, $otherWarehouse, $otherCashier);
        setPermissionsTeamId($store->id);

        $this->withHeader('X-Store-Id', $store->id)
            ->getJson("/api/cash-control/sessions/{$foreign->id}/movements")
            ->assertNotFound();
    }

    private function context(array $permissions = []): array
    {
        $suffix = Str::lower(Str::random(10));
        $store = Store::create(['name' => "Caja {$suffix}", 'slug' => "caja-{$suffix}", 'is_active' => true]);
        $warehouse = Warehouse::create([
            'store_id' => $store->id,
            'name' => "Sucursal {$suffix}",
            'phone' => '0999999999',
            'country' => 'Ecuador',
            'city' => 'Manta',
            'email' => "sucursal-{$suffix}@example.test",
            'zip_code' => '130802',
            'is_active' => true,
        ]);
        $actor = $this->user('supervisor-'.$suffix);
        $actor->stores()->attach($store->id);
        setPermissionsTeamId($store->id);
        foreach ($permissions as $permission) {
            $actor->givePermissionTo(Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']));
        }

        return [$store, $warehouse, $actor];
    }

    private function user(string $prefix): User
    {
        $suffix = Str::lower(Str::random(8));

        return User::create([
            'first_name' => ucfirst($prefix),
            'last_name' => 'Prueba',
            'email' => "{$prefix}-{$suffix}@example.test",
            'phone' => '0987654321',
            'password' => bcrypt('secret123'),
            'status' => true,
        ]);
    }

    private function openSession(Store $store, Warehouse $warehouse, User $cashier): POSRegister
    {
        $register = CashRegister::create([
            'store_id' => $store->id,
            'warehouse_id' => $warehouse->id,
            'name' => 'Caja '.Str::upper(Str::random(4)),
            'code' => 'CJ-'.Str::upper(Str::random(8)),
            'is_active' => true,
        ]);

        return POSRegister::create([
            'cash_in_hand' => 20,
            'user_id' => $cashier->id,
            'warehouse_id' => $warehouse->id,
            'cash_register_id' => $register->id,
        ]);
    }

    private function movement(POSRegister $session, User $actor, array $overrides = []): CashMovement
    {
        return CashMovement::create(array_merge([
            'pos_register_id' => $session->id,
            'cash_register_id' => $session->cash_register_id,
            'store_id' => $session->warehouse->store_id,
            'warehouse_id' => $session->warehouse_id,
            'user_id' => $actor->id,
            'type' => CashMovement::MANUAL_INCOME,
            'direction' => CashMovement::IN,
            'amount' => 1,
            'balance_after' => 21,
            'description' => 'Ingreso supervisado',
        ], $overrides));
    }
}
