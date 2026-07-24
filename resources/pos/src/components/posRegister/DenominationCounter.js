import React from "react";
import Table from "react-bootstrap/Table";
import { numValidate } from "../../shared/sharedMethod";
import { denominationsTotal } from "../../shared/cashDenominations";

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
const DenominationCounter = ({ rows, setRows, currencySymbol = "$", onTotalChange }) => {
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
