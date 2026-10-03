import { Fragment, useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";
import { saleDetailsAction } from "../../../store/action/saleDetailsAction";
import { fetchFrontSetting } from "../../../store/action/frontSettingAction";
import { connect } from "react-redux";
import { getFormattedDate, getFormattedMessage } from "../../../shared/sharedMethod";
import { Image } from "react-bootstrap-v5";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";

const TicketSlipModal = (props) => {
    const {
        saleId,
        modalShowPaymentSlip,
        saleDetailsAction,
        handleCloseTicketModal,
        saleDetails: rawSaleDetails,
        frontSetting,
        allConfigData,
    } = props;

    const printRef = useRef();
    const saleDetails = rawSaleDetails?.attributes
        || rawSaleDetails?.data?.attributes
        || rawSaleDetails
        || {};

    const toNumber = (value) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    };
    const money = (value) => toNumber(value).toFixed(2);
    const saleItems = Array.isArray(saleDetails.sale_items) ? saleDetails.sale_items : [];
    const itemsSubtotal = saleItems.reduce(
        (total, item) => total + toNumber(item.sub_total),
        0
    );
    const itemDiscountTotal = saleItems.reduce(
        (total, item) => total + toNumber(item.discount_amount),
        0
    );
    const itemTaxTotal = saleItems.reduce(
        (total, item) => total + toNumber(item.tax_amount),
        0
    );
    const orderTaxTotal = toNumber(saleDetails.tax_amount);
    const totalTax = itemTaxTotal + orderTaxTotal;
    const saleDiscount = toNumber(saleDetails.discount);
    const shipping = toNumber(saleDetails.shipping);
    const grandTotal = toNumber(saleDetails.grand_total);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        pageStyle: `
@media print {
    * { 
        box-sizing: border-box !important;
        font-family: Arial, sans-serif !important;
        -webkit-font-smoothing: none !important;
    }
    body { 
        margin: 0 !important; 
        padding: 0 !important; 
        background: white !important;
        width: 80mm !important;
    }
    table { 
        width: 100% !important; 
        border-collapse: collapse !important;
    }
}
        `});

    useEffect(() => {
        if (saleId) {
            saleDetailsAction(saleId);
        }
    }, [saleId]);


    // Título del documento según si esta venta tiene una factura
    // electrónica autorizada (a diferencia de PaymentSlipModal, acá se
    // basa en el estado real guardado, no en un checkbox del momento).
    const getTituloDocumento = () => {
        const ei = saleDetails?.electronic_invoice;
        if (ei?.estado === "AUTORIZADA") {
            return { titulo: "FACTURA ELECTRÓNICA", subtitulo: "Comprobante autorizado por el SRI" };
        }
        if (ei) {
            return { titulo: "FACTURA ELECTRÓNICA", subtitulo: "Comprobante en proceso ante el SRI" };
        }
        return { titulo: "NOTA DE VENTA", subtitulo: "Documento no tributario" };
    };

    // 🔹 estilos base mejorados
    const ticketStyle = {
        width: '72mm',
        maxWidth: '72mm',
        margin: '0 auto',
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: '12px',
        color: '#000',
        backgroundColor: '#fff',
        padding: '6px',
        lineHeight: '1.4',
    };

    const rowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '4px 0',
        fontSize: '12px',
    };

    const dividerStyle = {
        borderBottom: '1px dashed #000',
        margin: '6px 0',
    };

    const subtleDivider = {
        borderBottom: '1px dashed #ccc',
        margin: '4px 0',
    };

    const handleShareWhatsApp = () => {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isMobile) {
            handleShareAsImage();
        } else {
            handleShareAsText();
        }
    };

    const handleShareAsImage = async () => {
        const canvas = await html2canvas(printRef.current, {
            scale: 2,
            backgroundColor: '#ffffff',
        });

        canvas.toBlob(async (blob) => {
            const file = new File([blob], `ticket-${saleDetails.reference_code}.png`, {
                type: 'image/png',
            });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'Comprobante de venta',
                    text: `COMPROBANTE ENVIADO DESDE ECUAPOS`,
                    files: [file],
                });
            } else {
                // Fallback si Web Share API no está disponible en móvil
                handleShareAsText();
            }
        }, 'image/png');
    };

    const handleShareAsText = () => {
        const paymentLabel = {
            1: "Dinero",
            2: "Cheque",
            3: "Transferencia",
            4: "Otro",
        }[Number(saleDetails.payment_type)] ?? "N/A";

        const items = saleItems.map(item => {
            const product = item.product?.attributes || item.product || {};
            const presentation = item.product_presentation?.attributes || item.product_presentation || {};
            const variationLabel = presentation?.variation_type?.name || product?.variation_type?.name;
            const itemName = variationLabel ? `${product.name} (${variationLabel})` : product.name;
            const quantity = item.product_presentation_id && toNumber(item.presentation_quantity) > 0
                ? toNumber(item.presentation_quantity)
                : toNumber(item.quantity);
            return `- ${itemName || "Producto"} x${quantity} = $${money(item.sub_total)}`;
        }).join('\n');

        const message = [
            `*${saleDetails?.company_info?.company_name}*`,
            `--------------------------------`,
            `Fecha: ${getFormattedDate(saleDetails.date, allConfigData)}`,
            `Direccion: ${saleDetails?.company_info?.address}`,
            `--------------------------------`,
            `*Productos:*`,
            items,
            `--------------------------------`,
            itemDiscountTotal + saleDiscount > 0 ? `Descuentos: -$${money(itemDiscountTotal + saleDiscount)}` : null,
            `IVA: $${money(totalTax)}`,
            `*Total: $${money(grandTotal)}*`,
            `Pago: ${paymentLabel}`,
            `Ref: ${saleDetails?.reference_code}`,
            `--------------------------------`,
            `Gracias por su compra!`,
        ].filter(Boolean).join('\n');

        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <Modal
            show={modalShowPaymentSlip}
            onHide={handleCloseTicketModal}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="pos-modal"
        >
            <Modal.Header closeButton className="pb-3">
                <Modal.Title id="contained-modal-title-vcenter">
                    {getFormattedMessage("pos-sale.detail.invoice.info")} POS
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="pt-0 pb-3">
                <div ref={printRef} style={ticketStyle}>

                    {/* 🔷 HEADER SRI */}
                    <div style={{ textAlign: 'center' }}>
                        <img
                            src={frontSetting?.value?.logo}
                            alt=""
                            style={{ width: '55px', marginBottom: '4px' }}
                        />

                        <div style={{ fontWeight: 'bold', fontSize: '13px' }}>
                            {saleDetails?.company_info?.sri_nombre_comercial || saleDetails?.warehouse?.name || saleDetails?.company_info?.company_name}
                        </div>

                        <div style={{ fontSize: '10px' }}>
                            RUC: {saleDetails?.company_info?.sri_ruc ?? '0000000000001'}
                        </div>

                        <div style={{ fontSize: '10px' }}>
                            {saleDetails?.company_info?.sri_dir_matriz || saleDetails?.warehouse?.city || saleDetails?.company_info?.address}
                        </div>

                        <div style={{ fontSize: '10px' }}>
                            {saleDetails?.company_info?.email}
                        </div>
                    </div>

                    <div style={dividerStyle} />

                    {/* 🔷 INFO DOCUMENTO */}
                    <div style={{ textAlign: 'center', fontSize: '11px' }}>
                        <div style={{ fontWeight: 'bold' }}>{getTituloDocumento().titulo}</div>
                        <div style={{ fontSize: '10px', color: '#000', marginBottom: '3px' }}>
                            {getTituloDocumento().subtitulo}
                        </div>
                        <div>
                            No: {saleDetails?.electronic_invoice?.tipo_comprobante === "01" && saleDetails?.electronic_invoice?.numero_comprobante
                                ? `FACTURA ${saleDetails.electronic_invoice.numero_comprobante}`
                                : saleDetails?.reference_code}
                        </div>
                        <div>
                            Fecha: {getFormattedDate(saleDetails.date, allConfigData)}
                        </div>
                    </div>

                    <div style={dividerStyle} />

                    {/* 🔷 CLIENTE */}
                    <div style={{ fontSize: '11px' }}>
                        <div>
                            <strong>Cliente:</strong> {saleDetails?.customer?.name ?? 'Consumidor Final'}
                        </div>
                        <div>
                            <strong>CI/RUC:</strong> {saleDetails?.customer?.identification ?? '9999999999'}
                        </div>
                        <div>
                            <strong>Dirección:</strong> {saleDetails?.customer?.address ?? '-'}
                        </div>
                        <div>
                            <strong>Atendido por:</strong> {saleDetails?.user ? `${saleDetails.user.first_name ?? ''} ${saleDetails.user.last_name ?? ''}`.trim() : '-'}
                        </div>
                    </div>

                    <div style={dividerStyle} />

                    {/* Detalle de productos */}
                    <table style={{
                        width: '100%',
                        fontSize: '11px',
                        borderCollapse: 'collapse',
                        tableLayout: 'fixed'
                    }}>
                        <thead>
                            <tr style={{
                                borderBottom: '1px solid #000',
                                borderTop: '1px solid #000'
                            }}>
                                <th align="left" style={{ width: '32%' }}>Detalle</th>
                                <th align="center" style={{ width: '14%' }}>Cant.</th>
                                <th align="right" style={{ width: '25%' }}>P. unit.</th>
                                <th align="right" style={{ width: '29%' }}>Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {saleItems.map((item, index) => {
                                const product = item.product?.attributes || item.product || {};
                                const presentation = item.product_presentation?.attributes || item.product_presentation || {};
                                const presentationName = presentation?.variation_type?.name;
                                const variationName = product?.variation_type?.name;
                                const productName = presentationName
                                    ? `${product.name || 'Producto'} (${presentationName})`
                                    : variationName
                                        ? `${product.name || 'Producto'} (${variationName})`
                                        : product.name || 'Producto';
                                const usesPresentation = Boolean(item.product_presentation_id)
                                    && toNumber(item.presentation_quantity) > 0;
                                const quantity = usesPresentation
                                    ? toNumber(item.presentation_quantity)
                                    : toNumber(item.quantity);
                                const unitPrice = toNumber(item.product_price ?? item.net_unit_price);
                                const lineTotal = item.sub_total !== null && item.sub_total !== undefined
                                    ? toNumber(item.sub_total)
                                    : quantity * unitPrice;
                                const taxRate = toNumber(item.tax_value);
                                const taxAmount = toNumber(item.tax_amount);
                                const discountAmount = toNumber(item.discount_amount);
                                const taxLabel = taxRate > 0
                                    ? `IVA ${taxRate}% ${Number(item.tax_type) === 2 ? 'incluido' : 'adicional'} · $${money(taxAmount)}`
                                    : 'Sin IVA';

                                return (
                                    <Fragment key={item.id || index}>
                                        <tr>
                                            <td colSpan="4" style={{ paddingTop: '5px', fontWeight: 'bold', overflowWrap: 'anywhere' }}>
                                                {productName}
                                            </td>
                                        </tr>
                                        <tr style={{ borderBottom: '1px dotted #aaa' }}>
                                            <td style={{ fontSize: '9px', lineHeight: '1.25', paddingBottom: '5px' }}>
                                                <div>{taxLabel}</div>
                                                {discountAmount > 0 && <div>Desc. -${money(discountAmount)}</div>}
                                            </td>
                                            <td align="center" style={{ paddingBottom: '5px' }}>{quantity.toFixed(2)}</td>
                                            <td align="right" style={{ paddingBottom: '5px' }}>$ {money(unitPrice)}</td>
                                            <td align="right" style={{ paddingBottom: '5px', fontWeight: 'bold' }}>$ {money(lineTotal)}</td>
                                        </tr>
                                    </Fragment>
                                );
                            })}
                        </tbody>
                    </table>

                    <div style={dividerStyle} />

                    {/* Resumen monetario */}
                    <div style={{ fontSize: '11px' }}>

                        <div style={rowStyle}>
                            <span>Subtotal</span>
                            <span>$ {money(itemsSubtotal)}</span>
                        </div>

                        {itemDiscountTotal > 0 && (
                            <div style={rowStyle}>
                                <span>Descuentos en productos (aplicados)</span>
                                <span>- $ {money(itemDiscountTotal)}</span>
                            </div>
                        )}

                        {saleDiscount > 0 && (
                            <div style={rowStyle}>
                                <span>Descuento general</span>
                                <span>- $ {money(saleDiscount)}</span>
                            </div>
                        )}

                        {totalTax <= 0 ? (
                            <div style={rowStyle}>
                                <span>Condición tributaria</span>
                                <strong>Sin IVA</strong>
                            </div>
                        ) : (
                            <>
                                {itemTaxTotal > 0 && (
                                    <div style={rowStyle}>
                                        <span>IVA en productos (incluido)</span>
                                        <span>$ {money(itemTaxTotal)}</span>
                                    </div>
                                )}
                                {orderTaxTotal > 0 && (
                                    <div style={rowStyle}>
                                        <span>IVA adicional {toNumber(saleDetails.tax_rate) > 0 ? `(${toNumber(saleDetails.tax_rate)}%)` : ''}</span>
                                        <span>+ $ {money(orderTaxTotal)}</span>
                                    </div>
                                )}
                            </>
                        )}

                        {shipping > 0 && (
                            <div style={rowStyle}>
                                <span>Envío</span>
                                <span>$ {money(shipping)}</span>
                            </div>
                        )}

                        <div style={{
                            ...rowStyle,
                            fontWeight: 'bold',
                            fontSize: '13px',
                            borderTop: '1px dashed #000',
                            marginTop: '4px',
                            paddingTop: '4px'
                        }}>
                            <span>TOTAL</span>
                            <span>$ {money(grandTotal)}</span>
                        </div>
                    </div>

                    <div style={dividerStyle} />

                    {/* 🔷 FORMA DE PAGO -- una línea por cada método usado,
                        con su monto real (no el total repetido). */}
                    <div style={{ fontSize: '11px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                            Forma de pago
                        </div>

                        {saleDetails.payments && saleDetails.payments.length > 0 ? (
                            saleDetails.payments.map((payment, index) => (
                                <div style={rowStyle} key={index}>
                                    <span>
                                        {payment.payment_type === 1 ? "Efectivo"
                                            : payment.payment_type === 2 ? "Cheque"
                                                : payment.payment_type === 3 ? "Transferencia"
                                                    : "Otro"}
                                    </span>
                                    <span>$ {Number(payment.amount).toFixed(2)}</span>
                                </div>
                            ))
                        ) : (
                            <div style={rowStyle}>
                                <span>
                                    {saleDetails.payment_type === 1 ? "Efectivo"
                                        : saleDetails.payment_type === 2 ? "Cheque"
                                            : saleDetails.payment_type === 3 ? "Transferencia"
                                                : "Otro"}
                                </span>
                                <span>$ {money(grandTotal)}</span>
                            </div>
                        )}
                        <div style={{ fontSize: '11px' }}>
                            <strong>Notas:</strong>
                            <div>{saleDetails?.note ?? "N/A"}</div>
                        </div>
                    </div>

                    <div style={dividerStyle} />

                    {/* 🔷 FOOTER PREMIUM */}
                    <div style={{ textAlign: 'center', fontSize: '10px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                            ¡GRACIAS POR SU COMPRA!
                        </div>

                        <div>Conserve este comprobante</div>

                        {saleDetails?.barcode_url && (
                            <Image
                                src={saleDetails.barcode_url}
                                height={25}
                                width={100}
                            />
                        )}

                        <div>{saleDetails?.reference_code}</div>
                    </div>

                </div>
            </Modal.Body>

            <Modal.Footer className="justify-content-center pt-2">
                <button
                    className="btn btn-primary text-white"
                    onClick={handlePrint}
                >
                    {getFormattedMessage("print.title")}
                </button>
                <button
                    className="btn btn-danger"
                    onClick={handleCloseTicketModal}
                >
                    {getFormattedMessage("pos-close-btn.title")}
                </button>
                <button
                    className="btn btn-success text-white"
                    onClick={handleShareWhatsApp}
                >
                    <i className="bi bi-whatsapp me-1" /> {/* si usas Bootstrap Icons */}
                    Compartir por WhatsApp
                </button>
            </Modal.Footer>
        </Modal>
    );
};

const mapStateToProps = (state) => {
    const { saleDetails, frontSetting, allConfigData } = state;
    return { saleDetails, frontSetting, allConfigData };
};

export default connect(mapStateToProps, {
    saleDetailsAction,
    fetchFrontSetting,
})(TicketSlipModal);
