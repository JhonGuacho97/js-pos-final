import React, { useEffect, useMemo, useState } from "react";
import { Button, Modal } from "react-bootstrap-v5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBarcode,
    faCheck,
    faLayerGroup,
    faMagnifyingGlass,
    faMinus,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { decimalValidate, getFormattedMessage } from "../../../shared/sharedMethod";

const VariationSelectModal = ({ show, onHide, product, onConfirm }) => {
    const variations = product?.attributes?.variations || [];
    const [selectedVariationId, setSelectedVariationId] = useState(variations[0]?.id);
    const [qty, setQty] = useState(1);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!show) return;
        setSelectedVariationId(variations[0]?.id);
        setQty(1);
        setSearch("");
    }, [show, product?.id]);

    const selectedVariation = variations.find((variation) => variation.id === selectedVariationId);
    const availableUnits = selectedVariation?.attributes?.stock?.quantity || 0;
    const filteredVariations = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return variations;
        return variations.filter((variation) => {
            const label = (variation.attributes?.variation_product?.variation_type_name || "").toLowerCase();
            const code = (variation.attributes?.code || "").toLowerCase();
            return label.includes(term) || code.includes(term);
        });
    }, [search, variations]);

    const selectVariation = (variation) => {
        if ((variation.attributes?.stock?.quantity || 0) <= 0) return;
        setSelectedVariationId(variation.id);
        setQty(1);
    };

    const onSearchChange = (event) => {
        const value = event.target.value;
        setSearch(value);
        const match = variations.find((variation) =>
            (variation.attributes?.code || "").toLowerCase() === value.trim().toLowerCase()
        );
        if (match) selectVariation(match);
    };

    const onSearchKeyDown = (event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        const match = variations.find((variation) =>
            (variation.attributes?.code || "").toLowerCase() === search.trim().toLowerCase()
        );
        if (!match || (match.attributes?.stock?.quantity || 0) <= 0) return;
        onConfirm(product, match, 1);
        onHide();
    };

    const handleConfirm = () => {
        if (!selectedVariation || qty <= 0 || qty > availableUnits) return;
        onConfirm(product, selectedVariation, qty);
        onHide();
    };

    if (!variations.length) return null;

    const selectedLabel = selectedVariation?.attributes?.variation_product?.variation_type_name || "";
    const selectedPrice = selectedVariation?.attributes?.effective_price ?? selectedVariation?.attributes?.product_price;

    return (
        <Modal show={show} onHide={onHide} keyboard centered
            size={variations.length > 4 ? "lg" : undefined} dialogClassName="pos-option-modal">
            <Modal.Header closeButton className="pos-option-modal__header">
                <div className="pos-option-modal__heading">
                    <span className="pos-option-modal__icon"><FontAwesomeIcon icon={faLayerGroup} /></span>
                    <div>
                        <span className="pos-option-modal__eyebrow">Selecciona una variante</span>
                        <Modal.Title>{product?.attributes?.name}</Modal.Title>
                        <p>Elige la opción y la cantidad que deseas agregar.</p>
                    </div>
                </div>
            </Modal.Header>

            <Modal.Body className="pos-option-modal__body">
                {variations.length > 6 && (
                    <div className="pos-option-search">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                        <input type="text" autoFocus placeholder="Buscar por nombre o código" value={search}
                            onChange={onSearchChange} onKeyDown={onSearchKeyDown} />
                        <span>Escanea o escribe</span>
                    </div>
                )}

                <div className="pos-option-section-heading">
                    <div><h3>Opciones disponibles</h3><p>{filteredVariations.length} variantes encontradas</p></div>
                </div>

                <div className="pos-option-grid">
                    {filteredVariations.length === 0 && (
                        <div className="pos-option-empty">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                            <strong>Sin coincidencias</strong><span>Prueba con otro nombre o código.</span>
                        </div>
                    )}
                    {filteredVariations.map((variation) => {
                        const isSelected = selectedVariationId === variation.id;
                        const stock = variation.attributes?.stock?.quantity || 0;
                        const price = variation.attributes?.effective_price ?? variation.attributes?.product_price;
                        const label = variation.attributes?.variation_product?.variation_type_name || "Sin nombre";
                        const code = variation.attributes?.code || "Sin código";
                        return (
                            <button type="button" key={variation.id}
                                className={`pos-option-card${isSelected ? " is-selected" : ""}${stock <= 0 ? " is-disabled" : ""}`}
                                onClick={() => selectVariation(variation)} disabled={stock <= 0} aria-pressed={isSelected}>
                                <span className="pos-option-card__check"><FontAwesomeIcon icon={faCheck} /></span>
                                <span className="pos-option-card__topline">
                                    <span className="pos-option-card__label">{label}</span>
                                    <span className="pos-option-card__price">$ {Number(price || 0).toFixed(2)}</span>
                                </span>
                                <span className="pos-option-card__meta">
                                    <span><FontAwesomeIcon icon={faBarcode} /> {code}</span>
                                    <span className={stock <= 0 ? "is-empty" : ""}>{stock <= 0 ? "Sin stock" : `${stock} disponibles`}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="pos-option-selection">
                    <div className="pos-option-selection__summary">
                        <span>Selección actual</span><strong>{selectedLabel || "Selecciona una variante"}</strong>
                        {selectedVariation && <small>$ {Number(selectedPrice || 0).toFixed(2)} por unidad</small>}
                    </div>
                    <div className="pos-option-quantity">
                        <span className="pos-option-quantity__label">Cantidad</span>
                        <div className="pos-option-stepper">
                            <button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label="Disminuir cantidad"><FontAwesomeIcon icon={faMinus} /></button>
                            <input type="number" min={1} value={qty} onKeyPress={(event) => decimalValidate(event)}
                                onChange={(event) => setQty(Number(event.target.value) || 1)} aria-label="Cantidad" />
                            <button type="button" onClick={() => setQty((value) => value + 1)} aria-label="Aumentar cantidad"><FontAwesomeIcon icon={faPlus} /></button>
                        </div>
                    </div>
                </div>
                {qty > availableUnits && <div className="pos-option-alert">{getFormattedMessage("pos.quantity.exceeds.quantity.available.in.stock.message")}</div>}
            </Modal.Body>

            <Modal.Footer className="pos-option-modal__footer">
                <Button variant="light" onClick={onHide}>{getFormattedMessage("globally.cancel-btn")}</Button>
                <Button variant="primary" disabled={!selectedVariation || qty <= 0 || qty > availableUnits} onClick={handleConfirm}>
                    {getFormattedMessage("globally.add-cart-btn")}
                    <span className="pos-option-modal__button-total">$ {Number((selectedPrice || 0) * qty).toFixed(2)}</span>
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default VariationSelectModal;
