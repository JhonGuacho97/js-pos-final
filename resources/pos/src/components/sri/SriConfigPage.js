import React, { useState, useEffect, useRef } from "react";
import apiConfig from "../../config/apiConfig";
import { addToast } from "../../store/action/toastAction";
import { useDispatch } from "react-redux";
import MasterLayout from "../MasterLayout";
import HeaderTitle from "../header/HeaderTitle";
import { Card } from "react-bootstrap-v5";

const SriConfigPage = () => {
    const dispatch = useDispatch();
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
    });

    const [certInfo, setCertInfo] = useState(null);
    const [clave, setClave] = useState("");
    const [archivo, setArchivo] = useState(null);
    const [subiendoCert, setSubiendoCert] = useState(false);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        apiConfig.get("/sri-config").then((res) => {
            const data = res.data.data;
            console.log({ data });
            setConfig((prev) => ({ ...prev, ...data.config }));
            setCertInfo(data.cert_info);
        });
    }, []);

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

            // Autocompletar RUC y razón social desde el certificado
            if (data.ruc_detectado) {
                setConfig((prev) => ({
                    ...prev,
                    sri_ruc: data.ruc_detectado,
                    sri_razon_social: data.razon_social || prev.sri_razon_social,
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

    const handleGuardar = async () => {
        setGuardando(true);
        try {
            await apiConfig.post("/sri-config/guardar", config);
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
    };

    return (
        <MasterLayout>
            <HeaderTitle title="Configuración Facturación Electrónica SRI" to="/app/settings" />

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
        </MasterLayout>
    );
};

export default SriConfigPage;