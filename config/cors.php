<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Antes fijo en '*' -- el frontend real es same-origin (construye la
    // URL de la API desde window.location, ver resources/pos/src/config/
    // environment.js), así que un wildcard acá no aporta nada al
    // funcionamiento normal, solo amplía innecesariamente qué orígenes
    // pueden usar un token robado (ej. por XSS) contra la API.
    // CORS_ALLOWED_ORIGINS en .env: lista separada por comas de los
    // dominios reales de producción (ej. "https://pos.tuempresa.com").
    // Si no se define, cae a '*' para no romper el desarrollo local.
    'allowed_origins' => array_values(array_filter(explode(',', env('CORS_ALLOWED_ORIGINS', '*')))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
