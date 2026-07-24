import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(isoWeek);
dayjs.extend(relativeTime);
import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMoneyBillWave,
    faMoneyCheckDollar,
    faBuildingColumns,
    faEllipsis,
    faCircleCheck,
    faTriangleExclamation,
    faCashRegister,
    faChevronDown,
    faChevronUp,
    faCalculator,
} from "@fortawesome/free-solid-svg-icons";
import {
    currencySymbolHandling,
    getFormattedMessage,
    placeholderText,
} from "../../shared/sharedMethod";
import DenominationCounter from "./DenominationCounter";
import { buildEmptyDenominationRows } from "../../shared/cashDenominations";

const PosCloseRegisterDetailsModel = ({
    showCloseDetailsModal,
    handleCloseRegisterDetails,
    setShowCloseDetailsModal,
}) => {
    const { frontSetting, allConfigData, closeRegisterDetails } = useSelector(
        (state) => state
    );
    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;

    const [formValue, setFormsValue] = useState({
        cash_in_hand_while_closing: 0,
        notes: "",
    });
    const [discrepancyReason, setDiscrepancyReason] = useState("");
    const [discrepancyNote, setDiscrepancyNote] = useState("");

    // Motivos típicos de por qué la caja no cuadró -- si ninguno aplica,
    // "Otro" habilita un campo de texto libre.
    const discrepancyReasons = [
        "Gasto pagado desde la caja",
        "Ingreso extra no registrado en el sistema",
        "Error al dar cambio a un cliente",
        "Error de conteo",
        "Otro",
    ];
    const [denominationRows, setDenominationRows] = useState(
        buildEmptyDenominationRows()
    );
    // Un solo toggle para TODO lo que es "información de referencia"
    // (apertura, ventas por método de pago, totales). Cerrado por defecto:
    // lo único que el cajero necesita hacer activamente es contar, así que
    // eso es lo único que se ve de entrada.
    const [showSummary, setShowSummary] = useState(false);

    // El total contado (suma de billetes/monedas) reemplaza el prefill
    // automático que existía antes: ahora el cajero cuenta el efectivo
    // físico, en vez de arrancar con el valor que el sistema espera.
    const onCountedTotalChange = (total) => {
        setFormsValue((data) => ({
            ...data,
            cash_in_hand_while_closing: total,
        }));
    };

    const expectedCash = closeRegisterDetails?.total_cash_amount || 0;
    const countedCash = Number(formValue.cash_in_hand_while_closing) || 0;
    const cashDifference = countedCash - expectedCash;
    const openingCash = closeRegisterDetails?.cash_in_hand || 0;
    const todaySales = closeRegisterDetails?.today_sales_amount || 0;

    const closeStatus =
        cashDifference === 0
            ? { label: "Caja cuadrada", tone: "success", icon: faCircleCheck }
            : cashDifference > 0
            ? { label: "Sobrante — revisar", tone: "warning", icon: faTriangleExclamation }
            : { label: "Faltante", tone: "danger", icon: faTriangleExclamation };

    const toneStyles = {
        success: { bg: "#ecfdf5", fg: "#059669", ring: "#a7f3d0" },
        warning: { bg: "#fffbeb", fg: "#b45309", ring: "#fde68a" },
        danger: { bg: "#fef2f2", fg: "#dc2626", ring: "#fecaca" },
    }[closeStatus.tone];

    // Un vistazo rápido a cómo entró la plata hoy -- transferencia incluida
    // y bien visible, no enterrada en una fila de tabla.
    const paymentMethods = [
        {
            key: "cash",
            label: getFormattedMessage("cash.label"),
            amount: closeRegisterDetails?.today_sales_cash_payment,
            icon: faMoneyBillWave,
            accent: "#16a34a",
        },
        {
            key: "transfer",
            label: getFormattedMessage(
                "payment-type.filter.bank-transfer.label"
            ),
            amount: closeRegisterDetails?.today_sales_bank_transfer_payment,
            icon: faBuildingColumns,
            accent: "#2F6FED",
        },
        {
            key: "cheque",
            label: getFormattedMessage("payment-type.filter.cheque.label"),
            amount: closeRegisterDetails?.today_sales_cheque_payment,
            icon: faMoneyCheckDollar,
            accent: "#d97706",
        },
        {
            key: "other",
            label: getFormattedMessage("payment-type.filter.other.label"),
            amount: closeRegisterDetails?.today_sales_other_payment,
            icon: faEllipsis,
            accent: "#64748b",
        },
    ];

    const totals = [
        {
            key: "total-sales",
            label: getFormattedMessage("register.total-sales.label"),
            amount: closeRegisterDetails?.today_sales_amount,
        },
        {
            key: "total-refund",
            label: getFormattedMessage("register.total-refund.title"),
            amount: closeRegisterDetails?.today_sales_return_amount,
        },
        {
            key: "total-payment",
            label: getFormattedMessage("register.total-payment.title"),
            amount: closeRegisterDetails?.today_sales_payment_amount,
        },
    ];

    const onChangeInput = (e) => {
        setFormsValue((data) => ({
            ...data,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <>
            <Modal
                size="lg"
                aria-labelledby="example-custom-modal-styling-title"
                show={showCloseDetailsModal}
                onHide={() => setShowCloseDetailsModal(false)}
                className="registerModel-content"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        {getFormattedMessage("globally.close-register.title")} (
                        {dayjs(Date()).format("MMMM Do YYYY")})
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: "78vh", overflowY: "auto" }}>
                    {/* Todo lo que es "referencia" (apertura, ventas por
                        método de pago, totales del día) vive acá adentro,
                        colapsado. El cajero lo abre si lo necesita, pero no
                        le compite visualmente al conteo. */}
                    <div
                        className="rounded mb-4"
                        style={{ border: "1px solid #e5e7eb" }}
                    >
                        <button
                            type="button"
                            className="btn btn-light w-100 d-flex align-items-center justify-content-between p-3"
                            onClick={() => setShowSummary((prev) => !prev)}
                        >
                            <span className="d-flex align-items-center gap-3 flex-wrap">
                                <span className="d-flex align-items-center gap-2">
                                    <FontAwesomeIcon icon={faCashRegister} className="text-muted" />
                                    <span className="text-muted">Resumen del día</span>
                                </span>
                                <span className="text-muted fs-small">
                                    Apertura{" "}
                                    <strong className="text-body">
                                        {currencySymbolHandling(allConfigData, currencySymbol, openingCash)}
                                    </strong>
                                    {" · "}
                                    Ventas{" "}
                                    <strong className="text-body">
                                        {currencySymbolHandling(allConfigData, currencySymbol, todaySales)}
                                    </strong>
                                </span>
                            </span>
                            <FontAwesomeIcon
                                icon={showSummary ? faChevronUp : faChevronDown}
                                className="text-muted flex-shrink-0"
                            />
                        </button>

                        {showSummary && (
                            <div className="p-3 pt-0">
                                {/* Apertura */}
                                <div className="pt-3" style={{ borderTop: "1px solid #f1f1f4" }}>
                                    <div className="text-muted text-uppercase mb-2" style={{ fontSize: 11, letterSpacing: 0.4 }}>
                                        Con qué abriste
                                    </div>
                                    {closeRegisterDetails?.opening_denominations?.length > 0 ? (
                                        <div
                                            className="d-grid mb-3"
                                            style={{
                                                gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
                                                gap: 8,
                                            }}
                                        >
                                            {closeRegisterDetails.opening_denominations.map((denom) => (
                                                <div
                                                    key={denom.value}
                                                    className="text-center p-2 rounded"
                                                    style={{ background: "#f9fafb" }}
                                                >
                                                    <div className="text-muted" style={{ fontSize: 11 }}>
                                                        {currencySymbolHandling(allConfigData, currencySymbol, denom.value)}
                                                    </div>
                                                    <div style={{ fontWeight: 600 }}>×{denom.quantity}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-muted fs-small mb-3">
                                            No se registró un desglose de billetes/monedas para esta apertura.
                                        </div>
                                    )}
                                </div>

                                {/* Ventas por método de pago */}
                                <div className="text-muted text-uppercase mb-2" style={{ fontSize: 11, letterSpacing: 0.4 }}>
                                    Ventas de hoy por método de pago
                                </div>
                                <div
                                    className="d-grid mb-3"
                                    style={{
                                        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                                        gap: 10,
                                    }}
                                >
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method.key}
                                            className="p-2 rounded d-flex align-items-center gap-2"
                                            style={{ border: "1px solid #e5e7eb" }}
                                        >
                                            <div
                                                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                                                style={{
                                                    width: 28,
                                                    height: 28,
                                                    background: `${method.accent}1a`,
                                                    color: method.accent,
                                                }}
                                            >
                                                <FontAwesomeIcon icon={method.icon} size="xs" />
                                            </div>
                                            <div>
                                                <div className="text-muted" style={{ fontSize: 11 }}>
                                                    {method.label}
                                                </div>
                                                <div style={{ fontWeight: 600 }}>
                                                    {currencySymbolHandling(allConfigData, currencySymbol, method.amount)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totales del día */}
                                <div
                                    className="d-flex rounded overflow-hidden"
                                    style={{ border: "1px solid #e5e7eb" }}
                                >
                                    {totals.map((total, index) => (
                                        <div
                                            key={total.key}
                                            className="flex-fill p-2 text-center"
                                            style={{
                                                borderLeft: index === 0 ? "none" : "1px solid #e5e7eb",
                                            }}
                                        >
                                            <div className="text-muted text-uppercase" style={{ fontSize: 11, letterSpacing: 0.4 }}>
                                                {total.label}
                                            </div>
                                            <div style={{ fontWeight: 600 }}>
                                                {currencySymbolHandling(allConfigData, currencySymbol, total.amount)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Lo único que el cajero realmente tiene que HACER acá:
                        contar el efectivo físico. Va sin colapsar, con su
                        propio encabezado destacado. */}
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <FontAwesomeIcon icon={faCalculator} style={{ color: "#2F6FED" }} />
                        <span style={{ fontWeight: 700, fontSize: 16 }}>
                            {getFormattedMessage("globally.total-cash.label")}
                        </span>
                        <span className="required" />
                    </div>
                    <DenominationCounter
                        rows={denominationRows}
                        setRows={setDenominationRows}
                        currencySymbol={currencySymbol}
                        onTotalChange={onCountedTotalChange}
                    />

                    {/* Resultado del arqueo: lo segundo más importante después
                        de contar -- el pago de todo este proceso. */}
                    <div
                        className="d-flex align-items-center justify-content-between rounded mt-3 mb-4 p-3"
                        style={{
                            background: toneStyles.bg,
                            border: `1px solid ${toneStyles.ring}`,
                        }}
                    >
                        <div className="d-flex align-items-center gap-3">
                            <FontAwesomeIcon
                                icon={closeStatus.icon}
                                size="lg"
                                style={{ color: toneStyles.fg }}
                            />
                            <div>
                                <div style={{ color: toneStyles.fg, fontSize: 16, fontWeight: 700 }}>
                                    {closeStatus.label}
                                </div>
                                <div className="text-muted fs-small">
                                    Esperado {currencySymbolHandling(allConfigData, currencySymbol, expectedCash)}
                                    {" · "}
                                    Contado {currencySymbolHandling(allConfigData, currencySymbol, countedCash)}
                                </div>
                            </div>
                        </div>
                        <div style={{ color: toneStyles.fg, fontSize: 20, fontWeight: 700 }}>
                            {cashDifference !== 0 && (cashDifference > 0 ? "+" : "-")}
                            {currencySymbolHandling(allConfigData, currencySymbol, Math.abs(cashDifference))}
                        </div>
                    </div>

                    {/* Solo aparece si la caja NO cuadró -- documentar el
                        motivo evita que alguien tenga que adivinar después,
                        al revisar el reporte, por qué faltó o sobró plata. */}
                    {cashDifference !== 0 && (
                        <div className="mb-4">
                            <label className="form-label">
                                Motivo de la diferencia
                                <span className="required" />
                            </label>
                            <select
                                className="form-control"
                                value={discrepancyReason}
                                onChange={(e) => setDiscrepancyReason(e.target.value)}
                            >
                                <option value="">Selecciona un motivo</option>
                                {discrepancyReasons.map((reason) => (
                                    <option key={reason} value={reason}>
                                        {reason}
                                    </option>
                                ))}
                            </select>
                            {discrepancyReason === "Otro" && (
                                <input
                                    type="text"
                                    className="form-control mt-2"
                                    placeholder="Cuéntanos qué pasó"
                                    value={discrepancyNote}
                                    onChange={(e) => setDiscrepancyNote(e.target.value)}
                                />
                            )}
                        </div>
                    )}

                    <div>
                        <label className="form-label text-muted">
                            {getFormattedMessage("globally.input.note.label")}{" "}
                            <span className="fs-small">(opcional)</span>
                        </label>
                        <textarea
                            type="text"
                            rows="3"
                            cols="50"
                            name="notes"
                            className="form-control"
                            placeholder={placeholderText(
                                "globally.input.note.placeholder.label"
                            )}
                            onChange={(e) => onChangeInput(e)}
                            value={formValue.notes}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer className="justify-content-end pt-2 pb-3">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowCloseDetailsModal(false)}
                    >
                        {getFormattedMessage("pos-close-btn.title")}
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() =>
                            handleCloseRegisterDetails({
                                ...formValue,
                                closing_denominations: denominationRows
                                    .filter((row) => Number(row.quantity) > 0)
                                    .map((row) => ({
                                        value: row.value,
                                        quantity: Number(row.quantity),
                                        subtotal:
                                            Number(row.quantity) * row.value,
                                    })),
                                discrepancy_reason:
                                    cashDifference !== 0 ? discrepancyReason : null,
                                discrepancy_note:
                                    cashDifference !== 0 &&
                                    discrepancyReason === "Otro"
                                        ? discrepancyNote
                                        : null,
                            })
                        }
                    >
                        {getFormattedMessage("globally.close-register.title")}
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default PosCloseRegisterDetailsModel;
