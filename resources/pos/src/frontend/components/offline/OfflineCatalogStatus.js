import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
import "../../../assets/scss/frontend/offline-catalog.scss";

dayjs.extend(relativeTime);

const statusCopy = (status) => {
    const customerDetail = status.customerReview > 0
        ? ` · ${status.customerReview} cliente${status.customerReview === 1 ? "" : "s"} por revisar`
        : status.pendingCustomers > 0
            ? ` · ${status.pendingCustomers} cliente${status.pendingCustomers === 1 ? "" : "s"} por sincronizar`
            : "";
    const pendingDetail = (status.salesReview > 0
        ? ` · ${status.salesReview} requieren revisión`
        : status.pendingSales > 0
            ? ` · ${status.pendingSales} venta${status.pendingSales === 1 ? "" : "s"} por sincronizar`
            : "") + customerDetail;
    if (status.salesSyncing > 0) {
        return {
            icon: "bi-arrow-repeat",
            title: "Sincronizando ventas",
            detail: `${status.salesSyncing} venta${status.salesSyncing === 1 ? "" : "s"} en proceso. No cierres esta ventana.`,
        };
    }

    if (status.status === "syncing") {
        return {
            icon: "bi-arrow-repeat",
            title: "Sincronizando catálogo",
            detail: "Actualizando productos, precios y existencias...",
        };
    }

    if (!status.online && status.hasCache) {
        return {
            icon: "bi-cloud-slash",
            title: "Modo sin conexión",
            detail: (status.updatedAt
                ? `Catálogo local actualizado ${dayjs(status.updatedAt).locale("es").fromNow()}`
                : "Usando la última copia disponible") + pendingDetail,
        };
    }

    if (!status.online || status.status === "unavailable") {
        return {
            icon: "bi-exclamation-triangle",
            title: "Catálogo no disponible",
            detail: "Conéctate una vez para descargar los productos de esta bodega.",
        };
    }

    if (status.status === "error") {
        return {
            icon: "bi-exclamation-circle",
            title: "No se pudo actualizar",
            detail: status.hasCache
                ? "Se conserva la última copia local disponible."
                : "El POS funciona en línea, pero este dispositivo todavía no guardó una copia offline.",
        };
    }

    return {
        icon: "bi-cloud-check",
        title: "Catálogo preparado",
        detail: (status.updatedAt
            ? `${status.itemCount ?? 0} productos · actualizado ${dayjs(status.updatedAt).locale("es").fromNow()}`
            : "La copia offline se creará automáticamente.") + pendingDetail,
    };
};

const OfflineCatalogStatus = ({ status, onSync, onOpenSales }) => {
    const copy = statusCopy(status);
    const visualStatus = !status.online
        ? (status.hasCache ? "offline" : "unavailable")
        : status.salesSyncing > 0 ? "syncing" : status.status;

    return (
        <div className={`offline-catalog-status offline-catalog-status--${visualStatus || "idle"}`} role="status">
            <div className="offline-catalog-status__main">
                <span className="offline-catalog-status__icon" aria-hidden="true">
                    <i className={`bi ${copy.icon}`} />
                </span>
                <div>
                    <strong>{copy.title}</strong>
                    <span>{copy.detail}</span>
                </div>
            </div>
            <span
                className={`offline-catalog-status__background ${status.backgroundSyncReady ? "is-ready" : ""}`}
                title={status.backgroundSyncReady
                    ? "Sincronización protegida activa incluso después de cerrar la PWA"
                    : status.backgroundSyncSupported
                        ? "Abre EcuaPos con conexión para preparar la sincronización en segundo plano"
                        : "Este navegador sincronizará las ventas cuando vuelvas a abrir EcuaPos"}
            >
                <i className={`bi ${status.backgroundSyncReady ? "bi-shield-check" : "bi-shield-exclamation"}`} />
                <span>{status.backgroundSyncReady ? "Respaldo activo" : "Respaldo al abrir"}</span>
            </span>
            {(status.pendingSales > 0 || status.salesReview > 0 || status.syncedSales > 0) && (
                <button
                    type="button"
                    className={`offline-catalog-status__sales ${status.pendingSales === 0 && status.salesReview === 0 ? "is-history" : ""}`}
                    onClick={onOpenSales}
                    title="Ver ventas offline e historial de sincronización"
                >
                    <i className={`bi ${status.pendingSales === 0 && status.salesReview === 0 ? "bi-clock-history" : "bi-receipt"}`} />
                    {status.salesReview > 0 ? status.salesReview : status.pendingSales > 0 ? status.pendingSales : status.syncedSales}
                </button>
            )}
            {(status.online || status.canRetry) && (
                <button
                    type="button"
                    onClick={onSync}
                    disabled={status.status === "syncing"}
                    className="offline-catalog-status__sync"
                >
                    <i className="bi bi-arrow-clockwise" aria-hidden="true" />
                    Actualizar
                </button>
            )}
        </div>
    );
};

export default OfflineCatalogStatus;
