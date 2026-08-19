import _, { useState, useEffect, useRef } from "react";
import { Col, Container, Row, Table } from "react-bootstrap-v5";
import { connect, useDispatch, useSelector } from "react-redux";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(isoWeek);
dayjs.extend(relativeTime);
import { useReactToPrint } from "react-to-print";
import Category from "./Category";
import Product from "./product/Product";
import ProductCartList from "./cart-product/ProductCartList";
import {
    posSearchNameProduct,
    posSearchCodeProduct,
} from "../../store/action/pos/posfetchProductAction";
import ProductSearchbar from "./product/ProductSearchbar";
import { prepareCartArray } from "../shared/PrepareCartArray";
import ProductDetailsModel from "../shared/ProductDetailsModel";
import CartItemMainCalculation from "./cart-product/CartItemMainCalculation";
import PosHeader from "./header/PosHeader";
import { posCashPaymentAction } from "../../store/action/pos/posCashPaymentAction";
import PaymentButton from "./cart-product/PaymentButton";
import CashPaymentModel from "./cart-product/paymentModel/CashPaymentModel";
import PaymentSlipModal from "./paymentSlipModal/PaymentSlipModal";
import { fetchFrontSetting } from "../../store/action/frontSettingAction";
import { fetchSetting } from "../../store/action/settingAction";
import { calculateProductCost } from "../shared/SharedMethod";
import {
    fetchBrandClickable,
    posAllProduct,
} from "../../store/action/pos/posAllProductAction";
import TabTitle from "../../shared/tab-title/TabTitle";
import HeaderAllButton from "./header/HeaderAllButton";
import RegisterDetailsModel from "./register-detailsModal/RegisterDetailsModel";
import PrintRegisterDetailsData from "./printModal/PrintRegisterDetailsData";
import {
    closeRegisterAction,
    fetchTodaySaleOverAllReport,
    getAllRegisterDetailsAction,
} from "../../store/action/pos/posRegisterDetailsAction";
import {
    getFormattedMessage,
    getFormattedOptions,
} from "../../shared/sharedMethod";
import { paymentMethodOptions, toastType } from "../../constants";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import CustomerForm from "./customerModel/CustomerForm";
import HoldListModal from "./holdListModal/HoldListModal";
import { fetchHoldLists } from "../../store/action/pos/HoldListAction";
import { useNavigate } from "react-router";
import PosCloseRegisterDetailsModel from "../../components/posRegister/PosCloseRegisterDetailsModel.js";
import DeleteModel from "../../shared/action-buttons/DeleteModel";
import { addToast } from "../../store/action/toastAction";
import { useElectronicInvoice } from "../../hooks/facturacion/useElectronicInvoice.js";

const PosMainPage = (props) => {
    const {
        onClickFullScreen,
        posAllProducts,
        customCart,
        posCashPaymentAction,
        frontSetting,
        fetchFrontSetting,
        settings,
        fetchSetting,
        paymentDetails,
        allConfigData,
        fetchBrandClickable,
        posAllTodaySaleOverAllReport,
        fetchHoldLists,
        holdListData,
    } = props;
    // 1. Agrega los refs
    const brandIdRef = useRef();
    const categoryIdRef = useRef();
    const registerDetailsRef = useRef();
    const fetchRequestIdRef = useRef(0);
    // const [play] = useSound('https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3');
    const [openCalculator, setOpenCalculator] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [updateProducts, setUpdateProducts] = useState([]);
    const [isOpenCartItemUpdateModel, setIsOpenCartItemUpdateModel] =
        useState(false);
    const [product, setProduct] = useState(null);
    const [cartProductIds, setCartProductIds] = useState([]);
    const [newCost, setNewCost] = useState("");
    const [paymentPrint, setPaymentPrint] = useState({});
    const [cashPayment, setCashPayment] = useState(false);
    const [modalShowPaymentSlip, setModalShowPaymentSlip] = useState(false);
    const [modalShowCustomer, setModalShowCustomer] = useState(false);
    const [deleteCartItem, setDeleteCartItem] = useState(null);
    const [productMsg, _] = useState(0);
    const [brandId, setBrandId] = useState();
    const [categoryId, setCategoryId] = useState();
    const [selectedCustomerOption, setSelectedCustomerOption] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [updateHolList, setUpdateHoldList] = useState(false);
    const [hold_ref_no, setHold_ref_no] = useState("");
    const [cartItemValue, setCartItemValue] = useState({
        discount: 0,
        tax: 0,
        shipping: 0,
    });
    const [cashPaymentValue, setCashPaymentValue] = useState({
        notes: "",
        payment_status: {
            label: getFormattedMessage("dashboard.recentSales.paid.label"),
            value: 1,
        },
    });
    const [errors, setErrors] = useState({ notes: "" });
    const [tipoComprobanteSri, setTipoComprobanteSri] = useState("");
    const { emitir: emitirFactura } = useElectronicInvoice();
    // const [searchString, setSearchString] = useState('');
    const [showCloseDetailsModal, setShowCloseDetailsModal] = useState(false);
    const { closeRegisterDetails } = useSelector((state) => state);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //total Qty on cart item
    const localCart = updateProducts.map((updateQty) =>
        Number(updateQty.quantity)
    );
    const totalQty =
        localCart.length > 0 &&
        localCart.reduce((cart, current) => {
            return cart + current;
        });

    //subtotal on cart item
    const localTotal = updateProducts.map(
        (updateQty) =>
            calculateProductCost(updateQty).toFixed(2) * updateQty.quantity
    );
    const subTotal =
        localTotal.length > 0 &&
        localTotal.reduce((cart, current) => {
            return cart + current;
        });

    const [holdListId, setHoldListValue] = useState({
        referenceNumber: "",
    });

    //grand total on cart item
    const discountTotal = subTotal - cartItemValue.discount;
    const taxTotal = (discountTotal * cartItemValue.tax) / 100;
    const mainTotal = discountTotal + taxTotal;
    const grandTotal = (
        Number(mainTotal) + Number(cartItemValue.shipping)
    ).toFixed(2);

    useEffect(() => {
        setPaymentPrint({
            ...paymentPrint,
            barcode_url:
                paymentDetails.attributes &&
                paymentDetails.attributes.barcode_url,
            reference_code:
                paymentDetails.attributes &&
                paymentDetails.attributes.reference_code,
            // Estos ya venían en la respuesta del backend, pero nunca se
            // copiaban acá -- por eso no aparecían en el ticket aunque
            // el backend sí los mandara.
            customer:
                paymentDetails.attributes &&
                paymentDetails.attributes.customer,
            user_name:
                paymentDetails.attributes &&
                paymentDetails.attributes.user_name,
            numero_comprobante:
                paymentDetails.attributes &&
                paymentDetails.attributes.numero_comprobante,
            tipo_comprobante:
                paymentDetails.attributes &&
                paymentDetails.attributes.tipo_comprobante,
        });
    }, [paymentDetails]);

    useEffect(() => {
        setSelectedCustomerOption(
            settings.attributes && {
                value: Number(settings.attributes.default_customer),
                label: settings.attributes.customer_name,
            }
        );
        // Si este usuario tiene un almacén propio asignado (Usuarios ->
        // editar -> "Almacén por defecto"), entra directo a ESE almacén en
        // vez del global de Ajustes. Los admin nunca traen este valor
        // desde el backend (siempre null para ellos), así que sin más
        // condiciones acá caen al comportamiento de siempre.
        if (allConfigData?.default_warehouse_id) {
            setSelectedOption({
                value: Number(allConfigData.default_warehouse_id),
                label: allConfigData.default_warehouse_name,
            });
        } else {
            setSelectedOption(
                settings.attributes && {
                    value: Number(settings.attributes.default_warehouse),
                    label: settings.attributes.warehouse_name,
                }
            );
        }
    }, [settings, allConfigData]);

    useEffect(() => {
        fetchSetting();
        fetchFrontSetting();
        fetchTodaySaleOverAllReport();
        fetchHoldLists();
    }, []);

    useEffect(() => {
        if (updateHolList === true) {
            fetchHoldLists();
            setUpdateHoldList(false);
        }
    }, [updateHolList]);

    useEffect(() => {
        setUpdateProducts(updateProducts);
    }, [quantity, grandTotal]);

    const handleValidation = () => {
        let errors = {};
        let isValid = false;
        if (
            cashPaymentValue["notes"] &&
            cashPaymentValue["notes"].length > 100
        ) {
            errors["notes"] =
                "The notes must not be greater than 100 characters";
        } else {
            isValid = true;
        }
        setErrors(errors);
        return isValid;
    };

    // 2. Actualiza refs junto con estado
    const setCategory = (item) => {
        setCategoryId(item);
        categoryIdRef.current = item;
    };

    const setBrand = (item) => {
        setBrandId(item);
        brandIdRef.current = item;
    };

    useEffect(() => {
        if (!selectedOption) return;

        const requestId = ++fetchRequestIdRef.current;

        const timer = setTimeout(() => {
            // Solo ejecuta si esta sigue siendo la última petición solicitada
            if (requestId === fetchRequestIdRef.current) {
                fetchBrandClickable(
                    brandIdRef.current,
                    categoryIdRef.current,
                    selectedOption.value
                );
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [selectedOption, brandId, categoryId]);

    useEffect(() => {
        setUpdateProducts([]);
        setCartProductIds([]);
    }, [selectedOption?.value]);


    const handleWarehouseChangeWithConfirm = (newOption) => {
        if (updateProducts.length > 0 && newOption?.value !== selectedOption?.value) {
            const confirmar = window.confirm(
                "Cambiar de almacén vaciará el carrito actual. ¿Deseas continuar?"
            );
            if (!confirmar) return;
        }
        setSelectedOption(newOption);
    };

    const onChangeInput = (e) => {
        e.preventDefault();
        setCashPaymentValue((inputs) => ({
            ...inputs,
            [e.target.name]: e.target.value,
        }));
    };

    // payment type dropdown functionality
    const paymentTypeFilterOptions = getFormattedOptions(paymentMethodOptions);
    const paymentTypeDefaultValue = paymentTypeFilterOptions.map((option) => {
        return {
            value: option.id,
            label: option.name,
        };
    });

    // Filas de pago del POS: por defecto una sola (efectivo), pero se
    // pueden agregar más para dividir el cobro entre varias formas de
    // pago (ej. $20 efectivo + $10 transferencia).
    const [paymentRows, setPaymentRows] = useState([
        { id: 1, amount: "", payment_type: paymentTypeDefaultValue[0] },
    ]);

    const onAddPaymentRow = () => {
        setPaymentRows((prev) => {
            const totalPagado = prev.reduce(
                (sum, row) => sum + (Number(row.amount) || 0),
                0
            );
            const saldoRestante = Math.max(0, grandTotal - totalPagado);
            return [
                ...prev,
                {
                    id: Date.now(),
                    amount: saldoRestante > 0 ? saldoRestante.toFixed(2) : "",
                    payment_type: paymentTypeDefaultValue[0],
                },
            ];
        });
    };

    const onRemovePaymentRow = (id) => {
        setPaymentRows((prev) =>
            prev.length > 1 ? prev.filter((row) => row.id !== id) : prev
        );
    };

    const onPaymentRowAmountChange = (id, value) => {
        setPaymentRows((prev) =>
            prev.map((row) => (row.id === id ? { ...row, amount: value } : row))
        );
    };

    const onPaymentRowTypeChange = (id, obj) => {
        setPaymentRows((prev) =>
            prev.map((row) =>
                row.id === id ? { ...row, payment_type: obj } : row
            )
        );
    };

    const onChangeCart = (event) => {
        const { value } = event.target;
        // check if value includes a decimal point
        if (value.match(/\./g)) {
            const [, decimal] = value.split(".");
            // restrict value to only 2 decimal places
            if (decimal?.length > 2) {
                // do nothing
                return;
            }
        }
        setCartItemValue((inputs) => ({
            ...inputs,
            [event.target.name]: value,
        }));
    };

    const onChangeTaxCart = (event) => {
        const min = 0;
        const max = 100;
        const { value } = event.target;
        const values = Math.max(min, Math.min(max, Number(value)));
        // check if value includes a decimal point
        if (value.match(/\./g)) {
            const [, decimal] = value.split(".");
            // restrict value to only 2 decimal places
            if (decimal?.length > 2) {
                // do nothing
                return;
            }
        }
        setCartItemValue((inputs) => ({
            ...inputs,
            [event.target.name]: values,
        }));
    };

    //payment slip model onchange
    const handleCashPayment = () => {
        setCashPaymentValue({
            notes: "",
            payment_status: {
                label: getFormattedMessage("dashboard.recentSales.paid.label"),
                value: 1,
            },
        });
        setCashPayment(!cashPayment);
    };

    // El botón "Pagar" (PaymentButton.js) abre el modal llamando a
    // setCashPayment(true) directo, sin pasar por handleCashPayment -- por
    // eso el precargado va acá, mirando el valor de cashPayment en sí, así
    // agarra la apertura sin importar desde dónde se dispare.
    useEffect(() => {
        if (cashPayment) {
            setPaymentRows([
                {
                    id: Date.now(),
                    amount: grandTotal,
                    payment_type: paymentTypeDefaultValue[0],
                },
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cashPayment]);

    const updateCost = (item) => {
        setNewCost(item);
    };

    //product details model onChange
    const openProductDetailModal = () => {
        setIsOpenCartItemUpdateModel(!isOpenCartItemUpdateModel);
    };

    //product details model updated value
    const onClickUpdateItemInCart = (item) => {
        setProduct(item);
        setIsOpenCartItemUpdateModel(true);
    };

    const onProductUpdateInCart = () => {
        const localCart = updateProducts.slice();
        updateCart(localCart);
    };

    //updated Qty function
    const updatedQty = (qty) => {
        setQuantity(qty);
    };

    const updateCart = (cartProducts) => {
        setUpdateProducts(cartProducts);
    };

    //cart item delete
    const onDeleteCartItem = (productId) => {
        const existingCart = updateProducts.filter((e) => e.id !== productId);
        updateCart(existingCart);
    };

    //product add to cart function
    const addToCarts = (items) => {
        updateCart(items);
    };

    // create customer model
    const customerModel = (val) => {
        setModalShowCustomer(val);
    };

    //prepare data for print Model
    const preparePrintData = () => {
        const totalPaid = paymentRows.reduce(
            (sum, row) => sum + (Number(row.amount) || 0),
            0
        );
        const formValue = {
            products: updateProducts,
            discount: cartItemValue.discount ? cartItemValue.discount : 0,
            tax: cartItemValue.tax ? cartItemValue.tax : 0,
            cartItemPrint: cartItemValue,
            taxTotal: taxTotal,
            grandTotal: grandTotal,
            shipping: cartItemValue.shipping,
            subTotal: subTotal,
            frontSetting: frontSetting,
            customer_name: selectedCustomerOption,
            settings: settings,
            note: cashPaymentValue.notes,
            changeReturn: Math.max(0, totalPaid - grandTotal),
            payment_status: totalPaidAmount(),
            tipoComprobanteSri: tipoComprobanteSri,
        };
        return formValue;
    };

    //prepare data for payment api
    const prepareData = (updateProducts) => {
        const formValue = {
            date: dayjs(new Date()).format("YYYY-MM-DD"),
            customer_id:
                selectedCustomerOption && selectedCustomerOption[0]
                    ? selectedCustomerOption[0].value
                    : selectedCustomerOption && selectedCustomerOption.value,
            warehouse_id:
                selectedOption && selectedOption[0]
                    ? selectedOption[0].value
                    : selectedOption && selectedOption.value,
            sale_items: updateProducts,
            grand_total: grandTotal,
            // Se manda el desglose completo de formas de pago -- el backend
            // ya sabe calcular paid_amount y payment_status a partir de esto
            // (ver SaleRepository::storeSale). payment_type queda como el de
            // la primera fila, solo por compatibilidad con pantallas viejas
            // que todavía leen ese campo suelto.
            payments: paymentRows
                .filter((row) => Number(row.amount) > 0)
                .map((row) => ({
                    amount: Number(row.amount),
                    payment_type: row.payment_type?.value,
                })),
            payment_type: paymentRows[0]?.payment_type?.value,
            discount: cartItemValue.discount,
            shipping: cartItemValue.shipping,
            tax_rate: cartItemValue.tax,
            note: cashPaymentValue.notes,
            status: 1,
            hold_ref_no: hold_ref_no,
            payment_status: totalPaidAmount(),
        };
        return formValue;
    };

    // Estado de pago calculado a partir de las filas -- nunca se confía
    // en una selección manual, se deduce de cuánto se cargó realmente.
    const totalPaidAmount = () => {
        const totalPaid = paymentRows.reduce(
            (sum, row) => sum + (Number(row.amount) || 0),
            0
        );
        if (totalPaid <= 0) return 2; // No pagado
        if (totalPaid >= grandTotal) return 1; // Pagado
        return 3; // Pago parcial
    };

    //cash payment method
    const onCashPayment = (event) => {
        event.preventDefault();
        const valid = handleValidation();
        if (valid) {
            posCashPaymentAction(
                prepareData(updateProducts),
                setUpdateProducts,
                setModalShowPaymentSlip,
                posAllProduct,
                {
                    brandId,
                    categoryId,
                    selectedOption,
                },
                // Si se eligió un tipo de comprobante SRI, emitimos la
                // factura electrónica en cuanto la venta quede creada.
                (ventaCreada) => {
                    if (tipoComprobanteSri && ventaCreada?.id) {
                        emitirFactura(ventaCreada.id);
                    }
                }
            );
            // setModalShowPaymentSlip(true);
            setCashPayment(false);
            setPaymentPrint(preparePrintData);
            setTipoComprobanteSri("");
            setCartItemValue({
                discount: 0,
                tax: 0,
                shipping: 0,
            });
            setCashPaymentValue({
                notes: "",
                payment_status: {
                    label: getFormattedMessage(
                        "dashboard.recentSales.paid.label"
                    ),
                    value: 1,
                },
            });
            resetPaymentRows();
            setCartProductIds("");
        }
    };

    const printPaymentReceiptPdf = () => {
        document.getElementById("printReceipt").click();
    };

    const printRegisterDetails = () => {
        document.getElementById("printRegisterDetailsId").click();
    };

    const handleRegisterDetailsPrint = useReactToPrint({
        content: () => registerDetailsRef.current,
    });

    //Register details  slip
    const loadRegisterDetailsPrint = () => {
        return (
            <div className="d-none">
                <button
                    id="printRegisterDetailsId"
                    onClick={handleRegisterDetailsPrint}
                >
                    Print this out!
                </button>
                <PrintRegisterDetailsData
                    ref={registerDetailsRef}
                    allConfigData={allConfigData}
                    frontSetting={frontSetting}
                    posAllTodaySaleOverAllReport={posAllTodaySaleOverAllReport}
                    updateProducts={paymentPrint}
                    closeRegisterDetails={closeRegisterDetails}
                />
            </div>
        );
    };


    const resetPaymentRows = () => {
        setPaymentRows([
            { id: Date.now(), amount: "", payment_type: paymentTypeDefaultValue[0] },
        ]);
    };

    const loadPaymentSlip = () => {
        return (
            // ✅ Ya no necesita "d-none" ni el botón oculto
            <PaymentSlipModal
                setPaymentValue={resetPaymentRows}
                setModalShowPaymentSlip={setModalShowPaymentSlip}
                settings={settings}
                frontSetting={frontSetting}
                modalShowPaymentSlip={modalShowPaymentSlip}
                allConfigData={allConfigData}
                paymentDetails={paymentDetails}
                updateProducts={paymentPrint}
                payments={paymentRows
                    .filter((row) => Number(row.amount) > 0)
                    .map((row) => ({
                        label: row.payment_type?.label,
                        amount: Number(row.amount),
                    }))}
                paymentTypeDefaultValue={paymentTypeDefaultValue}
                tipoComprobanteSri={paymentPrint?.tipoComprobanteSri || ""}
            />
        );
    };

    const [lgShow, setLgShow] = useState(false);
    const [holdShow, setHoldShow] = useState(false);

    const onClickDetailsModel = (isDetails = null) => {
        setLgShow(true);
    };

    const onClickHoldModel = (isDetails = null) => {
        setHoldShow(true);
    };

    const handleClickCloseRegister = () => {
        dispatch(getAllRegisterDetailsAction());
        setShowCloseDetailsModal(true);
    };

    const handleCloseRegisterDetails = (data) => {
        if (data.cash_in_hand_while_closing.toString().trim()?.length === 0) {
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "pos.cclose-register.enter-total-cash.message"
                    ),
                    type: toastType.ERROR,
                })
            );
        } else {
            setShowCloseDetailsModal(false);
            dispatch(closeRegisterAction(data, navigate));
        }
    };

    return (
        <Container className="pos-screen pos-v2 px-3" fluid>
            <TabTitle title="POS" />
            {/* {loadPrintBlock()} */}
            {loadPaymentSlip()}
            {loadRegisterDetailsPrint()}
            <Row className="pos-workspace g-3">
                <TopProgressBar />
                <Col lg={8} xxl={8} className="pos-catalog-panel pos-right-scs">
                    <div className="pos-catalog-toolbar my-3">
                        <div className="pos-screen-heading">
                            <span className="pos-eyebrow">EcuaPos</span>
                            <h1>Catálogo</h1>
                        </div>
                        <div className="pos-catalog-actions d-sm-flex align-items-center">
                            <ProductSearchbar
                                customCart={customCart}
                                setUpdateProducts={setUpdateProducts}
                                updateProducts={updateProducts}
                            />
                            <HeaderAllButton
                                holdListData={holdListData}
                                goToHoldScreen={onClickHoldModel}
                                goToDetailScreen={onClickDetailsModel}
                                onClickFullScreen={onClickFullScreen}
                                opneCalculator={openCalculator}
                                setOpneCalculator={setOpenCalculator}
                                handleClickCloseRegister={handleClickCloseRegister}
                            />
                        </div>
                    </div>
                    <div className="right-content custom-card pos-catalog-card mb-3">
                        <div className="pos-category-strip px-3 pt-3">
                            <Category
                                setCategory={setCategory}
                                brandId={brandId}
                                selectedOption={selectedOption}
                            />
                        </div>
                        <Product
                            cartProducts={updateProducts}
                            updateCart={addToCarts}
                            customCart={customCart}
                            setCartProductIds={setCartProductIds}
                            cartProductIds={cartProductIds}
                            settings={settings}
                            productMsg={productMsg}
                            selectedOption={selectedOption}
                            brandId={brandId}
                            categoryId={categoryId}
                        />
                    </div>
                </Col>
                <Col lg={4} xxl={4} className="pos-order-panel pos-left-scs">
                    <div className="pos-order-heading my-3">
                        <div>
                            <span className="pos-eyebrow">Nueva venta</span>
                            <h2>Pedido actual</h2>
                        </div>
                        <span className="pos-item-count">
                            {updateProducts.length} {updateProducts.length === 1 ? "producto" : "productos"}
                        </span>
                    </div>
                    <div className="pos-context-card">
                        <PosHeader
                            setSelectedCustomerOption={setSelectedCustomerOption}
                            selectedCustomerOption={selectedCustomerOption}
                            setSelectedOption={setSelectedOption}
                            selectedOption={selectedOption}
                            customerModel={customerModel}
                            updateCustomer={modalShowCustomer}
                        />
                    </div>
                    <div className="left-content custom-card pos-order-card mb-3 p-3">
                        <div className="main-table overflow-auto">
                            <Table className="mb-0">
                                <thead className="position-sticky top-0">
                                    <tr>
                                        <th>
                                            {getFormattedMessage(
                                                "pos-product.title"
                                            )}
                                        </th>
                                        <th
                                            className={
                                                updateProducts &&
                                                    updateProducts.length
                                                    ? "text-center"
                                                    : ""
                                            }
                                        >
                                            {getFormattedMessage(
                                                "pos-qty.title"
                                            )}
                                        </th>
                                        <th>
                                            {getFormattedMessage(
                                                "pos-price.title"
                                            )}
                                        </th>
                                        <th colSpan="2">
                                            {getFormattedMessage(
                                                "pos-sub-total.title"
                                            )}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="border-0">
                                    {updateProducts && updateProducts.length ? (
                                        updateProducts.map(
                                            (updateProduct, index) => {
                                                return (
                                                    <ProductCartList
                                                        singleProduct={
                                                            updateProduct
                                                        }
                                                        key={updateProduct.id}
                                                        index={index}
                                                        posAllProducts={
                                                            posAllProducts
                                                        }
                                                        onClickUpdateItemInCart={
                                                            onClickUpdateItemInCart
                                                        }
                                                        updatedQty={updatedQty}
                                                        updateCost={updateCost}
                                                        onRequestDeleteCartItem={
                                                            setDeleteCartItem
                                                        }
                                                        quantity={quantity}
                                                        frontSetting={
                                                            frontSetting
                                                        }
                                                        newCost={newCost}
                                                        allConfigData={
                                                            allConfigData
                                                        }
                                                        setUpdateProducts={
                                                            setUpdateProducts
                                                        }
                                                    />
                                                );
                                            }
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="custom-text-center text-gray-900 fw-bold py-5"
                                            >
                                                {getFormattedMessage(
                                                    "sale.product.table.no-data.label"
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                        <CartItemMainCalculation
                            totalQty={totalQty}
                            subTotal={subTotal}
                            grandTotal={grandTotal}
                            cartItemValue={cartItemValue}
                            onChangeCart={onChangeCart}
                            allConfigData={allConfigData}
                            frontSetting={frontSetting}
                            onChangeTaxCart={onChangeTaxCart}
                        />
                        <PaymentButton
                            updateProducts={updateProducts}
                            updateCart={addToCarts}
                            setUpdateProducts={setUpdateProducts}
                            setCartItemValue={setCartItemValue}
                            setCashPayment={setCashPayment}
                            cartItemValue={cartItemValue}
                            grandTotal={grandTotal}
                            subTotal={subTotal}
                            selectedOption={selectedOption}
                            cashPaymentValue={cashPaymentValue}
                            holdListId={holdListId}
                            setHoldListValue={setHoldListValue}
                            selectedCustomerOption={selectedCustomerOption}
                            setUpdateHoldList={setUpdateHoldList}
                        />
                    </div>
                </Col>
            </Row>
            {isOpenCartItemUpdateModel && (
                <ProductDetailsModel
                    openProductDetailModal={openProductDetailModal}
                    productModelId={product.id}
                    onProductUpdateInCart={onProductUpdateInCart}
                    updateCost={updateCost}
                    cartProduct={product}
                    isOpenCartItemUpdateModel={isOpenCartItemUpdateModel}
                    frontSetting={frontSetting}
                />
            )}
            {cashPayment && (
                <CashPaymentModel
                    cashPayment={cashPayment}
                    totalQty={totalQty}
                    cartItemValue={cartItemValue}
                    onChangeInput={onChangeInput}
                    cashPaymentValue={cashPaymentValue}
                    allConfigData={allConfigData}
                    subTotal={subTotal}
                    grandTotal={grandTotal}
                    onCashPayment={onCashPayment}
                    taxTotal={taxTotal}
                    handleCashPayment={handleCashPayment}
                    settings={settings}
                    errors={errors}
                    paymentTypeFilterOptions={paymentTypeFilterOptions}
                    paymentRows={paymentRows}
                    onAddPaymentRow={onAddPaymentRow}
                    onRemovePaymentRow={onRemovePaymentRow}
                    onPaymentRowAmountChange={onPaymentRowAmountChange}
                    onPaymentRowTypeChange={onPaymentRowTypeChange}
                    tipoComprobanteSri={tipoComprobanteSri}
                    onTipoComprobanteChange={setTipoComprobanteSri}
                />
            )}
            {lgShow && (
                <RegisterDetailsModel
                    printRegisterDetails={printRegisterDetails}
                    frontSetting={frontSetting}
                    lgShow={lgShow}
                    setLgShow={setLgShow}
                />
            )}
            {holdShow && (
                <HoldListModal
                    setUpdateHoldList={setUpdateHoldList}
                    setCartItemValue={setCartItemValue}
                    setUpdateProducts={setUpdateProducts}
                    updateProduct={updateProducts}
                    printRegisterDetails={printRegisterDetails}
                    frontSetting={frontSetting}
                    holdListData={holdListData}
                    setHold_ref_no={setHold_ref_no}
                    holdShow={holdShow}
                    setHoldShow={setHoldShow}
                    addCart={addToCarts}
                    updateCart={updateCart}
                    setSelectedCustomerOption={setSelectedCustomerOption}
                    setSelectedOption={setSelectedOption}
                />
            )}
            {modalShowCustomer && (
                <CustomerForm
                    show={modalShowCustomer}
                    hide={setModalShowCustomer}
                />
            )}
            <PosCloseRegisterDetailsModel
                showCloseDetailsModal={showCloseDetailsModal}
                handleCloseRegisterDetails={handleCloseRegisterDetails}
                setShowCloseDetailsModal={setShowCloseDetailsModal}
            />
            {deleteCartItem && (
                <DeleteModel
                    onClickDeleteModel={() => setDeleteCartItem(null)}
                    deleteUserClick={() => {
                        onDeleteCartItem(deleteCartItem.id);
                        setDeleteCartItem(null);
                    }}
                    name={deleteCartItem.name}
                />
            )}
        </Container>
    );
};

const mapStateToProps = (state) => {
    const {
        posAllProducts,
        frontSetting,
        settings,
        cashPayment,
        allConfigData,
        posAllTodaySaleOverAllReport,
        holdListData,
    } = state;
    return {
        holdListData,
        posAllProducts,
        frontSetting,
        settings,
        paymentDetails: cashPayment,
        customCart: prepareCartArray(posAllProducts),
        allConfigData,
        posAllTodaySaleOverAllReport,
    };
};

export default connect(mapStateToProps, {
    fetchSetting,
    fetchFrontSetting,
    posSearchNameProduct,
    posCashPaymentAction,
    posSearchCodeProduct,
    posAllProduct,
    fetchBrandClickable,
    fetchHoldLists,
})(PosMainPage);
