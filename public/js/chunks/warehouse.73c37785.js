"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["warehouse"],{

/***/ "./resources/pos/src/components/warehouse/CreateWarehouse.js"
/*!*******************************************************************!*\
  !*** ./resources/pos/src/components/warehouse/CreateWarehouse.js ***!
  \*******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../store/action/warehouseAction */ "./resources/pos/src/store/action/warehouseAction.js");
/* harmony import */ var _WarehouseForm__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./WarehouseForm */ "./resources/pos/src/components/warehouse/WarehouseForm.js");
/* harmony import */ var _header_HeaderTitle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../header/HeaderTitle */ "./resources/pos/src/components/header/HeaderTitle.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");










var CreateWarehouse = function CreateWarehouse(props) {
  var addWarehouse = props.addWarehouse;
  var navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_2__.useNavigate)();
  var addWarehouseData = function addWarehouseData(formValue) {
    addWarehouse(formValue, navigate, _constants__WEBPACK_IMPORTED_MODULE_7__.Filters.OBJ);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_3__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_header_HeaderTitle__WEBPACK_IMPORTED_MODULE_6__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)('warehouse.create.title'),
      to: "/app/warehouse"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_WarehouseForm__WEBPACK_IMPORTED_MODULE_5__["default"], {
      addWarehouseData: addWarehouseData
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(null, {
  addWarehouse: _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_4__.addWarehouse
})(CreateWarehouse));

/***/ },

/***/ "./resources/pos/src/components/warehouse/DeleteWarehouse.js"
/*!*******************************************************************!*\
  !*** ./resources/pos/src/components/warehouse/DeleteWarehouse.js ***!
  \*******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../store/action/warehouseAction */ "./resources/pos/src/store/action/warehouseAction.js");
/* harmony import */ var _shared_action_buttons_DeleteModel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/action-buttons/DeleteModel */ "./resources/pos/src/shared/action-buttons/DeleteModel.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");






var DeleteWarehouse = function DeleteWarehouse(props) {
  var deleteWarehouse = props.deleteWarehouse,
    onDelete = props.onDelete,
    deleteModel = props.deleteModel,
    onClickDeleteModel = props.onClickDeleteModel;
  var deleteUserClick = function deleteUserClick() {
    deleteWarehouse(onDelete.id);
    onClickDeleteModel(false);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
    children: deleteModel && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_shared_action_buttons_DeleteModel__WEBPACK_IMPORTED_MODULE_3__["default"], {
      onClickDeleteModel: onClickDeleteModel,
      deleteModel: deleteModel,
      deleteUserClick: deleteUserClick,
      name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.getFormattedMessage)('warehouse.title')
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(null, {
  deleteWarehouse: _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_2__.deleteWarehouse
})(DeleteWarehouse));

/***/ },

/***/ "./resources/pos/src/components/warehouse/EditWarehouse.js"
/*!*****************************************************************!*\
  !*** ./resources/pos/src/components/warehouse/EditWarehouse.js ***!
  \*****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../store/action/warehouseAction */ "./resources/pos/src/store/action/warehouseAction.js");
/* harmony import */ var _WarehouseForm__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./WarehouseForm */ "./resources/pos/src/components/warehouse/WarehouseForm.js");
/* harmony import */ var _header_HeaderTitle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../header/HeaderTitle */ "./resources/pos/src/components/header/HeaderTitle.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");










var EditWarehouse = function EditWarehouse(props) {
  var fetchWarehouse = props.fetchWarehouse,
    warehouses = props.warehouses;
  var _useParams = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_2__.useParams)(),
    id = _useParams.id;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchWarehouse(id);
  }, []);
  var itemsValue = warehouses && warehouses.length === 1 && warehouses.map(function (warehouse) {
    return {
      name: warehouse.attributes.name,
      phone: warehouse.attributes.phone,
      country: warehouse.attributes.country,
      city: warehouse.attributes.city,
      email: warehouse.attributes.email,
      zip_code: warehouse.attributes.zip_code,
      id: warehouse.id
    };
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_6__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_8__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_header_HeaderTitle__WEBPACK_IMPORTED_MODULE_5__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)('warehouse.edit.title'),
      to: "/app/warehouse"
    }), warehouses.length === 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_WarehouseForm__WEBPACK_IMPORTED_MODULE_4__["default"], {
      singleWarehouse: itemsValue,
      id: id
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var warehouses = state.warehouses;
  return {
    warehouses: warehouses
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, {
  fetchWarehouse: _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_3__.fetchWarehouse
})(EditWarehouse));

/***/ },

/***/ "./resources/pos/src/components/warehouse/WarehouseDetail.js"
/*!*******************************************************************!*\
  !*** ./resources/pos/src/components/warehouse/WarehouseDetail.js ***!
  \*******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/tab-title/TabTitle */ "./resources/pos/src/shared/tab-title/TabTitle.js");
/* harmony import */ var _header_HeaderTitle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../header/HeaderTitle */ "./resources/pos/src/components/header/HeaderTitle.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Image.js");
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-router */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../store/action/warehouseAction */ "./resources/pos/src/store/action/warehouseAction.js");
/* harmony import */ var _assets_images_brand_logo_png__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../assets/images/brand_logo.png */ "./resources/pos/src/assets/images/brand_logo.png");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");












var WarehouseDetail = function WarehouseDetail() {
  var _useParams = (0,react_router__WEBPACK_IMPORTED_MODULE_6__.useParams)(),
    id = _useParams.id;
  var _useSelector = (0,react_redux__WEBPACK_IMPORTED_MODULE_7__.useSelector)(function (state) {
      return state;
    }),
    warehouseDetails = _useSelector.warehouseDetails;
  var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_7__.useDispatch)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    dispatch((0,_store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_8__.fetchWarehouseDetails)(id));
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_1__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_10__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_2__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.placeholderText)('warehouse.details.title')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_header_HeaderTitle__WEBPACK_IMPORTED_MODULE_3__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.getFormattedMessage)('warehouse.details.title'),
      to: "/app/warehouse"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
      className: "card mt-2 table-responsive",
      children: warehouseDetails.length >= 1 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("table", {
        className: "table",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("thead", {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("tr", {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
              children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.getFormattedMessage)('product.title')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
              children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.getFormattedMessage)('globally.detail.quantity')
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("tbody", {
          children: warehouseDetails.length >= 1 ? warehouseDetails.map(function (item, index) {
            var img = item.product_image && item.product_image.imageUrls && item.product_image.imageUrls[0];
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("tr", {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
                  className: "d-flex align-items-center",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_5__["default"], {
                    src: img ? img : _assets_images_brand_logo_png__WEBPACK_IMPORTED_MODULE_9__["default"],
                    alt: item.product_name,
                    className: "me-2 image image-circle image-mini",
                    height: "50",
                    width: "50"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
                    className: "d-flex flex-column",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
                      children: item.product_name
                    })
                  })]
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
                    className: "badge bg-light-info me-2",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
                      children: item.quantity
                    })
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
                    className: "badge bg-light-success me-2",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
                      children: item.product_unit_name
                    })
                  })]
                })
              })]
            }, index);
          }) : ''
        })]
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
        className: "text-center p-5",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("h5", {
          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.getFormattedMessage)('no-product-found.label')
        })
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WarehouseDetail);

/***/ },

/***/ "./resources/pos/src/components/warehouse/WarehouseForm.js"
/*!*****************************************************************!*\
  !*** ./resources/pos/src/components/warehouse/WarehouseForm.js ***!
  \*****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap/Form */ "./node_modules/react-bootstrap/esm/Form.js");
/* harmony import */ var email_validator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! email-validator */ "./node_modules/email-validator/index.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../store/action/warehouseAction */ "./resources/pos/src/store/action/warehouseAction.js");
/* harmony import */ var _shared_components_modelFooter__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../shared/components/modelFooter */ "./resources/pos/src/shared/components/modelFooter.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
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









var WarehouseForm = function WarehouseForm(props) {
  var addWarehouseData = props.addWarehouseData,
    id = props.id,
    editWarehouse = props.editWarehouse,
    singleWarehouse = props.singleWarehouse;
  var navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_1__.useNavigate)();
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      name: singleWarehouse ? singleWarehouse[0].name : '',
      email: singleWarehouse ? singleWarehouse[0].email : '',
      phone: singleWarehouse ? singleWarehouse[0].phone : '',
      country: singleWarehouse ? singleWarehouse[0].country : '',
      city: singleWarehouse ? singleWarehouse[0].city : '',
      zip_code: singleWarehouse ? singleWarehouse[0].zip_code : ''
    }),
    _useState2 = _slicedToArray(_useState, 2),
    warehouseValue = _useState2[0],
    setWarehouseValue = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      name: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      zip_code: ''
    }),
    _useState4 = _slicedToArray(_useState3, 2),
    errors = _useState4[0],
    setErrors = _useState4[1];
  var disabled = singleWarehouse && singleWarehouse[0].name === warehouseValue.name && singleWarehouse[0].phone === warehouseValue.phone && singleWarehouse[0].country === warehouseValue.country && singleWarehouse[0].city === warehouseValue.city && singleWarehouse[0].email === warehouseValue.email && singleWarehouse[0].zip_code === warehouseValue.zip_code;
  var handleValidation = function handleValidation() {
    var errorss = {};
    var isValid = false;
    if (!warehouseValue['name']) {
      errorss['name'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.getFormattedMessage)('globally.input.name.validate.label');
    } else if (!email_validator__WEBPACK_IMPORTED_MODULE_4__.validate(warehouseValue['email'])) {
      if (!warehouseValue['email']) {
        errorss['email'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.getFormattedMessage)('globally.input.email.validate.label');
      } else {
        errorss['email'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.getFormattedMessage)('globally.input.email.valid.validate.label');
      }
    } else if (!warehouseValue['phone']) {
      errorss['phone'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.getFormattedMessage)('globally.input.phone-number.validate.label');
    } else if (!warehouseValue['country']) {
      errorss['country'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.getFormattedMessage)('globally.input.country.validate.label');
    } else if (!warehouseValue['city']) {
      errorss['city'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.getFormattedMessage)('globally.input.city.validate.label');
    } else if (!warehouseValue['zip_code']) {
      errorss['zip_code'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.getFormattedMessage)('warehouse.input.zip-code.validate.label');
    } else {
      isValid = true;
    }
    setErrors(errorss);
    return isValid;
  };
  var onChangeInput = function onChangeInput(e) {
    e.preventDefault();
    setWarehouseValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, _defineProperty({}, e.target.name, e.target.value));
    });
    setErrors('');
  };
  var onSubmit = function onSubmit(event) {
    event.preventDefault();
    var valid = handleValidation();
    if (singleWarehouse && valid) {
      if (!disabled) {
        editWarehouse(id, warehouseValue, navigate);
      }
    } else {
      if (valid) {
        setWarehouseValue(warehouseValue);
        addWarehouseData(warehouseValue);
      }
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
    className: "card",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
      className: "card-body",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_3__["default"], {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
          className: "row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
            className: "col-md-6 mb-3",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("label", {
              className: "form-label",
              children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.getFormattedMessage)('globally.input.name.label'), ":"]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
              className: "required"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("input", {
              type: "text",
              name: "name",
              placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.placeholderText)('globally.input.name.placeholder.label'),
              className: "form-control",
              autoFocus: true,
              onChange: function onChange(e) {
                return onChangeInput(e);
              },
              value: warehouseValue.name
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
              className: "text-danger d-block fw-400 fs-small mt-2",
              children: errors['name'] ? errors['name'] : null
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
            className: "col-md-6 mb-3",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("label", {
              className: "form-label",
              children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.getFormattedMessage)('globally.input.email.label'), ":"]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
              className: "required"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("input", {
              type: "text",
              name: "email",
              className: "form-control",
              value: warehouseValue.email,
              placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.placeholderText)('globally.input.email.placeholder.label'),
              onChange: function onChange(e) {
                return onChangeInput(e);
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
              className: "text-danger d-block fw-400 fs-small mt-2",
              children: errors['email'] ? errors['email'] : null
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
            className: "col-md-6 mb-3",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("label", {
              className: "form-label",
              children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.getFormattedMessage)('globally.input.phone-number.label'), ":"]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
              className: "required"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("input", {
              type: "text",
              name: "phone",
              className: "form-control",
              pattern: "[0-9]*",
              placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.placeholderText)('globally.input.phone-number.placeholder.label'),
              onKeyPress: function onKeyPress(event) {
                return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.numValidate)(event);
              },
              onChange: function onChange(e) {
                return onChangeInput(e);
              },
              value: warehouseValue.phone
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
              className: "text-danger d-block fw-400 fs-small mt-2",
              children: errors['phone'] ? errors['phone'] : null
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
            className: "col-md-6 mb-3",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("label", {
              className: "form-label",
              children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.getFormattedMessage)('globally.input.country.label'), ":"]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
              className: "required"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("input", {
              type: "text",
              name: "country",
              className: "form-control",
              placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.placeholderText)('globally.input.country.placeholder.label'),
              onChange: function onChange(e) {
                return onChangeInput(e);
              },
              value: warehouseValue.country
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
              className: "text-danger",
              children: errors['country'] ? errors['country'] : null
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
            className: "col-md-6 mb-3",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("label", {
              className: "form-label",
              children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.getFormattedMessage)('globally.input.city.label'), ":"]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
              className: "required"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("input", {
              type: "text",
              name: "city",
              className: "form-control",
              placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.placeholderText)('globally.input.city.placeholder.label'),
              onChange: function onChange(e) {
                return onChangeInput(e);
              },
              value: warehouseValue.city
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
              className: "text-danger d-block fw-400 fs-small mt-2",
              children: errors['city'] ? errors['city'] : null
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
            className: "col-md-6 mb-3",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("label", {
              className: "form-label",
              children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.getFormattedMessage)('warehouse.input.zip-code.label'), ":"]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
              className: "required"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("input", {
              type: "text",
              name: "zip_code",
              className: "form-control",
              pattern: "[0-9]*",
              value: warehouseValue.zip_code,
              placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.placeholderText)('warehouse.input.zip-code.placeholder.label'),
              onChange: function onChange(e) {
                return onChangeInput(e);
              },
              onKeyPress: function onKeyPress(event) {
                return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.numValidate)(event);
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
              className: "text-danger d-block fw-400 fs-small mt-2",
              children: errors['zip_code'] ? errors['zip_code'] : null
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_shared_components_modelFooter__WEBPACK_IMPORTED_MODULE_7__["default"], {
            onEditRecord: singleWarehouse,
            onSubmit: onSubmit,
            editDisabled: disabled,
            link: "/app/warehouse",
            addDisabled: !warehouseValue.name
          })]
        })
      })
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_2__.connect)(null, {
  fetchWarehouse: _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_6__.fetchWarehouse,
  editWarehouse: _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_6__.editWarehouse
})(WarehouseForm));

/***/ },

/***/ "./resources/pos/src/components/warehouse/Warehouses.js"
/*!**************************************************************!*\
  !*** ./resources/pos/src/components/warehouse/Warehouses.js ***!
  \**************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
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
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../store/action/warehouseAction */ "./resources/pos/src/store/action/warehouseAction.js");
/* harmony import */ var _shared_table_ReactDataTable__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../shared/table/ReactDataTable */ "./resources/pos/src/shared/table/ReactDataTable.js");
/* harmony import */ var _DeleteWarehouse__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./DeleteWarehouse */ "./resources/pos/src/components/warehouse/DeleteWarehouse.js");
/* harmony import */ var _shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../shared/tab-title/TabTitle */ "./resources/pos/src/shared/tab-title/TabTitle.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _shared_action_buttons_ActionButton__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../shared/action-buttons/ActionButton */ "./resources/pos/src/shared/action-buttons/ActionButton.js");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
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










var Warehouses = function Warehouses(props) {
  var fetchWarehouses = props.fetchWarehouses,
    warehouses = props.warehouses,
    totalRecord = props.totalRecord,
    isLoading = props.isLoading,
    allConfigData = props.allConfigData;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    deleteModel = _useState2[0],
    setDeleteModel = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState4 = _slicedToArray(_useState3, 2),
    isDelete = _useState4[0],
    setIsDelete = _useState4[1];
  var navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_7__.useNavigate)();
  var onClickDeleteModel = function onClickDeleteModel() {
    var isDelete = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    setDeleteModel(!deleteModel);
    setIsDelete(isDelete);
  };
  var onChange = function onChange(filter) {
    fetchWarehouses(filter, true);
  };
  var goToEditProduct = function goToEditProduct(item) {
    var id = item.id;
    navigate("/app/warehouse/edit/".concat(id));
  };
  var goToProductDetailPage = function goToProductDetailPage(id) {
    navigate("/app/warehouse/detail/".concat(id));
  };
  var itemsValue = warehouses.length >= 0 && warehouses.map(function (warehouse) {
    return {
      date: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getFormattedDate)(warehouse.attributes.created_at, allConfigData && allConfigData),
      time: dayjs__WEBPACK_IMPORTED_MODULE_2___default()(warehouse.attributes.created_at).format('LT'),
      name: warehouse.attributes.name,
      phone: warehouse.attributes.phone,
      country: warehouse.attributes.country,
      city: warehouse.attributes.city,
      email: warehouse.attributes.email,
      zip_code: warehouse.attributes.zip_code,
      id: warehouse.id
    };
  });
  var columns = [{
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getFormattedMessage)('globally.detail.warehouse'),
    selector: function selector(row) {
      return row.name;
    },
    sortField: 'name',
    sortable: true,
    cell: function cell(row) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
          className: "text-primary",
          children: row.name
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
          children: row.email
        })]
      });
    }
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getFormattedMessage)('globally.input.phone-number.label'),
    selector: function selector(row) {
      return row.phone;
    },
    sortField: 'phone',
    sortable: true
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getFormattedMessage)('globally.input.country.label'),
    selector: function selector(row) {
      return row.country;
    },
    sortField: 'country',
    sortable: true
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getFormattedMessage)('globally.input.city.label'),
    selector: function selector(row) {
      return row.city;
    },
    sortField: 'city',
    sortable: true
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getFormattedMessage)('warehouse.input.zip-code.label'),
    selector: function selector(row) {
      return row.zip_code;
    },
    sortField: 'zip_code',
    sortable: true
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getFormattedMessage)('globally.react-table.column.created-date.label'),
    selector: function selector(row) {
      return row.date;
    },
    sortField: 'created_at',
    sortable: true,
    cell: function cell(row) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("span", {
        className: "badge bg-light-info",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
          className: "mb-1",
          children: row.time
        }), row.date]
      });
    }
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getFormattedMessage)('react-data-table.action.column.label'),
    right: true,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    cell: function cell(row) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_shared_action_buttons_ActionButton__WEBPACK_IMPORTED_MODULE_14__["default"], {
        isViewIcon: true,
        item: row,
        goToDetailScreen: goToProductDetailPage,
        goToEditProduct: goToEditProduct,
        isEditMode: true,
        onClickDeleteModel: onClickDeleteModel
      });
    }
  }];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_8__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_15__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_12__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.placeholderText)('warehouse.title')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_shared_table_ReactDataTable__WEBPACK_IMPORTED_MODULE_10__["default"], {
      columns: columns,
      items: itemsValue,
      onChange: onChange,
      isLoading: isLoading,
      ButtonValue: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getFormattedMessage)('warehouse.create.title'),
      totalRows: totalRecord,
      to: "#/app/warehouse/create"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_DeleteWarehouse__WEBPACK_IMPORTED_MODULE_11__["default"], {
      onClickDeleteModel: onClickDeleteModel,
      deleteModel: deleteModel,
      onDelete: isDelete
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var warehouses = state.warehouses,
    totalRecord = state.totalRecord,
    isLoading = state.isLoading,
    allConfigData = state.allConfigData;
  return {
    warehouses: warehouses,
    totalRecord: totalRecord,
    isLoading: isLoading,
    allConfigData: allConfigData
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, {
  fetchWarehouses: _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_9__.fetchWarehouses
})(Warehouses));

/***/ },

/***/ "./resources/pos/src/assets/images/brand_logo.png"
/*!********************************************************!*\
  !*** ./resources/pos/src/assets/images/brand_logo.png ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/images/brand_logo.png?c77aff19bcd1d22cef86b3eb70e74e96");

/***/ }

}]);