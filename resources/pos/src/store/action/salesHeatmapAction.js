import apiConfig from '../../config/apiConfig';
import { apiBaseURL, salesHeatmapActionType, toastType } from '../../constants';
import { addToast } from './toastAction';

export const fetchSalesHeatmap = () => (dispatch) => {
    apiConfig.get(apiBaseURL.SALES_HEATMAP)
        .then((response) => {
            dispatch({ type: salesHeatmapActionType.SALES_HEATMAP, payload: response.data.data });
        })
        .catch((error) => {
            const message = error?.response?.data?.message || 'Something went wrong';
            dispatch(addToast({ text: message, type: toastType.ERROR }));
        });
};
