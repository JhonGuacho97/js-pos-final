import React from "react";
import { useSelector } from "react-redux";
import { currencySymbolHandling, getFormattedMessage } from "../../sharedMethod";

/**
 * Total de TODOS los registros que calzan con el filtro actual (no solo
 * la página visible) -- viene del backend ya sumado, no se recalcula
 * sumando filas en el navegador.
 *
 * Columnas repartidas a ancho completo (en vez de agrupadas con poco
 * espacio entre ellas), para que se lea como una fila de resumen y no
 * como un bloque apretado.
 */
const SalesTotalsBar = () => {
    const { saleTotals, frontSetting, allConfigData, totalRecord } = useSelector(
        (state) => state
    );
    const currencySymbol =
        frontSetting && frontSetting.value && frontSetting.value.currency_symbol;

    const stats = [
        {
            key: "count",
            label: getFormattedMessage("globally.total-record.label"),
            value: totalRecord ?? 0,
            color: "#111827",
            isCurrency: false,
        },
        {
            key: "grand_total",
            label: getFormattedMessage("purchase.grant-total.label"),
            value: saleTotals?.grand_total || 0,
            color: "#6366f1",
        },
        {
            key: "paid_amount",
            label: getFormattedMessage("dashboard.recentSales.paid.label"),
            value: saleTotals?.paid_amount || 0,
            color: "#059669",
        },
        {
            key: "cash_amount",
            label: getFormattedMessage("cash.label"),
            value: saleTotals?.cash_amount || 0,
            color: "#16a34a",
        },
        {
            key: "transfer_amount",
            label: getFormattedMessage("payment-type.filter.bank-transfer.label"),
            value: saleTotals?.transfer_amount || 0,
            color: "#0284c7",
        },
    ];

    return (
        <div
            className="d-flex flex-wrap rounded mb-3"
            style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}
        >
            {stats.map((stat) => (
                <div
                    key={stat.key}
                    className="flex-fill"
                    style={{ padding: "18px 24px", minWidth: 140 }}
                >
                    <div
                        className="text-muted text-uppercase"
                        style={{ fontSize: 11, letterSpacing: 0.5, fontWeight: 600 }}
                    >
                        {stat.label}
                    </div>
                    <div
                        className="mt-1"
                        style={{ fontSize: 18, fontWeight: 700, color: stat.color }}
                    >
                        {stat.isCurrency === false
                            ? stat.value
                            : currencySymbolHandling(allConfigData, currencySymbol, stat.value)}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SalesTotalsBar;
