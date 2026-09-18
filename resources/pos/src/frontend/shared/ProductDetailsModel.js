import React, {useEffect, useMemo, useState} from 'react';
import {Button, Collapse, Form, InputGroup, Modal} from 'react-bootstrap';
import Select from 'react-select';
import {connect} from 'react-redux';
import {decimalValidate, getFormattedMessage, placeholderText} from '../../shared/sharedMethod';
import {productUnitDropdown} from '../../store/action/productUnitAction';
import {calculateProductBreakdown} from './SharedMethod';

const normalizeUnit = (value) => Array.isArray(value) ? (value[0] || null) : (value || null);

const ProductDetailsModel = ({
    openProductDetailModal,
    isOpenCartItemUpdateModel,
    cartProduct,
    onProductUpdateInCart,
    productUnitDropdown,
    productUnits,
    frontSetting,
    canOverridePrice,
}) => {
    const [unitPrice, setUnitPrice] = useState('0.00');
    const [saleUnitType, setSaleUnitType] = useState(null);
    const [discount, setDiscount] = useState('0.00');
    const [discountType, setDiscountType] = useState(1);
    const [orderTax, setOrderTax] = useState('0.00');
    const [taxType, setTaxType] = useState(1);
    const [reason, setReason] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [errors, setErrors] = useState({});

    // El reducer inicia como objeto vacío y luego recibe el arreglo desde la API.
    // Normalizamos ambos estados para que el modal pueda renderizarse mientras
    // se cargan las unidades sin intentar ejecutar .map() sobre un objeto.
    const availableProductUnits = Array.isArray(productUnits)
        ? productUnits
        : (Array.isArray(productUnits?.data) ? productUnits.data : []);
    const saleUnitsOption = availableProductUnits.map((productUnit) => ({
        value: productUnit.id,
        label: productUnit.attributes.name,
    }));

    useEffect(() => {
        if (!cartProduct) return;
        setUnitPrice(Number(cartProduct.product_price || 0).toFixed(2));
        setDiscount(Number(cartProduct.discount_value || 0).toFixed(2));
        setDiscountType(Number(cartProduct.discount_type || 1));
        setOrderTax(Number(cartProduct.tax_value || 0).toFixed(2));
        setTaxType(Number(cartProduct.tax_type || 1));
        setReason(cartProduct.price_override_reason || '');
        setShowAdvanced(false);
        setErrors({});
        productUnitDropdown(cartProduct.product_unit);
    }, [cartProduct]);

    useEffect(() => {
        if (!cartProduct || !availableProductUnits.length) return;
        const currentUnitId = cartProduct.sale_unit?.value ?? cartProduct.sale_unit;
        setSaleUnitType(saleUnitsOption.find((option) => Number(option.value) === Number(currentUnitId)) || null);
    }, [productUnits, cartProduct]);

    const draftProduct = useMemo(() => ({
        ...cartProduct,
        product_price: Number(unitPrice || 0),
        discount_type: Number(discountType),
        discount_value: Number(discount || 0),
        tax_type: Number(taxType),
        tax_value: Number(orderTax || 0),
    }), [cartProduct, unitPrice, discountType, discount, taxType, orderTax]);

    const breakdown = useMemo(() => calculateProductBreakdown(draftProduct), [draftProduct]);
    const originalPrice = Number(cartProduct?.original_product_price ?? cartProduct?.product_price ?? 0);
    const quantity = Number(cartProduct?.quantity || 1);
    const priceChanged = Math.abs(Number(unitPrice || 0) - originalPrice) > 0.001;
    const currency = frontSetting.value?.currency_symbol || '$';
    const money = (value) => `${currency}${Number(value || 0).toFixed(2)}`;

    if (!cartProduct) return null;

    const updateDecimal = (setter) => (event) => {
        const {value} = event.target;
        if (value.split('.')[1]?.length > 2) return;
        setter(value);
    };

    const validate = () => {
        const nextErrors = {};
        const numericPrice = Number(unitPrice);
        const numericDiscount = Number(discount || 0);
        const numericTax = Number(orderTax || 0);

        if (!unitPrice || !Number.isFinite(numericPrice) || numericPrice <= 0) {
            nextErrors.product_cost = 'Ingresa un precio mayor a cero.';
        }
        if (numericDiscount < 0 || (discountType === 1 && numericDiscount > 100)) {
            nextErrors.discount = 'El descuento porcentual debe estar entre 0 y 100.';
        }
        if (discountType === 2 && numericDiscount > numericPrice) {
            nextErrors.discount = 'El descuento no puede superar el precio del producto.';
        }
        if (numericTax < 0 || numericTax > 100) {
            nextErrors.orderTax = 'El IVA debe estar entre 0 y 100.';
        }
        if (priceChanged && reason.trim().length < 3) {
            nextErrors.reason = 'Indica brevemente por qué cambias el precio.';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const save = () => {
        if (!validate()) return;
        const selectedUnit = normalizeUnit(saleUnitType);
        onProductUpdateInCart({
            ...draftProduct,
            original_product_price: cartProduct.original_product_price ?? originalPrice,
            price_override_reason: priceChanged ? reason.trim() : null,
            price_overridden: priceChanged,
            discount_amount: breakdown.discountAmount,
            tax_amount: breakdown.taxAmount,
            net_unit_cost: breakdown.finalPrice,
            net_unit_price: breakdown.netUnitPrice,
            sub_total: breakdown.finalPrice * quantity,
            sale_unit: selectedUnit?.value ?? cartProduct.sale_unit,
        });
        openProductDetailModal(false);
    };

    const restorePrice = () => {
        setUnitPrice(originalPrice.toFixed(2));
        setDiscount('0.00');
        setReason('');
        setErrors((current) => ({...current, reason: ''}));
    };

    return (
        <Modal show={isOpenCartItemUpdateModel} onHide={() => openProductDetailModal(false)} centered className="pos-modal pos-price-modal">
            <Modal.Header closeButton>
                <div>
                    <span className="pos-price-modal__eyebrow">AJUSTE PARA ESTA VENTA</span>
                    <Modal.Title>{cartProduct.name}</Modal.Title>
                    <p>El catálogo no se modificará. El cambio aplica únicamente a esta línea.</p>
                </div>
            </Modal.Header>
            <Modal.Body>
                <div className="pos-price-comparison">
                    <div><span>Precio de catálogo</span><strong>{money(originalPrice)}</strong></div>
                    <i className="bi bi-arrow-right" aria-hidden="true" />
                    <div className="is-final"><span>Precio final unitario</span><strong>{money(breakdown.finalPrice)}</strong></div>
                </div>

                <Form.Group className="mb-3" controlId="posPriceOverride">
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                        <Form.Label className="mb-0">Nuevo precio</Form.Label>
                        {priceChanged && canOverridePrice && <button type="button" className="pos-price-restore" onClick={restorePrice}>Restaurar precio</button>}
                    </div>
                    <InputGroup>
                        <InputGroup.Text>{currency}</InputGroup.Text>
                        <Form.Control autoFocus={canOverridePrice} disabled={!canOverridePrice} inputMode="decimal" value={unitPrice} onKeyPress={decimalValidate} onChange={updateDecimal(setUnitPrice)} isInvalid={Boolean(errors.product_cost)} />
                        <Form.Control.Feedback type="invalid">{errors.product_cost}</Form.Control.Feedback>
                    </InputGroup>
                    {!canOverridePrice && <Form.Text>Tu rol puede aplicar descuentos, pero no reemplazar el precio de catálogo.</Form.Text>}
                </Form.Group>

                <div className="pos-price-discount-grid">
                    <Form.Group>
                        <Form.Label>Tipo de descuento</Form.Label>
                        <div className="pos-segmented-control" role="group" aria-label="Tipo de descuento">
                            <button type="button" className={discountType === 1 ? 'active' : ''} onClick={() => setDiscountType(1)}>Porcentaje</button>
                            <button type="button" className={discountType === 2 ? 'active' : ''} onClick={() => setDiscountType(2)}>Valor fijo</button>
                        </div>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Descuento</Form.Label>
                        <InputGroup>
                            <Form.Control inputMode="decimal" value={discount} onKeyPress={decimalValidate} onChange={updateDecimal(setDiscount)} isInvalid={Boolean(errors.discount)} />
                            <InputGroup.Text>{discountType === 1 ? '%' : currency}</InputGroup.Text>
                            <Form.Control.Feedback type="invalid">{errors.discount}</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </div>

                <div className="pos-price-quick-discounts" aria-label="Descuentos rápidos">
                    {[0, 5, 10, 15].map((value) => (
                        <button type="button" key={value} onClick={() => { setDiscountType(1); setDiscount(value.toFixed(2)); }}>
                            {value === 0 ? 'Sin descuento' : `${value}%`}
                        </button>
                    ))}
                </div>

                {priceChanged && (
                    <Form.Group className="mt-3" controlId="posPriceReason">
                        <Form.Label>Motivo del cambio de precio</Form.Label>
                        <Form.Control value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Ej. precio acordado con el cliente" isInvalid={Boolean(errors.reason)} maxLength={120} />
                        <Form.Control.Feedback type="invalid">{errors.reason}</Form.Control.Feedback>
                    </Form.Group>
                )}

                <button type="button" className="pos-price-advanced-toggle" onClick={() => setShowAdvanced((visible) => !visible)} aria-expanded={showAdvanced}>
                    <span><i className="bi bi-sliders" /> Impuestos y unidad</span>
                    <i className={`bi bi-chevron-${showAdvanced ? 'up' : 'down'}`} />
                </button>
                <Collapse in={showAdvanced}>
                    <div className="pos-price-advanced">
                        <Form.Group>
                            <Form.Label>Tratamiento del IVA</Form.Label>
                            <Form.Select value={taxType} onChange={(event) => setTaxType(Number(event.target.value))}>
                                <option value={2}>El precio ya incluye IVA</option>
                                <option value={1}>Agregar IVA al precio</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Porcentaje de IVA</Form.Label>
                            <InputGroup>
                                <Form.Control inputMode="decimal" value={orderTax} onKeyPress={decimalValidate} onChange={updateDecimal(setOrderTax)} isInvalid={Boolean(errors.orderTax)} />
                                <InputGroup.Text>%</InputGroup.Text>
                                <Form.Control.Feedback type="invalid">{errors.orderTax}</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="pos-price-unit">
                            <Form.Label>Unidad de venta</Form.Label>
                            <Select value={normalizeUnit(saleUnitType)} onChange={setSaleUnitType} options={saleUnitsOption} placeholder={placeholderText('pos-sale.select.sale-unit-type.placeholder')} noOptionsMessage={() => getFormattedMessage('no-option.label')} />
                        </Form.Group>
                    </div>
                </Collapse>

                <div className="pos-price-result">
                    <div><span>Descuento unitario</span><strong>-{money(breakdown.discountAmount)}</strong></div>
                    <div><span>IVA incluido/aplicado</span><strong>{money(breakdown.taxAmount)}</strong></div>
                    <div className="is-total"><span>Total de la línea · {quantity}</span><strong>{money(breakdown.finalPrice * quantity)}</strong></div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="light" onClick={() => openProductDetailModal(false)}>Cancelar</Button>
                <Button variant="primary" onClick={save}>Aplicar a esta venta</Button>
            </Modal.Footer>
        </Modal>
    );
};

const mapStateToProps = (state) => ({productUnits: state.productUnits});
export default connect(mapStateToProps, {productUnitDropdown})(ProductDetailsModel);
