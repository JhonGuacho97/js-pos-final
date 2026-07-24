import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { currencySymbolHandling } from "../sharedMethod";

/**
 * Tarjeta de estadística para Pérdidas y Ganancias.
 *
 * size="lg"  -> las 3 tarjetas de RESULTADO (Ingresos, Ganancia bruta,
 *               Pagos recibidos): más grandes, con el desglose de cómo
 *               se calculó cada una.
 * size="sm"  -> las tarjetas de DETALLE del período (Ventas, Compras,
 *               Devoluciones, Gastos): compactas, solo el número.
 *
 * accent: color hex para el ícono y el acento visual de la tarjeta --
 * reemplaza los 8 bloques de color sólido que tenía antes por un tinte
 * suave, consistente con el resto del panel.
 */
const ProfitLossWidget = ({
    title,
    value,
    currency,
    icon,
    accent = "#2F6FED",
    breakdown,
    allConfigData,
    size = "sm",
}) => {
    const isLarge = size === "lg";

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {currency} {value}
        </Tooltip>
    );

    return (
        <div
            className="h-100 p-4 rounded"
            style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
            }}
        >
            <div className="d-flex align-items-center gap-2 mb-3">
                <div
                    className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                    style={{
                        width: isLarge ? 36 : 30,
                        height: isLarge ? 36 : 30,
                        background: `${accent}1a`,
                        color: accent,
                    }}
                >
                    {icon}
                </div>
                <span
                    className="text-muted text-uppercase"
                    style={{ fontSize: 11, letterSpacing: 0.4, fontWeight: 600 }}
                >
                    {title}
                </span>
            </div>

            <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
            >
                <div
                    style={{
                        fontSize: isLarge ? 28 : 20,
                        fontWeight: 700,
                        color: "#111827",
                        lineHeight: 1.2,
                    }}
                >
                    {currencySymbolHandling(allConfigData, currency, value, true)}
                </div>
            </OverlayTrigger>

            {breakdown && breakdown.length > 0 && (
                <div
                    className="mt-2 pt-2 d-flex flex-wrap"
                    style={{ borderTop: "1px solid #f1f1f4", gap: "4px 10px" }}
                >
                    {breakdown.map((item) => (
                        <span key={item.key} className="text-muted" style={{ fontSize: 12 }}>
                            {item.operator && (
                                <span className="me-1" style={{ fontWeight: 600 }}>
                                    {item.operator}
                                </span>
                            )}
                            {currencySymbolHandling(allConfigData, currency, item.value)}{" "}
                            {item.label}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};
export default ProfitLossWidget;
