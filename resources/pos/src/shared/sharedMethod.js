import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Navigate } from "react-router-dom";
import { Tokens } from "../constants";
import { routePermissions } from "../routePermissions";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(isoWeek);
dayjs.extend(relativeTime);

export const getAvatarName = (name) => {
    if (name) {
        return name
            .toLowerCase()
            .split(" ")
            .map((s) => s.charAt(0).toUpperCase())
            .join("");
    }
};

export const numValidate = (event) => {
    const allowedKeys = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
    ];

    if (allowedKeys.includes(event.key)) {
        return;
    }

    // Permitir un solo punto decimal
    if (event.key === ".") {
        if (event.target.value.includes(".")) {
            event.preventDefault();
        }
        return;
    }

    if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
    }
};

export const getFormattedMessage = (id) => {
    // Typo real: era "defaultMessgae" -- react-intl no reconoce esa prop,
    // así que nunca tenía un fallback real. Cada vez que un id no existe
    // en el locale activo (frecuente en los idiomas que no son inglés,
    // o en features nuevas como SRI/notas de crédito que no se
    // tradujeron a todos los locales), react-intl lo logueaba como error
    // en consola en vez de mostrar el id como texto de respaldo.
    return <FormattedMessage id={id} defaultMessage={id} />;
};

export const getFormattedOptions = (options) => {
    const intl = useIntl();
    const copyOptions = _.cloneDeep(options);
    copyOptions.map(
        (option) =>
        (option.name = intl.formatMessage({
            id: option.name,
            defaultMessage: option.name,
        }))
    );
    return copyOptions;
};

export const placeholderText = (label) => {
    const intl = useIntl();
    const placeholderLabel = intl.formatMessage({ id: label });
    return placeholderLabel;
};

export const decimalValidate = (event) => {
    if (!/^\d*\.?\d*$/.test(event.key)) {
        event.preventDefault();
    }
};

export const addRTLSupport = (rtlLang) => {
    const html = document.getElementsByTagName("html")[0];
    const att = document.createAttribute("dir");
    att.value = "rtl";
    if (rtlLang === "ar") {
        html.setAttributeNode(att);
    } else {
        html.removeAttribute("dir");
    }
};

export const onFocusInput = (el) => {
    if (el.target.value === "0.00") {
        el.target.value = "";
    }
};

export const ProtectedRoute = (props) => {
    const { children, allConfigData, route } = props;
    const token = localStorage.getItem(Tokens.ADMIN);
    if (!token || token === null) {
        return <Navigate to="/login" replace={true} />;
    } else {
        if (allConfigData?.open_register) {
            if (route === "pos") {
                return <Navigate to="/app/dashboard" replace={true} />;
            } else {
                return children;
            }
        } else {
            return children;
        }
    }
};

export const formatAmount = (num) => {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num;
};

export const currencySymbolHandling = (
    isRightside,
    currency,
    value,
    is_forment
) => {
    if (isRightside?.is_currency_right === "true") {
        if (is_forment) {
            return formatAmount(value) + " " + currency;
        } else {
            return parseFloat(value).toFixed(2) + " " + currency;
        }
    } else {
        if (is_forment) {
            return currency + " " + formatAmount(value);
        } else {
            return currency + " " + parseFloat(value).toFixed(2);
        }
    }
};

export const getFormattedDate = (date, config) => {
    const format = config?.date_format;

    const parsedDate = dayjs.utc(date);

    switch (format) {
        case "d-m-y":
            return parsedDate.format("DD-MM-YYYY");
        case "m-d-y":
            return parsedDate.format("MM-DD-YYYY");
        case "y-m-d":
            return parsedDate.format("YYYY-MM-DD");
        case "m/d/y":
            return parsedDate.format("MM/DD/YYYY");
        case "d/m/y":
            return parsedDate.format("DD/MM/YYYY");
        case "y/m/d":
            return parsedDate.format("YYYY/MM/DD");
        case "m.d.y":
            return parsedDate.format("MM.DD.YYYY");
        case "d.m.y":
            return parsedDate.format("DD.MM.YYYY");
        case "y.m.d":
            return parsedDate.format("YYYY.MM.DD");
        default:
            return parsedDate.format("YYYY-MM-DD");
    }
};

/**
 * A dónde mandar a un usuario según sus permisos reales -- busca en la
 * lista de rutas registradas (routes.js) en vez de adivinar la ruta
 * cortando el texto del permiso (ej. "manage_pos_screen" -> "pos_screen"
 * no es una ruta válida, "manage_seller_dashboard" -> "seller_dashboard"
 * tampoco). Cualquier permiso con más de una palabra después de "manage_"
 * rompía esa adivinanza.
 *
 * excludePaths: rutas a evitar como destino (ej. no tiene sentido que el
 * botón "volver" del POS te regrese al POS mismo).
 */
export const getDefaultRouteForPermissions = (config, excludePaths = []) => {
    if (!config || !config.length) {
        return "/app/dashboard";
    }
    if (config.includes("manage_dashboard") && !excludePaths.includes("dashboard")) {
        return "/app/dashboard";
    }
    const match = routePermissions.find(
        (r) => config.includes(r.permission) && !excludePaths.includes(r.path)
    );
    return match ? `/app/${match.path}` : "/app/dashboard";
};