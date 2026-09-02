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
use Tests\TestCase;

class RegisterReportTest extends TestCase
{
    use DatabaseTransactions;

    public function test_report_returns_filtered_totals_and_cash_register_context(): void
    {
        [$store, $warehouse, $user, $cashRegister] = $this->context();
        POSRegister::create([
            'cash_in_hand' => 20,
            'cash_in_hand_while_closing' => 116,
            'expected_cash' => 115,
            'cash_difference' => 1,
            'reconciliation_status' => 'PENDING',
            'closed_at' => now(),
            'user_id' => $user->id,
            'warehouse_id' => $warehouse->id,
            'cash_register_id' => $cashRegister->id,
        ]);
        POSRegister::create([
            'cash_in_hand' => 10,
            'cash_in_hand_while_closing' => 80,
            'expected_cash' => 80,
            'cash_difference' => 0,
            'reconciliation_status' => 'BALANCED',
            'closed_at' => now(),
            'user_id' => $user->id,
            'warehouse_id' => $warehouse->id,
            'cash_register_id' => $cashRegister->id,
        ]);

        Sanctum::actingAs($user, ['*']);
        $response = $this->withHeader('X-Store-Id', $store->id)
            ->getJson('/api/register-report?page[size]=10&difference=surplus')
            ->assertOk()
            ->assertJsonPath('summary.sessions', 1)
            ->assertJsonPath('summary.expected_cash', 115)
            ->assertJsonPath('summary.counted_cash', 116)
            ->assertJsonPath('summary.net_difference', 1)
            ->assertJsonPath('summary.pending', 1)
            ->assertJsonPath('data.0.attributes.cash_register.id', $cashRegister->id)
            ->assertJsonPath('data.0.attributes.warehouse.id', $warehouse->id);

        $this->assertCount(1, $response->json('data'));
    }

    public function test_closed_session_movements_are_paginated_and_scoped_to_owner(): void
    {
        [$store, $warehouse, $user, $cashRegister] = $this->context();
        $session = POSRegister::create([
            'cash_in_hand' => 20,
            'cash_in_hand_while_closing' => 32,
            'expected_cash' => 32,
            'cash_difference' => 0,
            'reconciliation_status' => 'BALANCED',
            'closed_at' => now(),
            'user_id' => $user->id,
            'warehouse_id' => $warehouse->id,
            'cash_register_id' => $cashRegister->id,
        ]);
        foreach (range(1, 12) as $position) {
            CashMovement::create([
                'pos_register_id' => $session->id,
                'cash_register_id' => $cashRegister->id,
                'store_id' => $store->id,
                'warehouse_id' => $warehouse->id,
                'user_id' => $user->id,
                'type' => CashMovement::SALE_PAYMENT,
                'direction' => CashMovement::IN,
                'amount' => 1,
                'balance_after' => 20 + $position,
                'description' => "Venta {$position}",
            ]);
        }

        Sanctum::actingAs($user, ['*']);
        $response = $this->withHeader('X-Store-Id', $store->id)
            ->getJson("/api/register-report/{$session->id}/movements?per_page=5&page[number]=2")
            ->assertOk()
            ->assertJsonPath('current_page', 2)
            ->assertJsonPath('total', 12)
            ->assertJsonPath('summary.cash_sales', 12);

        $this->assertCount(5, $response->json('data'));
    }

    private function context(): array
    {
        $suffix = Str::lower(Str::random(10));
        $store = Store::create(['name' => "Informe {$suffix}", 'slug' => "informe-{$suffix}", 'is_active' => true]);
        $warehouse = Warehouse::create([
            'store_id' => $store->id, 'name' => "Sucursal {$suffix}", 'phone' => '0999999999',
            'country' => 'Ecuador', 'city' => 'Manta', 'email' => "{$suffix}@example.test",
            'zip_code' => '130802', 'is_active' => true,
        ]);
        $user = User::create([
            'first_name' => 'Cajero', 'last_name' => 'Informe', 'email' => "cajero-{$suffix}@example.test",
            'phone' => '0987654321', 'password' => bcrypt('secret123'), 'status' => true,
        ]);
        $user->stores()->attach($store->id);
        setPermissionsTeamId($store->id);
        $cashRegister = CashRegister::create([
            'store_id' => $store->id, 'warehouse_id' => $warehouse->id, 'name' => 'Caja informe',
            'code' => 'INF-'.Str::upper(Str::random(6)), 'is_active' => true,
        ]);

        return [$store, $warehouse, $user, $cashRegister];
    }
}
