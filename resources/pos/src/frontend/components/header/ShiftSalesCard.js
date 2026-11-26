import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import apiConfig from "../../../config/apiConfig";
import { apiBaseURL } from "../../../constants";
import { currencySymbolHandling } from "../../../shared/sharedMethod";

/**
 * Cabecera del panel de pedido con las "Ventas del turno".
 *
 * Muestra lo vendido por el cajero desde que abrió su caja en el almacén
 * seleccionado. Se vuelve a consultar al cambiar de almacén, al recuperar
 * la conexión, cuando cambia la cola de ventas offline y tras cada cobro
 * (refreshKey). Al tocarla se abre el modal de Detalles del registro.
 * Sin caja abierta vuelve a la cabecera simple "Pedido actual".
 */
const ShiftSalesCard = ({
    warehouseId,
    online,
    pendingSales = 0,
    refreshKey = 0,
    itemCount = 0,
    onOpenDetails,
    allConfigData,
    currencySymbol,
}) => {
    const [summary, setSummary] = useState(null);
    const requestIdRef = useRef(0);

    useEffect(() => {
        if (!online) return undefined;

        const requestId = ++requestIdRef.current;
        const timer = setTimeout(() => {
            apiConfig
                .get(apiBaseURL.POS_SHIFT_SALES_SUMMARY, {
                    params: warehouseId ? { warehouse_id: warehouseId } : {},
                })
                .then((response) => {
                    if (requestId === requestIdRef.current) {
                        setSummary(response.data?.data || null);
                    }
                })
                // Es un indicador informativo: si falla, se conserva el
                // último valor en lugar de interrumpir al cajero con un error.
                .catch(() => null);
        }, 250);

        return () => clearTimeout(timer);
    }, [warehouseId, online, pendingSales, refreshKey]);

    const itemLabel = `${itemCount} ${itemCount === 1 ? "producto" : "productos"}`;

    if (summary && !summary.register_open) {
        return (
            <div className="pos-order-heading my-3">
                <div>
                    <span className="pos-eyebrow">Nueva venta</span>
                    <h2>Pedido actual</h2>
                </div>
                <span className="pos-item-count">{itemLabel}</span>
            </div>
        );
    }

    const loaded = Boolean(summary);
    const count = Number(summary?.sales_count || 0);
    const amount = currencySymbolHandling(
        allConfigData,
        currencySymbol,
        Number(summary?.sales_amount || 0)
    );
    const openedAt = summary?.register_opened_at
        ? dayjs(summary.register_opened_at)
        : null;
    const openedLabel = openedAt
        ? `desde ${openedAt.isSame(dayjs(), "day") ? openedAt.format("h:mm A") : openedAt.format("DD/MM h:mm A")}`
        : "";
    const pending = Number(pendingSales || 0);
    const countLabel = `${count} ${count === 1 ? "venta" : "ventas"}`;
    const pendingLabel = pending > 0
        ? `, más ${pending} ${pending === 1 ? "venta pendiente" : "ventas pendientes"} de sincronizar`
        : "";

    return (
        <button
            type="button"
            className="pos-order-heading pos-shift-card my-3"
            onClick={onOpenDetails}
            title="Ver detalles del registro"
            aria-label={loaded
                ? `Ventas del turno: ${amount}, ${countLabel}${pendingLabel}. Ver detalles del registro`
                : "Ventas del turno. Ver detalles del registro"}
        >
            <span className="pos-shift-card__icon" aria-hidden="true">
                <i className="bi bi-graph-up-arrow" />
            </span>
            <span className="pos-shift-card__body">
                <span className="pos-shift-card__eyebrow">Ventas del turno</span>
                <strong className={`pos-shift-card__amount ${loaded ? "" : "is-loading"}`}>
                    {loaded ? amount : "—"}
                </strong>
                <span className="pos-shift-card__meta">
                    {loaded && <span>{countLabel}</span>}
                    {loaded && openedLabel && <span>{openedLabel}</span>}
                    {pending > 0 && (
                        <span
                            className="pos-shift-card__pending"
                            title="Ventas guardadas en este dispositivo, aún sin sincronizar"
                        >
                            +{pending} pendiente{pending === 1 ? "" : "s"}
                        </span>
                    )}
                    {!online && <span className="pos-shift-card__offline">Sin conexión</span>}
                </span>
            </span>
            <span className="pos-shift-card__side">
                <span className="pos-item-count">{itemLabel}</span>
                <span className="pos-shift-card__link">
                    Ver detalle <i className="bi bi-chevron-right" aria-hidden="true" />
                </span>
            </span>
        </button>
    );
};

export default ShiftSalesCard;
