import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { connect, useDispatch, useSelector } from "react-redux";
import {
    currencySymbolHandling,
    getFormattedMessage,
} from "../../../shared/sharedMethod";
import { getAllRegisterDetailsAction } from "../../../store/action/pos/posRegisterDetailsAction";
import "./register-details.scss";

const paymentIcons = {
    cash: "bi-cash-stack",
    transfer: "bi-bank",
    cheque: "bi-receipt",
    other: "bi-wallet2",
};

function RegisterDetailsModel({
    lgShow,
    setLgShow,
    printRegisterDetails,
    frontSetting,
    allConfigData,
}) {
    const closeRegisterDetails = useSelector((state) => state.closeRegisterDetails);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllRegisterDetailsAction());
    }, [dispatch]);

    const currencySymbol = frontSetting?.value?.currency_symbol;
    const value = (key) => Number(closeRegisterDetails?.[key] || 0);
    const money = (amount) => currencySymbolHandling(
        allConfigData,
        currencySymbol,
        Number(amount || 0)
    );

    const paymentMethods = [
        {
            key: "cash",
            label: getFormattedMessage("cash.label"),
            helper: "Cobros que ingresaron físicamente a la caja",
            amount: value("today_sales_cash_payment"),
        },
        {
            key: "transfer",
            label: getFormattedMessage("payment-type.filter.bank-transfer.label"),
            helper: "Pagos acreditados mediante transferencia",
            amount: value("today_sales_bank_transfer_payment"),
        },
        {
            key: "cheque",
            label: getFormattedMessage("payment-type.filter.cheque.label"),
            helper: "Cobros registrados mediante cheque",
            amount: value("today_sales_cheque_payment"),
        },
        {
            key: "other",
            label: getFormattedMessage("payment-type.filter.other.label"),
            helper: "Otros métodos utilizados durante el turno",
            amount: value("today_sales_other_payment"),
        },
    ];

    const openingCash = value("cash_in_hand");
    const expectedCash = value("total_cash_amount");
    const manualCashNet = value("manual_cash_net");
    const totalSales = value("today_sales_amount");
    const totalPayments = value("today_sales_payment_amount");
    const totalReturns = value("today_sales_return_amount");
    const cashRefunds = value("refunded_cash");
    const netSales = totalSales - totalReturns;
    const detailsReady = Object.keys(closeRegisterDetails || {}).length > 0;

    const currentDate = new Intl.DateTimeFormat("es-EC", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date());

    return (
        <Modal
            size="lg"
            centered
            show={lgShow}
            onHide={() => setLgShow(false)}
            className="register-details-modal"
            aria-labelledby="register-details-title"
        >
            <Modal.Header closeButton>
                <div className="register-details-heading">
                    <span className="register-details-heading__icon"><i className="bi bi-cash-register" /></span>
                    <div>
                        <span className="register-details-eyebrow">RESUMEN DEL TURNO</span>
                        <Modal.Title id="register-details-title">Detalles del registro</Modal.Title>
                        <p><i className="bi bi-calendar3" /> {currentDate}</p>
                    </div>
                </div>
                <span className="register-details-status"><i /> Caja abierta</span>
            </Modal.Header>

            <Modal.Body>
                {!detailsReady ? (
                    <div className="register-details-loading">
                        <span className="spinner-border spinner-border-sm" />
                        <strong>Preparando el resumen de caja...</strong>
                    </div>
                ) : (
                    <>
                        <section className="register-details-hero">
                            <div>
                                <span>EFECTIVO ESPERADO EN CAJA</span>
                                <strong>{money(expectedCash)}</strong>
                                <p>Fondo inicial más los movimientos efectivos registrados durante el turno.</p>
                            </div>
                            <span className="register-details-hero__visual"><i className="bi bi-safe2" /></span>
                        </section>

                        <section className="register-details-quick">
                            <article>
                                <span className="is-blue"><i className="bi bi-box-arrow-in-right" /></span>
                                <div><small>Fondo inicial</small><strong>{money(openingCash)}</strong></div>
                            </article>
                            <article>
                                <span className="is-green"><i className="bi bi-cash-coin" /></span>
                                <div><small>Efectivo cobrado</small><strong>{money(value("today_sales_cash_payment"))}</strong></div>
                            </article>
                            <article>
                                <span className={manualCashNet < 0 ? "is-red" : "is-amber"}><i className="bi bi-arrow-left-right" /></span>
                                <div><small>Movimiento manual neto</small><strong className={manualCashNet < 0 ? "is-negative" : ""}>{manualCashNet > 0 ? "+" : ""}{money(manualCashNet)}</strong></div>
                            </article>
                        </section>

                        <section className="register-details-section">
                            <header>
                                <div><span>FORMAS DE PAGO</span><h3>Cómo ingresó el dinero</h3></div>
                                <small>{paymentMethods.filter((method) => method.amount > 0).length} métodos utilizados</small>
                            </header>
                            <div className="register-payment-grid">
                                {paymentMethods.map((method) => (
                                    <article key={method.key} className={`is-${method.key}`}>
                                        <span><i className={`bi ${paymentIcons[method.key]}`} /></span>
                                        <div><small>{method.label}</small><strong>{money(method.amount)}</strong><p>{method.helper}</p></div>
                                    </article>
                                ))}
                            </div>
                        </section>

                        <section className="register-details-section register-financial-summary">
                            <header>
                                <div><span>RESULTADO DEL TURNO</span><h3>Resumen financiero</h3></div>
                                <small>Valores registrados por el sistema</small>
                            </header>
                            <div className="register-financial-summary__body">
                                <div className="register-financial-list">
                                    <div><span><i className="bi bi-receipt-cutoff" /> Ventas registradas</span><strong>{money(totalSales)}</strong></div>
                                    <div><span><i className="bi bi-check2-circle" /> Pagos recibidos</span><strong className="is-positive">{money(totalPayments)}</strong></div>
                                    <div><span><i className="bi bi-arrow-counterclockwise" /> Devoluciones totales</span><strong className="is-negative">-{money(totalReturns)}</strong></div>
                                    <div><span><i className="bi bi-cash" /> Reembolsado en efectivo</span><strong className="is-negative">-{money(cashRefunds)}</strong></div>
                                </div>
                                <div className="register-net-result">
                                    <span>VENTA NETA</span>
                                    <strong>{money(netSales)}</strong>
                                    <p>Ventas registradas menos devoluciones.</p>
                                    <div><span>Total cobrado</span><b>{money(totalPayments)}</b></div>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </Modal.Body>

            <Modal.Footer>
                <span><i className="bi bi-info-circle" /> Los valores corresponden al turno abierto actual.</span>
                <div>
                    <button type="button" className="btn register-details-close" onClick={() => setLgShow(false)}>Cerrar</button>
                    <button type="button" className="btn register-details-print" disabled={!detailsReady} onClick={printRegisterDetails}><i className="bi bi-printer" /> {getFormattedMessage("print.title")}</button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}

const mapStateToProps = (state) => {
    const { allConfigData } = state;
    return { allConfigData };
};

export default connect(mapStateToProps, {})(RegisterDetailsModel);
