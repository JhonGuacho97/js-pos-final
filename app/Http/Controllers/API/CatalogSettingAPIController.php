<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Models\CatalogSetting;
use App\Models\Warehouse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CatalogSettingAPIController extends AppBaseController
{
    public function show(): JsonResponse
    {
        $storeId = $this->requireCurrentStoreId();
        $setting = CatalogSetting::firstOrCreate(
            ['store_id' => $storeId],
            ['warehouse_id' => Warehouse::where('store_id', $storeId)->orderBy('id')->value('id')]
        );

        return $this->sendResponse($this->payload($setting), 'Configuración del catálogo obtenida.');
    }

    public function update(Request $request): JsonResponse
    {
        $storeId = $this->requireCurrentStoreId();
        $data = $request->validate([
            'warehouse_id' => [
                'required',
                Rule::exists('warehouses', 'id')->where(fn ($query) => $query->where('store_id', $storeId)),
            ],
            'is_enabled' => 'present|boolean',
            'whatsapp_number' => 'required_if:is_enabled,true|nullable|string|max:30',
            'headline' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'show_stock' => 'present|boolean',
            'allow_pickup' => 'present|boolean',
            'allow_delivery' => 'present|boolean',
            'delivery_fee' => 'required|numeric|min:0',
            'minimum_order' => 'required|numeric|min:0',
        ]);

        if (!$data['allow_pickup'] && !$data['allow_delivery']) {
            return $this->sendError('Debes habilitar retiro en tienda o entrega a domicilio.', 422);
        }

        $setting = CatalogSetting::updateOrCreate(['store_id' => $storeId], $data);

        return $this->sendResponse($this->payload($setting), 'Configuración del catálogo actualizada.');
    }

    private function payload(CatalogSetting $setting): array
    {
        $setting->loadMissing('store');

        return [
            'id' => $setting->id,
            'store_id' => $setting->store_id,
            'warehouse_id' => $setting->warehouse_id,
            'is_enabled' => $setting->is_enabled,
            'whatsapp_number' => $setting->whatsapp_number,
            'headline' => $setting->headline,
            'description' => $setting->description,
            'show_stock' => $setting->show_stock,
            'allow_pickup' => $setting->allow_pickup,
            'allow_delivery' => $setting->allow_delivery,
            'delivery_fee' => $setting->delivery_fee,
            'minimum_order' => $setting->minimum_order,
            'public_url' => url('/catalogo/'.$setting->store->slug),
        ];
    }
}
