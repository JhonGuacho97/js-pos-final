import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap-v5";
import dayjs from "dayjs";
import {
    clearSyncedOfflineSales,
    discardOfflineSale,
    getOfflineSales,
    OFFLINE_SALES_EVENT,
    updateOfflineSale,
} from "../../../offline/catalogStorage";

const quantity = (value) => new Intl.NumberFormat("es-EC", { maximumFractionDigits: 4 }).format(Number(value || 0));

const saleItems = (sale) => {
    const diagnosed = sale.diagnosis?.items || [];
    const payload = sale.payload?.sale_items || [];
    const receipt = sale.receipt?.products || [];
    const length = Math.max(diagnosed.length, payload.length, receipt.length);

    return Array.from({ length }, (_, index) => {
        const diagnosis = diagnosed[index] || {};
        const queued = payload[index] || {};
        const printed = receipt[index] || {};
        return {
            ...queued,
            ...diagnosis,
            product_name: diagnosis.product_name || printed.name || queued.name || `Producto ${queued.product_id || ""}`,
            product_code: diagnosis.product_code || printed.code || queued.code || "",
            presentation_name: diagnosis.presentation_name || null,
            presentation_quantity: diagnosis.presentation_quantity ?? queued.quantity ?? printed.quantity ?? 0,
            presentation_equivalence: diagnosis.presentation_equivalence ?? queued.presentation_equivalence ?? 1,
        };
    });
};

const OfflineSalesModal = ({ show, onHide, onRetry, onDiagnose, onDiscard, online }) => {
    const [sales, setSales] = useState([]);
    const [view, setView] = useState("pending");
    const [working, setWorking] = useState(false);
    const [expanded, setExpanded] = useState(null);
    const [diagnosing, setDiagnosing] = useState(null);
    const [confirmDiscard, setConfirmDiscard] = useState(null);
    const [actionError, setActionError] = useState(null);

    const loadSales = () => getOfflineSales().then(setSales).catch(() => setSales([]));

    useEffect(() => {
        if (show) loadSales();
        const refresh = () => loadSales();
        window.addEventListener(OFFLINE_SALES_EVENT, refresh);
        return () => window.removeEventListener(OFFLINE_SALES_EVENT, refresh);
    }, [show]);

    const retry = async (sale) => {
        setWorking(true);
        setActionError(null);
        try {
            await updateOfflineSale(sale.clientUuid, { status: "pending", error: null });
            await onRetry(true);
            await loadSales();
        } finally {
            setWorking(false);
        }
    };

    const diagnose = async (sale) => {
        setDiagnosing(sale.clientUuid);
        setActionError(null);
        try {
            await onDiagnose(sale);
            await loadSales();
            setExpanded(sale.clientUuid);
        } catch (error) {
            setActionError(error?.message || "No se pudo verificar la venta.");
        } finally {
            setDiagnosing(null);
        }
    };

    const discard = async (sale) => {
        await discardOfflineSale(sale.clientUuid, "duplicate");
        setConfirmDiscard(null);
        setExpanded(null);
        try {
            await onDiscard?.();
        } catch (_) {
            setActionError("La venta se descartó, pero no se pudo actualizar el catálogo. Usa el botón Actualizar cuando tengas conexión estable.");
        }
        await loadSales();
    };

    const syncAll = async () => {
        setWorking(true);
        setActionError(null);
        try {
            await onRetry(true);
            await loadSales();
        } finally {
            setWorking(false);
        }
    };

    const clearHistory = async () => {
        if (!window.confirm("¿Deseas limpiar el historial de ventas offline resueltas?")) return;
        await clearSyncedOfflineSales();
        await loadSales();
    };

    const activeSales = sales.filter((sale) => !["synced", "discarded"].includes(sale.status));
    const resolvedSales = sales.filter((sale) => ["synced", "discarded"].includes(sale.status)).reverse();
    const retryableSales = activeSales.filter((sale) => ["pending", "syncing"].includes(sale.status));
    const visibleSales = view === "history" ? resolvedSales : activeSales;

    const statusLabel = (sale) => {
        if (sale.status === "synced") return "Sincronizada";
        if (sale.status === "discarded") return "Descartada como duplicada";
        if (sale.status === "syncing") return "Sincronizando";
        if (sale.status === "requires_review") return "Requiere revisión";
        return sale.nextRetryAt ? "Reintento programado" : "Pendiente";
    };

    const currency = (sale) => sale.receipt?.settings?.attributes?.currency_symbol || "$";

    return (
        <Modal show={show} onHide={onHide} centered size="lg" className="pos-modal offline-sales-modal">
            <Modal.Header closeButton>
                <div><span className="pos-eyebrow">Sincronización</span><Modal.Title>Ventas guardadas en este dispositivo</Modal.Title></div>
            </Modal.Header>
            <Modal.Body>
                <div className="offline-sales-modal__toolbar">
                    <div className="offline-sales-modal__tabs" role="tablist">
                        <button type="button" className={view === "pending" ? "is-active" : ""} onClick={() => setView("pending")}>Pendientes <span>{activeSales.length}</span></button>
                        <button type="button" className={view === "history" ? "is-active" : ""} onClick={() => setView("history")}>Historial <span>{resolvedSales.length}</span></button>
                    </div>
                    {view === "pending" && retryableSales.length > 0 && <button type="button" className="offline-sales-modal__sync-all" disabled={!online || working} onClick={syncAll}><i className={`bi ${working ? "bi-arrow-repeat" : "bi-cloud-arrow-up"}`} />{working ? "Sincronizando" : `Sincronizar pendientes (${retryableSales.length})`}</button>}
                    {view === "history" && resolvedSales.length > 0 && <button type="button" className="offline-sales-modal__clear" onClick={clearHistory}>Limpiar historial</button>}
                </div>
                {actionError && <div className="offline-sales-modal__notice is-error"><i className="bi bi-exclamation-triangle" /> {actionError}</div>}
                {!visibleSales.length ? <div className="offline-sales-modal__empty"><i className={`bi ${view === "history" ? "bi-clock-history" : "bi-cloud-check"}`} /><strong>{view === "history" ? "Aún no hay historial" : "Todo está sincronizado"}</strong><span>{view === "history" ? "Las ventas offline resueltas aparecerán aquí." : "No existen ventas pendientes en este dispositivo."}</span></div> : (
                    <div className="offline-sales-modal__list">
                        {visibleSales.map((sale) => {
                            const isExpanded = expanded === sale.clientUuid;
                            const items = saleItems(sale);
                            const diagnosis = sale.diagnosis;
                            return <article key={sale.clientUuid} className={`offline-sale-card is-${sale.status}`}>
                                <div className="offline-sale-card__main"><span className="offline-sale-card__icon"><i className="bi bi-receipt" /></span><div><strong>{sale.receipt?.customer_name?.label || "Consumidor final"}</strong><span>{dayjs(sale.createdAt).format("DD/MM/YYYY HH:mm")} · {sale.clientUuid.slice(0, 8).toUpperCase()}</span></div></div>
                                <div className="offline-sale-card__amount"><strong>{currency(sale)}{Number(sale.receipt?.grandTotal || 0).toFixed(2)}</strong><span>{statusLabel(sale)}</span></div>
                                {sale.error && <p>{sale.error}</p>}
                                {sale.postSyncError && <p>{sale.postSyncError}</p>}
                                {sale.status === "synced" && <div className="offline-sale-card__meta"><i className="bi bi-check-circle-fill" /> Sincronizada {dayjs(sale.syncedAt).format("DD/MM/YYYY HH:mm")}{sale.serverReference && ` · ${sale.serverReference}`}{sale.electronicInvoiceQueued && " · Comprobante electrónico en cola"}</div>}
                                {sale.status === "discarded" && <div className="offline-sale-card__meta"><i className="bi bi-shield-check" /> Descartada en este dispositivo {dayjs(sale.discardedAt).format("DD/MM/YYYY HH:mm")}</div>}
                                {sale.status === "pending" && sale.nextRetryAt && <div className="offline-sale-card__meta"><i className="bi bi-clock" /> Próximo intento {dayjs(sale.nextRetryAt).format("HH:mm:ss")}</div>}

                                <div className="offline-sale-card__actions">
                                    <button type="button" className="is-neutral" onClick={() => setExpanded(isExpanded ? null : sale.clientUuid)}><i className={`bi ${isExpanded ? "bi-chevron-up" : "bi-list-ul"}`} /> {isExpanded ? "Ocultar detalle" : "Ver detalle"}</button>
                                    {sale.status === "requires_review" && <>
                                        <button type="button" className="is-check" disabled={!online || diagnosing === sale.clientUuid} onClick={() => diagnose(sale)}><i className={`bi ${diagnosing === sale.clientUuid ? "bi-arrow-repeat" : "bi-search"}`} /> {diagnosing === sale.clientUuid ? "Verificando" : "Verificar stock"}</button>
                                        <button type="button" className="is-retry" disabled={!online || working} onClick={() => retry(sale)}><i className="bi bi-arrow-clockwise" /> Reintentar</button>
                                        <button type="button" className="is-discard" disabled={!online} onClick={() => setConfirmDiscard(sale.clientUuid)}><i className="bi bi-files" /> Es duplicada</button>
                                    </>}
                                </div>

                                {confirmDiscard === sale.clientUuid && <div className="offline-sale-card__confirm"><div><i className="bi bi-exclamation-triangle" /><span><strong>¿Confirmas que ya existe en el sistema?</strong> Se retirará de pendientes sin modificar ventas ni inventario.</span></div><div><button type="button" className="is-neutral" onClick={() => setConfirmDiscard(null)}>Conservar</button><button type="button" className="is-confirm" onClick={() => discard(sale)}>Sí, descartar duplicada</button></div></div>}

                                {isExpanded && <div className="offline-sale-detail">
                                    <div className="offline-sale-detail__summary"><span><small>Almacén</small><strong>{diagnosis?.warehouse?.name || "Almacén de la venta"}</strong></span><span><small>Forma de pago</small><strong>{sale.receipt?.paymentType || sale.receipt?.payment_type || "Registrada en el cobro"}</strong></span><span><small>Comprobación</small><strong>{diagnosis?.checked_at ? dayjs(diagnosis.checked_at).format("DD/MM/YYYY HH:mm") : "Sin verificar"}</strong></span></div>
                                    {diagnosis && <div className={`offline-sale-detail__result ${diagnosis.can_sync ? "is-ok" : "is-conflict"}`}><i className={`bi ${diagnosis.can_sync ? "bi-check-circle" : "bi-exclamation-octagon"}`} /><div><strong>{diagnosis.can_sync ? "Ahora existe stock suficiente" : `${diagnosis.conflicts?.length || 0} conflicto(s) de inventario`}</strong><span>{diagnosis.can_sync ? "Puedes reintentar la sincronización cuando estés listo." : "Revisa los artículos marcados antes de reintentar."}</span></div></div>}
                                    <div className="offline-sale-detail__items">{items.map((item, index) => <div key={`${item.product_id || index}-${index}`} className={item.has_conflict ? "has-conflict" : ""}><span className="offline-sale-detail__item-icon"><i className={`bi ${item.has_conflict ? "bi-exclamation-triangle" : "bi-box-seam"}`} /></span><span><strong>{item.product_name}</strong><small>{item.product_code || "Sin código"}{item.presentation_name ? ` · ${item.presentation_name}` : ""}</small></span><span className="offline-sale-detail__qty"><strong>{quantity(item.presentation_quantity)}</strong><small>{Number(item.presentation_equivalence || 1) !== 1 ? `× ${quantity(item.presentation_equivalence)} unidades` : "cantidad"}</small></span></div>)}</div>
                                    {diagnosis?.conflicts?.map((conflict) => <div key={conflict.stock_product_id} className="offline-stock-conflict"><div><strong>{conflict.stock_product_name}</strong><small>{conflict.is_kit_component ? "Componente necesario para un kit" : conflict.stock_product_code || "Inventario base"}</small></div><span><small>Solicitado</small><strong>{quantity(conflict.requested_quantity)}</strong></span><span><small>Disponible</small><strong>{quantity(conflict.available_quantity)}</strong></span><span className="is-shortage"><small>Faltan</small><strong>{quantity(conflict.shortage_quantity)}</strong></span></div>)}
                                    {!diagnosis && sale.status === "requires_review" && <div className="offline-sale-detail__hint"><i className="bi bi-info-circle" /> Usa “Verificar stock” para identificar exactamente qué producto tiene el conflicto. Esta consulta no registra la venta.</div>}
                                </div>}
                            </article>;
                        })}
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default OfflineSalesModal;
