<?php

namespace Database\Seeders;

use App\Models\BaseUnit;
use App\Models\Unit;
use Illuminate\Database\Seeder;

/**
 * La tabla `units` nunca tuvo un seeder propio -- a diferencia de
 * `base_units` (ver DefaultBaseUnitSeeder), quedaba completamente vacía en
 * cualquier instalación. Como todo producto necesita un sale_unit/
 * purchase_unit válido (Unit::whereBaseUnit(...)), esto rompía tanto crear
 * productos desde la UI como importarlos por CSV -- probado: la
 * importación de productos fallaba en TODAS las filas del archivo demo con
 * "Sale unit ... is not found.".
 *
 * Crea un Unit por cada BaseUnit, con el mismo nombre (1 unidad de venta/
 * compra = 1 unidad base, sin conversión) -- exactamente lo que espera el
 * archivo demo de importación de productos. Idempotente a propósito: no
 * duplica si ya existe una unidad con ese nombre para esa unidad base.
 */
class DefaultUnitSeeder extends Seeder
{
    public function run(): void
    {
        $shortNames = [
            'piece' => 'pcs',
            'meter' => 'm',
            'kilogram' => 'kg',
        ];

        foreach (BaseUnit::all() as $baseUnit) {
            if (Unit::whereName($baseUnit->name)->whereBaseUnit($baseUnit->id)->exists()) {
                continue;
            }

            Unit::create([
                'name' => $baseUnit->name,
                'short_name' => $shortNames[$baseUnit->name] ?? $baseUnit->name,
                'base_unit' => $baseUnit->id,
            ]);
        }
    }
}
