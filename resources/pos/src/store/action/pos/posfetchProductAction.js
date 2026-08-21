import apiConfig from '../../../config/apiConfig';
import { apiBaseURL, posProductActionType, toastType } from '../../../constants';
import { addToast } from '../toastAction';
import {
    getLatestCatalogSnapshot,
    isNetworkError,
} from '../../../offline/catalogStorage';

const cachedProduct = async (matcher) => {
    const snapshot = await getLatestCatalogSnapshot().catch(() => null);
    return (snapshot?.payload || []).find(matcher) || null;
};

export const posFetchProduct = (productId) => async (dispatch) => {
    if (!navigator.onLine) {
        const product = await cachedProduct((item) => String(item.id) === String(productId));
        if (product) dispatch({ type: posProductActionType.FETCH_PRODUCT, payload: product });
        return product;
    }

    try {
        const response = await apiConfig.get(apiBaseURL.PRODUCTS + '/' + productId);
        dispatch({ type: posProductActionType.FETCH_PRODUCT, payload: response.data.data });
        return response.data.data;
    } catch (error) {
        if (isNetworkError(error)) {
            const product = await cachedProduct((item) => String(item.id) === String(productId));
            if (product) dispatch({ type: posProductActionType.FETCH_PRODUCT, payload: product });
            return product;
        }
        dispatch(addToast({
            text: error?.response?.data?.message || 'No se pudo consultar el producto.',
            type: toastType.ERROR,
        }));
        return null;
    }
};

export const posSearchNameProduct = (productName) => async (dispatch) => {
    if (!navigator.onLine) {
        return cachedProduct((item) => item.attributes?.name === productName);
    }

    try {
        const response = await apiConfig.get(`products?filter[code]=${productName}`);
        dispatch({ type: posProductActionType.POS_SEARCH_NAME_PRODUCT, payload: response.data.data });
        return response.data.data;
    } catch (error) {
        if (isNetworkError(error)) {
            return cachedProduct((item) => item.attributes?.name === productName);
        }
        dispatch(addToast({
            text: error?.response?.data?.message || 'No se pudo buscar el producto.',
            type: toastType.ERROR,
        }));
        return null;
    }
};

export const posSearchCodeProduct = (productCode) => async (dispatch) => {
    if (!navigator.onLine) {
        return cachedProduct((item) => item.attributes?.code === productCode);
    }

    try {
        const response = await apiConfig.get(`products?filter[code]=${productCode}`);
        dispatch({ type: posProductActionType.POS_SEARCH_CODE_PRODUCT, payload: response.data.data });
        return response.data.data;
    } catch (error) {
        if (isNetworkError(error)) {
            return cachedProduct((item) => item.attributes?.code === productCode);
        }
        const message = error?.response?.data?.message || 'No se pudo buscar el producto.';
        dispatch(addToast({ text: message, type: toastType.ERROR }));
        return null;
    }
};
