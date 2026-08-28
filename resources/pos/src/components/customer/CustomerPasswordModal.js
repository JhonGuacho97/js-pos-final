import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap-v5';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faKey } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import apiConfig from '../../config/apiConfig';
import { addToast } from '../../store/action/toastAction';
import { toastType } from '../../constants';

const CustomerPasswordModal = ({ show, customer, onHide, onSaved }) => {
    const dispatch = useDispatch();
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!show) return;
        setPassword('');
        setConfirmation('');
        setShowPassword(false);
        setShowConfirmation(false);
        setError('');
    }, [show, customer?.id]);

    const save = async () => {
        setError('');
        if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
            setError('La contraseña debe tener al menos 8 caracteres e incluir letras y números.');
            return;
        }
        if (password !== confirmation) {
            setError('La confirmación de la contraseña no coincide.');
            return;
        }

        setSaving(true);
        try {
            const response = await apiConfig.post(`customers/${customer.id}/change-password`, {
                password,
                password_confirmation: confirmation,
            });
            dispatch(addToast({ text: response.data.message || 'Contraseña actualizada correctamente.' }));
            onSaved();
        } catch ({ response }) {
            const message = Object.values(response?.data?.errors || {}).flat()[0]
                || response?.data?.message
                || 'No se pudo actualizar la contraseña.';
            setError(message);
            dispatch(addToast({ text: message, type: toastType.ERROR }));
        } finally {
            setSaving(false);
        }
    };

    return <Modal show={show} onHide={saving ? undefined : onHide} centered className="customer-password-modal">
        <Modal.Header closeButton={!saving}>
            <div className="customer-password-modal__heading">
                <span><FontAwesomeIcon icon={faKey} /></span>
                <div>
                    <small>ACCESO AL CATÁLOGO</small>
                    <Modal.Title>{customer?.has_catalog_account ? 'Cambiar contraseña' : 'Crear acceso del cliente'}</Modal.Title>
                    <p>{customer?.name}</p>
                </div>
            </div>
        </Modal.Header>
        <Modal.Body>
            {!customer?.has_catalog_account && <div className="customer-password-modal__notice">
                <i className="bi bi-person-check" />
                <span>Este cliente todavía no tiene una cuenta. Al guardar se creará su acceso al catálogo con el correo <strong>{customer?.email}</strong>.</span>
            </div>}
            <Form.Group className="mb-3">
                <Form.Label>Nueva contraseña</Form.Label>
                <InputGroup>
                    <Form.Control autoFocus type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" />
                    <Button variant="light" onClick={() => setShowPassword((value) => !value)}><FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} /></Button>
                </InputGroup>
            </Form.Group>
            <Form.Group>
                <Form.Label>Confirmar contraseña</Form.Label>
                <InputGroup>
                    <Form.Control type={showConfirmation ? 'text' : 'password'} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="new-password" />
                    <Button variant="light" onClick={() => setShowConfirmation((value) => !value)}><FontAwesomeIcon icon={showConfirmation ? faEyeSlash : faEye} /></Button>
                </InputGroup>
            </Form.Group>
            <div className="customer-password-modal__hint">Mínimo 8 caracteres, con letras y números.</div>
            {error && <div className="customer-password-modal__error">{error}</div>}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="light" onClick={onHide} disabled={saving}>Cancelar</Button>
            <Button variant="primary" onClick={save} disabled={saving || !password || !confirmation}>{saving ? 'Guardando…' : customer?.has_catalog_account ? 'Actualizar contraseña' : 'Crear acceso'}</Button>
        </Modal.Footer>
    </Modal>;
};

export default CustomerPasswordModal;
