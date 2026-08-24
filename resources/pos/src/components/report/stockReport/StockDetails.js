import React, { useEffect, useMemo, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import MasterLayout from "../../MasterLayout";
import TabTitle from "../../../shared/tab-title/TabTitle";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import HeaderTitle from "../../header/HeaderTitle";
import SaleTabs from "./stockDetails/SaleTabs";
import SaleReturnTabs from "./stockDetails/SaleReturnTabs";
import PurchaseTab from "./stockDetails/PurchaseTabs";
import PurchaseReturnTabs from "./stockDetails/PurchaseReturnTabs";
import { getFormattedMessage, placeholderText } from "../../../shared/sharedMethod";
import { stockDetailsWarehouseAction } from "../../../store/action/stockDetailsWarehouse";
import "../inventory-report.scss";

const StockDetails = ({ stockDetailsWarehouseAction, stockWarehouse = [], allConfigData }) => {
    const [key, setKey] = useState("sales");
    const { id } = useParams();
    useEffect(() => { stockDetailsWarehouseAction(id); }, [id]);

    const product = stockWarehouse[0]?.product;
    const total = useMemo(() => stockWarehouse.reduce((sum, stock) => sum + Number(stock.quantity || 0), 0), [stockWarehouse]);
    const unit = stockWarehouse[0]?.product_unit_name || "";
    const tabs = [
        { key: "sales", label: getFormattedMessage("sales.title"), icon: "bi-cart-check", component: <SaleTabs allConfigData={allConfigData} id={id} /> },
        { key: "sales-return", label: getFormattedMessage("sales-return.title"), icon: "bi-arrow-return-left", component: <SaleReturnTabs allConfigData={allConfigData} id={id} /> },
        { key: "purchase", label: getFormattedMessage("purchase.title"), icon: "bi-bag-check", component: <PurchaseTab allConfigData={allConfigData} id={id} /> },
        { key: "purchase-return", label: getFormattedMessage("purchases.return.title"), icon: "bi-arrow-return-right", component: <PurchaseReturnTabs allConfigData={allConfigData} id={id} /> },
    ];

    return <MasterLayout><TopProgressBar /><HeaderTitle title={getFormattedMessage("stock.report.details.title")} to="/app/report/report-stock" /><TabTitle title={placeholderText("stock.report.details.title")} />
        <main className="inventory-report inventory-detail">
            <header className="inventory-detail__hero">
                <div className="inventory-detail__identity"><span><i className="bi bi-box-seam" /></span><div><small>TRAZABILIDAD DEL PRODUCTO</small><h1>{product?.name || "Detalle de existencias"}</h1><p>{product?.code || ""}{(product?.product_category?.name || product?.productCategory?.name) ? ` · ${product.product_category?.name || product.productCategory?.name}` : ""}</p></div></div>
                <div className="inventory-detail__total"><small>Existencia consolidada</small><strong>{new Intl.NumberFormat("es-EC", { maximumFractionDigits: 4 }).format(total)}</strong><span>{unit}</span></div>
            </header>
            <section className="inventory-detail__warehouses">
                {stockWarehouse.length ? stockWarehouse.map((stock) => <article key={stock.id}><span className="inventory-detail__warehouse-icon"><i className="bi bi-shop" /></span><div><small>{stock.warehouse?.name}</small><strong>{new Intl.NumberFormat("es-EC", { maximumFractionDigits: 4 }).format(stock.quantity)} <em>{stock.product_unit_name || unit}</em></strong><span>Existencia disponible</span></div></article>) : <div className="inventory-empty"><span><i className="bi bi-box-seam" /></span><strong>Sin existencias registradas</strong><small>Este producto no tiene cantidades asociadas a una bodega.</small></div>}
            </section>
            <section className="inventory-detail__movements inventory-panel"><div className="inventory-panel__heading"><div><span>HISTORIAL OPERATIVO</span><h2>Movimientos relacionados</h2></div><small>Usa Kardex para consultar una línea cronológica consolidada.</small></div>
                <Tabs activeKey={key} onSelect={setKey} className="inventory-detail__tabs">{tabs.map((tab) => <Tab key={tab.key} eventKey={tab.key} title={<span><i className={`bi ${tab.icon}`} />{tab.label}</span>}>{key === tab.key && <div className="inventory-detail__tab-content">{tab.component}</div>}</Tab>)}</Tabs>
            </section>
        </main>
    </MasterLayout>;
};

const mapStateToProps = ({ stockWarehouse, allConfigData }) => ({ stockWarehouse, allConfigData });
export default connect(mapStateToProps, { stockDetailsWarehouseAction })(StockDetails);
