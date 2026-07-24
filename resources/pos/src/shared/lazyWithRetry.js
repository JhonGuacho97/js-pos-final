import { lazy } from "react";

/**
 * Envuelve React.lazy() con un reintento automático de una sola vez.
 *
 * Problema que resuelve: si alguien tiene la app abierta en una pestaña
 * desde ANTES de un deploy, el chunk que su navegador pide puede ya no
 * existir en el servidor (la build nueva lo reemplazó). Eso tira un
 * ChunkLoadError y la pantalla se rompe con un error feo.
 *
 * Con el hash de contenido que ya agregamos en webpack.mix.js esto debería
 * pasar mucho menos seguido, pero esta capa cubre el caso borde restante
 * (y cualquier falla de red pasajera al pedir un chunk): en vez de
 * reventar, refresca la página una sola vez. Si tras refrescar sigue
 * fallando, ahí sí se deja que el error suba normal (evita loops
 * infinitos de recarga).
 */
export const lazyWithRetry = (importer, chunkName) =>
    lazy(async () => {
        const storageKey = `chunk-retry-${chunkName}`;
        const hasRetried = JSON.parse(
            window.sessionStorage.getItem(storageKey) || "false"
        );

        try {
            const component = await importer();
            window.sessionStorage.removeItem(storageKey);
            return component;
        } catch (error) {
            if (!hasRetried) {
                window.sessionStorage.setItem(storageKey, "true");
                window.location.reload();
                // La página se está recargando: no hace falta resolver ni
                // rechazar nada más, dejamos la promesa colgada a propósito.
                return new Promise(() => {});
            }
            throw error;
        }
    });
