"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["seller-dashboard"],{

/***/ "./resources/pos/src/components/sellerDashboard/SellerDashboard.js"
/*!*************************************************************************!*\
  !*** ./resources/pos/src/components/sellerDashboard/SellerDashboard.js ***!
  \*************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/tab-title/TabTitle */ "./resources/pos/src/shared/tab-title/TabTitle.js");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var _shared_table_ReactDataTable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../shared/table/ReactDataTable */ "./resources/pos/src/shared/table/ReactDataTable.js");
/* harmony import */ var _shared_components_report_SalesTotalsBar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../shared/components/report/SalesTotalsBar */ "./resources/pos/src/shared/components/report/SalesTotalsBar.js");
/* harmony import */ var _store_action_salesAction__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../store/action/salesAction */ "./resources/pos/src/store/action/salesAction.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");










/**
 * Pantalla para vendedores: solo sus propias ventas de hoy, con los mismos
 * totales (efectivo/transferencia/pagado) que ya armamos para Informe de
 * venta -- reutiliza exactamente el mismo filtro por usuario y el mismo
 * componente de totales, nada nuevo del lado del backend.
 *
 * Quién puede VER esta pantalla se controla como cualquier otra, desde
 * Roles/Permisos, con el permiso "manage_my-sales".
 */

var SellerDashboard = function SellerDashboard(props) {
  var fetchSales = props.fetchSales,
    sales = props.sales,
    totalRecord = props.totalRecord,
    isLoading = props.isLoading;
  var loginUser = JSON.parse(localStorage.getItem("loginUserArray") || "null");
  var currentUserId = loginUser === null || loginUser === void 0 ? void 0 : loginUser.id;
  var currentUserName = loginUser && "".concat(loginUser.first_name || "", " ").concat(loginUser.last_name || "").trim();
  var today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Guayaquil"
  }).format(new Date());
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (currentUserId) {
      fetchSales({
        user_id: currentUserId,
        start_date: today,
        end_date: today
      }, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);
  var itemsValue = (sales === null || sales === void 0 ? void 0 : sales.length) >= 0 && sales.map(function (sale) {
    return {
      id: sale.id,
      reference_code: sale.attributes.reference_code,
      customer_name: sale.attributes.customer_name,
      grand_total: sale.attributes.grand_total,
      paid_amount: sale.attributes.paid_amount,
      payment_status: sale.attributes.payment_status,
      created_at: sale.attributes.created_at
    };
  });
  var columns = [{
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)("dashboard.recentSales.reference.label"),
    selector: function selector(row) {
      return row.reference_code;
    },
    sortable: true
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)("customer.title"),
    selector: function selector(row) {
      return row.customer_name;
    },
    sortable: true
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)("purchase.grant-total.label"),
    selector: function selector(row) {
      return "$ ".concat(Number(row.grand_total).toFixed(2));
    },
    sortable: true
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)("dashboard.recentSales.paymentStatus.label"),
    cell: function cell(row) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
        className: "badge ".concat(row.payment_status === 1 ? "bg-light-success" : row.payment_status === 3 ? "bg-light-warning" : "bg-light-danger"),
        children: row.payment_status === 1 ? "Pagado" : row.payment_status === 3 ? "Parcial" : "No pagado"
      });
    }
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)("globally.react-table.column.created-date.label"),
    selector: function selector(row) {
      return row.created_at ? new Date(row.created_at).toLocaleTimeString("es-EC", {
        hour: "2-digit",
        minute: "2-digit"
      }) : "";
    }
  }];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_2__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_4__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_3__["default"], {
      title: "Mis ventas de hoy"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
      className: "d-flex align-items-center justify-content-between mb-4",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("h3", {
          className: "mb-0",
          children: "Mis ventas de hoy"
        }), currentUserName && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
          className: "text-muted",
          children: currentUserName
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
        className: "text-muted",
        children: new Date().toLocaleDateString("es-EC", {
          weekday: "long",
          day: "numeric",
          month: "long"
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_components_report_SalesTotalsBar__WEBPACK_IMPORTED_MODULE_6__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_table_ReactDataTable__WEBPACK_IMPORTED_MODULE_5__["default"], {
      columns: columns,
      items: itemsValue,
      isLoading: isLoading,
      totalRows: totalRecord,
      onChange: function onChange() {
        return fetchSales({
          user_id: currentUserId,
          start_date: today,
          end_date: today
        }, true);
      }
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var sales = state.sales,
    totalRecord = state.totalRecord,
    isLoading = state.isLoading;
  return {
    sales: sales,
    totalRecord: totalRecord,
    isLoading: isLoading
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, {
  fetchSales: _store_action_salesAction__WEBPACK_IMPORTED_MODULE_7__.fetchSales
})(SellerDashboard));

/***/ },

/***/ "./resources/pos/src/shared/components/report/SalesTotalsBar.js"
/*!**********************************************************************!*\
  !*** ./resources/pos/src/shared/components/report/SalesTotalsBar.js ***!
  \**********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _sharedMethod__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");




/**
 * Total de TODOS los registros que calzan con el filtro actual (no solo
 * la página visible) -- viene del backend ya sumado, no se recalcula
 * sumando filas en el navegador.
 *
 * Columnas repartidas a ancho completo (en vez de agrupadas con poco
 * espacio entre ellas), para que se lea como una fila de resumen y no
 * como un bloque apretado.
 */

var SalesTotalsBar = function SalesTotalsBar() {
  var _useSelector = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useSelector)(function (state) {
      return state;
    }),
    saleTotals = _useSelector.saleTotals,
    frontSetting = _useSelector.frontSetting,
    allConfigData = _useSelector.allConfigData,
    totalRecord = _useSelector.totalRecord;
  var currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol;
  var stats = [{
    key: "count",
    label: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)("globally.total-record.label"),
    value: totalRecord !== null && totalRecord !== void 0 ? totalRecord : 0,
    color: "#111827",
    isCurrency: false
  }, {
    key: "grand_total",
    label: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)("purchase.grant-total.label"),
    value: (saleTotals === null || saleTotals === void 0 ? void 0 : saleTotals.grand_total) || 0,
    color: "#6366f1"
  }, {
    key: "paid_amount",
    label: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)("dashboard.recentSales.paid.label"),
    value: (saleTotals === null || saleTotals === void 0 ? void 0 : saleTotals.paid_amount) || 0,
    color: "#059669"
  }, {
    key: "cash_amount",
    label: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)("cash.label"),
    value: (saleTotals === null || saleTotals === void 0 ? void 0 : saleTotals.cash_amount) || 0,
    color: "#16a34a"
  }, {
    key: "transfer_amount",
    label: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)("payment-type.filter.bank-transfer.label"),
    value: (saleTotals === null || saleTotals === void 0 ? void 0 : saleTotals.transfer_amount) || 0,
    color: "#0284c7"
  }];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: "d-flex flex-wrap rounded mb-3",
    style: {
      background: "#ffffff",
      border: "1px solid #e5e7eb"
    },
    children: stats.map(function (stat) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "flex-fill",
        style: {
          padding: "18px 24px",
          minWidth: 140
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "text-muted text-uppercase",
          style: {
            fontSize: 11,
            letterSpacing: 0.5,
            fontWeight: 600
          },
          children: stat.label
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "mt-1",
          style: {
            fontSize: 18,
            fontWeight: 700,
            color: stat.color
          },
          children: stat.isCurrency === false ? stat.value : (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.currencySymbolHandling)(allConfigData, currencySymbol, stat.value)
        })]
      }, stat.key);
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SalesTotalsBar);

/***/ },

/***/ "./resources/pos/src/store/action/saleApiAction.js"
/*!*********************************************************!*\
  !*** ./resources/pos/src/store/action/saleApiAction.js ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   callSaleApi: () => (/* binding */ callSaleApi)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");

var callSaleApi = function callSaleApi(isCall) {
  return {
    type: _constants__WEBPACK_IMPORTED_MODULE_0__.constants.CALL_SALE_API,
    payload: isCall
  };
};

/***/ },

/***/ "./resources/pos/src/store/action/salesAction.js"
/*!*******************************************************!*\
  !*** ./resources/pos/src/store/action/salesAction.js ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addSale: () => (/* binding */ addSale),
/* harmony export */   deleteSale: () => (/* binding */ deleteSale),
/* harmony export */   editSale: () => (/* binding */ editSale),
/* harmony export */   fetchSale: () => (/* binding */ fetchSale),
/* harmony export */   fetchSales: () => (/* binding */ fetchSales)
/* harmony export */ });
/* harmony import */ var _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config/apiConfig */ "./resources/pos/src/config/apiConfig.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _toastAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./toastAction */ "./resources/pos/src/store/action/toastAction.js");
/* harmony import */ var _totalRecordAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./totalRecordAction */ "./resources/pos/src/store/action/totalRecordAction.js");
/* harmony import */ var _loadingAction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./loadingAction */ "./resources/pos/src/store/action/loadingAction.js");
/* harmony import */ var _shared_requestParam__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../shared/requestParam */ "./resources/pos/src/shared/requestParam.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _saleApiAction__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./saleApiAction */ "./resources/pos/src/store/action/saleApiAction.js");
/* harmony import */ var _saveButtonAction__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./saveButtonAction */ "./resources/pos/src/store/action/saveButtonAction.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }









var fetchSales = function fetchSales() {
  var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var isLoading = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(dispatch) {
      var admin, url;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            if (isLoading) {
              dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_4__.setLoading)(true));
            }
            admin = filter.user_id ? undefined : true;
            url = _constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.SALES;
            if (!_.isEmpty(filter) && (filter.page || filter.pageSize || filter.user_id || filter.search || filter.order_By || filter.created_at || filter.customer_id)) {
              url += (0,_shared_requestParam__WEBPACK_IMPORTED_MODULE_5__["default"])(filter, admin, null, null, url);
            }
            _context.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].get(url).then(function (response) {
              var _response$data$meta;
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.saleActionType.FETCH_SALES,
                payload: response.data.data
              });
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.saleActionType.FETCH_SALE_TOTALS,
                payload: ((_response$data$meta = response.data.meta) === null || _response$data$meta === void 0 ? void 0 : _response$data$meta.totals) || {}
              });
              dispatch((0,_totalRecordAction__WEBPACK_IMPORTED_MODULE_3__.setTotalRecord)(response.data.meta.total !== undefined && response.data.meta.total >= 0 ? response.data.meta.total : response.data.data.total));
              dispatch((0,_saleApiAction__WEBPACK_IMPORTED_MODULE_7__.callSaleApi)(false));
              if (isLoading) {
                dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_4__.setLoading)(false));
              }
            })["catch"](function (_ref2) {
              var response = _ref2.response;
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: response.data.message,
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.toastType.ERROR
              }));
            });
          case 1:
            return _context.a(2);
        }
      }, _callee);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();
};
var fetchSale = function fetchSale(saleId, singleSale) {
  var isLoading = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(dispatch) {
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            if (isLoading) {
              dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_4__.setLoading)(true));
            }
            _context2.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].get(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.SALES + "/" + saleId + "/edit", singleSale).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.saleActionType.FETCH_SALE,
                payload: response.data.data
              });
              if (isLoading) {
                dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_4__.setLoading)(false));
              }
            })["catch"](function (_ref4) {
              var response = _ref4.response;
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: response.data.message,
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.toastType.ERROR
              }));
            });
          case 1:
            return _context2.a(2);
        }
      }, _callee2);
    }));
    return function (_x2) {
      return _ref3.apply(this, arguments);
    };
  }();
};
var addSale = function addSale(sale, navigate) {
  var emitirFacturaSri = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(dispatch) {
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_8__.setSavingButton)(true));
            _context3.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].post(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.SALES, sale).then(function (response) {
              var _response$data$data;
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.saleActionType.ADD_SALE,
                payload: response.data.data
              });
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("sale.success.create.message")
              }));
              dispatch((0,_totalRecordAction__WEBPACK_IMPORTED_MODULE_3__.addInToTotalRecord)(1));

              // Si el usuario activó el switch de factura electrónica, la
              // disparamos en segundo plano (no bloquea la navegación).
              if (emitirFacturaSri && (_response$data$data = response.data.data) !== null && _response$data$data !== void 0 && _response$data$data.id) {
                var ventaId = response.data.data.id;
                _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].post("sales/".concat(ventaId, "/electronic-invoice/emitir")).then(function () {
                  dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                    text: "Factura electrónica en proceso. Revisa el estado en la lista de ventas."
                  }));
                })["catch"](function (_ref6) {
                  var _errResponse$data;
                  var errResponse = _ref6.response;
                  dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                    text: (errResponse === null || errResponse === void 0 || (_errResponse$data = errResponse.data) === null || _errResponse$data === void 0 ? void 0 : _errResponse$data.message) || "Error al emitir la factura electrónica",
                    type: _constants__WEBPACK_IMPORTED_MODULE_1__.toastType.ERROR
                  }));
                });
              }
              navigate("/app/sales");
              dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_8__.setSavingButton)(false));
            })["catch"](function (_ref7) {
              var response = _ref7.response;
              dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_8__.setSavingButton)(false));
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: response.data.message,
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.toastType.ERROR
              }));
            });
          case 1:
            return _context3.a(2);
        }
      }, _callee3);
    }));
    return function (_x3) {
      return _ref5.apply(this, arguments);
    };
  }();
};
var editSale = function editSale(saleId, sale, navigate) {
  return /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(dispatch) {
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_8__.setSavingButton)(true));
            _context4.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].patch(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.SALES + "/" + saleId, sale).then(function (response) {
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("sale.success.edit.message")
              }));
              navigate("/app/sales");
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.saleActionType.EDIT_SALE,
                payload: response.data.data
              });
              dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_8__.setSavingButton)(false));
            })["catch"](function (_ref9) {
              var response = _ref9.response;
              dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_8__.setSavingButton)(false));
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: response.data.message,
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.toastType.ERROR
              }));
            });
          case 1:
            return _context4.a(2);
        }
      }, _callee4);
    }));
    return function (_x4) {
      return _ref8.apply(this, arguments);
    };
  }();
};
var deleteSale = function deleteSale(userId) {
  return /*#__PURE__*/function () {
    var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(dispatch) {
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            _context5.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"]["delete"](_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.SALES + "/" + userId).then(function () {
              dispatch((0,_totalRecordAction__WEBPACK_IMPORTED_MODULE_3__.removeFromTotalRecord)(1));
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.saleActionType.DELETE_SALE,
                payload: userId
              });
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("sale.success.delete.message")
              }));
            })["catch"](function (_ref1) {
              var response = _ref1.response;
              response && dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: response.data.message,
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.toastType.ERROR
              }));
            });
          case 1:
            return _context5.a(2);
        }
      }, _callee5);
    }));
    return function (_x5) {
      return _ref0.apply(this, arguments);
    };
  }();
};

/***/ }

}]);