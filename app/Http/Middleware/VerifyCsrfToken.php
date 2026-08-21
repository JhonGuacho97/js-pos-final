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
        // El checkout del catálogo es un endpoint público y no depende de
        // una sesión autenticada. Sanctum considera stateful cualquier
        // petición del mismo dominio y, sin esta excepción específica,
        // intentaba exigir un token CSRF a los clientes del catálogo.
        // Precios, stock, tienda y presentaciones se validan nuevamente en
        // PublicCatalogController antes de registrar el pedido.
        'api/catalog/*/orders',
        // Estas rutas no usan autenticación de sesión: exigen un token
        // Sanctum Bearer limitado por dispositivo, capacidad y tienda.
        // El service worker no puede leer la cookie XSRF-TOKEN del documento.
        'api/offline-sync/customers',
        'api/offline-sync/sales',
    ];
}
