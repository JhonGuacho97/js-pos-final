<?php

use App\Models\Variation;
use App\Services\PresentationCatalogSyncService;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $sync = app(PresentationCatalogSyncService::class);

        Variation::query()
            ->where('is_presentation', true)
            ->with('variation_types')
            ->orderBy('id')
            ->chunkById(100, function ($variations) use ($sync) {
                foreach ($variations as $variation) {
                    $sync->sync($variation);
                }
            });
    }

    /**
     * Migración deliberadamente no destructiva: los registros sincronizados
     * pueden haber sido usados por productos después del despliegue.
     */
    public function down(): void
    {
        // No se eliminan catálogos ni presentaciones de productos.
    }
};
