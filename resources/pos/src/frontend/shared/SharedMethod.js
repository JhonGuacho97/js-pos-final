//count discount on price
export const calculateDiscount = ( product ) => {
    const price = Number(product?.product_price ?? product?.net_unit_cost ?? 0);
    const discountValue = Math.max(0, Number(product?.discount_value || 0));
    const discountType = Number(product?.discount_type || 1);

    if (discountType === 2) {
        return Math.max(0, price - discountValue);
    }

    if (discountType === 1) {
        return Math.max(0, price - (price * Math.min(discountValue, 100) / 100));
    }

    return price;
};

//count tax on price
export const calculateTax = ( product, discountedPrice ) => {
    const taxType = Number(product?.tax_type || 1);
    const taxRate = Math.max(0, Number(product?.tax_value || 0));

    if (taxType === 2 || taxRate === 0) {
        return Number(discountedPrice || 0);
    }

    return Number(discountedPrice || 0) * (1 + taxRate / 100);
};

export const calculateProductBreakdown = (product) => {
    const productPrice = Math.max(0, Number(product?.product_price ?? product?.net_unit_cost ?? 0));
    const discountedPrice = calculateDiscount({...product, product_price: productPrice});
    const discountAmount = Math.max(0, productPrice - discountedPrice);
    const taxRate = Math.max(0, Number(product?.tax_value || 0));
    const taxType = Number(product?.tax_type || 1);
    const taxAmount = taxRate <= 0
        ? 0
        : taxType === 2
            ? discountedPrice * taxRate / (100 + taxRate)
            : discountedPrice * taxRate / 100;
    const finalPrice = taxType === 2 ? discountedPrice : discountedPrice + taxAmount;

    return {
        productPrice,
        discountAmount,
        discountedPrice,
        taxAmount,
        netUnitPrice: taxType === 2 ? discountedPrice - taxAmount : discountedPrice,
        finalPrice,
    };
};

//cart price updated
export const calculateProductCost = ( product ) => {
    return calculateProductBreakdown(product).finalPrice;
};
