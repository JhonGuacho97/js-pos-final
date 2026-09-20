<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Sale;
use App\Models\SalesPayment;
use App\Models\Store;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class BankTransferPaymentsTest extends TestCase
{
    use DatabaseTransactions;

    public function test_module_lists_mixed_transfers_and_isolates_the_active_store(): void
    {
        [$store, $user, $sale] = $this->context('primary');
        [, , $foreignSale] = $this->context('foreign');

        SalesPayment::create(['sale_id' => $sale->id, 'payment_date' => now()->toDateString(), 'payment_type' => SalesPayment::OTHER, 'amount' => 10, 'received_amount' => 10]);
        $transfer = SalesPayment::create(['sale_id' => $sale->id, 'payment_date' => now()->toDateString(), 'payment_type' => SalesPayment::BANK_TRANSFER, 'amount' => 20, 'received_amount' => 20, 'reference' => 'BANCO-ABC-001']);
        SalesPayment::create(['sale_id' => $foreignSale->id, 'payment_date' => now()->toDateString(), 'payment_type' => SalesPayment::BANK_TRANSFER, 'amount' => 99, 'received_amount' => 99, 'reference' => 'BANCO-ABC-001']);

        Sanctum::actingAs($user, ['*']);
        $response = $this->withHeader('X-Store-Id', $store->id)
            ->getJson('/api/bank-transfer-payments?search=BANCO-ABC&mixed=1');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $transfer->id)
            ->assertJsonPath('data.0.sale.is_mixed', true)
            ->assertJsonPath('data.0.duplicate_count', 1)
            ->assertJsonPath('data.0.sale.payments.0.amount', 10)
            ->assertJsonPath('data.0.sale.payments.1.amount', 20)
            ->assertJsonPath('summary.amount', 20);
        $this->assertStringNotContainsString('Customer foreign', $response->getContent());
    }

    public function test_transfer_filter_in_sales_includes_a_mixed_sale_even_when_cash_is_legacy_primary_method(): void
    {
        [$store, $user, $sale] = $this->context('filter');
        SalesPayment::create(['sale_id' => $sale->id, 'payment_date' => now()->toDateString(), 'payment_type' => SalesPayment::BANK_TRANSFER, 'amount' => 25, 'received_amount' => 25, 'reference' => 'MIX-001']);

        Sanctum::actingAs($user, ['*']);
        $this->withHeader('X-Store-Id', $store->id)
            ->getJson('/api/sales?payment_type='.SalesPayment::BANK_TRANSFER)
            ->assertOk()
            ->assertJsonFragment(['reference_code' => $sale->reference_code]);
    }

    public function test_transfer_reference_is_required_and_reconciliation_is_audited(): void
    {
        [$store, $user, $sale] = $this->context('review');
        $payment = SalesPayment::create(['sale_id' => $sale->id, 'payment_date' => now()->toDateString(), 'payment_type' => SalesPayment::BANK_TRANSFER, 'amount' => 10, 'received_amount' => 10, 'reference' => 'REV-001']);

        Sanctum::actingAs($user, ['*']);
        $headers = ['X-Store-Id' => $store->id];

        $this->withHeaders($headers)->postJson("/api/sales/{$sale->id}/capture-payment", [
            'payment_date' => now()->toDateString(),
            'payment_type' => SalesPayment::BANK_TRANSFER,
            'amount' => 5,
        ])->assertUnprocessable();
        $this->assertSame(1, SalesPayment::where('sale_id', $sale->id)->count());

        $this->withHeaders($headers)->patchJson("/api/bank-transfer-payments/{$payment->id}/reconciliation", [
            'status' => SalesPayment::RECONCILIATION_OBSERVED,
            'note' => '',
        ])->assertUnprocessable();

        $this->withHeaders($headers)->patchJson("/api/bank-transfer-payments/{$payment->id}/reconciliation", [
            'status' => SalesPayment::RECONCILIATION_VERIFIED,
            'note' => 'Confirmada en el estado bancario.',
        ])->assertOk()->assertJsonPath('data.reconciliation_status', SalesPayment::RECONCILIATION_VERIFIED);

        $this->assertDatabaseHas('sales_payments', [
            'id' => $payment->id,
            'reconciliation_status' => SalesPayment::RECONCILIATION_VERIFIED,
            'reconciled_by' => $user->id,
        ]);
        $this->assertNotNull($payment->fresh()->reconciled_at);
    }

    private function context(string $label): array
    {
        $suffix = Str::lower(Str::random(8));
        $store = Store::create(['name' => "Transfer {$label}", 'slug' => "transfer-{$label}-{$suffix}", 'is_active' => true]);
        $user = User::create([
            'first_name' => 'Transfer', 'last_name' => 'Tester',
            'email' => "transfer-{$label}-{$suffix}@example.test", 'phone' => '0999999999',
            'password' => bcrypt('secret123'), 'status' => true,
        ]);
        $user->stores()->attach($store->id);
        setPermissionsTeamId($store->id);
        foreach (['manage_sale', 'view_bank_transfer_payments', 'reconcile_bank_transfer_payments'] as $name) {
            $user->givePermissionTo(Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']));
        }
        $warehouse = Warehouse::create([
            'store_id' => $store->id, 'name' => "Warehouse {$suffix}", 'phone' => '0999999999',
            'country' => 'Ecuador', 'city' => 'Manta', 'email' => "warehouse-{$suffix}@example.test", 'is_active' => true,
        ]);
        $customer = Customer::create([
            'store_id' => $store->id, 'name' => "Customer {$label}", 'email' => "customer-{$suffix}@example.test",
            'phone' => '0999999999', 'country' => 'Ecuador', 'city' => 'Manta', 'address' => 'Test',
        ]);
        $sale = Sale::create([
            'date' => now()->toDateString(), 'customer_id' => $customer->id, 'warehouse_id' => $warehouse->id,
            'grand_total' => 30, 'paid_amount' => 0, 'payment_type' => SalesPayment::CASH,
            'status' => Sale::COMPLETED, 'payment_status' => Sale::UNPAID,
            'reference_code' => "SALE-{$label}-{$suffix}", 'user_id' => $user->id,
        ]);

        return [$store, $user, $sale];
    }
}
