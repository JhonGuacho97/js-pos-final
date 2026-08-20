<?php

namespace Tests\Unit;

use App\Models\CatalogOrder;
use Tests\TestCase;

class CatalogOrderWorkflowTest extends TestCase
{
    /** @dataProvider validTransitions */
    public function test_it_allows_only_forward_operational_transitions(string $from, string $to): void
    {
        $order = new CatalogOrder(['status' => $from]);

        $this->assertTrue($order->canTransitionTo($to));
    }

    public static function validTransitions(): array
    {
        return [
            'pending to confirmed' => ['pending', 'confirmed'],
            'pending to cancelled' => ['pending', 'cancelled'],
            'confirmed to preparing' => ['confirmed', 'preparing'],
            'confirmed to cancelled' => ['confirmed', 'cancelled'],
            'preparing to completed' => ['preparing', 'completed'],
            'preparing to cancelled' => ['preparing', 'cancelled'],
        ];
    }

    /** @dataProvider invalidTransitions */
    public function test_it_rejects_skips_reversals_and_terminal_transitions(string $from, string $to): void
    {
        $order = new CatalogOrder(['status' => $from]);

        $this->assertFalse($order->canTransitionTo($to));
    }

    public static function invalidTransitions(): array
    {
        return [
            'cannot skip confirmation' => ['pending', 'preparing'],
            'cannot complete before preparation' => ['confirmed', 'completed'],
            'cannot reverse preparation' => ['preparing', 'confirmed'],
            'completed is terminal' => ['completed', 'cancelled'],
            'cancelled is terminal' => ['cancelled', 'pending'],
        ];
    }
}
