import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { InputGroup } from 'react-bootstrap-v5';
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
import { amountBeforeTax, calculateCartTotalAmount, calculateCartTotalTaxAmount, taxAmountMultiply } from '../../shared/calculation/calculation';
import { prepareSaleProductArray } from '../../shared/prepareArray/prepareSaleArray';
import { addToast } from '../../store/action/toastAction';
import { paymentMethodOptions, salePaymentStatusOptions, saleStatusOptions, statusOptions, toastType } from '../../constants';
import { fetchFrontSetting } from '../../store/action/frontSettingAction';
import ReactSelect from '../../shared/select/reactSelect';
import CustomerForm from '../../frontend/components/customerModel/CustomerForm';
import CustomerSalesHistoryModal from '../customer/CustomerSalesHistoryModal';
import SaleCustomerField from './SaleCustomerField';
import { updatePosCustomer } from '../../store/action/pos/customerAction';
import '../../assets/scss/custom/pages/sale-desk.scss';
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
        isQuotation, allConfigData, settings, isSaving, updatePosCustomer,
        backTo = isQuotation ? '/app/quotations' : '/app/sales'
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
    const [customerDraft, setCustomerDraft] = useState(null);
    const [adjustOpen, setAdjustOpen] = useState(false);
    const [notesOpen, setNotesOpen] = useState(Boolean(singleSale?.notes));
    const adjustRef = useRef(null);
    const searchRef = useRef(null);

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
        payment_status: { label: getFormattedMessage("payment-status.filter.paid.label"), value: 1 },
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

    const isEdit = Boolean(singleSale) && !isQuotation;
    const isCreate = !singleSale;
    // Crear venta y convertir cotización emiten documento y registran el
    // cobro; al editar, los pagos se manejan desde la lista de ventas.
    const showPayment = isCreate || isQuotation;
    const currency = frontSetting.value?.currency_symbol || '$';
    const money = (value) => `${currency}${Number(value || 0).toFixed(2)}`;
    const subtotalNoTax = updateProducts.reduce((sum, item) => sum + amountBeforeTax(item) * Number(item.quantity || 0), 0);
    const itemsTax = updateProducts.reduce((sum, item) => sum + Number(taxAmountMultiply(item)), 0);
    const orderTax = Number(calculateCartTotalTaxAmount(updateProducts, saleValue));
    const grandTotal = calculateCartTotalAmount(updateProducts, saleValue);
    const discountValue = Number(saleValue.discount || 0);
    const shippingValue = Number(saleValue.shipping || 0);
    const saleStatusValue = Number(saleValue.status_id?.value ?? saleValue.status_id);
    const adjustmentsActive = Number(saleValue.tax_rate || 0) > 0 || discountValue > 0 || shippingValue > 0
        || (saleStatusValue && saleStatusValue !== 1);
    const paymentStatus = Number(saleValue.payment_status?.value ?? saleValue.payment_status);
    const paymentType = Number(saleValue.payment_type?.value ?? saleValue.payment_type);
    const paymentChoices = [
        { value: 1, label: 'Pagado' },
        ...(isCreate ? [{ value: 3, label: 'Abono' }] : []),
        { value: 2, label: 'Pendiente' },
    ];
    const methodChoices = [
        { value: 1, label: 'Efectivo' },
        { value: 3, label: 'Transferencia' },
        { value: 2, label: 'Cheque' },
        { value: 4, label: 'Otro' },
    ];
    const canEditCustomer = Boolean(selectedCustomerFlat) && !selectedCustomerFlat.es_consumidor_final;
    const submitRef = useRef(null);

    // Bodega por defecto al crear: la del usuario, la de Ajustes o la
    // única que exista, para no obligar a elegirla en cada venta.
    useEffect(() => {
        if (singleSale || saleValue.warehouse_id || !warehouses?.length) return;
        const preferredId = allConfigData?.default_warehouse_id || settings?.attributes?.default_warehouse;
        const preferred = warehouses.find((w) => String(w.id) === String(preferredId))
            || (warehouses.length === 1 ? warehouses[0] : null);
        if (preferred) {
            setSaleValue((current) => ({ ...current, warehouse_id: { value: preferred.id, label: preferred.attributes.name } }));
        }
    }, [warehouses, allConfigData?.default_warehouse_id, settings?.attributes?.default_warehouse]);

    // Atajos: F1 busca producto, Ctrl+Enter guarda (F2 lo maneja el campo
    // de cliente).
    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'F1') {
                event.preventDefault();
                searchRef.current?.querySelector('input')?.focus();
            } else if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                event.preventDefault();
                submitRef.current?.click();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    useEffect(() => {
        if (!adjustOpen) return undefined;
        const onPointerDown = (event) => {
            if (adjustRef.current && !adjustRef.current.contains(event.target)) setAdjustOpen(false);
        };
        document.addEventListener('mousedown', onPointerDown);
        return () => document.removeEventListener('mousedown', onPointerDown);
    }, [adjustOpen]);

    const openCreateCustomer = (identification = '') => {
        const tipo = /^\d{13}$/.test(identification) ? '04' : /^\d{10}$/.test(identification) ? '05' : '06';
        setCustomerDraft(identification ? { identification, tipo_identificacion: tipo } : null);
        setModalShowCustomer(true);
    };

    const onCustomerCreated = (option) => {
        if (option?.value) onCustomerChange({ value: option.value, label: option.label });
    };

    const title = isEdit ? 'Editar venta' : 'Convertir cotización en venta';

    return (
        <div className='sale-desk'>
            <section className='sale-desk__head'>
                <div className='sale-desk__bar'>
                    <Link to={backTo} className='sale-desk__back' title='Volver' aria-label='Volver'>
                        <i className='bi bi-arrow-left' />
                    </Link>
                    {isCreate ? (
                        <nav className='sale-desk__modes' aria-label='Qué vas a crear'>
                            <span className='is-active' aria-current='page'><i className='bi bi-cart3' /> Venta</span>
                            <Link to='/app/quotations/create'><i className='bi bi-file-earmark-text' /> Cotización</Link>
                        </nav>
                    ) : (
                        <h1 className='sale-desk__title'>{title}</h1>
                    )}
                    <span className='sale-desk__spacer' />
                    <span className='sale-desk__shortcuts'>
                        <kbd>F1</kbd> producto <kbd>F2</kbd> cliente <kbd>Ctrl</kbd>+<kbd>Enter</kbd> guardar
                    </span>
                </div>

                <div className={`sale-desk__fields ${showPayment ? '' : 'is-compact'}`}>
                    <div className='sale-desk__field sale-desk__field--customer'>
                        <span className='sale-desk__label'>Cliente <kbd>F2</kbd></span>
                        <SaleCustomerField
                            customers={customers}
                            value={saleValue.customer_id}
                            onChange={onCustomerChange}
                            onCreate={openCreateCustomer}
                            onEdit={() => setModalEditCustomer(true)}
                            onHistory={() => setModalHistorial(true)}
                            canEdit={canEditCustomer}
                            invalid={Boolean(errors['customer_id'])}
                        />
                        {errors['customer_id'] && <small className='sale-desk__error'>{errors['customer_id']}</small>}
                    </div>
                    <div className='sale-desk__field'>
                        <span className='sale-desk__label'>Bodega</span>
                        <ReactSelect name='warehouse_id' data={warehouses} onChange={onWarehouseChange} isRequired
                            errors={errors['warehouse_id']} defaultValue={saleValue.warehouse_id} value={saleValue.warehouse_id}
                            addSearchItems={singleSale} isWarehouseDisable={true}
                            placeholder={placeholderText('purchase.select.warehouse.placeholder.label')} />
                    </div>
                    {showPayment && (
                        <div className='sale-desk__field'>
                            <span className='sale-desk__label'>Documento</span>
                            <select className='form-select' value={emitirFacturaSri ? 'factura' : 'recibo'} aria-label='Tipo de documento'
                                onChange={(e) => setEmitirFacturaSri(e.target.value === 'factura')}>
                                <option value='factura'>Factura electrónica SRI</option>
                                <option value='recibo'>Recibo electrónico</option>
                            </select>
                        </div>
                    )}
                    <div className='sale-desk__field sale-desk__field--date'>
                        <span className='sale-desk__label'>Fecha</span>
                        <div className='position-relative'>
                            <ReactDatePicker onChangeDate={handleCallback} newStartDate={saleValue.date} />
                        </div>
                        {errors['date'] && <small className='sale-desk__error'>{errors['date']}</small>}
                    </div>
                </div>

                {selectedCustomerFlat && (
                    <div className='sale-desk__customer-line'>
                        <span><i className='bi bi-telephone' />{selectedCustomerData?.phone || 'Sin teléfono'}</span>
                        <span title={selectedCustomerData?.email}><i className='bi bi-envelope' />{selectedCustomerData?.email || 'Sin correo'}</span>
                        {selectedCustomerData?.address && <span title={selectedCustomerData.address}><i className='bi bi-geo-alt' />{selectedCustomerData.address}</span>}
                        {!isQuotation && creditLoading && <em className='sale-desk__pill'>Consultando crédito…</em>}
                        {!isQuotation && !creditLoading && creditProfile?.credit_enabled && (
                            <em className='sale-desk__pill is-success'>
                                Disponible {creditProfile.available_credit === null || creditProfile.available_credit === undefined ? 'sin límite' : money(creditProfile.available_credit)}
                            </em>
                        )}
                        {!isQuotation && !creditLoading && Number(creditProfile?.outstanding_balance || 0) > 0 && (
                            <em className='sale-desk__pill is-warning'>Saldo {money(creditProfile.outstanding_balance)}</em>
                        )}
                        {!isQuotation && !creditLoading && Number(creditProfile?.overdue_balance || 0) > 0 && (
                            <em className='sale-desk__pill is-danger'>Vencido {money(creditProfile.overdue_balance)}</em>
                        )}
                    </div>
                )}
            </section>

            <section className='sale-desk__items'>
                <div className='sale-desk__items-bar'>
                    <div className='sale-desk__search' ref={searchRef}>
                        <ProductSearch values={saleValue} products={products} handleValidation={handleValidation}
                            updateProducts={updateProducts} setUpdateProducts={setUpdateProducts}
                            customProducts={customProducts} presentationMode='sale' />
                        <kbd className='sale-desk__search-kbd'>F1</kbd>
                    </div>
                    <div className='sale-desk__adjust' ref={adjustRef}>
                        <button type='button' className={`sale-desk__adjust-btn ${adjustmentsActive ? 'has-values' : ''}`}
                            onClick={() => setAdjustOpen((open) => !open)} aria-expanded={adjustOpen}>
                            <i className='bi bi-sliders' /> Ajustes
                            {adjustmentsActive && <span className='sale-desk__dot' aria-label='Con ajustes' />}
                            <i className='bi bi-chevron-down' />
                        </button>
                        {adjustOpen && (
                            <div className='sale-desk__adjust-panel' role='dialog' aria-label='Ajustes de la venta'>
                                <label>
                                    <span>Descuento general</span>
                                    <InputGroup>
                                        <input aria-label='Descuento de la venta' className='form-control' type='text' name='discount'
                                            value={saleValue.discount} onBlur={onBlurInput} onFocus={onFocusInput}
                                            onKeyPress={decimalValidate} onChange={onChangeInput} />
                                        <InputGroup.Text>{currency}</InputGroup.Text>
                                    </InputGroup>
                                </label>
                                <label>
                                    <span>Envío</span>
                                    <InputGroup>
                                        <input aria-label='Envío de la venta' className='form-control' type='text' name='shipping'
                                            value={saleValue.shipping} onBlur={onBlurInput} onFocus={onFocusInput}
                                            onKeyPress={decimalValidate} onChange={onChangeInput} />
                                        <InputGroup.Text>{currency}</InputGroup.Text>
                                    </InputGroup>
                                </label>
                                <label>
                                    <span>Impuesto del pedido</span>
                                    <InputGroup>
                                        <input aria-label='Impuesto del pedido' className='form-control' type='text' name='tax_rate'
                                            value={saleValue.tax_rate} onBlur={onBlurInput} onFocus={onFocusInput}
                                            onKeyPress={decimalValidate} onChange={onChangeInput} />
                                        <InputGroup.Text>%</InputGroup.Text>
                                    </InputGroup>
                                </label>
                                <label>
                                    <span>Estado de la venta</span>
                                    <select className='form-select' value={saleStatusValue || 1}
                                        onChange={(e) => {
                                            const option = statusFilterOptions.find((item) => String(item.id) === e.target.value);
                                            onStatusChange({ value: option.id, label: option.name });
                                        }}>
                                        {statusFilterOptions.map((option) => (
                                            <option key={option.id} value={option.id}>{option.name}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                        )}
                    </div>
                </div>
                {!saleValue.warehouse_id && (
                    <div className='sale-desk__notice'><i className='bi bi-info-circle' /> Elige la bodega para buscar productos.</div>
                )}
                <div className='sale-desk__table'>
                    <ProductRowTable updateProducts={updateProducts} setUpdateProducts={setUpdateProducts}
                        updatedQty={updatedQty} frontSetting={frontSetting}
                        updateCost={updateCost} updateDiscount={updateDiscount}
                        updateTax={updateTax} updateSubTotal={updateSubTotal}
                        updateSaleUnit={updateSaleUnit} />
                </div>
            </section>

            <footer className='sale-desk__footer'>
                <section className='sale-desk__pay'>
                    {showPayment ? (
                        <>
                            <div className='sale-desk__pay-row'>
                                <h2>Pago</h2>
                                <div className='sale-desk__segmented' role='radiogroup' aria-label='Estado del pago'>
                                    {paymentChoices.map((choice) => (
                                        <button key={choice.value} type='button' role='radio' aria-checked={paymentStatus === choice.value}
                                            className={paymentStatus === choice.value ? 'is-active' : ''}
                                            onClick={() => onPaymentStatusChange({ value: choice.value, label: choice.label })}>
                                            {choice.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {paymentStatus !== 2 && (
                                <div className='sale-desk__methods' role='radiogroup' aria-label='Forma de pago'>
                                    {methodChoices.map((method) => (
                                        <button key={method.value} type='button' role='radio' aria-checked={paymentType === method.value}
                                            className={paymentType === method.value ? 'is-active' : ''}
                                            onClick={() => onPaymentTypeChange({ value: method.value, label: method.label })}>
                                            {method.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {paymentStatus === 2 && (
                                <p className='sale-desk__pay-note'><i className='bi bi-journal-text' /> El saldo quedará en cuentas por cobrar.</p>
                            )}
                            {(paymentStatus === 3 || (isCreate && [2, 3].includes(paymentStatus))) && (
                                <div className='sale-desk__terms'>
                                    {paymentStatus === 3 && (
                                        <label><span>Abono inicial</span>
                                            <InputGroup><InputGroup.Text>{currency}</InputGroup.Text>
                                                <input className='form-control' type='number' min='0.01' step='0.01'
                                                    value={saleValue.initial_payment_amount}
                                                    onChange={(e) => setSaleValue({ ...saleValue, initial_payment_amount: e.target.value })} />
                                            </InputGroup>
                                        </label>
                                    )}
                                    {isCreate && (
                                        <>
                                            <label><span>Días de plazo</span>
                                                <input className='form-control' type='number' min='0' max='3650' value={saleValue.payment_terms_days}
                                                    onChange={(e) => { const days = Number(e.target.value || 0); setSaleValue({ ...saleValue, payment_terms_days: days, payment_due_date: dayjs(saleValue.date).add(days, 'day').format('YYYY-MM-DD') }); }} />
                                            </label>
                                            <label><span>Vence</span>
                                                <input className='form-control' type='date' value={saleValue.payment_due_date}
                                                    onChange={(e) => setSaleValue({ ...saleValue, payment_due_date: e.target.value })} />
                                            </label>
                                        </>
                                    )}
                                </div>
                            )}
                            {(errors['payment_status'] || errors['payment_type'] || errors['status_id']) && (
                                <small className='sale-desk__error'>{errors['payment_status'] || errors['payment_type'] || errors['status_id']}</small>
                            )}
                        </>
                    ) : (
                        <p className='sale-desk__pay-note'><i className='bi bi-info-circle' /> Los cobros de esta venta se registran desde la lista de ventas.</p>
                    )}
                    {notesOpen ? (
                        <textarea name='notes' className='form-control sale-desk__notes' rows={2} autoFocus={!singleSale?.notes}
                            value={saleValue.notes || ''} aria-label='Nota de la venta'
                            placeholder={placeholderText('globally.input.notes.placeholder.label')}
                            onChange={onNotesChangeInput} />
                    ) : (
                        <button type='button' className='sale-desk__link' onClick={() => setNotesOpen(true)}>
                            <i className='bi bi-plus-lg' /> Agregar nota
                        </button>
                    )}
                </section>

                <section className='sale-desk__total'>
                    <dl>
                        <div><dt>Subtotal sin impuestos</dt><dd>{money(subtotalNoTax)}</dd></div>
                        <div><dt>IVA</dt><dd>{money(itemsTax + orderTax)}</dd></div>
                        {discountValue > 0 && <div><dt>Descuento</dt><dd>-{money(discountValue)}</dd></div>}
                        {shippingValue > 0 && <div><dt>Envío</dt><dd>{money(shippingValue)}</dd></div>}
                    </dl>
                    <button ref={submitRef} type='button' className='sale-desk__save' onClick={onSubmit} disabled={isSaving}>
                        <span className='sale-desk__save-label'>
                            <span><i className='bi bi-check2-circle' /> {isSaving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Guardar venta'}</span>
                            <small><kbd>Ctrl</kbd> + <kbd>Enter</kbd></small>
                        </span>
                        <span className='sale-desk__save-total'>
                            <small>Total a pagar</small>
                            <strong>{money(grandTotal)}</strong>
                        </span>
                    </button>
                </section>
            </footer>

            {modalShowCustomer && (
                <CustomerForm
                    show={modalShowCustomer}
                    hide={setModalShowCustomer}
                    initialValues={customerDraft}
                    onCustomerCreated={onCustomerCreated}
                />
            )}
            {modalEditCustomer && selectedCustomerFlat && (
                <CustomerForm
                    show={modalEditCustomer}
                    hide={setModalEditCustomer}
                    singleCustomer={[selectedCustomerFlat]}
                    onEditSubmit={(customerId, values) => updatePosCustomer(customerId, values, setModalEditCustomer)}
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
    const { purchaseProducts, products, frontSetting, allConfigData, settings, isSaving } = state;
    return { customProducts: prepareSaleProductArray(products), purchaseProducts, products, frontSetting, allConfigData, settings, isSaving }
}

export default connect(mapStateToProps, { editSale, fetchProductsByWarehouse, fetchFrontSetting, updatePosCustomer })(SalesForm)
