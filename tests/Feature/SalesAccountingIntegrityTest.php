<?php

namespace Tests\Feature;

use App\Models\CashMovement;
use App\Models\CashRegister;
use App\Models\Customer;
use App\Models\POSRegister;
use App\Models\Sale;
use App\Models\SaleReturn;
use App\Models\SalesPayment;
use App\Models\Store;
use App\Models\User;
use App\Models\Warehouse;
use App\Repositories\SalesPaymentRepository;
use App\Services\CashControlService;
use App\Http\Controllers\API\POSRegisterAPIController;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Tests\TestCase;

class SalesAccountingIntegrityTest extends TestCase
{
    use DatabaseTransactions;

    public function test_late_cash_payments_belong_to_the_turn_that_receives_them_and_edits_are_audited(): void
    {
        [$user, $register, $sale] = $this->fixtures();
        Auth::login($user);
        $cashControl = app(CashControlService::class);

        $this->assertSame(10.0, $cashControl->currentBalance($register));

        $cash = SalesPayment::create([
            'sale_id' => $sale->id,
            'payment_date' => now()->toDateString(),
            'payment_type' => SalesPayment::CASH,
            'amount' => 5,
            'received_amount' => 5,
        ]);
        $transfer = SalesPayment::create([
            'sale_id' => $sale->id,
            'payment_date' => now()->toDateString(),
            'payment_type' => SalesPayment::BANK_TRANSFER,
            'amount' => 7,
            'received_amount' => 7,
        ]);

        $this->assertSame($register->id, $cash->fresh()->pos_register_id);
        $this->assertSame($register->id, $transfer->fresh()->pos_register_id);
        $this->assertSame(15.0, $cashControl->currentBalance($register));
        $this->assertSame(1, CashMovement::where('source_type', SalesPayment::class)
            ->where('source_id', $cash->id)->where('type', CashMovement::SALE_PAYMENT)->count());
        $this->assertSame(0, CashMovement::where('source_type', SalesPayment::class)
            ->where('source_id', $transfer->id)->where('type', CashMovement::SALE_PAYMENT)->count());

        $closing = app(POSRegisterAPIController::class)->getRegisterData(
            $register->created_at->toDateTimeString(),
            now()->toDateTimeString(),
            $register
        );
        $this->assertSame(12.0, (float) $closing['today_sales_payment_amount']);
        $this->assertSame(5.0, (float) $closing['today_sales_cash_payment']);
        $this->assertSame(7.0, (float) $closing['today_sales_bank_transfer_payment']);

        $cash->update(['amount' => 4, 'received_amount' => 4]);
        $this->assertSame(14.0, $cashControl->currentBalance($register));
        $this->assertSame(1, CashMovement::where('source_type', SalesPayment::class)
            ->where('source_id', $cash->id)->where('type', CashMovement::REVERSAL)->count());

        $cash->delete();
        $this->assertSame(10.0, $cashControl->currentBalance($register));
        $this->assertSame(2, CashMovement::where('source_type', SalesPayment::class)
            ->where('source_id', $cash->id)->where('type', CashMovement::REVERSAL)->count());
    }

    public function test_a_late_cash_refund_reduces_the_turn_that_pays_it(): void
    {
        [$user, $register, $sale] = $this->fixtures();
        Auth::login($user);

        $return = SaleReturn::create([
            'date' => now()->toDateString(),
            'customer_id' => $sale->customer_id,
            'warehouse_id' => $sale->warehouse_id,
            'grand_total' => 3,
            'paid_amount' => 3,
            'payment_type' => SaleReturn::CASH,
            'status' => SaleReturn::RECEIVED,
            'reference_code' => 'RETURN-'.Str::lower(Str::random(8)),
            'sale_id' => $sale->id,
        ]);

        $this->assertSame($register->id, $return->fresh()->pos_register_id);
        $this->assertSame(7.0, app(CashControlService::class)->currentBalance($register));
        $this->assertDatabaseHas('cash_movements', [
            'pos_register_id' => $register->id,
            'source_type' => SaleReturn::class,
            'source_id' => $return->id,
            'type' => CashMovement::CASH_REFUND,
            'direction' => CashMovement::OUT,
        ]);
    }

    public function test_editing_a_payment_cannot_make_paid_amount_exceed_the_sale_total(): void
    {
        [$user, , $sale] = $this->fixtures();
        Auth::login($user);
        $payment = SalesPayment::create([
            'sale_id' => $sale->id,
            'payment_date' => now()->toDateString(),
            'payment_type' => SalesPayment::BANK_TRANSFER,
            'amount' => 7,
            'received_amount' => 7,
        ]);

        $this->expectException(UnprocessableEntityHttpException::class);
        app(SalesPaymentRepository::class)->updateSalePayment([
            'payment_date' => now()->toDateString(),
            'payment_type' => SalesPayment::BANK_TRANSFER,
            'amount' => 13,
        ], $payment);
    }

    private function fixtures(): array
    {
        $suffix = Str::lower(Str::random(8));
        $store = Store::create(['name' => 'Accounting Test', 'slug' => "accounting-{$suffix}", 'is_active' => true]);
        $user = User::create([
            'first_name' => 'Accounting',
            'last_name' => 'Tester',
            'email' => "accounting-{$suffix}@example.test",
            'phone' => '0999999999',
            'password' => Hash::make('secret123'),
        ]);
        $user->stores()->attach($store->id);
        $warehouse = Warehouse::create([
            'store_id' => $store->id,
            'name' => "Warehouse {$suffix}",
            'phone' => '0999999999',
            'country' => 'Ecuador',
            'city' => 'Manta',
            'email' => "warehouse-{$suffix}@example.test",
        ]);
        $customer = Customer::create([
            'store_id' => $store->id,
            'name' => 'Accounting Customer',
            'email' => "customer-{$suffix}@example.test",
            'phone' => '0999999999',
            'country' => 'Ecuador',
            'city' => 'Manta',
            'address' => 'Test',
        ]);
        $cashRegister = CashRegister::create([
            'store_id' => $store->id,
            'warehouse_id' => $warehouse->id,
            'name' => 'Caja test',
            'code' => "TEST-{$suffix}",
            'is_active' => true,
        ]);
        $register = POSRegister::create([
            'cash_in_hand' => 10,
            'user_id' => $user->id,
            'warehouse_id' => $warehouse->id,
            'cash_register_id' => $cashRegister->id,
        ]);
        CashMovement::create([
            'pos_register_id' => $register->id,
            'cash_register_id' => $cashRegister->id,
            'store_id' => $store->id,
            'warehouse_id' => $warehouse->id,
            'user_id' => $user->id,
            'type' => CashMovement::OPENING,
            'direction' => CashMovement::IN,
            'amount' => 10,
            'balance_after' => 10,
        ]);
        $sale = Sale::create([
            'date' => now()->subDay()->toDateString(),
            'customer_id' => $customer->id,
            'warehouse_id' => $warehouse->id,
            'grand_total' => 12,
            'paid_amount' => 0,
            'payment_type' => SalesPayment::CASH,
            'status' => Sale::COMPLETED,
            'payment_status' => Sale::UNPAID,
            'reference_code' => "TEST-{$suffix}",
            'user_id' => $user->id,
        ]);
        $sale->timestamps = false;
        $sale->forceFill(['created_at' => $register->created_at->copy()->subDay()])->saveQuietly();

        return [$user, $register->fresh(), $sale->fresh()];
    }
}
