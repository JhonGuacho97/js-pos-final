import apiConfig from '../../config/apiConfig';
import { apiBaseURL, todayOverviewActionType, toastType } from '../../constants';
import { addToast } from './toastAction';

export const fetchTodayOverview = () => (dispatch) => {
    apiConfig.get(apiBaseURL.TODAY_OVERVIEW)
        .then((response) => {
            dispatch({ type: todayOverviewActionType.TODAY_OVERVIEW, payload: response.data.data });
        })
        .catch((error) => {
            const message = error?.response?.data?.message || 'Something went wrong';
            dispatch(addToast({ text: message, type: toastType.ERROR }));
        });
};
