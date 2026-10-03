import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Tab, Tabs } from "react-bootstrap";
import MasterLayout from "../../MasterLayout";
import TabTitle from "../../../shared/tab-title/TabTitle";
import {
    getFormattedMessage,
    placeholderText,
} from "../../../shared/sharedMethod";
import ReactSelect from "../../../shared/select/reactSelect";
import { fetchAllWarehouses } from "../../../store/action/warehouseAction";
import SaleReturnTab from "./SaleReturnTab";
import SalesTab from "./SalesTab";
import PurchaseReturnTab from "./PurchaseReturnTab";
import ExpensesTab from "./ExpensesTab";
import { fetchWarehouseReport } from "../../../store/action/warehouseReportAction";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import "../report-workspace.scss";

const WarehouseReport = (props) => {
    const {
        warehouses,
        fetchAllWarehouses,
        fetchWarehouseReport,
        warehouseReportData,
        allConfigData,
    } = props;
    const [warehouseValue, setWarehouseValue] = useState({
        label: getFormattedMessage("unit.filter.all.label"),
        value: null,
    });
    const [key, setKey] = useState("sales");

    useEffect(() => {
        fetchAllWarehouses();
    }, []);

    useEffect(() => {
        fetchWarehouseReport(warehouseValue.value);
    }, [warehouseValue]);

    const onWarehouseChange = (obj) => {
        setWarehouseValue(obj);
    };

    const array = warehouses;
    const newFirstElement = {
        attributes: { name: getFormattedMessage("report-all.warehouse.label") },
        id: null,
    };
    const newArray = [newFirstElement].concat(array);
    const selectedWarehouseName = warehouseValue?.label || getFormattedMessage("report-all.warehouse.label");
    const summaryCards = [
        { label: "Ventas", value: warehouseReportData?.sale_count, helper: "Operaciones comerciales", icon: "bi-cart-check", tone: "is-blue" },
        { label: "Compras", value: warehouseReportData?.purchase_count, helper: "Entradas registradas", icon: "bi-bag-check", tone: "is-purple" },
        { label: "Devoluciones de venta", value: warehouseReportData?.sale_return_count, helper: "Retornos de clientes", icon: "bi-arrow-return-left", tone: "is-amber" },
        { label: "Devoluciones de compra", value: warehouseReportData?.purchase_return_count, helper: "Retornos a proveedores", icon: "bi-arrow-return-right", tone: "is-green" },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("warehouse.reports.title")} />
            <main className="report-workspace report-workspace--warehouse">
                <header className="report-workspace__header">
                    <div>
                        <span className="report-workspace__eyebrow">VISIÓN OPERATIVA</span>
                        <h1>Informe de almacén</h1>
                        <p>Compara la actividad de ventas, compras, devoluciones y gastos por ubicación.</p>
                    </div>
                    <div className="report-workspace__warehouse-filter">
                        <span>Almacén analizado</span>
                        {newArray && (
                            <ReactSelect
                                data={newArray}
                                onChange={onWarehouseChange}
                                defaultValue={newArray[0] ? { label: newArray[0].attributes.name, value: newArray[0].id } : ""}
                                errors={""}
                                placeholder={placeholderText("purchase.select.warehouse.placeholder.label")}
                            />
                        )}
                    </div>
                </header>

                <section className="report-workspace__scope">
                    <span className="report-workspace__scope-icon"><i className="bi bi-shop" /></span>
                    <div><small>Alcance actual</small><strong>{selectedWarehouseName}</strong><p>Los indicadores y movimientos se actualizan con esta selección.</p></div>
                </section>

                <section className="report-workspace__kpis" aria-label="Resumen operativo del almacén">
                    {summaryCards.map((card) => (
                        <article key={card.label}>
                            <span className={`report-workspace-kpi__icon ${card.tone}`}><i className={`bi ${card.icon}`} /></span>
                            <div><small>{card.label}</small><strong>{Number(card.value || 0).toLocaleString()}</strong><p>{card.helper}</p></div>
                        </article>
                    ))}
                </section>

                <section className="report-workspace__panel report-workspace__panel--tabs">
                    <div className="report-workspace__panel-heading">
                        <div><span>DETALLE OPERATIVO</span><h2>Movimientos del almacén</h2><p>Cambia de categoría y aplica filtros para revisar cada tipo de operación.</p></div>
                        <small><i className="bi bi-arrow-repeat" /> La información corresponde a {selectedWarehouseName}.</small>
                    </div>
                    <Tabs
                        defaultActiveKey="sales"
                        id="warehouse-report-tabs"
                        onSelect={(k) => setKey(k)}
                        className="report-workspace__tabs"
                    >
                <Tab
                    eventKey="sales"
                    title={getFormattedMessage("sales.title")}
                    tabClassName="report-workspace__tab"
                >
                    <div className="w-100 mx-auto">
                        {key === "sales" && (
                            <SalesTab
                                allConfigData={allConfigData}
                                warehouseValue={warehouseValue}
                            />
                        )}
                    </div>
                </Tab>
                <Tab
                    eventKey="sales-return"
                    title={getFormattedMessage("sales-return.title")}
                    tabClassName="report-workspace__tab"
                >
                    <div className="w-100 mx-auto">
                        {key === "sales-return" && (
                            <SaleReturnTab
                                allConfigData={allConfigData}
                                warehouseValue={warehouseValue}
                            />
                        )}
                    </div>
                </Tab>
                <Tab
                    eventKey="purchase-return"
                    title={getFormattedMessage("purchases.return.title")}
                    tabClassName="report-workspace__tab"
                >
                    <div className="w-100 mx-auto">
                        {key === "purchase-return" && (
                            <PurchaseReturnTab
                                allConfigData={allConfigData}
                                warehouseValue={warehouseValue}
                            />
                        )}
                    </div>
                </Tab>
                <Tab
                    eventKey="expenses"
                    title={getFormattedMessage("expenses.title")}
                    tabClassName="report-workspace__tab"
                >
                    <div className="w-100 mx-auto">
                        {key === "expenses" && (
                            <ExpensesTab
                                allConfigData={allConfigData}
                                warehouseValue={warehouseValue}
                            />
                        )}
                    </div>
                </Tab>
                    </Tabs>
                </section>
            </main>
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { warehouses, warehouseReportData, allConfigData } = state;
    return { warehouses, warehouseReportData, allConfigData };
};

export default connect(mapStateToProps, {
    fetchAllWarehouses,
    fetchWarehouseReport,
})(WarehouseReport);
