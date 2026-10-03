<?php

namespace Tests;

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Foundation\Application;

trait CreatesApplication
{
    /**
     * Creates the application.
     */
    public function createApplication(): Application
    {
        $app = require __DIR__.'/../bootstrap/app.php';

        // El runner puede aislar también los archivos, no solo la base de datos.
        if ($storage = getenv('TEST_STORAGE_PATH')) {
            $app->useStoragePath($storage);
        }
        if ($public = getenv('TEST_PUBLIC_PATH')) {
            $app->usePublicPath($public);
        }

        $app->make(Kernel::class)->bootstrap();

        return $app;
    }
}
