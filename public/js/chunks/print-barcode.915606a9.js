(self["webpackChunk"] = self["webpackChunk"] || []).push([["print-barcode"],{

/***/ "./resources/pos/src/components/printBarcode/BarcodeShow.js"
/*!******************************************************************!*\
  !*** ./resources/pos/src/components/printBarcode/BarcodeShow.js ***!
  \******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Image.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");





var BarcodeShow = function BarcodeShow(props) {
  var _frontSetting$value;
  var updateProducts = props.updateProducts,
    paperSize = props.paperSize,
    updated = props.updated,
    frontSetting = props.frontSetting,
    allConfigData = props.allConfigData,
    barcodeOptions = props.barcodeOptions;
  var companyName = frontSetting === null || frontSetting === void 0 || (_frontSetting$value = frontSetting.value) === null || _frontSetting$value === void 0 ? void 0 : _frontSetting$value.company_name;
  var currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol;
  var loopBarcode = function loopBarcode(product) {
    var indents = [];
    for (var i = 0; i < product.quantity; i++) {
      indents.push(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "".concat(paperSize.value === 1 ? "col-md-3" :  false || paperSize.value === 2 ? "col-md-4 barcode-main__box-height2" :  false || paperSize.value === 3 ? "col-md-4 barcode-main__box-height3" :  false || paperSize.value === 4 || paperSize.value === 6 ? "col-md-6 barcode-main__box-height2 px-20" :  false || paperSize.value === 5 ? "col-md-4 barcode-main__box-height3 px-13" :  false || paperSize.value === 7 ? "col-md-4 barcode-main__box-height7 px-20" :  false || paperSize.value === 8 ? "col-md-6 barcode-main__box-height7 px-20" : "", " barcode-main__barcode-item barcode-main__barcode-style"),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "fw-bolder lh-1",
          children: barcodeOptions.companyName && companyName
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "text-capitalize",
          children: barcodeOptions.productName && product.name
        }), (barcodeOptions === null || barcodeOptions === void 0 ? void 0 : barcodeOptions.price) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "text-capitalize",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("span", {
            className: "fw-bolder",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)("product.table.price.column.label"), ":"]
          }), " ", (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.currencySymbolHandling)(allConfigData, currencySymbol, product.product_price)]
        }), " ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"], {
          src: product && product.barcode_url,
          alt: product && product.name,
          className: "w-100"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "fw-bolder",
          children: product && product.code
        })]
      }, i));
    }
    return indents;
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "col-md-12 d-flex d-wrap justify-content-between flex-column overflow-auto",
      children: updated ? updateProducts ? updateProducts.map(function (product, index) {
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "barcode-main",
          id: "demo",
          children: loopBarcode(product)
        }, index);
      }) : "" : ""
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BarcodeShow);

/***/ },

/***/ "./resources/pos/src/components/printBarcode/PrintBarcode.js"
/*!*******************************************************************!*\
  !*** ./resources/pos/src/components/printBarcode/PrintBarcode.js ***!
  \*******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Button.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Row.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Table.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Col.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_to_print__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-to-print */ "./node_modules/react-to-print/lib/index.js");
/* harmony import */ var react_to_print__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_to_print__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shared/tab-title/TabTitle */ "./resources/pos/src/shared/tab-title/TabTitle.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../shared/select/reactSelect */ "./resources/pos/src/shared/select/reactSelect.js");
/* harmony import */ var _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../store/action/warehouseAction */ "./resources/pos/src/store/action/warehouseAction.js");
/* harmony import */ var _store_action_productAction__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../store/action/productAction */ "./resources/pos/src/store/action/productAction.js");
/* harmony import */ var _shared_prepareArray_preparePurchaseArray__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../shared/prepareArray/preparePurchaseArray */ "./resources/pos/src/shared/prepareArray/preparePurchaseArray.js");
/* harmony import */ var _PrintTable__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./PrintTable */ "./resources/pos/src/components/printBarcode/PrintTable.js");
/* harmony import */ var _shared_option_lists_paperSize_json__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../shared/option-lists/paperSize.json */ "./resources/pos/src/shared/option-lists/paperSize.json");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _store_action_toastAction__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../store/action/toastAction */ "./resources/pos/src/store/action/toastAction.js");
/* harmony import */ var _BarcodeShow__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./BarcodeShow */ "./resources/pos/src/components/printBarcode/BarcodeShow.js");
/* harmony import */ var _PrintButton__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./PrintButton */ "./resources/pos/src/components/printBarcode/PrintButton.js");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "./node_modules/@fortawesome/react-fontawesome/index.es.js");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.mjs");
/* harmony import */ var _shared_components_product_cart_search_ProductSearch__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../../shared/components/product-cart/search/ProductSearch */ "./resources/pos/src/shared/components/product-cart/search/ProductSearch.js");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var _store_action_frontSettingAction__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../../store/action/frontSettingAction */ "./resources/pos/src/store/action/frontSettingAction.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
























var PrintBarcode = function PrintBarcode() {
  var _useSelector = (0,react_redux__WEBPACK_IMPORTED_MODULE_5__.useSelector)(function (state) {
      return state;
    }),
    warehouses = _useSelector.warehouses,
    products = _useSelector.products,
    purchaseProducts = _useSelector.purchaseProducts,
    frontSetting = _useSelector.frontSetting,
    allConfigData = _useSelector.allConfigData,
    _useSelector$customPr = _useSelector.customProducts,
    customProducts = _useSelector$customPr === void 0 ? (0,_shared_prepareArray_preparePurchaseArray__WEBPACK_IMPORTED_MODULE_13__.preparePurchaseProductArray)(products, true) : _useSelector$customPr;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      warehouse_id: '',
      paperSizeValue: ''
    }),
    _useState2 = _slicedToArray(_useState, 2),
    printBarcodeValue = _useState2[0],
    setPrintBarcodeValue = _useState2[1];
  var printBarcodeQuantity = (0,react_redux__WEBPACK_IMPORTED_MODULE_5__.useSelector)(function (state) {
    return state.printQuantity;
  });
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState4 = _slicedToArray(_useState3, 2),
    updateProducts = _useState4[0],
    setUpdateProducts = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState6 = _slicedToArray(_useState5, 2),
    print = _useState6[0],
    setPrint = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState8 = _slicedToArray(_useState7, 2),
    isPrintShow = _useState8[0],
    setIsPrintShow = _useState8[1];
  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0),
    _useState0 = _slicedToArray(_useState9, 2),
    quantity = _useState0[0],
    setQuantity = _useState0[1];
  var _useState1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true),
    _useState10 = _slicedToArray(_useState1, 2),
    companyName = _useState10[0],
    setCompanyName = _useState10[1];
  var _useState11 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true),
    _useState12 = _slicedToArray(_useState11, 2),
    productName = _useState12[0],
    setProductName = _useState12[1];
  var _useState13 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true),
    _useState14 = _slicedToArray(_useState13, 2),
    price = _useState14[0],
    setPrice = _useState14[1];
  var _useState15 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      warehouse_id: '',
      paperSizeValue: ''
    }),
    _useState16 = _slicedToArray(_useState15, 2),
    errors = _useState16[0],
    setErrors = _useState16[1];
  var _useState17 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState18 = _slicedToArray(_useState17, 2),
    updated = _useState18[0],
    setUpdated = _useState18[1];
  var componentRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_5__.useDispatch)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    dispatch((0,_store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_11__.fetchAllWarehouses)());
    dispatch((0,_store_action_productAction__WEBPACK_IMPORTED_MODULE_12__.fetchAllProducts)());
  }, [quantity, purchaseProducts]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    dispatch((0,_store_action_frontSettingAction__WEBPACK_IMPORTED_MODULE_24__.fetchFrontSetting)());
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (printBarcodeValue) {
      if (updateProducts.length) {
        setPrint(preparePrint);
      }
    }
  }, [updateProducts, printBarcodeValue, printBarcodeQuantity]);
  var onWarehouseChange = function onWarehouseChange(obj) {
    setPrintBarcodeValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, {
        warehouse_id: obj
      });
    });
  };
  var onPaperSizeChange = function onPaperSizeChange(obj) {
    setPrintBarcodeValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, {
        paperSizeValue: obj
      });
    });
    setIsPrintShow(true);
  };
  var updatedQty = function updatedQty(qty) {
    setQuantity(qty);
  };
  var handleValidation = function handleValidation() {
    var errorss = {};
    var isValid = false;
    if (!printBarcodeValue.warehouse_id) {
      errorss['warehouse_id'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.getFormattedMessage)('purchase.select.warehouse.validate.label');
    } else if (updateProducts.length === 0) {
      dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_17__.addToast)({
        text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.getFormattedMessage)('purchase.product-list.validate.message'),
        type: _constants__WEBPACK_IMPORTED_MODULE_16__.toastType.ERROR
      }));
    } else if (!printBarcodeValue.paperSizeValue) {
      errorss['paperSizeValue'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.getFormattedMessage)('globally.paper.size.validate.label');
    } else {
      isValid = true;
    }
    setErrors(errorss);
    return isValid;
  };
  var onResetClick = function onResetClick() {
    setUpdateProducts([]);
    setUpdated(false);
    setPrintBarcodeValue({
      warehouse_id: '',
      paperSizeValue: ''
    });
    setErrors({
      warehouse_id: '',
      paperSizeValue: ''
    });
  };
  var printPaymentReceiptPdf = function printPaymentReceiptPdf(event) {
    event.preventDefault();
    var valid = handleValidation();
    if (isPrintShow === true && valid) {
      document.getElementById('printReceipt').click();
    }
  };
  var handlePrint = (0,react_to_print__WEBPACK_IMPORTED_MODULE_6__.useReactToPrint)({
    content: function content() {
      return componentRef.current;
    },
    pageStyle: "\n        @page {\n        size: auto;\n         margin: 0;\n        }\n\n        body {\n        margin:0;\n        padding:0;\n        background: transparent !important;\n        -webkit-print-color-adjust: exact;\n        }\n  "
  });
  var preparePrint = function preparePrint() {
    var formValue = {
      products: updateProducts,
      paperSize: printBarcodeValue.paperSizeValue,
      printBarcodeQuantity: printBarcodeQuantity
    };
    return formValue;
  };

  //on update function
  var onUpdateClick = function onUpdateClick(event) {
    event.preventDefault();
    var valid = handleValidation();
    if (valid) {
      setIsPrintShow(true);
      setUpdated(true);
    }
  };

  // print barcode
  var loadPrintBlock = function loadPrintBlock() {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("div", {
      className: "d-none",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("button", {
        id: "printReceipt",
        onClick: handlePrint,
        children: "Print this out!"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_PrintButton__WEBPACK_IMPORTED_MODULE_19__["default"], {
        ref: componentRef,
        frontSetting: frontSetting,
        allConfigData: allConfigData,
        barcodeOptions: barcodeOptions,
        updateProducts: print
      })]
    });
  };
  var handleChangedCompany = function handleChangedCompany(event, targetValue) {
    var checked = event.target.checked;
    if (targetValue === 1) {
      setCompanyName(checked);
    }
    if (targetValue === 2) {
      setProductName(checked);
    }
    if (targetValue === 3) {
      setPrice(checked);
    }
  };
  var barcodeOptions = {
    companyName: companyName,
    productName: productName,
    price: price
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_7__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_23__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_8__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.placeholderText)('print.barcode.title')
    }), print.length !== 0 ? loadPrintBlock() : '', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("div", {
      className: "card card-body",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_4__["default"], {
        md: 4,
        className: "ml-auto mb-3 col-12",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_10__["default"], {
          name: "warehouse_id",
          data: warehouses,
          onChange: onWarehouseChange,
          title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.getFormattedMessage)('warehouse.title'),
          errors: errors['warehouse_id'],
          defaultValue: printBarcodeValue.warehouse_id,
          value: printBarcodeValue.warehouse_id,
          placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.placeholderText)('purchase.select.warehouse.placeholder.label')
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_4__["default"], {
        sm: 12,
        className: "mb-10",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("label", {
          className: "form-label",
          children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.getFormattedMessage)('dashboard.stockAlert.product.label'), ":"]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_shared_components_product_cart_search_ProductSearch__WEBPACK_IMPORTED_MODULE_22__["default"], {
          values: printBarcodeValue,
          products: products,
          isAllProducts: true,
          updateProducts: updateProducts,
          handleValidation: handleValidation,
          setUpdateProducts: setUpdateProducts,
          customProducts: customProducts
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("div", {
        className: "col-12 md-12",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"], {
          responsive: true,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("thead", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("tr", {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("th", {
                children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.getFormattedMessage)('dashboard.stockAlert.product.label')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("th", {
                children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.getFormattedMessage)('purchase.order-item.table.qty.column.label')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("th", {
                children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.getFormattedMessage)('react-data-table.action.column.label')
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_PrintTable__WEBPACK_IMPORTED_MODULE_14__["default"], {
            printBarcodeValue: printBarcodeValue,
            updatedQty: updatedQty,
            updateProducts: updateProducts,
            setUpdateProducts: setUpdateProducts
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__["default"], {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_4__["default"], {
          className: "ml-auto mb-5 col-6",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_10__["default"], {
            name: "paperSizeValue",
            data: _shared_option_lists_paperSize_json__WEBPACK_IMPORTED_MODULE_15__,
            onChange: onPaperSizeChange,
            title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.getFormattedMessage)('paper.size.title'),
            errors: errors['paperSizeValue'],
            defaultValue: printBarcodeValue.paperSizeValue,
            value: printBarcodeValue.paperSizeValue,
            placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.placeholderText)('paper.size.placeholder.label')
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_4__["default"], {
          className: "d-flex col-6",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("div", {
            className: "mt-3",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("div", {
              children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.getFormattedMessage)("print-barcode.show-company.label")
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("div", {
              className: "d-flex align-items-center mt-2",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("label", {
                className: "form-check form-switch form-switch-sm",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("input", {
                  type: "checkbox",
                  checked: companyName,
                  name: "Currency_icon_Right_side",
                  onChange: function onChange(event) {
                    return handleChangedCompany(event, 1);
                  },
                  className: "me-3 form-check-input cursor-pointer"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("div", {
                  className: "control__indicator"
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("span", {
                className: "switch-slider",
                "data-checked": "\u2713",
                "data-unchecked": "\u2715",
                children: errors['Currency_icon_Right_side'] ? errors['Currency_icon_Right_side'] : null
              })]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("div", {
            className: "mt-3 ms-10 mb-5",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("div", {
              children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.getFormattedMessage)("print-barcode.show-product-name.label")
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("div", {
              className: "align-items-center mt-2",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("label", {
                className: "form-check form-switch form-switch-sm",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("input", {
                  type: "checkbox",
                  checked: productName,
                  name: "Currency_icon_Right_side",
                  onChange: function onChange(event) {
                    return handleChangedCompany(event, 2);
                  },
                  className: "me-3 form-check-input cursor-pointer"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("div", {
                  className: "control__indicator"
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("span", {
                className: "switch-slider",
                "data-checked": "\u2713",
                "data-unchecked": "\u2715",
                children: errors['Currency_icon_Right_side'] ? errors['Currency_icon_Right_side'] : null
              })]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("div", {
            className: "mt-3 ms-10",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("div", {
              children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.getFormattedMessage)("print-barcode.show-price.label")
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("div", {
              className: "d-flex align-items-center mt-2",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("label", {
                className: "form-check form-switch form-switch-sm",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("input", {
                  type: "checkbox",
                  checked: price,
                  name: "Currency_icon_Right_side",
                  onChange: function onChange(event) {
                    return handleChangedCompany(event, 3);
                  },
                  className: "me-3 form-check-input cursor-pointer"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("div", {
                  className: "control__indicator"
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("span", {
                className: "switch-slider",
                "data-checked": "\u2713",
                "data-unchecked": "\u2715",
                children: errors['Currency_icon_Right_side'] ? errors['Currency_icon_Right_side'] : null
              })]
            })]
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("div", {
        className: "d-xl-flex align-items-center justify-content-between",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("div", {
          className: "d-xl-flex align-items-center justify-content-between",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("button", {
            type: "button",
            className: "btn btn-success me-5 text-white mb-2",
            onClick: function onClick(event) {
              return onUpdateClick(event);
            },
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.getFormattedMessage)('preview.title'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_20__.FontAwesomeIcon, {
              icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_21__.faMoneyBill,
              className: "ms-2"
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("button", {
            type: "button",
            className: "btn btn-danger me-5 mb-2",
            onClick: function onClick() {
              return onResetClick();
            },
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.getFormattedMessage)('date-picker.filter.reset.label'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_20__.FontAwesomeIcon, {
              icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_21__.faCreditCard,
              className: "ms-2"
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"], {
            type: "button",
            variant: "primary",
            className: "btn btn-primary me-5 mb-2",
            onClick: function onClick(e) {
              return printPaymentReceiptPdf(e);
            },
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.getFormattedMessage)('print.title'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_20__.FontAwesomeIcon, {
              icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_21__.faWallet,
              className: "ms-2"
            })]
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_BarcodeShow__WEBPACK_IMPORTED_MODULE_18__["default"], {
        updateProducts: updateProducts,
        barcodeOptions: barcodeOptions,
        frontSetting: frontSetting,
        paperSize: printBarcodeValue.paperSizeValue,
        updated: updated,
        allConfigData: allConfigData
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PrintBarcode);

/***/ },

/***/ "./resources/pos/src/components/printBarcode/PrintButton.js"
/*!******************************************************************!*\
  !*** ./resources/pos/src/components/printBarcode/PrintButton.js ***!
  \******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Image.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }




var PrintButton = /*#__PURE__*/function (_React$PureComponent) {
  function PrintButton() {
    _classCallCheck(this, PrintButton);
    return _callSuper(this, PrintButton, arguments);
  }
  _inherits(PrintButton, _React$PureComponent);
  return _createClass(PrintButton, [{
    key: "render",
    value: function render() {
      var _frontSetting$value;
      var print = this.props.updateProducts;
      var paperSize = print.paperSize;
      var frontSetting = this.props.frontSetting;
      var allConfigData = this.props.allConfigData;
      var barcodeOptions = this.props.barcodeOptions;
      var companyName = frontSetting === null || frontSetting === void 0 || (_frontSetting$value = frontSetting.value) === null || _frontSetting$value === void 0 ? void 0 : _frontSetting$value.company_name;
      var currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol;
      function printFunction(product, index) {
        var indents = [];
        for (var i = 0; i < product.quantity; i++) {
          indents.push(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "".concat(paperSize.value === 1 ? "print-main__print1" :  false || paperSize.value === 2 ? "print-main__print2" :  false || paperSize.value === 3 ? "print-main__print3" :  false || paperSize.value === 4 || paperSize.value === 6 ? "print-main__print4" :  false || paperSize.value === 5 ? "print-main__print5" :  false || paperSize.value === 7 ? "print-main__print7" :  false || paperSize.value === 8 ? "print-main__print8" : "", " barcode-main__barcode-item barcode-main__barcode-style"),
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
              className: "fw-bolder lh-1",
              children: barcodeOptions.companyName && companyName
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
              className: "text-capitalize",
              children: barcodeOptions.productName && product.name
            }), (barcodeOptions === null || barcodeOptions === void 0 ? void 0 : barcodeOptions.price) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
              className: "text-capitalize",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("span", {
                className: "fw-bolder",
                children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)("product.table.price.column.label"), ":"]
              }), " ", (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.currencySymbolHandling)(allConfigData, currencySymbol, product.product_price)]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"], {
              src: product && product.barcode_url,
              alt: product && product.name,
              className: "w-100"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
              className: "fw-bolder",
              children: product && product.code
            })]
          }, i));
        }
        return indents;
      }
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "p-4",
        children: print.products && print.products.map(function (product, index) {
          return printFunction(product, index);
        })
      });
    }
  }]);
}(react__WEBPACK_IMPORTED_MODULE_0__.PureComponent);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PrintButton);

/***/ },

/***/ "./resources/pos/src/components/printBarcode/PrintTable.js"
/*!*****************************************************************!*\
  !*** ./resources/pos/src/components/printBarcode/PrintTable.js ***!
  \*****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "./node_modules/@fortawesome/react-fontawesome/index.es.js");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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






var PrintTable = function PrintTable(props) {
  var setUpdateProducts = props.setUpdateProducts,
    updateProducts = props.updateProducts,
    printBarcodeValue = props.printBarcodeValue;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(10),
    _useState2 = _slicedToArray(_useState, 2),
    qty = _useState2[0],
    setQty = _useState2[1];
  var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_2__.useDispatch)();
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0),
    _useState4 = _slicedToArray(_useState3, 2),
    productId = _useState4[0],
    setProductId = _useState4[1];
  var handleChange = function handleChange(e, singleProduct) {
    setQty(e.target.value);
    setProductId(singleProduct);
    dispatch({
      type: "UPDATE_PRINT_QTY",
      payload: e.target.value
    });
  };
  var onDeleteCartItem = function onDeleteCartItem(id) {
    setUpdateProducts(function (updateProducts) {
      return updateProducts.filter(function (item) {
        return item.id !== id;
      });
    });
  };
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    var findProduct = updateProducts.find(function (items) {
      return items.id === productId;
    });
    setUpdateProducts(function (updateProducts) {
      return updateProducts.map(function (item) {
        return item.id === (findProduct === null || findProduct === void 0 ? void 0 : findProduct.id) ? _objectSpread(_objectSpread({}, item), {}, {
          quantity: Number(qty)
        }) : item;
      });
    });
  }, [qty]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("tbody", {
    children: printBarcodeValue.warehouse_id && updateProducts && updateProducts.length >= 1 ? updateProducts.map(function (singleProduct, index) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("tr", {
        className: "align-middle",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("td", {
          className: "ps-3",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h4", {
            className: "fs-6 mb-1",
            children: singleProduct.code
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
            className: "d-flex align-items-center",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
              className: "badge bg-light-success",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
                children: singleProduct.name
              })
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
            "aria-label": "Product Quantity",
            className: "form-control width-320",
            onKeyPress: function onKeyPress(event) {
              return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_1__.decimalValidate)(event);
            },
            value: singleProduct.quantity,
            onChange: function onChange(e) {
              return handleChange(e, singleProduct.id);
            }
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
          className: "text-start",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
            className: "btn px-4 text-danger fs-3",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__.FontAwesomeIcon, {
              icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__.faTrash,
              onClick: function onClick() {
                return onDeleteCartItem(singleProduct.id);
              }
            })
          })
        })]
      }, index);
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("tr", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
        colSpan: 8,
        className: "fs-5 px-3 py-6 custom-text-center",
        children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_1__.getFormattedMessage)('sale.product.table.no-data.label')
      })
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PrintTable);

/***/ },

/***/ "./resources/pos/src/shared/prepareArray/preparePurchaseArray.js"
/*!***********************************************************************!*\
  !*** ./resources/pos/src/shared/prepareArray/preparePurchaseArray.js ***!
  \***********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   preparePurchaseProductArray: () => (/* binding */ preparePurchaseProductArray)
/* harmony export */ });
var preparePurchaseProductArray = function preparePurchaseProductArray(products, isBarcode) {
  var purchaseProductRowArray = [];
  products.forEach(function (product) {
    var _product$attributes$v, _product$attributes$p;
    purchaseProductRowArray.push({
      name: product.attributes.name,
      code: product.attributes.code,
      variation_type_name: ((_product$attributes$v = product.attributes.variation_product) === null || _product$attributes$v === void 0 ? void 0 : _product$attributes$v.variation_type_name) || null,
      barcode_url: product.attributes.barcode_url,
      stock: product.attributes.stock ? product.attributes.stock.quantity : "",
      // Desglose de stock por CADA almacén (id/nombre/cantidad) --
      // se manda completo para que la tabla pueda elegir el que
      // corresponde según el almacén que esté seleccionado en ese
      // momento, en vez de un solo número fijo calculado de una
      // vez (que quedaría desactualizado si cambias de almacén sin
      // recargar el producto).
      warehouseStock: product.attributes.warehouse || [],
      short_name: (_product$attributes$p = product.attributes.purchase_unit_name) === null || _product$attributes$p === void 0 ? void 0 : _product$attributes$p.short_name,
      product_unit: product.attributes.product_unit,
      product_id: product.id,
      product_cost: product.attributes.product_cost,
      net_unit_cost: product.attributes.product_cost,
      fix_net_unit: product.attributes.product_cost,
      tax_type: product.attributes.tax_type ? product.attributes.tax_type : 1,
      tax_value: product.attributes.order_tax ? product.attributes.order_tax : 0.00,
      tax_amount: 0.00,
      discount_type: '2',
      discount_value: 0.00,
      discount_amount: 0.00,
      purchase_unit: product.attributes.purchase_unit,
      quantity: isBarcode ? 10 : 1,
      sub_total: 0.00,
      id: product.id,
      purchase_item_id: '',
      product_price: product.attributes.product_price
    });
  });
  return purchaseProductRowArray;
};

/***/ },

/***/ "./node_modules/react-to-print/lib/index.js"
/*!**************************************************!*\
  !*** ./node_modules/react-to-print/lib/index.js ***!
  \**************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

!function(e,t){ true?module.exports=t(__webpack_require__(/*! react */ "./node_modules/react/index.js"),__webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js")):0}("undefined"!=typeof self?self:this,(function(e,t){return function(){"use strict";var r={328:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.PrintContextConsumer=t.PrintContext=void 0;var n=r(496),o=Object.prototype.hasOwnProperty.call(n,"createContext");t.PrintContext=o?n.createContext({}):null,t.PrintContextConsumer=t.PrintContext?t.PrintContext.Consumer:function(){return null}},428:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.ReactToPrint=void 0;var n=r(316),o=r(496),i=r(190),a=r(328),c=r(940),s=function(e){function t(){var t=e.apply(this,n.__spreadArray([],n.__read(arguments),!1))||this;return t.startPrint=function(e){var r=t.props,n=r.onAfterPrint,o=r.onPrintError,i=r.print,a=r.documentTitle;setTimeout((function(){var r,c;if(e.contentWindow)if(e.contentWindow.focus(),i)i(e).then((function(){return null==n?void 0:n()})).then((function(){return t.handleRemoveIframe()})).catch((function(e){o?o("print",e):t.logMessages(["An error was thrown by the specified `print` function"])}));else{if(e.contentWindow.print){var s=null!==(c=null===(r=e.contentDocument)||void 0===r?void 0:r.title)&&void 0!==c?c:"",u=e.ownerDocument.title;a&&(e.ownerDocument.title=a,e.contentDocument&&(e.contentDocument.title=a)),e.contentWindow.print(),a&&(e.ownerDocument.title=u,e.contentDocument&&(e.contentDocument.title=s))}else t.logMessages(["Printing for this browser is not currently possible: the browser does not have a `print` method available for iframes."]);null==n||n(),t.handleRemoveIframe()}else t.logMessages(["Printing failed because the `contentWindow` of the print iframe did not load. This is possibly an error with `react-to-print`. Please file an issue: https://github.com/gregnb/react-to-print/issues/"])}),500)},t.triggerPrint=function(e){var r=t.props,n=r.onBeforePrint,o=r.onPrintError;if(n){var i=n();i&&"function"==typeof i.then?i.then((function(){t.startPrint(e)})).catch((function(e){o&&o("onBeforePrint",e)})):t.startPrint(e)}else t.startPrint(e)},t.handlePrint=function(e){var r=t.props,o=r.bodyClass,a=r.content,c=r.copyStyles,s=r.fonts,u=r.pageStyle,l=r.nonce,f="function"==typeof e?e():null;if(f&&"function"==typeof a&&t.logMessages(['"react-to-print" received a `content` prop and a content param passed the callback return by `useReactToPrint. The `content` prop will be ignored.'],"warning"),f||"function"!=typeof a||(f=a()),void 0!==f)if(null!==f){var d=document.createElement("iframe");d.width="".concat(document.documentElement.clientWidth,"px"),d.height="".concat(document.documentElement.clientHeight,"px"),d.style.position="absolute",d.style.top="-".concat(document.documentElement.clientHeight+100,"px"),d.style.left="-".concat(document.documentElement.clientWidth+100,"px"),d.id="printWindow",d.srcdoc="<!DOCTYPE html>";var p=(0,i.findDOMNode)(f);if(p){var h=p.cloneNode(!0),y=h instanceof Text,b=document.querySelectorAll("link[rel~='stylesheet'], link[as='style']"),v=y?[]:h.querySelectorAll("img"),g=y?[]:h.querySelectorAll("video"),m=s?s.length:0;t.numResourcesToLoad=b.length+v.length+g.length+m,t.resourcesLoaded=[],t.resourcesErrored=[];var _=function(e,r){t.resourcesLoaded.includes(e)?t.logMessages(["Tried to mark a resource that has already been handled",e],"debug"):(r?(t.logMessages(n.__spreadArray(['"react-to-print" was unable to load a resource but will continue attempting to print the page'],n.__read(r),!1)),t.resourcesErrored.push(e)):t.resourcesLoaded.push(e),t.resourcesLoaded.length+t.resourcesErrored.length===t.numResourcesToLoad&&t.triggerPrint(d))};d.onload=function(){var e,r,i,a;d.onload=null;var f=d.contentDocument||(null===(r=d.contentWindow)||void 0===r?void 0:r.document);if(f){f.body.appendChild(h),s&&((null===(i=d.contentDocument)||void 0===i?void 0:i.fonts)&&(null===(a=d.contentWindow)||void 0===a?void 0:a.FontFace)?s.forEach((function(e){var t=new FontFace(e.family,e.source,{weight:e.weight,style:e.style});d.contentDocument.fonts.add(t),t.loaded.then((function(){_(t)})).catch((function(e){_(t,["Failed loading the font:",t,"Load error:",e])}))})):(s.forEach((function(e){return _(e)})),t.logMessages(['"react-to-print" is not able to load custom fonts because the browser does not support the FontFace API but will continue attempting to print the page'])));var b="function"==typeof u?u():u;if("string"!=typeof b)t.logMessages(['"react-to-print" expected a "string" from `pageStyle` but received "'.concat(typeof b,'". Styles from `pageStyle` will not be applied.')]);else{var m=f.createElement("style");l&&(m.setAttribute("nonce",l),f.head.setAttribute("nonce",l)),m.appendChild(f.createTextNode(b)),f.head.appendChild(m)}if(o&&(e=f.body.classList).add.apply(e,n.__spreadArray([],n.__read(o.split(" ")),!1)),!y){for(var w=y?[]:p.querySelectorAll("canvas"),P=f.querySelectorAll("canvas"),O=0;O<w.length;++O){var x=w[O],S=P[O].getContext("2d");S&&S.drawImage(x,0,0)}var E=function(e){var t=v[e],r=t.getAttribute("src");if(r){var n=new Image;n.onload=function(){return _(t)},n.onerror=function(e,r,n,o,i){return _(t,["Error loading <img>",t,"Error",i])},n.src=r}else _(t,['Found an <img> tag with an empty "src" attribute. This prevents pre-loading it. The <img> is:',t])};for(O=0;O<v.length;O++)E(O);var T=function(e){var t=g[e];t.preload="auto";var r=t.getAttribute("poster");if(r){var n=new Image;n.onload=function(){return _(t)},n.onerror=function(e,n,o,i,a){return _(t,["Error loading video poster",r,"for video",t,"Error:",a])},n.src=r}else t.readyState>=2?_(t):(t.onloadeddata=function(){return _(t)},t.onerror=function(e,r,n,o,i){return _(t,["Error loading video",t,"Error",i])},t.onstalled=function(){return _(t,["Loading video stalled, skipping",t])})};for(O=0;O<g.length;O++)T(O);var j="input",C=p.querySelectorAll(j),A=f.querySelectorAll(j);for(O=0;O<C.length;O++)A[O].value=C[O].value;var k="input[type=checkbox],input[type=radio]",R=p.querySelectorAll(k),M=f.querySelectorAll(k);for(O=0;O<R.length;O++)M[O].checked=R[O].checked;var D="select",I=p.querySelectorAll(D),q=f.querySelectorAll(D);for(O=0;O<I.length;O++)q[O].value=I[O].value}if(c)for(var F=document.querySelectorAll("style, link[rel~='stylesheet'], link[as='style']"),W=function(e,r){var n=F[e];if("style"===n.tagName.toLowerCase()){var o=f.createElement(n.tagName),i=n.sheet;if(i){var a="";try{for(var c=i.cssRules.length,s=0;s<c;++s)"string"==typeof i.cssRules[s].cssText&&(a+="".concat(i.cssRules[s].cssText,"\r\n"))}catch(e){t.logMessages(["A stylesheet could not be accessed. This is likely due to the stylesheet having cross-origin imports, and many browsers block script access to cross-origin stylesheets. See https://github.com/gregnb/react-to-print/issues/429 for details. You may be able to load the sheet by both marking the stylesheet with the cross `crossorigin` attribute, and setting the `Access-Control-Allow-Origin` header on the server serving the stylesheet. Alternatively, host the stylesheet on your domain to avoid this issue entirely.",n],"warning")}o.setAttribute("id","react-to-print-".concat(e)),l&&o.setAttribute("nonce",l),o.appendChild(f.createTextNode(a)),f.head.appendChild(o)}}else if(n.getAttribute("href"))if(n.hasAttribute("disabled"))t.logMessages(["`react-to-print` encountered a <link> tag with a `disabled` attribute and will ignore it. Note that the `disabled` attribute is deprecated, and some browsers ignore it. You should stop using it. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-disabled. The <link> is:",n],"warning"),_(n);else{for(var u=f.createElement(n.tagName),d=(s=0,n.attributes.length);s<d;++s){var p=n.attributes[s];p&&u.setAttribute(p.nodeName,p.nodeValue||"")}u.onload=function(){return _(u)},u.onerror=function(e,t,r,n,o){return _(u,["Failed to load",u,"Error:",o])},l&&u.setAttribute("nonce",l),f.head.appendChild(u)}else t.logMessages(["`react-to-print` encountered a <link> tag with an empty `href` attribute. In addition to being invalid HTML, this can cause problems in many browsers, and so the <link> was not loaded. The <link> is:",n],"warning"),_(n)},L=(O=0,F.length);O<L;++O)W(O)}0!==t.numResourcesToLoad&&c||t.triggerPrint(d)},t.handleRemoveIframe(!0),document.body.appendChild(d)}else t.logMessages(['"react-to-print" could not locate the DOM node corresponding with the `content` prop'])}else t.logMessages(['There is nothing to print because the "content" prop returned "null". Please ensure "content" is renderable before allowing "react-to-print" to be called.']);else t.logMessages(["To print a functional component ensure it is wrapped with `React.forwardRef`, and ensure the forwarded ref is used. See the README for an example: https://github.com/gregnb/react-to-print#examples"])},t.handleRemoveIframe=function(e){var r=t.props.removeAfterPrint;if(e||r){var n=document.getElementById("printWindow");n&&document.body.removeChild(n)}},t.logMessages=function(e,r){void 0===r&&(r="error"),t.props.suppressErrors||("error"===r?console.error(e):"warning"===r?console.warn(e):"debug"===r&&console.debug(e))},t}return n.__extends(t,e),t.prototype.handleClick=function(e,t){var r=this,n=this.props,o=n.onBeforeGetContent,i=n.onPrintError;if(o){var a=o();a&&"function"==typeof a.then?a.then((function(){return r.handlePrint(t)})).catch((function(e){i&&i("onBeforeGetContent",e)})):this.handlePrint(t)}else this.handlePrint(t)},t.prototype.render=function(){var e=this.props,t=e.children,r=e.trigger;if(r)return o.cloneElement(r(),{onClick:this.handleClick.bind(this)});if(!a.PrintContext)return this.logMessages(['"react-to-print" requires React ^16.3.0 to be able to use "PrintContext"']),null;var n={handlePrint:this.handleClick.bind(this)};return o.createElement(a.PrintContext.Provider,{value:n},t)},t.defaultProps=c.defaultProps,t}(o.Component);t.ReactToPrint=s},940:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.defaultProps=void 0,t.defaultProps={copyStyles:!0,pageStyle:"\n        @page {\n            /* Remove browser default header (title) and footer (url) */\n            margin: 0;\n        }\n        @media print {\n            body {\n                /* Tell browsers to print background colors */\n                -webkit-print-color-adjust: exact; /* Chrome/Safari/Edge/Opera */\n                color-adjust: exact; /* Firefox */\n            }\n        }\n    ",removeAfterPrint:!1,suppressErrors:!1}},892:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.useReactToPrint=void 0;var n=r(316),o=r(496),i=r(428),a=r(940),c=r(860),s=Object.prototype.hasOwnProperty.call(o,"useMemo")&&Object.prototype.hasOwnProperty.call(o,"useCallback");t.useReactToPrint=function(e){if(!s)return e.suppressErrors||console.error('"react-to-print" requires React ^16.8.0 to be able to use "useReactToPrint"'),function(){throw new Error('"react-to-print" requires React ^16.8.0 to be able to use "useReactToPrint"')};var t=o.useMemo((function(){return new i.ReactToPrint(n.__assign(n.__assign({},a.defaultProps),e))}),[e]);return o.useCallback((function(e,r){return(0,c.wrapCallbackWithArgs)(t,t.handleClick,r)(e)}),[t])}},860:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.wrapCallbackWithArgs=void 0;var n=r(316);t.wrapCallbackWithArgs=function(e,t){for(var r=[],o=2;o<arguments.length;o++)r[o-2]=arguments[o];return function(){for(var o=[],i=0;i<arguments.length;i++)o[i]=arguments[i];return t.apply(e,n.__spreadArray(n.__spreadArray([],n.__read(o),!1),n.__read(r),!1))}}},496:function(t){t.exports=e},190:function(e){e.exports=t},316:function(e,t,r){r.r(t),r.d(t,{__addDisposableResource:function(){return D},__assign:function(){return i},__asyncDelegator:function(){return S},__asyncGenerator:function(){return x},__asyncValues:function(){return E},__await:function(){return O},__awaiter:function(){return h},__classPrivateFieldGet:function(){return k},__classPrivateFieldIn:function(){return M},__classPrivateFieldSet:function(){return R},__createBinding:function(){return b},__decorate:function(){return c},__disposeResources:function(){return q},__esDecorate:function(){return u},__exportStar:function(){return v},__extends:function(){return o},__generator:function(){return y},__importDefault:function(){return A},__importStar:function(){return C},__makeTemplateObject:function(){return T},__metadata:function(){return p},__param:function(){return s},__propKey:function(){return f},__read:function(){return m},__rest:function(){return a},__runInitializers:function(){return l},__setFunctionName:function(){return d},__spread:function(){return _},__spreadArray:function(){return P},__spreadArrays:function(){return w},__values:function(){return g}});var n=function(e,t){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])},n(e,t)};function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}var i=function(){return i=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},i.apply(this,arguments)};function a(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]])}return r}function c(e,t,r,n){var o,i=arguments.length,a=i<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(a=(i<3?o(a):i>3?o(t,r,a):o(t,r))||a);return i>3&&a&&Object.defineProperty(t,r,a),a}function s(e,t){return function(r,n){t(r,n,e)}}function u(e,t,r,n,o,i){function a(e){if(void 0!==e&&"function"!=typeof e)throw new TypeError("Function expected");return e}for(var c,s=n.kind,u="getter"===s?"get":"setter"===s?"set":"value",l=!t&&e?n.static?e:e.prototype:null,f=t||(l?Object.getOwnPropertyDescriptor(l,n.name):{}),d=!1,p=r.length-1;p>=0;p--){var h={};for(var y in n)h[y]="access"===y?{}:n[y];for(var y in n.access)h.access[y]=n.access[y];h.addInitializer=function(e){if(d)throw new TypeError("Cannot add initializers after decoration has completed");i.push(a(e||null))};var b=(0,r[p])("accessor"===s?{get:f.get,set:f.set}:f[u],h);if("accessor"===s){if(void 0===b)continue;if(null===b||"object"!=typeof b)throw new TypeError("Object expected");(c=a(b.get))&&(f.get=c),(c=a(b.set))&&(f.set=c),(c=a(b.init))&&o.unshift(c)}else(c=a(b))&&("field"===s?o.unshift(c):f[u]=c)}l&&Object.defineProperty(l,n.name,f),d=!0}function l(e,t,r){for(var n=arguments.length>2,o=0;o<t.length;o++)r=n?t[o].call(e,r):t[o].call(e);return n?r:void 0}function f(e){return"symbol"==typeof e?e:"".concat(e)}function d(e,t,r){return"symbol"==typeof t&&(t=t.description?"[".concat(t.description,"]"):""),Object.defineProperty(e,"name",{configurable:!0,value:r?"".concat(r," ",t):t})}function p(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)}function h(e,t,r,n){return new(r||(r=Promise))((function(o,i){function a(e){try{s(n.next(e))}catch(e){i(e)}}function c(e){try{s(n.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(a,c)}s((n=n.apply(e,t||[])).next())}))}function y(e,t){var r,n,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(c){return function(s){return function(c){if(r)throw new TypeError("Generator is already executing.");for(;i&&(i=0,c[0]&&(a=0)),a;)try{if(r=1,n&&(o=2&c[0]?n.return:c[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,c[1])).done)return o;switch(n=0,o&&(c=[2&c[0],o.value]),c[0]){case 0:case 1:o=c;break;case 4:return a.label++,{value:c[1],done:!1};case 5:a.label++,n=c[1],c=[0];continue;case 7:c=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==c[0]&&2!==c[0])){a=0;continue}if(3===c[0]&&(!o||c[1]>o[0]&&c[1]<o[3])){a.label=c[1];break}if(6===c[0]&&a.label<o[1]){a.label=o[1],o=c;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(c);break}o[2]&&a.ops.pop(),a.trys.pop();continue}c=t.call(e,a)}catch(e){c=[6,e],n=0}finally{r=o=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}([c,s])}}}var b=Object.create?function(e,t,r,n){void 0===n&&(n=r);var o=Object.getOwnPropertyDescriptor(t,r);o&&!("get"in o?!t.__esModule:o.writable||o.configurable)||(o={enumerable:!0,get:function(){return t[r]}}),Object.defineProperty(e,n,o)}:function(e,t,r,n){void 0===n&&(n=r),e[n]=t[r]};function v(e,t){for(var r in e)"default"===r||Object.prototype.hasOwnProperty.call(t,r)||b(t,e,r)}function g(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}function m(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,o,i=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=i.next()).done;)a.push(n.value)}catch(e){o={error:e}}finally{try{n&&!n.done&&(r=i.return)&&r.call(i)}finally{if(o)throw o.error}}return a}function _(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(m(arguments[t]));return e}function w(){for(var e=0,t=0,r=arguments.length;t<r;t++)e+=arguments[t].length;var n=Array(e),o=0;for(t=0;t<r;t++)for(var i=arguments[t],a=0,c=i.length;a<c;a++,o++)n[o]=i[a];return n}function P(e,t,r){if(r||2===arguments.length)for(var n,o=0,i=t.length;o<i;o++)!n&&o in t||(n||(n=Array.prototype.slice.call(t,0,o)),n[o]=t[o]);return e.concat(n||Array.prototype.slice.call(t))}function O(e){return this instanceof O?(this.v=e,this):new O(e)}function x(e,t,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n,o=r.apply(e,t||[]),i=[];return n={},a("next"),a("throw"),a("return"),n[Symbol.asyncIterator]=function(){return this},n;function a(e){o[e]&&(n[e]=function(t){return new Promise((function(r,n){i.push([e,t,r,n])>1||c(e,t)}))})}function c(e,t){try{(r=o[e](t)).value instanceof O?Promise.resolve(r.value.v).then(s,u):l(i[0][2],r)}catch(e){l(i[0][3],e)}var r}function s(e){c("next",e)}function u(e){c("throw",e)}function l(e,t){e(t),i.shift(),i.length&&c(i[0][0],i[0][1])}}function S(e){var t,r;return t={},n("next"),n("throw",(function(e){throw e})),n("return"),t[Symbol.iterator]=function(){return this},t;function n(n,o){t[n]=e[n]?function(t){return(r=!r)?{value:O(e[n](t)),done:!1}:o?o(t):t}:o}}function E(e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var t,r=e[Symbol.asyncIterator];return r?r.call(e):(e=g(e),t={},n("next"),n("throw"),n("return"),t[Symbol.asyncIterator]=function(){return this},t);function n(r){t[r]=e[r]&&function(t){return new Promise((function(n,o){!function(e,t,r,n){Promise.resolve(n).then((function(t){e({value:t,done:r})}),t)}(n,o,(t=e[r](t)).done,t.value)}))}}}function T(e,t){return Object.defineProperty?Object.defineProperty(e,"raw",{value:t}):e.raw=t,e}var j=Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t};function C(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)"default"!==r&&Object.prototype.hasOwnProperty.call(e,r)&&b(t,e,r);return j(t,e),t}function A(e){return e&&e.__esModule?e:{default:e}}function k(e,t,r,n){if("a"===r&&!n)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!n:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===r?n:"a"===r?n.call(e):n?n.value:t.get(e)}function R(e,t,r,n,o){if("m"===n)throw new TypeError("Private method is not writable");if("a"===n&&!o)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof t?e!==t||!o:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===n?o.call(e,r):o?o.value=r:t.set(e,r),r}function M(e,t){if(null===t||"object"!=typeof t&&"function"!=typeof t)throw new TypeError("Cannot use 'in' operator on non-object");return"function"==typeof e?t===e:e.has(t)}function D(e,t,r){if(null!=t){if("object"!=typeof t&&"function"!=typeof t)throw new TypeError("Object expected.");var n;if(r){if(!Symbol.asyncDispose)throw new TypeError("Symbol.asyncDispose is not defined.");n=t[Symbol.asyncDispose]}if(void 0===n){if(!Symbol.dispose)throw new TypeError("Symbol.dispose is not defined.");n=t[Symbol.dispose]}if("function"!=typeof n)throw new TypeError("Object not disposable.");e.stack.push({value:t,dispose:n,async:r})}else r&&e.stack.push({async:!0});return t}var I="function"==typeof SuppressedError?SuppressedError:function(e,t,r){var n=new Error(r);return n.name="SuppressedError",n.error=e,n.suppressed=t,n};function q(e){function t(t){e.error=e.hasError?new I(t,e.error,"An error was suppressed during disposal."):t,e.hasError=!0}return function r(){for(;e.stack.length;){var n=e.stack.pop();try{var o=n.dispose&&n.dispose.call(n.value);if(n.async)return Promise.resolve(o).then(r,(function(e){return t(e),r()}))}catch(e){t(e)}}if(e.hasError)throw e.error}()}t.default={__extends:o,__assign:i,__rest:a,__decorate:c,__param:s,__metadata:p,__awaiter:h,__generator:y,__createBinding:b,__exportStar:v,__values:g,__read:m,__spread:_,__spreadArrays:w,__spreadArray:P,__await:O,__asyncGenerator:x,__asyncDelegator:S,__asyncValues:E,__makeTemplateObject:T,__importStar:C,__importDefault:A,__classPrivateFieldGet:k,__classPrivateFieldSet:R,__classPrivateFieldIn:M,__addDisposableResource:D,__disposeResources:q}}},n={};function o(e){var t=n[e];if(void 0!==t)return t.exports;var i=n[e]={exports:{}};return r[e](i,i.exports,o),i.exports}o.d=function(e,t){for(var r in t)o.o(t,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var i={};return function(){var e=i;Object.defineProperty(e,"__esModule",{value:!0}),e.useReactToPrint=e.ReactToPrint=e.PrintContextConsumer=void 0;var t=o(328);Object.defineProperty(e,"PrintContextConsumer",{enumerable:!0,get:function(){return t.PrintContextConsumer}});var r=o(428);Object.defineProperty(e,"ReactToPrint",{enumerable:!0,get:function(){return r.ReactToPrint}});var n=o(892);Object.defineProperty(e,"useReactToPrint",{enumerable:!0,get:function(){return n.useReactToPrint}});var a=o(428);e.default=a.ReactToPrint}(),i}()}));

/***/ },

/***/ "./resources/pos/src/shared/option-lists/paperSize.json"
/*!**************************************************************!*\
  !*** ./resources/pos/src/shared/option-lists/paperSize.json ***!
  \**************************************************************/
(module) {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('[{"label":"40 per sheet (a4) (1.799 * 1.003) | printer: A4 (8.27 * 11.69 in)","value":1},{"label":"30 per sheet (2.625 * 1) | printer: A4 (8.27 * 11.69 in)","value":2},{"label":"24 per sheet (a4) (2.48 * 1.334) | printer: A4 (8.27 * 11.69 in)","value":3},{"label":"20 per sheet (4 * 1) | printer: A4 (8.27 * 11.69 in)","value":4},{"label":"18 per sheet (a4) (2.5 * 1.835) | printer: A4 (8.27 * 11.69 in)","value":5},{"label":"14 per sheet (4 * 1.33) | printer: A4 (8.27 * 11.69 in)","value":6},{"label":"12 per sheet (a4) (2.5 * 2.834) | printer: A4 (8.27 * 11.69 in)","value":7},{"label":"10 per sheet (4 * 2) | printer: A4 (8.27 * 11.69 in)","value":8},{"label":"thermal label (58mm roll) | printer: 58mm (2.28 in width)","value":9}]');

/***/ }

}]);