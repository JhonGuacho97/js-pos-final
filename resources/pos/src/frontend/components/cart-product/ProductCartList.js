import React from "react";
import { connect, useDispatch } from "react-redux";
import {
    currencySymbolHandling,
    decimalValidate,
    getFormattedMessage,
} from "../../../shared/sharedMethod";
import { calculateProductCost } from "../../shared/SharedMethod";
import { addToast } from "../../../store/action/toastAction";
import { toastType } from "../../../constants";

const ProductCartList = (props) => {
    const {
        singleProduct,
        index,
        onClickUpdateItemInCart,
        onRequestDeleteCartItem,
        frontSetting,
        setUpdateProducts,
        posAllProducts,
        allConfigData,
    } = props;
    const dispatch = useDispatch();
    const equivalence = singleProduct.presentation_equivalence || 1;
    const stockInBaseUnits = posAllProducts
        .filter((product) => product.id === singleProduct.product_id)
        .map((product) => product.attributes.stock.quantity);
    // Tope de cantidad en la unidad que se está vendiendo (presentación o base)
    const totalQty = [
        Math.floor((stockInBaseUnits[0] || 0) / equivalence),
    ];

    const handleIncrement = () => {
        setUpdateProducts((updateProducts) =>
            updateProducts.map((item) => {
                if (item.id === singleProduct.id) {
                    if (item.quantity >= totalQty[0]) {
                        dispatch(
                            addToast({
                                text: getFormattedMessage(
                                    "pos.product-quantity-error.message"
                                ),
                                type: toastType.ERROR,
                            })
                        );
                        return item;
                    } else {
                        return { ...item, quantity: item.quantity++ + 1 };
                    }
                } else {
                    return item;
                }
            })
        );
    };

    const handleDecrement = () => {
        if (singleProduct.quantity - 1 > 0.0) {
            setUpdateProducts((updateProducts) =>
                updateProducts.map((item) =>
                    item.id === singleProduct.id
                        ? { ...item, quantity: item.quantity-- - 1 }
                        : item
                )
            );
        }
    };

    //qty onChange
    const handleChange = (e) => {
        e.preventDefault();
        const { value } = e.target;
        // check if value includes a decimal point
        if (value.match(/\./g)) {
            const [, decimal] = value.split(".");
            // restrict value to only 2 decimal places
            if (decimal?.length > 2) {
                // do nothing
                return;
            }
        }

        setUpdateProducts((updateProducts) =>
            updateProducts.map((item) => {
                if (item.id === singleProduct.id) {
                    if (totalQty[0] < Number(e.target.value)) {
                        dispatch(
                            addToast({
                                text: getFormattedMessage(
                                    "pos.product-quantity-error.message"
                                ),
                                type: toastType.ERROR,
                            })
                        );
                        return { ...item, quantity: totalQty[0] };
                    } else {
                        return {
                            ...item,
                            quantity: Number(e.target.value),
                        };
                    }
                } else {
                    return item;
                }
            })
        );
    };

    return (
        <tr className="align-middle product-row">
            {/* 🛍️ PRODUCTO */}
            <td className="ps-3">
                <div className="d-flex flex-column">
                    <span className="product-title">
                        {singleProduct.name}
                    </span>

                    <div className="d-flex align-items-center gap-2 mt-1">
                        <span className="sku-badge">
                            {singleProduct.code}
                        </span>

                        <i
                            className="bi bi-pencil edit-icon"
                            onClick={() => onClickUpdateItemInCart(singleProduct)}
                        />
                    </div>
                </div>
            </td>

            {/* 🔢 CANTIDAD */}
            <td>
                <div className="qty-container">
                    <button
                        onClick={handleDecrement}
                        className="qty-btn"
                    >
                        -
                    </button>

                    <input
                        type="number"
                        value={singleProduct.quantity}
                        className="qty-input"
                        onKeyPress={(event) => decimalValidate(event)}
                        onChange={(e) => handleChange(e)}
                    />

                    <button
                        onClick={handleIncrement}
                        className="qty-btn"
                    >
                        +
                    </button>
                </div>
            </td>

            {/* 💰 PRECIO */}
            <td className="price-text">
                {currencySymbolHandling(
                    allConfigData,
                    frontSetting.value && frontSetting.value.currency_symbol,
                    calculateProductCost(singleProduct)
                )}
            </td>

            {/* 💵 SUBTOTAL */}
            <td className="text-end subtotal-text">
                {currencySymbolHandling(
                    allConfigData,
                    frontSetting.value && frontSetting.value.currency_symbol,
                    calculateProductCost(singleProduct) * singleProduct.quantity
                )}
            </td>

            {/* 🗑️ DELETE */}
            <td className="text-end pe-3">
                <button
                    className="delete-btn"
                    onClick={() => onRequestDeleteCartItem(singleProduct)}
                >
                    <i className="bi bi-trash3" />
                </button>
            </td>

        </tr>
    );
};

export default connect(null, null)(ProductCartList);
