<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreateExpenseCategoryRequest;
use App\Http\Requests\UpdateExpenseCategoryRequest;
use App\Http\Resources\ExpenseCategoryCollection;
use App\Http\Resources\ExpenseCategoryResource;
use App\Models\Expense;
use App\Repositories\ExpenseCategoryRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Prettus\Validator\Exceptions\ValidatorException;

/**
 * Class ExpenseCategoryAPIController
 */
class ExpenseCategoryAPIController extends AppBaseController
{
    /** @var ExpenseCategoryRepository */
    private $expenseCategoryRepository;

    public function __construct(ExpenseCategoryRepository $expenseCategoryRepository)
    {
        $this->expenseCategoryRepository = $expenseCategoryRepository;
    }

    public function index(Request $request): ExpenseCategoryCollection
    {
        $perPage = getPageSize($request);
        $expenseCategoriesQuery = $this->expenseCategoryRepository;
        if ($storeId = $this->currentStoreId()) {
            $expenseCategoriesQuery->where('store_id', $storeId);
        }
        $expenseCategories = $expenseCategoriesQuery->paginate($perPage);
        ExpenseCategoryResource::usingWithCollection();

        return new ExpenseCategoryCollection($expenseCategories);
    }

    /**
     * @throws ValidatorException
     */
    public function store(CreateExpenseCategoryRequest $request): ExpenseCategoryResource
    {
        $input = $request->all();
        $input['store_id'] = $input['store_id'] ?? $this->requireCurrentStoreId();
        $expenseCategory = $this->expenseCategoryRepository->create($input);

        return new ExpenseCategoryResource($expenseCategory);
    }

    public function show($id): ExpenseCategoryResource
    {
        $expenseCategory = $this->expenseCategoryRepository->find($id);
        $this->authorizeStoreOwnership($expenseCategory);

        return new ExpenseCategoryResource($expenseCategory);
    }

    /**
     * @throws ValidatorException
     */
    public function update(UpdateExpenseCategoryRequest $request, $id): ExpenseCategoryResource
    {
        $this->authorizeStoreOwnership($this->expenseCategoryRepository->find($id));
        $input = $request->all();
        $expenseCategory = $this->expenseCategoryRepository->update($input, $id);

        return new ExpenseCategoryResource($expenseCategory);
    }

    public function destroy($id): JsonResponse
    {
        $this->authorizeStoreOwnership($this->expenseCategoryRepository->find($id));
        $expenseModels = [
            Expense::class,
        ];
        $result = canDelete($expenseModels, 'expense_category_id', $id);
        if ($result) {
            return $this->sendError('Expense category can\'t be deleted.');
        }
        $this->expenseCategoryRepository->delete($id);

        return $this->sendSuccess('Expense category deleted successfully');
    }
}
