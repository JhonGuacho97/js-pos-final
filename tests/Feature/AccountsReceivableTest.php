<?php

namespace Tests\Feature;

use App\Models\CreditNote;
use App\Models\CollectionActivity;
use App\Models\Customer;
use App\Models\Sale;
use App\Models\SalesPayment;
use App\Models\Store;
use App\Models\Warehouse;
use App\Models\User;
use App\Repositories\SalesPaymentRepository;
use App\Services\AccountsReceivableService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Permission;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Tests\TestCase;

class AccountsReceivableTest extends TestCase
{
    use DatabaseTransactions;

    public function test_balance_and_aging_come_from_payments_and_valid_credit_notes(): void
    {
        $sale = $this->sale(100, now()->subDays(40)->toDateString());
        SalesPayment::create([
            'sale_id' => $sale->id,
            'payment_date' => now()->toDateString(),
            'payment_type' => SalesPayment::BANK_TRANSFER,
            'amount' => 25,
            'received_amount' => 25,
        ]);
        CreditNote::create([
            'date' => now()->toDateString(),
            'sale_id' => $sale->id,
            'customer_id' => $sale->customer_id,
            'warehouse_id' => $sale->warehouse_id,
            'generar_como' => CreditNote::GENERAR_SALDO,
            'concepto' => CreditNote::CONCEPTO_DESCUENTO,
            'motivo' => 'Ajuste comercial',
            'grand_total' => 15,
            'status' => CreditNote::STATUS_ACTIVA,
        ]);

        $service = app(AccountsReceivableService::class);
        $record = $service->outstandingQuery()->with(['customer', 'warehouse'])->findOrFail($sale->id);
        $serialized = $service->serialize($record);

        $this->assertSame(60.0, $serialized['balance']);
        $this->assertSame('overdue', $serialized['collection_status']);
        $this->assertSame('31_60', $serialized['aging_bucket']);
        $this->assertSame(60.0, $service->summary([$record])['overdue']);
    }

    public function test_payment_repository_rejects_an_amount_above_net_balance_after_credit_notes(): void
    {
        $sale = $this->sale(100, now()->toDateString());
        CreditNote::create([
            'date' => now()->toDateString(),
            'sale_id' => $sale->id,
            'customer_id' => $sale->customer_id,
            'warehouse_id' => $sale->warehouse_id,
            'generar_como' => CreditNote::GENERAR_SALDO,
            'concepto' => CreditNote::CONCEPTO_DESCUENTO,
            'motivo' => 'Ajuste comercial',
            'grand_total' => 30,
            'status' => CreditNote::STATUS_ACTIVA,
        ]);

        $this->expectException(UnprocessableEntityHttpException::class);
        app(SalesPaymentRepository::class)->storeSalePayment([
            'payment_date' => now()->toDateString(),
            'payment_type' => SalesPayment::BANK_TRANSFER,
            'amount' => 71,
            'received_amount' => 71,
        ], $sale);
    }

    public function test_authorized_user_can_list_only_the_active_store_receivables(): void
    {
        $sale = $this->sale(80, now()->addDays(5)->toDateString());
        $store = $sale->warehouse->store;
        $suffix = Str::lower(Str::random(8));
        $user = User::create([
            'first_name' => 'Cartera',
            'last_name' => 'Tester',
            'email' => "ar-user-{$suffix}@example.test",
            'phone' => '0988888888',
            'password' => bcrypt('secret123'),
            'status' => true,
        ]);
        $user->stores()->attach($store->id);
        setPermissionsTeamId($store->id);
        $user->givePermissionTo([
            Permission::firstOrCreate(['name' => 'view_accounts_receivable', 'guard_name' => 'web']),
            Permission::firstOrCreate(['name' => 'collect_accounts_receivable', 'guard_name' => 'web']),
        ]);
        Sanctum::actingAs($user, ['*']);

        $this->withHeader('X-Store-Id', $store->id)
            ->getJson('/api/accounts-receivable')
            ->assertOk()
            ->assertJsonPath('data.0.id', $sale->id)
            ->assertJsonPath('data.0.balance', 80);

        $this->withHeader('X-Store-Id', $store->id)
            ->getJson("/api/customers/{$sale->customer_id}/credit-profile")
            ->assertOk()
            ->assertJsonPath('data.outstanding_balance', 80)
            ->assertJsonPath('data.documents', 1);

        $this->withHeader('X-Store-Id', $store->id)
            ->postJson("/api/accounts-receivable/{$sale->id}/activities", [
                'type' => CollectionActivity::PROMISE,
                'note' => 'Monto inválido.',
                'promised_payment_date' => now()->addDays(2)->toDateString(),
                'promised_amount' => 81,
            ])
            ->assertUnprocessable();
        $this->assertDatabaseMissing('collection_activities', ['note' => 'Monto inválido.']);

        $this->withHeader('X-Store-Id', $store->id)
            ->postJson("/api/accounts-receivable/{$sale->id}/activities", [
                'type' => CollectionActivity::PROMISE,
                'note' => 'Cliente confirma transferencia.',
                'promised_payment_date' => now()->addDays(2)->toDateString(),
                'promised_amount' => 50,
            ])
            ->assertCreated()
            ->assertJsonPath('data.type', CollectionActivity::PROMISE)
            ->assertJsonPath('data.promised_amount', 50);

        $this->assertDatabaseHas('collection_activities', [
            'sale_id' => $sale->id,
            'customer_id' => $sale->customer_id,
            'user_id' => $user->id,
            'type' => CollectionActivity::PROMISE,
        ]);

        $this->withHeader('X-Store-Id', $store->id)
            ->getJson("/api/accounts-receivable/{$sale->id}")
            ->assertOk()
            ->assertJsonPath('data.activities.0.note', 'Cliente confirma transferencia.');

        $secondSale = Sale::create([
            'date' => now()->toDateString(),
            'customer_id' => $sale->customer_id,
            'warehouse_id' => $sale->warehouse_id,
            'grand_total' => 30,
            'paid_amount' => 0,
            'payment_type' => SalesPayment::BANK_TRANSFER,
            'status' => Sale::COMPLETED,
            'payment_status' => Sale::UNPAID,
            'payment_due_date' => now()->addDay()->toDateString(),
            'payment_terms_days' => 1,
            'reference_code' => 'AR-SECOND-'.$suffix,
        ]);

        $this->withHeader('X-Store-Id', $store->id)
            ->getJson('/api/accounts-receivable/customers')
            ->assertOk()
            ->assertJsonPath('data.0.documents', 2)
            ->assertJsonPath('data.0.total_receivable', 110);

        $this->withHeader('X-Store-Id', $store->id)
            ->postJson("/api/accounts-receivable/customers/{$sale->customer_id}/payments", [
                'payment_date' => now()->toDateString(),
                'payment_type' => SalesPayment::BANK_TRANSFER,
                'amount' => 110.01,
            ])
            ->assertUnprocessable();
        $this->assertSame(0.0, (float) SalesPayment::whereIn('sale_id', [$sale->id, $secondSale->id])->sum('amount'));

        $this->withHeader('X-Store-Id', $store->id)
            ->postJson("/api/accounts-receivable/customers/{$sale->customer_id}/payments", [
                'payment_date' => now()->toDateString(),
                'payment_type' => SalesPayment::BANK_TRANSFER,
                'amount' => 100,
                'reference' => 'LOTE-001',
            ])
            ->assertCreated()
            ->assertJsonPath('data.allocations.0.sale_id', $secondSale->id)
            ->assertJsonPath('data.allocations.0.amount', 30)
            ->assertJsonPath('data.allocations.1.sale_id', $sale->id)
            ->assertJsonPath('data.allocations.1.amount', 70);

        $this->assertSame(30.0, (float) SalesPayment::whereSaleId($secondSale->id)->sum('amount'));
        $this->assertSame(70.0, (float) SalesPayment::whereSaleId($sale->id)->sum('amount'));

        $this->withHeader('X-Store-Id', $store->id)
            ->getJson("/api/accounts-receivable/customers/{$sale->customer_id}/statement")
            ->assertOk()
            ->assertJsonPath('data.summary.total_receivable', 10)
            ->assertJsonCount(1, 'data.documents');
    }

    public function test_controlled_credit_rejects_only_the_amount_above_available_limit(): void
    {
        $existing = $this->sale(60, now()->addDays(5)->toDateString());
        $customer = $existing->customer;
        $customer->update(['credit_enabled' => true, 'credit_limit' => 100]);
        $service = app(AccountsReceivableService::class);

        $service->assertCreditAvailable($customer, 40);
        $this->assertSame(40.0, $service->customerProfile($customer)['available_credit']);

        $this->expectException(UnprocessableEntityHttpException::class);
        $service->assertCreditAvailable($customer, 40.01);
    }

    public function test_advance_credit_note_does_not_reduce_invoice_receivable(): void
    {
        $sale = $this->sale(50, now()->addDay()->toDateString());
        CreditNote::create([
            'date' => now()->toDateString(),
            'sale_id' => $sale->id,
            'customer_id' => $sale->customer_id,
            'warehouse_id' => $sale->warehouse_id,
            'generar_como' => CreditNote::GENERAR_ANTICIPO,
            'concepto' => CreditNote::CONCEPTO_DESCUENTO,
            'motivo' => 'Saldo a favor futuro',
            'grand_total' => 20,
            'status' => CreditNote::STATUS_ACTIVA,
        ]);

        $record = app(AccountsReceivableService::class)->outstandingQuery()
            ->with(['customer', 'warehouse'])->findOrFail($sale->id);

        $this->assertSame(50.0, app(AccountsReceivableService::class)->serialize($record)['balance']);
        $this->assertSame(50.0, (float) $sale->dueAmount($sale->id));
    }

    private function sale(float $total, string $dueDate): Sale
    {
        $suffix = Str::lower(Str::random(8));
        $store = Store::create(['name' => "Cartera {$suffix}", 'slug' => "cartera-{$suffix}", 'is_active' => true]);
        $warehouse = Warehouse::create([
            'store_id' => $store->id,
            'name' => "Sucursal {$suffix}",
            'phone' => '0999999999',
            'country' => 'Ecuador',
            'city' => 'Manta',
            'email' => "warehouse-{$suffix}@example.test",
        ]);
        $customer = Customer::create([
            'store_id' => $store->id,
            'name' => 'Cliente de cartera',
            'email' => "customer-{$suffix}@example.test",
            'phone' => '0999999999',
            'country' => 'Ecuador',
            'city' => 'Manta',
            'address' => 'Test',
        ]);

        return Sale::create([
            'date' => now()->subDays(50)->toDateString(),
            'customer_id' => $customer->id,
            'warehouse_id' => $warehouse->id,
            'grand_total' => $total,
            'paid_amount' => 0,
            'payment_type' => SalesPayment::BANK_TRANSFER,
            'status' => Sale::COMPLETED,
            'payment_status' => Sale::UNPAID,
            'payment_due_date' => $dueDate,
            'payment_terms_days' => 10,
            'reference_code' => "AR-{$suffix}",
        ]);
    }
}
