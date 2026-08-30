import { Tokens } from "../constants";

const DB_NAME = "ecuapos-offline";
const DB_VERSION = 5;
const SNAPSHOT_STORE = "snapshots";
const OFFLINE_SALES_STORE = "offlineSales";
const SYNC_CREDENTIAL_STORE = "syncCredentials";
const OFFLINE_CUSTOMERS_STORE = "offlineCustomers";

export const OFFLINE_CATALOG_EVENT = "ecuapos:offline-catalog-status";
export const OFFLINE_SALES_EVENT = "ecuapos:offline-sales-status";
export const OFFLINE_CUSTOMERS_EVENT = "ecuapos:offline-customers-status";

const openDatabase = () => new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
        reject(new Error("IndexedDB no está disponible en este dispositivo."));
        return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(SNAPSHOT_STORE)) {
            const store = database.createObjectStore(SNAPSHOT_STORE, { keyPath: "key" });
            store.createIndex("scope", "scope", { unique: false });
            store.createIndex("resource", "resource", { unique: false });
            store.createIndex("updatedAt", "updatedAt", { unique: false });
        }
        if (!database.objectStoreNames.contains(OFFLINE_SALES_STORE)) {
            const sales = database.createObjectStore(OFFLINE_SALES_STORE, { keyPath: "clientUuid" });
            sales.createIndex("scope", "scope", { unique: false });
            sales.createIndex("status", "status", { unique: false });
            sales.createIndex("createdAt", "createdAt", { unique: false });
            sales.createIndex("syncedAt", "syncedAt", { unique: false });
        } else {
            const sales = request.transaction.objectStore(OFFLINE_SALES_STORE);
            if (!sales.indexNames.contains("syncedAt")) {
                sales.createIndex("syncedAt", "syncedAt", { unique: false });
            }
        }
        if (!database.objectStoreNames.contains(SYNC_CREDENTIAL_STORE)) {
            database.createObjectStore(SYNC_CREDENTIAL_STORE, { keyPath: "scope" });
        }
        if (!database.objectStoreNames.contains(OFFLINE_CUSTOMERS_STORE)) {
            const customers = database.createObjectStore(OFFLINE_CUSTOMERS_STORE, { keyPath: "clientUuid" });
            customers.createIndex("scope", "scope", { unique: false });
            customers.createIndex("status", "status", { unique: false });
            customers.createIndex("createdAt", "createdAt", { unique: false });
        }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("No se pudo abrir el almacenamiento offline."));
});

const runRequest = async (mode, operation, storeName = SNAPSHOT_STORE) => {
    const database = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        const request = operation(store);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error("No se pudo acceder al catálogo local."));
        transaction.oncomplete = () => database.close();
        transaction.onerror = () => {
            database.close();
            reject(transaction.error || new Error("No se pudo guardar el catálogo local."));
        };
    });
};

const normalizeScopePart = (value, fallback) => encodeURIComponent(String(value || fallback).toLowerCase());

export const getOfflineScope = () => {
    const user = localStorage.getItem(Tokens.USER);
    const storeId = localStorage.getItem(Tokens.CURRENT_STORE_ID);

    return {
        user: normalizeScopePart(user, "anonymous"),
        storeId: normalizeScopePart(storeId, "default"),
    };
};

export const getOfflineScopeKey = () => {
    const { user, storeId } = getOfflineScope();
    return `${user}:${storeId}`;
};

const buildSnapshotKey = (resource, warehouseId = null, scopeMode = "store") => {
    const scope = getOfflineScope();
    const scopedStoreId = scopeMode === "user" ? "all-stores" : scope.storeId;
    const warehouse = warehouseId === null || warehouseId === undefined
        ? "shared"
        : normalizeScopePart(warehouseId, "default");

    return {
        key: `${scope.user}:${scopedStoreId}:${resource}:${warehouse}`,
        scope: `${scope.user}:${scopedStoreId}`,
    };
};

export const saveOfflineSnapshot = async (resource, payload, options = {}) => {
    const identity = buildSnapshotKey(resource, options.warehouseId, options.scope);
    const snapshot = {
        ...identity,
        resource,
        warehouseId: options.warehouseId ?? null,
        payload,
        version: options.version || 1,
        updatedAt: new Date().toISOString(),
        itemCount: Array.isArray(payload) ? payload.length : null,
    };

    await runRequest("readwrite", (store) => store.put(snapshot));
    return snapshot;
};

export const getOfflineSnapshot = async (resource, options = {}) => {
    const identity = buildSnapshotKey(resource, options.warehouseId, options.scope);
    const snapshot = await runRequest("readonly", (store) => store.get(identity.key));
    return snapshot || null;
};

export const getLatestCatalogSnapshot = async (warehouseId = null) => {
    if (warehouseId !== null && warehouseId !== undefined) {
        return getOfflineSnapshot("catalog", { warehouseId });
    }

    const { user, storeId } = getOfflineScope();
    const scope = `${user}:${storeId}`;
    const snapshots = await runRequest("readonly", (store) => store.getAll());

    return (snapshots || [])
        .filter((snapshot) => snapshot.scope === scope && snapshot.resource === "catalog")
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0] || null;
};

export const isNetworkError = (error) => {
    if (!error) return true;
    return !error.response || error.code === "ERR_NETWORK" || error.message === "Network Error";
};

export const filterCatalogProducts = (products, filters = {}) => {
    const brandId = filters.brandId ? String(filters.brandId) : null;
    const categoryId = filters.categoryId ? String(filters.categoryId) : null;
    const query = String(filters.query || "").trim().toLocaleLowerCase("es");

    return (products || []).filter((product) => {
        const attributes = product.attributes || {};
        if (brandId && String(attributes.brand_id) !== brandId) return false;
        if (categoryId && String(attributes.product_category_id) !== categoryId) return false;

        if (!query) return true;
        const searchable = [attributes.name, attributes.code, attributes.product_code]
            .filter(Boolean)
            .join(" ")
            .toLocaleLowerCase("es");

        return searchable.includes(query);
    });
};

export const emitOfflineCatalogStatus = (detail) => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent(OFFLINE_CATALOG_EVENT, { detail }));
};

export const createClientUuid = () => {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
        const random = Math.floor(Math.random() * 16);
        const value = character === "x" ? random : (random & 0x3) | 0x8;
        return value.toString(16);
    });
};

const emitOfflineSalesStatus = async () => {
    if (typeof window === "undefined") return;
    const sales = await getOfflineSales().catch(() => []);
    window.dispatchEvent(new CustomEvent(OFFLINE_SALES_EVENT, {
        detail: {
            pending: sales.filter((sale) => ["pending", "syncing"].includes(sale.status)).length,
            syncing: sales.filter((sale) => sale.status === "syncing").length,
            review: sales.filter((sale) => sale.status === "requires_review").length,
            synced: sales.filter((sale) => sale.status === "synced").length,
        },
    }));
};

export const enqueueOfflineSale = async (payload, receipt, sriType = "") => {
    // El UUID nace antes del primer intento de cobro y debe sobrevivir al
    // cambio online -> offline. Si el servidor guardó la venta pero su
    // respuesta se perdió, el reintento con el mismo UUID recupera esa venta
    // en vez de crear una segunda.
    const clientUuid = payload.client_uuid || createClientUuid();
    const now = new Date().toISOString();
    const offlineCreatedAt = payload.offline_created_at || now;
    const { user, storeId } = getOfflineScope();
    const sale = {
        clientUuid,
        scope: `${user}:${storeId}`,
        status: "pending",
        payload: {
            ...payload,
            client_uuid: clientUuid,
            offline_created_at: offlineCreatedAt,
            created_offline: true,
        },
        receipt,
        sriType,
        createdAt: offlineCreatedAt,
        updatedAt: now,
        attempts: 0,
        error: null,
        confirmationRequired: false,
        nextRetryAt: null,
        syncedAt: null,
        serverSaleId: null,
        leaseOwner: null,
        leaseUntil: null,
    };

    await runRequest("readwrite", (store) => store.put(sale), OFFLINE_SALES_STORE);
    await emitOfflineSalesStatus();
    return sale;
};

const emitOfflineCustomersStatus = async () => {
    if (typeof window === "undefined") return;
    const customers = await getOfflineCustomers().catch(() => []);
    window.dispatchEvent(new CustomEvent(OFFLINE_CUSTOMERS_EVENT, {
        detail: {
            pending: customers.filter((customer) => ["pending", "syncing"].includes(customer.status)).length,
            review: customers.filter((customer) => customer.status === "requires_review").length,
        },
    }));
};

const normalizeIdentity = (value) => String(value || "").trim().toLocaleLowerCase("es");

export const enqueueOfflineCustomer = async (payload) => {
    const customers = await getOfflineCustomers();
    const identification = normalizeIdentity(payload.identification);
    const email = normalizeIdentity(payload.email);
    const existing = customers.find((customer) =>
        (identification && normalizeIdentity(customer.payload?.identification) === identification)
        || (email && normalizeIdentity(customer.payload?.email) === email)
    );
    if (existing) return existing;

    const clientUuid = createClientUuid();
    const now = new Date().toISOString();
    const record = {
        clientUuid,
        scope: getOfflineScopeKey(),
        status: "pending",
        payload: {
            ...payload,
            client_uuid: clientUuid,
            es_consumidor_final: payload.tipo_identificacion === "07",
        },
        createdAt: now,
        updatedAt: now,
        syncedAt: null,
        serverCustomerId: null,
        attempts: 0,
        error: null,
        errorCode: null,
        nextRetryAt: null,
        leaseOwner: null,
        leaseUntil: null,
    };
    await runRequest("readwrite", (store) => store.put(record), OFFLINE_CUSTOMERS_STORE);
    await emitOfflineCustomersStatus();
    return record;
};

export const getOfflineCustomers = async () => {
    const scope = getOfflineScopeKey();
    const customers = await runRequest("readonly", (store) => store.getAll(), OFFLINE_CUSTOMERS_STORE);
    return (customers || [])
        .filter((customer) => customer.scope === scope)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

export const getOfflineCustomer = async (clientUuid) => (
    (await runRequest("readonly", (store) => store.get(clientUuid), OFFLINE_CUSTOMERS_STORE)) || null
);

export const updateOfflineCustomer = async (clientUuid, changes) => {
    const current = await getOfflineCustomer(clientUuid);
    if (!current) return null;
    const updated = { ...current, ...changes, updatedAt: new Date().toISOString() };
    await runRequest("readwrite", (store) => store.put(updated), OFFLINE_CUSTOMERS_STORE);
    await emitOfflineCustomersStatus();
    return updated;
};

export const claimOfflineCustomer = async (clientUuid, owner, leaseMilliseconds = 60000) => {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(OFFLINE_CUSTOMERS_STORE, "readwrite");
        const store = transaction.objectStore(OFFLINE_CUSTOMERS_STORE);
        const request = store.get(clientUuid);
        let claimed = null;
        request.onsuccess = () => {
            const customer = request.result;
            const activeLease = customer?.leaseUntil && new Date(customer.leaseUntil).getTime() > Date.now();
            if (!customer || !["pending", "syncing"].includes(customer.status) || activeLease) return;
            claimed = {
                ...customer,
                status: "syncing",
                attempts: Number(customer.attempts || 0) + 1,
                error: null,
                leaseOwner: owner,
                leaseUntil: new Date(Date.now() + leaseMilliseconds).toISOString(),
                updatedAt: new Date().toISOString(),
            };
            store.put(claimed);
        };
        transaction.oncomplete = () => {
            database.close();
            emitOfflineCustomersStatus().catch(() => null);
            resolve(claimed);
        };
        transaction.onerror = () => {
            database.close();
            reject(transaction.error || new Error("No se pudo reservar el cliente offline."));
        };
    });
};

export const offlineCustomerToResource = (customer) => ({
    id: customer.serverCustomerId || `offline:${customer.clientUuid}`,
    attributes: {
        ...customer.payload,
        offline_client_uuid: customer.clientUuid,
        offline_status: customer.status,
        offline_error: customer.error,
    },
});

export const mergeOfflineCustomers = async (serverCustomers = []) => {
    const localCustomers = await getOfflineCustomers();
    const byId = new Map((serverCustomers || []).map((customer) => [String(customer.id), customer]));
    localCustomers.forEach((customer) => {
        const resource = offlineCustomerToResource(customer);
        if (!byId.has(String(resource.id))) byId.set(String(resource.id), resource);
    });
    return [...byId.values()];
};

export const getOfflineSales = async () => {
    const { user, storeId } = getOfflineScope();
    const scope = `${user}:${storeId}`;
    const sales = await runRequest("readonly", (store) => store.getAll(), OFFLINE_SALES_STORE);
    return (sales || [])
        .filter((sale) => sale.scope === scope)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

export const getOfflineSale = async (clientUuid) => (
    (await runRequest("readonly", (store) => store.get(clientUuid), OFFLINE_SALES_STORE)) || null
);

export const updateOfflineSale = async (clientUuid, changes) => {
    const current = await runRequest("readonly", (store) => store.get(clientUuid), OFFLINE_SALES_STORE);
    if (!current) return null;
    const updated = { ...current, ...changes, updatedAt: new Date().toISOString() };
    await runRequest("readwrite", (store) => store.put(updated), OFFLINE_SALES_STORE);
    await emitOfflineSalesStatus();
    return updated;
};

export const discardOfflineSale = async (clientUuid, reason = "duplicate") => {
    const sale = (await getOfflineSales()).find((item) => item.clientUuid === clientUuid);
    if (!sale || sale.status === "synced") return null;

    const discarded = {
        ...sale,
        status: "discarded",
        discardReason: reason,
        discardedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        nextRetryAt: null,
        leaseOwner: null,
        leaseUntil: null,
    };
    await runRequest("readwrite", (store) => store.put(discarded), OFFLINE_SALES_STORE);
    await emitOfflineSalesStatus();
    return discarded;
};

export const claimOfflineSale = async (clientUuid, owner, leaseMilliseconds = 60000) => {
    const database = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(OFFLINE_SALES_STORE, "readwrite");
        const store = transaction.objectStore(OFFLINE_SALES_STORE);
        const request = store.get(clientUuid);
        let claimed = null;

        request.onsuccess = () => {
            const sale = request.result;
            const leaseIsActive = sale?.leaseUntil && new Date(sale.leaseUntil).getTime() > Date.now();
            if (!sale || sale.status === "synced" || sale.status === "requires_review" || leaseIsActive) return;

            claimed = {
                ...sale,
                status: "syncing",
                attempts: Number(sale.attempts || 0) + 1,
                error: null,
                leaseOwner: owner,
                leaseUntil: new Date(Date.now() + leaseMilliseconds).toISOString(),
                updatedAt: new Date().toISOString(),
            };
            store.put(claimed);
        };
        transaction.oncomplete = () => {
            database.close();
            emitOfflineSalesStatus().catch(() => null);
            resolve(claimed);
        };
        transaction.onerror = () => {
            database.close();
            reject(transaction.error || new Error("No se pudo reservar la venta offline."));
        };
    });
};

export const saveOfflineSyncCredential = async (credential) => {
    const record = {
        ...credential,
        scope: getOfflineScopeKey(),
        updatedAt: new Date().toISOString(),
    };
    await runRequest("readwrite", (store) => store.put(record), SYNC_CREDENTIAL_STORE);
    return record;
};

export const getOfflineSyncCredential = async () => {
    return (await runRequest(
        "readonly",
        (store) => store.get(getOfflineScopeKey()),
        SYNC_CREDENTIAL_STORE
    )) || null;
};

export const deleteOfflineSyncCredential = async () => {
    await runRequest(
        "readwrite",
        (store) => store.delete(getOfflineScopeKey()),
        SYNC_CREDENTIAL_STORE
    );
};

export const getOfflineSyncCredentialsForCurrentUser = async () => {
    const { user } = getOfflineScope();
    const credentials = await runRequest(
        "readonly",
        (store) => store.getAll(),
        SYNC_CREDENTIAL_STORE
    );
    return (credentials || []).filter((credential) => credential.scope.startsWith(`${user}:`));
};

export const deleteOfflineSyncCredentialByScope = async (scope) => {
    await runRequest(
        "readwrite",
        (store) => store.delete(scope),
        SYNC_CREDENTIAL_STORE
    );
};

export const resetOfflineAuthFailures = async () => {
    const sales = await getOfflineSales();
    const blocked = sales.filter((sale) => sale.status === "requires_review" && sale.errorCode === "AUTH");
    await Promise.all(blocked.map((sale) => updateOfflineSale(sale.clientUuid, {
        status: "pending",
        error: null,
        errorCode: null,
        nextRetryAt: null,
        leaseOwner: null,
        leaseUntil: null,
    })));
    const customers = await getOfflineCustomers();
    const blockedCustomers = customers.filter((customer) =>
        customer.status === "requires_review" && customer.errorCode === "AUTH"
    );
    await Promise.all(blockedCustomers.map((customer) => updateOfflineCustomer(customer.clientUuid, {
        status: "pending",
        error: null,
        errorCode: null,
        nextRetryAt: null,
        leaseOwner: null,
        leaseUntil: null,
    })));
};

export const resetOfflineCsrfFailures = async () => {
    const isCsrfFailure = (record) => record.status === "requires_review"
        && String(record.error || "").toLocaleLowerCase("es").includes("csrf token mismatch");
    const [sales, customers] = await Promise.all([getOfflineSales(), getOfflineCustomers()]);
    await Promise.all([
        ...sales.filter(isCsrfFailure).map((sale) => updateOfflineSale(sale.clientUuid, {
            status: "pending",
            error: null,
            errorCode: null,
            nextRetryAt: null,
            leaseOwner: null,
            leaseUntil: null,
        })),
        ...customers.filter(isCsrfFailure).map((customer) => updateOfflineCustomer(customer.clientUuid, {
            status: "pending",
            error: null,
            errorCode: null,
            nextRetryAt: null,
            leaseOwner: null,
            leaseUntil: null,
        })),
    ]);
};

export const deleteOfflineSale = async (clientUuid) => {
    await runRequest("readwrite", (store) => store.delete(clientUuid), OFFLINE_SALES_STORE);
    await emitOfflineSalesStatus();
};

export const clearSyncedOfflineSales = async () => {
    const sales = await getOfflineSales();
    const syncedSales = sales.filter((sale) => ["synced", "discarded"].includes(sale.status));
    await Promise.all(syncedSales.map((sale) =>
        runRequest("readwrite", (store) => store.delete(sale.clientUuid), OFFLINE_SALES_STORE)
    ));
    await emitOfflineSalesStatus();
};

export const pruneOfflineSalesHistory = async ({ maxItems = 100, maxAgeDays = 30 } = {}) => {
    const sales = await getOfflineSales();
    const cutoff = Date.now() - (maxAgeDays * 24 * 60 * 60 * 1000);
    const syncedSales = sales
        .filter((sale) => ["synced", "discarded"].includes(sale.status))
        .sort((a, b) => new Date(b.syncedAt || b.discardedAt || b.updatedAt) - new Date(a.syncedAt || a.discardedAt || a.updatedAt));
    const expired = syncedSales.filter((sale, index) =>
        index >= maxItems || new Date(sale.syncedAt || sale.updatedAt).getTime() < cutoff
    );

    await Promise.all(expired.map((sale) =>
        runRequest("readwrite", (store) => store.delete(sale.clientUuid), OFFLINE_SALES_STORE)
    ));
    if (expired.length) await emitOfflineSalesStatus();
};

export const reserveOfflineCatalogStock = async (warehouseId, saleItems) => {
    const snapshot = await getOfflineSnapshot("catalog", { warehouseId });
    if (!snapshot) return null;

    const quantities = new Map();
    (saleItems || []).forEach((item) => {
        const quantity = Number(item.quantity || 0) * Number(item.presentation_equivalence || 1);
        quantities.set(String(item.product_id), (quantities.get(String(item.product_id)) || 0) + quantity);
    });

    const products = (snapshot.payload || []).map((product) => {
        const reserved = quantities.get(String(product.id));
        if (!reserved) return product;
        const stock = product.attributes?.stock;
        return {
            ...product,
            attributes: {
                ...product.attributes,
                stock: stock ? { ...stock, quantity: Math.max(0, Number(stock.quantity || 0) - reserved) } : stock,
            },
        };
    });

    return saveOfflineSnapshot("catalog", products, { warehouseId });
};

const productImageUrls = (product) => {
    const images = product?.attributes?.images;
    if (!images) return [];
    if (Array.isArray(images)) return images;
    if (Array.isArray(images.imageUrls)) return images.imageUrls;
    if (typeof images === "string") return [images];
    return [];
};

export const cacheCatalogImages = async (products) => {
    if (!("serviceWorker" in navigator)) return;

    const urls = [...new Set((products || []).flatMap(productImageUrls).filter(Boolean))];
    if (!urls.length) return;

    try {
        const registration = await navigator.serviceWorker.ready;
        registration.active?.postMessage({
            type: "CACHE_CATALOG_ASSETS",
            urls,
        });
    } catch (_) {
        // La ausencia del service worker no debe impedir guardar el catálogo.
    }
};

export const loadCachedResource = async (resource, options = {}) => {
    try {
        return await getOfflineSnapshot(resource, options);
    } catch (_) {
        return null;
    }
};
