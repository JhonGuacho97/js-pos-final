import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleCheck,
    faTriangleExclamation,
    faCashRegister,
} from "@fortawesome/free-solid-svg-icons";
import { currencySymbolHandling, getAvatarName } from "../../../shared/sharedMethod";

/**
 * Solo lectura: muestra cómo quedó un registro de caja ya cerrado --
 * quién lo cerró, si cuadró, y el desglose de billetes/monedas de
 * apertura y cierre. Mismo lenguaje visual que el modal de cierre en vivo
 * (PosCloseRegisterDetailsModel), para que se sientan como la misma
 * pantalla en dos momentos distintos.
 */
const RegisterDenominationsModal = ({
    show,
    onHide,
    register,
    currencySymbol,
    allConfigData,
}) => {
    if (!register) {
        return null;
    }

    const hasExpectedCash =
        register.expected_cash !== null && register.expected_cash !== undefined;
    const difference = hasExpectedCash
        ? Math.round(
              (Number(register.cash_in_hand_while_closing) -
                  Number(register.expected_cash)) *
                  100
          ) / 100
        : null;

    const status = !hasExpectedCash
        ? null
        : difference === 0
        ? { label: "Caja cuadrada", tone: "success", icon: faCircleCheck }
        : difference > 0
        ? { label: "Sobrante — revisar", tone: "warning", icon: faTriangleExclamation }
        : { label: "Faltante", tone: "danger", icon: faTriangleExclamation };

    const toneStyles = status && {
        success: { bg: "#ecfdf5", fg: "#059669", ring: "#a7f3d0" },
        warning: { bg: "#fffbeb", fg: "#b45309", ring: "#fde68a" },
        danger: { bg: "#fef2f2", fg: "#dc2626", ring: "#fecaca" },
    }[status.tone];

    const renderDenominationGrid = (title, denominations) => {
        const total = (denominations || []).reduce(
            (sum, d) => sum + Number(d.subtotal || 0),
            0
        );

        return (
            <div className="flex-fill">
                <div
                    className="d-flex align-items-center justify-content-between mb-2"
                >
                    <span
                        className="text-muted text-uppercase"
                        style={{ fontSize: 11, letterSpacing: 0.4 }}
                    >
                        {title}
                    </span>
                    <span style={{ fontWeight: 600 }}>
                        {currencySymbolHandling(allConfigData, currencySymbol, total)}
                    </span>
                </div>
                {denominations && denominations.length > 0 ? (
                    <div
                        className="d-grid"
                        style={{
                            gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
                            gap: 8,
                        }}
                    >
                        {denominations.map((d, index) => (
                            <div
                                key={index}
                                className="text-center p-2 rounded"
                                style={{ background: "#f9fafb" }}
                            >
                                <div className="text-muted" style={{ fontSize: 11 }}>
                                    {currencySymbolHandling(allConfigData, currencySymbol, d.value)}
                                </div>
                                <div style={{ fontWeight: 600 }}>×{d.quantity}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-muted fs-small">
                        No se registró un desglose de efectivo para este momento.
                    </div>
                )}
            </div>
        );
    };

    const fullName = `${register.user_first_name || ""} ${register.user_last_name || ""}`.trim();

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <div className="d-flex align-items-center gap-2">
                        {register.user_image ? (
                            <img
                                src={register.user_image}
                                height="34"
                                width="34"
                                alt={fullName}
                                className="image image-circle"
                            />
                        ) : (
                            <span className="custom-user-avatar">
                                {getAvatarName(fullName)}
                            </span>
                        )}
                        <div>
                            <div>{fullName}</div>
                            <div className="text-muted fs-small" style={{ fontWeight: 400 }}>
                                {register.open_date} {register.open_time} → {register.close_date} {register.close_time}
                            </div>
                        </div>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {status && (
                    <div
                        className="d-flex align-items-center justify-content-between rounded mb-4 p-3"
                        style={{
                            background: toneStyles.bg,
                            border: `1px solid ${toneStyles.ring}`,
                        }}
                    >
                        <div className="d-flex align-items-center gap-3">
                            <FontAwesomeIcon
                                icon={status.icon}
                                size="lg"
                                style={{ color: toneStyles.fg }}
                            />
                            <div>
                                <div style={{ color: toneStyles.fg, fontSize: 16, fontWeight: 700 }}>
                                    {status.label}
                                </div>
                                <div className="text-muted fs-small">
                                    Esperado{" "}
                                    {currencySymbolHandling(allConfigData, currencySymbol, register.expected_cash)}
                                    {" · "}
                                    Contado{" "}
                                    {currencySymbolHandling(allConfigData, currencySymbol, register.cash_in_hand_while_closing)}
                                </div>
                            </div>
                        </div>
                        <div style={{ color: toneStyles.fg, fontSize: 20, fontWeight: 700 }}>
                            {difference !== 0 && (difference > 0 ? "+" : "-")}
                            {currencySymbolHandling(allConfigData, currencySymbol, Math.abs(difference))}
                        </div>
                    </div>
                )}

                {register.discrepancy_reason && (
                    <div
                        className="rounded mb-3 p-3"
                        style={{ background: "#fffbeb", border: "1px solid #fde68a" }}
                    >
                        <div
                            className="text-uppercase mb-1"
                            style={{ fontSize: 11, letterSpacing: 0.4, color: "#b45309" }}
                        >
                            Motivo de la diferencia
                        </div>
                        <div style={{ fontWeight: 600 }}>{register.discrepancy_reason}</div>
                        {register.discrepancy_note && (
                            <div className="text-muted fs-small mt-1">
                                {register.discrepancy_note}
                            </div>
                        )}
                    </div>
                )}

                {register.reconciliation_status && register.reconciliation_status !== "BALANCED" && (
                    <div className="rounded mb-3 p-3" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                        <div className="text-uppercase mb-1" style={{ fontSize: 11, letterSpacing: 0.4, color: "#64748b" }}>
                            Revisión de supervisión
                        </div>
                        <div style={{ fontWeight: 600 }}>
                            {register.reconciliation_status === "APPROVED" ? "Cierre aprobado" : register.reconciliation_status === "REJECTED" ? "Cierre rechazado" : "Pendiente de revisión"}
                        </div>
                        {register.reviewed_by && <div className="text-muted fs-small mt-1">Revisado por {register.reviewed_by.first_name} {register.reviewed_by.last_name}</div>}
                        {register.review_note && <div className="text-muted fs-small mt-1">{register.review_note}</div>}
                    </div>
                )}

                <div className="d-flex align-items-center gap-2 mb-3">
                    <FontAwesomeIcon icon={faCashRegister} className="text-muted" />
                    <span style={{ fontWeight: 700 }}>Desglose de efectivo</span>
                </div>
                <div className="d-flex flex-column flex-md-row gap-4 mb-3">
                    {renderDenominationGrid("Apertura", register.opening_denominations)}
                    {renderDenominationGrid("Cierre", register.closing_denominations)}
                </div>

                {register.notes && (
                    <div className="mt-4 pt-3" style={{ borderTop: "1px solid #f1f1f4" }}>
                        <div
                            className="text-muted text-uppercase mb-1"
                            style={{ fontSize: 11, letterSpacing: 0.4 }}
                        >
                            Notas
                        </div>
                        <div>{register.notes}</div>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="light" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RegisterDenominationsModal;
