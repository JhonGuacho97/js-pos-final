<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Models\PresentationFamily;
use App\Models\PresentationType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PresentationCatalogAPIController extends AppBaseController
{
    public function index(): JsonResponse
    {
        $storeId = $this->requireCurrentStoreId();
        $this->ensureDefaults($storeId);

        $families = PresentationFamily::query()
            ->where('store_id', $storeId)
            ->where('is_active', true)
            ->with(['types' => fn ($query) => $query->where('is_active', true)])
            ->orderBy('sort')
            ->orderBy('name')
            ->get()
            ->map(fn (PresentationFamily $family) => [
                'id' => $family->id,
                'name' => $family->name,
                'slug' => $family->slug,
                'types' => $family->types->map(fn (PresentationType $type) => [
                    'id' => $type->id,
                    'name' => $type->name,
                    'default_equivalence' => $type->default_equivalence,
                ])->values(),
            ])->values();

        return $this->sendResponse($families, 'Presentation catalog retrieved successfully');
    }

    public function storeFamily(Request $request): JsonResponse
    {
        $storeId = $this->requireCurrentStoreId();
        $input = $request->validate(['name' => 'required|string|max:100']);
        $slug = $this->uniqueSlug('presentation_families', $storeId, $input['name']);

        $family = PresentationFamily::create([
            'store_id' => $storeId,
            'name' => $input['name'],
            'slug' => $slug,
            'is_active' => true,
            'sort' => (int) PresentationFamily::where('store_id', $storeId)->max('sort') + 1,
        ]);

        return $this->sendResponse($family, 'Presentation family created successfully');
    }

    public function storeType(Request $request, PresentationFamily $family): JsonResponse
    {
        $this->authorizeStoreOwnership($family);
        $input = $request->validate([
            'name' => 'required|string|max:100',
            'default_equivalence' => 'nullable|numeric|min:0.0001',
        ]);

        $slug = Str::slug($input['name']);
        $baseSlug = $slug ?: 'presentacion';
        $suffix = 2;
        while (PresentationType::where('presentation_family_id', $family->id)->where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $suffix++;
        }

        $type = PresentationType::create([
            'store_id' => $family->store_id,
            'presentation_family_id' => $family->id,
            'name' => $input['name'],
            'slug' => $slug,
            'default_equivalence' => $input['default_equivalence'] ?? null,
            'is_active' => true,
            'sort' => (int) PresentationType::where('presentation_family_id', $family->id)->max('sort') + 1,
        ]);

        return $this->sendResponse($type, 'Presentation type created successfully');
    }

    private function uniqueSlug(string $table, int $storeId, string $name): string
    {
        $base = Str::slug($name) ?: 'familia';
        $slug = $base;
        $suffix = 2;
        while (DB::table($table)->where('store_id', $storeId)->where('slug', $slug)->exists()) {
            $slug = $base . '-' . $suffix++;
        }

        return $slug;
    }

    private function ensureDefaults(int $storeId): void
    {
        if (PresentationFamily::where('store_id', $storeId)->exists()) {
            return;
        }

        $defaults = [
            ['General', 'general', [['Unidad', 1], ['Paquete', null], ['Caja', null]]],
            ['Bebidas', 'bebidas', [['Unidad', 1], ['Six Pack', 6], ['Pack x12', 12], ['Caja x24', 24]]],
            ['Tabaco', 'tabaco', [['Cigarrillo', 1], ['Cajetilla', 20], ['Cartón', 200]]],
            ['Farmacia', 'farmacia', [['Unidad', 1], ['Blíster', null], ['Frasco', null], ['Caja', null]]],
            ['Ferretería', 'ferreteria', [['Unidad', 1], ['Paquete', null], ['Rollo', null], ['Caja', null]]],
        ];

        DB::transaction(function () use ($defaults, $storeId) {
            foreach ($defaults as $familySort => [$name, $slug, $types]) {
                $family = PresentationFamily::create([
                    'store_id' => $storeId,
                    'name' => $name,
                    'slug' => $slug,
                    'sort' => $familySort,
                ]);
                foreach ($types as $sort => [$typeName, $equivalence]) {
                    PresentationType::create([
                        'store_id' => $storeId,
                        'presentation_family_id' => $family->id,
                        'name' => $typeName,
                        'slug' => Str::slug($typeName),
                        'default_equivalence' => $equivalence,
                        'sort' => $sort,
                    ]);
                }
            }
        });
    }
}
