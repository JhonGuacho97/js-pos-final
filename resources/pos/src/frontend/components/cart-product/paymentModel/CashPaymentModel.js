import React from "react";
import { Modal, Form, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faTrash,
    faReceipt,
    faMoneyBillWave,
    faWallet,
    faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

import {
    currencySymbolHandling,
    getFormattedMessage,
    numValidate,
    placeholderText,
} from "../../../../shared/sharedMethod";

import ReactSelect from "../../../../shared/select/reactSelect";
import SriComprobanteSelect from "../../sri/SriComprobanteSelect";

const CashPaymentModel = (props) => {
    const {
        handleCashPayment,
        cashPayment,
        cashPaymentValue,
        onChangeInput,
        onCashPayment,
        grandTotal,
        totalQty,
        cartItemValue,
        taxTotal,
        settings,
        subTotal,
        errors,
        paymentTypeFilterOptions,
        allConfigData,
        paymentRows,
        onAddPaymentRow,
        onRemovePaymentRow,
        onPaymentRowAmountChange,
        onPaymentRowTypeChange,
        tipoComprobanteSri,
        onTipoComprobanteChange,
    } = props;

    const currencySymbol =
        settings.attributes &&
        settings.attributes.currency_symbol;

    const totalPaid = paymentRows.reduce(
        (sum, row) => sum + (Number(row.amount) || 0),
        0
    );

    const changeReturn = Math.max(
        0,
        totalPaid - grandTotal
    );

    const liveDifference =
        totalPaid - grandTotal;

    const status =
        totalPaid <= 0
            ? {
                label: getFormattedMessage(
                    "payment-status.filter.unpaid.label"
                ),
                tone: "danger",
                color: "#dc2626",
            }
            : totalPaid >= grandTotal
                ? {
                    label: getFormattedMessage(
                        "payment-status.filter.paid.label"
                    ),
                    tone: "success",
                    color: "#059669",
                }
                : {
                    label: getFormattedMessage(
                        "payment-status.filter.partial.label"
                    ),
                    tone: "warning",
                    color: "#d97706",
                };

    const amountPlaceholder = placeholderText(
        "expense.input.amount.placeholder.label"
    );

    return (
        <Modal
            show={cashPayment}
            onHide={handleCashPayment}
            size="xl"
            centered
            className="pos-modal"
        >
            <Modal.Header closeButton className="border-bottom">
                <Modal.Title className="fw-bold fs-3">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="me-2 text-primary" />
                    {getFormattedMessage("pos-make-Payment.title")}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <SriComprobanteSelect
                                    value={tipoComprobanteSri}
                                    onChange={onTipoComprobanteChange}
                                />
                                <hr className="my-4" />
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="fw-bold mb-0">Formas de pago</h5>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm"
                                        onClick={onAddPaymentRow}
                                    >
                                        <FontAwesomeIcon icon={faPlus} className="me-2" />
                                        Agregar forma de pago
                                    </button>
                                </div>
                                {paymentRows.map((row) => (
                                    <div key={row.id} className="card border mb-3 shadow-sm">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <Form.Label className="fw-semibold">
                                                        {getFormattedMessage("expense.input.amount.label")}
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        className="form-control-lg"
                                                        autoComplete="off"
                                                        placeholder={amountPlaceholder}
                                                        value={row.amount}
                                                        onKeyPress={(e) => numValidate(e)}
                                                        onChange={(e) => onPaymentRowAmountChange(row.id, e.target.value)}
                                                    />
                                                    {row.payment_type?.value === 1 && (
                                                        <div className="d-flex gap-2 mt-2">
                                                            {[
                                                                Math.ceil(grandTotal / 5) * 5,
                                                                Math.ceil(grandTotal / 10) * 10,
                                                                Math.ceil(grandTotal / 20) * 20,
                                                            ]
                                                                .filter((v, i, arr) => arr.indexOf(v) === i && v >= grandTotal)
                                                                .slice(0, 3)
                                                                .map((monto) => (
                                                                    <button
                                                                        key={monto}
                                                                        type="button"
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        onClick={() => onPaymentRowAmountChange(row.id, monto.toFixed(2))}
                                                                    >
                                                                        {currencySymbolHandling(allConfigData, currencySymbol, monto)}
                                                                    </button>
                                                                ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-md-5">
                                                    <Form.Label className="fw-semibold">
                                                        {getFormattedMessage("globally.react-table.column.payment-type.label")}
                                                    </Form.Label>
                                                    <ReactSelect
                                                        isRequired
                                                        multiLanguageOption={paymentTypeFilterOptions}
                                                        value={row.payment_type}
                                                        name={`payment_type_${row.id}`}
                                                        onChange={(obj) => onPaymentRowTypeChange(row.id, obj)}
                                                        placeholder={getFormattedMessage("select.payment-type.label")}
                                                    />
                                                </div>
                                                <div className="col-md-2 text-end">
                                                    <div className="d-flex justify-content-end gap-2">
                                                        {paymentRows.length > 1 && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-light-danger"
                                                                onClick={() => onRemovePaymentRow(row.id)}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="row mt-4">
                                    <div className="col-lg-4">
                                        <div className="card border-0 shadow-sm text-center h-100" style={{ background: "#f8fafc" }}>
                                            <div className="card-body">
                                                <small className="text-muted text-uppercase fw-bold">Total a cobrar</small>
                                                <h2 className="fw-bold mt-2 mb-0" style={{ color: "#1e293b" }}>
                                                    {currencySymbolHandling(allConfigData, currencySymbol, grandTotal)}
                                                </h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="card border-0 shadow-sm text-center h-100" style={{ background: "#eff6ff" }}>
                                            <div className="card-body">
                                                <small className="text-muted text-uppercase fw-bold">Recibido</small>
                                                <h2 className="fw-bold mt-2 mb-0" style={{ color: "#2563eb" }}>
                                                    {currencySymbolHandling(allConfigData, currencySymbol, totalPaid.toFixed(2))}
                                                </h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div
                                            className="card border-0 shadow text-center h-100"
                                            style={{
                                                background: liveDifference >= 0 ? "#ecfdf5" : "#fef2f2",
                                                border: liveDifference >= 0 ? "2px solid #10b981" : "2px solid #ef4444",
                                            }}
                                        >
                                            <div className="card-amounts">
                                                <small className="text-uppercase fw-bold" style={{ color: liveDifference >= 0 ? "#047857" : "#b91c1c" }}>
                                                    {liveDifference >= 0 ? "Cambio" : "Faltante"}
                                                </small>
                                                <h1 className="fw-bold mb-0 mt-2" style={{ fontSize: "2.6rem", color: liveDifference >= 0 ? "#059669" : "#dc2626" }}>
                                                    {currencySymbolHandling(allConfigData, currencySymbol, Math.abs(liveDifference).toFixed(2))}
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Form.Label className="fw-semibold">Estado del pago</Form.Label>
                                    <div>
                                        <Badge bg={status.tone} className="px-4 py-3 fs-6">
                                            <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                                            {status.label}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Form.Label className="fw-semibold">
                                        {getFormattedMessage("globally.input.notes.label")}
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        className="form-control-solid"
                                        value={cashPaymentValue.notes}
                                        name="notes"
                                        onChange={(e) => onChangeInput(e)}
                                        placeholder={placeholderText("globally.input.notes.placeholder.label")}
                                    />
                                    <span className="text-danger">{errors.notes ?? null}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card border-0 shadow h-100" style={{ borderRadius: 18 }}>
                            <div className="card-body d-flex flex-column">
                                <div className="text-center mb-4">
                                    <FontAwesomeIcon icon={faReceipt} size="2x" className="text-primary mb-3" />
                                    <h4 className="fw-bold mb-1">Resumen de la venta</h4>
                                    <small className="text-muted">Información general</small>
                                </div>
                                <div className="rounded-4 p-3 mb-3" style={{ background: "#f8fafc" }}>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Productos</span>
                                        <strong>{totalQty}</strong>
                                    </div>
                                </div>
                                <div className="rounded-4 p-3 mb-3" style={{ background: "#f8fafc" }}>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Subtotal</span>
                                        <strong>{currencySymbolHandling(allConfigData, currencySymbol, subTotal ? subTotal : "0.00")}</strong>
                                    </div>
                                </div>
                                <div className="rounded-4 p-3 mb-3" style={{ background: "#f8fafc" }}>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">IVA</span>
                                        <strong>{currencySymbolHandling(allConfigData, currencySymbol, taxTotal ? taxTotal : "0.00")}</strong>
                                    </div>
                                    <small className="text-muted">
                                        {cartItemValue.tax ? Number(cartItemValue.tax).toFixed(2) : "0.00"}%
                                    </small>
                                </div>
                                <div className="rounded-4 p-3 mb-3" style={{ background: "#f8fafc" }}>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Descuento</span>
                                        <strong>{currencySymbolHandling(allConfigData, currencySymbol, cartItemValue.discount ? cartItemValue.discount : "0.00")}</strong>
                                    </div>
                                </div>
                                <div className="rounded-4 p-3 mb-4" style={{ background: "#f8fafc" }}>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Envío</span>
                                        <strong>{currencySymbolHandling(allConfigData, currencySymbol, cartItemValue.shipping ? cartItemValue.shipping : "0.00")}</strong>
                                    </div>
                                </div>
                                <div className="mt-20 rounded-4 p-4" style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "white" }}>
                                    <div className="text-center">
                                        <small className="text-uppercase" style={{ opacity: .9 }}>TOTAL A COBRAR</small>
                                        <h1 className="fw-bold mt-2 mb-0" style={{ fontSize: "2.7rem" }}>
                                            {currencySymbolHandling(allConfigData, currencySymbol, grandTotal)}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="border-0 px-4 pb-4 pt-0" style={{ background: "#fff" }}>
                <div className="d-flex justify-content-end w-100 gap-3">
                    <button type="button" className="btn btn-light btn-lg px-5" onClick={handleCashPayment}>
                        Cancelar
                    </button>
                    <button type="button" className="btn btn-primary btn-lg px-5 shadow" onClick={(event) => onCashPayment(event)}>
                        <FontAwesomeIcon icon={faWallet} className="me-2" />
                        {getFormattedMessage("globally.submit-btn")}
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default CashPaymentModel;
