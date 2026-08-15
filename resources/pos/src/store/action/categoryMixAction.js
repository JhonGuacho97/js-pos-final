import apiConfig from '../../config/apiConfig';
import { apiBaseURL, categoryMixActionType, toastType } from '../../constants';
import { addToast } from './toastAction';

export const fetchCategoryMix = (period) => (dispatch) => {
    apiConfig.get(apiBaseURL.CATEGORY_MIX, { params: { period } })
        .then((response) => {
            dispatch({ type: categoryMixActionType.CATEGORY_MIX, payload: response.data.data });
        })
        .catch((error) => {
            const message = error?.response?.data?.message || 'Something went wrong';
            dispatch(addToast({ text: message, type: toastType.ERROR }));
        });
};
