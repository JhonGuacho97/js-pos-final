/**
 * Denominaciones de efectivo para el conteo de caja (USD, moneda oficial
 * en Ecuador). Ordenadas de mayor a menor. Si en algún momento se necesita
 * soportar otra moneda, este es el único lugar que habría que cambiar.
 */
export const cashDenominations = [
    { value: 100, label: "$100" },
    { value: 50, label: "$50" },
    { value: 20, label: "$20" },
    { value: 10, label: "$10" },
    { value: 5, label: "$5" },
    { value: 1, label: "$1" },
    { value: 0.5, label: "$0.50" },
    { value: 0.25, label: "$0.25" },
    { value: 0.1, label: "$0.10" },
    { value: 0.05, label: "$0.05" },
];

export const buildEmptyDenominationRows = () =>
    cashDenominations.map((d) => ({ value: d.value, label: d.label, quantity: "" }));

export const denominationsTotal = (rows) =>
    rows.reduce((sum, row) => sum + (Number(row.quantity) || 0) * row.value, 0);
