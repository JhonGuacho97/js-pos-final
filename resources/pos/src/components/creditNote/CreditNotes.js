import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiConfig from "../../config/apiConfig";
import MasterLayout from "../MasterLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import TabTitle from "../../shared/tab-title/TabTitle";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import ResourceListHeader from "../../shared/components/ResourceListHeader";
import "../../assets/scss/custom/pages/resource-list.scss";
import "../../assets/scss/custom/pages/fiscal-documents.scss";

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

    const activasVisibles = creditNotes.filter(
        (creditNote) => !creditNote.esta_cancelada
    ).length;
    const canceladasVisibles = creditNotes.filter(
        (creditNote) => creditNote.esta_cancelada
    ).length;
    const totalVisible = creditNotes.reduce(
        (total, creditNote) => total + Number(creditNote.grand_total || 0),
        0
    );
    const creditNoteStats = [
        {
            label: "Notas registradas",
            value: meta.total || 0,
            helper: "Total de resultados",
            tone: "primary",
        },
        {
            label: "Activas visibles",
            value: activasVisibles,
            helper: creditNotes.length + " en esta página",
            tone: "success",
        },
        {
            label: "Canceladas visibles",
            value: canceladasVisibles,
            helper: "Documentos anulados",
            tone: canceladasVisibles ? "warning" : "success",
        },
        {
            label: "Total visible",
            value: "$ " + totalVisible.toFixed(2),
            helper: "Valor de esta página",
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title="Notas de Crédito" />
            <div className="resource-list-v2 fiscal-documents-v2 credit-notes-v2">
                <ResourceListHeader
                    eyebrow="Ajustes y devoluciones"
                    title="Notas de Crédito"
                    description="Consulta correcciones, devoluciones y anulaciones relacionadas con tus comprobantes de venta."
                    type="credit-notes"
                    stats={creditNoteStats}
                />

            <div className="fiscal-table-shell">
                    <div className="fiscal-toolbar fiscal-credit-toolbar">
                        <form
                            className="fiscal-credit-search"
                            onSubmit={(event) => {
                                event.preventDefault();
                                cargar(1);
                            }}
                        >
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por número, motivo..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                            <button type="submit" className="btn btn-light-primary">
                                Buscar
                            </button>
                        </form>
                        <Link to="/app/credit-notes/create" className="btn btn-primary fiscal-primary-action">
                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                            Nueva Nota de Crédito
                        </Link>
                    </div>

                    <div className="fiscal-table-wrap">
                        <table className="table fiscal-table">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>N° Nota de Crédito</th>
                                    <th>Comprobante Corregido</th>
                                    <th>Cliente</th>
                                    <th>Concepto</th>
                                    <th>Motivo</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cargando && (
                                    <tr><td colSpan={9} className="fiscal-empty-state">Cargando notas de crédito...</td></tr>
                                )}
                                {!cargando && creditNotes.length === 0 && (
                                    <tr><td colSpan={9} className="fiscal-empty-state">Sin notas de crédito registradas.</td></tr>
                                )}
                                {creditNotes.map((cn) => (
                                    <tr key={cn.id}>
                                        <td>{cn.date}</td>
                                        <td>
                                            <Link to={`/app/credit-notes/${cn.id}`} className="fiscal-document-link">
                                                {cn.reference_code}
                                            </Link>
                                        </td>
                                        <td>{cn.numero_comprobante_modificado}</td>
                                        <td>{cn.customer_name}</td>
                                        <td>
                                            <span className="fiscal-type-badge">
                                                {CONCEPTO_LABEL[cn.concepto] || cn.concepto}
                                            </span>
                                        </td>
                                        <td className="fiscal-reason" title={cn.motivo}>{cn.motivo}</td>
                                        <td className="fw-bold">{"$ " + Number(cn.grand_total || 0).toFixed(2)}</td>
                                        <td>
                                            {cn.esta_cancelada ? (
                                                <span className="fiscal-state-badge fiscal-state-badge--cancelled">Cancelada</span>
                                            ) : (
                                                <span className="fiscal-state-badge fiscal-state-badge--active">Activa</span>
                                            )}
                                        </td>
                                        <td>
                                            <Link to={`/app/credit-notes/${cn.id}`} className="btn btn-sm btn-outline-primary fiscal-action-button">
                                                <FontAwesomeIcon icon={faEye} className="me-1" />
                                                Ver
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="fiscal-pagination">
                        <div className="d-flex gap-1">
                            <button className="btn" disabled={meta.current_page <= 1} onClick={() => cargar(meta.current_page - 1)}>
                                ‹ Anterior
                            </button>
                            <button className="btn" disabled={meta.current_page >= meta.last_page} onClick={() => cargar(meta.current_page + 1)}>
                                Siguiente ›
                            </button>
                        </div>
                        <span className="fiscal-pagination-total">Total registros: {meta.total}</span>
                    </div>
            </div>
            </div>
        </MasterLayout>
    );
};

export default CreditNotes;
