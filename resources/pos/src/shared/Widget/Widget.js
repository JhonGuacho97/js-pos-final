import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { currencySymbolHandling } from "../sharedMethod";

const THEME_MAP = {
    // Ventas -> azul (métrica principal de ingresos)
    "widget-gradient-blue": { bg: "#EFF6FF", border: "#BFDBFE", label: "#1D4ED8", value: "#1E3A8A", icon: "#2F6FED" },
    // Compras -> gris (costo, neutral)
    "widget-gradient-purple": { bg: "#F8FAFC", border: "#E2E8F0", label: "#475569", value: "#1E293B", icon: "#64748B" },
    // Devoluciones de ventas -> ámbar (mismo tono que "pendiente" en los badges)
    "widget-gradient-orange": { bg: "#FFFBEB", border: "#FDE68A", label: "#92400E", value: "#78350F", icon: "#D97706" },
    // Compras devoluciones -> ámbar
    "widget-gradient-lightblue": { bg: "#FFFBEB", border: "#FDE68A", label: "#92400E", value: "#78350F", icon: "#D97706" },
    // Ventas totales hoy -> azul (misma familia que Ventas)
    "widget-gradient-yellow": { bg: "#EFF6FF", border: "#BFDBFE", label: "#1D4ED8", value: "#1E3A8A", icon: "#2F6FED" },
    // Total recibido hoy -> verde (mismo tono que "pagado" en los badges)
    "widget-gradient-green": { bg: "#F0FDF4", border: "#BBF7D0", label: "#166534", value: "#14532D", icon: "#16A34A" },
    // Compras totales hoy -> gris (costo, neutral)
    "widget-gradient-red": { bg: "#F8FAFC", border: "#E2E8F0", label: "#475569", value: "#1E293B", icon: "#64748B" },
    // Gasto total de hoy -> rojo (mismo tono que "rechazado" en los badges)
    "widget-gradient-pink": { bg: "#FEF2F2", border: "#FECACA", label: "#991B1B", value: "#7F1D1D", icon: "#DC2626" },
};

const DEFAULT_THEME = { bg: "#F8FAFC", border: "#E2E8F0", label: "#475569", value: "#1E293B", icon: "#64748B" };

const Widget = (props) => {
    const { title, value, currency, icon, className = "", onClick, allConfigData } = props;

    const themeKey = Object.keys(THEME_MAP).find((k) => className.includes(k));
    const theme = themeKey ? THEME_MAP[themeKey] : DEFAULT_THEME;
    const isCursorPointer = className.includes("cursor-pointer");

    const renderTooltip = (tooltipProps) => (
        <Tooltip id="widget-tooltip" {...tooltipProps}>
            {currency} {value}
        </Tooltip>
    );

    return (
        <div className="col-xxl-3 col-xl-4 col-sm-6" onClick={onClick} style={{ marginBottom: '8px' }}>
            <div
                style={{
                    background: theme.bg,
                    border: `0.5px solid ${theme.border}`,
                    borderRadius: 12,
                    padding: "16px 18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    cursor: isCursorPointer ? "pointer" : "default",
                    transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) => { if (isCursorPointer) e.currentTarget.style.opacity = "0.85"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span
                        style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: theme.label,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            lineHeight: 1.3,
                            maxWidth: "70%",
                        }}
                    >
                        {title}
                    </span>
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            background: theme.icon,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            color: "#fff",
                            fontSize: 15,
                        }}
                    >
                        {icon}
                    </div>
                </div>

                <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                >
                    <p
                        style={{
                            fontSize: 22,
                            fontWeight: 700,
                            color: theme.value,
                            margin: 0,
                            letterSpacing: "-0.01em",
                        }}
                    >
                        {currencySymbolHandling(allConfigData, currency, value, true)}
                    </p>
                </OverlayTrigger>
            </div>
        </div>
    );
};

export default Widget;