import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap-v5";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { connect, useDispatch } from "react-redux";
import {
    posSearchCodeProduct,
    posSearchNameProduct,
} from "../../../store/action/pos/posfetchProductAction";
import useSound from "use-sound";
import {
    getFormattedMessage,
    placeholderText,
} from "../../../shared/sharedMethod";
import { addToast } from "../../../store/action/toastAction";
import { toastType } from "../../../constants";
import PresentationSelectModal from "./PresentationSelectModal";

const ProductSearchbar = (props) => {
    const {
        posAllProducts,
        customCart,
        setUpdateProducts,
        updateProducts,
        posSearchCodeProduct,
        posSearchNameProduct,
    } = props;
    const [searchString, setSearchString] = useState("");
    const [keyDown, setKeyDown] = useState(false);
    const [showPresentationModal, setShowPresentationModal] = useState(false);
    const [presentationProduct, setPresentationProduct] = useState(null);
    const dispatch = useDispatch();
    const [play] = useSound(
        "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3"
    );
    const filterProduct = posAllProducts
        .filter((qty) => qty.attributes.stock.quantity > 0)
        .map((item) => ({
            name: item.attributes.name,
            code: item.attributes.code,
            id: item.id,
            variationLabel: item.attributes.variation_product?.variation_type_name || null,
        }));

    const formatResult = (item) => {
        return (
            <span style={{ display: "block", textAlign: "left" }}>
                {" "}
                {item.code} ({item.name}
                {item.variationLabel ? ` - ${item.variationLabel}` : ""})
            </span>
        );
    };

    const removeSearchClass = () => {
        const html =
            document.getElementsByClassName(`search-bar`)[0].firstChild
                .firstChild.lastChild;
        html.style.display = "none";
    };

    // Se llama al confirmar el modal de presentaciones (código de barras o
    // búsqueda por texto de un producto con manage_presentations). Misma
    // lógica de línea compuesta que en Product.js (click directo sobre la
    // card), así el mismo producto puede tener varias líneas -una por
    // presentación- en el mismo ticket.
    const addPresentationLine = (product, presentation, qty) => {
        play();
        posSearchCodeProduct(product.attributes.code);

        const cartLineId = `${product.id}_p${presentation.id}`;
        const availableUnits = product.attributes.stock?.quantity || 0;
        const maxQtyForPresentation = Math.floor(
            availableUnits / presentation.equivalence
        );

        const existingLine = updateProducts.find(
            (item) => item.id === cartLineId
        );

        if (existingLine) {
            const newQty = existingLine.quantity + qty;
            if (newQty > maxQtyForPresentation) {
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "pos.quantity.exceeds.quantity.available.in.stock.message"
                        ),
                        type: toastType.ERROR,
                    })
                );
                return;
            }
            setUpdateProducts((prev) =>
                prev.map((item) =>
                    item.id === cartLineId
                        ? { ...item, quantity: newQty }
                        : item
                )
            );
            return;
        }

        if (qty > maxQtyForPresentation) {
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "pos.quantity.exceeds.quantity.available.in.stock.message"
                    ),
                    type: toastType.ERROR,
                })
            );
            return;
        }

        // effective_price ya viene resuelto por sucursal desde el backend.
        const presentationPrice = presentation.effective_price ?? presentation.price;

        const newLine = {
            name: `${product.attributes.name} (${presentation.name})`,
            code: product.attributes.code,
            stock_alert: product.attributes.stock_alert,
            product_id: product.id,
            product_presentation_id: presentation.id,
            presentation_equivalence: presentation.equivalence,
            product_cost: product.attributes.product_cost,
            net_unit_cost: presentationPrice,
            tax_type: product.attributes.tax_type?.value
                ? Number(product.attributes.tax_type.value)
                : product.attributes.tax_type,
            product_price: presentationPrice,
            fix_net_unit: presentationPrice,
            tax_amount: 0,
            discount_type: 1,
            discount_value: 0,
            discount_amount: 0,
            product_unit: product.attributes.product_unit,
            sale_unit: product.attributes.sale_unit,
            quantity: qty,
            sub_total: 0,
            id: cartLineId,
            sale_id: 1,
            tax_value: product.attributes.order_tax,
            hold_item_id: "",
        };

        setUpdateProducts((prev) => [...prev, newLine]);
    };

    const onProductSearch = (code) => {
        const isObject = typeof code === 'object';
        const productCode = isObject ? code.code : code;
        const productId = isObject ? code.id : null;

        const codeSearch = posAllProducts
            .filter((item) => item.attributes.code === productCode)
            .map((item) => item.attributes.code);

        const nameSearch = posAllProducts
            .filter((item) => item.attributes.name === productCode)
            .map((item) => item.attributes.name);

        const finalArrays = customCart.map((customId) =>
            productCode === customId.code ? customId.code : customId.name
        );
        const finalSearch = finalArrays.filter((finalArray) =>
            finalArray === codeSearch[0] ? codeSearch[0] : nameSearch[0]
        );

        const matchedProduct = posAllProducts.find(
            (product) =>
                (productId && product.id === productId) ||
                product.attributes.code === productCode ||
                product.attributes.name === productCode
        );

        const singleProduct = posAllProducts
            .filter((product) =>
                product.attributes.code === productCode ||
                product.attributes.name === productCode
            )
            .map((product) => product.attributes.stock.quantity);

        const filterQty = updateProducts
            .filter((item) =>
                item.product_id === productId ||
                item.code === productCode ||
                item.name === productCode
            )
            .map((qty) => qty.quantity)[0];

        if (finalSearch[0]) {
            // Producto con presentaciones (Unidad/Six Pack/Caja...): pedimos
            // cuál y cuántas en un modal, en vez de agregarlo/incrementarlo
            // directo como con un producto normal.
            if (matchedProduct?.attributes?.manage_presentations) {
                setPresentationProduct(matchedProduct);
                setShowPresentationModal(true);
                removeSearchClass();
                setSearchString("");
                setKeyDown(false);
                return;
            }

            if (codeSearch[0] === productCode) {
                posSearchCodeProduct(codeSearch[0]);
            } else {
                posSearchNameProduct(nameSearch[0]);
            }
            removeSearchClass();
            setSearchString("");
            play();

            let pushArray = [...customCart];
            const newProduct = productId
                ? pushArray.find((element) => element.product_id === productId)  // ← scanner: ID exacto
                : pushArray.find((element) =>                                     // ← texto manual
                    element.code === codeSearch[0] ||
                    element.name === nameSearch[0]
                );

            const alreadyInCart = updateProducts.filter((item) =>
                item.product_id === (productId || newProduct?.product_id)
            ).length > 0;

            if (alreadyInCart) {
                if (filterQty >= singleProduct[0]) {
                    dispatch(
                        addToast({
                            text: getFormattedMessage(
                                "pos.quantity.exceeds.quantity.available.in.stock.message"
                            ),
                            type: toastType.ERROR,
                        })
                    );
                } else {
                    setUpdateProducts((updateProducts) =>
                        updateProducts.map((item) =>
                            item.product_id === (productId || newProduct?.product_id) &&
                                singleProduct[0] > item.quantity
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        )
                    );
                    setKeyDown(false);
                }
            } else {
                setUpdateProducts([...updateProducts, newProduct]);
                setKeyDown(false);
                removeSearchClass(true);
            }
        }
    };

    let scanProductBarCode = false;
    const handleOnSelect = (result) => {
        if (keyDown === false && scanProductBarCode === true) {
            onProductSearch(result);
            scanProductBarCode = false;
        }

        if (searchString.trim()?.length !== 0) {
            onProductSearch(result);
        }
    };

    const handleOnSearch = (string) => {
        if (string.trim() !== "") {
            setSearchString(string);
            const codeSearch = posAllProducts.filter(
                (item) => item.attributes.code === string
            );
            if (codeSearch.length > 0) {
                if (codeSearch[0].attributes?.stock?.quantity > 0) {
                    if (codeSearch?.length === 1) {
                        scanProductBarCode = true;
                        const data = {
                            name: codeSearch[0]?.attributes?.name,
                            code: codeSearch[0]?.attributes?.code,
                            id: codeSearch[0]?.id,
                        };
                        handleOnSelect(data);
                        setSearchString("");
                    }
                } else {
                    dispatch(
                        addToast({
                            text: getFormattedMessage(
                                "pos.this.product.out.of.stock.message"
                            ),
                            type: toastType.ERROR,
                        })
                    );
                    setSearchString("");
                }
            }
        }
    };

    const inputFocus = () => {
        let searchInput = document.querySelector(
            'input[data-test="search-input"]'
        );
        searchInput.focus();
    };

    useEffect(() => {
        const keyDownHandler = (event) => {
            if (event.altKey && event.code === "KeyQ") {
                event.preventDefault();
                inputFocus();
            }
        };

        document.addEventListener("keydown", keyDownHandler);

        return () => {
            document.removeEventListener("keydown", keyDownHandler);
        };
    }, []);

    return (
        <Col className="position-relative my-3 search-bar col-xxl-8 col-lg-12 col-12">
            <ReactSearchAutocomplete
                placeholder={placeholderText("pos-globally.search.field.label")}
                items={filterProduct}
                onSearch={handleOnSearch}
                inputSearchString={searchString}
                fuseOptions={{
                    keys: ["name", "code"],
                    useExtendedSearch: true  // ← búsqueda exacta
                }}
                resultStringKeyName="code"
                onSelect={(data) => {
                    handleOnSelect(data);
                }}
                formatResult={formatResult}
                showIcon={false}
                showClear={false}
                autoFocus={true}
            />
            <i className="bi bi-search fs-2 react-search-icon position-absolute top-0 bottom-0 d-flex align-items-center ms-2" />
            {presentationProduct && (
                <PresentationSelectModal
                    show={showPresentationModal}
                    onHide={() => setShowPresentationModal(false)}
                    product={presentationProduct}
                    onConfirm={addPresentationLine}
                />
            )}
        </Col>
    );
};

const mapStateToProps = (state) => {
    const { posAllProducts } = state;
    return { posAllProducts };
};

export default connect(mapStateToProps, {
    posSearchCodeProduct,
    posSearchNameProduct,
})(ProductSearchbar);