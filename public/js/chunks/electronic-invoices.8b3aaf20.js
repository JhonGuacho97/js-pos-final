"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["electronic-invoices"],{

/***/ "./node_modules/@restart/hooks/esm/useBreakpoint.js"
/*!**********************************************************!*\
  !*** ./node_modules/@restart/hooks/esm/useBreakpoint.js ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createBreakpointHook: () => (/* binding */ createBreakpointHook),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _useMediaQuery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./useMediaQuery */ "./node_modules/@restart/hooks/esm/useMediaQuery.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");


/**
 * Create a responsive hook we a set of breakpoint names and widths.
 * You can use any valid css units as well as a numbers (for pixels).
 *
 * **NOTE:** The object key order is important! it's assumed to be in order from smallest to largest
 *
 * ```ts
 * const useBreakpoint = createBreakpointHook({
 *  xs: 0,
 *  sm: 576,
 *  md: 768,
 *  lg: 992,
 *  xl: 1200,
 * })
 * ```
 *
 * **Watch out!** using string values will sometimes construct media queries using css `calc()` which
 * is NOT supported in media queries by all browsers at the moment. use numbers for
 * the widest range of browser support.
 *
 * @param breakpointValues A object hash of names to breakpoint dimensions
 */
function createBreakpointHook(breakpointValues) {
  const names = Object.keys(breakpointValues);
  function and(query, next) {
    if (query === next) {
      return next;
    }
    return query ? `${query} and ${next}` : next;
  }
  function getNext(breakpoint) {
    return names[Math.min(names.indexOf(breakpoint) + 1, names.length - 1)];
  }
  function getMaxQuery(breakpoint) {
    const next = getNext(breakpoint);
    let value = breakpointValues[next];
    if (typeof value === 'number') value = `${value - 0.2}px`;else value = `calc(${value} - 0.2px)`;
    return `(max-width: ${value})`;
  }
  function getMinQuery(breakpoint) {
    let value = breakpointValues[breakpoint];
    if (typeof value === 'number') {
      value = `${value}px`;
    }
    return `(min-width: ${value})`;
  }

  /**
   * Match a set of breakpoints
   *
   * ```tsx
   * const MidSizeOnly = () => {
   *   const isMid = useBreakpoint({ lg: 'down', sm: 'up' });
   *
   *   if (isMid) return <div>On a Reasonable sized Screen!</div>
   *   return null;
   * }
   * ```
   * @param breakpointMap An object map of breakpoints and directions, queries are constructed using "and" to join
   * breakpoints together
   * @param window Optionally specify the target window to match against (useful when rendering into iframes)
   */

  /**
   * Match a single breakpoint exactly, up, or down.
   *
   * ```tsx
   * const PhoneOnly = () => {
   *   const isSmall = useBreakpoint('sm', 'down');
   *
   *   if (isSmall) return <div>On a Small Screen!</div>
   *   return null;
   * }
   * ```
   *
   * @param breakpoint The breakpoint key
   * @param direction A direction 'up' for a max, 'down' for min, true to match only the breakpoint
   * @param window Optionally specify the target window to match against (useful when rendering into iframes)
   */

  function useBreakpoint(breakpointOrMap, direction, window) {
    let breakpointMap;
    if (typeof breakpointOrMap === 'object') {
      breakpointMap = breakpointOrMap;
      window = direction;
      direction = true;
    } else {
      direction = direction || true;
      breakpointMap = {
        [breakpointOrMap]: direction
      };
    }
    let query = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => Object.entries(breakpointMap).reduce((query, [key, direction]) => {
      if (direction === 'up' || direction === true) {
        query = and(query, getMinQuery(key));
      }
      if (direction === 'down' || direction === true) {
        query = and(query, getMaxQuery(key));
      }
      return query;
    }, ''), [JSON.stringify(breakpointMap)]);
    return (0,_useMediaQuery__WEBPACK_IMPORTED_MODULE_0__["default"])(query, window);
  }
  return useBreakpoint;
}
const useBreakpoint = createBreakpointHook({
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useBreakpoint);

/***/ },

/***/ "./node_modules/@restart/hooks/esm/useMediaQuery.js"
/*!**********************************************************!*\
  !*** ./node_modules/@restart/hooks/esm/useMediaQuery.js ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useMediaQuery)
/* harmony export */ });
/* harmony import */ var _useIsomorphicEffect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./useIsomorphicEffect */ "./node_modules/@restart/hooks/esm/useIsomorphicEffect.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");


const matchersByWindow = new WeakMap();
const getMatcher = (query, targetWindow) => {
  if (!query || !targetWindow) return undefined;
  const matchers = matchersByWindow.get(targetWindow) || new Map();
  matchersByWindow.set(targetWindow, matchers);
  let mql = matchers.get(query);
  if (!mql) {
    mql = targetWindow.matchMedia(query);
    mql.refCount = 0;
    matchers.set(mql.media, mql);
  }
  return mql;
};
/**
 * Match a media query and get updates as the match changes. The media string is
 * passed directly to `window.matchMedia` and run as a Layout Effect, so initial
 * matches are returned before the browser has a chance to paint.
 *
 * ```tsx
 * function Page() {
 *   const isWide = useMediaQuery('min-width: 1000px')
 *
 *   return isWide ? "very wide" : 'not so wide'
 * }
 * ```
 *
 * Media query lists are also reused globally, hook calls for the same query
 * will only create a matcher once under the hood.
 *
 * @param query A media query
 * @param targetWindow The window to match against, uses the globally available one as a default.
 */
function useMediaQuery(query, targetWindow = typeof window === 'undefined' ? undefined : window) {
  const mql = getMatcher(query, targetWindow);
  const [matches, setMatches] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(() => mql ? mql.matches : false);
  (0,_useIsomorphicEffect__WEBPACK_IMPORTED_MODULE_0__["default"])(() => {
    let mql = getMatcher(query, targetWindow);
    if (!mql) {
      return setMatches(false);
    }
    let matchers = matchersByWindow.get(targetWindow);
    const handleChange = () => {
      setMatches(mql.matches);
    };
    mql.refCount++;
    mql.addListener(handleChange);
    handleChange();
    return () => {
      mql.removeListener(handleChange);
      mql.refCount--;
      if (mql.refCount <= 0) {
        matchers == null ? void 0 : matchers.delete(mql.media);
      }
      mql = undefined;
    };
  }, [query]);
  return matches;
}

/***/ },

/***/ "./resources/pos/src/components/electronicInvoices/ElectronicInvoices.js"
/*!*******************************************************************************!*\
  !*** ./resources/pos/src/components/electronicInvoices/ElectronicInvoices.js ***!
  \*******************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "./node_modules/@fortawesome/react-fontawesome/index.es.js");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.mjs");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _header_HeaderTitle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../header/HeaderTitle */ "./resources/pos/src/components/header/HeaderTitle.js");
/* harmony import */ var _config_apiConfig__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../config/apiConfig */ "./resources/pos/src/config/apiConfig.js");
/* harmony import */ var _store_action_toastAction__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../store/action/toastAction */ "./resources/pos/src/store/action/toastAction.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _sri_ElectronicInvoiceStatus__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../sri/ElectronicInvoiceStatus */ "./resources/pos/src/components/sri/ElectronicInvoiceStatus.js");
/* harmony import */ var _sri_RutaEmisionPanel__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../sri/RutaEmisionPanel */ "./resources/pos/src/components/sri/RutaEmisionPanel.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }












var ESTADOS_SRI = [{
  value: "TODOS",
  label: "Todos"
}, {
  value: "PENDIENTE",
  label: "Pendiente"
}, {
  value: "RECIBIDA",
  label: "Enviada, esperando autorización"
}, {
  value: "AUTORIZADA",
  label: "Autorizada"
}, {
  value: "NO_AUTORIZADA",
  label: "Rechazada"
}, {
  value: "DEVUELTA",
  label: "Devuelta por el SRI"
}, {
  value: "ERROR_TEMPORAL_SRI",
  label: "Error temporal del SRI"
}];
var TIPOS_COMPROBANTE = [{
  value: "TODOS",
  label: "Todos"
}, {
  value: "01",
  label: "Factura"
}, {
  value: "05",
  label: "Nota de débito"
}];
var hoy = function hoy() {
  return new Date().toISOString().slice(0, 10);
};
var inicioDeMes = function inicioDeMes() {
  var d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
};
var ElectronicInvoices = function ElectronicInvoices() {
  var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useDispatch)();
  var filtrosPorDefecto = {
    fecha_desde: inicioDeMes(),
    fecha_hasta: hoy(),
    tipo_comprobante: "TODOS",
    estado: "TODOS"
  };

  // "filtros" es lo que el usuario va tocando en fecha/tipo/estado
  // (borrador). "filtrosAplicados" es lo que realmente se usa para
  // buscar -- solo se actualiza al hacer clic en "Buscar", así esos
  // campos no disparan una búsqueda con cada cambio.
  //
  // El texto de búsqueda es aparte: SÍ busca en vivo (con un pequeño
  // debounce), sin necesidad del botón.
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(filtrosPorDefecto),
    _useState2 = _slicedToArray(_useState, 2),
    filtros = _useState2[0],
    setFiltros = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(filtrosPorDefecto),
    _useState4 = _slicedToArray(_useState3, 2),
    filtrosAplicados = _useState4[0],
    setFiltrosAplicados = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(""),
    _useState6 = _slicedToArray(_useState5, 2),
    search = _useState6[0],
    setSearch = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState8 = _slicedToArray(_useState7, 2),
    documentos = _useState8[0],
    setDocumentos = _useState8[1];
  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      no_autorizados: 0,
      saldo_total: 0
    }),
    _useState0 = _slicedToArray(_useState9, 2),
    resumen = _useState0[0],
    setResumen = _useState0[1];
  var _useState1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState10 = _slicedToArray(_useState1, 2),
    rutaAbiertaId = _useState10[0],
    setRutaAbiertaId = _useState10[1];
  var _useState11 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      current_page: 1,
      last_page: 1,
      total: 0
    }),
    _useState12 = _slicedToArray(_useState11, 2),
    meta = _useState12[0],
    setMeta = _useState12[1];
  var _useState13 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState14 = _slicedToArray(_useState13, 2),
    loading = _useState14[0],
    setLoading = _useState14[1];
  var _useState15 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(10),
    _useState16 = _slicedToArray(_useState15, 2),
    pageSize = _useState16[0],
    setPageSize = _useState16[1];
  var cargar = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var overrides = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    setLoading(true);
    var params = _objectSpread(_objectSpread(_objectSpread({}, filtrosAplicados), {}, {
      search: search,
      per_page: pageSize
    }, overrides), {}, {
      page: page
    });
    // "TODOS" es solo un valor de UI -- no se manda como filtro real.
    if (params.tipo_comprobante === "TODOS") delete params.tipo_comprobante;
    if (params.estado === "TODOS") delete params.estado;
    if (!params.search) delete params.search;
    _config_apiConfig__WEBPACK_IMPORTED_MODULE_6__["default"].get("/electronic-invoices", {
      params: params
    }).then(function (res) {
      setDocumentos(res.data.data.data || []);
      setResumen(res.data.resumen || {
        no_autorizados: 0,
        saldo_total: 0
      });
      setMeta({
        current_page: res.data.data.current_page,
        last_page: res.data.data.last_page,
        total: res.data.data.total
      });
    })["catch"](function (err) {
      var _err$response;
      dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_7__.addToast)({
        text: ((_err$response = err.response) === null || _err$response === void 0 || (_err$response = _err$response.data) === null || _err$response === void 0 ? void 0 : _err$response.message) || "Error al cargar los documentos electrónicos",
        type: "error"
      }));
    })["finally"](function () {
      return setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtrosAplicados, search, pageSize]);

  // Carga inicial, una sola vez.
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    cargar(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Búsqueda en vivo del texto (con debounce) -- no dispara en el
  // primer render, solo cuando el usuario efectivamente escribe algo.
  var primerRender = react__WEBPACK_IMPORTED_MODULE_0__.useRef(true);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (primerRender.current) {
      primerRender.current = false;
      return;
    }
    var timer = setTimeout(function () {
      cargar(1, {
        search: search
      });
    }, 400);
    return function () {
      return clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);
  var onFiltroChange = function onFiltroChange(e) {
    var _e$target = e.target,
      name = _e$target.name,
      value = _e$target.value;
    setFiltros(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, name, value));
    });
  };
  var onBuscar = function onBuscar(e) {
    e.preventDefault();
    setFiltrosAplicados(filtros);
    cargar(1, _objectSpread(_objectSpread({}, filtros), {}, {
      search: search
    }));
  };
  var reintentar = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(saleId) {
      var _err$response2, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            _context.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_6__["default"].post("/sales/".concat(saleId, "/electronic-invoice/reintentar"));
          case 1:
            dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_7__.addToast)({
              text: "Reintentando la emisión de la factura electrónica."
            }));
            cargar(meta.current_page);
            _context.n = 3;
            break;
          case 2:
            _context.p = 2;
            _t = _context.v;
            dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_7__.addToast)({
              text: ((_err$response2 = _t.response) === null || _err$response2 === void 0 || (_err$response2 = _err$response2.data) === null || _err$response2 === void 0 ? void 0 : _err$response2.message) || "Error al reintentar la factura.",
              type: "error"
            }));
          case 3:
            return _context.a(2);
        }
      }, _callee, null, [[0, 2]]);
    }));
    return function reintentar(_x) {
      return _ref.apply(this, arguments);
    };
  }();
  var money = function money(n) {
    return "$ ".concat(Number(n || 0).toFixed(2));
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_4__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_header_HeaderTitle__WEBPACK_IMPORTED_MODULE_5__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)("electronic-invoices.title"),
      to: "/app/dashboard"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("form", {
      className: "card mb-4",
      onSubmit: onBuscar,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
        className: "card-body",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
          className: "row g-3 align-items-end",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
            className: "col-md-2",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("label", {
              className: "form-label",
              children: "Fecha inicio:"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("input", {
              type: "date",
              name: "fecha_desde",
              className: "form-control",
              value: filtros.fecha_desde,
              onChange: onFiltroChange
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
            className: "col-md-2",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("label", {
              className: "form-label",
              children: "Fecha fin:"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("input", {
              type: "date",
              name: "fecha_hasta",
              className: "form-control",
              value: filtros.fecha_hasta,
              onChange: onFiltroChange
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
            className: "col-md-3",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("label", {
              className: "form-label",
              children: "Tipo comprobante:"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("select", {
              name: "tipo_comprobante",
              className: "form-select",
              value: filtros.tipo_comprobante,
              onChange: onFiltroChange,
              children: TIPOS_COMPROBANTE.map(function (t) {
                return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("option", {
                  value: t.value,
                  children: t.label
                }, t.value);
              })
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
            className: "col-md-3",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("label", {
              className: "form-label",
              children: "Estado SRI:"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("select", {
              name: "estado",
              className: "form-select",
              value: filtros.estado,
              onChange: onFiltroChange,
              children: ESTADOS_SRI.map(function (e) {
                return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("option", {
                  value: e.value,
                  children: e.label
                }, e.value);
              })
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
            className: "col-md-2",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("button", {
              type: "submit",
              className: "btn btn-primary w-100",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_2__.FontAwesomeIcon, {
                icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.faMagnifyingGlass,
                className: "me-2"
              }), "Buscar"]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
            className: "col-md-6",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("label", {
              className: "form-label",
              children: "Cliente / n\xFAmero de documento / referencia / clave de acceso:"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("input", {
              type: "text",
              name: "search",
              className: "form-control",
              placeholder: "Buscar por cliente, n\xFAmero de documento, n\xFAmero de venta o clave de acceso",
              value: search,
              onChange: function onChange(e) {
                return setSearch(e.target.value);
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
              className: "form-text",
              children: "Este campo filtra autom\xE1ticamente mientras escribes."
            })]
          })]
        })
      })
    }), resumen.no_autorizados > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
      className: "alert alert-danger d-flex align-items-center",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_2__.FontAwesomeIcon, {
        icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.faTriangleExclamation,
        className: "me-2"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("span", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("strong", {
          children: "Atenci\xF3n:"
        }), " tienes ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("strong", {
          children: resumen.no_autorizados
        }), " documento", resumen.no_autorizados === 1 ? "" : "s", " sin autorizar por el SRI (pendientes, rechazados o devueltos). Rev\xEDsalos y reintenta los que correspondan."]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
      className: "card mb-4",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
        className: "card-body d-flex align-items-center justify-content-between",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
            className: "text-muted small",
            children: "Saldo pendiente de cobro (ventas con factura electr\xF3nica)"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
            className: "fs-3 fw-bold text-success",
            children: money(resumen.saldo_total)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
          className: "d-flex align-items-center gap-2",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
            className: "fw-bold",
            children: "Mostrar:"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("select", {
            className: "form-select",
            style: {
              width: 80
            },
            value: pageSize,
            onChange: function onChange(e) {
              var nuevoTamano = Number(e.target.value);
              setPageSize(nuevoTamano);
              cargar(1, {
                search: search,
                per_page: nuevoTamano
              });
            },
            children: [5, 10, 25, 50].map(function (n) {
              return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("option", {
                value: n,
                children: n
              }, n);
            })
          })]
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
      className: "card",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
        className: "table-responsive",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("table", {
          className: "table align-middle mb-0",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("thead", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("tr", {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
                children: "Fecha"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
                children: "N\xB0 Documento"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
                children: "Tipo"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
                children: "Cliente"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
                children: "Estado"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
                children: "Firmado"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
                className: "text-end",
                children: "Total"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
                className: "text-end",
                children: "Saldo"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
                children: "Acciones"
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("tbody", {
            children: [loading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("tr", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("td", {
                colSpan: 9,
                className: "text-center py-4",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
                  className: "spinner-border spinner-border-sm me-2"
                }), "Cargando..."]
              })
            }), !loading && documentos.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("tr", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
                colSpan: 9,
                className: "text-center py-4 text-muted",
                children: "No se encontraron documentos electr\xF3nicos con estos filtros."
              })
            }), !loading && documentos.map(function (doc) {
              return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("tr", {
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
                  children: doc.fecha ? doc.fecha.slice(0, 16).replace("T", " ") : "-"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
                    type: "button",
                    className: "btn btn-link p-0",
                    style: {
                      fontSize: "inherit",
                      textDecoration: "none"
                    },
                    onClick: function onClick() {
                      return setRutaAbiertaId(doc.id);
                    },
                    children: doc.numero_comprobante
                  })
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
                  children: doc.tipo_comprobante === "05" ? "Nota de débito" : "Factura"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
                  children: doc.cliente || "Consumidor Final"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
                  style: {
                    minWidth: 140
                  },
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_sri_ElectronicInvoiceStatus__WEBPACK_IMPORTED_MODULE_9__.ElectronicInvoiceStatusBadge, {
                    estado: doc.estado,
                    data: doc,
                    onReintentar: function onReintentar() {
                      return reintentar(doc.sale_id);
                    }
                  })
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
                  children: doc.firmado ? "Sí" : "No"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
                  className: "text-end",
                  children: money(doc.total)
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
                  className: "text-end",
                  children: money(doc.saldo)
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
                  children: doc.estado === "AUTORIZADA" && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("a", {
                    href: "/api/electronic-invoices/".concat(doc.id, "/ride"),
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "btn btn-sm btn-outline-success",
                    title: "Descargar RIDE",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_2__.FontAwesomeIcon, {
                      icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.faFileInvoice
                    })
                  })
                })]
              }, doc.id);
            })]
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
        className: "card-footer d-flex justify-content-between align-items-center",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
            className: "btn btn-light me-2",
            disabled: meta.current_page <= 1,
            onClick: function onClick() {
              return cargar(meta.current_page - 1);
            },
            children: "\u2039 Anterior"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
            className: "btn btn-light",
            disabled: meta.current_page >= meta.last_page,
            onClick: function onClick() {
              return cargar(meta.current_page + 1);
            },
            children: "Siguiente \u203A"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("span", {
          className: "text-primary fw-bold",
          children: ["Total registros: ", meta.total]
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_sri_RutaEmisionPanel__WEBPACK_IMPORTED_MODULE_10__["default"], {
      electronicInvoiceId: rutaAbiertaId,
      show: Boolean(rutaAbiertaId),
      onHide: function onHide() {
        return setRutaAbiertaId(null);
      },
      onReintentar: function onReintentar() {
        var doc = documentos.find(function (d) {
          return d.id === rutaAbiertaId;
        });
        if (doc) reintentar(doc.sale_id);
      }
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ElectronicInvoices);

/***/ },

/***/ "./resources/pos/src/components/header/HeaderTitle.js"
/*!************************************************************!*\
  !*** ./resources/pos/src/components/header/HeaderTitle.js ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");




var HeaderTitle = function HeaderTitle(props) {
  var title = props.title,
    to = props.to,
    editLink = props.editLink;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: "d-md-flex align-items-center justify-content-between mb-5",
    children: [title ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h1", {
      className: "mb-0",
      children: title
    }) : '', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "text-end mt-4 mt-md-0",
      children: [editLink ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Link, {
        to: editLink,
        className: "btn btn-outline-primary me-2",
        children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)('globally.edit-btn')
      }) : null, to ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Link, {
        to: to,
        className: "btn btn-outline-primary",
        children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)('globally.back-btn')
      }) : null]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HeaderTitle);

/***/ },

/***/ "./resources/pos/src/components/sri/ElectronicInvoiceStatus.js"
/*!*********************************************************************!*\
  !*** ./resources/pos/src/components/sri/ElectronicInvoiceStatus.js ***!
  \*********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ElectronicInvoiceStatusBadge: () => (/* binding */ ElectronicInvoiceStatusBadge)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Modal.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }



var ESTADO_CONFIG = {
  PENDIENTE: {
    color: "#f0ad4e",
    texto: "Generando...",
    icono: "⏳"
  },
  RECIBIDA: {
    color: "#5bc0de",
    texto: "Esperando SRI",
    icono: "📤"
  },
  AUTORIZADA: {
    color: "#28a745",
    texto: "Autorizada",
    icono: "✅"
  },
  NO_AUTORIZADA: {
    color: "#dc3545",
    texto: "Rechazada",
    icono: "❌"
  },
  DEVUELTA: {
    color: "#dc3545",
    texto: "Devuelta por el SRI",
    icono: "⚠️"
  },
  // Color y texto propios a propósito -- esto NO es un rechazo del
  // comprobante, es el propio servidor del SRI fallando. El usuario
  // no debería pensar que su factura está mal.
  ERROR_TEMPORAL_SRI: {
    color: "#fd7e14",
    texto: "Error del SRI",
    icono: "🔧"
  }
};
var ESTADO_TITULO = {
  NO_AUTORIZADA: "Rechazada por el SRI",
  DEVUELTA: "Devuelta por el SRI",
  ERROR_TEMPORAL_SRI: "Error temporal del SRI (no de tu factura)"
};
var ElectronicInvoiceStatusBadge = function ElectronicInvoiceStatusBadge(_ref) {
  var _data$mensajes;
  var estado = _ref.estado,
    data = _ref.data,
    error = _ref.error,
    onReintentar = _ref.onReintentar;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    showModal = _useState2[0],
    setShowModal = _useState2[1];
  if (error) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "alert alert-danger d-flex align-items-center mt-2 mb-0 py-2",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("span", {
        children: ["\u26A0\uFE0F ", error]
      })
    });
  }
  if (!estado) return null;
  var config = ESTADO_CONFIG[estado] || ESTADO_CONFIG.PENDIENTE;
  var esFinal = estado === "AUTORIZADA" || estado === "NO_AUTORIZADA" || estado === "DEVUELTA" || estado === "ERROR_TEMPORAL_SRI";
  var puedeReintentar = (estado === "NO_AUTORIZADA" || estado === "DEVUELTA" || estado === "ERROR_TEMPORAL_SRI") && (data === null || data === void 0 ? void 0 : data.puede_reintentar);
  var primerMensaje = data === null || data === void 0 || (_data$mensajes = data.mensajes) === null || _data$mensajes === void 0 ? void 0 : _data$mensajes[0];
  var textoError = primerMensaje ? [primerMensaje.mensaje, primerMensaje.informacionAdicional].filter(Boolean).join(": ") : "";

  // Solo tiene sentido abrir el modal si hay algo más que mostrar
  // que el propio texto de la insignia (un error, o la posibilidad
  // de reintentar) -- para AUTORIZADA/PENDIENTE/RECIBIDA no hace
  // falta, no hay nada más que decir.
  var tieneDetalle = Boolean(textoError) || puedeReintentar;
  var handleReintentar = function handleReintentar() {
    setShowModal(false);
    onReintentar === null || onReintentar === void 0 || onReintentar();
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("span", {
      onClick: function onClick() {
        return tieneDetalle && setShowModal(true);
      },
      title: tieneDetalle ? "Ver detalle" : undefined,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.25rem 0.65rem",
        borderRadius: "999px",
        backgroundColor: "".concat(config.color, "15"),
        border: "1px solid ".concat(config.color, "40"),
        color: config.color,
        fontWeight: 500,
        fontSize: "0.75rem",
        whiteSpace: "nowrap",
        cursor: tieneDetalle ? "pointer" : "default"
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
        children: config.icono
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
        children: config.texto
      }), !esFinal && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
        className: "spinner-border spinner-border-sm",
        style: {
          color: config.color,
          width: "0.7rem",
          height: "0.7rem"
        }
      }), tieneDetalle && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
        style: {
          fontSize: "0.65rem",
          opacity: 0.7
        },
        children: "\u24D8"
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"], {
      show: showModal,
      onHide: function onHide() {
        return setShowModal(false);
      },
      centered: true,
      size: "sm",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Header, {
        closeButton: true,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Title, {
          style: {
            fontSize: "1rem"
          },
          children: [config.icono, " ", ESTADO_TITULO[estado] || config.texto]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Body, {
        children: [estado === "ERROR_TEMPORAL_SRI" && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
          className: "small text-muted",
          children: "Esto es un problema del servidor del SRI en s\xED, no de tu comprobante. Se puede reintentar sin ning\xFAn riesgo."
        }), textoError && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
          className: "small mb-0",
          style: {
            wordBreak: "break-word"
          },
          children: textoError
        })]
      }), puedeReintentar && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Footer, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
          type: "button",
          className: "btn btn-sm btn-outline-danger",
          onClick: handleReintentar,
          children: "Reintentar"
        })
      })]
    })]
  });
};

/***/ },

/***/ "./resources/pos/src/components/sri/RutaEmisionPanel.js"
/*!**************************************************************!*\
  !*** ./resources/pos/src/components/sri/RutaEmisionPanel.js ***!
  \**************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Offcanvas.js");
/* harmony import */ var _config_apiConfig__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config/apiConfig */ "./resources/pos/src/config/apiConfig.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }




var ESTADO_BADGE = {
  completado: {
    texto: "Completado",
    color: "#28a745"
  },
  en_proceso: {
    texto: "Enviando",
    color: "#5bc0de"
  },
  pendiente: {
    texto: "Pendiente",
    color: "#adb5bd"
  },
  error: {
    texto: "Error",
    color: "#dc3545"
  },
  sin_enviar: {
    texto: "Sin enviar",
    color: "#adb5bd"
  }
};
var IconoPaso = function IconoPaso(_ref) {
  var _ESTADO_BADGE$estado;
  var estado = _ref.estado;
  var color = ((_ESTADO_BADGE$estado = ESTADO_BADGE[estado]) === null || _ESTADO_BADGE$estado === void 0 ? void 0 : _ESTADO_BADGE$estado.color) || "#adb5bd";
  if (estado === "completado") {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      style: {
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: color,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        flexShrink: 0
      },
      children: "\u2713"
    });
  }
  if (estado === "error") {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      style: {
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: color,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        flexShrink: 0
      },
      children: "!"
    });
  }
  if (estado === "en_proceso") {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      style: {
        width: 22,
        height: 22,
        borderRadius: "50%",
        border: "2px solid ".concat(color),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
        className: "spinner-border spinner-border-sm",
        style: {
          width: 10,
          height: 10,
          color: color
        }
      })
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    style: {
      width: 22,
      height: 22,
      borderRadius: "50%",
      border: "2px solid ".concat(color),
      flexShrink: 0
    }
  });
};
var formatearHora = function formatearHora(iso) {
  if (!iso) return null;
  var fecha = new Date(iso);
  return fecha.toLocaleDateString("es-EC", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }) + ", " + fecha.toLocaleTimeString("es-EC", {
    hour: "numeric",
    minute: "2-digit"
  });
};
var RESUMEN_ESTADO = {
  PENDIENTE: "La emisión del comprobante está en proceso.",
  RECIBIDA: "La emisión del comprobante está en proceso.",
  AUTORIZADA: "El comprobante fue autorizado por el SRI.",
  NO_AUTORIZADA: "El SRI rechazó este comprobante.",
  DEVUELTA: "El SRI devolvió este comprobante.",
  ERROR_TEMPORAL_SRI: "El SRI tuvo un problema temporal -- no es un error de tu comprobante."
};
var RutaEmisionPanel = function RutaEmisionPanel(_ref2) {
  var electronicInvoiceId = _ref2.electronicInvoiceId,
    show = _ref2.show,
    onHide = _ref2.onHide,
    onReintentar = _ref2.onReintentar;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    datos = _useState2[0],
    setDatos = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    cargando = _useState4[0],
    setCargando = _useState4[1];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (show && electronicInvoiceId) {
      setCargando(true);
      _config_apiConfig__WEBPACK_IMPORTED_MODULE_2__["default"].get("/electronic-invoices/".concat(electronicInvoiceId, "/ruta")).then(function (res) {
        return setDatos(res.data.data);
      })["finally"](function () {
        return setCargando(false);
      });
    }
    if (!show) {
      setDatos(null);
    }
  }, [show, electronicInvoiceId]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"], {
    show: show,
    onHide: onHide,
    placement: "end",
    style: {
      width: 380
    },
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Header, {
      closeButton: true,
      className: "border-bottom",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Title, {
        style: {
          fontSize: "1rem"
        },
        children: datos ? "".concat(datos.tipo_comprobante === "05" ? "Nota de débito" : "Factura", " ").concat(datos.numero_comprobante) : "Ruta de emisión"
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Body, {
      children: [cargando && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
        className: "text-muted small",
        children: "Cargando..."
      }), datos && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
          className: "text-muted small mb-3",
          children: "Ruta de emisi\xF3n del comprobante."
        }), RESUMEN_ESTADO[datos.estado] && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "alert alert-light border small py-2 mb-3",
          children: RESUMEN_ESTADO[datos.estado]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "mb-4",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            className: "text-muted small mb-1",
            children: "Clave de acceso"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("code", {
            className: "d-block small",
            style: {
              wordBreak: "break-all",
              background: "#f8f9fa",
              padding: "0.4rem 0.6rem",
              borderRadius: "0.4rem"
            },
            children: datos.clave_acceso
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h6", {
          className: "mb-1",
          children: "Ruta del comprobante"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
          className: "text-muted small mb-3",
          children: "Cada punto muestra el estado actual y el error cuando existe."
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          children: datos.pasos.map(function (paso, i) {
            var _ESTADO_BADGE$paso$es, _ESTADO_BADGE$paso$es2;
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
              className: "d-flex",
              style: {
                gap: "0.75rem"
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
                className: "d-flex flex-column align-items-center",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(IconoPaso, {
                  estado: paso.estado
                }), i < datos.pasos.length - 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
                  style: {
                    width: 2,
                    flexGrow: 1,
                    background: "#e9ecef",
                    minHeight: 28
                  }
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
                className: "pb-3 flex-grow-1",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
                  className: "d-flex justify-content-between align-items-start",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("strong", {
                    className: "small",
                    children: paso.titulo
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
                    className: "small fw-semibold",
                    style: {
                      color: (_ESTADO_BADGE$paso$es = ESTADO_BADGE[paso.estado]) === null || _ESTADO_BADGE$paso$es === void 0 ? void 0 : _ESTADO_BADGE$paso$es.color
                    },
                    children: (_ESTADO_BADGE$paso$es2 = ESTADO_BADGE[paso.estado]) === null || _ESTADO_BADGE$paso$es2 === void 0 ? void 0 : _ESTADO_BADGE$paso$es2.texto
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
                  className: "text-muted small",
                  children: paso.descripcion
                }), paso.timestamp && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
                  className: "text-muted small mt-1",
                  children: formatearHora(paso.timestamp)
                })]
              })]
            }, paso.clave);
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("hr", {}), datos.tiene_xml && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
          className: "text-muted small",
          children: "XML firmado disponible"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "d-flex flex-column gap-2",
          children: [datos.puede_ver_pdf && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("a", {
            className: "btn btn-outline-secondary btn-sm",
            href: "/api/electronic-invoices/".concat(electronicInvoiceId, "/ride"),
            target: "_blank",
            rel: "noreferrer",
            children: "\uD83D\uDCC4 Ver PDF"
          }), datos.tiene_xml && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("a", {
            className: "btn btn-outline-secondary btn-sm",
            href: "/api/electronic-invoices/".concat(electronicInvoiceId, "/xml"),
            children: "\u2B07 Descargar XML"
          }), datos.puede_reintentar && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
            type: "button",
            className: "btn btn-outline-danger btn-sm",
            onClick: function onClick() {
              onReintentar === null || onReintentar === void 0 || onReintentar();
              onHide();
            },
            children: "\u21BB Reintentar emisi\xF3n"
          })]
        })]
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RutaEmisionPanel);

/***/ },

/***/ "./node_modules/react-bootstrap/esm/Offcanvas.js"
/*!*******************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/Offcanvas.js ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _restart_hooks_useBreakpoint__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @restart/hooks/useBreakpoint */ "./node_modules/@restart/hooks/esm/useBreakpoint.js");
/* harmony import */ var _restart_hooks_useEventCallback__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @restart/hooks/useEventCallback */ "./node_modules/@restart/hooks/esm/useEventCallback.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _restart_ui_Modal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @restart/ui/Modal */ "./node_modules/@restart/ui/esm/Modal.js");
/* harmony import */ var _Fade__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Fade */ "./node_modules/react-bootstrap/esm/Fade.js");
/* harmony import */ var _OffcanvasBody__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./OffcanvasBody */ "./node_modules/react-bootstrap/esm/OffcanvasBody.js");
/* harmony import */ var _OffcanvasToggling__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./OffcanvasToggling */ "./node_modules/react-bootstrap/esm/OffcanvasToggling.js");
/* harmony import */ var _ModalContext__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ModalContext */ "./node_modules/react-bootstrap/esm/ModalContext.js");
/* harmony import */ var _OffcanvasHeader__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./OffcanvasHeader */ "./node_modules/react-bootstrap/esm/OffcanvasHeader.js");
/* harmony import */ var _OffcanvasTitle__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./OffcanvasTitle */ "./node_modules/react-bootstrap/esm/OffcanvasTitle.js");
/* harmony import */ var _ThemeProvider__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./ThemeProvider */ "./node_modules/react-bootstrap/esm/ThemeProvider.js");
/* harmony import */ var _BootstrapModalManager__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./BootstrapModalManager */ "./node_modules/react-bootstrap/esm/BootstrapModalManager.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
"use client";


















function DialogTransition(props) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_OffcanvasToggling__WEBPACK_IMPORTED_MODULE_7__["default"], {
    ...props
  });
}
function BackdropTransition(props) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_Fade__WEBPACK_IMPORTED_MODULE_5__["default"], {
    ...props
  });
}
const Offcanvas = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.forwardRef(({
  bsPrefix,
  className,
  children,
  'aria-labelledby': ariaLabelledby,
  placement = 'start',
  responsive,
  /* BaseModal props */

  show = false,
  backdrop = true,
  keyboard = true,
  scroll = false,
  onEscapeKeyDown,
  onShow,
  onHide,
  container,
  autoFocus = true,
  enforceFocus = true,
  restoreFocus = true,
  restoreFocusOptions,
  onEntered,
  onExit,
  onExiting,
  onEnter,
  onEntering,
  onExited,
  backdropClassName,
  manager: propsManager,
  renderStaticNode = false,
  ...props
}, ref) => {
  const modalManager = (0,react__WEBPACK_IMPORTED_MODULE_3__.useRef)();
  bsPrefix = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_11__.useBootstrapPrefix)(bsPrefix, 'offcanvas');
  const [showOffcanvas, setShowOffcanvas] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
  const handleHide = (0,_restart_hooks_useEventCallback__WEBPACK_IMPORTED_MODULE_2__["default"])(onHide);
  const hideResponsiveOffcanvas = (0,_restart_hooks_useBreakpoint__WEBPACK_IMPORTED_MODULE_1__["default"])(responsive || 'xs', 'up');
  (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    // Handles the case where screen is resized while the responsive
    // offcanvas is shown. If `responsive` not provided, just use `show`.
    setShowOffcanvas(responsive ? show && !hideResponsiveOffcanvas : show);
  }, [show, responsive, hideResponsiveOffcanvas]);
  const modalContext = (0,react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => ({
    onHide: handleHide
  }), [handleHide]);
  function getModalManager() {
    if (propsManager) return propsManager;
    if (scroll) {
      // Have to use a different modal manager since the shared
      // one handles overflow.
      if (!modalManager.current) modalManager.current = new _BootstrapModalManager__WEBPACK_IMPORTED_MODULE_12__["default"]({
        handleContainerOverflow: false
      });
      return modalManager.current;
    }
    return (0,_BootstrapModalManager__WEBPACK_IMPORTED_MODULE_12__.getSharedManager)();
  }
  const handleEnter = (node, ...args) => {
    if (node) node.style.visibility = 'visible';
    onEnter == null || onEnter(node, ...args);
  };
  const handleExited = (node, ...args) => {
    if (node) node.style.visibility = '';
    onExited == null || onExited(...args);
  };
  const renderBackdrop = (0,react__WEBPACK_IMPORTED_MODULE_3__.useCallback)(backdropProps => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
    ...backdropProps,
    className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(`${bsPrefix}-backdrop`, backdropClassName)
  }), [backdropClassName, bsPrefix]);
  const renderDialog = dialogProps => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
    ...dialogProps,
    ...props,
    className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(className, responsive ? `${bsPrefix}-${responsive}` : bsPrefix, `${bsPrefix}-${placement}`),
    "aria-labelledby": ariaLabelledby,
    children: children
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.Fragment, {
    children: [!showOffcanvas && (responsive || renderStaticNode) && renderDialog({}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_ModalContext__WEBPACK_IMPORTED_MODULE_8__["default"].Provider, {
      value: modalContext,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_restart_ui_Modal__WEBPACK_IMPORTED_MODULE_4__["default"], {
        show: showOffcanvas,
        ref: ref,
        backdrop: backdrop,
        container: container,
        keyboard: keyboard,
        autoFocus: autoFocus,
        enforceFocus: enforceFocus && !scroll,
        restoreFocus: restoreFocus,
        restoreFocusOptions: restoreFocusOptions,
        onEscapeKeyDown: onEscapeKeyDown,
        onShow: onShow,
        onHide: handleHide,
        onEnter: handleEnter,
        onEntering: onEntering,
        onEntered: onEntered,
        onExit: onExit,
        onExiting: onExiting,
        onExited: handleExited,
        manager: getModalManager(),
        transition: DialogTransition,
        backdropTransition: BackdropTransition,
        renderBackdrop: renderBackdrop,
        renderDialog: renderDialog
      })
    })]
  });
});
Offcanvas.displayName = 'Offcanvas';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Object.assign(Offcanvas, {
  Body: _OffcanvasBody__WEBPACK_IMPORTED_MODULE_6__["default"],
  Header: _OffcanvasHeader__WEBPACK_IMPORTED_MODULE_9__["default"],
  Title: _OffcanvasTitle__WEBPACK_IMPORTED_MODULE_10__["default"]
}));

/***/ },

/***/ "./node_modules/react-bootstrap/esm/OffcanvasBody.js"
/*!***********************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/OffcanvasBody.js ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ThemeProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ThemeProvider */ "./node_modules/react-bootstrap/esm/ThemeProvider.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
"use client";





const OffcanvasBody = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  bsPrefix,
  as: Component = 'div',
  ...props
}, ref) => {
  bsPrefix = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_2__.useBootstrapPrefix)(bsPrefix, 'offcanvas-body');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(Component, {
    ref: ref,
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(className, bsPrefix),
    ...props
  });
});
OffcanvasBody.displayName = 'OffcanvasBody';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (OffcanvasBody);

/***/ },

/***/ "./node_modules/react-bootstrap/esm/OffcanvasHeader.js"
/*!*************************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/OffcanvasHeader.js ***!
  \*************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _ThemeProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ThemeProvider */ "./node_modules/react-bootstrap/esm/ThemeProvider.js");
/* harmony import */ var _AbstractModalHeader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AbstractModalHeader */ "./node_modules/react-bootstrap/esm/AbstractModalHeader.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
"use client";






const OffcanvasHeader = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({
  bsPrefix,
  className,
  closeLabel = 'Close',
  closeButton = false,
  ...props
}, ref) => {
  bsPrefix = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_2__.useBootstrapPrefix)(bsPrefix, 'offcanvas-header');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_AbstractModalHeader__WEBPACK_IMPORTED_MODULE_3__["default"], {
    ref: ref,
    ...props,
    className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(className, bsPrefix),
    closeLabel: closeLabel,
    closeButton: closeButton
  });
});
OffcanvasHeader.displayName = 'OffcanvasHeader';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (OffcanvasHeader);

/***/ },

/***/ "./node_modules/react-bootstrap/esm/OffcanvasTitle.js"
/*!************************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/OffcanvasTitle.js ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _divWithClassName__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./divWithClassName */ "./node_modules/react-bootstrap/esm/divWithClassName.js");
/* harmony import */ var _ThemeProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ThemeProvider */ "./node_modules/react-bootstrap/esm/ThemeProvider.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
"use client";






const DivStyledAsH5 = (0,_divWithClassName__WEBPACK_IMPORTED_MODULE_2__["default"])('h5');
const OffcanvasTitle = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  bsPrefix,
  as: Component = DivStyledAsH5,
  ...props
}, ref) => {
  bsPrefix = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_3__.useBootstrapPrefix)(bsPrefix, 'offcanvas-title');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(Component, {
    ref: ref,
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(className, bsPrefix),
    ...props
  });
});
OffcanvasTitle.displayName = 'OffcanvasTitle';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (OffcanvasTitle);

/***/ },

/***/ "./node_modules/react-bootstrap/esm/OffcanvasToggling.js"
/*!***************************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/OffcanvasToggling.js ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_transition_group_Transition__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-transition-group/Transition */ "./node_modules/react-transition-group/esm/Transition.js");
/* harmony import */ var _restart_ui_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @restart/ui/utils */ "./node_modules/@restart/ui/esm/utils.js");
/* harmony import */ var _transitionEndListener__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./transitionEndListener */ "./node_modules/react-bootstrap/esm/transitionEndListener.js");
/* harmony import */ var _TransitionWrapper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./TransitionWrapper */ "./node_modules/react-bootstrap/esm/TransitionWrapper.js");
/* harmony import */ var _ThemeProvider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ThemeProvider */ "./node_modules/react-bootstrap/esm/ThemeProvider.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
"use client";









const transitionStyles = {
  [react_transition_group_Transition__WEBPACK_IMPORTED_MODULE_2__.ENTERING]: 'show',
  [react_transition_group_Transition__WEBPACK_IMPORTED_MODULE_2__.ENTERED]: 'show'
};
const OffcanvasToggling = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({
  bsPrefix,
  className,
  children,
  in: inProp = false,
  mountOnEnter = false,
  unmountOnExit = false,
  appear = false,
  ...props
}, ref) => {
  bsPrefix = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_6__.useBootstrapPrefix)(bsPrefix, 'offcanvas');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_TransitionWrapper__WEBPACK_IMPORTED_MODULE_5__["default"], {
    ref: ref,
    addEndListener: _transitionEndListener__WEBPACK_IMPORTED_MODULE_4__["default"],
    in: inProp,
    mountOnEnter: mountOnEnter,
    unmountOnExit: unmountOnExit,
    appear: appear,
    ...props,
    childRef: (0,_restart_ui_utils__WEBPACK_IMPORTED_MODULE_3__.getChildRef)(children),
    children: (status, innerProps) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.cloneElement(children, {
      ...innerProps,
      className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(className, children.props.className, (status === react_transition_group_Transition__WEBPACK_IMPORTED_MODULE_2__.ENTERING || status === react_transition_group_Transition__WEBPACK_IMPORTED_MODULE_2__.EXITING) && `${bsPrefix}-toggling`, transitionStyles[status])
    })
  });
});
OffcanvasToggling.displayName = 'OffcanvasToggling';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (OffcanvasToggling);

/***/ }

}]);