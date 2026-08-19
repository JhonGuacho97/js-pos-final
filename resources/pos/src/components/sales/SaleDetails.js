import React, { useEffect } from "react";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import { Col, Row, Table } from "react-bootstrap-v5";
import { useParams } from "react-router-dom";
import MasterLayout from "../MasterLayout";
import HeaderTitle from "../header/HeaderTitle";
import TabTitle from "../../shared/tab-title/TabTitle";
import {
    currencySymbolHandling,
    getFormattedMessage,
    placeholderText,
} from "../../shared/sharedMethod";
import { saleDetailsAction } from "../../store/action/saleDetailsAction";
import { fetchFrontSetting } from "../../store/action/frontSettingAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faIdCard,
    faLocationDot,
    faMobileAlt,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import ResourceDetailHeader from "../../shared/components/ResourceDetailHeader";
import "../../assets/scss/custom/pages/resource-detail.scss";

const SaleDetails = (props) => {
    const {
        saleDetailsAction,
        saleDetails,
        fetchFrontSetting,
        frontSetting,
        allConfigData,
    } = props;
    const { id } = useParams();

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    useEffect(() => {
        saleDetailsAction(id);
    }, []);

    const currencySymbol = frontSetting?.value?.currency_symbol || "";
    const formatCurrency = (value) =>
        currencySymbolHandling(allConfigData, currencySymbol, value || 0);
    const saleStatus =
        saleDetails.status === 1
            ? { label: "Completada", tone: "success" }
            : saleDetails.status === 2
                ? { label: "Pendiente", tone: "warning" }
                : { label: "Ordenada", tone: "primary" };
    const paidTotal = (saleDetails.payments || []).reduce(
        (total, payment) => total + Number(payment.amount || 0),
        0
    );
    const saleStats = [
        {
            label: "Productos",
            value: (saleDetails.sale_items || []).length,
        },
        {
            label: "Total de la venta",
            value: formatCurrency(saleDetails.grand_total),
        },
        {
            label: "Pagado",
            value: formatCurrency(paidTotal),
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <HeaderTitle
                title={getFormattedMessage("sale.details.title")}
                to="/app/sales"
            />
            <TabTitle title={placeholderText("sale.details.title")} />
            <div className="resource-detail-v2 resource-detail-v2--sale">
                <ResourceDetailHeader
                    type="sale"
                    eyebrow="Documento de venta"
                    title={saleDetails.reference_code || getFormattedMessage("sale.details.title")}
                    description="Información comercial, productos y pagos asociados a esta venta."
                    status={saleStatus.label}
                    statusTone={saleStatus.tone}
                    stats={saleStats}
                />
            <div className="card resource-detail-document">
                <div className="card-body">
                    <Form>
                        <Row className="custom-line-height resource-info-grid g-3">
                            <Col md={4} className="resource-info-card">
                                <h5 className="text-gray-600 bg-light p-4 mb-0 text-uppercase resource-section-kicker">
                                    {getFormattedMessage(
                                        "sale.detail.customer.info"
                                    )}
                                </h5>
                                <div className="p-4 resource-info-list">
                                    <div className="d-flex align-items-center pb-1 resource-info-line">
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className="text-primary me-2 fs-5"
                                        />
                                        {saleDetails.customer &&
                                            saleDetails.customer.name}
                                    </div>
                                    <div className="d-flex align-items-center pb-1 resource-info-line">
                                        <FontAwesomeIcon
                                            icon={faEnvelope}
                                            className="text-primary me-2 fs-5"
                                        />
                                        {saleDetails.customer &&
                                            saleDetails.customer.email}
                                    </div>
                                    <div className="d-flex align-items-center pb-1 resource-info-line">
                                        <FontAwesomeIcon
                                            icon={faMobileAlt}
                                            className="text-primary me-2 fs-5"
                                        />
                                        {saleDetails.customer &&
                                            saleDetails.customer.phone}
                                    </div>
                                    {saleDetails.customer?.identification && (
                                        <div className="d-flex align-items-center pb-1 resource-info-line">
                                            <FontAwesomeIcon
                                                icon={faIdCard}
                                                className="text-primary me-2 fs-5"
                                            />
                                            {saleDetails.customer.identification}
                                        </div>
                                    )}
                                    <div className="d-flex align-items-center resource-info-line">
                                        <FontAwesomeIcon
                                            icon={faLocationDot}
                                            className="text-primary me-2 fs-5"
                                        />
                                        {saleDetails.customer &&
                                            saleDetails.customer.address}
                                    </div>
                                </div>
                            </Col>
                            <Col md={4} className="resource-info-card">
                                <h5 className="text-gray-600 bg-light p-4 mb-0 text-uppercase resource-section-kicker">
                                    {getFormattedMessage(
                                        "globally.detail.company.info"
                                    )}
                                </h5>
                                <div className="p-4 resource-info-list">
                                    <div className="d-flex align-items-center pb-1 resource-info-line">
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className="text-primary me-2 fs-5"
                                        />
                                        {saleDetails.company_info &&
                                            saleDetails.company_info
                                                .company_name}
                                    </div>
                                    <div className="d-flex align-items-center pb-1 resource-info-line">
                                        <FontAwesomeIcon
                                            icon={faEnvelope}
                                            className="text-primary me-2 fs-5"
                                        />
                                        {saleDetails.company_info &&
                                            saleDetails.company_info.email}
                                    </div>
                                    <div className="d-flex align-items-center pb-1 resource-info-line">
                                        <FontAwesomeIcon
                                            icon={faMobileAlt}
                                            className="text-primary me-2 fs-5"
                                        />
                                        {saleDetails.company_info &&
                                            saleDetails.company_info.phone}
                                    </div>
                                    <div className="d-flex align-items-center resource-info-line">
                                        <FontAwesomeIcon
                                            icon={faLocationDot}
                                            className="text-primary me-2 fs-5"
                                        />
                                        {saleDetails.company_info &&
                                            saleDetails.company_info.address}
                                    </div>
                                </div>
                            </Col>
                            <Col md={4} className="resource-info-card">
                                <h5 className="text-gray-600 bg-light p-4 mb-0 text-uppercase resource-section-kicker">
                                    {getFormattedMessage(
                                        "sale.detail.invoice.info"
                                    )}
                                </h5>
                                <div className="p-4 resource-info-list">
                                    <div className="pb-1 resource-info-line">
                                        <span className="me-2">
                                            {getFormattedMessage(
                                                "globally.detail.reference"
                                            )}{" "}
                                            :
                                        </span>
                                        <span>
                                            {saleDetails &&
                                                saleDetails.reference_code}
                                        </span>
                                    </div>
                                    <div className="pb-1 resource-info-line">
                                        <span className="me-2">
                                            {getFormattedMessage(
                                                "globally.detail.status"
                                            )}{" "}
                                            :
                                        </span>
                                        {(saleDetails &&
                                            saleDetails.status === 1 && (
                                                <span className="badge bg-light-success">
                                                    <span>Received</span>
                                                </span>
                                            )) ||
                                            (saleDetails.status === 2 && (
                                                <span className="badge bg-light-primary">
                                                    <span>Pending</span>
                                                </span>
                                            )) ||
                                            (saleDetails.status === 3 && (
                                                <span className="badge bg-light-warning">
                                                    <span>Ordered</span>
                                                </span>
                                            ))}
                                    </div>
                                    <div className="pb-1 resource-info-line">
                                        <span className="me-2">
                                            {getFormattedMessage(
                                                "globally.detail.warehouse"
                                            )}{" "}
                                            :
                                        </span>
                                        <span>
                                            {saleDetails.warehouse &&
                                                saleDetails.warehouse.name}
                                        </span>
                                    </div>
                                    <div className="resource-info-line">
                                        <span className="me-2">
                                            {getFormattedMessage(
                                                "globally.detail.payment.status"
                                            )}{" "}
                                            :
                                        </span>
                                        {(saleDetails &&
                                            saleDetails.payment_status ===
                                            1 && (
                                                <span className="badge bg-light-success">
                                                    <span>Paid</span>
                                                </span>
                                            )) ||
                                            (saleDetails.payment_status ===
                                                2 && (
                                                    <span className="badge bg-light-warning">
                                                        <span>Unpaid</span>
                                                    </span>
                                                ))}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div className="mt-5 resource-detail-section">
                            <h5 className="text-gray-600 bg-light p-4 mb-5 text-uppercase resource-section-kicker">
                                {getFormattedMessage(
                                    "globally.detail.order.summary"
                                )}
                            </h5>
                            <div className="resource-detail-table-wrap">
                            <Table responsive className="resource-detail-table">
                                <thead>
                                    <tr>
                                        <th className="ps-3">
                                            {getFormattedMessage(
                                                "globally.detail.product"
                                            )}
                                        </th>
                                        <th className="ps-3">
                                            {getFormattedMessage(
                                                "globally.detail.net-unit-price"
                                            )}
                                        </th>
                                        <th className="ps-3">
                                            {getFormattedMessage(
                                                "globally.detail.quantity"
                                            )}
                                        </th>
                                        <th className="ps-3">
                                            {getFormattedMessage(
                                                "globally.detail.unit-price"
                                            )}
                                        </th>
                                        <th className="ps-3">
                                            {getFormattedMessage(
                                                "globally.detail.discount"
                                            )}
                                        </th>
                                        <th className="ps-3">
                                            {getFormattedMessage(
                                                "globally.detail.tax"
                                            )}
                                        </th>
                                        <th colSpan={2}>
                                            {getFormattedMessage(
                                                "globally.detail.subtotal"
                                            )}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {saleDetails.sale_items &&
                                        saleDetails.sale_items.map(
                                            (details, index) => {
                                                return (
                                                    <tr
                                                        key={index}
                                                        className="align-middle"
                                                    >
                                                        <td className="ps-3">
                                                            {details.product &&
                                                                details.product
                                                                    .code}{" "}
                                                            (
                                                            {details.product &&
                                                                details.product
                                                                    .name}
                                                            {details.product &&
                                                                details.product
                                                                    .variation_type
                                                                ? ` - ${details.product.variation_type.name}`
                                                                : ""}
                                                            )
                                                        </td>
                                                        <td>
                                                            {currencySymbolHandling(
                                                                allConfigData,
                                                                frontSetting.value &&
                                                                frontSetting
                                                                    .value
                                                                    .currency_symbol,
                                                                details.net_unit_price
                                                            )}
                                                        </td>
                                                        <td>
                                                            {details.quantity}
                                                        </td>
                                                        <td>
                                                            {currencySymbolHandling(
                                                                allConfigData,
                                                                frontSetting.value &&
                                                                frontSetting
                                                                    .value
                                                                    .currency_symbol,
                                                                details.product_price
                                                            )}
                                                        </td>
                                                        <td>
                                                            {currencySymbolHandling(
                                                                allConfigData,
                                                                frontSetting.value &&
                                                                frontSetting
                                                                    .value
                                                                    .currency_symbol,
                                                                details.discount_amount
                                                            )}
                                                        </td>
                                                        <td>
                                                            {currencySymbolHandling(
                                                                allConfigData,
                                                                frontSetting.value &&
                                                                frontSetting
                                                                    .value
                                                                    .currency_symbol,
                                                                details.tax_amount
                                                            )}
                                                        </td>
                                                        <td>
                                                            {currencySymbolHandling(
                                                                allConfigData,
                                                                frontSetting.value &&
                                                                frontSetting
                                                                    .value
                                                                    .currency_symbol,
                                                                details.sub_total
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                </tbody>
                            </Table>
                            </div>
                        </div>
                        <Row className="resource-detail-lower">
                            <Col xxl={7} lg={6} md={6} xs={12}>
                                {saleDetails.payments &&
                                    saleDetails.payments.length > 0 && (
                                        <div className="card resource-payment-card">
                                            <h5 className="text-gray-600 bg-light p-4 mb-0 text-uppercase resource-section-kicker">
                                                Detalles de pago
                                            </h5>
                                            <div className="card-body">
                                                <Table responsive className="resource-detail-table">
                                                    <thead>
                                                        <tr>
                                                            <th>
                                                                {getFormattedMessage(
                                                                    "react-data-table.date.column.label"
                                                                )}
                                                            </th>
                                                            <th>
                                                                {getFormattedMessage(
                                                                    "globally.detail.reference"
                                                                )}
                                                            </th>
                                                            <th>
                                                                {getFormattedMessage(
                                                                    "globally.react-table.column.payment-type.label"
                                                                )}
                                                            </th>
                                                            <th>
                                                                {getFormattedMessage(
                                                                    "expense.input.amount.label"
                                                                )}
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {saleDetails.payments.map(
                                                            (payment, index) => (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {payment.payment_date}
                                                                    </td>
                                                                    <td>
                                                                        {payment.reference ||
                                                                            "N/A"}
                                                                    </td>
                                                                    <td>
                                                                        {payment.payment_method
                                                                            ?.name ||
                                                                            "N/A"}
                                                                    </td>
                                                                    <td>
                                                                        {currencySymbolHandling(
                                                                            allConfigData,
                                                                            frontSetting.value &&
                                                                                frontSetting
                                                                                    .value
                                                                                    .currency_symbol,
                                                                            payment.amount
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    )}
                            </Col>
                            <Col xxl={5} lg={6} md={6} xs={12}>
                        <div className="card resource-summary-card">
                            <div className="card-body pt-7 pb-2">
                                <div className="table-responsive">
                                    <table className="table border">
                                        <tbody>
                                            <tr>
                                                <td className="py-3">
                                                    {getFormattedMessage(
                                                        "globally.detail.order.tax"
                                                    )}
                                                </td>
                                                <td className="py-3">
                                                    {currencySymbolHandling(
                                                        allConfigData,
                                                        frontSetting.value &&
                                                        frontSetting
                                                            .value
                                                            .currency_symbol,
                                                        saleDetails &&
                                                            saleDetails.tax_amount >
                                                            0
                                                            ? saleDetails.tax_amount
                                                            : "0.00"
                                                    )}{" "}
                                                    (
                                                    {saleDetails &&
                                                        parseFloat(
                                                            saleDetails.tax_rate
                                                        ).toFixed(2)}
                                                    %)
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-3">
                                                    {getFormattedMessage(
                                                        "globally.detail.discount"
                                                    )}
                                                </td>
                                                <td className="py-3">
                                                    {currencySymbolHandling(
                                                        allConfigData,
                                                        frontSetting.value &&
                                                        frontSetting
                                                            .value
                                                            .currency_symbol,
                                                        saleDetails &&
                                                        saleDetails.discount
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-3">
                                                    {getFormattedMessage(
                                                        "globally.detail.shipping"
                                                    )}
                                                </td>
                                                <td className="py-3">
                                                    {currencySymbolHandling(
                                                        allConfigData,
                                                        frontSetting.value &&
                                                        frontSetting
                                                            .value
                                                            .currency_symbol,
                                                        saleDetails &&
                                                        saleDetails.shipping
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 text-primary">
                                                    {getFormattedMessage(
                                                        "globally.detail.grand.total"
                                                    )}
                                                </td>
                                                <td className="py-3 text-primary">
                                                    {currencySymbolHandling(
                                                        allConfigData,
                                                        frontSetting.value &&
                                                        frontSetting
                                                            .value
                                                            .currency_symbol,
                                                        saleDetails &&
                                                        saleDetails.grand_total
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
            </div>
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { saleDetails, frontSetting, allConfigData } = state;
    return { saleDetails, frontSetting, allConfigData };
};

export default connect(mapStateToProps, {
    saleDetailsAction,
    fetchFrontSetting,
})(SaleDetails);
