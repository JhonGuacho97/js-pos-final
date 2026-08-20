import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import MasterLayout from "../MasterLayout";
import HeaderTitle from "../header/HeaderTitle";
import apiConfig from "../../config/apiConfig";
import { addToast } from "../../store/action/toastAction";
import "./catalog-orders.scss";

const statusMeta = {
    pending: { label: "Pendiente", icon: "bi-clock", tone: "warning" },
    confirmed: { label: "Confirmado", icon: "bi-check2-circle", tone: "info" },
    preparing: { label: "En preparación", icon: "bi-box-seam", tone: "primary" },
    completed: { label: "Completado", icon: "bi-check2-all", tone: "success" },
    cancelled: { label: "Cancelado", icon: "bi-x-circle", tone: "danger" },
};

const money = (value) => `$ ${Number(value || 0).toFixed(2)}`;
const dateTime = (value) => value
    ? new Intl.DateTimeFormat("es-EC", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
    : "—";

const errorText = (error, fallback) => {
    const validation = error.response?.data?.errors;
    return (validation && Object.values(validation).flat()[0])
        || error.response?.data?.message
        || fallback;
};

const CatalogOrders = () => {
    const dispatch = useDispatch();
    const [orders, setOrders] = useState([]);
    const [summary, setSummary] = useState({});
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [filters, setFilters] = useState({ search: "", status: "", date_from: "", date_to: "" });
    const [appliedFilters, setAppliedFilters] = useState(filters);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [internalNotes, setInternalNotes] = useState("");

    const fetchOrders = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await apiConfig.get("/catalog-orders", {
                params: { ...appliedFilters, page, per_page: 15 },
            });
            setOrders(response.data.data || []);
            setSummary(response.data.summary || {});
            setMeta(response.data.meta || { current_page: 1, last_page: 1, total: 0 });
        } catch (error) {
            dispatch(addToast({ text: errorText(error, "No se pudieron cargar los pedidos."), type: "error" }));
        } finally {
            setLoading(false);
        }
    }, [appliedFilters, dispatch]);

    useEffect(() => { fetchOrders(1); }, [fetchOrders]);

    const openOrder = async (id) => {
        setDetailLoading(true);
        setSelected({ id });
        try {
            const response = await apiConfig.get(`/catalog-orders/${id}`);
            setSelected(response.data.data);
            setInternalNotes(response.data.data.internal_notes || "");
        } catch (error) {
            setSelected(null);
            dispatch(addToast({ text: errorText(error, "No se pudo abrir el pedido."), type: "error" }));
        } finally {
            setDetailLoading(false);
        }
    };

    const refreshSelected = async () => {
        if (!selected?.id) return;
        const response = await apiConfig.get(`/catalog-orders/${selected.id}`);
        setSelected(response.data.data);
        setInternalNotes(response.data.data.internal_notes || "");
        await fetchOrders(meta.current_page);
    };

    const changeStatus = async (status) => {
        const label = statusMeta[status]?.label?.toLowerCase() || status;
        if ((status === "cancelled" || status === "completed") && !window.confirm(`¿Deseas marcar este pedido como ${label}?`)) return;
        setSaving(true);
        try {
            await apiConfig.patch(`/catalog-orders/${selected.id}/status`, { status });
            dispatch(addToast({ text: `Pedido marcado como ${label}.` }));
            await refreshSelected();
        } catch (error) {
            dispatch(addToast({ text: errorText(error, "No se pudo actualizar el pedido."), type: "error" }));
        } finally {
            setSaving(false);
        }
    };

    const saveNotes = async () => {
        setSaving(true);
        try {
            await apiConfig.patch(`/catalog-orders/${selected.id}/notes`, { internal_notes: internalNotes });
            dispatch(addToast({ text: "Nota interna guardada." }));
            setSelected((current) => ({ ...current, internal_notes: internalNotes }));
        } catch (error) {
            dispatch(addToast({ text: errorText(error, "No se pudo guardar la nota."), type: "error" }));
        } finally {
            setSaving(false);
        }
    };

    const convertToSale = async () => {
        setSaving(true);
        try {
            const response = await apiConfig.post(`/catalog-orders/${selected.id}/convert-to-sale`);
            dispatch(addToast({ text: `Venta ${response.data.data.reference_code} generada correctamente.` }));
            await refreshSelected();
        } catch (error) {
            dispatch(addToast({ text: errorText(error, "No se pudo generar la venta."), type: "error" }));
        } finally {
            setSaving(false);
        }
    };

    const applyFilters = (event) => {
        event.preventDefault();
        setAppliedFilters(filters);
    };

    const clearFilters = () => {
        const clean = { search: "", status: "", date_from: "", date_to: "" };
        setFilters(clean);
        setAppliedFilters(clean);
    };

    const activeSummary = useMemo(() => ["pending", "confirmed", "preparing"].reduce(
        (total, status) => total + Number(summary[status] || 0), 0
    ), [summary]);

    return (
        <MasterLayout>
            <HeaderTitle title="Pedidos del catálogo" to="/app/dashboard" />
            <main className="catalog-orders">
                <section className="catalog-orders__hero">
                    <div className="catalog-orders__hero-icon"><i className="bi bi-bag-check" /></div>
                    <div>
                        <span className="catalog-orders__eyebrow">VENTAS DIGITALES</span>
                        <h2>Pedidos del catálogo</h2>
                        <p>Confirma, prepara y convierte en venta cada pedido sin perder su historial.</p>
                    </div>
                    <div className="catalog-orders__active"><b>{activeSummary}</b><span>por atender</span></div>
                </section>

                <section className="catalog-orders__stats">
                    {Object.entries(statusMeta).map(([status, info]) => (
                        <button key={status} type="button" className={`catalog-order-stat is-${info.tone} ${filters.status === status ? "is-active" : ""}`}
                            onClick={() => { setFilters((current) => ({ ...current, status })); setAppliedFilters((current) => ({ ...current, status })); }}>
                            <i className={`bi ${info.icon}`} /><span>{info.label}</span><b>{summary[status] || 0}</b>
                        </button>
                    ))}
                </section>

                <form className="catalog-orders__filters" onSubmit={applyFilters}>
                    <label className="catalog-orders__search"><i className="bi bi-search" /><input value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="Buscar por pedido, cliente o teléfono" /></label>
                    <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                        <option value="">Todos los estados</option>
                        {Object.entries(statusMeta).map(([value, info]) => <option key={value} value={value}>{info.label}</option>)}
                    </select>
                    <input type="date" aria-label="Desde" value={filters.date_from} onChange={(e) => setFilters({ ...filters, date_from: e.target.value })} />
                    <input type="date" aria-label="Hasta" value={filters.date_to} onChange={(e) => setFilters({ ...filters, date_to: e.target.value })} />
                    <button className="btn btn-primary" type="submit">Filtrar</button>
                    <button className="btn btn-light" type="button" onClick={clearFilters}>Limpiar</button>
                </form>

                <section className="catalog-orders__list-card">
                    <div className="catalog-orders__list-heading"><div><h3>Bandeja de pedidos</h3><p>{meta.total || 0} pedidos encontrados</p></div><button className="btn btn-light" type="button" onClick={() => fetchOrders(meta.current_page)}><i className="bi bi-arrow-clockwise" /> Actualizar</button></div>
                    {loading ? <div className="catalog-orders__state"><span className="spinner-border text-primary" /> Cargando pedidos...</div> : orders.length === 0 ? (
                        <div className="catalog-orders__state"><i className="bi bi-inbox" /><strong>No hay pedidos con estos filtros</strong><span>Los nuevos pedidos aparecerán aquí automáticamente al actualizar.</span></div>
                    ) : (
                        <div className="catalog-orders__table-wrap"><table className="catalog-orders__table"><thead><tr><th>Pedido</th><th>Cliente</th><th>Entrega</th><th>Estado</th><th>Total</th><th /></tr></thead><tbody>
                            {orders.map((order) => { const info = statusMeta[order.status] || statusMeta.pending; return <tr key={order.id} onClick={() => openOrder(order.id)}>
                                <td><strong>{order.reference}</strong><small>{dateTime(order.created_at)} · {order.items_count} productos</small></td>
                                <td><strong>{order.customer_name}</strong><small>{order.customer_phone}</small></td>
                                <td><span className="catalog-orders__delivery"><i className={`bi ${order.fulfillment_type === "delivery" ? "bi-truck" : "bi-shop"}`} />{order.fulfillment_type === "delivery" ? "Domicilio" : "Retiro"}</span><small>{order.warehouse}</small></td>
                                <td><span className={`catalog-order-status is-${info.tone}`}><i className={`bi ${info.icon}`} />{info.label}</span>{order.sale && <small>Venta {order.sale.reference_code}</small>}</td>
                                <td className="catalog-orders__amount">{money(order.grand_total)}</td>
                                <td><button type="button" className="catalog-orders__open" aria-label="Revisar pedido"><i className="bi bi-chevron-right" /></button></td>
                            </tr>; })}
                        </tbody></table></div>
                    )}
                    {meta.last_page > 1 && <div className="catalog-orders__pagination"><button type="button" disabled={meta.current_page <= 1 || loading} onClick={() => fetchOrders(meta.current_page - 1)}><i className="bi bi-chevron-left" /> Anterior</button><span>Página <b>{meta.current_page}</b> de {meta.last_page}</span><button type="button" disabled={meta.current_page >= meta.last_page || loading} onClick={() => fetchOrders(meta.current_page + 1)}>Siguiente <i className="bi bi-chevron-right" /></button></div>}
                </section>
            </main>

            {selected && <div className="catalog-order-modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.target === e.currentTarget && !saving && setSelected(null)}>
                <div className="catalog-order-modal__panel">
                    {detailLoading ? <div className="catalog-orders__state"><span className="spinner-border text-primary" /> Cargando detalle...</div> : <>
                        <header className="catalog-order-modal__header"><div><span className="catalog-orders__eyebrow">DETALLE DEL PEDIDO</span><h2>{selected.reference}</h2><div className="catalog-order-modal__meta">{dateTime(selected.created_at)} · {selected.warehouse}</div></div><button type="button" onClick={() => setSelected(null)} disabled={saving}><i className="bi bi-x-lg" /></button></header>
                        <div className="catalog-order-modal__body">
                            <section className="catalog-order-modal__main">
                                <div className="catalog-order-modal__customer"><div className="catalog-order-modal__avatar">{selected.customer_name?.charAt(0)?.toUpperCase()}</div><div><span>Cliente</span><h3>{selected.customer_name}</h3><a href={`tel:${selected.customer_phone}`}>{selected.customer_phone}</a></div><div className="catalog-order-modal__customer-tags"><span><i className={`bi ${selected.fulfillment_type === "delivery" ? "bi-truck" : "bi-shop"}`} /> {selected.fulfillment_type === "delivery" ? "Entrega a domicilio" : "Retiro en tienda"}</span>{selected.payment_method && <span><i className="bi bi-wallet2" /> {selected.payment_method}</span>}</div></div>
                                {(selected.delivery_address || selected.notes) && <div className="catalog-order-modal__info">{selected.delivery_address && <p><i className="bi bi-geo-alt" /><span><b>Dirección</b>{selected.delivery_address}</span></p>}{selected.notes && <p><i className="bi bi-chat-left-text" /><span><b>Observaciones del cliente</b>{selected.notes}</span></p>}</div>}
                                <div className="catalog-order-modal__items"><h3>Productos <span>{selected.items?.length || 0}</span></h3>{selected.items?.map((item) => <article key={item.id}><div className="catalog-order-modal__qty">{item.quantity}</div><div><strong>{item.product_name}</strong><span>{[item.variant_name, item.presentation_name].filter(Boolean).join(" · ") || "Presentación estándar"}</span>{item.notes && <small>Nota: {item.notes}</small>}</div><div><span>{money(item.unit_price)} c/u</span><b>{money(item.line_total)}</b></div></article>)}</div>
                                <label className="catalog-order-modal__notes"><span>Nota interna del equipo</span><textarea rows="3" value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} placeholder="Ej. Cliente confirmó por llamada, empacar por separado..." /><button type="button" onClick={saveNotes} disabled={saving || internalNotes === (selected.internal_notes || "")}>Guardar nota</button></label>
                            </section>
                            <aside className="catalog-order-modal__aside">
                                {(() => { const info = statusMeta[selected.status] || statusMeta.pending; return <div className={`catalog-order-modal__status is-${info.tone}`}><span>Estado actual</span><strong><i className={`bi ${info.icon}`} /> {info.label}</strong>{selected.assignee && <small>Gestionado por {selected.assignee}</small>}</div>; })()}
                                <div className="catalog-order-modal__totals"><p><span>Subtotal</span><b>{money(selected.subtotal)}</b></p>{selected.delivery_fee > 0 && <p><span>Envío</span><b>{money(selected.delivery_fee)}</b></p>}<p className="is-total"><span>Total</span><b>{money(selected.grand_total)}</b></p></div>
                                <div className="catalog-order-modal__actions">
                                    {selected.status === "pending" && <button className="is-primary" type="button" disabled={saving} onClick={() => changeStatus("confirmed")}><i className="bi bi-check2-circle" /> Confirmar pedido</button>}
                                    {["confirmed", "preparing"].includes(selected.status) && !selected.sale && <button className="is-sale" type="button" disabled={saving} onClick={convertToSale}><i className="bi bi-receipt" /> Generar venta</button>}
                                    {selected.status === "confirmed" && <button className="is-primary" type="button" disabled={saving} onClick={() => changeStatus("preparing")}><i className="bi bi-box-seam" /> Iniciar preparación</button>}
                                    {selected.status === "preparing" && <button className="is-primary" type="button" disabled={saving} onClick={() => changeStatus("completed")}><i className="bi bi-check2-all" /> Marcar completado</button>}
                                    {["pending", "confirmed", "preparing"].includes(selected.status) && <button className="is-danger" type="button" disabled={saving} onClick={() => changeStatus("cancelled")}><i className="bi bi-x-circle" /> Cancelar pedido</button>}
                                    {selected.sale && <a href={`#/app/sales/detail/${selected.sale.id}`}><i className="bi bi-box-arrow-up-right" /> Ver venta {selected.sale.reference_code}</a>}
                                </div>
                                <div className="catalog-order-modal__timeline"><h3>Historial</h3>{selected.history?.length ? [...selected.history].reverse().map((entry) => <div key={entry.id}><i /><p><strong>{statusMeta[entry.to_status]?.label || "Venta generada"}</strong><span>{entry.user} · {dateTime(entry.created_at)}</span>{entry.note && <small>{entry.note}</small>}</p></div>) : <p className="catalog-order-modal__empty-history">Aún no hay cambios de estado.</p>}</div>
                            </aside>
                        </div>
                    </>}
                </div>
            </div>}
        </MasterLayout>
    );
};

export default CatalogOrders;
