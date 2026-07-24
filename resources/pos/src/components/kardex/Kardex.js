import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import MasterLayout from "../MasterLayout";
import TabTitle from "../../shared/tab-title/TabTitle";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import ReactSelect from "../../shared/select/reactSelect";
import { fetchAllWarehouses } from "../../store/action/warehouseAction";
import { fetchAllProducts } from "../../store/action/productAction";
import { fetchKardex, clearKardex } from "../../store/action/kardexAction";
import { currencySymbolHandling } from "../../shared/sharedMethod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

const movementOptions = [
    { value: "all", label: "TODOS" },
    { value: "entrada", label: "ENTRADAS" },
    { value: "salida", label: "SALIDAS" },
];

/**
 * Kardex: historial de movimientos de un producto en una bodega, con
 * existencias corrientes. Se arma al momento (no hay tabla propia) leyendo
 * Compras/Ventas/Transferencias ya existentes -- ver KardexAPIController.
 */
const Kardex = (props) => {
    const {
        fetchAllWarehouses,
        fetchAllProducts,
        fetchKardex,
        clearKardex,
        warehouses,
        products,
        kardex,
        isLoading,
        allConfigData,
        frontSetting,
    } = props;

    const today = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Guayaquil",
    }).format(new Date());
    const firstOfMonth = today.slice(0, 8) + "01";

    const [startDate, setStartDate] = useState(firstOfMonth);
    const [endDate, setEndDate] = useState(today);
    const [warehouseValue, setWarehouseValue] = useState(null);
    const [productValue, setProductValue] = useState(null);
    const [movementValue, setMovementValue] = useState(movementOptions[0]);
    const [search, setSearch] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);

    const currencySymbol = frontSetting?.value?.currency_symbol;

    useEffect(() => {
        fetchAllWarehouses();
        fetchAllProducts();
        return () => clearKardex();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onBuscar = () => {
        if (!warehouseValue || !productValue) {
            return;
        }
        setPage(1);
        fetchKardex({
            warehouse_id: warehouseValue.value,
            product_id: productValue.value,
            start_date: startDate,
            end_date: endDate,
            movement_type: movementValue.value,
        });
    };

    const filteredRows = (kardex.rows || []).filter(
        (row) =>
            !search ||
            row.detail?.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
    const pagedRows = filteredRows.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const money = (value) =>
        value === null || value === undefined
            ? "—"
            : currencySymbolHandling(allConfigData, currencySymbol, Number(value).toFixed(2));

    const exportToCsv = () => {
        const header = [
            "Fecha", "Detalle",
            "Entrada Cantidad", "Entrada Costo", "Entrada Total",
            "Salida Cantidad", "Salida Costo", "Salida Total",
            "Existencia Cantidad", "Existencia Costo", "Existencia Total",
        ];
        const lines = filteredRows.map((r) => [
            r.date, r.detail,
            r.entrada_quantity ?? "", r.entrada_cost ?? "", r.entrada_total ?? "",
            r.salida_quantity ?? "", r.salida_cost ?? "", r.salida_total ?? "",
            r.balance_quantity, r.balance_cost, r.balance_total,
        ]);
        const csv = [header, ...lines].map((row) => row.join(",")).join("\n");
        const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `kardex-${productValue?.label || "producto"}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title="Kardex" />

            <div className="card p-4 mb-4">
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Fecha de inicio:</label>
                        <input
                            type="date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Fecha de fin:</label>
                        <input
                            type="date"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <ReactSelect
                            title="Bodega"
                            placeholder="Elegir bodega"
                            data={warehouses}
                            value={warehouseValue}
                            onChange={(obj) => setWarehouseValue(obj)}
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <ReactSelect
                            title="Movimiento"
                            data={movementOptions}
                            value={movementValue}
                            onChange={(obj) => setMovementValue(obj)}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <ReactSelect
                            title="Seleccionar Producto"
                            placeholder="Nombre del Producto"
                            data={products}
                            value={productValue}
                            onChange={(obj) => setProductValue(obj)}
                        />
                    </div>
                    <div className="col-md-2 mb-3 d-flex align-items-end">
                        <button
                            className="btn btn-primary w-100"
                            onClick={onBuscar}
                            disabled={!warehouseValue || !productValue}
                        >
                            <FontAwesomeIcon icon={faSearch} className="me-2" />
                            Buscar
                        </button>
                    </div>
                </div>
            </div>

            <div className="card p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                    <div className="input-group" style={{ maxWidth: 320 }}>
                        <span className="input-group-text bg-white border-end-0">
                            <FontAwesomeIcon icon={faSearch} className="text-muted" />
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Búsqueda inteligente"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                        {search && (
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => setSearch("")}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        )}
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold">Mostrar:</span>
                        <select
                            className="form-select"
                            style={{ width: 80 }}
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setPage(1);
                            }}
                        >
                            {[5, 10, 25, 50].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                        <button
                            className="btn btn-light-success"
                            title="Descargar Excel/CSV"
                            onClick={exportToCsv}
                            disabled={!filteredRows.length}
                        >
                            <FontAwesomeIcon icon={faFileExcel} />
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-bordered mb-0">
                        <thead>
                            <tr className="text-white text-center" style={{ backgroundColor: "#2563eb" }}>
                                <th colSpan={2}>DESCRIPCIÓN</th>
                                <th colSpan={3}>ENTRADAS</th>
                                <th colSpan={3}>SALIDAS</th>
                                <th colSpan={3}>EXISTENCIAS</th>
                            </tr>
                            <tr className="text-center" style={{ backgroundColor: "#eff6ff" }}>
                                <th>Fecha</th>
                                <th>Detalle</th>
                                <th>Cantidad</th>
                                <th>Costo</th>
                                <th>Total</th>
                                <th>Cantidad</th>
                                <th>Costo</th>
                                <th>Total</th>
                                <th>Cantidad</th>
                                <th>Costo</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!warehouseValue || !productValue ? (
                                <tr>
                                    <td colSpan={11} className="text-center py-6 text-muted">
                                        Elige bodega y producto, y dale a "Buscar".
                                    </td>
                                </tr>
                            ) : isLoading ? (
                                <tr>
                                    <td colSpan={11} className="text-center py-6 text-muted">
                                        Cargando...
                                    </td>
                                </tr>
                            ) : !pagedRows.length ? (
                                <tr>
                                    <td colSpan={11} className="text-center py-6 text-muted">
                                        No hay movimientos en ese rango de fechas.
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    <tr className="fw-bold" style={{ backgroundColor: "#f9fafb" }}>
                                        <td colSpan={8} className="text-end">
                                            Saldo inicial ({startDate}):
                                        </td>
                                        <td className="text-center">{kardex.opening_balance}</td>
                                        <td className="text-center">{money(kardex.opening_cost)}</td>
                                        <td className="text-center">
                                            {money(
                                                (kardex.opening_balance || 0) * (kardex.opening_cost || 0)
                                            )}
                                        </td>
                                    </tr>
                                    {pagedRows.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.date}</td>
                                            <td>{row.detail}</td>
                                            <td className="text-center">{row.entrada_quantity ?? "—"}</td>
                                            <td className="text-center">
                                                {row.entrada_cost !== null ? money(row.entrada_cost) : "—"}
                                            </td>
                                            <td className="text-center">
                                                {row.entrada_total !== null ? money(row.entrada_total) : "—"}
                                            </td>
                                            <td className="text-center">{row.salida_quantity ?? "—"}</td>
                                            <td className="text-center">
                                                {row.salida_cost !== null ? money(row.salida_cost) : "—"}
                                            </td>
                                            <td className="text-center">
                                                {row.salida_total !== null ? money(row.salida_total) : "—"}
                                            </td>
                                            <td className="text-center fw-bold">{row.balance_quantity}</td>
                                            <td className="text-center">{money(row.balance_cost)}</td>
                                            <td className="text-center fw-bold">{money(row.balance_total)}</td>
                                        </tr>
                                    ))}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                        <button
                            className="btn btn-light me-2"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            ‹ Anterior
                        </button>
                        <button
                            className="btn btn-light"
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Siguiente ›
                        </button>
                    </div>
                    <span className="text-primary fw-bold">
                        Total registros: {filteredRows.length}
                    </span>
                </div>
            </div>
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { warehouses, products, kardex, isLoading, allConfigData, frontSetting } = state;
    return { warehouses, products, kardex, isLoading, allConfigData, frontSetting };
};

export default connect(mapStateToProps, {
    fetchAllWarehouses,
    fetchAllProducts,
    fetchKardex,
    clearKardex,
})(Kardex);
