import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import apiConfig from "../../config/apiConfig";

const CreditNoteCategoryModal = ({ show, onHide, onCreated }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);

    const handleGuardar = () => {
        if (!name.trim()) {
            setError("El nombre es obligatorio.");
            return;
        }
        setGuardando(true);
        apiConfig
            .post("/credit-note-categories", { name, description })
            .then((res) => {
                onCreated?.(res.data.data);
                setName("");
                setDescription("");
                setError("");
                onHide();
            })
            .catch(() => setError("No se pudo guardar la categoría."))
            .finally(() => setGuardando(false));
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Nueva categoría</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label className="form-label">Nombre: <span className="text-danger">*</span></label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Devoluciones por garantía"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Descripción:</label>
                    <textarea
                        className="form-control"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                {error && <div className="text-danger small">{error}</div>}
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-light" onClick={onHide}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleGuardar} disabled={guardando}>
                    Guardar
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreditNoteCategoryModal;
