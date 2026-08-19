import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { InputGroup } from 'react-bootstrap-v5';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faSearch, faPlus, faEye, faTimes } from '@fortawesome/free-solid-svg-icons';
import apiConfig from '../../config/apiConfig';
import ProductSearch from '../../shared/components/product-cart/search/ProductSearch';
import ProductRowTable from '../../shared/components/sales/ProductRowTable';
import ReactSelect from '../../shared/select/reactSelect';
import { fetchProductsByWarehouse } from '../../store/action/productAction';
import { fetchAllCustomer } from '../../store/action/customerAction';
import { prepareSaleProductArray } from '../../shared/prepareArray/prepareSaleArray';
import { calculateCartTotalAmount, calculateCartTotalTaxAmount, calculateSubTotal } from '../../shared/calculation/calculation';
import { addToast } from '../../store/action/toastAction';
import { toastType } from '../../constants';
import CreditNoteCategoryModal from './CreditNoteCategoryModal';
import FacturaListModal from './FacturaListModal';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import relativeTime from 'dayjs/plugin/relativeTime';
import '../../assets/scss/custom/pages/sales-form.scss';
import '../../assets/scss/custom/pages/credit-note-form.scss';
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(isoWeek);
dayjs.extend(relativeTime);

const CONCEPTOS = [
    { value: 'POR_DEVOLUCION', label: 'Por Devolución (ajusta stock)' },
    { value: 'POR_DESCUENTO', label: 'Por Descuento' },
    { value: 'POR_CORRECCION_PRECIO', label: 'Por Corrección de Precio' },
    { value: 'POR_ERROR_FACTURACION', label: 'Por Error de Facturación' },
    { value: 'OTRO', label: 'Otro' },
];

const CreditNoteForm = (props) => {
    const { products, fetchProductsByWarehouse, customers, fetchAllCustomer } = props;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [showFacturaListModal, setShowFacturaListModal] = useState(false);
    const [busquedaFactura, setBusquedaFactura] = useState('');
    const [factura, setFactura] = useState(null);
    const [buscandoFactura, setBuscandoFactura] = useState(false);
    const [errorFactura, setErrorFactura] = useState('');

    const [categorias, setCategorias] = useState([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    const [updateProducts, setUpdateProducts] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const [newCost, setNewCost] = useState('');
    const [newDiscount, setNewDiscount] = useState('');
    const [newTax, setNewTax] = useState('');
    const [subTotal, setSubTotal] = useState('');
    const [newSaleUnit, setNewSaleUnit] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setUpdateProducts(updateProducts);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateProducts, quantity, newCost, newDiscount, newTax, subTotal, newSaleUnit]);

    useEffect(() => {
        fetchAllCustomer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [creditNoteValue, setCreditNoteValue] = useState({
        date: dayjs().format('YYYY-MM-DD'),
        vendedor: '',
        generar_como: 'SALDO',
        concepto: 'POR_DEVOLUCION',
        credit_note_category_id: '',
        motivo: '',
        tax_rate: '0.00',
        discount: '0.00',
        shipping: '0.00',
    });

    useEffect(() => {
        cargarCategorias();
    }, []);

    const cargarCategorias = () => {
        apiConfig.get('/credit-note-categories').then((res) => setCategorias(res.data.data || []));
    };

    const buscarFactura = (textoOverride) => {
        const texto = textoOverride ?? busquedaFactura;
        if (!texto || !texto.trim()) return;
        setBuscandoFactura(true);
        setErrorFactura('');
        apiConfig
            .get('/credit-notes/buscar-factura', { params: { busqueda: texto } })
            .then((res) => {
                setFactura(res.data.data);
                setBusquedaFactura(res.data.data.numero_comprobante || texto);
                if (res.data.data.customer) {
                    setClienteSeleccionado({
                        value: res.data.data.customer_id,
                        label: res.data.data.customer.attributes?.name || res.data.data.customer.name,
                    });
                }
                if (res.data.data.warehouse_id) {
                    fetchProductsByWarehouse(res.data.data.warehouse_id);
                }
                // Precarga los productos de la factura original -- el
                // usuario puede ajustar cantidades, quitar líneas que
                // no correspondan, o agregar productos nuevos aparte
                // con el buscador (para casos especiales).
                setUpdateProducts(res.data.data.sale_items || []);
            })
            .catch(() => {
                setFactura(null);
                setErrorFactura('No se encontró ninguna factura con ese número.');
            })
            .finally(() => setBuscandoFactura(false));
    };

    const limpiarFactura = () => {
        setFactura(null);
        setBusquedaFactura('');
        setErrorFactura('');
        setUpdateProducts([]);
    };

    const onClienteChange = (obj) => {
        setClienteSeleccionado(obj);
        // Cambiar de cliente invalida la factura ya elegida.
        limpiarFactura();
    };

    const onClienteClear = () => {
        setClienteSeleccionado(null);
        limpiarFactura();
    };

    const onClickOjo = () => {
        if (!clienteSeleccionado) {
            dispatch(addToast({ text: 'Seleccionar Factura', type: toastType.WARNING }));
            return;
        }
        setShowFacturaListModal(true);
    };

    const onSeleccionarFacturaDelModal = (fila) => {
        setShowFacturaListModal(false);
        buscarFactura(fila.numero_comprobante);
    };

    const onChangeInput = (e) => {
        setCreditNoteValue((v) => ({ ...v, [e.target.name]: e.target.value }));
    };

    // Pasado a <ProductSearch>, que lo llama cuando se intenta buscar un
    // producto sin haber seleccionado factura todavía (values.warehouse_id
    // vacío -- ver ProductSearch.js:50-51). Antes esto era un stub que no
    // hacía nada, así que el usuario tecleaba en el buscador sin ningún
    // resultado ni explicación de por qué.
    const handleValidation = () => {
        dispatch(addToast({ text: 'Buscá y seleccioná una factura antes de agregar productos.', type: toastType.ERROR }));
        return false;
    };

    const onCategoryCreated = (nuevaCategoria) => {
        cargarCategorias();
        setCreditNoteValue((v) => ({ ...v, credit_note_category_id: nuevaCategoria.id }));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (!factura) {
            dispatch(addToast({ text: 'Buscá y seleccioná una factura primero.', type: toastType.ERROR }));
            return;
        }
        if (updateProducts.length < 1) {
            dispatch(addToast({ text: 'Agregá al menos un producto.', type: toastType.ERROR }));
            return;
        }
        // El backend ya rechaza quantity <= 0 (422), pero antes acá no
        // había ningún control -- el usuario se enteraba recién después
        // de enviar, con un error genérico en vez de saber qué línea
        // corregir.
        const lineaInvalida = updateProducts.find((p) => !(Number(p.quantity) > 0));
        if (lineaInvalida) {
            dispatch(addToast({ text: 'Hay un producto con cantidad inválida (debe ser mayor a 0).', type: toastType.ERROR }));
            return;
        }
        if (!creditNoteValue.motivo.trim()) {
            setErrors({ motivo: 'El motivo es obligatorio.' });
            return;
        }

        const payload = {
            date: creditNoteValue.date,
            sale_id: factura.sale_id,
            customer_id: factura.customer_id,
            warehouse_id: factura.warehouse_id,
            vendedor: creditNoteValue.vendedor,
            generar_como: creditNoteValue.generar_como,
            concepto: creditNoteValue.concepto,
            credit_note_category_id: creditNoteValue.credit_note_category_id || null,
            motivo: creditNoteValue.motivo,
            tax_rate: creditNoteValue.tax_rate,
            tax_amount: calculateCartTotalTaxAmount(updateProducts, creditNoteValue),
            discount: creditNoteValue.discount,
            shipping: creditNoteValue.shipping,
            grand_total: calculateCartTotalAmount(updateProducts, creditNoteValue),
            credit_note_items: updateProducts,
        };

        setEnviando(true);
        apiConfig
            .post('/credit-notes', payload)
            .then(() => {
                dispatch(addToast({ text: 'Nota de crédito creada correctamente.' }));
                navigate('/app/credit-notes');
            })
            .catch((error) => {
                const mensaje = error?.response?.data?.message || 'No se pudo crear la nota de crédito.';
                dispatch(addToast({ text: mensaje, type: toastType.ERROR }));
            })
            .finally(() => setEnviando(false));
    };

    const categoriaOptions = categorias.map((c) => ({ value: c.id, label: c.name }));
    const customerData = factura?.customer?.attributes || factura?.customer || {};
    const subtotalNota = Number(calculateSubTotal(updateProducts) || 0);
    const impuestoNota = Number(calculateCartTotalTaxAmount(updateProducts, creditNoteValue) || 0);
    const totalNota = Number(calculateCartTotalAmount(updateProducts, creditNoteValue) || 0);

    return (
        <div className="sale-form-v2 credit-note-form-v2">
            <div className="sale-form-heading">
                <div>
                    <span className="sale-form-eyebrow">Documentos tributarios</span>
                    <h1>Nueva nota de crédito</h1>
                    <p>Selecciona la factura, define el motivo y verifica los valores antes de emitir.</p>
                </div>
                <div className={`sale-form-heading-status ${factura ? 'is-ready' : ''}`}>
                    <span className="sale-status-dot" />
                    {factura ? 'Factura vinculada' : 'Borrador'}
                </div>
            </div>

            <div className="row g-4 align-items-start">
                <div className="col-xl-8">
                    <section className="sale-panel credit-invoice-panel">
                        <div className="sale-panel-heading">
                            <div className="sale-panel-icon"><i className="bi bi-receipt" /></div>
                            <div>
                                <h2>Factura de origen</h2>
                                <p>Localiza el comprobante y confirma los datos del cliente.</p>
                            </div>
                            {factura && <span className="credit-source-badge"><i className="bi bi-check-circle-fill" /> Seleccionada</span>}
                        </div>

                        <div className="credit-customer-row">
                            <div className="credit-customer-select">
                                <ReactSelect
                                    name="cliente_credit_note"
                                    data={customers}
                                    onChange={onClienteChange}
                                    title="Cliente"
                                    defaultValue={clienteSeleccionado}
                                    value={clienteSeleccionado}
                                    placeholder="Buscar cliente"
                                />
                            </div>
                            <button type="button" onClick={onClienteClear} className="btn credit-icon-button is-danger" title="Limpiar cliente">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <label className="form-label" htmlFor="credit-invoice-search">Número de factura</label>
                        <div className="credit-invoice-search">
                            <InputGroup>
                                <InputGroup.Text><FontAwesomeIcon icon={faSearch} /></InputGroup.Text>
                                <input
                                    id="credit-invoice-search"
                                    type="text"
                                    className="form-control"
                                    placeholder="000-000-000000000"
                                    value={busquedaFactura}
                                    onChange={(e) => setBusquedaFactura(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            buscarFactura();
                                        }
                                    }}
                                />
                            </InputGroup>
                            <button className="btn credit-search-button" type="button" onClick={() => buscarFactura()} disabled={buscandoFactura}>
                                {buscandoFactura ? <span className="spinner-border spinner-border-sm" /> : <FontAwesomeIcon icon={faSearch} />}
                                <span>Buscar</span>
                            </button>
                            <button className="btn credit-icon-button" type="button" onClick={onClickOjo} disabled={buscandoFactura} title="Ver facturas del cliente">
                                <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button className="btn credit-icon-button is-danger" type="button" onClick={limpiarFactura} title="Quitar factura">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        {errorFactura && <div className="credit-inline-error"><i className="bi bi-exclamation-circle" /> {errorFactura}</div>}

                        <div className="sale-customer-details credit-customer-details">
                            <div><span>Cliente</span><strong>{customerData.name || 'Sin seleccionar'}</strong></div>
                            <div><span>Cédula / RUC</span><strong>{customerData.identification || 'Sin información'}</strong></div>
                            <div><span>Correo</span><strong>{customerData.email || 'Sin información'}</strong></div>
                            <div><span>Dirección</span><strong>{customerData.address || 'Sin información'}</strong></div>
                        </div>
                    </section>

                    <section className="sale-panel credit-document-panel">
                        <div className="sale-panel-heading">
                            <div className="sale-panel-icon"><i className="bi bi-file-earmark-minus" /></div>
                            <div>
                                <h2>Datos de la nota</h2>
                                <p>Configura la emisión y explica claramente el motivo del ajuste.</p>
                            </div>
                        </div>

                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label">Fecha de emisión</label>
                                <input type="date" className="form-control" name="date" value={creditNoteValue.date} onChange={onChangeInput} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Generar como</label>
                                <select className="form-select" name="generar_como" value={creditNoteValue.generar_como} onChange={onChangeInput}>
                                    <option value="SALDO">Normal (saldo)</option>
                                    <option value="ANTICIPO">Anticipo del cliente</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Vendedor</label>
                                <input type="text" className="form-control" name="vendedor" value={creditNoteValue.vendedor} onChange={onChangeInput} placeholder="Nombre del vendedor" />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Concepto</label>
                                <select className="form-select" name="concepto" value={creditNoteValue.concepto} onChange={onChangeInput}>
                                    {CONCEPTOS.map((concepto) => <option key={concepto.value} value={concepto.value}>{concepto.label}</option>)}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Categoría</label>
                                <div className="credit-category-row">
                                    <select className="form-select" name="credit_note_category_id" value={creditNoteValue.credit_note_category_id} onChange={onChangeInput}>
                                        <option value="">Sin categoría</option>
                                        {categoriaOptions.map((categoria) => <option key={categoria.value} value={categoria.value}>{categoria.label}</option>)}
                                    </select>
                                    <button type="button" className="btn credit-icon-button is-primary" onClick={() => setShowCategoryModal(true)} title="Nueva categoría">
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </div>
                            </div>
                            <div className="col-12">
                                <label className="form-label" htmlFor="credit-note-reason">Motivo <span className="text-danger">*</span></label>
                                <textarea
                                    id="credit-note-reason"
                                    className={`form-control ${errors.motivo ? 'is-invalid' : ''}`}
                                    name="motivo"
                                    rows="3"
                                    value={creditNoteValue.motivo}
                                    onChange={(e) => {
                                        onChangeInput(e);
                                        if (errors.motivo) setErrors({});
                                    }}
                                    placeholder="Describe por qué se emite esta nota de crédito..."
                                />
                                {errors.motivo && <span className="credit-field-error">{errors.motivo}</span>}
                            </div>
                        </div>
                    </section>

                    <section className="sale-panel sale-products-panel credit-products-panel">
                        <div className="sale-panel-heading sale-products-heading">
                            <div className="sale-panel-icon"><i className="bi bi-box-seam" /></div>
                            <div>
                                <h2>Productos afectados</h2>
                                <p>Ajusta las cantidades de la factura que se acreditarán.</p>
                            </div>
                            <span className="sale-product-count">{updateProducts.length} {updateProducts.length === 1 ? 'producto' : 'productos'}</span>
                        </div>

                        {!factura?.warehouse_id ? (
                            <div className="credit-empty-state">
                                <i className="bi bi-receipt-cutoff" />
                                <div><strong>Primero selecciona una factura</strong><span>Sus productos aparecerán aquí automáticamente.</span></div>
                            </div>
                        ) : (
                            <div className="sale-product-search">
                                <label className="form-label">Agregar producto adicional <span>(opcional)</span></label>
                                <ProductSearch
                                    values={{ warehouse_id: { value: factura.warehouse_id } }}
                                    products={products}
                                    handleValidation={handleValidation}
                                    updateProducts={updateProducts}
                                    setUpdateProducts={setUpdateProducts}
                                    customProducts={prepareSaleProductArray(products)}
                                    presentationMode="sale"
                                />
                            </div>
                        )}

                        <div className="sale-products-table">
                            <ProductRowTable
                                updateProducts={updateProducts}
                                setUpdateProducts={setUpdateProducts}
                                updatedQty={setQuantity}
                                frontSetting={{ value: { currency_symbol: '$' } }}
                                updateCost={setNewCost}
                                updateDiscount={setNewDiscount}
                                updateTax={setNewTax}
                                updateSubTotal={setSubTotal}
                                updateSaleUnit={setNewSaleUnit}
                            />
                        </div>
                    </section>
                </div>

                <div className="col-xl-4">
                    <aside className="sale-summary-panel credit-summary-panel">
                        <div className="sale-summary-heading">
                            <div>
                                <span className="sale-form-eyebrow">Resumen</span>
                                <h2>Nota de crédito</h2>
                            </div>
                            <i className="bi bi-calculator" />
                        </div>

                        <div className="credit-source-summary">
                            <span>Comprobante de origen</span>
                            <strong>{factura?.numero_comprobante || 'Pendiente de selección'}</strong>
                            <div>
                                <small>{factura?.tipo_comprobante || 'Sin comprobante'}</small>
                                <small>Saldo: ${Number(factura?.saldo || 0).toFixed(2)}</small>
                            </div>
                        </div>

                        <div className="credit-total-list">
                            <div><span>Subtotal estimado</span><strong>${subtotalNota.toFixed(2)}</strong></div>
                            <div><span>Impuestos</span><strong>${impuestoNota.toFixed(2)}</strong></div>
                            <div><span>Productos</span><strong>{updateProducts.length}</strong></div>
                            <div className="credit-grand-total"><span>Total a acreditar</span><strong>${totalNota.toFixed(2)}</strong></div>
                        </div>

                        <div className="credit-summary-note">
                            <i className="bi bi-info-circle" />
                            <span>Verifica cantidades, concepto y motivo antes de guardar el documento.</span>
                        </div>

                        <div className="sale-form-actions credit-form-actions">
                            <button className="btn btn-primary" type="button" onClick={onSubmit} disabled={enviando}>
                                {enviando ? <><span className="spinner-border spinner-border-sm" /> Guardando...</> : <><i className="bi bi-check2-circle" /> Guardar nota de crédito</>}
                            </button>
                            <button className="btn btn-secondary" type="button" onClick={() => navigate('/app/credit-notes')} disabled={enviando}>Cancelar</button>
                        </div>
                    </aside>
                </div>
            </div>

            <CreditNoteCategoryModal
                show={showCategoryModal}
                onHide={() => setShowCategoryModal(false)}
                onCreated={onCategoryCreated}
            />
            <FacturaListModal
                show={showFacturaListModal}
                onHide={() => setShowFacturaListModal(false)}
                customerId={clienteSeleccionado?.value}
                onSeleccionar={onSeleccionarFacturaDelModal}
            />
        </div>
    );
};

const mapStateToProps = (state) => {
    const { products, customers } = state;
    return { products, customers };
};

export default connect(mapStateToProps, { fetchProductsByWarehouse, fetchAllCustomer })(CreditNoteForm);
