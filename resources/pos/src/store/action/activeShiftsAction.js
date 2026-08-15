import apiConfig from '../../config/apiConfig';
import { apiBaseURL, activeShiftsActionType, toastType } from '../../constants';
import { addToast } from './toastAction';

export const fetchActiveShifts = () => (dispatch) => {
    apiConfig.get(apiBaseURL.ACTIVE_SHIFTS)
        .then((response) => {
            dispatch({ type: activeShiftsActionType.ACTIVE_SHIFTS, payload: response.data.data });
        })
        .catch((error) => {
            const message = error?.response?.data?.message || 'Something went wrong';
            dispatch(addToast({ text: message, type: toastType.ERROR }));
        });
};
