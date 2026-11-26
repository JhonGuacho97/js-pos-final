const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const babel = require('@babel/core');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const root = path.resolve(__dirname, '../..');
const source = (file) => fs.readFileSync(path.join(root, 'resources/pos/src', file), 'utf8');
const load = (file, dependencies, globals = {}) => {
    const module = { exports: {} };
    const { code } = babel.transformSync(source(file), {
        babelrc: false, configFile: false,
        presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-react'],
    });
    vm.runInNewContext(code, {
        module, exports: module.exports,
        require: (name) => {
            if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
            return dependencies[name];
        },
        ...globals,
    }, { filename: file });
    return module.exports;
};

// Real filter, actions and reducer; only HTTP and IndexedDB are simulated.
// These tests never access Laravel, a database, or the network.
const storage = load('offline/catalogStorage.js', { '../constants': {} });
const selectors = load('frontend/shared/catalogSelectors.js', { '../../offline/catalogStorage': storage });
const constants = load('constants/index.js', {});
const reducer = load('store/reducers/pos/posAllProductReducres.js', {
    '../../../constants': constants,
}).default;
const deferred = () => {
    let resolve, reject;
    const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
    return { promise, resolve, reject };
};
const product = (id, category = 7, brand = 2) => ({
    id, attributes: { product_category_id: category, brand_id: brand, stock: { quantity: 5 } },
});
const beer = product('beer');
const shoes = product('shoes', 8);
const otherBrand = product('other-brand', 7, 3);
const allProducts = [beer, shoes, otherBrand];

const fixture = ({ online = true } = {}) => {
    const requests = [], cacheReads = [], cacheWrites = [], statuses = [], actions = [];
    const navigator = { onLine: online };
    let state = [];
    const dispatch = (action) => {
        if (typeof action === 'function') return action(dispatch);
        actions.push(action);
        state = reducer(state, action);
        return action;
    };
    const catalog = load('store/action/pos/posAllProductAction.js', {
        '../../../constants': constants,
        '../../../config/apiConfig': { get: (url) => {
            const pending = deferred();
            requests.push({ url, ...pending });
            return pending.promise;
        } },
        '../toastAction': { addToast: (payload) => ({ type: 'test-toast', payload }) },
        '../../../offline/catalogStorage': {
            ...storage,
            getOfflineScopeKey: () => 'test-user:test-store',
            emitOfflineCatalogStatus: (status) => statuses.push(status),
            cacheCatalogImages: () => {},
            getLatestCatalogSnapshot: (warehouse) => {
                const pending = deferred();
                cacheReads.push({ warehouse, ...pending });
                return pending.promise;
            },
            saveOfflineSnapshot: async (_resource, products, { warehouseId }) => {
                cacheWrites.push({ warehouseId, products });
                return { warehouseId, payload: products, itemCount: products.length };
            },
        },
    }, { navigator });
    return {
        ...catalog, navigator, dispatch, requests, cacheReads, cacheWrites, statuses, actions,
        ids: () => Array.from(state, (item) => item.id),
        respond: (index, products) => requests[index].resolve({ data: { data: products } }),
    };
};

test('late full download cannot replace a category; offline copy stays complete', async () => {
    const f = fixture();
    const full = f.dispatch(f.fetchBrandClickable(undefined, undefined, 1));
    const filtered = f.dispatch(f.fetchBrandClickable(2, 7, 1));
    f.respond(1, [beer]); await filtered;
    f.respond(0, allProducts); await full;
    assert.deepEqual(f.ids(), ['beer']);
    assert.equal(f.cacheWrites[0].products.length, 3);
});

test('rapid category changes keep the newest response even when it arrives first', async () => {
    const f = fixture();
    const old = f.dispatch(f.fetchBrandClickable(2, 7, 1));
    const newest = f.dispatch(f.fetchBrandClickable(2, 8, 1));
    f.respond(1, [shoes]); await newest;
    f.respond(0, [beer]); await old;
    assert.deepEqual(f.ids(), ['shoes']);
});

test('refresh publishes only filtered products, with no intermediate full list', async () => {
    const f = fixture();
    const refresh = f.dispatch(f.fetchBrandClickable(2, '7', 1, { refreshCache: true }));
    assert.ok(f.requests[0].url.includes('filter[brand_id]=&filter[product_category_id]=&'));
    f.respond(0, allProducts); await refresh;
    assert.deepEqual(f.ids(), ['beer']);
    assert.equal(f.actions.length, 1);
    assert.equal(f.cacheWrites[0].products.length, 3);
});

test('cache-only synchronization neither replaces nor invalidates an active filter', async () => {
    const f = fixture();
    const filter = f.dispatch(f.fetchBrandClickable(2, 7, 1));
    const background = f.dispatch(f.fetchBrandClickable(undefined, undefined, 1, { cacheOnly: true }));
    f.respond(1, allProducts); await background;
    assert.equal(f.actions.length, 0);
    f.respond(0, [beer]); await filter;
    assert.deepEqual(f.ids(), ['beer']);
    assert.equal(f.cacheWrites[0].products.length, 3);
});

test('UI predicate invalidates a request before the next debounced query starts', async () => {
    const f = fixture();
    let current = true;
    const request = f.dispatch(f.fetchBrandClickable(2, 7, 1, { isCurrent: () => current }));
    current = false;
    f.respond(0, [beer]); await request;
    assert.equal(f.actions.length, 0);
});

test('obsolete errors do not reset connectivity or display a toast', async () => {
    const f = fixture();
    const old = f.dispatch(f.fetchBrandClickable(2, 7, 1));
    const newest = f.dispatch(f.fetchBrandClickable(2, 8, 1));
    f.respond(1, [shoes]); await newest;
    const statusCount = f.statuses.length;
    f.requests[0].reject({ response: { status: 500, data: { message: 'old failure' } } });
    await old;
    assert.deepEqual(f.ids(), ['shoes']);
    assert.equal(f.actions.length, 1);
    assert.equal(f.statuses.length, statusCount);
});

test('offline IndexedDB reads cannot overwrite a newer filter', async () => {
    const f = fixture({ online: false });
    const old = f.dispatch(f.fetchBrandClickable(2, 7, 1));
    const newest = f.dispatch(f.fetchBrandClickable(2, 8, 1));
    const snapshot = { warehouseId: 1, payload: allProducts, itemCount: 3 };
    f.cacheReads[1].resolve(snapshot); await newest;
    f.cacheReads[0].resolve(snapshot); await old;
    assert.deepEqual(f.ids(), ['shoes']);
    assert.equal(f.actions.length, 1);
});

test('network fallback preserves category and brand filters', async () => {
    const f = fixture();
    const request = f.dispatch(f.fetchBrandClickable(2, 7, 1, { refreshCache: true }));
    f.requests[0].reject(new Error('Network Error'));
    await new Promise((resolve) => setImmediate(resolve));
    f.cacheReads[0].resolve({ warehouseId: 1, payload: allProducts, itemCount: 3 });
    await request;
    assert.deepEqual(f.ids(), ['beer']);
});

test('all categories, empty categories, and warehouse changes still work', async () => {
    const f = fixture();
    const oldWarehouse = f.dispatch(f.fetchBrandClickable(undefined, 7, 1));
    const all = f.dispatch(f.fetchBrandClickable(undefined, 0, 2));
    f.respond(1, allProducts); await all;
    f.respond(0, [beer]); await oldWarehouse;
    assert.deepEqual(f.ids(), ['beer', 'shoes', 'other-brand']);
    const empty = f.dispatch(f.fetchBrandClickable(undefined, 999, 2));
    f.respond(2, []); await empty;
    assert.deepEqual(f.ids(), []);
});

test('legacy full-catalog actions share stale-response protection', async () => {
    for (const action of ['posAllProduct', 'posAllProductAction']) {
        const f = fixture();
        const full = f.dispatch(f[action](1));
        const filter = f.dispatch(f.fetchBrandClickable(2, 7, 1));
        f.respond(1, [beer]); await filter;
        f.respond(0, allProducts); await full;
        assert.deepEqual(f.ids(), ['beer']);
    }
});

// Run the production POS effect/setters/sync function extracted by AST. This
// verifies the real wiring without mounting the whole POS or performing sales.
const mainAst = babel.parseSync(source('frontend/components/PosMainPage.js'), {
    babelrc: false, configFile: false, parserOpts: { plugins: ['jsx'] },
});
const mainBody = mainAst.program.body.find((node) =>
    node.type === 'VariableDeclaration' && node.declarations[0].id.name === 'PosMainPage'
).declarations[0].init.body.body;
const nodes = mainBody.filter((node) => {
    if (node.type === 'VariableDeclaration') {
        return ['setCategory', 'setBrand', 'syncOfflineCatalog'].includes(node.declarations[0].id.name);
    }
    return node.type === 'ExpressionStatement' && node.expression.callee?.name === 'useEffect'
        && node.expression.arguments[1]?.elements?.some((item) => item?.name === 'categoryId');
});
assert.equal(nodes.length, 4);
const lifecycleCode = babel.transformFromAstSync({ type: 'File', program: {
    type: 'Program', sourceType: 'script', body: nodes,
} }, undefined, { babelrc: false, configFile: false }).code;
const lifecycle = (f) => {
    let cleanup;
    const timers = [];
    const delays = [];
    const scope = {
        navigator: f.navigator, selectedOption: { value: 1 }, brandId: 2, categoryId: 7,
        brandIdRef: { current: 2 }, categoryIdRef: { current: 7 },
        warehouseIdRef: { current: 1 }, fetchRequestIdRef: { current: 0 },
        syncedWarehouseRef: { current: null },
        setCategoryId: (id) => { scope.categoryId = id; },
        setBrandId: (id) => { scope.brandId = id; },
        fetchBrandClickable: (...args) => f.dispatch(f.fetchBrandClickable(...args)),
        useEffect: (effect) => { cleanup = effect(); },
        setTimeout: (callback, delay) => { timers.push(callback); delays.push(delay); return timers.length; },
        clearTimeout: () => {},
    };
    vm.createContext(scope);
    vm.runInContext(`${lifecycleCode}\nthis.setCategory = setCategory; this.setBrand = setBrand; this.sync = syncOfflineCatalog;`, scope);
    return { scope, delays, cleanup: () => cleanup(), start: () => timers[0]() };
};

test('initial POS load saves a full catalog but displays the selected category', async () => {
    const f = fixture(), page = lifecycle(f);
    assert.equal(page.delays[0], 0);
    const pending = page.start();
    f.respond(0, allProducts); await pending;
    assert.deepEqual(f.ids(), ['beer']);
    assert.equal(f.cacheWrites[0].products.length, 3);
});

test('selecting a new category immediately invalidates an in-flight POS query', async () => {
    const f = fixture(), page = lifecycle(f);
    const pending = page.start();
    page.scope.setCategory(8);
    f.respond(0, allProducts); await pending;
    assert.equal(f.actions.length, 0);
    assert.equal(page.scope.categoryIdRef.current, 8);
});

test('clicking the selected category does not invalidate its pending response', async () => {
    const f = fixture(), page = lifecycle(f);
    const pending = page.start();
    page.scope.setCategory(7);
    f.respond(0, allProducts); await pending;
    assert.deepEqual(f.ids(), ['beer']);
});

test('leaving the POS invalidates pending responses', async () => {
    const f = fixture(), page = lifecycle(f);
    const pending = page.start();
    page.cleanup();
    f.respond(0, allProducts); await pending;
    assert.equal(f.actions.length, 0);
});

test('reconnection/sale sync uses current warehouse and preserves category', async () => {
    const f = fixture(), page = lifecycle(f);
    page.scope.warehouseIdRef.current = 2;
    page.scope.categoryIdRef.current = 8;
    const pending = page.scope.sync();
    assert.ok(f.requests[0].url.endsWith('warehouse_id=2'));
    f.respond(0, allProducts); await pending;
    assert.deepEqual(f.ids(), ['shoes']);
    assert.equal(f.actions.length, 1);
});

test('a category change during background sync prevents stale publication', async () => {
    const f = fixture(), page = lifecycle(f);
    const pending = page.scope.sync();
    page.scope.setCategory(8);
    f.respond(0, allProducts); await pending;
    assert.equal(f.actions.length, 0);
});

test('brand changes invalidate pending requests without resetting category', async () => {
    const f = fixture(), page = lifecycle(f);
    const pending = page.start();
    page.scope.setBrand(3);
    f.respond(0, allProducts); await pending;
    assert.equal(f.actions.length, 0);
    assert.equal(page.scope.categoryIdRef.current, 7);
    assert.equal(page.scope.brandIdRef.current, 3);
});

test('product grid enforces category/brand/stock before grouping variants', () => {
    const firstVariant = product('variant-1');
    const secondVariant = product('variant-2');
    firstVariant.attributes.variation_product = { main_product_id: 10 };
    secondVariant.attributes.variation_product = { main_product_id: 10 };
    const noStock = product('sold-out');
    noStock.attributes.stock.quantity = 0;
    const products = selectors.selectCatalogProducts(
        [...allProducts, noStock, firstVariant, secondVariant], { brandId: '2', categoryId: '7' }
    );
    assert.deepEqual(Array.from(products, (item) => item.id), ['beer', 'mp_10']);
    assert.equal(products[1].attributes.variations.length, 2);
    assert.equal(products[1].attributes.stock.quantity, 10);
});

test('category highlight follows the parent selection with numeric/string IDs', () => {
    const nav = (props) => React.createElement('nav', props);
    nav.Item = (props) => React.createElement('div', props);
    const Category = load('frontend/components/Category.js', {
        react: React,
        'react-id-swiper': (props) => React.createElement('div', {}, props.children),
        'swiper/swiper.scss': {},
        'react-bootstrap-v5': { Nav: nav, Button: ({ variant, ...props }) => React.createElement('button', props) },
        'react-redux': { connect: () => (component) => component },
        '../../store/action/productCategoryAction': {},
        '../../shared/sharedMethod': { getFormattedMessage: () => 'Todas' },
    }).default;
    const props = { setCategory: () => {}, productCategories: [
        { id: '7', attributes: { name: 'Cerveza', products_count: 3 } },
    ] };
    const selected = renderToStaticMarkup(React.createElement(Category, { ...props, categoryId: 7 }));
    assert.match(selected, /aria-pressed="true"[^>]*>Cerveza/);
    assert.match(selected, /aria-pressed="false"[^>]*>Todas/);
    const all = renderToStaticMarkup(React.createElement(Category, { ...props, categoryId: 0 }));
    assert.match(all, /aria-pressed="true"[^>]*>Todas/);
});
