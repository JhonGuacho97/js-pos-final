import {
    claimOfflineCustomer,
    getOfflineCustomers,
    getOfflineSyncCredential,
    updateOfflineCustomer,
} from "./catalogStorage";

let activeSync = null;
const foregroundOwner = `customer-foreground-${Math.random().toString(36).slice(2)}`;

const parseResponseMessage = async (response) => {
    try {
        const body = await response.clone().json();
        const firstError = Object.values(body?.errors || {}).flat()[0];
        return firstError || body?.message || "El cliente requiere revisión.";
    } catch (_) {
        return "El cliente requiere revisión.";
    }
};

export const syncOfflineCustomers = (options = {}) => {
    if (activeSync) return activeSync;

    activeSync = (async () => {
        const credential = options.credential || await getOfflineSyncCredential().catch(() => null);
        const now = Date.now();
        const customers = (await getOfflineCustomers()).filter((customer) => {
            if (!["pending", "syncing"].includes(customer.status)) return false;
            if (options.force || customer.status === "syncing") return true;
            return !customer.nextRetryAt || new Date(customer.nextRetryAt).getTime() <= now;
        });
        const result = { synced: 0, review: 0, remaining: customers.length, credentialMissing: false };

        if (!customers.length) return result;
        if (!credential?.token || Number(credential.version || 0) < 2
            || new Date(credential.expires_at).getTime() <= Date.now()) {
            result.credentialMissing = true;
            return result;
        }

        for (const queuedCustomer of customers) {
            if (!navigator.onLine) break;
            const claimed = await claimOfflineCustomer(queuedCustomer.clientUuid, foregroundOwner);
            if (!claimed) continue;

            try {
                const response = await fetch("/api/offline-sync/customers", {
                    method: "POST",
                    credentials: "same-origin",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${credential.token}`,
                        "X-Store-Id": String(credential.store_id),
                    },
                    body: JSON.stringify(claimed.payload),
                });

                if (response.ok) {
                    const body = await response.json();
                    await updateOfflineCustomer(claimed.clientUuid, {
                        status: "synced",
                        syncedAt: new Date().toISOString(),
                        serverCustomerId: body?.data?.id || null,
                        error: null,
                        errorCode: null,
                        nextRetryAt: null,
                        leaseOwner: null,
                        leaseUntil: null,
                    });
                    result.synced += 1;
                    result.remaining -= 1;
                    await options.onSynced?.(body?.data, claimed);
                    continue;
                }

                if (response.status === 429 || response.status >= 500) {
                    throw new Error("temporary-server-error");
                }

                const message = await parseResponseMessage(response);
                await updateOfflineCustomer(claimed.clientUuid, {
                    status: "requires_review",
                    error: message,
                    errorCode: [401, 403].includes(response.status) ? "AUTH" : "VALIDATION",
                    nextRetryAt: null,
                    leaseOwner: null,
                    leaseUntil: null,
                });
                result.review += 1;
                result.remaining -= 1;
                await options.onReview?.(claimed, message);
            } catch (error) {
                const attempts = Number(claimed.attempts || 1);
                const retryDelay = Math.min(5 * 60 * 1000, 5000 * (2 ** Math.min(attempts - 1, 6)));
                await updateOfflineCustomer(claimed.clientUuid, {
                    status: "pending",
                    error: "No se pudo conectar con el servidor. EcuaPos volverá a intentarlo automáticamente.",
                    errorCode: "NETWORK",
                    nextRetryAt: new Date(Date.now() + retryDelay).toISOString(),
                    leaseOwner: null,
                    leaseUntil: null,
                });
                break;
            }
        }

        return result;
    })().finally(() => {
        activeSync = null;
    });

    return activeSync;
};
