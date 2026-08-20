import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap-v5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faBoxesStacked, faCheck, faCube, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { decimalValidate, getFormattedMessage } from "../../../shared/sharedMethod";

const PresentationSelectModal = ({ show, onHide, product, onConfirm }) => {
    const presentations = product?.attributes?.presentations || [];
    const defaultPresentation = presentations.find((item) => item.is_default) || presentations[0];
    const [selectedPresentationId, setSelectedPresentationId] = useState(defaultPresentation?.id);
    const [qty, setQty] = useState(1);

    useEffect(() => {
        if (!show) return;
        const nextDefault = presentations.find((item) => item.is_default) || presentations[0];
        setSelectedPresentationId(nextDefault?.id);
        setQty(1);
    }, [show, product?.id]);

    const selectedPresentation = presentations.find((item) => item.id === selectedPresentationId);
    const availableUnits = product?.attributes?.stock?.quantity || 0;
    const maxQtyForPresentation = selectedPresentation
        ? Math.floor(availableUnits / selectedPresentation.equivalence)
        : 0;

    const handleConfirm = () => {
        if (!selectedPresentation || qty <= 0 || qty > maxQtyForPresentation) return;
        onConfirm(product, selectedPresentation, qty);
        onHide();
    };

    if (!presentations.length) return null;

    const selectedPrice = selectedPresentation?.effective_price ?? selectedPresentation?.price;
    const baseUnitName = product?.attributes?.product_unit_name?.name || "unidades";

    return (
        <Modal show={show} onHide={onHide} keyboard centered
            size={presentations.length > 3 ? "lg" : undefined} dialogClassName="pos-option-modal">
            <Modal.Header closeButton className="pos-option-modal__header">
                <div className="pos-option-modal__heading">
                    <span className="pos-option-modal__icon"><FontAwesomeIcon icon={faBoxesStacked} /></span>
                    <div>
                        <span className="pos-option-modal__eyebrow">Elige cómo venderlo</span>
                        <Modal.Title>{product?.attributes?.name}</Modal.Title>
                        <p>Selecciona una presentación y define la cantidad.</p>
                    </div>
                </div>
            </Modal.Header>

            <Modal.Body className="pos-option-modal__body">
                <div className="pos-option-section-heading">
                    <div><h3>Presentaciones disponibles</h3><p>El inventario se descontará en su unidad base.</p></div>
                    <span className="pos-option-stock-pill">{availableUnits} {baseUnitName} en stock</span>
                </div>

                <div className="pos-option-grid pos-option-grid--presentations">
                    {presentations.map((presentation, index) => {
                        const isSelected = selectedPresentationId === presentation.id;
                        const price = presentation.effective_price ?? presentation.price;
                        const availablePresentations = Math.floor(availableUnits / presentation.equivalence);
                        return (
                            <button type="button" key={presentation.id}
                                className={`pos-option-card pos-presentation-card${isSelected ? " is-selected" : ""}${availablePresentations <= 0 ? " is-disabled" : ""}`}
                                onClick={() => {
                                    if (availablePresentations <= 0) return;
                                    setSelectedPresentationId(presentation.id);
                                    setQty(1);
                                }}
                                disabled={availablePresentations <= 0} aria-pressed={isSelected}>
                                <span className="pos-option-card__check"><FontAwesomeIcon icon={faCheck} /></span>
                                <span className="pos-presentation-card__icon"><FontAwesomeIcon icon={index === 0 ? faCube : faBoxOpen} /></span>
                                <span className="pos-option-card__label">{presentation.name}</span>
                                <span className="pos-presentation-card__equivalence">1 {presentation.name} = {presentation.equivalence} {baseUnitName}</span>
                                <span className="pos-presentation-card__footer">
                                    <strong>$ {Number(price || 0).toFixed(2)}</strong>
                                    <small>{availablePresentations <= 0 ? "Sin stock" : `${availablePresentations} disponibles`}</small>
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="pos-option-selection">
                    <div className="pos-option-selection__summary">
                        <span>Conversión de la selección</span>
                        <strong>{selectedPresentation ? `${qty} ${selectedPresentation.name}` : "Selecciona una presentación"}</strong>
                        {selectedPresentation && <small>Equivale a {qty * selectedPresentation.equivalence} {baseUnitName}</small>}
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
                {qty > maxQtyForPresentation && <div className="pos-option-alert">{getFormattedMessage("pos.quantity.exceeds.quantity.available.in.stock.message")}</div>}
            </Modal.Body>

            <Modal.Footer className="pos-option-modal__footer">
                <Button variant="light" onClick={onHide}>{getFormattedMessage("globally.cancel-btn")}</Button>
                <Button variant="primary" disabled={!selectedPresentation || qty <= 0 || qty > maxQtyForPresentation} onClick={handleConfirm}>
                    {getFormattedMessage("globally.add-cart-btn")}
                    <span className="pos-option-modal__button-total">$ {Number((selectedPrice || 0) * qty).toFixed(2)}</span>
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PresentationSelectModal;
