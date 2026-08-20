import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import MasterLayout from "../MasterLayout";
import HeaderTitle from "../header/HeaderTitle";
import apiConfig from "../../config/apiConfig";
import { addToast } from "../../store/action/toastAction";
import "./catalog-settings.scss";

const emptyConfig = {
    warehouse_id: "",
    is_enabled: false,
    whatsapp_number: "",
    headline: "",
    description: "",
    show_stock: false,
    allow_pickup: true,
    allow_delivery: false,
    delivery_fee: 0,
    minimum_order: 0,
    public_url: "",
};

const CatalogSettings = () => {
    const dispatch = useDispatch();
    const [config, setConfig] = useState(emptyConfig);
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        Promise.all([
            apiConfig.get("/catalog-settings"),
            apiConfig.get("/warehouses?page[size]=0"),
        ])
            .then(([configResponse, warehouseResponse]) => {
                setConfig({ ...emptyConfig, ...configResponse.data.data });
                setWarehouses(warehouseResponse.data.data || []);
            })
            .catch((error) => {
                dispatch(addToast({
                    text: error.response?.data?.message || "No se pudo cargar la configuración del catálogo.",
                    type: "error",
                }));
            })
            .finally(() => setLoading(false));
    }, [dispatch]);

    const setValue = (name, value) => {
        setConfig((current) => ({ ...current, [name]: value }));
    };

    const save = async (event) => {
        event.preventDefault();
        setSaving(true);

        try {
            const response = await apiConfig.put("/catalog-settings", {
                ...config,
                warehouse_id: Number(config.warehouse_id),
                delivery_fee: Number(config.delivery_fee || 0),
                minimum_order: Number(config.minimum_order || 0),
            });
            setConfig({ ...emptyConfig, ...response.data.data });
            dispatch(addToast({ text: "Catálogo virtual actualizado correctamente." }));
        } catch (error) {
            const validation = error.response?.data?.errors;
            const firstError = validation ? Object.values(validation).flat()[0] : null;
            dispatch(addToast({
                text: firstError || error.response?.data?.message || "No se pudo guardar la configuración.",
                type: "error",
            }));
        } finally {
            setSaving(false);
        }
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(config.public_url);
            dispatch(addToast({ text: "Enlace del catálogo copiado." }));
        } catch (_) {
            dispatch(addToast({ text: "No se pudo copiar el enlace. Selecciónalo manualmente.", type: "error" }));
        }
    };

    if (loading) {
        return (
            <MasterLayout>
                <div className="catalog-admin-loading">
                    <span className="spinner-border text-primary" />
                    <span>Cargando catálogo virtual...</span>
                </div>
            </MasterLayout>
        );
    }

    return (
        <MasterLayout>
            <HeaderTitle title="Catálogo virtual" to="/app/settings" />

            <form className="catalog-admin" onSubmit={save}>
                <section className="catalog-admin-hero">
                    <div className="catalog-admin-hero__icon">
                        <i className="fas fa-store" />
                    </div>
                    <div className="catalog-admin-hero__content">
                        <span className="catalog-admin-eyebrow">CANAL DE VENTAS DIGITAL</span>
                        <h2>Tu vitrina en línea, conectada al inventario</h2>
                        <p>Los clientes podrán explorar productos, elegir variantes y presentaciones, armar su carrito y enviarte el pedido por WhatsApp.</p>
                    </div>
                    <label className="catalog-admin-status">
                        <input
                            type="checkbox"
                            checked={config.is_enabled}
                            onChange={(event) => setValue("is_enabled", event.target.checked)}
                        />
                        <span className="catalog-admin-status__control" />
                        <span>{config.is_enabled ? "Publicado" : "Desactivado"}</span>
                    </label>
                </section>

                {config.public_url && (
                    <section className={`catalog-admin-link ${config.is_enabled ? "is-live" : ""}`}>
                        <div>
                            <span className="catalog-admin-link__label">ENLACE PÚBLICO</span>
                            <strong>{config.is_enabled ? "El catálogo está disponible" : "Activa el catálogo para publicarlo"}</strong>
                        </div>
                        <div className="catalog-admin-link__actions">
                            <input value={config.public_url} readOnly aria-label="Enlace público del catálogo" />
                            <button type="button" onClick={copyLink}><i className="far fa-copy" /> Copiar</button>
                            <a href={config.public_url} target="_blank" rel="noreferrer"><i className="fas fa-arrow-up-right-from-square" /> Abrir</a>
                        </div>
                    </section>
                )}

                <div className="catalog-admin-grid">
                    <section className="catalog-admin-card">
                        <div className="catalog-admin-card__heading">
                            <span className="catalog-admin-card__number">01</span>
                            <div><h3>Operación</h3><p>Define de dónde salen el stock y los pedidos.</p></div>
                        </div>
                        <div className="catalog-admin-fields">
                            <label className="catalog-admin-field">
                                <span>Bodega del catálogo <b>*</b></span>
                                <select value={config.warehouse_id || ""} onChange={(event) => setValue("warehouse_id", event.target.value)} required>
                                    <option value="">Selecciona una bodega</option>
                                    {warehouses.map((warehouse) => (
                                        <option key={warehouse.id} value={warehouse.id}>{warehouse.attributes?.name || warehouse.name}</option>
                                    ))}
                                </select>
                                <small>El precio y la disponibilidad se consultarán en esta bodega.</small>
                            </label>
                            <label className="catalog-admin-field">
                                <span>WhatsApp para pedidos <b>*</b></span>
                                <div className="catalog-admin-input-icon"><i className="fab fa-whatsapp" /><input type="tel" value={config.whatsapp_number || ""} onChange={(event) => setValue("whatsapp_number", event.target.value)} placeholder="Ej. 0991234567 o 593991234567" required={config.is_enabled} /></div>
                                <small>Acepta un número ecuatoriano o uno con código de país.</small>
                            </label>
                        </div>
                    </section>

                    <section className="catalog-admin-card">
                        <div className="catalog-admin-card__heading">
                            <span className="catalog-admin-card__number">02</span>
                            <div><h3>Presentación</h3><p>Personaliza el mensaje principal de tu tienda.</p></div>
                        </div>
                        <div className="catalog-admin-fields">
                            <label className="catalog-admin-field">
                                <span>Título del catálogo</span>
                                <input value={config.headline || ""} onChange={(event) => setValue("headline", event.target.value)} placeholder="Todo lo que necesitas, en un solo lugar" maxLength={255} />
                            </label>
                            <label className="catalog-admin-field">
                                <span>Descripción</span>
                                <textarea value={config.description || ""} onChange={(event) => setValue("description", event.target.value)} placeholder="Cuéntales a tus clientes qué encontrarán en tu catálogo..." rows={4} maxLength={1000} />
                            </label>
                            <label className="catalog-admin-check">
                                <input type="checkbox" checked={config.show_stock} onChange={(event) => setValue("show_stock", event.target.checked)} />
                                <span><strong>Mostrar existencias</strong><small>El cliente verá cuántas unidades están disponibles.</small></span>
                            </label>
                        </div>
                    </section>

                    <section className="catalog-admin-card catalog-admin-card--wide">
                        <div className="catalog-admin-card__heading">
                            <span className="catalog-admin-card__number">03</span>
                            <div><h3>Entrega y condiciones</h3><p>Configura cómo recibirá el cliente su pedido.</p></div>
                        </div>
                        <div className="catalog-admin-delivery">
                            <label className={`catalog-admin-choice ${config.allow_pickup ? "is-selected" : ""}`}>
                                <input type="checkbox" checked={config.allow_pickup} onChange={(event) => setValue("allow_pickup", event.target.checked)} />
                                <i className="fas fa-store" /><span><strong>Retiro en tienda</strong><small>El cliente recoge su pedido en el local.</small></span>
                            </label>
                            <label className={`catalog-admin-choice ${config.allow_delivery ? "is-selected" : ""}`}>
                                <input type="checkbox" checked={config.allow_delivery} onChange={(event) => setValue("allow_delivery", event.target.checked)} />
                                <i className="fas fa-motorcycle" /><span><strong>Entrega a domicilio</strong><small>Solicita la dirección durante el checkout.</small></span>
                            </label>
                            <label className="catalog-admin-field">
                                <span>Costo de envío</span>
                                <div className="catalog-admin-money"><span>$</span><input type="number" min="0" step="0.01" value={config.delivery_fee} disabled={!config.allow_delivery} onChange={(event) => setValue("delivery_fee", event.target.value)} /></div>
                            </label>
                            <label className="catalog-admin-field">
                                <span>Pedido mínimo</span>
                                <div className="catalog-admin-money"><span>$</span><input type="number" min="0" step="0.01" value={config.minimum_order} onChange={(event) => setValue("minimum_order", event.target.value)} /></div>
                            </label>
                        </div>
                    </section>
                </div>

                <div className="catalog-admin-footer">
                    <div><i className="fas fa-shield-halved" /><span><strong>Precios y stock protegidos</strong><small>EcuaPos vuelve a validarlos en el servidor antes de registrar cada pedido.</small></span></div>
                    <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? <><span className="spinner-border spinner-border-sm me-2" />Guardando...</> : <><i className="fas fa-check me-2" />Guardar configuración</>}</button>
                </div>
            </form>
        </MasterLayout>
    );
};

export default CatalogSettings;
