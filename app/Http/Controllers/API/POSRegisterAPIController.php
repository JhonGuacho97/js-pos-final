<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreatePOSRegisterRequest;
use App\Http\Resources\POSRegisterCollection;
use App\Http\Resources\POSRegisterResource;
use App\Models\POSRegister;
use App\Models\Sale;
use App\Models\SaleReturn;
use App\Models\SalesPayment;
use App\Models\User;
use App\Repositories\POSRegisterRepository;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class POSRegisterAPIController extends AppBaseController
{
    public $posReg;

    public function __construct(POSRegisterRepository $posReg)
    {
        $this->posReg = $posReg;
    }

    public function entry(CreatePOSRegisterRequest $request)
    {
        $input = $request->all();
        $input['user_id'] = Auth::id();

        POSRegister::create($input);

        return $this->sendSuccess('Register entry added successfully.');
    }

    public function closeRegister(Request $request)
    {
        $input = $request->all();
        $register = POSRegister::where('user_id', Auth::id())
            ->whereNull('closed_at')
            ->first();

        if (! $register) {
            return $this->sendError('Register entry not found.');
        }

        $data = $this->getRegisterData($register->created_at->toDateTimeString(), now()->toDateTimeString());

        $register->closed_at = now();
        $register->cash_in_hand_while_closing = $input['cash_in_hand_while_closing'];
        $register->closing_denominations = $input['closing_denominations'] ?? null;
        $register->discrepancy_reason = $input['discrepancy_reason'] ?? null;
        $register->discrepancy_note = $input['discrepancy_note'] ?? null;
        $register->expected_cash = $register->cash_in_hand
            + $data['todays_specific_sales_cash_payment']
            - $data['refunded_cash'];
        $register->bank_transfer = $data['today_sales_bank_transfer_payment'];
        $register->cheque = $data['today_sales_cheque_payment'];
        $register->other = $data['today_sales_other_payment'];
        $register->total_sale = $data['today_sales_amount'];
        $register->total_return = $data['today_sales_return_amount'];
        $register->total_amount = $data['today_sales_payment_amount'];
        $register->notes = $input['notes'];
        $register->save();

        return $this->sendSuccess('Register entry updated successfully.');
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
            - $data['refunded_cash'];

        return $this->sendResponse($data, 'Details retrieved successfully');
    }

    public function registerReport(Request $request)
    {
        $perPage = getPageSize($request);
        $search = $request->filter['search'] ?? '';
        $input = $request->all();

        $register = $this->posReg;

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
            ->whereHas('sale.payments', function (Builder $query) {
                $query->where('payment_type', SalesPayment::CASH);
            })
            ->sum('grand_total');

        return $data;
    }
}
