import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import MasterLayout from "../../MasterLayout";
import TabTitle from "../../../shared/tab-title/TabTitle";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import { placeholderText } from "../../../shared/sharedMethod";
import { apiBaseURL } from "../../../constants";
import apiConfig from "../../../config/apiConfig";
import { fetchAllWarehouses } from "../../../store/action/warehouseAction";
import { fetchAllProductCategories } from "../../../store/action/productCategoryAction";
import "../inventory-report.scss";

const EMPTY_SUMMARY = { total: 0, out: 0, critical: 0, low: 0, shortage: 0 };
const SEVERITY = {
    out: { label: "Agotado", icon: "bi-x-circle", text: "Sin unidades disponibles" },
    critical: { label: "Crítico", icon: "bi-exclamation-triangle", text: "Llegó a la mitad del mínimo" },
    low: { label: "Stock bajo", icon: "bi-arrow-down-right", text: "Está por debajo del mínimo" },
};

const ProductQuantityReport = ({ warehouses = [], productCategories = [], fetchAllWarehouses, fetchAllProductCategories }) => {
    const [warehouseId, setWarehouseId] = useState("");
    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [severity, setSeverity] = useState("all");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [rows, setRows] = useState([]);
    const [summary, setSummary] = useState(EMPTY_SUMMARY);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => { fetchAllWarehouses(); fetchAllProductCategories(); }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            setLoading(true);
            setError("");
            try {
                const url = apiBaseURL.PRODUCT_STOCK_REPORT + (warehouseId ? `/${warehouseId}` : "");
                const response = await apiConfig.get(url, { params: { search: search || undefined, category_id: categoryId || undefined, severity, "page[size]": pageSize, "page[number]": page } });
                setRows(response.data.data || []);
                setSummary(response.data.summary || EMPTY_SUMMARY);
                setMeta(response.data.meta || { current_page: 1, last_page: 1, total: 0 });
            } catch (requestError) {
                setError(requestError?.response?.data?.message || "No se pudieron consultar las alertas de inventario.");
                setRows([]);
            } finally { setLoading(false); }
        }, search ? 320 : 0);
        return () => clearTimeout(timer);
    }, [warehouseId, search, categoryId, severity, page, pageSize]);

    const number = (value) => new Intl.NumberFormat("es-EC", { maximumFractionDigits: 4 }).format(Number(value || 0));
    const changeFilter = (setter) => (event) => { setter(event.target.value); setPage(1); };
    const clearFilters = () => { setSearch(""); setCategoryId(""); setSeverity("all"); setWarehouseId(""); setPage(1); };
    const warehouseName = useMemo(() => warehouses.find((item) => String(item.id) === String(warehouseId)), [warehouses, warehouseId]);
    const exportCsv = () => {
        const lines = [["Producto", "Código", "Categoría", "Bodega", "Existencia", "Mínimo", "Faltante", "Estado"], ...rows.map((row) => [row.name, row.code, row.category_name, row.warehouse_name, row.quantity, row.stock_alert, row.shortage, SEVERITY[row.severity]?.label])];
        const csv = lines.map((line) => line.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
        const url = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
        const link = document.createElement("a"); link.href = url; link.download = "alertas-inventario.csv"; link.click(); URL.revokeObjectURL(url);
    };

    const cards = [
        { label: "Alertas activas", value: summary.total, detail: "Productos que requieren atención", tone: "blue", icon: "bi-bell", filter: "all" },
        { label: "Agotados", value: summary.out, detail: "Sin disponibilidad", tone: "red", icon: "bi-x-octagon", filter: "out" },
        { label: "Nivel crítico", value: summary.critical, detail: "Atención prioritaria", tone: "amber", icon: "bi-exclamation-triangle", filter: "critical" },
        { label: "Unidades faltantes", value: number(summary.shortage), detail: "Para alcanzar los mínimos", tone: "teal", icon: "bi-box-arrow-in-down", filter: "all" },
    ];

    return <MasterLayout><TopProgressBar /><TabTitle title={placeholderText("product.quantity.alert.reports.title")} />
        <main className="inventory-report inventory-report--alerts">
            <header className="inventory-report__header"><div><span className="inventory-report__eyebrow">REPOSICIÓN</span><h1>Alertas de inventario</h1><p>Prioriza agotados y productos que están llegando a su nivel mínimo.</p></div><div className="inventory-report__header-actions"><button type="button" className="inventory-button inventory-button--light" onClick={() => window.location.href = "#/app/report/report-stock"}><i className="bi bi-boxes" /> Ver existencias</button><button type="button" className="inventory-button inventory-button--primary" onClick={exportCsv} disabled={!rows.length}><i className="bi bi-download" /> Exportar vista</button></div></header>
            <section className="inventory-kpis">{cards.map((item) => <button type="button" className={`inventory-kpi inventory-kpi--${item.tone}`} key={item.label} onClick={() => { setSeverity(item.filter); setPage(1); }}><span className="inventory-kpi__icon"><i className={`bi ${item.icon}`} /></span><span className="inventory-kpi__copy"><small>{item.label}</small><strong>{item.value}</strong><em>{item.detail}</em></span></button>)}</section>
            <section className="inventory-panel inventory-panel--filters">
                <div className="inventory-filter inventory-filter--search"><label>Buscar producto</label><div><i className="bi bi-search" /><input value={search} onChange={changeFilter(setSearch)} placeholder="Nombre, SKU o código de barras" />{search && <button type="button" onClick={() => setSearch("")}><i className="bi bi-x" /></button>}</div></div>
                <div className="inventory-filter"><label>Bodega</label><select value={warehouseId} onChange={changeFilter(setWarehouseId)}><option value="">Todas las bodegas</option>{warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.attributes?.name || warehouse.name}</option>)}</select></div>
                <div className="inventory-filter"><label>Categoría</label><select value={categoryId} onChange={changeFilter(setCategoryId)}><option value="">Todas</option>{productCategories.map((category) => <option key={category.id} value={category.id}>{category.attributes?.name || category.name}</option>)}</select></div>
                <div className="inventory-filter"><label>Prioridad</label><select value={severity} onChange={changeFilter(setSeverity)}><option value="all">Todas</option><option value="out">Agotados</option><option value="critical">Críticos</option><option value="low">Stock bajo</option></select></div>
                <button type="button" className="inventory-filter-reset" onClick={clearFilters}><i className="bi bi-arrow-counterclockwise" /><span>Limpiar</span></button>
            </section>
            {error && <div className="inventory-error"><i className="bi bi-exclamation-circle" /><span>{error}</span></div>}
            <section className="inventory-panel inventory-table-panel">
                <div className="inventory-panel__heading"><div><span>LISTA DE REPOSICIÓN</span><h2>{warehouseName?.attributes?.name || warehouseName?.name || "Todas las bodegas"}</h2></div><div className="inventory-panel__tools"><span className="inventory-result-count">{meta.total || 0} resultados</span><select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}>{[10, 25, 50, 100].map((size) => <option key={size} value={size}>{size} filas</option>)}</select></div></div>
                <div className={`inventory-table-wrap ${loading ? "is-loading" : ""}`}>{loading && <div className="inventory-loading"><span /><small>Evaluando mínimos…</small></div>}
                    <table className="inventory-table inventory-table--alerts"><thead><tr><th>Producto</th><th>Bodega</th><th>Existencia</th><th>Nivel mínimo</th><th>Faltante</th><th>Prioridad</th><th>Acciones</th></tr></thead><tbody>{!loading && !rows.length ? <tr><td colSpan="7"><div className="inventory-empty inventory-empty--success"><span><i className="bi bi-check2-circle" /></span><strong>Inventario bajo control</strong><small>No existen productos que coincidan con estos filtros.</small></div></td></tr> : rows.map((row) => { const detail = SEVERITY[row.severity] || SEVERITY.low; return <tr key={row.id}>
                        <td data-label="Producto"><div className="inventory-product"><span>{(row.name || "P").charAt(0)}</span><div><strong>{row.name}{row.variation_label ? ` · ${row.variation_label}` : ""}</strong><small>{row.code} · {row.category_name}</small></div></div></td><td data-label="Bodega"><span className="inventory-warehouse"><i className="bi bi-shop" />{row.warehouse_name}</span></td>
                        <td data-label="Existencia"><strong className={row.quantity <= 0 ? "is-negative" : "inventory-quantity"}>{number(row.quantity)}</strong> <small>{row.unit_name}</small></td><td data-label="Nivel mínimo">{number(row.stock_alert)} <small>{row.unit_name}</small></td><td data-label="Faltante"><strong>{number(row.shortage)}</strong> <small>{row.unit_name}</small></td>
                        <td data-label="Prioridad"><span className={`inventory-status inventory-status--${row.severity}`}><i className={`bi ${detail.icon}`} />{detail.label}</span><small className="inventory-status-help">{detail.text}</small></td><td className="inventory-actions"><button type="button" onClick={() => window.location.href = "#/app/adjustments/create"} title="Crear ajuste"><i className="bi bi-sliders" /><span>Ajustar</span></button><button type="button" onClick={() => window.location.href = `#/app/report/report-detail-stock/${row.product_id}`} title="Ver movimientos"><i className="bi bi-clock-history" /></button></td>
                    </tr>; })}</tbody></table>
                </div><Pagination meta={meta} page={page} setPage={setPage} />
            </section>
        </main>
    </MasterLayout>;
};

const Pagination = ({ meta, page, setPage }) => <footer className="inventory-pagination"><span>Mostrando <strong>{meta.total || 0}</strong> alertas</span><div><button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}><i className="bi bi-chevron-left" /> Anterior</button><small>Página {meta.current_page || page} de {meta.last_page || 1}</small><button type="button" disabled={page >= (meta.last_page || 1)} onClick={() => setPage(page + 1)}>Siguiente <i className="bi bi-chevron-right" /></button></div></footer>;
const mapStateToProps = ({ warehouses, productCategories }) => ({ warehouses, productCategories });
export default connect(mapStateToProps, { fetchAllWarehouses, fetchAllProductCategories })(ProductQuantityReport);
