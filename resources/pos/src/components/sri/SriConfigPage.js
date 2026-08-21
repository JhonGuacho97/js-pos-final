import React, { useState, useEffect, useRef } from "react";
import apiConfig from "../../config/apiConfig";
import { addToast } from "../../store/action/toastAction";
import { useDispatch } from "react-redux";
import MasterLayout from "../MasterLayout";
import HeaderTitle from "../header/HeaderTitle";
import { Modal } from "react-bootstrap-v5";
import { useLocation } from "react-router-dom";
import "../../assets/scss/custom/pages/sri-config.scss";

const SriConfigPage = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const fileRef = useRef();

    const [config, setConfig] = useState({
        sri_ruc: "",
        sri_razon_social: "",
        sri_nombre_comercial: "",
        sri_dir_matriz: "",
        sri_estab: "001",
        sri_pto_emi: "001",
        sri_ambiente: "1",
        sri_obligado_contabilidad: "SI",
        sri_regimen_rimpe: "",
    });

    const [certInfo, setCertInfo] = useState(null);
    const [clave, setClave] = useState("");
    const [archivo, setArchivo] = useState(null);
    const [subiendoCert, setSubiendoCert] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [configLoaded, setConfigLoaded] = useState(false);
    const [sequenceScope, setSequenceScope] = useState(null);
    const [sequences, setSequences] = useState([]);
    const [sequenceLoading, setSequenceLoading] = useState(false);
    const [selectedSequence, setSelectedSequence] = useState(null);
    const [sequenceForm, setSequenceForm] = useState({
        ultimo_secuencial: 0,
        motivo: "",
        confirmado: false,
    });
    const [savingSequence, setSavingSequence] = useState(false);

    const [logoUrl, setLogoUrl] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [subiendoLogo, setSubiendoLogo] = useState(false);
    const [eliminandoLogo, setEliminandoLogo] = useState(false);
    const logoInputRef = useRef();

    useEffect(() => {
        apiConfig.get("/sri-config")
            .then((res) => {
                const data = res.data.data;
                const loadedConfig = { ...config, ...data.config };
                const params = new URLSearchParams(location.search);
                const queryScope = {
                    ambiente: params.get("ambiente"),
                    estab: params.get("estab"),
                    pto_emi: params.get("pto_emi"),
                };
                const hasValidQueryScope = ["1", "2"].includes(queryScope.ambiente)
                    && /^\d{3}$/.test(queryScope.estab || "")
                    && /^\d{3}$/.test(queryScope.pto_emi || "");

                setConfig(loadedConfig);
                setSequenceScope(hasValidQueryScope ? queryScope : {
                    ambiente: String(loadedConfig.sri_ambiente || "1"),
                    estab: loadedConfig.sri_estab || "001",
                    pto_emi: loadedConfig.sri_pto_emi || "001",
                });
                setCertInfo(data.cert_info);
                setLogoUrl(data.config?.sri_logo || null);
            })
            .catch((err) => {
                dispatch(addToast({
                    text: err.response?.data?.message || "No se pudo cargar la configuración SRI.",
                    type: "error",
                }));
            })
            .finally(() => setConfigLoaded(true));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadSequences = async (scope = sequenceScope) => {
        if (!scope || !["1", "2"].includes(String(scope.ambiente))
            || !/^\d{3}$/.test(scope.estab || "")
            || !/^\d{3}$/.test(scope.pto_emi || "")) return;

        setSequenceLoading(true);
        try {
            const res = await apiConfig.get("/sri-config/sequences", { params: scope });
            setSequences(res.data.data || []);
        } catch (err) {
            dispatch(addToast({
                text: err.response?.data?.message || "No se pudo cargar la numeración SRI.",
                type: "error",
            }));
        } finally {
            setSequenceLoading(false);
        }
    };

    useEffect(() => {
        if (!configLoaded || !sequenceScope) return;
        const timer = setTimeout(() => loadSequences(sequenceScope), 250);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [configLoaded, sequenceScope?.ambiente, sequenceScope?.estab, sequenceScope?.pto_emi]);

    // Libera el object URL de la previsualización local para no
    // acumular memoria si el usuario cambia de archivo varias veces
    // antes de subirlo.
    useEffect(() => {
        return () => {
            if (logoPreview) URL.revokeObjectURL(logoPreview);
        };
    }, [logoPreview]);

    const handleArchivoChange = (e) => {
        setArchivo(e.target.files[0] || null);
    };

    const handleSubirCertificado = async () => {
        if (!archivo || !clave) {
            dispatch(addToast({ text: "Selecciona el archivo y la clave.", type: "error" }));
            return;
        }

        setSubiendoCert(true);
        const formData = new FormData();
        formData.append("certificado", archivo);
        formData.append("clave", clave);

        try {
            const res = await apiConfig.post("/sri-config/certificado", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const data = res.data.data;
            setCertInfo({ valido: true, titular: data.titular, valid_hasta: data.valid_hasta });

            // Autocompletar RUC, razón social y dirección desde el
            // SRI (la razón social/dirección nunca vienen del propio
            // certificado -- son datos del registro de RUC).
            if (data.ruc_detectado) {
                setConfig((prev) => ({
                    ...prev,
                    sri_ruc: data.ruc_detectado,
                    sri_razon_social: data.razon_social || prev.sri_razon_social,
                    sri_dir_matriz: data.dir_matriz || prev.sri_dir_matriz,
                }));
            }

            if (data.ruc_detectado && !data.datos_sri_disponibles) {
                dispatch(addToast({
                    text: "No se pudo consultar razón social/dirección al SRI (por ejemplo, si el servicio de consulta se quedó sin créditos). Puedes completarlos a mano abajo.",
                }));
            }

            dispatch(addToast({ text: "Certificado validado correctamente." }));
            setArchivo(null);
            setClave("");
            if (fileRef.current) fileRef.current.value = "";
        } catch (err) {
            dispatch(addToast({
                text: err.response?.data?.message || "Error al subir el certificado.",
                type: "error",
            }));
        } finally {
            setSubiendoCert(false);
        }
    };

    const handleLogoFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const handleSubirLogo = async () => {
        if (!logoFile) return;

        setSubiendoLogo(true);
        const formData = new FormData();
        formData.append("logo", logoFile);

        try {
            const res = await apiConfig.post("/sri-config/logo", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setLogoUrl(res.data.data.logo_url);
            setLogoFile(null);
            setLogoPreview(null);
            if (logoInputRef.current) logoInputRef.current.value = "";
            dispatch(addToast({ text: "Logo actualizado correctamente." }));
        } catch (err) {
            dispatch(addToast({
                text: err.response?.data?.message || "Error al subir el logo.",
                type: "error",
            }));
        } finally {
            setSubiendoLogo(false);
        }
    };

    const handleCancelarLogo = () => {
        setLogoFile(null);
        setLogoPreview(null);
        if (logoInputRef.current) logoInputRef.current.value = "";
    };

    const handleEliminarLogo = async () => {
        setEliminandoLogo(true);
        try {
            await apiConfig.delete("/sri-config/logo");
            setLogoUrl(null);
            dispatch(addToast({ text: "Logo eliminado." }));
        } catch (err) {
            dispatch(addToast({
                text: err.response?.data?.message || "Error al eliminar el logo.",
                type: "error",
            }));
        } finally {
            setEliminandoLogo(false);
        }
    };

    const handleGuardar = async () => {
        setGuardando(true);
        try {
            await apiConfig.post("/sri-config/guardar", config);
            setSequenceScope({
                ambiente: String(config.sri_ambiente),
                estab: config.sri_estab,
                pto_emi: config.sri_pto_emi,
            });
            dispatch(addToast({ text: "Configuración SRI guardada correctamente." }));
        } catch (err) {
            dispatch(addToast({
                text: err.response?.data?.message || "Error al guardar la configuración.",
                type: "error",
            }));
        } finally {
            setGuardando(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig((prev) => ({ ...prev, [name]: value }));
        if (["sri_ambiente", "sri_estab", "sri_pto_emi"].includes(name)) {
            setSequenceScope((prev) => ({
                ambiente: name === "sri_ambiente" ? value : String(prev?.ambiente || config.sri_ambiente),
                estab: name === "sri_estab" ? value : (prev?.estab || config.sri_estab),
                pto_emi: name === "sri_pto_emi" ? value : (prev?.pto_emi || config.sri_pto_emi),
            }));
        }
    };

    const openSequenceModal = (sequence) => {
        const params = new URLSearchParams(location.search);
        setSelectedSequence(sequence);
        setSequenceForm({
            ultimo_secuencial: sequence.ultimo_secuencial,
            motivo: params.get("sequence_error") === "1"
                ? "Ajuste por secuencial previamente registrado en el SRI"
                : "",
            confirmado: false,
        });
    };

    const closeSequenceModal = () => {
        if (savingSequence) return;
        setSelectedSequence(null);
    };

    const saveSequence = async () => {
        if (!selectedSequence || !sequenceScope) return;
        setSavingSequence(true);
        try {
            const res = await apiConfig.put(
                `/sri-config/sequences/${selectedSequence.tipo_comprobante}`,
                {
                    ...sequenceScope,
                    ultimo_secuencial: Number(sequenceForm.ultimo_secuencial),
                    motivo: sequenceForm.motivo,
                    confirmado: sequenceForm.confirmado,
                }
            );
            dispatch(addToast({ text: res.data.message || "Numeración SRI actualizada." }));
            setSelectedSequence(null);
            await loadSequences(sequenceScope);
        } catch (err) {
            dispatch(addToast({
                text: err.response?.data?.message || "No se pudo actualizar la numeración.",
                type: "error",
            }));
        } finally {
            setSavingSequence(false);
        }
    };

    const formatSequence = (value) => String(Math.max(0, Number(value) || 0)).padStart(9, "0");
    const sequenceError = new URLSearchParams(location.search).get("sequence_error") === "1";

    return (
        <MasterLayout>
            <HeaderTitle title="Configuración Facturación Electrónica SRI" to="/app/settings" />

            {String(config.sri_ambiente) === "1" && (
                <div
                    className="d-flex align-items-start gap-2 p-3 mb-4 rounded"
                    style={{ backgroundColor: "#fffbe6", border: "1px solid #ffe58f", borderLeft: "5px solid #faad14" }}
                >
                    <i className="fas fa-exclamation-triangle mt-1" style={{ color: "#ad6800" }}></i>
                    <div style={{ color: "#874d00" }}>
                        <strong>Ambiente configurado en Pruebas (celcer.sri.gob.ec).</strong>{" "}
                        Los comprobantes que se emitan ahora, aunque el SRI los marque "AUTORIZADA", <strong>no son documentos tributarios válidos</strong> --
                        son solo para certificación/desarrollo. Si este negocio ya está facturando de verdad a clientes, cambiá "Ambiente" a
                        "Producción" abajo antes de seguir emitiendo.
                    </div>
                </div>
            )}

            {sequenceError && (
                <div className="sri-sequence-conflict-alert">
                    <span className="sri-sequence-conflict-alert__icon">
                        <i className="fas fa-triangle-exclamation" />
                    </span>
                    <div>
                        <strong>El SRI informó que el secuencial ya estaba registrado</strong>
                        <p>Consulta el último número utilizado en tu facturador anterior y ajusta el tipo de comprobante correspondiente. No necesitas ingresar a cPanel.</p>
                    </div>
                    <a href="#sri-sequence-control">Ir al control de numeración</a>
                </div>
            )}

            <section id="sri-sequence-control" className="sri-sequence-panel">
                <div className="sri-sequence-panel__header">
                    <div className="sri-sequence-panel__title">
                        <span className="sri-sequence-panel__icon"><i className="fas fa-arrow-down-1-9" /></span>
                        <div>
                            <span className="sri-sequence-panel__eyebrow">CONTROL TRIBUTARIO</span>
                            <h2>Numeración de comprobantes</h2>
                            <p>EcuaPos reservará el siguiente número de forma segura antes de generar cada XML.</p>
                        </div>
                    </div>
                    {sequenceScope && (
                        <div className="sri-sequence-scope">
                            <span className={String(sequenceScope.ambiente) === "2" ? "is-production" : "is-test"}>
                                {String(sequenceScope.ambiente) === "2" ? "Producción" : "Pruebas"}
                            </span>
                            <strong>{sequenceScope.estab}-{sequenceScope.pto_emi}</strong>
                        </div>
                    )}
                </div>

                <div className="sri-sequence-panel__notice">
                    <i className="fas fa-circle-info" />
                    <span>Ingresa el <strong>último número que ya utilizaste</strong>. EcuaPos calculará y mostrará el próximo automáticamente.</span>
                </div>

                <div className="sri-sequence-grid">
                    {sequenceLoading && [1, 2, 3].map((item) => (
                        <div className="sri-sequence-card is-loading" key={item}>
                            <span /><span /><span />
                        </div>
                    ))}

                    {!sequenceLoading && sequences.map((sequence) => {
                        const params = new URLSearchParams(location.search);
                        const highlighted = sequenceError && params.get("type") === sequence.tipo_comprobante;
                        return (
                            <article className={`sri-sequence-card ${highlighted ? "has-conflict" : ""}`} key={sequence.tipo_comprobante}>
                                <div className="sri-sequence-card__top">
                                    <span className="sri-sequence-card__document-icon">
                                        <i className={sequence.tipo_comprobante === "01" ? "fas fa-receipt" : sequence.tipo_comprobante === "04" ? "fas fa-file-circle-minus" : "fas fa-file-circle-plus"} />
                                    </span>
                                    <div>
                                        <span>TIPO {sequence.tipo_comprobante}</span>
                                        <h3>{sequence.label}</h3>
                                    </div>
                                    {highlighted && <em>Requiere ajuste</em>}
                                </div>
                                <div className="sri-sequence-card__numbers">
                                    <div>
                                        <span>Último protegido</span>
                                        <strong>{sequence.ultimo_formateado}</strong>
                                    </div>
                                    <i className="fas fa-arrow-right" />
                                    <div className="is-next">
                                        <span>Próximo a emitir</span>
                                        <strong>{sequence.proximo_formateado || "Serie agotada"}</strong>
                                    </div>
                                </div>
                                <div className="sri-sequence-card__footer">
                                    <span>
                                        {sequence.ultima_modificacion
                                            ? `Ajustado por ${sequence.ultima_modificacion.usuario}`
                                            : sequence.maximo_local > 0
                                                ? "Sincronizado con el historial local"
                                                : "Serie lista para configurar"}
                                    </span>
                                    <button type="button" onClick={() => openSequenceModal(sequence)}>
                                        <i className="fas fa-sliders" /> Ajustar
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            <div className="card mb-4">
                <div className="card-header">
                    <h5 className="mb-0">Certificado de Firma Electrónica (.p12)</h5>
                </div>
                <div className="card-body">

                    {/* Estado del certificado actual */}
                    {certInfo && (
                        <div
                            className="d-flex align-items-center justify-content-between p-3 mb-4 rounded"
                            style={{
                                backgroundColor: certInfo.valido ? "#f6ffed" : "#fff2f0",
                                border: `1px solid ${certInfo.valido ? "#b7eb8f" : "#ffccc7"}`,
                                borderLeft: `5px solid ${certInfo.valido ? "#52c41a" : "#ff4d4f"}`
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        fontWeight: 600,
                                        fontSize: "1rem",
                                        color: certInfo.valido ? "#237804" : "#a8071a"
                                    }}
                                >
                                    {certInfo.valido ? (
                                        <>
                                            <i className="fas fa-check-circle me-2"></i>
                                            Certificado válido
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-times-circle me-2"></i>
                                            Certificado inválido
                                        </>
                                    )}
                                </div>

                                {certInfo.titular && (
                                    <div
                                        style={{
                                            color: "#495057",
                                            fontWeight: 500,
                                            marginTop: 4
                                        }}
                                    >
                                        {certInfo.titular}
                                    </div>
                                )}

                                {certInfo.valid_hasta && (
                                    <div
                                        style={{
                                            color: "#6c757d",
                                            fontSize: "0.9rem",
                                            marginTop: 2
                                        }}
                                    >
                                        Vigente hasta: <strong>{certInfo.valid_hasta}</strong>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="row g-3">
                        <div className="col-md-5">
                            <label className="form-label">Archivo .p12 o .pfx</label>
                            <input
                                ref={fileRef}
                                type="file"
                                className="form-control"
                                accept=".p12,.pfx"
                                onChange={handleArchivoChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Clave del certificado</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Clave del archivo .p12"
                                value={clave}
                                onChange={(e) => setClave(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3 d-flex align-items-end">
                            <button
                                className="btn btn-primary w-100"
                                onClick={handleSubirCertificado}
                                disabled={subiendoCert || !archivo || !clave}
                            >
                                {subiendoCert ? (
                                    <><span className="spinner-border spinner-border-sm me-2" />Validando...</>
                                ) : "Subir y validar"}
                            </button>
                        </div>
                    </div>
                    <div className="form-text mt-1">
                        El certificado se almacena de forma segura en el servidor. La clave nunca se muestra después de guardada.
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">Datos del Emisor</h5>
                </div>
                <div className="card-body">
                    <div className="sri-logo-row">
                        <div className="sri-logo-thumb">
                            {logoPreview || logoUrl ? (
                                <img src={logoPreview || logoUrl} alt="Logo" />
                            ) : (
                                <span className="sri-logo-thumb-empty">Sin logo</span>
                            )}
                        </div>
                        <div className="flex-grow-1">
                            <div className="sri-logo-row-label">Logo del RIDE</div>
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                <label className="btn btn-sm btn-outline-primary mb-0">
                                    {logoUrl ? "Cambiar" : "Subir logo"}
                                    <input
                                        ref={logoInputRef}
                                        type="file"
                                        accept=".png,.jpg,.jpeg"
                                        className="d-none"
                                        onChange={handleLogoFileChange}
                                    />
                                </label>
                                {logoFile && (
                                    <>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={handleSubirLogo}
                                            disabled={subiendoLogo}
                                        >
                                            {subiendoLogo ? (
                                                <span className="spinner-border spinner-border-sm" />
                                            ) : "Guardar"}
                                        </button>
                                        <button
                                            className="btn btn-sm btn-link text-secondary text-decoration-none"
                                            onClick={handleCancelarLogo}
                                            disabled={subiendoLogo}
                                        >
                                            Cancelar
                                        </button>
                                    </>
                                )}
                                {logoUrl && !logoFile && (
                                    <button
                                        className="btn btn-sm btn-link text-danger text-decoration-none"
                                        onClick={handleEliminarLogo}
                                        disabled={eliminandoLogo}
                                    >
                                        {eliminandoLogo ? "Quitando..." : "Quitar"}
                                    </button>
                                )}
                            </div>
                            <div className="sri-logo-row-hint">
                                PNG o JPG, máx. 2 MB -- aparece en el RIDE de tus facturas y notas de crédito.
                            </div>
                        </div>
                    </div>

                    <div className="row g-3">

                        <div className="col-md-4">
                            <label className="form-label">RUC <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                name="sri_ruc"
                                className="form-control"
                                maxLength={13}
                                value={config.sri_ruc}
                                onChange={handleChange}
                                placeholder="0912345678001"
                            />
                        </div>

                        <div className="col-md-8">
                            <label className="form-label">Razón Social <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                name="sri_razon_social"
                                className="form-control"
                                value={config.sri_razon_social}
                                onChange={handleChange}
                                placeholder="Mi Empresa S.A."
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Nombre Comercial</label>
                            <input
                                type="text"
                                name="sri_nombre_comercial"
                                className="form-control"
                                value={config.sri_nombre_comercial}
                                onChange={handleChange}
                                placeholder="Igual a razón social si no aplica"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Dirección Matriz <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                name="sri_dir_matriz"
                                className="form-control"
                                value={config.sri_dir_matriz}
                                onChange={handleChange}
                                placeholder="Av. Principal 123, Guayaquil"
                            />
                        </div>

                        <div className="col-md-2">
                            <label className="form-label">Establecimiento <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                name="sri_estab"
                                className="form-control"
                                maxLength={3}
                                value={config.sri_estab}
                                onChange={handleChange}
                                placeholder="001"
                            />
                        </div>

                        <div className="col-md-2">
                            <label className="form-label">Punto Emisión <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                name="sri_pto_emi"
                                className="form-control"
                                maxLength={3}
                                value={config.sri_pto_emi}
                                onChange={handleChange}
                                placeholder="001"
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Ambiente <span className="text-danger">*</span></label>
                            <select
                                name="sri_ambiente"
                                className="form-select"
                                value={config.sri_ambiente}
                                onChange={handleChange}
                            >
                                <option value="1">🧪 Pruebas (celcer.sri.gob.ec)</option>
                                <option value="2">🏭 Producción (cel.sri.gob.ec)</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Obligado a llevar contabilidad <span className="text-danger">*</span></label>
                            <select
                                name="sri_obligado_contabilidad"
                                className="form-select"
                                value={config.sri_obligado_contabilidad}
                                onChange={handleChange}
                            >
                                <option value="SI">Sí</option>
                                <option value="NO">No</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Régimen RIMPE</label>
                            <select
                                name="sri_regimen_rimpe"
                                className="form-select"
                                value={config.sri_regimen_rimpe}
                                onChange={handleChange}
                            >
                                <option value="">No aplica</option>
                                <option value="EMPRENDEDOR">RIMPE Emprendedor</option>
                                <option value="NEGOCIO_POPULAR">RIMPE Negocio Popular</option>
                            </select>
                            <div className="form-text">
                                Solo si tu RUC está bajo este régimen -- agrega la leyenda obligatoria en el XML.
                            </div>
                        </div>

                    </div>

                    <div className="mt-4 d-flex justify-content-end">
                        <button
                            className="btn btn-success px-5"
                            onClick={handleGuardar}
                            disabled={guardando}
                        >
                            {guardando ? (
                                <><span className="spinner-border spinner-border-sm me-2" />Guardando...</>
                            ) : "Guardar configuración"}
                        </button>
                    </div>
                </div>
            </div>

            <Modal
                show={Boolean(selectedSequence)}
                onHide={closeSequenceModal}
                centered
                dialogClassName="sri-sequence-modal"
                backdrop={savingSequence ? "static" : true}
            >
                {selectedSequence && (
                    <>
                        <Modal.Header closeButton={!savingSequence}>
                            <div className="sri-sequence-modal__heading">
                                <span><i className="fas fa-shield-halved" /></span>
                                <div>
                                    <small>AJUSTE PROTEGIDO</small>
                                    <h2>{selectedSequence.label}</h2>
                                    <p>Serie {sequenceScope?.estab}-{sequenceScope?.pto_emi} · {String(sequenceScope?.ambiente) === "2" ? "Producción" : "Pruebas"}</p>
                                </div>
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="sri-sequence-modal__current">
                                <div>
                                    <span>Último protegido actualmente</span>
                                    <strong>{selectedSequence.ultimo_formateado}</strong>
                                </div>
                                <i className="fas fa-arrow-right" />
                                <div>
                                    <span>Próximo actual</span>
                                    <strong>{selectedSequence.proximo_formateado}</strong>
                                </div>
                            </div>

                            <label className="sri-sequence-modal__field">
                                <span>Último secuencial utilizado anteriormente</span>
                                <input
                                    type="number"
                                    min={selectedSequence.ultimo_secuencial}
                                    max="999999998"
                                    value={sequenceForm.ultimo_secuencial}
                                    onChange={(event) => setSequenceForm((prev) => ({ ...prev, ultimo_secuencial: event.target.value }))}
                                />
                                <small>No ingreses el próximo número; escribe el último que ya fue utilizado o registrado.</small>
                            </label>

                            <div className="sri-sequence-modal__preview">
                                <span>Después de guardar, EcuaPos emitirá:</span>
                                <strong>
                                    {sequenceScope?.estab}-{sequenceScope?.pto_emi}-{formatSequence(Number(sequenceForm.ultimo_secuencial) + 1)}
                                </strong>
                            </div>

                            <label className="sri-sequence-modal__field">
                                <span>Motivo del ajuste</span>
                                <textarea
                                    rows="3"
                                    maxLength="500"
                                    value={sequenceForm.motivo}
                                    onChange={(event) => setSequenceForm((prev) => ({ ...prev, motivo: event.target.value }))}
                                    placeholder="Ej. Migración desde el facturador anterior"
                                />
                            </label>

                            <label className="sri-sequence-modal__confirmation">
                                <input
                                    type="checkbox"
                                    checked={sequenceForm.confirmado}
                                    onChange={(event) => setSequenceForm((prev) => ({ ...prev, confirmado: event.target.checked }))}
                                />
                                <span>Confirmo que verifiqué el último secuencial utilizado y entiendo que esta numeración no podrá disminuirse.</span>
                            </label>
                        </Modal.Body>
                        <Modal.Footer>
                            <button type="button" className="btn btn-light" onClick={closeSequenceModal} disabled={savingSequence}>Cancelar</button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={saveSequence}
                                disabled={savingSequence
                                    || !sequenceForm.confirmado
                                    || sequenceForm.motivo.trim().length < 10
                                    || Number(sequenceForm.ultimo_secuencial) <= selectedSequence.ultimo_secuencial
                                    || Number(sequenceForm.ultimo_secuencial) > 999999998}
                            >
                                {savingSequence
                                    ? <><span className="spinner-border spinner-border-sm me-2" />Guardando...</>
                                    : <><i className="fas fa-shield-check me-2" />Guardar numeración</>}
                            </button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </MasterLayout>
    );
};

export default SriConfigPage;
