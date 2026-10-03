import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MasterLayout from "../../MasterLayout";
import TabTitle from "../../../shared/tab-title/TabTitle";
import { currencySymbolHandling, placeholderText } from "../../../shared/sharedMethod";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import { fetchFrontSetting } from "../../../store/action/frontSettingAction";
import { fetchCustomerReportWidget } from "../../../store/action/customerReportWidgetAction";
import SalesTab from "./customer-tab/SalesTab";
import QuotationsTeb from "./customer-tab/QuotationsTeb";
import SaleReturnTabs from "./customer-tab/SaleReturnTabs";
import SalePayment from "./customer-tab/SalePayment";
import "./customer-report.scss";

const CustomerReportDetails = () => {
    const [activeTab, setActiveTab] = useState("sale");
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { frontSetting, customerReportWidgetData = {}, allConfigData } = useSelector((state) => state);
    const customer = customerReportWidgetData.customer || {};
    const currency = frontSetting?.value?.currency_symbol || "$";
    const totalAmount = Number(customerReportWidgetData.totalAmount || 0);
    const totalPaid = Number(customerReportWidgetData.totalPaid || 0);
    const totalDue = Math.max(0, Number(customerReportWidgetData.totalSalesDue || 0));
    const collectionRate = totalAmount > 0 ? Math.min(100, (totalPaid / totalAmount) * 100) : 0;
    const money = (value) => currencySymbolHandling(allConfigData, currency, Number(value || 0));
    const initials = (customer.name || `Cliente ${id}`).split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join("").toUpperCase();

    useEffect(() => {
        if (id) dispatch(fetchCustomerReportWidget(id));
        dispatch(fetchFrontSetting());
    }, [id]);

    const kpis = [
        { label: "Ventas registradas", value: Number(customerReportWidgetData.totalSale || 0), help: "Transacciones históricas", icon: "bi-receipt", tone: "is-blue", isMoney: false },
        { label: "Total facturado", value: totalAmount, help: "Valor comercial acumulado", icon: "bi-graph-up-arrow", tone: "is-purple", isMoney: true },
        { label: "Total cobrado", value: totalPaid, help: `${collectionRate.toFixed(1)}% recuperado`, icon: "bi-check2-circle", tone: "is-green", isMoney: true },
        { label: "Saldo pendiente", value: totalDue, help: totalDue > 0 ? "Requiere seguimiento" : "Cliente al día", icon: "bi-clock-history", tone: "is-amber", isMoney: true },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("customer.report.details.title")} />
            <main className="customer-report customer-report-detail">
                <button type="button" className="customer-report-detail__back" onClick={() => navigate("/app/report/customers")}>
                    <i className="bi bi-arrow-left" /> Volver al informe de clientes
                </button>

                <header className="customer-report__header">
                    <div className="customer-report-detail__identity">
                        <span className="customer-report-detail__avatar">{initials}</span>
                        <div>
                            <span className="customer-report__eyebrow">HISTORIAL DEL CLIENTE</span>
                            <h1>{customer.name || "Detalle comercial"}</h1>
                            <p>
                                <span><i className="bi bi-person-vcard" /> {customer.identification || `Cliente #${id}`}</span>
                                {customer.phone && <span><i className="bi bi-telephone" /> {customer.phone}</span>}
                                {customer.email && <span><i className="bi bi-envelope" /> {customer.email}</span>}
                            </p>
                        </div>
                    </div>
                    <span className="customer-report-detail__status"><i className="bi bi-circle-fill" /> Historial actualizado</span>
                </header>

                <section className="customer-report__kpis">
                    {kpis.map((item) => (
                        <article key={item.label} className={item.label === "Saldo pendiente" && totalDue > 0 ? "has-balance" : ""}>
                            <span className={`customer-report-kpi__icon ${item.tone}`}><i className={`bi ${item.icon}`} /></span>
                            <div><small>{item.label}</small><strong>{item.isMoney ? money(item.value) : item.value}</strong><p>{item.help}</p></div>
                        </article>
                    ))}
                    <div className="customer-report-detail__progress">
                        <div><i style={{ width: `${collectionRate}%` }} /></div>
                        <span>{collectionRate.toFixed(1)}% del total ha sido cobrado</span>
                    </div>
                </section>

                <section className="customer-report-detail__tabs">
                    <Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(key || "sale")}>
                        <Tab eventKey="sale" title={<><i className="bi bi-cart-check" /> Ventas</>}>
                            {activeTab === "sale" && <SalesTab allConfigData={allConfigData} customerId={id} />}
                        </Tab>
                        <Tab eventKey="Sale-payment" title={<><i className="bi bi-wallet2" /> Pagos</>}>
                            {activeTab === "Sale-payment" && <SalePayment allConfigData={allConfigData} customerId={id} />}
                        </Tab>
                        <Tab eventKey="Quotations" title={<><i className="bi bi-file-earmark-text" /> Cotizaciones</>}>
                            {activeTab === "Quotations" && <QuotationsTeb allConfigData={allConfigData} customerId={id} />}
                        </Tab>
                        <Tab eventKey="Sale-return" title={<><i className="bi bi-arrow-return-left" /> Devoluciones</>}>
                            {activeTab === "Sale-return" && <SaleReturnTabs allConfigData={allConfigData} customerId={id} />}
                        </Tab>
                    </Tabs>
                </section>
            </main>
        </MasterLayout>
    );
};

export default CustomerReportDetails;
