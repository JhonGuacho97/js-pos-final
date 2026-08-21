import apiConfig from "../config/apiConfig";
import {
    deleteOfflineSyncCredentialByScope,
    getOfflineSyncCredential,
    getOfflineSyncCredentialsForCurrentUser,
    resetOfflineAuthFailures,
    saveOfflineSyncCredential,
} from "./catalogStorage";

const DEVICE_ID_KEY = "ecuapos_offline_device_id";
export const OFFLINE_SALES_SYNC_TAG = "ecuapos-offline-sales";

const createUuid = () => {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
        const random = Math.floor(Math.random() * 16);
        const value = character === "x" ? random : (random & 0x3) | 0x8;
        return value.toString(16);
    });
};

export const getOfflineDeviceId = () => {
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
        deviceId = createUuid();
        localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
};

export const ensureOfflineSyncCredential = async () => {
    if (!navigator.onLine || !localStorage.getItem("current_store_id")) return null;

    const current = await getOfflineSyncCredential().catch(() => null);
    const renewBefore = Date.now() + (7 * 24 * 60 * 60 * 1000);
    if (current?.token && Number(current.version || 0) >= 2
        && new Date(current.expires_at).getTime() > renewBefore) return current;

    const response = await apiConfig.post("offline-sync/device-token", {
        device_id: getOfflineDeviceId(),
        device_name: navigator.userAgentData?.platform || navigator.platform || "EcuaPos PWA",
    });
    const credential = await saveOfflineSyncCredential(response.data.data);
    await resetOfflineAuthFailures();
    return credential;
};

export const revokeOfflineSyncCredential = async () => {
    const credentials = await getOfflineSyncCredentialsForCurrentUser().catch(() => []);
    for (const credential of credentials) {
        if (credential?.device_id && navigator.onLine) {
            await apiConfig.delete("offline-sync/device-token", {
                data: { device_id: credential.device_id },
                headers: { "X-Store-Id": String(credential.store_id) },
            }).catch(() => null);
        }
        await deleteOfflineSyncCredentialByScope(credential.scope).catch(() => null);
    }
};

export const requestOfflineSaleBackgroundSync = async () => {
    if (!("serviceWorker" in navigator)) return false;

    const registration = await navigator.serviceWorker.ready;
    if (registration.sync?.register) {
        await registration.sync.register(OFFLINE_SALES_SYNC_TAG);
        return true;
    }

    registration.active?.postMessage({ type: "SYNC_OFFLINE_SALES" });
    return false;
};

export const supportsOfflineBackgroundSync = () => (
    "serviceWorker" in navigator && "SyncManager" in window
);
