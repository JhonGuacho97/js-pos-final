import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap-v5";
import { connect, useDispatch } from "react-redux";
import useSound from "use-sound";
import { posFetchProduct } from "../../../store/action/pos/posfetchProductAction";
import { posAllProduct } from "../../../store/action/pos/posAllProductAction";
import productImage from "../../../assets/images/brand_logo.png";
import { addToast } from "../../../store/action/toastAction";
import {
    currencySymbolHandling,
    getFormattedMessage,
} from "../../../shared/sharedMethod";
import { toastType } from "../../../constants";
import { SkeletonCard } from "../card-skeleton/SkeletonCard";
import PresentationSelectModal from "./PresentationSelectModal";
import VariationSelectModal from "./VariationSelectModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";

const Product = (props) => {
    const {
        posAllProducts,
        posFetchProduct,
        cartProducts,
        updateCart,
        customCart,
        cartProductIds,
        setCartProductIds,
        settings,
        productMsg,
        newCost,
        selectedOption,
        allConfigData,
        brandId,
        categoryId,
    } = props;
    const [updateProducts, setUpdateProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showPresentationModal, setShowPresentationModal] = useState(false);
    const [presentationProduct, setPresentationProduct] = useState(null);
    const [showVariationModal, setShowVariationModal] = useState(false);
    const [variationProduct, setVariationProduct] = useState(null);
    const [play] = useSound(
        "https://res.cloudinary.com/dxt0es7sj/video/upload/v1785534224/click_audio_xw43en.mp3"
    );
    const dispatch = useDispatch();

    useEffect(() => {
        if (cartProducts) {
            setUpdateProducts(cartProducts);
            const ids = cartProducts.map((item) => item.product_id ?? item.id);
            setCartProductIds(ids);
        }
    }, [cartProducts]);

    useEffect(() => {
        if (Array.isArray(posAllProducts)) {
            // Una respuesta vacía también es una respuesta válida (categoría
            // sin stock o catálogo local todavía vacío); no debe dejar el
            // skeleton girando indefinidamente.
            setIsLoading(false);
        }
    }, [posAllProducts]);

    useEffect(() => {
        if (selectedOption) {
            setIsLoading(true);  // ← cuando cambia la categoría, muestra el skeleton
        }
    }, [selectedOption, brandId, categoryId]);

    const addToCart = (product) => {
        // Productos con presentaciones (Unidad/Six Pack/Caja...) piden
        // primero cuál presentación y cuántas, en vez de agregar directo.
        if (product.attributes.manage_presentations) {
            setPresentationProduct(product);
            setShowPresentationModal(true);
            return;
        }
        // Productos con variantes (talla/color...) agrupadas: piden
        // primero cuál variante, igual que las presentaciones. Si solo
        // queda una variante visible (ej. tras una búsqueda puntual),
        // isVariationGroup nunca se setea y cae directo al flujo normal.
        if (product.isVariationGroup) {
            setVariationProduct(product);
            setShowVariationModal(true);
            return;
        }
        play();
        posFetchProduct(product.id);
        addProductToCart(product);
    };

    // Se llama al confirmar el modal de presentaciones.
    // Cada presentación de un mismo producto es su propia línea de carrito
    // (ej: 1 Unidad + 2 Cajas de Corona en el mismo ticket), identificada
    // con un id compuesto para no chocar con la línea de otra presentación.
    const addPresentationToCart = (product, presentation, qty) => {
        play();
        posFetchProduct(product.id);

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
            const updatedLines = updateProducts.map((item) =>
                item.id === cartLineId ? { ...item, quantity: newQty } : item
            );
            setUpdateProducts(updatedLines);
            updateCart(updatedLines);
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

        const updatedLines = [...updateProducts, newLine];
        setUpdateProducts(updatedLines);
        updateCart(updatedLines);
    };

    // Se llama al confirmar el modal de variantes. A diferencia de las
    // presentaciones, cada variante YA es un producto real e
    // independiente (su propio id, código, precio y stock) -- se agrega
    // igual que un producto normal, solo que con la cantidad elegida en
    // el modal en vez de sumar de a uno.
    const addVariationToCart = (parentProduct, variation, qty) => {
        play();
        posFetchProduct(variation.id);

        const cartLineId = variation.id;
        const availableUnits = variation.attributes.stock?.quantity || 0;

        const existingLine = updateProducts.find(
            (item) => item.id === cartLineId
        );

        if (existingLine) {
            const newQty = existingLine.quantity + qty;
            if (newQty > availableUnits) {
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
            const updatedLines = updateProducts.map((item) =>
                item.id === cartLineId ? { ...item, quantity: newQty } : item
            );
            setUpdateProducts(updatedLines);
            updateCart(updatedLines);
            return;
        }

        if (qty > availableUnits) {
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

        const variationPrice =
            variation.attributes.effective_price ?? variation.attributes.product_price;
        const variationLabel =
            variation.attributes.variation_product?.variation_type_name || "";

        const newLine = {
            name: `${parentProduct.attributes.name} (${variationLabel})`,
            code: variation.attributes.code,
            stock_alert: variation.attributes.stock_alert,
            product_id: variation.id,
            product_cost: variation.attributes.product_cost,
            net_unit_cost: variationPrice,
            tax_type: variation.attributes.tax_type?.value
                ? Number(variation.attributes.tax_type.value)
                : variation.attributes.tax_type,
            product_price: variationPrice,
            fix_net_unit: variationPrice,
            tax_amount: 0,
            discount_type: 1,
            discount_value: 0,
            discount_amount: 0,
            product_unit: variation.attributes.product_unit,
            sale_unit: variation.attributes.sale_unit,
            quantity: qty,
            sub_total: 0,
            id: cartLineId,
            sale_id: 1,
            tax_value: variation.attributes.order_tax,
            hold_item_id: "",
        };

        const updatedLines = [...updateProducts, newLine];
        setUpdateProducts(updatedLines);
        updateCart(updatedLines);
    };

    const addProductToCart = (product) => {
        const newId = posAllProducts
            .filter((item) => item.id === product.id)
            .map((item) => item.id);
        const finalIdArrays = customCart.map((id) => id.product_id);
        const finalId = finalIdArrays.filter(
            (finalIdArray) => finalIdArray === newId[0]
        );
        const pushArray = [...customCart];
        const newProduct = pushArray.find(
            (element) => element.id === finalId[0]
        );
        const filterQty = updateProducts
            .filter((item) => item.id === product.id)
            .map((qty) => qty.quantity)[0];
        if (
            updateProducts.filter((item) => item.id === product.id).length > 0
        ) {
            if (filterQty >= product.attributes.stock.quantity) {
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
                        item.id === product.id
                            ? {
                                ...item,
                                quantity:
                                    product.attributes.stock.quantity >
                                        item.quantity
                                        ? item.quantity++ + 1
                                        : null,
                            }
                            : { ...item, id: item.id }
                    )
                );
                updateCart(updateProducts, product);
            }
        } else {
            setUpdateProducts((prevSelected) => [...prevSelected, product]);
            updateCart((prevSelected) => [...prevSelected, newProduct]);
        }
    };

    const isProductExistInCart = (productId) => {
        return cartProductIds.includes(productId);
    };

    // Agrupa las variantes (talla/color...) de un mismo producto
    // principal en una sola tarjeta -- igual que ya se hace con las
    // presentaciones. Si tras el filtro de stock/búsqueda queda una sola
    // variante visible, se muestra normal (sin agrupar, sin selector).
    const groupVariationProducts = (products) => {
        if (!products) return products;
        const grouped = [];
        const seenMainProductIds = new Set();

        products.forEach((product) => {
            const variationInfo = product.attributes?.variation_product;
            const mainId = variationInfo?.main_product_id;

            if (!mainId) {
                grouped.push(product);
                return;
            }
            if (seenMainProductIds.has(mainId)) return;
            seenMainProductIds.add(mainId);

            const siblings = products.filter(
                (p) => p.attributes?.variation_product?.main_product_id === mainId
            );

            if (siblings.length <= 1) {
                grouped.push(product);
                return;
            }

            const totalStock = siblings.reduce(
                (sum, s) => sum + (s.attributes?.stock?.quantity || 0),
                0
            );

            grouped.push({
                id: `mp_${mainId}`,
                isVariationGroup: true,
                attributes: {
                    ...product.attributes,
                    stock: { quantity: totalStock },
                    variations: siblings,
                },
            });
        });

        return grouped;
    };

    const posFilterProduct = groupVariationProducts(
        posAllProducts &&
        posAllProducts.filter(
            (product) => product.attributes.stock.quantity > 0.0
        )
    );
    const loadAllProduct = (product, index) => {
        const findDifferentWords = (str1, str2) => {
            const words1 = str1.split("_");
            const words2 = str2.split("_");

            const uniqueWords1 = words1.filter(
                (word) => word !== "" && !words2.includes(word)
            );
            const uniqueWords2 = words2.filter(
                (word) => word !== "" && !words1.includes(word)
            );

            return [...uniqueWords1, ...uniqueWords2];
        };

        return product.attributes.stock.quantity >= !0.0 ? (
            <div
                className="product-custom-card"
                key={product.id}
                onClick={() => addToCart(product)}
            >
                <Card
                    className={`product-card h-100 ${(product.isVariationGroup
                        ? product.attributes.variations.some((v) =>
                            isProductExistInCart(v.id)
                        )
                        : isProductExistInCart(product.id)
                    ) ? "product-active" : ""
                        }`}
                >
                    <div className="product-img-wrapper">
                        <img
                            src={
                                product.attributes.images.imageUrls
                                    ? product.attributes.images.imageUrls[0]
                                    : productImage
                            }
                            alt={product.attributes?.name || "Producto"}
                            className="product-img"
                        />

                        {(product.attributes.manage_presentations ||
                            product.isVariationGroup) && (
                                <div className="variant-badge" title="Este producto tiene varias opciones">
                                    <FontAwesomeIcon icon={faLayerGroup} />
                                </div>
                            )}

                        <div className="price-badge">
                            {currencySymbolHandling(
                                allConfigData,
                                settings.attributes &&
                                settings.attributes.currency_symbol,
                                newCost
                                    ? newCost
                                    : (product.attributes.effective_price ?? product.attributes.product_price)
                            )}
                        </div>
                    </div>

                    {/* 📦 BODY */}
                    <Card.Body className="p-2">
                        <h6 className="product-title text-truncate">
                            {product.attributes?.name}
                            {!product.isVariationGroup &&
                                product.attributes?.code !==
                                product.attributes?.product_code
                                ? ` (${findDifferentWords(
                                    product.attributes?.code,
                                    product.attributes?.product_code
                                )})`
                                : null}
                        </h6>

                        <span
                            className={
                                product.isVariationGroup ||
                                    product.attributes.manage_presentations
                                    ? "product-code product-code-variant"
                                    : "product-code"
                            }
                        >
                            {product.isVariationGroup
                                ? `${product.attributes.variations.length} variantes`
                                : product.attributes.manage_presentations
                                    ? `${(product.attributes.presentations || []).length} presentaciones`
                                    : product.attributes.code}
                        </span>

                        {/* 📊 STOCK */}
                        {(() => {
                            const stockQty = product.attributes.stock?.quantity ?? 0;
                            const stockAlert = Number(product.attributes.stock_alert) || 0;
                            const isLowStock = stockAlert > 0 && stockQty <= stockAlert;
                            return (
                                <div className={`stock-badge mt-1${isLowStock ? " stock-badge-low" : ""}`}>
                                    {isLowStock && (
                                        <i className="bi bi-exclamation-triangle-fill me-1" />
                                    )}
                                    {stockQty}{" "}
                                    {product?.attributes?.product_unit_name?.name}
                                </div>
                            );
                        })()}
                    </Card.Body>
                </Card>

            </div>
        ) : (
            ""
        );
    };

    return (
        <div
            className={`${posFilterProduct && posFilterProduct.length === 0
                ? "d-flex align-items-center justify-content-center"
                : ""
                } product-list-block pt-1`}
        >
            {isLoading ? (
                <div className="d-flex flex-wrap product-list-block__product-block w-100 px-2">
                    {[...Array(24)].map((_, index) => (
                        <SkeletonCard key={index} />
                    ))}
                </div>
            ) : (
                <div className="d-flex flex-wrap product-list-block__product-block">
                    {posFilterProduct && posFilterProduct.length === 0 ? (
                        <h4 className="m-auto">
                            {getFormattedMessage("pos-no-product-available.label")}
                        </h4>
                    ) : ""}
                    {productMsg && productMsg === 1 ? (
                        <h4 className="m-auto">
                            {getFormattedMessage("pos-no-product-available.label")}
                        </h4>
                    ) : (
                        posFilterProduct && posFilterProduct.map((product, index) => {
                            return loadAllProduct(product, index);
                        })
                    )}
                </div>
            )}
            {presentationProduct && (
                <PresentationSelectModal
                    show={showPresentationModal}
                    onHide={() => setShowPresentationModal(false)}
                    product={presentationProduct}
                    onConfirm={addPresentationToCart}
                    settings={settings}
                    allConfigData={allConfigData}
                />
            )}
            {variationProduct && (
                <VariationSelectModal
                    show={showVariationModal}
                    onHide={() => setShowVariationModal(false)}
                    product={variationProduct}
                    onConfirm={addVariationToCart}
                />
            )}
        </div>
    );
};

const mapStateToProps = (state) => {
    const { posAllProducts, allConfigData } = state;
    return { posAllProducts, allConfigData };
};

export default connect(mapStateToProps, { posAllProduct, posFetchProduct })(
    Product
);
