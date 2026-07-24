import React from "react";
import { Modal, Form, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
    currencySymbolHandling,
    getFormattedMessage,
    numValidate,
    placeholderText,
} from "../../../../shared/sharedMethod";
import ReactSelect from "../../../../shared/select/reactSelect";
import SriComprobanteSelect from "../../sri/SriComprobanteSelect";

/**
 * Modal de cobro del POS. Antes solo dejaba elegir UNA forma de pago por
 * venta; ahora se puede dividir el cobro en varias filas (ej. $20 en
 * efectivo + $10 por transferencia para una venta de $30).
 *
 * El estado de pago (Pagado / Parcial / No pagado) ya NO se elige a mano:
 * se calcula solo comparando lo que sumaron las filas contra el total de
 * la venta, para que nunca pueda quedar "Pagado" sin cubrir el total. Se
 * muestra igual en el mismo lugar que antes, pero de solo lectura.
 */
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
        settings.attributes && settings.attributes.currency_symbol;

    const totalPaid = paymentRows.reduce(
        (sum, row) => sum + (Number(row.amount) || 0),
        0
    );
    const changeReturn = Math.max(0, totalPaid - grandTotal);
    // Sin recortar a 0 -- esta es la que se muestra en el resumen de la
    // derecha mientras se llenan las filas, para que se vea en vivo cuánto
    // falta (negativo) o cuánto sobra (positivo), como en las capturas.
    const liveDifference = totalPaid - grandTotal;

    const status =
        totalPaid <= 0
            ? { label: getFormattedMessage("payment-status.filter.unpaid.label"), tone: "#dc2626" }
            : totalPaid >= grandTotal
            ? { label: getFormattedMessage("payment-status.filter.paid.label"), tone: "#059669" }
            : { label: getFormattedMessage("payment-status.filter.partial.label"), tone: "#b45309" };

    // Calculado UNA sola vez (no dentro del .map() de filas): placeholderText
    // usa un hook por dentro, y llamarlo una cantidad de veces que cambia
    // según cuántas filas hay rompe el orden de hooks entre renders.
    const amountPlaceholder = placeholderText(
        "expense.input.amount.placeholder.label"
    );

    return (
        <Modal
            show={cashPayment}
            onHide={handleCashPayment}
            size="xl"
            className="pos-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {getFormattedMessage("pos-make-Payment.title")}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-lg-8 col-12">
                        <SriComprobanteSelect
                            value={tipoComprobanteSri}
                            onChange={onTipoComprobanteChange}
                        />
                        {paymentRows.map((row, index) => {
                            const isLast = index === paymentRows.length - 1;
                            return (
                                <div className="row align-items-end mb-3" key={row.id}>
                                    <Form.Group className="col-5">
                                        {index === 0 && (
                                            <Form.Label>
                                                {getFormattedMessage(
                                                    "expense.input.amount.label"
                                                )}
                                                :
                                            </Form.Label>
                                        )}
                                        <Form.Control
                                            type="text"
                                            autoComplete="off"
                                            className="form-control-solid"
                                            placeholder={amountPlaceholder}
                                            onKeyPress={(event) => numValidate(event)}
                                            value={row.amount}
                                            onChange={(e) =>
                                                onPaymentRowAmountChange(
                                                    row.id,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Form.Group>
                                    <Form.Group className="col-5">
                                        {index === 0 && (
                                            <Form.Label>
                                                {getFormattedMessage(
                                                    "globally.react-table.column.payment-type.label"
                                                )}
                                                :{" "}
                                                <span className="required" />
                                            </Form.Label>
                                        )}
                                        <ReactSelect
                                            isRequired
                                            multiLanguageOption={paymentTypeFilterOptions}
                                            onChange={(obj) =>
                                                onPaymentRowTypeChange(row.id, obj)
                                            }
                                            name={`payment_type_${row.id}`}
                                            value={row.payment_type}
                                            placeholder={getFormattedMessage(
                                                "select.payment-type.label"
                                            )}
                                        />
                                    </Form.Group>
                                    <div className="col-2 d-flex gap-2 mb-1">
                                        {paymentRows.length > 1 && (
                                            <button
                                                type="button"
                                                title="Quitar"
                                                className="btn btn-icon btn-light-danger"
                                                onClick={() =>
                                                    onRemovePaymentRow(row.id)
                                                }
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        )}
                                        {isLast && (
                                            <button
                                                type="button"
                                                title="Agregar otra forma de pago"
                                                className="btn btn-icon btn-light-primary"
                                                onClick={onAddPaymentRow}
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        <Form.Group
                            className="mb-3 col-12"
                            controlId="formBasicNotes"
                        >
                            <Form.Label>
                                {getFormattedMessage(
                                    "globally.input.notes.label"
                                )}
                                :{" "}
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                className="form-control-solid"
                                name="notes"
                                rows={3}
                                onChange={(e) => onChangeInput(e)}
                                placeholder={placeholderText(
                                    "globally.input.notes.placeholder.label"
                                )}
                                value={cashPaymentValue.notes}
                            />
                            <span className="text-danger">
                                {errors["notes"] ? errors["notes"] : null}
                            </span>
                        </Form.Group>

                        <Form.Group className="mb-3 col-12">
                            <Form.Label>
                                {getFormattedMessage(
                                    "dashboard.recentSales.paymentStatus.label"
                                )}
                                :
                            </Form.Label>
                            {/* De solo lectura a propósito: el estado se
                                calcula solo, sumando las filas de arriba
                                contra el total -- no se puede desajustar
                                a mano. */}
                            <div
                                className="form-control form-control-solid d-flex align-items-center"
                                style={{ color: status.tone, fontWeight: 600, cursor: "default" }}
                            >
                                {status.label}
                                {changeReturn > 0 && (
                                    <span className="text-muted ms-2 fw-normal">
                                        ({getFormattedMessage("pos.change-return.label")}:{" "}
                                        {currencySymbolHandling(
                                            allConfigData,
                                            currencySymbol,
                                            changeReturn.toFixed(2)
                                        )}
                                        )
                                    </span>
                                )}
                            </div>
                        </Form.Group>
                    </div>
                    <div className="col-lg-4 col-12">
                        <div className="card custom-cash-card">
                            <div className="card-body p-6">
                                <Table
                                    striped
                                    bordered
                                    hover
                                    className="mb-0 text-nowrap"
                                >
                                    <tbody>
                                        <tr>
                                            <td scope="row" className="ps-3">
                                                {getFormattedMessage(
                                                    "dashboard.recentSales.total-product.label"
                                                )}
                                            </td>
                                            <td className="px-3">
                                                <span className="btn btn-primary cursor-default rounded-circle total-qty-text d-flex align-items-center justify-content-center p-2">
                                                    {totalQty}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td scope="row" className="ps-3">
                                                {getFormattedMessage(
                                                    "pos-total-amount.title"
                                                )}
                                            </td>
                                            <td className="px-3">
                                                {currencySymbolHandling(
                                                    allConfigData,
                                                    currencySymbol,
                                                    subTotal ? subTotal : "0.00"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td scope="row" className="ps-3">
                                                {getFormattedMessage(
                                                    "globally.detail.order.tax"
                                                )}
                                            </td>
                                            <td className="px-3">
                                                {currencySymbolHandling(
                                                    allConfigData,
                                                    currencySymbol,
                                                    taxTotal ? taxTotal : "0.00"
                                                )}{" "}
                                                (
                                                {cartItemValue.tax
                                                    ? parseFloat(
                                                          cartItemValue.tax
                                                      ).toFixed(2)
                                                    : "0.00"}{" "}
                                                %)
                                            </td>
                                        </tr>
                                        <tr>
                                            <td scope="row" className="ps-3">
                                                {getFormattedMessage(
                                                    "purchase.order-item.table.discount.column.label"
                                                )}
                                            </td>
                                            <td className="px-3">
                                                {currencySymbolHandling(
                                                    allConfigData,
                                                    currencySymbol,
                                                    cartItemValue.discount
                                                        ? cartItemValue.discount
                                                        : "0.00"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td scope="row" className="ps-3">
                                                {getFormattedMessage(
                                                    "purchase.input.shipping.label"
                                                )}
                                            </td>
                                            <td className="px-3">
                                                {currencySymbolHandling(
                                                    allConfigData,
                                                    currencySymbol,
                                                    cartItemValue.shipping
                                                        ? cartItemValue.shipping
                                                        : "0.00"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td scope="row" className="ps-3">
                                                {getFormattedMessage(
                                                    "purchase.grant-total.label"
                                                )}
                                            </td>
                                            <td className="px-3">
                                                {currencySymbolHandling(
                                                    allConfigData,
                                                    currencySymbol,
                                                    grandTotal
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td scope="row" className="ps-3">
                                                {getFormattedMessage(
                                                    "pos.change-return.label"
                                                )}
                                            </td>
                                            <td
                                                className="px-3"
                                                style={{
                                                    color:
                                                        liveDifference < 0
                                                            ? "#dc2626"
                                                            : liveDifference > 0
                                                            ? "#059669"
                                                            : "inherit",
                                                    fontWeight:
                                                        liveDifference !== 0 ? 600 : "inherit",
                                                }}
                                            >
                                                {currencySymbolHandling(
                                                    allConfigData,
                                                    currencySymbol,
                                                    liveDifference.toFixed(2)
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="mt-0">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={(event) => onCashPayment(event)}
                >
                    {getFormattedMessage("globally.submit-btn")}
                </button>
                <button
                    type="button"
                    className="btn btn-secondary me-0"
                    onClick={handleCashPayment}
                >
                    {getFormattedMessage("globally.cancel-btn")}
                </button>
            </Modal.Footer>
        </Modal>
    );
};
export default CashPaymentModel;
