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
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Prettus\Validator\Exceptions\ValidatorException;

/**
 * Class ExpenseAPIController
 */
class ExpenseAPIController extends AppBaseController
{
    /** @var ExpenseRepository */
    private $expenseRepository;

    public function __construct(ExpenseRepository $expenseRepository)
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
        $expense = $this->expenseRepository->storeExpense($input);

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
        $this->authorizeWarehouseAccess(Expense::findOrFail($id)->warehouse_id);
        $input = $request->all();
        $expense = $this->expenseRepository->update($input, $id);

        return new ExpenseResource($expense);
    }

    public function destroy($id): JsonResponse
    {
        $this->authorizeWarehouseAccess(Expense::findOrFail($id)->warehouse_id);
        $this->expenseRepository->delete($id);

        return $this->sendSuccess('Expense deleted successfully');
    }
}
