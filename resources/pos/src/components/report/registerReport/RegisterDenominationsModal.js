import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import Modal from "react-bootstrap/Modal";
import apiConfig from "../../../config/apiConfig";
import { currencySymbolHandling, getAvatarName } from "../../../shared/sharedMethod";

const movementLabels = {
    OPENING: "Apertura", MANUAL_INCOME: "Ingreso manual", MANUAL_EXPENSE: "Egreso manual", WITHDRAWAL: "Retiro",
    SALE_PAYMENT: "Venta en efectivo", EXPENSE_PAYMENT: "Gasto desde caja", CASH_REFUND: "Reembolso",
    REVERSAL: "Reversión", TRANSFER_IN: "Transferencia recibida", TRANSFER_OUT: "Transferencia enviada",
};

const RegisterDenominationsModal = ({ show, onHide, register, currencySymbol, allConfigData }) => {
    const [movements, setMovements] = useState([]);
    const [movementSummary, setMovementSummary] = useState({});
    const [movementMeta, setMovementMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [movementPage, setMovementPage] = useState(1);
    const [movementType, setMovementType] = useState("");
    const [movementSearch, setMovementSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState("");

    const loadMovements = useCallback(async () => {
        if (!show || !register?.id) return;
        setLoading(true); setLoadError("");
        try {
            const response = await apiConfig.get(`register-report/${register.id}/movements`, { params: { "page[number]": movementPage, per_page: 8, type: movementType || undefined, search: movementSearch || undefined } });
            setMovements(response.data?.data || []);
            setMovementSummary(response.data?.summary || {});
            setMovementMeta({ current_page: response.data?.current_page || 1, last_page: response.data?.last_page || 1, total: response.data?.total || 0 });
        } catch (error) { setLoadError(error?.response?.data?.message || "No fue posible cargar los movimientos."); }
        finally { setLoading(false); }
    }, [show, register?.id, movementPage, movementType, movementSearch]);

    useEffect(() => { const timer = setTimeout(loadMovements, movementSearch ? 300 : 0); return () => clearTimeout(timer); }, [loadMovements]);
    useEffect(() => { setMovementPage(1); setMovementType(""); setMovementSearch(""); }, [register?.id]);

    if (!register) return null;
    const money = (value) => currencySymbolHandling(allConfigData, currencySymbol, Number(value || 0));
    const difference = Number(register.cash_difference ?? (Number(register.cash_in_hand_while_closing) - Number(register.expected_cash)));
    const status = Math.abs(difference) <= 0.009 ? { label: "Caja cuadrada", tone: "success", icon: "bi-check-circle" } : difference > 0 ? { label: "Sobrante registrado", tone: "warning", icon: "bi-exclamation-triangle" } : { label: "Faltante registrado", tone: "danger", icon: "bi-exclamation-triangle" };
    const fullName = `${register.user_first_name || ""} ${register.user_last_name || ""}`.trim();
    const duration = Number(register.duration_minutes || 0);
    const durationLabel = duration ? `${Math.floor(duration / 60)} h ${duration % 60} min` : "Sin duración";
    const denominations = (list) => ({ rows: list || [], total: (list || []).reduce((sum, item) => sum + Number(item.subtotal ?? Number(item.value) * Number(item.quantity)), 0) });
    const opening = denominations(register.opening_denominations);
    const closing = denominations(register.closing_denominations);
    const paymentMethods = [
        ["Efectivo recibido", Number(register.total_amount || 0) - Number(register.bank_transfer || 0) - Number(register.cheque || 0) - Number(register.other || 0), "bi-cash-stack"],
        ["Transferencias", register.bank_transfer, "bi-bank"], ["Cheques", register.cheque, "bi-receipt"], ["Otros", register.other, "bi-grid"],
    ];

    const renderDenominations = (title, data) => <section className="report-denomination-card">
        <header><div><span>{title}</span><small>{data.rows.length ? `${data.rows.length} denominaciones` : "Sin desglose"}</small></div><strong>{money(data.total)}</strong></header>
        {data.rows.length ? <div className="report-denomination-grid">{data.rows.map((item, index) => <div key={`${item.value}-${index}`}><b>{money(item.value)}</b><span>× {item.quantity}</span><strong>{money(item.subtotal ?? Number(item.value) * Number(item.quantity))}</strong></div>)}</div> : <p>No se registraron billetes o monedas para este momento.</p>}
    </section>;

    return <Modal show={show} onHide={onHide} size="xl" centered dialogClassName="register-detail-dialog">
        <div className="register-detail-modal">
            <Modal.Header closeButton>
                <div className="register-detail-title"><span className="report-title-icon"><i className="bi bi-safe2" /></span><div><small>CIERRE DE TURNO</small><h2>{register.cash_register?.name || "Caja sin asignar"}</h2><p>{register.cash_register?.code || `Turno #${register.id}`} · {register.warehouse?.name || "Sin almacén"}</p></div></div>
            </Modal.Header>
            <Modal.Body>
                <section className="register-detail-identity">
                    <div className="report-user report-user-large"><span>{register.user_image ? <img src={register.user_image} alt={fullName} /> : getAvatarName(fullName)}</span><div><small>Responsable del turno</small><b>{fullName || "Usuario"}</b><p>{register.user_email}</p></div></div>
                    <div><small>Apertura</small><b>{register.open_date} · {register.open_time}</b></div><i className="bi bi-arrow-right" /><div><small>Cierre</small><b>{register.close_date} · {register.close_time}</b></div><span className="report-duration"><i className="bi bi-clock" /> {durationLabel}</span>
                </section>

                <section className={`register-detail-result ${status.tone}`}>
                    <div><span><i className={`bi ${status.icon}`} /></span><div><small>RESULTADO DEL ARQUEO</small><h3>{status.label}</h3><p>Esperado {money(register.expected_cash)} · Contado {money(register.cash_in_hand_while_closing)}</p></div></div>
                    <strong>{difference > 0 ? "+" : ""}{money(difference)}</strong>
                </section>

                <div className="register-detail-grid">
                    <section className="register-detail-card report-equation"><header><i className="bi bi-calculator" /><div><h3>Resumen de efectivo</h3><p>Cómo quedó compuesto el arqueo.</p></div></header><div><span>Fondo de apertura<b>{money(register.cash_in_hand)}</b></span><span>Efectivo esperado<b>{money(register.expected_cash)}</b></span><span>Efectivo contado<b>{money(register.cash_in_hand_while_closing)}</b></span><span className={status.tone}>Diferencia<b>{difference > 0 ? "+" : ""}{money(difference)}</b></span></div></section>
                    <section className="register-detail-card"><header><i className="bi bi-credit-card" /><div><h3>Medios de pago</h3><p>Valores consolidados al cierre.</p></div></header><div className="report-payment-grid">{paymentMethods.map(([label, value, icon]) => <div key={label}><i className={`bi ${icon}`} /><span>{label}<b>{money(value)}</b></span></div>)}</div></section>
                </div>

                <div className="register-denominations-layout">{renderDenominations("Apertura", opening)}{renderDenominations("Cierre", closing)}</div>

                {(register.discrepancy_reason || register.notes || register.review_note) && <section className="register-detail-notes">
                    {register.discrepancy_reason && <div><span>Motivo de diferencia</span><b>{register.discrepancy_reason}</b><p>{register.discrepancy_note}</p></div>}
                    {register.notes && <div><span>Nota del cierre</span><p>{register.notes}</p></div>}
                    {register.review_note && <div><span>Revisión de supervisión</span><b>{register.reconciliation_status === "APPROVED" ? "Aprobada" : "Rechazada"}</b><p>{register.review_note}</p></div>}
                </section>}

                <section className="register-movements-card">
                    <header><div><span className="report-card-icon"><i className="bi bi-list-ul" /></span><div><h3>Movimientos del turno</h3><p>{movementMeta.total || 0} registros vinculados a este cierre.</p></div></div><div className="register-movement-filters"><label><i className="bi bi-search" /><input value={movementSearch} onChange={(event) => { setMovementPage(1); setMovementSearch(event.target.value); }} placeholder="Buscar referencia…" /></label><select value={movementType} onChange={(event) => { setMovementPage(1); setMovementType(event.target.value); }}><option value="">Todos los tipos</option>{Object.entries(movementLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div></header>
                    <div className="report-movement-summary"><span>Ventas en efectivo <b>{money(movementSummary.cash_sales)}</b></span><span>Ingresos manuales <b>{money(movementSummary.manual_income)}</b></span><span>Salidas <b>{money(movementSummary.total_out)}</b></span><span>Reembolsos <b>{money(movementSummary.refunds)}</b></span></div>
                    <div className="report-movement-list">
                        {loading && <div className="report-movement-empty"><span className="spinner-border spinner-border-sm" /> Cargando movimientos…</div>}
                        {!loading && loadError && <div className="report-movement-empty text-danger">{loadError}</div>}
                        {!loading && !loadError && !movements.length && <div className="report-movement-empty">No hay movimientos para estos filtros.</div>}
                        {!loading && movements.map((movement) => <article key={movement.id}><span className={`movement-direction ${movement.direction === "IN" ? "in" : "out"}`}><i className={`bi bi-arrow-${movement.direction === "IN" ? "down-left" : "up-right"}`} /></span><div><b>{movementLabels[movement.type] || movement.type}</b><p>{movement.description || "Sin descripción"}</p><small>{dayjs(movement.created_at).format("DD/MM/YYYY · HH:mm")} {movement.reference ? `· Ref. ${movement.reference}` : ""}</small></div><strong className={movement.direction === "IN" ? "in" : "out"}>{movement.direction === "IN" ? "+" : "−"}{money(movement.amount)}</strong></article>)}
                    </div>
                    {movementMeta.last_page > 1 && <footer className="register-movement-pagination"><button disabled={movementPage <= 1 || loading} onClick={() => setMovementPage((page) => page - 1)}><i className="bi bi-chevron-left" /></button><span>Página {movementPage} de {movementMeta.last_page}</span><button disabled={movementPage >= movementMeta.last_page || loading} onClick={() => setMovementPage((page) => page + 1)}><i className="bi bi-chevron-right" /></button></footer>}
                </section>
            </Modal.Body>
            <Modal.Footer><button className="btn report-print-button" onClick={() => window.print()}><i className="bi bi-printer" /> Imprimir cierre</button><button className="btn report-close-button" onClick={onHide}>Cerrar</button></Modal.Footer>
        </div>
    </Modal>;
};

export default RegisterDenominationsModal;
