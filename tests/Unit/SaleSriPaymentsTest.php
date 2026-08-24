<?php

namespace Tests\Unit;

use App\Models\Sale;
use App\Models\SalesPayment;
use Illuminate\Database\Eloquent\Collection;
use PHPUnit\Framework\TestCase;

class SaleSriPaymentsTest extends TestCase
{
    public function test_it_preserves_cash_and_transfer_as_separate_sri_payments(): void
    {
        $sale = new Sale(['grand_total' => 12, 'payment_type' => Sale::CASH]);
        $sale->setRelation('payments', new Collection([
            new SalesPayment(['payment_type' => SalesPayment::CASH, 'amount' => 5]),
            new SalesPayment(['payment_type' => SalesPayment::BANK_TRANSFER, 'amount' => 7]),
        ]));

        $this->assertSame([
            ['formaPago' => '01', 'total' => 5.0],
            ['formaPago' => '15', 'total' => 7.0],
        ], $sale->pagosSri());
    }

    public function test_it_caps_legacy_overpayments_at_the_invoice_total(): void
    {
        $sale = new Sale(['grand_total' => 10, 'payment_type' => Sale::BANK_TRANSFER]);
        $sale->setRelation('payments', new Collection([
            new SalesPayment(['payment_type' => SalesPayment::BANK_TRANSFER, 'amount' => 15]),
        ]));

        $this->assertSame([
            ['formaPago' => '15', 'total' => 10.0],
        ], $sale->pagosSri());
    }
}
