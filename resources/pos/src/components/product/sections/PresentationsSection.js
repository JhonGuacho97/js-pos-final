import React from "react";
import { Button } from "react-bootstrap-v5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faBoxOpen, faStar } from "@fortawesome/free-solid-svg-icons";
import ReactSelect from "../../../shared/select/reactSelect";
import {
    decimalValidate,
    getFormattedMessage,
    placeholderText,
} from "../../../shared/sharedMethod";

/**
 * Presentaciones de venta (Unidad / Six Pack / Caja...) para un mismo
 * producto y un mismo inventario base. No reemplaza ni toca el módulo de
 * variantes: 'variation_type_id' aquí solo referencia el nombre reusado
 * del catálogo de variation_types (para no duplicar catálogos de texto),
 * pero cada fila de esta lista es una presentación, no un producto/stock
 * distinto.
 *
 * Se muestra como filas tipo tarjeta (flexbox, con flex-wrap) en vez de
 * <table>: con 6 columnas una tabla clásica se desborda o queda ilegible
 * en mobile. Con flex-wrap cada campo se acomoda solo y en pantallas
 * angostas los inputs bajan de línea en vez de generar scroll horizontal.
 *
 * presentations: [{ variation_type_id, equivalence, price, is_base_unit, is_default }]
 */
const PresentationsSection = ({
    managePresentations,
    onToggleManagePresentations,
    presentations,
    setPresentations,
    variationTypesOptions, // lista plana de variation_types (todas las variaciones, ej: Unidad/Caja/Six Pack)
    frontSetting,
    errors,
}) => {
    const currencySymbol =
        (frontSetting && frontSetting.value && frontSetting.value.currency_symbol) || "";

    const addRow = () => {
        setPresentations((prev) => [
            ...prev,
            {
                key: `new_${Date.now()}_${prev.length}`,
                variation_type_id: null,
                equivalence: prev.length === 0 ? 1 : "",
                price: "",
                is_base_unit: prev.length === 0, // la primera fila por defecto es la unidad base
                is_default: prev.length === 0,
            },
        ]);
    };

    const removeRow = (key) => {
        setPresentations((prev) => prev.filter((row) => row.key !== key));
    };

    const updateRow = (key, field, value) => {
        setPresentations((prev) =>
            prev.map((row) => {
                if (row.key !== key) {
                    // Solo una presentación puede ser la unidad base / default
                    if (field === "is_base_unit" && value === true) {
                        return { ...row, is_base_unit: false };
                    }
                    if (field === "is_default" && value === true) {
                        return { ...row, is_default: false };
                    }
                    return row;
                }
                return { ...row, [field]: value };
            })
        );
    };

    const rowStyle = {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-end",
        gap: 10,
        padding: "12px",
        borderRadius: 10,
        border: "1px solid #e5e7eb",
        marginBottom: 10,
        backgroundColor: "#fafafa",
    };

    const fieldGroupStyle = {
        display: "flex",
        flexDirection: "column",
        flex: "1 1 130px",
        minWidth: 110,
    };

    const fieldLabelStyle = { fontSize: 11, color: "#6b7280", marginBottom: 4 };

    const toggleBtnStyle = (active, color) => ({
        border: `1px solid ${active ? color : "#d1d5db"}`,
        backgroundColor: active ? color : "#fff",
        color: active ? "#fff" : "#6b7280",
        borderRadius: 8,
        padding: "8px 10px",
        fontSize: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        cursor: "pointer",
        whiteSpace: "nowrap",
        flex: "1 1 auto",
    });

    return (
        <div className="row border-top pt-4">
            <div className="col-12 mb-3">
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="managePresentations"
                        checked={managePresentations}
                        onChange={(e) =>
                            onToggleManagePresentations(e.target.checked)
                        }
                    />
                    <label
                        className="form-check-label"
                        htmlFor="managePresentations"
                    >
                        Manejar presentaciones de venta
                    </label>
                </div>
            </div>

            {managePresentations && (
                <div className="col-12">
                    {presentations.map((row) => (
                        <div style={rowStyle} key={row.key}>
                            <div style={{ ...fieldGroupStyle, flex: "1 1 160px" }}>
                                <span style={fieldLabelStyle}>
                                    {getFormattedMessage("product.input.sale-unit.label")}
                                </span>
                                <ReactSelect
                                    data={variationTypesOptions}
                                    value={
                                        row.variation_type_id
                                            ? {
                                                value: row.variation_type_id,
                                                label:
                                                    variationTypesOptions?.find(
                                                        (o) => o.value === row.variation_type_id
                                                    )?.label || "",
                                            }
                                            : ""
                                    }
                                    onChange={(obj) =>
                                        updateRow(row.key, "variation_type_id", obj.value)
                                    }
                                    placeholder={placeholderText(
                                        "product.input.sale-unit.placeholder.label"
                                    )}
                                />
                            </div>

                            <div style={fieldGroupStyle}>
                                <span style={fieldLabelStyle}>Equivale a (unid. base)</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={row.equivalence}
                                    onKeyPress={(e) => decimalValidate(e)}
                                    onChange={(e) =>
                                        updateRow(row.key, "equivalence", e.target.value)
                                    }
                                    disabled={row.is_base_unit}
                                    placeholder="Ej: 24"
                                />
                            </div>

                            <div style={fieldGroupStyle}>
                                <span style={fieldLabelStyle}>
                                    {getFormattedMessage("product.input.product-price.label")}
                                </span>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={row.price}
                                        onKeyPress={(e) => decimalValidate(e)}
                                        onChange={(e) =>
                                            updateRow(row.key, "price", e.target.value)
                                        }
                                    />
                                    <span className="input-group-text">{currencySymbol}</span>
                                </div>
                            </div>

                            <div style={fieldGroupStyle}>
                                <span style={fieldLabelStyle}>Costo (opcional)</span>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Auto"
                                        value={row.cost ?? ""}
                                        onKeyPress={(e) => decimalValidate(e)}
                                        onChange={(e) =>
                                            updateRow(row.key, "cost", e.target.value)
                                        }
                                    />
                                    <span className="input-group-text">{currencySymbol}</span>
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: 6, flex: "2 1 220px" }}>
                                <button
                                    type="button"
                                    style={toggleBtnStyle(row.is_base_unit, "#2563eb")}
                                    onClick={() => {
                                        updateRow(row.key, "is_base_unit", true);
                                        updateRow(row.key, "equivalence", 1);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faBoxOpen} />
                                    Unidad base
                                </button>
                                <button
                                    type="button"
                                    style={toggleBtnStyle(row.is_default, "#f59e0b")}
                                    onClick={() => updateRow(row.key, "is_default", true)}
                                >
                                    <FontAwesomeIcon icon={faStar} />
                                    Por defecto
                                </button>
                            </div>

                            <Button
                                variant="light"
                                className="text-danger"
                                onClick={() => removeRow(row.key)}
                                style={{ flex: "0 0 auto" }}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </Button>
                        </div>
                    ))}

                    <Button variant="light" onClick={addRow} type="button">
                        <FontAwesomeIcon icon={faPlus} className="me-1" />
                        Agregar presentación
                    </Button>
                    <span className="text-danger d-block fw-400 fs-small mt-2">
                        {errors?.["presentations"]}
                    </span>
                </div>
            )}
        </div>
    );
};

export default PresentationsSection;