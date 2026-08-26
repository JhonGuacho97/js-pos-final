import React, { useState } from "react";
import { Button } from "react-bootstrap-v5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faBoxOpen, faStar } from "@fortawesome/free-solid-svg-icons";
import ReactSelect from "../../../shared/select/reactSelect";
import apiConfig from "../../../config/apiConfig";
import { apiBaseURL } from "../../../constants";
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
    presentationFamilies,
    selectedPresentationFamilyId,
    onPresentationFamilyChange,
    onPresentationTypeCreated,
    frontSetting,
    errors,
}) => {
    const [showCustomType, setShowCustomType] = useState(false);
    const [customType, setCustomType] = useState({ name: "", default_equivalence: "" });
    const [customTypeError, setCustomTypeError] = useState("");
    const [savingCustomType, setSavingCustomType] = useState(false);
    const currencySymbol =
        (frontSetting && frontSetting.value && frontSetting.value.currency_symbol) || "";
    const familyOptions = (presentationFamilies || []).map((family) => ({
        value: family.id,
        label: family.name,
    }));
    const selectedFamily = (presentationFamilies || []).find(
        (family) => family.id === selectedPresentationFamilyId
    );
    const presentationTypesOptions = (selectedFamily?.types || []).map((type) => ({
        value: type.id,
        label: type.name,
        default_equivalence: type.default_equivalence,
    }));

    const saveCustomType = async () => {
        if (!selectedPresentationFamilyId || !customType.name.trim()) {
            setCustomTypeError("Escribe el nombre de la presentación.");
            return;
        }

        setSavingCustomType(true);
        setCustomTypeError("");
        try {
            const { data } = await apiConfig.post(
                `${apiBaseURL.PRESENTATION_CATALOG}/families/${selectedPresentationFamilyId}/types`,
                {
                    name: customType.name.trim(),
                    default_equivalence: customType.default_equivalence || null,
                }
            );
            const createdType = data?.data;
            if (createdType) onPresentationTypeCreated(selectedPresentationFamilyId, createdType);
            setCustomType({ name: "", default_equivalence: "" });
            setShowCustomType(false);
        } catch (error) {
            setCustomTypeError(error?.response?.data?.message || "No se pudo crear la presentación.");
        } finally {
            setSavingCustomType(false);
        }
    };

    const addRow = () => {
        setPresentations((prev) => [
            ...prev,
            {
                key: `new_${Date.now()}_${prev.length}`,
                variation_type_id: null,
                presentation_type_id: null,
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
        <div className="row sale-panel product-presentations-section">
            <div className="col-12 product-section-heading">
                <div className="sale-panel-icon"><FontAwesomeIcon icon={faBoxOpen} /></div>
                <div><h2>Presentaciones de venta</h2><p>Configura unidades, paquetes o cajas para el mismo inventario base.</p></div>
            </div>
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
                    <div className="mb-3" style={{ maxWidth: 360 }}>
                        {/* <span style={fieldLabelStyle}>Familia de presentaciones</span> */}
                        <ReactSelect
                            title="Familia de presentaciones"
                            data={familyOptions}
                            value={familyOptions.find((option) => option.value === selectedPresentationFamilyId) || ""}
                            onChange={(option) => onPresentationFamilyChange(option.value)}
                            placeholder="Selecciona el tipo de negocio o producto"
                        />
                        <small className="text-muted d-block mt-1">
                            Solo se mostrarán opciones compatibles con esta familia.
                        </small>
                        <button
                            type="button"
                            className="btn btn-link btn-sm px-0 mt-1 text-decoration-none"
                            onClick={() => setShowCustomType((visible) => !visible)}
                        >
                            <FontAwesomeIcon icon={faPlus} className="me-1" />
                            Crear opción personalizada
                        </button>
                    </div>
                    {showCustomType && (
                        <div className="d-flex flex-wrap align-items-end gap-2 p-3 mb-3 rounded border bg-light">
                            <div style={{ minWidth: 220, flex: "1 1 220px" }}>
                                <span style={fieldLabelStyle}>Nombre</span>
                                <input
                                    className="form-control"
                                    value={customType.name}
                                    placeholder="Ej: Display, Docena, Cartón x10"
                                    onChange={(event) => setCustomType((value) => ({ ...value, name: event.target.value }))}
                                />
                            </div>
                            <div style={{ minWidth: 170, flex: "0 1 190px" }}>
                                <span style={fieldLabelStyle}>Equivalencia inicial</span>
                                <input
                                    className="form-control"
                                    value={customType.default_equivalence}
                                    placeholder="Ej: 10 (editable después)"
                                    onKeyPress={(event) => decimalValidate(event)}
                                    onChange={(event) => setCustomType((value) => ({ ...value, default_equivalence: event.target.value }))}
                                />
                            </div>
                            <Button type="button" onClick={saveCustomType} disabled={savingCustomType}>
                                {savingCustomType ? "Guardando..." : "Guardar opción"}
                            </Button>
                            <small className="text-muted w-100">
                                Se cargará automáticamente al elegir esta opción, pero podrás ajustarla para cada producto.
                            </small>
                            {customTypeError && <span className="text-danger w-100 small">{customTypeError}</span>}
                        </div>
                    )}
                    {presentations.map((row) => (
                        <div style={rowStyle} key={row.key}>
                            <div style={{ ...fieldGroupStyle, flex: "1 1 160px" }}>
                                <ReactSelect
                                    title={getFormattedMessage("product.input.sale-unit.label")}
                                    data={presentationTypesOptions}
                                    value={
                                        row.presentation_type_id
                                            ? {
                                                value: row.presentation_type_id,
                                                label:
                                                    presentationTypesOptions?.find(
                                                        (o) => o.value === row.presentation_type_id
                                                    )?.label || row.name || "",
                                            }
                                            : ""
                                    }
                                    onChange={(obj) => {
                                        const selectedType = presentationTypesOptions.find(
                                            (option) => option.value === obj.value
                                        );
                                        updateRow(row.key, "presentation_type_id", obj.value);
                                        if (!row.is_base_unit) {
                                            updateRow(
                                                row.key,
                                                "equivalence",
                                                selectedType?.default_equivalence ?? ""
                                            );
                                        }
                                    }}
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
