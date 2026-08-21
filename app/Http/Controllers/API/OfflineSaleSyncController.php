<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\OfflineCreateSaleRequest;
use App\Http\Resources\SaleResource;
use App\Models\ElectronicInvoice;
use App\Repositories\SaleRepository;
use App\Services\ElectronicInvoiceRequestService;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class OfflineSaleSyncController extends AppBaseController
{
    public function __construct(
        private readonly SaleRepository $saleRepository,
        private readonly ElectronicInvoiceRequestService $invoiceRequests
    ) {}

    public function store(OfflineCreateSaleRequest $request): SaleResource
    {
        $token = $request->user()?->currentAccessToken();
        $storeId = $this->requireCurrentStoreId();

        if (! $token || ! str_starts_with($token->name, 'offline-sync:')) {
            throw new AccessDeniedHttpException('Esta ruta requiere una credencial de sincronización del dispositivo.');
        }
        if (! $request->user()->tokenCan("store:{$storeId}")) {
            throw new AccessDeniedHttpException('La credencial no pertenece a la tienda activa.');
        }

        $request->validate([
            'client_uuid' => ['required', 'uuid'],
            'created_offline' => ['accepted'],
            'offline_created_at' => ['required', 'date'],
            'requested_electronic_document' => ['nullable', 'in:' . ElectronicInvoice::FACTURA],
        ]);
        $this->authorizeWarehouseAccess((int) $request->input('warehouse_id'));

        if ($offlineCustomerUuid = $request->input('offline_customer_uuid')) {
            $customerId = DB::table('offline_customer_identities')
                ->where('store_id', $storeId)
                ->where('client_uuid', $offlineCustomerUuid)
                ->value('customer_id');
            if (! $customerId) {
                abort(422, 'El cliente offline todavía no se ha sincronizado.');
            }
            $request->merge(['customer_id' => $customerId]);
        }
        $customerBelongsToStore = DB::table('customers')
            ->where('id', $request->input('customer_id'))
            ->where('store_id', $storeId)
            ->exists();
        if (! $customerBelongsToStore) {
            abort(422, 'El cliente no pertenece a la tienda activa.');
        }

        $sale = $this->saleRepository->storeSale($request->all());
        $this->invoiceRequests->request($sale, $request->input('requested_electronic_document'));

        return new SaleResource($sale->fresh());
    }
}
