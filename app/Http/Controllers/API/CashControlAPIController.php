<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Models\CashMovement;
use App\Models\CashRegister;
use App\Models\POSRegister;
use App\Models\Warehouse;
use App\Services\CashControlService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CashControlAPIController extends AppBaseController
{
    public function __construct(private readonly CashControlService $cashControl) {}

    public function overview()
    {
        $storeId = (int) $this->currentStoreId();
        $user = Auth::user();
        $legacyManagement = $user->can('manage_cash_control');
        $canIncome = $legacyManagement || $user->can('create_cash_income');
        $canExpense = $legacyManagement || $user->can('create_cash_expense');
        $canWithdraw = $legacyManagement || $user->can('withdraw_cash');
        $canTransfer = $user->can('transfer_cash');
        $canReverse = $user->can('reverse_cash_movement');
        $canViewOwn = $legacyManagement || $user->can('view_own_cash_session')
            || $canIncome || $canExpense || $canWithdraw || $canTransfer || $canReverse;
        $canSupervise = $legacyManagement || $user->can('view_cash_supervision');
        $canManageRegisters = $legacyManagement || $user->can('manage_cash_registers');
        $canReview = $user->can('review_cash_closure');
        $canViewClosures = $legacyManagement || $user->can('view_cash_closures') || $canReview;

        $session = $canViewOwn
            ? POSRegister::with(['cashRegister', 'warehouse'])
                ->where('user_id', Auth::id())->whereNull('closed_at')
                ->whereHas('warehouse', fn ($query) => $query->where('store_id', $storeId)->active())
                ->latest()->first()
            : null;

        $registers = $canManageRegisters
            ? CashRegister::with(['warehouse:id,name', 'activeSession.user:id,first_name,last_name'])
                ->withCount('sessions')->where('store_id', $storeId)->orderBy('name')->get()
            : collect();
        $activeSessions = $canTransfer
            ? POSRegister::with(['cashRegister:id,name', 'warehouse:id,name,store_id', 'user:id,first_name,last_name'])
                ->whereNull('closed_at')
                ->whereHas('warehouse', fn ($query) => $query->where('store_id', $storeId)->active())
                ->when($session, fn ($query) => $query->whereKeyNot($session->id))
                ->latest()->get()->map(fn (POSRegister $item) => [
                    'id' => $item->id,
                    'cash_register' => $item->cashRegister,
                    'warehouse' => $item->warehouse,
                    'user' => $item->user,
                ])
            : collect();
        $supervisionSessions = $canSupervise
            ? POSRegister::with(['cashRegister:id,name', 'warehouse:id,name,store_id', 'user:id,first_name,last_name'])
                ->whereNull('closed_at')->whereHas('warehouse', fn ($query) => $query->where('store_id', $storeId)->active())
                ->oldest()->get()->map(fn (POSRegister $item) => [
                    'id' => $item->id,
                    'opened_at' => $item->created_at,
                    'opening_cash' => (float) $item->cash_in_hand,
                    'expected_cash' => $this->cashControl->currentBalance($item),
                    'cash_register' => $item->cashRegister,
                    'warehouse' => $item->warehouse,
                    'user' => $item->user,
                ])
            : collect();

        return $this->sendResponse([
            // Estas capacidades se calculan en el mismo request y con la
            // misma tienda activa que usan los middleware de las acciones.
            // Así el frontend no muestra botones a partir de la unión global
            // de permisos de otras tiendas del usuario.
            'capabilities' => [
                'view_own_cash_session' => $canViewOwn,
                'create_cash_income' => $canIncome,
                'create_cash_expense' => $canExpense,
                'withdraw_cash' => $canWithdraw,
                'view_cash_supervision' => $canSupervise,
                'view_cash_closures' => $canViewClosures,
                'manage_cash_registers' => $canManageRegisters,
                'transfer_cash' => $canTransfer,
                'reverse_cash_movement' => $canReverse,
                'review_cash_closure' => $canReview,
            ],
            'session' => $session ? [
                'id' => $session->id,
                'opened_at' => $session->created_at,
                'opening_cash' => (float) $session->cash_in_hand,
                'expected_cash' => $this->cashControl->currentBalance($session),
                'cash_register' => $session->cashRegister,
                'warehouse' => $session->warehouse,
            ] : null,
            'registers' => $registers,
            'active_sessions' => $activeSessions,
            'supervision_sessions' => $supervisionSessions,
            'warehouses' => $canManageRegisters
                ? Warehouse::where('store_id', $storeId)->active()->orderBy('name')->get(['id', 'name'])
                : [],
        ], 'Cash control retrieved successfully.');
    }

    public function movements(Request $request)
    {
        $session = $this->currentSession();
        $query = $session->movements();
        $summary = [
            'manual_income' => (float) (clone $query)->where('type', 'MANUAL_INCOME')->sum('amount'),
            'total_out' => (float) (clone $query)->where('direction', 'OUT')->sum('amount'),
        ];
        $perPage = max(1, min((int) $request->input('per_page', 10), 100));
        $movements = $query->with(['user:id,first_name,last_name', 'approvedBy:id,first_name,last_name'])
            ->withExists('reversal')
            ->latest()->paginate($perPage);

        $payload = $movements->toArray();
        $payload['summary'] = $summary;

        return response()->json($payload);
    }

    public function reverse(Request $request, CashMovement $cashMovement)
    {
        $data = $request->validate(['reason' => ['required', 'string', 'min:5', 'max:1000']]);
        $movement = $this->cashControl->reverseMovement(
            $cashMovement, $data['reason'], Auth::id(), (int) $this->currentStoreId()
        );

        return $this->sendResponse($movement, 'Movimiento revertido correctamente.');
    }

    public function transfer(Request $request)
    {
        $data = $request->validate([
            'target_pos_register_id' => ['required', 'integer', 'exists:pos_register,id'],
            'amount' => ['required', 'numeric', 'min:0.01', 'max:999999999.9999'],
            'description' => ['required', 'string', 'max:1000'],
            'reference' => ['nullable', 'string', 'max:100'],
        ]);
        [$out, $in] = $this->cashControl->transfer(
            $this->currentSession(), (int) $data['target_pos_register_id'], (float) $data['amount'],
            $data['description'], $data['reference'] ?? null, Auth::id(), (int) $this->currentStoreId()
        );

        return $this->sendResponse(['out' => $out, 'in' => $in], 'Transferencia registrada correctamente.');
    }

    public function storeRegister(Request $request)
    {
        $storeId = (int) $this->currentStoreId();
        $data = $request->validate([
            'warehouse_id' => ['required', 'integer', Rule::exists('warehouses', 'id')->where('store_id', $storeId)],
            'name' => ['required', 'string', 'max:100'],
            'code' => ['required', 'string', 'max:40', Rule::unique('cash_registers', 'code')->where('store_id', $storeId)],
        ]);
        $register = CashRegister::create([
            ...$data, 'store_id' => $storeId, 'code' => strtoupper(trim($data['code'])), 'is_active' => true,
        ]);

        return $this->sendResponse($register->load('warehouse:id,name'), 'Caja creada correctamente.');
    }

    public function updateRegister(Request $request, CashRegister $cashRegister)
    {
        $storeId = (int) $this->currentStoreId();
        if ((int) $cashRegister->store_id !== $storeId) {
            abort(404);
        }
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'code' => ['sometimes', 'required', 'string', 'max:40', Rule::unique('cash_registers', 'code')->where('store_id', $storeId)->ignore($cashRegister->id)],
            'is_active' => ['sometimes', 'boolean'],
        ]);
        if (array_key_exists('is_active', $data) && ! $data['is_active'] && $cashRegister->activeSession()->exists()) {
            throw ValidationException::withMessages(['is_active' => 'No puedes desactivar una caja que tiene una sesión abierta.']);
        }
        if (isset($data['code'])) {
            $data['code'] = strtoupper(trim($data['code']));
        }
        $cashRegister->update($data);

        return $this->sendResponse($cashRegister->fresh(['warehouse:id,name', 'activeSession.user:id,first_name,last_name']), 'Caja actualizada correctamente.');
    }

    public function sessions(Request $request)
    {
        $storeId = (int) $this->currentStoreId();
        $status = $request->input('status', 'all');
        $perPage = min(max((int) $request->input('per_page', 10), 1), 100);
        $sessions = POSRegister::with([
            'cashRegister:id,name,code', 'warehouse:id,name,store_id', 'user:id,first_name,last_name',
            'reviewedBy:id,first_name,last_name',
            ])->whereHas('warehouse', fn ($query) => $query->where('store_id', $storeId)->active())
            ->when($status === 'open', fn ($query) => $query->whereNull('closed_at'))
            ->when($status === 'closed', fn ($query) => $query->whereNotNull('closed_at'))
            ->latest()->paginate($perPage);

        return response()->json($sessions);
    }

    public function reviewClosure(Request $request, POSRegister $session)
    {
        $data = $request->validate([
            'decision' => ['required', Rule::in(['APPROVED', 'REJECTED'])],
            'note' => ['nullable', 'string', 'max:1000', Rule::requiredIf($request->input('decision') === 'REJECTED')],
        ]);
        $storeId = (int) $this->currentStoreId();

        $updated = DB::transaction(function () use ($session, $data, $storeId) {
            $locked = POSRegister::with('warehouse')->lockForUpdate()->findOrFail($session->id);
            if ((int) $locked->warehouse?->store_id !== $storeId || ! $locked->closed_at) {
                throw ValidationException::withMessages(['session' => 'El cierre no pertenece a esta tienda o todavía está abierto.']);
            }
            if ($locked->reconciliation_status === 'BALANCED') {
                throw ValidationException::withMessages(['session' => 'Una caja cuadrada no requiere revisión.']);
            }
            $locked->update([
                'reconciliation_status' => $data['decision'],
                'reviewed_by' => Auth::id(),
                'reviewed_at' => now(),
                'review_note' => $data['note'] ?? null,
            ]);

            return $locked;
        });

        return $this->sendResponse($updated->load('reviewedBy:id,first_name,last_name'), 'Cierre revisado correctamente.');
    }

    public function storeMovement(Request $request)
    {
        $data = $request->validate([
            'type' => ['required', Rule::in([CashMovement::MANUAL_INCOME, CashMovement::MANUAL_EXPENSE, CashMovement::WITHDRAWAL])],
            'amount' => ['required', 'numeric', 'min:0.01', 'max:999999999.9999'],
            'description' => ['required', 'string', 'max:1000'],
            'reference' => ['nullable', 'string', 'max:100'],
        ]);

        $permissionByType = [
            CashMovement::MANUAL_INCOME => 'create_cash_income',
            CashMovement::MANUAL_EXPENSE => 'create_cash_expense',
            CashMovement::WITHDRAWAL => 'withdraw_cash',
        ];
        $user = Auth::user();
        if (! $user->can('manage_cash_control') && ! $user->can($permissionByType[$data['type']])) {
            abort(403, 'No tienes permiso para registrar este tipo de movimiento de caja.');
        }

        $movement = $this->cashControl->createMovement(
            $this->currentSession(), $data, Auth::id(), (int) $this->currentStoreId()
        );

        return $this->sendResponse($movement->load('user:id,first_name,last_name'), 'Movimiento registrado correctamente.');
    }

    private function currentSession(): POSRegister
    {
        $storeId = (int) $this->currentStoreId();

        return POSRegister::where('user_id', Auth::id())->whereNull('closed_at')
            ->whereHas('warehouse', fn ($query) => $query->where('store_id', $storeId)->active())
            ->latest()->firstOrFail();
    }
}
