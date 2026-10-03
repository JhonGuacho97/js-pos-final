// Smoke tests de renderizado y contrato CSS. No reemplazan una revisión visual.
// Ejecutar: node --test tests/OnboardingStyles.test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const { test } = require('node:test');
const root = path.resolve(__dirname, '..');
const requireApp = Module.createRequire(path.join(root, 'package.json'));
const babel = requireApp('@babel/core');
const React = requireApp('react');
const { renderToStaticMarkup } = requireApp('react-dom/server');
const { Provider } = requireApp('react-redux');
const { createStore } = requireApp('redux');
const { StaticRouter } = requireApp('react-router-dom/server');
const originalLoader = Module._extensions['.js'];
Module._extensions['.js'] = (module, filename) => {
    if (!filename.replace(/\\/g, '/').startsWith(root.replace(/\\/g, '/') + '/resources/pos/')) {
        return originalLoader(module, filename);
    }
    const code = babel.transformSync(fs.readFileSync(filename, 'utf8'), {
        filename, babelrc: false, configFile: false,
        presets: [[requireApp.resolve('@babel/preset-env'), { targets: { node: 'current' } }],
            [requireApp.resolve('@babel/preset-react'), { runtime: 'automatic' }]],
    }).code;
    const originalRequire = module.require.bind(module);
    module.require = (name) => {
        if (name === 'react' && filename.endsWith('Onboarding.js')) {
            return { ...React, default: React, __esModule: true, useState: (...args) => React.useState(...args) };
        }
        // El renderizado no debe cargar un cliente HTTP ni enviar credenciales.
        if (name === '../../config/apiConfig') return { default: {}, __esModule: true };
        if (name === '../../store/action/authAction') return { loginAction: () => { throw new Error('No debe iniciar sesión en un smoke test'); } };
        return originalRequire(name);
    };
    return module._compile(code, filename);
};
const Onboarding = requireApp('./resources/pos/src/components/auth/Onboarding').default;
const { onboardingStyles } = requireApp('./resources/pos/src/components/auth/styles/LoginStyles');

const render = () => renderToStaticMarkup(React.createElement(Provider, {
    store: createStore(() => ({ frontSetting: {} })),
}, React.createElement(StaticRouter, { location: '/crear-cuenta' }, React.createElement(Onboarding))));

test('registro usa el mismo layout y campos del acceso, sin clases antiguas', () => {
    const markup = render();
    assert.match(markup, /class="auth-shell auth-shell--onboarding"/);
    assert.match(markup, /class="auth-story"/);
    assert.match(markup, /class="auth-card"/);
    assert.match(markup, /class="auth-input-wrap auth-input-wrap--plain"/);
    assert.match(markup, /Continuar con mi cuenta/);
    assert.match(markup, /aria-current="step"/);
    assert.match(markup, /name="organization_name"/);
    assert.equal((markup.match(/<form\b/g) || []).length, 1);
    assert.doesNotMatch(markup, /class="[^"]*\blp-/);
});

test('segundo paso mantiene formulario, credenciales y controles accesibles', () => {
    const originalState = React.useState;
    try {
        React.useState = (initial) => originalState(initial === 1 ? 2 : (
            initial && Object.hasOwn(initial, 'organization_name')
                ? { ...initial, organization_name: 'Empresa de prueba', city: 'Manta' }
                : initial
        ));
        const markup = render();
        assert.match(markup, /Crea tu cuenta propietaria/);
        assert.match(markup, /Empresa de prueba/);
        assert.match(markup, /name="email"/);
        assert.match(markup, /type="tel"/);
        assert.match(markup, /name="password_confirmation"/);
        assert.match(markup, /autoComplete="new-password"/);
        assert.match(markup, /aria-label="Mostrar contraseña"/);
        assert.match(markup, /name="terms"/);
        assert.match(markup, /Crear mi cuenta/);
        assert.equal((markup.match(/<form\b/g) || []).length, 1);
        assert.doesNotMatch(markup, /class="[^"]*\blp-/);
    } finally {
        React.useState = originalState;
    }
});

test('estilos de onboarding tienen variables válidas y ajustes de móvil', () => {
    assert.doesNotThrow(() => requireApp('postcss').parse(onboardingStyles));
    assert.doesNotMatch(onboardingStyles, /var\(--lp-/);
    const defined = new Set([...onboardingStyles.matchAll(/(--auth-[\w-]+)\s*:/g)].map((match) => match[1]));
    for (const match of onboardingStyles.matchAll(/var\((--auth-[\w-]+)\)/g)) assert.ok(defined.has(match[1]), match[1]);
    assert.match(onboardingStyles, /\.auth-shell--onboarding \.auth-card/);
    assert.match(onboardingStyles, /\.auth-input-wrap--plain input/);
    assert.match(onboardingStyles, /@media \(max-width:560px\)/);
    assert.match(onboardingStyles, /\.ob-form-grid \{ grid-template-columns:1fr; \}/);
});
