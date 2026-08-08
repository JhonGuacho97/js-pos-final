// window.location.port viene vacío en despliegues normales (80/443
// por defecto), así que incluirlo acá no cambia nada en producción --
// pero es necesario para poder probar en local con `php artisan serve`
// (puerto 8000) u otros puertos no estándar, donde antes el frontend
// llamaba a la API en el puerto equivocado.
const port = window.location.port ? ':' + window.location.port : '';

export const environment = {
    URL: window.location.protocol + '//' + window.location.hostname + port,
};
