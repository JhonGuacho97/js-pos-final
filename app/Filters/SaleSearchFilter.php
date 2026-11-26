<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

/**
 * Búsqueda libre de ventas (?filter[search]=...): referencia, cliente o
 * almacén.
 *
 * A diferencia de CustomSearchFilter, todas las condiciones van agrupadas
 * dentro de un único where(...). Sin ese agrupamiento los orWhere quedaban
 * sueltos y se combinaban mal con el resto de filtros (tienda, sucursal,
 * fechas): "store_id = 1 OR reference_code LIKE ..." devolvía todas las
 * ventas de la tienda, por eso buscar por referencia no filtraba nada.
 */
class SaleSearchFilter implements Filter
{
    public function __invoke(Builder $query, $value, string $property): Builder
    {
        return self::apply($query, $value);
    }

    public static function apply(Builder $query, $value): Builder
    {
        $terms = array_values(array_filter(
            array_map(fn ($term) => trim((string) $term), (array) $value),
            fn ($term) => $term !== ''
        ));

        if (empty($terms)) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($terms) {
            foreach ($terms as $term) {
                $like = '%'.$term.'%';
                $q->orWhere('reference_code', 'LIKE', $like)
                    ->orWhereHas('customer', fn (Builder $c) => $c->where('name', 'LIKE', $like))
                    ->orWhereHas('warehouse', fn (Builder $w) => $w->where('name', 'LIKE', $like));
            }
        });
    }
}
