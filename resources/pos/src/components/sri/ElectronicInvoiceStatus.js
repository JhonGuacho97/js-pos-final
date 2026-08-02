import React, { useState } from "react";
import { Modal } from "react-bootstrap";

const ESTADO_CONFIG = {
    PENDIENTE: { color: "#f0ad4e", texto: "Generando...", icono: "⏳" },
    RECIBIDA: { color: "#5bc0de", texto: "Esperando SRI", icono: "📤" },
    AUTORIZADA: { color: "#28a745", texto: "Autorizada", icono: "✅" },
    NO_AUTORIZADA: { color: "#dc3545", texto: "Rechazada", icono: "❌" },
    DEVUELTA: { color: "#dc3545", texto: "Devuelta por el SRI", icono: "⚠️" },
    // Color y texto propios a propósito -- esto NO es un rechazo del
    // comprobante, es el propio servidor del SRI fallando. El usuario
    // no debería pensar que su factura está mal.
    ERROR_TEMPORAL_SRI: { color: "#fd7e14", texto: "Error del SRI", icono: "🔧" },
};

const ESTADO_TITULO = {
    NO_AUTORIZADA: "Rechazada por el SRI",
    DEVUELTA: "Devuelta por el SRI",
    ERROR_TEMPORAL_SRI: "Error temporal del SRI (no de tu factura)",
};

export const ElectronicInvoiceStatusBadge = ({ estado, data, error, onReintentar }) => {
    const [showModal, setShowModal] = useState(false);

    if (error) {
        return (
            <div className="alert alert-danger d-flex align-items-center mt-2 mb-0 py-2">
                <span>⚠️ {error}</span>
            </div>
        );
    }

    if (!estado) return null;

    const config = ESTADO_CONFIG[estado] || ESTADO_CONFIG.PENDIENTE;
    const esFinal = estado === "AUTORIZADA" || estado === "NO_AUTORIZADA" || estado === "DEVUELTA" || estado === "ERROR_TEMPORAL_SRI";
    const puedeReintentar =
        (estado === "NO_AUTORIZADA" || estado === "DEVUELTA" || estado === "ERROR_TEMPORAL_SRI") && data?.puede_reintentar;
    const primerMensaje = data?.mensajes?.[0];
    const textoError = primerMensaje
        ? [primerMensaje.mensaje, primerMensaje.informacionAdicional].filter(Boolean).join(": ")
        : "";

    // Solo tiene sentido abrir el modal si hay algo más que mostrar
    // que el propio texto de la insignia (un error, o la posibilidad
    // de reintentar) -- para AUTORIZADA/PENDIENTE/RECIBIDA no hace
    // falta, no hay nada más que decir.
    const tieneDetalle = Boolean(textoError) || puedeReintentar;

    const handleReintentar = () => {
        setShowModal(false);
        onReintentar?.();
    };

    return (
        <>
            <span
                onClick={() => tieneDetalle && setShowModal(true)}
                title={tieneDetalle ? "Ver detalle" : undefined}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.25rem 0.65rem",
                    borderRadius: "999px",
                    backgroundColor: `${config.color}15`,
                    border: `1px solid ${config.color}40`,
                    color: config.color,
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    whiteSpace: "nowrap",
                    cursor: tieneDetalle ? "pointer" : "default",
                }}
            >
                <span>{config.icono}</span>
                <span>{config.texto}</span>
                {!esFinal && (
                    <span className="spinner-border spinner-border-sm" style={{ color: config.color, width: "0.7rem", height: "0.7rem" }} />
                )}
                {tieneDetalle && (
                    <span style={{ fontSize: "0.65rem", opacity: 0.7 }}>ⓘ</span>
                )}
            </span>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="sm">
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontSize: "1rem" }}>
                        {config.icono} {ESTADO_TITULO[estado] || config.texto}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {estado === "ERROR_TEMPORAL_SRI" && (
                        <p className="small text-muted">
                            Esto es un problema del servidor del SRI en sí, no de tu comprobante.
                            Se puede reintentar sin ningún riesgo.
                        </p>
                    )}
                    {textoError && (
                        <p className="small mb-0" style={{ wordBreak: "break-word" }}>
                            {textoError}
                        </p>
                    )}
                </Modal.Body>
                {puedeReintentar && (
                    <Modal.Footer>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={handleReintentar}
                        >
                            Reintentar
                        </button>
                    </Modal.Footer>
                )}
            </Modal>
        </>
    );
};
