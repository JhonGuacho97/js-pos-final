const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const babel = require('@babel/core');

// Execute the actual checkout functions, mocking only their dependencies.
// No HTTP requests, database access, or IndexedDB writes occur in this suite.
const source = fs.readFileSync(path.resolve(__dirname,
    '../../resources/pos/src/frontend/components/PosMainPage.js'), 'utf8');
const ast = babel.parseSync(source, {
    babelrc: false, configFile: false, parserOpts: { plugins: ['jsx'] },
});
const declarations = ast.program.body.filter(node => node.type === 'VariableDeclaration');
const main = declarations.find(node => node.declarations[0].id.name === 'PosMainPage');
const functionNames = [
    'finishCheckout', 'handlePaymentModalExited', 'saveLocalFirstCheckout',
    'processCashPayment', 'onCashPayment',
];
const nodes = [
    ...declarations.filter(node => ['getSaleAttributes', 'getCustomerAttributes', 'mergeReceiptWithSale']
        .includes(node.declarations[0].id.name)),
    ...main.declarations[0].init.body.body.filter(node => node.type === 'VariableDeclaration'
        && functionNames.includes(node.declarations[0].id.name)),
];
assert.equal(nodes.length, functionNames.length + 3);
const code = babel.transformFromAstSync({ type: 'File', program: {
    type: 'Program', sourceType: 'script', body: nodes,
} }, undefined, { babelrc: false, configFile: false }).code;

const deferred = () => {
    let resolve, reject;
    const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
    return { promise, resolve, reject };
};
const fixture = (options = {}) => {
    const events = [], actions = [], enqueued = [];
    const catalog = deferred(), background = deferred(), confirmation = deferred();
    const serverSale = { id: 42, attributes: {
        reference_code: 'SA_42', barcode_url: '/barcode/42.png',
        user_name: 'Cajero', customer: { name: 'Cliente', identification: '123' },
    } };
    const payload = { warehouse_id: 1, sale_items: [{ product_id: 7, quantity: 1 }], payments: [
        { payment_type: 1, amount: 5 },
        { payment_type: 2, amount: 10, reference: 'TR-123' },
    ] };
    const receipt = { products: [{ id: 7, quantity: 1, price: 15 }],
        payments: payload.payments, tax: 1.96, discount: 2, grand_total: 15 };
    const state = { paymentOpen: true, ticketOpen: false, processing: false, receipt: null };
    const scope = {
        Promise,
        enqueueOfflineSale: async (...args) => {
            events.push('persist'); enqueued.push(args);
            if (options.localFailure) throw new Error('local storage unavailable');
            return { clientUuid: args[0].client_uuid };
        },
        reserveOfflineCatalogStock: async () => {
            events.push('reserve'); return { payload: ['reserved'] };
        },
        catalogStatus: { online: options.online !== false },
        ensureOfflineSyncCredential: async () => ({ token: 'simulated' }),
        syncOfflineSales: async callbacks => {
            events.push('confirm-start');
            if (options.waitConfirmation) await confirmation.promise;
            if (!options.unconfirmed) {
                callbacks.onSynced(serverSale, { clientUuid: payload.client_uuid });
                events.push('confirmed');
            }
        },
        getOfflineSale: async () => null,
        requestOfflineSaleBackgroundSync: () => {
            events.push('background-start');
            if (options.throwBackground) throw new Error('service worker unavailable');
            return background.promise;
        },
        syncOfflineCatalog: () => {
            events.push('catalog-start');
            if (options.throwCatalog) throw new Error('catalog unavailable');
            return catalog.promise;
        },
        selectedCustomerOption: { label: 'Cliente' },
        dispatch: action => { actions.push(action); if (action.type === 'toast') events.push('toast'); },
        addToast: value => ({ type: 'toast', payload: value }),
        toastType: { WARNING: 'warning', ERROR: 'error' },
        posCashPaymentActionType: { POS_CASH_PAYMENT: 'sale' },
        productActionType: { FETCH_BRAND_CLICKABLE: 'catalog' },
        filterCatalogProducts: products => products,
        brandId: 2, categoryId: 3,
        setPaymentPrint: value => { state.receipt = value; events.push('receipt-ready'); },
        setUpdateProducts: () => events.push('clear-cart'),
        pendingReceiptRef: { current: false },
        setCheckoutStage: () => {},
        setCashPayment: value => { state.paymentOpen = value; events.push('close-payment'); },
        setModalShowPaymentSlip: value => { state.ticketOpen = value; events.push('open-ticket'); },
        setTipoComprobanteSri: () => {}, setCartItemValue: () => {},
        setCashPaymentValue: () => {}, resetPaymentRows: () => {},
        setCreditProfile: () => {}, setCreditSaleEnabled: () => {},
        setCreditTerms: () => {}, setCartProductIds: () => {},
        getFormattedMessage: value => value, dayjs: () => ({ format: () => '2026-10-10' }),
        handleValidation: () => options.valid !== false,
        prepareData: () => payload, preparePrintData: () => receipt,
        updateProducts: receipt.products, tipoComprobanteSri: '',
        createClientUuid: () => 'test-sale-uuid',
        checkoutProcessingRef: { current: false },
        setCheckoutProcessing: value => { state.processing = value; },
    };
    vm.createContext(scope);
    vm.runInContext(`${code}\nthis.submit = onCashPayment; this.exited = handlePaymentModalExited;`, scope);
    return { scope, events, actions, state, payload, receipt, enqueued, catalog, background, confirmation,
        submit: () => scope.submit({ preventDefault() {} }) };
};

test('confirmed checkout closes without waiting for catalog or background sync; ticket waits for exit',
    { timeout: 1500 }, async () => {
        const f = fixture();
        await f.submit(); // Both auxiliary requests deliberately remain unresolved.
        assert.equal(f.state.processing, false);
        assert.equal(f.state.paymentOpen, false);
        assert.equal(f.state.ticketOpen, false);
        assert.equal(f.scope.pendingReceiptRef.current, true);
        assert(f.events.includes('catalog-start'));
        assert(f.events.includes('background-start'));
        assert(f.events.indexOf('confirmed') < f.events.indexOf('receipt-ready'));
        assert(f.events.indexOf('receipt-ready') < f.events.indexOf('close-payment'));
        f.scope.exited();
        assert.equal(f.state.ticketOpen, true);
        f.scope.exited();
        assert.equal(f.events.filter(event => event === 'open-ticket').length, 1);
        assert.equal(f.state.receipt.reference_code, 'SA_42');
        assert.equal(f.state.receipt.barcode_url, '/barcode/42.png');
        assert.strictEqual(f.state.receipt.payments, f.payload.payments);
        assert.equal(f.state.receipt.tax, 1.96);
        assert.equal(f.state.receipt.discount, 2);
        assert.equal(f.state.receipt.grand_total, 15);
    });

test('slow confirmation keeps payment locked and ignores repeated clicks', { timeout: 1500 }, async () => {
    const f = fixture({ waitConfirmation: true });
    const pending = f.submit();
    await new Promise(resolve => setImmediate(resolve));
    assert(f.events.includes('confirm-start'));
    assert.equal(f.state.processing, true);
    assert.equal(f.state.paymentOpen, true);
    assert.equal(f.scope.pendingReceiptRef.current, false);
    f.scope.exited();
    assert.equal(f.state.ticketOpen, false);
    await f.submit();
    assert.equal(f.enqueued.length, 1);
    f.confirmation.resolve();
    await pending;
    assert.equal(f.state.paymentOpen, false);
    assert.equal(f.enqueued.length, 1);
});

test('failed auxiliary requests do not report a confirmed sale as failed', { timeout: 1500 }, async () => {
    const f = fixture();
    await f.submit();
    f.catalog.reject(new Error('catalog network error'));
    f.background.reject(new Error('sync registration failed'));
    await new Promise(resolve => setImmediate(resolve));
    f.scope.exited();
    assert.equal(f.state.ticketOpen, true);
    assert.equal(f.actions.filter(action => action.type === 'toast'
        && action.payload.type === 'error').length, 0);
    assert.equal(f.enqueued.length, 1);
});

test('synchronous auxiliary errors are isolated from the confirmed checkout', { timeout: 1500 }, async () => {
    const f = fixture({ throwBackground: true, throwCatalog: true });
    await f.submit();
    f.scope.exited();
    assert.equal(f.state.ticketOpen, true);
    assert.equal(f.actions.filter(action => action.type === 'toast' && action.payload.type === 'error').length, 0);
});

for (const options of [{ online: false }, { unconfirmed: true }]) {
    test(`protected but unconfirmed sale remains provisional (${JSON.stringify(options)})`,
        { timeout: 1500 }, async () => {
            const f = fixture(options);
            await f.submit();
            assert.equal(f.state.receipt.offline_pending, true);
            assert.match(f.state.receipt.reference_code, /^OFF-/);
            assert(!f.events.includes('catalog-start')); // Never replace reserved stock before confirmation.
            assert(f.events.includes('reserve'));
            assert(f.events.includes('background-start'));
            assert.equal(f.state.ticketOpen, false);
            f.scope.exited();
            assert.equal(f.state.ticketOpen, true);
        });
}

test('local persistence failure preserves the cart and does not show a ticket', { timeout: 1500 }, async () => {
    const f = fixture({ localFailure: true });
    await f.submit();
    f.scope.exited();
    assert.equal(f.state.paymentOpen, true);
    assert.equal(f.state.processing, false);
    assert.equal(f.state.ticketOpen, false);
    assert(!f.events.includes('clear-cart'));
    assert(!f.events.includes('confirm-start'));
    assert(!f.events.includes('background-start'));
});

test('invalid payment does not enqueue or close checkout', async () => {
    const f = fixture({ valid: false });
    await f.submit();
    assert.equal(f.enqueued.length, 0);
    assert.equal(f.state.paymentOpen, true);
    assert.equal(f.state.processing, false);
});
