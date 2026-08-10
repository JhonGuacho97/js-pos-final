<?php

namespace App\Exports;

use App\Models\Sale;
use App\Models\Warehouse;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromView;

class SaleReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $storeId = currentStoreId();
        $startDate = request()->get('start_date');
        // Antes leía 'start_date' para el fin del rango también -- el
        // filtro de "hasta" nunca se aplicaba realmente.
        $endDate = request()->get('end_date');
        if ($startDate != 'null' && $endDate != 'null' && $startDate && $endDate) {
            // El rango lo elige el usuario en su calendario local (Ecuador),
            // pero created_at se guarda en UTC real -- convertir antes de
            // comparar, si no el filtro queda corrido hasta 5 horas.
            $salesQuery = Sale::with(['saleItems', 'warehouse', 'customer', 'payments'])
                ->where('created_at', '>=', Carbon::parse($startDate, 'America/Guayaquil')->startOfDay()->utc())
                ->where('created_at', '<=', Carbon::parse($endDate, 'America/Guayaquil')->endOfDay()->utc());
        } else {
            $salesQuery = Sale::with(['saleItems', 'warehouse', 'customer', 'payments']);
        }
        if ($storeId) {
            $salesQuery->whereIn('warehouse_id', Warehouse::where('store_id', $storeId)->pluck('id'));
        }
        $sales = $salesQuery->get();

        return view('excel.all-sale-report-excel', ['sales' => $sales]);
    }
}
