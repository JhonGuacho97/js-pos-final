import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap-v5";
import dayjs from "dayjs";
import {
    clearSyncedOfflineSales,
    getOfflineSales,
    OFFLINE_SALES_EVENT,
    updateOfflineSale,
} from "../../../offline/catalogStorage";

const OfflineSalesModal = ({ show, onHide, onRetry, online }) => {
    const [sales, setSales] = useState([]);
    const [view, setView] = useState("pending");
    const [working, setWorking] = useState(false);

    const loadSales = () => getOfflineSales().then(setSales).catch(() => setSales([]));

    useEffect(() => {
        if (show) loadSales();
        const refresh = () => loadSales();
        window.addEventListener(OFFLINE_SALES_EVENT, refresh);
        return () => window.removeEventListener(OFFLINE_SALES_EVENT, refresh);
    }, [show]);

    const retry = async (sale) => {
        setWorking(true);
        await updateOfflineSale(sale.clientUuid, { status: "pending", error: null });
        await onRetry(true);
        await loadSales();
        setWorking(false);
    };

    const syncAll = async () => {
        setWorking(true);
        await onRetry(true);
        await loadSales();
        setWorking(false);
    };

    const clearHistory = async () => {
        if (!window.confirm("¿Deseas limpiar el historial de ventas offline ya sincronizadas?")) return;
        await clearSyncedOfflineSales();
        await loadSales();
    };

    const activeSales = sales.filter((sale) => sale.status !== "synced");
    const syncedSales = sales.filter((sale) => sale.status === "synced").reverse();
    const visibleSales = view === "history" ? syncedSales : activeSales;

    const statusLabel = (sale) => {
        if (sale.status === "synced") return "Sincronizada";
        if (sale.status === "syncing") return "Sincronizando";
        if (sale.status === "requires_review") return "Requiere revisión";
        return sale.nextRetryAt ? "Reintento programado" : "Pendiente";
    };

    const currency = (sale) => sale.receipt?.settings?.attributes?.currency_symbol || "$";

    return (
        <Modal show={show} onHide={onHide} centered size="lg" className="pos-modal offline-sales-modal">
            <Modal.Header closeButton>
                <div>
                    <span className="pos-eyebrow">Sincronización</span>
                    <Modal.Title>Ventas guardadas en este dispositivo</Modal.Title>
                </div>
            </Modal.Header>
            <Modal.Body>
                <div className="offline-sales-modal__toolbar">
                    <div className="offline-sales-modal__tabs" role="tablist">
                        <button type="button" className={view === "pending" ? "is-active" : ""} onClick={() => setView("pending")}>
                            Pendientes <span>{activeSales.length}</span>
                        </button>
                        <button type="button" className={view === "history" ? "is-active" : ""} onClick={() => setView("history")}>
                            Historial <span>{syncedSales.length}</span>
                        </button>
                    </div>
                    {view === "pending" && activeSales.length > 0 && (
                        <button type="button" className="offline-sales-modal__sync-all" disabled={!online || working} onClick={syncAll}>
                            <i className={`bi ${working ? "bi-arrow-repeat" : "bi-cloud-arrow-up"}`} />
                            {working ? "Sincronizando" : "Sincronizar ahora"}
                        </button>
                    )}
                    {view === "history" && syncedSales.length > 0 && (
                        <button type="button" className="offline-sales-modal__clear" onClick={clearHistory}>Limpiar historial</button>
                    )}
                </div>
                {!visibleSales.length ? (
                    <div className="offline-sales-modal__empty">
                        <i className={`bi ${view === "history" ? "bi-clock-history" : "bi-cloud-check"}`} />
                        <strong>{view === "history" ? "Aún no hay historial" : "Todo está sincronizado"}</strong>
                        <span>{view === "history" ? "Las ventas offline sincronizadas aparecerán aquí." : "No existen ventas pendientes en este dispositivo."}</span>
                    </div>
                ) : (
                    <div className="offline-sales-modal__list">
                        {visibleSales.map((sale) => (
                            <article key={sale.clientUuid} className={`offline-sale-card is-${sale.status}`}>
                                <div className="offline-sale-card__main">
                                    <span className="offline-sale-card__icon"><i className="bi bi-receipt" /></span>
                                    <div>
                                        <strong>{sale.receipt?.customer_name?.label || "Consumidor final"}</strong>
                                        <span>{dayjs(sale.createdAt).format("DD/MM/YYYY HH:mm")} · {sale.clientUuid.slice(0, 8).toUpperCase()}</span>
                                    </div>
                                </div>
                                <div className="offline-sale-card__amount">
                                    <strong>{currency(sale)}{Number(sale.receipt?.grandTotal || 0).toFixed(2)}</strong>
                                    <span>{statusLabel(sale)}</span>
                                </div>
                                {sale.error && <p>{sale.error}</p>}
                                {sale.postSyncError && <p>{sale.postSyncError}</p>}
                                {sale.status === "synced" && (
                                    <div className="offline-sale-card__meta">
                                        <i className="bi bi-check-circle-fill" /> Sincronizada {dayjs(sale.syncedAt).format("DD/MM/YYYY HH:mm")}
                                        {sale.serverReference && ` · ${sale.serverReference}`}
                                        {sale.electronicInvoiceQueued && " · Comprobante electrónico en cola"}
                                    </div>
                                )}
                                {sale.status === "pending" && sale.nextRetryAt && (
                                    <div className="offline-sale-card__meta">
                                        <i className="bi bi-clock" /> Próximo intento {dayjs(sale.nextRetryAt).format("HH:mm:ss")}
                                    </div>
                                )}
                                {sale.status === "requires_review" && (
                                    <button type="button" disabled={!online || working} onClick={() => retry(sale)}>
                                        <i className="bi bi-arrow-clockwise" /> Reintentar
                                    </button>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default OfflineSalesModal;
