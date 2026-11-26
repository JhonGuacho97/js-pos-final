<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * App\Models\Setting
 *
 * @property int $id
 * @property string $key
 * @property string $value
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read string $logo
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection|Media[] $media
 * @property-read int|null $media_count
 * @method static \Illuminate\Database\Eloquent\Builder|Setting newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Setting newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Setting query()
 * @method static \Illuminate\Database\Eloquent\Builder|Setting whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Setting whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Setting whereKey($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Setting whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Setting whereValue($value)
 * @mixin \Eloquent
 */
class Setting extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    const PATH = 'settings';

    /**
     * Prefijo de los datos fiscales (RUC, razón social, firma, clave,
     * establecimiento, ambiente...). Nunca se heredan de las filas globales
     * (store_id NULL): esas filas pueden venir de la instalación original y
     * una empresa nueva terminaría emitiendo con el RUC y la firma de otra.
     */
    public const FISCAL_KEY_PREFIX = 'sri_';

    public static function isFiscalKey(string $key): bool
    {
        return str_starts_with($key, self::FISCAL_KEY_PREFIX);
    }

    /**
     * Filas que aplican a una tienda: las propias y las globales (store_id
     * NULL) que no sean fiscales. Sin tienda, solo las globales no fiscales.
     * Para que la fila de la tienda gane, consumir con orderBy('store_id')
     * + pluck(), o con orderByDesc('store_id') + first()/value().
     */
    public function scopeEffectiveFor($query, ?int $storeId)
    {
        return $query->where(function ($q) use ($storeId) {
            if ($storeId) {
                $q->where('store_id', $storeId);
            }
            $q->orWhere(function ($global) {
                $global->whereNull('store_id')
                    ->where('key', 'not like', self::FISCAL_KEY_PREFIX.'%');
            });
        });
    }

    protected $table = 'settings';

    /**
     * @var string[]
     */
    protected $fillable = [
        'store_id',
        'key',
        'value',
    ];

    public function getLogoAttribute(): string
    {
        /** @var Media $media */
        $media = $this->media->last();
        if (! empty($media)) {
            return $media->getFullUrl();
        }

        return asset($this->value ?: 'images/ecua-pos-logo.png');
    }

    /**
     * A diferencia de las demás relaciones store() de este proyecto,
     * store_id acá se queda nullable PERMANENTEMENTE -- null = valor de
     * sistema/legacy (fallback), no-null = override de esa tienda. Ver
     * la migración add_store_id_to_settings_table.
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class, 'store_id', 'id');
    }
}
