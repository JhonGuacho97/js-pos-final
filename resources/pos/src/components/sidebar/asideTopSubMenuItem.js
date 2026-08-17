import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleDown, faPlus, faCartShopping, faBasketShopping,
    faUser, faTruck, faBoxOpen, faMoneyBills,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Permissions } from "../../constants";

const AsideTopSubMenuItem = (props) => {
    const { asideConfig, isMenuCollapse } = props;
    const config = useSelector((state) => state.config);
    const location = useLocation();
    const navigate = useNavigate();
    const id = useParams();

    // Menú de acceso rápido (+) -- el <Dropdown>/Popper de react-bootstrap
    // no se lleva bien con estar dentro de .header (position:sticky +
    // z-index:100 arma su propio contexto de apilamiento que atrapa a
    // cualquier descendiente, sin importar el z-index que declare, así
    // que el sidebar -con z-index más alto pero SIBLING de .header-
    // siempre le ganaba visualmente) y portalarlo a mano rompía la
    // referencia de Popper (el menú terminaba posicionado relativo al
    // viewport, no al botón). Se resuelve con el mismo patrón ya probado
    // en GlobalSearch.js: estado propio + createPortal a document.body,
    // calculando la posición a mano desde el botón.
    const [quickAddOpen, setQuickAddOpen] = useState(false);
    const [quickAddPos, setQuickAddPos] = useState({ top: 0, left: 0 });
    const quickAddBtnRef = useRef(null);
    const quickAddMenuRef = useRef(null);

    const toggleQuickAdd = () => {
        if (!quickAddOpen && quickAddBtnRef.current) {
            const rect = quickAddBtnRef.current.getBoundingClientRect();
            setQuickAddPos({ top: rect.bottom + 8, left: rect.left });
        }
        setQuickAddOpen((prev) => !prev);
    };

    const goToQuickAdd = (path) => {
        setQuickAddOpen(false);
        navigate(path);
    };

    useEffect(() => {
        if (!quickAddOpen) return undefined;
        const handleOutside = (event) => {
            if (quickAddBtnRef.current?.contains(event.target)) return;
            if (quickAddMenuRef.current?.contains(event.target)) return;
            setQuickAddOpen(false);
        };
        const handleEscape = (event) => {
            if (event.key === "Escape") setQuickAddOpen(false);
        };
        document.addEventListener("mousedown", handleOutside);
        window.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleOutside);
            window.removeEventListener("keydown", handleEscape);
        };
    }, [quickAddOpen]);

    return (
        <nav
            className={`navbar navbar-expand-xl ${isMenuCollapse === true ? "top-navbar" : "top-nav-heding"
                } navbar-light d-xl-flex align-items-stretch d-block px-3 px-xl-0 py-4 py-xl-0`}
        >
            <div className="navbar-collapse">
                <div className="d-flex align-items-stretch me-3 report_dropdown">
                    <button
                        ref={quickAddBtnRef}
                        type="button"
                        className="hdr-icon-btn hide-arrow"
                        onClick={toggleQuickAdd}
                        title={getFormattedMessage("header.quick-add.title")}
                    >
                        <FontAwesomeIcon icon={faPlus} style={{ fontSize: 14 }} />
                    </button>
                    {quickAddOpen && createPortal(
                        <div
                            ref={quickAddMenuRef}
                            className="hdr-dropdown-menu hdr-quick-add-menu"
                            style={{ top: quickAddPos.top, left: quickAddPos.left }}
                        >
                            {config?.includes(Permissions.MANAGE_SALE) && (
                                <div
                                    onClick={() => goToQuickAdd("/app/sales/create")}
                                    className="hdr-dropdown-item"
                                >
                                    <div className="hdr-item-icon">
                                        <FontAwesomeIcon icon={faCartShopping} />
                                    </div>
                                    <span>
                                        {getFormattedMessage("sales.title")}
                                    </span>
                                </div>
                            )}
                            {config?.includes(Permissions.MANAGE_PURCHASE) && (
                                <div
                                    onClick={() => goToQuickAdd("/app/purchases/create")}
                                    className="hdr-dropdown-item"
                                >
                                    <div className="hdr-item-icon">
                                        <FontAwesomeIcon icon={faBasketShopping} />
                                    </div>
                                    <span>
                                        {getFormattedMessage("purchase.title")}
                                    </span>
                                </div>
                            )}
                            {config?.includes(Permissions.MANAGE_CUSTOMERS) && (
                                <div
                                    onClick={() => goToQuickAdd("/app/customers/create")}
                                    className="hdr-dropdown-item"
                                >
                                    <div className="hdr-item-icon">
                                        <FontAwesomeIcon icon={faUser} />
                                    </div>
                                    <span>
                                        {getFormattedMessage(
                                            "dashboard.recentSales.customer.label"
                                        )}
                                    </span>
                                </div>
                            )}
                            {config?.includes(Permissions.MANAGE_SUPPLIERS) && (
                                <div
                                    onClick={() => goToQuickAdd("/app/suppliers/create")}
                                    className="hdr-dropdown-item"
                                >
                                    <div className="hdr-item-icon">
                                        <FontAwesomeIcon icon={faTruck} />
                                    </div>
                                    <span>
                                        {getFormattedMessage("supplier.title")}
                                    </span>
                                </div>
                            )}
                            {config?.includes(Permissions.MANAGE_PRODUCTS) && (
                                <div
                                    onClick={() => goToQuickAdd("/app/products/create")}
                                    className="hdr-dropdown-item"
                                >
                                    <div className="hdr-item-icon">
                                        <FontAwesomeIcon icon={faBoxOpen} />
                                    </div>
                                    <span>
                                        {getFormattedMessage(
                                            "dashboard.stockAlert.product.label"
                                        )}
                                    </span>
                                </div>
                            )}
                            {config?.includes(Permissions.MANAGE_EXPENSES) && (
                                <div
                                    onClick={() => goToQuickAdd("/app/expenses/create")}
                                    className="hdr-dropdown-item"
                                >
                                    <div className="hdr-item-icon">
                                        <FontAwesomeIcon icon={faMoneyBills} />
                                    </div>
                                    <span>
                                        {getFormattedMessage("expense.title")}
                                    </span>
                                </div>
                            )}
                        </div>,
                        document.body
                    )}
                </div>
                <div className="navbar-nav me-auto mb-2 mb-lg-0">
                    {location.pathname === "/app/profile/edit" ? (
                        <div className="nav-item position-relative mx-xl-3 mb-3 mb-xl-0">
                            <Link
                                to="/app/profile/edit"
                                className={`${location.pathname === "/app/profile/edit"
                                    ? "active"
                                    : ""
                                    } nav-link p-0`}
                            >
                                <span>
                                    {getFormattedMessage(
                                        "update-profile.title"
                                    )}
                                </span>
                            </Link>
                        </div>
                    ) : (
                        asideConfig &&
                        asideConfig.map((mainItems, index) => {
                            // Grupos de un solo tab (ej. "Dashboard", que
                            // solo repite el título de la página) no aportan
                            // nada para navegar -- en mobile se ocultan via
                            // .top-nav-single-item (ver custom.css), a
                            // diferencia de Reportes/Configuración que sí
                            // tienen varios tabs entre los que cambiar.
                            const tabCount = (mainItems.items || mainItems.subMenu || []).length;
                            const singleItemClass = tabCount > 1 ? '' : ' top-nav-single-item';
                            return (
                                <div
                                    key={index}
                                    className={`${location.pathname === mainItems.to ||
                                        location.pathname === mainItems.path ||
                                        location.pathname ===
                                        mainItems.stockPath ||
                                        location.pathname ===
                                        mainItems.productPath ||
                                        location.pathname ===
                                        mainItems.purchasePath ||
                                        location.pathname ===
                                        mainItems.topSellingPath ||
                                        location.pathname ===
                                        mainItems.productQuantityAlertPath ||
                                        location.pathname ===
                                        mainItems.prefixesPath ||
                                        location.pathname ===
                                        mainItems.supplierReportPath ||
                                        location.pathname ===
                                        mainItems.customerReportPath ||
                                        location.pathname ===
                                        mainItems.bestCustomerReportPath ||
                                        location.pathname ===
                                        mainItems.registerReportPath ||
                                        location.pathname ===
                                        mainItems.mailSettingsPath ||
                                        location.pathname ===
                                        mainItems.profitLossReportPath ||
                                        location.pathname.includes(
                                            mainItems.to
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.userSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.customerSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.loginLogsSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.suppliareSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.productsSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath
                                                ?.categoriesSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.brandsSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.unitsSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.baseUnitsSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.barcodeSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.purchasesSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath
                                                ?.purchaseReturnSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.salesSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath
                                                ?.salesReturnSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath
                                                ?.electronicInvoicesSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.expensesSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath
                                                ?.expenseCategoriesSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath
                                                ?.emailTemplateSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath
                                                ?.smsTemplateSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.smsApiSubPath
                                        ) ||
                                        location.pathname ===
                                        mainItems.stockDetailPath +
                                        "/" +
                                        id.id ||
                                        location.pathname ===
                                        mainItems.customerReportDetailsPath +
                                        "/" +
                                        id.id ||
                                        location.pathname ===
                                        mainItems.supplierReportDetailsPath +
                                        "/" +
                                        id.id
                                        ? `d-flex align-items-center${singleItemClass}`
                                        : "d-none"
                                        }`}
                                >
                                    <div
                                        className="report-nav-scroll d-flex align-items-center"
                                        onWheel={(event) => {
                                            const el = event.currentTarget;
                                            if (el.scrollWidth > el.clientWidth) {
                                                el.scrollLeft += event.deltaY;
                                                event.preventDefault();
                                            }
                                        }}
                                        onPointerDown={(event) => {
                                            // Arrastre tipo táctil con mouse -- en touch/pen el
                                            // navegador ya desliza esto de forma nativa (overflow-x:
                                            // auto), así que solo se engancha para mouse; reimplementar
                                            // el touch nativo a mano solo lo haría peor (sin inercia).
                                            if (event.pointerType !== 'mouse') return;
                                            const el = event.currentTarget;
                                            if (el.scrollWidth <= el.clientWidth) return;
                                            // Sin esto, el navegador interpreta el mousedown+arrastre
                                            // como selección de texto (o arrastre nativo de un
                                            // <a>/Link) en vez de dejarle el gesto a los handlers de
                                            // abajo -- el scroll no se movía en tiempo real durante el
                                            // arrastre, solo "saltaba" al soltar, cuando el navegador
                                            // resolvía esa selección/drag nativo.
                                            event.preventDefault();
                                            const startX = event.clientX;
                                            const startScrollLeft = el.scrollLeft;
                                            let dragged = false;
                                            el.classList.add('report-nav-scroll-dragging');
                                            const onMove = (moveEvent) => {
                                                const delta = moveEvent.clientX - startX;
                                                if (Math.abs(delta) > 3) dragged = true;
                                                el.scrollLeft = startScrollLeft - delta;
                                            };
                                            const onUp = () => {
                                                window.removeEventListener('pointermove', onMove);
                                                window.removeEventListener('pointerup', onUp);
                                                el.classList.remove('report-nav-scroll-dragging');
                                                if (dragged) {
                                                    // El drag termina con un click sobre el tab bajo el
                                                    // cursor -- sin esto, cada arrastre navegaría al
                                                    // reporte donde se soltó el mouse.
                                                    const suppressClick = (clickEvent) => {
                                                        clickEvent.preventDefault();
                                                        clickEvent.stopPropagation();
                                                        el.removeEventListener('click', suppressClick, true);
                                                    };
                                                    el.addEventListener('click', suppressClick, true);
                                                }
                                            };
                                            window.addEventListener('pointermove', onMove);
                                            window.addEventListener('pointerup', onUp);
                                        }}
                                    >
                                    {mainItems.items
                                        ? mainItems.items.map((item, index) => {
                                            if (index <= 4) {
                                                return (
                                                    <div
                                                        key={index}
                                                        className={`nav-item ${location.pathname.includes(
                                                            "report"
                                                        )
                                                            ? "report-nav-item"
                                                            : ""
                                                            } position-relative mx-xl-3 mb-3 mb-xl-0 mx-1`}
                                                    >
                                                        <Link
                                                            to={item.to}
                                                            className={`nav-link p-0 ${location.pathname ===
                                                                item.to ||
                                                                (mainItems.isSamePrefix
                                                                    ? null
                                                                    : location.pathname.includes(
                                                                        mainItems.to
                                                                    )) ||
                                                                location.pathname ===
                                                                item.detail +
                                                                "/" +
                                                                id.id ||
                                                                location.pathname ===
                                                                "/app/profile/edit"
                                                                ? " active"
                                                                : ""
                                                                }`}
                                                        >
                                                            {location.pathname ===
                                                                "/app/profile/edit" ? (
                                                                <span>
                                                                    {getFormattedMessage(
                                                                        "update-profile.title"
                                                                    )}
                                                                </span>
                                                            ) : (
                                                                <span>
                                                                    {
                                                                        item.title
                                                                    }
                                                                </span>
                                                            )}
                                                        </Link>
                                                    </div>
                                                );
                                            }
                                        })
                                        : mainItems?.subMenu?.map(
                                            (item, index) => {
                                                return location.pathname ===
                                                    item.to ||
                                                    location.pathname.includes(
                                                        item.to
                                                    ) ? (
                                                    <div
                                                        key={index}
                                                        className="nav-item position-relative mx-xl-3 mb-3 mb-xl-0 mx-1"
                                                    >
                                                        <Link
                                                            to={item.to}
                                                            className={`nav-link p-0 ${location.pathname ===
                                                                item.to ||
                                                                location.pathname.includes(
                                                                    item.to
                                                                ) ||
                                                                (mainItems.isSamePrefix
                                                                    ? null
                                                                    : location.pathname.includes(
                                                                        mainItems.to
                                                                    )) ||
                                                                location.pathname ===
                                                                item.detail +
                                                                "/" +
                                                                id.id ||
                                                                location.pathname ===
                                                                "/app/profile/edit"
                                                                ? " active"
                                                                : ""
                                                                }`}
                                                        >
                                                            <span>
                                                                {getFormattedMessage(
                                                                    item.title
                                                                )}
                                                            </span>
                                                        </Link>
                                                    </div>
                                                ) : null;
                                            }
                                        )}
                                    </div>
                                    {/* Report Dropdown  */}
                                    {location.pathname.includes("report") && (
                                        <Dropdown className="d-flex align-items-stretch">
                                            <Dropdown.Toggle
                                                className="hide-arrow bg-transparent border-0 p-0 d-flex align-items-center"
                                                id="dropdown-basic"
                                            >
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <span className="ms-2 text-gray-600 d-none d-sm-block">
                                                        {getFormattedMessage(
                                                            "more-report.option.title"
                                                        )}
                                                    </span>
                                                </div>
                                                <FontAwesomeIcon
                                                    icon={faAngleDown}
                                                    className="text-gray-600 ms-2 d-none d-sm-block"
                                                />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className="mt-6">
                                                {mainItems.items &&
                                                    mainItems.items.map(
                                                        (item, index) => {
                                                            if (index >= 5) {
                                                                return (
                                                                    <Dropdown.Item
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="px-0 py-0 fs-6"
                                                                        active={
                                                                            location.pathname ===
                                                                                item.to ||
                                                                                location.pathname.includes(
                                                                                    item.to
                                                                                )
                                                                                ? true
                                                                                : false
                                                                        }
                                                                    >
                                                                        <div className="position-relative mx-xl-3 mb-3 mb-xl-0 ">
                                                                            <Link
                                                                                to={
                                                                                    item.to
                                                                                }
                                                                                className={`nav-link px-3 py-2 ${location.pathname ===
                                                                                    item.to ||
                                                                                    (mainItems.isSamePrefix
                                                                                        ? null
                                                                                        : location.pathname.includes(
                                                                                            mainItems.to
                                                                                        )) ||
                                                                                    location.pathname ===
                                                                                    item.detail +
                                                                                    "/" +
                                                                                    id.id ||
                                                                                    location.pathname ===
                                                                                    "/app/profile/edit"
                                                                                    ? "text-white"
                                                                                    : ""
                                                                                    }`}
                                                                            >
                                                                                <span>
                                                                                    {
                                                                                        item.title
                                                                                    }
                                                                                </span>
                                                                            </Link>
                                                                        </div>

                                                                    </Dropdown.Item>
                                                                );
                                                            }
                                                        }
                                                    )}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </nav>
    );
};

export default AsideTopSubMenuItem;
