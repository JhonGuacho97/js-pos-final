import React from "react";
import { Badge, Form, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faMoneyBillWave,
    faPlus,
    faReceipt,
    faTrash,
    faWallet,
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
        offlineMode,
    } = props;

    const currencySymbol = settings.attributes && settings.attributes.currency_symbol;
    const totalPaid = paymentRows.reduce(
        (sum, row) => sum + (Number(row.amount) || 0),
        0
    );
    const liveDifference = totalPaid - grandTotal;
    const status =
        totalPaid <= 0
            ? {
                label: getFormattedMessage("payment-status.filter.unpaid.label"),
                tone: "danger",
            }
            : totalPaid >= grandTotal
                ? {
                    label: getFormattedMessage("payment-status.filter.paid.label"),
                    tone: "success",
                }
                : {
                    label: getFormattedMessage("payment-status.filter.partial.label"),
                    tone: "warning",
                };
    const amountPlaceholder = placeholderText("expense.input.amount.placeholder.label");
    const formatMoney = (value) =>
        currencySymbolHandling(allConfigData, currencySymbol, value || "0.00");

    return (
        <Modal
            show={cashPayment}
            onHide={handleCashPayment}
            size="xl"
            centered
            scrollable
            className="pos-modal pos-payment-modal"
        >
            <Modal.Header closeButton>
                <div className="pos-payment-title">
                    <span className="pos-payment-title__icon">
                        <FontAwesomeIcon icon={faMoneyBillWave} />
                    </span>
                    <div>
                        <span className="pos-payment-eyebrow">Cobro</span>
                        <Modal.Title>{getFormattedMessage("pos-make-Payment.title")}</Modal.Title>
                    </div>
                </div>
                <div className="pos-payment-header-total">
                    <span>Total a cobrar</span>
                    <strong>{formatMoney(grandTotal)}</strong>
                </div>
            </Modal.Header>

            <Modal.Body>
                <div className="pos-payment-layout">
                    <section className="pos-payment-main">
                        <div className="pos-payment-section">
                            <div className="pos-payment-section__heading">
                                <div>
                                    <h3>Comprobante</h3>
                                    <p>Selecciona el documento que recibirá el cliente.</p>
                                </div>
                            </div>
                            <SriComprobanteSelect
                                value={tipoComprobanteSri}
                                onChange={onTipoComprobanteChange}
                                offlineMode={offlineMode}
                            />
                        </div>

                        <div className="pos-payment-divider" />

                        <div className="pos-payment-section">
                            <div className="pos-payment-section__heading pos-payment-methods-heading">
                                <div>
                                    <h3>Formas de pago</h3>
                                    <p>Puedes dividir el cobro entre varios métodos.</p>
                                </div>
                                <button
                                    type="button"
                                    className="pos-payment-add"
                                    onClick={onAddPaymentRow}
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                    Agregar
                                </button>
                            </div>

                            <div className="pos-payment-rows">
                                {paymentRows.map((row, index) => (
                                    <div key={row.id} className="pos-payment-row">
                                        <div className="pos-payment-row__number">{index + 1}</div>
                                        <div className="pos-payment-field">
                                            <Form.Label>
                                                {getFormattedMessage("expense.input.amount.label")}
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                autoComplete="off"
                                                placeholder={amountPlaceholder}
                                                value={row.amount}
                                                onKeyPress={(event) => numValidate(event)}
                                                onChange={(event) =>
                                                    onPaymentRowAmountChange(row.id, event.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="pos-payment-field">
                                            <Form.Label>
                                                {getFormattedMessage(
                                                    "globally.react-table.column.payment-type.label"
                                                )}
                                            </Form.Label>
                                            <ReactSelect
                                                isRequired
                                                multiLanguageOption={paymentTypeFilterOptions}
                                                value={row.payment_type}
                                                name={`payment_type_${row.id}`}
                                                onChange={(option) =>
                                                    onPaymentRowTypeChange(row.id, option)
                                                }
                                                placeholder={getFormattedMessage("select.payment-type.label")}
                                            />
                                        </div>
                                        {paymentRows.length > 1 && (
                                            <button
                                                type="button"
                                                className="pos-payment-remove"
                                                aria-label="Eliminar forma de pago"
                                                onClick={() => onRemovePaymentRow(row.id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        )}

                                        {row.payment_type?.value === 1 && (
                                            <div className="pos-payment-quick-amounts">
                                                <button
                                                    type="button"
                                                    className="is-exact"
                                                    onClick={() =>
                                                        onPaymentRowAmountChange(
                                                            row.id,
                                                            Number(grandTotal).toFixed(2)
                                                        )
                                                    }
                                                >
                                                    Monto exacto
                                                </button>
                                                {[
                                                    Math.ceil(grandTotal / 5) * 5,
                                                    Math.ceil(grandTotal / 10) * 10,
                                                    Math.ceil(grandTotal / 20) * 20,
                                                ]
                                                    .filter(
                                                        (value, itemIndex, values) =>
                                                            values.indexOf(value) === itemIndex &&
                                                            value >= grandTotal
                                                    )
                                                    .slice(0, 3)
                                                    .map((amount) => (
                                                        <button
                                                            key={amount}
                                                            type="button"
                                                            onClick={() =>
                                                                onPaymentRowAmountChange(
                                                                    row.id,
                                                                    amount.toFixed(2)
                                                                )
                                                            }
                                                        >
                                                            {formatMoney(amount)}
                                                        </button>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pos-payment-settlement">
                            <div>
                                <span>Recibido</span>
                                <strong>{formatMoney(totalPaid.toFixed(2))}</strong>
                            </div>
                            <div className={liveDifference >= 0 ? "is-change" : "is-due"}>
                                <span>{liveDifference >= 0 ? "Cambio" : "Faltante"}</span>
                                <strong>{formatMoney(Math.abs(liveDifference).toFixed(2))}</strong>
                            </div>
                            <Badge bg={status.tone} className="pos-payment-status">
                                <FontAwesomeIcon icon={faCheckCircle} />
                                {status.label}
                            </Badge>
                        </div>

                        <div className="pos-payment-notes">
                            <Form.Label>{getFormattedMessage("globally.input.notes.label")}</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={cashPaymentValue.notes}
                                name="notes"
                                onChange={onChangeInput}
                                placeholder={placeholderText(
                                    "globally.input.notes.placeholder.label"
                                )}
                            />
                            {errors.notes && <span className="text-danger">{errors.notes}</span>}
                        </div>
                    </section>

                    <aside className="pos-payment-summary">
                        <div className="pos-payment-summary__heading">
                            <span>
                                <FontAwesomeIcon icon={faReceipt} />
                            </span>
                            <div>
                                <h3>Resumen de la venta</h3>
                                <p>Detalle de esta transacción</p>
                            </div>
                        </div>

                        <div className="pos-payment-summary__rows">
                            <div>
                                <span>Productos</span>
                                <strong>{totalQty}</strong>
                            </div>
                            <div>
                                <span>Subtotal</span>
                                <strong>{formatMoney(subTotal)}</strong>
                            </div>
                            <div>
                                <span>
                                    IVA
                                    <small>
                                        {cartItemValue.tax
                                            ? Number(cartItemValue.tax).toFixed(2)
                                            : "0.00"}%
                                    </small>
                                </span>
                                <strong>{formatMoney(taxTotal)}</strong>
                            </div>
                            <div>
                                <span>Descuento</span>
                                <strong>{formatMoney(cartItemValue.discount)}</strong>
                            </div>
                            <div>
                                <span>Envío</span>
                                <strong>{formatMoney(cartItemValue.shipping)}</strong>
                            </div>
                        </div>

                        <div className="pos-payment-summary__total">
                            <span>Total</span>
                            <strong>{formatMoney(grandTotal)}</strong>
                        </div>

                        <div className="pos-payment-summary__hint">
                            {offlineMode
                                ? "La venta quedará guardada en este dispositivo y se enviará automáticamente al recuperar conexión."
                                : "El cobro se registrará al confirmar la venta."}
                        </div>
                    </aside>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <button type="button" className="pos-payment-cancel" onClick={handleCashPayment}>
                    Cancelar
                </button>
                <button
                    type="button"
                    className="pos-payment-submit"
                    onClick={(event) => onCashPayment(event)}
                >
                    <FontAwesomeIcon icon={faWallet} />
                    {offlineMode ? "Guardar cobro offline" : "Confirmar cobro"}
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default CashPaymentModel;
