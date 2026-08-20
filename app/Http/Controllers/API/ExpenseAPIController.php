<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreateExpenseRequest;
use App\Http\Requests\UpdateExpenseRequest;
use App\Http\Resources\ExpenseCollection;
use App\Http\Resources\ExpenseResource;
use App\Models\Expense;
use App\Models\Warehouse;
use App\Repositories\ExpenseRepository;
use App\Services\CashControlService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Prettus\Validator\Exceptions\ValidatorException;

/**
 * Class ExpenseAPIController
 */
class ExpenseAPIController extends AppBaseController
{
    /** @var ExpenseRepository */
    private $expenseRepository;

    public function __construct(ExpenseRepository $expenseRepository, private readonly CashControlService $cashControl)
    {
        $this->expenseRepository = $expenseRepository;
    }

    public function index(Request $request): ExpenseCollection
    {
        $perPage = getPageSize($request);
        $expenses = $this->expenseRepository;
        if ($request->get('warehouse_id')) {
            $expenses->where('warehouse_id', $request->get('warehouse_id'));
        }
        $search = $request->filter['search'] ?? '';
        $warehouse = (Warehouse::where('name', 'LIKE', "%$search%")->get()->count() != 0);
        if ($warehouse) {
            $expenses->whereHas('warehouse', function (Builder $q) use ($search, $warehouse) {
                if ($warehouse) {
                    $q->where('name', 'LIKE', "%$search%");
                }
            });
        }
        // Sin esto, el listado mezclaba gastos de TODAS las tiendas --
        // expenses no tiene store_id propio, se scopea vía warehouse_id
        // igual que Sale/Purchase (ver AppBaseController).
        if ($restricted = $this->restrictedWarehouseId()) {
            $expenses->where('warehouse_id', $restricted);
        }
        $this->scopeQueryToCurrentStore($expenses);

        $expenses = $expenses->paginate($perPage);
        ExpenseResource::usingWithCollection();

        return new ExpenseCollection($expenses);
    }

    public function store(CreateExpenseRequest $request): ExpenseResource
    {
        $this->authorizeWarehouseAccess($request->input('warehouse_id'));
        $input = $request->all();
        $expense = DB::transaction(function () use ($input) {
            $expense = $this->expenseRepository->storeExpense($input);
            if (! empty($input['paid_from_cash'])) {
                $this->cashControl->recordExpense($expense, Auth::id(), (int) $this->currentStoreId());
            }
            return $expense;
        });

        return new ExpenseResource($expense);
    }

    public function show($id): ExpenseResource
    {
        $expense = $this->expenseRepository->find($id);
        $this->authorizeWarehouseAccess($expense->warehouse_id);

        return new ExpenseResource($expense);
    }

    /**
     * @throws ValidatorException
     */
    public function update(UpdateExpenseRequest $request, $id): ExpenseResource
    {
        $existingExpense = Expense::findOrFail($id);
        $this->authorizeWarehouseAccess($existingExpense->warehouse_id);
        if ($existingExpense->cash_movement_id) {
            throw ValidationException::withMessages(['expense' => 'Un gasto pagado desde caja no puede editarse; debe registrarse una reversión.']);
        }
        $input = $request->all();
        $expense = $this->expenseRepository->update($input, $id);

        return new ExpenseResource($expense);
    }

    public function destroy($id): JsonResponse
    {
        $expense = Expense::findOrFail($id);
        $this->authorizeWarehouseAccess($expense->warehouse_id);
        if ($expense->cash_movement_id) {
            throw ValidationException::withMessages(['expense' => 'Un gasto pagado desde caja no puede eliminarse; debe registrarse una reversión.']);
        }
        $this->expenseRepository->delete($id);

        return $this->sendSuccess('Expense deleted successfully');
    }
}
