import React from "react";
import { Permissions } from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faChartLine,
    faCartShopping,
    faUserGroup,
    faHandHoldingDollar,
    faBuildingColumns,
    faBagShopping,
    faFileInvoiceDollar,
    faCashRegister,
    faMoneyBills,
    faBoxesStacked,
    faLayerGroup,
    faClipboardList,
    faSliders,
    faRightLeft,
    faListCheck,
    faReceipt,
    faTruck,
    faChartColumn,
    faStore,
    faUserShield,
    faGear,
} from "@fortawesome/free-solid-svg-icons";
import { getFormattedMessage } from "../shared/sharedMethod";

// Estructura del menú, ordenada por lo que hace un negocio en el día
// (vender, facturar, caja, productos, inventario, compras) y no por las
// tablas de la base.
//
// - {tabs: [...]}: pantallas hermanas que comparten una sola entrada del
//   menú; SectionTabs.js las muestra como pestañas arriba del contenido.
//   MasterLayout.js filtra cada pestaña por su permiso y deja la entrada
//   apuntando a la primera pestaña permitida.
// - {subMenu: [...]}: acordeones de Administración, cerrados por defecto.
// - {groupHeader: true, title}: MasterLayout.js los quita si ningún ítem
//   del grupo sobrevive al filtro de permisos (pruneEmptyGroups).
//
// Las rutas ("to") no cambian, así que permisos, enlaces guardados y la
// búsqueda global siguen igual. Los textos del menú usan claves propias
// "sidebar.*" para no alterar los títulos de las páginas.
export default [
    {
        title: "sidebar.item.dashboard",
        name: "dashboard",
        fontIcon: <FontAwesomeIcon icon={faHouse} />,
        to: "/app/dashboard",
        class: "d-flex",
        permission: Permissions.MANAGE_DASHBOARD,
        items: [
            {
                title: getFormattedMessage("dashboard.title"),
                to: "/app/dashboard",
            },
        ],
    },
    {
        title: "sidebar.item.my-sales",
        name: "my-sales",
        fontIcon: <FontAwesomeIcon icon={faChartLine} />,
        to: "/app/my-sales",
        class: "d-flex",
        permission: Permissions.MANAGE_SELLER_DASHBOARD,
        items: [
            {
                title: getFormattedMessage("my-sales.title"),
                to: "/app/my-sales",
            },
        ],
    },
    {
        // No se dibuja como ítem (class d-none): AsideMenu.js lo usa para
        // decidir si muestra el botón "Vender" y Header.js para el botón POS.
        to: "/app/pos",
        class: "d-none",
        name: "pos",
        title: "header.pos.title",
        permission: Permissions.MANAGE_POS_SCREEN,
    },

    { groupHeader: true, title: "sidebar.group.sales" },
    {
        title: "sales.title",
        name: "sales",
        fontIcon: <FontAwesomeIcon icon={faCartShopping} />,
        to: "/app/sales",
        class: "d-flex",
        tabs: [
            { title: "sales.title", name: "sales", to: "/app/sales", permission: Permissions.MANAGE_SALE },
            { title: "sidebar.item.quotations", name: "quotations", to: "/app/quotations", permission: Permissions.MANAGE_QUOTATION },
            { title: "sidebar.tab.returns", name: "sales return", to: "/app/sale-return", permission: Permissions.MANAGE_SALE_RETURN },
        ],
    },
    {
        title: "sidebar.item.sri-documents",
        name: "electronic invoices",
        fontIcon: <FontAwesomeIcon icon={faFileInvoiceDollar} />,
        to: "/app/electronic-invoices",
        class: "d-flex",
        tabs: [
            { title: "sidebar.item.electronic-documents", name: "electronic invoices", to: "/app/electronic-invoices", permission: Permissions.MANAGE_ELECTRONIC_INVOICES },
            { title: "sidebar.item.credit-notes", name: "credit notes", to: "/app/credit-notes", permission: Permissions.MANAGE_SALE },
        ],
    },
    {
        title: "customers.title",
        name: "customers",
        fontIcon: <FontAwesomeIcon icon={faUserGroup} />,
        to: "/app/customers",
        class: "d-flex",
        permission: Permissions.MANAGE_CUSTOMERS,
    },
    {
        title: "accounts-receivable.title",
        name: "accounts receivable",
        fontIcon: <FontAwesomeIcon icon={faHandHoldingDollar} />,
        to: "/app/accounts-receivable",
        class: "d-flex",
        permission: Permissions.ACCOUNTS_RECEIVABLE_ACCESS,
    },
    {
        title: "sidebar.item.bank-transfers",
        name: "bank transfer payments",
        fontIcon: <FontAwesomeIcon icon={faBuildingColumns} />,
        to: "/app/bank-transfer-payments",
        class: "d-flex",
        permission: Permissions.BANK_TRANSFER_PAYMENTS_ACCESS,
    },
    {
        title: "catalog.orders.title",
        name: "catalog orders",
        fontIcon: <FontAwesomeIcon icon={faBagShopping} />,
        to: "/app/catalog-orders",
        class: "d-flex",
        permission: Permissions.MANAGE_CATALOG_ORDERS,
    },

    { groupHeader: true, title: "sidebar.group.purchases" },
    {
        title: "sidebar.item.purchases",
        name: "purchases",
        fontIcon: <FontAwesomeIcon icon={faReceipt} />,
        to: "/app/purchases",
        class: "d-flex",
        tabs: [
            { title: "sidebar.item.purchases", name: "purchases", to: "/app/purchases", permission: Permissions.MANAGE_PURCHASE },
            { title: "sidebar.tab.returns", name: "purchases return", to: "/app/purchase-return", permission: Permissions.MANAGE_PURCHASE_RETURN },
        ],
    },
    {
        title: "suppliers.title",
        name: "suppliers",
        fontIcon: <FontAwesomeIcon icon={faTruck} />,
        to: "/app/suppliers",
        class: "d-flex",
        permission: Permissions.MANAGE_SUPPLIERS,
    },

    { groupHeader: true, title: "sidebar.group.cash" },
    {
        title: "sidebar.item.cash-control",
        name: "cash control",
        fontIcon: <FontAwesomeIcon icon={faCashRegister} />,
        to: "/app/cash-control",
        class: "d-flex",
        permission: Permissions.CASH_CONTROL_ACCESS,
    },
    {
        title: "expenses.title",
        name: "expenses",
        fontIcon: <FontAwesomeIcon icon={faMoneyBills} />,
        to: "/app/expenses",
        class: "d-flex",
        tabs: [
            { title: "expenses.title", name: "expenses", to: "/app/expenses", permission: Permissions.MANAGE_EXPENSES },
            { title: "sidebar.item.categories", name: "expense categories", to: "/app/expense-categories", permission: Permissions.MANAGE_EXPENSES_CATEGORIES },
        ],
    },

    { groupHeader: true, title: "sidebar.group.products" },
    {
        title: "sidebar.item.products",
        name: "products",
        fontIcon: <FontAwesomeIcon icon={faBoxesStacked} />,
        to: "/app/products",
        class: "d-flex",
        tabs: [
            { title: "sidebar.item.products", name: "products", to: "/app/products", permission: Permissions.MANAGE_PRODUCTS },
            { title: "sidebar.tab.kits", name: "product kits", to: "/app/product-kits", permission: Permissions.MANAGE_PRODUCTS },
            { title: "sidebar.item.print-barcode", name: "print barcode", to: "/app/print/barcode", permission: Permissions.MANAGE_PRODUCTS },
        ],
    },
    {
        // Datos maestros que se configuran una vez y casi no se tocan.
        title: "sidebar.item.classification",
        name: "classification",
        fontIcon: <FontAwesomeIcon icon={faLayerGroup} />,
        to: "/app/product-categories",
        class: "d-flex",
        tabs: [
            { title: "sidebar.item.categories", name: "product categories", to: "/app/product-categories", permission: Permissions.MANAGE_PRODUCT_CATEGORIES },
            { title: "brands.title", name: "brands", to: "/app/brands", permission: Permissions.MANAGE_BRANDS },
            { title: "variations.title", name: "variations", to: "/app/variations", permission: Permissions.MANAGE_VARIATIONS },
            { title: "units.title", name: "units", to: "/app/units", permission: Permissions.MANAGE_UNITS },
            { title: "base-units.title", name: "base units", to: "/app/base-units", permission: Permissions.MANAGE_UNITS },
        ],
    },

    { groupHeader: true, title: "sidebar.group.inventory" },
    {
        title: "kardex.title",
        name: "kardex",
        fontIcon: <FontAwesomeIcon icon={faClipboardList} />,
        to: "/app/kardex",
        class: "d-flex",
        permission: Permissions.MANAGE_KARDEX,
    },
    {
        title: "sidebar.item.adjustments",
        name: "adjustments",
        fontIcon: <FontAwesomeIcon icon={faSliders} />,
        to: "/app/adjustments",
        class: "d-flex",
        permission: Permissions.MANAGE_ADJUSTMENTS,
    },
    {
        title: "sidebar.item.transfers",
        name: "transfers",
        fontIcon: <FontAwesomeIcon icon={faRightLeft} />,
        to: "/app/transfers",
        class: "d-flex",
        permission: Permissions.MANAGE_TRANSFERS,
    },
    {
        title: "inventory-counts.title",
        name: "inventory counts",
        fontIcon: <FontAwesomeIcon icon={faListCheck} />,
        to: "/app/inventory-counts",
        class: "d-flex",
        permission: Permissions.INVENTORY_COUNTS_ACCESS,
    },

    { groupHeader: true, title: "sidebar.group.analysis" },
    {
        title: "sidebar.item.reports",
        name: "reports",
        fontIcon: <FontAwesomeIcon icon={faChartColumn} />,
        to: "/app/report/report-warehouse",
        path: "/app/report/report-sale",
        stockPath: "/app/report/report-stock",
        purchasePath: "/app/report/report-purchase",
        topSellingPath: "/app/report/report-top-selling-products",
        stockDetailPath: "/app/report/report-detail-stock",
        productQuantityAlertPath: "/app/report/report-product-quantity",
        supplierReportPath: "/app/report/suppliers",
        profitLossReportPath: "/app/report/profit-loss",
        supplierReportDetailsPath: "/app/report/suppliers/details",
        bestCustomerReportPath: "/app/report/best-customers",
        customerReportPath: "/app/report/customers",
        customerReportDetailsPath: "/app/report/customers/details",
        registerReportPath: "/app/report/register",
        class: "d-flex",
        isSamePrefix: "true",
        permission: Permissions.MANAGE_REPORTS,
        subTitles: [
            { title: "warehouse.reports.title" },
            { title: "sale.reports.title" },
            { title: "stock.reports.title" },
            { title: "purchase.reports.title" },
            { title: "top-selling-product.reports.title" },
            { title: "product.quantity.alert.reports.title" },
            { title: "supplier.report.title" },
            { title: "profit-loss.reports.title" },
            { title: "best-customer.report.title" },
            { title: "customer.report.title" },
            { title: "register.report.title" },
        ],
        items: [
            {
                title: getFormattedMessage("warehouse.reports.title"),
                to: "/app/report/report-warehouse",
            },
            {
                title: getFormattedMessage("sale.reports.title"),
                to: "/app/report/report-sale",
            },
            {
                title: getFormattedMessage("stock.reports.title"),
                to: "/app/report/report-stock",
                detail: "/app/report/report-detail-stock",
            },
            {
                title: getFormattedMessage("purchase.reports.title"),
                to: "/app/report/report-purchase",
            },
            {
                title: getFormattedMessage("top-selling-product.reports.title"),
                to: "/app/report/report-top-selling-products",
            },
            {
                title: getFormattedMessage(
                    "product.quantity.alert.reports.title"
                ),
                to: "/app/report/report-product-quantity",
            },
            {
                title: getFormattedMessage("supplier.report.title"),
                to: "/app/report/suppliers",
                detail: "/app/report/suppliers/details",
            },
            {
                title: getFormattedMessage("profit-loss.reports.title"),
                to: "/app/report/profit-loss",
            },
            {
                title: getFormattedMessage("best-customer.report.title"),
                to: "/app/report/best-customers",
            },
            {
                title: getFormattedMessage("customer.report.title"),
                to: "/app/report/customers",
                detail: "/app/report/customers/details",
            },
            {
                title: getFormattedMessage("register.report.title"),
                to: "/app/report/register",
            },
        ],
    },

    // Administración: tres acordeones cerrados por defecto. Se abren solos
    // cuando la página actual es una de sus rutas (isSubActive en AsideMenu).
    { groupHeader: true, title: "sidebar.group.admin" },
    {
        title: "sidebar.item.business",
        name: "general settings",
        fontIcon: <FontAwesomeIcon icon={faStore} />,
        to: "/app/settings",
        class: "d-flex",
        is_submenu: "true",
        permission: Permissions.MANAGE_SETTING,
        subPath: {
            settingsSubPath: "/app/settings",
            storesSubPath: "/app/stores",
            warehouseSubPath: "/app/warehouse",
            sriConfigSubPath: "/app/sri-config",
            prefixesSubPath: "/app/prefixes",
            catalogSettingsSubPath: "/app/catalog-settings",
        },
        subMenu: [
            {
                title: "sidebar.item.general-settings",
                name: "settings",
                to: "/app/settings",
                class: "d-flex",
                permission: Permissions.MANAGE_SETTING,
            },
            {
                title: "sidebar.item.stores",
                name: "stores",
                to: "/app/stores",
                class: "d-flex",
                permission: Permissions.MANAGE_STORES,
            },
            {
                title: "sidebar.item.warehouses",
                name: "warehouse",
                to: "/app/warehouse",
                class: "d-flex",
                permission: Permissions.MANAGE_WAREHOUSES,
            },
            {
                title: "sri.settings.title",
                name: "sri settings",
                to: "/app/sri-config",
                class: "d-flex",
                permission: Permissions.MANAGE_SRI_CONFIG,
            },
            {
                title: "sidebar.item.prefixes",
                name: "prefixes",
                to: "/app/prefixes",
                class: "d-flex",
                permission: Permissions.MANAGE_SETTING,
            },
            {
                title: "catalog.virtual.title",
                name: "catalog settings",
                to: "/app/catalog-settings",
                class: "d-flex",
                permission: Permissions.MANAGE_STORES,
            },
        ],
    },
    {
        title: "sidebar.item.access",
        name: "access",
        fontIcon: <FontAwesomeIcon icon={faUserShield} />,
        to: "/app/users",
        class: "d-flex",
        is_submenu: "true",
        permission: Permissions.MANAGE_USER,
        subPath: {
            userSubPath: "/app/users",
            rolesSubPath: "/app/roles",
            loginLogsSubPath: "/app/login-logs",
        },
        subMenu: [
            {
                title: "users.title",
                name: "users",
                to: "/app/users",
                class: "d-flex",
                permission: Permissions.MANAGE_USER,
            },
            {
                title: "sidebar.item.roles",
                name: "roles",
                to: "/app/roles",
                class: "d-flex",
                permission: Permissions.MANAGE_ROLES,
            },
            {
                title: "sidebar.item.login-logs",
                name: "login-logs",
                to: "/app/login-logs",
                class: "d-flex",
                permission: Permissions.MANAGE_LOGIN_LOGS,
            },
        ],
    },
    {
        title: "sidebar.item.advanced",
        name: "advanced",
        fontIcon: <FontAwesomeIcon icon={faGear} />,
        to: "/app/mail-settings",
        class: "d-flex",
        is_submenu: "true",
        permission: Permissions.MANAGE_SETTING,
        subPath: {
            mailSettingsSubPath: "/app/mail-settings",
            emailTemplateSubPath: "/app/email-templates",
            smsTemplateSubPath: "/app/sms-templates",
            smsApiSubPath: "/app/sms-api",
            currenciesSubPath: "/app/currencies",
            languagesSubPath: "/app/languages",
        },
        subMenu: [
            {
                title: "sidebar.item.mail-settings",
                name: "mail settings",
                to: "/app/mail-settings",
                class: "d-flex",
                permission: Permissions.MANAGE_SETTING,
            },
            {
                title: "sidebar.item.email-templates",
                name: "email-templates",
                to: "/app/email-templates",
                class: "d-flex",
                permission: Permissions.MANAGE_EMAIL_TEMPLATES,
            },
            {
                title: "sms-template.title",
                name: "sms-templates",
                to: "/app/sms-templates",
                class: "d-flex",
                permission: Permissions.MANAGE_SMS_TEMPLATES,
            },
            {
                title: "sms-api.title",
                name: "sms-api",
                to: "/app/sms-api",
                class: "d-flex",
                permission: Permissions.MANAGE_SMS_API,
            },
            {
                title: "currencies.title",
                name: "currencies",
                to: "/app/currencies",
                class: "d-flex",
                permission: Permissions.MANAGE_CURRENCY,
            },
            {
                title: "languages.title",
                name: "languages",
                to: "/app/languages",
                class: "d-flex",
                permission: Permissions.MANAGE_LANGUAGES,
            },
        ],
    },
];
