import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useIntl } from "react-intl";

// Pestañas de una sección del menú (Ventas · Cotizaciones · Devoluciones,
// etc.), arriba del contenido. Salen de las entradas con {tabs} de
// asideConfig.js, ya filtradas por permisos en MasterLayout.js, así que no
// hay que tocar cada página. Solo se muestran en la pantalla de listado de
// cada pestaña: en crear/editar distraerían del formulario.
export const pathMatches = (pathname, to) =>
    pathname === to || pathname.startsWith(`${to}/`);

const SectionTabs = ({ routes }) => {
    const { pathname } = useLocation();
    const intl = useIntl();
    const navRef = useRef(null);

    const section = (routes || []).find(
        (route) => route.tabs?.length > 1 && route.tabs.some((tab) => tab.to === pathname)
    );

    // En pantallas angostas la barra se desplaza de lado: deja la pestaña
    // activa a la vista (sin mover la página entera).
    useEffect(() => {
        const nav = navRef.current;
        const active = nav?.querySelector(".is-active");
        if (!nav || !active) return;
        const left = active.offsetLeft - nav.offsetLeft;
        if (left < nav.scrollLeft || left + active.offsetWidth > nav.scrollLeft + nav.clientWidth) {
            nav.scrollLeft = left - 16;
        }
    }, [pathname, section?.title]);

    if (!section) return null;

    return (
        <>
            <style>{sectionTabsStyles}</style>
            <nav ref={navRef} className="section-tabs" aria-label={intl.formatMessage({ id: section.title })}>
                {section.tabs.map((tab) => {
                    const active = tab.to === pathname;
                    return (
                        <Link
                            key={tab.to}
                            to={tab.to}
                            className={`section-tabs__tab${active ? " is-active" : ""}`}
                            aria-current={active ? "page" : undefined}
                        >
                            {intl.formatMessage({ id: tab.title })}
                        </Link>
                    );
                })}
            </nav>
        </>
    );
};

const sectionTabsStyles = `
  .section-tabs {
    display: flex;
    gap: 4px;
    margin: -6px 0 18px;
    padding: 4px;
    overflow-x: auto;
    border: 1px solid #e7ebf1;
    border-radius: 12px;
    background: #fff;
    scrollbar-width: none;
    width: max-content;
    max-width: 100%;
  }
  .section-tabs::-webkit-scrollbar { display: none; }
  .section-tabs__tab {
    flex: none;
    padding: 8px 16px;
    border-radius: 9px;
    color: #667085;
    font-size: 13.5px;
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
    transition: background-color .15s ease, color .15s ease;
  }
  .section-tabs__tab:hover { background: #f4f6f9; color: #172033; }
  .section-tabs__tab.is-active { background: #eef4ff; color: #155eef; }
  .section-tabs__tab:focus-visible { outline: 2px solid rgba(21, 94, 239, .35); outline-offset: 1px; }
`;

export default SectionTabs;
