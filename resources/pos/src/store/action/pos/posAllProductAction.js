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

const dispatchCachedCatalog = async (dispatch, warehouse, actionType, filters = {}) => {
    const snapshot = await getLatestCatalogSnapshot(warehouse).catch(() => null);

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
    dispatch({ type: actionType, payload: products });
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
    if (!navigator.onLine) {
        return dispatchCachedCatalog(dispatch, null, posProductActionType.POS_ALL_PRODUCT);
    }

    try {
        const response = await apiConfig.get("products?page[size]=0");
        const products = response.data.data || [];
        dispatch({ type: posProductActionType.POS_ALL_PRODUCT, payload: products });
        return { source: "network", products };
    } catch (error) {
        if (isNetworkError(error)) {
            return dispatchCachedCatalog(dispatch, null, posProductActionType.POS_ALL_PRODUCT);
        }
        const message = error?.response?.data?.message || "No se pudo cargar el catálogo.";
        dispatch(addToast({ text: message, type: toastType.ERROR }));
        return { source: "error", products: [] };
    }
};

export const posAllProduct = (warehouse) => async (dispatch) => {
    if (!navigator.onLine) {
        return dispatchCachedCatalog(dispatch, warehouse, posProductActionType.POS_ALL_PRODUCTS);
    }

    emitOfflineCatalogStatus({ status: "syncing", online: true, warehouseId: warehouse });

    try {
        const response = await apiConfig.get(`products?page[size]=0&warehouse_id=${warehouse}`);
        const products = response.data.data || [];
        dispatch({ type: posProductActionType.POS_ALL_PRODUCTS, payload: products });
        const snapshot = await saveCatalog(warehouse, products);
        return { source: "network", products, snapshot };
    } catch (error) {
        if (isNetworkError(error)) {
            return dispatchCachedCatalog(dispatch, warehouse, posProductActionType.POS_ALL_PRODUCTS);
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

export const fetchBrandClickable = (brandId, categoryId, warehouse) => async (dispatch) => {
    const filters = { brandId, categoryId };

    if (!navigator.onLine) {
        return dispatchCachedCatalog(dispatch, warehouse, productActionType.FETCH_BRAND_CLICKABLE, filters);
    }

    const isFullCatalog = !brandId && !categoryId;
    if (isFullCatalog) {
        emitOfflineCatalogStatus({ status: "syncing", online: true, warehouseId: warehouse });
    }

    try {
        const response = await apiConfig.get(
            `products?filter[brand_id]=${brandId || ""}&filter[product_category_id]=${categoryId || ""}&page[size]=0&warehouse_id=${warehouse || ""}`
        );
        const products = response.data.data || [];
        dispatch({ type: productActionType.FETCH_BRAND_CLICKABLE, payload: products });

        const snapshot = isFullCatalog ? await saveCatalog(warehouse, products) : null;
        return { source: "network", products, snapshot };
    } catch (error) {
        if (isNetworkError(error)) {
            return dispatchCachedCatalog(dispatch, warehouse, productActionType.FETCH_BRAND_CLICKABLE, filters);
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
