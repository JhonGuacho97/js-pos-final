<?php

namespace App\Http\Controllers;

use App\Models\LandingPageSetting;
use App\Models\SaaSPlan;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class LandingPageController extends Controller
{
    public function __invoke(): View|RedirectResponse
    {
        $settings = LandingPageSetting::latest('id')->first();
        if ($settings && ! $settings->is_published) {
            return redirect()->route('app');
        }
        $content = LandingPageSetting::mergeWithDefaults($settings?->content);
        $plans = SaaSPlan::where('is_active', true)->where('code', '!=', 'trial')
            ->orderBy('sort_order')->orderBy('price')->get();
        // Los límites reales de la prueba, para no prometer en la landing algo
        // distinto de lo que el plan "trial" permite.
        $trial = SaaSPlan::where('is_active', true)->where('code', 'trial')->first();

        return view('landing', compact('content', 'plans', 'trial'));
    }
}
