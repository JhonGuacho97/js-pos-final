import apiConfig from '../../config/apiConfig';
import { apiBaseURL, topProductsActionType, toastType } from '../../constants';
import { addToast } from './toastAction';

export const fetchTopProducts = (period, limit) => (dispatch) => {
    apiConfig.get(apiBaseURL.TOP_PRODUCTS, { params: { period, limit } })
        .then((response) => {
            dispatch({ type: topProductsActionType.TOP_PRODUCTS, payload: response.data.data });
        })
        .catch((error) => {
            const message = error?.response?.data?.message || 'Something went wrong';
            dispatch(addToast({ text: message, type: toastType.ERROR }));
        });
};
