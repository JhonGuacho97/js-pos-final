import React, { useState } from "react";
import { Button, Modal, Row, InputGroup } from "react-bootstrap-v5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import {
    decimalValidate,
    getFormattedMessage,
} from "../../../shared/sharedMethod";

/**
 * Se abre al hacer click en un producto con variantes (talla/color/etc).
 * El cajero elige la variante y la cantidad. A diferencia de las
 * presentaciones, cada variante es un producto real e independiente
 * (con su propio id, código y stock) -- no hay equivalencias que
 * calcular, cada una se descuenta de su propio stock.
 *
 * Cuando hay muchas variantes, el buscador filtra en vivo por nombre o
 * código. Si lo que se escribe/escanea coincide EXACTO con el código de
 * una sola variante (caso típico de escanear), esa variante se
 * selecciona sola -- igual que el resto del buscador del POS ya hace.
 */
const VariationSelectModal = ({ show, onHide, product, onConfirm }) => {
    const variations = product?.attributes?.variations || [];
    const [selectedVariationId, setSelectedVariationId] = useState(
        variations[0]?.id
    );
    const [qty, setQty] = useState(1);
    const [search, setSearch] = useState("");

    const selectedVariation = variations.find(
        (v) => v.id === selectedVariationId
    );

    const availableUnits = selectedVariation?.attributes?.stock?.quantity || 0;

    const normalizedSearch = search.trim().toLowerCase();
    const filteredVariations = normalizedSearch
        ? variations.filter((v) => {
            const label = (
                v.attributes?.variation_product?.variation_type_name || ""
            ).toLowerCase();
            const code = (v.attributes?.code || "").toLowerCase();
            return (
                label.includes(normalizedSearch) ||
                code.includes(normalizedSearch)
            );
        })
        : variations;

    const onSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);

        const exactCodeMatch = variations.find(
            (v) => (v.attributes?.code || "").toLowerCase() === value.trim().toLowerCase()
        );
        if (exactCodeMatch) {
            setSelectedVariationId(exactCodeMatch.id);
            setQty(1);
        }
    };

    const onSearchKeyDown = (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        const exactCodeMatch = variations.find(
            (v) => (v.attributes?.code || "").toLowerCase() === search.trim().toLowerCase()
        );
        // Escaneo típico: código exacto + Enter -> agrega directo, sin
        // pasos extra.
        if (exactCodeMatch) {
            const stock = exactCodeMatch.attributes?.stock?.quantity || 0;
            if (stock <= 0 || 1 > stock) return;
            onConfirm(product, exactCodeMatch, 1);
            setQty(1);
            setSearch("");
            onHide();
        }
    };

    const handleConfirm = () => {
        if (!selectedVariation || qty <= 0) return;
        if (qty > availableUnits) return;
        onConfirm(product, selectedVariation, qty);
        setQty(1);
        setSearch("");
        onHide();
    };

    if (!variations.length) {
        return null;
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            keyboard
            centered
            size={variations.length > 4 ? "lg" : undefined}
        >
            <Modal.Header closeButton>
                <Modal.Title>{product?.attributes?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    {variations.length > 6 && (
                        <div className="col-md-12 mb-3">
                            <InputGroup>
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                </InputGroup.Text>
                                <input
                                    type="text"
                                    autoFocus
                                    className="form-control"
                                    placeholder="Buscar por nombre o código de variante"
                                    value={search}
                                    onChange={onSearchChange}
                                    onKeyDown={onSearchKeyDown}
                                />
                            </InputGroup>
                        </div>
                    )}
                    <div className="col-md-12 mb-4">
                        <label className="form-label">
                            {getFormattedMessage("variation.variation_types")}:
                        </label>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(130px, 160px))",
                                gap: 10,
                                maxHeight: 320,
                                overflowY: "auto",
                                paddingRight: 4,
                                justifyContent:"center"
                            }}
                        >
                            {filteredVariations.length === 0 && (
                                <span className="text-muted small">
                                    No hay variantes que coincidan con la búsqueda.
                                </span>
                            )}
                            {filteredVariations.map((variation) => {
                                const isSelected =
                                    selectedVariationId === variation.id;
                                const stock =
                                    variation.attributes?.stock?.quantity || 0;
                                const price =
                                    variation.attributes?.effective_price ??
                                    variation.attributes?.product_price;
                                const label =
                                    variation.attributes?.variation_product
                                        ?.variation_type_name || "";
                                return (
                                    <div
                                        key={variation.id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => {
                                            if (stock <= 0) return;
                                            setSelectedVariationId(variation.id);
                                            setQty(1);
                                        }}
                                        style={{
                                            position: "relative",
                                            padding: "12px 16px",
                                            borderRadius: 10,
                                            cursor: stock <= 0 ? "not-allowed" : "pointer",
                                            textAlign: "center",
                                            opacity: stock <= 0 ? 0.5 : 1,
                                            border: isSelected
                                                ? "2px solid #2563eb"
                                                : "2px solid #d1d5db",
                                            backgroundColor: isSelected
                                                ? "#eff6ff"
                                                : "#ffffff",
                                            boxShadow: isSelected
                                                ? "0 0 0 3px rgba(37, 99, 235, 0.15)"
                                                : "none",
                                            transition: "all 0.12s ease-in-out",
                                        }}
                                    >
                                        {isSelected && (
                                            <FontAwesomeIcon
                                                icon={faCheckCircle}
                                                style={{
                                                    position: "absolute",
                                                    top: -8,
                                                    right: -8,
                                                    color: "#2563eb",
                                                    backgroundColor: "#fff",
                                                    borderRadius: "50%",
                                                }}
                                                size="lg"
                                            />
                                        )}
                                        <div
                                            style={{
                                                fontWeight: isSelected ? 700 : 500,
                                                color: isSelected
                                                    ? "#1e3a8a"
                                                    : "#111827",
                                            }}
                                        >
                                            {label}
                                        </div>
                                        <small
                                            style={{
                                                color: isSelected
                                                    ? "#1e40af"
                                                    : "#6b7280",
                                                display: "block",
                                            }}
                                        >
                                            $ {price}
                                        </small>
                                        <small
                                            style={{
                                                color: stock <= 0 ? "#dc2626" : "#9ca3af",
                                                fontSize: "11px",
                                            }}
                                        >
                                            {stock <= 0
                                                ? "Sin stock"
                                                : `${stock} disponibles`}
                                        </small>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="col-md-12 mb-2">
                        <label className="form-label">
                            {getFormattedMessage(
                                "purchase.order-item.table.quantity.column.label"
                            )}
                            :
                        </label>
                        <InputGroup>
                            <Button
                                variant="light"
                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                            >
                                -
                            </Button>
                            <input
                                type="number"
                                className="form-control text-center"
                                min={1}
                                value={qty}
                                onKeyPress={(event) => decimalValidate(event)}
                                onChange={(e) =>
                                    setQty(Number(e.target.value) || 1)
                                }
                            />
                            <Button
                                variant="light"
                                onClick={() => setQty((q) => q + 1)}
                            >
                                +
                            </Button>
                        </InputGroup>
                        {qty > availableUnits && (
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {getFormattedMessage(
                                    "pos.quantity.exceeds.quantity.available.in.stock.message"
                                )}
                            </span>
                        )}
                    </div>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className="btn btn-primary"
                    disabled={
                        !selectedVariation || qty <= 0 || qty > availableUnits
                    }
                    onClick={handleConfirm}
                >
                    {getFormattedMessage("globally.add-cart-btn")}
                </Button>
                <Button variant="light" onClick={onHide}>
                    {getFormattedMessage("globally.cancel-btn")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default VariationSelectModal;
