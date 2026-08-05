import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { InputGroup } from 'react-bootstrap-v5';
import { Tab, Tabs } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faSearch, faPlus, faEye, faTimes } from '@fortawesome/free-solid-svg-icons';
import apiConfig from '../../config/apiConfig';
import ProductSearch from '../../shared/components/product-cart/search/ProductSearch';
import ProductRowTable from '../../shared/components/sales/ProductRowTable';
import ReactSelect from '../../shared/select/reactSelect';
import { fetchProductsByWarehouse } from '../../store/action/productAction';
import { fetchAllCustomer } from '../../store/action/customerAction';
import { prepareSaleProductArray } from '../../shared/prepareArray/prepareSaleArray';
import { calculateCartTotalAmount, calculateCartTotalTaxAmount } from '../../shared/calculation/calculation';
import { addToast } from '../../store/action/toastAction';
import { toastType } from '../../constants';
import CreditNoteCategoryModal from './CreditNoteCategoryModal';
import FacturaListModal from './FacturaListModal';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import relativeTime from 'dayjs/plugin/relativeTime';
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

    const handleValidation = () => true;

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
            status: 2,
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

    return (
        <div className="card">
            <div className="card-body">
                <div className="row g-3 mb-4">
                    {/* ── Datos de Factura ─────────────────────────── */}
                    <div className="col-md-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header text-white py-2" style={{ background: '#2F6FED' }}>
                                <strong>Datos de Factura</strong>
                            </div>
                            <div className="card-body">
                                <InputGroup className="flex-nowrap position-relative mb-3">
                                    <ReactSelect
                                        name="cliente_credit_note"
                                        data={customers}
                                        onChange={onClienteChange}
                                        title="Seleccionar Cliente"
                                        defaultValue={clienteSeleccionado}
                                        value={clienteSeleccionado}
                                        placeholder="Buscar Cliente"
                                    />

                                    <button
                                        variant="danger"
                                        onClick={onClienteClear}
                                        className="btn btn-danger clear-btn"
                                        title="Limpiar cliente"
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </InputGroup>

                                <label className="form-label">Número de Factura:</label>
                                <InputGroup className="mb-2">
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faSearch} />
                                    </InputGroup.Text>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="000-000-000000000"
                                        value={busquedaFactura}
                                        onChange={(e) => setBusquedaFactura(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && buscarFactura()}
                                    />
                                    <button className="btn btn-danger" type="button" onClick={limpiarFactura}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                    <button className="btn btn-outline-primary" type="button" onClick={onClickOjo} disabled={buscandoFactura}>
                                        <FontAwesomeIcon icon={faEye} />
                                    </button>
                                </InputGroup>
                                {errorFactura && <div className="text-danger small mb-2">{errorFactura}</div>}

                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Saldo Fac.:</label>
                                        <input type="text" className="form-control" readOnly value={factura ? factura.saldo.toFixed(2) : '0.00'} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Generar como:</label>
                                        <select className="form-select" name="generar_como" value={creditNoteValue.generar_como} onChange={onChangeInput}>
                                            <option value="SALDO">Normal (Saldo)</option>
                                            <option value="ANTICIPO">Anticipo del cliente</option>
                                        </select>
                                    </div>
                                    {/* <div className="col-md-6">
                                        <label className="form-label">Cliente:</label>
                                        <input type="text" className="form-control" readOnly value={factura?.customer?.attributes?.name || factura?.customer?.name || ''} />
                                    </div> */}
                                    <div className="col-md-6">
                                        <label className="form-label">Cédula/RUC:</label>
                                        <input type="text" className="form-control" readOnly value={factura?.customer?.attributes?.identification || factura?.customer?.identification || ''} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Correo:</label>
                                        <input type="text" className="form-control" readOnly value={factura?.customer?.attributes?.email || factura?.customer?.email || ''} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Dirección:</label>
                                        <input type="text" className="form-control" readOnly value={factura?.customer?.attributes?.address || factura?.customer?.address || ''} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Datos de Nota de Crédito ──────────────────── */}
                    <div className="col-md-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header text-white py-2" style={{ background: '#2F6FED' }}>
                                <strong>Datos de Nota de Crédito</strong>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="form-label">Tipo Comprobante:</label>
                                        <input type="text" className="form-control" readOnly value={factura?.tipo_comprobante || ''} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Fecha de Emisión:</label>
                                        <input type="date" className="form-control" name="date" value={creditNoteValue.date} onChange={onChangeInput} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Nro. Comprobante:</label>
                                        <input type="text" className="form-control" readOnly value={factura?.numero_comprobante || ''} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Vendedor:</label>
                                        <input type="text" className="form-control" name="vendedor" value={creditNoteValue.vendedor} onChange={onChangeInput} placeholder="Vendedor" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Concepto:</label>
                                        <select className="form-select" name="concepto" value={creditNoteValue.concepto} onChange={onChangeInput}>
                                            {CONCEPTOS.map((c) => (
                                                <option key={c.value} value={c.value}>{c.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-11">
                                        <label className="form-label">Categoría:</label>
                                        <select
                                            className="form-select"
                                            name="credit_note_category_id"
                                            value={creditNoteValue.credit_note_category_id}
                                            onChange={onChangeInput}
                                        >
                                            <option value="">--Seleccionar--</option>
                                            {categoriaOptions.map((c) => (
                                                <option key={c.value} value={c.value}>{c.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-1 d-flex align-items-end">
                                        <button type="button" className="btn btn-primary" onClick={() => setShowCategoryModal(true)}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Motivo: <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.motivo ? 'is-invalid' : ''}`}
                                            name="motivo"
                                            value={creditNoteValue.motivo}
                                            onChange={onChangeInput}
                                            placeholder="Ingrese motivo..."
                                        />
                                        {errors.motivo && <span className="text-danger small">{errors.motivo}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {!factura?.warehouse_id && (
                    <div className="alert alert-light border small">
                        Buscá una factura arriba para poder agregar productos.
                    </div>
                )}

                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header text-white py-2" style={{ background: '#2F6FED' }}>
                        <strong>Detalles</strong>
                    </div>
                    <div className="card-body">
                        {factura?.warehouse_id && (
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">
                                        Agregar producto adicional (opcional -- los de la factura ya están cargados abajo):
                                    </label>
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
                            </div>
                        )}

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
                </div>

                <div className="row">
                    <div className="col-12 d-flex justify-content-end gap-2">
                        <button className="btn btn-light" onClick={() => navigate('/app/credit-notes')}>Cancelar</button>
                        <button className="btn btn-primary" onClick={onSubmit} disabled={enviando}>
                            {enviando ? 'Guardando...' : 'Guardar Nota de Crédito'}
                        </button>
                    </div>
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
