import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast, Slide } from "react-toastify";
import apiConfig from "../../config/apiConfig";
import { toastType } from "../../constants";
import { addToast } from "../../store/action/toastAction";
import {
    getOfflineSales,
    OFFLINE_SALES_EVENT,
    updateOfflineSale,
} from "../../offline/catalogStorage";

// Avisa cuando el SRI responde por la factura de una venta hecha en este
// dispositivo. Toda venta pasa por la cola local (IndexedDB) y, al
// confirmarse en el servidor, queda con `serverSaleId` y
// `electronicInvoiceQueued`; aquí se consulta el estado de esas facturas
// hasta que el SRI las autoriza o rechaza. Vive en App para que el aviso
// llegue aunque el cajero ya esté en otra pantalla.

// Solo ventas recientes: evita una ráfaga de avisos por facturas viejas.
const WATCH_WINDOW_MS = 6 * 60 * 60 * 1000;
const IDLE_CHECK_MS = 20000;
const MAX_PER_ROUND = 5;

const toastConfig = (autoClose) => ({
    position: toast.POSITION.TOP_RIGHT,
    closeButton: false,
    transition: Slide,
    autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
});

// La autorización suele llegar en segundos: al principio se consulta
// seguido y luego se espacia para no cargar el servidor.
const pollDelayFor = (sale) => {
    const age = Date.now() - new Date(sale.syncedAt || sale.updatedAt).getTime();
    if (age < 2 * 60 * 1000) return 4000;
    if (age < 10 * 60 * 1000) return 15000;
    return 60000;
};

const isWatched = (sale) => sale.status === "synced"
    && sale.electronicInvoiceQueued
    && sale.serverSaleId
    && !sale.sriAlert
    && Date.now() - new Date(sale.syncedAt || sale.updatedAt).getTime() < WATCH_WINDOW_MS;

const firstSriMessage = (mensajes) => {
    const first = Array.isArray(mensajes) ? mensajes[0] : null;
    if (!first) return "";
    return [first.mensaje, first.informacionAdicional].filter(Boolean).join(": ");
};

const invoiceLabel = (data, sale) => data?.numero_comprobante
    || sale.serverReference
    || `de la venta ${sale.serverSaleId}`;

const ElectronicInvoiceWatcher = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        let stopped = false;
        let timer = null;
        let running = false;
        const nextCheck = new Map();

        const notify = (text, type, autoClose, withLink = false) => dispatch(addToast({
            text,
            type,
            config: toastConfig(autoClose),
            ...(withLink ? {
                actionLabel: "Ver facturas",
                onAction: () => { window.location.hash = "#/app/electronic-invoices"; },
            } : {}),
        }));

        const checkSale = async (sale) => {
            let data;
            try {
                const response = await apiConfig.get(`/sales/${sale.serverSaleId}/electronic-invoice/estado`);
                data = response.data?.data;
            } catch (error) {
                const status = error?.response?.status;
                // La venta no es de la tienda activa o ya no existe: no hay
                // nada que vigilar. Otros errores (red, 5xx) se reintentan.
                if ([403, 404].includes(status)) {
                    await updateOfflineSale(sale.clientUuid, { sriAlert: "SIN_ESTADO" });
                }
                return;
            }
            if (!data) return;

            const label = invoiceLabel(data, sale);
            if (data.esta_autorizada) {
                await updateOfflineSale(sale.clientUuid, { sriAlert: "AUTORIZADA" });
                notify(`Factura ${label} autorizada por el SRI.`, undefined, 8000);
                return;
            }
            if (data.esta_rechazada) {
                await updateOfflineSale(sale.clientUuid, { sriAlert: data.estado });
                const detail = firstSriMessage(data.mensajes);
                notify(
                    `El SRI no autorizó la factura ${label}${detail ? ` (${detail})` : ""}. Revísala en Facturas electrónicas.`,
                    toastType.ERROR,
                    false,
                    true
                );
                return;
            }
            if (data.estado === "ERROR_TEMPORAL_SRI" && !sale.sriWarned) {
                // No es un rechazo: el SRI falló por su lado. Se avisa una
                // vez y se sigue vigilando por si se completa el reenvío.
                await updateOfflineSale(sale.clientUuid, { sriWarned: true });
                notify(
                    `El SRI tuvo un problema temporal con la factura ${label}. Puedes reintentarla desde Facturas electrónicas.`,
                    toastType.WARNING,
                    10000,
                    true
                );
            }
        };

        const schedule = (delay) => {
            if (stopped) return;
            clearTimeout(timer);
            timer = setTimeout(run, delay);
        };

        const run = async () => {
            if (stopped || running) return;
            running = true;
            let delay = IDLE_CHECK_MS;
            try {
                if (navigator.onLine) {
                    const sales = (await getOfflineSales().catch(() => [])).filter(isWatched);
                    const now = Date.now();
                    const due = sales
                        .filter((sale) => (nextCheck.get(sale.clientUuid) || 0) <= now)
                        .slice(0, MAX_PER_ROUND);
                    for (const sale of due) {
                        if (stopped) break;
                        await checkSale(sale);
                        nextCheck.set(sale.clientUuid, Date.now() + pollDelayFor(sale));
                    }
                    const pending = (await getOfflineSales().catch(() => [])).filter(isWatched);
                    if (pending.length) {
                        const soonest = Math.min(...pending.map((sale) =>
                            (nextCheck.get(sale.clientUuid) || Date.now()) - Date.now()));
                        delay = Math.max(1000, Math.min(IDLE_CHECK_MS, soonest));
                    }
                }
            } finally {
                running = false;
                schedule(delay);
            }
        };

        // Una venta recién confirmada dispara este evento: se revisa de
        // inmediato en lugar de esperar al siguiente ciclo.
        const onSalesChanged = () => schedule(1500);
        window.addEventListener(OFFLINE_SALES_EVENT, onSalesChanged);
        window.addEventListener("online", onSalesChanged);
        schedule(3000);

        return () => {
            stopped = true;
            clearTimeout(timer);
            window.removeEventListener(OFFLINE_SALES_EVENT, onSalesChanged);
            window.removeEventListener("online", onSalesChanged);
        };
    }, [dispatch]);

    return null;
};

export default ElectronicInvoiceWatcher;
