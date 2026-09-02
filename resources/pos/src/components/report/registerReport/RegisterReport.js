import React, { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useDispatch, useSelector } from "react-redux";
import MasterLayout from "../../MasterLayout";
import TabTitle from "../../../shared/tab-title/TabTitle";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import apiConfig from "../../../config/apiConfig";
import { fetchUsers } from "../../../store/action/userAction";
import { addToast } from "../../../store/action/toastAction";
import { toastType } from "../../../constants";
import { currencySymbolHandling, getAvatarName } from "../../../shared/sharedMethod";
import RegisterDenominationsModal from "./RegisterDenominationsModal";
import "./register-report.scss";

dayjs.extend(localizedFormat);

const emptySummary = { sessions: 0, expected_cash: 0, counted_cash: 0, net_difference: 0, absolute_difference: 0, balanced: 0, pending: 0, balanced_rate: 0 };
const statusLabels = { BALANCED: "Cuadrada", PENDING: "Pendiente", APPROVED: "Aprobada", REJECTED: "Rechazada" };

const RegisterReport = () => {
    const dispatch = useDispatch();
    const { frontSetting, allConfigData, users } = useSelector((state) => state);
    const currency = frontSetting?.value?.currency_symbol || "$";
    const [rows, setRows] = useState([]);
    const [summary, setSummary] = useState(emptySummary);
    const [options, setOptions] = useState({ warehouses: [], cash_registers: [] });
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, from: 0, to: 0, total: 0 });
    const [selectedRegister, setSelectedRegister] = useState(null);
    const [filters, setFilters] = useState({
        search: "", user_id: "", warehouse_id: "", cash_register_id: "", reconciliation_status: "", difference: "",
        start_date: dayjs().subtract(29, "day").format("YYYY-MM-DD"), end_date: dayjs().format("YYYY-MM-DD"),
    });

    useEffect(() => { dispatch(fetchUsers({}, true, "?page[size]=0&returnAll=true")); }, [dispatch]);

    const requestParams = useCallback((targetPage = page, size = 10) => {
        const params = { "page[number]": targetPage, "page[size]": size };
        Object.entries(filters).forEach(([key, value]) => { if (value !== "" && value !== null && value !== undefined) params[key] = value; });
        return params;
    }, [filters, page]);

    const loadReport = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiConfig.get("register-report", { params: requestParams() });
            setRows(response.data?.data || []);
            setSummary(response.data?.summary || emptySummary);
            setOptions(response.data?.filter_options || { warehouses: [], cash_registers: [] });
            setMeta(response.data?.meta || { current_page: 1, last_page: 1, from: 0, to: 0, total: 0 });
        } catch (error) {
            dispatch(addToast({ text: error?.response?.data?.message || "No fue posible cargar el informe de cajas.", type: toastType.ERROR }));
        } finally { setLoading(false); }
    }, [dispatch, requestParams]);

    useEffect(() => {
        const timer = setTimeout(loadReport, filters.search ? 350 : 0);
        return () => clearTimeout(timer);
    }, [loadReport]);

    const updateFilter = (key, value) => {
        setPage(1);
        setFilters((current) => ({ ...current, [key]: value, ...(key === "warehouse_id" ? { cash_register_id: "" } : {}) }));
    };

    const money = (value) => currencySymbolHandling(allConfigData, currency, Number(value || 0));
    const mappedRows = useMemo(() => rows.map((item) => {
        const a = item?.attributes || {};
        return { id: item.id, ...a, user_first_name: a.user?.first_name || "", user_last_name: a.user?.last_name || "", user_email: a.user?.email || "", user_image: a.user?.image_url || null, open_date: dayjs(a.created_at).format("DD/MM/YYYY"), open_time: dayjs(a.created_at).format("LT"), close_date: dayjs(a.closed_at).format("DD/MM/YYYY"), close_time: dayjs(a.closed_at).format("LT") };
    }), [rows]);
    const visibleRegisters = useMemo(() => options.cash_registers.filter((register) => !filters.warehouse_id || Number(register.warehouse_id) === Number(filters.warehouse_id)), [options.cash_registers, filters.warehouse_id]);
    const formatDuration = (minutes) => { const value = Number(minutes || 0); if (!value) return "—"; const hours = Math.floor(value / 60); const mins = value % 60; return hours ? `${hours} h ${mins} min` : `${mins} min`; };
    const differenceTone = (row) => { const difference = Number(row.cash_difference || 0); if (row.reconciliation_status === "REJECTED") return "danger"; if (Math.abs(difference) <= 0.009) return "success"; return difference < 0 ? "danger" : "warning"; };

    const exportCsv = async () => {
        setExporting(true);
        try {
            const first = await apiConfig.get("register-report", { params: requestParams(1, 100) });
            let allRows = first.data?.data || [];
            const lastPage = Number(first.data?.meta?.last_page || 1);
            for (let current = 2; current <= lastPage; current += 1) {
                const response = await apiConfig.get("register-report", { params: requestParams(current, 100) });
                allRows = allRows.concat(response.data?.data || []);
            }
            const headings = ["Caja", "Código", "Cajero", "Almacén", "Apertura", "Cierre", "Fondo inicial", "Esperado", "Contado", "Diferencia", "Estado"];
            const values = allRows.map((item) => { const a = item.attributes || {}; return [a.cash_register?.name, a.cash_register?.code, `${a.user?.first_name || ""} ${a.user?.last_name || ""}`.trim(), a.warehouse?.name, dayjs(a.created_at).format("DD/MM/YYYY HH:mm"), dayjs(a.closed_at).format("DD/MM/YYYY HH:mm"), a.cash_in_hand, a.expected_cash, a.cash_in_hand_while_closing, a.cash_difference, statusLabels[a.reconciliation_status] || a.reconciliation_status]; });
            const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
            const csv = [headings, ...values].map((line) => line.map(escape).join(",")).join("\r\n");
            const link = document.createElement("a");
            link.href = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
            link.download = `informe-cajas-${dayjs().format("YYYY-MM-DD")}.csv`;
            link.click(); URL.revokeObjectURL(link.href);
        } catch (error) { dispatch(addToast({ text: "No fue posible exportar el informe.", type: toastType.ERROR })); }
        finally { setExporting(false); }
    };

    return <MasterLayout>
        <TopProgressBar />
        <TabTitle title="Informe de cajas" />
        <main className="register-report-v2">
            <header className="register-report-heading">
                <div><span>CONTROL Y AUDITORÍA</span><h1>Informe de cajas</h1><p>Analiza cierres, diferencias y movimientos históricos de cada turno.</p></div>
                <button className="btn register-report-export" onClick={exportCsv} disabled={exporting || loading}><i className="bi bi-download" /> {exporting ? "Preparando…" : "Exportar CSV"}</button>
            </header>

            <section className="register-report-metrics">
                <article><span>Turnos cerrados</span><strong>{summary.sessions}</strong><small>{summary.balanced_rate}% sin diferencias</small></article>
                <article><span>Efectivo esperado</span><strong>{money(summary.expected_cash)}</strong><small>En el rango filtrado</small></article>
                <article><span>Efectivo contado</span><strong>{money(summary.counted_cash)}</strong><small>Declarado en cierres</small></article>
                <article className={Number(summary.net_difference) < 0 ? "is-negative" : ""}><span>Diferencia neta</span><strong>{Number(summary.net_difference) > 0 ? "+" : ""}{money(summary.net_difference)}</strong><small>{summary.pending} {summary.pending === 1 ? "cierre pendiente" : "cierres pendientes"}</small></article>
            </section>

            <section className="register-report-panel">
                <div className="register-report-filters">
                    <label className="report-search"><i className="bi bi-search" /><input value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} placeholder="Buscar cajero, caja o nota…" /></label>
                    <select value={filters.user_id} onChange={(event) => updateFilter("user_id", event.target.value)}><option value="">Todos los cajeros</option>{(users || []).map((user) => <option key={user.id} value={user.id}>{user.attributes?.first_name} {user.attributes?.last_name}</option>)}</select>
                    <select value={filters.warehouse_id} onChange={(event) => updateFilter("warehouse_id", event.target.value)}><option value="">Todos los almacenes</option>{options.warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}</select>
                    <select value={filters.cash_register_id} onChange={(event) => updateFilter("cash_register_id", event.target.value)}><option value="">Todas las cajas</option>{visibleRegisters.map((register) => <option key={register.id} value={register.id}>{register.name} · {register.code}</option>)}</select>
                    <select value={filters.difference} onChange={(event) => updateFilter("difference", event.target.value)}><option value="">Cualquier resultado</option><option value="balanced">Cuadradas</option><option value="shortage">Con faltante</option><option value="surplus">Con sobrante</option></select>
                    <select value={filters.reconciliation_status} onChange={(event) => updateFilter("reconciliation_status", event.target.value)}><option value="">Cualquier revisión</option><option value="PENDING">Pendiente</option><option value="APPROVED">Aprobada</option><option value="REJECTED">Rechazada</option><option value="BALANCED">No requiere revisión</option></select>
                    <label className="report-date"><span>Desde</span><input type="date" value={filters.start_date} onChange={(event) => updateFilter("start_date", event.target.value)} /></label>
                    <label className="report-date"><span>Hasta</span><input type="date" value={filters.end_date} onChange={(event) => updateFilter("end_date", event.target.value)} /></label>
                </div>

                <div className="register-report-table-wrap"><table className="register-report-table">
                    <thead><tr><th>Turno / caja</th><th>Cajero / almacén</th><th>Fondo inicial</th><th>Esperado</th><th>Contado</th><th>Resultado</th><th /></tr></thead>
                    <tbody>
                    {!loading && mappedRows.map((row) => { const name = `${row.user_first_name} ${row.user_last_name}`.trim(); const tone = differenceTone(row); const difference = Number(row.cash_difference || 0); return <tr key={row.id}>
                        <td data-label="Turno / caja"><div className="report-cell-title">{row.cash_register?.name || "Caja sin asignar"}</div><small>{row.cash_register?.code || `Turno #${row.id}`} · {formatDuration(row.duration_minutes)}</small><div className="report-period">{row.open_date} {row.open_time} → {row.close_time}</div></td>
                        <td data-label="Cajero / almacén"><div className="report-user"><span>{row.user_image ? <img src={row.user_image} alt={name} /> : getAvatarName(name)}</span><div><b>{name || "Usuario"}</b><small>{row.warehouse?.name || "Sin almacén"}</small></div></div></td>
                        <td data-label="Fondo inicial"><b>{money(row.cash_in_hand)}</b></td><td data-label="Esperado"><b>{money(row.expected_cash)}</b></td><td data-label="Contado"><b>{money(row.cash_in_hand_while_closing)}</b></td>
                        <td data-label="Resultado"><span className={`report-status ${tone}`}>{statusLabels[row.reconciliation_status] || (difference === 0 ? "Cuadrada" : difference > 0 ? "Sobrante" : "Faltante")}</span><strong className={`report-difference ${tone}`}>{difference > 0 ? "+" : ""}{money(difference)}</strong></td>
                        <td><button className="report-detail-button" onClick={() => setSelectedRegister(row)}><span>Ver detalle</span><i className="bi bi-arrow-right" /></button></td>
                    </tr>; })}
                    {!loading && !mappedRows.length && <tr><td colSpan="7"><div className="report-empty"><i className="bi bi-inbox" /><strong>No hay cierres para estos filtros</strong><span>Prueba ampliando el rango de fechas o limpiando algún filtro.</span></div></td></tr>}
                    {loading && <tr><td colSpan="7"><div className="report-empty"><span className="spinner-border spinner-border-sm" /><strong>Cargando informe…</strong></div></td></tr>}
                    </tbody>
                </table></div>
                <footer className="register-report-pagination"><span>Mostrando {meta.from || 0}–{meta.to || 0} de {meta.total || 0} cierres</span><div><button disabled={page <= 1 || loading} onClick={() => setPage((value) => value - 1)}><i className="bi bi-chevron-left" /> Anterior</button><b>{page} / {meta.last_page || 1}</b><button disabled={page >= (meta.last_page || 1) || loading} onClick={() => setPage((value) => value + 1)}>Siguiente <i className="bi bi-chevron-right" /></button></div></footer>
            </section>
        </main>
        <RegisterDenominationsModal show={Boolean(selectedRegister)} onHide={() => setSelectedRegister(null)} register={selectedRegister} currencySymbol={currency} allConfigData={allConfigData} />
    </MasterLayout>;
};

export default RegisterReport;
