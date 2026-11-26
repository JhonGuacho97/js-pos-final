<?php

namespace App\Http\Controllers;

use App\Http\Controllers\API\PublicCatalogController;
use App\Models\Store;
use App\Services\SaaS\EntitlementService;
use Illuminate\Contracts\View\View;

class CatalogPageController extends Controller
{
    public function __invoke(Store $store, EntitlementService $entitlements, PublicCatalogController $catalog): View
    {
        abort_unless(
            $store->is_active
                && $store->organization?->is_active
                && $store->organization_id
                && $entitlements->organizationCanWrite((int) $store->organization_id)
                && $store->catalogSetting?->is_enabled,
            404
        );

        // Los productos viajan dentro del HTML: el catálogo se dibuja apenas
        // carga el JavaScript, sin esperar una segunda petición a la API.
        // Si el catálogo no está listo (sin bodega o WhatsApp), la página
        // carga igual y el navegador consulta la API, que muestra el aviso.
        try {
            $data = $catalog->catalogPayload($store);
        } catch (\Symfony\Component\HttpKernel\Exception\HttpException) {
            $data = null;
        }

        return view('catalog', compact('store', 'data'));
    }
}
