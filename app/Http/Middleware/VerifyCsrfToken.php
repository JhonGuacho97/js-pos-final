<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        // Estas rutas no usan autenticación de sesión: exigen un token
        // Sanctum Bearer limitado por dispositivo, capacidad y tienda.
        // El service worker no puede leer la cookie XSRF-TOKEN del documento.
        'api/offline-sync/customers',
        'api/offline-sync/sales',
    ];
}
