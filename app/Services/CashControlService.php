<?php

namespace App\Services;

use App\Models\CashMovement;
use App\Models\POSRegister;
use App\Models\Sale;
use App\Models\SaleReturn;
use App\Models\SalesPayment;
use App\Models\Expense;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CashControlService
{
    public function createMovement(POSRegister $session, array $data, int $userId, int $storeId): CashMovement
    {
        return DB::transaction(function () use ($session, $data, $userId, $storeId) {
            $lockedSession = POSRegister::query()->lockForUpdate()->findOrFail($session->id);
            if ($lockedSession->closed_at) {
                throw ValidationException::withMessages(['session' => 'La caja ya se encuentra cerrada.']);
            }
            if ((int) $lockedSession->warehouse?->store_id !== $storeId) {
                throw ValidationException::withMessages(['session' => 'La caja no pertenece a la tienda activa.']);
            }

            $direction = in_array($data['type'], [CashMovement::MANUAL_EXPENSE, CashMovement::WITHDRAWAL], true)
                ? CashMovement::OUT : CashMovement::IN;
            $amount = round((float) $data['amount'], 4);
            $balance = $this->currentBalance($lockedSession);

            if ($direction === CashMovement::OUT && $amount > $balance) {
                throw ValidationException::withMessages(['amount' => 'El egreso supera el efectivo disponible en caja.']);
            }

            return CashMovement::create([
                'pos_register_id' => $lockedSession->id,
                'cash_register_id' => $lockedSession->cash_register_id,
                'store_id' => $storeId,
                'warehouse_id' => $lockedSession->warehouse_id,
                'user_id' => $userId,
                'type' => $data['type'],
                'direction' => $direction,
                'amount' => $amount,
                'balance_after' => $direction === CashMovement::IN ? $balance + $amount : $balance - $amount,
                'reference' => $data['reference'] ?? null,
                'description' => $data['description'],
            ]);
        });
    }

    public function currentBalance(POSRegister $session): float
    {
        $end = $session->closed_at ?? now();
        $saleIds = Sale::where('user_id', $session->user_id)
            ->whereBetween('created_at', [$session->created_at, $end])
            ->pluck('id');
        $cashSales = (float) SalesPayment::whereIn('sale_id', $saleIds)
            ->whereBetween('created_at', [$session->created_at, $end])
            ->where('payment_type', SalesPayment::CASH)
            ->sum('amount');
        $cashRefunds = (float) SaleReturn::whereIn('sale_id', $saleIds)
            ->where(function (Builder $query) {
                $query->where('payment_type', SaleReturn::CASH)
                    ->orWhere(function (Builder $legacy) {
                        $legacy->where(function (Builder $payment) {
                            $payment->whereNull('payment_type')->orWhere('payment_type', 0);
                        })->whereHas('sale.payments', function (Builder $payment) {
                            $payment->where('payment_type', SalesPayment::CASH);
                        });
                    });
            })->sum('grand_total');

        return round((float) $session->cash_in_hand + $cashSales - $cashRefunds + $this->manualNet($session), 4);
    }

    public function manualNet(POSRegister $session): float
    {
        return round((float) $session->movements()
            ->whereIn('type', [
                CashMovement::MANUAL_INCOME,
                CashMovement::MANUAL_EXPENSE,
                CashMovement::WITHDRAWAL,
                CashMovement::EXPENSE_PAYMENT,
                CashMovement::REVERSAL,
                CashMovement::TRANSFER_IN,
                CashMovement::TRANSFER_OUT,
            ])
            ->selectRaw("COALESCE(SUM(CASE WHEN direction = 'IN' THEN amount ELSE -amount END), 0) AS net")
            ->value('net'), 4);
    }

    public function recordSalePayment(SalesPayment $payment): ?CashMovement
    {
        if ((int) $payment->payment_type !== SalesPayment::CASH) {
            return null;
        }
        $sale = $payment->sale;
        if (! $sale?->user_id || ! $sale?->warehouse_id) {
            return null;
        }
        $session = POSRegister::where('user_id', $sale->user_id)
            ->where('warehouse_id', $sale->warehouse_id)
            ->whereNull('closed_at')
            ->where('created_at', '<=', $payment->created_at ?? now())
            ->latest()->first();
        if (! $session) {
            return null;
        }
        $storeId = (int) Warehouse::whereKey($sale->warehouse_id)->value('store_id');

        return CashMovement::firstOrCreate([
            'source_type' => SalesPayment::class,
            'source_id' => $payment->id,
            'type' => CashMovement::SALE_PAYMENT,
        ], [
            'pos_register_id' => $session->id,
            'cash_register_id' => $session->cash_register_id,
            'store_id' => $storeId,
            'warehouse_id' => $sale->warehouse_id,
            'user_id' => $sale->user_id,
            'direction' => CashMovement::IN,
            'amount' => $payment->amount,
            'balance_after' => $this->currentBalance($session),
            'reference' => $sale->reference_code,
            'description' => 'Cobro en efectivo de venta',
        ]);
    }

    public function recordExpense(Expense $expense, int $userId, int $storeId): CashMovement
    {
        $session = POSRegister::where('user_id', $userId)
            ->where('warehouse_id', $expense->warehouse_id)
            ->whereNull('closed_at')->latest()->first();
        if (! $session) {
            throw ValidationException::withMessages(['paid_from_cash' => 'Debes abrir la caja de esta sucursal antes de pagar el gasto en efectivo.']);
        }
        $balance = $this->currentBalance($session);
        if ((float) $expense->amount > $balance) {
            throw ValidationException::withMessages(['amount' => 'El gasto supera el efectivo esperado en caja.']);
        }

        $movement = CashMovement::firstOrCreate([
            'source_type' => Expense::class,
            'source_id' => $expense->id,
            'type' => CashMovement::EXPENSE_PAYMENT,
        ], [
            'pos_register_id' => $session->id,
            'cash_register_id' => $session->cash_register_id,
            'store_id' => $storeId,
            'warehouse_id' => $expense->warehouse_id,
            'user_id' => $userId,
            'direction' => CashMovement::OUT,
            'amount' => $expense->amount,
            'balance_after' => $balance - (float) $expense->amount,
            'reference' => $expense->reference_code,
            'description' => $expense->title,
        ]);
        $expense->update(['cash_movement_id' => $movement->id]);

        return $movement;
    }

    public function recordSaleReturn(SaleReturn $saleReturn): ?CashMovement
    {
        if ((int) $saleReturn->payment_type !== SaleReturn::CASH) {
            return null;
        }

        $sale = $saleReturn->sale;
        if (! $sale?->user_id || ! $saleReturn->warehouse_id) {
            return null;
        }

        $session = POSRegister::where('user_id', $sale->user_id)
            ->where('warehouse_id', $saleReturn->warehouse_id)
            ->whereNull('closed_at')
            ->where('created_at', '<=', $saleReturn->created_at ?? now())
            ->latest()->first();
        if (! $session) {
            throw ValidationException::withMessages([
                'payment_type' => 'La devolución en efectivo requiere una caja abierta en esta sucursal.',
            ]);
        }

        $storeId = (int) Warehouse::whereKey($saleReturn->warehouse_id)->value('store_id');
        $movement = CashMovement::firstOrCreate([
            'source_type' => SaleReturn::class,
            'source_id' => $saleReturn->id,
            'type' => CashMovement::CASH_REFUND,
        ], [
            'pos_register_id' => $session->id,
            'cash_register_id' => $session->cash_register_id,
            'store_id' => $storeId,
            'warehouse_id' => $saleReturn->warehouse_id,
            'user_id' => $sale->user_id,
            'direction' => CashMovement::OUT,
            'amount' => $saleReturn->grand_total,
            'balance_after' => $this->currentBalance($session),
            'reference' => $saleReturn->reference_code,
            'description' => 'Devolución de venta pagada en efectivo',
        ]);
        $saleReturn->updateQuietly(['cash_movement_id' => $movement->id]);

        return $movement;
    }

    public function reverseMovement(CashMovement $movement, string $reason, int $approverId, int $storeId): CashMovement
    {
        return DB::transaction(function () use ($movement, $reason, $approverId, $storeId) {
            $original = CashMovement::query()->lockForUpdate()->findOrFail($movement->id);
            $session = POSRegister::query()->lockForUpdate()->findOrFail($original->pos_register_id);

            if ((int) $original->store_id !== $storeId || $session->closed_at) {
                throw ValidationException::withMessages(['movement' => 'El movimiento no pertenece a una caja activa de esta tienda.']);
            }
            if (in_array($original->type, [CashMovement::OPENING, CashMovement::REVERSAL, CashMovement::TRANSFER_IN, CashMovement::TRANSFER_OUT], true)) {
                throw ValidationException::withMessages(['movement' => 'Este movimiento no admite reversión.']);
            }
            if (CashMovement::where('reversed_movement_id', $original->id)->exists()) {
                throw ValidationException::withMessages(['movement' => 'Este movimiento ya fue revertido.']);
            }

            $direction = $original->direction === CashMovement::IN ? CashMovement::OUT : CashMovement::IN;
            $balance = $this->currentBalance($session);
            if ($direction === CashMovement::OUT && (float) $original->amount > $balance) {
                throw ValidationException::withMessages(['movement' => 'No hay efectivo suficiente para revertir este ingreso.']);
            }

            return CashMovement::create([
                'pos_register_id' => $session->id,
                'cash_register_id' => $session->cash_register_id,
                'store_id' => $storeId,
                'warehouse_id' => $session->warehouse_id,
                'user_id' => $approverId,
                'approved_by' => $approverId,
                'type' => CashMovement::REVERSAL,
                'direction' => $direction,
                'amount' => $original->amount,
                'balance_after' => $direction === CashMovement::IN ? $balance + (float) $original->amount : $balance - (float) $original->amount,
                'reference' => $original->reference,
                'description' => 'Reversión: '.($original->description ?: $original->type),
                'reversed_movement_id' => $original->id,
                'reversal_reason' => $reason,
                'metadata' => ['original_type' => $original->type],
            ]);
        });
    }

    public function transfer(POSRegister $source, int $targetSessionId, float $amount, string $description, ?string $reference, int $userId, int $storeId): array
    {
        return DB::transaction(function () use ($source, $targetSessionId, $amount, $description, $reference, $userId, $storeId) {
            if ((int) $source->id === $targetSessionId) {
                throw ValidationException::withMessages(['target_pos_register_id' => 'Selecciona una caja de destino diferente.']);
            }

            $ids = collect([$source->id, $targetSessionId])->sort()->values();
            $sessions = POSRegister::with('warehouse')->whereIn('id', $ids)->lockForUpdate()->get()->keyBy('id');
            $lockedSource = $sessions->get($source->id);
            $target = $sessions->get($targetSessionId);
            if (! $lockedSource || ! $target || $lockedSource->closed_at || $target->closed_at) {
                throw ValidationException::withMessages(['target_pos_register_id' => 'Ambas cajas deben permanecer abiertas.']);
            }
            if ((int) $lockedSource->warehouse?->store_id !== $storeId || (int) $target->warehouse?->store_id !== $storeId) {
                throw ValidationException::withMessages(['target_pos_register_id' => 'La caja de destino no pertenece a la tienda activa.']);
            }

            $amount = round($amount, 4);
            $sourceBalance = $this->currentBalance($lockedSource);
            if ($amount > $sourceBalance) {
                throw ValidationException::withMessages(['amount' => 'La transferencia supera el efectivo disponible.']);
            }
            $targetBalance = $this->currentBalance($target);
            $uuid = (string) Str::uuid();

            $out = CashMovement::create([
                'pos_register_id' => $lockedSource->id, 'cash_register_id' => $lockedSource->cash_register_id,
                'store_id' => $storeId, 'warehouse_id' => $lockedSource->warehouse_id, 'user_id' => $userId,
                'type' => CashMovement::TRANSFER_OUT, 'direction' => CashMovement::OUT, 'amount' => $amount,
                'balance_after' => $sourceBalance - $amount, 'reference' => $reference, 'description' => $description,
                'transfer_uuid' => $uuid, 'metadata' => ['target_session_id' => $target->id],
            ]);
            $in = CashMovement::create([
                'pos_register_id' => $target->id, 'cash_register_id' => $target->cash_register_id,
                'store_id' => $storeId, 'warehouse_id' => $target->warehouse_id, 'user_id' => $userId,
                'type' => CashMovement::TRANSFER_IN, 'direction' => CashMovement::IN, 'amount' => $amount,
                'balance_after' => $targetBalance + $amount, 'reference' => $reference, 'description' => $description,
                'transfer_uuid' => $uuid, 'metadata' => ['source_session_id' => $lockedSource->id],
            ]);

            return [$out, $in];
        });
    }
}
