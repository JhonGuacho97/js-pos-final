import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, InputGroup, Button } from 'react-bootstrap-v5';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(isoWeek);
dayjs.extend(relativeTime);
import { connect, useDispatch } from 'react-redux';
import { fetchProductsByWarehouse } from '../../store/action/productAction';
import { editSale } from '../../store/action/salesAction';
import ProductSearch from '../../shared/components/product-cart/search/ProductSearch';
import ProductRowTable from '../../shared/components/sales/ProductRowTable';
import { placeholderText, getFormattedMessage, decimalValidate, onFocusInput, getFormattedOptions, toLocalDateObject } from '../../shared/sharedMethod';
import ReactDatePicker from '../../shared/datepicker/ReactDatePicker';
import ProductMainCalculation from './ProductMainCalculation';
import { calculateCartTotalAmount, calculateCartTotalTaxAmount } from '../../shared/calculation/calculation';
import { prepareSaleProductArray } from '../../shared/prepareArray/prepareSaleArray';
import ModelFooter from '../../shared/components/modelFooter';
import { addToast } from '../../store/action/toastAction';
import { paymentMethodOptions, salePaymentStatusOptions, saleStatusOptions, statusOptions, toastType } from '../../constants';
import { fetchFrontSetting } from '../../store/action/frontSettingAction';
import ReactSelect from '../../shared/select/reactSelect';
import CustomerForm from '../../frontend/components/customerModel/CustomerForm';
import CustomerSalesHistoryModal from '../customer/CustomerSalesHistoryModal';
import '../../assets/scss/custom/pages/sales-form.scss';
import apiConfig from '../../config/apiConfig';

const SalesForm = (props) => {
    const {
        addSaleData,
        editSale,
        id,
        customers,
        warehouses,
        singleSale,
        customProducts,
        products,
        fetchProductsByWarehouse,
        fetchFrontSetting,
        frontSetting,
        isQuotation, allConfigData
    } = props;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [updateProducts, setUpdateProducts] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const [newCost, setNewCost] = useState('');
    const [newDiscount, setNewDiscount] = useState('');
    const [newTax, setNewTax] = useState('');
    const [subTotal, setSubTotal] = useState('');
    const [newSaleUnit, setNewSaleUnit] = useState('');
    const [isPaymentType, setIsPaymentType] = useState(false)
    const [emitirFacturaSri, setEmitirFacturaSri] = useState(false);
    const [modalShowCustomer, setModalShowCustomer] = useState(false);
    const [modalEditCustomer, setModalEditCustomer] = useState(false);
    const [modalHistorial, setModalHistorial] = useState(false);
    const [creditProfile, setCreditProfile] = useState(null);
    const [creditLoading, setCreditLoading] = useState(false);

    const [saleValue, setSaleValue] = useState({
        date: new Date(),
        customer_id: '',
        warehouse_id: '',
        tax_rate: "0.00",
        tax_amount: 0.00,
        discount: "0.00",
        shipping: "0.00",
        grand_total: 0.00,
        notes: singleSale ? singleSale.notes : '',
        received_amount: 0,
        paid_amount: 0,
        status_id: { label: getFormattedMessage("status.filter.complated.label"), value: 1 },
        payment_status: { label: getFormattedMessage("payment-status.filter.unpaid.label"), value: 2 },
        payment_type: { label: getFormattedMessage("payment-type.filter.cash.label"), value: 1 },
        payment_terms_days: 0,
        payment_due_date: dayjs().format('YYYY-MM-DD'),
        initial_payment_amount: ''
    });
    const [errors, setErrors] = useState({
        date: '',
        customer_id: '',
        warehouse_id: '',
        status_id: '',
        payment_status: '',
        payment_type: ''
    });

    useEffect(() => {
        setUpdateProducts(updateProducts)
    }, [updateProducts, quantity, newCost, newDiscount, newTax, subTotal, newSaleUnit])

    useEffect(() => {
        updateProducts.length >= 1 ? dispatch({ type: 'DISABLE_OPTION', payload: true }) : dispatch({ type: 'DISABLE_OPTION', payload: false })
    }, [updateProducts])

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    useEffect(() => {
        if (singleSale && !isQuotation) {
            setSaleValue({
                date: singleSale ? toLocalDateObject(singleSale.date) : '',
                customer_id: singleSale ? singleSale.customer_id : '',
                quotation_id: singleSale ? singleSale.quotation_id : '',
                warehouse_id: singleSale ? singleSale.warehouse_id : '',
                tax_rate: singleSale ? singleSale.tax_rate.toFixed(2) : '0.00',
                tax_amount: singleSale ? singleSale.tax_amount.toFixed(2) : '0.00',
                discount: singleSale ? singleSale.discount.toFixed(2) : '0.00',
                shipping: singleSale ? singleSale.shipping.toFixed(2) : '0.00',
                grand_total: singleSale ? singleSale.grand_total : '0.00',
                status_id: singleSale ? singleSale.status_id : '',
                payment_status: singleSale.is_Partial === 3 ? { "label": getFormattedMessage('payment-status.filter.partial.label'), "value": 3 } : singleSale ? singleSale.payment_status : '',
                payment_type: singleSale ? singleSale.payment_type : '',
                payment_terms_days: singleSale ? (singleSale.payment_terms_days ?? 0) : 0,
                payment_due_date: singleSale?.payment_due_date || dayjs().format('YYYY-MM-DD'),
                initial_payment_amount: singleSale?.paid_amount || ''
            })
        }
        if (singleSale && isQuotation) {
            setSaleValue({
                date: singleSale ? toLocalDateObject(singleSale.date) : '',
                quotation_id: singleSale ? singleSale.quotation_id : '',
                customer_id: singleSale ? singleSale.customer_id : '',
                warehouse_id: singleSale ? singleSale.warehouse_id : '',
                tax_rate: singleSale ? singleSale.tax_rate.toFixed(2) : '0.00',
                tax_amount: singleSale ? singleSale.tax_amount.toFixed(2) : '0.00',
                discount: singleSale ? singleSale.discount.toFixed(2) : '0.00',
                shipping: singleSale ? singleSale.shipping.toFixed(2) : '0.00',
                grand_total: singleSale ? singleSale.grand_total : '0.00',
                status_id: singleSale ? singleSale.status_id : '',
                payment_status: saleValue.payment_status ? saleValue.payment_status : '',
                payment_type: { label: getFormattedMessage("payment-type.filter.cash.label"), value: 1 }
            })
        }
    }, [singleSale]);

    useEffect(() => {
        if (singleSale) {
            setUpdateProducts(singleSale.sale_items);
        }
    }, []);

    useEffect(() => {
        saleValue.warehouse_id.value && fetchProductsByWarehouse(saleValue?.warehouse_id?.value)
    }, [saleValue.warehouse_id.value])

    const handleValidation = () => {
        let error = {};
        let isValid = false;
        // Antes solo detectaba quantity === 0 -- un valor negativo
        // (pegado o escrito a mano en el input, que no bloquea el
        // onChange) pasaba esta validación sin problema.
        const qtyCart = updateProducts.filter((a) => !(Number(a.quantity) > 0));
        if (!saleValue.date) {
            error['date'] = getFormattedMessage('globally.date.validate.label');
        } else if (!saleValue.warehouse_id) {
            error['warehouse_id'] = getFormattedMessage('product.input.warehouse.validate.label');
        } else if (!saleValue.customer_id) {
            error['customer_id'] = getFormattedMessage('sale.select.customer.validate.label');
        } else if (qtyCart.length > 0) {
            dispatch(addToast({ text: getFormattedMessage('globally.product-quantity.validate.message'), type: toastType.ERROR }))
        } else if (updateProducts.length < 1) {
            dispatch(addToast({ text: getFormattedMessage('purchase.product-list.validate.message'), type: toastType.ERROR }))
        } else if (!saleValue.status_id) {
            error['status_id'] = getFormattedMessage("globally.status.validate.label")
        } else if (!saleValue.payment_status) {
            error['payment_status'] = getFormattedMessage("globally.payment.status.validate.label")
        } else if (!saleValue.payment_type) {
            error['payment_type'] = getFormattedMessage("globally.payment.type.validate.label")
        } else if (Number(saleValue.payment_status?.value) === 3 && (!(Number(saleValue.initial_payment_amount) > 0) || Number(saleValue.initial_payment_amount) >= Number(calculateCartTotalAmount(updateProducts, saleValue)))) {
            dispatch(addToast({ text: 'El abono inicial debe ser mayor a cero y menor al total de la venta.', type: toastType.ERROR }))
        } else if (creditProfile?.credit_enabled) {
            const total = Number(calculateCartTotalAmount(updateProducts, saleValue));
            const paid = Number(saleValue.payment_status?.value) === 1 ? total : Number(saleValue.initial_payment_amount || 0);
            const newBalance = Math.max(0, total - paid);
            if (newBalance > Number(creditProfile.available_credit || 0)) {
                dispatch(addToast({ text: `El saldo de esta venta supera el cupo disponible del cliente (${frontSetting.value?.currency_symbol || '$'}${Number(creditProfile.available_credit || 0).toFixed(2)}).`, type: toastType.ERROR }));
            } else {
                isValid = true;
            }
        } else {
            isValid = true;
        }
        setErrors(error);
        return isValid;
    };

    const onWarehouseChange = (obj) => {
        setSaleValue(inputs => ({ ...inputs, warehouse_id: obj }));
        setErrors('');
    };

    const onCustomerChange = (obj) => {
        setSaleValue(inputs => ({ ...inputs, customer_id: obj }));
        setErrors('');
    };

    const selectedCustomerId = saleValue.customer_id?.value || saleValue.customer_id || null;
    useEffect(() => {
        if (!selectedCustomerId || isQuotation) {
            setCreditProfile(null);
            return;
        }
        let active = true;
        setCreditLoading(true);
        apiConfig.get(`customers/${selectedCustomerId}/credit-profile`)
            .then((response) => {
                if (!active) return;
                const profile = response.data.data;
                setCreditProfile(profile);
                if (!singleSale) {
                    const days = Number(profile.default_payment_terms_days || 0);
                    setSaleValue((current) => ({
                        ...current,
                        payment_terms_days: days,
                        payment_due_date: dayjs(current.date || new Date()).add(days, 'day').format('YYYY-MM-DD'),
                    }));
                }
            })
            .catch(() => active && setCreditProfile(null))
            .finally(() => active && setCreditLoading(false));
        return () => { active = false; };
    }, [selectedCustomerId, isQuotation]);

    const onChangeInput = (e) => {
        e.preventDefault();
        const { value } = e.target;
        // check if value includes a decimal point
        if (value.match(/\./g)) {
            const [, decimal] = value.split('.');
            // restrict value to only 2 decimal places
            if (decimal?.length > 2) {
                // do nothing
                return;
            }
        }
        setSaleValue(inputs => ({ ...inputs, [e.target.name]: value && value }));
    };

    const onNotesChangeInput = (e) => {
        e.preventDefault();
        setSaleValue(inputs => ({ ...inputs, notes: e.target.value }));
    };

    const onStatusChange = (obj) => {
        setSaleValue(inputs => ({ ...inputs, status_id: obj }));
    };

    const onPaymentStatusChange = (obj) => {
        setSaleValue(inputs => ({ ...inputs, payment_status: obj }));
        obj.value !== 2 ? setIsPaymentType(true) : setIsPaymentType(false)
        setSaleValue(input => ({ ...input, payment_type: { label: getFormattedMessage("payment-type.filter.cash.label"), value: 1 } }))
    };

    const onPaymentTypeChange = (obj) => {
        setSaleValue(inputs => ({ ...inputs, payment_type: obj }));
    };

    const updatedQty = (qty) => {
        setQuantity(qty);
    };

    const updateCost = (cost) => {
        setNewCost(cost);
    };

    const updateDiscount = (discount) => {
        setNewDiscount(discount);
    };

    const updateTax = (tax) => {
        setNewTax(tax);
    };

    const updateSubTotal = (subTotal) => {
        setSubTotal(subTotal);
    };

    const updateSaleUnit = (saleUnit) => {
        setNewSaleUnit(saleUnit);
    };

    const handleCallback = (date) => {
        setSaleValue(previousState => {
            const days = Number(previousState.payment_terms_days || 0);
            return { ...previousState, date: date, payment_due_date: dayjs(date).add(days, 'day').format('YYYY-MM-DD') }
        });
        setErrors('');
    };

    const statusFilterOptions = getFormattedOptions(saleStatusOptions)
    const statusDefaultValue = statusFilterOptions.map((option) => {
        return {
            value: option.id,
            label: option.name
        }
    })

    const paymentStatusFilterOptions = getFormattedOptions(salePaymentStatusOptions)
    const paymentStatusDefaultValue = paymentStatusFilterOptions.map((option) => {
        return {
            value: option.id,
            label: option.name
        }
    })

    const paymentMethodOption = getFormattedOptions(paymentMethodOptions)
    const paymentTypeDefaultValue = paymentMethodOption.map((option) => {
        return {
            value: option.id,
            label: option.name
        }
    })

    const prepareFormData = (prepareData) => {
        const formValue = {
            date: dayjs(prepareData.date).format('YYYY-MM-DD'),
            is_sale_created: "true",
            quotation_id: prepareData ? prepareData.quotation_id : '',
            customer_id: prepareData.customer_id.value ? prepareData.customer_id.value : prepareData.customer_id,
            warehouse_id: prepareData.warehouse_id.value ? prepareData.warehouse_id.value : prepareData.warehouse_id,
            discount: prepareData.discount,
            tax_rate: prepareData.tax_rate,
            tax_amount: calculateCartTotalTaxAmount(updateProducts, saleValue),
            sale_items: updateProducts,
            shipping: prepareData.shipping,
            grand_total: calculateCartTotalAmount(updateProducts, saleValue),
            received_amount: 0,
            paid_amount: 0,
            note: prepareData.notes,
            status: prepareData.status_id.value ? prepareData.status_id.value : prepareData.status_id,
            payment_status: prepareData.payment_status.value ? prepareData.payment_status.value : prepareData.payment_status,
            payment_type: prepareData.payment_status.value === 2 ? 0 : prepareData.payment_type.value ? prepareData.payment_type.value : prepareData.payment_type,
            paid_amount: Number(prepareData.payment_status?.value) === 3 ? Number(prepareData.initial_payment_amount || 0) : 0,
            payment_terms_days: Number(prepareData.payment_terms_days || 0),
            payment_due_date: Number(prepareData.payment_status?.value) === 1 ? null : prepareData.payment_due_date,
        }
        return formValue
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const valid = handleValidation();
        if (valid) {
            if (singleSale && !isQuotation) {
                editSale(id, prepareFormData(saleValue), navigate);
            } else {
                addSaleData(prepareFormData(saleValue), emitirFacturaSri);
                setSaleValue(saleValue);
            }
        }
    };

    const onBlurInput = (el) => {
        if (el.target.value === '') {
            if (el.target.name === "shipping") {
                setSaleValue({ ...saleValue, shipping: "0.00" });
            }
            if (el.target.name === "discount") {
                setSaleValue({ ...saleValue, discount: "0.00" });
            }
            if (el.target.name === "tax_rate") {
                setSaleValue({ ...saleValue, tax_rate: "0.00" });
            }
        }
    }

    const selectedCustomer = selectedCustomerId
        ? (customers || []).find((c) => String(c.id) === String(selectedCustomerId))
        : null;
    const selectedCustomerData = selectedCustomer ? selectedCustomer.attributes : null;
    const selectedCustomerFlat = selectedCustomer
        ? { id: selectedCustomer.id, ...selectedCustomerData }
        : null;

    return (
        <div className='sale-form-v2'>
            <div className='sale-form-heading'>
                <div>
                    <span className='sale-form-eyebrow'>{isQuotation ? 'Cotización' : 'Ventas'}</span>
                    <h1>{singleSale && !isQuotation ? 'Editar venta' : isQuotation ? 'Convertir en venta' : 'Nueva venta'}</h1>
                    <p>Completa los datos, agrega productos y revisa el total antes de guardar.</p>
                </div>
                <div className='sale-form-heading-status'>
                    <span className='sale-status-dot' />
                    {singleSale ? 'Edición en curso' : 'Borrador'}
                </div>
            </div>

            <div className='row g-4 align-items-start'>
                <div className='col-xl-8'>
                    <section className='sale-panel sale-customer-panel'>
                        <div className='sale-panel-heading'>
                            <div className='sale-panel-icon'><i className='bi bi-person' /></div>
                            <div>
                                <h2>{getFormattedMessage('customer.title')}</h2>
                                <p>Selecciona quién recibirá esta venta.</p>
                            </div>
                            {selectedCustomerFlat && (
                                <div className='sale-customer-actions'>
                                    <Button variant='light' onClick={() => setModalEditCustomer(true)} title='Editar cliente'>
                                        <FontAwesomeIcon icon={faPen} /><span>Editar</span>
                                    </Button>
                                    <Button variant='light' onClick={() => setModalHistorial(true)} title='Historial de ventas'>
                                        <FontAwesomeIcon icon={faClockRotateLeft} /><span>Historial</span>
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className='sale-customer-select-row'>
                            <ReactSelect name='customer_id' data={customers} onChange={onCustomerChange}
                                title={getFormattedMessage('customer.title')} errors={errors['customer_id']}
                                defaultValue={saleValue.customer_id} value={saleValue.customer_id}
                                placeholder={placeholderText('sale.select.customer.placeholder.label')} />
                            <Button onClick={() => setModalShowCustomer(true)} className='sale-add-customer' title='Agregar nuevo cliente'>
                                <FontAwesomeIcon icon={faPlus} /><span>Nuevo cliente</span>
                            </Button>
                        </div>

                        <div className='sale-customer-details'>
                            <div><span>Cédula / RUC</span><strong>{selectedCustomerData?.identification || 'Sin información'}</strong></div>
                            <div><span>Celular</span><strong>{selectedCustomerData?.phone || 'Sin información'}</strong></div>
                            <div><span>Correo</span><strong>{selectedCustomerData?.email || 'Sin información'}</strong></div>
                            <div><span>Dirección</span><strong>{selectedCustomerData?.address || 'Sin información'}</strong></div>
                        </div>
                        {selectedCustomerFlat && <div className={`sale-credit-snapshot ${creditProfile?.credit_enabled ? 'is-controlled' : ''}`}>
                            <div><i className='bi bi-credit-card-2-front' /><span><small>Crédito del cliente</small><strong>{creditLoading ? 'Consultando…' : creditProfile?.credit_enabled ? 'Cupo controlado' : 'Sin límite controlado'}</strong></span></div>
                            <div><small>Saldo actual</small><strong>{frontSetting.value?.currency_symbol || '$'}{Number(creditProfile?.outstanding_balance || 0).toFixed(2)}</strong></div>
                            <div><small>Disponible</small><strong>{creditProfile?.available_credit === null || creditProfile?.available_credit === undefined ? 'Sin límite' : `${frontSetting.value?.currency_symbol || '$'}${Number(creditProfile.available_credit).toFixed(2)}`}</strong></div>
                            {Number(creditProfile?.overdue_balance || 0) > 0 && <div className='is-overdue'><small>Vencido</small><strong>{frontSetting.value?.currency_symbol || '$'}{Number(creditProfile.overdue_balance).toFixed(2)}</strong></div>}
                        </div>}
                    </section>

                    <section className='sale-panel sale-document-panel'>
                        <div className='sale-panel-heading'>
                            <div className='sale-panel-icon'><i className='bi bi-receipt' /></div>
                            <div>
                                <h2>Datos del documento</h2>
                                <p>Define el comprobante, la fecha y la bodega de salida.</p>
                            </div>
                        </div>
                        <div className='row g-3'>
                            <div className='col-md-4'>
                                <label className='form-label'>Tipo de documento</label>
                                <select className='form-select' value={emitirFacturaSri ? 'factura' : 'recibo'}
                                    onChange={(e) => setEmitirFacturaSri(e.target.value === 'factura')}>
                                    <option value='factura'>Factura electrónica</option>
                                    <option value='recibo'>Recibo electrónico</option>
                                </select>
                            </div>
                            <div className='col-md-4'>
                                <label className='form-label'>{getFormattedMessage('react-data-table.date.column.label')}</label>
                                <div className='position-relative'>
                                    <ReactDatePicker onChangeDate={handleCallback} newStartDate={saleValue.date} />
                                </div>
                                {errors['date'] && <span className='text-danger d-block fw-400 fs-small mt-2'>{errors['date']}</span>}
                            </div>
                            <div className='col-md-4'>
                                <ReactSelect name='warehouse_id' data={warehouses} onChange={onWarehouseChange}
                                    title={getFormattedMessage('warehouse.title')} errors={errors['warehouse_id']}
                                    defaultValue={saleValue.warehouse_id} value={saleValue.warehouse_id} addSearchItems={singleSale}
                                    isWarehouseDisable={true}
                                    placeholder={placeholderText('purchase.select.warehouse.placeholder.label')} />
                            </div>
                        </div>
                        <div className={`sale-document-indicator ${emitirFacturaSri ? 'is-sri' : ''}`}>
                            <i className={`bi ${emitirFacturaSri ? 'bi-patch-check' : 'bi-receipt-cutoff'}`} />
                            <span>{emitirFacturaSri ? 'Se emitirá un comprobante electrónico SRI.' : 'Se generará un recibo electrónico interno.'}</span>
                        </div>
                    </section>

                    <section className='sale-panel sale-products-panel'>
                        <div className='sale-panel-heading sale-products-heading'>
                            <div className='sale-panel-icon'><i className='bi bi-box-seam' /></div>
                            <div>
                                <h2>Productos</h2>
                                <p>Busca artículos y ajusta cantidades, precios e impuestos.</p>
                            </div>
                            <span className='sale-product-count'>{updateProducts.length} {updateProducts.length === 1 ? 'producto' : 'productos'}</span>
                        </div>
                        <div className='sale-product-search'>
                            <label className='form-label'>{getFormattedMessage('product.title')}</label>
                            <ProductSearch values={saleValue} products={products} handleValidation={handleValidation}
                                updateProducts={updateProducts} setUpdateProducts={setUpdateProducts}
                                customProducts={customProducts} presentationMode='sale' />
                        </div>
                        <div className='sale-products-table'>
                            <ProductRowTable updateProducts={updateProducts} setUpdateProducts={setUpdateProducts}
                                updatedQty={updatedQty} frontSetting={frontSetting}
                                updateCost={updateCost} updateDiscount={updateDiscount}
                                updateTax={updateTax} updateSubTotal={updateSubTotal}
                                updateSaleUnit={updateSaleUnit} />
                        </div>
                    </section>
                </div>

                <div className='col-xl-4'>
                    <aside className='sale-summary-panel'>
                        <div className='sale-summary-heading'>
                            <div>
                                <span className='sale-form-eyebrow'>Resumen</span>
                                <h2>Total de la venta</h2>
                            </div>
                            <i className='bi bi-calculator' />
                        </div>

                        <div className='sale-summary-calculation'>
                            <ProductMainCalculation inputValues={saleValue} allConfigData={allConfigData}
                                updateProducts={updateProducts} frontSetting={frontSetting} />
                        </div>

                        <div className='sale-summary-section'>
                            <div className='sale-summary-section-title'><i className='bi bi-sliders' /> Ajustes del total</div>
                            <div className='row g-3'>
                                <div className='col-12'>
                                    <label className='form-label'>{getFormattedMessage('purchase.input.order-tax.label')}</label>
                                    <InputGroup>
                                        <input aria-label='Impuesto de la venta' className='form-control' type='text' name='tax_rate'
                                            value={saleValue.tax_rate} onBlur={onBlurInput} onFocus={onFocusInput}
                                            onKeyPress={decimalValidate} onChange={onChangeInput} />
                                        <InputGroup.Text>%</InputGroup.Text>
                                    </InputGroup>
                                </div>
                                <div className='col-sm-6 col-xl-12'>
                                    <Form.Label>{getFormattedMessage('purchase.order-item.table.discount.column.label')}</Form.Label>
                                    <InputGroup>
                                        <input aria-label='Descuento de la venta' className='form-control' type='text' name='discount'
                                            value={saleValue.discount} onBlur={onBlurInput} onFocus={onFocusInput}
                                            onKeyPress={decimalValidate} onChange={onChangeInput} />
                                        <InputGroup.Text>{frontSetting.value && frontSetting.value.currency_symbol}</InputGroup.Text>
                                    </InputGroup>
                                </div>
                                <div className='col-sm-6 col-xl-12'>
                                    <label className='form-label'>{getFormattedMessage('purchase.input.shipping.label')}</label>
                                    <InputGroup>
                                        <input aria-label='Envío de la venta' className='form-control' type='text' name='shipping'
                                            value={saleValue.shipping} onBlur={onBlurInput} onFocus={onFocusInput}
                                            onKeyPress={decimalValidate} onChange={onChangeInput} />
                                        <InputGroup.Text>{frontSetting.value && frontSetting.value.currency_symbol}</InputGroup.Text>
                                    </InputGroup>
                                </div>
                            </div>
                        </div>

                        <div className='sale-summary-section'>
                            <div className='sale-summary-section-title'><i className='bi bi-check2-circle' /> Estado y pago</div>
                            <div className='sale-summary-fields'>
                                <ReactSelect multiLanguageOption={statusFilterOptions} onChange={onStatusChange} name='status_id'
                                    title={getFormattedMessage('purchase.select.status.label')} value={saleValue.status_id}
                                    errors={errors['status_id']} defaultValue={statusDefaultValue[0]}
                                    placeholder={getFormattedMessage('purchase.select.status.label')} />
                                {!singleSale && <ReactSelect multiLanguageOption={paymentStatusFilterOptions}
                                    onChange={onPaymentStatusChange} name='payment_status'
                                    title={getFormattedMessage('dashboard.recentSales.paymentStatus.label')}
                                    value={saleValue.payment_status} errors={errors['payment_status']}
                                    defaultValue={paymentStatusDefaultValue[0]}
                                    placeholder={placeholderText('sale.select.payment-status.placeholder')} />}
                                {!singleSale && saleValue?.payment_status?.value !== 2 && (
                                    <ReactSelect title={getFormattedMessage('select.payment-type.label')} name='payment_type'
                                        value={saleValue.payment_type} errors={errors['payment_type']}
                                        placeholder={placeholderText('sale.select.payment-type.placeholder')}
                                        defaultValue={paymentTypeDefaultValue[0]} multiLanguageOption={paymentMethodOption}
                                        onChange={onPaymentTypeChange} />
                                )}
                                {!singleSale && Number(saleValue?.payment_status?.value) === 3 && <label className='sale-credit-field'>Abono inicial
                                    <InputGroup><InputGroup.Text>{frontSetting.value?.currency_symbol || '$'}</InputGroup.Text><input className='form-control' type='number' min='0.01' step='0.01' value={saleValue.initial_payment_amount} onChange={(e) => setSaleValue({ ...saleValue, initial_payment_amount: e.target.value })} /></InputGroup>
                                </label>}
                                {isQuotation && <ReactSelect multiLanguageOption={paymentStatusFilterOptions}
                                    onChange={onPaymentStatusChange} name='payment_status'
                                    title={getFormattedMessage('dashboard.recentSales.paymentStatus.label')}
                                    value={saleValue.payment_status} errors={errors['payment_status']}
                                    defaultValue={paymentStatusDefaultValue[0]}
                                    placeholder={placeholderText('sale.select.payment-status.placeholder')} />}
                                {isQuotation && isPaymentType && <ReactSelect title={getFormattedMessage('select.payment-type.label')}
                                    name='payment_type' value={saleValue.payment_type} errors={errors['payment_type']}
                                    placeholder={placeholderText('sale.select.payment-type.placeholder')}
                                    defaultValue={paymentTypeDefaultValue[0]} multiLanguageOption={paymentMethodOption}
                                    onChange={onPaymentTypeChange} />}
                            </div>
                            {!singleSale && [2, 3].includes(Number(saleValue?.payment_status?.value)) && <div className='sale-credit-terms'>
                                <div><i className='bi bi-calendar2-week' /><span><strong>Condiciones de crédito</strong><small>Este saldo aparecerá en cuentas por cobrar.</small></span></div>
                                <label>Días de plazo<input type='number' min='0' max='3650' value={saleValue.payment_terms_days} onChange={(e) => { const days = Number(e.target.value || 0); setSaleValue({ ...saleValue, payment_terms_days: days, payment_due_date: dayjs(saleValue.date).add(days, 'day').format('YYYY-MM-DD') }); }} /></label>
                                <label>Fecha de vencimiento<input type='date' value={saleValue.payment_due_date} onChange={(e) => setSaleValue({ ...saleValue, payment_due_date: e.target.value })} /></label>
                            </div>}
                        </div>

                        <div className='sale-summary-section sale-notes-section'>
                            <label className='sale-summary-section-title' htmlFor='sale-notes'>
                                <i className='bi bi-card-text' /> Información adicional
                            </label>
                            <textarea id='sale-notes' name='notes' className='form-control' rows={3}
                                value={saleValue.notes || ''}
                                placeholder={placeholderText('globally.input.notes.placeholder.label')}
                                onChange={onNotesChangeInput} />
                        </div>

                        <div className='sale-form-actions'>
                            <ModelFooter onEditRecord={singleSale} onSubmit={onSubmit} link='/app/sales' />
                        </div>
                    </aside>
                </div>
            </div>
            {modalShowCustomer && (
                <CustomerForm
                    show={modalShowCustomer}
                    hide={setModalShowCustomer}
                />
            )}
            {modalEditCustomer && selectedCustomerFlat && (
                <CustomerForm
                    show={modalEditCustomer}
                    hide={setModalEditCustomer}
                    singleCustomer={[selectedCustomerFlat]}
                />
            )}
            <CustomerSalesHistoryModal
                show={modalHistorial}
                onHide={() => setModalHistorial(false)}
                customer={selectedCustomerFlat}
            />
        </div>
    )
}

const mapStateToProps = (state) => {
    const { purchaseProducts, products, frontSetting, allConfigData } = state;
    return { customProducts: prepareSaleProductArray(products), purchaseProducts, products, frontSetting, allConfigData }
}

export default connect(mapStateToProps, { editSale, fetchProductsByWarehouse, fetchFrontSetting })(SalesForm)
