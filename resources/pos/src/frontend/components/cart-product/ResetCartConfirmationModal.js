import React from 'react';
import {Button, Modal} from 'react-bootstrap';

const ResetCartConfirmationModal = ({onCancel, onConfirm, itemCount, total}) => (
    <Modal show onHide={onCancel} centered className="pos-modal pos-confirmation-modal">
        <Modal.Header closeButton>
            <div>
                <span className="pos-confirmation-modal__eyebrow">ACCIÓN IRREVERSIBLE</span>
                <Modal.Title>¿Vaciar el pedido actual?</Modal.Title>
            </div>
        </Modal.Header>
        <Modal.Body>
            <div className="pos-confirmation-modal__warning">
                <i className="bi bi-cart-x" aria-hidden="true"/>
                <div><strong>Se quitarán {itemCount} productos</strong><p>El pedido por {total} no podrá recuperarse después de confirmar.</p></div>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="light" onClick={onCancel}>Conservar pedido</Button>
            <Button variant="danger" onClick={onConfirm}>Sí, vaciar pedido</Button>
        </Modal.Footer>
    </Modal>
);

export default ResetCartConfirmationModal;
