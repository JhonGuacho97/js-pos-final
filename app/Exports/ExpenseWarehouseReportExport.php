<?php

namespace App\Exports;

use App\Models\Expense;
use App\Models\Warehouse;
use Maatwebsite\Excel\Concerns\FromView;

class ExpenseWarehouseReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $storeId = currentStoreId();
        $warehouseId = request()->get('warehouse_id');
        if (isset($warehouseId) && $warehouseId != 'null') {
            $expensesQuery = Expense::whereWarehouseId($warehouseId)->with('warehouse', 'expenseCategory');
        } else {
            $expensesQuery = Expense::with('warehouse', 'expenseCategory');
        }
        if ($storeId) {
            $expensesQuery->whereIn('warehouse_id', Warehouse::where('store_id', $storeId)->pluck('id'));
        }
        $expenses = $expensesQuery->get();

        return view('excel.expense-report-excel', ['expenses' => $expenses]);
    }
}
