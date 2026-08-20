<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreatePOSRegisterRequest;
use App\Http\Resources\POSRegisterCollection;
use App\Http\Resources\POSRegisterResource;
use App\Models\POSRegister;
use App\Models\CashMovement;
use App\Models\CashRegister;
use App\Models\Warehouse;
use App\Models\Sale;
use App\Models\SaleReturn;
use App\Models\SalesPayment;
use App\Models\User;
use App\Repositories\POSRegisterRepository;
use App\Services\CashControlService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class POSRegisterAPIController extends AppBaseController
{
    public $posReg;

    public function __construct(POSRegisterRepository $posReg, private readonly CashControlService $cashControl)
    {
        $this->posReg = $posReg;
    }

    public function entry(CreatePOSRegisterRequest $request)
    {
        $input = $request->all();
        $request->validate(['cash_register_id' => ['nullable', 'integer', 'exists:cash_registers,id']]);
        $input['user_id'] = Auth::id();

        // El modal de apertura de caja (PosRegisterModel.js, montado desde
        // Header.js) nunca mandó warehouse_id -- a diferencia del payload
        // de venta, que sí lo saca del selector de almacén de la pantalla
        // POS. Sin esto, pos_register.warehouse_id quedaba NULL en TODA
        // caja nueva, y como registerReport() ahora se scopea por tienda
        // vía warehouse_id, esas cajas NULL desaparecían de cualquier
        // informe -- las viejas ya no se mezclaban entre tiendas, pero las
        // nuevas dejaban de aparecer del todo. Mismo fallback que ya usa
        // el frontend para el selector cuando no hay uno explícito:
        // almacén propio del usuario, si no el de la tienda activa.
        if (empty($input['warehouse_id'])) {
            $input['warehouse_id'] = Auth::user()->default_warehouse_id
                ?? getSettingValue('default_warehouse');
        }

        DB::transaction(function () use (&$input) {
            User::whereKey(Auth::id())->lockForUpdate()->firstOrFail();
            if (POSRegister::where('user_id', Auth::id())->whereNull('closed_at')->exists()) {
                throw ValidationException::withMessages(['register' => 'Ya tienes una caja abierta.']);
            }

            $warehouse = Warehouse::findOrFail($input['warehouse_id']);
            $this->authorizeWarehouseAccess($warehouse->id);
            $storeId = (int) $warehouse->store_id;
            $cashRegister = ! empty($input['cash_register_id'])
                ? CashRegister::whereKey($input['cash_register_id'])->lockForUpdate()->firstOrFail()
                : CashRegister::firstOrCreate(
                    ['store_id' => $storeId, 'warehouse_id' => $warehouse->id, 'code' => 'MAIN-'.$warehouse->id],
                    ['name' => 'Caja principal', 'is_active' => true]
                );
            if ((int) $cashRegister->store_id !== $storeId || (int) $cashRegister->warehouse_id !== (int) $warehouse->id || ! $cashRegister->is_active) {
                throw ValidationException::withMessages(['cash_register_id' => 'La caja seleccionada no está disponible para esta sucursal.']);
            }
            $cashRegister = CashRegister::whereKey($cashRegister->id)->lockForUpdate()->firstOrFail();
            if (POSRegister::where('cash_register_id', $cashRegister->id)->whereNull('closed_at')->exists()) {
                throw ValidationException::withMessages(['cash_register_id' => 'Esta caja ya está siendo utilizada por otro cajero.']);
            }
            $input['cash_register_id'] = $cashRegister->id;

            $register = POSRegister::create($input);
            CashMovement::create([
                'pos_register_id' => $register->id,
                'cash_register_id' => $cashRegister->id,
                'store_id' => $storeId,
                'warehouse_id' => $warehouse->id,
                'user_id' => Auth::id(),
                'type' => CashMovement::OPENING,
                'direction' => CashMovement::IN,
                'amount' => $register->cash_in_hand,
                'balance_after' => $register->cash_in_hand,
                'description' => 'Apertura de caja',
            ]);
        });

        return $this->sendSuccess('Register entry added successfully.');
    }

    public function closeRegister(Request $request)
    {
        $input = $request->validate([
            'cash_in_hand_while_closing' => ['required', 'numeric', 'min:0'],
            'closing_denominations' => ['nullable', 'array'],
            'closing_denominations.*.value' => ['required', 'numeric', 'min:0.01'],
            'closing_denominations.*.quantity' => ['required', 'integer', 'min:0'],
            'closing_denominations.*.subtotal' => ['nullable', 'numeric', 'min:0'],
            'discrepancy_reason' => ['nullable', 'string', 'max:100'],
            'discrepancy_note' => ['nullable', 'string', 'max:1000'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        DB::transaction(function () use ($input) {
            $register = POSRegister::where('user_id', Auth::id())
                ->whereNull('closed_at')->lockForUpdate()->first();
            if (! $register) {
                throw ValidationException::withMessages(['register' => 'No existe una sesión de caja abierta.']);
            }

            $countedCash = round((float) $input['cash_in_hand_while_closing'], 4);
            $denominationTotal = round(collect($input['closing_denominations'] ?? [])->sum(
                fn ($row) => (float) $row['value'] * (int) $row['quantity']
            ), 4);
            if (! empty($input['closing_denominations']) && abs($denominationTotal - $countedCash) > 0.009) {
                throw ValidationException::withMessages([
                    'closing_denominations' => 'El total de denominaciones no coincide con el efectivo contado.',
                ]);
            }

            $data = $this->getRegisterData($register->created_at->toDateTimeString(), now()->toDateTimeString());
            $expectedCash = $this->cashControl->currentBalance($register);
            $difference = round($countedCash - $expectedCash, 4);
            if (abs($difference) > 0.009 && empty($input['discrepancy_reason'])) {
                throw ValidationException::withMessages(['discrepancy_reason' => 'Debes indicar el motivo del faltante o sobrante.']);
            }
            if (($input['discrepancy_reason'] ?? null) === 'Otro' && empty($input['discrepancy_note'])) {
                throw ValidationException::withMessages(['discrepancy_note' => 'Describe el motivo de la diferencia.']);
            }

            $register->closed_at = now();
            $register->closed_by = Auth::id();
            $register->cash_in_hand_while_closing = $countedCash;
            $register->closing_denominations = $input['closing_denominations'] ?? null;
            $register->discrepancy_reason = abs($difference) > 0.009 ? $input['discrepancy_reason'] : null;
            $register->discrepancy_note = abs($difference) > 0.009 ? ($input['discrepancy_note'] ?? null) : null;
            $register->expected_cash = $expectedCash;
            $register->cash_difference = $difference;
            $register->reconciliation_status = abs($difference) <= 0.009 ? 'BALANCED' : 'PENDING';
            $register->bank_transfer = $data['today_sales_bank_transfer_payment'];
            $register->cheque = $data['today_sales_cheque_payment'];
            $register->other = $data['today_sales_other_payment'];
            $register->total_sale = $data['today_sales_amount'];
            $register->total_return = $data['today_sales_return_amount'];
            $register->total_amount = $data['today_sales_payment_amount'];
            $register->notes = $input['notes'] ?? null;
            $register->save();
        });

        return $this->sendSuccess('Register entry updated successfully.');
    }

    public function availableCashRegisters(Request $request)
    {
        $warehouseId = (int) ($request->input('warehouse_id') ?: Auth::user()->default_warehouse_id ?: getSettingValue('default_warehouse'));
        $this->authorizeWarehouseAccess($warehouseId);
        $storeId = (int) $this->currentStoreId();

        $registers = CashRegister::with(['activeSession.user:id,first_name,last_name'])
            ->where('store_id', $storeId)->where('warehouse_id', $warehouseId)
            ->where('is_active', true)->orderBy('name')->get()->map(fn (CashRegister $register) => [
                'id' => $register->id,
                'name' => $register->name,
                'code' => $register->code,
                'available' => ! $register->activeSession,
                'current_user' => $register->activeSession?->user,
            ]);

        return $this->sendResponse($registers, 'Cajas disponibles obtenidas correctamente.');
    }

    public function getRegisterDetails(Request $request)
    {
        $register = POSRegister::where('user_id', Auth::id())
            ->whereNull('closed_at')
            ->first();

        // Límite del día calendario de Ecuador, convertido a UTC para
        // compararlo contra created_at (que se guarda en UTC real).
        $startDate = now('America/Guayaquil')->startOfDay()->utc()->toDateTimeString();
        $endDate = now('America/Guayaquil')->endOfDay()->utc()->toDateTimeString();
        if (! empty($register)) {
            $startDate = $register->created_at->toDateTimeString();
        }

        $data = $this->getRegisterData($startDate, $endDate);
        $data['cash_in_hand'] = $register->cash_in_hand;
        $data['opening_denominations'] = $register->opening_denominations ?? [];
        $data['total_cash_amount'] = $data['cash_in_hand'] + $data['todays_specific_sales_cash_payment']
            - $data['refunded_cash'] + $this->cashControl->manualNet($register);
        $data['manual_cash_net'] = $this->cashControl->manualNet($register);

        return $this->sendResponse($data, 'Details retrieved successfully');
    }

    public function registerReport(Request $request)
    {
        $perPage = getPageSize($request);
        $search = $request->filter['search'] ?? '';
        $input = $request->all();

        $register = $this->posReg;

        // Sin esto, un admin viendo "Cuadre de caja" SIN elegir un
        // cajero puntual (el caso por defecto) se topaba con TODOS los
        // arqueos cerrados de TODAS las tiendas mezclados -- pos_register
        // tiene warehouse_id igual que Sale/Purchase, así que se scopea
        // con el mismo helper. Va antes del if/else de abajo porque
        // aplica siempre, tanto si se filtró por user_id como si no.
        $this->scopeQueryToCurrentStore($register);

        // Un usuario no-admin solo puede ver el historial de arqueo de su
        // propia caja -- antes cualquiera podía pedir el de otro usuario
        // pasando user_id, exponiendo montos y descuadres ajenos.
        if (Auth::user()->isUnrestrictedAdmin()) {
            if (! empty($input['user_id'])) {
                // Aislamiento entre tiendas aplica siempre, incluso para
                // admin: no puede pedir el arqueo de un cajero de OTRA
                // tienda pasando su user_id -- antes de este chequeo eso
                // exponía montos/descuadres de una tienda ajena.
                if ($storeId = $this->currentStoreId()) {
                    $targetBelongsToStore = User::whereKey($input['user_id'])
                        ->whereHas('stores', function ($q) use ($storeId) {
                            $q->where('stores.id', $storeId);
                        })->exists();
                    if (! $targetBelongsToStore) {
                        throw new AccessDeniedHttpException('Ese usuario no pertenece a la tienda activa.');
                    }
                }
                $register->where('user_id', $input['user_id']);
            }
        } else {
            $register->where('user_id', Auth::id());
        }

        // El usuario elige el rango en su calendario local (Ecuador), pero
        // created_at/closed_at se guardan en UTC real -- whereDate() sobre
        // esas columnas compararía contra SU fecha en UTC, corrida hasta 5
        // horas respecto al día local. Se convierte el rango a UTC antes.
        if (! empty($input['start_date'])) {
            $register->where('created_at', '>=', Carbon::parse($input['start_date'], 'America/Guayaquil')->startOfDay()->utc());
        }

        if (! empty($input['end_date'])) {
            $register->where('closed_at', '<=', Carbon::parse($input['end_date'], 'America/Guayaquil')->endOfDay()->utc());
        }

        $register->orderByDesc('created_at')->whereNotNull('closed_at');

        $register = $register->paginate($perPage);

        POSRegisterResource::usingWithCollection();

        return new POSRegisterCollection($register);
    }

    public function getRegisterData($startDate, $endDate)
    {
        $totalGrandTotalAmount = Sale::where('user_id', Auth::id())
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('grand_total');

        $saleIds = Sale::where('user_id', Auth::id())
            ->whereBetween('created_at', [$startDate, $endDate])
            ->pluck('id')
            ->toArray();

        $data['today_sales_cash_payment'] = SalesPayment::whereIn('sale_id', $saleIds)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->where('payment_type', SalesPayment::CASH)
            ->sum('amount');

        $data['todays_specific_sales_cash_payment'] = SalesPayment::whereIn('sale_id', $saleIds)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->where('payment_type', SalesPayment::CASH)
            ->sum('amount');

        $data['today_sales_cheque_payment'] = SalesPayment::whereIn('sale_id', $saleIds)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->where('payment_type', SalesPayment::CHEQUE)
            ->sum('amount');

        $data['today_sales_bank_transfer_payment'] = SalesPayment::whereIn('sale_id', $saleIds)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->where('payment_type', SalesPayment::BANK_TRANSFER)
            ->sum('amount');

        $data['today_sales_other_payment'] = SalesPayment::whereIn('sale_id', $saleIds)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->where('payment_type', SalesPayment::OTHER)
            ->sum('amount');

        $data['today_sales_amount'] = $totalGrandTotalAmount;

        $data['today_sales_return_amount'] = SaleReturn::whereIn('sale_id', $saleIds)
            ->sum('grand_total');

        $data['today_sales_payment_amount'] = SalesPayment::whereIn('sale_id', $saleIds)
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->sum('amount');

        $data['today_sales_payment_amount'] = $data['today_sales_amount'] - $data['today_sales_return_amount'];
        // Antes filtraba por sale.payment_type == CASH -- ese campo solo
        // guarda el PRIMER método de pago recibido (ver SaleRepository),
        // así que una venta pagada mitad tarjeta / mitad efectivo (tarjeta
        // registrada primero) quedaba fuera de este cálculo aunque sí
        // hubiera efectivo real de por medio que devolver. Se cambia a
        // comprobar si la venta tuvo ALGÚN pago en efectivo real
        // (SalesPayment), no solo el primero.
        // Nota: esto sigue asumiendo la devolución completa como "en
        // efectivo" cuando hubo cualquier pago en efectivo -- repartir el
        // monto exacto proporcionalmente entre los métodos de pago
        // originales es una decisión de negocio que no está definida hoy
        // (¿se devuelve en el mismo método que se cobró? ¿a criterio del
        // cajero?) y queda fuera de este fix.
        $data['refunded_cash'] = SaleReturn::whereIn('sale_id', $saleIds)
            ->where(function (Builder $query) {
                $query->where('payment_type', SaleReturn::CASH)
                    ->orWhere(function (Builder $legacy) {
                        $legacy->where(function (Builder $payment) {
                            $payment->whereNull('payment_type')->orWhere('payment_type', 0);
                        })->whereHas('sale.payments', function (Builder $payment) {
                            $payment->where('payment_type', SalesPayment::CASH);
                        });
                    });
            })
            ->sum('grand_total');

        return $data;
    }
}
