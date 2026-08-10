import apiConfig from "../../config/apiConfig";
import { apiBaseURL, storesActionType, toastType } from "../../constants";
import { addToast } from "./toastAction";
import {
    addInToTotalRecord,
    setTotalRecord,
    removeFromTotalRecord,
} from "./totalRecordAction";
import requestParam from "../../shared/requestParam";
import { setLoading } from "./loadingAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { fetchMyStores } from "./storeAction";

export const fetchStores =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url = apiBaseURL.STORES;
        if (
            !_.isEmpty(filter) &&
            (filter.page || filter.pageSize || filter.search || filter.order_By)
        ) {
            url += requestParam(filter, null, null, null, url);
        }
        apiConfig
            .get(url)
            .then((response) => {
                dispatch({
                    type: storesActionType.FETCH_STORES,
                    payload: response.data.data,
                });
                dispatch(setTotalRecord(response.data.meta.total));
            })
            .catch(({ response }) => {
                dispatch(
                    addToast({ text: response.data.message, type: toastType.ERROR })
                );
            })
            .finally(() => {
                if (isLoading) {
                    dispatch(setLoading(false));
                }
            });
    };

export const addStore = (store) => async (dispatch) => {
    await apiConfig
        .post(apiBaseURL.STORES, store)
        .then((response) => {
            dispatch({
                type: storesActionType.ADD_STORE,
                payload: response.data.data,
            });
            dispatch(addToast({ text: getFormattedMessage("store.success.create.message") }));
            dispatch(addInToTotalRecord(1));
            // La tienda nueva tiene que aparecer también en el selector
            // del Header si el usuario ya tiene acceso a ella.
            dispatch(fetchMyStores());
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const editStore = (storeId, store, handleClose) => async (dispatch) => {
    apiConfig
        .put(apiBaseURL.STORES + "/" + storeId, store)
        .then((response) => {
            dispatch({
                type: storesActionType.EDIT_STORE,
                payload: response.data.data,
            });
            handleClose && handleClose(false);
            dispatch(addToast({ text: getFormattedMessage("store.success.edit.message") }));
            dispatch(fetchMyStores());
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const toggleStoreStatus = (store) => async (dispatch) => {
    apiConfig
        .put(apiBaseURL.STORES + "/" + store.id, { name: store.name, is_active: !store.is_active })
        .then((response) => {
            dispatch({
                type: storesActionType.EDIT_STORE,
                payload: response.data.data,
            });
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

// "Predeterminada" es la que se auto-selecciona al iniciar sesión con
// 2+ tiendas y sin ninguna guardada todavía (ver
// storeAction.js::fetchMyStores()). Es un singleton -- el backend
// desmarca a las demás en la misma operación (ver
// StoreAPIController::update()).
export const setDefaultStore = (store) => async (dispatch) => {
    apiConfig
        .put(apiBaseURL.STORES + "/" + store.id, {
            name: store.name,
            is_active: store.is_active,
            is_default: true,
        })
        .then(() => {
            dispatch(fetchStores());
            dispatch(fetchMyStores());
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const deleteStore = (storeId) => async (dispatch) => {
    apiConfig
        .delete(apiBaseURL.STORES + "/" + storeId)
        .then(() => {
            dispatch(removeFromTotalRecord(1));
            dispatch({
                type: storesActionType.DELETE_STORE,
                payload: storeId,
            });
            dispatch(addToast({ text: getFormattedMessage("store.success.delete.message") }));
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};
