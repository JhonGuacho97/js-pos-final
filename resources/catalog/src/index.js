import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import "./catalog.scss";

const bootstrap = window.__ECUAPOS_CATALOG__ || {};
const money = (value) => `$ ${Number(value || 0).toFixed(2)}`;
const cartStorageKey = `ecuapos-catalog-cart:${bootstrap.slug}`;

const Icon = ({ children }) => <span className="catalog-icon" aria-hidden="true">{children}</span>;

function ProductImage({ src, alt }) {
    return src ? <img src={src} alt={alt} loading="lazy" /> : (
        <div className="catalog-image-fallback"><span>EP</span><small>Sin imagen</small></div>
    );
}

function ProductModal({ product, onClose, onAdd }) {
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

    const presentation = option?.presentations?.find((item) => item.id === presentationId);
    const price = presentation?.price ?? option?.price ?? 0;
    const maxQty = presentation?.stock ?? option?.stock ?? null;
    const canAdd = option?.available && (!option.presentations.length || Boolean(presentation)) && (maxQty === null || qty <= maxQty);

    if (!product) return null;

    return (
        <div className="catalog-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <section className="catalog-product-modal" role="dialog" aria-modal="true">
                <button className="catalog-close" onClick={onClose} aria-label="Cerrar">×</button>
                <div className="catalog-product-modal__media"><ProductImage src={product.images[0]} alt={product.name} /></div>
                <div className="catalog-product-modal__content">
                    <span className="catalog-eyebrow">{product.category?.name || "Producto"}</span>
                    <h2>{product.name}</h2>
                    {product.brand && <span className="catalog-brand">{product.brand}</span>}
                    <p>{product.description || "Selecciona la opción que prefieras y agrégala a tu pedido."}</p>

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

function Checkout({ cart, settings, onBack, onSuccess }) {
    const initialType = settings.allow_pickup ? "pickup" : "delivery";
    const [form, setForm] = useState({ customer_name: "", customer_phone: "", fulfillment_type: initialType, delivery_address: "", payment_method: "", notes: "" });
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery = form.fulfillment_type === "delivery" ? settings.delivery_fee : 0;
    const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

    const submit = async (event) => {
        event.preventDefault(); setBusy(true); setError("");
        try {
            const response = await fetch(`${bootstrap.apiUrl}/orders`, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify({ ...form, items: cart.map((item) => ({ product_id: item.productId, presentation_id: item.presentationId, quantity: item.quantity })) }) });
            const body = await response.json();
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

    if (loading) return <div className="catalog-loading"><span>EP</span><p>Preparando el catálogo…</p></div>;
    if (error) return <div className="catalog-loading catalog-loading--error"><span>!</span><h1>Catálogo no disponible</h1><p>{error}</p></div>;
    if (checkout) return <Checkout cart={cart} settings={data.settings} onBack={() => setCheckout(false)} onSuccess={() => setCart([])} />;

    return <div className="catalog-app">
        <header className="catalog-header"><div className="catalog-shell catalog-header__inner"><a className="catalog-logo" href="#"><img src={data.store.logo} alt={data.store.name} /><div><strong>{data.store.name}</strong><small>Catálogo virtual</small></div></a><button className="catalog-cart-button" onClick={() => setCartOpen(true)}>🛒 <span>{count}</span><strong>{money(total)}</strong></button></div></header>
        <main>
            <section className="catalog-hero"><div className="catalog-shell"><div className="catalog-hero__copy"><span className="catalog-eyebrow">Compra fácil y directo</span><h1>{data.settings.headline}</h1><p>{data.settings.description || "Explora nuestros productos, arma tu pedido y coordina la entrega por WhatsApp."}</p></div><div className="catalog-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar productos…" />{search && <button onClick={() => setSearch("")}>×</button>}</div></div></section>
            <section className="catalog-shell catalog-products-section"><div className="catalog-categories"><button className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>Todos <span>{data.products.length}</span></button>{data.categories.map((item) => <button key={item.id} className={String(category) === String(item.id) ? "active" : ""} onClick={() => setCategory(item.id)}>{item.name}</button>)}</div>
                <div className="catalog-section-title"><div><span className="catalog-eyebrow">Explora</span><h2>{category === "all" ? "Todos los productos" : data.categories.find((item) => String(item.id) === String(category))?.name}</h2></div><span>{filtered.length} productos</span></div>
                <div className="catalog-product-grid">{filtered.map((product) => <article key={product.id} className={`catalog-product-card${!product.available ? " is-sold-out" : ""}`} onClick={() => product.available && setSelectedProduct(product)}><div className="catalog-product-card__image"><ProductImage src={product.images[0]} alt={product.name} />{product.featured && <span className="catalog-featured">Destacado</span>}{!product.available && <span className="catalog-sold-out">Agotado</span>}</div><div className="catalog-product-card__body"><small>{product.category?.name || product.brand || "Producto"}</small><h3>{product.name}</h3><div><strong>{product.min_price === product.max_price ? money(product.min_price) : `Desde ${money(product.min_price)}`}</strong><button aria-label="Ver producto">+</button></div></div></article>)}</div>
                {!filtered.length && <div className="catalog-empty catalog-empty--products"><Icon>⌕</Icon><h3>No encontramos productos</h3><p>Prueba con otra categoría o término de búsqueda.</p></div>}
            </section>
        </main>
        <footer className="catalog-footer"><div className="catalog-shell"><strong>{data.store.name}</strong><span>Catálogo impulsado por EcuaPos</span></div></footer>
        {count > 0 && <button className="catalog-mobile-cart" onClick={() => setCartOpen(true)}><span>🛒 {count} {count === 1 ? "producto" : "productos"}</span><strong>{money(total)}</strong></button>}
        {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart} />}
        {cartOpen && <CartDrawer cart={cart} settings={data.settings} onClose={() => setCartOpen(false)} onQty={changeQty} onRemove={(key) => setCart((current) => current.filter((item) => item.key !== key))} onCheckout={() => { setCartOpen(false); setCheckout(true); window.scrollTo(0, 0); }} />}
    </div>;
}

ReactDOM.render(<CatalogApp />, document.getElementById("catalog-root"));
