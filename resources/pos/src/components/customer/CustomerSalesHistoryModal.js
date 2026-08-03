import React, { useEffect, useState } from "react";
import { Modal, Tab, Tabs } from "react-bootstrap";
import apiConfig from "../../config/apiConfig";

const useListado = (customerId, endpoint, activo) => {
    const [filas, setFilas] = useState([]);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [search, setSearch] = useState("");
    const [pageSize, setPageSize] = useState(15);
    const [cargando, setCargando] = useState(false);
    const montado = React.useRef(true);
    React.useEffect(() => () => { montado.current = false; }, []);

    const cargar = (page = 1, overrides = {}) => {
        if (!customerId) return;
        setCargando(true);
        const params = { search, per_page: pageSize, page, ...overrides };
        apiConfig
            .get(`/customers/${customerId}/${endpoint}`, { params })
            .then((res) => {
                if (!montado.current) return;
                const data = res.data.data;
                setFilas(data.data || []);
                setMeta({
                    current_page: data.current_page,
                    last_page: data.last_page,
                    total: data.total,
                });
            })
            .finally(() => montado.current && setCargando(false));
    };

    useEffect(() => {
        if (activo) cargar(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activo, customerId]);

    // Búsqueda en vivo con debounce -- mismo patrón que ya usa
    // Documentos Electrónicos, no depende de apretar Enter. No dispara
    // en el primer render de cada pestaña, solo cuando el usuario
    // efectivamente escribe algo.
    const primerRender = React.useRef(true);
    useEffect(() => {
        if (!activo) return;
        if (primerRender.current) {
            primerRender.current = false;
            return;
        }
        const timer = setTimeout(() => cargar(1, { search }), 400);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    return { filas, meta, search, setSearch, pageSize, setPageSize, cargando, cargar };
};

const BarraFiltros = ({ search, setSearch, onBuscar, pageSize, setPageSize, onCambiarPageSize }) => (
    <div className="d-flex justify-content-between align-items-center mb-3">
        <input
            type="text"
            className="form-control"
            style={{ maxWidth: 280 }}
            placeholder="Búsqueda inteligente"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onBuscar()}
        />
        <div className="d-flex align-items-center gap-2">
            <span className="fw-bold">Mostrar:</span>
            <select
                className="form-select"
                style={{ width: 80 }}
                value={pageSize}
                onChange={(e) => onCambiarPageSize(Number(e.target.value))}
            >
                {[15, 25, 50].map((n) => (
                    <option key={n} value={n}>{n}</option>
                ))}
            </select>
        </div>
    </div>
);

const PiePaginacion = ({ meta, onCambiarPagina }) => (
    <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="d-flex gap-1">
            <button className="btn btn-sm btn-light" disabled={meta.current_page <= 1}
                onClick={() => onCambiarPagina(meta.current_page - 1)}>
                ‹ Anterior
            </button>
            {Array.from({ length: meta.last_page }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === meta.last_page || Math.abs(p - meta.current_page) <= 1)
                .map((p, i, arr) => (
                    <React.Fragment key={p}>
                        {i > 0 && arr[i - 1] !== p - 1 && <span className="px-1">…</span>}
                        <button
                            className={`btn btn-sm ${p === meta.current_page ? "btn-primary" : "btn-light"}`}
                            onClick={() => onCambiarPagina(p)}
                        >
                            {p}
                        </button>
                    </React.Fragment>
                ))}
            <button className="btn btn-sm btn-light" disabled={meta.current_page >= meta.last_page}
                onClick={() => onCambiarPagina(meta.current_page + 1)}>
                Siguiente ›
            </button>
        </div>
        <span className="text-primary fw-bold small">Total registros: {meta.total}</span>
    </div>
);

const CustomerSalesHistoryModal = ({ show, onHide, customer }) => {
    const [tab, setTab] = useState("resumen");

    const resumen = useListado(customer?.id, "sales-summary", show && tab === "resumen");
    const detalle = useListado(customer?.id, "sales-detail", show && tab === "detalle");

    return (
        <Modal show={show} onHide={onHide} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Historial de {customer?.name} - {customer?.identification || "9999999999999"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tabs activeKey={tab} onSelect={setTab} className="mb-3 gap-5">
                    <Tab eventKey="resumen" title="Resumen de Ventas">
                        <BarraFiltros
                            search={resumen.search} setSearch={resumen.setSearch}
                            onBuscar={() => resumen.cargar(1)}
                            pageSize={resumen.pageSize}
                            onCambiarPageSize={(n) => { resumen.setPageSize(n); resumen.cargar(1, { per_page: n }); }}
                        />
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Nro. Orden</th>
                                        <th>Nro. Documento</th>
                                        <th>Fecha Venta</th>
                                        <th>Tipo Documento</th>
                                        <th>Canal Venta</th>
                                        <th>Forma de Pago</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resumen.cargando && (
                                        <tr><td colSpan={7} className="text-center text-muted">Cargando...</td></tr>
                                    )}
                                    {!resumen.cargando && resumen.filas.length === 0 && (
                                        <tr><td colSpan={7} className="text-center text-muted">Sin ventas registradas.</td></tr>
                                    )}
                                    {resumen.filas.map((fila, i) => (
                                        <tr key={i}>
                                            <td>{fila.nro_orden}</td>
                                            <td className="text-primary">{fila.nro_documento}</td>
                                            <td>{fila.fecha_venta}</td>
                                            <td>{fila.tipo_documento}</td>
                                            <td>{fila.canal_venta}</td>
                                            <td>{fila.forma_pago}</td>
                                            <td>${Number(fila.total).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <PiePaginacion meta={resumen.meta} onCambiarPagina={(p) => resumen.cargar(p)} />
                    </Tab>

                    <Tab eventKey="detalle" title="Detalle de Ventas">
                        <BarraFiltros
                            search={detalle.search} setSearch={detalle.setSearch}
                            onBuscar={() => detalle.cargar(1)}
                            pageSize={detalle.pageSize}
                            onCambiarPageSize={(n) => { detalle.setPageSize(n); detalle.cargar(1, { per_page: n }); }}
                        />
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Nro. Orden</th>
                                        <th>Nro. Documento</th>
                                        <th>Fecha Venta</th>
                                        <th>Código Producto</th>
                                        <th>Producto/Servicio</th>
                                        <th>Unidad Medida</th>
                                        <th>Unidades</th>
                                        <th>Precio</th>
                                        <th>Descuento</th>
                                        <th>IVA</th>
                                        <th>Subtotal</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detalle.cargando && (
                                        <tr><td colSpan={12} className="text-center text-muted">Cargando...</td></tr>
                                    )}
                                    {!detalle.cargando && detalle.filas.length === 0 && (
                                        <tr><td colSpan={12} className="text-center text-muted">Sin líneas registradas.</td></tr>
                                    )}
                                    {detalle.filas.map((fila, i) => (
                                        <tr key={i}>
                                            <td>{fila.nro_orden}</td>
                                            <td className="text-primary">{fila.nro_documento}</td>
                                            <td>{fila.fecha_venta}</td>
                                            <td>{fila.codigo_producto}</td>
                                            <td>{fila.producto}</td>
                                            <td>{fila.unidad_medida}</td>
                                            <td>{fila.unidades}</td>
                                            <td>${Number(fila.precio).toFixed(2)}</td>
                                            <td>${Number(fila.descuento).toFixed(2)}</td>
                                            <td>${Number(fila.iva).toFixed(2)}</td>
                                            <td>${Number(fila.subtotal).toFixed(2)}</td>
                                            <td>${Number(fila.total).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <PiePaginacion meta={detalle.meta} onCambiarPagina={(p) => detalle.cargar(p)} />
                    </Tab>
                </Tabs>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-light" onClick={onHide}>Cerrar</button>
            </Modal.Footer>
        </Modal>
    );
};

export default CustomerSalesHistoryModal;
