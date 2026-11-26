<?php

namespace App\MediaLibrary;

use Spatie\MediaLibrary\MediaCollections\Models\Media as SpatieMedia;

class Media extends SpatieMedia
{
    public function getFullUrl(string $conversionName = ''): string
    {
        $url = $this->getUrl($conversionName);

        // Spatie's url('') becomes the application's home page. A missing
        // media URL must remain empty, not look like a valid image/document.
        return $url === '' ? '' : url($url);
    }
}
