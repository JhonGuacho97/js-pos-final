import { posProductActionType, productActionType, toastType } from "../../../constants";
import apiConfig from "../../../config/apiConfig";
import { addToast } from "../toastAction";
import {
    cacheCatalogImages,
    emitOfflineCatalogStatus,
    filterCatalogProducts,
    getLatestCatalogSnapshot,
    isNetworkError,
    saveOfflineSnapshot,
} from "../../../offline/catalogStorage";

const offlineCatalogMessage = "No hay conexión y este catálogo todavía no se ha sincronizado en el dispositivo.";

// Por store, no por componente: las consultas del POS y las actualizaciones
// posteriores a una venta escriben en la misma lista de Redux.
const visibleCatalogRequests = new WeakMap();

const createCatalogRequest = (dispatch, options = {}) => {
    const requestId = (visibleCatalogRequests.get(dispatch) || 0) + 1;
    if (!options.cacheOnly) visibleCatalogRequests.set(dispatch, requestId);

    const isCurrent = () => (!options.isCurrent || options.isCurrent())
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

    try {
        const response = await apiConfig.get(
            `products?filter[brand_id]=${queryFilters.brandId || ""}&filter[product_category_id]=${queryFilters.categoryId || ""}&page[size]=0&warehouse_id=${warehouse || ""}`
        );
        const products = response.data.data || [];
        const visibleProducts = filterCatalogProducts(products, filters);
        request.publish(productActionType.FETCH_BRAND_CLICKABLE, visibleProducts);

        const snapshot = isFullCatalog ? await saveCatalog(warehouse, products) : null;
        return { source: "network", products: visibleProducts, snapshot };
    } catch (error) {
        if (!request.isCurrent()) return { source: "stale", products: [] };
        if (isNetworkError(error)) {
            return dispatchCachedCatalog(dispatch, warehouse, productActionType.FETCH_BRAND_CLICKABLE, filters, request);
        }

        const message = error?.response?.data?.message || "No se pudo filtrar el catálogo.";
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
