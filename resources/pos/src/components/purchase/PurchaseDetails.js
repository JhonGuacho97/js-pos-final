import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Table } from "react-bootstrap-v5";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import {
    faUser,
    faEnvelope,
    faLocationDot,
    faMobileAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MasterLayout from "../MasterLayout";
import HeaderTitle from "../header/HeaderTitle";
import TabTitle from "../../shared/tab-title/TabTitle";
import {
    currencySymbolHandling,
    formatNumber,
    getFormattedMessage,
    placeholderText,
} from "../../shared/sharedMethod";
import { purchaseDetailsAction } from "../../store/action/purchaseDetailsAction";
import { fetchFrontSetting } from "../../store/action/frontSettingAction";
import ResourceDetailHeader from "../../shared/components/ResourceDetailHeader";
import "../../assets/scss/custom/pages/resource-detail.scss";

const PurchaseDetails = (props) => {
    const {
        purchaseDetailsAction,
        purchaseDetails,
        fetchFrontSetting,
        frontSetting,
        allConfigData,
    } = props;
    const { id } = useParams();

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    useEffect(() => {
        purchaseDetailsAction(id);
    }, []);

    const currencySymbol = frontSetting?.value?.currency_symbol || "";
    const formatCurrency = (value) =>
        currencySymbolHandling(allConfigData, currencySymbol, value || 0);
    const purchaseStatus =
        purchaseDetails.status === 1
            ? { label: "Recibida", tone: "success" }
            : purchaseDetails.status === 2
                ? { label: "Pendiente", tone: "warning" }
                : { label: "Ordenada", tone: "primary" };
    const totalUnits = (purchaseDetails.purchase_items || []).reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );
    const purchaseStats = [
        {
            label: "Productos",
            value: (purchaseDetails.purchase_items || []).length,
        },
        {
            label: "Unidades",
            value: totalUnits,
        },
        {
            label: "Total de compra",
            value: formatCurrency(purchaseDetails.grand_total),
        },
    ];

    return (
        <MasterLayout>
            <HeaderTitle
                title={getFormattedMessage("purchases.details.title")}
                to="/app/purchases"
            />
            <TabTitle title={placeholderText("purchases.details.title")} />
            <div className="resource-detail-v2 resource-detail-v2--purchase">
                <ResourceDetailHeader
                    type="purchase"
                    eyebrow="Documento de compra"
                    title={purchaseDetails.reference_code || getFormattedMessage("purchases.details.title")}
                    description="Proveedor, recepción y valores asociados a esta compra."
                    status={purchaseStatus.label}
                    statusTone={purchaseStatus.tone}
                    stats={purchaseStats}
                />
            <div className="card resource-detail-document">
                <div className="card-body">
                    <Form>
                        <Row className="custom-line-height resource-info-grid g-3">
                            <Col md={4} className="resource-info-card">
                                <h5 className="text-gray-600 bg-light p-4 mb-0 text-uppercase resource-section-kicker">
                                    {getFormattedMessage(
                                        "purchase.detail.supplier.info"
                                    )}
                                </h5>
                                <div className="p-4 resource-info-list">
                                    <div className="d-flex align-items-center pb-1 resource-info-line">
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className="text-primary me-2 fs-5"
                                        />
                                        {purchaseDetails.supplier &&
                                            purchaseDetails.supplier.name}
                                    </div>
                                    <div className="d-flex align-items-center pb-1 resource-info-line">
                                        <FontAwesomeIcon
                                            icon={faEnvelope}
                                            className="text-primary me-2 fs-5"
                                        />
                                        {purchaseDetails.supplier &&
                                            purchaseDetails.supplier.email}
                                    </div>
                                    <div className="d-flex align-items-center pb-1 resource-info-line">
                                        <FontAwesomeIcon
                                            icon={faMobileAlt}
                                            className="text-primary me-2 fs-5"
                                        />
                                        {purchaseDetails.supplier &&
                                            purchaseDetails.supplier.phone}
                                    </div>
                                    <div className="d-flex align-items-center resource-info-line">
                                        <FontAwesomeIcon
                                            icon={faLocationDot}
                                            className="text-primary me-2 fs-5"
                                        />
                                        {purchaseDetails.supplier &&
                                            purchaseDetails.supplier.address}
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
                                        {purchaseDetails.company_info &&
                                            purchaseDetails.company_info
                                                .company_name}
                                    </div>
                                    <div className="d-flex align-items-center pb-1 resource-info-line">
                                        <FontAwesomeIcon
                                            icon={faEnvelope}
                                            className="text-primary me-2 fs-5"
                                        />
                                        {purchaseDetails.company_info &&
                                            purchaseDetails.company_info.email}
                                    </div>
                                    <div className="d-flex align-items-center pb-1 resource-info-line">
                                        <FontAwesomeIcon
                                            icon={faMobileAlt}
                                            className="text-primary me-2 fs-5"
                                        />
                                        {purchaseDetails.company_info &&
                                            purchaseDetails.company_info.phone}
                                    </div>
                                    <div className="d-flex align-items-center resource-info-line">
                                        <FontAwesomeIcon
                                            icon={faLocationDot}
                                            className="text-primary me-2 fs-5"
                                        />
                                        {purchaseDetails.company_info &&
                                            purchaseDetails.company_info
                                                .address}
                                    </div>
                                </div>
                            </Col>
                            <Col md={4} className="resource-info-card">
                                <h5 className="text-gray-600 bg-light p-4 mb-0 text-uppercase resource-section-kicker">
                                    {getFormattedMessage(
                                        "purchase.detail.purchase.info"
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
                                            {purchaseDetails &&
                                                purchaseDetails.reference_code}
                                        </span>
                                    </div>
                                    <div className="pb-1 resource-info-line">
                                        <span className="me-2">
                                            {getFormattedMessage(
                                                "globally.detail.status"
                                            )}{" "}
                                            :
                                        </span>
                                        {(purchaseDetails &&
                                            purchaseDetails.status === 1 && (
                                                <span className="badge bg-light-success">
                                                    <span>Received</span>
                                                </span>
                                            )) ||
                                            (purchaseDetails.status === 2 && (
                                                <span className="badge bg-light-primary">
                                                    <span>Pending</span>
                                                </span>
                                            )) ||
                                            (purchaseDetails.status === 3 && (
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
                                            {purchaseDetails.warehouse &&
                                                purchaseDetails.warehouse.name}
                                        </span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div className="mt-5 resource-detail-section">
                            <h5 className="text-gray-600 bg-light p-4 mb-4 text-uppercase resource-section-kicker">
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
                                            Costo neto / presentación
                                        </th>
                                        <th className="ps-3">
                                            {getFormattedMessage(
                                                "globally.detail.quantity"
                                            )}
                                        </th>
                                        <th className="ps-3">
                                            Costo / unidad base
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
                                    {purchaseDetails.purchase_items &&
                                        purchaseDetails.purchase_items.map(
                                            (details, index) => {
                                                const presentation = details.product_presentation;
                                                const equivalence = Number(details.presentation_equivalence || 1);
                                                const presentationQuantity = presentation
                                                    ? Number(details.presentation_quantity || 0)
                                                    : Number(details.quantity || 0);
                                                const presentationName = presentation?.variation_type?.name || "presentación";
                                                const presentationLabel = presentationQuantity === 1
                                                    ? presentationName
                                                    : `${presentationName}s`;
                                                const baseNetCost = Number(details.net_unit_cost || 0) / equivalence;
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
                                                                details.net_unit_cost
                                                            )}
                                                            {presentation && (
                                                                <div className="text-muted fs-small">
                                                                    por {presentationName}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <strong>{formatNumber(presentationQuantity, 0, 2)}</strong>{" "}
                                                            {presentation ? presentationLabel : "unidades"}
                                                            {presentation && (
                                                                <div className="text-muted fs-small">
                                                                    = {formatNumber(details.quantity, 0, 2)} unidades
                                                                    ({formatNumber(equivalence, 0, 2)} por {presentationName})
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {currencySymbolHandling(
                                                                allConfigData,
                                                                frontSetting.value &&
                                                                    frontSetting
                                                                        .value
                                                                        .currency_symbol,
                                                                baseNetCost,
                                                                false,
                                                                presentation ? 4 : 2
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
                        <div className="col-xxl-5 col-lg-6 col-md-6 col-12 float-end">
                            <div className="card resource-summary-card mt-3">
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
                                                            purchaseDetails &&
                                                                purchaseDetails.tax_amount >
                                                                    0
                                                                ? purchaseDetails.tax_amount
                                                                : "0.00"
                                                        )}{" "}
                                                        (
                                                        {purchaseDetails &&
                                                            parseFloat(
                                                                purchaseDetails.tax_rate
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
                                                            purchaseDetails &&
                                                                purchaseDetails.discount
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
                                                            purchaseDetails &&
                                                                purchaseDetails.shipping
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
                                                            purchaseDetails &&
                                                                purchaseDetails.grand_total
                                                        )}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
            </div>
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { purchaseDetails, frontSetting, allConfigData } = state;
    return { purchaseDetails, frontSetting, allConfigData };
};

export default connect(mapStateToProps, {
    purchaseDetailsAction,
    fetchFrontSetting,
})(PurchaseDetails);
