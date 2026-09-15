import React from "react";

const Brand = ({ compact = false }) => (
    <div className={`auth-brand${compact ? " auth-brand--compact" : ""}`}>
        <span className="auth-brand__mark">
            <img src="/images/ecua-pos-logo.png" alt="EcuaPOS" />
        </span>
        <span className="auth-brand__copy">
            <strong>EcuaPOS</strong>
            <small>Gestión comercial</small>
        </span>
    </div>
);

const FeatureCheck = () => (
    <svg viewBox="0 0 20 20" aria-hidden="true">
        <path d="m5 10.3 3.1 3.1L15.2 6.8" />
    </svg>
);

const AuthLayout = ({ children, page = "login" }) => (
    <div className={`auth-shell auth-shell--${page}`}>
        <aside className="auth-story" aria-label="Beneficios de EcuaPOS">
            <Brand />

            <div className="auth-story__content">
                <span className="auth-kicker"><i /> Operación conectada</span>
                <h1>
                    Tu negocio en orden,
                    <span> desde el primer movimiento.</span>
                </h1>
                <p>
                    Vende, controla existencias y factura con información clara para tomar mejores decisiones.
                </p>

                <div className="auth-preview" aria-hidden="true">
                    <div className="auth-preview__top">
                        <div>
                            <small>Resumen del día</small>
                            <strong>Todo bajo control</strong>
                        </div>
                        <span><i /> En línea</span>
                    </div>
                    <div className="auth-preview__chart">
                        {[44, 62, 52, 79, 68, 94, 84].map((height, index) => (
                            <i key={index} style={{ height: `${height}%` }} />
                        ))}
                    </div>
                    <div className="auth-preview__metrics">
                        <div><small>Ventas</small><strong>En tiempo real</strong></div>
                        <div><small>Inventario</small><strong>Actualizado</strong></div>
                        <div><small>SRI</small><strong>Integrado</strong></div>
                    </div>
                </div>

                <ul className="auth-benefits">
                    <li><FeatureCheck /> Acceso seguro a tu operación</li>
                    <li><FeatureCheck /> Información centralizada por tienda</li>
                    <li><FeatureCheck /> Soporte para facturación electrónica</li>
                </ul>
            </div>

            <small className="auth-story__footer">EcuaPOS · Software para negocios ecuatorianos</small>
        </aside>

        <main className="auth-main">
            <div className="auth-main__mobile-brand"><Brand compact /></div>
            <section className="auth-card">{children}</section>
            <p className="auth-main__footer">
                <span className="auth-secure-dot" /> Conexión cifrada y datos protegidos
            </p>
        </main>
    </div>
);

export default AuthLayout;
