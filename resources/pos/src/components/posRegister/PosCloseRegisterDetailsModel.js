import React, { useEffect, useMemo, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import {
    currencySymbolHandling,
    getFormattedMessage,
    placeholderText,
} from "../../shared/sharedMethod";
import DenominationCounter from "./DenominationCounter";
import { buildEmptyDenominationRows } from "../../shared/cashDenominations";
import "./pos-close-register.scss";

const discrepancyReasons = [
    "Gasto pagado desde la caja",
    "Ingreso extra no registrado en el sistema",
    "Error al dar cambio a un cliente",
    "Error de conteo",
    "Otro",
];

const PosCloseRegisterDetailsModel = ({
    showCloseDetailsModal,
    handleCloseRegisterDetails,
    setShowCloseDetailsModal,
}) => {
    const { frontSetting, allConfigData, closeRegisterDetails } = useSelector(
        (state) => state
    );
    const currencySymbol = frontSetting?.value?.currency_symbol;

    const [step, setStep] = useState("count");
    const [formValue, setFormsValue] = useState({
        cash_in_hand_while_closing: 0,
        notes: "",
    });
    const [discrepancyReason, setDiscrepancyReason] = useState("");
    const [discrepancyNote, setDiscrepancyNote] = useState("");
    const [validationError, setValidationError] = useState("");
    const [denominationRows, setDenominationRows] = useState(
        buildEmptyDenominationRows
    );
    const [zeroCashConfirmed, setZeroCashConfirmed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!showCloseDetailsModal) return;

        setStep("count");
        setFormsValue({ cash_in_hand_while_closing: 0, notes: "" });
        setDiscrepancyReason("");
        setDiscrepancyNote("");
        setValidationError("");
        setDenominationRows(buildEmptyDenominationRows());
        setZeroCashConfirmed(false);
        setIsSubmitting(false);
    }, [showCloseDetailsModal]);

    const money = (amount) =>
        currencySymbolHandling(
            allConfigData,
            currencySymbol,
            Number(amount || 0)
        );
    const value = (key) => Number(closeRegisterDetails?.[key] || 0);

    const expectedCash = value("total_cash_amount");
    const countedCash = Number(formValue.cash_in_hand_while_closing) || 0;
    const cashDifference = Math.round((countedCash - expectedCash) * 100) / 100;
    const hasCountInput = denominationRows.some((row) => row.quantity !== "");
    const canReview = hasCountInput || zeroCashConfirmed;
    const detailsReady = Object.keys(closeRegisterDetails || {}).length > 0;

    const closeStatus =
        Math.abs(cashDifference) < 0.01
            ? {
                  label: "Caja cuadrada",
                  description: "El efectivo contado coincide con el valor esperado.",
                  tone: "success",
                  icon: "bi-check2-circle",
              }
            : cashDifference > 0
            ? {
                  label: "Sobrante de caja",
                  description: "Hay más efectivo físico del registrado por el sistema.",
                  tone: "warning",
                  icon: "bi-exclamation-triangle",
              }
            : {
                  label: "Faltante de caja",
                  description: "El efectivo físico es menor al valor esperado.",
                  tone: "danger",
                  icon: "bi-exclamation-triangle",
              };

    const paymentMethods = useMemo(
        () => [
            {
                key: "cash",
                label: getFormattedMessage("cash.label"),
                amount: value("today_sales_cash_payment"),
                icon: "bi-cash-stack",
            },
            {
                key: "transfer",
                label: getFormattedMessage(
                    "payment-type.filter.bank-transfer.label"
                ),
                amount: value("today_sales_bank_transfer_payment"),
                icon: "bi-bank",
            },
            {
                key: "cheque",
                label: getFormattedMessage("payment-type.filter.cheque.label"),
                amount: value("today_sales_cheque_payment"),
                icon: "bi-receipt",
            },
            {
                key: "other",
                label: getFormattedMessage("payment-type.filter.other.label"),
                amount: value("today_sales_other_payment"),
                icon: "bi-wallet2",
            },
        ],
        [closeRegisterDetails]
    );

    const currentDate = new Intl.DateTimeFormat("es-EC", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date());

    const onCountedTotalChange = (total) => {
        setFormsValue((current) => ({
            ...current,
            cash_in_hand_while_closing: total,
        }));
    };

    const onReviewCount = () => {
        if (!canReview) {
            setValidationError(
                "Ingresa al menos una cantidad o confirma que la caja está vacía."
            );
            return;
        }
        setValidationError("");
        setStep("review");
    };

    const onSubmit = async () => {
        if (cashDifference !== 0 && !discrepancyReason) {
            setValidationError(
                "Selecciona el motivo del faltante o sobrante antes de cerrar."
            );
            return;
        }
        if (
            cashDifference !== 0 &&
            discrepancyReason === "Otro" &&
            !discrepancyNote.trim()
        ) {
            setValidationError("Describe brevemente el motivo de la diferencia.");
            return;
        }

        setValidationError("");
        setIsSubmitting(true);
        const completed = await handleCloseRegisterDetails({
            ...formValue,
            closing_denominations: denominationRows
                .filter((row) => Number(row.quantity) > 0)
                .map((row) => ({
                    value: row.value,
                    quantity: Number(row.quantity),
                    subtotal: Number(row.quantity) * row.value,
                })),
            discrepancy_reason:
                cashDifference !== 0 ? discrepancyReason : null,
            discrepancy_note:
                cashDifference !== 0 && discrepancyReason === "Otro"
                    ? discrepancyNote.trim()
                    : null,
        });

        if (!completed) setIsSubmitting(false);
    };

    const closeModal = () => {
        if (!isSubmitting) setShowCloseDetailsModal(false);
    };

    return (
        <Modal
            size="lg"
            centered
            show={showCloseDetailsModal}
            onHide={closeModal}
            backdrop={isSubmitting ? "static" : true}
            keyboard={!isSubmitting}
            className="pos-close-register-modal"
            aria-labelledby="pos-close-register-title"
        >
            <Modal.Header closeButton={!isSubmitting}>
                <div className="pos-close-heading">
                    <span className="pos-close-heading__icon">
                        <i className="bi bi-lock" />
                    </span>
                    <div>
                        <span className="pos-close-eyebrow">CIERRE DE TURNO</span>
                        <Modal.Title id="pos-close-register-title">
                            Cerrar registro de caja
                        </Modal.Title>
                        <p>
                            <i className="bi bi-calendar3" /> {currentDate}
                        </p>
                    </div>
                </div>
                <span className="pos-close-status">
                    <i /> Caja abierta
                </span>
            </Modal.Header>

            <div className="pos-close-progress" aria-label="Progreso del cierre">
                <div className={step === "count" ? "is-active" : "is-complete"}>
                    <span>{step === "review" ? <i className="bi bi-check-lg" /> : "1"}</span>
                    <div><strong>Contar efectivo</strong><small>Arqueo físico</small></div>
                </div>
                <i className="bi bi-chevron-right" />
                <div className={step === "review" ? "is-active" : ""}>
                    <span>2</span>
                    <div><strong>Revisar y cerrar</strong><small>Confirmar resultado</small></div>
                </div>
            </div>

            <Modal.Body>
                {!detailsReady ? (
                    <div className="pos-close-loading">
                        <span className="spinner-border spinner-border-sm" />
                        <strong>Preparando la información del turno...</strong>
                    </div>
                ) : step === "count" ? (
                    <div className="pos-close-count-step">
                        <section className="pos-close-guidance">
                            <span><i className="bi bi-shield-check" /></span>
                            <div>
                                <strong>Realiza un conteo ciego</strong>
                                <p>Cuenta únicamente el dinero físico. El valor esperado se mostrará después para mantener un arqueo confiable.</p>
                            </div>
                        </section>

                        <section className="pos-close-section">
                            <header>
                                <div>
                                    <span>CONTEO DE EFECTIVO</span>
                                    <h3>Billetes y monedas en caja</h3>
                                </div>
                                <small>Ingresa únicamente cantidades</small>
                            </header>
                            <DenominationCounter
                                rows={denominationRows}
                                setRows={(updater) => {
                                    setDenominationRows(updater);
                                    setZeroCashConfirmed(false);
                                    setValidationError("");
                                }}
                                currencySymbol={currencySymbol}
                                onTotalChange={onCountedTotalChange}
                                variant="compact"
                                formatMoney={money}
                            />
                        </section>

                        {countedCash === 0 && !hasCountInput && (
                            <button
                                type="button"
                                className={`pos-close-zero ${zeroCashConfirmed ? "is-confirmed" : ""}`}
                                onClick={() => {
                                    setZeroCashConfirmed((current) => !current);
                                    setValidationError("");
                                }}
                            >
                                <span><i className={`bi ${zeroCashConfirmed ? "bi-check2-circle" : "bi-wallet"}`} /></span>
                                <div><strong>{zeroCashConfirmed ? "Caja vacía confirmada" : "No hay efectivo físico"}</strong><small>Confirma un conteo total de {money(0)}</small></div>
                                <i className="bi bi-chevron-right" />
                            </button>
                        )}

                        {validationError && (
                            <div className="pos-close-inline-error">
                                <i className="bi bi-exclamation-circle" /> {validationError}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="pos-close-review-step">
                        <section className={`pos-close-result is-${closeStatus.tone}`}>
                            <div className="pos-close-result__status">
                                <span><i className={`bi ${closeStatus.icon}`} /></span>
                                <div><strong>{closeStatus.label}</strong><p>{closeStatus.description}</p></div>
                            </div>
                            <div className="pos-close-result__amount">
                                <small>DIFERENCIA</small>
                                <strong>{cashDifference > 0 ? "+" : cashDifference < 0 ? "−" : ""}{money(Math.abs(cashDifference))}</strong>
                            </div>
                            <div className="pos-close-result__comparison">
                                <div><small>Esperado</small><strong>{money(expectedCash)}</strong></div>
                                <i className="bi bi-arrow-right" />
                                <div><small>Contado</small><strong>{money(countedCash)}</strong></div>
                            </div>
                        </section>

                        {cashDifference !== 0 && (
                            <section className="pos-close-section pos-close-discrepancy">
                                <header>
                                    <div><span>JUSTIFICACIÓN</span><h3>Documenta la diferencia</h3></div>
                                    <small>Información requerida</small>
                                </header>
                                <div className="pos-close-field-grid">
                                    <label>
                                        <span>Motivo de la diferencia *</span>
                                        <select
                                            className="form-select"
                                            value={discrepancyReason}
                                            onChange={(event) => {
                                                setDiscrepancyReason(event.target.value);
                                                setValidationError("");
                                            }}
                                        >
                                            <option value="">Selecciona un motivo</option>
                                            {discrepancyReasons.map((reason) => <option key={reason} value={reason}>{reason}</option>)}
                                        </select>
                                    </label>
                                    {discrepancyReason === "Otro" && (
                                        <label>
                                            <span>Descripción *</span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Describe brevemente qué ocurrió"
                                                value={discrepancyNote}
                                                maxLength={1000}
                                                onChange={(event) => {
                                                    setDiscrepancyNote(event.target.value);
                                                    setValidationError("");
                                                }}
                                            />
                                        </label>
                                    )}
                                </div>
                            </section>
                        )}

                        <section className="pos-close-section">
                            <header>
                                <div><span>RESUMEN DEL TURNO</span><h3>Cómo ingresó el dinero</h3></div>
                                <small>{paymentMethods.filter((method) => method.amount > 0).length} métodos utilizados</small>
                            </header>
                            <div className="pos-close-payments">
                                {paymentMethods.map((method) => (
                                    <article key={method.key} className={`is-${method.key}`}>
                                        <span><i className={`bi ${method.icon}`} /></span>
                                        <div><small>{method.label}</small><strong>{money(method.amount)}</strong></div>
                                    </article>
                                ))}
                            </div>
                            <div className="pos-close-totals">
                                <div><span>Fondo inicial</span><strong>{money(value("cash_in_hand"))}</strong></div>
                                <div><span>Movimientos manuales</span><strong>{money(value("manual_cash_net"))}</strong></div>
                                <div><span>Ventas registradas</span><strong>{money(value("today_sales_amount"))}</strong></div>
                                <div><span>Devoluciones</span><strong className="is-negative">−{money(value("today_sales_return_amount"))}</strong></div>
                                <div className="is-total"><span>Total recibido</span><strong>{money(value("today_sales_payment_amount"))}</strong></div>
                            </div>
                        </section>

                        <section className="pos-close-section pos-close-notes">
                            <header>
                                <div><span>OBSERVACIONES</span><h3>Nota del cierre</h3></div>
                                <small>Opcional</small>
                            </header>
                            <textarea
                                rows="3"
                                name="notes"
                                className="form-control"
                                maxLength={1000}
                                placeholder={placeholderText("globally.input.note.placeholder.label")}
                                onChange={(event) => setFormsValue((current) => ({ ...current, notes: event.target.value }))}
                                value={formValue.notes}
                            />
                        </section>

                        {validationError && (
                            <div className="pos-close-inline-error">
                                <i className="bi bi-exclamation-circle" /> {validationError}
                            </div>
                        )}
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer>
                <span><i className="bi bi-shield-lock" /> El cierre quedará registrado para auditoría.</span>
                <div>
                    {step === "review" && (
                        <button type="button" className="btn pos-close-back" disabled={isSubmitting} onClick={() => { setStep("count"); setValidationError(""); }}>
                            <i className="bi bi-arrow-left" /> Volver a contar
                        </button>
                    )}
                    <button type="button" className="btn pos-close-cancel" disabled={isSubmitting} onClick={closeModal}>
                        Cancelar
                    </button>
                    {step === "count" ? (
                        <button type="button" className="btn pos-close-primary" disabled={!detailsReady} onClick={onReviewCount}>
                            Revisar arqueo <i className="bi bi-arrow-right" />
                        </button>
                    ) : (
                        <button type="button" className={`btn pos-close-primary is-${closeStatus.tone}`} disabled={isSubmitting} onClick={onSubmit}>
                            {isSubmitting ? <><span className="spinner-border spinner-border-sm" /> Cerrando caja...</> : <><i className="bi bi-lock-fill" /> {closeStatus.tone === "success" ? "Cerrar caja cuadrada" : closeStatus.tone === "warning" ? "Cerrar con sobrante" : "Cerrar con faltante"}</>}
                        </button>
                    )}
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default PosCloseRegisterDetailsModel;
