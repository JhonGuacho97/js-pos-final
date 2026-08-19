import React, { useState } from "react";
import { Form, InputGroup, FormControl } from "react-bootstrap-v5";
import {
    currencySymbolHandling,
    decimalValidate,
    getFormattedMessage,
    numValidate,
    placeholderText,
} from "../../../shared/sharedMethod";

const CartItemMainCalculation = (props) => {
    const {
        totalQty,
        subTotal,
        cartItemValue,
        onChangeCart,
        grandTotal,
        frontSetting,
        allConfigData,
        onChangeTaxCart,
    } = props;
    const [showAdjustments, setShowAdjustments] = useState(false);

    return (
        <div className="calculation pos-order-summary">
            <div className="pos-summary-line">
                <span>{getFormattedMessage("pos-total-qty.title")}</span>
                <strong>{totalQty || 0}</strong>
            </div>
            <div className="pos-summary-line">
                <span>{getFormattedMessage("pos.subtotal.small.title")}</span>
                <strong>
                    {currencySymbolHandling(
                        allConfigData,
                        frontSetting.value && frontSetting.value.currency_symbol,
                        subTotal || "0.00"
                    )}
                </strong>
            </div>

            <button
                type="button"
                className="pos-adjustments-toggle"
                onClick={() => setShowAdjustments((visible) => !visible)}
                aria-expanded={showAdjustments}
            >
                <span><i className="bi bi-sliders me-2" />Agregar ajustes</span>
                <i className={`bi bi-chevron-${showAdjustments ? "up" : "down"}`} />
            </button>

            {showAdjustments && (
                <div className="pos-adjustments-panel">
                    <Form.Group className="calculation__filed-grp">
                        <Form.Label>Impuesto</Form.Label>
                        <InputGroup>
                            <FormControl
                                type="text"
                                id="tax"
                                name="tax"
                                min="0"
                                step=".01"
                                placeholder={placeholderText(
                                    "globally.detail.tax"
                                )}
                                onChange={(e) => onChangeTaxCart(e)}
                                onKeyPress={(event) => numValidate(event)}
                                value={
                                    cartItemValue.tax === 0
                                        ? ""
                                        : cartItemValue.tax
                                }
                                className="rounded-1 pe-8"
                            />
                            <InputGroup.Text className="position-absolute top-0 bottom-0 end-0 bg-transparent border-0">
                                %
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="calculation__filed-grp">
                        <Form.Label>Descuento</Form.Label>
                        <InputGroup>
                            <FormControl
                                type="text"
                                id="discount"
                                className="rounded-1 pe-8"
                                onChange={(e) => onChangeCart(e)}
                                value={
                                    cartItemValue.discount === 0
                                        ? ""
                                        : cartItemValue.discount
                                }
                                onKeyPress={(event) => decimalValidate(event)}
                                name="discount"
                                min="0"
                                step=".01"
                                placeholder={placeholderText(
                                    "purchase.order-item.table.discount.column.label"
                                )}
                            />
                            <InputGroup.Text className="position-absolute top-0 bottom-0 end-0 bg-transparent border-0">
                                {frontSetting.value &&
                                    frontSetting.value.currency_symbol}
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="calculation__filed-grp">
                        <Form.Label>Envío</Form.Label>
                        <InputGroup>
                            <FormControl
                                type="text"
                                id="shipping"
                                name="shipping"
                                min="0"
                                step=".01"
                                placeholder={placeholderText(
                                    "purchase.input.shipping.label"
                                )}
                                onChange={(e) => onChangeCart(e)}
                                onKeyPress={(event) => decimalValidate(event)}
                                value={
                                    cartItemValue.shipping === 0
                                        ? ""
                                        : cartItemValue.shipping
                                }
                                className="rounded-1 pe-8"
                            />
                            <InputGroup.Text className="position-absolute top-0 bottom-0 end-0 bg-transparent border-0">
                                {frontSetting.value &&
                                    frontSetting.value.currency_symbol}
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                </div>
            )}

            <div className="pos-grand-total">
                <span>{getFormattedMessage("pos-total.title")}</span>
                <strong>
                    {currencySymbolHandling(
                        allConfigData,
                        frontSetting.value && frontSetting.value.currency_symbol,
                        grandTotal || "0.00"
                    )}
                </strong>
            </div>
        </div>
    );
};
export default CartItemMainCalculation;
