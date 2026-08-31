import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./catalog.scss";

const bootstrap = window.__ECUAPOS_CATALOG__ || {};
const money = (value) => `$ ${Number(value || 0).toFixed(2)}`;
const readableText = (value) => value && String(value).trim().toLowerCase() !== "null" ? String(value).trim() : "";
const cartStorageKey = `ecuapos-catalog-cart:${bootstrap.slug}`;
let csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || "";
const statusLabels = { pending: "Recibido", confirmed: "Confirmado", preparing: "En preparación", completed: "Completado", cancelled: "Cancelado" };
const shortDate = (value) => value ? new Intl.DateTimeFormat("es-EC", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "";

async function accountRequest(action, options = {}) {
    const response = await fetch(`${bootstrap.accountUrl}/${action}`, {
        credentials: "same-origin",
        ...options,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
            ...(options.headers || {}),
        },
    });
    const body = await response.json().catch(() => ({}));
    if (body.data?.csrf_token) {
        csrfToken = body.data.csrf_token;
        const csrfMeta = document.querySelector('meta[name="csrf-token"]');
        if (csrfMeta) csrfMeta.content = csrfToken;
    }
    if (!response.ok) {
        throw new Error(Object.values(body.errors || {}).flat()[0] || body.message || "No pudimos completar la solicitud.");
    }
    return body.data ?? { message: body.message };
}

const Icon = ({ children }) => <span className="catalog-icon" aria-hidden="true">{children}</span>;

function ProductImage({ src, alt }) {
    return src ? <img src={src} alt={alt} loading="lazy" /> : (
        <div className="catalog-image-fallback"><span>EP</span><small>Sin imagen</small></div>
    );
}

function ProductModal({ product, onClose, onAdd }) {
    const images = (product.images || []).filter(Boolean);
    const [activeImage, setActiveImage] = useState(0);
    const [zoomOpen, setZoomOpen] = useState(false);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const dragStart = useRef(null);
    const availableOptions = product.options.filter((option) => option.available);
    const [optionId, setOptionId] = useState(availableOptions[0]?.product_id);
    const option = product.options.find((item) => item.product_id === optionId) || availableOptions[0];
    const defaultPresentation = option?.presentations?.find((item) => item.is_default && item.available)
        || option?.presentations?.find((item) => item.available);
    const [presentationId, setPresentationId] = useState(defaultPresentation?.id || null);
    const [qty, setQty] = useState(1);

    useEffect(() => {
        const next = option?.presentations?.find((item) => item.is_default && item.available)
            || option?.presentations?.find((item) => item.available);
        setPresentationId(next?.id || null);
        setQty(1);
    }, [optionId]);

    useEffect(() => {
        setActiveImage(0);
        setZoomOpen(false);
        setPan({ x: 0, y: 0 });
    }, [product.id]);

    useEffect(() => {
        setPan({ x: 0, y: 0 });
    }, [activeImage]);

    const startPan = (event) => {
        event.currentTarget.setPointerCapture?.(event.pointerId);
        dragStart.current = { clientX: event.clientX, clientY: event.clientY, pan };
    };
    const movePan = (event) => {
        if (!dragStart.current) return;
        setPan({
            x: dragStart.current.pan.x + event.clientX - dragStart.current.clientX,
            y: dragStart.current.pan.y + event.clientY - dragStart.current.clientY,
        });
    };
    const endPan = () => { dragStart.current = null; };

    const presentation = option?.presentations?.find((item) => item.id === presentationId);
    const price = presentation?.price ?? option?.price ?? 0;
    const maxQty = presentation?.stock ?? option?.stock ?? null;
    const canAdd = option?.available && (!option.presentations.length || Boolean(presentation)) && (maxQty === null || qty <= maxQty);

    if (!product) return null;

    return (
        <div className="catalog-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <section className="catalog-product-modal" role="dialog" aria-modal="true">
                <button className="catalog-close" onClick={onClose} aria-label="Cerrar">×</button>
                <div className="catalog-product-modal__media">
                    <div className="catalog-product-gallery">
                        <ProductImage src={images[activeImage]} alt={`${product.name}${images.length > 1 ? ` · imagen ${activeImage + 1}` : ""}`} />
                        {images.length > 0 && <button className="catalog-gallery-zoom" type="button" aria-label="Ampliar imagen"
                            onClick={() => { setPan({ x: 0, y: 0 }); setZoomOpen(true); }}>⌕ <span>Ampliar</span></button>}
                        {images.length > 1 && <>
                            <button className="catalog-gallery-nav catalog-gallery-nav--previous" type="button" aria-label="Imagen anterior"
                                onClick={() => setActiveImage((current) => (current - 1 + images.length) % images.length)}>‹</button>
                            <button className="catalog-gallery-nav catalog-gallery-nav--next" type="button" aria-label="Imagen siguiente"
                                onClick={() => setActiveImage((current) => (current + 1) % images.length)}>›</button>
                            <span className="catalog-gallery-count">{activeImage + 1} / {images.length}</span>
                            <div className="catalog-gallery-thumbnails" aria-label="Galería de imágenes">
                                {images.map((image, index) => <button key={`${image}-${index}`} type="button"
                                    className={index === activeImage ? "active" : ""} aria-label={`Ver imagen ${index + 1}`}
                                    onClick={() => setActiveImage(index)}><img src={image} alt="" /></button>)}
                            </div>
                        </>}
                    </div>
                </div>
                <div className="catalog-product-modal__content">
                    <span className="catalog-eyebrow">{product.category?.name || "Producto"}</span>
                    <h2>{product.name}</h2>
                    {product.brand && <span className="catalog-brand">{product.brand}</span>}
                    <p>{readableText(product.description) || "Selecciona la opción que prefieras y agrégala a tu pedido."}</p>

                    {product.options.length > 1 && <div className="catalog-picker">
                        <label>Variante</label>
                        <div className="catalog-choice-grid">
                            {product.options.map((item) => <button key={item.product_id} disabled={!item.available}
                                className={item.product_id === option?.product_id ? "active" : ""}
                                onClick={() => setOptionId(item.product_id)}>
                                <strong>{item.name}</strong><small>{item.available ? money(item.price) : "Agotado"}</small>
                            </button>)}
                        </div>
                    </div>}

                    {option?.presentations?.length > 0 && <div className="catalog-picker">
                        <label>Presentación</label>
                        <div className="catalog-choice-grid">
                            {option.presentations.map((item) => <button key={item.id} disabled={!item.available}
                                className={item.id === presentation?.id ? "active" : ""}
                                onClick={() => setPresentationId(item.id)}>
                                <strong>{item.name}</strong><small>{item.available ? money(item.price) : "Agotado"}</small>
                            </button>)}
                        </div>
                    </div>}

                    <div className="catalog-product-action">
                        <div className="catalog-stepper">
                            <button onClick={() => setQty((value) => Math.max(1, value - 1))}>−</button>
                            <strong>{qty}</strong>
                            <button onClick={() => setQty((value) => value + 1)}>+</button>
                        </div>
                        <button className="catalog-primary" disabled={!canAdd} onClick={() => {
                            onAdd(product, option, presentation, qty);
                            onClose();
                        }}>
                            <span>Agregar</span><strong>{money(price * qty)}</strong>
                        </button>
                    </div>
                    {!canAdd && <div className="catalog-inline-error">No hay existencia suficiente para esta selección.</div>}
                </div>
                {zoomOpen && <div className="catalog-image-zoom" role="dialog" aria-modal="true" aria-label={`Imagen ampliada de ${product.name}`}>
                    <div className="catalog-image-zoom__toolbar"><span>Arrastra la imagen para ver los detalles</span><div><button type="button" onClick={() => setPan({ x: 0, y: 0 })}>Centrar</button><button type="button" aria-label="Cerrar vista ampliada" onClick={() => setZoomOpen(false)}>×</button></div></div>
                    <div className="catalog-image-zoom__canvas" onPointerDown={startPan} onPointerMove={movePan} onPointerUp={endPan} onPointerCancel={endPan} title="Arrastra la imagen con el cursor"><img src={images[activeImage]} alt={`${product.name} ampliado`} style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(1.85)` }} /></div>
                </div>}
            </section>
        </div>
    );
}

function CartDrawer({ cart, settings, onClose, onQty, onRemove, onCheckout }) {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return <div className="catalog-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
        <aside className="catalog-cart" role="dialog" aria-modal="true">
            <header><div><span className="catalog-eyebrow">Tu selección</span><h2>Carrito</h2></div><button className="catalog-close" onClick={onClose}>×</button></header>
            <div className="catalog-cart__items">
                {!cart.length && <div className="catalog-empty"><Icon>🛍</Icon><h3>Tu carrito está vacío</h3><p>Agrega productos del catálogo para comenzar.</p></div>}
                {cart.map((item) => <article className="catalog-cart-item" key={item.key}>
                    <div className="catalog-cart-item__image"><ProductImage src={item.image} alt={item.productName} /></div>
                    <div className="catalog-cart-item__content">
                        <div><h3>{item.productName}</h3><p>{[item.optionName, item.presentationName].filter(Boolean).join(" · ")}</p></div>
                        <strong>{money(item.price * item.quantity)}</strong>
                        <div className="catalog-cart-item__actions">
                            <div className="catalog-mini-stepper"><button onClick={() => onQty(item.key, item.quantity - 1)}>−</button><span>{item.quantity}</span><button onClick={() => onQty(item.key, item.quantity + 1)}>+</button></div>
                            <button className="catalog-remove" onClick={() => onRemove(item.key)}>Eliminar</button>
                        </div>
                    </div>
                </article>)}
            </div>
            {cart.length > 0 && <footer className="catalog-cart__footer">
                {settings.minimum_order > subtotal && <p className="catalog-minimum">Faltan {money(settings.minimum_order - subtotal)} para completar el pedido mínimo.</p>}
                <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
                <button className="catalog-primary" disabled={subtotal < settings.minimum_order} onClick={onCheckout}>Continuar pedido <span>→</span></button>
            </footer>}
        </aside>
    </div>;
}

function AccountModal({ session, checkoutIntent, resetRequest, onResetComplete, onAuthenticated, onClose }) {
    const [mode, setMode] = useState(resetRequest?.token ? "reset" : "login");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [login, setLogin] = useState({ email: "", password: "", remember: true });
    const [forgotEmail, setForgotEmail] = useState(resetRequest?.email || "");
    const [reset, setReset] = useState({
        email: resetRequest?.email || "", token: resetRequest?.token || "",
        password: "", password_confirmation: "",
    });
    const [register, setRegister] = useState({
        tipo_identificacion: "05", identification: "", name: "", email: "", phone: "",
        country: "Ecuador", city: "", address: "", dob: "", password: "",
        password_confirmation: "", terms: false,
    });
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const updateLogin = (event) => setLogin((current) => ({ ...current, [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));
    const updateRegister = (event) => setRegister((current) => ({ ...current, [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));
    const updateReset = (event) => setReset((current) => ({ ...current, [event.target.name]: event.target.value }));

    useEffect(() => {
        if (!resetRequest?.token) return;
        setReset((current) => ({ ...current, email: resetRequest.email || "", token: resetRequest.token }));
        setMode("reset");
        setError("");
        setNotice("");
    }, [resetRequest?.token, resetRequest?.email]);

    useEffect(() => {
        if (!session?.authenticated) return;
        setOrdersLoading(true);
        accountRequest("pedidos", { method: "GET" })
            .then((data) => setOrders(data.orders || []))
            .catch((requestError) => setError(requestError.message))
            .finally(() => setOrdersLoading(false));
    }, [session?.authenticated]);

    const openOrder = async (id) => {
        setOrdersLoading(true); setError("");
        try { const data = await accountRequest(`pedidos/${id}`, { method: "GET" }); setSelectedOrder(data.order); }
        catch (requestError) { setError(requestError.message); }
        finally { setOrdersLoading(false); }
    };

    const submitLogin = async (event) => {
        event.preventDefault(); setBusy(true); setError("");
        try {
            const data = await accountRequest("iniciar-sesion", { method: "POST", body: JSON.stringify(login) });
            onAuthenticated(data);
        } catch (requestError) { setError(requestError.message); } finally { setBusy(false); }
    };
    const submitRegister = async (event) => {
        event.preventDefault(); setBusy(true); setError("");
        try {
            const data = await accountRequest("registro", { method: "POST", body: JSON.stringify(register) });
            onAuthenticated(data);
        } catch (requestError) { setError(requestError.message); } finally { setBusy(false); }
    };
    const submitForgot = async (event) => {
        event.preventDefault(); setBusy(true); setError(""); setNotice("");
        try {
            const data = await accountRequest("recuperar-contrasena", { method: "POST", body: JSON.stringify({ email: forgotEmail }) });
            setNotice(data?.message || "Si existe una cuenta activa, recibirás un correo con las instrucciones.");
        } catch (requestError) { setError(requestError.message); } finally { setBusy(false); }
    };
    const submitReset = async (event) => {
        event.preventDefault(); setBusy(true); setError(""); setNotice("");
        try {
            const data = await accountRequest("restablecer-contrasena", { method: "POST", body: JSON.stringify(reset) });
            setNotice(data?.message || "Tu contraseña fue actualizada.");
            setLogin((current) => ({ ...current, email: reset.email, password: "" }));
            setReset((current) => ({ ...current, password: "", password_confirmation: "" }));
            onResetComplete();
            setMode("login");
        } catch (requestError) { setError(requestError.message); } finally { setBusy(false); }
    };
    const logout = async () => {
        setBusy(true); setError("");
        try {
            await accountRequest("cerrar-sesion", { method: "POST", body: "{}" });
            onAuthenticated({ authenticated: false, customer: null });
        } catch (requestError) { setError(requestError.message); } finally { setBusy(false); }
    };

    if (session?.authenticated) {
        return <div className="catalog-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <section className="catalog-account-modal catalog-account-modal--session" role="dialog" aria-modal="true">
                <button className="catalog-close" onClick={onClose} aria-label="Cerrar">×</button>
                {selectedOrder ? <div className="catalog-order-detail">
                    <button className="catalog-back catalog-order-back" onClick={() => setSelectedOrder(null)}>← Mis pedidos</button>
                    <div className="catalog-order-detail__heading"><div><span className="catalog-eyebrow">Detalle del pedido</span><h2>{selectedOrder.reference}</h2><p>{shortDate(selectedOrder.created_at)}</p></div><span className={`catalog-status catalog-status--${selectedOrder.status}`}>{statusLabels[selectedOrder.status]}</span></div>
                    <div className="catalog-order-progress">{["pending", "confirmed", "preparing", "completed"].map((status) => { const cancelled = selectedOrder.status === "cancelled"; const index = ["pending", "confirmed", "preparing", "completed"].indexOf(selectedOrder.status); const active = !cancelled && ["pending", "confirmed", "preparing", "completed"].indexOf(status) <= index; return <div key={status} className={active ? "active" : ""}><span>{active ? "✓" : ""}</span><small>{statusLabels[status]}</small></div>; })}</div>
                    {selectedOrder.status === "cancelled" && <div className="catalog-order-cancelled">Este pedido fue cancelado por la tienda.</div>}
                    <div className="catalog-order-items">{selectedOrder.items.map((item) => <div key={item.id}><span><strong>{item.quantity} × {item.product_name}</strong>{item.option && <small>{item.option}</small>}</span><strong>{money(item.line_total)}</strong></div>)}</div>
                    <div className="catalog-order-totals"><div><span>Subtotal</span><strong>{money(selectedOrder.subtotal)}</strong></div>{selectedOrder.delivery_fee > 0 && <div><span>Entrega</span><strong>{money(selectedOrder.delivery_fee)}</strong></div>}<div className="grand"><span>Total</span><strong>{money(selectedOrder.grand_total)}</strong></div></div>
                    <div className="catalog-order-meta"><span>{selectedOrder.fulfillment_type === "delivery" ? "🛵 Entrega a domicilio" : "🏬 Retiro en tienda"}</span>{selectedOrder.payment_method && <span>💳 {selectedOrder.payment_method}</span>}</div>
                </div> : <>
                    <div className="catalog-account-welcome"><span className="catalog-account-avatar">{session.customer.name?.trim().charAt(0).toUpperCase()}</span><span className="catalog-eyebrow">Tu cuenta</span><h2>Hola, {session.customer.name}</h2><p>Tus datos están listos para agilizar tus próximos pedidos.</p></div>
                    <div className="catalog-account-details">
                        <div><small>Identificación</small><strong>{session.customer.identification}</strong></div>
                        <div><small>Correo</small><strong>{session.customer.email}</strong></div>
                        <div><small>Teléfono</small><strong>{session.customer.phone}</strong></div>
                        <div><small>Dirección</small><strong>{session.customer.address}</strong></div>
                    </div>
                    <div className="catalog-orders-section"><div className="catalog-orders-title"><div><span className="catalog-eyebrow">Seguimiento</span><h3>Mis pedidos</h3></div><span>{orders.length}</span></div>
                        {ordersLoading && <div className="catalog-orders-loading">Consultando tus pedidos…</div>}
                        {!ordersLoading && !orders.length && <div className="catalog-orders-empty"><span>🛍</span><div><strong>Aún no tienes pedidos</strong><small>Cuando compres con tu sesión iniciada aparecerán aquí.</small></div></div>}
                        {!ordersLoading && orders.map((order) => <button key={order.id} className="catalog-order-row" onClick={() => openOrder(order.id)}><span className="catalog-order-row__icon">▤</span><span><strong>{order.reference}</strong><small>{shortDate(order.created_at)} · {order.items_count} productos</small></span><span><em className={`catalog-status catalog-status--${order.status}`}>{statusLabels[order.status]}</em><strong>{money(order.grand_total)}</strong></span></button>)}
                    </div>
                </>}
                {error && <div className="catalog-error">{error}</div>}
                {!selectedOrder && <div className="catalog-account-actions"><button className="catalog-secondary" onClick={onClose}>Seguir comprando</button><button className="catalog-danger-link" disabled={busy} onClick={logout}>{busy ? "Cerrando…" : "Cerrar sesión"}</button></div>}
            </section>
        </div>;
    }

    return <div className="catalog-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
        <section className="catalog-account-modal" role="dialog" aria-modal="true">
            <button className="catalog-close" onClick={onClose} aria-label="Cerrar">×</button>
            <header className="catalog-account-heading"><span className="catalog-account-mark">{mode === "forgot" || mode === "reset" ? "🔑" : "👤"}</span><div><span className="catalog-eyebrow">Cuenta de cliente</span><h2>{mode === "login" ? "Qué gusto verte" : mode === "register" ? "Crea tu cuenta" : mode === "forgot" ? "Recupera tu acceso" : "Nueva contraseña"}</h2><p>{mode === "login" ? "Ingresa para comprar más rápido y consultar tus pedidos." : mode === "register" ? "Regístrate como cliente de esta tienda." : mode === "forgot" ? "Te enviaremos un enlace seguro al correo registrado." : "Crea una contraseña nueva para volver a ingresar."}</p></div></header>
            {(mode === "login" || mode === "register") && <div className="catalog-account-tabs"><button className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setError(""); setNotice(""); }}>Iniciar sesión</button><button className={mode === "register" ? "active" : ""} onClick={() => { setMode("register"); setError(""); setNotice(""); }}>Crear cuenta</button></div>}
            {(mode === "forgot" || mode === "reset") && <button type="button" className="catalog-auth-back" onClick={() => { setMode("login"); setError(""); setNotice(""); }}>← Volver a iniciar sesión</button>}
            {checkoutIntent && <div className="catalog-auth-required"><span>🔒</span><div><strong>Identifícate para continuar</strong><small>Tu pedido quedará vinculado a tu cuenta para que puedas seguir su estado.</small></div></div>}
            {mode === "login" ? <form className="catalog-account-form" onSubmit={submitLogin}>
                <label className="catalog-field"><span>Correo electrónico</span><input required type="email" name="email" autoComplete="email" value={login.email} onChange={updateLogin} placeholder="tu@correo.com" /></label>
                <label className="catalog-field"><span>Contraseña</span><input required type="password" name="password" autoComplete="current-password" value={login.password} onChange={updateLogin} placeholder="Tu contraseña" /></label>
                <label className="catalog-check"><input type="checkbox" name="remember" checked={login.remember} onChange={updateLogin} /><span>Recordarme en este dispositivo</span></label>
                <button type="button" className="catalog-forgot-link" onClick={() => { setForgotEmail(login.email); setMode("forgot"); setError(""); setNotice(""); }}>¿Olvidaste tu contraseña?</button>
                {error && <div className="catalog-error">{error}</div>}
                {notice && <div className="catalog-success">{notice}</div>}
                <button className="catalog-primary catalog-account-submit" disabled={busy}>{busy ? "Ingresando…" : "Ingresar a mi cuenta"}<span>→</span></button>
            </form> : mode === "register" ? <form className="catalog-account-form catalog-account-form--register" onSubmit={submitRegister}>
                <div className="catalog-form-grid">
                    <label><span>Tipo de identificación *</span><select required name="tipo_identificacion" value={register.tipo_identificacion} onChange={updateRegister}><option value="05">Cédula</option><option value="04">RUC</option><option value="06">Pasaporte</option><option value="08">Identificación del exterior</option></select></label>
                    <label><span>Identificación *</span><input required name="identification" value={register.identification} onChange={updateRegister} placeholder="Número de identificación" /></label>
                </div>
                <label className="catalog-field"><span>Nombre completo *</span><input required name="name" autoComplete="name" value={register.name} onChange={updateRegister} /></label>
                <div className="catalog-form-grid">
                    <label><span>Correo electrónico *</span><input required type="email" name="email" autoComplete="email" value={register.email} onChange={updateRegister} /></label>
                    <label><span>Teléfono *</span><input required name="phone" autoComplete="tel" value={register.phone} onChange={updateRegister} placeholder="09XXXXXXXX" /></label>
                </div>
                <div className="catalog-form-grid catalog-form-grid--three">
                    <label><span>País *</span><input required name="country" value={register.country} onChange={updateRegister} /></label>
                    <label><span>Ciudad *</span><input required name="city" value={register.city} onChange={updateRegister} /></label>
                    <label><span>Fecha de nacimiento</span><input type="date" name="dob" value={register.dob} onChange={updateRegister} /></label>
                </div>
                <label className="catalog-field"><span>Dirección *</span><textarea required name="address" value={register.address} onChange={updateRegister} placeholder="Dirección y referencia" /></label>
                <div className="catalog-form-grid">
                    <label><span>Contraseña *</span><input required minLength="8" type="password" name="password" autoComplete="new-password" value={register.password} onChange={updateRegister} placeholder="Mínimo 8 caracteres" /></label>
                    <label><span>Confirmar contraseña *</span><input required minLength="8" type="password" name="password_confirmation" autoComplete="new-password" value={register.password_confirmation} onChange={updateRegister} /></label>
                </div>
                <label className="catalog-check"><input required type="checkbox" name="terms" checked={register.terms} onChange={updateRegister} /><span>Acepto que la tienda use estos datos para gestionar mis pedidos.</span></label>
                {error && <div className="catalog-error">{error}</div>}
                <button className="catalog-primary catalog-account-submit" disabled={busy}>{busy ? "Creando cuenta…" : "Crear mi cuenta"}<span>→</span></button>
            </form> : mode === "forgot" ? <form className="catalog-account-form catalog-recovery-form" onSubmit={submitForgot}>
                <label className="catalog-field"><span>Correo electrónico</span><input required type="email" autoComplete="email" value={forgotEmail} onChange={(event) => setForgotEmail(event.target.value)} placeholder="tu@correo.com" /></label>
                <div className="catalog-recovery-note"><span>✉</span><p>Por seguridad, mostraremos el mismo resultado aunque el correo no esté registrado.</p></div>
                {error && <div className="catalog-error">{error}</div>}
                {notice && <div className="catalog-success">{notice}</div>}
                <button className="catalog-primary catalog-account-submit" disabled={busy}>{busy ? "Enviando…" : "Enviar enlace de recuperación"}<span>→</span></button>
            </form> : <form className="catalog-account-form catalog-recovery-form" onSubmit={submitReset}>
                <label className="catalog-field"><span>Correo electrónico</span><input required readOnly type="email" name="email" value={reset.email} /></label>
                <div className="catalog-form-grid">
                    <label><span>Nueva contraseña *</span><input required minLength="8" type="password" name="password" autoComplete="new-password" value={reset.password} onChange={updateReset} placeholder="Mínimo 8 caracteres" /></label>
                    <label><span>Confirmar contraseña *</span><input required minLength="8" type="password" name="password_confirmation" autoComplete="new-password" value={reset.password_confirmation} onChange={updateReset} /></label>
                </div>
                <div className="catalog-password-hint">Usa al menos 8 caracteres e incluye letras y números.</div>
                {error && <div className="catalog-error">{error}</div>}
                {notice && <div className="catalog-success">{notice}</div>}
                <button className="catalog-primary catalog-account-submit" disabled={busy}>{busy ? "Actualizando…" : "Guardar nueva contraseña"}<span>✓</span></button>
            </form>}
        </section>
    </div>;
}

function Checkout({ cart, settings, customer, onBack, onSuccess, onAuthRequired }) {
    const initialType = settings.allow_pickup ? "pickup" : "delivery";
    const [form, setForm] = useState({ customer_name: customer?.name || "", customer_phone: customer?.phone || "", fulfillment_type: initialType, delivery_address: customer?.address || "", payment_method: "", notes: "" });
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery = form.fulfillment_type === "delivery" ? settings.delivery_fee : 0;
    const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

    const submit = async (event) => {
        event.preventDefault(); setBusy(true); setError("");
        try {
            const response = await fetch(bootstrap.orderUrl, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json", "Accept": "application/json", "X-CSRF-TOKEN": csrfToken }, body: JSON.stringify({ ...form, items: cart.map((item) => ({ product_id: item.productId, presentation_id: item.presentationId, quantity: item.quantity })) }) });
            const body = await response.json();
            if (response.status === 401) { onAuthRequired(); return; }
            if (!response.ok) throw new Error(Object.values(body.errors || {}).flat()[0] || body.message || "No pudimos registrar el pedido.");
            onSuccess();
            window.location.href = body.data.whatsapp_url;
        } catch (requestError) { setError(requestError.message); } finally { setBusy(false); }
    };

    return <main className="catalog-checkout-page">
        <button className="catalog-back" onClick={onBack}>← Volver al catálogo</button>
        <div className="catalog-checkout-layout">
            <form className="catalog-checkout-card" onSubmit={submit}>
                <span className="catalog-eyebrow">Último paso</span><h1>Completa tu pedido</h1><p>Usaremos estos datos para coordinar contigo por WhatsApp.</p>
                {customer && <div className="catalog-customer-ready"><span>✓</span><div><strong>Datos cargados desde tu cuenta</strong><small>Puedes ajustarlos para este pedido sin cambiar tu perfil.</small></div></div>}
                <div className="catalog-form-grid">
                    <label><span>Nombre completo *</span><input required name="customer_name" value={form.customer_name} onChange={update} placeholder="¿Cómo te llamas?" /></label>
                    <label><span>Teléfono *</span><input required name="customer_phone" value={form.customer_phone} onChange={update} placeholder="09XXXXXXXX" /></label>
                </div>
                <div className="catalog-field"><span>¿Cómo recibirás tu pedido?</span><div className="catalog-delivery-options">
                    {settings.allow_pickup && <button type="button" className={form.fulfillment_type === "pickup" ? "active" : ""} onClick={() => setForm({ ...form, fulfillment_type: "pickup" })}>🏬 Retiro en tienda</button>}
                    {settings.allow_delivery && <button type="button" className={form.fulfillment_type === "delivery" ? "active" : ""} onClick={() => setForm({ ...form, fulfillment_type: "delivery" })}>🛵 Entrega a domicilio</button>}
                </div></div>
                {form.fulfillment_type === "delivery" && <label className="catalog-field"><span>Dirección de entrega *</span><textarea required name="delivery_address" value={form.delivery_address} onChange={update} placeholder="Dirección y referencia" /></label>}
                <label className="catalog-field"><span>Forma de pago prevista</span><select name="payment_method" value={form.payment_method} onChange={update}><option value="">Seleccionar</option><option>Efectivo</option><option>Transferencia</option><option>Tarjeta</option></select></label>
                <label className="catalog-field"><span>Observaciones</span><textarea name="notes" value={form.notes} onChange={update} placeholder="Indicaciones adicionales para el negocio" /></label>
                {error && <div className="catalog-error">{error}</div>}
                <button className="catalog-primary catalog-submit" disabled={busy}>{busy ? "Registrando pedido…" : "Enviar pedido por WhatsApp"}<strong>{money(subtotal + delivery)}</strong></button>
            </form>
            <aside className="catalog-order-summary"><span className="catalog-eyebrow">Resumen</span><h2>Tu pedido</h2>{cart.map((item) => <div className="catalog-summary-line" key={item.key}><span>{item.quantity} × {item.productName}<small>{[item.optionName, item.presentationName].filter(Boolean).join(" · ")}</small></span><strong>{money(item.price * item.quantity)}</strong></div>)}<div className="catalog-summary-total"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>{delivery > 0 && <div className="catalog-summary-total"><span>Entrega</span><strong>{money(delivery)}</strong></div>}<div className="catalog-summary-total grand"><span>Total</span><strong>{money(subtotal + delivery)}</strong></div></aside>
        </div>
    </main>;
}

function CatalogApp() {
    const initialResetRequest = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("reset_token");
        return token ? { token, email: params.get("email") || "" } : null;
    }, []);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cartOpen, setCartOpen] = useState(false);
    const [checkout, setCheckout] = useState(false);
    const [accountOpen, setAccountOpen] = useState(Boolean(initialResetRequest));
    const [resetRequest, setResetRequest] = useState(initialResetRequest);
    const [pendingCheckout, setPendingCheckout] = useState(false);
    const [session, setSession] = useState({ authenticated: false, customer: null });
    const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem(cartStorageKey)) || []; } catch { return []; } });

    useEffect(() => { fetch(bootstrap.apiUrl, { headers: { Accept: "application/json" } }).then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.message); return body.data; }).then(setData).catch(() => setError("Este catálogo no está disponible en este momento.")).finally(() => setLoading(false)); }, []);
    useEffect(() => { accountRequest("sesion", { method: "GET" }).then(setSession).catch(() => setSession({ authenticated: false, customer: null })); }, []);
    useEffect(() => { localStorage.setItem(cartStorageKey, JSON.stringify(cart)); }, [cart]);
    useEffect(() => { document.body.classList.toggle("catalog-locked", Boolean(selectedProduct || cartOpen || accountOpen)); return () => document.body.classList.remove("catalog-locked"); }, [selectedProduct, cartOpen, accountOpen]);

    const filtered = useMemo(() => (data?.products || []).filter((product) => {
        const matchesCategory = category === "all" || String(product.category?.id) === String(category);
        const term = search.trim().toLowerCase();
        return matchesCategory && (!term || `${product.name} ${product.brand || ""}`.toLowerCase().includes(term));
    }), [data, category, search]);

    const addToCart = (product, option, presentation, quantity) => {
        const key = `${option.product_id}:${presentation?.id || "base"}`;
        setCart((current) => {
            const existing = current.find((item) => item.key === key);
            const maxQty = presentation?.stock ?? option.stock ?? null;
            const requestedQty = (existing?.quantity || 0) + quantity;
            const nextQty = maxQty === null ? requestedQty : Math.min(requestedQty, maxQty);
            const next = { key, productId: option.product_id, presentationId: presentation?.id || null, productName: product.name, optionName: product.options.length > 1 ? option.name : "", presentationName: presentation?.name || "", price: presentation?.price ?? option.price, quantity: nextQty, image: product.images[0] || "", maxQty };
            return existing ? current.map((item) => item.key === key ? next : item) : [...current, next];
        });
    };
    const changeQty = (key, quantity) => setCart((current) => quantity <= 0 ? current.filter((item) => item.key !== key) : current.map((item) => item.key === key ? { ...item, quantity: item.maxQty === null ? quantity : Math.min(quantity, item.maxQty) } : item));
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const startCheckout = () => {
        setCartOpen(false);
        if (!session.authenticated) {
            setPendingCheckout(true);
            setAccountOpen(true);
            return;
        }
        setCheckout(true);
        window.scrollTo(0, 0);
    };
    const handleAccountSession = (nextSession) => {
        setSession(nextSession);
        if (!nextSession.authenticated) {
            setPendingCheckout(false);
            return;
        }
        setAccountOpen(false);
        if (pendingCheckout) {
            setPendingCheckout(false);
            setCheckout(true);
            window.scrollTo(0, 0);
        }
    };
    const handleResetComplete = () => {
        setResetRequest(null);
        const url = new URL(window.location.href);
        url.searchParams.delete("reset_token");
        url.searchParams.delete("email");
        window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`);
    };

    if (loading) return <div className="catalog-loading"><span>EP</span><p>Preparando el catálogo…</p></div>;
    if (error) return <div className="catalog-loading catalog-loading--error"><span>!</span><h1>Catálogo no disponible</h1><p>{error}</p></div>;
    if (checkout) return <Checkout cart={cart} settings={data.settings} customer={session.customer} onBack={() => setCheckout(false)} onSuccess={() => setCart([])} onAuthRequired={() => { setCheckout(false); setSession({ authenticated: false, customer: null }); setPendingCheckout(true); setAccountOpen(true); }} />;

    return <div className="catalog-app">
        <header className="catalog-header"><div className="catalog-shell catalog-header__inner"><a className="catalog-logo" href="#"><img src={data.store.logo} alt={data.store.name} /><div><strong>{data.store.name}</strong><small>Catálogo virtual</small></div></a><div className="catalog-header__actions"><button className="catalog-account-button" onClick={() => setAccountOpen(true)}><span>{session.authenticated ? session.customer.name?.trim().charAt(0).toUpperCase() : "👤"}</span><strong>{session.authenticated ? session.customer.name?.split(" ")[0] : "Mi cuenta"}</strong></button><button className="catalog-cart-button" onClick={() => setCartOpen(true)}>🛒 <span>{count}</span><strong>{money(total)}</strong></button></div></div></header>
        <main>
            <section className="catalog-hero"><div className="catalog-shell catalog-hero__layout"><div className="catalog-hero__copy"><span className="catalog-eyebrow">Compra fácil y directo</span><h1>{data.settings.headline}</h1><p>{data.settings.description || "Explora nuestros productos, arma tu pedido y coordina la entrega por WhatsApp."}</p><div className="catalog-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar productos…" />{search && <button onClick={() => setSearch("")}>×</button>}</div></div><aside className="catalog-shopping-guide" aria-label="Información de compra"><span className="catalog-shopping-guide__icon">🛍</span><div><span className="catalog-eyebrow">Tu pedido, a tu ritmo</span><h2>Compra en pocos pasos</h2></div><ul><li><span>1</span> Elige tus productos y presentación.</li><li><span>2</span> Confirma tus datos de contacto.</li><li><span>3</span> Coordinamos por WhatsApp.</li></ul>{data.settings.minimum_order > 0 && <small>Pedido mínimo: <strong>{money(data.settings.minimum_order)}</strong></small>}</aside></div></section>
            <section className="catalog-shell catalog-products-section"><div className="catalog-categories"><button className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>Todos <span>{data.products.length}</span></button>{data.categories.map((item) => <button key={item.id} className={String(category) === String(item.id) ? "active" : ""} onClick={() => setCategory(item.id)}>{item.name}</button>)}</div>
                <div className="catalog-section-title"><div><span className="catalog-eyebrow">Explora</span><h2>{category === "all" ? "Todos los productos" : data.categories.find((item) => String(item.id) === String(category))?.name}</h2></div><span>{filtered.length} productos</span></div>
                <div className="catalog-product-grid">{filtered.map((product) => <article key={product.id} className={`catalog-product-card${!product.available ? " is-sold-out" : ""}`} onClick={() => product.available && setSelectedProduct(product)}><div className="catalog-product-card__image"><ProductImage src={product.images[0]} alt={product.name} />{product.featured && <span className="catalog-featured">Destacado</span>}{!product.available && <span className="catalog-sold-out">Agotado</span>}{product.images.length > 1 && <span className="catalog-image-count" title={`${product.images.length} imágenes`}>▧ {product.images.length}</span>}</div><div className="catalog-product-card__body"><small>{product.category?.name || product.brand || "Producto"}</small><h3>{product.name}</h3><div><strong>{product.min_price === product.max_price ? money(product.min_price) : `Desde ${money(product.min_price)}`}</strong><button aria-label={`Ver ${product.name}`}>+</button></div></div></article>)}</div>
                {!filtered.length && <div className="catalog-empty catalog-empty--products"><Icon>⌕</Icon><h3>No encontramos productos</h3><p>Prueba con otra categoría o término de búsqueda.</p></div>}
            </section>
        </main>
        <footer className="catalog-footer"><div className="catalog-shell"><strong>{data.store.name}</strong><span>Catálogo impulsado por EcuaPos</span></div></footer>
        {count > 0 && <button className="catalog-mobile-cart" onClick={() => setCartOpen(true)}><span>🛒 {count} {count === 1 ? "producto" : "productos"}</span><strong>{money(total)}</strong></button>}
        {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart} />}
        {cartOpen && <CartDrawer cart={cart} settings={data.settings} onClose={() => setCartOpen(false)} onQty={changeQty} onRemove={(key) => setCart((current) => current.filter((item) => item.key !== key))} onCheckout={startCheckout} />}
        {accountOpen && <AccountModal session={session} checkoutIntent={pendingCheckout} resetRequest={resetRequest} onResetComplete={handleResetComplete} onClose={() => { setAccountOpen(false); setPendingCheckout(false); }} onAuthenticated={handleAccountSession} />}
    </div>;
}

ReactDOM.render(<CatalogApp />, document.getElementById("catalog-root"));
