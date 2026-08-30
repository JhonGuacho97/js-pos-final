import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import apiConfig from "../../config/apiConfig";
import { registerCashInHandAction } from "../../store/action/pos/posRegisterDetailsAction";
import { currencySymbolHandling } from "../../shared/sharedMethod";
import DenominationCounter from "./DenominationCounter";
import { buildEmptyDenominationRows } from "../../shared/cashDenominations";
import "./pos-open-register.scss";

const PosRegisterModel = ({ showPosRegisterModel, onClickshowPosRegisterModel }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { frontSetting, allConfigData, settings } = useSelector((state) => state);
    const currencySymbol = frontSetting?.value?.currency_symbol || "$";
    const warehouseName = allConfigData?.default_warehouse_id
        ? allConfigData.default_warehouse_name
        : settings?.attributes?.warehouse_name;
    const storeName = frontSetting?.value?.company_name;

    const [rows, setRows] = useState(buildEmptyDenominationRows);
    const [cashInHand, setCashInHand] = useState(0);
    const [cashRegisters, setCashRegisters] = useState([]);
    const [selectedRegister, setSelectedRegister] = useState("");
    const [loadingRegisters, setLoadingRegisters] = useState(false);
    const [registersLoadFailed, setRegistersLoadFailed] = useState(false);
    const [lastClose, setLastClose] = useState(null);
    const [zeroCashConfirmed, setZeroCashConfirmed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    const money = (amount) =>
        currencySymbolHandling(
            allConfigData,
            currencySymbol,
            Number(amount || 0)
        );
    const hasCountInput = rows.some((row) => row.quantity !== "");
    const totalPieces = rows.reduce(
        (sum, row) => sum + (Number(row.quantity) || 0),
        0
    );
    const selectedRegisterData = cashRegisters.find(
        (register) => String(register.id) === String(selectedRegister)
    );
    const hasAvailableRegister = cashRegisters.some((register) => register.available);
    const canSubmit =
        !loadingRegisters &&
        !registersLoadFailed &&
        !isSubmitting &&
        (cashRegisters.length === 0 || Boolean(selectedRegister)) &&
        (hasCountInput || zeroCashConfirmed);

    useEffect(() => {
        if (!showPosRegisterModel) return;

        setRows(buildEmptyDenominationRows());
        setCashInHand(0);
        setCashRegisters([]);
        setSelectedRegister("");
        setRegistersLoadFailed(false);
        setLastClose(null);
        setZeroCashConfirmed(false);
        setIsSubmitting(false);
        setFormError("");
        setLoadingRegisters(true);

        apiConfig
            .get("register-report?page[size]=1")
            .then((response) => {
                const last = response.data?.data?.[0]?.attributes;
                if (last?.closing_denominations?.length > 0) setLastClose(last);
            })
            .catch(() => setLastClose(null));

        apiConfig
            .get("available-cash-registers")
            .then((response) => {
                const registers = response.data?.data || [];
                setCashRegisters(registers);
                const firstAvailable = registers.find((register) => register.available);
                setSelectedRegister(firstAvailable ? String(firstAvailable.id) : "");
            })
            .catch(() => {
                setCashRegisters([]);
                setRegistersLoadFailed(true);
                setFormError(
                    "No se pudieron consultar las cajas disponibles. Puedes intentarlo nuevamente cerrando y abriendo este formulario."
                );
            })
            .finally(() => setLoadingRegisters(false));
    }, [showPosRegisterModel]);

    const useLastClose = () => {
        if (!lastClose) return;

        const quantityByValue = Object.fromEntries(
            lastClose.closing_denominations.map((denomination) => [
                Number(denomination.value),
                denomination.quantity,
            ])
        );
        setRows(
            buildEmptyDenominationRows().map((row) => ({
                ...row,
                quantity: quantityByValue[row.value]
                    ? String(quantityByValue[row.value])
                    : "",
            }))
        );
        setZeroCashConfirmed(false);
        setFormError("");
    };

    const onSubmit = async () => {
        if (!(hasCountInput || zeroCashConfirmed)) {
            setFormError(
                "Cuenta el fondo inicial o confirma que abrirás la caja sin efectivo."
            );
            return;
        }
        if (cashRegisters.length > 0 && !selectedRegister) {
            setFormError("Selecciona una caja física disponible.");
            return;
        }

        setFormError("");
        setIsSubmitting(true);
        try {
            await dispatch(
                registerCashInHandAction(
                    {
                        cash_in_hand: cashInHand,
                        opening_denominations: rows
                            .filter((row) => Number(row.quantity) > 0)
                            .map((row) => ({
                                value: row.value,
                                quantity: Number(row.quantity),
                                subtotal: Number(row.quantity) * row.value,
                            })),
                        cash_register_id: selectedRegister || undefined,
                    },
                    navigate
                )
            );
            onClickshowPosRegisterModel();
        } catch (error) {
            setFormError(
                error?.response?.data?.message ||
                    "No fue posible abrir la caja. Revisa la información e inténtalo nuevamente."
            );
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        if (!isSubmitting) onClickshowPosRegisterModel();
    };

    return (
        <Modal
            size="lg"
            centered
            show={showPosRegisterModel}
            onHide={closeModal}
            backdrop={isSubmitting ? "static" : true}
            keyboard={!isSubmitting}
            className="pos-open-register-modal"
            aria-labelledby="pos-open-register-title"
        >
            <Modal.Header closeButton={!isSubmitting}>
                <div className="pos-open-heading">
                    <span className="pos-open-heading__icon">
                        <i className="bi bi-unlock" />
                    </span>
                    <div>
                        <span className="pos-open-eyebrow">INICIO DE TURNO</span>
                        <Modal.Title id="pos-open-register-title">
                            Abrir registro de caja
                        </Modal.Title>
                        <p>
                            <i className="bi bi-shop" /> {warehouseName || "Almacén actual"}
                            {storeName ? ` · ${storeName}` : ""}
                        </p>
                    </div>
                </div>
                <span className="pos-open-status">
                    <i /> Caja cerrada
                </span>
            </Modal.Header>

            <Modal.Body>
                <section className="pos-open-guidance">
                    <span><i className="bi bi-info-circle" /></span>
                    <div>
                        <strong>Prepara tu turno</strong>
                        <p>Selecciona la caja física y registra el dinero con el que iniciarás las operaciones.</p>
                    </div>
                </section>

                <section className="pos-open-section">
                    <header>
                        <div>
                            <span>CAJA FÍSICA</span>
                            <h3>Dónde se registrará el turno</h3>
                        </div>
                        <small>{loadingRegisters ? "Consultando disponibilidad" : registersLoadFailed ? "No disponible" : `${cashRegisters.filter((register) => register.available).length || 1} disponible`}</small>
                    </header>

                    {loadingRegisters ? (
                        <div className="pos-open-loading">
                            <span className="spinner-border spinner-border-sm" />
                            Consultando cajas disponibles...
                        </div>
                    ) : registersLoadFailed ? (
                        <div className="pos-open-register-error">
                            <span><i className="bi bi-wifi-off" /></span>
                            <div><strong>No pudimos consultar las cajas</strong><small>Cierra este formulario e inténtalo nuevamente antes de abrir el turno.</small></div>
                        </div>
                    ) : cashRegisters.length > 0 ? (
                        <div className="pos-open-registers">
                            {cashRegisters.map((register) => {
                                const selected = String(register.id) === String(selectedRegister);
                                return (
                                    <button
                                        key={register.id}
                                        type="button"
                                        disabled={!register.available || isSubmitting}
                                        className={`${selected ? "is-selected" : ""} ${!register.available ? "is-busy" : ""}`}
                                        onClick={() => {
                                            setSelectedRegister(String(register.id));
                                            setFormError("");
                                        }}
                                    >
                                        <span className="pos-open-registers__icon"><i className="bi bi-cash-register" /></span>
                                        <div>
                                            <strong>{register.name}</strong>
                                            <small>{register.code}</small>
                                            {!register.available && (
                                                <small>En uso por {register.current_user?.first_name || "otro cajero"}</small>
                                            )}
                                        </div>
                                        <span className="pos-open-registers__state">
                                            {selected ? <><i className="bi bi-check-circle-fill" /> Seleccionada</> : register.available ? "Disponible" : "En uso"}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="pos-open-auto-register">
                            <span><i className="bi bi-stars" /></span>
                            <div><strong>Caja principal automática</strong><small>Se creará para este almacén al confirmar la apertura.</small></div>
                            <i className="bi bi-check-circle-fill" />
                        </div>
                    )}

                    {!loadingRegisters && cashRegisters.length > 0 && !hasAvailableRegister && (
                        <div className="pos-open-inline-error">
                            <i className="bi bi-exclamation-circle" /> Todas las cajas físicas están siendo utilizadas.
                        </div>
                    )}
                </section>

                {lastClose && (
                    <button type="button" className="pos-open-last-close" onClick={useLastClose} disabled={isSubmitting}>
                        <span><i className="bi bi-clock-history" /></span>
                        <div>
                            <small>ÚLTIMO CIERRE REGISTRADO</small>
                            <strong>{money(lastClose.cash_in_hand_while_closing || 0)}</strong>
                            <p>Utiliza sus denominaciones como referencia y verifica físicamente el dinero.</p>
                        </div>
                        <b>Usar referencia <i className="bi bi-arrow-right" /></b>
                    </button>
                )}

                <section className="pos-open-section">
                    <header>
                        <div>
                            <span>FONDO INICIAL</span>
                            <h3>Cuenta billetes y monedas</h3>
                        </div>
                        <small>El total se calcula automáticamente</small>
                    </header>
                    <DenominationCounter
                        rows={rows}
                        setRows={(updater) => {
                            setRows(updater);
                            setZeroCashConfirmed(false);
                            setFormError("");
                        }}
                        currencySymbol={currencySymbol}
                        onTotalChange={setCashInHand}
                        variant="compact"
                        formatMoney={money}
                    />
                </section>

                {cashInHand === 0 && !hasCountInput && (
                    <button
                        type="button"
                        className={`pos-open-zero ${zeroCashConfirmed ? "is-confirmed" : ""}`}
                        onClick={() => {
                            setZeroCashConfirmed((current) => !current);
                            setFormError("");
                        }}
                    >
                        <span><i className={`bi ${zeroCashConfirmed ? "bi-check2-circle" : "bi-wallet"}`} /></span>
                        <div><strong>{zeroCashConfirmed ? "Apertura sin efectivo confirmada" : "Abrir sin fondo inicial"}</strong><small>El turno iniciará con {money(0)} en efectivo.</small></div>
                        <i className="bi bi-chevron-right" />
                    </button>
                )}

                <section className="pos-open-summary">
                    <div>
                        <small>CAJA SELECCIONADA</small>
                        <strong>{selectedRegisterData?.name || (cashRegisters.length === 0 ? "Caja principal" : "Sin seleccionar")}</strong>
                    </div>
                    <div>
                        <small>PIEZAS CONTADAS</small>
                        <strong>{totalPieces}</strong>
                    </div>
                    <div className="is-total">
                        <small>FONDO INICIAL</small>
                        <strong>{money(cashInHand)}</strong>
                    </div>
                </section>

                {formError && (
                    <div className="pos-open-inline-error">
                        <i className="bi bi-exclamation-circle" /> {formError}
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer>
                <span><i className="bi bi-shield-check" /> La apertura quedará registrada para el control de caja.</span>
                <div>
                    <button type="button" className="btn pos-open-cancel" disabled={isSubmitting} onClick={closeModal}>Cancelar</button>
                    <button type="button" className="btn pos-open-primary" disabled={!canSubmit} onClick={onSubmit}>
                        {isSubmitting ? <><span className="spinner-border spinner-border-sm" /> Abriendo caja...</> : <><i className="bi bi-unlock-fill" /> Abrir caja con {money(cashInHand)}</>}
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default PosRegisterModel;
