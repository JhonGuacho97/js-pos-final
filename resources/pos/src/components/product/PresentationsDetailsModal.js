import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap-v5";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTrash,
    faPlus,
    faSave,
    faStar,
    faBoxOpen,
    faStore,
} from "@fortawesome/free-solid-svg-icons";
import apiConfig from "../../config/apiConfig";
import { apiBaseURL, toastType } from "../../constants";
import { apiRequest } from "../../shared/apiHelper";
import { addToast } from "../../store/action/toastAction";
import {
    decimalValidate,
    getFormattedMessage,
} from "../../shared/sharedMethod";
import ReactSelect from "../../shared/select/reactSelect";
import WarehousePricesModal from "./WarehousePricesModal";

/**
 * Se abre desde ProductDetail para un producto de tipo "Producto único".
 * Trabaja directo contra /api/product-presentations (independiente del
 * formulario general de edición de producto).
 *
 * Diseño en filas tipo tarjeta (flexbox) en vez de <table>: con 6+ columnas
 * una tabla se desborda en modales angostos y las acciones terminan
 * "flotando" fuera de la celda. Con filas flex, cada fila envuelve su
 * contenido y nunca se sale del modal.
 */
const PresentationsDetailsModal = ({
    show,
    setShow,
    productId,
    frontSetting,
}) => {
    const dispatch = useDispatch();
    const [presentations, setPresentations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newRow, setNewRow] = useState(null);
    const [presentationFamilies, setPresentationFamilies] = useState([]);
    const [selectedFamilyId, setSelectedFamilyId] = useState(null);
    const [warehousePricePresentationId, setWarehousePricePresentationId] = useState(null);
    const [showWarehousePriceModal, setShowWarehousePriceModal] = useState(false);
    const currencySymbol =
        (frontSetting && frontSetting.value && frontSetting.value.currency_symbol) || "$";

    const fetchPresentations = async () => {
        setIsLoading(true);
        await apiRequest(
            dispatch,
            () =>
                apiConfig.get(apiBaseURL.PRODUCT_PRESENTATIONS, {
                    params: { product_id: productId },
                }),
            (response) => {
                const rows = response.data.data || [];
                setPresentations(rows);
                const currentFamilyId = rows.find((row) => row.presentation_family_id)?.presentation_family_id;
                if (currentFamilyId) setSelectedFamilyId(currentFamilyId);
            }
        );
        setIsLoading(false);
    };

    useEffect(() => {
        if (show && productId) {
            fetchPresentations();
            apiConfig.get(apiBaseURL.PRESENTATION_CATALOG).then(({ data }) => {
                const families = data?.data || [];
                setPresentationFamilies(families);
                setSelectedFamilyId((current) => current || families.find((family) => family.slug === "general")?.id || families[0]?.id || null);
            });
        } else {
            setNewRow(null);
        }
    }, [show, productId]);

    const clearField = () => {
        setNewRow(null);
        setShow(false);
    };

    const startNewRow = () => {
        setNewRow({
            variation_type_id: null,
            presentation_type_id: null,
            equivalence: presentations.length === 0 ? 1 : "",
            price: "",
            is_base_unit: presentations.length === 0,
            is_default: presentations.length === 0,
        });
    };

    const saveNewRow = async () => {
        if (!newRow.presentation_type_id || !newRow.equivalence || newRow.price === "") {
            dispatch(
                addToast({
                    text: "Completá todos los campos antes de guardar",
                    type: toastType.ERROR,
                })
            );
            return;
        }
        await apiRequest(dispatch, () =>
            apiConfig.post(apiBaseURL.PRODUCT_PRESENTATIONS, {
                product_id: productId,
                ...newRow,
            })
        );
        setNewRow(null);
        fetchPresentations();
    };

    const familyOptions = presentationFamilies.map((family) => ({
        value: family.id,
        label: family.name,
    }));
    const selectedFamily = presentationFamilies.find((family) => family.id === selectedFamilyId);
    const presentationTypeOptions = (selectedFamily?.types || []).map((type) => ({
        value: type.id,
        label: type.name,
        default_equivalence: type.default_equivalence,
    }));

    const updateRow = async (row) => {
        await apiRequest(dispatch, () =>
            apiConfig.put(`${apiBaseURL.PRODUCT_PRESENTATIONS}/${row.id}`, row)
        );
        fetchPresentations();
    };

    const deleteRow = async (id) => {
        await apiRequest(dispatch, () =>
            apiConfig.delete(`${apiBaseURL.PRODUCT_PRESENTATIONS}/${id}`)
        );
        fetchPresentations();
    };

    const onFieldChange = (id, field, value) => {
        setPresentations((prev) =>
            prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
        );
    };

    const rowStyle = {
        padding: "14px 16px",
        borderRadius: 10,
        border: "1px solid #e5e7eb",
        marginBottom: 10,
        backgroundColor: "#fafafa",
    };

    const cardHeaderStyle = {
        fontWeight: 700,
        fontSize: 14,
        marginBottom: 10,
        paddingBottom: 8,
        borderBottom: "1px solid #e5e7eb",
    };

    const fieldsRowStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
        gap: 14,
    };

    const actionsRowStyle = {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 8,
        marginTop: 14,
        paddingTop: 10,
        borderTop: "1px solid #e5e7eb",
    };

    const fieldGroupStyle = { display: "flex", flexDirection: "column" };
    const fieldLabelStyle = { fontSize: 11, color: "#6b7280", marginBottom: 4 };

    const toggleBtnStyle = (active, color) => ({
        border: `1px solid ${active ? color : "#d1d5db"}`,
        backgroundColor: active ? color : "#fff",
        color: active ? "#fff" : "#6b7280",
        borderRadius: 8,
        padding: "6px 10px",
        fontSize: 12,
        display: "flex",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        whiteSpace: "nowrap",
    });

    return (
        <Modal show={show} onHide={clearField} size="lg" keyboard centered>
            <Modal.Header closeButton>
                <Modal.Title>Presentaciones de venta</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: "65vh", overflowY: "auto" }}>
                {isLoading ? (
                    <div className="text-center py-3">...</div>
                ) : (
                    <>
                        {presentations.length === 0 && !newRow && (
                            <div className="text-center text-muted py-3">
                                Todavía no hay presentaciones configuradas para este producto.
                            </div>
                        )}

                        {presentations.map((row) => (
                            <div style={rowStyle} key={row.id}>
                                <div style={cardHeaderStyle}>{row.name}</div>

                                <div style={fieldsRowStyle}>
                                    <div style={fieldGroupStyle}>
                                        <span style={fieldLabelStyle}>Equivale a</span>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={row.equivalence}
                                            disabled={row.is_base_unit}
                                            onKeyPress={(e) => decimalValidate(e)}
                                            onChange={(e) =>
                                                onFieldChange(row.id, "equivalence", e.target.value)
                                            }
                                        />
                                    </div>

                                    <div style={fieldGroupStyle}>
                                        <span style={fieldLabelStyle}>Precio</span>
                                        <div className="input-group input-group-sm">
                                            <span className="input-group-text">{currencySymbol}</span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={row.price}
                                                onKeyPress={(e) => decimalValidate(e)}
                                                onChange={(e) =>
                                                    onFieldChange(row.id, "price", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div style={fieldGroupStyle}>
                                        <span style={fieldLabelStyle}>
                                            Costo{" "}
                                            <span
                                                className="text-muted"
                                                style={{ fontWeight: 400 }}
                                                title="Si lo dejas vacío, se calcula solo como costo del producto × equivalencia"
                                            >
                                                (opcional)
                                            </span>
                                        </span>
                                        <div className="input-group input-group-sm">
                                            <span className="input-group-text">{currencySymbol}</span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={
                                                    row.effective_cost !== undefined
                                                        ? Number(row.effective_cost).toFixed(2)
                                                        : "0.00"
                                                }
                                                value={row.cost ?? ""}
                                                onKeyPress={(e) => decimalValidate(e)}
                                                onChange={(e) =>
                                                    onFieldChange(row.id, "cost", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div style={fieldGroupStyle}>
                                        <span style={fieldLabelStyle}>Margen</span>
                                        <div
                                            className="rounded d-flex align-items-center justify-content-center"
                                            style={{
                                                height: 31,
                                                fontWeight: 700,
                                                fontSize: 13,
                                                background:
                                                    row.margin > 0
                                                        ? "#ecfdf5"
                                                        : row.margin < 0
                                                            ? "#fef2f2"
                                                            : "#f3f4f6",
                                                color:
                                                    row.margin > 0
                                                        ? "#059669"
                                                        : row.margin < 0
                                                            ? "#dc2626"
                                                            : "#6b7280",
                                            }}
                                        >
                                            {row.margin !== undefined
                                                ? `${currencySymbol}${Number(row.margin).toFixed(2)}`
                                                : "—"}
                                        </div>
                                    </div>
                                </div>

                                <div style={actionsRowStyle}>
                                    <button
                                        type="button"
                                        style={toggleBtnStyle(row.is_base_unit, "#2563eb")}
                                        onClick={() =>
                                            setPresentations((prev) =>
                                                prev.map((r) => ({
                                                    ...r,
                                                    is_base_unit: r.id === row.id,
                                                    equivalence: r.id === row.id ? 1 : r.equivalence,
                                                }))
                                            )
                                        }
                                    >
                                        <FontAwesomeIcon icon={faBoxOpen} />
                                        Unidad base
                                    </button>

                                    <button
                                        type="button"
                                        style={toggleBtnStyle(row.is_default, "#f59e0b")}
                                        onClick={() =>
                                            setPresentations((prev) =>
                                                prev.map((r) => ({
                                                    ...r,
                                                    is_default: r.id === row.id,
                                                }))
                                            )
                                        }
                                    >
                                        <FontAwesomeIcon icon={faStar} />
                                        Por defecto
                                    </button>

                                    <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                                        <Button
                                            size="sm"
                                            variant="light"
                                            className="text-warning"
                                            onClick={() => {
                                                setWarehousePricePresentationId(row.id);
                                                setShowWarehousePriceModal(true);
                                            }}
                                            title="Precio por sucursal"
                                        >
                                            <FontAwesomeIcon icon={faStore} />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="light"
                                            className="text-success"
                                            onClick={() => updateRow(row)}
                                            title={getFormattedMessage("globally.save-btn")}
                                        >
                                            <FontAwesomeIcon icon={faSave} />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="light"
                                            className="text-danger"
                                            onClick={() => deleteRow(row.id)}
                                            title={getFormattedMessage("globally.delete.tooltip.label")}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {newRow && (
                            <div style={{ ...rowStyle, backgroundColor: "#eff6ff", border: "1px dashed #93c5fd" }}>
                                <div style={{ maxWidth: 240, marginBottom: 12 }}>
                                    <ReactSelect
                                        title="Familia de presentaciones"
                                        data={familyOptions}
                                        value={familyOptions.find((option) => option.value === selectedFamilyId) || ""}
                                        placeholder="Familia de presentaciones"
                                        onChange={(obj) => {
                                            setSelectedFamilyId(obj.value);
                                            setNewRow((row) => ({ ...row, presentation_type_id: null }));
                                        }}
                                    />
                                </div>
                                <div style={{ maxWidth: 240, marginBottom: 12 }}>
                                    <ReactSelect
                                        title="Nombre de la presentación"
                                        data={presentationTypeOptions}
                                        placeholder="Nombre de la presentación"
                                        onChange={(obj) => {
                                            const selectedType = presentationTypeOptions.find(
                                                (option) => option.value === obj.value
                                            );
                                            setNewRow((row) => ({
                                                ...row,
                                                presentation_type_id: obj.value,
                                                equivalence: row.is_base_unit
                                                    ? 1
                                                    : (selectedType?.default_equivalence ?? ""),
                                            }));
                                        }}
                                    />
                                </div>

                                <div style={fieldsRowStyle}>
                                    <div style={fieldGroupStyle}>
                                        <span style={fieldLabelStyle}>Equivale a</span>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={newRow.equivalence}
                                            disabled={newRow.is_base_unit}
                                            onKeyPress={(e) => decimalValidate(e)}
                                            onChange={(e) =>
                                                setNewRow((r) => ({ ...r, equivalence: e.target.value }))
                                            }
                                        />
                                    </div>

                                    <div style={fieldGroupStyle}>
                                        <span style={fieldLabelStyle}>Precio</span>
                                        <div className="input-group input-group-sm">
                                            <span className="input-group-text">{currencySymbol}</span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newRow.price}
                                                onKeyPress={(e) => decimalValidate(e)}
                                                onChange={(e) =>
                                                    setNewRow((r) => ({ ...r, price: e.target.value }))
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div style={fieldGroupStyle}>
                                        <span style={fieldLabelStyle}>Costo (opcional)</span>
                                        <div className="input-group input-group-sm">
                                            <span className="input-group-text">{currencySymbol}</span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Auto"
                                                value={newRow.cost ?? ""}
                                                onKeyPress={(e) => decimalValidate(e)}
                                                onChange={(e) =>
                                                    setNewRow((r) => ({ ...r, cost: e.target.value }))
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div style={actionsRowStyle}>
                                    <button
                                        type="button"
                                        style={toggleBtnStyle(newRow.is_base_unit, "#2563eb")}
                                        onClick={() =>
                                            setNewRow((r) => ({ ...r, is_base_unit: true, equivalence: 1 }))
                                        }
                                    >
                                        <FontAwesomeIcon icon={faBoxOpen} />
                                        Unidad base
                                    </button>

                                    <button
                                        type="button"
                                        style={toggleBtnStyle(newRow.is_default, "#f59e0b")}
                                        onClick={() => setNewRow((r) => ({ ...r, is_default: true }))}
                                    >
                                        <FontAwesomeIcon icon={faStar} />
                                        Por defecto
                                    </button>

                                    <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                                        <Button size="sm" variant="success" onClick={saveNewRow}>
                                            <FontAwesomeIcon icon={faSave} className="me-1" />
                                            Guardar
                                        </Button>
                                        <Button size="sm" variant="light" onClick={() => setNewRow(null)}>
                                            {getFormattedMessage("globally.cancel-btn")}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {!newRow && (
                    <Button variant="light" onClick={startNewRow} type="button" className="mt-2">
                        <FontAwesomeIcon icon={faPlus} className="me-1" />
                        Agregar presentación
                    </Button>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="light" onClick={clearField}>
                    {getFormattedMessage("globally.cancel-btn")}
                </Button>
            </Modal.Footer>
            {warehousePricePresentationId &&
                <WarehousePricesModal
                    show={showWarehousePriceModal}
                    onHide={() => setShowWarehousePriceModal(false)}
                    baseUrl={`${apiBaseURL.PRODUCT_PRESENTATIONS}/${warehousePricePresentationId}`}
                    title="Precio de la presentación por sucursal"
                    currencySymbol={currencySymbol}
                />
            }
        </Modal>
    );
};

export default PresentationsDetailsModal;
