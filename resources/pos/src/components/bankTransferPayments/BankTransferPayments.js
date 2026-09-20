import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import MasterLayout from '../MasterLayout';
import TabTitle from '../../shared/tab-title/TabTitle';
import TopProgressBar from '../../shared/components/loaders/TopProgressBar';
import apiConfig from '../../config/apiConfig';
import { addToast } from '../../store/action/toastAction';
import { toastType } from '../../constants';
import './bank-transfer-payments.scss';

const initialMeta = { current_page: 1, last_page: 1, from: 0, to: 0, total: 0 };
const statuses = {
    PENDING: ['Pendiente', 'is-pending'], VERIFIED: ['Verificada', 'is-verified'], OBSERVED: ['Observada', 'is-observed'],
};
const paymentNames = { 1: 'Efectivo', 2: 'Cheque', 3: 'Transferencia', 4: 'Otro' };

const BankTransferPayments = () => {
    const dispatch = useDispatch();
    const currency = useSelector((state) => state.frontSetting?.value?.currency_symbol || '$');
    const permissions = useSelector((state) => Array.isArray(state.config) ? state.config : []);
    const canReconcile = permissions.includes('reconcile_bank_transfer_payments') || permissions.includes('manage_sale');
    const [rows, setRows] = useState([]);
    const [summary, setSummary] = useState({});
    const [meta, setMeta] = useState(initialMeta);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({ search: '', status: '', start_date: '', end_date: '', mixed: '', reference_state: '' });
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selected, setSelected] = useState(null);
    const [review, setReview] = useState({ status: 'VERIFIED', note: '' });
    const requestVersion = useRef(0);

    const query = useMemo(() => {
        const params = new URLSearchParams({ page: String(page), per_page: '15' });
        Object.entries({ ...filters, search: debouncedSearch }).forEach(([key, value]) => value !== '' && params.set(key, value));
        return params.toString();
    }, [filters.status, filters.start_date, filters.end_date, filters.mixed, filters.reference_state, debouncedSearch, page]);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setPage(1);
            setDebouncedSearch(filters.search.trim());
        }, 350);

        return () => window.clearTimeout(timeout);
    }, [filters.search]);

    const load = useCallback(async () => {
        const version = ++requestVersion.current;
        setLoading(true);
        try {
            const response = await apiConfig.get(`bank-transfer-payments?${query}`);
            if (version !== requestVersion.current) return;
            setRows(response.data.data || []);
            setSummary(response.data.summary || {});
            setMeta({ ...initialMeta, ...(response.data.meta || {}) });
        } catch (error) {
            if (version !== requestVersion.current) return;
            dispatch(addToast({ text: error?.response?.data?.message || 'No se pudieron cargar las transferencias.', type: toastType.ERROR }));
        } finally {
            if (version === requestVersion.current) setLoading(false);
        }
    }, [dispatch, query]);

    useEffect(() => { load(); }, [load]);
    useEffect(() => {
        if (!selected) return undefined;
        const old = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const close = (event) => event.key === 'Escape' && !saving && setSelected(null);
        document.addEventListener('keydown', close);
        return () => { document.body.style.overflow = old; document.removeEventListener('keydown', close); };
    }, [selected, saving]);

    const money = (value) => `${currency}${Number(value || 0).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const updateFilter = (key, value) => { setPage(1); setFilters((current) => ({ ...current, [key]: value })); };
    const clearFilters = () => { setFilters({ search: '', status: '', start_date: '', end_date: '', mixed: '', reference_state: '' }); setDebouncedSearch(''); setPage(1); };
    const openDetail = (row) => { setSelected(row); setReview({ status: row.reconciliation_status || 'PENDING', note: row.reconciliation_note || '' }); };

    const saveReview = async (event) => {
        event.preventDefault();
        setSaving(true);
        try {
            const response = await apiConfig.patch(`bank-transfer-payments/${selected.id}/reconciliation`, review);
            dispatch(addToast({ text: response.data.message || 'Transferencia actualizada.' }));
            setSelected(null);
            await load();
        } catch (error) {
            const errors = error?.response?.data?.errors;
            dispatch(addToast({ text: errors ? Object.values(errors).flat()[0] : (error?.response?.data?.message || 'No se pudo actualizar.'), type: toastType.ERROR }));
        } finally { setSaving(false); }
    };

    return <MasterLayout>
        <TabTitle title="Cobros por transferencia" />
        {loading && <TopProgressBar force />}
        <main className="bt-module">
            <header className="bt-heading">
                <div><span>CONTROL BANCARIO</span><h1>Cobros por transferencia</h1><p>Consulta pagos simples y mixtos, valida comprobantes y detecta referencias repetidas.</p></div>
                <button className="btn" type="button" onClick={load}><i className="bi bi-arrow-clockwise" /> Actualizar</button>
            </header>

            <section className="bt-metrics">
                <article><i className="bi bi-bank" /><div><span>Total recibido</span><strong>{money(summary.amount)}</strong><small>{summary.count || 0} movimientos</small></div></article>
                <article className="is-warning"><i className="bi bi-hourglass-split" /><div><span>Por verificar</span><strong>{summary.pending || 0}</strong><small>Requieren revisión</small></div></article>
                <article className="is-success"><i className="bi bi-patch-check" /><div><span>Verificadas</span><strong>{summary.verified || 0}</strong><small>Conciliadas</small></div></article>
                <article className="is-mixed"><i className="bi bi-intersect" /><div><span>Pagos mixtos</span><strong>{summary.mixed || 0}</strong><small>Efectivo + transferencia u otro</small></div></article>
            </section>

            <section className="bt-card">
                <div className="bt-card-title"><div><h2>Movimientos bancarios</h2><p>Busca por comprobante, venta, factura, cliente o identificación.</p></div>{Number(summary.missing_reference) > 0 && <button type="button" className="bt-alert" onClick={() => updateFilter('reference_state', 'missing')}><i className="bi bi-exclamation-triangle" /> {summary.missing_reference} sin referencia</button>}</div>
                <div className="bt-filters">
                    <label className="bt-search"><span>Buscar</span><div><i className="bi bi-search" /><input value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="N.º comprobante, venta o cliente" /></div></label>
                    <label><span>Estado</span><select value={filters.status} onChange={(e) => updateFilter('status', e.target.value)}><option value="">Todos</option><option value="PENDING">Pendiente</option><option value="VERIFIED">Verificada</option><option value="OBSERVED">Observada</option></select></label>
                    <label><span>Tipo de cobro</span><select value={filters.mixed} onChange={(e) => updateFilter('mixed', e.target.value)}><option value="">Todos</option><option value="1">Pago mixto</option><option value="0">Solo transferencia</option></select></label>
                    <label><span>Referencia</span><select value={filters.reference_state} onChange={(e) => updateFilter('reference_state', e.target.value)}><option value="">Todas</option><option value="missing">Sin referencia</option><option value="duplicate">Posible duplicada</option></select></label>
                    <label><span>Desde</span><input type="date" value={filters.start_date} onChange={(e) => updateFilter('start_date', e.target.value)} /></label>
                    <label><span>Hasta</span><input type="date" value={filters.end_date} onChange={(e) => updateFilter('end_date', e.target.value)} /></label>
                    <div className="bt-filter-actions"><button type="button" className="btn" onClick={clearFilters}><i className="bi bi-arrow-counterclockwise" /> Limpiar filtros</button></div>
                </div>

                <div className="bt-table-wrap"><table><thead><tr><th>Fecha / venta</th><th>Cliente</th><th>Comprobante</th><th>Desglose</th><th>Monto transferido</th><th>Estado</th><th /></tr></thead><tbody>
                    {!loading && rows.length === 0 && <tr><td colSpan="7"><div className="bt-empty"><i className="bi bi-bank" /><strong>No hay transferencias con estos filtros</strong><span>Prueba cambiando el rango o el criterio de búsqueda.</span></div></td></tr>}
                    {rows.map((row) => { const status = statuses[row.reconciliation_status] || statuses.PENDING; return <tr key={row.id}>
                        <td><strong>{row.payment_date}</strong><small>{row.sale.reference_code}{row.sale.electronic_document ? ` · ${row.sale.electronic_document}` : ''}</small></td>
                        <td><strong>{row.sale.customer?.name || 'Sin cliente'}</strong><small>{row.sale.warehouse?.name} · {row.sale.cashier || 'Sin cajero'}</small></td>
                        <td><strong className={row.missing_reference ? 'is-danger-text' : ''}>{row.reference || 'Sin referencia'}</strong>{row.duplicate_count > 1 && <small className="is-danger-text"><i className="bi bi-copy" /> aparece {row.duplicate_count} veces</small>}</td>
                        <td><div className="bt-payments">{row.sale.payments.map((payment, index) => <span key={`${row.id}-${index}`} className={payment.payment_type === 3 ? 'is-transfer' : ''}>{paymentNames[payment.payment_type]} {money(payment.amount)}</span>)}</div></td>
                        <td className="bt-amount">{money(row.amount)}{row.sale.is_mixed && <small>Venta total {money(row.sale.grand_total)}</small>}</td>
                        <td><span className={`bt-status ${status[1]}`}>{status[0]}</span></td>
                        <td><button className="bt-detail" type="button" onClick={() => openDetail(row)}>Revisar <i className="bi bi-arrow-right" /></button></td>
                    </tr>; })}
                </tbody></table></div>
                <footer className="bt-pagination"><span>{meta.from || 0}–{meta.to || 0} de {meta.total || 0}</span><div><button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><i className="bi bi-chevron-left" /></button><b>Página {page} de {meta.last_page}</b><button disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)}><i className="bi bi-chevron-right" /></button></div></footer>
            </section>
        </main>

        {selected && createPortal(<div className="bt-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && !saving && setSelected(null)}><section className="bt-modal">
            <header><div className="bt-modal-icon"><i className="bi bi-bank" /></div><div><span>COMPROBANTE BANCARIO</span><h2>{selected.reference || 'Transferencia sin referencia'}</h2><p>{selected.sale.reference_code} · {selected.sale.customer?.name}</p></div><button onClick={() => setSelected(null)} disabled={saving}><i className="bi bi-x-lg" /></button></header>
            <div className="bt-modal-body"><div className="bt-detail-grid"><article><span>Monto transferido</span><strong>{money(selected.amount)}</strong></article><article><span>Total de la venta</span><strong>{money(selected.sale.grand_total)}</strong></article><article><span>Fecha del pago</span><strong>{selected.payment_date}</strong></article><article><span>Sucursal / cajero</span><strong>{selected.sale.warehouse?.name}</strong><small>{selected.sale.cashier}</small></article></div>
                <div className="bt-breakdown"><h3>Cómo se cobró la venta</h3>{selected.sale.payments.map((payment, index) => <div key={index}><span><i className={`bi ${payment.payment_type === 3 ? 'bi-bank' : 'bi-cash-stack'}`} /> {paymentNames[payment.payment_type]}{payment.reference ? <small>Ref. {payment.reference}</small> : null}</span><strong>{money(payment.amount)}</strong></div>)}</div>
                {selected.duplicate_count > 1 && <div className="bt-warning"><i className="bi bi-exclamation-triangle" /><span><strong>Posible comprobante duplicado</strong>Esta referencia aparece en {selected.duplicate_count} movimientos de esta tienda. Verifica antes de conciliar.</span></div>}
                {canReconcile && <form className="bt-review" onSubmit={saveReview}><h3>Conciliación</h3><div><label>Estado<select value={review.status} onChange={(e) => setReview({ ...review, status: e.target.value })}><option value="PENDING">Pendiente</option><option value="VERIFIED">Verificada</option><option value="OBSERVED">Observada</option></select></label><label>Nota<textarea value={review.note} onChange={(e) => setReview({ ...review, note: e.target.value })} placeholder="Detalle de la revisión (obligatorio si se observa)" /></label></div><button className="btn btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar conciliación'}</button></form>}
            </div>
        </section></div>, document.body)}
    </MasterLayout>;
};

export default BankTransferPayments;
