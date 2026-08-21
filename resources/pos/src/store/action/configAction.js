import { apiBaseURL, configActionType, toastType, Tokens } from '../../constants';
import apiConfig from '../../config/apiConfig';
import { addToast } from './toastAction';
import {
    isNetworkError,
    loadCachedResource,
    saveOfflineSnapshot,
} from '../../offline/catalogStorage';

const storedPermissions = () => {
    const raw = localStorage.getItem(Tokens.GET_PERMISSIONS);
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
        return raw.split(',').map((permission) => permission.trim()).filter(Boolean);
    }
};

export const fetchConfig = (navigate) => async (dispatch) => {
    const applyConfig = (data) => {
        const permissions = data?.permissions || storedPermissions();
        dispatch({ type: configActionType.FETCH_CONFIG, payload: permissions });
        dispatch({ type: configActionType.FETCH_ALL_CONFIG, payload: data || { permissions } });
        navigate && navigate('/app/pos');
    };

    const useCachedConfig = async () => {
        const snapshot = await loadCachedResource('app-config');
        if (snapshot) {
            applyConfig(snapshot.payload);
            return snapshot;
        }

        const permissions = storedPermissions();
        if (permissions.length) applyConfig({ permissions });
        return null;
    };

    if (!navigator.onLine) return useCachedConfig();

    try {
        const response = await apiConfig.get(apiBaseURL.CONFIG);
        const data = response.data.data;
        applyConfig(data);
        await saveOfflineSnapshot('app-config', data).catch(() => null);
        return data;
    } catch (error) {
        if (isNetworkError(error)) return useCachedConfig();
        dispatch(addToast({
            text: error?.response?.data?.message || 'No se pudo cargar la configuración de la sesión.',
            type: toastType.ERROR,
        }));
        return null;
    }
};
