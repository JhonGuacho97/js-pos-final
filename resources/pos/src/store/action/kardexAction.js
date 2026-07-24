import { apiBaseURL } from "../../constants";
import apiConfig from "../../config/apiConfig";
import { setLoading } from "./loadingAction";
import { addToast } from "./toastAction";
import { toastType } from "../../constants";

export const kardexActionType = {
    FETCH_KARDEX: "FETCH_KARDEX",
    CLEAR_KARDEX: "CLEAR_KARDEX",
};

export const fetchKardex = (filters) => async (dispatch) => {
    dispatch(setLoading(true));
    const params = new URLSearchParams(filters).toString();
    apiConfig
        .get(`${apiBaseURL.KARDEX}?${params}`)
        .then((response) => {
            dispatch({ type: kardexActionType.FETCH_KARDEX, payload: response.data.data });
            dispatch(setLoading(false));
        })
        .catch(({ response }) => {
            dispatch(setLoading(false));
            const message =
                response?.data?.message || "No se pudo cargar el kardex.";
            dispatch(addToast({ text: message, type: toastType.ERROR }));
        });
};

export const clearKardex = () => (dispatch) => {
    dispatch({ type: kardexActionType.CLEAR_KARDEX });
};
