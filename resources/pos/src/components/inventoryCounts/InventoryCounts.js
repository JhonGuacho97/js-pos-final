import React, { useEffect, useMemo, useRef, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import MasterLayout from "../MasterLayout";
import TabTitle from "../../shared/tab-title/TabTitle";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import apiConfig from "../../config/apiConfig";
import { apiBaseURL } from "../../constants";
import { fetchAllWarehouses } from "../../store/action/warehouseAction";
import { fetchAllProductCategories } from "../../store/action/productCategoryAction";
import "./inventory-counts.scss";

const STATUS = {
    draft: { label: "Borrador", icon: "bi-file-earmark", tone: "muted" },
    counting: { label: "En conteo", icon: "bi-upc-scan", tone: "blue" },
    review: { label: "Por revisar", icon: "bi-clipboard-check", tone: "amber" },
    completed: { label: "Completado", icon: "bi-check2-circle", tone: "green" },
    cancelled: { label: "Cancelado", icon: "bi-x-circle", tone: "red" },
};

const requestMessage = (error, fallback) => {
    const errors = error?.response?.data?.errors;
    if (errors) return Object.values(errors).flat()[0] || fallback;
    return error?.response?.data?.message || fallback;
};

const InventoryCounts = (props) => {
    const { id } = useParams();
    return <MasterLayout><TopProgressBar /><TabTitle title="Conteo físico" />
        {id ? <CountWorkspace id={id} /> : <CountList {...props} />}
    </MasterLayout>;
};

const CountList = ({ warehouses = [], productCategories = [], fetchAllWarehouses, fetchAllProductCategories }) => {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [summary, setSummary] = useState({});
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [permissions, setPermissions] = useState({});
    const requestSequence = useRef(0);

    useEffect(() => { fetchAllWarehouses(); fetchAllProductCategories(); }, []);
    const load = async (requestedPage = page) => {
        const requestId = ++requestSequence.current;
        setLoading(true); setError("");
        try {
            const response = await apiConfig.get(apiBaseURL.INVENTORY_COUNTS, { params: { page: requestedPage, per_page: 15, status: status || undefined, search: search || undefined } });
            if (requestId !== requestSequence.current) return;
            setRows(response.data.data || []);
            setSummary(response.data.summary || {});
            setPagination(response.data);
            setPermissions(response.data.permissions || {});
        } catch (requestError) {
            if (requestId === requestSequence.current) setError(requestMessage(requestError, "No se pudieron cargar los conteos."));
        } finally {
            if (requestId === requestSequence.current) setLoading(false);
        }
    };
    useEffect(() => { const timer = setTimeout(() => load(page), search ? 280 : 0); return () => clearTimeout(timer); }, [page, status, search]);

    const cards = [
        { key: "counting", label: "En proceso", value: Number(summary.draft || 0) + Number(summary.counting || 0), icon: "bi-upc-scan", tone: "blue" },
        { key: "review", label: "Esperan revisión", value: Number(summary.review || 0), icon: "bi-clipboard-check", tone: "amber" },
        { key: "completed", label: "Completados", value: Number(summary.completed || 0), icon: "bi-check2-circle", tone: "green" },
    ];

    return <main className="physical-count">
        <header className="physical-count__hero"><div><span>CONTROL DE EXISTENCIAS</span><h1>Conteo físico</h1><p>Cuenta por bodega, revisa diferencias y ajusta el inventario con trazabilidad.</p></div>{permissions.can_perform && <button type="button" className="pc-button pc-button--primary" onClick={() => setShowCreate(true)}><i className="bi bi-plus-lg" /> Nuevo conteo</button>}</header>
        <section className="pc-kpis">{cards.map(card => <button type="button" key={card.key} className={`pc-kpi pc-kpi--${card.tone}`} onClick={() => { setStatus(card.key === "counting" ? "active" : card.key); setPage(1); }}><i className={`bi ${card.icon}`} /><span><small>{card.label}</small><strong>{card.value}</strong></span></button>)}</section>
        <section className="pc-panel pc-filterbar"><div className="pc-search"><i className="bi bi-search" /><input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar referencia o bodega" /></div><select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}><option value="">Todos los estados</option>{Object.entries(STATUS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></section>
        {error && <Notice tone="error" text={error} />}
        <section className={`pc-panel pc-list ${loading ? "is-loading" : ""}`}>
            <div className="pc-panel__title"><div><span>HISTORIAL DE CONTEOS</span><h2>{pagination.total || 0} registros</h2></div>{loading && <small><span className="spinner-border spinner-border-sm" /> Actualizando</small>}</div>
            <div className="pc-table-wrap"><table className="pc-table"><thead><tr><th>Conteo</th><th>Bodega / alcance</th><th>Progreso</th><th>Diferencias</th><th>Estado</th><th>Fecha</th><th /></tr></thead><tbody>
                {!loading && !rows.length ? <tr><td colSpan="7"><EmptyState /></td></tr> : rows.map(row => <tr key={row.id}>
                    <td data-label="Conteo"><strong>{row.reference_code}</strong><small>{row.creator || "Usuario"}</small></td>
                    <td data-label="Bodega"><strong>{row.warehouse?.name || "—"}</strong><small>{row.category?.name || "Todos los productos"}</small></td>
                    <td data-label="Progreso"><div className="pc-progress"><span><i style={{ width: `${row.progress}%` }} /></span><small>{row.counted_items_count}/{row.items_count} · {row.progress}%</small></div></td>
                    <td data-label="Diferencias"><strong className={row.difference_items_count ? "pc-number--warn" : "pc-number--ok"}>{row.difference_items_count}</strong><small>productos</small></td>
                    <td data-label="Estado"><StatusBadge status={row.status} /></td><td data-label="Fecha"><strong>{formatDate(row.created_at)}</strong><small>{row.blind_count ? "Conteo ciego" : "Stock visible"}</small></td>
                    <td><button type="button" className="pc-icon-button" onClick={() => navigate(`/app/inventory-counts/${row.id}`)} title="Abrir conteo"><i className="bi bi-arrow-right" /></button></td>
                </tr>)}</tbody></table></div>
            <Pagination page={page} pagination={pagination} setPage={setPage} />
        </section>
        {showCreate && <CreateCountModal warehouses={warehouses} categories={productCategories} onClose={() => setShowCreate(false)} onCreated={count => navigate(`/app/inventory-counts/${count.id}`)} />}
    </main>;
};

const CreateCountModal = ({ warehouses, categories, onClose, onCreated }) => {
    const [form, setForm] = useState({ warehouse_id: "", product_category_id: "", blind_count: true, notes: "" });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => { if (!form.warehouse_id && warehouses[0]) setForm(current => ({ ...current, warehouse_id: String(warehouses[0].id) })); }, [warehouses]);
    const field = (name) => (event) => setForm({ ...form, [name]: event.target.type === "checkbox" ? event.target.checked : event.target.value });
    const submit = async (event) => {
        event.preventDefault(); setSaving(true); setError("");
        try {
            const response = await apiConfig.post(apiBaseURL.INVENTORY_COUNTS, { ...form, product_category_id: form.product_category_id || null });
            onCreated(response.data.data);
        } catch (requestError) { setError(requestMessage(requestError, "No se pudo crear el conteo.")); }
        finally { setSaving(false); }
    };
    return <div className="pc-modal-backdrop" role="presentation" onMouseDown={e => e.target === e.currentTarget && onClose()}><section className="pc-modal" role="dialog" aria-modal="true"><header><div className="pc-modal__icon"><i className="bi bi-upc-scan" /></div><div><span>NUEVO INVENTARIO</span><h2>Preparar conteo físico</h2><p>Se congelará una foto del stock actual para compararla con el conteo.</p></div><button type="button" onClick={onClose}><i className="bi bi-x-lg" /></button></header><form onSubmit={submit}><div className="pc-form-grid"><label><span>Bodega</span><select required value={form.warehouse_id} onChange={field("warehouse_id")}><option value="">Selecciona una bodega</option>{warehouses.map(item => <option key={item.id} value={item.id}>{item.attributes?.name || item.name}</option>)}</select></label><label><span>Categoría</span><select value={form.product_category_id} onChange={field("product_category_id")}><option value="">Todos los productos</option>{categories.map(item => <option key={item.id} value={item.id}>{item.attributes?.name || item.name}</option>)}</select></label></div><label className="pc-toggle"><input type="checkbox" checked={form.blind_count} onChange={field("blind_count")} /><span><i /><strong>Conteo ciego</strong><small>El contador no verá la existencia esperada; reduce sesgos y errores.</small></span></label><label className="pc-notes"><span>Nota interna <small>Opcional</small></span><textarea value={form.notes} onChange={field("notes")} placeholder="Ej.: Conteo mensual del área de bebidas" /></label>{error && <Notice tone="error" text={error} />}<footer><button type="button" className="pc-button pc-button--light" onClick={onClose}>Cancelar</button><button type="submit" className="pc-button pc-button--primary" disabled={saving || !form.warehouse_id}>{saving ? "Preparando…" : "Crear y empezar"}<i className="bi bi-arrow-right" /></button></footer></form></section></div>;
};

const CountWorkspace = ({ id }) => {
    const navigate = useNavigate();
    const [count, setCount] = useState(null);
    const [items, setItems] = useState([]);
    const [permissions, setPermissions] = useState({});
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [notice, setNotice] = useState(null);
    const [acting, setActing] = useState(false);
    const [savingPage, setSavingPage] = useState(false);
    const [showCancel, setShowCancel] = useState(false);
    const rowSavers = useRef(new Map());
    const requestSequence = useRef(0);

    const load = async (requestedPage = page) => {
        const requestId = ++requestSequence.current;
        setLoading(true);
        try {
            const response = await apiConfig.get(`${apiBaseURL.INVENTORY_COUNTS}/${id}`, { params: { page: requestedPage, per_page: 50, search: search || undefined, item_status: filter || undefined } });
            if (requestId !== requestSequence.current) return;
            rowSavers.current.clear();
            setCount(response.data.data); setItems(response.data.items?.data || []); setPagination(response.data.items || {}); setPermissions(response.data.permissions || {});
        } catch (error) {
            if (requestId === requestSequence.current) setNotice({ tone: "error", text: requestMessage(error, "No se pudo abrir el conteo.") });
        } finally {
            if (requestId === requestSequence.current) setLoading(false);
        }
    };
    const registerSaver = (itemId, saver) => {
        if (saver) rowSavers.current.set(itemId, saver);
        else rowSavers.current.delete(itemId);
    };
    const handleItemSaved = (itemId, savedItem) => {
        const previous = items.find(row => row.id === itemId);
        const wasCounted = previous?.counted_quantity !== null && previous?.counted_quantity !== undefined;
        const hadDifference = previous?.difference !== null && Number(previous?.difference) !== 0;
        const hasDifference = savedItem?.difference !== null && Number(savedItem?.difference) !== 0;
        setItems(current => current.map(row => row.id === itemId ? { ...row, ...savedItem, product: row.product } : row));
        setCount(current => {
            if (!current) return current;
            const counted = Number(current.counted_items_count || 0) + (wasCounted ? 0 : 1);
            const differences = current.difference_items_count === null ? null : Math.max(0, Number(current.difference_items_count || 0) + (hasDifference ? 1 : 0) - (hadDifference ? 1 : 0));
            return { ...current, status: current.status === "draft" ? "counting" : current.status, counted_items_count: counted, difference_items_count: differences, progress: current.items_count ? Math.round((counted / current.items_count) * 1000) / 10 : 0 };
        });
    };
    const changePageSafely = async (nextPage) => {
        if (savingPage || nextPage === page) return;
        setSavingPage(true); setNotice(null);
        const savers = Array.from(rowSavers.current.values());
        const results = await Promise.all(savers.map(save => save()));
        if (results.some(result => result === false)) {
            setNotice({ tone: "error", text: "Hay cantidades que no pudieron guardarse. Corrígelas antes de cambiar de página." });
        } else {
            rowSavers.current.clear();
            setPage(nextPage);
        }
        setSavingPage(false);
    };
    useEffect(() => { const timer = setTimeout(() => load(page), search ? 280 : 0); return () => clearTimeout(timer); }, [id, page, filter, search]);
    const runAction = async (action, payload = undefined) => {
        setActing(true); setNotice(null);
        try {
            const response = await apiConfig.post(`${apiBaseURL.INVENTORY_COUNTS}/${id}/${action}`, payload);
            setNotice({ tone: "success", text: response.data.message }); await load(page);
            return true;
        } catch (error) {
            setNotice({ tone: "error", text: requestMessage(error, "No se pudo completar la acción.") });
            return false;
        } finally { setActing(false); }
    };
    const cancelCount = async (reason) => {
        const cancelled = await runAction("cancel", { cancel_reason: reason });
        if (cancelled) setShowCancel(false);
        return cancelled;
    };
    const editable = ["draft", "counting"].includes(count?.status) && permissions.can_perform;
    const progress = count?.progress || 0;

    return <main className="physical-count physical-count--workspace">
        <header className="pc-workspace-head"><button type="button" className="pc-back" onClick={() => navigate("/app/inventory-counts")}><i className="bi bi-arrow-left" /></button><div><span>CONTEO FÍSICO</span><h1>{count?.reference_code || "Cargando…"}</h1><p>{count?.warehouse?.name || "Bodega"} · {count?.category?.name || "Todos los productos"}</p></div>{count && <StatusBadge status={count.status} />}</header>
        {notice && <Notice tone={notice.tone} text={notice.text} onClose={() => setNotice(null)} />}
        {count && <section className="pc-workspace-summary pc-panel"><div className="pc-workspace-progress"><div><span>AVANCE DEL CONTEO</span><strong>{count.counted_items_count} de {count.items_count}</strong></div><div className="pc-progress pc-progress--large"><span><i style={{ width: `${progress}%` }} /></span><small>{progress}% completado</small></div></div><div className="pc-workspace-stat"><i className="bi bi-exclamation-diamond" /><span><small>Diferencias</small><strong>{count.difference_items_count === null ? "Oculto" : count.difference_items_count}</strong></span></div><div className="pc-workspace-stat"><i className={`bi ${count.blind_count ? "bi-eye-slash" : "bi-eye"}`} /><span><small>Modalidad</small><strong>{count.blind_count ? "Ciego" : "Visible"}</strong></span></div><div className="pc-workspace-actions">
            {permissions.can_cancel && <button className="pc-button pc-button--danger-light" disabled={acting} onClick={() => setShowCancel(true)}><i className="bi bi-x-circle" /> Cancelar conteo</button>}
            {editable && <button className="pc-button pc-button--primary" disabled={acting || count.counted_items_count < count.items_count} onClick={() => runAction("submit")}><i className="bi bi-send" /> Enviar a revisión</button>}
            {count.status === "review" && permissions.can_approve && <button className="pc-button pc-button--primary" disabled={acting} onClick={() => runAction("approve")}><i className="bi bi-check2-circle" /> Aprobar y ajustar</button>}
        </div></section>}
        {count?.status === "review" && <div className="pc-review-banner"><i className="bi bi-shield-check" /><div><strong>Revisión antes de ajustar</strong><span>Comprueba las diferencias. Si el stock cambió desde el inicio, EcuaPos impedirá la aprobación.</span></div></div>}
        <section className="pc-panel pc-counting-panel"><div className="pc-panel__title pc-counting-tools"><div><span>PRODUCTOS DEL CONTEO</span><h2>{pagination.total || 0} productos</h2></div><div className="pc-search"><i className="bi bi-search" /><input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Escanear o buscar producto" autoFocus /></div><select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}><option value="">Todos</option><option value="pending">Sin contar</option><option value="match">Sin diferencia</option><option value="difference">Con diferencia</option></select></div>
            <div className={`pc-table-wrap ${loading ? "is-loading" : ""}`}><table className="pc-table pc-count-table"><thead><tr><th>Producto</th><th>Esperado</th><th>Conteo físico</th><th>Diferencia</th><th>Observación</th><th /></tr></thead><tbody>{!loading && !items.length ? <tr><td colSpan="6"><EmptyState text="No hay productos con este filtro." /></td></tr> : items.map(item => <InventoryItemRow key={item.id} item={item} countId={id} editable={editable} onSaved={handleItemSaved} registerSaver={registerSaver} />)}</tbody></table>{loading && <div className="pc-loading"><span className="spinner-border" /><small>Cargando productos…</small></div>}</div><Pagination page={page} pagination={pagination} setPage={changePageSafely} busy={savingPage || loading} /></section>
        {showCancel && <CancelCountModal saving={acting} onClose={() => !acting && setShowCancel(false)} onConfirm={cancelCount} />}
    </main>;
};

const CancelCountModal = ({ saving, onClose, onConfirm }) => {
    const [reason, setReason] = useState("");
    const submit = async (event) => {
        event.preventDefault();
        if (reason.trim().length < 3) return;
        await onConfirm(reason.trim());
    };
    return <div className="pc-modal-backdrop" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}><section className="pc-modal pc-modal--cancel" role="dialog" aria-modal="true" aria-labelledby="cancel-count-title"><header><div className="pc-modal__icon pc-modal__icon--danger"><i className="bi bi-x-octagon" /></div><div><span>CANCELAR CONTEO</span><h2 id="cancel-count-title">¿Detener este conteo físico?</h2><p>Las cantidades registradas se conservarán como evidencia, pero no modificarán las existencias.</p></div><button type="button" disabled={saving} onClick={onClose}><i className="bi bi-x-lg" /></button></header><form onSubmit={submit}><label className="pc-notes pc-notes--flush"><span>Motivo de cancelación</span><textarea autoFocus required minLength="3" maxLength="500" value={reason} onChange={event => setReason(event.target.value)} placeholder="Ej.: Se inició con la bodega equivocada" /></label><div className="pc-cancel-warning"><i className="bi bi-shield-exclamation" /><span><strong>Esta acción no ajustará el stock.</strong><small>El conteo quedará bloqueado y visible en el historial para auditoría.</small></span></div><footer><button type="button" className="pc-button pc-button--light" disabled={saving} onClick={onClose}>Volver</button><button type="submit" className="pc-button pc-button--danger" disabled={saving || reason.trim().length < 3}>{saving ? "Cancelando…" : "Sí, cancelar conteo"}</button></footer></form></section></div>;
};

const InventoryItemRow = ({ item, countId, editable, onSaved, registerSaver }) => {
    const [quantity, setQuantity] = useState(item.counted_quantity ?? "");
    const [notes, setNotes] = useState(item.notes || "");
    const [savedQuantity, setSavedQuantity] = useState(item.counted_quantity ?? "");
    const [savedNotes, setSavedNotes] = useState(item.notes || "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const activeSave = useRef(null);
    useEffect(() => { setQuantity(item.counted_quantity ?? ""); setNotes(item.notes || ""); setSavedQuantity(item.counted_quantity ?? ""); setSavedNotes(item.notes || ""); }, [item.id, item.counted_quantity, item.notes]);
    const dirty = String(quantity) !== String(savedQuantity) || notes !== savedNotes;
    const save = async () => {
        if (activeSave.current) return activeSave.current;
        if (!dirty) return true;
        if (quantity === "" || Number(quantity) < 0) return false;
        activeSave.current = (async () => {
            setSaving(true); setError("");
            try {
                const response = await apiConfig.patch(`${apiBaseURL.INVENTORY_COUNTS}/${countId}/items/${item.id}`, { counted_quantity: Number(quantity), notes: notes || null });
                setSavedQuantity(quantity); setSavedNotes(notes); registerSaver(item.id, null); onSaved(item.id, response.data.data);
                return true;
            } catch (requestError) { setError(requestMessage(requestError, "No se pudo guardar.")); return false; }
            finally { setSaving(false); activeSave.current = null; }
        })();
        return activeSave.current;
    };
    registerSaver(item.id, dirty && quantity !== "" ? save : null);
    const difference = item.difference;
    const isPending = savedQuantity === "";
    return <tr className={`${item.has_stock_conflict ? "has-conflict" : ""} ${error ? "has-error" : ""} ${isPending ? "is-pending" : "is-counted"}`}><td data-label="Producto"><div className="pc-product"><span>{(item.product?.name || "P").charAt(0)}</span><div><strong>{item.product?.name}{item.product?.variation ? ` · ${item.product.variation}` : ""}</strong><small>{item.product?.code} · {item.product?.category || "Sin categoría"}</small>{item.has_stock_conflict && <em><i className="bi bi-exclamation-triangle" /> El stock actual cambió</em>}</div></div></td><td data-label="Esperado">{item.expected_quantity === null ? <span className="pc-hidden-stock"><i className="bi bi-eye-slash" /> Oculto</span> : <><strong>{formatNumber(item.expected_quantity)}</strong><small>{item.product?.unit}</small></>}</td><td data-label="Conteo físico"><div className={`pc-quantity-input ${isPending ? "is-pending" : "is-counted"}`}><input type="number" min="0" step="any" value={quantity} disabled={!editable || saving} onChange={e => setQuantity(e.target.value)} onBlur={() => dirty && save()} onKeyDown={e => { if (e.key === "Enter" && dirty) { e.preventDefault(); save(); } }} placeholder="Sin contar" /><span>{item.product?.unit}</span></div><small className={`pc-count-state ${isPending ? "is-pending" : "is-counted"}`}><i className={`bi ${isPending ? "bi-circle" : "bi-check-circle-fill"}`} />{isPending ? "Pendiente" : `Registrado: ${formatNumber(savedQuantity)}`}</small></td><td data-label="Diferencia">{difference === null ? <span>—</span> : <strong className={difference === 0 ? "pc-number--ok" : "pc-number--warn"}>{difference > 0 ? "+" : ""}{formatNumber(difference)}</strong>}</td><td data-label="Observación"><input className="pc-note-input" value={notes} disabled={!editable || saving} onChange={e => setNotes(e.target.value)} onBlur={() => dirty && quantity !== "" && save()} placeholder="Opcional" />{error && <small className="pc-row-error">{error}</small>}</td><td>{editable && <button type="button" className={`pc-save ${dirty ? "is-dirty" : ""}`} disabled={!dirty || saving || quantity === ""} onClick={save} title={dirty ? "Guardar cantidad" : "Cantidad guardada"}>{saving ? <span className="spinner-border spinner-border-sm" /> : <i className={`bi ${dirty ? "bi-check2" : "bi-cloud-check"}`} />}</button>}</td></tr>;
};

const StatusBadge = ({ status }) => { const value = STATUS[status] || STATUS.draft; return <span className={`pc-status pc-status--${value.tone}`}><i className={`bi ${value.icon}`} />{value.label}</span>; };
const Notice = ({ tone, text, onClose }) => <div className={`pc-notice pc-notice--${tone}`}><i className={`bi ${tone === "success" ? "bi-check2-circle" : "bi-exclamation-triangle"}`} /><span>{text}</span>{onClose && <button type="button" onClick={onClose}><i className="bi bi-x" /></button>}</div>;
const EmptyState = ({ text = "Todavía no existen conteos físicos." }) => <div className="pc-empty"><span><i className="bi bi-clipboard2-data" /></span><strong>Sin registros</strong><small>{text}</small></div>;
const Pagination = ({ page, pagination, setPage, busy = false }) => <footer className="pc-pagination"><span><strong>{pagination.total || 0}</strong> registros{busy && <small className="pc-pagination__saving"><span className="spinner-border spinner-border-sm" /> Actualizando página…</small>}</span><div><button type="button" disabled={busy || page <= 1} onClick={() => setPage(Math.max(1, page - 1))}><i className="bi bi-chevron-left" /> Anterior</button><small>{page} / {pagination.last_page || 1}</small><button type="button" disabled={busy || page >= (pagination.last_page || 1)} onClick={() => setPage(Math.min(pagination.last_page || 1, page + 1))}>Siguiente <i className="bi bi-chevron-right" /></button></div></footer>;
const formatDate = value => value ? new Intl.DateTimeFormat("es-EC", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";
const formatNumber = value => new Intl.NumberFormat("es-EC", { maximumFractionDigits: 4 }).format(Number(value || 0));

const mapStateToProps = ({ warehouses, productCategories }) => ({ warehouses, productCategories });
export default connect(mapStateToProps, { fetchAllWarehouses, fetchAllProductCategories })(InventoryCounts);
