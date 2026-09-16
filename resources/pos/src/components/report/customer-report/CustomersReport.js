import React, { useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import MasterLayout from "../../MasterLayout";
import TabTitle from "../../../shared/tab-title/TabTitle";
import { currencySymbolHandling, placeholderText } from "../../../shared/sharedMethod";
import ReactDataTable from "../../../shared/table/ReactDataTable";
import { fetchFrontSetting } from "../../../store/action/frontSettingAction";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import { fetchCustomersReport, customerPdfAction } from "../../../store/action/customerReportAction";
import "./customer-report.scss";

const CustomersReport = ({
    isLoading,
    totalRecord,
    fetchFrontSetting,
    frontSetting,
    allCustomerReport = [],
    fetchCustomersReport,
    customerPdfAction,
    allConfigData,
}) => {
    const navigate = useNavigate();
    const currency = frontSetting?.value?.currency_symbol || "$";

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    const rows = useMemo(() => allCustomerReport.map((report) => ({
        name: report.name || "Cliente sin nombre",
        phone: report.phone || "Sin teléfono",
        email: report.email || "Sin correo",
        total_sale: Number(report.sales_count || 0),
        total_amount: Number(report.total_grand_amount || 0),
        total_paid_amount: Number(report.total_paid_amount || 0),
        total_due_amount: Math.max(0, Number(report.total_due_amount || 0)),
        id: report.id,
    })), [allCustomerReport]);

    const visibleSummary = useMemo(() => rows.reduce((summary, row) => ({
        sales: summary.sales + row.total_sale,
        billed: summary.billed + row.total_amount,
        paid: summary.paid + row.total_paid_amount,
        due: summary.due + row.total_due_amount,
    }), { sales: 0, billed: 0, paid: 0, due: 0 }), [rows]);

    const collectionRate = visibleSummary.billed > 0
        ? Math.min(100, (visibleSummary.paid / visibleSummary.billed) * 100)
        : 0;
    const money = (value) => currencySymbolHandling(allConfigData, currency, Number(value || 0));
    const initials = (name) => name.split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join("").toUpperCase();

    const exportVisibleCsv = () => {
        if (!rows.length) return;
        const values = [
            ["CLIENTE", "TELÉFONO", "CORREO", "VENTAS", "FACTURADO", "COBRADO", "PENDIENTE"],
            ...rows.map((row) => [row.name, row.phone, row.email, row.total_sale, row.total_amount, row.total_paid_amount, row.total_due_amount]),
        ];
        const csv = values.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
        const url = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = `informe-clientes-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const columns = [
        {
            name: "Cliente",
            sortField: "name",
            sortable: true,
            minWidth: "255px",
            cell: (row) => (
                <div className="customer-report-person">
                    <span className="customer-report-person__avatar">{initials(row.name)}</span>
                    <span><strong>{row.name}</strong><small>{row.phone} · {row.email}</small></span>
                </div>
            ),
        },
        {
            name: "Ventas",
            selector: (row) => row.total_sale,
            sortField: "total_sale",
            cell: (row) => <span className="customer-report-count">{row.total_sale}</span>,
        },
        {
            name: "Facturado",
            selector: (row) => money(row.total_amount),
            sortField: "total_amount",
            cell: (row) => <strong className="customer-report-money">{money(row.total_amount)}</strong>,
        },
        {
            name: "Cobrado",
            selector: (row) => money(row.total_paid_amount),
            sortField: "total_paid_amount",
            cell: (row) => <span className="customer-report-money is-paid">{money(row.total_paid_amount)}</span>,
        },
        {
            name: "Por cobrar",
            selector: (row) => money(row.total_due_amount),
            sortField: "total_due_amount",
            cell: (row) => row.total_due_amount > 0
                ? <span className="customer-report-balance is-due">{money(row.total_due_amount)}</span>
                : <span className="customer-report-balance is-clear"><i className="bi bi-check2" /> Al día</span>,
        },
        {
            name: "Acciones",
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            minWidth: "170px",
            cell: (row) => (
                <div className="customer-report-actions">
                    <button type="button" className="is-secondary" onClick={() => customerPdfAction(row.id)} title="Descargar PDF" aria-label={`Descargar informe PDF de ${row.name}`}>
                        <i className="bi bi-file-earmark-pdf" />
                    </button>
                    <button type="button" className="is-primary" onClick={() => navigate(`/app/report/customers/details/${row.id}`)}>
                        Ver detalle <i className="bi bi-arrow-right" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("customer.report.title")} />
            <main className="customer-report">
                <header className="customer-report__header">
                    <div>
                        <span className="customer-report__eyebrow">RELACIÓN COMERCIAL</span>
                        <h1>Informe de clientes</h1>
                        <p>Consulta ventas, cobros y saldos pendientes por cliente desde un solo lugar.</p>
                    </div>
                    <button type="button" className="customer-report__export" onClick={exportVisibleCsv} disabled={!rows.length || isLoading}>
                        <i className="bi bi-download" /> Exportar vista
                    </button>
                </header>

                <section className="customer-report__kpis" aria-label="Resumen de la página actual">
                    <article><span className="customer-report-kpi__icon is-blue"><i className="bi bi-people" /></span><div><small>Clientes</small><strong>{totalRecord || 0}</strong><p>{rows.length} visibles en esta página</p></div></article>
                    <article><span className="customer-report-kpi__icon is-purple"><i className="bi bi-receipt" /></span><div><small>Ventas visibles</small><strong>{visibleSummary.sales}</strong><p>{money(visibleSummary.billed)} facturado</p></div></article>
                    <article><span className="customer-report-kpi__icon is-green"><i className="bi bi-check2-circle" /></span><div><small>Cobrado</small><strong>{money(visibleSummary.paid)}</strong><p>{collectionRate.toFixed(1)}% de recuperación visible</p></div></article>
                    <article className={visibleSummary.due > 0 ? "has-balance" : ""}><span className="customer-report-kpi__icon is-amber"><i className="bi bi-clock-history" /></span><div><small>Por cobrar</small><strong>{money(visibleSummary.due)}</strong><p>{visibleSummary.due > 0 ? "Requiere seguimiento" : "Sin saldos visibles"}</p></div></article>
                </section>

                <section className="customer-report__panel">
                    <div className="customer-report__panel-heading">
                        <div><span>CARTERA POR CLIENTE</span><h2>Actividad comercial</h2><p>Busca un cliente y abre su historial completo para revisar cada movimiento.</p></div>
                        <small><i className="bi bi-info-circle" /> Los indicadores monetarios resumen la página actual.</small>
                    </div>
                    <ReactDataTable
                        columns={columns}
                        items={rows}
                        onChange={(filter) => fetchCustomersReport(filter, true)}
                        isLoading={isLoading}
                        totalRows={totalRecord}
                    />
                </section>
            </main>
        </MasterLayout>
    );
};

const mapStateToProps = ({ isLoading, totalRecord, frontSetting, allCustomerReport, allConfigData }) => ({
    isLoading,
    totalRecord,
    frontSetting,
    allCustomerReport,
    allConfigData,
});

export default connect(mapStateToProps, {
    fetchFrontSetting,
    fetchCustomersReport,
    customerPdfAction,
})(CustomersReport);
