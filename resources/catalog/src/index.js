import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./catalog.scss";

const bootstrap = window.__ECUAPOS_CATALOG__ || {};
const money = (value) => `$ ${Number(value || 0).toFixed(2)}`;
const readableText = (value) => value && String(value).trim().toLowerCase() !== "null" ? String(value).trim() : "";
const cartStorageKey = `ecuapos-catalog-cart:${bootstrap.slug}`;
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || "";

const icons = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    bag: <><path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
    cart: <><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L20 8H6"/><circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    delivery: <><path d="M3 6h11v10H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 15-5-5L5 20"/></>,
    package: <><path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="M4 7v10l8 4 8-4V7M12 11v10"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    shield: <><path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></>,
    store: <><path d="M4 10v10h16V10"/><path d="M3 4h18l-1 6H4L3 4Z"/><path d="M9 20v-6h6v6"/></>,
    whatsapp: <><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.5Z"/><path d="M9 8.5c.8 3 2.2 4.5 5 5.5"/></>,
    zoom: <><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5M10 7v6M7 10h6"/></>,
};
const Icon = ({ name, size = 20 }) => <svg className="catalog-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>;

function ProductImage({ src, alt }) {
    return src ? <img src={src} alt={alt} loading="lazy" decoding="async" /> : (
        <div className="catalog-image-fallback"><Icon name="package" size={34} /><small>Imagen próximamente</small></div>
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
            <section className="catalog-product-modal" role="dialog" aria-modal="true" aria-label={`Detalle de ${product.name}`}>
                <button className="catalog-close" onClick={onClose} aria-label="Cerrar">×</button>
                <div className="catalog-product-modal__media">
                    <div className="catalog-product-gallery">
                        <ProductImage src={images[activeImage]} alt={`${product.name}${images.length > 1 ? ` · imagen ${activeImage + 1}` : ""}`} />
                        {images.length > 0 && <button className="catalog-gallery-zoom" type="button" aria-label="Ampliar imagen"
                            onClick={() => { setPan({ x: 0, y: 0 }); setZoomOpen(true); }}><Icon name="zoom" size={17} /> <span>Ampliar</span></button>}
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
                            <button type="button" aria-label="Reducir cantidad" onClick={() => setQty((value) => Math.max(1, value - 1))}>−</button>
                            <strong>{qty}</strong>
                            <button type="button" aria-label="Aumentar cantidad" onClick={() => setQty((value) => value + 1)}>+</button>
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
        <aside className="catalog-cart" role="dialog" aria-modal="true" aria-label="Carrito de compras">
            <header><div><span className="catalog-eyebrow">Tu selección</span><h2>Carrito</h2></div><button className="catalog-close" onClick={onClose} aria-label="Cerrar carrito">×</button></header>
            <div className="catalog-cart__items">
                {!cart.length && <div className="catalog-empty"><span className="catalog-empty__icon"><Icon name="bag" size={28} /></span><h3>Tu carrito está vacío</h3><p>Explora el catálogo y agrega lo que necesitas.</p></div>}
                {cart.map((item) => <article className="catalog-cart-item" key={item.key}>
                    <div className="catalog-cart-item__image"><ProductImage src={item.image} alt={item.productName} /></div>
                    <div className="catalog-cart-item__content">
                        <div><h3>{item.productName}</h3><p>{[item.optionName, item.presentationName].filter(Boolean).join(" · ")}</p></div>
                        <strong>{money(item.price * item.quantity)}</strong>
                        <div className="catalog-cart-item__actions">
                            <div className="catalog-mini-stepper"><button type="button" aria-label="Reducir cantidad" onClick={() => onQty(item.key, item.quantity - 1)}>−</button><span>{item.quantity}</span><button type="button" aria-label="Aumentar cantidad" onClick={() => onQty(item.key, item.quantity + 1)}>+</button></div>
                            <button className="catalog-remove" onClick={() => onRemove(item.key)}>Eliminar</button>
                        </div>
                    </div>
                </article>)}
            </div>
            {cart.length > 0 && <footer className="catalog-cart__footer">
                {settings.minimum_order > subtotal && <p className="catalog-minimum">Faltan {money(settings.minimum_order - subtotal)} para completar el pedido mínimo.</p>}
                <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
                <button className="catalog-primary" disabled={subtotal < settings.minimum_order} onClick={onCheckout}>Continuar pedido <Icon name="arrow" size={18} /></button>
            </footer>}
        </aside>
    </div>;
}

function Checkout({ cart, settings, onBack, onSuccess }) {
    const initialType = settings.allow_pickup ? "pickup" : "delivery";
    const [form, setForm] = useState({
        customer_name: "", customer_phone: "", customer_email: "", customer_city: "",
        customer_identification_type: "05", customer_identification: "", privacy_consent: false,
        fulfillment_type: initialType, delivery_address: "", payment_method: "", notes: "",
    });
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery = form.fulfillment_type === "delivery" ? settings.delivery_fee : 0;
    const update = (event) => setForm((current) => ({
        ...current,
        [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value,
    }));

    const submit = async (event) => {
        event.preventDefault(); setBusy(true); setError("");
        try {
            const response = await fetch(bootstrap.orderUrl, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json", "Accept": "application/json", "X-CSRF-TOKEN": csrfToken }, body: JSON.stringify({ ...form, items: cart.map((item) => ({ product_id: item.productId, presentation_id: item.presentationId, quantity: item.quantity })) }) });
            const body = await response.json();
            if (!response.ok) throw new Error(Object.values(body.errors || {}).flat()[0] || body.message || "No pudimos registrar el pedido.");
            onSuccess();
            window.location.href = body.data.whatsapp_url;
        } catch (requestError) { setError(requestError.message); } finally { setBusy(false); }
    };

    return <main className="catalog-checkout-page">
        <button type="button" className="catalog-back" onClick={onBack}>← Volver al catálogo</button>
        <div className="catalog-checkout-layout">
            <form className="catalog-checkout-card" onSubmit={submit}>
                <div className="catalog-checkout-heading"><span className="catalog-eyebrow">Último paso</span><h1>Completa tu pedido</h1><p>La tienda recibirá tu solicitud y coordinará contigo por WhatsApp.</p></div>
                <fieldset className="catalog-form-section"><legend><span>1</span> Tus datos</legend>
                    <div className="catalog-form-grid"><label><span>Nombre completo *</span><input required autoComplete="name" name="customer_name" value={form.customer_name} onChange={update} placeholder="¿Cómo te llamas?" /></label><label><span>Teléfono / WhatsApp *</span><input required autoComplete="tel" inputMode="tel" name="customer_phone" value={form.customer_phone} onChange={update} placeholder="09XXXXXXXX" /></label></div>
                    <div className="catalog-form-grid"><label><span>Correo electrónico *</span><input required type="email" autoComplete="email" name="customer_email" value={form.customer_email} onChange={update} placeholder="tu@correo.com" /></label><label><span>Ciudad *</span><input required autoComplete="address-level2" name="customer_city" value={form.customer_city} onChange={update} placeholder="Ej. Manta" /></label></div>
                    <div className="catalog-form-grid catalog-form-grid--identification"><label><span>Tipo de identificación</span><select name="customer_identification_type" value={form.customer_identification_type} onChange={update}><option value="05">Cédula</option><option value="04">RUC</option><option value="06">Pasaporte</option><option value="08">Identificación del exterior</option></select></label><label><span>Identificación <small>opcional</small></span><input name="customer_identification" value={form.customer_identification} onChange={update} placeholder="Para identificar tu registro" /></label></div>
                </fieldset>
                <fieldset className="catalog-form-section"><legend><span>2</span> Entrega y pago</legend>
                    <div className="catalog-field"><span>¿Cómo recibirás tu pedido?</span><div className="catalog-delivery-options">
                        {settings.allow_pickup && <button type="button" className={form.fulfillment_type === "pickup" ? "active" : ""} onClick={() => setForm({ ...form, fulfillment_type: "pickup" })}><Icon name="store" size={21} /><span><strong>Retiro en tienda</strong><small>Coordina el horario</small></span></button>}
                        {settings.allow_delivery && <button type="button" className={form.fulfillment_type === "delivery" ? "active" : ""} onClick={() => setForm({ ...form, fulfillment_type: "delivery" })}><Icon name="delivery" size={21} /><span><strong>Entrega a domicilio</strong><small>{settings.delivery_fee > 0 ? `Costo ${money(settings.delivery_fee)}` : "Sin costo adicional"}</small></span></button>}
                    </div></div>
                    {form.fulfillment_type === "delivery" && <label className="catalog-field"><span>Dirección de entrega *</span><textarea required autoComplete="street-address" name="delivery_address" value={form.delivery_address} onChange={update} placeholder="Dirección y referencia" /></label>}
                    <div className="catalog-form-grid"><label><span>Forma de pago prevista</span><select name="payment_method" value={form.payment_method} onChange={update}><option value="">Seleccionar</option><option>Efectivo</option><option>Transferencia</option><option>Tarjeta</option></select></label><label><span>Observaciones</span><textarea name="notes" value={form.notes} onChange={update} placeholder="Indicaciones adicionales" /></label></div>
                </fieldset>
                <label className="catalog-check catalog-check--checkout"><input required type="checkbox" name="privacy_consent" checked={form.privacy_consent} onChange={update} /><span>Acepto que la tienda use estos datos exclusivamente para registrar y gestionar mi pedido.</span></label>
                {error && <div className="catalog-error">{error}</div>}
                <button className="catalog-primary catalog-submit" disabled={busy}>{busy ? "Registrando pedido…" : <><span><Icon name="whatsapp" size={20} /> Enviar pedido por WhatsApp</span><strong>{money(subtotal + delivery)}</strong></>}</button>
            </form>
            <aside className="catalog-order-summary"><span className="catalog-eyebrow">Resumen</span><h2>Tu pedido</h2>{cart.map((item) => <div className="catalog-summary-line" key={item.key}><span>{item.quantity} × {item.productName}<small>{[item.optionName, item.presentationName].filter(Boolean).join(" · ")}</small></span><strong>{money(item.price * item.quantity)}</strong></div>)}<div className="catalog-summary-total"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>{delivery > 0 && <div className="catalog-summary-total"><span>Entrega</span><strong>{money(delivery)}</strong></div>}<div className="catalog-summary-total grand"><span>Total</span><strong>{money(subtotal + delivery)}</strong></div><p className="catalog-summary-note"><Icon name="shield" size={19} /> No realizarás ningún pago en esta página. La tienda confirmará disponibilidad y forma de pago.</p></aside>
        </div>
    </main>;
}

function CatalogApp() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cartOpen, setCartOpen] = useState(false);
    const [checkout, setCheckout] = useState(false);
    const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem(cartStorageKey)) || []; } catch { return []; } });

    useEffect(() => { fetch(bootstrap.apiUrl, { headers: { Accept: "application/json" } }).then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.message); return body.data; }).then(setData).catch(() => setError("Este catálogo no está disponible en este momento.")).finally(() => setLoading(false)); }, []);
    useEffect(() => { localStorage.setItem(cartStorageKey, JSON.stringify(cart)); }, [cart]);
    useEffect(() => { document.body.classList.toggle("catalog-locked", Boolean(selectedProduct || cartOpen)); return () => document.body.classList.remove("catalog-locked"); }, [selectedProduct, cartOpen]);

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
        setCheckout(true);
        window.scrollTo(0, 0);
    };

    if (loading) return <div className="catalog-loading"><span className="catalog-loading__mark"><Icon name="store" size={28} /></span><div><strong>Preparando el catálogo</strong><p>Un momento, ya casi está listo…</p></div></div>;
    if (error) return <div className="catalog-loading catalog-loading--error"><span>!</span><h1>Catálogo no disponible</h1><p>{error}</p></div>;
    if (checkout) return <Checkout cart={cart} settings={data.settings} onBack={() => setCheckout(false)} onSuccess={() => setCart([])} />;

    return <div className="catalog-app">
        <header className="catalog-header"><div className="catalog-shell catalog-header__inner"><a className="catalog-logo" href="#catalogo" aria-label={`Ir al catálogo de ${data.store.name}`}><span className="catalog-logo__image">{data.store.logo ? <img src={data.store.logo} alt="" /> : <Icon name="store" size={22} />}</span><div><strong>{data.store.name}</strong><small>Pedidos directos</small></div></a><div className="catalog-header__actions"><span className="catalog-header__status"><i /> Atención por WhatsApp</span><button type="button" className="catalog-cart-button" onClick={() => setCartOpen(true)} aria-label={`Abrir carrito, ${count} productos`}><Icon name="cart" size={20} /><span className="catalog-cart-count">{count}</span><strong>{count ? money(total) : "Mi pedido"}</strong></button></div></div></header>
        <main>
            <section className="catalog-hero"><div className="catalog-shell catalog-hero__layout"><div className="catalog-hero__copy"><span className="catalog-eyebrow"><i /> Catálogo disponible</span><h1>{data.settings.headline}</h1><p>{data.settings.description || "Explora nuestros productos, arma tu pedido y coordina la entrega directamente por WhatsApp."}</p><a href="#catalogo" className="catalog-hero__link">Ver productos <Icon name="arrow" size={18} /></a></div><aside className="catalog-order-flow" aria-label="Cómo realizar un pedido"><div className="catalog-order-flow__heading"><span className="catalog-order-flow__icon"><Icon name="bag" size={24} /></span><div><span className="catalog-eyebrow">Simple y directo</span><h2>Tu pedido en 3 pasos</h2></div></div><ol><li><span>01</span><div><strong>Elige</strong><small>Productos y cantidades</small></div></li><li><span>02</span><div><strong>Completa</strong><small>Tus datos de contacto</small></div></li><li><span>03</span><div><strong>Coordina</strong><small>Entrega y pago por WhatsApp</small></div></li></ol><div className="catalog-order-flow__meta">{data.settings.allow_pickup && <span><Icon name="store" size={16} /> Retiro</span>}{data.settings.allow_delivery && <span><Icon name="delivery" size={16} /> Entrega</span>}{data.settings.minimum_order > 0 && <span>Pedido mín. {money(data.settings.minimum_order)}</span>}</div></aside></div></section>
            <section id="catalogo" className="catalog-shell catalog-products-section"><div className="catalog-discovery"><div className="catalog-search"><Icon name="search" size={20} /><input aria-label="Buscar productos" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="¿Qué estás buscando?" />{search && <button type="button" aria-label="Limpiar búsqueda" onClick={() => setSearch("")}>×</button>}</div><div className="catalog-categories" aria-label="Categorías"><button type="button" className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>Todos <span>{data.products.length}</span></button>{data.categories.map((item) => <button type="button" key={item.id} className={String(category) === String(item.id) ? "active" : ""} onClick={() => setCategory(item.id)}>{item.name}</button>)}</div></div>
                <div className="catalog-section-title"><div><span className="catalog-eyebrow">Nuestra selección</span><h2>{category === "all" ? "Productos disponibles" : data.categories.find((item) => String(item.id) === String(category))?.name}</h2></div><span>{filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}</span></div>
                <div className="catalog-product-grid">{filtered.map((product) => <article key={product.id} role="button" tabIndex={product.available ? 0 : -1} aria-disabled={!product.available} className={`catalog-product-card${!product.available ? " is-sold-out" : ""}`} onKeyDown={(event) => { if (product.available && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); setSelectedProduct(product); } }} onClick={() => product.available && setSelectedProduct(product)}><div className="catalog-product-card__image"><ProductImage src={product.images[0]} alt={product.name} />{product.featured && <span className="catalog-featured">Recomendado</span>}{!product.available && <span className="catalog-sold-out">Agotado</span>}{product.images.length > 1 && <span className="catalog-image-count" title={`${product.images.length} imágenes`}><Icon name="image" size={14} /> {product.images.length}</span>}</div><div className="catalog-product-card__body"><span className="catalog-product-card__category">{product.category?.name || product.brand || "Producto"}</span><h3>{product.name}</h3>{readableText(product.description) && <p>{readableText(product.description)}</p>}<div className="catalog-product-card__footer"><span><small>{product.min_price !== product.max_price ? "Desde" : "Precio"}</small><strong>{money(product.min_price)}</strong></span><span className="catalog-product-card__action" aria-hidden="true"><Icon name="arrow" size={18} /></span></div></div></article>)}</div>
                {!filtered.length && <div className="catalog-empty catalog-empty--products"><span className="catalog-empty__icon"><Icon name="search" size={28} /></span><h3>No encontramos coincidencias</h3><p>Prueba con otro término o revisa todas las categorías.</p><button type="button" onClick={() => { setSearch(""); setCategory("all"); }}>Ver todos los productos</button></div>}
            </section>
        </main>
        <footer className="catalog-footer"><div className="catalog-shell"><div><strong>{data.store.name}</strong><span>Compra directa, atención cercana.</span></div><span>Catálogo impulsado por <b>EcuaPOS</b></span></div></footer>
        {count > 0 && <button className="catalog-mobile-cart" onClick={() => setCartOpen(true)}><span><Icon name="cart" size={19} /> {count} {count === 1 ? "producto" : "productos"}</span><strong>{money(total)}</strong></button>}
        {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart} />}
        {cartOpen && <CartDrawer cart={cart} settings={data.settings} onClose={() => setCartOpen(false)} onQty={changeQty} onRemove={(key) => setCart((current) => current.filter((item) => item.key !== key))} onCheckout={startCheckout} />}
    </div>;
}

ReactDOM.render(<CatalogApp />, document.getElementById("catalog-root"));
