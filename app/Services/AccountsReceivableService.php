<?php

namespace App\Services;

use App\Models\CreditNote;
use App\Models\ElectronicInvoice;
use App\Models\Sale;
use App\Models\Customer;
use App\Models\CollectionActivity;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class AccountsReceivableService
{
    /**
     * Agrega a una consulta los importes contables que determinan el saldo.
     * No guarda un saldo paralelo: pagos y notas de crédito siguen siendo la
     * única fuente de verdad.
     */
    public function withBalances(Builder $query): Builder
    {
        $payments = DB::table('sales_payments')
            ->selectRaw('COALESCE(SUM(amount), 0)')
            ->whereColumn('sales_payments.sale_id', 'sales.id');

        $credits = DB::table('credit_notes')
            ->selectRaw('COALESCE(SUM(grand_total), 0)')
            ->whereColumn('credit_notes.sale_id', 'sales.id')
            ->where('credit_notes.generar_como', CreditNote::GENERAR_SALDO)
            ->where(function ($query) {
                $query->whereNull('credit_notes.status')
                    ->orWhere('credit_notes.status', '!=', CreditNote::STATUS_CANCELADA);
            })
            ->where(function ($query) {
                $query->whereNotExists(function ($invoice) {
                    $invoice->selectRaw('1')
                        ->from('electronic_invoices')
                        ->whereColumn('electronic_invoices.credit_note_id', 'credit_notes.id');
                })->orWhereExists(function ($invoice) {
                    $invoice->selectRaw('1')
                        ->from('electronic_invoices')
                        ->whereColumn('electronic_invoices.credit_note_id', 'credit_notes.id')
                        ->whereNotIn('electronic_invoices.estado', [
                            ElectronicInvoice::NO_AUTORIZADA,
                            ElectronicInvoice::DEVUELTA,
                        ]);
                });
            });

        return $query->addSelect([
            'payments_total' => $payments,
            'credits_total' => $credits,
        ]);
    }

    public function outstandingQuery(): Builder
    {
        return $this->withBalances(
            Sale::query()
                ->where('is_return', false)
                ->whereIn('payment_status', [Sale::UNPAID, Sale::PARTIAL_PAID])
        );
    }

    public function serialize(Sale $sale): array
    {
        $payments = round((float) ($sale->payments_total ?? $sale->payments()->sum('amount')), 2);
        $credits = round((float) ($sale->credits_total ?? 0), 2);
        $balance = max(0, round((float) $sale->grand_total - $payments - $credits, 2));
        $dueDate = $sale->payment_due_date ? Carbon::parse($sale->payment_due_date)->startOfDay() : null;
        $today = Carbon::today('America/Guayaquil');
        $daysOverdue = $dueDate && $dueDate->lt($today) ? $dueDate->diffInDays($today) : 0;

        return [
            'id' => $sale->id,
            'reference_code' => $sale->reference_code,
            'date' => optional($sale->date)->format('Y-m-d'),
            'payment_due_date' => optional($dueDate)->format('Y-m-d'),
            'payment_terms_days' => $sale->payment_terms_days,
            'collection_note' => $sale->collection_note,
            'customer' => $sale->customer ? [
                'id' => $sale->customer->id,
                'name' => $sale->customer->name,
                'identification' => $sale->customer->identification,
                'phone' => $sale->customer->phone,
                'email' => $sale->customer->email,
            ] : null,
            'warehouse' => $sale->warehouse ? ['id' => $sale->warehouse->id, 'name' => $sale->warehouse->name] : null,
            'grand_total' => round((float) $sale->grand_total, 2),
            'paid_total' => $payments,
            'credited_total' => $credits,
            'balance' => $balance,
            'payment_status' => $sale->payment_status,
            'collection_status' => $this->collectionStatus($balance, $dueDate, $today),
            'days_overdue' => $daysOverdue,
            'aging_bucket' => $this->agingBucket($daysOverdue, $dueDate, $today),
            'latest_activity' => $sale->relationLoaded('latestCollectionActivity') && $sale->latestCollectionActivity
                ? $this->serializeActivity($sale->latestCollectionActivity)
                : null,
        ];
    }

    public function serializeActivity(CollectionActivity $activity): array
    {
        return [
            'id' => $activity->id,
            'type' => $activity->type,
            'note' => $activity->note,
            'promised_payment_date' => optional($activity->promised_payment_date)->format('Y-m-d'),
            'promised_amount' => $activity->promised_amount === null ? null : round((float) $activity->promised_amount, 2),
            'contacted_at' => optional($activity->contacted_at)->toIso8601String(),
            'user' => $activity->relationLoaded('user') && $activity->user ? [
                'id' => $activity->user->id,
                'name' => trim($activity->user->first_name.' '.$activity->user->last_name),
            ] : null,
        ];
    }

    public function summary(iterable $sales): array
    {
        $summary = [
            'total_receivable' => 0,
            'overdue' => 0,
            'due_today' => 0,
            'current' => 0,
            'customers' => [],
            'documents' => 0,
            'aging' => ['current' => 0, '1_30' => 0, '31_60' => 0, '61_90' => 0, 'over_90' => 0],
        ];

        foreach ($sales as $sale) {
            $row = $this->serialize($sale);
            if ($row['balance'] <= 0) {
                continue;
            }
            $summary['documents']++;
            $summary['customers'][$row['customer']['id'] ?? 0] = true;
            $summary['total_receivable'] += $row['balance'];
            $summary['aging'][$row['aging_bucket']] += $row['balance'];
            if ($row['collection_status'] === 'overdue') {
                $summary['overdue'] += $row['balance'];
            } elseif ($row['collection_status'] === 'due_today') {
                $summary['due_today'] += $row['balance'];
            } else {
                $summary['current'] += $row['balance'];
            }
        }

        $summary['customers'] = count($summary['customers']);
        foreach (['total_receivable', 'overdue', 'due_today', 'current'] as $key) {
            $summary[$key] = round($summary[$key], 2);
        }
        foreach ($summary['aging'] as $key => $amount) {
            $summary['aging'][$key] = round($amount, 2);
        }

        return $summary;
    }

    public function customerProfile(Customer $customer, ?int $excludeSaleId = null): array
    {
        $query = $this->outstandingQuery()
            ->where('customer_id', $customer->id)
            ->with(['customer', 'warehouse']);
        if ($excludeSaleId) {
            $query->where('sales.id', '!=', $excludeSaleId);
        }

        $summary = $this->summary($query->get());
        $limit = round((float) $customer->credit_limit, 2);
        $controlled = (bool) $customer->credit_enabled;

        return [
            'customer_id' => $customer->id,
            'credit_enabled' => $controlled,
            'credit_limit' => $limit,
            'default_payment_terms_days' => (int) $customer->default_payment_terms_days,
            'outstanding_balance' => $summary['total_receivable'],
            'overdue_balance' => $summary['overdue'],
            'available_credit' => $controlled
                ? max(0, round($limit - $summary['total_receivable'], 2))
                : null,
            'documents' => $summary['documents'],
        ];
    }

    public function assertCreditAvailable(Customer $customer, float $newBalance, ?int $excludeSaleId = null): void
    {
        if (! $customer->credit_enabled || $newBalance <= 0) {
            return;
        }

        $profile = $this->customerProfile($customer, $excludeSaleId);
        if (round($profile['outstanding_balance'] + $newBalance, 2) > round($profile['credit_limit'], 2)) {
            throw new \Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException(
                'La venta supera el cupo de crédito del cliente. Disponible: $'.
                number_format((float) $profile['available_credit'], 2, '.', '').
                ', nuevo saldo: $'.number_format($newBalance, 2, '.', '').'.'
            );
        }
    }

    private function collectionStatus(float $balance, ?Carbon $dueDate, Carbon $today): string
    {
        if ($balance <= 0) return 'paid';
        if (!$dueDate) return 'unassigned';
        if ($dueDate->lt($today)) return 'overdue';
        if ($dueDate->isSameDay($today)) return 'due_today';
        return $dueDate->diffInDays($today) <= 7 ? 'due_soon' : 'current';
    }

    private function agingBucket(int $daysOverdue, ?Carbon $dueDate, Carbon $today): string
    {
        if (!$dueDate || !$dueDate->lt($today)) return 'current';
        if ($daysOverdue <= 30) return '1_30';
        if ($daysOverdue <= 60) return '31_60';
        if ($daysOverdue <= 90) return '61_90';
        return 'over_90';
    }
}
