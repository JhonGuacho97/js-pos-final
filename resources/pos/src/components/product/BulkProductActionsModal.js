import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap-v5";
import "./bulk-product-actions.scss";

const BulkProductActionsModal = ({ show, initialMode = "manage", products, canManagePurchase, onClose, onCreatePurchase, onDelete }) => {
    const [mode, setMode] = useState("manage");
    const [selectedSkuIds, setSelectedSkuIds] = useState([]);

    const productGroups = useMemo(() => (products || []).map((product) => ({
        ...product,
        children: product.products || [],
    })), [products]);

    useEffect(() => {
        if (!show) return;
        setMode(initialMode);
        setSelectedSkuIds(productGroups.flatMap((product) =>
            product.children.length === 1 ? [product.children[0].id] : []
        ));
    }, [show, initialMode, productGroups]);

    const toggleSku = (id) => setSelectedSkuIds((current) =>
        current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );

    const selectedCount = products?.length || 0;

    return <Modal show={show} onHide={onClose} centered size="lg" className="bulk-product-modal">
        <Modal.Header closeButton>
            <div className="bulk-product-heading">
                <span className="bulk-product-heading__icon"><i className="bi bi-boxes" /></span>
                <div><span className="bulk-product-eyebrow">GESTIÓN DE PRODUCTOS</span>
                    <Modal.Title>Acciones en lote</Modal.Title>
                    <p>Administra la selección sin perder el contexto del inventario.</p></div>
            </div>
            <span className="bulk-product-count"><b>{selectedCount}</b> {selectedCount === 1 ? "seleccionado" : "seleccionados"}</span>
        </Modal.Header>

        <Modal.Body>
            {mode === "manage" && <div className="bulk-product-actions">
                <div className="bulk-product-guidance"><span><i className="bi bi-lightning-charge" /></span><div><strong>¿Qué deseas hacer con la selección?</strong><p>Elige una acción. Ningún cambio se confirma sin una revisión final.</p></div></div>
                {canManagePurchase && <button type="button" className="bulk-product-action is-purchase" onClick={() => setMode("purchase")}><span className="bulk-product-action__icon"><i className="bi bi-cart-plus" /></span><div><small>ABASTECIMIENTO</small><strong>Preparar una compra</strong><p>Selecciona los SKU o variantes y continúa al formulario de recepción.</p></div><span className="bulk-product-action__arrow"><i className="bi bi-arrow-right" /></span></button>}
                <button type="button" className="bulk-product-action is-delete" onClick={() => setMode("delete")}><span className="bulk-product-action__icon"><i className="bi bi-trash3" /></span><div><small>GESTIÓN DEL CATÁLOGO</small><strong>Eliminar productos</strong><p>Se validará que ningún artículo tenga compras o ventas registradas.</p></div><span className="bulk-product-action__arrow"><i className="bi bi-arrow-right" /></span></button>
            </div>}

            {mode === "purchase" && <>
                <button type="button" className="bulk-product-back" onClick={() => setMode("manage")}><i className="bi bi-arrow-left" /> Volver a las acciones</button>
                <div className="bulk-product-guidance is-blue"><span><i className="bi bi-info-circle" /></span><div><strong>Define qué presentaciones vas a comprar</strong><p>Los productos simples están incluidos. Cuando existan variantes, marca únicamente las necesarias.</p></div></div>
                <div className="bulk-product-groups">
                    {productGroups.map((product) => <section key={product.id} className="bulk-product-group">
                        <header><div><span className="bulk-product-group__icon"><i className="bi bi-box-seam" /></span><div><strong>{product.name}</strong><small>{product.children.length === 1 ? "Producto con un SKU" : "Selecciona una o más variantes"}</small></div></div><span>{product.children.length === 1 ? "SKU único" : `${product.children.length} variantes`}</span></header>
                        <div className="bulk-product-skus">{product.children.map((child) => <label key={child.id} htmlFor={`bulk-sku-${child.id}`} className={`bulk-product-sku ${selectedSkuIds.includes(child.id) ? "is-selected" : ""}`}>
                            <Form.Check id={`bulk-sku-${child.id}`} checked={selectedSkuIds.includes(child.id)} onChange={() => toggleSku(child.id)} />
                            <span><strong>{child.variation_product?.variation_type_name || child.name || product.name}</strong><small>Código {child.code || "—"}</small></span><b>$ {Number(child.product_cost || 0).toFixed(2)}</b>
                        </label>)}</div>
                    </section>)}
                </div>
            </>}

            {mode === "delete" && <>
                <button type="button" className="bulk-product-back" onClick={() => setMode("manage")}><i className="bi bi-arrow-left" /> Volver a las acciones</button>
                <div className="bulk-product-guidance is-danger"><span><i className="bi bi-exclamation-triangle" /></span><div><strong>Esta eliminación es permanente</strong><p>Validaremos los {selectedCount} productos. Si uno tiene movimientos, no se eliminará ninguno.</p></div></div>
                <div className="bulk-product-delete-list">{products.map((product) => <div key={product.id}><span><i className="bi bi-box" /></span><strong>{product.name}</strong><i className="bi bi-check-circle" /></div>)}</div>
            </>}
        </Modal.Body>

        {mode !== "manage" && <Modal.Footer><span><i className="bi bi-shield-check" /> Validación segura antes de confirmar</span><div><Button className="bulk-product-cancel" onClick={onClose}>Cancelar</Button>
            {mode === "purchase" ? <Button className="bulk-product-primary" disabled={!selectedSkuIds.length} onClick={() => onCreatePurchase(selectedSkuIds)}>Continuar con {selectedSkuIds.length} SKU <i className="bi bi-arrow-right" /></Button>
                : <Button className="bulk-product-danger" onClick={onDelete}><i className="bi bi-trash3" /> Eliminar {selectedCount} productos</Button>}</div></Modal.Footer>}
    </Modal>;
};

export default BulkProductActionsModal;
