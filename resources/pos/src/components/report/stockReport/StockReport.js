import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import dayjs from "dayjs";
import MasterLayout from "../../MasterLayout";
import TabTitle from "../../../shared/tab-title/TabTitle";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import { currencySymbolHandling, placeholderText } from "../../../shared/sharedMethod";
import { apiBaseURL } from "../../../constants";
import apiConfig from "../../../config/apiConfig";
import { fetchAllWarehouses } from "../../../store/action/warehouseAction";
import { fetchFrontSetting } from "../../../store/action/frontSettingAction";
import { fetchAllProductCategories } from "../../../store/action/productCategoryAction";
import { downloadExcel } from "../../../store/action/downloadReportAction";
import "../inventory-report.scss";

const EMPTY_SUMMARY = { products: 0, units: 0, healthy: 0, low: 0, critical: 0, out: 0, negative: 0, cost_value: 0, retail_value: 0 };
const STATUS = {
    healthy: { label: "Disponible", icon: "bi-check2-circle" },
    low: { label: "Stock bajo", icon: "bi-arrow-down-right" },
    critical: { label: "Crítico", icon: "bi-exclamation-triangle" },
    out: { label: "Agotado", icon: "bi-x-circle" },
    negative: { label: "Stock negativo", icon: "bi-dash-circle" },
};

const StockReport = ({ warehouses = [], productCategories = [], frontSetting, allConfigData, fetchAllWarehouses, fetchFrontSetting, fetchAllProductCategories, downloadExcel }) => {
    const [warehouseId, setWarehouseId] = useState("");
    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState("-updated_at");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [rows, setRows] = useState([]);
    const [summary, setSummary] = useState(EMPTY_SUMMARY);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const currency = frontSetting?.value?.currency_symbol || "$";

    useEffect(() => {
        fetchAllWarehouses();
        fetchAllProductCategories();
        fetchFrontSetting();
    }, []);

    useEffect(() => {
        if (warehouseId || !warehouses.length) return;
        const preferred = Number(frontSetting?.value?.default_warehouse);
        const selected = warehouses.find((item) => Number(item.id) === preferred) || warehouses[0];
        if (selected) setWarehouseId(String(selected.id));
    }, [warehouses, frontSetting, warehouseId]);

    useEffect(() => {
        if (!warehouseId) return undefined;
        const timer = setTimeout(async () => {
            setLoading(true);
            setError("");
            try {
                const response = await apiConfig.get(apiBaseURL.STOCK_REPORT, {
                    params: {
                        warehouse_id: warehouseId,
                        search: search || undefined,
                        category_id: categoryId || undefined,
                        status,
                        sort,
                        "page[size]": pageSize,
                        "page[number]": page,
                    },
                });
                setRows(response.data.data || []);
                setSummary(response.data.summary || EMPTY_SUMMARY);
                setMeta(response.data.meta || { current_page: 1, last_page: 1, total: 0 });
            } catch (requestError) {
                setError(requestError?.response?.data?.message || "No se pudo consultar el inventario.");
                setRows([]);
            } finally {
                setLoading(false);
            }
        }, search ? 320 : 0);
        return () => clearTimeout(timer);
    }, [warehouseId, search, categoryId, status, sort, page, pageSize]);

    const money = (value) => currencySymbolHandling(allConfigData, currency, Number(value || 0));
    const number = (value) => new Intl.NumberFormat("es-EC", { maximumFractionDigits: 4 }).format(Number(value || 0));
    const currentWarehouse = useMemo(() => warehouses.find((item) => String(item.id) === String(warehouseId)), [warehouses, warehouseId]);
    const resetFilters = () => { setSearch(""); setCategoryId(""); setStatus("all"); setSort("-updated_at"); setPage(1); };
    const changeFilter = (setter) => (event) => { setter(event.target.value); setPage(1); };
    const exportReport = () => {
        const params = new URLSearchParams({ warehouse_id: warehouseId });
        if (search) params.set("search", search);
        if (categoryId) params.set("category_id", categoryId);
        if (status !== "all") params.set("status", status);
        downloadExcel(`stock-report-excel?${params.toString()}`, "stock_report_excel_url");
    };

    const kpis = [
        { label: "Productos", value: summary.products, detail: `${number(summary.units)} unidades`, tone: "blue", filter: "all", icon: "bi-box-seam" },
        { label: "Valor a costo", value: money(summary.cost_value), detail: "Capital en inventario", tone: "teal", filter: "all", icon: "bi-wallet2" },
        { label: "Requieren atención", value: Number(summary.low) + Number(summary.critical), detail: `${summary.out} agotados`, tone: "amber", filter: "low", icon: "bi-exclamation-diamond" },
        { label: "Valor de venta", value: money(summary.retail_value), detail: "Potencial del inventario", tone: "purple", filter: "all", icon: "bi-graph-up-arrow" },
    ];

    return <MasterLayout><TopProgressBar /><TabTitle title={placeholderText("stock.reports.title")} />
        <main className="inventory-report">
            <header className="inventory-report__header">
                <div><span className="inventory-report__eyebrow">CONTROL DE INVENTARIO</span><h1>Existencias</h1><p>Consulta el valor, disponibilidad y estado real de cada producto por bodega.</p></div>
                <div className="inventory-report__header-actions">
                    <button type="button" className="inventory-button inventory-button--light" onClick={() => window.location.href = "#/app/kardex"}><i className="bi bi-clock-history" /> Kardex</button>
                    <button type="button" className="inventory-button inventory-button--primary" onClick={exportReport} disabled={!warehouseId || loading}><i className="bi bi-file-earmark-excel" /> Exportar</button>
                </div>
            </header>

            <section className="inventory-kpis">{kpis.map((item) => <button type="button" className={`inventory-kpi inventory-kpi--${item.tone}`} key={item.label} onClick={() => { setStatus(item.filter); setPage(1); }}>
                <span className="inventory-kpi__icon"><i className={`bi ${item.icon}`} /></span><span className="inventory-kpi__copy"><small>{item.label}</small><strong>{item.value}</strong><em>{item.detail}</em></span>
            </button>)}</section>

            <section className="inventory-panel inventory-panel--filters">
                <div className="inventory-filter inventory-filter--search"><label>Buscar producto</label><div><i className="bi bi-search" /><input value={search} onChange={changeFilter(setSearch)} placeholder="Nombre, SKU o código de barras" />{search && <button type="button" onClick={() => { setSearch(""); setPage(1); }}><i className="bi bi-x" /></button>}</div></div>
                <div className="inventory-filter"><label>Bodega</label><select value={warehouseId} onChange={changeFilter(setWarehouseId)}>{warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.attributes?.name || warehouse.name}</option>)}</select></div>
                <div className="inventory-filter"><label>Categoría</label><select value={categoryId} onChange={changeFilter(setCategoryId)}><option value="">Todas</option>{productCategories.map((category) => <option key={category.id} value={category.id}>{category.attributes?.name || category.name}</option>)}</select></div>
                <div className="inventory-filter"><label>Estado</label><select value={status} onChange={changeFilter(setStatus)}><option value="all">Todos</option><option value="healthy">Disponible</option><option value="low">Stock bajo</option><option value="critical">Crítico</option><option value="out">Agotado</option><option value="negative">Negativo</option></select></div>
                <button type="button" className="inventory-filter-reset" onClick={resetFilters}><i className="bi bi-arrow-counterclockwise" /><span>Limpiar</span></button>
            </section>

            {error && <div className="inventory-error"><i className="bi bi-exclamation-circle" /><span>{error}</span></div>}

            <section className="inventory-panel inventory-table-panel">
                <div className="inventory-panel__heading"><div><span>DETALLE POR PRODUCTO</span><h2>{currentWarehouse?.attributes?.name || currentWarehouse?.name || "Bodega"}</h2></div><div className="inventory-panel__tools"><select value={sort} onChange={changeFilter(setSort)}><option value="-updated_at">Actualizados recientemente</option><option value="quantity">Menor existencia</option><option value="-quantity">Mayor existencia</option></select><select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}>{[10, 25, 50, 100].map((size) => <option key={size} value={size}>{size} filas</option>)}</select></div></div>
                <div className={`inventory-table-wrap ${loading ? "is-loading" : ""}`}>
                    {loading && <div className="inventory-loading"><span /><small>Actualizando existencias…</small></div>}
                    <table className="inventory-table"><thead><tr><th>Producto</th><th>Categoría</th><th>Existencia</th><th>Mínimo</th><th>Estado</th><th>Costo unit.</th><th>Valor stock</th><th>Actualización</th><th /></tr></thead>
                        <tbody>{!loading && !rows.length ? <tr><td colSpan="9"><EmptyInventory /></td></tr> : rows.map((row) => <tr key={row.id}>
                            <td data-label="Producto"><div className="inventory-product"><span>{row.is_kit ? <i className="bi bi-boxes" /> : (row.name || "P").charAt(0)}</span><div><strong>{row.name}{row.variation_label ? ` · ${row.variation_label}` : ""}</strong><small>{row.code}{row.product_code && row.product_code !== row.code ? ` · ${row.product_code}` : ""}</small></div></div></td>
                            <td data-label="Categoría">{row.category_name}</td><td data-label="Existencia"><strong className="inventory-quantity">{number(row.quantity)}</strong> <small>{row.unit_name}</small></td><td data-label="Mínimo">{number(row.stock_alert)} <small>{row.unit_name}</small></td>
                            <td data-label="Estado"><StatusBadge status={row.status} /></td><td data-label="Costo unit.">{money(row.product_cost)}</td><td data-label="Valor stock"><strong>{money(row.cost_value)}</strong></td><td data-label="Actualización"><span className="inventory-date">{row.updated_at ? dayjs(row.updated_at).format("DD/MM/YYYY") : "—"}</span></td>
                            <td className="inventory-row-actions"><button type="button" title="Ver movimientos" onClick={() => window.location.href = `#/app/report/report-detail-stock/${row.product_id}`}><i className="bi bi-arrow-right" /></button></td>
                        </tr>)}</tbody></table>
                </div>
                <Pagination meta={meta} page={page} setPage={setPage} />
            </section>
        </main>
    </MasterLayout>;
};

const StatusBadge = ({ status }) => { const item = STATUS[status] || STATUS.healthy; return <span className={`inventory-status inventory-status--${status}`}><i className={`bi ${item.icon}`} />{item.label}</span>; };
const EmptyInventory = () => <div className="inventory-empty"><span><i className="bi bi-box-seam" /></span><strong>No encontramos existencias</strong><small>Prueba cambiando los filtros o seleccionando otra bodega.</small></div>;
const Pagination = ({ meta, page, setPage }) => <footer className="inventory-pagination"><span>Mostrando <strong>{meta.total || 0}</strong> productos</span><div><button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}><i className="bi bi-chevron-left" /> Anterior</button><small>Página {meta.current_page || page} de {meta.last_page || 1}</small><button type="button" disabled={page >= (meta.last_page || 1)} onClick={() => setPage(page + 1)}>Siguiente <i className="bi bi-chevron-right" /></button></div></footer>;

const mapStateToProps = ({ warehouses, productCategories, frontSetting, allConfigData }) => ({ warehouses, productCategories, frontSetting, allConfigData });
export default connect(mapStateToProps, { fetchAllWarehouses, fetchFrontSetting, fetchAllProductCategories, downloadExcel })(StockReport);
