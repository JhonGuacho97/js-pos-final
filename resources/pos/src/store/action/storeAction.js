import { apiBaseURL, storeActionType, Tokens, toastType } from '../../constants';
import apiConfig from '../../config/apiConfig';
import { addToast } from './toastAction';

/**
 * Trae las tiendas a las que el usuario autenticado tiene acceso (ver
 * StoreAPIController::misTiendas(), que incluye también las
 * desactivadas -- el selector del Header las muestra bloqueadas) y
 * resuelve cuál queda "activa", en este orden:
 *
 * 1. La guardada en localStorage, si sigue estando en la lista Y
 *    activa (el usuario la eligió antes -- máxima prioridad, incluso
 *    por sobre la predeterminada). Si se desactivó mientras tanto, se
 *    descarta y se re-evalúa como si no hubiera nada guardado.
 * 2. La marcada is_default en el catálogo de tiendas (ver pantalla
 *    Tienda > radio "Predeterminada"), si está activa -- así el
 *    primer login (o cualquiera sin preferencia guardada) arranca en
 *    algo elegido a propósito, no en la primera que devuelva la BD.
 * 3. Si hay EXACTAMENTE una tienda ACTIVA, se auto-selecciona sin
 *    pedirle nada al usuario -- mismo criterio que ya usa el
 *    middleware ResolveActiveStore en el backend cuando no llega el
 *    header X-Store-Id.
 * 4. Ninguna de las anteriores: queda sin resolver, el selector del
 *    Header se encarga de pedírsela al usuario.
 */
export const fetchMyStores = () => async (dispatch) => {
    return await apiConfig.get(apiBaseURL.MY_STORES)
        .then((response) => {
            const stores = response.data.data || [];
            dispatch({ type: storeActionType.FETCH_MY_STORES, payload: stores });

            const savedId = localStorage.getItem(Tokens.CURRENT_STORE_ID);
            const savedStore = savedId && stores.find((s) => String(s.id) === savedId);

            if (savedStore && savedStore.is_active) {
                dispatch({ type: storeActionType.SET_CURRENT_STORE_ID, payload: savedId });
                return;
            }

            const activeStores = stores.filter((s) => s.is_active);
            const defaultStore = activeStores.find((s) => s.is_default);

            if (defaultStore) {
                dispatch(setCurrentStore(defaultStore.id));
            } else if (activeStores.length === 1) {
                dispatch(setCurrentStore(activeStores[0].id));
            } else {
                localStorage.removeItem(Tokens.CURRENT_STORE_ID);
            }
        })
        .catch((response) => {
            dispatch(addToast(
                { text: response.response?.data?.message, type: toastType.ERROR }));
        });
};

/**
 * Cambiar de tienda activa recarga toda la app a propósito -- es la
 * forma más simple y segura de garantizar que ningún dato de la
 * tienda anterior (listados en Redux, formularios abiertos, etc.)
 * sobreviva al cambio de contexto.
 */
export const setCurrentStore = (storeId) => (dispatch) => {
    localStorage.setItem(Tokens.CURRENT_STORE_ID, String(storeId));
    dispatch({ type: storeActionType.SET_CURRENT_STORE_ID, payload: String(storeId) });
};
