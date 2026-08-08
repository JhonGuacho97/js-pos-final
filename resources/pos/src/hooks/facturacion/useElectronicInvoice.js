// src/hooks/useElectronicInvoice.js

import { useState, useRef, useCallback, useEffect } from "react";
import apiConfig from "../../config/apiConfig"; // ← tu cliente HTTP ya autenticado

const POLL_INTERVAL_MS = 3000;
const POLL_MAX_ATTEMPTS = 40;

export const useElectronicInvoice = () => {
    const [estado, setEstado] = useState(null);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const pollRef = useRef(null);
    const attemptsRef = useRef(0);
    const timeoutRef = useRef(null);

    const detenerPolling = useCallback(() => {
        if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
        }
        // El setTimeout de 1.5s en emitir()/reintentar() no se limpiaba
        // acá -- si el usuario cerraba el modal o navegaba antes de que
        // pasara ese tiempo, consultarEstado() igual se ejecutaba y
        // llamaba setState sobre un hook ya desmontado.
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const consultarEstado = useCallback(async (saleId) => {
        try {
            const res = await apiConfig.get(`/sales/${saleId}/electronic-invoice/estado`);
            const result = res.data.data;

            setData(result);
            setEstado(result.estado);

            if (result.esta_autorizada || result.esta_rechazada) {
                detenerPolling();
                setLoading(false);
            }
        } catch (err) {
            if (err.response?.status !== 404) {
                setError(err.response?.data?.message || "Error consultando estado");
                detenerPolling();
                setLoading(false);
            }
        }
    }, [detenerPolling]);

    const iniciarPolling = useCallback((saleId) => {
        attemptsRef.current = 0;
        detenerPolling();

        pollRef.current = setInterval(() => {
            attemptsRef.current += 1;

            if (attemptsRef.current > POLL_MAX_ATTEMPTS) {
                detenerPolling();
                setLoading(false);
                setError("Tiempo de espera agotado. Verifica el estado más tarde.");
                return;
            }

            consultarEstado(saleId);
        }, POLL_INTERVAL_MS);
    }, [consultarEstado, detenerPolling]);

    const emitir = useCallback(async (saleId) => {
        setLoading(true);
        setError(null);
        setEstado("PENDIENTE");

        try {
            await apiConfig.post(`/sales/${saleId}/electronic-invoice/emitir`);
            timeoutRef.current = setTimeout(() => consultarEstado(saleId), 1500);
            iniciarPolling(saleId);
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || "Error al emitir la factura");
        }
    }, [consultarEstado, iniciarPolling]);

    const reintentar = useCallback(async (saleId) => {
        setLoading(true);
        setError(null);
        setEstado("PENDIENTE");

        try {
            await apiConfig.post(`/sales/${saleId}/electronic-invoice/reintentar`);
            timeoutRef.current = setTimeout(() => consultarEstado(saleId), 1500);
            iniciarPolling(saleId);
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || "Error al reintentar");
        }
    }, [consultarEstado, iniciarPolling]);

    const verificarExistente = useCallback(async (saleId) => {
        try {
            const res = await apiConfig.get(`/sales/${saleId}/electronic-invoice/estado`);
            const result = res.data.data;
            setData(result);
            setEstado(result.estado);

            if (result.esta_pendiente) {
                setLoading(true);
                iniciarPolling(saleId);
            }
        } catch (err) {
            if (err.response?.status !== 404) {
                setError(err.response?.data?.message || "Error verificando estado");
            }
        }
    }, [iniciarPolling]);

    useEffect(() => {
        return () => detenerPolling();
    }, [detenerPolling]);

    return {
        estado,
        data,
        error,
        loading,
        emitir,
        reintentar,
        verificarExistente,
        rideUrl: data?.id ? `/api/electronic-invoices/${data.id}/ride` : null,
    };
};