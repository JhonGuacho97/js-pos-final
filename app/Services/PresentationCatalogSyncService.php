<?php

namespace App\Services;

use App\Models\PresentationFamily;
use App\Models\PresentationType;
use App\Models\ProductPresentation;
use App\Models\Variation;
use App\Models\VariationType;

class PresentationCatalogSyncService
{
    /**
     * Mantiene compatible la casilla "Usar para presentaciones de venta"
     * con el catálogo de presentaciones separado. La variante sigue siendo
     * independiente; aquí solo se refleja su nombre y sus opciones.
     */
    public function sync(Variation $variation): ?PresentationFamily
    {
        $variation->loadMissing('variation_types');
        $familySlug = 'legacy-'.$variation->id;
        $family = PresentationFamily::query()
            ->where('store_id', $variation->store_id)
            ->where('slug', $familySlug)
            ->first();

        if (! $variation->is_presentation) {
            if ($family) {
                $family->update(['is_active' => false]);
                $family->types()->update(['is_active' => false]);
            }

            return $family;
        }

        $family = PresentationFamily::updateOrCreate(
            ['store_id' => $variation->store_id, 'slug' => $familySlug],
            [
                'name' => $variation->name,
                'is_active' => true,
                'sort' => 1000 + (int) $variation->id,
            ]
        );

        $activeTypeIds = [];
        foreach ($variation->variation_types->values() as $sort => $variationType) {
            $presentationType = $this->matchingType($family, $variationType);
            $attributes = [
                'store_id' => $variation->store_id,
                'presentation_family_id' => $family->id,
                'name' => $variationType->name,
                'default_equivalence' => $presentationType?->default_equivalence,
                'is_active' => true,
                'sort' => $sort,
            ];

            if ($presentationType) {
                $presentationType->update($attributes);
            } else {
                $presentationType = PresentationType::create($attributes + [
                    'slug' => 'variation-type-'.$variationType->id,
                ]);
            }

            $activeTypeIds[] = $presentationType->id;

            // Conserva la trazabilidad de presentaciones antiguas que aún
            // referencian variation_type_id, sin cambiar sus IDs históricos.
            ProductPresentation::query()
                ->where('variation_type_id', $variationType->id)
                ->whereNull('presentation_type_id')
                ->update(['presentation_type_id' => $presentationType->id]);
        }

        $family->types()
            ->when($activeTypeIds !== [], fn ($query) => $query->whereNotIn('id', $activeTypeIds))
            ->when($activeTypeIds === [], fn ($query) => $query)
            ->update(['is_active' => false]);

        return $family->fresh('types');
    }

    private function matchingType(PresentationFamily $family, VariationType $variationType): ?PresentationType
    {
        $stableSlug = 'variation-type-'.$variationType->id;

        return $family->types()
            ->where(function ($query) use ($stableSlug, $variationType) {
                $query->where('slug', $stableSlug)
                    // Formato utilizado por la migración que separó ambos
                    // catálogos. El sufijo con ID permite reconocerlo aunque
                    // el nombre visible haya cambiado después.
                    ->orWhere('slug', 'like', '%-'.$variationType->id)
                    ->orWhereHas('productPresentations', fn ($presentation) =>
                        $presentation->where('variation_type_id', $variationType->id)
                    );
            })
            ->first();
    }
}
