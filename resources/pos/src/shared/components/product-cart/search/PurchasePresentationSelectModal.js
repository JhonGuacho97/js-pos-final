import React, { useState } from "react";
import { Button, Modal, Row, InputGroup } from "react-bootstrap-v5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { decimalValidate, getFormattedMessage } from "../../../sharedMethod";

/**
 * Igual que SalesPresentationSelectModal.js, pero para el buscador del
 * formulario de COMPRAS: muestra el costo de cada presentación (el mismo
 * effective_cost que ya usamos para calcular margen), no el precio de
 * venta -- y no valida contra stock existente, porque comprar es lo que
 * agrega stock, no lo consume.
 *
 * Devuelve la línea en el formato que espera preparePurchaseArray.js /
 * PurchaseForm.js (product_cost, net_unit_cost, purchase_unit, etc.).
 */
const PurchasePresentationSelectModal = ({ show, onHide, product, onConfirm }) => {
    const attrs = product?.attributes || {};
    const presentations = attrs.presentations || [];
    const defaultPresentation =
        presentations.find((p) => p.is_default) || presentations[0];

    const [selectedPresentationId, setSelectedPresentationId] = useState(
        defaultPresentation?.id
    );
    const [qty, setQty] = useState(1);

    const selectedPresentation = presentations.find(
        (p) => p.id === selectedPresentationId
    );

    const handleConfirm = () => {
        if (!selectedPresentation || qty <= 0) return;
        onConfirm(product, selectedPresentation, qty);
        setQty(1);
        onHide();
    };

    if (!presentations.length) {
        return null;
    }

    return (
        <Modal show={show} onHide={onHide} keyboard centered>
            <Modal.Header closeButton>
                <Modal.Title>{attrs.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <div className="col-md-12 mb-4">
                        <label className="form-label">
                            {getFormattedMessage("product.input.sale-unit.label")}:
                        </label>
                        <div className="d-flex flex-wrap gap-2">
                            {presentations.map((presentation) => {
                                const isSelected =
                                    selectedPresentationId === presentation.id;
                                const cost =
                                    presentation.effective_cost ??
                                    presentation.cost ??
                                    0;
                                return (
                                    <div
                                        key={presentation.id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => {
                                            setSelectedPresentationId(presentation.id);
                                            setQty(1);
                                        }}
                                        style={{
                                            position: "relative",
                                            minWidth: 120,
                                            padding: "12px 16px",
                                            borderRadius: 10,
                                            cursor: "pointer",
                                            textAlign: "center",
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
                                                color: isSelected ? "#1e3a8a" : "#111827",
                                            }}
                                        >
                                            {presentation.name}
                                        </div>
                                        <small
                                            style={{
                                                color: isSelected ? "#1e40af" : "#6b7280",
                                            }}
                                        >
                                            $ {Number(cost).toFixed(2)}
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
                                onChange={(e) => setQty(Number(e.target.value) || 1)}
                            />
                            <Button variant="light" onClick={() => setQty((q) => q + 1)}>
                                +
                            </Button>
                        </InputGroup>
                        {selectedPresentation && (
                            <small className="text-muted d-block mt-1">
                                {qty} {selectedPresentation.name} ={" "}
                                {qty * selectedPresentation.equivalence}{" "}
                                {attrs.product_unit_name?.name}
                            </small>
                        )}
                    </div>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className="btn btn-primary"
                    disabled={!selectedPresentation || qty <= 0}
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

export default PurchasePresentationSelectModal;
