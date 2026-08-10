<?php

namespace App\Exports;

use App\Models\Purchase;
use App\Models\Warehouse;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromView;

class PurchaseReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $storeId = currentStoreId();
        $startDate = request()->get('start_date');
        $endDate = request()->get('end_date');

        if ($startDate != 'null' && $endDate != 'null' && $startDate && $endDate) {
            // El rango lo elige el usuario en su calendario local (Ecuador),
            // pero created_at se guarda en UTC real -- convertir antes de
            // comparar, si no el filtro queda corrido hasta 5 horas.
            $purchasesQuery = Purchase::with(['purchaseItems', 'warehouse', 'supplier'])
                ->where('created_at', '>=', Carbon::parse($startDate, 'America/Guayaquil')->startOfDay()->utc())
                ->where('created_at', '<=', Carbon::parse($endDate, 'America/Guayaquil')->endOfDay()->utc());
        } else {
            $purchasesQuery = Purchase::with(['purchaseItems', 'warehouse', 'supplier']);
        }
        if ($storeId) {
            $purchasesQuery->whereIn('warehouse_id', Warehouse::where('store_id', $storeId)->pluck('id'));
        }
        $purchases = $purchasesQuery->get();

        return view('excel.all-purchase-report-excel', ['purchases' => $purchases]);
    }
}
