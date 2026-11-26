<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\OrganizationSubscription;
use App\Models\SaaSPlan;
use App\Models\Setting;
use App\Models\Store;
use App\Services\SriConfigService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * Los datos fiscales (sri_*) de la instalación original viven en filas
 * globales (store_id NULL). Ninguna empresa nueva debe heredarlos.
 */
class FiscalSettingsIsolationTest extends TestCase
{
    use DatabaseTransactions;

    public function test_una_tienda_nueva_no_hereda_ruc_ni_firma_globales(): void
    {
        $this->globalSetting('sri_ruc', '2300331663001');
        $this->globalSetting('sri_certificado_path', 'certificados/original.p12');
        $this->globalSetting('company_name', 'Plataforma');

        $store = $this->store();
        $config = SriConfigService::get($store->id);

        $this->assertSame('', $config['ruc']);
        $this->assertNull($config['certificado_path']);
    }

    public function test_la_configuracion_propia_de_la_tienda_si_se_usa(): void
    {
        $this->globalSetting('sri_ruc', '2300331663001');
        $store = $this->store();
        Setting::create(['store_id' => $store->id, 'key' => 'sri_ruc', 'value' => '1790012345001']);

        $this->assertSame('1790012345001', SriConfigService::get($store->id)['ruc']);
    }

    public function test_get_setting_value_tampoco_hereda_datos_fiscales(): void
    {
        $this->globalSetting('sri_ruc', '2300331663001');
        $this->globalSetting('company_name', 'Plataforma global');
        $store = $this->store();

        $request = Request::create('/');
        $request->attributes->set('current_store_id', $store->id);
        $this->app->instance('request', $request);

        $this->assertNull(getSettingValue('sri_ruc'));
        // Lo no fiscal sigue cayendo al valor global, como antes.
        $this->assertSame('Plataforma global', getSettingValue('company_name'));
    }

    public function test_rutas_publicas_cerradas(): void
    {
        $this->get('/upgrade-to-v1-2-0')->assertNotFound();
        $this->get('/upgrade/database')->assertNotFound();
        $this->getJson('/api/sri/lookup?identification=1317342465')->assertUnauthorized();
    }

    private function globalSetting(string $key, string $value): void
    {
        Setting::whereNull('store_id')->where('key', $key)->delete();
        Setting::create(['store_id' => null, 'key' => $key, 'value' => $value]);
    }

    private function store(): Store
    {
        $suffix = Str::lower(Str::random(10));
        $plan = SaaSPlan::firstOrCreate(['code' => 'trial-fiscal-test'], [
            'name' => 'Plan de prueba fiscal',
            'price' => 0,
            'currency' => 'USD',
            'billing_interval' => 'monthly',
            'billing_interval_count' => 1,
            'trial_days' => 0,
            'grace_days' => 0,
            'features' => ['*'],
            'is_active' => true,
        ]);
        $organization = Organization::create([
            'name' => "Nueva {$suffix}",
            'slug' => "org-{$suffix}",
            'is_active' => true,
        ]);
        OrganizationSubscription::create([
            'organization_id' => $organization->id,
            'saas_plan_id' => $plan->id,
            'status' => OrganizationSubscription::STATUS_ACTIVE,
            'starts_at' => now(),
            'current_period_starts_at' => now(),
            'current_period_ends_at' => now()->addYear(),
            'electronic_documents_used' => 0,
        ]);

        return Store::create([
            'organization_id' => $organization->id,
            'name' => "Tienda {$suffix}",
            'slug' => "store-{$suffix}",
            'is_active' => true,
            'is_default' => true,
        ]);
    }
}
