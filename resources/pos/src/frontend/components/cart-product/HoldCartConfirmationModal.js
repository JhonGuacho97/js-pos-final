import React from 'react';
import {Button, Form, Modal} from 'react-bootstrap';

const HoldCartConfirmationModal = ({onCancel, onConfirm, onChangeInput, itemCount, total}) => (
    <Modal show onHide={onCancel} centered className="pos-modal pos-confirmation-modal">
        <Modal.Header closeButton>
            <div>
                <span className="pos-confirmation-modal__eyebrow">GUARDAR PARA DESPUÉS</span>
                <Modal.Title>Retener venta</Modal.Title>
            </div>
        </Modal.Header>
        <Modal.Body>
            <div className="pos-confirmation-modal__summary">
                <div><span>Productos</span><strong>{itemCount}</strong></div>
                <div><span>Total</span><strong>{total}</strong></div>
            </div>
            <Form.Group>
                <Form.Label>Referencia para encontrarla</Form.Label>
                <Form.Control autoFocus type="text" onChange={onChangeInput} placeholder="Ej. Mesa 4, pedido de Ana" maxLength={100}/>
                <Form.Text>La venta quedará disponible en la lista de ventas retenidas.</Form.Text>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="light" onClick={onCancel}>Cancelar</Button>
            <Button variant="primary" onClick={onConfirm}>Retener venta</Button>
        </Modal.Footer>
    </Modal>
);

export default HoldCartConfirmationModal;
