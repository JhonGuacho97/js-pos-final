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
import dayjs from 'dayjs';

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
        onPaymentRowReferenceChange,
        tipoComprobanteSri,
        onTipoComprobanteChange,
        offlineMode,
        selectedCustomer,
        creditProfile,
        creditLoading,
        creditTerms,
        onCreditTermsChange,
        creditSaleEnabled,
        onCreditSaleEnabledChange,
        processing,
        processingLabel,
        onExited,
    } = props;

    const currencySymbol = settings.attributes && settings.attributes.currency_symbol;
    const totalPaid = paymentRows.reduce(
        (sum, row) => sum + (Number(row.amount) || 0),
        0
    );
    const liveDifference = totalPaid - grandTotal;
    const pendingBalance = Math.max(0, Number(grandTotal) - Math.min(Number(grandTotal), totalPaid));
    const isFinalCustomer = Boolean(selectedCustomer?.es_consumidor_final);
    const paymentRowsValid = paymentRows
        .filter((row) => Number(row.amount) > 0)
        .every((row) => row.payment_type?.value && (Number(row.payment_type.value) === 1 || row.reference?.trim()));
    const canSubmit = paymentRowsValid && (
        totalPaid >= Number(grandTotal)
        || (creditSaleEnabled && !isFinalCustomer && Boolean(selectedCustomer?.value))
    );
    const remainingForRow = (rowId) => Math.max(0, Number(grandTotal) - paymentRows.reduce(
        (sum, row) => row.id === rowId ? sum : sum + (Number(row.amount) || 0),
        0
    ));
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
            onHide={processing ? undefined : handleCashPayment}
            backdrop={processing ? "static" : true}
            keyboard={!processing}
            onExited={onExited}
            size="xl"
            centered
            scrollable
            className="pos-modal pos-payment-modal"
        >
            <Modal.Header closeButton={!processing}>
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
                {processing && <div className="pos-checkout-progress" role="status"><span className="spinner-border spinner-border-sm" /><div><strong>{processingLabel || 'Guardando venta…'}</strong><small>No cierres esta ventana hasta terminar.</small></div></div>}
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

                            {paymentRows.length === 1 && (
                                <div className="pos-payment-method-presets" aria-label="Métodos de pago frecuentes">
                                    {paymentTypeFilterOptions.filter((option) => [1, 3].includes(Number(option.id))).map((option) => (
                                        <button
                                            type="button"
                                            key={option.id}
                                            className={Number(paymentRows[0]?.payment_type?.value) === Number(option.id) ? 'active' : ''}
                                            onClick={() => onPaymentRowTypeChange(paymentRows[0].id, {value: option.id, label: option.name})}
                                        >
                                            <i className={`bi ${Number(option.id) === 1 ? 'bi-cash-stack' : 'bi-bank'}`} />
                                            <span>{Number(option.id) === 1 ? 'Efectivo' : 'Transferencia'}</span>
                                            <small>{Number(option.id) === 1 ? 'Calcula el cambio' : 'Solicita referencia'}</small>
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="pos-payment-rows">
                                {paymentRows.map((row, index) => (
                                    <div key={row.id} className={`pos-payment-row ${errors.payment ? 'has-error' : ''}`}>
                                        <div className="pos-payment-row__number">{index + 1}</div>
                                        <div className="pos-payment-field">
                                            <Form.Label>
                                                {getFormattedMessage("expense.input.amount.label")}
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                autoFocus={index === 0}
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
                                                            remainingForRow(row.id).toFixed(2)
                                                        )
                                                    }
                                                >
                                                    Monto exacto
                                                </button>
                                                {[
                                                    Math.ceil(remainingForRow(row.id) / 5) * 5,
                                                    Math.ceil(remainingForRow(row.id) / 10) * 10,
                                                    Math.ceil(remainingForRow(row.id) / 20) * 20,
                                                ]
                                                    .filter(
                                                        (value, itemIndex, values) =>
                                                            values.indexOf(value) === itemIndex &&
                                                            value >= remainingForRow(row.id)
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
                                        {Number(row.payment_type?.value) !== 1 && (
                                            <div className="pos-payment-reference">
                                                <Form.Label>Referencia del pago</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={row.reference || ''}
                                                    maxLength={100}
                                                    placeholder={Number(row.payment_type?.value) === 3 ? 'Ej. número de transferencia' : 'Ej. número de comprobante'}
                                                    onChange={(event) => onPaymentRowReferenceChange(row.id, event.target.value)}
                                                />
                                                <small>Ayuda a conciliar el cobro al cerrar caja.</small>
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
                        {errors.payment && (
                            <div className="alert alert-danger mt-3 mb-0" role="alert">
                                {errors.payment}
                            </div>
                        )}

                        {pendingBalance > 0 && !creditSaleEnabled && (
                            <div className={`pos-credit-choice ${isFinalCustomer ? 'is-blocked' : ''}`}>
                                <div><i className={`bi ${isFinalCustomer ? 'bi-exclamation-triangle' : 'bi-calendar2-check'}`} /><span><strong>{isFinalCustomer ? 'No se puede dejar saldo a consumidor final' : `Quedan ${formatMoney(pendingBalance)} por cobrar`}</strong><small>{isFinalCustomer ? 'Selecciona un cliente identificado o completa el pago.' : 'Si el cliente pagará después, activa una venta a crédito.'}</small></span></div>
                                {!isFinalCustomer && selectedCustomer?.value && <button type="button" onClick={() => onCreditSaleEnabledChange(true)}>Dejar saldo a crédito</button>}
                            </div>
                        )}

                        {pendingBalance > 0 && creditSaleEnabled && !isFinalCustomer && <div className={`pos-credit-checkout ${creditProfile?.credit_enabled ? 'is-controlled' : ''}`}>
                            <div className="pos-credit-checkout__heading"><span><i className="bi bi-calendar2-check" /></span><div><small>VENTA A CRÉDITO</small><h3>Saldo pendiente {formatMoney(pendingBalance)}</h3><p>{selectedCustomer?.label || 'Cliente seleccionado'}</p></div>{creditLoading && <i className="spinner-border spinner-border-sm" />}</div>
                            <button type="button" className="pos-credit-checkout__cancel" onClick={() => onCreditSaleEnabledChange(false)}>No dejar saldo pendiente</button>
                            <div className="pos-credit-checkout__metrics">
                                <div><span>Deuda actual</span><strong>{formatMoney(creditProfile?.outstanding_balance || 0)}</strong></div>
                                <div><span>Cupo disponible</span><strong>{creditProfile?.available_credit === null || creditProfile?.available_credit === undefined ? 'Sin límite' : formatMoney(creditProfile.available_credit)}</strong></div>
                                {Number(creditProfile?.overdue_balance || 0) > 0 && <div className="is-overdue"><span>Saldo vencido</span><strong>{formatMoney(creditProfile.overdue_balance)}</strong></div>}
                            </div>
                            <div className="pos-credit-checkout__terms"><label>Plazo<input type="number" min="0" max="3650" value={creditTerms.payment_terms_days} onChange={(event) => { const days = Number(event.target.value || 0); onCreditTermsChange({ payment_terms_days: days, payment_due_date: dayjs().add(days, 'day').format('YYYY-MM-DD') }); }} /><b>días</b></label><label>Vencimiento<input type="date" value={creditTerms.payment_due_date} onChange={(event) => onCreditTermsChange({ ...creditTerms, payment_due_date: event.target.value })} /></label></div>
                            {creditProfile?.credit_enabled && pendingBalance > Number(creditProfile.available_credit || 0) && <div className="pos-credit-checkout__warning"><i className="bi bi-exclamation-triangle" /> El saldo supera el cupo disponible. Reduce el pendiente o registra un abono mayor.</div>}
                            {offlineMode && <div className="pos-credit-checkout__offline"><i className="bi bi-cloud-slash" /> El cupo se validará al sincronizar la venta.</div>}
                        </div>}

                        <div className="pos-payment-notes">
                            <Form.Label>{getFormattedMessage("globally.input.notes.label")}</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={cashPaymentValue.notes}
                                name="notes"
                                maxLength={100}
                                onChange={onChangeInput}
                                placeholder={placeholderText(
                                    "globally.input.notes.placeholder.label"
                                )}
                            />
                            <small className="pos-payment-notes__count">{cashPaymentValue.notes?.length || 0}/100</small>
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
                <button type="button" className="pos-payment-cancel" disabled={processing} onClick={handleCashPayment}>
                    Cancelar
                </button>
                <button
                    type="button"
                    className="pos-payment-submit"
                    disabled={processing || !canSubmit}
                    onClick={(event) => onCashPayment(event)}
                >
                    {processing ? <span className="spinner-border spinner-border-sm" /> : <FontAwesomeIcon icon={faWallet} />}
                    {processing ? (processingLabel || "Guardando venta…") : offlineMode ? "Guardar cobro offline" : totalPaid >= Number(grandTotal) ? `Cobrar ${formatMoney(grandTotal)}` : "Confirmar venta a crédito"}
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default CashPaymentModel;
