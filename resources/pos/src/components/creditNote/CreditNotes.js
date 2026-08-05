import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiConfig from "../../config/apiConfig";
import MasterLayout from "../MasterLayout";

const CONCEPTO_LABEL = {
    POR_DEVOLUCION: "Por Devolución",
    POR_DESCUENTO: "Por Descuento",
    POR_CORRECCION_PRECIO: "Por Corrección de Precio",
    POR_ERROR_FACTURACION: "Por Error de Facturación",
    OTRO: "Otro",
};

const CreditNotes = () => {
    const [creditNotes, setCreditNotes] = useState([]);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [search, setSearch] = useState("");
    const [cargando, setCargando] = useState(false);

    const cargar = (page = 1) => {
        setCargando(true);
        apiConfig
            .get("/credit-notes", { params: { search, page } })
            .then((res) => {
                const data = res.data.data;
                setCreditNotes(data.data || []);
                setMeta({ current_page: data.current_page, last_page: data.last_page, total: data.total });
            })
            .finally(() => setCargando(false));
    };

    useEffect(() => {
        cargar(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MasterLayout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Notas de Crédito</h4>
            </div>
            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <input
                            type="text"
                            className="form-control"
                            style={{ maxWidth: 280 }}
                            placeholder="Buscar por número, motivo..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && cargar(1)}
                        />
                        <Link to="/app/credit-notes/create" className="btn btn-primary">
                            + Nueva Nota de Crédito
                        </Link>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>N° Nota de Crédito</th>
                                    <th>Comprobante Corregido</th>
                                    <th>Cliente</th>
                                    <th>Concepto</th>
                                    <th>Motivo</th>
                                    <th>Total</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cargando && (
                                    <tr><td colSpan={8} className="text-center text-muted">Cargando...</td></tr>
                                )}
                                {!cargando && creditNotes.length === 0 && (
                                    <tr><td colSpan={8} className="text-center text-muted">Sin notas de crédito registradas.</td></tr>
                                )}
                                {creditNotes.map((cn) => (
                                    <tr key={cn.id}>
                                        <td>{cn.date}</td>
                                        <td>
                                            <Link to={`/app/credit-notes/${cn.id}`} className="text-primary">
                                                {cn.reference_code}
                                            </Link>
                                        </td>
                                        <td>{cn.numero_comprobante_modificado}</td>
                                        <td>{cn.customer_name}</td>
                                        <td>{CONCEPTO_LABEL[cn.concepto] || cn.concepto}</td>
                                        <td>{cn.motivo}</td>
                                        <td>${Number(cn.grand_total || 0).toFixed(2)}</td>
                                        <td>
                                            <Link to={`/app/credit-notes/${cn.id}`} className="btn btn-sm btn-outline-primary">
                                                Ver detalle
                                            </Link>
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
                </div>
            </div>
        </MasterLayout>
    );
};

export default CreditNotes;
