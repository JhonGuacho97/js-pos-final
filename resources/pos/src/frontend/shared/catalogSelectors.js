import { filterCatalogProducts } from '../../offline/catalogStorage';

// Linear grouping: a product belongs to exactly one bucket. No nested scans.
export const groupVariationProducts = (products = []) => {
    const groups = new Map();
    for (const product of products) {
        const mainId = product.attributes?.variation_product?.main_product_id;
        if (mainId) {
            if (!groups.has(mainId)) groups.set(mainId, []);
            groups.get(mainId).push(product);
        }
    }
    const result = [];
    const seen = new Set();
    for (const product of products) {
        const mainId = product.attributes?.variation_product?.main_product_id;
        if (!mainId) { result.push(product); continue; }
        if (seen.has(mainId)) continue;
        seen.add(mainId);
        const siblings = groups.get(mainId);
        if (siblings.length === 1) { result.push(product); continue; }
        result.push({
            id: `mp_${mainId}`, isVariationGroup: true,
            attributes: {
                ...product.attributes,
                stock: { quantity: siblings.reduce((sum, item) => sum + (Number(item.attributes?.stock?.quantity) || 0), 0) },
                variations: siblings,
            },
        });
    }
    return result;
};

export const selectCatalogProducts = (products, filters) => groupVariationProducts(
    filterCatalogProducts(products, filters).filter(product => product.attributes?.stock?.quantity > 0)
);

// One selector instance per connected POS, never a cache shared across accounts.
export const createCartSelector = (prepare) => {
    let previousProducts, previousRows;
    return (products) => {
        if (products !== previousProducts) {
            previousProducts = products;
            previousRows = prepare(products);
        }
        return previousRows;
    };
};
