import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faTriangleExclamation, faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import MasterLayout from "../MasterLayout";
import HeaderTitle from "../header/HeaderTitle";
import apiConfig from "../../config/apiConfig";
import { addToast } from "../../store/action/toastAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { ElectronicInvoiceStatusBadge } from "../sri/ElectronicInvoiceStatus";

const ESTADOS_SRI = [
    { value: "TODOS", label: "Todos" },
    { value: "PENDIENTE", label: "Pendiente" },
    { value: "RECIBIDA", label: "Enviada, esperando autorización" },
    { value: "AUTORIZADA", label: "Autorizada" },
    { value: "NO_AUTORIZADA", label: "Rechazada" },
    { value: "DEVUELTA", label: "Devuelta por el SRI" },
];

const TIPOS_COMPROBANTE = [
    { value: "TODOS", label: "Todos" },
    { value: "01", label: "Factura" },
    { value: "05", label: "Nota de débito" },
];

const hoy = () => new Date().toISOString().slice(0, 10);
const inicioDeMes = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
};

const ElectronicInvoices = () => {
    const dispatch = useDispatch();

    const filtrosPorDefecto = {
        fecha_desde: inicioDeMes(),
        fecha_hasta: hoy(),
        tipo_comprobante: "TODOS",
        estado: "TODOS",
    };

    // "filtros" es lo que el usuario va tocando en fecha/tipo/estado
    // (borrador). "filtrosAplicados" es lo que realmente se usa para
    // buscar -- solo se actualiza al hacer clic en "Buscar", así esos
    // campos no disparan una búsqueda con cada cambio.
    //
    // El texto de búsqueda es aparte: SÍ busca en vivo (con un pequeño
    // debounce), sin necesidad del botón.
    const [filtros, setFiltros] = useState(filtrosPorDefecto);
    const [filtrosAplicados, setFiltrosAplicados] = useState(filtrosPorDefecto);
    const [search, setSearch] = useState("");

    const [documentos, setDocumentos] = useState([]);
    const [resumen, setResumen] = useState({ no_autorizados: 0, saldo_total: 0 });
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(10);

    const cargar = useCallback((page = 1, overrides = {}) => {
        setLoading(true);
        const params = { ...filtrosAplicados, search, per_page: pageSize, ...overrides, page };
        // "TODOS" es solo un valor de UI -- no se manda como filtro real.
        if (params.tipo_comprobante === "TODOS") delete params.tipo_comprobante;
        if (params.estado === "TODOS") delete params.estado;
        if (!params.search) delete params.search;

        apiConfig
            .get("/electronic-invoices", { params })
            .then((res) => {
                setDocumentos(res.data.data.data || []);
                setResumen(res.data.resumen || { no_autorizados: 0, saldo_total: 0 });
                setMeta({
                    current_page: res.data.data.current_page,
                    last_page: res.data.data.last_page,
                    total: res.data.data.total,
                });
            })
            .catch((err) => {
                dispatch(addToast({
                    text: err.response?.data?.message || "Error al cargar los documentos electrónicos",
                    type: "error",
                }));
            })
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtrosAplicados, search, pageSize]);

    // Carga inicial, una sola vez.
    useEffect(() => {
        cargar(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Búsqueda en vivo del texto (con debounce) -- no dispara en el
    // primer render, solo cuando el usuario efectivamente escribe algo.
    const primerRender = React.useRef(true);
    useEffect(() => {
        if (primerRender.current) {
            primerRender.current = false;
            return;
        }
        const timer = setTimeout(() => {
            cargar(1, { search });
        }, 400);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const onFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({ ...prev, [name]: value }));
    };

    const onBuscar = (e) => {
        e.preventDefault();
        setFiltrosAplicados(filtros);
        cargar(1, { ...filtros, search });
    };

    const reintentar = async (saleId) => {
        try {
            await apiConfig.post(`/sales/${saleId}/electronic-invoice/reintentar`);
            dispatch(addToast({ text: "Reintentando la emisión de la factura electrónica." }));
            cargar(meta.current_page);
        } catch (err) {
            dispatch(addToast({
                text: err.response?.data?.message || "Error al reintentar la factura.",
                type: "error",
            }));
        }
    };

    const money = (n) => `$ ${Number(n || 0).toFixed(2)}`;

    return (
        <MasterLayout>
            <HeaderTitle title={getFormattedMessage("electronic-invoices.title")} to="/app/dashboard" />

            <form className="card mb-4" onSubmit={onBuscar}>
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-2">
                            <label className="form-label">Fecha inicio:</label>
                            <input
                                type="date"
                                name="fecha_desde"
                                className="form-control"
                                value={filtros.fecha_desde}
                                onChange={onFiltroChange}
                            />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Fecha fin:</label>
                            <input
                                type="date"
                                name="fecha_hasta"
                                className="form-control"
                                value={filtros.fecha_hasta}
                                onChange={onFiltroChange}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Tipo comprobante:</label>
                            <select
                                name="tipo_comprobante"
                                className="form-select"
                                value={filtros.tipo_comprobante}
                                onChange={onFiltroChange}
                            >
                                {TIPOS_COMPROBANTE.map((t) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Estado SRI:</label>
                            <select
                                name="estado"
                                className="form-select"
                                value={filtros.estado}
                                onChange={onFiltroChange}
                            >
                                {ESTADOS_SRI.map((e) => (
                                    <option key={e.value} value={e.value}>{e.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <button type="submit" className="btn btn-primary w-100">
                                <FontAwesomeIcon icon={faMagnifyingGlass} className="me-2" />
                                Buscar
                            </button>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Cliente / número de documento / referencia / clave de acceso:</label>
                            <input
                                type="text"
                                name="search"
                                className="form-control"
                                placeholder="Buscar por cliente, número de documento, número de venta o clave de acceso"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <div className="form-text">Este campo filtra automáticamente mientras escribes.</div>
                        </div>
                    </div>
                </div>
            </form>

            {resumen.no_autorizados > 0 && (
                <div className="alert alert-danger d-flex align-items-center">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="me-2" />
                    <span>
                        <strong>Atención:</strong> tienes <strong>{resumen.no_autorizados}</strong> documento
                        {resumen.no_autorizados === 1 ? "" : "s"} sin autorizar por el SRI (pendientes, rechazados
                        o devueltos). Revísalos y reintenta los que correspondan.
                    </span>
                </div>
            )}

            <div className="card mb-4">
                <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                        <div className="text-muted small">Saldo pendiente de cobro (ventas con factura electrónica)</div>
                        <div className="fs-3 fw-bold text-success">{money(resumen.saldo_total)}</div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold">Mostrar:</span>
                        <select
                            className="form-select"
                            style={{ width: 80 }}
                            value={pageSize}
                            onChange={(e) => {
                                const nuevoTamano = Number(e.target.value);
                                setPageSize(nuevoTamano);
                                cargar(1, { search, per_page: nuevoTamano });
                            }}
                        >
                            {[5, 10, 25, 50].map((n) => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>N° Documento</th>
                                <th>Tipo</th>
                                <th>Cliente</th>
                                <th>Estado</th>
                                <th>Firmado</th>
                                <th className="text-end">Total</th>
                                <th className="text-end">Saldo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={9} className="text-center py-4">
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Cargando...
                                    </td>
                                </tr>
                            )}
                            {!loading && documentos.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="text-center py-4 text-muted">
                                        No se encontraron documentos electrónicos con estos filtros.
                                    </td>
                                </tr>
                            )}
                            {!loading && documentos.map((doc) => (
                                <tr key={doc.id}>
                                    <td>{doc.fecha ? doc.fecha.slice(0, 16).replace("T", " ") : "-"}</td>
                                    <td>{doc.numero_comprobante}</td>
                                    <td>{doc.tipo_comprobante === "05" ? "Nota de débito" : "Factura"}</td>
                                    <td>{doc.cliente || "Consumidor Final"}</td>
                                    <td style={{ minWidth: 220 }}>
                                        <ElectronicInvoiceStatusBadge
                                            estado={doc.estado}
                                            data={doc}
                                            onReintentar={() => reintentar(doc.sale_id)}
                                        />
                                    </td>
                                    <td>{doc.firmado ? "Sí" : "No"}</td>
                                    <td className="text-end">{money(doc.total)}</td>
                                    <td className="text-end">{money(doc.saldo)}</td>
                                    <td>
                                        {doc.estado === "AUTORIZADA" && (
                                            <a
                                                href={`/api/electronic-invoices/${doc.id}/ride`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-outline-success"
                                                title="Descargar RIDE"
                                            >
                                                <FontAwesomeIcon icon={faFileInvoice} />
                                            </a>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="card-footer d-flex justify-content-between align-items-center">
                    <div>
                        <button
                            className="btn btn-light me-2"
                            disabled={meta.current_page <= 1}
                            onClick={() => cargar(meta.current_page - 1)}
                        >
                            ‹ Anterior
                        </button>
                        <button
                            className="btn btn-light"
                            disabled={meta.current_page >= meta.last_page}
                            onClick={() => cargar(meta.current_page + 1)}
                        >
                            Siguiente ›
                        </button>
                    </div>
                    <span className="text-primary fw-bold">
                        Total registros: {meta.total}
                    </span>
                </div>
            </div>
        </MasterLayout>
    );
};

export default ElectronicInvoices;
