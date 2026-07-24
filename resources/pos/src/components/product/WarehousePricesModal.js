import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap-v5";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faStore, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import apiConfig from "../../config/apiConfig";
import { apiRequest } from "../../shared/apiHelper";
import { decimalValidate, getFormattedMessage } from "../../shared/sharedMethod";

/**
 * Modal genérico para configurar el precio de un producto (o de una
 * presentación) sucursal por sucursal.
 *
 * No duplica precios: solo guarda EXCEPCIONES. Cada fila tiene un switch:
 * apagado = usa el precio general (fila bloqueada, en gris); encendido =
 * precio personalizado para esa sucursal, con la diferencia vs. el precio
 * general a la vista para detectar de un vistazo si quedó más caro o más
 * barato que el resto.
 */
const WarehousePricesModal = ({ show, onHide, baseUrl, title, currencySymbol = "$" }) => {
    const dispatch = useDispatch();
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const fetchPrices = async () => {
        setIsLoading(true);
        await apiRequest(
            dispatch,
            () => apiConfig.get(`${baseUrl}/warehouse-prices`),
            (response) => {
                const data = response.data.data || [];
                setRows(
                    data.map((row) => ({
                        ...row,
                        enabled: row.price !== null && row.price !== undefined,
                        // Si aún no hay override, arrancamos el input en el
                        // precio general en vez de vacío: es más rápido
                        // ajustar un número que escribirlo desde cero.
                        price: row.price ?? row.general_price,
                    }))
                );
            }
        );
        setIsLoading(false);
    };

    useEffect(() => {
        if (show && baseUrl) {
            fetchPrices();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, baseUrl]);

    const onToggle = (warehouseId, enabled) => {
        setRows((prev) =>
            prev.map((row) =>
                row.warehouse_id === warehouseId ? { ...row, enabled } : row
            )
        );
    };

    const onPriceChange = (warehouseId, value) => {
        setRows((prev) =>
            prev.map((row) =>
                row.warehouse_id === warehouseId ? { ...row, price: value } : row
            )
        );
    };

    const onResetAll = () => {
        setRows((prev) => prev.map((row) => ({ ...row, enabled: false })));
    };

    const onSave = async () => {
        setIsSaving(true);
        const payload = {
            prices: rows.map((row) => ({
                warehouse_id: row.warehouse_id,
                price: row.enabled && row.price !== "" ? row.price : null,
            })),
        };
        const result = await apiRequest(dispatch, () =>
            apiConfig.put(`${baseUrl}/warehouse-prices`, payload)
        );
        setIsSaving(false);
        if (result) {
            onHide();
        }
    };

    const customizedCount = rows.filter((row) => row.enabled).length;

    const renderSkeletonRow = (key) => (
        <div key={key} className="d-flex align-items-center gap-3 mb-3">
            <div
                style={{
                    flex: "1 1 35%",
                    height: 14,
                    borderRadius: 4,
                    background: "#eee",
                }}
            />
            <div style={{ flex: "0 0 60px", height: 24, borderRadius: 20, background: "#eee" }} />
            <div style={{ flex: "1 1 45%", height: 38, borderRadius: 4, background: "#eee" }} />
        </div>
    );

    return (
        <Modal show={show} onHide={onHide} keyboard centered>
            <Modal.Header closeButton>
                <div>
                    <Modal.Title>
                        <FontAwesomeIcon icon={faStore} className="me-2" />
                        {title || "Precio por sucursal"}
                    </Modal.Title>
                    {!isLoading && rows.length > 0 && (
                        <div className="text-muted fs-small mt-1">
                            {customizedCount} de {rows.length} sucursales con precio
                            personalizado
                        </div>
                    )}
                </div>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
                {isLoading ? (
                    <>
                        {[1, 2, 3].map((n) => renderSkeletonRow(n))}
                    </>
                ) : (
                    <>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <p className="text-muted fs-small mb-0">
                                Activa el switch para fijar un precio distinto en esa
                                sucursal. Apagado = usa el precio general.
                            </p>
                            {customizedCount > 0 && (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-light text-muted flex-shrink-0 ms-2"
                                    onClick={onResetAll}
                                    title="Apagar todos los overrides"
                                >
                                    <FontAwesomeIcon icon={faRotateLeft} className="me-1" />
                                    Restablecer todo
                                </button>
                            )}
                        </div>

                        {rows.map((row) => {
                            const diff = row.enabled
                                ? Number(row.price || 0) - Number(row.general_price)
                                : 0;
                            const diffLabel =
                                diff === 0
                                    ? null
                                    : `${diff > 0 ? "+" : ""}${currencySymbol}${diff.toFixed(2)} vs. general`;

                            return (
                                <div
                                    key={row.warehouse_id}
                                    className="d-flex align-items-center gap-3 mb-3 p-2 rounded"
                                    style={{
                                        background: row.enabled ? "#f5f6ff" : "transparent",
                                        border: row.enabled
                                            ? "1px solid #e0e3ff"
                                            : "1px solid transparent",
                                    }}
                                >
                                    <div style={{ flex: "1 1 35%" }}>
                                        <div style={{ fontWeight: 500 }}>
                                            {row.warehouse_name}
                                        </div>
                                        <div className="text-muted fs-small">
                                            General: {currencySymbol}
                                            {Number(row.general_price).toFixed(2)}
                                        </div>
                                    </div>

                                    <div
                                        className="form-check form-switch flex-shrink-0"
                                        style={{ flex: "0 0 55px" }}
                                    >
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            role="switch"
                                            checked={row.enabled}
                                            onChange={(e) =>
                                                onToggle(row.warehouse_id, e.target.checked)
                                            }
                                        />
                                    </div>

                                    <div style={{ flex: "1 1 45%" }}>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                {currencySymbol}
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                disabled={!row.enabled}
                                                value={row.price}
                                                onKeyPress={(e) => decimalValidate(e)}
                                                onChange={(e) =>
                                                    onPriceChange(row.warehouse_id, e.target.value)
                                                }
                                            />
                                        </div>
                                        {diffLabel && (
                                            <div
                                                className={`fs-small mt-1 ${
                                                    diff > 0 ? "text-danger" : "text-success"
                                                }`}
                                            >
                                                {diffLabel}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="light" onClick={onHide}>
                    {getFormattedMessage("globally.cancel-btn")}
                </Button>
                <Button variant="primary" onClick={onSave} disabled={isLoading || isSaving}>
                    <FontAwesomeIcon icon={faSave} className="me-1" />
                    {isSaving ? "Guardando..." : getFormattedMessage("globally.save-btn")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WarehousePricesModal;
