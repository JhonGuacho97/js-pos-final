<?php

namespace Tests\Unit;

use App\Models\SalesPayment;
use App\Services\SalePaymentAllocator;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class SalePaymentAllocatorTest extends TestCase
{
    public function test_cash_change_is_not_recorded_as_income(): void
    {
        $payments = (new SalePaymentAllocator())->allocate([
            ['payment_type' => SalesPayment::CASH, 'amount' => 40],
        ], 30);

        $this->assertSame(30.0, $payments[0]['amount']);
        $this->assertSame(40.0, $payments[0]['received_amount']);
    }

    public function test_transfer_overpayment_without_enough_cash_is_rejected(): void
    {
        $this->expectException(UnprocessableEntityHttpException::class);

        (new SalePaymentAllocator())->allocate([
            ['payment_type' => SalesPayment::CASH, 'amount' => 2],
            ['payment_type' => SalesPayment::BANK_TRANSFER, 'amount' => 33],
        ], 30);
    }

    public function test_mixed_payment_uses_cash_only_for_change(): void
    {
        $payments = (new SalePaymentAllocator())->allocate([
            ['payment_type' => SalesPayment::CASH, 'amount' => 5],
            ['payment_type' => SalesPayment::BANK_TRANSFER, 'amount' => 30],
        ], 30);

        $this->assertSame(30.0, collect($payments)->sum('amount'));
        $this->assertCount(1, $payments);
        $this->assertSame(SalesPayment::BANK_TRANSFER, $payments[0]['payment_type']);
    }
}
