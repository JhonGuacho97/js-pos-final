import React from "react";
import Table from "react-bootstrap/Table";
import { numValidate } from "../../shared/sharedMethod";
import { denominationsTotal } from "../../shared/cashDenominations";
import "./denomination-counter.scss";

/**
 * Tabla de conteo de efectivo (Denominación | Cantidad | Subtotal), usada
 * tanto en la apertura como en el cierre de caja. Controlado desde afuera:
 * el padre guarda `rows` en su propio estado y recibe el total ya calculado
 * a través de onTotalChange, para poder sincronizarlo con el campo de
 * efectivo total que ya existía.
 *
 * Una sola columna a propósito: se probó una grilla de varias columnas
 * para ahorrar espacio, pero resultó más confusa de leer que útil -- se
 * volvió a la lista simple de una columna.
 *
 * rows: [{ value: 20, label: "$20", quantity: "" }, ...]
 */
const DenominationCounter = ({
    rows,
    setRows,
    currencySymbol = "$",
    onTotalChange,
    variant = "table",
    formatMoney,
}) => {
    const total = denominationsTotal(rows);

    React.useEffect(() => {
        if (onTotalChange) onTotalChange(total);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [total]);

    const onQuantityChange = (value, quantity) => {
        if (!/^\d*$/.test(quantity)) return;
        setRows((prev) =>
            prev.map((row) => (row.value === value ? { ...row, quantity } : row))
        );
    };

    const changeQuantity = (row, change) => {
        const nextQuantity = Math.max(0, (Number(row.quantity) || 0) + change);
        onQuantityChange(row.value, String(nextQuantity));
    };

    const money = (amount) =>
        formatMoney
            ? formatMoney(amount)
            : `${currencySymbol}${Number(amount || 0).toFixed(2)}`;

    if (variant === "compact") {
        return (
            <div className="denomination-counter denomination-counter--compact">
                <div className="denomination-counter__grid">
                    {rows.map((row) => {
                        const subtotal = (Number(row.quantity) || 0) * row.value;
                        return (
                            <article
                                key={row.value}
                                className={Number(row.quantity) > 0 ? "has-value" : ""}
                            >
                                <div className="denomination-counter__label">
                                    <span>{row.value >= 1 ? "Billete / moneda" : "Moneda"}</span>
                                    <strong>{row.label}</strong>
                                </div>
                                <div className="denomination-counter__controls">
                                    <button
                                        type="button"
                                        aria-label={`Restar ${row.label}`}
                                        onClick={() => changeQuantity(row, -1)}
                                        disabled={!Number(row.quantity)}
                                    >
                                        <i className="bi bi-dash" />
                                    </button>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        aria-label={`Cantidad de ${row.label}`}
                                        value={row.quantity}
                                        placeholder="0"
                                        onKeyPress={(event) => numValidate(event)}
                                        onChange={(event) =>
                                            onQuantityChange(row.value, event.target.value)
                                        }
                                    />
                                    <button
                                        type="button"
                                        aria-label={`Sumar ${row.label}`}
                                        onClick={() => changeQuantity(row, 1)}
                                    >
                                        <i className="bi bi-plus" />
                                    </button>
                                </div>
                                <div className="denomination-counter__subtotal">
                                    <small>Subtotal</small>
                                    <strong>{money(subtotal)}</strong>
                                </div>
                            </article>
                        );
                    })}
                </div>
                <div className="denomination-counter__total">
                    <span>
                        <i className="bi bi-calculator" />
                        <span>
                            <small>TOTAL CONTADO</small>
                            <strong>Efectivo físico en caja</strong>
                        </span>
                    </span>
                    <b>{money(total)}</b>
                </div>
            </div>
        );
    }

    return (
        <Table responsive bordered className="mb-0 text-nowrap">
            <thead>
                <tr>
                    <th>Denominación</th>
                    <th style={{ width: 140 }}>Cantidad</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((row) => (
                    <tr key={row.value}>
                        <td className="align-middle">{row.label}</td>
                        <td>
                            <input
                                type="text"
                                className="form-control"
                                value={row.quantity}
                                placeholder="0"
                                onKeyPress={(e) => numValidate(e)}
                                onChange={(e) => onQuantityChange(row.value, e.target.value)}
                            />
                        </td>
                        <td className="align-middle">
                            {currencySymbol}
                            {((Number(row.quantity) || 0) * row.value).toFixed(2)}
                        </td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <th colSpan={2} className="text-end">
                        Total
                    </th>
                    <th>
                        {currencySymbol}
                        {total.toFixed(2)}
                    </th>
                </tr>
            </tfoot>
        </Table>
    );
};

export default DenominationCounter;
