import apiConfig from "../config/apiConfig";

const blobUrlLifetime = 60000;

export const openProtectedPdf = async (path) => {
    // Se abre de inmediato para que el navegador no lo bloquee como popup
    // cuando termine la petición autenticada.
    const preview = window.open("", "_blank");
    if (preview) {
        preview.opener = null;
        preview.document.title = "Cargando comprobante...";
        preview.document.body.innerHTML = "<p style='font-family:sans-serif;padding:24px'>Cargando comprobante...</p>";
    }

    try {
        const response = await apiConfig.get(path, { responseType: "blob" });
        const url = URL.createObjectURL(response.data);

        if (preview) {
            preview.location.replace(url);
        } else {
            const link = document.createElement("a");
            link.href = url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.click();
        }

        window.setTimeout(() => URL.revokeObjectURL(url), blobUrlLifetime);
    } catch (error) {
        preview?.close();
        window.alert(error.response?.data?.message || "No se pudo abrir el comprobante.");
    }
};

export const downloadProtectedFile = async (path, fallbackName) => {
    try {
        const response = await apiConfig.get(path, { responseType: "blob" });
        const url = URL.createObjectURL(response.data);
        const disposition = response.headers?.["content-disposition"] || "";
        const match = disposition.match(/filename="?([^";]+)"?/i);
        const link = document.createElement("a");
        link.href = url;
        link.download = match?.[1] || fallbackName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), blobUrlLifetime);
    } catch (error) {
        window.alert(error.response?.data?.message || "No se pudo descargar el comprobante.");
    }
};
