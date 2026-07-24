import React from "react";

const ESTADO_CONFIG = {
    PENDIENTE: { color: "#f0ad4e", texto: "Generando...", icono: "⏳" },
    RECIBIDA: { color: "#5bc0de", texto: "Esperando autorización...", icono: "📤" },
    AUTORIZADA: { color: "#28a745", texto: "AUTORIZADA", icono: "✅" },
    NO_AUTORIZADA: { color: "#dc3545", texto: "Rechazada por el SRI", icono: "❌" },
    DEVUELTA: { color: "#dc3545", texto: "Devuelto por el SRI", icono: "⚠️" },
};


export const ElectronicInvoiceStatusBadge = ({ estado, data, error, onReintentar }) => {
    if (error) {
        return (
            <div className="alert alert-danger d-flex align-items-center mt-2 mb-0 py-2">
                <span>⚠️ {error}</span>
            </div>
        );
    }

    if (!estado) return null;

    const config = ESTADO_CONFIG[estado] || ESTADO_CONFIG.PENDIENTE;
    const esFinal = estado === "AUTORIZADA" || estado === "NO_AUTORIZADA" || estado === "DEVUELTA";
    const puedeReintentar =
        (estado === "NO_AUTORIZADA" || estado === "DEVUELTA") && data?.puede_reintentar;
    const primerMensaje = data?.mensajes?.[0];
    const textoError = primerMensaje
        ? [primerMensaje.mensaje, primerMensaje.informacionAdicional].filter(Boolean).join(": ")
        : "";

    return (
        <div
            className="d-flex flex-column py-2 px-3"
            style={{
                backgroundColor: `${config.color}15`,
                border: `1px solid ${config.color}40`,
                borderRadius: "0.6rem",
                gap: "0.35rem",
                maxWidth: "220px",
            }}
        >
            <div className="d-flex align-items-center gap-2">
                <span>{config.icono}</span>
                <span style={{ color: config.color, fontWeight: 500, fontSize: "0.75rem" }}>
                    {config.texto}
                </span>
                {!esFinal && (
                    <span className="spinner-border spinner-border-sm" style={{ color: config.color }} />
                )}
            </div>

            {textoError && esFinal && estado !== "AUTORIZADA" && (
                <div
                    className="small text-muted text-truncate"
                    style={{ fontSize: "0.7rem", maxWidth: "100%" }}
                    title={textoError}
                >
                    {textoError}
                </div>
            )}

            {puedeReintentar && (
                <button
                    type="button"
                    className="btn btn-sm btn-outline-danger align-self-start"
                    style={{ fontSize: "0.7rem", padding: "0.15rem 0.6rem" }}
                    onClick={onReintentar}
                >
                    Reintentar
                </button>
            )}
        </div>
    );
};