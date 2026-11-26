<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Desde este cambio, los datos fiscales (settings sri_*) solo se leen de la
 * propia tienda (Setting::scopeEffectiveFor). Antes, una tienda sin fila
 * propia caía a la fila global (store_id NULL), que en una instalación
 * migrada contiene el RUC y la firma del negocio original: cualquier empresa
 * nueva del SaaS los habría heredado.
 *
 * Para que el negocio original (organizaciones con plan "legacy") siga
 * emitiendo igual, se le copian a sus tiendas las filas globales sri_* que
 * todavía no tenga como propias. Las filas globales no se borran: quedan sin
 * uso y así el cambio se puede revertir sin pérdida.
 */
return new class extends Migration
{
    public function up(): void
    {
        $globales = DB::table('settings')
            ->whereNull('store_id')
            ->where('key', 'like', 'sri\_%')
            ->get(['key', 'value']);

        if ($globales->isEmpty()) {
            return;
        }

        $tiendasLegacy = DB::table('stores')
            ->join('organization_subscriptions', 'organization_subscriptions.organization_id', '=', 'stores.organization_id')
            ->join('saas_plans', 'saas_plans.id', '=', 'organization_subscriptions.saas_plan_id')
            ->where('saas_plans.code', 'legacy')
            ->distinct()
            ->pluck('stores.id');

        $now = now();

        foreach ($tiendasLegacy as $storeId) {
            $propias = DB::table('settings')
                ->where('store_id', $storeId)
                ->where('key', 'like', 'sri\_%')
                ->pluck('key')
                ->all();

            $faltantes = $globales
                ->reject(fn ($fila) => in_array($fila->key, $propias, true))
                ->map(fn ($fila) => [
                    'store_id' => $storeId,
                    'key' => $fila->key,
                    'value' => $fila->value,
                    'created_at' => $now,
                    'updated_at' => $now,
                ])
                ->values()
                ->all();

            if ($faltantes) {
                DB::table('settings')->insert($faltantes);
            }
        }
    }

    public function down(): void
    {
        // Las filas copiadas son configuración válida de esas tiendas; no se
        // distinguen de las que la tienda guardó después, así que no se borran.
    }
};
