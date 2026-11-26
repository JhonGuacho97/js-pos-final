<?php

namespace App\Traits;

use Spatie\Image\Manipulations;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Versiones reducidas de las fotos de producto para el catálogo virtual.
 *
 * Las fotos se suben tal cual salen del celular (hasta 15 MB y 64 MP) y el
 * catálogo las mostraba a tamaño completo en tarjetas de ~300 px. Cada foto
 * genera ahora dos copias en WebP dentro de su carpeta `thumbnails/`:
 *   - `thumb`  (máx. 600 px)  para la cuadrícula y el carrito;
 *   - `detail` (máx. 1400 px) para la ficha del producto y el zoom.
 * El original no se toca.
 *
 * Se generan en la cola (como manda config/media-library.php), así que subir
 * una foto no se vuelve más lento. Mientras una copia no exista, el catálogo
 * sigue usando el original.
 */
trait HasCatalogImages
{
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->fit(Manipulations::FIT_MAX, 600, 600)
            ->format(Manipulations::FORMAT_WEBP)
            ->quality(78)
            ->performOnCollections(static::PATH);

        $this->addMediaConversion('detail')
            ->fit(Manipulations::FIT_MAX, 1400, 1400)
            ->format(Manipulations::FORMAT_WEBP)
            ->quality(80)
            ->performOnCollections(static::PATH);
    }

    /**
     * @return array<int, array{thumb: string, detail: string, full: string}>
     */
    public function catalogImages(): array
    {
        return $this->getMedia(static::PATH)
            ->map(function (Media $media) {
                $full = $media->getFullUrl();

                return [
                    'thumb' => $media->hasGeneratedConversion('thumb') ? $media->getFullUrl('thumb') : $full,
                    'detail' => $media->hasGeneratedConversion('detail') ? $media->getFullUrl('detail') : $full,
                    'full' => $full,
                ];
            })
            ->values()
            ->all();
    }
}
