import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, InputGroup, Button } from 'react-bootstrap-v5';
import { Tab, Tabs } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
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
import { placeholderText, getFormattedMessage, decimalValidate, onFocusInput, getFormattedOptions } from '../../shared/sharedMethod';
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
        payment_type: { label: getFormattedMessage("payment-type.filter.cash.label"), value: 1 }
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
                date: singleSale ? dayjs(singleSale.date, 'YYYY-MM-DD').toDate() : '',
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
                payment_type: singleSale ? singleSale.payment_type : ''
            })
        }
        if (singleSale && isQuotation) {
            setSaleValue({
                date: singleSale ? dayjs(singleSale.date, 'YYYY-MM-DD').toDate() : '',
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
        const qtyCart = updateProducts.filter((a) => a.quantity === 0);
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
            return { ...previousState, date: date }
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
            payment_type: prepareData.payment_status.value === 2 ? 0 : prepareData.payment_type.value ? prepareData.payment_type.value : prepareData.payment_type
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

    const selectedCustomerId = saleValue.customer_id && saleValue.customer_id.value;
    const selectedCustomer = selectedCustomerId
        ? (customers || []).find((c) => String(c.id) === String(selectedCustomerId))
        : null;
    const selectedCustomerData = selectedCustomer ? selectedCustomer.attributes : null;

    return (
        <div className='card'>
            <div className='card-body'>
                <div className='row g-3 mb-4'>
                    {/* ── Datos del Cliente ─────────────────────────── */}
                    <div className='col-md-6'>
                        <div className='card border-0 shadow-sm h-100'>
                            <div className='card-header text-white py-2' style={{ background: '#2F6FED' }}>
                                <strong>{getFormattedMessage('customer.title')}</strong>
                            </div>
                            <div className='card-body'>
                                <div className='row g-3'>
                                    <div className='col-md-6'>
                                        <InputGroup className='flex-nowrap dropdown-side-btn position-relative'>
                                            <ReactSelect name='customer_id' data={customers} onChange={onCustomerChange}
                                                title={getFormattedMessage('customer.title')} errors={errors['customer_id']}
                                                defaultValue={saleValue.customer_id} value={saleValue.customer_id}
                                                placeholder={placeholderText('sale.select.customer.placeholder.label')} />
                                            <Button
                                                onClick={() => setModalShowCustomer(true)}
                                                className='position-absolute model-dtn'
                                                title='Agregar nuevo cliente'
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </Button>
                                        </InputGroup>
                                    </div>
                                    <div className='col-md-6'>
                                        <label className='form-label'>Cédula/RUC:</label>
                                        <input type='text' className='form-control' readOnly
                                            value={selectedCustomerData ? (selectedCustomerData.identification || '') : ''} />
                                    </div>
                                    <div className='col-md-3'>
                                        <label className='form-label'>Celular:</label>
                                        <input type='text' className='form-control' readOnly
                                            value={selectedCustomerData ? (selectedCustomerData.phone || '') : ''} />
                                    </div>
                                    <div className='col-md-3'>
                                        <label className='form-label'>Correo:</label>
                                        <input type='text' className='form-control' readOnly
                                            value={selectedCustomerData ? (selectedCustomerData.email || '') : ''} />
                                    </div>
                                    <div className='col-md-3'>
                                        <label className='form-label'>Razón Social:</label>
                                        <input type='text' className='form-control' readOnly
                                            value={selectedCustomerData ? (selectedCustomerData.name || '') : ''} />
                                    </div>
                                    <div className='col-md-3'>
                                        <label className='form-label'>Dirección:</label>
                                        <input type='text' className='form-control' readOnly
                                            value={selectedCustomerData ? (selectedCustomerData.address || '') : ''} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Datos de la Factura ───────────────────────── */}
                    <div className='col-md-6'>
                        <div className='card border-0 shadow-sm h-100'>
                            <div className='card-header text-white py-2' style={{ background: '#2F6FED' }}>
                                <strong>Datos de la Factura</strong>
                            </div>
                            <div className='card-body'>
                                <div className='row g-3'>
                                    <div className='col-md-6'>
                                        <label className='form-label'>Tipo de Documento:</label>
                                        <select
                                            className='form-select'
                                            value={emitirFacturaSri ? 'factura' : 'recibo'}
                                            onChange={(e) => setEmitirFacturaSri(e.target.value === 'factura')}
                                        >
                                            <option value='factura'>Factura Electrónica</option>
                                            <option value='recibo'>Recibo Electrónico</option>
                                        </select>
                                    </div>
                                    <div className='col-md-6'>
                                        <label className='form-label'>
                                            {getFormattedMessage('react-data-table.date.column.label')}:
                                        </label>
                                        <span className='required' />
                                        <div className='position-relative'>
                                            <ReactDatePicker onChangeDate={handleCallback} newStartDate={saleValue.date} />
                                        </div>
                                        <span className='text-danger d-block fw-400 fs-small mt-2'>{errors['date'] ? errors['date'] : null}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
    .sale-tabs-card {
    border-radius: 14px;

}

.sale-tabs-card .nav-tabs {
    background: linear-gradient(135deg, #2F6FED 0%, #3D7CF6 100%);
    border: none;
    padding: 14px;
    gap: 12px;
    display: flex;
}

.sale-tabs-card .nav-tabs .nav-item {
    display: flex;
}

.sale-tabs-card .nav-tabs .nav-link {
    border: none !important;
    border-radius: 12px;
    padding: 12px 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: rgba(255,255,255,.82);
    background: transparent;
    transition: all .25s ease;
}

.sale-tabs-card .nav-tabs .nav-link:hover {
    color: #fff;
    background: rgba(255,255,255,.12);
}

.sale-tabs-card .nav-tabs .nav-link.active {
    background: #fff;
    color: #2F6FED;
    box-shadow: 0 8px 18px rgba(0,0,0,.12);
    transform: translateY(-2px);
    padding: 5px !important
}

.sale-tabs-card .tab-content {
    background: #fff;
    padding: 24px;
}
`}</style>
                <div className='card border-0 shadow-sm mb-4 sale-tabs-card'>
                    <Tabs defaultActiveKey='detalles'>
                        <Tab eventKey='detalles' title='Detalles'>
                            <div className='row g-3 pt-4'>
                                <div className='col-md-6'>
                                    <ReactSelect name='warehouse_id' data={warehouses} onChange={onWarehouseChange}
                                        title={getFormattedMessage('warehouse.title')} errors={errors['warehouse_id']}
                                        defaultValue={saleValue.warehouse_id} value={saleValue.warehouse_id} addSearchItems={singleSale}
                                        isWarehouseDisable={true}
                                        placeholder={placeholderText('purchase.select.warehouse.placeholder.label')} />
                                </div>
                                <div className='col-md-6'>
                                    <label className='form-label'>
                                        {getFormattedMessage('product.title')}:
                                    </label>
                                    <ProductSearch values={saleValue} products={products} handleValidation={handleValidation}
                                        updateProducts={updateProducts}
                                        setUpdateProducts={setUpdateProducts} customProducts={customProducts}
                                        presentationMode="sale" />
                                </div>
                                <div className='col-12'>
                                    <label className='form-label'>
                                        {getFormattedMessage('purchase.order-item.table.label')}:
                                    </label>
                                    <span className='required' />
                                    <ProductRowTable updateProducts={updateProducts} setUpdateProducts={setUpdateProducts}
                                        updatedQty={updatedQty} frontSetting={frontSetting}
                                        updateCost={updateCost} updateDiscount={updateDiscount}
                                        updateTax={updateTax} updateSubTotal={updateSubTotal}
                                        updateSaleUnit={updateSaleUnit}
                                    />
                                </div>
                                <div className='col-12'>
                                    <ProductMainCalculation inputValues={saleValue} allConfigData={allConfigData} updateProducts={updateProducts} frontSetting={frontSetting} />
                                </div>
                                <div className='col-md-4'>
                                    <label
                                        className='form-label'>{getFormattedMessage('purchase.input.order-tax.label')}: </label>
                                    <InputGroup>
                                        <input aria-label='Dollar amount (with dot and two decimal places)'
                                            className='form-control'
                                            type='text' name='tax_rate' value={saleValue.tax_rate}
                                            onBlur={(event) => onBlurInput(event)} onFocus={(event) => onFocusInput(event)}
                                            onKeyPress={(event) => decimalValidate(event)}
                                            onChange={(e) => {
                                                onChangeInput(e)
                                            }} />
                                        <InputGroup.Text>%</InputGroup.Text>
                                    </InputGroup>
                                </div>
                                <div className='col-md-4'>
                                    <Form.Label
                                        className='form-label'>{getFormattedMessage('purchase.order-item.table.discount.column.label')}: </Form.Label>
                                    <InputGroup>
                                        <input aria-label='Dollar amount (with dot and two decimal places)'
                                            className='form-control'
                                            type='text' name='discount' value={saleValue.discount}
                                            onBlur={(event) => onBlurInput(event)} onFocus={(event) => onFocusInput(event)}
                                            onKeyPress={(event) => decimalValidate(event)}
                                            onChange={(e) => onChangeInput(e)}
                                        />
                                        <InputGroup.Text>{frontSetting.value && frontSetting.value.currency_symbol}</InputGroup.Text>
                                    </InputGroup>
                                </div>
                                <div className='col-md-4'>
                                    <label
                                        className='form-label'>{getFormattedMessage('purchase.input.shipping.label')}: </label>
                                    <InputGroup>
                                        <input aria-label='Dollar amount (with dot and two decimal places)' type='text'
                                            className='form-control'
                                            name='shipping' value={saleValue.shipping}
                                            onBlur={(event) => onBlurInput(event)} onFocus={(event) => onFocusInput(event)}
                                            onKeyPress={(event) => decimalValidate(event)}
                                            onChange={(e) => onChangeInput(e)}
                                        />
                                        <InputGroup.Text>{frontSetting.value && frontSetting.value.currency_symbol}</InputGroup.Text>
                                    </InputGroup>
                                </div>
                                <div className='col-md-4'>
                                    <ReactSelect multiLanguageOption={statusFilterOptions} onChange={onStatusChange} name='status_id'
                                        title={getFormattedMessage('purchase.select.status.label')}
                                        value={saleValue.status_id} errors={errors['status_id']}
                                        defaultValue={statusDefaultValue[0]}
                                        placeholder={getFormattedMessage('purchase.select.status.label')} />
                                </div>
                            </div>
                        </Tab>

                        <Tab eventKey='pagos' title='Formas de Pago'>
                            <div className='row g-3 pt-4'>
                                {!singleSale && <div className='col-md-6'>
                                    <ReactSelect multiLanguageOption={paymentStatusFilterOptions} onChange={onPaymentStatusChange} name='payment_status'
                                        title={getFormattedMessage('dashboard.recentSales.paymentStatus.label')}
                                        value={saleValue.payment_status} errors={errors['payment_status']}
                                        defaultValue={paymentStatusDefaultValue[0]}
                                        placeholder={placeholderText('sale.select.payment-status.placeholder')} />
                                </div>}
                                {!singleSale && (
                                    <div
                                        className='col-md-6'
                                        style={{ display: saleValue?.payment_status?.value === 2 ? "none" : "block" }}
                                    >
                                        <ReactSelect
                                            title={getFormattedMessage("select.payment-type.label")}
                                            name='payment_type'
                                            value={saleValue.payment_type}
                                            errors={errors['payment_type']}
                                            placeholder={placeholderText('sale.select.payment-type.placeholder')}
                                            defaultValue={paymentTypeDefaultValue[0]}
                                            multiLanguageOption={paymentMethodOption}
                                            onChange={onPaymentTypeChange}
                                        />
                                    </div>
                                )}
                                {isQuotation && <div className='col-md-6'>
                                    <ReactSelect multiLanguageOption={paymentStatusFilterOptions} onChange={onPaymentStatusChange} name='payment_status'
                                        title={getFormattedMessage('dashboard.recentSales.paymentStatus.label')}
                                        value={saleValue.payment_status} errors={errors['payment_status']}
                                        defaultValue={paymentStatusDefaultValue[0]}
                                        placeholder={placeholderText('sale.select.payment-status.placeholder')} />
                                </div>}
                                {isQuotation && isPaymentType && <div className='col-md-6'>
                                    <ReactSelect title={getFormattedMessage('select.payment-type.label')}
                                        name='payment_type'
                                        value={saleValue.payment_type} errors={errors['payment_type']}
                                        placeholder={placeholderText('sale.select.payment-type.placeholder')}
                                        defaultValue={paymentTypeDefaultValue[0]}
                                        multiLanguageOption={paymentMethodOption}
                                        onChange={onPaymentTypeChange}
                                    />
                                </div>}
                            </div>
                        </Tab>

                        <Tab eventKey='adicional' title='Información Adicional'>
                            <div className='row g-3 pt-4'>
                                <div className='col-12'>
                                    <label className='form-label'>
                                        {getFormattedMessage('globally.input.notes.label')}: </label>
                                    <textarea name='notes' className='form-control' rows={4} value={saleValue.notes}
                                        placeholder={placeholderText('globally.input.notes.placeholder.label')}
                                        onChange={(e) => onNotesChangeInput(e)}
                                    />
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                </div>

                <div className='row'>
                    <ModelFooter onEditRecord={singleSale} onSubmit={onSubmit} link='/app/sales' />
                </div>
            </div>
            {modalShowCustomer && (
                <CustomerForm
                    show={modalShowCustomer}
                    hide={setModalShowCustomer}
                />
            )}
        </div>
    )
}

const mapStateToProps = (state) => {
    const { purchaseProducts, products, frontSetting, allConfigData } = state;
    return { customProducts: prepareSaleProductArray(products), purchaseProducts, products, frontSetting, allConfigData }
}

export default connect(mapStateToProps, { editSale, fetchProductsByWarehouse, fetchFrontSetting })(SalesForm)
