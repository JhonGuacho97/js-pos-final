"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["adjustments"],{

/***/ "./resources/pos/src/components/adjustments/AdjustMentDetail.js"
/*!**********************************************************************!*\
  !*** ./resources/pos/src/components/adjustments/AdjustMentDetail.js ***!
  \**********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-bootstrap/Modal */ "./node_modules/react-bootstrap/esm/Modal.js");
/* harmony import */ var _store_action_frontSettingAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../store/action/frontSettingAction */ "./resources/pos/src/store/action/frontSettingAction.js");
/* harmony import */ var _store_action_adjustMentDetailsAction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../store/action/adjustMentDetailsAction */ "./resources/pos/src/store/action/adjustMentDetailsAction.js");
/* harmony import */ var react_bootstrap_Table__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-bootstrap/Table */ "./node_modules/react-bootstrap/esm/Table.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! dayjs */ "./node_modules/dayjs/dayjs.min.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(dayjs__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! dayjs/plugin/utc */ "./node_modules/dayjs/plugin/utc.js");
/* harmony import */ var dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! dayjs/plugin/localizedFormat */ "./node_modules/dayjs/plugin/localizedFormat.js");
/* harmony import */ var dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! dayjs/plugin/isoWeek */ "./node_modules/dayjs/plugin/isoWeek.js");
/* harmony import */ var dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! dayjs/plugin/relativeTime */ "./node_modules/dayjs/plugin/relativeTime.js");
/* harmony import */ var dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");











dayjs__WEBPACK_IMPORTED_MODULE_6___default().extend((dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_7___default()));
dayjs__WEBPACK_IMPORTED_MODULE_6___default().extend((dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_8___default()));
dayjs__WEBPACK_IMPORTED_MODULE_6___default().extend((dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_9___default()));
dayjs__WEBPACK_IMPORTED_MODULE_6___default().extend((dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_10___default()));


var AdjustMentDetail = function AdjustMentDetail(props) {
  var onDetails = props.onDetails,
    lgShow = props.lgShow,
    setLgShow = props.setLgShow,
    fetchFrontSetting = props.fetchFrontSetting,
    adjustmentsDetails = props.adjustmentsDetails,
    getAdjustmentDetails = props.getAdjustmentDetails;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchFrontSetting();
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (onDetails !== null) {
      getAdjustmentDetails(onDetails);
    }
  }, [onDetails]);
  var onsetLgShow = function onsetLgShow() {
    setLgShow(false);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("div", {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_2__["default"], {
      size: "lg",
      "aria-labelledby": "example-custom-modal-styling-title",
      show: lgShow,
      onHide: function onHide() {
        return onsetLgShow();
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_2__["default"].Header, {
        closeButton: true,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_2__["default"].Title, {
          id: "example-modal-sizes-title-lg",
          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)("adjustments.detail.title")
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_2__["default"].Body, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("div", {
          className: "mw-100 overflow-auto",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("div", {
            className: "mx-2",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)(react_bootstrap_Table__WEBPACK_IMPORTED_MODULE_5__["default"], {
              bordered: true,
              hover: true,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("thead", {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("tr", {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("th", {
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)("react-data-table.date.column.label")
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("th", {
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)("globally.detail.reference")
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("th", {
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)("globally.detail.warehouse")
                  })]
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("tbody", {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("tr", {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
                    children: adjustmentsDetails && adjustmentsDetails.attributes && dayjs__WEBPACK_IMPORTED_MODULE_6___default()(adjustmentsDetails.attributes.date).format('YYYY-MM-DD')
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
                    children: adjustmentsDetails && adjustmentsDetails.attributes && adjustmentsDetails.attributes.reference_code
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
                    children: adjustmentsDetails && adjustmentsDetails.attributes && adjustmentsDetails.attributes.warehouse_name
                  })]
                })
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("div", {
            className: "mx-2",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)(react_bootstrap_Table__WEBPACK_IMPORTED_MODULE_5__["default"], {
              bordered: true,
              hover: true,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("thead", {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("tr", {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("th", {
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)("globally.detail.product")
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("th", {
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)("product.product-details.code-product.label")
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("th", {
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)("dashboard.stockAlert.quantity.label")
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("th", {
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)("globally.type.label")
                  })]
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("tbody", {
                children: adjustmentsDetails && adjustmentsDetails.attributes && adjustmentsDetails.attributes.adjustment_items.map(function (item, index) {
                  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("tr", {
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
                      children: item.product.name
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
                      children: item.product.code
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
                      children: item.quantity
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
                      children: item.method_type === 1 ? 'Addition' : "Subtraction"
                    })]
                  }, index);
                })
              })]
            })
          })]
        })
      })]
    })
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var adjustments = state.adjustments,
    adjustmentsDetails = state.adjustmentsDetails,
    isLoading = state.isLoading,
    frontSetting = state.frontSetting;
  return {
    adjustments: adjustments,
    adjustmentsDetails: adjustmentsDetails,
    isLoading: isLoading,
    frontSetting: frontSetting
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, {
  fetchFrontSetting: _store_action_frontSettingAction__WEBPACK_IMPORTED_MODULE_3__.fetchFrontSetting,
  getAdjustmentDetails: _store_action_adjustMentDetailsAction__WEBPACK_IMPORTED_MODULE_4__.getAdjustmentDetails
})(AdjustMentDetail));

/***/ },

/***/ "./resources/pos/src/components/adjustments/AdjustmentForm.js"
/*!********************************************************************!*\
  !*** ./resources/pos/src/components/adjustments/AdjustmentForm.js ***!
  \********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! dayjs */ "./node_modules/dayjs/dayjs.min.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(dayjs__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! dayjs/plugin/utc */ "./node_modules/dayjs/plugin/utc.js");
/* harmony import */ var dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! dayjs/plugin/localizedFormat */ "./node_modules/dayjs/plugin/localizedFormat.js");
/* harmony import */ var dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! dayjs/plugin/isoWeek */ "./node_modules/dayjs/plugin/isoWeek.js");
/* harmony import */ var dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! dayjs/plugin/relativeTime */ "./node_modules/dayjs/plugin/relativeTime.js");
/* harmony import */ var dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _store_action_productAction__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../store/action/productAction */ "./resources/pos/src/store/action/productAction.js");
/* harmony import */ var _store_action_adjustMentAction__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../store/action/adjustMentAction */ "./resources/pos/src/store/action/adjustMentAction.js");
/* harmony import */ var _shared_components_product_cart_search_ProductSearch__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../shared/components/product-cart/search/ProductSearch */ "./resources/pos/src/shared/components/product-cart/search/ProductSearch.js");
/* harmony import */ var _shared_components_adjustments_AdjustmentRowTable__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../shared/components/adjustments/AdjustmentRowTable */ "./resources/pos/src/shared/components/adjustments/AdjustmentRowTable.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _shared_datepicker_ReactDatePicker__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../shared/datepicker/ReactDatePicker */ "./resources/pos/src/shared/datepicker/ReactDatePicker.js");
/* harmony import */ var _shared_prepareArray_prepareSaleArray__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../shared/prepareArray/prepareSaleArray */ "./resources/pos/src/shared/prepareArray/prepareSaleArray.js");
/* harmony import */ var _shared_components_modelFooter__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../shared/components/modelFooter */ "./resources/pos/src/shared/components/modelFooter.js");
/* harmony import */ var _store_action_toastAction__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../store/action/toastAction */ "./resources/pos/src/store/action/toastAction.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _store_action_frontSettingAction__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../store/action/frontSettingAction */ "./resources/pos/src/store/action/frontSettingAction.js");
/* harmony import */ var _shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../shared/select/reactSelect */ "./resources/pos/src/shared/select/reactSelect.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
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







dayjs__WEBPACK_IMPORTED_MODULE_2___default().extend((dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_3___default()));
dayjs__WEBPACK_IMPORTED_MODULE_2___default().extend((dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_4___default()));
dayjs__WEBPACK_IMPORTED_MODULE_2___default().extend((dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_5___default()));
dayjs__WEBPACK_IMPORTED_MODULE_2___default().extend((dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_6___default()));














var AdjustmentForm = function AdjustmentForm(props) {
  var addAdjustmentData = props.addAdjustmentData,
    editAdjustment = props.editAdjustment,
    id = props.id,
    warehouses = props.warehouses,
    singleAdjustMent = props.singleAdjustMent,
    customProducts = props.customProducts,
    products = props.products,
    fetchProductsByWarehouse = props.fetchProductsByWarehouse,
    fetchFrontSetting = props.fetchFrontSetting,
    frontSetting = props.frontSetting;
  var navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_1__.useNavigate)();
  var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_7__.useDispatch)();
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    updateProducts = _useState2[0],
    setUpdateProducts = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0),
    _useState4 = _slicedToArray(_useState3, 2),
    quantity = _useState4[0],
    setQuantity = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      date: new Date(),
      warehouse_id: '',
      notes: singleAdjustMent ? singleAdjustMent.notes : '',
      AdjustmentType: {
        label: 'Addition',
        value: 1
      }
    }),
    _useState6 = _slicedToArray(_useState5, 2),
    adjustMentValue = _useState6[0],
    setAdjustMentValue = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      date: '',
      warehouse_id: '',
      AdjustmentType: ''
    }),
    _useState8 = _slicedToArray(_useState7, 2),
    errors = _useState8[0],
    setErrors = _useState8[1];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    setUpdateProducts(updateProducts);
  }, [updateProducts, quantity]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    updateProducts.length >= 1 ? dispatch({
      type: 'DISABLE_OPTION',
      payload: true
    }) : dispatch({
      type: 'DISABLE_OPTION',
      payload: false
    });
  }, [updateProducts]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchFrontSetting();
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    var _adjustMentValue$ware;
    adjustMentValue.warehouse_id.value && fetchProductsByWarehouse(adjustMentValue === null || adjustMentValue === void 0 || (_adjustMentValue$ware = adjustMentValue.warehouse_id) === null || _adjustMentValue$ware === void 0 ? void 0 : _adjustMentValue$ware.value);
  }, [adjustMentValue.warehouse_id.value]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (singleAdjustMent) {
      setAdjustMentValue({
        date: singleAdjustMent ? dayjs__WEBPACK_IMPORTED_MODULE_2___default()(singleAdjustMent.date).toDate() : '',
        warehouse_id: singleAdjustMent ? singleAdjustMent.warehouse_id : '',
        AdjustmentType: singleAdjustMent ? singleAdjustMent.AdjustmentType : ''
      });
    }
  }, [singleAdjustMent]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (singleAdjustMent) {
      setUpdateProducts(singleAdjustMent.adjustment_items);
    }
  }, []);
  var handleValidation = function handleValidation() {
    var error = {};
    var isValid = false;
    var qtyCart = updateProducts.filter(function (a) {
      return a.quantity === 0;
    });
    if (!adjustMentValue.date) {
      error['date'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)('globally.date.validate.label');
    } else if (!adjustMentValue.warehouse_id) {
      error['warehouse_id'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)('product.input.warehouse.validate.label');
    } else if (qtyCart.length > 0) {
      dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_16__.addToast)({
        text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)('globally.product-quantity.validate.message'),
        type: _constants__WEBPACK_IMPORTED_MODULE_17__.toastType.ERROR
      }));
    } else if (updateProducts.length < 1) {
      dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_16__.addToast)({
        text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)('purchase.product-list.validate.message'),
        type: _constants__WEBPACK_IMPORTED_MODULE_17__.toastType.ERROR
      }));
    } else {
      isValid = true;
    }
    setErrors(error);
    return isValid;
  };
  var onWarehouseChange = function onWarehouseChange(obj) {
    setAdjustMentValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, {
        warehouse_id: obj
      });
    });
    setErrors('');
  };
  var updatedQty = function updatedQty(qty) {
    setQuantity(qty);
  };
  var handleCallback = function handleCallback(date) {
    setAdjustMentValue(function (previousState) {
      return _objectSpread(_objectSpread({}, previousState), {}, {
        date: date
      });
    });
    setErrors('');
  };
  var prepareFormData = function prepareFormData(prepareData) {
    var formValue = {
      date: dayjs__WEBPACK_IMPORTED_MODULE_2___default()(prepareData.date).toDate(),
      warehouse_id: prepareData.warehouse_id.value ? prepareData.warehouse_id.value : prepareData.warehouse_id,
      note: prepareData.notes,
      adjustment_items: updateProducts.map(function (item) {
        return {
          product_id: item.product_id,
          quantity: item.quantity,
          method_type: item.adjustMethod,
          adjustment_item_id: item.adjustment_item_id
        };
      })
    };
    return formValue;
  };
  var onSubmit = function onSubmit(event) {
    event.preventDefault();
    var valid = handleValidation();
    if (valid) {
      if (singleAdjustMent) {
        editAdjustment(id, prepareFormData(adjustMentValue), navigate);
      } else {
        addAdjustmentData(prepareFormData(adjustMentValue));
        setAdjustMentValue(adjustMentValue);
      }
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("div", {
    className: "card",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("div", {
      className: "card-body",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsxs)("div", {
        className: "row",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("div", {
          className: "col-md-4",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_19__["default"], {
            name: "warehouse_id",
            data: warehouses,
            onChange: onWarehouseChange,
            title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)('warehouse.title'),
            errors: errors['warehouse_id'],
            defaultValue: adjustMentValue.warehouse_id,
            value: adjustMentValue.warehouse_id,
            addSearchItems: singleAdjustMent,
            isWarehouseDisable: true,
            placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.placeholderText)('purchase.select.warehouse.placeholder.label')
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsxs)("div", {
          className: "col-md-4",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsxs)("label", {
            className: "form-label fs-6 text-gray-700 mb-3",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)('react-data-table.date.column.label'), ":"]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("span", {
            className: "required"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("div", {
            className: "position-relative",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_shared_datepicker_ReactDatePicker__WEBPACK_IMPORTED_MODULE_13__["default"], {
              onChangeDate: handleCallback,
              newStartDate: adjustMentValue.date
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("span", {
            className: "text-danger d-block fw-400 fs-small mt-2",
            children: errors['date'] ? errors['date'] : null
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsxs)("div", {
          className: "mb-10",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)('product.title'), ":"]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_shared_components_product_cart_search_ProductSearch__WEBPACK_IMPORTED_MODULE_10__["default"], {
            values: adjustMentValue,
            products: products,
            handleValidation: handleValidation,
            updateProducts: updateProducts,
            isAllProducts: true,
            setUpdateProducts: setUpdateProducts,
            customProducts: customProducts
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsxs)("div", {
          "class": "custom-responsive",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)('purchase.order-item.table.label'), ":"]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("span", {
            className: "required"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_shared_components_adjustments_AdjustmentRowTable__WEBPACK_IMPORTED_MODULE_11__["default"], {
            updateProducts: updateProducts,
            setUpdateProducts: setUpdateProducts,
            updatedQty: updatedQty,
            frontSetting: frontSetting,
            warehouse: adjustMentValue.warehouse_id
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_shared_components_modelFooter__WEBPACK_IMPORTED_MODULE_15__["default"], {
          onEditRecord: singleAdjustMent,
          onSubmit: onSubmit,
          link: "/app/adjustments"
        })]
      })
    })
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var purchaseProducts = state.purchaseProducts,
    products = state.products,
    frontSetting = state.frontSetting;
  return {
    customProducts: (0,_shared_prepareArray_prepareSaleArray__WEBPACK_IMPORTED_MODULE_14__.prepareSaleProductArray)(products),
    purchaseProducts: purchaseProducts,
    products: products,
    frontSetting: frontSetting
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_7__.connect)(mapStateToProps, {
  editAdjustment: _store_action_adjustMentAction__WEBPACK_IMPORTED_MODULE_9__.editAdjustment,
  fetchProductsByWarehouse: _store_action_productAction__WEBPACK_IMPORTED_MODULE_8__.fetchProductsByWarehouse,
  fetchFrontSetting: _store_action_frontSettingAction__WEBPACK_IMPORTED_MODULE_18__.fetchFrontSetting
})(AdjustmentForm));

/***/ },

/***/ "./resources/pos/src/components/adjustments/Adjustments.js"
/*!*****************************************************************!*\
  !*** ./resources/pos/src/components/adjustments/Adjustments.js ***!
  \*****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! dayjs */ "./node_modules/dayjs/dayjs.min.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(dayjs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! dayjs/plugin/utc */ "./node_modules/dayjs/plugin/utc.js");
/* harmony import */ var dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! dayjs/plugin/localizedFormat */ "./node_modules/dayjs/plugin/localizedFormat.js");
/* harmony import */ var dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! dayjs/plugin/isoWeek */ "./node_modules/dayjs/plugin/isoWeek.js");
/* harmony import */ var dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! dayjs/plugin/relativeTime */ "./node_modules/dayjs/plugin/relativeTime.js");
/* harmony import */ var dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shared/tab-title/TabTitle */ "./resources/pos/src/shared/tab-title/TabTitle.js");
/* harmony import */ var _shared_table_ReactDataTable__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/table/ReactDataTable */ "./resources/pos/src/shared/table/ReactDataTable.js");
/* harmony import */ var _DeleteSaleAdjustMents__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./DeleteSaleAdjustMents */ "./resources/pos/src/components/adjustments/DeleteSaleAdjustMents.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _store_action_frontSettingAction__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../store/action/frontSettingAction */ "./resources/pos/src/store/action/frontSettingAction.js");
/* harmony import */ var _store_action_adjustMentAction__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../store/action/adjustMentAction */ "./resources/pos/src/store/action/adjustMentAction.js");
/* harmony import */ var _shared_action_buttons_ActionButton__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../shared/action-buttons/ActionButton */ "./resources/pos/src/shared/action-buttons/ActionButton.js");
/* harmony import */ var _AdjustMentDetail__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./AdjustMentDetail */ "./resources/pos/src/components/adjustments/AdjustMentDetail.js");
/* harmony import */ var _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../store/action/warehouseAction */ "./resources/pos/src/store/action/warehouseAction.js");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }






dayjs__WEBPACK_IMPORTED_MODULE_1___default().extend((dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_2___default()));
dayjs__WEBPACK_IMPORTED_MODULE_1___default().extend((dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_3___default()));
dayjs__WEBPACK_IMPORTED_MODULE_1___default().extend((dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_4___default()));
dayjs__WEBPACK_IMPORTED_MODULE_1___default().extend((dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_5___default()));













var Adjustments = function Adjustments(props) {
  var adjustments = props.adjustments,
    fetchAdjustments = props.fetchAdjustments,
    totalRecord = props.totalRecord,
    isLoading = props.isLoading,
    fetchFrontSetting = props.fetchFrontSetting,
    frontSetting = props.frontSetting,
    warehouses = props.warehouses,
    fetchAllWarehouses = props.fetchAllWarehouses,
    isCallSaleApi = props.isCallSaleApi,
    allConfigData = props.allConfigData;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    deleteModel = _useState2[0],
    setDeleteModel = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    detailsModel = _useState4[0],
    setDetailsModel = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    isShowPaymentModel = _useState6[0],
    setIsShowPaymentModel = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState8 = _slicedToArray(_useState7, 2),
    isDelete = _useState8[0],
    setIsDelete = _useState8[1];
  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState0 = _slicedToArray(_useState9, 2),
    isDetails = _useState0[0],
    setIsDetails = _useState0[1];
  var _useState1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState10 = _slicedToArray(_useState1, 2),
    lgShow = _useState10[0],
    setLgShow = _useState10[1];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchFrontSetting();
    fetchAllWarehouses();
  }, []);
  var currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol;
  var onChange = function onChange(filter) {
    fetchAdjustments(filter, true);
  };

  //adjustments edit function
  var goToEdit = function goToEdit(item) {
    var id = item.id;
    window.location.href = '#/app/adjustments/' + id;
  };

  // delete adjustments function
  var onClickDeleteModel = function onClickDeleteModel() {
    var isDelete = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    setDeleteModel(!deleteModel);
    setIsDelete(isDelete);
  };

  //adjustments details function
  var onClickDetailsModel = function onClickDetailsModel() {
    var isDetails = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    setLgShow(true);
    setIsDetails(isDetails);
  };
  var itemsValue = currencySymbol && adjustments.length >= 0 && adjustments.map(function (item) {
    return {
      reference_code: item.attributes.reference_code,
      total_products: item.attributes.total_products,
      date: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedDate)(item.attributes.created_at, allConfigData && allConfigData),
      time: dayjs__WEBPACK_IMPORTED_MODULE_1___default()(item.attributes.created_at).format('LT'),
      warehouse_name: item.attributes.warehouse_name,
      id: item.id,
      currency: currencySymbol
    };
  });
  var columns = [{
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)('dashboard.recentSales.reference.label'),
    sortField: 'reference_code',
    sortable: false,
    cell: function cell(row) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("span", {
        className: "badge bg-light-danger",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("span", {
          children: row.reference_code
        })
      });
    }
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)('warehouse.title'),
    selector: function selector(row) {
      return row.warehouse_name;
    },
    sortField: 'warehouse_name',
    sortable: false
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)('dashboard.recentSales.total-product.label'),
    sortField: 'total_products',
    sortable: false,
    cell: function cell(row) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("span", {
        className: "badge bg-light-danger",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("span", {
          children: row.total_products
        })
      });
    }
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)('globally.react-table.column.created-date.label'),
    selector: function selector(row) {
      return row.date;
    },
    sortField: 'date',
    sortable: true,
    cell: function cell(row) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("span", {
        className: "badge bg-light-info",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("div", {
          className: "mb-1",
          children: row.time
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("div", {
          children: row.date
        })]
      });
    }
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)('react-data-table.action.column.label'),
    right: true,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    cell: function cell(row) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_shared_action_buttons_ActionButton__WEBPACK_IMPORTED_MODULE_14__["default"], {
        isViewIcon: true,
        goToDetailScreen: onClickDetailsModel,
        item: row,
        goToEditProduct: goToEdit,
        isEditMode: true,
        onClickDeleteModel: onClickDeleteModel
      });
    }
  }];
  var array = warehouses;
  var newFirstElement = {
    attributes: {
      name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)('unit.filter.all.label')
    },
    id: "0"
  };
  var newArray = [newFirstElement].concat(array);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_7__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_17__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_8__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.placeholderText)('adjustments.title')
    }), newArray.length > 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_shared_table_ReactDataTable__WEBPACK_IMPORTED_MODULE_9__["default"], {
      columns: columns,
      items: itemsValue,
      to: "#/app/adjustments/create",
      ButtonValue: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)('adjustments.create.title'),
      isShowPaymentModel: isShowPaymentModel,
      isCallSaleApi: isCallSaleApi,
      onChange: onChange,
      totalRows: totalRecord,
      goToEdit: goToEdit,
      isShowFilterField: true,
      isLoading: isLoading,
      isWarehouseType: true,
      warehouseOptions: newArray,
      warehouses: warehouses
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_DeleteSaleAdjustMents__WEBPACK_IMPORTED_MODULE_10__["default"], {
      onClickDeleteModel: onClickDeleteModel,
      deleteModel: deleteModel,
      onDelete: isDelete
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_AdjustMentDetail__WEBPACK_IMPORTED_MODULE_15__["default"], {
      onClickDetailsModel: onClickDetailsModel,
      detailsModel: detailsModel,
      onDetails: isDetails,
      setLgShow: setLgShow,
      lgShow: lgShow
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var adjustments = state.adjustments,
    totalRecord = state.totalRecord,
    isLoading = state.isLoading,
    frontSetting = state.frontSetting,
    warehouses = state.warehouses,
    isCallSaleApi = state.isCallSaleApi,
    allConfigData = state.allConfigData;
  return {
    adjustments: adjustments,
    totalRecord: totalRecord,
    isLoading: isLoading,
    frontSetting: frontSetting,
    warehouses: warehouses,
    isCallSaleApi: isCallSaleApi,
    allConfigData: allConfigData
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_6__.connect)(mapStateToProps, {
  fetchAdjustments: _store_action_adjustMentAction__WEBPACK_IMPORTED_MODULE_13__.fetchAdjustments,
  fetchAllWarehouses: _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_16__.fetchAllWarehouses,
  fetchFrontSetting: _store_action_frontSettingAction__WEBPACK_IMPORTED_MODULE_12__.fetchFrontSetting
})(Adjustments));

/***/ },

/***/ "./resources/pos/src/components/adjustments/CreateAdjustment.js"
/*!**********************************************************************!*\
  !*** ./resources/pos/src/components/adjustments/CreateAdjustment.js ***!
  \**********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var _AdjustmentForm__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AdjustmentForm */ "./resources/pos/src/components/adjustments/AdjustmentForm.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _header_HeaderTitle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../header/HeaderTitle */ "./resources/pos/src/components/header/HeaderTitle.js");
/* harmony import */ var _store_action_adjustMentAction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../store/action/adjustMentAction */ "./resources/pos/src/store/action/adjustMentAction.js");
/* harmony import */ var _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../store/action/warehouseAction */ "./resources/pos/src/store/action/warehouseAction.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");










var CreateAdjustment = function CreateAdjustment(props) {
  var addAdjustment = props.addAdjustment,
    warehouses = props.warehouses,
    fetchAllWarehouses = props.fetchAllWarehouses;
  var navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_2__.useNavigate)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchAllWarehouses();
  }, []);
  var addAdjustmentData = function addAdjustmentData(formValue) {
    addAdjustment(formValue, navigate);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_4__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_header_HeaderTitle__WEBPACK_IMPORTED_MODULE_5__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)('adjustments.create.title'),
      to: "/app/adjustments"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_AdjustmentForm__WEBPACK_IMPORTED_MODULE_3__["default"], {
      addAdjustmentData: addAdjustmentData,
      warehouses: warehouses
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var warehouses = state.warehouses,
    totalRecord = state.totalRecord;
  return {
    warehouses: warehouses,
    totalRecord: totalRecord
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, {
  addAdjustment: _store_action_adjustMentAction__WEBPACK_IMPORTED_MODULE_6__.addAdjustment,
  fetchAllWarehouses: _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_7__.fetchAllWarehouses
})(CreateAdjustment));

/***/ },

/***/ "./resources/pos/src/components/adjustments/DeleteSaleAdjustMents.js"
/*!***************************************************************************!*\
  !*** ./resources/pos/src/components/adjustments/DeleteSaleAdjustMents.js ***!
  \***************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _shared_action_buttons_DeleteModel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/action-buttons/DeleteModel */ "./resources/pos/src/shared/action-buttons/DeleteModel.js");
/* harmony import */ var _store_action_adjustMentAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../store/action/adjustMentAction */ "./resources/pos/src/store/action/adjustMentAction.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");






var DeleteSale = function DeleteSale(props) {
  var deleteAdjustment = props.deleteAdjustment,
    onDelete = props.onDelete,
    deleteModel = props.deleteModel,
    onClickDeleteModel = props.onClickDeleteModel;
  var deleteAdjustMentClick = function deleteAdjustMentClick() {
    deleteAdjustment(onDelete.id);
    onClickDeleteModel(false);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
    children: deleteModel && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_shared_action_buttons_DeleteModel__WEBPACK_IMPORTED_MODULE_2__["default"], {
      onClickDeleteModel: onClickDeleteModel,
      deleteModel: deleteModel,
      deleteUserClick: deleteAdjustMentClick,
      name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.getFormattedMessage)('adjustments.title')
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(null, {
  deleteAdjustment: _store_action_adjustMentAction__WEBPACK_IMPORTED_MODULE_3__.deleteAdjustment
})(DeleteSale));

/***/ },

/***/ "./resources/pos/src/components/adjustments/EditAdjustMent.js"
/*!********************************************************************!*\
  !*** ./resources/pos/src/components/adjustments/EditAdjustMent.js ***!
  \********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _header_HeaderTitle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../header/HeaderTitle */ "./resources/pos/src/components/header/HeaderTitle.js");
/* harmony import */ var _store_action_adjustMentAction__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../store/action/adjustMentAction */ "./resources/pos/src/store/action/adjustMentAction.js");
/* harmony import */ var _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../store/action/warehouseAction */ "./resources/pos/src/store/action/warehouseAction.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _shared_option_lists_AdjustmentType_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shared/option-lists/AdjustmentType.json */ "./resources/pos/src/shared/option-lists/AdjustmentType.json");
/* harmony import */ var _AdjustmentForm__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./AdjustmentForm */ "./resources/pos/src/components/adjustments/AdjustmentForm.js");
/* harmony import */ var _shared_components_loaders_Spinner__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../shared/components/loaders/Spinner */ "./resources/pos/src/shared/components/loaders/Spinner.js");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");













var EditAdjustMent = function EditAdjustMent(props) {
  var warehouses = props.warehouses,
    fetchAllWarehouses = props.fetchAllWarehouses,
    isLoading = props.isLoading,
    fetchAdjustment = props.fetchAdjustment,
    adjustments = props.adjustments;
  var _useParams = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_2__.useParams)(),
    id = _useParams.id;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchAllWarehouses();
    fetchAdjustment(id);
  }, []);
  var method_type = adjustments.attributes && adjustments.attributes.adjustment_items && adjustments.attributes.adjustment_items.map(function (item) {
    return item.method_type;
  });
  var selectedAdjustMentType = adjustments.attributes && adjustments.attributes.adjustment_items && _shared_option_lists_AdjustmentType_json__WEBPACK_IMPORTED_MODULE_8__.filter(function (item) {
    return item.value === method_type[0];
  });
  var itemsValue = adjustments && adjustments.attributes && {
    date: adjustments.attributes.date,
    warehouse_id: {
      value: adjustments.attributes.warehouse_id,
      label: adjustments.attributes.warehouse_name
    },
    adjustment_items: adjustments.attributes.adjustment_items.map(function (item) {
      return {
        code: item.product && item.product.code,
        name: item.product && item.product.name,
        product_unit: item.product.product_unit,
        product_id: item.product_id,
        short_name: item.sale_unit && item.sale_unit,
        stock_alert: item.product && item.product.stock_alert,
        product_price: item.product && item.product.product_price,
        fix_net_unit: item.product && item.product.product_price,
        net_unit_price: item.product && item.product.product_price,
        tax_type: item.product && item.product.tax_type,
        tax_value: item.tax_value,
        tax_amount: item.tax_amount,
        discount_type: item.discount_type,
        discount_value: item.discount_value,
        discount_amount: item.discount_amount,
        sub_total: item.sub_total,
        sale_unit: item.product && item.product.sale_unit,
        quantity: item.quantity,
        stock: item.product && item.product.stocks.filter(function (items) {
          return items.warehouse_id === adjustments.attributes.warehouse_id;
        }),
        id: item.product_id,
        sale_item_id: item.id,
        newItem: '',
        adjustMethod: item.method_type,
        isEdit: true,
        adjustment_item_id: item.id
      };
    }),
    id: adjustments.id,
    notes: adjustments.attributes.note,
    AdjustmentType: {
      label: selectedAdjustMentType && selectedAdjustMentType[0] && selectedAdjustMentType[0].label,
      value: selectedAdjustMentType && selectedAdjustMentType[0] && selectedAdjustMentType[0].value
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_3__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_11__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_header_HeaderTitle__WEBPACK_IMPORTED_MODULE_4__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)('adjustments.edit.title'),
      to: "/app/adjustments"
    }), isLoading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_shared_components_loaders_Spinner__WEBPACK_IMPORTED_MODULE_10__["default"], {}) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_AdjustmentForm__WEBPACK_IMPORTED_MODULE_9__["default"], {
      singleAdjustMent: itemsValue,
      id: id,
      warehouses: warehouses
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var warehouses = state.warehouses,
    isLoading = state.isLoading,
    adjustments = state.adjustments;
  return {
    warehouses: warehouses,
    isLoading: isLoading,
    adjustments: adjustments
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, {
  fetchAllWarehouses: _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_6__.fetchAllWarehouses,
  fetchAdjustment: _store_action_adjustMentAction__WEBPACK_IMPORTED_MODULE_5__.fetchAdjustment
})(EditAdjustMent));

/***/ },

/***/ "./resources/pos/src/shared/components/adjustments/AdjustmentRowTable.js"
/*!*******************************************************************************!*\
  !*** ./resources/pos/src/shared/components/adjustments/AdjustmentRowTable.js ***!
  \*******************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Table.js");
/* harmony import */ var _AdjustmentTableBody__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AdjustmentTableBody */ "./resources/pos/src/shared/components/adjustments/AdjustmentTableBody.js");
/* harmony import */ var _sharedMethod__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");





var AdjustmentRowTable = function AdjustmentRowTable(props) {
  var updateProducts = props.updateProducts,
    setUpdateProducts = props.setUpdateProducts,
    frontSetting = props.frontSetting,
    updateSubTotal = props.updateSubTotal,
    warehouse = props.warehouse;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    setUpdateProducts(updateProducts);
  }, [updateProducts]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"], {
    responsive: true,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("thead", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("tr", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
          children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_3__.getFormattedMessage)('product.title')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
          children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_3__.getFormattedMessage)('product.product-details.code-product.label')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
          children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_3__.getFormattedMessage)('purchase.order-item.table.stock.column.label')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
          className: "text-lg-start text-center",
          children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_3__.getFormattedMessage)('purchase.order-item.table.qty.column.label')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
          children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_3__.getFormattedMessage)('globally.type.label')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
          className: "text-center",
          children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_3__.getFormattedMessage)('react-data-table.action.column.label')
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("tbody", {
      children: updateProducts && updateProducts.length ? updateProducts.map(function (singleProduct, index) {
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_AdjustmentTableBody__WEBPACK_IMPORTED_MODULE_2__["default"], {
          singleProduct: singleProduct,
          index: index,
          updateProducts: updateProducts,
          warehouse: warehouse,
          setUpdateProducts: setUpdateProducts,
          frontSetting: frontSetting,
          updateSubTotal: updateSubTotal
        }, index);
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("tr", {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("td", {
          colSpan: 6,
          className: "fs-5 px-3 py-6 custom-text-center",
          children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_3__.getFormattedMessage)('sale.product.table.no-data.label')
        })
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AdjustmentRowTable);

/***/ },

/***/ "./resources/pos/src/shared/components/adjustments/AdjustmentTableBody.js"
/*!********************************************************************************!*\
  !*** ./resources/pos/src/shared/components/adjustments/AdjustmentTableBody.js ***!
  \********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/InputGroup.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap/Form */ "./node_modules/react-bootstrap/esm/Form.js");
/* harmony import */ var _store_action_productSaleUnitAction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../store/action/productSaleUnitAction */ "./resources/pos/src/store/action/productSaleUnitAction.js");
/* harmony import */ var _sharedMethod__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "./node_modules/@fortawesome/react-fontawesome/index.es.js");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.mjs");
/* harmony import */ var _shared_option_lists_AdjustmentType_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../shared/option-lists/AdjustmentType.json */ "./resources/pos/src/shared/option-lists/AdjustmentType.json");
/* harmony import */ var _shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../shared/select/reactSelect */ "./resources/pos/src/shared/select/reactSelect.js");
/* harmony import */ var _store_action_pos_posAllProductAction__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../store/action/pos/posAllProductAction */ "./resources/pos/src/store/action/pos/posAllProductAction.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
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












var AdjustmentTableBody = function AdjustmentTableBody(props) {
  var singleProduct = props.singleProduct,
    index = props.index,
    updateProducts = props.updateProducts,
    setUpdateProducts = props.setUpdateProducts,
    posAllProduct = props.posAllProduct,
    posAllProducts = props.posAllProducts,
    warehouse = props.warehouse;
  var onDeleteCartItem = function onDeleteCartItem(id) {
    var newProduct = updateProducts.filter(function (item) {
      return item.id !== id;
    });
    setUpdateProducts(newProduct);
  };
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    posAllProduct(warehouse.value);
  }, []);
  var handleChange = function handleChange(e) {
    e.preventDefault();
    var value = e.target.value;
    // check if value includes a decimal point
    if (value.match(/\./g)) {
      var _value$split = value.split('.'),
        _value$split2 = _slicedToArray(_value$split, 2),
        decimal = _value$split2[1];
      // restrict value to only 2 decimal places
      if ((decimal === null || decimal === void 0 ? void 0 : decimal.length) > 2) {
        // do nothing
        return;
      }
    }
    setUpdateProducts(function (updateProducts) {
      return updateProducts.map(function (item) {
        if (item.id === singleProduct.id) {
          var compareQty = posAllProducts.filter(function (pro) {
            return pro.id === singleProduct.id;
          }).map(function (pro) {
            return pro.attributes.stock.quantity;
          });
          return item.adjustMethod === 2 ? _objectSpread(_objectSpread({}, item), {}, {
            quantity: compareQty[0] < Number(e.target.value) ? compareQty[0] : Number(e.target.value)
          }) : _objectSpread(_objectSpread({}, item), {}, {
            quantity: Number(e.target.value)
          });
        } else {
          return item;
        }
      });
    });
  };
  var handleIncrement = function handleIncrement() {
    setUpdateProducts(function (updateProducts) {
      return updateProducts.map(function (item) {
        if (item.id === singleProduct.id) {
          var compareQty = posAllProducts.filter(function (pro) {
            return pro.id === singleProduct.id;
          }).map(function (pro) {
            return pro.attributes.stock.quantity;
          });
          return _objectSpread(_objectSpread({}, item), {}, {
            quantity: item.adjustMethod === 2 ? compareQty[0] > item.quantity ? item.quantity++ + 1 : compareQty[0] : item.quantity++ + 1
          });
        } else {
          return item;
        }
      });
    });
  };
  var handleDecrement = function handleDecrement() {
    if (singleProduct.quantity - 1 > 0.00) {
      setUpdateProducts(function (updateProducts) {
        return updateProducts.map(function (item) {
          return item.id === singleProduct.id ? _objectSpread(_objectSpread({}, item), {}, {
            quantity: item.quantity-- - 1
          }) : item;
        });
      });
    }
  };
  var onMethodChange = function onMethodChange(obj) {
    setUpdateProducts(function (updateProducts) {
      return updateProducts.map(function (item) {
        return item.id === singleProduct.id ? _objectSpread(_objectSpread({}, item), {}, {
          adjustMethod: obj.value
        }) : item;
      });
    });
    setUpdateProducts(function (updateProducts) {
      return updateProducts.map(function (item) {
        if (item.id === singleProduct.id) {
          var compareQty = posAllProducts.filter(function (pro) {
            return pro.id === singleProduct.id;
          }).map(function (pro) {
            return pro.attributes.stock.quantity;
          });
          return _objectSpread(_objectSpread({}, item), {}, {
            quantity: item.adjustMethod === 2 ? compareQty[0] > item.quantity ? item.quantity++ + 0 : compareQty[0] : item.quantity++
          });
        } else {
          return item;
        }
      });
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("tr", {
    className: "align-middle",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("h4", {
        className: "fs-6 mb-0",
        children: singleProduct.name
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("h4", {
        className: "fs-6 mb-0",
        children: singleProduct.code
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
      children: singleProduct.isEdit ? singleProduct.stock.length >= 1 && singleProduct.stock.map(function (item) {
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
          className: "badge bg-light-warning",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("span", {
            children: [item.quantity, "\xA0", singleProduct.short_name]
          })
        });
      }) : singleProduct.stock >= 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
        className: "badge bg-light-warning",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("span", {
          children: [singleProduct.stock, "\xA0", singleProduct.short_name]
        })
      }) : ''
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
        className: "custom-qty",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"], {
          className: "flex-nowrap",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"].Text, {
            className: "btn btn-primary btn-sm px-4 px-4 pt-2",
            onClick: function onClick(e) {
              return handleDecrement(e);
            },
            children: "-"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_3__["default"].Control, {
            "aria-label": "Product Quantity",
            onKeyPress: function onKeyPress(event) {
              return (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.decimalValidate)(event);
            },
            className: "text-center px-0 py-2 rounded-0 hide-arrow",
            value: singleProduct.quantity,
            type: "number",
            step: 0.01,
            min: 0.00,
            onChange: function onChange(e) {
              return handleChange(e);
            }
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"].Text, {
            className: "btn btn-primary btn-sm px-4 px-4 pt-2",
            onClick: function onClick(e) {
              return handleIncrement(e);
            },
            children: "+"
          })]
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_9__["default"], {
        name: "AdjustmentType",
        data: _shared_option_lists_AdjustmentType_json__WEBPACK_IMPORTED_MODULE_8__,
        onChange: onMethodChange,
        defaultValue: singleProduct.isEdit ? singleProduct.adjustMethod === 1 ? _shared_option_lists_AdjustmentType_json__WEBPACK_IMPORTED_MODULE_8__[0] : _shared_option_lists_AdjustmentType_json__WEBPACK_IMPORTED_MODULE_8__[1] : _shared_option_lists_AdjustmentType_json__WEBPACK_IMPORTED_MODULE_8__[0],
        isRequired: true
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
      className: "text-center",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
        className: "btn px-2 text-danger fs-3",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_6__.FontAwesomeIcon, {
          icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_7__.faTrash,
          onClick: function onClick() {
            return onDeleteCartItem(singleProduct.id);
          }
        })
      })
    })]
  }, index);
};
var mapStateToProps = function mapStateToProps(state) {
  var productSales = state.productSales,
    posAllProducts = state.posAllProducts;
  return {
    productSales: productSales,
    posAllProducts: posAllProducts
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_2__.connect)(mapStateToProps, {
  productSalesDropdown: _store_action_productSaleUnitAction__WEBPACK_IMPORTED_MODULE_4__.productSalesDropdown,
  posAllProduct: _store_action_pos_posAllProductAction__WEBPACK_IMPORTED_MODULE_10__.posAllProduct
})(AdjustmentTableBody));

/***/ },

/***/ "./resources/pos/src/shared/prepareArray/prepareSaleArray.js"
/*!*******************************************************************!*\
  !*** ./resources/pos/src/shared/prepareArray/prepareSaleArray.js ***!
  \*******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   prepareSaleProductArray: () => (/* binding */ prepareSaleProductArray)
/* harmony export */ });
var prepareSaleProductArray = function prepareSaleProductArray(products) {
  var saleProductRowArray = [];
  products.forEach(function (product) {
    var _product$attributes, _product$attributes2;
    saleProductRowArray.push({
      name: product.attributes.name,
      code: product.attributes.code,
      stock: product.attributes.stock ? product.attributes.stock.quantity : "",
      short_name: (_product$attributes = product.attributes) === null || _product$attributes === void 0 || (_product$attributes = _product$attributes.sale_unit_name) === null || _product$attributes === void 0 ? void 0 : _product$attributes.short_name,
      product_unit: product.attributes.product_unit,
      product_id: product.id,
      product_price: product.attributes.product_price,
      net_unit_price: product.attributes.product_price,
      fix_net_unit: product.attributes.product_price,
      tax_type: product.attributes.tax_type ? product.attributes.tax_type : 1,
      tax_value: product.attributes.order_tax ? product.attributes.order_tax : 0.00,
      tax_amount: 0.00,
      discount_type: '2',
      discount_value: 0.00,
      discount_amount: 0.00,
      sale_unit: (_product$attributes2 = product.attributes) !== null && _product$attributes2 !== void 0 && (_product$attributes2 = _product$attributes2.sale_unit) !== null && _product$attributes2 !== void 0 && _product$attributes2.id ? Number(product.attributes.sale_unit.id) : Number(product.attributes.sale_unit),
      quantity: 1,
      sub_total: 0.00,
      id: product.id,
      sale_item_id: '',
      sale_return_item_id: '',
      adjustMethod: 1,
      adjustment_item_id: "",
      quotation_item_id: "",
      quantity_limit: product.attributes.quantity_limit
    });
  });
  return saleProductRowArray;
};

/***/ },

/***/ "./resources/pos/src/store/action/adjustMentAction.js"
/*!************************************************************!*\
  !*** ./resources/pos/src/store/action/adjustMentAction.js ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addAdjustment: () => (/* binding */ addAdjustment),
/* harmony export */   deleteAdjustment: () => (/* binding */ deleteAdjustment),
/* harmony export */   editAdjustment: () => (/* binding */ editAdjustment),
/* harmony export */   fetchAdjustment: () => (/* binding */ fetchAdjustment),
/* harmony export */   fetchAdjustments: () => (/* binding */ fetchAdjustments)
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









var fetchAdjustments = function fetchAdjustments() {
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
            admin = true;
            url = _constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.ADJUSTMENTS;
            if (!_.isEmpty(filter) && (filter.page || filter.pageSize || filter.search)) {
              url += (0,_shared_requestParam__WEBPACK_IMPORTED_MODULE_5__["default"])(filter, admin, null, null, url);
            }
            _context.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].get(url).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.adjustMentActionType.FETCH_ADJUSTMENTS,
                payload: response.data.data
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
var fetchAdjustment = function fetchAdjustment(adjustmentId, singleAdjustment) {
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
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].get(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.ADJUSTMENTS + "/" + adjustmentId + "/edit", singleAdjustment).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.adjustMentActionType.FETCH_ADJUSTMENT,
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
var addAdjustment = function addAdjustment(adjustment, navigate) {
  return /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(dispatch) {
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_8__.setSavingButton)(true));
            _context3.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].post(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.ADJUSTMENTS, adjustment).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.adjustMentActionType.ADD_ADJUSTMENTS,
                payload: response.data.data
              });
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("Adjustment.success.create.message")
              }));
              dispatch((0,_totalRecordAction__WEBPACK_IMPORTED_MODULE_3__.addInToTotalRecord)(1));
              navigate("/app/adjustments");
              dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_8__.setSavingButton)(false));
            })["catch"](function (_ref6) {
              var response = _ref6.response;
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
var editAdjustment = function editAdjustment(adjustmentId, adjustment, navigate) {
  return /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(dispatch) {
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_8__.setSavingButton)(true));
            _context4.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].patch(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.ADJUSTMENTS + "/" + adjustmentId, adjustment).then(function (response) {
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("Adjustment.success.edit.message")
              }));
              navigate("/app/adjustments");
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.adjustMentActionType.EDIT_ADJUSTMENTS,
                payload: response.data.data
              });
              dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_8__.setSavingButton)(false));
            })["catch"](function (_ref8) {
              var response = _ref8.response;
              dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_8__.setSavingButton)(false));
              response && dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
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
      return _ref7.apply(this, arguments);
    };
  }();
};
var deleteAdjustment = function deleteAdjustment(userId) {
  return /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(dispatch) {
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            _context5.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"]["delete"](_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.ADJUSTMENTS + "/" + userId).then(function () {
              dispatch((0,_totalRecordAction__WEBPACK_IMPORTED_MODULE_3__.removeFromTotalRecord)(1));
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.adjustMentActionType.DELETE_ADJUSTMENT,
                payload: userId
              });
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("Adjustment.success.delete.message")
              }));
            })["catch"](function (_ref0) {
              var response = _ref0.response;
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
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
      return _ref9.apply(this, arguments);
    };
  }();
};

/***/ },

/***/ "./resources/pos/src/store/action/adjustMentDetailsAction.js"
/*!*******************************************************************!*\
  !*** ./resources/pos/src/store/action/adjustMentDetailsAction.js ***!
  \*******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getAdjustmentDetails: () => (/* binding */ getAdjustmentDetails)
/* harmony export */ });
/* harmony import */ var _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config/apiConfig */ "./resources/pos/src/config/apiConfig.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _toastAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./toastAction */ "./resources/pos/src/store/action/toastAction.js");
/* harmony import */ var _loadingAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./loadingAction */ "./resources/pos/src/store/action/loadingAction.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }




var getAdjustmentDetails = function getAdjustmentDetails(adjustmentid) {
  var isLoading = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(dispatch) {
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            if (isLoading) {
              dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_3__.setLoading)(true));
            }
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].get(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.ADJUSTMENTS + '/' + adjustmentid).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.adjustMentActionType.ADJUSTMENT_DETAILS,
                payload: response.data.data
              });
              if (isLoading) {
                dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_3__.setLoading)(false));
              }
            })["catch"](function (error) {
              var _error$response;
              var message = (error === null || error === void 0 || (_error$response = error.response) === null || _error$response === void 0 || (_error$response = _error$response.data) === null || _error$response === void 0 ? void 0 : _error$response.message) || 'Something went wrong';
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: message,
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

/***/ },

/***/ "./resources/pos/src/store/action/pos/posAllProductAction.js"
/*!*******************************************************************!*\
  !*** ./resources/pos/src/store/action/pos/posAllProductAction.js ***!
  \*******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fetchBrandClickable: () => (/* binding */ fetchBrandClickable),
/* harmony export */   posAllProduct: () => (/* binding */ posAllProduct),
/* harmony export */   posAllProductAction: () => (/* binding */ posAllProductAction)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _config_apiConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../config/apiConfig */ "./resources/pos/src/config/apiConfig.js");
/* harmony import */ var _toastAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../toastAction */ "./resources/pos/src/store/action/toastAction.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }



var posAllProductAction = function posAllProductAction() {
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(dispatch) {
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_1__["default"].get("products?page[size]=0").then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_0__.posProductActionType.POS_ALL_PRODUCT,
                payload: response.data.data
              });
            })["catch"](function (error) {
              var _error$response;
              var message = (error === null || error === void 0 || (_error$response = error.response) === null || _error$response === void 0 || (_error$response = _error$response.data) === null || _error$response === void 0 ? void 0 : _error$response.message) || 'Something went wrong';
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: message,
                type: _constants__WEBPACK_IMPORTED_MODULE_0__.toastType.ERROR
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
var posAllProduct = function posAllProduct(warehouse) {
  return /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(dispatch) {
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_1__["default"].get("products?page[size]=0&warehouse_id=".concat(warehouse)).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_0__.posProductActionType.POS_ALL_PRODUCTS,
                payload: response.data.data
              });
            })["catch"](function (error) {
              var _error$response2;
              var message = (error === null || error === void 0 || (_error$response2 = error.response) === null || _error$response2 === void 0 || (_error$response2 = _error$response2.data) === null || _error$response2 === void 0 ? void 0 : _error$response2.message) || 'Something went wrong';
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: message,
                type: _constants__WEBPACK_IMPORTED_MODULE_0__.toastType.ERROR
              }));
            });
          case 1:
            return _context2.a(2);
        }
      }, _callee2);
    }));
    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }();
};
var fetchBrandClickable = function fetchBrandClickable(brandId, categoryId, warehouse) {
  return /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(dispatch) {
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            _context3.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_1__["default"].get("products?filter[brand_id]=".concat(brandId ? brandId : '', "&filter[product_category_id]=").concat(categoryId ? categoryId : '', "&page[size]=0&warehouse_id=").concat(warehouse ? warehouse : '')).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_0__.productActionType.FETCH_BRAND_CLICKABLE,
                payload: response.data.data
              });
            })["catch"](function (error) {
              var _error$response3;
              var message = (error === null || error === void 0 || (_error$response3 = error.response) === null || _error$response3 === void 0 || (_error$response3 = _error$response3.data) === null || _error$response3 === void 0 ? void 0 : _error$response3.message) || 'Something went wrong';
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: message,
                type: _constants__WEBPACK_IMPORTED_MODULE_0__.toastType.ERROR
              }));
            });
          case 1:
            return _context3.a(2);
        }
      }, _callee3);
    }));
    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }();
};

/***/ },

/***/ "./resources/pos/src/store/action/productSaleUnitAction.js"
/*!*****************************************************************!*\
  !*** ./resources/pos/src/store/action/productSaleUnitAction.js ***!
  \*****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   productSalesDropdown: () => (/* binding */ productSalesDropdown)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _config_apiConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config/apiConfig */ "./resources/pos/src/config/apiConfig.js");
/* harmony import */ var _toastAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./toastAction */ "./resources/pos/src/store/action/toastAction.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }



var productSalesDropdown = function productSalesDropdown(base_sale_value) {
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(dispatch) {
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_1__["default"].get("units?filter[base_unit]=".concat(base_sale_value)).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_0__.saleActionType.PRODUCT_SALES_UNIT,
                payload: response.data.data
              });
            })["catch"](function (error) {
              var _error$response;
              var message = (error === null || error === void 0 || (_error$response = error.response) === null || _error$response === void 0 || (_error$response = _error$response.data) === null || _error$response === void 0 ? void 0 : _error$response.message) || 'Something went wrong';
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: message,
                type: _constants__WEBPACK_IMPORTED_MODULE_0__.toastType.ERROR
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

/***/ "./resources/pos/src/shared/option-lists/AdjustmentType.json"
/*!*******************************************************************!*\
  !*** ./resources/pos/src/shared/option-lists/AdjustmentType.json ***!
  \*******************************************************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('[{"label":"Addition","value":1},{"label":"Subtraction","value":2}]');

/***/ }

}]);