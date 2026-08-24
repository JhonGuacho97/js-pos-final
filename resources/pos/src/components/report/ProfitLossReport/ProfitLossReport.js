import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";
import MasterLayout from "../../MasterLayout";
import TabTitle from "../../../shared/tab-title/TabTitle";
import DateRangePicker from "../../../shared/datepicker/DateRangePicker";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import { currencySymbolHandling, placeholderText } from "../../../shared/sharedMethod";
import { Filters, dateFormat } from "../../../constants";
import { fetchProfitAndLossReports } from "../../../store/action/profitAndLossReportAction";
import { fetchFrontSetting } from "../../../store/action/frontSettingAction";
import { fetchAllWarehouses } from "../../../store/action/warehouseAction";
import "./profit-loss-report.scss";

const COLORS = ["#2563eb", "#8b5cf6", "#14b8a6", "#f59e0b", "#ec4899", "#64748b"];

const ProfitLossReport = ({ fetchFrontSetting, fetchProfitAndLossReports, fetchAllWarehouses, frontSetting, profitAndLossReport = {}, warehouses = [], allConfigData, isLoading }) => {
    const startMonth = dayjs().startOf("month").format(dateFormat.NATIVE);
    const today = dayjs().format(dateFormat.NATIVE);
    const [period, setPeriod] = useState({ start_date: startMonth, end_date: today });
    const [warehouseId, setWarehouseId] = useState("");
    const currency = frontSetting?.value?.currency_symbol || "$";
    const report = profitAndLossReport || {};

    useEffect(() => { fetchFrontSetting(); fetchAllWarehouses(); }, []);
    useEffect(() => {
        fetchProfitAndLossReports({ created_at: Filters.OBJ.created_at, start_date: period.start_date, end_date: period.end_date, ...(warehouseId ? { warehouse_id: warehouseId } : {}) }, true);
    }, [period, warehouseId]);

    const money = (value) => currencySymbolHandling(allConfigData, currency, Number(value || 0));
    const comparison = report.comparison || {};
    const onDateSelector = ({ params }) => setPeriod(params?.start_date && params?.end_date ? params : { start_date: startMonth, end_date: today });
    const kpis = [
        { key: "net_sales", label: "Ventas netas", value: report.net_sales, help: "Ingresos sin impuestos", tone: "blue" },
        { key: "gross_profit", label: "Utilidad bruta", value: report.gross_profit, help: `Margen ${Number(report.gross_margin_percent || 0).toFixed(1)}%`, tone: "teal" },
        { key: "expenses", label: "Gastos operativos", value: report.expenses, help: "Registrados en el período", tone: "amber", inverse: true },
        { key: "net_profit", label: "Utilidad neta", value: report.net_profit, help: `Margen ${Number(report.net_margin_percent || 0).toFixed(1)}%`, tone: Number(report.net_profit || 0) >= 0 ? "green" : "red" },
    ];

    const trendOption = useMemo(() => ({
        color: ["#2563eb", "#14b8a6", "#7c3aed"], tooltip: { trigger: "axis", valueFormatter: (value) => money(value) },
        legend: { bottom: 0, icon: "circle", textStyle: { color: "#64748b" } }, grid: { left: 12, right: 16, top: 24, bottom: 42, containLabel: true },
        xAxis: { type: "category", boundaryGap: false, data: report.trend?.labels || [], axisLine: { lineStyle: { color: "#dbe3ef" } }, axisLabel: { color: "#64748b" } },
        yAxis: { type: "value", splitLine: { lineStyle: { color: "#edf2f7" } }, axisLabel: { color: "#64748b", formatter: (value) => `${currency}${value}` } },
        series: [
            { name: "Ventas netas", type: "line", smooth: true, symbol: "none", areaStyle: { color: "rgba(37,99,235,.10)" }, data: report.trend?.net_sales || [] },
            { name: "Utilidad bruta", type: "line", smooth: true, symbol: "none", data: report.trend?.gross_profit || [] },
            { name: "Utilidad neta", type: "line", smooth: true, symbol: "none", data: report.trend?.net_profit || [] },
        ],
    }), [report.trend, currency, allConfigData]);

    const expenseOption = useMemo(() => ({ color: COLORS, tooltip: { trigger: "item", formatter: ({ name, value, percent }) => `${name}<br/>${money(value)} · ${percent}%` }, series: [{ type: "pie", radius: ["62%", "84%"], center: ["50%", "50%"], label: { show: false }, data: (report.expense_breakdown || []).map((row) => ({ name: row.name, value: row.amount })) }] }), [report.expense_breakdown, currency, allConfigData]);

    const downloadCsv = () => {
        const rows = [["REPORTE DE PÉRDIDAS Y GANANCIAS"], ["Período", `${period.start_date} al ${period.end_date}`], [], ["RESUMEN", "VALOR"], ["Ventas netas", report.net_sales], ["Costo de mercadería", report.cost_of_goods_sold], ["Utilidad bruta", report.gross_profit], ["Gastos", report.expenses], ["Utilidad neta", report.net_profit], [], ["PRODUCTO", "CATEGORÍA", "CANTIDAD", "VENTAS", "COSTO", "UTILIDAD", "MARGEN %"], ...(report.product_profitability || []).map((row) => [row.name, row.category, row.quantity, row.revenue, row.cost, row.profit, row.margin_percent])];
        const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
        const url = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
        const link = document.createElement("a"); link.href = url; link.download = `perdidas-ganancias-${period.start_date}-${period.end_date}.csv`; link.click(); URL.revokeObjectURL(url);
    };

    const quality = report.cost_quality || {};
    const products = report.product_profitability || [];
    const categories = report.category_profitability || [];

    return <MasterLayout><TopProgressBar /><TabTitle title={placeholderText("profit-loss.reports.title")} />
        <div className="pl-report">
            <header className="pl-report__header"><div><span className="pl-report__eyebrow">RENTABILIDAD</span><h1>Pérdidas y ganancias</h1><p>Entiende qué vendes, cuánto cuesta y qué utilidad conserva el negocio.</p></div>
                <div className="pl-report__actions"><div className="pl-report__warehouse"><span>Sucursal</span><select value={warehouseId} onChange={(event) => setWarehouseId(event.target.value)}><option value="">Todas las sucursales</option>{warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.attributes?.name || warehouse.name}</option>)}</select></div><DateRangePicker onDateSelector={onDateSelector} isProfitReport selectDate={period} /><button className="pl-report__export" type="button" onClick={downloadCsv} disabled={isLoading}><i className="bi bi-download" /> Exportar CSV</button></div>
            </header>
            {quality.status && quality.status !== "exact" && <div className="pl-report__quality"><span className="pl-report__quality-icon"><i className="bi bi-info-circle" /></span><div><strong>Costos históricos estimados</strong><span>{quality.estimated_lines} de {quality.total_lines} líneas antiguas usan el costo reconstruido durante la actualización. Las ventas nuevas conservarán su costo exacto.</span></div></div>}
            <section className="pl-report__kpis">{kpis.map((item) => { const delta = comparison[item.key]; const improved = item.inverse ? Number(delta?.percent || 0) <= 0 : Number(delta?.percent || 0) >= 0; return <article className={`pl-kpi pl-kpi--${item.tone}`} key={item.key}><div className="pl-kpi__top"><span>{item.label}</span><span className="pl-kpi__dot" /></div><strong>{money(item.value)}</strong><div className="pl-kpi__foot"><span>{item.help}</span>{delta && <span className={improved ? "is-positive" : "is-negative"}>{Number(delta.percent) >= 0 ? "↑" : "↓"} {Math.abs(Number(delta.percent)).toFixed(1)}%</span>}</div></article>; })}</section>
            <section className="pl-report__grid pl-report__grid--wide">
                <article className="pl-panel pl-panel--trend"><PanelHeading eyebrow="EVOLUCIÓN" title="Rendimiento del período" aside={`Comparado con ${comparison.start_date || "el período anterior"}`} />{(report.trend?.labels || []).length ? <ReactECharts option={trendOption} style={{ height: 320 }} /> : <EmptyState text="No hay actividad para graficar en este período." />}</article>
                <article className="pl-panel pl-panel--bridge"><PanelHeading eyebrow="CÓMO SE FORMA" title="Puente de utilidad" /><div className="pl-bridge"><BridgeRow label="Ventas facturadas" formatted={money(report.gross_sales)} tone="blue" /><BridgeRow label="Devoluciones" formatted={`− ${money(report.sales_returns)}`} tone="red" /><BridgeRow label="Impuestos" formatted={`− ${money(report.taxes)}`} tone="amber" /><BridgeRow label="Costo de mercadería" formatted={`− ${money(report.cost_of_goods_sold)}`} tone="purple" /><BridgeRow label="Gastos operativos" formatted={`− ${money(report.expenses)}`} tone="red" /><div className="pl-bridge__result"><span>Utilidad neta</span><strong>{money(report.net_profit)}</strong></div></div></article>
            </section>
            <section className="pl-report__operations"><Operation label="Ventas facturadas" value={money(report.gross_sales)} /><Operation label="Impuestos incluidos" value={money(report.taxes)} /><Operation label="Costo de mercadería" value={money(report.cost_of_goods_sold)} /><Operation label="Cobrado en el período" value={money(report.sales_payment_amount)} /><Operation label="Cuentas por cobrar" value={money(report.outstanding_receivables)} /><Operation label="Ticket promedio" value={money(report.average_ticket)} detail={`${report.transactions || 0} transacciones`} /></section>
            <section className="pl-report__grid">
                <article className="pl-panel"><PanelHeading eyebrow="GASTOS" title="¿En qué se está gastando?" aside={money(report.expenses)} />{(report.expense_breakdown || []).length ? <div className="pl-expenses"><ReactECharts option={expenseOption} style={{ height: 220, width: 220 }} /><div className="pl-expenses__legend">{report.expense_breakdown.map((row, index) => <div key={row.name}><i style={{ background: COLORS[index % COLORS.length] }} /><span>{row.name}</span><strong>{money(row.amount)}</strong><small>{row.percent}%</small></div>)}</div></div> : <EmptyState text="No hay gastos registrados en este período." />}</article>
                <article className="pl-panel"><PanelHeading eyebrow="CATEGORÍAS" title="Rentabilidad por categoría" />{categories.length ? <div className="pl-category-list">{categories.slice(0, 7).map((row, index) => <div key={row.name}><span className="pl-category-list__rank">{index + 1}</span><span><strong>{row.name}</strong><small>{money(row.revenue)} en ventas</small></span><span className={row.profit >= 0 ? "is-positive" : "is-negative"}><strong>{money(row.profit)}</strong><small>{row.margin_percent}% margen</small></span></div>)}</div> : <EmptyState text="No hay categorías con movimiento." />}</article>
            </section>
            <article className="pl-panel pl-panel--products"><PanelHeading eyebrow="PRODUCTOS" title="Rentabilidad por producto" description="Detecta qué productos generan utilidad y cuáles erosionan el margen." aside={`${products.length} productos con movimiento`} />{products.length ? <div className="pl-table-wrap"><table className="pl-table"><thead><tr><th>Producto</th><th>Categoría</th><th>Cantidad</th><th>Ventas netas</th><th>Costo</th><th>Utilidad</th><th>Margen</th></tr></thead><tbody>{products.map((row) => <tr key={row.product_id}><td><strong>{row.name}</strong></td><td>{row.category}</td><td>{Number(row.quantity).toFixed(2)}</td><td>{money(row.revenue)}</td><td>{money(row.cost)}</td><td className={row.profit >= 0 ? "is-positive" : "is-negative"}>{money(row.profit)}</td><td><span className={`pl-margin ${row.margin_percent >= 0 ? "is-good" : "is-bad"}`}>{Number(row.margin_percent).toFixed(1)}%</span></td></tr>)}</tbody></table></div> : <EmptyState text="No hay productos con movimiento en este período." />}</article>
            {(report.warehouse_profitability || []).length > 1 && <article className="pl-panel pl-panel--warehouses"><PanelHeading eyebrow="SUCURSALES" title="Resultado por sucursal" /><div className="pl-warehouse-grid">{report.warehouse_profitability.map((row) => <div key={row.warehouse_id}><span>{row.name}</span><strong>{money(row.net_profit)}</strong><small>{money(row.net_sales)} ventas · {row.margin_percent}% margen</small></div>)}</div></article>}
        </div></MasterLayout>;
};

const PanelHeading = ({ eyebrow, title, description, aside }) => <div className="pl-panel__heading"><div><span>{eyebrow}</span><h2>{title}</h2>{description && <p>{description}</p>}</div>{aside && <small>{aside}</small>}</div>;
const BridgeRow = ({ label, formatted, tone }) => <div className="pl-bridge__row"><span><i className={`is-${tone}`} />{label}</span><strong>{formatted}</strong></div>;
const Operation = ({ label, value, detail }) => <article><span>{label}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</article>;
const EmptyState = ({ text }) => <div className="pl-empty"><i className="bi bi-bar-chart" /><span>{text}</span></div>;
const mapStateToProps = ({ frontSetting, profitAndLossReport, warehouses, allConfigData, isLoading }) => ({ frontSetting, profitAndLossReport, warehouses, allConfigData, isLoading });
export default connect(mapStateToProps, { fetchProfitAndLossReports, fetchFrontSetting, fetchAllWarehouses })(ProfitLossReport);
