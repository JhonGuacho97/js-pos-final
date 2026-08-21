import apiConfig from '../../config/apiConfig';
import { apiBaseURL, frontSettingActionType, toastType } from '../../constants';
import { addToast } from './toastAction';
import {
    isNetworkError,
    loadCachedResource,
    saveOfflineSnapshot,
} from '../../offline/catalogStorage';

export const fetchFrontSetting = () => async (dispatch) => {
    const useCachedFrontSetting = async () => {
        const snapshot = await loadCachedResource('front-settings');
        if (snapshot) {
            dispatch({
                type: frontSettingActionType.FETCH_FRONT_SETTING,
                payload: snapshot.payload,
            });
        }
        return snapshot;
    };

    if (!navigator.onLine) return useCachedFrontSetting();

    try {
        const response = await apiConfig.get(apiBaseURL.FRONT_SETTING);
        const settings = response.data.data;
        dispatch({ type: frontSettingActionType.FETCH_FRONT_SETTING, payload: settings });
        await saveOfflineSnapshot('front-settings', settings).catch(() => null);
        return settings;
    } catch (error) {
        if (isNetworkError(error)) return useCachedFrontSetting();
        const message = error?.response?.data?.message || 'No se pudo cargar la configuración visual.';
        dispatch(addToast({ text: message, type: toastType.ERROR }));
        return null;
    }
};
