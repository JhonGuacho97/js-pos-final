import {
    claimOfflineSale,
    getOfflineCustomer,
    getOfflineSales,
    getOfflineSyncCredential,
    isNetworkError,
    pruneOfflineSalesHistory,
    updateOfflineSale,
} from "./catalogStorage";

let activeSync = null;
const foregroundOwner = `foreground-${Math.random().toString(36).slice(2)}`;

const findConfirmedSale = async (clientUuid, credential) => {
    const response = await fetch(`/api/offline-sync/sales/${encodeURIComponent(clientUuid)}/status`, {
        method: "GET",
        credentials: "same-origin",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${credential.token}`,
            "X-Store-Id": String(credential.store_id),
        },
        cache: "no-store",
    });
    let body = {};
    try {
        body = await response.json();
    } catch (_) {
        body = {};
    }
    if (!response.ok) {
        const error = new Error(body?.message || "No se pudo confirmar el estado de la venta.");
        error.response = { status: response.status, data: body };
        throw error;
    }
    return body?.data?.exists ? body.data.sale : null;
};

export const syncOfflineSales = (callbacks = {}) => {
    if (activeSync) return activeSync;

    activeSync = (async () => {
        const credential = callbacks.credential || await getOfflineSyncCredential().catch(() => null);
        const now = Date.now();
        const sales = (await getOfflineSales()).filter((sale) => {
            if (!["pending", "syncing"].includes(sale.status)) return false;
            if (callbacks.onlyClientUuid && sale.clientUuid !== callbacks.onlyClientUuid) return false;
            if (callbacks.force || sale.status === "syncing") return true;
            return !sale.nextRetryAt || new Date(sale.nextRetryAt).getTime() <= now;
        });
        const result = { synced: 0, review: 0, remaining: sales.length, credentialMissing: false };
        if (sales.length && (!credential?.token
            || new Date(credential.expires_at).getTime() <= Date.now())) {
            result.credentialMissing = true;
            return result;
        }

        for (const queuedSale of sales) {
            if (!navigator.onLine) break;

            const offlineCustomerUuid = queuedSale.payload?.offline_customer_uuid;
            const offlineCustomer = offlineCustomerUuid
                ? await getOfflineCustomer(offlineCustomerUuid).catch(() => null)
                : null;
            if (offlineCustomer && ["pending", "syncing"].includes(offlineCustomer.status)) continue;
            if (offlineCustomer?.status === "requires_review") {
                const message = offlineCustomer.error || "El cliente de esta venta requiere revisión.";
                await updateOfflineSale(queuedSale.clientUuid, {
                    status: "requires_review",
                    error: message,
                    errorCode: offlineCustomer.errorCode || "VALIDATION",
                    nextRetryAt: null,
                    leaseOwner: null,
                    leaseUntil: null,
                });
                result.review += 1;
                result.remaining -= 1;
                await callbacks.onReview?.(queuedSale, message);
                continue;
            }

            const claimedSale = await claimOfflineSale(queuedSale.clientUuid, foregroundOwner);
            if (!claimedSale) continue;

            try {
                const payload = {
                    ...claimedSale.payload,
                    requested_electronic_document:
                        claimedSale.payload.requested_electronic_document || claimedSale.sriType || null,
                };
                if (offlineCustomer?.serverCustomerId) {
                    payload.customer_id = offlineCustomer.serverCustomerId;
                    delete payload.offline_customer_uuid;
                }
                // Después de una respuesta perdida no reenviamos a ciegas.
                // Primero preguntamos si el UUID ya fue confirmado.
                let createdSale = claimedSale.confirmationRequired
                    ? await findConfirmedSale(claimedSale.clientUuid, credential)
                    : null;
                if (!createdSale) {
                    const response = await fetch("/api/offline-sync/sales", {
                        method: "POST",
                        credentials: "same-origin",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${credential.token}`,
                            "X-Store-Id": String(credential.store_id),
                        },
                        body: JSON.stringify(payload),
                    });
                    let responseBody = null;
                    try {
                        responseBody = await response.json();
                    } catch (_) {
                        responseBody = {};
                    }
                    if (!response.ok) {
                        const requestError = new Error(responseBody?.message || "La venta requiere revisión manual.");
                        requestError.response = { status: response.status, data: responseBody };
                        throw requestError;
                    }
                    createdSale = responseBody?.data;
                }
                await updateOfflineSale(claimedSale.clientUuid, {
                    status: "synced",
                    syncedAt: new Date().toISOString(),
                    serverSaleId: createdSale?.id || null,
                    serverReference: createdSale?.attributes?.reference_code || null,
                    serverSale: createdSale || null,
                    electronicInvoiceQueued: Boolean(payload.requested_electronic_document),
                    error: null,
                    errorCode: null,
                    diagnosis: null,
                    confirmationRequired: false,
                    nextRetryAt: null,
                    leaseOwner: null,
                    leaseUntil: null,
                });
                result.synced += 1;
                result.remaining -= 1;
                try {
                    await callbacks.onSynced?.(createdSale, claimedSale);
                } catch (callbackError) {
                    await updateOfflineSale(claimedSale.clientUuid, {
                        postSyncError: callbackError?.message || "La venta se sincronizó, pero quedó una acción posterior pendiente.",
                    });
                    await callbacks.onPostSyncError?.(createdSale, claimedSale, callbackError);
                }
            } catch (error) {
                const responseStatus = error?.response?.status;
                const temporaryFailure = isNetworkError(error) || responseStatus === 429 || responseStatus >= 500;
                if (temporaryFailure) {
                    const attempts = Number(claimedSale.attempts || 1);
                    const retryDelay = Math.min(5 * 60 * 1000, 5000 * (2 ** Math.min(attempts - 1, 6)));
                    await updateOfflineSale(claimedSale.clientUuid, {
                        status: "pending",
                        error: "No se pudo conectar con el servidor. EcuaPos volverá a intentarlo automáticamente.",
                        errorCode: "NETWORK",
                        confirmationRequired: true,
                        nextRetryAt: new Date(Date.now() + retryDelay).toISOString(),
                        leaseOwner: null,
                        leaseUntil: null,
                    });
                    break;
                }

                const message = error?.response?.data?.message || "La venta requiere revisión manual.";
                await updateOfflineSale(claimedSale.clientUuid, {
                    status: "requires_review",
                    error: message,
                    errorCode: responseStatus === 401
                        ? "AUTH"
                        : error?.response?.data?.error_code || "VALIDATION",
                    diagnosis: error?.response?.data?.diagnosis || null,
                    confirmationRequired: false,
                    nextRetryAt: null,
                    leaseOwner: null,
                    leaseUntil: null,
                });
                result.review += 1;
                result.remaining -= 1;
                await callbacks.onReview?.(claimedSale, message);
            }
        }

        await pruneOfflineSalesHistory().catch(() => null);

        return result;
    })().finally(() => {
        activeSync = null;
    });

    return activeSync;
};

export const diagnoseOfflineSale = async (sale, options = {}) => {
    const credential = options.credential || await getOfflineSyncCredential().catch(() => null);
    if (!credential?.token || new Date(credential.expires_at).getTime() <= Date.now()) {
        throw new Error("No existe una credencial vigente para verificar esta venta.");
    }

    const response = await fetch("/api/offline-sync/sales/diagnose", {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${credential.token}`,
            "X-Store-Id": String(credential.store_id),
        },
        body: JSON.stringify({
            warehouse_id: sale.payload?.warehouse_id,
            sale_items: sale.payload?.sale_items || [],
        }),
    });

    let body = {};
    try {
        body = await response.json();
    } catch (_) {
        body = {};
    }
    if (!response.ok) {
        throw new Error(body?.message || "No se pudo verificar el inventario de esta venta.");
    }

    const diagnosis = body?.data || null;
    await updateOfflineSale(sale.clientUuid, {
        diagnosis,
        diagnosedAt: diagnosis?.checked_at || new Date().toISOString(),
    });

    return diagnosis;
};
