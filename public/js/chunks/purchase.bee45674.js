"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["purchase"],{

/***/ "./resources/pos/src/components/purchase/CreatePurchase.js"
/*!*****************************************************************!*\
  !*** ./resources/pos/src/components/purchase/CreatePurchase.js ***!
  \*****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _header_HeaderTitle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../header/HeaderTitle */ "./resources/pos/src/components/header/HeaderTitle.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../store/action/warehouseAction */ "./resources/pos/src/store/action/warehouseAction.js");
/* harmony import */ var _store_action_supplierAction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../store/action/supplierAction */ "./resources/pos/src/store/action/supplierAction.js");
/* harmony import */ var _PurchaseForm__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./PurchaseForm */ "./resources/pos/src/components/purchase/PurchaseForm.js");
/* harmony import */ var _store_action_purchaseAction__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../store/action/purchaseAction */ "./resources/pos/src/store/action/purchaseAction.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");











var CreatePurchase = function CreatePurchase(props) {
  var addPurchase = props.addPurchase,
    warehouses = props.warehouses,
    fetchAllWarehouses = props.fetchAllWarehouses,
    fetchAllSuppliers = props.fetchAllSuppliers,
    suppliers = props.suppliers;
  var navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_4__.useNavigate)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchAllWarehouses();
    fetchAllSuppliers();
  }, []);
  var addPurchaseData = function addPurchaseData(formValue) {
    addPurchase(formValue, navigate);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_2__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_header_HeaderTitle__WEBPACK_IMPORTED_MODULE_3__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.getFormattedMessage)("purchase.create.title"),
      to: "/app/purchases"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_PurchaseForm__WEBPACK_IMPORTED_MODULE_7__["default"], {
      addPurchaseData: addPurchaseData,
      warehouses: warehouses,
      suppliers: suppliers
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var warehouses = state.warehouses,
    suppliers = state.suppliers,
    totalRecord = state.totalRecord;
  return {
    warehouses: warehouses,
    suppliers: suppliers,
    totalRecord: totalRecord
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, {
  addPurchase: _store_action_purchaseAction__WEBPACK_IMPORTED_MODULE_8__.addPurchase,
  fetchAllWarehouses: _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_5__.fetchAllWarehouses,
  fetchAllSuppliers: _store_action_supplierAction__WEBPACK_IMPORTED_MODULE_6__.fetchAllSuppliers
})(CreatePurchase));

/***/ },

/***/ "./resources/pos/src/components/purchase/DeletePurchase.js"
/*!*****************************************************************!*\
  !*** ./resources/pos/src/components/purchase/DeletePurchase.js ***!
  \*****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _store_action_purchaseAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../store/action/purchaseAction */ "./resources/pos/src/store/action/purchaseAction.js");
/* harmony import */ var _shared_action_buttons_DeleteModel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/action-buttons/DeleteModel */ "./resources/pos/src/shared/action-buttons/DeleteModel.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");






var DeletePurchase = function DeletePurchase(props) {
  var deletePurchase = props.deletePurchase,
    onDelete = props.onDelete,
    deleteModel = props.deleteModel,
    onClickDeleteModel = props.onClickDeleteModel;
  var deleteUserClick = function deleteUserClick() {
    deletePurchase(onDelete.id);
    onClickDeleteModel(false);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
    children: deleteModel && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_shared_action_buttons_DeleteModel__WEBPACK_IMPORTED_MODULE_3__["default"], {
      onClickDeleteModel: onClickDeleteModel,
      deleteModel: deleteModel,
      deleteUserClick: deleteUserClick,
      name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.getFormattedMessage)('purchase.title')
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(null, {
  deletePurchase: _store_action_purchaseAction__WEBPACK_IMPORTED_MODULE_2__.deletePurchase
})(DeletePurchase));

/***/ },

/***/ "./resources/pos/src/components/purchase/EditPurchase.js"
/*!***************************************************************!*\
  !*** ./resources/pos/src/components/purchase/EditPurchase.js ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../store/action/warehouseAction */ "./resources/pos/src/store/action/warehouseAction.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var _header_HeaderTitle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../header/HeaderTitle */ "./resources/pos/src/components/header/HeaderTitle.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _PurchaseForm__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./PurchaseForm */ "./resources/pos/src/components/purchase/PurchaseForm.js");
/* harmony import */ var _store_action_supplierAction__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../store/action/supplierAction */ "./resources/pos/src/store/action/supplierAction.js");
/* harmony import */ var _store_action_purchaseAction__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../store/action/purchaseAction */ "./resources/pos/src/store/action/purchaseAction.js");
/* harmony import */ var _shared_prepareArray_editPrepareArray__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/prepareArray/editPrepareArray */ "./resources/pos/src/shared/prepareArray/editPrepareArray.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _shared_components_loaders_Spinner__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../shared/components/loaders/Spinner */ "./resources/pos/src/shared/components/loaders/Spinner.js");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! dayjs */ "./node_modules/dayjs/dayjs.min.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(dayjs__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! dayjs/plugin/utc */ "./node_modules/dayjs/plugin/utc.js");
/* harmony import */ var dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");

















dayjs__WEBPACK_IMPORTED_MODULE_14___default().extend((dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_15___default()));
var EditPurchase = function EditPurchase(props) {
  var fetchPurchase = props.fetchPurchase,
    purchases = props.purchases,
    warehouses = props.warehouses,
    fetchAllSuppliers = props.fetchAllSuppliers,
    suppliers = props.suppliers,
    fetchAllWarehouses = props.fetchAllWarehouses,
    isLoading = props.isLoading;
  var _useParams = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_3__.useParams)(),
    id = _useParams.id;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchAllWarehouses();
    fetchAllSuppliers();
    fetchPurchase(id);
  }, []);
  var supplierId = purchases && purchases.attributes && purchases.attributes.supplier_id;
  var warehouseId = purchases && purchases.attributes && purchases.attributes.warehouse_id;
  var supplier = suppliers && suppliers.filter(function (supplier) {
    return supplier.id === supplierId;
  });
  var supplierName = supplier[0] && supplier[0].attributes && supplier[0].attributes.name;
  var warehouse = warehouses.filter(function (warehouse) {
    return warehouse.id === warehouseId;
  });
  var warehouseName = warehouse[0] && warehouse[0].attributes && warehouse[0].attributes.name;
  purchases && purchases.attributes && purchases.attributes.purchase_items.forEach(function (item) {
    item.fix_net_unit = item.product_cost;
    item.stock_alert = item.product && item.product.stock_alert;
    item.short_name = item.purchase_unit.short_name;
    item.newItem = '';
    item.purchase_item_id = item.id;
    item.code = item.product && item.product.code;
    item.name = item.product && item.product.name;
  });
  var statusFilterOptions = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedOptions)(_constants__WEBPACK_IMPORTED_MODULE_13__.purchaseStatusOptions);
  var statusDefaultValue = purchases.attributes && purchases.attributes.status && statusFilterOptions.filter(function (item) {
    return item.id === purchases.attributes.status;
  });
  var purchasesItemsId = purchases && purchases.attributes && purchases.attributes.purchase_items && purchases.attributes.purchase_items.map(function (item) {
    return item.id;
  });
  var itemsValue = purchases && purchases.attributes && {
    date: dayjs__WEBPACK_IMPORTED_MODULE_14___default()(purchases.attributes.date).format('YYYY-MM-DD'),
    warehouse_id: {
      value: purchases.attributes.warehouse_id,
      label: warehouseName
    },
    supplier_id: {
      value: purchases.attributes.supplier_id,
      label: supplierName
    },
    discount: purchases.attributes.discount,
    tax_rate: purchases.attributes.tax_rate,
    shipping: purchases.attributes.shipping,
    notes: purchases.attributes.notes,
    purchase_items: (0,_shared_prepareArray_editPrepareArray__WEBPACK_IMPORTED_MODULE_9__.editPrepareArray)(purchases.attributes.purchase_items, purchases.attributes.warehouse_id),
    newItem: '',
    purchase_item_id: purchasesItemsId ? purchasesItemsId[0] : '',
    id: purchases.id,
    status_id: {
      label: statusDefaultValue[0] && statusDefaultValue[0].name,
      value: statusDefaultValue[0] && statusDefaultValue[0].id
    },
    tax_amount: purchases.attributes.tax_amount
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_5__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_12__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_header_HeaderTitle__WEBPACK_IMPORTED_MODULE_4__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)('purchase.edit.title'),
      to: "/app/purchases"
    }), isLoading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_shared_components_loaders_Spinner__WEBPACK_IMPORTED_MODULE_11__["default"], {}) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_PurchaseForm__WEBPACK_IMPORTED_MODULE_6__["default"], {
      singlePurchase: itemsValue,
      id: id,
      warehouses: warehouses,
      suppliers: suppliers
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var purchases = state.purchases,
    warehouses = state.warehouses,
    suppliers = state.suppliers,
    isLoading = state.isLoading;
  return {
    purchases: purchases,
    warehouses: warehouses,
    suppliers: suppliers,
    isLoading: isLoading
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, {
  fetchPurchase: _store_action_purchaseAction__WEBPACK_IMPORTED_MODULE_8__.fetchPurchase,
  fetchAllSuppliers: _store_action_supplierAction__WEBPACK_IMPORTED_MODULE_7__.fetchAllSuppliers,
  fetchAllWarehouses: _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_2__.fetchAllWarehouses
})(EditPurchase));

/***/ },

/***/ "./resources/pos/src/components/purchase/PurchaseDetails.js"
/*!******************************************************************!*\
  !*** ./resources/pos/src/components/purchase/PurchaseDetails.js ***!
  \******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Col.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Row.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Table.js");
/* harmony import */ var react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-bootstrap/Form */ "./node_modules/react-bootstrap/esm/Form.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.mjs");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "./node_modules/@fortawesome/react-fontawesome/index.es.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _header_HeaderTitle__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../header/HeaderTitle */ "./resources/pos/src/components/header/HeaderTitle.js");
/* harmony import */ var _shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../shared/tab-title/TabTitle */ "./resources/pos/src/shared/tab-title/TabTitle.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _store_action_purchaseDetailsAction__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../store/action/purchaseDetailsAction */ "./resources/pos/src/store/action/purchaseDetailsAction.js");
/* harmony import */ var _store_action_frontSettingAction__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../store/action/frontSettingAction */ "./resources/pos/src/store/action/frontSettingAction.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");














var PurchaseDetails = function PurchaseDetails(props) {
  var purchaseDetailsAction = props.purchaseDetailsAction,
    purchaseDetails = props.purchaseDetails,
    fetchFrontSetting = props.fetchFrontSetting,
    frontSetting = props.frontSetting,
    allConfigData = props.allConfigData;
  var _useParams = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_1__.useParams)(),
    id = _useParams.id;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchFrontSetting();
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    purchaseDetailsAction(id);
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_9__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_header_HeaderTitle__WEBPACK_IMPORTED_MODULE_10__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("purchases.details.title"),
      to: "/app/purchases"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_11__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.placeholderText)("purchases.details.title")
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("div", {
      className: "card",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("div", {
        className: "card-body",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_5__["default"], {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("div", {
            className: "row",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("div", {
              className: "col-12",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("h4", {
                className: "font-weight-bold text-center mb-5",
                children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("purchases.details.title"), " ", ":", " ", purchaseDetails && purchaseDetails.reference_code]
              })
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"], {
            className: "custom-line-height",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__["default"], {
              md: 4,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("h5", {
                className: "text-gray-600 bg-light p-4 mb-0 text-uppercase",
                children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("purchase.detail.supplier.info")
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                className: "p-4",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                  className: "d-flex align-items-center pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_8__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_7__.faUser,
                    className: "text-primary me-2 fs-5"
                  }), purchaseDetails.supplier && purchaseDetails.supplier.name]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                  className: "d-flex align-items-center pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_8__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_7__.faEnvelope,
                    className: "text-primary me-2 fs-5"
                  }), purchaseDetails.supplier && purchaseDetails.supplier.email]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                  className: "d-flex align-items-center pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_8__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_7__.faMobileAlt,
                    className: "text-primary me-2 fs-5"
                  }), purchaseDetails.supplier && purchaseDetails.supplier.phone]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                  className: "d-flex align-items-center",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_8__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_7__.faLocationDot,
                    className: "text-primary me-2 fs-5"
                  }), purchaseDetails.supplier && purchaseDetails.supplier.address]
                })]
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__["default"], {
              md: 4,
              className: "m-md-0 m-4",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("h5", {
                className: "text-gray-600 bg-light p-4 mb-0 text-uppercase",
                children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.company.info")
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                className: "p-4",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                  className: "d-flex align-items-center pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_8__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_7__.faUser,
                    className: "text-primary me-2 fs-5"
                  }), purchaseDetails.company_info && purchaseDetails.company_info.company_name]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                  className: "d-flex align-items-center pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_8__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_7__.faEnvelope,
                    className: "text-primary me-2 fs-5"
                  }), purchaseDetails.company_info && purchaseDetails.company_info.email]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                  className: "d-flex align-items-center pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_8__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_7__.faMobileAlt,
                    className: "text-primary me-2 fs-5"
                  }), purchaseDetails.company_info && purchaseDetails.company_info.phone]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                  className: "d-flex align-items-center",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_8__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_7__.faLocationDot,
                    className: "text-primary me-2 fs-5"
                  }), purchaseDetails.company_info && purchaseDetails.company_info.address]
                })]
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__["default"], {
              md: 4,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("h5", {
                className: "text-gray-600 bg-light p-4 mb-0 text-uppercase",
                children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("purchase.detail.purchase.info")
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                className: "p-4",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                  className: "pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("span", {
                    className: "me-2",
                    children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.reference"), " ", ":"]
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("span", {
                    children: purchaseDetails && purchaseDetails.reference_code
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                  className: "pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("span", {
                    className: "me-2",
                    children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.status"), " ", ":"]
                  }), purchaseDetails && purchaseDetails.status === 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("span", {
                    className: "badge bg-light-success",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("span", {
                      children: "Received"
                    })
                  }) || purchaseDetails.status === 2 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("span", {
                    className: "badge bg-light-primary",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("span", {
                      children: "Pending"
                    })
                  }) || purchaseDetails.status === 3 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("span", {
                    className: "badge bg-light-warning",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("span", {
                      children: "Ordered"
                    })
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                  className: "pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("span", {
                    className: "me-2",
                    children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.warehouse"), " ", ":"]
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("span", {
                    children: purchaseDetails.warehouse && purchaseDetails.warehouse.name
                  })]
                })]
              })]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
            className: "mt-5",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("h5", {
              className: "text-gray-600 bg-light p-4 mb-4 text-uppercase",
              children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.order.summary")
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_4__["default"], {
              responsive: true,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("thead", {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("tr", {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("th", {
                    className: "ps-3",
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.product")
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("th", {
                    className: "ps-3",
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.net-unit-cost")
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("th", {
                    className: "ps-3",
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.quantity")
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("th", {
                    className: "ps-3",
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.unit-cost")
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("th", {
                    className: "ps-3",
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.discount")
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("th", {
                    className: "ps-3",
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.tax")
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("th", {
                    colSpan: 2,
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.subtotal")
                  })]
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("tbody", {
                children: purchaseDetails.purchase_items && purchaseDetails.purchase_items.map(function (details, index) {
                  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("tr", {
                    className: "align-middle",
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("td", {
                      className: "ps-3",
                      children: [details.product && details.product.code, " ", "(", details.product && details.product.name, details.product && details.product.variation_type ? " - ".concat(details.product.variation_type.name) : "", ")"]
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("td", {
                      children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, details.net_unit_cost)
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("td", {
                      children: details.quantity
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("td", {
                      children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, details.product.product_cost)
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("td", {
                      children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, details.discount_amount)
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("td", {
                      children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, details.tax_amount)
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("td", {
                      children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, details.sub_total)
                    })]
                  }, index);
                })
              })]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("div", {
            className: "col-xxl-5 col-lg-6 col-md-6 col-12 float-end",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("div", {
              className: "card",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("div", {
                className: "card-body pt-7 pb-2",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("div", {
                  className: "table-responsive",
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("table", {
                    className: "table border",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("tbody", {
                      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("tr", {
                        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("td", {
                          className: "py-3",
                          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.order.tax")
                        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("td", {
                          className: "py-3",
                          children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, purchaseDetails && purchaseDetails.tax_amount > 0 ? purchaseDetails.tax_amount : "0.00"), " ", "(", purchaseDetails && parseFloat(purchaseDetails.tax_rate).toFixed(2), "%)"]
                        })]
                      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("tr", {
                        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("td", {
                          className: "py-3",
                          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.discount")
                        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("td", {
                          className: "py-3",
                          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, purchaseDetails && purchaseDetails.discount)
                        })]
                      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("tr", {
                        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("td", {
                          className: "py-3",
                          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.shipping")
                        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("td", {
                          className: "py-3",
                          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, purchaseDetails && purchaseDetails.shipping)
                        })]
                      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("tr", {
                        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("td", {
                          className: "py-3 text-primary",
                          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.grand.total")
                        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("td", {
                          className: "py-3 text-primary",
                          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, purchaseDetails && purchaseDetails.grand_total)
                        })]
                      })]
                    })
                  })
                })
              })
            })
          })]
        })
      })
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var purchaseDetails = state.purchaseDetails,
    frontSetting = state.frontSetting,
    allConfigData = state.allConfigData;
  return {
    purchaseDetails: purchaseDetails,
    frontSetting: frontSetting,
    allConfigData: allConfigData
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_6__.connect)(mapStateToProps, {
  purchaseDetailsAction: _store_action_purchaseDetailsAction__WEBPACK_IMPORTED_MODULE_13__.purchaseDetailsAction,
  fetchFrontSetting: _store_action_frontSettingAction__WEBPACK_IMPORTED_MODULE_14__.fetchFrontSetting
})(PurchaseDetails));

/***/ },

/***/ "./resources/pos/src/components/purchase/PurchaseForm.js"
/*!***************************************************************!*\
  !*** ./resources/pos/src/components/purchase/PurchaseForm.js ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! dayjs */ "./node_modules/dayjs/dayjs.min.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(dayjs__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! dayjs/plugin/utc */ "./node_modules/dayjs/plugin/utc.js");
/* harmony import */ var dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! dayjs/plugin/localizedFormat */ "./node_modules/dayjs/plugin/localizedFormat.js");
/* harmony import */ var dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! dayjs/plugin/isoWeek */ "./node_modules/dayjs/plugin/isoWeek.js");
/* harmony import */ var dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! dayjs/plugin/relativeTime */ "./node_modules/dayjs/plugin/relativeTime.js");
/* harmony import */ var dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/InputGroup.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Table.js");
/* harmony import */ var _store_action_purchaseProductAction__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../store/action/purchaseProductAction */ "./resources/pos/src/store/action/purchaseProductAction.js");
/* harmony import */ var _store_action_purchaseAction__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../store/action/purchaseAction */ "./resources/pos/src/store/action/purchaseAction.js");
/* harmony import */ var _store_action_productAction__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../store/action/productAction */ "./resources/pos/src/store/action/productAction.js");
/* harmony import */ var _shared_components_purchase_PurchaseTable__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../shared/components/purchase/PurchaseTable */ "./resources/pos/src/shared/components/purchase/PurchaseTable.js");
/* harmony import */ var _shared_prepareArray_preparePurchaseArray__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../shared/prepareArray/preparePurchaseArray */ "./resources/pos/src/shared/prepareArray/preparePurchaseArray.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _shared_calculation_calculation__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../shared/calculation/calculation */ "./resources/pos/src/shared/calculation/calculation.js");
/* harmony import */ var _shared_components_modelFooter__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../shared/components/modelFooter */ "./resources/pos/src/shared/components/modelFooter.js");
/* harmony import */ var _shared_components_product_cart_search_ProductSearch__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../shared/components/product-cart/search/ProductSearch */ "./resources/pos/src/shared/components/product-cart/search/ProductSearch.js");
/* harmony import */ var _store_action_toastAction__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../store/action/toastAction */ "./resources/pos/src/store/action/toastAction.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _shared_datepicker_ReactDatePicker__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../shared/datepicker/ReactDatePicker */ "./resources/pos/src/shared/datepicker/ReactDatePicker.js");
/* harmony import */ var _sales_ProductMainCalculation__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../sales/ProductMainCalculation */ "./resources/pos/src/components/sales/ProductMainCalculation.js");
/* harmony import */ var _shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../../shared/select/reactSelect */ "./resources/pos/src/shared/select/reactSelect.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
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








dayjs__WEBPACK_IMPORTED_MODULE_3___default().extend((dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_4___default()));
dayjs__WEBPACK_IMPORTED_MODULE_3___default().extend((dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_5___default()));
dayjs__WEBPACK_IMPORTED_MODULE_3___default().extend((dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_6___default()));
dayjs__WEBPACK_IMPORTED_MODULE_3___default().extend((dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_7___default()));
















var PurchaseForm = function PurchaseForm(props) {
  var _singlePurchase$tax_r, _singlePurchase$tax_a, _singlePurchase$disco, _singlePurchase$shipp;
  var addPurchaseData = props.addPurchaseData,
    id = props.id,
    editPurchase = props.editPurchase,
    customProducts = props.customProducts,
    singlePurchase = props.singlePurchase,
    warehouses = props.warehouses,
    suppliers = props.suppliers,
    fetchAllProducts = props.fetchAllProducts,
    fetchProductsByWarehouse = props.fetchProductsByWarehouse,
    products = props.products,
    frontSetting = props.frontSetting,
    allConfigData = props.allConfigData;
  var navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_2__.useNavigate)();
  var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useDispatch)();
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState2 = _slicedToArray(_useState, 2),
    newCost = _useState2[0],
    setNewCost = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState4 = _slicedToArray(_useState3, 2),
    newDiscount = _useState4[0],
    setNewDiscount = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState6 = _slicedToArray(_useState5, 2),
    newTax = _useState6[0],
    setNewTax = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState8 = _slicedToArray(_useState7, 2),
    newPurchaseUnit = _useState8[0],
    setNewPurchaseUnit = _useState8[1];
  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState0 = _slicedToArray(_useState9, 2),
    subTotal = _useState0[0],
    setSubTotal = _useState0[1];
  var _useState1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState10 = _slicedToArray(_useState1, 2),
    updateProducts = _useState10[0],
    setUpdateProducts = _useState10[1];
  var _useState11 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0),
    _useState12 = _slicedToArray(_useState11, 2),
    quantity = _useState12[0],
    setQuantity = _useState12[1];
  var _useState13 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      date: singlePurchase ? (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.toLocalDateObject)(singlePurchase.date) : new Date(),
      warehouse_id: singlePurchase ? singlePurchase.warehouse_id : '',
      supplier_id: singlePurchase ? singlePurchase.supplier_id : '',
      // (singlePurchase.tax_rate ?? 0) porque una compra puede llegar acá
      // con estos campos en null -- son nullable en BD sin default, y
      // llamar .toFixed() directo sobre null rompía la pantalla entera
      // ("Cannot read properties of null") al intentar editarla.
      tax_rate: singlePurchase ? ((_singlePurchase$tax_r = singlePurchase.tax_rate) !== null && _singlePurchase$tax_r !== void 0 ? _singlePurchase$tax_r : 0).toFixed(2) : '0.00',
      tax_amount: singlePurchase ? ((_singlePurchase$tax_a = singlePurchase.tax_amount) !== null && _singlePurchase$tax_a !== void 0 ? _singlePurchase$tax_a : 0).toFixed(2) : '0.00',
      discount: singlePurchase ? ((_singlePurchase$disco = singlePurchase.discount) !== null && _singlePurchase$disco !== void 0 ? _singlePurchase$disco : 0).toFixed(2) : '0.00',
      shipping: singlePurchase ? ((_singlePurchase$shipp = singlePurchase.shipping) !== null && _singlePurchase$shipp !== void 0 ? _singlePurchase$shipp : 0).toFixed(2) : '0.00',
      grand_total: singlePurchase ? singlePurchase.grand_total : '0.00',
      notes: singlePurchase ? singlePurchase.notes : '',
      status_id: singlePurchase ? singlePurchase.status_id : {
        label: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)("status.filter.received.label"),
        value: 1
      }
    }),
    _useState14 = _slicedToArray(_useState13, 2),
    purchaseValue = _useState14[0],
    setPurchaseValue = _useState14[1];
  var _useState15 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      date: '',
      warehouse_id: '',
      supplier_id: '',
      details: '',
      tax_rate: '',
      discount: '',
      shipping: '',
      status_id: ''
    }),
    _useState16 = _slicedToArray(_useState15, 2),
    errors = _useState16[0],
    setErrors = _useState16[1];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    setUpdateProducts(updateProducts);
  }, [updateProducts, quantity, newCost, newDiscount, newTax, subTotal, newPurchaseUnit]);
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
    if (singlePurchase) {
      setUpdateProducts(singlePurchase.purchase_items);
    }
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    // OJO: acá va fetchAllProducts(), NO fetchProductsByWarehouse().
    // Esta segunda EXCLUYE productos que todavía no tienen stock en el
    // almacén elegido (usa un whereHas contra manage_stocks) -- pero en
    // Compras uno justamente quiere poder comprar un producto para un
    // almacén nuevo donde nunca ha existido stock antes. La columna
    // "Valores" se encarga de mostrar el stock correcto de cada
    // almacén por separado, leyendo el desglose que ya trae cada
    // producto (product.attributes.warehouse).
    purchaseValue.warehouse_id.value ? fetchAllProducts() : null;
  }, [purchaseValue.warehouse_id]);
  var handleValidation = function handleValidation() {
    var errorss = {};
    var isValid = false;
    var qtyCart = updateProducts.filter(function (a) {
      return a.quantity === 0;
    });
    if (!purchaseValue.date) {
      error['date'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('globally.date.validate.label');
    } else if (!purchaseValue.warehouse_id) {
      errorss['warehouse_id'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('purchase.select.warehouse.validate.label');
    } else if (!purchaseValue.supplier_id) {
      errorss['supplier_id'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('purchase.select.supplier.validate.label');
    } else if (qtyCart.length > 0) {
      dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_19__.addToast)({
        text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('globally.product-quantity.validate.message'),
        type: _constants__WEBPACK_IMPORTED_MODULE_20__.toastType.ERROR
      }));
    } else if (updateProducts.length < 1) {
      dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_19__.addToast)({
        text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('purchase.product-list.validate.message'),
        type: _constants__WEBPACK_IMPORTED_MODULE_20__.toastType.ERROR
      }));
    } else if (!purchaseValue.status_id) {
      errorss['status_id'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('globally.status.validate.label');
    } else {
      isValid = true;
    }
    setErrors(errorss);
    return isValid;
  };
  var onWarehouseChange = function onWarehouseChange(obj) {
    setPurchaseValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, {
        warehouse_id: obj
      });
    });
    setErrors('');
  };
  var onSupplierChange = function onSupplierChange(obj) {
    setPurchaseValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, {
        supplier_id: obj
      });
    });
    setErrors('');
  };
  var onStatusChange = function onStatusChange(obj) {
    setPurchaseValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, {
        status_id: obj
      });
    });
  };
  var updateCost = function updateCost(item) {
    setNewCost(item);
  };
  var updateDiscount = function updateDiscount(item) {
    setNewDiscount(item);
  };
  var updateTax = function updateTax(item) {
    setNewTax(item);
  };
  var onChangeInput = function onChangeInput(e) {
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
    setPurchaseValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, _defineProperty({}, e.target.name, value && value));
    });
  };
  var onNotesChangeInput = function onNotesChangeInput(e) {
    e.preventDefault();
    setPurchaseValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, {
        notes: e.target.value
      });
    });
  };
  var handleCallback = function handleCallback(date) {
    setPurchaseValue(function (previousState) {
      return _objectSpread(_objectSpread({}, previousState), {}, {
        date: date
      });
    });
    setErrors('');
  };
  var updatedQty = function updatedQty(qty) {
    setQuantity(qty);
  };
  var updateSubTotal = function updateSubTotal(item) {
    setSubTotal(item);
  };
  var updatePurchaseUnit = function updatePurchaseUnit(item) {
    setNewPurchaseUnit(item);
  };
  var statusFilterOptions = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedOptions)(_constants__WEBPACK_IMPORTED_MODULE_20__.purchaseStatusOptions);
  var statusDefaultValue = statusFilterOptions.map(function (option) {
    return {
      value: option.id,
      label: option.name
    };
  });
  var prepareData = function prepareData(_prepareData) {
    var formValue = {
      date: dayjs__WEBPACK_IMPORTED_MODULE_3___default()(_prepareData.date).format('YYYY-MM-DD'),
      warehouse_id: _prepareData.warehouse_id.value ? _prepareData.warehouse_id.value : _prepareData.warehouse_id,
      supplier_id: _prepareData.supplier_id.value ? _prepareData.supplier_id.value : _prepareData.supplier_id,
      discount: _prepareData.discount,
      tax_rate: _prepareData.tax_rate,
      tax_amount: (0,_shared_calculation_calculation__WEBPACK_IMPORTED_MODULE_16__.calculateCartTotalTaxAmount)(updateProducts, purchaseValue),
      purchase_items: updateProducts,
      shipping: _prepareData.shipping,
      grand_total: (0,_shared_calculation_calculation__WEBPACK_IMPORTED_MODULE_16__.calculateCartTotalAmount)(updateProducts, purchaseValue),
      received_amount: '',
      paid_amount: '',
      payment_type: 0,
      notes: _prepareData.notes,
      reference_code: '',
      status: _prepareData.status_id.value ? _prepareData.status_id.value : _prepareData.status_id
    };
    return formValue;
  };
  var onSubmit = function onSubmit(event) {
    event.preventDefault();
    var valid = handleValidation();
    if (valid) {
      if (singlePurchase) {
        editPurchase(id, prepareData(purchaseValue), navigate);
      } else {
        addPurchaseData(prepareData(purchaseValue));
        setPurchaseValue(purchaseValue);
      }
    }
  };
  var onBlurInput = function onBlurInput(el) {
    if (el.target.value === '') {
      if (el.target.name === 'shipping') {
        setPurchaseValue(_objectSpread(_objectSpread({}, purchaseValue), {}, {
          shipping: '0.00'
        }));
      }
      if (el.target.name === 'discount') {
        setPurchaseValue(_objectSpread(_objectSpread({}, purchaseValue), {}, {
          discount: '0.00'
        }));
      }
      if (el.target.name === 'tax_rate') {
        setPurchaseValue(_objectSpread(_objectSpread({}, purchaseValue), {}, {
          tax_rate: '0.00'
        }));
      }
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("div", {
    className: "card",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("div", {
      className: "card-body",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsxs)("div", {
        className: "row",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsxs)("div", {
          className: "col-md-4",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('react-data-table.date.column.label'), ":"]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("span", {
            className: "required"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("div", {
            className: "position-relative",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)(_shared_datepicker_ReactDatePicker__WEBPACK_IMPORTED_MODULE_21__["default"], {
              onChangeDate: handleCallback,
              newStartDate: purchaseValue.date
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("span", {
            className: "text-danger d-block fw-400 fs-small mt-2",
            children: errors['date'] ? errors['date'] : null
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("div", {
          className: "col-md-4 mb-3",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_23__["default"], {
            data: warehouses,
            onChange: onWarehouseChange,
            defaultValue: purchaseValue.warehouse_id,
            addSearchItems: singlePurchase,
            isWarehouseDisable: true,
            title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('warehouse.title'),
            errors: errors['warehouse_id'],
            placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.placeholderText)('purchase.select.warehouse.placeholder.label')
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("div", {
          className: "col-md-4 mb-3",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_23__["default"], {
            data: suppliers,
            onChange: onSupplierChange,
            defaultValue: purchaseValue.supplier_id,
            title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('supplier.title'),
            errors: errors['supplier_id'],
            placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.placeholderText)('purchase.select.supplier.placeholder.label')
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsxs)("div", {
          className: "col-md-12 mb-3",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('dashboard.stockAlert.product.label'), ":"]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)(_shared_components_product_cart_search_ProductSearch__WEBPACK_IMPORTED_MODULE_18__["default"], {
            values: purchaseValue,
            products: products,
            isAllProducts: true,
            handleValidation: handleValidation,
            updateProducts: updateProducts,
            setUpdateProducts: setUpdateProducts,
            customProducts: customProducts,
            presentationMode: "purchase"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsxs)("div", {
          className: "col-12 md-12",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('purchase.order-item.table.label'), ":"]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("span", {
            className: "required "
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_9__["default"], {
            responsive: true,
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("thead", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsxs)("tr", {
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("th", {
                  children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('dashboard.stockAlert.product.label')
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("th", {
                  children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('purchase.order-item.table.net-unit-cost.column.label')
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("th", {
                  children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('purchase.order-item.table.stock.column.label')
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("th", {
                  className: "text-lg-start text-center",
                  children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('purchase.order-item.table.qty.column.label')
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("th", {
                  children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('purchase.order-item.table.discount.column.label')
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("th", {
                  children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('purchase.order-item.table.tax.column.label')
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("th", {
                  children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('purchase.order-item.table.sub-total.column.label')
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("th", {
                  children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('react-data-table.action.column.label')
                })]
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsxs)("tbody", {
              children: [updateProducts && updateProducts.map(function (singleProduct, index) {
                var _purchaseValue$wareho;
                return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)(_shared_components_purchase_PurchaseTable__WEBPACK_IMPORTED_MODULE_13__["default"], {
                  singleProduct: singleProduct,
                  index: index,
                  updateQty: updatedQty,
                  updateCost: updateCost,
                  updateDiscount: updateDiscount,
                  updateProducts: updateProducts,
                  updateSubTotal: updateSubTotal,
                  frontSetting: frontSetting,
                  setUpdateProducts: setUpdateProducts,
                  updateTax: updateTax,
                  updatePurchaseUnit: updatePurchaseUnit,
                  purchaseItem: singlePurchase && singlePurchase.purchase_items,
                  selectedWarehouseId: (_purchaseValue$wareho = purchaseValue.warehouse_id) === null || _purchaseValue$wareho === void 0 ? void 0 : _purchaseValue$wareho.value
                });
              }), !updateProducts.length && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("tr", {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("td", {
                  colSpan: 8,
                  className: "fs-5 px-3 py-6 custom-text-center",
                  children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('sale.product.table.no-data.label')
                })
              })]
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("div", {
          className: "col-12",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)(_sales_ProductMainCalculation__WEBPACK_IMPORTED_MODULE_22__["default"], {
            inputValues: purchaseValue,
            updateProducts: updateProducts,
            frontSetting: frontSetting,
            allConfigData: allConfigData
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsxs)("div", {
          className: "col-md-4 mb-5",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('purchase.input.order-tax.label'), ":"]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_8__["default"], {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("input", {
              "aria-label": "Dollar amount (with dot and two decimal places)",
              className: "form-control",
              onBlur: function onBlur(event) {
                return onBlurInput(event);
              },
              onFocus: function onFocus(event) {
                return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.onFocusInput)(event);
              },
              value: purchaseValue.tax_rate,
              type: "text",
              name: "tax_rate",
              onKeyPress: function onKeyPress(event) {
                return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.decimalValidate)(event);
              },
              onChange: function onChange(e) {
                onChangeInput(e);
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_8__["default"].Text, {
              children: "%"
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("span", {
            className: "text-danger d-block fw-400 fs-small mt-2",
            children: errors['orderTax'] ? errors['orderTax'] : null
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsxs)("div", {
          className: "col-md-4 mb-5",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('purchase.order-item.table.discount.column.label'), ":"]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_8__["default"], {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("input", {
              "aria-label": "Dollar amount (with dot and two decimal places)",
              className: "form-control",
              onBlur: function onBlur(event) {
                return onBlurInput(event);
              },
              onFocus: function onFocus(event) {
                return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.onFocusInput)(event);
              },
              value: purchaseValue.discount,
              type: "text",
              name: "discount",
              onKeyPress: function onKeyPress(event) {
                return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.decimalValidate)(event);
              },
              onChange: function onChange(e) {
                return onChangeInput(e);
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_8__["default"].Text, {
              children: frontSetting.value && frontSetting.value.currency_symbol
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("span", {
            className: "text-danger d-block fw-400 fs-small mt-2",
            children: errors['discount'] ? errors['discount'] : null
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsxs)("div", {
          className: "col-md-4 mb-5",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('purchase.input.shipping.label'), ":"]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_8__["default"], {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("input", {
              "aria-label": "Dollar amount (with dot and two decimal places)",
              className: "form-control",
              value: purchaseValue.shipping,
              type: "text",
              name: "shipping",
              onBlur: function onBlur(event) {
                return onBlurInput(event);
              },
              onFocus: function onFocus(event) {
                return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.onFocusInput)(event);
              },
              onKeyPress: function onKeyPress(event) {
                return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.decimalValidate)(event);
              },
              onChange: function onChange(e) {
                return onChangeInput(e);
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_8__["default"].Text, {
              children: frontSetting.value && frontSetting.value.currency_symbol
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("span", {
            className: "text-danger d-block fw-400 fs-small mt-2",
            children: errors['shipping'] ? errors['shipping'] : null
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("div", {
          className: "col-md-4 mb-5",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_23__["default"], {
            multiLanguageOption: statusFilterOptions,
            onChange: onStatusChange,
            name: "status",
            title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('purchase.select.status.label'),
            value: purchaseValue.status_id,
            errors: errors['status_id'],
            defaultValue: statusDefaultValue[0],
            placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('purchase.select.status.label')
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsxs)("div", {
          className: "col-md-12 mb-5",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)('globally.input.notes.label'), ":"]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("textarea", {
            name: "notes",
            className: "form-control",
            placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.placeholderText)('purchase.placeholder.notes.input'),
            onChange: function onChange(e) {
              return onNotesChangeInput(e);
            },
            value: purchaseValue.notes
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)("span", {
            className: "text-danger d-block fw-400 fs-small mt-2",
            children: errors['notes'] ? errors['notes'] : null
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_24__.jsx)(_shared_components_modelFooter__WEBPACK_IMPORTED_MODULE_17__["default"], {
          onEditRecord: singlePurchase,
          onSubmit: onSubmit,
          link: "/app/purchases"
        })]
      })
    })
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var purchaseProducts = state.purchaseProducts,
    products = state.products,
    frontSetting = state.frontSetting,
    allConfigData = state.allConfigData;
  return {
    customProducts: (0,_shared_prepareArray_preparePurchaseArray__WEBPACK_IMPORTED_MODULE_14__.preparePurchaseProductArray)(products),
    purchaseProducts: purchaseProducts,
    products: products,
    frontSetting: frontSetting,
    allConfigData: allConfigData
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, {
  editPurchase: _store_action_purchaseAction__WEBPACK_IMPORTED_MODULE_11__.editPurchase,
  fetchAllProducts: _store_action_productAction__WEBPACK_IMPORTED_MODULE_12__.fetchAllProducts,
  fetchProductsByWarehouse: _store_action_productAction__WEBPACK_IMPORTED_MODULE_12__.fetchProductsByWarehouse,
  searchPurchaseProduct: _store_action_purchaseProductAction__WEBPACK_IMPORTED_MODULE_10__.searchPurchaseProduct
})(PurchaseForm));

/***/ },

/***/ "./resources/pos/src/components/purchase/Purchases.js"
/*!************************************************************!*\
  !*** ./resources/pos/src/components/purchase/Purchases.js ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! dayjs */ "./node_modules/dayjs/dayjs.min.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(dayjs__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! dayjs/plugin/utc */ "./node_modules/dayjs/plugin/utc.js");
/* harmony import */ var dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! dayjs/plugin/localizedFormat */ "./node_modules/dayjs/plugin/localizedFormat.js");
/* harmony import */ var dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! dayjs/plugin/isoWeek */ "./node_modules/dayjs/plugin/isoWeek.js");
/* harmony import */ var dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! dayjs/plugin/relativeTime */ "./node_modules/dayjs/plugin/relativeTime.js");
/* harmony import */ var dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _shared_table_ReactDataTable__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shared/table/ReactDataTable */ "./resources/pos/src/shared/table/ReactDataTable.js");
/* harmony import */ var _shared_action_buttons_ActionDropDownButton__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/action-buttons/ActionDropDownButton */ "./resources/pos/src/shared/action-buttons/ActionDropDownButton.js");
/* harmony import */ var _shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../shared/tab-title/TabTitle */ "./resources/pos/src/shared/tab-title/TabTitle.js");
/* harmony import */ var _store_action_purchaseAction__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../store/action/purchaseAction */ "./resources/pos/src/store/action/purchaseAction.js");
/* harmony import */ var _DeletePurchase__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./DeletePurchase */ "./resources/pos/src/components/purchase/DeletePurchase.js");
/* harmony import */ var _store_action_supplierAction__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../store/action/supplierAction */ "./resources/pos/src/store/action/supplierAction.js");
/* harmony import */ var _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../store/action/warehouseAction */ "./resources/pos/src/store/action/warehouseAction.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _store_action_downloadReportAction__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../store/action/downloadReportAction */ "./resources/pos/src/store/action/downloadReportAction.js");
/* harmony import */ var _store_action_frontSettingAction__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../store/action/frontSettingAction */ "./resources/pos/src/store/action/frontSettingAction.js");
/* harmony import */ var _shared_showPayment_ShowPayment__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../shared/showPayment/ShowPayment */ "./resources/pos/src/shared/showPayment/ShowPayment.js");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }








dayjs__WEBPACK_IMPORTED_MODULE_3___default().extend((dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_4___default()));
dayjs__WEBPACK_IMPORTED_MODULE_3___default().extend((dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_5___default()));
dayjs__WEBPACK_IMPORTED_MODULE_3___default().extend((dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_6___default()));
dayjs__WEBPACK_IMPORTED_MODULE_3___default().extend((dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_7___default()));














var Product = function Product(props) {
  var fetchPurchases = props.fetchPurchases,
    fetchAllWarehouses = props.fetchAllWarehouses,
    fetchAllSuppliers = props.fetchAllSuppliers,
    purchases = props.purchases,
    totalRecord = props.totalRecord,
    isLoading = props.isLoading,
    suppliers = props.suppliers,
    downloadPdf = props.downloadPdf,
    frontSetting = props.frontSetting,
    fetchFrontSetting = props.fetchFrontSetting,
    allConfigData = props.allConfigData;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    deleteModel = _useState2[0],
    setDeleteModel = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState4 = _slicedToArray(_useState3, 2),
    isDelete = _useState4[0],
    setIsDelete = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    isShowPaymentModel = _useState6[0],
    setIsShowPaymentModel = _useState6[1];
  var currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol;
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState8 = _slicedToArray(_useState7, 2),
    tableArray = _useState8[0],
    setTableArray = _useState8[1];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchFrontSetting();
  }, []);
  var onClickDeleteModel = function onClickDeleteModel() {
    var isDelete = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    setDeleteModel(!deleteModel);
    setIsDelete(isDelete);
  };
  var onChange = function onChange(filter) {
    fetchAllSuppliers();
    fetchAllWarehouses();
    fetchPurchases(filter, true);
  };
  var goToEditProduct = function goToEditProduct(item) {
    var id = item.id;
    window.location.href = "#/app/purchases/edit/" + id;
  };
  var goToDetailScreen = function goToDetailScreen(ProductId) {
    window.location.href = "#/app/purchases/detail/" + ProductId;
  };
  var onShowPaymentClick = function onShowPaymentClick() {
    setIsShowPaymentModel(!isShowPaymentModel);
  };

  //onClick pdf function
  var onPdfClick = function onPdfClick(id) {
    downloadPdf("purchase-pdf-download/".concat(id), 'purchase_pdf_url');
  };
  var itemsValue = currencySymbol && purchases.length >= 0 && purchases.map(function (purchase) {
    var supplier = suppliers.filter(function (supplier) {
      return supplier.id === purchase.attributes.supplier_id;
    });
    var supplierName = supplier[0] && supplier[0].attributes && supplier[0].attributes.name;
    return {
      reference_code: purchase.attributes.reference_code,
      supplier: supplierName,
      warehouse: purchase.attributes.warehouse_name,
      status: purchase.attributes.status,
      paid: 0,
      due: 0,
      payment: purchase.attributes.payment_type,
      date: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedDate)(purchase.attributes.created_at, allConfigData),
      time: dayjs__WEBPACK_IMPORTED_MODULE_3___default()(purchase.attributes.created_at).format("HH:mm:ss"),
      grand_total: purchase.attributes.grand_total,
      currency: currencySymbol,
      id: purchase.id
    };
  });
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    var grandTotalSum = function grandTotalSum() {
      var x = 0;
      itemsValue.length && itemsValue.map(function (item) {
        x = x + Number(item.grand_total);
        return x;
      });
      return x;
    };
    var paidTotalSum = function paidTotalSum(itemsValue) {
      var x = 0;
      itemsValue.length && itemsValue.map(function (item) {
        x = x + Number(item.paid_amount);
        return x;
      });
      return x;
    };
    if (purchases.length) {
      var newObject = itemsValue.length && {
        date: "",
        time: "",
        reference_code: "Total",
        customer_name: "",
        warehouse_name: "",
        status: "",
        payment_status: "",
        payment_type: "",
        grand_total: grandTotalSum(itemsValue),
        paid_amount: paidTotalSum(itemsValue),
        paid: 0,
        due: 0,
        id: "",
        payment: "",
        currency: currencySymbol
      };
      var newItemValue = itemsValue.length && newObject && itemsValue.concat(newObject);
      var latestArray = newItemValue.map(function (item) {
        return item;
      });
      newItemValue.length && setTableArray(latestArray);
    }
  }, [purchases]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (purchases.length === 0) {
      setTableArray([]);
    }
  }, [purchases]);
  var columns = [{
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)("dashboard.recentSales.reference.label"),
    sortField: "reference_code",
    sortable: true,
    cell: function cell(row) {
      return row.reference_code === "Total" ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("span", {
        className: "fw-bold fs-4",
        children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)("pos-total.title")
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("span", {
        className: "badge bg-light-danger",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("span", {
          children: row.reference_code
        })
      });
    }
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)("supplier.title"),
    selector: function selector(row) {
      return row.supplier;
    },
    sortField: "supplier",
    sortable: false
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)("warehouse.title"),
    selector: function selector(row) {
      return row.warehouse;
    },
    sortField: "warehouse",
    sortable: false
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)("purchase.select.status.label"),
    sortField: "status",
    sortable: false,
    cell: function cell(row) {
      return row.status === 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("span", {
        className: "badge bg-light-success",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("span", {
          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)("status.filter.received.label")
        })
      }) || row.status === 2 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("span", {
        className: "badge bg-light-primary",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("span", {
          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)("status.filter.pending.label")
        })
      }) || row.status === 3 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("span", {
        className: "badge bg-light-warning",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("span", {
          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)("status.filter.ordered.label")
        })
      });
    }
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)("purchase.grant-total.label"),
    // selector: row => row.currency + ' ' + parseFloat(row.grand_total).toFixed(2),
    sortField: "grand_total",
    cell: function cell(row) {
      return row.reference_code === "Total" ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("span", {
        className: "fw-bold fs-4",
        children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.currencySymbolHandling)(allConfigData, row.currency, row.grand_total)
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("span", {
        children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.currencySymbolHandling)(allConfigData, row.currency, row.grand_total)
      });
    },
    sortable: true
  },
  // {
  //     name: getFormattedMessage('dashboard.recentSales.paid.label'),
  //     // selector: row => row.currency + ' ' + parseFloat(row.paid).toFixed(2),
  //     sortField: 'paid',
  //     cell: row => {
  //         return row.reference_code === "Total" ? <span
  //                 className="fw-bold fs-4">{currencySymbolHandling(allConfigData, row.currency, row.paid)}</span> :
  //             <span>{currencySymbolHandling(allConfigData, row.currency, row.paid)}</span>
  //     },
  //     sortable: false,
  // },
  // {
  //     name: getFormattedMessage('dashboard.recentSales.due.label'),
  //     cell: row => {
  //         return row.reference_code === "Total" ? <span
  //                 className="fw-bold fs-4">{currencySymbolHandling(allConfigData, row.currency, row.due)}</span> :
  //             <span>{currencySymbolHandling(allConfigData, row.currency, row.due)}</span>
  //     },
  //     sortField: 'due',
  //     sortable: false,
  // },
  {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)("globally.react-table.column.payment-type.label"),
    selector: function selector(row) {
      return row.payment;
    },
    sortField: "payment",
    sortable: false,
    cell: function cell(row) {
      return row.reference_code === "Total" ? "" : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("span", {
        className: "badge bg-light-success",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("span", {
          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)("cash.label")
        })
      });
    }
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)("globally.react-table.column.created-date.label"),
    selector: function selector(row) {
      return row.date;
    },
    sortField: "date",
    sortable: true,
    cell: function cell(row) {
      return row.date && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsxs)("span", {
        className: "badge bg-light-info",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("div", {
          className: "mb-1",
          children: row.time
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("div", {
          children: row.date
        })]
      });
    }
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)("react-data-table.action.column.label"),
    right: true,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    cell: function cell(row) {
      return row.reference_code === "Total" ? null : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_shared_action_buttons_ActionDropDownButton__WEBPACK_IMPORTED_MODULE_9__["default"], {
        item: row,
        goToEditProduct: goToEditProduct,
        isEditMode: true,
        isPdfIcon: true,
        onClickDeleteModel: onClickDeleteModel,
        isViewIcon: true,
        onPdfClick: onPdfClick,
        goToDetailScreen: goToDetailScreen,
        onShowPaymentClick: onShowPaymentClick
        // isPaymentShow={true}
        ,
        title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)("purchase.title")
      });
    }
  }];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_1__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_19__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_10__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.placeholderText)("purchases.title")
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("div", {
      className: "purchases_table",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_shared_table_ReactDataTable__WEBPACK_IMPORTED_MODULE_8__["default"], {
        columns: columns,
        items: tableArray,
        onChange: onChange,
        isLoading: isLoading,
        isShowDateRangeField: true,
        ButtonValue: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_15__.getFormattedMessage)("purchase.create.title"),
        totalRows: totalRecord,
        to: "#/app/purchases/create",
        isShowFilterField: true,
        isStatus: true
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_DeletePurchase__WEBPACK_IMPORTED_MODULE_12__["default"], {
      onClickDeleteModel: onClickDeleteModel,
      deleteModel: deleteModel,
      onDelete: isDelete
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_shared_showPayment_ShowPayment__WEBPACK_IMPORTED_MODULE_18__["default"], {
      onShowPaymentClick: onShowPaymentClick,
      isShowPaymentModel: isShowPaymentModel
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var purchases = state.purchases,
    totalRecord = state.totalRecord,
    isLoading = state.isLoading,
    warehouses = state.warehouses,
    suppliers = state.suppliers,
    frontSetting = state.frontSetting,
    fetchFrontSetting = state.fetchFrontSetting,
    allConfigData = state.allConfigData;
  return {
    purchases: purchases,
    totalRecord: totalRecord,
    isLoading: isLoading,
    warehouses: warehouses,
    suppliers: suppliers,
    frontSetting: frontSetting,
    fetchFrontSetting: fetchFrontSetting,
    allConfigData: allConfigData
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_2__.connect)(mapStateToProps, {
  fetchPurchases: _store_action_purchaseAction__WEBPACK_IMPORTED_MODULE_11__.fetchPurchases,
  fetchAllWarehouses: _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_14__.fetchAllWarehouses,
  fetchAllSuppliers: _store_action_supplierAction__WEBPACK_IMPORTED_MODULE_13__.fetchAllSuppliers,
  downloadPdf: _store_action_downloadReportAction__WEBPACK_IMPORTED_MODULE_16__.downloadPdf,
  fetchFrontSetting: _store_action_frontSettingAction__WEBPACK_IMPORTED_MODULE_17__.fetchFrontSetting
})(Product));

/***/ },

/***/ "./resources/pos/src/components/sales/EditPaymentModal.js"
/*!****************************************************************!*\
  !*** ./resources/pos/src/components/sales/EditPaymentModal.js ***!
  \****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Modal.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! dayjs */ "./node_modules/dayjs/dayjs.min.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(dayjs__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! dayjs/plugin/utc */ "./node_modules/dayjs/plugin/utc.js");
/* harmony import */ var dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! dayjs/plugin/localizedFormat */ "./node_modules/dayjs/plugin/localizedFormat.js");
/* harmony import */ var dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! dayjs/plugin/isoWeek */ "./node_modules/dayjs/plugin/isoWeek.js");
/* harmony import */ var dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! dayjs/plugin/relativeTime */ "./node_modules/dayjs/plugin/relativeTime.js");
/* harmony import */ var dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var reactstrap__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/esm/Row.js");
/* harmony import */ var _shared_datepicker_ReactDatePicker__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/datepicker/ReactDatePicker */ "./resources/pos/src/shared/datepicker/ReactDatePicker.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../shared/select/reactSelect */ "./resources/pos/src/shared/select/reactSelect.js");
/* harmony import */ var _shared_components_modelFooter__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../shared/components/modelFooter */ "./resources/pos/src/shared/components/modelFooter.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _store_action_salePaymentAction__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../store/action/salePaymentAction */ "./resources/pos/src/store/action/salePaymentAction.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
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








dayjs__WEBPACK_IMPORTED_MODULE_3___default().extend((dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_4___default()));
dayjs__WEBPACK_IMPORTED_MODULE_3___default().extend((dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_5___default()));
dayjs__WEBPACK_IMPORTED_MODULE_3___default().extend((dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_6___default()));
dayjs__WEBPACK_IMPORTED_MODULE_3___default().extend((dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_7___default()));








var EditPaymentModal = function EditPaymentModal(props) {
  var editSaleItem = props.editSaleItem,
    isEditModalOpen = props.isEditModalOpen,
    closeModal = props.closeModal,
    createPaymentItem = props.createPaymentItem;
  var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_13__.useDispatch)();
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      amount_to_pay: "",
      payment_date: new Date(),
      payment_type: "",
      amount: "",
      paid_amount: '',
      payment_id: "",
      reference: ""
    }),
    _useState2 = _slicedToArray(_useState, 2),
    paymentValue = _useState2[0],
    setPaymentValue = _useState2[1];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (editSaleItem) {
      setPaymentValue({
        amount_to_pay: editSaleItem ? editSaleItem.received_amount : "",
        payment_type: paymentTypeDefaultValue && paymentTypeDefaultValue[0],
        payment_date: editSaleItem ? (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.toLocalDateObject)(editSaleItem.payment_date) : '',
        // paid_amount: payment_date ? payment_date.paid_amount === "0.00" ? createPaymentItem.grand_total : createPaymentItem.paid_amount : '',
        payment_id: editSaleItem ? editSaleItem.id : "",
        amount: editSaleItem ? editSaleItem.amount : "",
        reference: editSaleItem ? editSaleItem.reference === null ? " " : editSaleItem.reference : ""
      });
    }
  }, [editSaleItem]);
  var paymentMethodOption = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedOptions)(_constants__WEBPACK_IMPORTED_MODULE_10__.paymentMethodOptions);
  var paymentTypeDefaultValue = paymentMethodOption.filter(function (option) {
    return option.id === Number(editSaleItem.payment_type);
  }).map(function (option) {
    return {
      value: option.id,
      label: option.name
    };
  });
  var handleCallback = function handleCallback(date) {
    setPaymentValue(function (previousState) {
      return _objectSpread(_objectSpread({}, previousState), {}, {
        payment_date: date
      });
    });
  };
  var onPaymentMethodChange = function onPaymentMethodChange(obj) {
    setPaymentValue(function (paymentValue) {
      return _objectSpread(_objectSpread({}, paymentValue), {}, {
        payment_type: obj
      });
    });
  };
  var prepareFormData = function prepareFormData(prepareData) {
    var formValue = {
      payment_date: dayjs__WEBPACK_IMPORTED_MODULE_3___default()(prepareData.payment_date).format('YYYY-MM-DD'),
      payment_type: prepareData.payment_type.value,
      amount: prepareData.amount,
      payment_id: prepareData.payment_id,
      reference: prepareData.reference,
      received_amount: prepareData.amount_to_pay
    };
    return formValue;
  };
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      amount: ''
    }),
    _useState4 = _slicedToArray(_useState3, 2),
    errors = _useState4[0],
    setErrors = _useState4[1];
  var handleValidation = function handleValidation() {
    var errorss = {};
    var isValid = false;
    if (!paymentValue['amount']) {
      errorss['amount'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)("globally.require-input.validate.label");
    } else if (paymentValue['amount'] && paymentValue['amount'] > paymentValue["amount_to_pay"]) {
      errorss['amount'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)("paying-amount-validate-label");
    } else {
      isValid = true;
    }
    setErrors(errorss);
    return isValid;
  };
  var onSubmit = function onSubmit(event) {
    event.preventDefault();
    var valid = handleValidation();
    if (valid) {
      dispatch((0,_store_action_salePaymentAction__WEBPACK_IMPORTED_MODULE_14__.editSalePayment)(prepareFormData(paymentValue)));
      clearField();
    }
  };
  var clearField = function clearField() {
    closeModal(false);
  };
  var onChangeAmount = function onChangeAmount(e) {
    setPaymentValue(function (paymentValue) {
      return _objectSpread(_objectSpread({}, paymentValue), {}, {
        amount: e.target.value
      });
    });
  };
  var onChangeReference = function onChangeReference(e) {
    setPaymentValue(function (paymentValue) {
      return _objectSpread(_objectSpread({}, paymentValue), {}, {
        reference: e.target.value
      });
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"], {
    show: isEditModalOpen,
    onHide: closeModal,
    size: "lg",
    keyboard: true,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"].Header, {
      closeButton: true,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"].Title, {
        children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)("edit-payment-title")
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"].Body, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(reactstrap__WEBPACK_IMPORTED_MODULE_8__["default"], {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
          className: "col-4 mb-3",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)("react-data-table.date.column.label"), " :"]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_shared_datepicker_ReactDatePicker__WEBPACK_IMPORTED_MODULE_9__["default"], {
            onChangeDate: handleCallback,
            newStartDate: paymentValue.payment_date
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
          className: "col-4 mb-3",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)("globally.detail.reference"), " :"]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("input", {
            type: "text",
            name: "reference",
            placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.placeholderText)("reference-placeholder-label"),
            className: "form-control",
            autoFocus: true,
            readOnly: true,
            onChange: function onChange(e) {
              return onChangeReference(e);
            },
            value: paymentValue.reference
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("div", {
          className: "col-4 mb-3",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_11__["default"], {
            title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)("globally.react-table.column.payment-type.label")
            // placeholder={placeholderText("payment-type-options.placeholder.label")}
            ,
            defaultValue: paymentTypeDefaultValue[0],
            multiLanguageOption: paymentMethodOption,
            onChange: onPaymentMethodChange
            // errors={errors['base_unit']}
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
          className: "col-4",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)("input-Amount-to-pay-title"), " :"]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("input", {
            type: "text",
            name: "name",
            placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.placeholderText)("globally.input.name.placeholder.label"),
            className: "form-control",
            autoFocus: true,
            readOnly: true,
            value: paymentValue.amount_to_pay
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
          className: "col-4",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)("paying-amount-title"), " :"]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("span", {
            className: "required"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("input", {
            type: "text",
            name: "amount"
            // placeholder={placeholderText("globally.input.name.placeholder.label")}
            ,
            className: "form-control",
            autoFocus: true,
            placeholder: "Enter Paying Amount",
            onKeyPress: function onKeyPress(event) {
              return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.decimalValidate)(event);
            },
            onChange: function onChange(e) {
              return onChangeAmount(e);
            },
            value: paymentValue.amount
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("span", {
            className: "text-danger d-block fw-400 fs-small mt-2",
            children: errors['amount'] ? errors['amount'] : null
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_shared_components_modelFooter__WEBPACK_IMPORTED_MODULE_12__["default"], {
          clearField: clearField,
          onSubmit: onSubmit
        })]
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EditPaymentModal);

/***/ },

/***/ "./resources/pos/src/shared/action-buttons/ActionDropDownButton.js"
/*!*************************************************************************!*\
  !*** ./resources/pos/src/shared/action-buttons/ActionDropDownButton.js ***!
  \*************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Dropdown.js");
/* harmony import */ var _sharedMethod__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.mjs");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "./node_modules/@fortawesome/react-fontawesome/index.es.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");








var ActionDropDownButton = function ActionDropDownButton(props) {
  var goToEditProduct = props.goToEditProduct,
    item = props.item,
    _props$onClickDeleteM = props.onClickDeleteModel,
    onClickDeleteModel = _props$onClickDeleteM === void 0 ? true : _props$onClickDeleteM,
    goToDetailScreen = props.goToDetailScreen,
    _props$isViewIcon = props.isViewIcon,
    isViewIcon = _props$isViewIcon === void 0 ? false : _props$isViewIcon,
    _props$isPdfIcon = props.isPdfIcon,
    isPdfIcon = _props$isPdfIcon === void 0 ? false : _props$isPdfIcon,
    isCreateSaleReturn = props.isCreateSaleReturn,
    onCreateSaleReturnClick = props.onCreateSaleReturnClick,
    _props$isCreatePaymen = props.isCreatePayment,
    isCreatePayment = _props$isCreatePaymen === void 0 ? false : _props$isCreatePaymen,
    onPdfClick = props.onPdfClick,
    title = props.title,
    _props$isPaymentShow = props.isPaymentShow,
    isPaymentShow = _props$isPaymentShow === void 0 ? false : _props$isPaymentShow,
    onShowPaymentClick = props.onShowPaymentClick,
    onCreatePaymentClick = props.onCreatePaymentClick,
    onCreateSaleClick = props.onCreateSaleClick,
    isCreatesSales = props.isCreatesSales,
    _props$isReceiptShow = props.isReceiptShow,
    isReceiptShow = _props$isReceiptShow === void 0 ? false : _props$isReceiptShow,
    onShowReceiptClick = props.onShowReceiptClick,
    _props$isRideDownload = props.isRideDownload,
    isRideDownload = _props$isRideDownload === void 0 ? false : _props$isRideDownload,
    _props$rideUrl = props.rideUrl,
    rideUrl = _props$rideUrl === void 0 ? null : _props$rideUrl,
    _props$isEmitirFactur = props.isEmitirFacturaShow,
    isEmitirFacturaShow = _props$isEmitirFactur === void 0 ? false : _props$isEmitirFactur,
    onEmitirFacturaClick = props.onEmitirFacturaClick,
    _props$isEmitiendoFac = props.isEmitiendoFactura,
    isEmitiendoFactura = _props$isEmitiendoFac === void 0 ? false : _props$isEmitiendoFac;
  var _useSelector = (0,react_redux__WEBPACK_IMPORTED_MODULE_6__.useSelector)(function (state) {
      return state;
    }),
    config = _useSelector.config;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"], {
    className: "table-dropdown",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Toggle, {
      id: "dropdown-autoclose-true",
      className: "text-primary hide-arrow bg-transparent border-0 p-0",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("i", {
        className: "fa-solid fa-ellipsis-vertical",
        id: "dropdown-autoclose-true"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__.FontAwesomeIcon, {
        icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.faEllipsisVertical,
        className: "fs-1"
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Menu, {
      align: "end",
      popperConfig: {
        strategy: 'fixed',
        modifiers: [{
          name: 'offset',
          options: {
            offset: [0, 4]
          }
        }]
      },
      renderOnMount: true
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Menu, {
      align: "end",
      children: [isViewIcon ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Item, {
        onClick: function onClick(e) {
          e.stopPropagation();
          goToDetailScreen(item.id);
        },
        eventKey: "1",
        className: "py-3 px-4 d-flex align-items-center fs-6",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__.FontAwesomeIcon, {
          icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.faEye,
          className: "me-2"
        }), (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)('globally.view.tooltip.label'), " ", title]
      }) : null, isPdfIcon ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Item, {
        onClick: function onClick(e) {
          e.stopPropagation();
          onPdfClick(item.id);
        },
        eventKey: "2",
        className: "py-3 px-4 d-flex align-items-center fs-6",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__.FontAwesomeIcon, {
          icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.faFilePdf,
          className: "me-2"
        }), " ", (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)('globally.pdf.download.label')]
      }) : null, isReceiptShow ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Item, {
        onClick: function onClick(e) {
          e.stopPropagation();
          onShowReceiptClick(item);
        },
        eventKey: "receipt",
        className: "py-3 px-4 d-flex align-items-center fs-6",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__.FontAwesomeIcon, {
          icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.faFileInvoice,
          className: "me-2"
        }), "Ver Ticket"]
      }) : null, isRideDownload && rideUrl ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Item, {
        as: "a",
        href: rideUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        onClick: function onClick(e) {
          return e.stopPropagation();
        },
        eventKey: "ride",
        className: "py-3 px-4 d-flex align-items-center fs-6 text-danger",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__.FontAwesomeIcon, {
          icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.faFileContract,
          className: "me-2"
        }), "Descargar RIDE"]
      }) : null, isEmitirFacturaShow && !item.numero_comprobante ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Item, {
        onClick: function onClick(e) {
          e.stopPropagation();
          if (isEmitiendoFactura) {
            return;
          }
          onEmitirFacturaClick(item);
        },
        eventKey: "emitir-factura",
        disabled: isEmitiendoFactura,
        className: "py-3 px-4 d-flex align-items-center fs-6",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("img", {
          src: "https://res.cloudinary.com/dxt0es7sj/image/upload/v1785960274/sri_negro_ct8qgt.svg",
          alt: "SRI",
          className: "me-2"
        }), isEmitiendoFactura ? 'Emitiendo...' : 'Emitir Factura']
      }) : null, item.payment_status !== 2 && isPaymentShow ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Item, {
        onClick: function onClick(e) {
          e.stopPropagation();
          onShowPaymentClick(item);
        },
        eventKey: "5",
        className: "py-3 px-4 d-flex align-items-center fs-6",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__.FontAwesomeIcon, {
          icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.faDollarSign,
          className: "me-2"
        }), " ", (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)('globally.show.payment.label')]
      }) : null, isCreatePayment && item.payment_status !== 1 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Item, {
        onClick: function onClick(e) {
          e.stopPropagation();
          onCreatePaymentClick(item);
        },
        eventKey: "6",
        className: "py-3 px-4 d-flex align-items-center fs-6",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__.FontAwesomeIcon, {
          icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.faDollarSign,
          className: "me-2"
        }), (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)("create-payment-title")]
      }) : null, isCreatesSales && !item.is_sale_created ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Item, {
        onClick: function onClick(e) {
          e.stopPropagation();
          onCreateSaleClick(item);
        },
        eventKey: "6",
        className: "py-3 px-4 d-flex align-items-center fs-6",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__.FontAwesomeIcon, {
          icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.faCartShopping,
          className: "me-2"
        }), (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)("sale.create.title")]
      }) : null, config && config.includes(_constants__WEBPACK_IMPORTED_MODULE_5__.Permissions.MANAGE_SALE_RETURN) && isCreateSaleReturn ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Item, {
        onClick: function onClick(e) {
          e.stopPropagation();
          onCreateSaleReturnClick(item);
        },
        eventKey: "6",
        className: "py-3 px-4 d-flex align-items-center fs-6",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__.FontAwesomeIcon, {
          icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.faCartShopping,
          className: "me-2"
        }), item.is_return === 1 ? (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)("sale-return.edit.title") : (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)("sale-return.create.title")]
      }) : null, goToEditProduct && !item.is_sale_created && item.is_return !== 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Item, {
        onClick: function onClick(e) {
          e.stopPropagation();
          goToEditProduct(item);
        },
        eventKey: "3",
        className: "py-3 px-4 d-flex align-items-center fs-6",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__.FontAwesomeIcon, {
          icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.faPenToSquare,
          className: "me-2"
        }), (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)('globally.edit.tooltip.label'), " ", title]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Item, {
        onClick: function onClick(e) {
          e.stopPropagation();
          onClickDeleteModel(item);
        },
        eventKey: "4",
        className: "py-3 px-4 d-flex align-items-center fs-6",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__.FontAwesomeIcon, {
          icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.faTrash,
          className: "me-2"
        }), " ", (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)('globally.delete.tooltip.label'), " ", title]
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ActionDropDownButton);

/***/ },

/***/ "./resources/pos/src/shared/components/purchase/ProductModal.js"
/*!**********************************************************************!*\
  !*** ./resources/pos/src/shared/components/purchase/ProductModal.js ***!
  \**********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Form.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/InputGroup.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Modal.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Row.js");
/* harmony import */ var _calculation_calculation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../calculation/calculation */ "./resources/pos/src/shared/calculation/calculation.js");
/* harmony import */ var _sharedMethod__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _select_reactSelect__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../select/reactSelect */ "./resources/pos/src/shared/select/reactSelect.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }







var ProductModal = function ProductModal(props) {
  var title = props.title,
    product = props.product,
    id = props.id,
    modalId = props.modalId,
    isOpen = props.isOpen,
    handleClose = props.handleClose,
    onProductUpdateInCart = props.onProductUpdateInCart,
    updateCost = props.updateCost,
    updateDiscount = props.updateDiscount,
    updateTax = props.updateTax,
    updateSubTotal = props.updateSubTotal,
    productUnits = props.productUnits,
    updatePurchaseUnit = props.updatePurchaseUnit,
    setIsOpen = props.setIsOpen,
    frontSetting = props.frontSetting;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(product.net_unit_cost),
    _useState2 = _slicedToArray(_useState, 2),
    netUnitCost = _useState2[0],
    setNetUnitCost = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(product),
    _useState4 = _slicedToArray(_useState3, 2),
    productModalData = _useState4[0],
    setProductModalData = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(product.tax_value),
    _useState6 = _slicedToArray(_useState5, 2),
    taxValue = _useState6[0],
    setTaxValue = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(product.discount_value),
    _useState8 = _slicedToArray(_useState7, 2),
    discountValue = _useState8[0],
    setDiscountValue = _useState8[1];
  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('0'),
    _useState0 = _slicedToArray(_useState9, 2),
    purchaseUnit = _useState0[0],
    setPurchaseUnit = _useState0[1];
  var _useState1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState10 = _slicedToArray(_useState1, 2),
    selectedPurchaseUnit = _useState10[0],
    setSelectedPurchaseUnit = _useState10[1];
  var _useState11 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      taxValue: '',
      discountValue: '',
      netUnitCost: ''
    }),
    _useState12 = _slicedToArray(_useState11, 2),
    errors = _useState12[0],
    setErrors = _useState12[1];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    setSelectedPurchaseUnit(productUnits.length && productUnits.filter(function (item) {
      return Number(item.id) === Number(product.purchase_unit.value ? product.purchase_unit.value : product.purchase_unit);
    }).map(function (item) {
      return {
        label: item.attributes.name,
        value: item.id
      };
    }));
    setPurchaseUnit(product.purchase_unit);
  }, [productUnits]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    setProductModalData(product);
    setNetUnitCost(netUnitCost ? netUnitCost.toFixed(2) : parseFloat(product.net_unit_cost).toFixed(2));
    setTaxType(product.tax_type === '1' || product.tax_type === 1 ? {
      value: 1,
      label: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)('tax-type.filter.exclusive.label')
    } : {
      value: 2,
      label: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)('tax-type.filter.inclusive.label')
    });
    setDiscountType(product.discount_type === '1' || product.discount_type === 1 ? {
      value: 1,
      label: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)('discount-type.filter.percentage.label')
    } : {
      value: 2,
      label: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)('discount-type.filter.fixed.label')
    });
    product.sub_total = Number((0,_calculation_calculation__WEBPACK_IMPORTED_MODULE_5__.subTotalCount)(product));
  }, [productModalData]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    setDiscountValue(product.discount_value ? parseFloat(product.discount_value).toFixed(2) : '0.00');
  }, [productModalData, product.discount_value]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    setTaxValue(product.tax_value ? parseFloat(product.tax_value).toFixed(2) : '0.00');
  }, [productModalData, product.tax_value]);
  var handleValidation = function handleValidation() {
    var errorss = {};
    var isValid = false;
    if (taxValue > 100) {
      errorss['taxValue'] = (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("globally.tax-length.validate.label");
    } else if (discountType.value === 1 && Number(discountValue) > 100) {
      errorss['discountValue'] = (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("globally.discount-length.validate.label");
    } else if (discountType.value === 2 && Number(discountValue) > netUnitCost) {
      errorss['discountValue'] = (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)('globally.discount-cost-length.validate.label');
    } else {
      isValid = true;
    }
    setErrors(errorss);
    return isValid;
  };
  var onChangePrice = function onChangePrice(e) {
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
    setNetUnitCost(value);
  };

  // tax type dropdown functionality
  var taxTypeFilterOptions = (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedOptions)(_constants__WEBPACK_IMPORTED_MODULE_8__.taxMethodOptions);
  var _useState13 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(product.tax_type),
    _useState14 = _slicedToArray(_useState13, 2),
    taxType = _useState14[0],
    setTaxType = _useState14[1];
  var onTaxTypeChange = function onTaxTypeChange(obj) {
    setTaxType(obj);
  };
  var onChangeTax = function onChangeTax(e) {
    var _ref = e.target ? e.target : '0.00',
      value = _ref.value;
    // check if value includes a decimal point
    if (value.match(/\./g)) {
      var _value$split3 = value.split('.'),
        _value$split4 = _slicedToArray(_value$split3, 2),
        decimal = _value$split4[1];
      // restrict value to only 2 decimal places
      if ((decimal === null || decimal === void 0 ? void 0 : decimal.length) > 2) {
        // do nothing
        return;
      }
    }
    setTaxValue(value);
  };

  // discount type dropdown functionality
  var discountTypeFilterOptions = (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedOptions)(_constants__WEBPACK_IMPORTED_MODULE_8__.discountMethodOptions);
  var _useState15 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(product.discount_type),
    _useState16 = _slicedToArray(_useState15, 2),
    discountType = _useState16[0],
    setDiscountType = _useState16[1];
  var onDiscountTypeChange = function onDiscountTypeChange(obj) {
    setDiscountType(obj);
  };
  var onChangeDiscount = function onChangeDiscount(e) {
    var _ref2 = e.target ? e.target : '0.00',
      value = _ref2.value;
    // check if value includes a decimal point
    if (value.match(/\./g)) {
      var _value$split5 = value.split('.'),
        _value$split6 = _slicedToArray(_value$split5, 2),
        decimal = _value$split6[1];
      // restrict value to only 2 decimal places
      if ((decimal === null || decimal === void 0 ? void 0 : decimal.length) > 2) {
        // do nothing
        return;
      }
    }
    setDiscountValue(value);
  };
  var onPurchaseUnitChange = function onPurchaseUnitChange(newlySelectedUnit) {
    setPurchaseUnit(newlySelectedUnit);
    setSelectedPurchaseUnit(newlySelectedUnit);
  };
  var onSaveDetailModal = function onSaveDetailModal(e) {
    e.preventDefault();
    var valid = handleValidation();
    if (valid) {
      if (id === modalId) {
        var newProduct = product;
        newProduct.product_cost = Number(netUnitCost);
        newProduct.fix_net_unit = Number(netUnitCost);
        newProduct.net_unit_cost = (0,_calculation_calculation__WEBPACK_IMPORTED_MODULE_5__.amountBeforeTax)(product);
        newProduct.tax_type = taxType.value.toString();
        newProduct.tax_value = Number(taxValue);
        newProduct.tax_amount = (0,_calculation_calculation__WEBPACK_IMPORTED_MODULE_5__.taxAmountMultiply)(product);
        newProduct.discount_type = discountType.value.toString();
        newProduct.discount_value = Number(discountValue);
        newProduct.discount_amount = (0,_calculation_calculation__WEBPACK_IMPORTED_MODULE_5__.discountAmountMultiply)(product);
        newProduct.sub_total = (0,_calculation_calculation__WEBPACK_IMPORTED_MODULE_5__.subTotalCount)(product);
        newProduct.purchase_unit = purchaseUnit.value ? purchaseUnit.value : purchaseUnit;
        onProductUpdateInCart(newProduct);
        handleClose(e);
        setErrors('');
        updateCost(newProduct.net_unit_cost = (0,_calculation_calculation__WEBPACK_IMPORTED_MODULE_5__.amountBeforeTax)(product));
        updateTax(newProduct.tax_value = taxValue);
        updateDiscount(newProduct.discount_value = discountValue);
        updatePurchaseUnit(newProduct.purchase_unit = purchaseUnit.value ? purchaseUnit.value : purchaseUnit);
        updateSubTotal((0,_calculation_calculation__WEBPACK_IMPORTED_MODULE_5__.subTotalCount)(product));
      }
    }
  };
  var clearField = function clearField() {
    setIsOpen(!isOpen);
    setErrors('');
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"], {
    show: isOpen,
    onHide: clearField,
    keyboard: true,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"], {
      onKeyPress: function onKeyPress(e) {
        if (e.key === 'Enter') {
          onSaveDetailModal(e);
        }
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"].Header, {
        closeButton: true,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"].Title, {
          children: title
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"].Body, {
        className: "pb-2",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_4__["default"], {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
            className: "col-md-12 mb-5",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("label", {
              className: "form-label",
              children: [(0,_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)('product.input.product-cost.label'), ":"]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
              className: "required"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__["default"], {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("input", {
                type: "text",
                name: "product_cost",
                className: "form-control",
                onKeyPress: function onKeyPress(event) {
                  return (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.decimalValidate)(event);
                },
                value: netUnitCost,
                onChange: onChangePrice
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__["default"].Text, {
                children: frontSetting.value && frontSetting.value.currency_symbol
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
              className: "text-danger d-block fw-400 fs-small mt-2",
              children: errors['netUnitCost'] ? errors['netUnitCost'] : null
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
            className: "col-md-12 mb-5",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_select_reactSelect__WEBPACK_IMPORTED_MODULE_7__["default"], {
              title: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)('product.input.tax-type.label'),
              multiLanguageOption: taxTypeFilterOptions,
              onChange: onTaxTypeChange,
              errors: '',
              defaultValue: taxType,
              placeholder: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.placeholderText)("product.input.tax-type.placeholder.label")
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
            className: "col-md-12 mb-5",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("label", {
              className: "form-label",
              children: [(0,_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)('purchase.input.order-tax.label'), ":"]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__["default"], {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("input", {
                name: "taxValue",
                type: "text",
                value: taxValue,
                className: "form-control",
                onKeyPress: function onKeyPress(event) {
                  return (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.decimalValidate)(event);
                },
                onChange: onChangeTax
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__["default"].Text, {
                children: "%"
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
              className: "text-danger d-block fw-400 fs-small mt-2",
              children: errors['taxValue'] ? errors['taxValue'] : null
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
            className: "col-md-12 mb-5",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_select_reactSelect__WEBPACK_IMPORTED_MODULE_7__["default"], {
              title: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)('purchase.product-modal.select.discount-type.label'),
              multiLanguageOption: discountTypeFilterOptions,
              onChange: onDiscountTypeChange,
              errors: '',
              defaultValue: discountType,
              placeholder: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.placeholderText)("pos-sale.select.discount-type.placeholder")
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
            className: "col-md-12 mb-5",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("label", {
              className: "form-label",
              children: [(0,_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)('purchase.order-item.table.discount.column.label'), ":"]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
              className: "required"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("input", {
              type: "text",
              name: "discountValue",
              className: "form-control",
              onChange: onChangeDiscount,
              value: discountValue,
              onKeyPress: function onKeyPress(event) {
                return (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.decimalValidate)(event);
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
              className: "text-danger d-block fw-400 fs-small mt-2",
              children: errors['discountValue'] ? errors['discountValue'] : null
            })]
          }), product.newItem !== '' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
            className: "col-md-12",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_select_reactSelect__WEBPACK_IMPORTED_MODULE_7__["default"], {
              title: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)('product.input.purchase-unit.label'),
              defaultValue: selectedPurchaseUnit,
              value: selectedPurchaseUnit,
              data: productUnits,
              onChange: onPurchaseUnitChange,
              errors: '',
              placeholder: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.placeholderText)("product.input.purchase-unit.placeholder.label")
            })
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"].Footer, _defineProperty({
        children: "justify-content-start",
        className: "pt-0"
      }, "children", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "d-flex",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("input", {
          className: "btn btn-primary me-5",
          type: "submit",
          value: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.placeholderText)('globally.save-btn'),
          onClick: function onClick(e) {
            return onSaveDetailModal(e);
          }
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("button", {
          type: "reset",
          onClick: function onClick(e) {
            e.stopPropagation();
            handleClose(e);
            setErrors('');
          },
          className: "btn btn-secondary",
          children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)('globally.cancel-btn')
        })]
      })))]
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProductModal);

/***/ },

/***/ "./resources/pos/src/shared/components/purchase/PurchaseTable.js"
/*!***********************************************************************!*\
  !*** ./resources/pos/src/shared/components/purchase/PurchaseTable.js ***!
  \***********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/InputGroup.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _ProductModal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ProductModal */ "./resources/pos/src/shared/components/purchase/ProductModal.js");
/* harmony import */ var react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-bootstrap/Form */ "./node_modules/react-bootstrap/esm/Form.js");
/* harmony import */ var _calculation_calculation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../calculation/calculation */ "./resources/pos/src/shared/calculation/calculation.js");
/* harmony import */ var _store_action_productUnitAction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../store/action/productUnitAction */ "./resources/pos/src/store/action/productUnitAction.js");
/* harmony import */ var _sharedMethod__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "./node_modules/@fortawesome/react-fontawesome/index.es.js");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
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











var PurchaseTable = function PurchaseTable(props) {
  var singleProduct = props.singleProduct,
    index = props.index,
    updateCost = props.updateCost,
    updateDiscount = props.updateDiscount,
    updateProducts = props.updateProducts,
    setUpdateProducts = props.setUpdateProducts,
    frontSetting = props.frontSetting,
    updateTax = props.updateTax,
    updateSubTotal = props.updateSubTotal,
    productUnitDropdown = props.productUnitDropdown,
    productUnits = props.productUnits,
    updatePurchaseUnit = props.updatePurchaseUnit,
    allConfigData = props.allConfigData,
    selectedWarehouseId = props.selectedWarehouseId;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    updateData = _useState2[0],
    setUpdateData = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    isOpen = _useState4[0],
    setIsOpen = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState6 = _slicedToArray(_useState5, 2),
    modalId = _useState6[0],
    setModalId = _useState6[1];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    singleProduct.newItem !== "" && productUnitDropdown(singleProduct.product_unit);
  }, [updateData, singleProduct.purchase_unit]);
  var onDeleteCartItem = function onDeleteCartItem(id) {
    var newProduct = updateProducts.filter(function (item) {
      return item.id !== id;
    });
    setUpdateProducts(newProduct);
  };
  var handleClose = function handleClose(e) {
    e.preventDefault();
    setIsOpen(!isOpen);
    e.stopPropagation();
    productUnitDropdown(singleProduct.product_unit);
    setModalId(singleProduct.id);
  };
  var onProductUpdateInCart = function onProductUpdateInCart(item) {
    setUpdateData(item);
  };
  var handleIncrement = function handleIncrement() {
    setUpdateProducts(function (updateProducts) {
      return updateProducts.map(function (item) {
        return item.id === singleProduct.id ? _objectSpread(_objectSpread({}, item), {}, {
          quantity: item.quantity++ + 1
        }) : item;
      });
    });
  };
  var handleDecrement = function handleDecrement() {
    if (singleProduct.quantity - 1 > 0.0) {
      setUpdateProducts(function (updateProducts) {
        return updateProducts.map(function (item) {
          return item.id === singleProduct.id ? _objectSpread(_objectSpread({}, item), {}, {
            quantity: item.quantity > 0.0 && item.quantity-- - 1
          }) : item;
        });
      });
    }
  };
  var handleChange = function handleChange(e) {
    e.preventDefault();
    var value = e.target.value;
    // check if value includes a decimal point
    if (value.match(/\./g)) {
      var _value$split = value.split("."),
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
        return item.id === singleProduct.id ? _objectSpread(_objectSpread({}, item), {}, {
          quantity: Number(value)
        }) : item;
      });
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("tr", {
      className: "align-middle text-nowrap",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("td", {
        className: "ps-3",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("h4", {
          className: "product-name",
          children: singleProduct.code
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
          className: "d-flex align-items-center",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
            className: "badge bg-light-success",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
              children: singleProduct.name
            })
          }), singleProduct.variation_type_name && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
            className: "badge bg-light-primary ms-1",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
              children: singleProduct.variation_type_name
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
            className: "badge bg-light-primary p-1 ms-1",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_8__.FontAwesomeIcon, {
              icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_9__.faPencil,
              onClick: function onClick(e) {
                return handleClose(e);
              },
              style: {
                cursor: "pointer"
              }
            })
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("td", {
        children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, (0,_calculation_calculation__WEBPACK_IMPORTED_MODULE_5__.amountBeforeTax)(singleProduct))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("td", {
        children: singleProduct.isEdit ? singleProduct.stocks.length >= 1 && singleProduct.stocks.map(function (item) {
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
            className: "badge bg-light-warning",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("span", {
              children: [item.quantity, "\xA0", singleProduct.short_name]
            })
          });
        }) : function (_singleProduct$wareho) {
          // Cantidad del almacén QUE ESTÁ SELECCIONADO ahora
          // mismo -- no un número fijo calculado cuando se
          // cargó la lista. Si el producto nunca ha tenido
          // stock en ese almacén, simplemente no aparece en
          // el desglose -- se muestra 0, no se oculta el
          // producto (para poder comprarlo ahí por primera
          // vez).
          var warehouseEntry = (_singleProduct$wareho = singleProduct.warehouseStock) === null || _singleProduct$wareho === void 0 ? void 0 : _singleProduct$wareho.find(function (w) {
            return String(w.warehouse_id) === String(selectedWarehouseId);
          });
          var qty = warehouseEntry ? warehouseEntry.total_quantity : 0;
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
            className: "badge bg-light-warning",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("span", {
              children: [qty, "\xA0", singleProduct.short_name]
            })
          });
        }()
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("td", {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
          className: "custom-qty",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"], {
            className: "flex-nowrap",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"].Text, {
              className: "btn btn-primary btn-sm px-4 pt-2",
              onClick: function onClick() {
                return handleDecrement();
              },
              children: "-"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_4__["default"].Control, {
              "aria-label": "Product Quantity",
              onKeyPress: function onKeyPress(event) {
                return (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.decimalValidate)(event);
              },
              className: "text-center px-0 py-2 rounded-0 hide-arrow",
              value: singleProduct.quantity,
              type: "number",
              step: 0.01,
              min: 0.0,
              onChange: function onChange(e) {
                return handleChange(e);
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"].Text, {
              className: "btn btn-primary btn-sm px-4 px-4 pt-2",
              onClick: function onClick(e) {
                return handleIncrement(e);
              },
              children: "+"
            })]
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("td", {
        children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, (0,_calculation_calculation__WEBPACK_IMPORTED_MODULE_5__.discountAmountMultiply)(singleProduct))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("td", {
        children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, (0,_calculation_calculation__WEBPACK_IMPORTED_MODULE_5__.taxAmountMultiply)(singleProduct))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("td", {
        children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, (0,_calculation_calculation__WEBPACK_IMPORTED_MODULE_5__.subTotalCount)(singleProduct))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("td", {
        className: "text-start",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("button", {
          className: "btn px-2 text-danger fs-3",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_8__.FontAwesomeIcon, {
            icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_9__.faTrash,
            onClick: function onClick() {
              return onDeleteCartItem(singleProduct.id);
            }
          })
        })
      })]
    }, index), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_ProductModal__WEBPACK_IMPORTED_MODULE_3__["default"], {
      handleClose: handleClose,
      setIsOpen: setIsOpen,
      show: isOpen,
      modalId: modalId,
      isOpen: isOpen,
      frontSetting: frontSetting,
      product: singleProduct,
      id: singleProduct.id,
      productUnits: productUnits,
      updatePurchaseUnit: updatePurchaseUnit,
      updateProducts: updateProducts,
      title: singleProduct.name,
      onProductUpdateInCart: onProductUpdateInCart,
      updateSubTotal: updateSubTotal,
      updateCost: updateCost,
      updateDiscount: updateDiscount,
      updateTax: updateTax
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var productUnits = state.productUnits,
    frontSetting = state.frontSetting,
    allConfigData = state.allConfigData;
  return {
    productUnits: productUnits,
    frontSetting: frontSetting,
    allConfigData: allConfigData
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_2__.connect)(mapStateToProps, {
  productUnitDropdown: _store_action_productUnitAction__WEBPACK_IMPORTED_MODULE_6__.productUnitDropdown
})(PurchaseTable));

/***/ },

/***/ "./resources/pos/src/shared/prepareArray/editPrepareArray.js"
/*!*******************************************************************!*\
  !*** ./resources/pos/src/shared/prepareArray/editPrepareArray.js ***!
  \*******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   editPrepareArray: () => (/* binding */ editPrepareArray)
/* harmony export */ });
var editPrepareArray = function editPrepareArray(products, warehouse_id) {
  var purchaseProductRowArray = [];
  products.forEach(function (product) {
    purchaseProductRowArray.push({
      name: product.name,
      code: product.product.code,
      product_unit: product.product.product_unit,
      product_id: product.product_id,
      short_name: product.purchase_unit.short_name,
      stock_alert: product.product.stock_alert,
      product_cost: product.product_cost,
      fix_net_unit: product.product_cost,
      net_unit_cost: product.product_cost,
      tax_type: product.tax_type,
      tax_value: product.tax_value,
      tax_amount: product.tax_amount,
      discount_type: product.discount_type,
      discount_value: product.discount_value,
      discount_amount: product.discount_amount,
      purchase_unit: product.purchase_unit.id,
      quantity: product.quantity,
      sub_total: Number(product.sub_total),
      id: product.id,
      purchase_item_id: product.id,
      newItem: '',
      isEdit: true,
      stocks: product.product.stocks.filter(function (item) {
        return item.warehouse_id === warehouse_id;
      })
    });
  });
  return purchaseProductRowArray;
};

/***/ },

/***/ "./resources/pos/src/shared/prepareArray/preparePurchaseArray.js"
/*!***********************************************************************!*\
  !*** ./resources/pos/src/shared/prepareArray/preparePurchaseArray.js ***!
  \***********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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

/***/ "./resources/pos/src/shared/showPayment/ShowPayment.js"
/*!*************************************************************!*\
  !*** ./resources/pos/src/shared/showPayment/ShowPayment.js ***!
  \*************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Button.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Modal.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Table.js");
/* harmony import */ var _sharedMethod__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "./node_modules/@fortawesome/react-fontawesome/index.es.js");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.mjs");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _components_sales_EditPaymentModal__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../components/sales/EditPaymentModal */ "./resources/pos/src/components/sales/EditPaymentModal.js");
/* harmony import */ var _store_action_salePaymentAction__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../store/action/salePaymentAction */ "./resources/pos/src/store/action/salePaymentAction.js");
/* harmony import */ var _store_action_configAction__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../store/action/configAction */ "./resources/pos/src/store/action/configAction.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }










var ShowPayment = function ShowPayment(props) {
  var onShowPaymentClick = props.onShowPaymentClick,
    isShowPaymentModel = props.isShowPaymentModel,
    allSalePayments = props.allSalePayments,
    currencySymbol = props.currencySymbol,
    setIsShowPaymentModel = props.setIsShowPaymentModel,
    createPaymentItem = props.createPaymentItem,
    allConfigData = props.allConfigData;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    isEditModalOpen = _useState2[0],
    setIsEditModalOpen = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({}),
    _useState4 = _slicedToArray(_useState3, 2),
    editSaleItem = _useState4[0],
    setEditSaleItem = _useState4[1];
  var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_7__.useDispatch)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    (0,_store_action_configAction__WEBPACK_IMPORTED_MODULE_10__.fetchConfig)();
  }, []);
  var onEditClick = function onEditClick(item) {
    setIsEditModalOpen(true);
    setEditSaleItem(item);
  };
  var closeModal = function closeModal() {
    setIsEditModalOpen(!isEditModalOpen);
    setIsShowPaymentModel(false);
  };
  var onDeletClick = function onDeletClick(paymentId) {
    dispatch((0,_store_action_salePaymentAction__WEBPACK_IMPORTED_MODULE_9__.deleteSalePayment)(paymentId));
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__["default"], {
      show: isShowPaymentModel,
      onHide: onShowPaymentClick,
      size: "lg",
      keyboard: true,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__["default"].Header, {
        closeButton: true,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__["default"].Title, {
          children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.getFormattedMessage)("globally.show.payment.label")
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__["default"].Body, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"], {
          responsive: true,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("thead", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("tr", {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
                children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.getFormattedMessage)("react-data-table.date.column.label")
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
                className: "ps-3",
                children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.getFormattedMessage)("globally.detail.reference")
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
                className: "ps-3",
                children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.getFormattedMessage)("expense.input.amount.label")
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
                className: "ps-3",
                children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.getFormattedMessage)("pos-sale.detail.Paid-bt.title")
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
                children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.getFormattedMessage)("react-data-table.action.column.label")
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("tbody", {
            children: allSalePayments && allSalePayments.length !== 0 && allSalePayments.map(function (item) {
              return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("tr", {
                className: "align-middle",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
                  children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.getFormattedDate)(item === null || item === void 0 ? void 0 : item.payment_date, allConfigData && allConfigData)
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
                  children: item.reference ? item.reference : "N/A"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
                  children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.currencySymbolHandling)(allConfigData, currencySymbol, item.amount)
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("td", {
                  children: [item.payment_type === 1 && "Cash", item.payment_type === 2 && "Cheque", item.payment_type === 3 && "Bank Transfer", item.payment_type === 4 && "Other"]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("td", {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"], {
                    type: "button",
                    title: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.placeholderText)("globally.edit.tooltip.label"),
                    variant: "light",
                    onClick: function onClick() {
                      return onEditClick(item);
                    },
                    className: "text-success btn-sm me-1",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__.FontAwesomeIcon, {
                      icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__.faPencil
                    })
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"], {
                    type: "button",
                    title: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.placeholderText)("globally.delete.tooltip.label"),
                    variant: "light",
                    onClick: function onClick() {
                      return onDeletClick(item.id);
                    },
                    className: "btn-sm text-danger",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__.FontAwesomeIcon, {
                      icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__.faTrash
                    })
                  })]
                })]
              });
            })
          })]
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_components_sales_EditPaymentModal__WEBPACK_IMPORTED_MODULE_8__["default"], {
      createPaymentItem: createPaymentItem,
      isEditModalOpen: isEditModalOpen,
      closeModal: closeModal,
      editSaleItem: editSaleItem
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ShowPayment);

/***/ },

/***/ "./resources/pos/src/store/action/downloadReportAction.js"
/*!****************************************************************!*\
  !*** ./resources/pos/src/store/action/downloadReportAction.js ***!
  \****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   downloadExcel: () => (/* binding */ downloadExcel),
/* harmony export */   downloadPdf: () => (/* binding */ downloadPdf)
/* harmony export */ });
/* harmony import */ var _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config/apiConfig */ "./resources/pos/src/config/apiConfig.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _toastAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./toastAction */ "./resources/pos/src/store/action/toastAction.js");
/* harmony import */ var _loadingAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./loadingAction */ "./resources/pos/src/store/action/loadingAction.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }





/**
 * Generic Excel report downloader.
 *
 * @param {string} endpoint  - Full API path with query params already included.
 * @param {string} responseKey - Key inside response.data.data that holds the URL.
 * @param {Function} [onSuccess] - Optional callback after download starts (e.g. setIsWarehouseValue(false)).
 * @param {boolean} [isLoading=true] - Whether to show/hide global loading spinner.
 *
 * Usage examples:
 *
 *   // Ventas (warehouse)
 *   dispatch(downloadExcel(
 *     `sales-report-excel?warehouse_id=${warehouse}`,
 *     'sale_excel_url',
 *     () => setIsWarehouseValue(false)
 *   ));
 *
 *   // Productos (id opcional)
 *   dispatch(downloadExcel(
 *     `products-export-excel${id ? '?id=' + id : ''}`,
 *     'product_excel_url',
 *     () => setIsWarehouseValue(false)
 *   ));
 *
 *   // Top selling (fechas)
 *   dispatch(downloadExcel(
 *     `top-selling-product-report-excel?start_date=${dates.start_date ?? null}&end_date=${dates.end_date ?? null}`,
 *     'top_selling_product_excel_url',
 *     () => setIsWarehouseValue(false)
 *   ));
 */
var downloadExcel = function downloadExcel(endpoint, responseKey) {
  var onSuccess = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var isLoading = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(dispatch) {
      var response, url, _error$response, message, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            if (isLoading) dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_3__.setLoading)(true));
            _context.p = 1;
            _context.n = 2;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].get(endpoint);
          case 2:
            response = _context.v;
            url = response.data.data[responseKey];
            window.open(url, '_blank');
            if (onSuccess) onSuccess();
            _context.n = 4;
            break;
          case 3:
            _context.p = 3;
            _t = _context.v;
            message = (_t === null || _t === void 0 || (_error$response = _t.response) === null || _error$response === void 0 || (_error$response = _error$response.data) === null || _error$response === void 0 ? void 0 : _error$response.message) || 'Something went wrong';
            dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
              text: message,
              type: _constants__WEBPACK_IMPORTED_MODULE_1__.toastType.ERROR
            }));
          case 4:
            _context.p = 4;
            if (isLoading) dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_3__.setLoading)(false));
            return _context.f(4);
          case 5:
            return _context.a(2);
        }
      }, _callee, null, [[1, 3, 4, 5]]);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();
};

/**
 * Generic PDF report downloader.
 *
 * @param {string} endpoint  - Full API path including the record ID.
 * @param {string} responseKey - Key inside response.data.data that holds the PDF URL.
 * @param {boolean} [isLoading=true] - Whether to show/hide global loading spinner.
 *
 * Usage examples:
 *
 *   // Venta
 *   dispatch(downloadPdf(`sale-pdf-download/${saleId}`, 'sale_pdf_url'));
 *
 *   // Compra
 *   dispatch(downloadPdf(`purchase-pdf-download/${purchaseId}`, 'purchase_pdf_url'));
 *
 *   // Cotización
 *   dispatch(downloadPdf(`quotation-pdf-download/${quotationId}`, 'quotation_pdf_url'));
 *
 *   // Devolución de venta
 *   dispatch(downloadPdf(`sale-return-pdf-download/${saleReturnId}`, 'sale_return_pdf_url'));
 *
 *   // Devolución de compra
 *   dispatch(downloadPdf(`purchase-return-pdf-download/${purchaseReturnId}`, 'purchase_return_pdf_url'));
 */
var downloadPdf = function downloadPdf(endpoint, responseKey) {
  var isLoading = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(dispatch) {
      var response, url, _error$response2, message, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            if (isLoading) dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_3__.setLoading)(true));
            _context2.p = 1;
            _context2.n = 2;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].get(endpoint);
          case 2:
            response = _context2.v;
            url = response.data.data[responseKey];
            window.open(url, '_blank');
            _context2.n = 4;
            break;
          case 3:
            _context2.p = 3;
            _t2 = _context2.v;
            message = (_t2 === null || _t2 === void 0 || (_error$response2 = _t2.response) === null || _error$response2 === void 0 || (_error$response2 = _error$response2.data) === null || _error$response2 === void 0 ? void 0 : _error$response2.message) || 'Something went wrong';
            dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
              text: message,
              type: _constants__WEBPACK_IMPORTED_MODULE_1__.toastType.ERROR
            }));
          case 4:
            _context2.p = 4;
            if (isLoading) dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_3__.setLoading)(false));
            return _context2.f(4);
          case 5:
            return _context2.a(2);
        }
      }, _callee2, null, [[1, 3, 4, 5]]);
    }));
    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }();
};

/***/ },

/***/ "./resources/pos/src/store/action/purchaseAction.js"
/*!**********************************************************!*\
  !*** ./resources/pos/src/store/action/purchaseAction.js ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addPurchase: () => (/* binding */ addPurchase),
/* harmony export */   deletePurchase: () => (/* binding */ deletePurchase),
/* harmony export */   editPurchase: () => (/* binding */ editPurchase),
/* harmony export */   fetchPurchase: () => (/* binding */ fetchPurchase),
/* harmony export */   fetchPurchases: () => (/* binding */ fetchPurchases)
/* harmony export */ });
/* harmony import */ var _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config/apiConfig */ "./resources/pos/src/config/apiConfig.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _toastAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./toastAction */ "./resources/pos/src/store/action/toastAction.js");
/* harmony import */ var _totalRecordAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./totalRecordAction */ "./resources/pos/src/store/action/totalRecordAction.js");
/* harmony import */ var _shared_requestParam__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/requestParam */ "./resources/pos/src/shared/requestParam.js");
/* harmony import */ var _loadingAction__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./loadingAction */ "./resources/pos/src/store/action/loadingAction.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _saveButtonAction__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./saveButtonAction */ "./resources/pos/src/store/action/saveButtonAction.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }








var fetchPurchases = function fetchPurchases() {
  var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var isLoading = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(dispatch) {
      var url;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            if (isLoading) {
              dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_5__.setLoading)(true));
            }
            url = _constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.PURCHASES;
            if (!_.isEmpty(filter) && (filter.page || filter.pageSize || filter.search || filter.order_By || filter.created_at)) {
              url += (0,_shared_requestParam__WEBPACK_IMPORTED_MODULE_4__["default"])(filter, null, null, null, url);
            }
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].get(url).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.purchaseActionType.FETCH_PURCHASES,
                payload: response.data.data
              });
              dispatch((0,_totalRecordAction__WEBPACK_IMPORTED_MODULE_3__.setTotalRecord)(response.data.meta.total !== undefined && response.data.meta.total >= 0 ? response.data.meta.total : response.data.data.total));
              if (isLoading) {
                dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_5__.setLoading)(false));
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
var fetchPurchase = function fetchPurchase(purchaseId, singlePurchase) {
  var isLoading = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(dispatch) {
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            if (isLoading) {
              dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_5__.setLoading)(true));
            }
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].get(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.PURCHASES + "/" + purchaseId + "/edit", singlePurchase).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.purchaseActionType.FETCH_PURCHASE,
                payload: response.data.data
              });
              if (isLoading) {
                dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_5__.setLoading)(false));
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
var addPurchase = function addPurchase(purchase, navigate) {
  return /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(dispatch) {
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_7__.setSavingButton)(true));
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].post(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.PURCHASES, purchase).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.purchaseActionType.ADD_PURCHASE,
                payload: response.data.data
              });
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("purchase.success.create.message")
              }));
              navigate("/app/purchases");
              dispatch((0,_totalRecordAction__WEBPACK_IMPORTED_MODULE_3__.addInToTotalRecord)(1));
              dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_7__.setSavingButton)(false));
            })["catch"](function (_ref6) {
              var response = _ref6.response;
              dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_7__.setSavingButton)(false));
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
var editPurchase = function editPurchase(purchaseId, purchase, navigate) {
  return /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(dispatch) {
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_7__.setSavingButton)(true));
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].put(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.PURCHASES + "/" + purchaseId, purchase).then(function (response) {
              navigate("/app/purchases");
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("purchase.success.edit.message")
              }));
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.purchaseActionType.EDIT_PURCHASE,
                payload: response.data.data
              });
              dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_7__.setSavingButton)(false));
            })["catch"](function (_ref8) {
              var response = _ref8.response;
              dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_7__.setSavingButton)(false));
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
      return _ref7.apply(this, arguments);
    };
  }();
};
var deletePurchase = function deletePurchase(purchaseId) {
  return /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(dispatch) {
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"]["delete"](_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.PURCHASES + "/" + purchaseId).then(function (response) {
              dispatch((0,_totalRecordAction__WEBPACK_IMPORTED_MODULE_3__.removeFromTotalRecord)(1));
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.purchaseActionType.DELETE_PURCHASE,
                payload: purchaseId
              });
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("purchase.success.delete.message")
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

/***/ "./resources/pos/src/store/action/purchaseDetailsAction.js"
/*!*****************************************************************!*\
  !*** ./resources/pos/src/store/action/purchaseDetailsAction.js ***!
  \*****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   purchaseDetailsAction: () => (/* binding */ purchaseDetailsAction)
/* harmony export */ });
/* harmony import */ var _loadingAction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loadingAction */ "./resources/pos/src/store/action/loadingAction.js");
/* harmony import */ var _config_apiConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config/apiConfig */ "./resources/pos/src/config/apiConfig.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _toastAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./toastAction */ "./resources/pos/src/store/action/toastAction.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }




var purchaseDetailsAction = function purchaseDetailsAction(purchaseId, singlePurchase) {
  var isLoading = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(dispatch) {
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            if (isLoading) {
              dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_0__.setLoading)(true));
            }
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_1__["default"].get(_constants__WEBPACK_IMPORTED_MODULE_2__.apiBaseURL.PURCHASE_DETAILS + '/' + purchaseId, singlePurchase).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_2__.purchaseActionType.PURCHASE_DETAILS,
                payload: response.data.data
              });
              if (isLoading) {
                dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_0__.setLoading)(false));
              }
            })["catch"](function (error) {
              var _error$response;
              var message = (error === null || error === void 0 || (_error$response = error.response) === null || _error$response === void 0 || (_error$response = _error$response.data) === null || _error$response === void 0 ? void 0 : _error$response.message) || 'Something went wrong';
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: message,
                type: _constants__WEBPACK_IMPORTED_MODULE_2__.toastType.ERROR
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

/***/ "./resources/pos/src/store/action/salePaymentAction.js"
/*!*************************************************************!*\
  !*** ./resources/pos/src/store/action/salePaymentAction.js ***!
  \*************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createSalePayment: () => (/* binding */ createSalePayment),
/* harmony export */   deleteSalePayment: () => (/* binding */ deleteSalePayment),
/* harmony export */   editSalePayment: () => (/* binding */ editSalePayment),
/* harmony export */   fetchSalePayments: () => (/* binding */ fetchSalePayments)
/* harmony export */ });
/* harmony import */ var _loadingAction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loadingAction */ "./resources/pos/src/store/action/loadingAction.js");
/* harmony import */ var _config_apiConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config/apiConfig */ "./resources/pos/src/config/apiConfig.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _toastAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./toastAction */ "./resources/pos/src/store/action/toastAction.js");
/* harmony import */ var _saleApiAction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./saleApiAction */ "./resources/pos/src/store/action/saleApiAction.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _totalRecordAction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./totalRecordAction */ "./resources/pos/src/store/action/totalRecordAction.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }







var createSalePayment = function createSalePayment(salePayment) {
  var isLoading = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(dispatch) {
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            if (isLoading) {
              dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_0__.setLoading)(true));
            }
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_1__["default"].post(_constants__WEBPACK_IMPORTED_MODULE_2__.apiBaseURL.SALES + "/" + salePayment.sale_id + "/capture-payment", salePayment).then(function (response) {
              if (isLoading) {
                dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_0__.setLoading)(false));
              }
              dispatch((0,_saleApiAction__WEBPACK_IMPORTED_MODULE_4__.callSaleApi)(true));
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.getFormattedMessage)("sale.payment.create.success")
              }));
            })["catch"](function (_ref2) {
              var response = _ref2.response;
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: response.data.message,
                type: _constants__WEBPACK_IMPORTED_MODULE_2__.toastType.ERROR
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
var fetchSalePayments = function fetchSalePayments(sale_id) {
  var isLoading = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(dispatch) {
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            if (isLoading) {
              dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_0__.setLoading)(true));
            }
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_1__["default"].get(_constants__WEBPACK_IMPORTED_MODULE_2__.apiBaseURL.SALES + "/" + sale_id + "/payments").then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_2__.saleActionType.FETCH_SALE_PAYMENT,
                payload: response.data.data
              });
            })["catch"](function (response) {
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: response.response.data.message,
                type: _constants__WEBPACK_IMPORTED_MODULE_2__.toastType.ERROR
              }));
            })["finally"](function () {
              if (isLoading) {
                dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_0__.setLoading)(false));
              }
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
var editSalePayment = function editSalePayment(details) {
  var isLoading = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(dispatch) {
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            if (isLoading) {
              dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_0__.setLoading)(true));
            }
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_1__["default"].post(_constants__WEBPACK_IMPORTED_MODULE_2__.apiBaseURL.SALES + "/" + details.payment_id + "/payment", details).then(function (response) {
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.getFormattedMessage)("sale.payment.edit.success")
              }));
              var data = response.data.data.attributes;
              var newData = Object.assign(data, {
                id: response.data.data.id
              });
              newData && dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_2__.saleActionType.EDIT_SALE_PAYMENT,
                payload: newData
              });
              if (isLoading) {
                dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_0__.setLoading)(false));
              }
            })["catch"](function (_ref5) {
              var response = _ref5.response;
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: response.data.message,
                type: _constants__WEBPACK_IMPORTED_MODULE_2__.toastType.ERROR
              }));
            });
          case 1:
            return _context3.a(2);
        }
      }, _callee3);
    }));
    return function (_x3) {
      return _ref4.apply(this, arguments);
    };
  }();
};
var deleteSalePayment = function deleteSalePayment(paymentId) {
  var isLoading = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(dispatch) {
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            if (isLoading) {
              dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_0__.setLoading)(true));
            }
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_1__["default"]["delete"](_constants__WEBPACK_IMPORTED_MODULE_2__.apiBaseURL.SALES + "/" + paymentId + "/payment").then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_2__.saleActionType.DELETE_SALE_PAYMENT,
                payload: paymentId
              });
              if (isLoading) {
                dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_0__.setLoading)(false));
              }
            })["catch"](function (_ref7) {
              var response = _ref7.response;
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: response.data.message,
                type: _constants__WEBPACK_IMPORTED_MODULE_2__.toastType.ERROR
              }));
            });
          case 1:
            return _context4.a(2);
        }
      }, _callee4);
    }));
    return function (_x4) {
      return _ref6.apply(this, arguments);
    };
  }();
};

/***/ }

}]);