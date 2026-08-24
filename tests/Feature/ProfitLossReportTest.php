<?php

namespace Tests\Feature;

use App\Services\ProfitLossReportService;
use Tests\TestCase;

class ProfitLossReportTest extends TestCase
{
    public function test_report_preserves_profit_identities_and_detail_totals(): void
    {
        $report = app(ProfitLossReportService::class)->generate(
            '2000-01-01',
            now()->addDay()->toDateString(),
            null,
            null
        );

        $this->assertEqualsWithDelta(
            $report['net_sales'] - $report['cost_of_goods_sold'],
            $report['gross_profit'],
            0.01
        );
        $this->assertEqualsWithDelta(
            $report['gross_profit'] - $report['expenses'],
            $report['net_profit'],
            0.01
        );
        $this->assertEqualsWithDelta(
            $report['net_sales'],
            collect($report['product_profitability'])->sum('revenue'),
            0.05
        );
        $this->assertEqualsWithDelta(
            $report['cost_of_goods_sold'],
            collect($report['product_profitability'])->sum('cost'),
            0.05
        );
    }
}
