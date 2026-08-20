<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Contracts\View\View;

class CatalogPageController extends Controller
{
    public function __invoke(Store $store): View
    {
        abort_unless($store->is_active && $store->catalogSetting?->is_enabled, 404);

        return view('catalog', compact('store'));
    }
}
