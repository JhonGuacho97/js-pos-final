<?php

return [
    // Permite habilitar o cerrar el alta publica de organizaciones sin
    // desplegar codigo. En produccion el valor se toma del archivo .env.
    'self_registration_enabled' => (bool) env('SAAS_SELF_REGISTRATION_ENABLED', true),

    // Identidad del software de la plataforma, independiente del RUC emisor
    // y la firma privada de cada tienda. Los overrides explícitos se conservan.
    'sri_software_origin' => env('SAAS_SRI_SOFTWARE_ORIGIN', 'TERCERO'),
    'sri_provider_ruc' => env('SAAS_SRI_PROVIDER_RUC', ''),

    /*
     * proveedor => clase que implementa RecurringPaymentGateway.
     * Se deja vacío hasta seleccionar y configurar la cuenta comercial.
     */
    'payment_gateways' => [],

    // Una autorización confirmada por el servidor puede sostener el POS
    // sin conexión por este tiempo, nunca más allá del vencimiento real.
    'offline_lease_hours' => (int) env('SAAS_OFFLINE_LEASE_HOURS', 12),

    // Una renovacion manual del mismo plan solo puede solicitarse cuando
    // falten estos dias (o menos) para terminar el periodo ya pagado.
    'renewal_window_days' => (int) env('SAAS_RENEWAL_WINDOW_DAYS', 5),
];
