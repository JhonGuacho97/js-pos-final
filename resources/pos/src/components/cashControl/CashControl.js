import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import MasterLayout from '../MasterLayout';
import TabTitle from '../../shared/tab-title/TabTitle';
import TopProgressBar from '../../shared/components/loaders/TopProgressBar';
import apiConfig from '../../config/apiConfig';
import { useDispatch, useSelector } from 'react-redux';
import { addToast } from '../../store/action/toastAction';
import { toastType } from '../../constants';
import './cash-control.scss';

const movementLabels = {
    OPENING: 'Apertura', MANUAL_INCOME: 'Ingreso manual', MANUAL_EXPENSE: 'Egreso manual', WITHDRAWAL: 'Retiro',
    SALE_PAYMENT: 'Venta en efectivo', EXPENSE_PAYMENT: 'Gasto desde caja',
    CASH_REFUND: 'Reembolso en efectivo', REVERSAL: 'Reversión', TRANSFER_IN: 'Transferencia recibida', TRANSFER_OUT: 'Transferencia enviada',
};

const CashControl = () => {
    const dispatch = useDispatch();
    const currency = useSelector((state) => state.frontSetting?.value?.currency_symbol || '$');
    const [overview, setOverview] = useState(null);
    const [movements, setMovements] = useState([]);
    const [movementLoading, setMovementLoading] = useState(false);
    const [movementPage, setMovementPage] = useState(1);
    const [movementMeta, setMovementMeta] = useState({ currentPage: 1, lastPage: 1, from: 0, to: 0, total: 0 });
    const [movementSummary, setMovementSummary] = useState({ manualIncome: 0, totalOut: 0 });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showTransfer, setShowTransfer] = useState(false);
    const [reversing, setReversing] = useState(null);
    const [form, setForm] = useState({ type: 'MANUAL_INCOME', amount: '', description: '', reference: '' });
    const [transferForm, setTransferForm] = useState({ target_pos_register_id: '', amount: '', description: '', reference: '' });
    const [reversalReason, setReversalReason] = useState('');
    const [activeTab, setActiveTab] = useState('turn');
    const [registerForm, setRegisterForm] = useState({ name: '', code: '', warehouse_id: '' });
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyPage, setHistoryPage] = useState(1);
    const [historyMeta, setHistoryMeta] = useState({ currentPage: 1, lastPage: 1, from: 0, to: 0, total: 0 });
    const [reviewing, setReviewing] = useState(null);
    const [reviewNote, setReviewNote] = useState('');
    const [supervisedSession, setSupervisedSession] = useState(null);
    const [supervisedMovements, setSupervisedMovements] = useState([]);
    const [supervisionLoading, setSupervisionLoading] = useState(false);
    const [supervisionPage, setSupervisionPage] = useState(1);
    const [supervisionMeta, setSupervisionMeta] = useState({ currentPage: 1, lastPage: 1, from: 0, to: 0, total: 0 });
    const [supervisionSummary, setSupervisionSummary] = useState({ openingCash: 0, expectedCash: 0, cashSales: 0, manualIncome: 0, totalOut: 0, transfersIn: 0, transfersOut: 0, refunds: 0 });
    const [supervisionFilters, setSupervisionFilters] = useState({ type: '', search: '' });
    // El endpoint calcula estas capacidades con la misma tienda activa y el
    // mismo contexto de autorización que protegen las rutas del servidor.
    const canTransfer = overview?.capabilities?.transfer_cash === true;
    const canReverse = overview?.capabilities?.reverse_cash_movement === true;
    const canReview = overview?.capabilities?.review_cash_closure === true;
    const canViewOwn = overview?.capabilities?.view_own_cash_session === true;
    const canIncome = overview?.capabilities?.create_cash_income === true;
    const canExpense = overview?.capabilities?.create_cash_expense === true;
    const canWithdraw = overview?.capabilities?.withdraw_cash === true;
    const canSupervise = overview?.capabilities?.view_cash_supervision === true;
    const canViewClosures = overview?.capabilities?.view_cash_closures === true;
    const canManageRegisters = overview?.capabilities?.manage_cash_registers === true;
    const movementOptions = useMemo(() => [
        canIncome && { value: 'MANUAL_INCOME', label: 'Ingreso manual' },
        canExpense && { value: 'MANUAL_EXPENSE', label: 'Egreso manual' },
        canWithdraw && { value: 'WITHDRAWAL', label: 'Retiro de efectivo' },
    ].filter(Boolean), [canIncome, canExpense, canWithdraw]);
    const availableTabs = useMemo(() => [
        canViewOwn && ['turn', 'bi-wallet2', 'Mi turno'],
        canSupervise && ['supervision', 'bi-activity', 'Supervisión'],
        canManageRegisters && ['registers', 'bi-hdd-stack', 'Cajas físicas'],
        canViewClosures && ['history', 'bi-clock-history', 'Cierres'],
    ].filter(Boolean), [canViewOwn, canSupervise, canManageRegisters, canViewClosures]);

    const loadMovements = useCallback(async (page = 1, showProgress = false) => {
        if (showProgress) setMovementLoading(true);
        try {
            const response = await apiConfig.get(`cash-control/movements?per_page=10&page=${page}`);
            const result = response.data;
            setMovements(result.data || []);
            setMovementMeta({
                currentPage: result.current_page || 1,
                lastPage: result.last_page || 1,
                from: result.from || 0,
                to: result.to || 0,
                total: result.total || 0,
            });
            setMovementSummary({
                manualIncome: Number(result.summary?.manual_income || 0),
                totalOut: Number(result.summary?.total_out || 0),
            });
            setMovementPage(result.current_page || 1);
        } catch (error) {
            dispatch(addToast({ text: error?.response?.data?.message || 'No se pudieron cargar los movimientos del turno.', type: toastType.ERROR }));
        } finally {
            if (showProgress) setMovementLoading(false);
        }
    }, [dispatch]);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const overviewResponse = await apiConfig.get('cash-control/overview');
            const nextOverview = overviewResponse.data.data;
            setOverview(nextOverview);
            if (nextOverview.session) {
                await loadMovements(1);
            } else {
                setMovements([]);
                setMovementPage(1);
                setMovementMeta({ currentPage: 1, lastPage: 1, from: 0, to: 0, total: 0 });
                setMovementSummary({ manualIncome: 0, totalOut: 0 });
            }
        } catch (error) {
            dispatch(addToast({ text: error?.response?.data?.message || 'No se pudo cargar el control de caja.', type: toastType.ERROR }));
        } finally {
            setLoading(false);
        }
    }, [dispatch, loadMovements]);

    const loadSupervisedMovements = useCallback(async (sessionId, page = 1, filters = { type: '', search: '' }) => {
        if (!sessionId) return;
        setSupervisionLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), per_page: '10' });
            if (filters.type) params.set('type', filters.type);
            if (filters.search?.trim()) params.set('search', filters.search.trim());
            const response = await apiConfig.get(`cash-control/sessions/${sessionId}/movements?${params.toString()}`);
            const result = response.data;
            setSupervisedMovements(result.data || []);
            setSupervisionMeta({
                currentPage: result.current_page || 1,
                lastPage: result.last_page || 1,
                from: result.from || 0,
                to: result.to || 0,
                total: result.total || 0,
            });
            setSupervisionSummary({
                openingCash: Number(result.summary?.opening_cash || 0),
                expectedCash: Number(result.summary?.expected_cash || 0),
                cashSales: Number(result.summary?.cash_sales || 0),
                manualIncome: Number(result.summary?.manual_income || 0),
                totalOut: Number(result.summary?.total_out || 0),
                transfersIn: Number(result.summary?.transfers_in || 0),
                transfersOut: Number(result.summary?.transfers_out || 0),
                refunds: Number(result.summary?.refunds || 0),
            });
            setSupervisionPage(result.current_page || 1);
        } catch (error) {
            dispatch(addToast({ text: error?.response?.data?.message || 'No se pudieron cargar los movimientos de esta caja.', type: toastType.ERROR }));
        } finally {
            setSupervisionLoading(false);
        }
    }, [dispatch]);

    const openSupervision = (session) => {
        const filters = { type: '', search: '' };
        setSupervisedSession(session);
        setSupervisionFilters(filters);
        setSupervisedMovements([]);
        setSupervisionMeta({ currentPage: 1, lastPage: 1, from: 0, to: 0, total: 0 });
        loadSupervisedMovements(session.id, 1, filters);
    };

    const closeSupervision = () => {
        if (supervisionLoading) return;
        setSupervisedSession(null);
        setSupervisedMovements([]);
    };

    useEffect(() => { loadData(); }, [loadData]);

    useEffect(() => {
        if (!overview || !availableTabs.length) return;
        if (!availableTabs.some(([key]) => key === activeTab)) {
            setActiveTab(availableTabs[0][0]);
        }
        if (movementOptions.length && !movementOptions.some(({ value }) => value === form.type)) {
            setForm((current) => ({ ...current, type: movementOptions[0].value }));
        }
    }, [overview, activeTab, availableTabs, movementOptions, form.type]);

    useEffect(() => {
        if (activeTab !== 'history') return;
        setHistoryLoading(true);
        setSessions([]);
        apiConfig.get(`cash-control/sessions?status=closed&per_page=10&page=${historyPage}`)
            .then((response) => {
                const result = response.data;
                setSessions(result.data || []);
                setHistoryMeta({
                    currentPage: result.current_page || 1,
                    lastPage: result.last_page || 1,
                    from: result.from || 0,
                    to: result.to || 0,
                    total: result.total || 0,
                });
            })
            .catch((error) => dispatch(addToast({ text: error?.response?.data?.message || 'No se pudo cargar el historial de cierres.', type: toastType.ERROR })))
            .finally(() => setHistoryLoading(false));
    }, [activeTab, dispatch, historyPage]);

    useEffect(() => {
        if (!reviewing) return undefined;
        const previousOverflow = document.body.style.overflow;
        const closeOnEscape = (event) => {
            if (event.key === 'Escape' && !saving) {
                setReviewing(null);
                setReviewNote('');
            }
        };
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', closeOnEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [reviewing, saving]);

    useEffect(() => {
        if (!supervisedSession) return undefined;
        const previousOverflow = document.body.style.overflow;
        const closeOnEscape = (event) => {
            if (event.key === 'Escape' && !supervisionLoading) closeSupervision();
        };
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', closeOnEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [supervisedSession, supervisionLoading]);

    const apiError = (error, fallback) => {
        const errors = error?.response?.data?.errors;
        return errors ? Object.values(errors).flat()[0] : (error?.response?.data?.message || fallback);
    };

    const submitMovement = async (event) => {
        event.preventDefault();
        setSaving(true);
        try {
            await apiConfig.post('cash-control/movements', form);
            dispatch(addToast({ text: 'Movimiento de caja registrado correctamente.' }));
            setForm({ type: movementOptions[0]?.value || 'MANUAL_INCOME', amount: '', description: '', reference: '' });
            setShowForm(false);
            await loadData();
        } catch (error) {
            const errors = error?.response?.data?.errors;
            dispatch(addToast({ text: errors ? Object.values(errors).flat()[0] : (error?.response?.data?.message || 'No se pudo registrar el movimiento.'), type: toastType.ERROR }));
        } finally {
            setSaving(false);
        }
    };

    const submitTransfer = async (event) => {
        event.preventDefault();
        setSaving(true);
        try {
            await apiConfig.post('cash-control/transfers', transferForm);
            dispatch(addToast({ text: 'Transferencia entre cajas registrada correctamente.' }));
            setTransferForm({ target_pos_register_id: '', amount: '', description: '', reference: '' });
            setShowTransfer(false);
            await loadData();
        } catch (error) {
            const errors = error?.response?.data?.errors;
            dispatch(addToast({ text: errors ? Object.values(errors).flat()[0] : (error?.response?.data?.message || 'No se pudo transferir el efectivo.'), type: toastType.ERROR }));
        } finally { setSaving(false); }
    };

    const submitReversal = async (event) => {
        event.preventDefault();
        setSaving(true);
        try {
            await apiConfig.post(`cash-control/movements/${reversing.id}/reverse`, { reason: reversalReason });
            dispatch(addToast({ text: 'Movimiento revertido correctamente.' }));
            setReversing(null); setReversalReason('');
            await loadData();
        } catch (error) {
            const errors = error?.response?.data?.errors;
            dispatch(addToast({ text: errors ? Object.values(errors).flat()[0] : (error?.response?.data?.message || 'No se pudo revertir el movimiento.'), type: toastType.ERROR }));
        } finally { setSaving(false); }
    };

    const submitRegister = async (event) => {
        event.preventDefault(); setSaving(true);
        try {
            await apiConfig.post('cash-control/registers', registerForm);
            dispatch(addToast({ text: 'Caja física creada correctamente.' }));
            setRegisterForm({ name: '', code: '', warehouse_id: '' }); setShowRegisterForm(false);
            await loadData();
        } catch (error) {
            dispatch(addToast({ text: apiError(error, 'No se pudo crear la caja.'), type: toastType.ERROR }));
        } finally { setSaving(false); }
    };

    const toggleRegister = async (register) => {
        setSaving(true);
        try {
            await apiConfig.patch(`cash-control/registers/${register.id}`, { is_active: !register.is_active });
            dispatch(addToast({ text: `Caja ${register.is_active ? 'desactivada' : 'activada'} correctamente.` }));
            await loadData();
        } catch (error) {
            dispatch(addToast({ text: apiError(error, 'No se pudo actualizar la caja.'), type: toastType.ERROR }));
        } finally { setSaving(false); }
    };

    const reviewClosure = async (decision) => {
        setSaving(true);
        try {
            await apiConfig.post(`cash-control/sessions/${reviewing.id}/review`, { decision, note: reviewNote || null });
            dispatch(addToast({ text: decision === 'APPROVED' ? 'Cierre aprobado correctamente.' : 'Cierre marcado para revisión.' }));
            setSessions((items) => items.map((item) => item.id === reviewing.id ? { ...item, reconciliation_status: decision, review_note: reviewNote } : item));
            setReviewing(null); setReviewNote(''); await loadData();
        } catch (error) {
            dispatch(addToast({ text: apiError(error, 'No se pudo revisar el cierre.'), type: toastType.ERROR }));
        } finally { setSaving(false); }
    };

    const closeReviewModal = () => {
        if (saving) return;
        setReviewing(null);
        setReviewNote('');
    };

    const session = overview?.session;
    const totalIn = movementSummary.manualIncome;
    const totalOut = movementSummary.totalOut;

    return (
        <>
        <MasterLayout>
            <TabTitle title="Control de cajas" />
            {(loading || movementLoading) && <TopProgressBar />}
            <div className="cash-control-v2">
                <header className="cash-control-heading">
                    <div><span>TESORERÍA OPERATIVA</span><h1>Control de cajas</h1><p>Supervisa el efectivo y registra cada entrada o salida del turno.</p></div>
                    {activeTab === 'turn' && session && <div className="cash-heading-actions">{canTransfer && <button className="btn btn-light" disabled={!overview?.active_sessions?.length} onClick={() => { setShowTransfer(!showTransfer); setShowForm(false); }}><i className="bi bi-arrow-left-right" /> Transferir</button>}{movementOptions.length > 0 && <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setShowTransfer(false); }}><i className="bi bi-plus-lg" /> Nuevo movimiento</button>}</div>}
                </header>

                <nav className="cash-tabs">
                    {availableTabs.map(([key, icon, label]) => (
                        <button key={key} className={activeTab === key ? 'is-active' : ''} onClick={() => setActiveTab(key)}><i className={`bi ${icon}`} /> {label}</button>
                    ))}
                </nav>

                {activeTab === 'turn' && (!loading && !session ? (
                    <section className="cash-empty"><i className="bi bi-cash-register" /><h2>No tienes una caja abierta</h2><p>Abre la caja desde el POS para comenzar a registrar movimientos.</p></section>
                ) : session && (
                    <>
                        <section className="cash-session-card">
                            <div><span>SESIÓN ACTIVA</span><h2>{session.cash_register?.name || 'Caja principal'}</h2><p>{session.warehouse?.name} · abierta {new Date(session.opened_at).toLocaleString('es-EC')}</p></div>
                            <div className="cash-balance"><span>Efectivo esperado en caja</span><strong>{currency}{Number(session.expected_cash).toFixed(2)}</strong></div>
                        </section>
                        <div className="cash-metrics">
                            <div><span>Fondo inicial</span><strong>{currency}{Number(session.opening_cash).toFixed(2)}</strong></div>
                            <div className="is-income"><span>Ingresos manuales</span><strong>+{currency}{totalIn.toFixed(2)}</strong></div>
                            <div className="is-expense"><span>Egresos y retiros</span><strong>-{currency}{totalOut.toFixed(2)}</strong></div>
                        </div>

                        {showForm && <form className="cash-movement-form" onSubmit={submitMovement}>
                            <div className="cash-section-title"><div><i className="bi bi-arrow-left-right" /></div><span><strong>Registrar movimiento</strong><small>El movimiento quedará asociado a tu sesión activa.</small></span></div>
                            <div className="cash-form-grid">
                                <label>Tipo<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{movementOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
                                <label>Monto<div className="cash-amount-input"><span>{currency}</span><input required min="0.01" step="0.01" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div></label>
                                <label>Referencia<input maxLength="100" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} placeholder="Opcional" /></label>
                                <label className="cash-description">Descripción<textarea required maxLength="1000" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Explica el motivo del movimiento" /></label>
                            </div>
                            <div className="cash-form-actions"><button type="button" className="btn btn-light" onClick={() => setShowForm(false)}>Cancelar</button><button className="btn btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Registrar movimiento'}</button></div>
                        </form>}

                        {showTransfer && <form className="cash-movement-form" onSubmit={submitTransfer}>
                            <div className="cash-section-title"><div><i className="bi bi-arrow-left-right" /></div><span><strong>Transferir efectivo</strong><small>Se crearán automáticamente la salida y la entrada en ambas cajas.</small></span></div>
                            <div className="cash-form-grid">
                                <label>Caja de destino<select required value={transferForm.target_pos_register_id} onChange={(e) => setTransferForm({ ...transferForm, target_pos_register_id: e.target.value })}><option value="">Seleccionar caja</option>{overview?.active_sessions?.map((item) => <option key={item.id} value={item.id}>{item.cash_register?.name || 'Caja'} · {item.warehouse?.name} · {item.user?.first_name} {item.user?.last_name}</option>)}</select></label>
                                <label>Monto<div className="cash-amount-input"><span>{currency}</span><input required min="0.01" step="0.01" type="number" value={transferForm.amount} onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })} /></div></label>
                                <label>Referencia<input maxLength="100" value={transferForm.reference} onChange={(e) => setTransferForm({ ...transferForm, reference: e.target.value })} placeholder="Opcional" /></label>
                                <label className="cash-description">Motivo<textarea required maxLength="1000" value={transferForm.description} onChange={(e) => setTransferForm({ ...transferForm, description: e.target.value })} placeholder="Indica por qué se transfiere el efectivo" /></label>
                            </div>
                            <div className="cash-form-actions"><button type="button" className="btn btn-light" onClick={() => setShowTransfer(false)}>Cancelar</button><button className="btn btn-primary" disabled={saving}>{saving ? 'Transfiriendo...' : 'Confirmar transferencia'}</button></div>
                        </form>}

                        {reversing && <form className="cash-reversal-form" onSubmit={submitReversal}>
                            <div><strong>Revertir {movementLabels[reversing.type] || reversing.type}</strong><small>Se conservará el asiento original y se registrará el contramovimiento por {currency}{Number(reversing.amount).toFixed(2)}.</small></div>
                            <textarea required minLength="5" maxLength="1000" value={reversalReason} onChange={(e) => setReversalReason(e.target.value)} placeholder="Motivo obligatorio de la reversión" />
                            <div><button type="button" className="btn btn-light" onClick={() => { setReversing(null); setReversalReason(''); }}>Cancelar</button><button className="btn btn-danger" disabled={saving}>{saving ? 'Revirtiendo...' : 'Confirmar reversión'}</button></div>
                        </form>}

                        <section className="cash-ledger">
                            <div className="cash-section-title"><div><i className="bi bi-clock-history" /></div><span><strong>Movimientos del turno</strong><small>Historial ordenado desde el más reciente.</small></span></div>
                            <div className="table-responsive"><table><thead><tr><th>Fecha</th><th>Movimiento</th><th>Detalle</th><th>Referencia</th><th className="text-end">Monto</th><th /></tr></thead><tbody>
                                {!movementLoading && movements.map((item) => <tr key={item.id}><td>{new Date(item.created_at).toLocaleString('es-EC')}</td><td><span className={`cash-type is-${item.direction.toLowerCase()}`}>{movementLabels[item.type] || item.type}</span></td><td>{item.description || '—'}{item.reversal_reason && <small className="cash-reason">Motivo: {item.reversal_reason}</small>}</td><td>{item.reference || '—'}</td><td className={`text-end cash-value is-${item.direction.toLowerCase()}`}>{item.direction === 'IN' ? '+' : '-'}{currency}{Number(item.amount).toFixed(2)}</td><td className="text-end">{canReverse && !['OPENING', 'REVERSAL', 'TRANSFER_IN', 'TRANSFER_OUT'].includes(item.type) && !item.reversal_exists && <button className="cash-reverse-button" title="Revertir movimiento" onClick={() => { setReversing(item); setReversalReason(''); }}><i className="bi bi-arrow-counterclockwise" /></button>}</td></tr>)}
                                {!movementLoading && !movements.length && <tr><td colSpan="6" className="cash-no-data">No hay movimientos registrados.</td></tr>}
                                {movementLoading && <tr><td colSpan="6" className="cash-no-data">Cargando movimientos...</td></tr>}
                            </tbody></table></div>
                            {!movementLoading && movementMeta.total > 0 && <nav className="cash-pagination cash-ledger-pagination" aria-label="Paginación de movimientos del turno">
                                <span>Mostrando {movementMeta.from}-{movementMeta.to} de {movementMeta.total} movimientos</span>
                                <div>
                                    <button disabled={movementMeta.currentPage <= 1} onClick={() => loadMovements(Math.max(1, movementPage - 1), true)}><i className="bi bi-chevron-left" /> Anterior</button>
                                    <strong>Página {movementMeta.currentPage} de {movementMeta.lastPage}</strong>
                                    <button disabled={movementMeta.currentPage >= movementMeta.lastPage} onClick={() => loadMovements(Math.min(movementMeta.lastPage, movementPage + 1), true)}>Siguiente <i className="bi bi-chevron-right" /></button>
                                </div>
                            </nav>}
                        </section>
                    </>
                ))}

                {activeTab === 'supervision' && <section className="cash-workspace">
                    <div className="cash-workspace-heading"><div><span>TIEMPO REAL</span><h2>Cajas abiertas</h2><p>Saldo esperado y responsable de cada sesión activa.</p></div><strong>{overview?.supervision_sessions?.length || 0} activas</strong></div>
                    <div className="cash-supervision-grid">
                        {overview?.supervision_sessions?.map((item) => <article key={item.id} className="cash-supervision-card">
                            <div className="cash-live"><i /> EN OPERACIÓN</div>
                            <h3>{item.cash_register?.name || 'Caja principal'}</h3>
                            <p>{item.warehouse?.name} · {item.user?.first_name} {item.user?.last_name}</p>
                            <div><span>Efectivo esperado</span><strong>{currency}{Number(item.expected_cash).toFixed(2)}</strong></div>
                            <small>Abierta {new Date(item.opened_at).toLocaleString('es-EC')} · {item.movements_count || 0} movimientos</small>
                            <button type="button" onClick={() => openSupervision(item)}><i className="bi bi-eye" /> Ver movimientos</button>
                        </article>)}
                        {!overview?.supervision_sessions?.length && <div className="cash-inline-empty">No hay cajas abiertas en esta tienda.</div>}
                    </div>
                </section>}

                {activeTab === 'registers' && <section className="cash-workspace">
                    <div className="cash-workspace-heading"><div><span>CONFIGURACIÓN</span><h2>Cajas físicas</h2><p>Administra los puntos de cobro disponibles por sucursal.</p></div><button className="btn btn-primary" onClick={() => setShowRegisterForm(!showRegisterForm)}><i className="bi bi-plus-lg" /> Nueva caja</button></div>
                    {showRegisterForm && <form className="cash-movement-form" onSubmit={submitRegister}>
                        <div className="cash-form-grid">
                            <label>Nombre<input required maxLength="100" value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} placeholder="Ej. Caja 2" /></label>
                            <label>Código<input required maxLength="40" value={registerForm.code} onChange={(e) => setRegisterForm({ ...registerForm, code: e.target.value.toUpperCase() })} placeholder="CAJA-02" /></label>
                            <label>Sucursal<select required value={registerForm.warehouse_id} onChange={(e) => setRegisterForm({ ...registerForm, warehouse_id: e.target.value })}><option value="">Seleccionar sucursal</option>{overview?.warehouses?.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}</select></label>
                        </div>
                        <div className="cash-form-actions"><button type="button" className="btn btn-light" onClick={() => setShowRegisterForm(false)}>Cancelar</button><button className="btn btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Crear caja'}</button></div>
                    </form>}
                    <div className="cash-register-grid">
                        {overview?.registers?.map((register) => <article key={register.id} className={`cash-register-card ${register.is_active ? '' : 'is-disabled'}`}>
                            <div className="cash-register-icon"><i className="bi bi-cash-register" /></div>
                            <div className="cash-register-info"><div><h3>{register.name}</h3><span>{register.code}</span></div><p><i className="bi bi-geo-alt" /> {register.warehouse?.name}</p><small>{register.sessions_count || 0} sesiones históricas</small></div>
                            <div className="cash-register-state"><span className={register.active_session ? 'is-busy' : register.is_active ? 'is-ready' : 'is-off'}>{register.active_session ? 'En uso' : register.is_active ? 'Disponible' : 'Inactiva'}</span><button disabled={saving || !!register.active_session} onClick={() => toggleRegister(register)}>{register.is_active ? 'Desactivar' : 'Activar'}</button></div>
                        </article>)}
                    </div>
                </section>}

                {activeTab === 'history' && <section className="cash-workspace">
                    <div className="cash-workspace-heading"><div><span>AUDITORÍA</span><h2>Cierres recientes</h2><p>Revisa diferencias y deja constancia de la aprobación.</p></div><a className="btn btn-light" href="#/app/report/register">Ver reporte completo</a></div>
                    <div className="cash-history-list">
                        {historyLoading && <div className="cash-inline-empty">Cargando cierres...</div>}
                        {sessions.map((item) => <article key={item.id}>
                            <div><span className={`cash-close-status is-${(item.reconciliation_status || 'pending').toLowerCase()}`}>{item.reconciliation_status === 'BALANCED' ? 'Cuadrada' : item.reconciliation_status === 'APPROVED' ? 'Aprobada' : item.reconciliation_status === 'REJECTED' ? 'Rechazada' : 'Pendiente'}</span><h3>{item.cash_register?.name || 'Caja'} · {item.warehouse?.name}</h3><p>{item.user?.first_name} {item.user?.last_name} · {new Date(item.created_at).toLocaleString('es-EC')}</p></div>
                            <div className="cash-history-values"><span>Esperado <b>{currency}{Number(item.expected_cash || 0).toFixed(2)}</b></span><span>Contado <b>{currency}{Number(item.cash_in_hand_while_closing || 0).toFixed(2)}</b></span><strong className={Number(item.cash_difference) === 0 ? '' : Number(item.cash_difference) > 0 ? 'is-positive' : 'is-negative'}>{Number(item.cash_difference) > 0 ? '+' : ''}{currency}{Number(item.cash_difference || 0).toFixed(2)}</strong></div>
                            {canReview && item.reconciliation_status === 'PENDING' && <button className="cash-review-button" onClick={() => { setReviewing(item); setReviewNote(''); }}>Revisar cierre</button>}
                        </article>)}
                        {!historyLoading && !sessions.length && <div className="cash-inline-empty">No hay cierres registrados.</div>}
                    </div>
                    {!historyLoading && historyMeta.total > 0 && <nav className="cash-pagination" aria-label="Paginación de cierres">
                        <span>Mostrando {historyMeta.from}-{historyMeta.to} de {historyMeta.total} cierres</span>
                        <div>
                            <button disabled={historyMeta.currentPage <= 1} onClick={() => setHistoryPage((page) => Math.max(1, page - 1))}><i className="bi bi-chevron-left" /> Anterior</button>
                            <strong>Página {historyMeta.currentPage} de {historyMeta.lastPage}</strong>
                            <button disabled={historyMeta.currentPage >= historyMeta.lastPage} onClick={() => setHistoryPage((page) => Math.min(historyMeta.lastPage, page + 1))}>Siguiente <i className="bi bi-chevron-right" /></button>
                        </div>
                    </nav>}
                </section>}
            </div>
        </MasterLayout>
        {reviewing && createPortal(
            <div className="cash-review-backdrop" onMouseDown={(event) => event.target === event.currentTarget && closeReviewModal()}>
                <section className="cash-review-modal" role="dialog" aria-modal="true" aria-labelledby="cash-review-title">
                    <header>
                        <div className="cash-review-modal-icon"><i className="bi bi-clipboard-check" /></div>
                        <div><span>CUADRE DE CAJA</span><h2 id="cash-review-title">Revisar cierre</h2><p>{reviewing.cash_register?.name || 'Caja'} · {reviewing.warehouse?.name}</p></div>
                        <button className="cash-review-close" type="button" aria-label="Cerrar revisión" disabled={saving} onClick={closeReviewModal}><i className="bi bi-x-lg" /></button>
                    </header>
                    <div className="cash-review-person">
                        <div><i className="bi bi-person" /></div>
                        <span><small>Responsable</small><strong>{reviewing.user?.first_name} {reviewing.user?.last_name}</strong><em>{new Date(reviewing.created_at).toLocaleString('es-EC')}</em></span>
                    </div>
                    <div className="cash-review-summary">
                        <div><span>Efectivo esperado</span><strong>{currency}{Number(reviewing.expected_cash || 0).toFixed(2)}</strong></div>
                        <div><span>Efectivo contado</span><strong>{currency}{Number(reviewing.cash_in_hand_while_closing || 0).toFixed(2)}</strong></div>
                        <div className={Number(reviewing.cash_difference) >= 0 ? 'is-positive' : 'is-negative'}><span>Diferencia</span><strong>{Number(reviewing.cash_difference) > 0 ? '+' : ''}{currency}{Number(reviewing.cash_difference || 0).toFixed(2)}</strong></div>
                    </div>
                    <div className="cash-review-reason"><i className="bi bi-info-circle" /><span><small>Motivo declarado</small><strong>{reviewing.discrepancy_reason || 'Sin motivo registrado'}</strong></span></div>
                    <label className="cash-review-note">Observación de supervisión <small>Obligatoria para rechazar el cierre.</small><textarea autoFocus value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} maxLength="1000" placeholder="Escribe una observación sobre el cuadre..." /></label>
                    <footer>
                        <button type="button" className="btn btn-light" disabled={saving} onClick={closeReviewModal}>Cancelar</button>
                        <button type="button" className="btn btn-danger" disabled={saving || !reviewNote.trim()} onClick={() => reviewClosure('REJECTED')}><i className="bi bi-x-circle" /> {saving ? 'Procesando...' : 'Rechazar'}</button>
                        <button type="button" className="btn btn-success" disabled={saving} onClick={() => reviewClosure('APPROVED')}><i className="bi bi-check-circle" /> {saving ? 'Procesando...' : 'Aprobar cierre'}</button>
                    </footer>
                </section>
            </div>,
            document.body
        )}
        {supervisedSession && createPortal(
            <div className="cash-review-backdrop" onMouseDown={(event) => event.target === event.currentTarget && closeSupervision()}>
                <section className="cash-supervision-modal" role="dialog" aria-modal="true" aria-labelledby="cash-supervision-title">
                    <header>
                        <div className="cash-supervision-modal-icon"><i className="bi bi-activity" /></div>
                        <div className="cash-supervision-modal-title"><span>SUPERVISIÓN EN TIEMPO REAL</span><h2 id="cash-supervision-title">{supervisedSession.cash_register?.name || 'Caja principal'}</h2><p>{supervisedSession.warehouse?.name} · {supervisedSession.user?.first_name} {supervisedSession.user?.last_name}</p></div>
                        <div className="cash-supervision-live"><i /> TURNO ABIERTO</div>
                        <button className="cash-review-close" type="button" aria-label="Cerrar movimientos" disabled={supervisionLoading} onClick={closeSupervision}><i className="bi bi-x-lg" /></button>
                    </header>

                    <div className="cash-supervision-kpis">
                        <div><span>Fondo inicial</span><strong>{currency}{supervisionSummary.openingCash.toFixed(2)}</strong></div>
                        <div className="is-primary"><span>Efectivo esperado</span><strong>{currency}{supervisionSummary.expectedCash.toFixed(2)}</strong></div>
                        <div className="is-positive"><span>Ventas en efectivo</span><strong>+{currency}{supervisionSummary.cashSales.toFixed(2)}</strong></div>
                        <div className="is-negative"><span>Salidas totales</span><strong>-{currency}{supervisionSummary.totalOut.toFixed(2)}</strong></div>
                    </div>

                    <div className="cash-supervision-breakdown">
                        <span>Ingresos manuales <b>+{currency}{supervisionSummary.manualIncome.toFixed(2)}</b></span>
                        <span>Transferencias recibidas <b>+{currency}{supervisionSummary.transfersIn.toFixed(2)}</b></span>
                        <span>Transferencias enviadas <b>-{currency}{supervisionSummary.transfersOut.toFixed(2)}</b></span>
                        <span>Reembolsos <b>-{currency}{supervisionSummary.refunds.toFixed(2)}</b></span>
                    </div>

                    <form className="cash-supervision-filters" onSubmit={(event) => { event.preventDefault(); loadSupervisedMovements(supervisedSession.id, 1, supervisionFilters); }}>
                        <label><i className="bi bi-search" /><input value={supervisionFilters.search} onChange={(event) => setSupervisionFilters({ ...supervisionFilters, search: event.target.value })} placeholder="Buscar referencia o detalle" /></label>
                        <select value={supervisionFilters.type} onChange={(event) => { const filters = { ...supervisionFilters, type: event.target.value }; setSupervisionFilters(filters); loadSupervisedMovements(supervisedSession.id, 1, filters); }}>
                            <option value="">Todos los movimientos</option>
                            {Object.entries(movementLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                        <button type="submit" disabled={supervisionLoading}><i className="bi bi-arrow-clockwise" /> Actualizar</button>
                    </form>

                    <div className="cash-supervision-ledger table-responsive">
                        <table><thead><tr><th>Fecha</th><th>Movimiento</th><th>Detalle</th><th>Referencia</th><th>Registrado por</th><th className="text-end">Monto</th></tr></thead><tbody>
                            {!supervisionLoading && supervisedMovements.map((item) => <tr key={item.id}><td>{new Date(item.created_at).toLocaleString('es-EC')}</td><td><span className={`cash-type is-${item.direction.toLowerCase()}`}>{movementLabels[item.type] || item.type}</span></td><td>{item.description || '—'}{item.reversal_reason && <small className="cash-reason">Motivo: {item.reversal_reason}</small>}</td><td>{item.reference || '—'}</td><td>{item.user ? `${item.user.first_name || ''} ${item.user.last_name || ''}`.trim() : '—'}</td><td className={`text-end cash-value is-${item.direction.toLowerCase()}`}>{item.direction === 'IN' ? '+' : '-'}{currency}{Number(item.amount).toFixed(2)}</td></tr>)}
                            {!supervisionLoading && !supervisedMovements.length && <tr><td colSpan="6" className="cash-no-data">No hay movimientos que coincidan con los filtros.</td></tr>}
                            {supervisionLoading && <tr><td colSpan="6" className="cash-no-data">Cargando movimientos de la caja...</td></tr>}
                        </tbody></table>
                    </div>

                    <footer className="cash-supervision-footer">
                        <span>{supervisionMeta.total > 0 ? `Mostrando ${supervisionMeta.from}-${supervisionMeta.to} de ${supervisionMeta.total} movimientos` : 'Sin movimientos registrados'}</span>
                        <div><button disabled={supervisionLoading || supervisionMeta.currentPage <= 1} onClick={() => loadSupervisedMovements(supervisedSession.id, Math.max(1, supervisionPage - 1), supervisionFilters)}><i className="bi bi-chevron-left" /> Anterior</button><strong>Página {supervisionMeta.currentPage} de {supervisionMeta.lastPage}</strong><button disabled={supervisionLoading || supervisionMeta.currentPage >= supervisionMeta.lastPage} onClick={() => loadSupervisedMovements(supervisedSession.id, Math.min(supervisionMeta.lastPage, supervisionPage + 1), supervisionFilters)}>Siguiente <i className="bi bi-chevron-right" /></button></div>
                    </footer>
                </section>
            </div>,
            document.body
        )}
        </>
    );
};

export default CashControl;
