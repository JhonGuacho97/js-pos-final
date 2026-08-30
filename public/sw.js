// EcuaPos — Service Worker
// Fase 1 offline: conserva el shell y los recursos visuales del catálogo.
// Las respuestas de /api/* siguen sin cachearse; los datos de productos,
// precios y stock se guardan de forma explícita en IndexedDB desde la app.

const CACHE_NAME = "ecuapos-v7";
const CATALOG_ASSET_CACHE = "ecuapos-catalog-assets-v1";
const OFFLINE_DB_NAME = "ecuapos-offline";
const OFFLINE_DB_VERSION = 5;
const OFFLINE_SALES_STORE = "offlineSales";
const SYNC_CREDENTIAL_STORE = "syncCredentials";
const OFFLINE_CUSTOMERS_STORE = "offlineCustomers";
const OFFLINE_SALES_SYNC_TAG = "ecuapos-offline-sales";

// Solo cacheamos el shell estático de la app (HTML, JS, CSS)
// para que el ícono y la pantalla de carga aparezcan rápido.
const STATIC_ASSETS = [
    "/",
    "/js/app.js",
    "/manifest.json",
    "/offline.html",
    "/images/pwa/ecuapos-favicon.png",
    "/images/pwa/ecuapos-192.png",
    "/images/pwa/ecuapos-512.png",
    "/images/pwa/ecuapos-apple-touch.png",
];

// ─── Install ──────────────────────────────────────────────────────────────────
// Se dispara una sola vez cuando el SW se registra por primera vez.
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Pre-cachear solo los assets estáticos del shell
            return cache.addAll(STATIC_ASSETS).catch(() => {
                // Si algún asset falla no bloqueamos la instalación
            });
        })
    );
    // Activar inmediatamente sin esperar a que se cierren tabs viejas
    self.skipWaiting();
});

// ─── Activate ─────────────────────────────────────────────────────────────────
// Limpia caches viejos cuando se actualiza el SW.
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key.startsWith("ecuapos-")
                        && ![CACHE_NAME, CATALOG_ASSET_CACHE].includes(key))
                    .map((key) => caches.delete(key))
            )
        )
    );
    // Tomar control de todas las tabs abiertas inmediatamente
    self.clients.claim();
});

// La aplicación envía las imágenes observadas al terminar una
// sincronización del catálogo. Se guardan una por una para que una imagen
// rota no invalide toda la descarga offline.
self.addEventListener("message", (event) => {
    if (event.data?.type === "SYNC_OFFLINE_SALES") {
        event.waitUntil(syncOfflineSalesInBackground());
        return;
    }

    if (event.data?.type !== "CACHE_CATALOG_ASSETS" || !Array.isArray(event.data.urls)) return;

    event.waitUntil((async () => {
        const cache = await caches.open(CATALOG_ASSET_CACHE);
        const uniqueUrls = [...new Set(event.data.urls)].slice(0, 1000);

        await Promise.allSettled(uniqueUrls.map(async (candidate) => {
            const url = new URL(candidate, self.location.origin);
            if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

            const request = new Request(url.href, { credentials: "same-origin" });
            const response = await fetch(request);
            if (response.ok) await cache.put(request, response);
        }));
    })());
});

self.addEventListener("sync", (event) => {
    if (event.tag === OFFLINE_SALES_SYNC_TAG) {
        event.waitUntil(syncOfflineSalesInBackground());
    }
});

const openOfflineDatabase = () => new Promise((resolve, reject) => {
    const request = indexedDB.open(OFFLINE_DB_NAME, OFFLINE_DB_VERSION);
    request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains("snapshots")) {
            const snapshots = database.createObjectStore("snapshots", { keyPath: "key" });
            snapshots.createIndex("scope", "scope", { unique: false });
            snapshots.createIndex("resource", "resource", { unique: false });
            snapshots.createIndex("updatedAt", "updatedAt", { unique: false });
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
    request.onerror = () => reject(request.error);
});

const getAllOfflineRecords = async (storeName) => {
    const database = await openOfflineDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, "readonly");
        const request = transaction.objectStore(storeName).getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
        transaction.oncomplete = () => database.close();
    });
};

const updateOfflineSaleRecord = async (clientUuid, changes) => {
    const database = await openOfflineDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(OFFLINE_SALES_STORE, "readwrite");
        const store = transaction.objectStore(OFFLINE_SALES_STORE);
        const request = store.get(clientUuid);
        request.onsuccess = () => {
            if (!request.result) return;
            store.put({
                ...request.result,
                ...changes,
                updatedAt: new Date().toISOString(),
            });
        };
        transaction.oncomplete = () => {
            database.close();
            resolve();
        };
        transaction.onerror = () => {
            database.close();
            reject(transaction.error);
        };
    });
};

const claimOfflineSaleRecord = async (clientUuid) => {
    const database = await openOfflineDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(OFFLINE_SALES_STORE, "readwrite");
        const store = transaction.objectStore(OFFLINE_SALES_STORE);
        const request = store.get(clientUuid);
        let claimed = null;
        request.onsuccess = () => {
            const sale = request.result;
            const activeLease = sale?.leaseUntil && new Date(sale.leaseUntil).getTime() > Date.now();
            if (!sale || !["pending", "syncing"].includes(sale.status) || activeLease) return;
            claimed = {
                ...sale,
                status: "syncing",
                attempts: Number(sale.attempts || 0) + 1,
                error: null,
                leaseOwner: "service-worker",
                leaseUntil: new Date(Date.now() + 60000).toISOString(),
                updatedAt: new Date().toISOString(),
            };
            store.put(claimed);
        };
        transaction.oncomplete = () => {
            database.close();
            resolve(claimed);
        };
        transaction.onerror = () => {
            database.close();
            reject(transaction.error);
        };
    });
};

const claimOfflineCustomerRecord = async (clientUuid) => {
    const database = await openOfflineDatabase();
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
                leaseOwner: "service-worker",
                leaseUntil: new Date(Date.now() + 60000).toISOString(),
                updatedAt: new Date().toISOString(),
            };
            store.put(claimed);
        };
        transaction.oncomplete = () => {
            database.close();
            resolve(claimed);
        };
        transaction.onerror = () => {
            database.close();
            reject(transaction.error);
        };
    });
};

const notifyOfflineSalesChanged = async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    windows.forEach((client) => client.postMessage({ type: "OFFLINE_SALES_STATUS_CHANGED" }));
};

const notifyOfflineCustomersChanged = async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    windows.forEach((client) => client.postMessage({ type: "OFFLINE_CUSTOMERS_STATUS_CHANGED" }));
};

const markSalesForCustomerReview = async (customerUuid, message, errorCode) => {
    const sales = await getAllOfflineRecords(OFFLINE_SALES_STORE);
    const dependent = sales.filter((sale) =>
        sale.payload?.offline_customer_uuid === customerUuid
        && ["pending", "syncing"].includes(sale.status)
    );
    await Promise.all(dependent.map((sale) => updateOfflineSaleRecord(sale.clientUuid, {
        status: "requires_review",
        error: message,
        errorCode,
        nextRetryAt: null,
        leaseOwner: null,
        leaseUntil: null,
    })));
};

const responseMessage = async (response) => {
    try {
        const body = await response.clone().json();
        const firstValidationError = Object.values(body?.errors || {}).flat()[0];
        return firstValidationError || body?.message || "El registro requiere revisión manual.";
    } catch (_) {
        return "El registro requiere revisión manual.";
    }
};

const syncOfflineCustomersInBackground = async (credentialsByScope) => {
    const customers = await getAllOfflineRecords(OFFLINE_CUSTOMERS_STORE);
    let temporaryFailure = false;

    for (const candidate of customers) {
        if (!["pending", "syncing"].includes(candidate.status)) continue;
        if (candidate.nextRetryAt && new Date(candidate.nextRetryAt).getTime() > Date.now()) continue;
        const credential = credentialsByScope.get(candidate.scope);

        if (!credential?.token || Number(credential.version || 0) < 2
            || new Date(credential.expires_at).getTime() <= Date.now()) {
            const message = "Abre EcuaPos con conexión para renovar la sincronización segura de este dispositivo.";
            const database = await openOfflineDatabase();
            await new Promise((resolve, reject) => {
                const transaction = database.transaction(OFFLINE_CUSTOMERS_STORE, "readwrite");
                const store = transaction.objectStore(OFFLINE_CUSTOMERS_STORE);
                const request = store.get(candidate.clientUuid);
                request.onsuccess = () => request.result && store.put({
                    ...request.result,
                    status: "requires_review",
                    error: message,
                    errorCode: "AUTH",
                    leaseOwner: null,
                    leaseUntil: null,
                    updatedAt: new Date().toISOString(),
                });
                transaction.oncomplete = () => { database.close(); resolve(); };
                transaction.onerror = () => { database.close(); reject(transaction.error); };
            });
            await markSalesForCustomerReview(candidate.clientUuid, message, "AUTH");
            continue;
        }

        const customer = await claimOfflineCustomerRecord(candidate.clientUuid);
        if (!customer) continue;

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
                body: JSON.stringify(customer.payload),
            });
            if (response.ok) {
                const body = await response.json();
                const createdCustomer = body?.data;
                const database = await openOfflineDatabase();
                await new Promise((resolve, reject) => {
                    const transaction = database.transaction(OFFLINE_CUSTOMERS_STORE, "readwrite");
                    const store = transaction.objectStore(OFFLINE_CUSTOMERS_STORE);
                    const request = store.get(customer.clientUuid);
                    request.onsuccess = () => request.result && store.put({
                        ...request.result,
                        status: "synced",
                        syncedAt: new Date().toISOString(),
                        serverCustomerId: createdCustomer?.id || null,
                        error: null,
                        errorCode: null,
                        nextRetryAt: null,
                        leaseOwner: null,
                        leaseUntil: null,
                        updatedAt: new Date().toISOString(),
                    });
                    transaction.oncomplete = () => { database.close(); resolve(); };
                    transaction.onerror = () => { database.close(); reject(transaction.error); };
                });
                continue;
            }

            if (response.status === 401 || response.status === 403) {
                const message = "La credencial de sincronización venció. Abre EcuaPos con conexión para renovarla.";
                throw Object.assign(new Error(message), { permanent: true, errorCode: "AUTH" });
            }
            if (response.status === 429 || response.status >= 500) throw new Error("temporary-server-error");
            throw Object.assign(new Error(await responseMessage(response)), { permanent: true, errorCode: "VALIDATION" });
        } catch (error) {
            if (error.permanent) {
                const database = await openOfflineDatabase();
                await new Promise((resolve, reject) => {
                    const transaction = database.transaction(OFFLINE_CUSTOMERS_STORE, "readwrite");
                    const store = transaction.objectStore(OFFLINE_CUSTOMERS_STORE);
                    const request = store.get(customer.clientUuid);
                    request.onsuccess = () => request.result && store.put({
                        ...request.result,
                        status: "requires_review",
                        error: error.message,
                        errorCode: error.errorCode,
                        nextRetryAt: null,
                        leaseOwner: null,
                        leaseUntil: null,
                        updatedAt: new Date().toISOString(),
                    });
                    transaction.oncomplete = () => { database.close(); resolve(); };
                    transaction.onerror = () => { database.close(); reject(transaction.error); };
                });
                await markSalesForCustomerReview(customer.clientUuid, error.message, error.errorCode);
                continue;
            }

            const attempts = Number(customer.attempts || 1);
            const retryDelay = Math.min(5 * 60 * 1000, 5000 * (2 ** Math.min(attempts - 1, 6)));
            const database = await openOfflineDatabase();
            await new Promise((resolve, reject) => {
                const transaction = database.transaction(OFFLINE_CUSTOMERS_STORE, "readwrite");
                const store = transaction.objectStore(OFFLINE_CUSTOMERS_STORE);
                const request = store.get(customer.clientUuid);
                request.onsuccess = () => request.result && store.put({
                    ...request.result,
                    status: "pending",
                    error: "No se pudo sincronizar el cliente. EcuaPos volverá a intentarlo automáticamente.",
                    errorCode: "NETWORK",
                    nextRetryAt: new Date(Date.now() + retryDelay).toISOString(),
                    leaseOwner: null,
                    leaseUntil: null,
                    updatedAt: new Date().toISOString(),
                });
                transaction.oncomplete = () => { database.close(); resolve(); };
                transaction.onerror = () => { database.close(); reject(transaction.error); };
            });
            temporaryFailure = true;
            break;
        }
    }

    await notifyOfflineCustomersChanged();
    return temporaryFailure;
};

const syncOfflineSalesInBackground = async () => {
    const [sales, credentials] = await Promise.all([
        getAllOfflineRecords(OFFLINE_SALES_STORE),
        getAllOfflineRecords(SYNC_CREDENTIAL_STORE),
    ]);
    const credentialsByScope = new Map(credentials.map((credential) => [credential.scope, credential]));
    let temporaryFailure = false;

    if (await syncOfflineCustomersInBackground(credentialsByScope)) {
        await notifyOfflineSalesChanged();
        throw new Error("offline-customers-sync-retry");
    }
    const customerStates = new Map(
        (await getAllOfflineRecords(OFFLINE_CUSTOMERS_STORE))
            .map((customer) => [customer.clientUuid, customer])
    );

    for (const candidate of sales) {
        if (!["pending", "syncing"].includes(candidate.status)) continue;
        if (candidate.nextRetryAt && new Date(candidate.nextRetryAt).getTime() > Date.now()) continue;
        const customerUuid = candidate.payload?.offline_customer_uuid;
        const customerState = customerUuid ? customerStates.get(customerUuid) : null;
        if (customerState && ["pending", "syncing"].includes(customerState.status)) continue;
        if (customerState?.status === "requires_review") {
            await updateOfflineSaleRecord(candidate.clientUuid, {
                status: "requires_review",
                error: customerState.error || "El cliente de esta venta requiere revisión.",
                errorCode: customerState.errorCode || "VALIDATION",
                nextRetryAt: null,
                leaseOwner: null,
                leaseUntil: null,
            });
            continue;
        }

        const credential = credentialsByScope.get(candidate.scope);
        if (!credential?.token || new Date(credential.expires_at).getTime() <= Date.now()) {
            await updateOfflineSaleRecord(candidate.clientUuid, {
                status: "requires_review",
                error: "Abre EcuaPos con conexión para renovar la sincronización segura de este dispositivo.",
                errorCode: "AUTH",
                leaseOwner: null,
                leaseUntil: null,
            });
            continue;
        }

        const sale = await claimOfflineSaleRecord(candidate.clientUuid);
        if (!sale) continue;

        try {
            const payload = {
                ...sale.payload,
                requested_electronic_document:
                    sale.payload.requested_electronic_document || sale.sriType || null,
            };
            let createdSale = null;

            // Si el intento anterior terminó sin respuesta, primero
            // reconciliamos por UUID. Nunca reenviamos una venta ambigua a
            // ciegas porque el servidor pudo haberla confirmado ya.
            if (sale.confirmationRequired) {
                const statusResponse = await fetch(
                    `/api/offline-sync/sales/${encodeURIComponent(sale.clientUuid)}/status`,
                    {
                        method: "GET",
                        credentials: "same-origin",
                        headers: {
                            "Accept": "application/json",
                            "Authorization": `Bearer ${credential.token}`,
                            "X-Store-Id": String(credential.store_id),
                        },
                        cache: "no-store",
                    }
                );
                if (statusResponse.status === 401 || statusResponse.status === 403) {
                    await updateOfflineSaleRecord(sale.clientUuid, {
                        status: "requires_review",
                        error: "La credencial de sincronización venció. Abre EcuaPos con conexión para renovarla.",
                        errorCode: "AUTH",
                        leaseOwner: null,
                        leaseUntil: null,
                    });
                    continue;
                }
                if (statusResponse.status === 429 || statusResponse.status >= 500) {
                    throw new Error("temporary-server-error");
                }
                if (!statusResponse.ok) {
                    throw Object.assign(new Error(await responseMessage(statusResponse)), { permanent: true });
                }
                const statusBody = await statusResponse.json();
                createdSale = statusBody?.data?.exists ? statusBody.data.sale : null;
            }

            let response = null;
            if (!createdSale) {
                response = await fetch("/api/offline-sync/sales", {
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
            }

            if (createdSale || response?.ok) {
                if (!createdSale) {
                    const body = await response.json();
                    createdSale = body?.data;
                }
                await updateOfflineSaleRecord(sale.clientUuid, {
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
                continue;
            }

            if (response.status === 401 || response.status === 403) {
                await updateOfflineSaleRecord(sale.clientUuid, {
                    status: "requires_review",
                    error: "La credencial de sincronización venció. Abre EcuaPos con conexión para renovarla.",
                    errorCode: "AUTH",
                    leaseOwner: null,
                    leaseUntil: null,
                });
                continue;
            }

            if (response.status === 429 || response.status >= 500) {
                throw new Error("temporary-server-error");
            }

            let validationBody = {};
            try {
                validationBody = await response.json();
            } catch (_) {
                validationBody = {};
            }
            await updateOfflineSaleRecord(sale.clientUuid, {
                status: "requires_review",
                error: validationBody?.message || "La venta requiere revisión manual.",
                errorCode: validationBody?.error_code || "VALIDATION",
                diagnosis: validationBody?.diagnosis || null,
                confirmationRequired: false,
                nextRetryAt: null,
                leaseOwner: null,
                leaseUntil: null,
            });
        } catch (_) {
            const attempts = Number(sale.attempts || 1);
            const retryDelay = Math.min(5 * 60 * 1000, 5000 * (2 ** Math.min(attempts - 1, 6)));
            await updateOfflineSaleRecord(sale.clientUuid, {
                status: "pending",
                error: "No se pudo conectar con el servidor. EcuaPos volverá a intentarlo automáticamente.",
                errorCode: "NETWORK",
                confirmationRequired: true,
                nextRetryAt: new Date(Date.now() + retryDelay).toISOString(),
                leaseOwner: null,
                leaseUntil: null,
            });
            temporaryFailure = true;
            break;
        }
    }

    await notifyOfflineSalesChanged();
    if (temporaryFailure) throw new Error("offline-sales-sync-retry");
};

// ─── Fetch ────────────────────────────────────────────────────────────────────
// Estrategia: Network First siempre.
// - Peticiones a /api/* → siempre van a la red, nunca se cachean.
// - Assets estáticos → red primero, caché como fallback.
// - Si no hay conexión → muestra página de sin conexión.
self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    if (event.request.method !== "GET") return;
    if (!url.protocol.startsWith("http")) return;

    // Las rutas del frontend usan el mismo documento HTML. Permitimos
    // reabrir la PWA sin conexión sirviendo el shell ya instalado, pero
    // nunca guardamos respuestas de la API.
    if (event.request.mode === "navigate" && url.origin === self.location.origin) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response?.ok) {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put("/", copy));
                    }
                    return response;
                })
                .catch(async () => (await caches.match("/")) || caches.match("/offline.html"))
        );
        return;
    }

    // Lista explícita de extensiones/paths que SÍ se pueden cachear
    const esAssetEstatico =
        STATIC_ASSETS.includes(url.pathname) ||
        /\.(js|css|png|jpg|jpeg|svg|ico|woff2?)$/.test(url.pathname);

    if (!esAssetEstatico) {
        // Cualquier petición de datos dinámicos: siempre red, nunca caché
        event.respondWith(fetch(event.request));
        return;
    }

    // Solo para assets estáticos: red primero, caché como fallback
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                if (response && response.status === 200 && response.type === "basic") {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(event.request).then((cached) => {
                    if (cached) return cached;
                    if (event.request.mode === "navigate") {
                        return caches.match("/offline.html");
                    }
                });
            })
    );
});
