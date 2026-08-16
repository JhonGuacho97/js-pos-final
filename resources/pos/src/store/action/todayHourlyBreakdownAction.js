import apiConfig from '../../config/apiConfig';
import { apiBaseURL, todayHourlyBreakdownActionType, toastType } from '../../constants';
import { addToast } from './toastAction';

export const fetchTodayHourlyBreakdown = (params) => (dispatch) => {
    apiConfig.get(apiBaseURL.TODAY_HOURLY_BREAKDOWN, { params })
        .then((response) => {
            dispatch({ type: todayHourlyBreakdownActionType.TODAY_HOURLY_BREAKDOWN, payload: response.data.data });
        })
        .catch((error) => {
            const message = error?.response?.data?.message || 'Something went wrong';
            dispatch(addToast({ text: message, type: toastType.ERROR }));
        });
};
