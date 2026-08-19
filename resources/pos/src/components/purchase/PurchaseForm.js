import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(isoWeek);
dayjs.extend(relativeTime);
import { InputGroup, Table } from 'react-bootstrap-v5';
import { searchPurchaseProduct } from '../../store/action/purchaseProductAction';
import { editPurchase } from '../../store/action/purchaseAction';
import { fetchAllProducts, fetchProductsByWarehouse } from '../../store/action/productAction';
import PurchaseTable from '../../shared/components/purchase/PurchaseTable';
import { preparePurchaseProductArray } from '../../shared/prepareArray/preparePurchaseArray';
import { decimalValidate, getFormattedMessage, placeholderText, onFocusInput, getFormattedOptions, toLocalDateObject } from '../../shared/sharedMethod';
import { calculateCartTotalAmount, calculateCartTotalTaxAmount } from '../../shared/calculation/calculation';
import ModelFooter from '../../shared/components/modelFooter';
import ProductSearch from '../../shared/components/product-cart/search/ProductSearch';
import { addToast } from '../../store/action/toastAction';
import { purchaseStatusOptions, toastType } from '../../constants';
import ReactDatePicker from '../../shared/datepicker/ReactDatePicker';
import ProductMainCalculation from '../sales/ProductMainCalculation';
import ReactSelect from '../../shared/select/reactSelect';
import '../../assets/scss/custom/pages/sales-form.scss';

const PurchaseForm = ( props ) => {
    const {
        addPurchaseData,
        id,
        editPurchase,
        customProducts,
        singlePurchase,
        warehouses,
        suppliers,
        fetchAllProducts,
        fetchProductsByWarehouse,
        products, frontSetting, allConfigData,
        initialWarehouseId,
        initialSearchCode,
    } = props;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [ newCost, setNewCost ] = useState( '' );
    const [ newDiscount, setNewDiscount ] = useState( '' );
    const [ newTax, setNewTax ] = useState( '' );
    const [ newPurchaseUnit, setNewPurchaseUnit ] = useState( '' );
    const [ subTotal, setSubTotal ] = useState( '' );
    const [ updateProducts, setUpdateProducts ] = useState( [] );
    const [ quantity, setQuantity ] = useState( 0 );
    // Solo para forzar un remount PUNTUAL de <ReactSelect> de almacén
    // cuando el prellenado por query param ("Reponer" del dashboard) le
    // cambia el valor DESPUÉS del montaje inicial -- ese Select usa
    // defaultValue (no controlado), así que un cambio de estado posterior
    // al mount no se refleja visualmente por sí solo. No se vuelve a tocar
    // luego de la primera vez, así que no interfiere con que el usuario
    // cambie el almacén a mano.
    const [ warehousePrefilled, setWarehousePrefilled ] = useState( false );

    const [ purchaseValue, setPurchaseValue ] = useState( {
        date: singlePurchase ? toLocalDateObject( singlePurchase.date ) : new Date(),
        warehouse_id: singlePurchase ? singlePurchase.warehouse_id : '',
        supplier_id: singlePurchase ? singlePurchase.supplier_id : '',
        // (singlePurchase.tax_rate ?? 0) porque una compra puede llegar acá
        // con estos campos en null -- son nullable en BD sin default, y
        // llamar .toFixed() directo sobre null rompía la pantalla entera
        // ("Cannot read properties of null") al intentar editarla.
        tax_rate: singlePurchase ? ( singlePurchase.tax_rate ?? 0 ).toFixed( 2 ) : '0.00',
        tax_amount: singlePurchase ? ( singlePurchase.tax_amount ?? 0 ).toFixed( 2 ) : '0.00',
        discount: singlePurchase ? ( singlePurchase.discount ?? 0 ).toFixed( 2 ) : '0.00',
        shipping: singlePurchase ? ( singlePurchase.shipping ?? 0 ).toFixed( 2 ) : '0.00',
        grand_total: singlePurchase ? singlePurchase.grand_total : '0.00',
        notes: singlePurchase ? singlePurchase.notes : '',
        status_id: singlePurchase ? singlePurchase.status_id : { label: getFormattedMessage( "status.filter.received.label" ), value: 1 },
    } );

    const [ errors, setErrors ] = useState( {
        date: '',
        warehouse_id: '',
        supplier_id: '',
        details: '',
        tax_rate: '',
        discount: '',
        shipping: '',
        status_id: ''
    } );

    useEffect( () => {
        setUpdateProducts( updateProducts );
    }, [ updateProducts, quantity, newCost, newDiscount, newTax, subTotal, newPurchaseUnit ] );

    useEffect( () => {
        updateProducts.length >= 1 ? dispatch( { type: 'DISABLE_OPTION', payload: true } ) : dispatch( { type: 'DISABLE_OPTION', payload: false } )
    }, [ updateProducts ] )

    useEffect( () => {
        if ( singlePurchase ) {
            setUpdateProducts( singlePurchase.purchase_items );
        }
    }, [] );

    useEffect( () => {
        // Prellenado desde el botón "Reponer" del dashboard: solo aplica en
        // creación (no en edición), solo una vez, y solo cuando ya
        // llegaron los almacenes de la API para poder armar la opción
        // {value, label} que espera <ReactSelect>.
        if ( !singlePurchase && initialWarehouseId && !purchaseValue.warehouse_id && warehouses?.length ) {
            const match = warehouses.find( ( w ) => String( w.id ) === String( initialWarehouseId ) );
            if ( match ) {
                setPurchaseValue( inputs => ( { ...inputs, warehouse_id: { value: match.id, label: match.attributes.name } } ) );
                setWarehousePrefilled( true );
            }
        }
    }, [ warehouses, initialWarehouseId, singlePurchase ] );

    useEffect( () => {
        // OJO: acá va fetchAllProducts(), NO fetchProductsByWarehouse().
        // Esta segunda EXCLUYE productos que todavía no tienen stock en el
        // almacén elegido (usa un whereHas contra manage_stocks) -- pero en
        // Compras uno justamente quiere poder comprar un producto para un
        // almacén nuevo donde nunca ha existido stock antes. La columna
        // "Valores" se encarga de mostrar el stock correcto de cada
        // almacén por separado, leyendo el desglose que ya trae cada
        // producto (product.attributes.warehouse).
        purchaseValue.warehouse_id.value ? fetchAllProducts() : null
    }, [ purchaseValue.warehouse_id ] )

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        const qtyCart = updateProducts.filter( ( a ) => a.quantity === 0 );
        if ( !purchaseValue.date ) {
            errorss[ 'date' ] = getFormattedMessage( 'globally.date.validate.label' );
        } else if ( !purchaseValue.warehouse_id ) {
            errorss[ 'warehouse_id' ] = getFormattedMessage( 'purchase.select.warehouse.validate.label' )
        } else if ( !purchaseValue.supplier_id ) {
            errorss[ 'supplier_id' ] = getFormattedMessage( 'purchase.select.supplier.validate.label' )
        } else if ( qtyCart.length > 0 ) {
            dispatch( addToast( {
                text: getFormattedMessage( 'globally.product-quantity.validate.message' ),
                type: toastType.ERROR
            } ) )
        } else if ( updateProducts.length < 1 ) {
            dispatch( addToast( {
                text: getFormattedMessage( 'purchase.product-list.validate.message' ),
                type: toastType.ERROR
            } ) )
        } else if ( !purchaseValue.status_id ) {
            errorss[ 'status_id' ] = getFormattedMessage( 'globally.status.validate.label' )
        } else {
            isValid = true;
        }
        setErrors( errorss );
        return isValid;
    };

    const onWarehouseChange = ( obj ) => {
        setPurchaseValue( inputs => ( { ...inputs, warehouse_id: obj } ) )
        setErrors( '' )
    };

    const onSupplierChange = ( obj ) => {
        setPurchaseValue( inputs => ( { ...inputs, supplier_id: obj } ) )
        setErrors( '' );
    };

    const onStatusChange = ( obj ) => {
        setPurchaseValue( inputs => ( { ...inputs, status_id: obj } ) )
    };

    const updateCost = ( item ) => {
        setNewCost( item );
    };

    const updateDiscount = ( item ) => {
        setNewDiscount( item );
    };

    const updateTax = ( item ) => {
        setNewTax( item );
    };

    const onChangeInput = ( e ) => {
        e.preventDefault();
        const { value } = e.target;
        // check if value includes a decimal point
        if ( value.match( /\./g ) ) {
            const [ , decimal ] = value.split( '.' );
            // restrict value to only 2 decimal places
            if ( decimal?.length > 2 ) {
                // do nothing
                return;
            }
        }
        setPurchaseValue( inputs => ( { ...inputs, [ e.target.name ]: value && value } ) )
    };

    const onNotesChangeInput = ( e ) => {
        e.preventDefault();
        setPurchaseValue( inputs => ( { ...inputs, notes: e.target.value } ) )
    }

    const handleCallback = ( date ) => {
        setPurchaseValue( previousState => {
            return { ...previousState, date: date }
        } );
        setErrors( '' )
    };

    const updatedQty = ( qty ) => {
        setQuantity( qty );
    };

    const updateSubTotal = ( item ) => {
        setSubTotal( item );
    };

    const updatePurchaseUnit = ( item ) => {
        setNewPurchaseUnit( item );
    };

    const statusFilterOptions = getFormattedOptions( purchaseStatusOptions )
    const statusDefaultValue = statusFilterOptions.map( ( option ) => {
        return {
            value: option.id,
            label: option.name
        }
    } )

    const prepareData = ( prepareData ) => {
        const formValue = {
            date: dayjs( prepareData.date ).format( 'YYYY-MM-DD' ),
            warehouse_id: prepareData.warehouse_id.value ? prepareData.warehouse_id.value : prepareData.warehouse_id,
            supplier_id: prepareData.supplier_id.value ? prepareData.supplier_id.value : prepareData.supplier_id,
            discount: prepareData.discount,
            tax_rate: prepareData.tax_rate,
            tax_amount: calculateCartTotalTaxAmount( updateProducts, purchaseValue ),
            purchase_items: updateProducts,
            shipping: prepareData.shipping,
            grand_total: calculateCartTotalAmount( updateProducts, purchaseValue ),
            received_amount: '',
            paid_amount: '',
            payment_type: 0,
            notes: prepareData.notes,
            reference_code: '',
            status: prepareData.status_id.value ? prepareData.status_id.value : prepareData.status_id,
        }
        return formValue
    };

    const onSubmit = ( event ) => {
        event.preventDefault();
        const valid = handleValidation();
        if ( valid ) {
            if ( singlePurchase ) {
                editPurchase( id, prepareData( purchaseValue ), navigate );
            } else {
                addPurchaseData( prepareData( purchaseValue ) );
                setPurchaseValue( purchaseValue );
            }
        }
    };

    const onBlurInput = ( el ) => {
        if ( el.target.value === '' ) {
            if ( el.target.name === 'shipping' ) {
                setPurchaseValue( { ...purchaseValue, shipping: '0.00' } )
            }
            if ( el.target.name === 'discount' ) {
                setPurchaseValue( { ...purchaseValue, discount: '0.00' } )
            }
            if ( el.target.name === 'tax_rate' ) {
                setPurchaseValue( { ...purchaseValue, tax_rate: '0.00' } )
            }
        }
    }

    return (
        <div className='sale-form-v2 purchase-form-v2'>
            <div className='sale-form-heading'>
                <div>
                    <span className='sale-form-eyebrow'>Compras</span>
                    <h1>{singlePurchase ? 'Editar compra' : 'Nueva compra'}</h1>
                    <p>Registra la recepción, agrega productos y verifica el costo total.</p>
                </div>
                <div className='sale-form-heading-status'>
                    <span className='sale-status-dot' />
                    {singlePurchase ? 'Edición en curso' : 'Borrador'}
                </div>
            </div>

            <div className='row g-4 align-items-start'>
                <div className='col-xl-8'>
                    <section className='sale-panel'>
                        <div className='sale-panel-heading'>
                            <div className='sale-panel-icon'><i className='bi bi-truck' /></div>
                            <div><h2>Datos de recepción</h2><p>Selecciona la fecha, la bodega de destino y el proveedor.</p></div>
                        </div>
                        <div className='row g-3'>
                            <div className='col-md-4'>
                                <label className='form-label'>{getFormattedMessage( 'react-data-table.date.column.label' )}</label>
                                <div className='position-relative'>
                                    <ReactDatePicker onChangeDate={handleCallback} newStartDate={purchaseValue.date} />
                                </div>
                                {errors.date && <span className='text-danger d-block fw-400 fs-small mt-2'>{errors.date}</span>}
                            </div>
                            <div className='col-md-4'>
                                <ReactSelect key={warehousePrefilled ? 'warehouse-prefilled' : 'warehouse-default'}
                                    data={warehouses} onChange={onWarehouseChange} defaultValue={purchaseValue.warehouse_id}
                                    addSearchItems={singlePurchase} isWarehouseDisable={true}
                                    title={getFormattedMessage( 'warehouse.title' )} errors={errors.warehouse_id}
                                    placeholder={placeholderText( 'purchase.select.warehouse.placeholder.label' )} />
                            </div>
                            <div className='col-md-4'>
                                <ReactSelect data={suppliers} onChange={onSupplierChange} defaultValue={purchaseValue.supplier_id}
                                    title={getFormattedMessage( 'supplier.title' )} errors={errors.supplier_id}
                                    placeholder={placeholderText( 'purchase.select.supplier.placeholder.label' )} />
                            </div>
                        </div>
                    </section>

                    <section className='sale-panel sale-products-panel'>
                        <div className='sale-panel-heading sale-products-heading'>
                            <div className='sale-panel-icon'><i className='bi bi-box-arrow-in-down' /></div>
                            <div><h2>Productos de la compra</h2><p>Busca artículos y registra cantidades y costos de entrada.</p></div>
                            <span className='sale-product-count'>{updateProducts.length} {updateProducts.length === 1 ? 'producto' : 'productos'}</span>
                        </div>
                        <div className='sale-product-search'>
                            <label className='form-label'>{getFormattedMessage( 'dashboard.stockAlert.product.label' )}</label>
                            <ProductSearch values={purchaseValue} products={products} isAllProducts={true}
                                handleValidation={handleValidation} updateProducts={updateProducts}
                                setUpdateProducts={setUpdateProducts} customProducts={customProducts}
                                presentationMode='purchase' initialSearchCode={initialSearchCode} />
                        </div>
                        <div className='sale-products-table'>
                            <Table responsive>
                                <thead><tr>
                                    <th>{getFormattedMessage( 'dashboard.stockAlert.product.label' )}</th>
                                    <th>{getFormattedMessage( 'purchase.order-item.table.net-unit-cost.column.label' )}</th>
                                    <th>{getFormattedMessage( 'purchase.order-item.table.stock.column.label' )}</th>
                                    <th>{getFormattedMessage( 'purchase.order-item.table.qty.column.label' )}</th>
                                    <th>{getFormattedMessage( 'purchase.order-item.table.discount.column.label' )}</th>
                                    <th>{getFormattedMessage( 'purchase.order-item.table.tax.column.label' )}</th>
                                    <th>{getFormattedMessage( 'purchase.order-item.table.sub-total.column.label' )}</th>
                                    <th>{getFormattedMessage( 'react-data-table.action.column.label' )}</th>
                                </tr></thead>
                                <tbody>
                                    {updateProducts.map( ( singleProduct, index ) => (
                                        <PurchaseTable key={singleProduct.id ?? index} singleProduct={singleProduct} index={index}
                                            updateQty={updatedQty} updateCost={updateCost} updateDiscount={updateDiscount}
                                            updateProducts={updateProducts} updateSubTotal={updateSubTotal} frontSetting={frontSetting}
                                            setUpdateProducts={setUpdateProducts} updateTax={updateTax}
                                            updatePurchaseUnit={updatePurchaseUnit}
                                            purchaseItem={singlePurchase && singlePurchase.purchase_items}
                                            selectedWarehouseId={purchaseValue.warehouse_id?.value} />
                                    ) )}
                                    {!updateProducts.length && <tr><td colSpan={8} className='fs-5 px-3 py-6 custom-text-center'>
                                        {getFormattedMessage( 'sale.product.table.no-data.label' )}
                                    </td></tr>}
                                </tbody>
                            </Table>
                        </div>
                    </section>
                </div>

                <div className='col-xl-4'>
                    <aside className='sale-summary-panel'>
                        <div className='sale-summary-heading'>
                            <div><span className='sale-form-eyebrow'>Resumen</span><h2>Total de la compra</h2></div>
                            <i className='bi bi-calculator' />
                        </div>
                        <div className='sale-summary-calculation'>
                            <ProductMainCalculation inputValues={purchaseValue} updateProducts={updateProducts}
                                frontSetting={frontSetting} allConfigData={allConfigData} />
                        </div>
                        <div className='sale-summary-section'>
                            <div className='sale-summary-section-title'><i className='bi bi-sliders' /> Ajustes del total</div>
                            <div className='row g-3'>
                                <div className='col-12'>
                                    <label className='form-label'>{getFormattedMessage( 'purchase.input.order-tax.label' )}</label>
                                    <InputGroup><input aria-label='Impuesto de compra' className='form-control' value={purchaseValue.tax_rate}
                                        type='text' name='tax_rate' onBlur={onBlurInput} onFocus={onFocusInput}
                                        onKeyPress={decimalValidate} onChange={onChangeInput} /><InputGroup.Text>%</InputGroup.Text></InputGroup>
                                </div>
                                <div className='col-sm-6 col-xl-12'>
                                    <label className='form-label'>{getFormattedMessage( 'purchase.order-item.table.discount.column.label' )}</label>
                                    <InputGroup><input aria-label='Descuento de compra' className='form-control' value={purchaseValue.discount}
                                        type='text' name='discount' onBlur={onBlurInput} onFocus={onFocusInput}
                                        onKeyPress={decimalValidate} onChange={onChangeInput} />
                                        <InputGroup.Text>{frontSetting.value && frontSetting.value.currency_symbol}</InputGroup.Text></InputGroup>
                                </div>
                                <div className='col-sm-6 col-xl-12'>
                                    <label className='form-label'>{getFormattedMessage( 'purchase.input.shipping.label' )}</label>
                                    <InputGroup><input aria-label='Envío de compra' className='form-control' value={purchaseValue.shipping}
                                        type='text' name='shipping' onBlur={onBlurInput} onFocus={onFocusInput}
                                        onKeyPress={decimalValidate} onChange={onChangeInput} />
                                        <InputGroup.Text>{frontSetting.value && frontSetting.value.currency_symbol}</InputGroup.Text></InputGroup>
                                </div>
                            </div>
                        </div>
                        <div className='sale-summary-section'>
                            <div className='sale-summary-section-title'><i className='bi bi-check2-circle' /> Estado</div>
                            <ReactSelect multiLanguageOption={statusFilterOptions} onChange={onStatusChange} name='status'
                                title={getFormattedMessage( 'purchase.select.status.label' )} value={purchaseValue.status_id}
                                errors={errors.status_id} defaultValue={statusDefaultValue[ 0 ]}
                                placeholder={getFormattedMessage( 'purchase.select.status.label' )} />
                        </div>
                        <div className='sale-summary-section sale-notes-section'>
                            <label className='sale-summary-section-title' htmlFor='purchase-notes'><i className='bi bi-card-text' /> Información adicional</label>
                            <textarea id='purchase-notes' name='notes' className='form-control' rows={3}
                                placeholder={placeholderText( 'purchase.placeholder.notes.input' )}
                                onChange={onNotesChangeInput} value={purchaseValue.notes || ''} />
                        </div>
                        <div className='sale-form-actions'>
                            <ModelFooter onEditRecord={singlePurchase} onSubmit={onSubmit} link='/app/purchases' />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
};

const mapStateToProps = ( state ) => {
    const { purchaseProducts, products, frontSetting, allConfigData } = state;
    return { customProducts: preparePurchaseProductArray( products ), purchaseProducts, products, frontSetting, allConfigData }
};

export default connect( mapStateToProps, { editPurchase, fetchAllProducts, fetchProductsByWarehouse, searchPurchaseProduct, } )( PurchaseForm );
