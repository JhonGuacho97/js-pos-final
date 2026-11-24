import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./catalog.scss";

const bootstrap = window.__ECUAPOS_CATALOG__ || {};
const money = (value) => `$${Number(value || 0).toFixed(2)}`;
const readableText = (value) => value && String(value).trim().toLowerCase() !== "null" ? String(value).trim() : "";
const cartStorageKey = `ecuapos-catalog-cart:${bootstrap.slug}`;
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || "";

// "Sin Marca" es el valor por defecto del POS: no le dice nada al cliente.
const visibleBrand = (brand) => brand && !/^sin\s+marca$/i.test(brand.trim()) ? brand.trim() : "";

/*
 * Las variantes del POS llegan como un solo texto: "NEGRO TALLA 41",
 * "Talla 36", "XL", "SERIE 23/26". Para elegir como en una tienda de
 * calzado se separan en color y talla. Si un nombre no sigue ese patrón
 * se muestra tal cual, como una opción más.
 */
const SIZE_PATTERN = /^(xxs|xs|s|m|l|xl|xxl|xxxl|[2-5]xl|\d+(?:[.,]\d+)?(?:\s*[-/]\s*\d+(?:[.,]\d+)?)?)$/i;
function parseOption(name) {
    const text = readableText(name);
    const withSize = text.match(/^(.*?)\s*\btalla\b\s*(.+)$/i);
    if (withSize) return { color: withSize[1].trim(), size: withSize[2].trim(), isSize: true };
    if (SIZE_PATTERN.test(text) || /^serie\b/i.test(text)) return { color: "", size: text, isSize: true };
    return { color: "", size: text, isSize: false };
}
// Orden de tienda: tallas de ropa de menor a mayor y tallas numéricas en orden.
const LETTER_SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "2XL", "XXXL", "3XL", "4XL", "5XL"];
function sizeRank(size) {
    const text = String(size).toUpperCase().replace(/^SERIE\s*/, "");
    const letter = LETTER_SIZES.indexOf(text === "XXL" ? "2XL" : text === "XXXL" ? "3XL" : text);
    if (letter >= 0) return letter;
    const number = parseFloat(text.replace(",", "."));
    return Number.isNaN(number) ? 1000 : 100 + number;
}
const bySize = (a, b) => sizeRank(a) - sizeRank(b);
const titleCase = (value) => value.toLowerCase().replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());

function describeOptions(product) {
    const parsed = product.options.map((option) => ({ ...parseOption(option.name), option }))
        .sort((a, b) => (a.isSize && b.isSize ? bySize(a.size, b.size) : 0));
    const colors = [...new Set(parsed.map((item) => item.color).filter(Boolean).map((color) => color.toUpperCase()))];
    const allSizes = parsed.every((item) => item.isSize);
    const single = product.options.length === 1
        && readableText(product.options[0].name).toLowerCase() === readableText(product.name).toLowerCase();
    return { parsed, colors, allSizes, single };
}

/* Resumen que va en la tarjeta: "Tallas 38 · 40 · 41 +2" con lo que hay en stock. */
function sizeSummary(product) {
    const { parsed, allSizes, single } = describeOptions(product);
    if (single || !product.options.length) return "";
    const sizes = [...new Set(parsed.filter((item) => item.option.available).map((item) => item.size.toUpperCase()))];
    if (!sizes.length) return "";
    if (allSizes) sizes.sort(bySize);
    const label = allSizes ? (sizes.length === 1 ? "Talla" : "Tallas") : (sizes.length === 1 ? "Opción" : "Opciones");
    const shown = sizes.slice(0, 4).join(" · ");
    return `${label} ${shown}${sizes.length > 4 ? ` +${sizes.length - 4}` : ""}`;
}

const icons = {
    arrowLeft: <path d="M19 12H5m6-6-6 6 6 6" />,
    bag: <><path d="M5 8h14l-1 13H6L5 8Z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    delivery: <><path d="M3 6h11v10H3z" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    minus: <path d="M6 12h12" />,
    plus: <path d="M12 6v12M6 12h12" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    store: <><path d="M4 10v10h16V10" /><path d="M3 4h18l-1 6H4L3 4Z" /><path d="M9 20v-6h6v6" /></>,
    whatsapp: <><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.5Z" /><path d="M9 8.5c.8 3 2.2 4.5 5 5.5" /></>,
    zoom: <><circle cx="10" cy="10" r="6" /><path d="m15 15 5 5M10 7v6M7 10h6" /></>,
};
const Icon = ({ name, size = 20 }) => <svg className="cx-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">{icons[name]}</svg>;

/* La foto aparece con un fundido sobre un fondo neutro en vez de "saltar". */
function Photo({ src, alt, eager = false }) {
    const [loaded, setLoaded] = useState(false);
    const imageRef = useRef(null);
    // Una foto que ya estaba en caché puede terminar de cargar antes de que
    // React conecte onLoad; sin esto se quedaría invisible.
    useEffect(() => { if (imageRef.current?.complete) setLoaded(true); }, [src]);
    if (!src) return <div className="cx-photo cx-photo--empty"><span>Sin foto</span></div>;
    return <div className={`cx-photo${loaded ? " is-loaded" : ""}`}>
        <img ref={imageRef} src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" onLoad={() => setLoaded(true)} onError={() => setLoaded(true)} />
    </div>;
}

function ProductSheet({ product, settings, onClose, onAdd }) {
    const images = product.images || [];
    const { parsed, colors, allSizes, single } = useMemo(() => describeOptions(product), [product]);
    const firstAvailable = parsed.find((item) => item.option.available) || parsed[0];
    const [color, setColor] = useState(firstAvailable?.color.toUpperCase() || "");
    const [optionId, setOptionId] = useState(single || parsed.length === 1 ? firstAvailable?.option.product_id : null);
    const [activeImage, setActiveImage] = useState(0);
    const [zoomOpen, setZoomOpen] = useState(false);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [qty, setQty] = useState(1);
    const dragStart = useRef(null);
    const galleryRef = useRef(null);

    const visibleOptions = colors.length > 1 ? parsed.filter((item) => item.color.toUpperCase() === color) : parsed;
    const option = product.options.find((item) => item.product_id === optionId) || null;
    const presentations = option?.presentations || [];
    const defaultPresentation = presentations.find((item) => item.is_default && item.available) || presentations.find((item) => item.available);
    const [presentationId, setPresentationId] = useState(defaultPresentation?.id || null);

    useEffect(() => { setPresentationId(defaultPresentation?.id || null); setQty(1); }, [optionId]);
    useEffect(() => {
        const onKey = (event) => { if (event.key === "Escape") zoomOpen ? setZoomOpen(false) : onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [zoomOpen, onClose]);

    const chooseColor = (value) => {
        setColor(value);
        const current = parsed.find((item) => item.option.product_id === optionId);
        if (current && current.color.toUpperCase() !== value) setOptionId(null);
    };
    const showImage = (index) => {
        setActiveImage(index);
        const track = galleryRef.current;
        if (track) track.scrollTo({ left: track.clientWidth * index, behavior: "smooth" });
    };
    const onGalleryScroll = () => {
        const track = galleryRef.current;
        if (track) setActiveImage(Math.round(track.scrollLeft / Math.max(1, track.clientWidth)));
    };

    const presentation = presentations.find((item) => item.id === presentationId);
    const price = presentation?.price ?? option?.price ?? product.min_price;
    const maxQty = presentation?.stock ?? option?.stock ?? null;
    const needsPresentation = presentations.length > 0 && !presentation;
    const canAdd = Boolean(option?.available) && !needsPresentation && (maxQty === null || qty <= maxQty);
    const pickLabel = allSizes ? "Talla" : "Opción";
    const missing = !option ? `Elige ${pickLabel.toLowerCase()}` : needsPresentation ? "Elige presentación" : "";
    const lowStock = settings.show_stock && maxQty !== null && maxQty > 0 && maxQty <= 3;

    return <div className="cx-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
        <section className="cx-sheet" role="dialog" aria-modal="true" aria-label={product.name}>
            <button className="cx-icon-button cx-sheet__close" onClick={onClose} aria-label="Cerrar"><Icon name="close" /></button>
            <div className="cx-sheet__media">
                <div className="cx-gallery" ref={galleryRef} onScroll={onGalleryScroll}>
                    {images.length ? images.map((image, index) => <div className="cx-gallery__slide" key={image.full}>
                        <Photo src={image.detail} alt={`${product.name}${images.length > 1 ? `, foto ${index + 1}` : ""}`} eager={index === 0} />
                    </div>) : <div className="cx-gallery__slide"><Photo src="" alt="" /></div>}
                </div>
                {images.length > 0 && <button type="button" className="cx-zoom-button" onClick={() => { setPan({ x: 0, y: 0 }); setZoomOpen(true); }}><Icon name="zoom" size={16} /> Ampliar</button>}
                {images.length > 1 && <div className="cx-thumbs" aria-label="Fotos del producto">
                    {images.map((image, index) => <button key={image.full} type="button" className={index === activeImage ? "is-active" : ""} aria-label={`Ver foto ${index + 1}`} onClick={() => showImage(index)}><img src={image.thumb} alt="" /></button>)}
                </div>}
            </div>

            <div className="cx-sheet__info">
                <p className="cx-kicker">{[visibleBrand(product.brand), product.category?.name].filter(Boolean).join(" / ")}</p>
                <h2 className="cx-sheet__title">{product.name}</h2>
                <p className="cx-sheet__price">{money(price)}</p>
                {readableText(product.description) && <p className="cx-sheet__description">{readableText(product.description)}</p>}

                {!single && colors.length > 1 && <div className="cx-field">
                    <div className="cx-field__label">Color <b>{titleCase(color)}</b></div>
                    <div className="cx-chips">
                        {colors.map((value) => {
                            const available = parsed.some((item) => item.color.toUpperCase() === value && item.option.available);
                            return <button key={value} type="button" disabled={!available} className={value === color ? "is-active" : ""} onClick={() => chooseColor(value)}>{titleCase(value)}</button>;
                        })}
                    </div>
                </div>}

                {!single && colors.length === 1 && <p className="cx-field__label">Color <b>{titleCase(colors[0])}</b></p>}

                {!single && parsed.length > 1 && <div className="cx-field">
                    <div className="cx-field__label">{pickLabel}{option && <b>{parseOption(option.name).size}</b>}</div>
                    <div className={`cx-sizes${allSizes ? "" : " cx-sizes--wide"}`}>
                        {visibleOptions.map(({ option: item, size }) => <button key={item.product_id} type="button" disabled={!item.available}
                            className={item.product_id === optionId ? "is-active" : ""} aria-label={`${pickLabel} ${size}${item.available ? "" : ", agotado"}`}
                            onClick={() => setOptionId(item.product_id)}>{size}</button>)}
                    </div>
                </div>}

                {presentations.length > 0 && <div className="cx-field">
                    <div className="cx-field__label">Presentación</div>
                    <div className="cx-chips">
                        {presentations.map((item) => <button key={item.id} type="button" disabled={!item.available} className={item.id === presentation?.id ? "is-active" : ""} onClick={() => setPresentationId(item.id)}>
                            {item.name} <small>{money(item.price)}</small>
                        </button>)}
                    </div>
                </div>}

                {lowStock && <p className="cx-stock-note">{maxQty === 1 ? "Queda 1 unidad" : `Quedan ${maxQty} unidades`}</p>}
                {option && maxQty !== null && qty > maxQty && <p className="cx-inline-error">Solo hay {maxQty} disponibles.</p>}

                <div className="cx-buybar">
                    <div className="cx-stepper" aria-label="Cantidad">
                        <button type="button" aria-label="Quitar uno" disabled={qty <= 1} onClick={() => setQty((value) => Math.max(1, value - 1))}><Icon name="minus" size={16} /></button>
                        <span>{qty}</span>
                        <button type="button" aria-label="Agregar uno" disabled={maxQty !== null && qty >= maxQty} onClick={() => setQty((value) => value + 1)}><Icon name="plus" size={16} /></button>
                    </div>
                    <button type="button" className="cx-button cx-button--accent cx-buybar__add" disabled={!canAdd} onClick={() => { onAdd(product, option, presentation, qty); onClose(); }}>
                        {missing || <>Agregar <span>{money(price * qty)}</span></>}
                    </button>
                </div>
            </div>

            {zoomOpen && <div className="cx-zoom" role="dialog" aria-modal="true" aria-label={`Foto ampliada de ${product.name}`}>
                <div className="cx-zoom__bar"><span>Arrastra para recorrer la foto</span><button type="button" className="cx-icon-button" aria-label="Cerrar foto ampliada" onClick={() => setZoomOpen(false)}><Icon name="close" /></button></div>
                <div className="cx-zoom__canvas"
                    onPointerDown={(event) => { event.currentTarget.setPointerCapture?.(event.pointerId); dragStart.current = { x: event.clientX, y: event.clientY, pan }; }}
                    onPointerMove={(event) => dragStart.current && setPan({ x: dragStart.current.pan.x + event.clientX - dragStart.current.x, y: dragStart.current.pan.y + event.clientY - dragStart.current.y })}
                    onPointerUp={() => { dragStart.current = null; }} onPointerCancel={() => { dragStart.current = null; }}>
                    <img src={images[activeImage]?.detail} alt="" draggable="false" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(1.9)` }} />
                </div>
            </div>}
        </section>
    </div>;
}

function CartPanel({ cart, settings, onClose, onQty, onRemove, onCheckout }) {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const missing = settings.minimum_order - subtotal;
    useEffect(() => {
        const onKey = (event) => event.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return <div className="cx-overlay cx-overlay--side" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
        <aside className="cx-cart" role="dialog" aria-modal="true" aria-label="Tu pedido">
            <header className="cx-cart__head"><h2>Tu pedido</h2><button className="cx-icon-button" onClick={onClose} aria-label="Cerrar pedido"><Icon name="close" /></button></header>
            <div className="cx-cart__items">
                {!cart.length && <div className="cx-empty"><Icon name="bag" size={32} /><p>Todavía no agregas nada.</p><button type="button" className="cx-link" onClick={onClose}>Seguir viendo productos</button></div>}
                {cart.map((item) => <article className="cx-line" key={item.key}>
                    <div className="cx-line__photo"><Photo src={item.image} alt="" /></div>
                    <div className="cx-line__body">
                        <h3>{item.productName}</h3>
                        {(item.optionName || item.presentationName) && <p>{[item.optionName, item.presentationName].filter(Boolean).join(" · ")}</p>}
                        <div className="cx-line__row">
                            <div className="cx-stepper cx-stepper--small">
                                <button type="button" aria-label="Quitar uno" onClick={() => onQty(item.key, item.quantity - 1)}><Icon name="minus" size={14} /></button>
                                <span>{item.quantity}</span>
                                <button type="button" aria-label="Agregar uno" disabled={item.maxQty !== null && item.quantity >= item.maxQty} onClick={() => onQty(item.key, item.quantity + 1)}><Icon name="plus" size={14} /></button>
                            </div>
                            <strong>{money(item.price * item.quantity)}</strong>
                        </div>
                        <button type="button" className="cx-link cx-line__remove" onClick={() => onRemove(item.key)}>Quitar</button>
                    </div>
                </article>)}
            </div>
            {cart.length > 0 && <footer className="cx-cart__foot">
                {missing > 0 && <p className="cx-notice">Te faltan {money(missing)} para el pedido mínimo de {money(settings.minimum_order)}.</p>}
                <div className="cx-total"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
                <button type="button" className="cx-button cx-button--accent cx-button--block" disabled={missing > 0} onClick={onCheckout}>Continuar con el pedido</button>
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

    return <main className="cx-checkout">
        <button type="button" className="cx-link cx-back" onClick={onBack}><Icon name="arrowLeft" size={18} /> Volver al catálogo</button>
        <h1 className="cx-checkout__title">Datos del pedido</h1>
        <p className="cx-checkout__lead">Lo recibimos y te escribimos por WhatsApp para confirmar disponibilidad, pago y entrega.</p>
        <div className="cx-checkout__layout">
            <form className="cx-form" onSubmit={submit}>
                <fieldset>
                    <legend><span>1</span> Tus datos</legend>
                    <div className="cx-form__grid">
                        <label className="cx-input"><span>Nombre y apellido</span><input required autoComplete="name" name="customer_name" value={form.customer_name} onChange={update} /></label>
                        <label className="cx-input"><span>Celular (WhatsApp)</span><input required autoComplete="tel" inputMode="tel" name="customer_phone" value={form.customer_phone} onChange={update} placeholder="09XXXXXXXX" /></label>
                        <label className="cx-input"><span>Correo</span><input required type="email" autoComplete="email" name="customer_email" value={form.customer_email} onChange={update} /></label>
                        <label className="cx-input"><span>Ciudad</span><input required autoComplete="address-level2" name="customer_city" value={form.customer_city} onChange={update} /></label>
                        <label className="cx-input"><span>Tipo de identificación</span><select name="customer_identification_type" value={form.customer_identification_type} onChange={update}><option value="05">Cédula</option><option value="04">RUC</option><option value="06">Pasaporte</option><option value="08">Identificación del exterior</option></select></label>
                        <label className="cx-input"><span>Número <em>opcional</em></span><input name="customer_identification" inputMode="numeric" value={form.customer_identification} onChange={update} /></label>
                    </div>
                </fieldset>
                <fieldset>
                    <legend><span>2</span> Entrega</legend>
                    <div className="cx-choice">
                        {settings.allow_pickup && <label className={form.fulfillment_type === "pickup" ? "is-active" : ""}><input type="radio" name="fulfillment_type" value="pickup" checked={form.fulfillment_type === "pickup"} onChange={update} /><Icon name="store" size={22} /><span><strong>Retiro en tienda</strong><small>Coordinamos la hora por WhatsApp</small></span></label>}
                        {settings.allow_delivery && <label className={form.fulfillment_type === "delivery" ? "is-active" : ""}><input type="radio" name="fulfillment_type" value="delivery" checked={form.fulfillment_type === "delivery"} onChange={update} /><Icon name="delivery" size={22} /><span><strong>A domicilio</strong><small>{settings.delivery_fee > 0 ? `Envío ${money(settings.delivery_fee)}` : "Sin costo de envío"}</small></span></label>}
                    </div>
                    {form.fulfillment_type === "delivery" && <label className="cx-input"><span>Dirección y referencia</span><textarea required autoComplete="street-address" name="delivery_address" value={form.delivery_address} onChange={update} rows={3} /></label>}
                </fieldset>
                <fieldset>
                    <legend><span>3</span> Pago y notas</legend>
                    <div className="cx-form__grid">
                        <label className="cx-input"><span>¿Cómo piensas pagar?</span><select name="payment_method" value={form.payment_method} onChange={update}><option value="">Lo decido después</option><option>Efectivo</option><option>Transferencia</option><option>Tarjeta</option></select></label>
                        <label className="cx-input"><span>Notas <em>opcional</em></span><textarea name="notes" value={form.notes} onChange={update} rows={2} /></label>
                    </div>
                </fieldset>
                <label className="cx-consent"><input required type="checkbox" name="privacy_consent" checked={form.privacy_consent} onChange={update} /><span>Acepto que la tienda use estos datos solo para registrar y gestionar mi pedido.</span></label>
                {error && <div className="cx-alert" role="alert">{error}</div>}
                <button className="cx-button cx-button--whatsapp cx-button--block" disabled={busy}>
                    {busy ? "Registrando pedido…" : <><Icon name="whatsapp" size={20} /> Enviar pedido por WhatsApp · {money(subtotal + delivery)}</>}
                </button>
                <p className="cx-form__note">Aquí no se cobra nada. El pago se acuerda con la tienda.</p>
            </form>
            <aside className="cx-summary">
                <h2>Resumen</h2>
                {cart.map((item) => <div className="cx-summary__line" key={item.key}>
                    <span><b>{item.quantity}×</b> {item.productName}{(item.optionName || item.presentationName) && <small>{[item.optionName, item.presentationName].filter(Boolean).join(" · ")}</small>}</span>
                    <strong>{money(item.price * item.quantity)}</strong>
                </div>)}
                <div className="cx-summary__total"><span>Subtotal</span><span>{money(subtotal)}</span></div>
                {form.fulfillment_type === "delivery" && <div className="cx-summary__total"><span>Envío</span><span>{delivery > 0 ? money(delivery) : "Gratis"}</span></div>}
                <div className="cx-summary__total cx-summary__total--grand"><span>Total</span><strong>{money(subtotal + delivery)}</strong></div>
            </aside>
        </div>
    </main>;
}

function ProductCard({ product, onOpen }) {
    const cover = product.images[0];
    const sizes = sizeSummary(product);
    const brand = visibleBrand(product.brand);
    return <article className={`cx-card${product.available ? "" : " is-sold-out"}`}>
        <button type="button" className="cx-card__hit" disabled={!product.available} onClick={() => onOpen(product)} aria-label={`${product.name}, ${money(product.min_price)}${product.available ? "" : ", agotado"}`}>
            <div className="cx-card__photo">
                <Photo src={cover?.thumb} alt="" />
                {product.featured && product.available && <span className="cx-tag cx-tag--accent">Destacado</span>}
                {!product.available && <span className="cx-tag cx-tag--ink">Agotado</span>}
                {product.images.length > 1 && <span className="cx-card__count">{product.images.length} fotos</span>}
            </div>
            <div className="cx-card__body">
                <p className="cx-card__brand">{brand || product.category?.name || " "}</p>
                <h3 className="cx-card__name">{product.name}</h3>
                <p className="cx-card__price">{product.min_price !== product.max_price && <small>desde </small>}{money(product.min_price)}</p>
                {sizes && product.available && <p className="cx-card__sizes">{sizes}</p>}
            </div>
        </button>
    </article>;
}

function CatalogApp() {
    const embedded = bootstrap.data || null;
    const [data, setData] = useState(embedded);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cartOpen, setCartOpen] = useState(false);
    const [checkout, setCheckout] = useState(false);
    const [toast, setToast] = useState(null);
    const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem(cartStorageKey)) || []; } catch { return []; } });

    useEffect(() => {
        if (embedded) return;
        fetch(bootstrap.apiUrl, { headers: { Accept: "application/json" } })
            .then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.message); return body.data; })
            .then(setData)
            .catch(() => setError("Este catálogo no está disponible en este momento."));
    }, []);
    useEffect(() => { try { localStorage.setItem(cartStorageKey, JSON.stringify(cart)); } catch { /* modo privado */ } }, [cart]);
    useEffect(() => {
        document.body.classList.toggle("cx-locked", Boolean(selectedProduct || cartOpen));
        return () => document.body.classList.remove("cx-locked");
    }, [selectedProduct, cartOpen]);
    useEffect(() => {
        if (!toast) return undefined;
        const timer = setTimeout(() => setToast(null), 3200);
        return () => clearTimeout(timer);
    }, [toast]);

    const categoryCounts = useMemo(() => (data?.products || []).reduce((counts, product) => {
        const id = product.category?.id;
        if (id) counts[id] = (counts[id] || 0) + 1;
        return counts;
    }, {}), [data]);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return (data?.products || []).filter((product) => {
            const matchesCategory = category === "all" || String(product.category?.id) === String(category);
            const haystack = `${product.name} ${product.brand || ""} ${product.category?.name || ""}`.toLowerCase();
            return matchesCategory && (!term || haystack.includes(term));
        });
    }, [data, category, search]);

    const addToCart = (product, option, presentation, quantity) => {
        const key = `${option.product_id}:${presentation?.id || "base"}`;
        // "L" a secas no dice mucho en el resumen: se muestra "Talla L".
        const parsedOption = parseOption(option.name);
        const optionName = product.options.length > 1
            ? (parsedOption.isSize && !parsedOption.color && !/talla|serie/i.test(option.name) ? `Talla ${parsedOption.size}` : readableText(option.name))
            : "";
        setCart((current) => {
            const existing = current.find((item) => item.key === key);
            const maxQty = presentation?.stock ?? option.stock ?? null;
            const requestedQty = (existing?.quantity || 0) + quantity;
            const nextQty = maxQty === null ? requestedQty : Math.min(requestedQty, maxQty);
            const next = { key, productId: option.product_id, presentationId: presentation?.id || null, productName: product.name, optionName, presentationName: presentation?.name || "", price: presentation?.price ?? option.price, quantity: nextQty, image: product.images[0]?.thumb || "", maxQty };
            return existing ? current.map((item) => item.key === key ? next : item) : [...current, next];
        });
        setToast({ name: product.name, detail: [optionName, presentation?.name].filter(Boolean).join(" · ") });
    };
    const changeQty = (key, quantity) => setCart((current) => quantity <= 0 ? current.filter((item) => item.key !== key) : current.map((item) => item.key === key ? { ...item, quantity: item.maxQty === null ? quantity : Math.min(quantity, item.maxQty) } : item));
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const startCheckout = () => { setCartOpen(false); setCheckout(true); window.scrollTo(0, 0); };
    const selectCategory = (id) => {
        setCategory(id);
        const anchor = document.getElementById("productos");
        if (anchor && anchor.getBoundingClientRect().top < 0) anchor.scrollIntoView({ behavior: "smooth" });
    };

    if (error) return <div className="cx-state"><h1>Catálogo no disponible</h1><p>{error}</p></div>;
    if (!data) return <div className="cx-state" aria-busy="true"><div className="cx-state__bar" /><p>Cargando catálogo…</p></div>;
    if (checkout) return <Checkout cart={cart} settings={data.settings} onBack={() => setCheckout(false)} onSuccess={() => setCart([])} />;

    const { store, settings, categories } = data;
    const services = [
        settings.allow_pickup && "Retiro en tienda",
        settings.allow_delivery && (settings.delivery_fee > 0 ? `Envío a domicilio ${money(settings.delivery_fee)}` : "Envío a domicilio sin costo"),
        settings.minimum_order > 0 && `Pedido mínimo ${money(settings.minimum_order)}`,
        "Confirmación por WhatsApp",
    ].filter(Boolean);
    const activeCategory = categories.find((item) => String(item.id) === String(category));

    return <div className="cx-app">
        <header className="cx-header">
            <div className="cx-wrap cx-header__inner">
                <a className="cx-brand" href="#top" aria-label={store.name}>
                    {store.logo && <img src={store.logo} alt="" width="40" height="40" />}
                    <span>{store.name}</span>
                </a>
                <label className="cx-search cx-search--header">
                    <Icon name="search" size={18} />
                    <input type="search" aria-label="Buscar productos" placeholder="Buscar producto o marca" value={search} onChange={(event) => setSearch(event.target.value)} />
                </label>
                <button type="button" className="cx-cart-button" onClick={() => setCartOpen(true)} aria-label={`Ver pedido, ${count} ${count === 1 ? "producto" : "productos"}`}>
                    <Icon name="bag" size={20} />
                    <span className="cx-cart-button__label">{count ? money(total) : "Pedido"}</span>
                    {count > 0 && <span className="cx-cart-button__count">{count}</span>}
                </button>
            </div>
        </header>

        <main id="top">
            <section className="cx-intro">
                <div className="cx-wrap">
                    <h1>{settings.headline}</h1>
                    {readableText(settings.description) && <p className="cx-intro__lead">{settings.description}</p>}
                    <ul className="cx-services">{services.map((service) => <li key={service}><Icon name="check" size={14} /> {service}</li>)}</ul>
                </div>
            </section>

            <nav className="cx-filters" id="productos" aria-label="Categorías">
                <div className="cx-wrap">
                    <label className="cx-search cx-search--mobile">
                        <Icon name="search" size={18} />
                        <input type="search" aria-label="Buscar productos" placeholder="Buscar producto o marca" value={search} onChange={(event) => setSearch(event.target.value)} />
                    </label>
                    <div className="cx-tabs" role="tablist">
                        <button type="button" role="tab" aria-selected={category === "all"} className={category === "all" ? "is-active" : ""} onClick={() => selectCategory("all")}>Todo <span>{data.products.length}</span></button>
                        {categories.map((item) => <button type="button" role="tab" key={item.id} aria-selected={String(category) === String(item.id)} className={String(category) === String(item.id) ? "is-active" : ""} onClick={() => selectCategory(item.id)}>{item.name} <span>{categoryCounts[item.id] || 0}</span></button>)}
                    </div>
                </div>
            </nav>

            <section className="cx-wrap cx-results" aria-live="polite">
                <div className="cx-results__head">
                    <h2>{search.trim() ? `Resultados para “${search.trim()}”` : activeCategory?.name || "Todos los productos"}</h2>
                    <span>{filtered.length} {filtered.length === 1 ? "producto" : "productos"}</span>
                </div>
                {filtered.length > 0 ? <div className="cx-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} onOpen={setSelectedProduct} />)}</div>
                    : <div className="cx-empty cx-empty--results"><p>No encontramos productos con ese nombre.</p><button type="button" className="cx-button cx-button--ghost" onClick={() => { setSearch(""); setCategory("all"); }}>Ver todo el catálogo</button></div>}
            </section>
        </main>

        <footer className="cx-footer">
            <div className="cx-wrap">
                <strong>{store.name}</strong>
                <span>Pedidos y atención por WhatsApp</span>
                <small>Catálogo con EcuaPOS</small>
            </div>
        </footer>

        {count > 0 && !cartOpen && !selectedProduct && <button type="button" className="cx-floating-cart" onClick={() => setCartOpen(true)}>
            <span><b>{count}</b> {count === 1 ? "producto" : "productos"}</span>
            <span>Ver pedido · {money(total)}</span>
        </button>}
        {toast && <div className="cx-toast" role="status">
            <Icon name="check" size={18} />
            <span><b>Agregado</b> {toast.name}{toast.detail ? ` · ${toast.detail}` : ""}</span>
            <button type="button" onClick={() => { setToast(null); setCartOpen(true); }}>Ver pedido</button>
        </div>}
        {selectedProduct && <ProductSheet product={selectedProduct} settings={settings} onClose={() => setSelectedProduct(null)} onAdd={addToCart} />}
        {cartOpen && <CartPanel cart={cart} settings={settings} onClose={() => setCartOpen(false)} onQty={changeQty} onRemove={(key) => setCart((current) => current.filter((item) => item.key !== key))} onCheckout={startCheckout} />}
    </div>;
}

ReactDOM.render(<CatalogApp />, document.getElementById("catalog-root"));
