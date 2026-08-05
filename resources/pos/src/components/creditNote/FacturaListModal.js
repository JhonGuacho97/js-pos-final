import React, { useEffect, useState } from "react";
import { Modal, Tab, Tabs } from "react-bootstrap";
import apiConfig from "../../config/apiConfig";

const FacturaListModal = ({ show, onHide, customerId, onSeleccionar }) => {
    const [facturas, setFacturas] = useState([]);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [search, setSearch] = useState("");
    const [pageSize, setPageSize] = useState(15);
    const [cargando, setCargando] = useState(false);

    const cargar = (page = 1, overrides = {}) => {
        if (!customerId) return;
        setCargando(true);
        apiConfig
            .get(`/credit-notes/facturas-cliente/${customerId}`, {
                params: { search, per_page: pageSize, page, ...overrides },
            })
            .then((res) => {
                const data = res.data.data;
                setFacturas(data.data || []);
                setMeta({ current_page: data.current_page, last_page: data.last_page, total: data.total });
            })
            .finally(() => setCargando(false));
    };

    useEffect(() => {
        if (show) cargar(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, customerId]);

    const primerRender = React.useRef(true);
    useEffect(() => {
        if (!show) return;
        if (primerRender.current) {
            primerRender.current = false;
            return;
        }
        const timer = setTimeout(() => cargar(1, { search }), 400);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    return (
        <Modal show={show} onHide={onHide} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>Listado de Comprobante</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tabs defaultActiveKey="facturas" className="mb-3">
                    <Tab eventKey="facturas" title="Facturas">
                        <div className="d-flex justify-content-between align-items-center my-3">
                            <input
                                type="text"
                                className="form-control"
                                style={{ maxWidth: 280 }}
                                placeholder="Búsqueda inteligente"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <div className="d-flex align-items-center gap-2">
                                <span className="fw-bold">Mostrar:</span>
                                <select
                                    className="form-select"
                                    style={{ width: 80 }}
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(Number(e.target.value));
                                        cargar(1, { per_page: Number(e.target.value) });
                                    }}
                                >
                                    {[15, 25, 50].map((n) => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Nro. Orden</th>
                                        <th>Nro. Documento</th>
                                        <th>Fecha Emisión</th>
                                        <th>Tipo Documento</th>
                                        <th>Forma de Pago</th>
                                        <th>Total</th>
                                        <th>Saldo</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cargando && (
                                        <tr><td colSpan={8} className="text-center text-muted">Cargando...</td></tr>
                                    )}
                                    {!cargando && facturas.length === 0 && (
                                        <tr><td colSpan={8} className="text-center text-muted">Sin comprobantes registrados.</td></tr>
                                    )}
                                    {facturas.map((f) => (
                                        <tr key={f.sale_id}>
                                            <td>{f.nro_orden}</td>
                                            <td className="text-primary">{f.numero_comprobante}</td>
                                            <td>{f.fecha_emision}</td>
                                            <td>{f.tipo_comprobante}</td>
                                            <td>{f.forma_pago}</td>
                                            <td>${Number(f.total).toFixed(2)}</td>
                                            <td>${Number(f.saldo).toFixed(2)}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => onSeleccionar(f)}
                                                >
                                                    Seleccionar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <div className="d-flex gap-1">
                                <button className="btn btn-sm btn-light" disabled={meta.current_page <= 1} onClick={() => cargar(meta.current_page - 1)}>
                                    ‹ Anterior
                                </button>
                                <button className="btn btn-sm btn-light" disabled={meta.current_page >= meta.last_page} onClick={() => cargar(meta.current_page + 1)}>
                                    Siguiente ›
                                </button>
                            </div>
                            <span className="text-primary fw-bold small">Total registros: {meta.total}</span>
                        </div>
                    </Tab>
                </Tabs>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <button className="btn btn-warning text-dark px-4" onClick={onHide}>
                    ✕ Cerrar
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default FacturaListModal;
