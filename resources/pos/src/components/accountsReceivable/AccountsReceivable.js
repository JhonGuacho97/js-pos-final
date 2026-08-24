import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import MasterLayout from '../MasterLayout';
import TabTitle from '../../shared/tab-title/TabTitle';
import TopProgressBar from '../../shared/components/loaders/TopProgressBar';
import apiConfig from '../../config/apiConfig';
import { addToast } from '../../store/action/toastAction';
import { toastType } from '../../constants';
import './accounts-receivable.scss';

const statusLabels = {
    overdue: ['Vencida', 'is-overdue'], due_today: ['Vence hoy', 'is-today'],
    due_soon: ['Próxima', 'is-soon'], current: ['Al día', 'is-current'], unassigned: ['Sin vencimiento', 'is-neutral'],
};
const paymentNames = { 1: 'Efectivo', 2: 'Cheque', 3: 'Transferencia', 4: 'Otro' };
const activityNames = { contact: 'Contacto realizado', promise: 'Promesa de pago', note: 'Nota interna' };
const activityIcons = { contact: 'bi-telephone', promise: 'bi-calendar2-check', note: 'bi-journal-text' };
const initialMeta = { current_page: 1, last_page: 1, from: 0, to: 0, total: 0 };

const AccountsReceivable = () => {
    const dispatch = useDispatch();
    const currency = useSelector((state) => state.frontSetting?.value?.currency_symbol || '$');
    // `config` contiene los permisos efectivos del usuario en la tienda
    // activa. `permissions` es el catálogo global usado al editar roles y
    // no debe decidir qué acciones puede ejecutar esta pantalla.
    const permissions = useSelector((state) => Array.isArray(state.config) ? state.config : []);
    const canCollect = permissions.includes('collect_accounts_receivable');
    const canManage = permissions.includes('manage_accounts_receivable');
    const [rows, setRows] = useState([]);
    const [customerRows, setCustomerRows] = useState([]);
    const [meta, setMeta] = useState(initialMeta);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({ search: '', status: '' });
    const [appliedFilters, setAppliedFilters] = useState({ search: '', status: '' });
    const [viewMode, setViewMode] = useState('documents');
    const [selected, setSelected] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [payment, setPayment] = useState({ payment_date: new Date().toISOString().slice(0, 10), payment_type: 1, amount: '', reference: '' });
    const [terms, setTerms] = useState({ payment_due_date: '', payment_terms_days: '', collection_note: '' });
    const [activity, setActivity] = useState({ type: 'contact', note: '', promised_payment_date: '', promised_amount: '' });
    const [customerPayment, setCustomerPayment] = useState({ payment_date: new Date().toISOString().slice(0, 10), payment_type: 1, amount: '', reference: '' });

    const query = useMemo(() => {
        const params = new URLSearchParams({ page: String(page), per_page: '15' });
        if (appliedFilters.search) params.set('search', appliedFilters.search);
        if (appliedFilters.status) params.set('status', appliedFilters.status);
        return params.toString();
    }, [page, appliedFilters]);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const listEndpoint = viewMode === 'customers' ? 'accounts-receivable/customers' : 'accounts-receivable';
            const [listResponse, summaryResponse] = await Promise.all([
                apiConfig.get(`${listEndpoint}?${query}`),
                apiConfig.get(`accounts-receivable/summary?${query.replace(/(?:^|&)page=[^&]*/g, '').replace(/(?:^|&)per_page=[^&]*/g, '')}`),
            ]);
            if (viewMode === 'customers') setCustomerRows(listResponse.data.data || []);
            else setRows(listResponse.data.data || []);
            setMeta({ ...initialMeta, ...listResponse.data });
            setSummary(summaryResponse.data.data);
        } catch (error) {
            dispatch(addToast({ text: error?.response?.data?.message || 'No se pudo cargar la cartera.', type: toastType.ERROR }));
        } finally { setLoading(false); }
    }, [dispatch, query, viewMode]);

    useEffect(() => { load(); }, [load]);

    useEffect(() => {
        if (!selected && !selectedCustomer) return undefined;
        const oldOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const close = (event) => event.key === 'Escape' && !saving && (setSelected(null), setSelectedCustomer(null));
        document.addEventListener('keydown', close);
        return () => { document.body.style.overflow = oldOverflow; document.removeEventListener('keydown', close); };
    }, [selected, selectedCustomer, saving]);

    const money = (value) => `${currency}${Number(value || 0).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const apiError = (error, fallback) => {
        const errors = error?.response?.data?.errors;
        return errors ? Object.values(errors).flat()[0] : (error?.response?.data?.message || fallback);
    };

    const openDetail = async (row) => {
        setLoading(true);
        try {
            const response = await apiConfig.get(`accounts-receivable/${row.id}`);
            const detail = response.data.data;
            setSelected(detail);
            setPayment((current) => ({ ...current, amount: String(detail.balance) }));
            setTerms({
                payment_due_date: detail.payment_due_date || '',
                payment_terms_days: detail.payment_terms_days ?? '',
                collection_note: detail.collection_note || '',
            });
            setActivity({ type: 'contact', note: '', promised_payment_date: '', promised_amount: '' });
        } catch (error) {
            dispatch(addToast({ text: apiError(error, 'No se pudo abrir el detalle.'), type: toastType.ERROR }));
        } finally { setLoading(false); }
    };

    const submitPayment = async (event) => {
        event.preventDefault();
        if (Number(payment.amount) <= 0 || Number(payment.amount) > Number(selected.balance)) {
            dispatch(addToast({ text: 'El abono debe ser mayor a cero y no superar el saldo pendiente.', type: toastType.ERROR }));
            return;
        }
        setSaving(true);
        try {
            await apiConfig.post(`accounts-receivable/${selected.id}/payments`, payment);
            dispatch(addToast({ text: 'Cobro registrado correctamente.' }));
            setSelected(null);
            await load();
        } catch (error) {
            dispatch(addToast({ text: apiError(error, 'No se pudo registrar el cobro.'), type: toastType.ERROR }));
        } finally { setSaving(false); }
    };

    const saveTerms = async () => {
        setSaving(true);
        try {
            await apiConfig.patch(`accounts-receivable/${selected.id}/terms`, terms);
            dispatch(addToast({ text: 'Vencimiento y nota actualizados.' }));
            setSelected({ ...selected, ...terms });
            await load();
        } catch (error) {
            dispatch(addToast({ text: apiError(error, 'No se pudieron guardar las condiciones.'), type: toastType.ERROR }));
        } finally { setSaving(false); }
    };

    const submitActivity = async (event) => {
        event.preventDefault();
        if (activity.type === 'promise' && (!activity.promised_payment_date || Number(activity.promised_amount) <= 0)) {
            dispatch(addToast({ text: 'Indica la fecha y el monto prometido.', type: toastType.ERROR }));
            return;
        }
        setSaving(true);
        try {
            const response = await apiConfig.post(`accounts-receivable/${selected.id}/activities`, activity);
            setSelected((current) => ({ ...current, activities: [response.data.data, ...(current.activities || [])] }));
            setActivity({ type: 'contact', note: '', promised_payment_date: '', promised_amount: '' });
            dispatch(addToast({ text: 'Seguimiento agregado a la bitácora.' }));
            await load();
        } catch (error) {
            dispatch(addToast({ text: apiError(error, 'No se pudo guardar el seguimiento.'), type: toastType.ERROR }));
        } finally { setSaving(false); }
    };

    const openWhatsApp = () => {
        const rawPhone = String(selected?.customer?.phone || '').replace(/\D/g, '');
        if (!rawPhone) {
            dispatch(addToast({ text: 'El cliente no tiene un teléfono registrado.', type: toastType.ERROR }));
            return;
        }
        const phone = rawPhone.startsWith('0') ? `593${rawPhone.slice(1)}` : rawPhone;
        const due = selected.payment_due_date ? `, con vencimiento el ${selected.payment_due_date}` : '';
        const message = `Hola ${selected.customer.name}, le recordamos que el documento ${selected.reference_code} mantiene un saldo pendiente de ${money(selected.balance)}${due}. Por favor, indíquenos cuándo podríamos contar con su pago. Gracias.`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    };

    const openCustomerStatement = async (row) => {
        setLoading(true);
        try {
            const response = await apiConfig.get(`accounts-receivable/customers/${row.customer.id}/statement`);
            const statement = response.data.data;
            setSelectedCustomer(statement);
            setCustomerPayment((current) => ({ ...current, amount: String(statement.summary.total_receivable) }));
        } catch (error) {
            dispatch(addToast({ text: apiError(error, 'No se pudo abrir el estado de cuenta.'), type: toastType.ERROR }));
        } finally { setLoading(false); }
    };

    const submitCustomerPayment = async (event) => {
        event.preventDefault();
        const amount = Number(customerPayment.amount);
        if (amount <= 0 || amount > Number(selectedCustomer.summary.total_receivable)) {
            dispatch(addToast({ text: 'El cobro debe ser mayor a cero y no superar la deuda consolidada.', type: toastType.ERROR }));
            return;
        }
        setSaving(true);
        try {
            const response = await apiConfig.post(`accounts-receivable/customers/${selectedCustomer.customer.id}/payments`, customerPayment);
            const allocations = response.data.data?.allocations?.length || 0;
            dispatch(addToast({ text: `Cobro aplicado correctamente a ${allocations} documento${allocations === 1 ? '' : 's'}.` }));
            setSelectedCustomer(null);
            await load();
        } catch (error) {
            dispatch(addToast({ text: apiError(error, 'No se pudo aplicar el cobro consolidado.'), type: toastType.ERROR }));
        } finally { setSaving(false); }
    };

    const shareCustomerStatement = () => {
        const rawPhone = String(selectedCustomer?.customer?.phone || '').replace(/\D/g, '');
        if (!rawPhone) {
            dispatch(addToast({ text: 'El cliente no tiene un teléfono registrado.', type: toastType.ERROR }));
            return;
        }
        const phone = rawPhone.startsWith('0') ? `593${rawPhone.slice(1)}` : rawPhone;
        const message = `Hola ${selectedCustomer.customer.name}, su estado de cuenta registra ${selectedCustomer.summary.documents} documento${selectedCustomer.summary.documents === 1 ? '' : 's'} pendiente${selectedCustomer.summary.documents === 1 ? '' : 's'}, por un total de ${money(selectedCustomer.summary.total_receivable)}. Saldo vencido: ${money(selectedCustomer.summary.overdue)}. Estamos atentos para coordinar su pago. Gracias.`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    };

    const aging = summary?.aging || {};
    const agingTotal = Math.max(1, Number(summary?.total_receivable || 0));

    return <>
        <MasterLayout>
            <TabTitle title="Cuentas por cobrar" />
            {loading && <TopProgressBar />}
            <main className="ar-module">
                <header className="ar-heading">
                    <div><span>GESTIÓN DE CARTERA</span><h1>Cuentas por cobrar</h1><p>Controla vencimientos, saldos y abonos pendientes en un solo lugar.</p></div>
                    <button className="btn btn-light" onClick={load} disabled={loading}><i className="bi bi-arrow-clockwise" /> Actualizar</button>
                </header>

                <section className="ar-metrics">
                    <article className="is-primary"><div><i className="bi bi-wallet2" /></div><span>Cartera pendiente<small>{summary?.documents || 0} documentos</small></span><strong>{money(summary?.total_receivable)}</strong></article>
                    <article className="is-danger"><div><i className="bi bi-exclamation-circle" /></div><span>Saldo vencido<small>Requiere seguimiento</small></span><strong>{money(summary?.overdue)}</strong></article>
                    <article className="is-warning"><div><i className="bi bi-calendar-event" /></div><span>Vence hoy<small>Cobros del día</small></span><strong>{money(summary?.due_today)}</strong></article>
                    <article className="is-success"><div><i className="bi bi-people" /></div><span>Clientes con saldo<small>Cartera activa</small></span><strong>{summary?.customers || 0}</strong></article>
                </section>

                <section className="ar-aging">
                    <div className="ar-section-title"><div><i className="bi bi-bar-chart" /></div><span><strong>Antigüedad de cartera</strong><small>Distribución del saldo según días de atraso.</small></span></div>
                    <div className="ar-aging-bar">
                        {Object.entries(aging).map(([key, value]) => Number(value) > 0 && <span key={key} className={`bucket-${key}`} style={{ width: `${(Number(value) / agingTotal) * 100}%` }} />)}
                    </div>
                    <div className="ar-aging-labels">
                        {[['current', 'Al día'], ['1_30', '1–30 días'], ['31_60', '31–60 días'], ['61_90', '61–90 días'], ['over_90', '+90 días']].map(([key, label]) => <div key={key}><i className={`bucket-${key}`} /><span>{label}<strong>{money(aging[key])}</strong></span></div>)}
                    </div>
                </section>

                <section className="ar-list-card">
                    <div className="ar-view-tabs"><button className={viewMode === 'documents' ? 'is-active' : ''} onClick={() => { setViewMode('documents'); setPage(1); }}><i className="bi bi-receipt" /> Por documento</button><button className={viewMode === 'customers' ? 'is-active' : ''} onClick={() => { setViewMode('customers'); setPage(1); }}><i className="bi bi-people" /> Por cliente</button></div>
                    <div className="ar-list-toolbar">
                        <div><h2>{viewMode === 'customers' ? 'Cartera consolidada' : 'Documentos pendientes'}</h2><p>{viewMode === 'customers' ? 'Revisa la deuda completa y cobra varias facturas a la vez.' : 'Busca por cliente, identificación o número de venta.'}</p></div>
                        <form onSubmit={(event) => { event.preventDefault(); setPage(1); setAppliedFilters(filters); }}>
                            <label className="ar-search"><i className="bi bi-search" /><input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Buscar cliente o documento" /></label>
                            <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}><option value="">Todos los vencimientos</option><option value="overdue">Vencidos</option><option value="due_today">Vence hoy</option><option value="current">Por vencer</option></select>
                            <button className="btn btn-primary">Filtrar</button>
                        </form>
                    </div>
                    <div className="ar-table-wrap">
                        {viewMode === 'documents' ? <table><thead><tr><th>Cliente / documento</th><th>Emisión</th><th>Vencimiento</th><th>Total</th><th>Abonado</th><th>Saldo</th><th /></tr></thead>
                        <tbody>{rows.map((row) => {
                            const status = statusLabels[row.collection_status] || statusLabels.unassigned;
                            return <tr key={row.id}>
                                <td><strong>{row.customer?.name || 'Sin cliente'}</strong><small>{row.reference_code} · {row.customer?.identification || 'Sin identificación'}</small>{row.latest_activity && <small className="ar-last-activity"><i className={`bi ${activityIcons[row.latest_activity.type] || 'bi-journal-text'}`} /> {activityNames[row.latest_activity.type] || 'Seguimiento'} · {new Date(row.latest_activity.contacted_at).toLocaleDateString('es-EC')}</small>}</td>
                                <td data-label="Emisión">{row.date}</td>
                                <td data-label="Vencimiento"><span className={`ar-status ${status[1]}`}>{status[0]}</span><small>{row.payment_due_date || 'No definida'}{row.days_overdue > 0 ? ` · ${row.days_overdue} días` : ''}</small></td>
                                <td data-label="Total">{money(row.grand_total)}</td><td data-label="Abonado">{money(row.paid_total + row.credited_total)}</td><td className="ar-balance" data-label="Saldo">{money(row.balance)}</td>
                                <td><button className="ar-detail-btn" onClick={() => openDetail(row)}>Revisar <i className="bi bi-arrow-right" /></button></td>
                            </tr>;
                        })}{!loading && !rows.length && <tr><td colSpan="7"><div className="ar-empty"><i className="bi bi-check2-circle" /><strong>No hay cuentas pendientes</strong><span>La cartera coincide con los filtros seleccionados.</span></div></td></tr>}</tbody></table> : <table className="ar-customer-table"><thead><tr><th>Cliente</th><th>Documentos</th><th>Vencido</th><th>Mayor atraso</th><th>Deuda total</th><th /></tr></thead><tbody>{customerRows.map((row) => <tr key={row.customer.id}><td><strong>{row.customer.name}</strong><small>{row.customer.identification || 'Sin identificación'} · {row.customer.phone || 'Sin teléfono'}</small>{row.latest_activity && <small className="ar-last-activity"><i className={`bi ${activityIcons[row.latest_activity.type] || 'bi-journal-text'}`} /> Última gestión: {new Date(row.latest_activity.contacted_at).toLocaleDateString('es-EC')}</small>}</td><td data-label="Documentos"><strong>{row.documents}</strong><small>{row.overdue_documents} vencidos</small></td><td data-label="Vencido" className={row.overdue_balance > 0 ? 'ar-overdue-value' : ''}>{money(row.overdue_balance)}</td><td data-label="Mayor atraso">{row.max_days_overdue > 0 ? `${row.max_days_overdue} días` : 'Al día'}</td><td data-label="Deuda total" className="ar-balance">{money(row.total_receivable)}</td><td><button className="ar-detail-btn" onClick={() => openCustomerStatement(row)}>Estado de cuenta <i className="bi bi-arrow-right" /></button></td></tr>)}{!loading && !customerRows.length && <tr><td colSpan="6"><div className="ar-empty"><i className="bi bi-people" /><strong>No hay clientes con saldo</strong><span>La cartera coincide con los filtros seleccionados.</span></div></td></tr>}</tbody></table>}
                    </div>
                    {meta.last_page > 1 && <footer className="ar-pagination"><span>Mostrando {meta.from || 0}–{meta.to || 0} de {meta.total || 0}</span><div><button disabled={page <= 1 || loading} onClick={() => setPage(page - 1)}><i className="bi bi-chevron-left" /></button><strong>{page} / {meta.last_page}</strong><button disabled={page >= meta.last_page || loading} onClick={() => setPage(page + 1)}><i className="bi bi-chevron-right" /></button></div></footer>}
                </section>
            </main>
        </MasterLayout>

        {selected && createPortal(<div className="ar-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !saving && setSelected(null)}>
            <section className="ar-modal" role="dialog" aria-modal="true" aria-labelledby="ar-modal-title">
                <header><div className="ar-modal-icon"><i className="bi bi-receipt" /></div><div><span>DOCUMENTO POR COBRAR</span><h2 id="ar-modal-title">{selected.customer?.name}</h2><p>{selected.reference_code} · emitida {selected.date}</p></div><button disabled={saving} onClick={() => setSelected(null)} aria-label="Cerrar"><i className="bi bi-x-lg" /></button></header>
                <div className="ar-modal-body">
                    <div className="ar-modal-summary"><div><span>Total</span><strong>{money(selected.grand_total)}</strong></div><div><span>Pagado / acreditado</span><strong>{money(selected.paid_total + selected.credited_total)}</strong></div><div className="is-balance"><span>Saldo pendiente</span><strong>{money(selected.balance)}</strong></div></div>
                    <div className="ar-contact-bar"><div><i className="bi bi-person-circle" /><span><strong>{selected.customer?.identification || 'Sin identificación'}</strong><small>{selected.customer?.phone || 'Sin teléfono'} · {selected.customer?.email || 'Sin correo'}</small></span></div><button type="button" onClick={openWhatsApp}><i className="bi bi-whatsapp" /> Enviar recordatorio</button></div>
                    <div className="ar-modal-columns">
                        <div className="ar-panel"><div className="ar-panel-title"><i className="bi bi-clock-history" /><span><strong>Historial de abonos</strong><small>Movimientos aplicados a esta venta.</small></span></div><div className="ar-payment-history">{selected.payments?.map((item) => <div key={item.id}><i className="bi bi-check2" /><span><strong>{paymentNames[item.payment_type] || 'Otro'}</strong><small>{item.payment_date}{item.reference ? ` · ${item.reference}` : ''}</small></span><b>{money(item.amount)}</b></div>)}{!selected.payments?.length && <p>Aún no hay abonos registrados.</p>}</div></div>
                        {canCollect && <form className="ar-panel ar-payment-form" onSubmit={submitPayment}><div className="ar-panel-title"><i className="bi bi-cash-coin" /><span><strong>Registrar cobro</strong><small>El efectivo se atribuirá a la caja activa.</small></span></div><div className="ar-form-grid"><label>Monto<div className="ar-money-input"><span>{currency}</span><input required type="number" min="0.01" max={selected.balance} step="0.01" value={payment.amount} onChange={(event) => setPayment({ ...payment, amount: event.target.value })} /></div></label><label>Forma de pago<select value={payment.payment_type} onChange={(event) => setPayment({ ...payment, payment_type: Number(event.target.value) })}><option value="1">Efectivo</option><option value="2">Cheque</option><option value="3">Transferencia</option><option value="4">Otro</option></select></label><label>Fecha<input required type="date" value={payment.payment_date} onChange={(event) => setPayment({ ...payment, payment_date: event.target.value })} /></label><label>Referencia<input maxLength="255" value={payment.reference} onChange={(event) => setPayment({ ...payment, reference: event.target.value })} placeholder="Opcional" /></label></div><button className="btn btn-primary" disabled={saving}>{saving ? 'Registrando...' : 'Confirmar abono'}</button></form>}
                    </div>
                    <div className="ar-follow-up-grid">
                        <div className="ar-panel ar-timeline"><div className="ar-panel-title"><i className="bi bi-list-check" /><span><strong>Bitácora de cobranza</strong><small>Historial inalterable de contactos y compromisos.</small></span></div><div className="ar-activity-list">{selected.activities?.map((item) => <article key={item.id}><i className={`bi ${activityIcons[item.type] || 'bi-journal-text'}`} /><div><strong>{activityNames[item.type] || 'Seguimiento'}</strong><small>{new Date(item.contacted_at).toLocaleString('es-EC')}{item.user?.name ? ` · ${item.user.name}` : ''}</small><p>{item.note}</p>{item.type === 'promise' && <span>Compromiso: {money(item.promised_amount)} para el {item.promised_payment_date}</span>}</div></article>)}{!selected.activities?.length && <p className="ar-no-activity">Todavía no se han registrado gestiones de cobro.</p>}</div></div>
                        {(canCollect || canManage) && <form className="ar-panel ar-activity-form" onSubmit={submitActivity}><div className="ar-panel-title"><i className="bi bi-plus-circle" /><span><strong>Nuevo seguimiento</strong><small>Registra lo conversado con el cliente.</small></span></div><label>Resultado de la gestión<select value={activity.type} onChange={(event) => setActivity({ ...activity, type: event.target.value })}><option value="contact">Contacto realizado</option><option value="promise">Promesa de pago</option><option value="note">Nota interna</option></select></label>{activity.type === 'promise' && <div className="ar-promise-fields"><label>Fecha prometida<input required type="date" value={activity.promised_payment_date} onChange={(event) => setActivity({ ...activity, promised_payment_date: event.target.value })} /></label><label>Monto prometido<div className="ar-money-input"><span>{currency}</span><input required type="number" min="0.01" max={selected.balance} step="0.01" value={activity.promised_amount} onChange={(event) => setActivity({ ...activity, promised_amount: event.target.value })} /></div></label></div>}<label>Detalle<textarea required maxLength="2000" rows="3" value={activity.note} onChange={(event) => setActivity({ ...activity, note: event.target.value })} placeholder="Ej. Se contactó por WhatsApp; confirma pago el viernes." /></label><button className="btn btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar seguimiento'}</button></form>}
                    </div>
                    {canManage && <div className="ar-terms"><div className="ar-panel-title"><i className="bi bi-calendar-check" /><span><strong>Condiciones de cobro</strong><small>Ajusta el vencimiento o registra un compromiso.</small></span></div><div><label>Fecha de vencimiento<input type="date" required value={terms.payment_due_date} onChange={(event) => setTerms({ ...terms, payment_due_date: event.target.value })} /></label><label>Días de crédito<input type="number" min="0" max="3650" value={terms.payment_terms_days} onChange={(event) => setTerms({ ...terms, payment_terms_days: event.target.value })} /></label><label className="ar-note">Nota de seguimiento<input maxLength="2000" value={terms.collection_note} onChange={(event) => setTerms({ ...terms, collection_note: event.target.value })} placeholder="Ej. cliente confirma pago el viernes" /></label><button className="btn btn-light" disabled={saving || !terms.payment_due_date} onClick={saveTerms}>Guardar condiciones</button></div></div>}
                </div>
            </section>
        </div>, document.body)}

        {selectedCustomer && createPortal(<div className="ar-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !saving && setSelectedCustomer(null)}>
            <section className="ar-modal ar-statement-modal" role="dialog" aria-modal="true" aria-labelledby="ar-statement-title">
                <header><div className="ar-modal-icon"><i className="bi bi-person-vcard" /></div><div><span>ESTADO DE CUENTA</span><h2 id="ar-statement-title">{selectedCustomer.customer.name}</h2><p>{selectedCustomer.customer.identification || 'Sin identificación'} · {selectedCustomer.customer.phone || 'Sin teléfono'}</p></div><button disabled={saving} onClick={() => setSelectedCustomer(null)} aria-label="Cerrar"><i className="bi bi-x-lg" /></button></header>
                <div className="ar-modal-body">
                    <div className="ar-statement-actions"><div><i className="bi bi-shield-check" /><span><strong>{selectedCustomer.profile.credit_enabled ? `Cupo ${money(selectedCustomer.profile.credit_limit)}` : 'Crédito sin cupo controlado'}</strong><small>{selectedCustomer.profile.default_payment_terms_days || 0} días de plazo predeterminado</small></span></div><div><button type="button" onClick={() => window.print()}><i className="bi bi-printer" /> Imprimir</button><button type="button" className="is-whatsapp" onClick={shareCustomerStatement}><i className="bi bi-whatsapp" /> Compartir</button></div></div>
                    <div className="ar-modal-summary ar-statement-summary"><div><span>Documentos pendientes</span><strong>{selectedCustomer.summary.documents}</strong></div><div><span>Saldo vencido</span><strong>{money(selectedCustomer.summary.overdue)}</strong></div><div className="is-balance"><span>Deuda total</span><strong>{money(selectedCustomer.summary.total_receivable)}</strong></div></div>
                    <div className="ar-statement-layout">
                        <div className="ar-panel ar-statement-documents"><div className="ar-panel-title"><i className="bi bi-file-earmark-text" /><span><strong>Documentos abiertos</strong><small>Ordenados por fecha de vencimiento.</small></span></div><div className="ar-statement-table"><table><thead><tr><th>Documento</th><th>Vence</th><th>Saldo</th></tr></thead><tbody>{selectedCustomer.documents.map((document) => { const status = statusLabels[document.collection_status] || statusLabels.unassigned; return <tr key={document.id}><td><strong>{document.reference_code}</strong><small>Emitida {document.date} · Total {money(document.grand_total)}</small></td><td><span className={`ar-status ${status[1]}`}>{status[0]}</span><small>{document.payment_due_date || 'Sin fecha'}{document.days_overdue > 0 ? ` · ${document.days_overdue} días` : ''}</small></td><td><strong>{money(document.balance)}</strong><small>Abonado {money(document.paid_total + document.credited_total)}</small></td></tr>; })}</tbody></table></div></div>
                        {canCollect && <form className="ar-panel ar-customer-payment" onSubmit={submitCustomerPayment}><div className="ar-panel-title"><i className="bi bi-layers" /><span><strong>Cobro consolidado</strong><small>Se aplica primero a las facturas más antiguas.</small></span></div><label>Monto a distribuir<div className="ar-money-input"><span>{currency}</span><input required type="number" min="0.01" max={selectedCustomer.summary.total_receivable} step="0.01" value={customerPayment.amount} onChange={(event) => setCustomerPayment({ ...customerPayment, amount: event.target.value })} /></div></label><label>Forma de pago<select value={customerPayment.payment_type} onChange={(event) => setCustomerPayment({ ...customerPayment, payment_type: Number(event.target.value) })}><option value="1">Efectivo</option><option value="2">Cheque</option><option value="3">Transferencia</option><option value="4">Otro</option></select></label><label>Fecha<input required type="date" value={customerPayment.payment_date} onChange={(event) => setCustomerPayment({ ...customerPayment, payment_date: event.target.value })} /></label><label>Referencia<input maxLength="255" value={customerPayment.reference} onChange={(event) => setCustomerPayment({ ...customerPayment, reference: event.target.value })} placeholder="Ej. transferencia o recibo" /></label><div className="ar-allocation-note"><i className="bi bi-info-circle" /> El sistema distribuirá {money(customerPayment.amount)} sin exceder el saldo de ningún documento.</div><button className="btn btn-primary" disabled={saving}>{saving ? 'Aplicando cobro...' : 'Aplicar cobro'}</button></form>}
                    </div>
                </div>
            </section>
        </div>, document.body)}
    </>;
};

export default AccountsReceivable;
