import { posProductActionType, productActionType, toastType } from "../../../constants";
import apiConfig from "../../../config/apiConfig";
import { addToast } from "../toastAction";
import {
    cacheCatalogImages,
    emitOfflineCatalogStatus,
    filterCatalogProducts,
    getLatestCatalogSnapshot,
    getOfflineScopeKey,
    isNetworkError,
    saveOfflineSnapshot,
} from "../../../offline/catalogStorage";

const offlineCatalogMessage = "No hay conexión y este catálogo todavía no se ha sincronizado en el dispositivo.";

// Por store, no por componente: las consultas del POS y las actualizaciones
// posteriores a una venta escriben en la misma lista de Redux.
const visibleCatalogRequests = new WeakMap();
const catalogDownloads = new WeakMap();

const downloadCatalog = (dispatch, url) => {
    if (!catalogDownloads.has(dispatch)) catalogDownloads.set(dispatch, new Map());
    const pending = catalogDownloads.get(dispatch);
    const key = `${getOfflineScopeKey()}:${url}`;
    if (pending.has(key)) return pending.get(key);
    const download = {
        response: apiConfig.get(url).finally(() => {
            if (pending.get(key) === download) pending.delete(key);
        }),
        snapshot: null,
    };
    pending.set(key, download);
    return download;
};

const createCatalogRequest = (dispatch, options = {}) => {
    const requestId = (visibleCatalogRequests.get(dispatch) || 0) + 1;
    const scope = getOfflineScopeKey();
    if (!options.cacheOnly) visibleCatalogRequests.set(dispatch, requestId);

    const isCurrent = () => scope === getOfflineScopeKey()
        && (!options.isCurrent || options.isCurrent())
        && (options.cacheOnly || visibleCatalogRequests.get(dispatch) === requestId);

    return {
        isCurrent,
        publish: (actionType, products) => {
            if (!options.cacheOnly && isCurrent()) {
                dispatch({ type: actionType, payload: products });
            }
        },
    };
};

const dispatchCachedCatalog = async (dispatch, warehouse, actionType, filters, request) => {
    const snapshot = await getLatestCatalogSnapshot(warehouse).catch(() => null);

    // La lectura de IndexedDB también puede finalizar fuera de orden.
    if (!request.isCurrent()) return { source: "stale", products: [] };

    if (!snapshot) {
        emitOfflineCatalogStatus({
            status: "unavailable",
            online: false,
            canRetry: navigator.onLine,
            warehouseId: warehouse || null,
            hasCache: false,
        });
        dispatch(addToast({ text: offlineCatalogMessage, type: toastType.WARNING }));
        return { source: "none", products: [] };
    }

    const products = filterCatalogProducts(snapshot.payload, filters);
    request.publish(actionType, products);
    emitOfflineCatalogStatus({
        status: "offline",
        catalogPreview: false,
        online: false,
        canRetry: navigator.onLine,
        warehouseId: snapshot.warehouseId,
        hasCache: true,
        updatedAt: snapshot.updatedAt,
        itemCount: snapshot.itemCount,
    });

    return { source: "cache", products, snapshot };
};

const saveCatalog = async (warehouse, products) => {
    try {
        const snapshot = await saveOfflineSnapshot("catalog", products, { warehouseId: warehouse });
        cacheCatalogImages(products);
        emitOfflineCatalogStatus({
            status: "ready",
            online: true,
            canRetry: true,
            warehouseId: warehouse || null,
            hasCache: true,
            updatedAt: snapshot.updatedAt,
            itemCount: snapshot.itemCount,
        });
        return snapshot;
    } catch (_) {
        // El catálogo recibido de la API sigue siendo válido aunque el
        // navegador no permita persistirlo (modo privado, cuota, etc.).
        emitOfflineCatalogStatus({
            status: "error",
            online: true,
            canRetry: true,
            warehouseId: warehouse || null,
            hasCache: false,
        });
        return null;
    }
};

export const posAllProductAction = () => async (dispatch) => {
    const request = createCatalogRequest(dispatch);
    if (!navigator.onLine) {
        return dispatchCachedCatalog(dispatch, null, posProductActionType.POS_ALL_PRODUCT, {}, request);
    }

    try {
        const response = await apiConfig.get("products?page[size]=0");
        const products = response.data.data || [];
        request.publish(posProductActionType.POS_ALL_PRODUCT, products);
        return { source: "network", products };
    } catch (error) {
        if (!request.isCurrent()) return { source: "stale", products: [] };
        if (isNetworkError(error)) {
            return dispatchCachedCatalog(dispatch, null, posProductActionType.POS_ALL_PRODUCT, {}, request);
        }
        const message = error?.response?.data?.message || "No se pudo cargar el catálogo.";
        dispatch(addToast({ text: message, type: toastType.ERROR }));
        return { source: "error", products: [] };
    }
};

export const posAllProduct = (warehouse) => async (dispatch) => {
    const request = createCatalogRequest(dispatch);
    if (!navigator.onLine) {
        return dispatchCachedCatalog(dispatch, warehouse, posProductActionType.POS_ALL_PRODUCTS, {}, request);
    }

    emitOfflineCatalogStatus({ status: "syncing", online: true, warehouseId: warehouse });

    try {
        const response = await apiConfig.get(`products?page[size]=0&warehouse_id=${warehouse}`);
        const products = response.data.data || [];
        request.publish(posProductActionType.POS_ALL_PRODUCTS, products);
        const snapshot = await saveCatalog(warehouse, products);
        return { source: "network", products, snapshot };
    } catch (error) {
        if (!request.isCurrent()) return { source: "stale", products: [] };
        if (isNetworkError(error)) {
            return dispatchCachedCatalog(dispatch, warehouse, posProductActionType.POS_ALL_PRODUCTS, {}, request);
        }
        const message = error?.response?.data?.message || "No se pudo cargar el catálogo.";
        dispatch(addToast({ text: message, type: toastType.ERROR }));
        emitOfflineCatalogStatus({
            status: "error",
            online: navigator.onLine,
            canRetry: navigator.onLine,
            warehouseId: warehouse,
        });
        return { source: "error", products: [] };
    }
};

export const fetchBrandClickable = (brandId, categoryId, warehouse, options = {}) => async (dispatch) => {
    const filters = { brandId, categoryId };
    const request = createCatalogRequest(dispatch, options);

    if (!navigator.onLine) {
        return dispatchCachedCatalog(dispatch, warehouse, productActionType.FETCH_BRAND_CLICKABLE, filters, request);
    }

    // Renovar la copia offline no implica mostrarla completa: se aplica el
    // filtro vigente antes de publicar una única actualización visible.
    const isFullCatalog = options.refreshCache || options.cacheOnly || (!brandId && !categoryId);
    const queryFilters = isFullCatalog ? {} : filters;
    if (isFullCatalog) {
        emitOfflineCatalogStatus({ status: "syncing", online: true, warehouseId: warehouse });
    }

    const scope = getOfflineScopeKey();
    let networkSettled = false;
    // Read only this user's/store's warehouse snapshot. A late IndexedDB
    // response must never replace fresh network prices or a newer selection.
    if (options.previewCache && !options.cacheOnly) {
        void getLatestCatalogSnapshot(warehouse).then((snapshot) => {
            if (!snapshot || networkSettled || !request.isCurrent()) return;
            emitOfflineCatalogStatus({
                status: "syncing", online: true, warehouseId: warehouse,
                catalogPreview: true, hasCache: true,
            });
            request.publish(productActionType.FETCH_BRAND_CLICKABLE,
                filterCatalogProducts(snapshot.payload, filters));
        }).catch(() => null);
    }

    try {
        const download = downloadCatalog(dispatch,
            `products?filter[brand_id]=${queryFilters.brandId || ""}&filter[product_category_id]=${queryFilters.categoryId || ""}&page[size]=0&warehouse_id=${warehouse || ""}`
        );
        const response = await download.response;
        networkSettled = true;
        const products = response.data.data || [];
        const visibleProducts = filterCatalogProducts(products, filters);
        if (request.isCurrent() && !options.cacheOnly) {
            emitOfflineCatalogStatus({ catalogPreview: false, warehouseId: warehouse });
        }
        request.publish(productActionType.FETCH_BRAND_CLICKABLE, visibleProducts);

        const snapshot = isFullCatalog && scope === getOfflineScopeKey()
            ? await (download.snapshot || (download.snapshot = saveCatalog(warehouse, products))) : null;
        return { source: "network", products: visibleProducts, snapshot };
    } catch (error) {
        networkSettled = true;
        if (!request.isCurrent()) return { source: "stale", products: [] };
        if (isNetworkError(error)) {
            return dispatchCachedCatalog(dispatch, warehouse, productActionType.FETCH_BRAND_CLICKABLE, filters, request);
        }

        const message = error?.response?.data?.message || "No se pudo filtrar el catálogo.";
        // Authentication/authorization errors cannot leave a cached preview usable.
        request.publish(productActionType.FETCH_BRAND_CLICKABLE, []);
        dispatch(addToast({ text: message, type: toastType.ERROR }));
        emitOfflineCatalogStatus({
            status: "error",
            catalogPreview: false,
            online: navigator.onLine,
            canRetry: navigator.onLine,
            warehouseId: warehouse,
        });
        return { source: "error", products: [] };
    }
};
