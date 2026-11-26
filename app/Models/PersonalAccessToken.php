<?php

namespace App\Models;

use Illuminate\Support\Carbon;
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

/**
 * Sanctum actualiza `last_used_at` en CADA petición autenticada: una
 * escritura en la base por cada llamada del POS. Ese dato solo se usa como
 * referencia de "último uso", así que alcanza con refrescarlo como mucho
 * una vez por minuto.
 */
class PersonalAccessToken extends SanctumPersonalAccessToken
{
    public const LAST_USED_REFRESH_SECONDS = 60;

    public function save(array $options = [])
    {
        if ($this->exists && array_keys($this->getDirty()) === ['last_used_at']) {
            $previous = $this->getOriginal('last_used_at');

            if ($previous && Carbon::parse($previous)->gt(now()->subSeconds(self::LAST_USED_REFRESH_SECONDS))) {
                // Se descarta el cambio pendiente: el token queda como vino
                // de la base y no se emite ningún UPDATE.
                $this->setRawAttributes($this->getOriginal(), true);

                return true;
            }
        }

        return parent::save($options);
    }
}
