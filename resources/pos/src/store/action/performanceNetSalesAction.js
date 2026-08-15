import apiConfig from '../../config/apiConfig';
import { apiBaseURL, performanceNetSalesActionType, toastType } from '../../constants';
import { addToast } from './toastAction';

export const fetchPerformanceNetSales = (period) => (dispatch) => {
    apiConfig.get(apiBaseURL.PERFORMANCE_NET_SALES, { params: { period } })
        .then((response) => {
            dispatch({ type: performanceNetSalesActionType.PERFORMANCE_NET_SALES, payload: response.data.data });
        })
        .catch((error) => {
            const message = error?.response?.data?.message || 'Something went wrong';
            dispatch(addToast({ text: message, type: toastType.ERROR }));
        });
};
