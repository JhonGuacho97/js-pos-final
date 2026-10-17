const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const babel = require('@babel/core');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(__dirname, '../..');
const load = (file, dependencies, globals = {}) => {
    const module = { exports: {} };
    const { code } = babel.transformSync(fs.readFileSync(path.join(root, file), 'utf8'), {
        babelrc: false, configFile: false,
        presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-react'],
    });
    vm.runInNewContext(code, {
        module, exports: module.exports,
        require: name => {
            if (!(name in dependencies)) throw Error(`Unexpected import: ${name}`);
            return dependencies[name];
        }, ...globals,
    });
    return module.exports;
};
const src = 'resources/pos/src/';
const storage = load(src + 'offline/catalogStorage.js', { '../constants': {} });
const selectors = load(src + 'frontend/shared/catalogSelectors.js', { '../../offline/catalogStorage': storage });
const prepare = load(src + 'frontend/shared/PrepareCartArray.js', {}).prepareCartArray;
const deferred = () => {
    let resolve, reject;
    const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
    return { promise, resolve, reject };
};
const product = (id, category = 7) => ({ id, attributes: {
    stock: { quantity: 5 }, product_category_id: category, brand_id: 2,
    tax_type: 1, effective_price: 3, product_price: 2,
} });
const tick = () => new Promise(resolve => setImmediate(resolve));

test('5000 variants use linear grouping and preserve first-occurrence order and stock', () => {
    let reads = 0;
    const products = Array.from({ length: 5000 }, (_, i) => {
        const p = product(i);
        Object.defineProperty(p.attributes, 'variation_product', {
            get() { reads++; return { main_product_id: Math.floor(i / 2) + 1 }; },
        });
        return p;
    });
    const grouped = selectors.selectCatalogProducts(products, {});
    assert.equal(grouped.length, 2500);
    assert.equal(grouped[0].id, 'mp_1');
    assert.equal(grouped[0].attributes.stock.quantity, 10);
    assert.equal(grouped[2499].id, 'mp_2500');
    assert(reads <= 3 * products.length, `Expected linear work, got ${reads} relation reads`);
});

test('single remaining variant stays normal; sold-out/category/brand exclusions occur before grouping', () => {
    const first = product(1), second = product(2, 8), soldOut = product(3);
    for (const p of [first, second, soldOut]) p.attributes.variation_product = { main_product_id: 1 };
    soldOut.attributes.stock.quantity = 0;
    const result = selectors.selectCatalogProducts([first, second, soldOut], { categoryId: '7', brandId: '2' });
    assert.equal(result.length, 1);
    assert.strictEqual(result[0], first);
});

test('cart selector reuses templates only for the same catalog and respects changed warehouse prices', () => {
    let allocations = 0;
    const select = selectors.createCartSelector(products => { allocations++; return prepare(products); });
    const products = [product(1)];
    const rows = select(products);
    for (let i = 0; i < 100; i++) assert.strictEqual(select(products), rows);
    assert.equal(allocations, 1);
    assert.equal(rows[0].product_price, 3);
    const changed = [{ ...products[0], attributes: { ...products[0].attributes, effective_price: 8 } }];
    assert.equal(select(changed)[0].product_price, 8);
    assert.equal(allocations, 2);
});

test('actual grid guards cached-preview clicks, clones templates, and defers offscreen images', () => {
    const Card = props => React.createElement('div', { className: props.className }, props.children);
    Card.Body = props => React.createElement('div', {}, props.children);
    const clicks = [];
    const Product = load(src + 'frontend/components/product/Product.js', {
        react: { ...React, useEffect: () => {}, useMemo: callback => callback(),
            useState: initial => [initial === true ? false : initial, () => {}] },
        'react-bootstrap-v5': { Card }, 'react-redux': { connect: () => component => component, useDispatch: () => () => {} },
        'use-sound': () => [() => {}],
        '../../../store/action/pos/posfetchProductAction': {}, '../../../store/action/pos/posAllProductAction': {},
        '../../../assets/images/brand_logo.png': 'fallback.png', '../../../store/action/toastAction': {},
        '../../../shared/sharedMethod': { currencySymbolHandling: (_config, _symbol, price) => price, getFormattedMessage: text => text },
        '../../../constants': { toastType: {} }, '../card-skeleton/SkeletonCard': {},
        './PresentationSelectModal': () => null, './VariationSelectModal': () => null,
        '@fortawesome/react-fontawesome': {}, '@fortawesome/free-solid-svg-icons': {},
        '../../shared/catalogSelectors': selectors,
    }).default;
    const products = Array.from({ length: 20 }, (_, i) => {
        const p = product(i);
        Object.assign(p.attributes, { name: `Product ${i}`, code: `P${i}`, product_code: `P${i}`, images: { imageUrls: [`/${i}.png`] } });
        return p;
    });
    const templates = prepare(products);
    const props = { posAllProducts: products, cartProducts: [], customCart: templates, cartProductIds: [],
        settings: { attributes: {} }, posFetchProduct: id => clicks.push(id),
        updateCart: update => clicks.push(update([])) };
    const walk = element => {
        if (!React.isValidElement(element)) return [];
        return [element, ...React.Children.toArray(element.props.children).flatMap(walk)];
    };
    const preview = Product({ ...props, catalogPreview: true });
    walk(preview).find(element => element.props.className === 'product-custom-card').props.onClick();
    assert.equal(clicks.length, 0);
    const live = Product({ ...props, catalogPreview: false });
    walk(live).find(element => element.props.className === 'product-custom-card').props.onClick();
    assert.notStrictEqual(clicks[1][0], templates[0]);
    const markup = renderToStaticMarkup(live);
    assert.equal((markup.match(/loading="eager"/g) || []).length, 12);
    assert.equal((markup.match(/loading="lazy"/g) || []).length, 8);
    assert.match(markup, /content-visibility:auto/);
    assert.match(markup, /decoding="async"/);
});

test('cached preview also blocks scanner and presentation/variant confirmation paths', () => {
    for (const [file, component, handlers] of [
        ['frontend/components/product/Product.js', 'Product', ['addPresentationToCart', 'addVariationToCart']],
        ['frontend/components/product/ProductSearchbar.js', 'ProductSearchbar', ['onProductSearch', 'addPresentationLine']],
    ]) {
        const ast = babel.parseSync(fs.readFileSync(path.join(root, src, file), 'utf8'), {
            babelrc: false, configFile: false, parserOpts: { plugins: ['jsx'] },
        });
        const body = ast.program.body.find(node => node.type === 'VariableDeclaration'
            && node.declarations[0].id.name === component).declarations[0].init.body.body;
        const declarations = body.filter(node => node.type === 'VariableDeclaration'
            && handlers.includes(node.declarations[0].id.name));
        assert.equal(declarations.length, handlers.length);
        const { code } = babel.transformFromAstSync({ type: 'File', program: {
            type: 'Program', sourceType: 'script', body: declarations,
        } }, undefined, { babelrc: false, configFile: false });
        // No cart, network, or sound dependencies provided: they must not be touched.
        vm.runInNewContext(`${code}\n${handlers.map(name => `${name}({});`).join('\n')}`, { catalogPreview: true });
    }
});

const actionsFixture = () => {
    const requests = [], cacheReads = [], cacheWrites = [], published = [], statuses = [];
    let scope = 'user-1:store-1';
    const actions = load(src + 'store/action/pos/posAllProductAction.js', {
        '../../../constants': { posProductActionType: {}, productActionType: { FETCH_BRAND_CLICKABLE: 'products' }, toastType: {} },
        '../../../config/apiConfig': { get: url => {
            const pending = deferred(); requests.push({ url, ...pending }); return pending.promise;
        } },
        '../toastAction': { addToast: payload => ({ type: 'toast', payload }) },
        '../../../offline/catalogStorage': {
            ...storage, getOfflineScopeKey: () => scope,
            getLatestCatalogSnapshot: warehouse => {
                const pending = deferred(); cacheReads.push({ warehouse, ...pending }); return pending.promise;
            },
            saveOfflineSnapshot: async (_resource, payload, options) => {
                cacheWrites.push({ payload, ...options }); return { payload };
            },
            emitOfflineCatalogStatus: value => statuses.push(value), cacheCatalogImages: () => {},
        },
    }, { navigator: { onLine: true } });
    const dispatch = action => published.push(action);
    return { requests, cacheReads, cacheWrites, published, statuses,
        select: (options = {}, category = 7, warehouse = 1) => actions.fetchBrandClickable(2, category, warehouse, options)(dispatch),
        scope: value => { scope = value; },
    };
};

test('warm preview is filtered and readonly-status; network replaces it without awaiting cache persistence', async () => {
    const f = actionsFixture();
    const pending = f.select({ refreshCache: true, previewCache: true });
    assert.equal(f.requests.length, 1);
    assert.equal(f.cacheReads[0].warehouse, 1);
    f.cacheReads[0].resolve({ payload: [product('old'), product('other-category', 8)] });
    await tick();
    assert.equal(f.published[0].payload.length, 1);
    assert.equal(f.published[0].payload[0].id, 'old');
    assert(f.statuses.some(status => status.catalogPreview === true));
    f.requests[0].resolve({ data: { data: [product('fresh')] } });
    await pending;
    assert.equal(f.published.at(-1).payload[0].id, 'fresh');
    assert(f.statuses.some(status => status.catalogPreview === false));
});

test('slow local preview never replaces fresh data', async () => {
    const f = actionsFixture();
    const pending = f.select({ previewCache: true });
    f.requests[0].resolve({ data: { data: [product('fresh')] } }); await pending;
    f.cacheReads[0].resolve({ payload: [product('old')] }); await tick();
    assert.equal(f.published.length, 1);
    assert.equal(f.published[0].payload[0].id, 'fresh');
});

test('overlapping identical loads share one HTTP request and one offline write', async () => {
    const f = actionsFixture();
    const first = f.select({ refreshCache: true });
    const second = f.select({ refreshCache: true });
    assert.equal(f.requests.length, 1);
    f.requests[0].resolve({ data: { data: [product(1)] } }); await Promise.all([first, second]);
    assert.equal(f.published.length, 1);
    assert.equal(f.cacheWrites.length, 1);
});

test('loads are not shared across stores; old account results are not published or cached', async () => {
    const f = actionsFixture();
    const first = f.select({ refreshCache: true });
    f.scope('user-2:store-2');
    const second = f.select({ refreshCache: true });
    assert.equal(f.requests.length, 2);
    f.requests[0].resolve({ data: { data: [product('private-old')] } }); await first;
    assert.equal(f.published.length, 0); assert.equal(f.cacheWrites.length, 0);
    f.requests[1].resolve({ data: { data: [product('current')] } }); await second;
    assert.equal(f.published[0].payload[0].id, 'current');
});

test('authorization failure clears cached preview instead of enabling stale products', async () => {
    const f = actionsFixture();
    const pending = f.select({ previewCache: true });
    f.cacheReads[0].resolve({ payload: [product('old')] }); await tick();
    f.requests[0].reject({ response: { status: 403, data: { message: 'Forbidden' } } }); await pending;
    const catalogs = f.published.filter(action => action.type === 'products');
    assert.equal(catalogs.at(-1).payload.length, 0);
    assert.equal(f.statuses.at(-1).catalogPreview, false);
});

const workerFixture = () => {
    const listeners = {}, cache = new Set(), requested = [];
    let active = 0, peak = 0;
    const scope = {
        URL, Request, Promise, Set, Map,
        self: { location: { origin: 'https://pos.example.test' }, addEventListener: (name, listener) => { listeners[name] = listener; } },
        caches: { open: async () => ({ match: async request => cache.has(request.url), put: async request => cache.add(request.url) }) },
        fetch: async request => {
            requested.push(request.url); active++; peak = Math.max(peak, active);
            await tick(); active--;
            if (request.url.includes('broken')) throw Error('failed image');
            return { ok: true };
        },
    };
    vm.runInNewContext(fs.readFileSync(path.join(root, 'public/sw.js'), 'utf8'), scope);
    return { requested, cache, peak: () => peak,
        send: urls => { let pending; listeners.message({ data: { type: 'CACHE_CATALOG_ASSETS', urls }, waitUntil: promise => { pending = promise; } }); return pending; },
    };
};

test('image caching skips existing entries and limits even overlapping messages to four fetches', async () => {
    const f = workerFixture();
    const urls = Array.from({ length: 100 }, (_, i) => `https://pos.example.test/products/${i}.jpg`);
    f.cache.add(urls[0]);
    await Promise.all([f.send(urls), f.send(urls)]);
    assert.equal(f.requested.length, 99);
    assert(f.peak() <= 4);
});

test('one failed image does not stop caching; external and API URLs are ignored', async () => {
    const f = workerFixture();
    await f.send(['/broken.jpg', '/good.jpg', '/api/private', 'https://other.example/image.jpg']);
    assert.equal(f.requested.length, 2);
    assert(f.cache.has('https://pos.example.test/good.jpg'));
    await f.send(['/good.jpg', '/another.jpg']);
    assert.equal(f.requested.length, 3);
});
