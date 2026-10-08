<?php

namespace App\MediaLibrary;

use Illuminate\Support\Facades\Log;
use Spatie\MediaLibrary\Support\UrlGenerator\DefaultUrlGenerator;

/**
 * Compatibility for reading existing public media, not for uploading files.
 * All filesystem operations and MIME validation keep their normal requirements.
 */
class FileinfoCompatibleUrlGenerator extends DefaultUrlGenerator
{
    public function getUrl(): string
    {
        if ($this->hasFileinfo()) {
            // Preserve Spatie/Laravel behavior (including storage exceptions).
            return parent::getUrl();
        }

        $disk = $this->config->get('filesystems.disks.'.$this->getDiskName());
        if (! is_array($disk) || ! $this->isPublicLocalDisk($disk)) {
            return $this->unavailableUrl();
        }

        // Uses Spatie's configured path generator, including per-model
        // overrides and the conversion path; never assumes an /{id}/ layout.
        $path = $this->getPathRelativeToRoot();
        $decodedPath = rawurldecode($path);
        if ($path === '' || str_starts_with($decodedPath, '/')
            || preg_match('~[\\\\\x00-\x1F?#]|(^|/)\.{1,2}(/|$)~', $decodedPath)) {
            return $this->unavailableUrl();
        }

        return $this->versionUrl(rtrim($disk['url'], '/').'/'.ltrim($path, '/'));
    }

    protected function hasFileinfo(): bool
    {
        return extension_loaded('fileinfo') && class_exists(\finfo::class);
    }

    private function isPublicLocalDisk(array $disk): bool
    {
        if (($disk['driver'] ?? null) !== 'local'
            || ($disk['visibility'] ?? null) !== 'public'
            || ! empty($disk['prefix'])
            || ! is_string($disk['url'] ?? null)) {
            return false;
        }

        // Without a verified public root and explicit HTTP(S) URL we cannot
        // safely infer a public location (private/S3/scoped disks stay private).
        $url = parse_url($disk['url']);
        if ($url === false || ! in_array($url['scheme'] ?? '', ['http', 'https'], true)
            || empty($url['host']) || isset($url['user']) || isset($url['pass'])
            || isset($url['query']) || isset($url['fragment'])) {
            return false;
        }

        $root = is_string($disk['root'] ?? null) ? realpath($disk['root']) : false;
        $publicRoot = realpath(public_path());
        if ($root === false || $publicRoot === false) {
            return false;
        }

        $root = str_replace('\\', '/', $root);
        $publicRoot = rtrim(str_replace('\\', '/', $publicRoot), '/');
        if (PHP_OS_FAMILY === 'Windows') {
            $root = strtolower($root);
            $publicRoot = strtolower($publicRoot);
        }

        return $root === $publicRoot || str_starts_with($root, $publicRoot.'/');
    }

    private function unavailableUrl(): string
    {
        Log::warning('Media URL unavailable: enable PHP Fileinfo for this storage configuration.', [
            'media_id' => $this->media?->getKey(),
            'disk' => $this->getDiskName(),
        ]);

        return '';
    }
}
