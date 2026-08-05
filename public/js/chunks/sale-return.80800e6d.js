"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["sale-return"],{

/***/ "./resources/pos/src/components/saleReturn/CreateSaleReturn.js"
/*!*********************************************************************!*\
  !*** ./resources/pos/src/components/saleReturn/CreateSaleReturn.js ***!
  \*********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _SaleReturnForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SaleReturnForm */ "./resources/pos/src/components/saleReturn/SaleReturnForm.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _header_HeaderTitle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../header/HeaderTitle */ "./resources/pos/src/components/header/HeaderTitle.js");
/* harmony import */ var _store_action_customerAction__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../store/action/customerAction */ "./resources/pos/src/store/action/customerAction.js");
/* harmony import */ var _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../store/action/warehouseAction */ "./resources/pos/src/store/action/warehouseAction.js");
/* harmony import */ var _store_action_salesReturnAction__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../store/action/salesReturnAction */ "./resources/pos/src/store/action/salesReturnAction.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var _store_action_salesAction__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../store/action/salesAction */ "./resources/pos/src/store/action/salesAction.js");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var _shared_components_loaders_Spinner__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../shared/components/loaders/Spinner */ "./resources/pos/src/shared/components/loaders/Spinner.js");
/* harmony import */ var _saleReturnStatus_json__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./saleReturnStatus.json */ "./resources/pos/src/components/saleReturn/saleReturnStatus.json");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");















var CreateSaleReturn = function CreateSaleReturn(props) {
  var addSaleReturn = props.addSaleReturn,
    customers = props.customers,
    sales = props.sales,
    isLoading = props.isLoading,
    fetchSale = props.fetchSale,
    fetchAllCustomer = props.fetchAllCustomer,
    warehouses = props.warehouses,
    fetchAllWarehouses = props.fetchAllWarehouses;
  var _useParams = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_9__.useParams)(),
    id = _useParams.id;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchAllCustomer();
    fetchAllWarehouses();
    fetchSale(id);
  }, []);
  var addSaleData = function addSaleData(formValue, navigate) {
    addSaleReturn(formValue, navigate);
  };
  var selectedStatus = sales.attributes && sales.attributes.status && _saleReturnStatus_json__WEBPACK_IMPORTED_MODULE_13__.filter(function (item) {
    return item.value === sales.attributes.status;
  });
  var itemsValue = sales && sales.attributes && {
    date: sales.attributes.date,
    warehouse_id: {
      value: sales.attributes.warehouse_id,
      label: sales.attributes.warehouse_name
    },
    customer_id: {
      value: sales.attributes.customer_id,
      label: sales.attributes.customer_name
    },
    tax_rate: 0,
    tax_amount: 0,
    discount: 0,
    shipping: 0,
    grand_total: 0,
    amount: sales.attributes.amount,
    sale_items: sales.attributes.sale_items.map(function (item) {
      return {
        code: item.product && item.product.code,
        name: item.product && item.product.name,
        product_unit: item.product.product_unit,
        product_id: item.product_id,
        short_name: item.sale_unit && item.sale_unit.short_name,
        stock_alert: item.product && item.product.stock_alert,
        product_price: item.product_price,
        fix_net_unit: item.product_price,
        net_unit_price: item.product_price,
        tax_type: item.tax_type,
        tax_value: item.tax_value,
        tax_amount: item.tax_amount,
        discount_type: item.discount_type,
        discount_value: item.discount_value,
        discount_amount: item.discount_amount,
        isEdit: true,
        stock: "",
        sold_quantity: item.quantity,
        sub_total: item.sub_total,
        sale_unit: item.sale_unit && item.sale_unit.id && item.sale_unit.id,
        quantity: 0,
        id: item.id,
        sale_item_id: item.id,
        newItem: '',
        isSaleReturn: true
      };
    }),
    id: sales.id,
    sale_id: sales.id,
    status_id: sales.attributes.status,
    // status_id: {
    //     label: selectedStatus[0] && selectedStatus[0].label,
    //     value: selectedStatus[0] && selectedStatus[0].value
    // },
    note: sales.attributes.note,
    sale_reference: sales.attributes.reference_code,
    isCreateSaleReturn: true
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_3__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_11__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_header_HeaderTitle__WEBPACK_IMPORTED_MODULE_4__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)('sale-return.create.title'),
      to: "/app/sales"
    }), isLoading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_shared_components_loaders_Spinner__WEBPACK_IMPORTED_MODULE_12__["default"], {}) : sales && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_SaleReturnForm__WEBPACK_IMPORTED_MODULE_2__["default"], {
      addSaleData: addSaleData,
      singleSale: itemsValue,
      id: id,
      customers: customers,
      warehouses: warehouses
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var customers = state.customers,
    sales = state.sales,
    warehouses = state.warehouses,
    totalRecord = state.totalRecord,
    isLoading = state.isLoading,
    addSaleReturn = state.addSaleReturn;
  return {
    customers: customers,
    sales: sales,
    warehouses: warehouses,
    totalRecord: totalRecord,
    isLoading: isLoading,
    addSaleReturn: addSaleReturn
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, {
  addSaleReturn: _store_action_salesReturnAction__WEBPACK_IMPORTED_MODULE_7__.addSaleReturn,
  fetchSale: _store_action_salesAction__WEBPACK_IMPORTED_MODULE_10__.fetchSale,
  fetchAllCustomer: _store_action_customerAction__WEBPACK_IMPORTED_MODULE_5__.fetchAllCustomer,
  fetchAllWarehouses: _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_6__.fetchAllWarehouses
})(CreateSaleReturn));

/***/ },

/***/ "./resources/pos/src/components/saleReturn/DeleteSaleReturn.js"
/*!*********************************************************************!*\
  !*** ./resources/pos/src/components/saleReturn/DeleteSaleReturn.js ***!
  \*********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _shared_action_buttons_DeleteModel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/action-buttons/DeleteModel */ "./resources/pos/src/shared/action-buttons/DeleteModel.js");
/* harmony import */ var _store_action_salesReturnAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../store/action/salesReturnAction */ "./resources/pos/src/store/action/salesReturnAction.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");






var DeleteSaleReturn = function DeleteSaleReturn(props) {
  var deleteSaleReturn = props.deleteSaleReturn,
    onDelete = props.onDelete,
    deleteModel = props.deleteModel,
    onClickDeleteModel = props.onClickDeleteModel;
  var deleteSaleClick = function deleteSaleClick() {
    deleteSaleReturn(onDelete.id);
    onClickDeleteModel(false);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
    children: deleteModel && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_shared_action_buttons_DeleteModel__WEBPACK_IMPORTED_MODULE_2__["default"], {
      onClickDeleteModel: onClickDeleteModel,
      deleteModel: deleteModel,
      deleteUserClick: deleteSaleClick,
      name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.getFormattedMessage)('sale-return.title')
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(null, {
  deleteSaleReturn: _store_action_salesReturnAction__WEBPACK_IMPORTED_MODULE_3__.deleteSaleReturn
})(DeleteSaleReturn));

/***/ },

/***/ "./resources/pos/src/components/saleReturn/EditSaleReturn.js"
/*!*******************************************************************!*\
  !*** ./resources/pos/src/components/saleReturn/EditSaleReturn.js ***!
  \*******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _SaleReturnForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SaleReturnForm */ "./resources/pos/src/components/saleReturn/SaleReturnForm.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _header_HeaderTitle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../header/HeaderTitle */ "./resources/pos/src/components/header/HeaderTitle.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../store/action/warehouseAction */ "./resources/pos/src/store/action/warehouseAction.js");
/* harmony import */ var _store_action_customerAction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../store/action/customerAction */ "./resources/pos/src/store/action/customerAction.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var _store_action_salesReturnAction__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../store/action/salesReturnAction */ "./resources/pos/src/store/action/salesReturnAction.js");
/* harmony import */ var _saleReturnStatus_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./saleReturnStatus.json */ "./resources/pos/src/components/saleReturn/saleReturnStatus.json");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _shared_components_loaders_Spinner__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../shared/components/loaders/Spinner */ "./resources/pos/src/shared/components/loaders/Spinner.js");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");














var EditSaleReturn = function EditSaleReturn(props) {
  var fetchSaleReturn = props.fetchSaleReturn,
    salesReturn = props.salesReturn,
    customers = props.customers,
    fetchAllCustomer = props.fetchAllCustomer,
    warehouses = props.warehouses,
    fetchAllWarehouses = props.fetchAllWarehouses,
    isLoading = props.isLoading;
  var _useParams = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_7__.useParams)(),
    id = _useParams.id;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchAllCustomer();
    fetchAllWarehouses();
    fetchSaleReturn(id, false);
  }, []);
  var selectedStatus = salesReturn.attributes && salesReturn.attributes.status && _saleReturnStatus_json__WEBPACK_IMPORTED_MODULE_9__.filter(function (item) {
    return item.value === salesReturn.attributes.status;
  });

  // salesReturn && salesReturn.attributes &&  salesReturn.attributes.sale_return_items.forEach((item) => {
  //     item.code = item.product && item.product.code
  //     item.name = item.product && item.product.name
  //     item.stock_alert = item.product && item.product.stock_alert
  //     item.short_name = item.sale_unit.short_name
  //     item.fix_net_unit = item.product_price
  //     item.newItem = ''
  //     item.sale_return_item_id = item.id
  //     item.sale_unit = item.product && item.product.sale_unit ? Number(item.product.sale_unit) : item.sale_unit
  // });

  var itemsValue = salesReturn && salesReturn.attributes && {
    date: salesReturn.attributes.date,
    warehouse_id: {
      value: salesReturn.attributes.warehouse_id,
      label: salesReturn.attributes.warehouse_name
    },
    customer_id: {
      value: salesReturn.attributes.customer_id,
      label: salesReturn.attributes.customer_name
    },
    tax_rate: salesReturn.attributes.tax_rate,
    tax_amount: salesReturn.attributes.tax_amount,
    discount: salesReturn.attributes.discount,
    shipping: salesReturn.attributes.shipping,
    grand_total: salesReturn.attributes.grand_total,
    amount: salesReturn.attributes.amount,
    sale_items: salesReturn.attributes.sale_return_items.map(function (item) {
      return {
        code: item.product && item.product.code,
        name: item.product && item.product.name,
        product_unit: item.product.product_unit,
        product_id: item.product_id,
        short_name: item.sale_unit && item.sale_unit.short_name,
        stock_alert: item.product && item.product.stock_alert,
        product_price: item.product_price,
        fix_net_unit: item.product_price,
        net_unit_price: item.product_price,
        tax_type: item.tax_type,
        tax_value: item.tax_value,
        tax_amount: item.tax_amount,
        discount_type: item.discount_type,
        discount_value: item.discount_value,
        discount_amount: item.discount_amount,
        isEdit: true,
        stock: "",
        sold_quantity: item.sold_quantity,
        sub_total: item.sub_total,
        sale_unit: item.sale_unit && item.sale_unit.id && item.sale_unit.id,
        quantity: item.quantity,
        id: item.id,
        sale_return_item_id: item.id,
        newItem: '',
        isSaleReturnEdit: true
      };
    }),
    id: salesReturn.id,
    status_id: salesReturn.attributes.status,
    // status_id: {
    //     label: selectedStatus[0] && selectedStatus[0].label,
    //     value: selectedStatus[0] && selectedStatus[0].value
    // },
    note: salesReturn.attributes.note,
    // isCreateSaleReturn: true,
    isSaleReturnEdit: true,
    sale_id: salesReturn.attributes.sale_id,
    sale_reference: salesReturn.attributes.reference_code
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_2__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_12__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_header_HeaderTitle__WEBPACK_IMPORTED_MODULE_3__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)('sale-return.edit.title'),
      to: "/app/sale-return"
    }), isLoading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_shared_components_loaders_Spinner__WEBPACK_IMPORTED_MODULE_11__["default"], {}) : salesReturn && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_SaleReturnForm__WEBPACK_IMPORTED_MODULE_1__["default"], {
      singleSale: itemsValue,
      id: id,
      customers: customers,
      warehouses: warehouses
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var salesReturn = state.salesReturn,
    customers = state.customers,
    warehouses = state.warehouses,
    isLoading = state.isLoading;
  return {
    salesReturn: salesReturn,
    customers: customers,
    warehouses: warehouses,
    isLoading: isLoading
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_4__.connect)(mapStateToProps, {
  fetchSaleReturn: _store_action_salesReturnAction__WEBPACK_IMPORTED_MODULE_8__.fetchSaleReturn,
  fetchAllCustomer: _store_action_customerAction__WEBPACK_IMPORTED_MODULE_6__.fetchAllCustomer,
  fetchAllWarehouses: _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_5__.fetchAllWarehouses
})(EditSaleReturn));

/***/ },

/***/ "./resources/pos/src/components/saleReturn/EditSaleReturnFromSale.js"
/*!***************************************************************************!*\
  !*** ./resources/pos/src/components/saleReturn/EditSaleReturnFromSale.js ***!
  \***************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _SaleReturnForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SaleReturnForm */ "./resources/pos/src/components/saleReturn/SaleReturnForm.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _header_HeaderTitle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../header/HeaderTitle */ "./resources/pos/src/components/header/HeaderTitle.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../store/action/warehouseAction */ "./resources/pos/src/store/action/warehouseAction.js");
/* harmony import */ var _store_action_customerAction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../store/action/customerAction */ "./resources/pos/src/store/action/customerAction.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var _store_action_salesReturnAction__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../store/action/salesReturnAction */ "./resources/pos/src/store/action/salesReturnAction.js");
/* harmony import */ var _saleReturnStatus_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./saleReturnStatus.json */ "./resources/pos/src/components/saleReturn/saleReturnStatus.json");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _shared_components_loaders_Spinner__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../shared/components/loaders/Spinner */ "./resources/pos/src/shared/components/loaders/Spinner.js");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");














var EditSaleReturn = function EditSaleReturn(props) {
  var fetchSaleReturn = props.fetchSaleReturn,
    salesReturn = props.salesReturn,
    customers = props.customers,
    fetchAllCustomer = props.fetchAllCustomer,
    warehouses = props.warehouses,
    fetchAllWarehouses = props.fetchAllWarehouses,
    isLoading = props.isLoading;
  var _useParams = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_7__.useParams)(),
    id = _useParams.id;
  var isSaleReturnFromSale = true;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchAllCustomer();
    fetchAllWarehouses();
    fetchSaleReturn(id, isSaleReturnFromSale);
  }, []);
  var selectedStatus = salesReturn.attributes && salesReturn.attributes.status && _saleReturnStatus_json__WEBPACK_IMPORTED_MODULE_9__.filter(function (item) {
    return item.value === salesReturn.attributes.status;
  });

  // salesReturn && salesReturn.attributes &&  salesReturn.attributes.sale_return_items.forEach((item) => {
  //     item.code = item.product && item.product.code
  //     item.name = item.product && item.product.name
  //     item.stock_alert = item.product && item.product.stock_alert
  //     item.short_name = item.sale_unit.short_name
  //     item.fix_net_unit = item.product_price
  //     item.newItem = ''
  //     item.sale_return_item_id = item.id
  //     item.sale_unit = item.product && item.product.sale_unit ? Number(item.product.sale_unit) : item.sale_unit
  // });

  var itemsValue = salesReturn && salesReturn.attributes && {
    date: salesReturn.attributes.date,
    warehouse_id: {
      value: salesReturn.attributes.warehouse_id,
      label: salesReturn.attributes.warehouse_name
    },
    customer_id: {
      value: salesReturn.attributes.customer_id,
      label: salesReturn.attributes.customer_name
    },
    tax_rate: salesReturn.attributes.tax_rate,
    tax_amount: salesReturn.attributes.tax_amount,
    discount: salesReturn.attributes.discount,
    shipping: salesReturn.attributes.shipping,
    grand_total: salesReturn.attributes.grand_total,
    amount: salesReturn.attributes.amount,
    sale_items: salesReturn.attributes.sale_return_items.map(function (item) {
      return {
        code: item.product && item.product.code,
        name: item.product && item.product.name,
        product_unit: item.product.product_unit,
        product_id: item.product_id,
        short_name: item.sale_unit && item.sale_unit.short_name,
        stock_alert: item.product && item.product.stock_alert,
        product_price: item.product_price,
        fix_net_unit: item.product_price,
        net_unit_price: item.product_price,
        tax_type: item.tax_type,
        tax_value: item.tax_value,
        tax_amount: item.tax_amount,
        discount_type: item.discount_type,
        discount_value: item.discount_value,
        discount_amount: item.discount_amount,
        isEdit: true,
        stock: "",
        sold_quantity: item.sold_quantity,
        sub_total: item.sub_total,
        sale_unit: item.sale_unit && item.sale_unit.id && item.sale_unit.id,
        quantity: item.quantity,
        id: item.id,
        sale_return_item_id: item.id,
        newItem: '',
        isSaleReturnEdit: true
      };
    }),
    id: salesReturn.id,
    status_id: salesReturn.attributes.status,
    // status_id: {
    //     label: selectedStatus[0] && selectedStatus[0].label,
    //     value: selectedStatus[0] && selectedStatus[0].value
    // },
    note: salesReturn.attributes.note,
    // isCreateSaleReturn: true,
    isSaleReturnEdit: true,
    sale_return_id: salesReturn.id,
    sale_id: id,
    sale_reference: salesReturn.attributes.reference_code
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_2__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_12__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_header_HeaderTitle__WEBPACK_IMPORTED_MODULE_3__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)('sale-return.edit.title'),
      to: "/app/sales"
    }), isLoading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_shared_components_loaders_Spinner__WEBPACK_IMPORTED_MODULE_11__["default"], {}) : salesReturn && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_SaleReturnForm__WEBPACK_IMPORTED_MODULE_1__["default"], {
      singleSale: itemsValue,
      isEdit: true,
      id: itemsValue === null || itemsValue === void 0 ? void 0 : itemsValue.sale_return_id,
      customers: customers,
      warehouses: warehouses
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var salesReturn = state.salesReturn,
    customers = state.customers,
    warehouses = state.warehouses,
    isLoading = state.isLoading;
  return {
    salesReturn: salesReturn,
    customers: customers,
    warehouses: warehouses,
    isLoading: isLoading
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_4__.connect)(mapStateToProps, {
  fetchSaleReturn: _store_action_salesReturnAction__WEBPACK_IMPORTED_MODULE_8__.fetchSaleReturn,
  fetchAllCustomer: _store_action_customerAction__WEBPACK_IMPORTED_MODULE_6__.fetchAllCustomer,
  fetchAllWarehouses: _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_5__.fetchAllWarehouses
})(EditSaleReturn));

/***/ },

/***/ "./resources/pos/src/components/saleReturn/SaleReturn.js"
/*!***************************************************************!*\
  !*** ./resources/pos/src/components/saleReturn/SaleReturn.js ***!
  \***************************************************************/
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
/* harmony import */ var _DeleteSaleReturn__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./DeleteSaleReturn */ "./resources/pos/src/components/saleReturn/DeleteSaleReturn.js");
/* harmony import */ var _store_action_salesReturnAction__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../store/action/salesReturnAction */ "./resources/pos/src/store/action/salesReturnAction.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _store_action_frontSettingAction__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../store/action/frontSettingAction */ "./resources/pos/src/store/action/frontSettingAction.js");
/* harmony import */ var _shared_action_buttons_ActionDropDownButton__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../shared/action-buttons/ActionDropDownButton */ "./resources/pos/src/shared/action-buttons/ActionDropDownButton.js");
/* harmony import */ var _store_action_downloadReportAction__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../store/action/downloadReportAction */ "./resources/pos/src/store/action/downloadReportAction.js");
/* harmony import */ var _shared_showPayment_ShowPayment__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../shared/showPayment/ShowPayment */ "./resources/pos/src/shared/showPayment/ShowPayment.js");
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













var SaleReturn = function SaleReturn(props) {
  var salesReturn = props.salesReturn,
    fetchSalesReturn = props.fetchSalesReturn,
    totalRecord = props.totalRecord,
    isLoading = props.isLoading,
    frontSetting = props.frontSetting,
    fetchFrontSetting = props.fetchFrontSetting,
    downloadPdf = props.downloadPdf,
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
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchFrontSetting();
  }, []);
  var currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol;
  var onShowPaymentClick = function onShowPaymentClick() {
    setIsShowPaymentModel(!isShowPaymentModel);
  };
  var onChange = function onChange(filter) {
    fetchSalesReturn(filter, true);
  };
  var goToEdit = function goToEdit(item) {
    var id = item.id;
    window.location.href = "#/app/sale-return/edit/" + id;
  };
  var onClickDeleteModel = function onClickDeleteModel() {
    var isDelete = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    setDeleteModel(!deleteModel);
    setIsDelete(isDelete);
  };
  var onPdfClick = function onPdfClick(id) {
    downloadPdf("sale-return-pdf-download/".concat(id), 'sale_return_pdf_url');
  };
  var goToDetailScreen = function goToDetailScreen(id) {
    window.location.href = "#/app/sale-return/detail/" + id;
  };
  var itemsValue = currencySymbol && salesReturn.length >= 0 && salesReturn.map(function (sale) {
    return {
      created_at: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedDate)(sale.attributes.date, allConfigData && allConfigData),
      time: dayjs__WEBPACK_IMPORTED_MODULE_1___default()(sale.attributes.created_at).format("LT"),
      reference_code: sale.attributes.reference_code,
      customer_name: sale.attributes.customer_name,
      warehouse_name: sale.attributes.warehouse_name,
      status: sale.attributes.status,
      payment_status: sale.attributes.payment_status,
      grand_total: sale.attributes.grand_total,
      paid_amount: sale.attributes.paid_amount ? sale.attributes.paid_amount : 0.0.toFixed(2),
      id: sale.id,
      currency: currencySymbol
    };
  });
  var columns = [{
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("dashboard.recentSales.reference.label"),
    sortField: "reference_code",
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
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("customer.title"),
    selector: function selector(row) {
      return row.customer_name;
    },
    sortField: "customer_name",
    sortable: false
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("warehouse.title"),
    selector: function selector(row) {
      return row.warehouse_name;
    },
    sortField: "warehouse_name",
    sortable: false
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("purchase.select.status.label"),
    sortField: "status",
    sortable: false,
    cell: function cell(row) {
      return row.status === 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("span", {
        className: "badge bg-light-success",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("span", {
          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("status.filter.received.label")
        })
      }) || row.status === 2 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("span", {
        className: "badge bg-light-primary",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("span", {
          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("status.filter.pending.label")
        })
      }) || row.status === 3 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("span", {
        className: "badge bg-light-warning",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("span", {
          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("status.filter.ordered.label")
        })
      });
    }
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("purchase.grant-total.label"),
    selector: function selector(row) {
      return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.currencySymbolHandling)(allConfigData, row.currency, row.grand_total);
    },
    sortField: "grand_total",
    sortable: true
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("dashboard.recentSales.paid.label"),
    selector: function selector(row) {
      return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.currencySymbolHandling)(allConfigData, row.currency, row.paid_amount);
    },
    sortField: "paid_amount",
    sortable: true
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("dashboard.recentSales.paymentStatus.label"),
    selector: function selector(row) {
      return row.payment_status;
    },
    sortField: "payment_status",
    sortable: false,
    cell: function cell(row) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("span", {
        className: "badge bg-light-warning",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("span", {
          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("payment-status.filter.unpaid.label")
        })
      });
    }
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.react-table.column.created-date.label"),
    selector: function selector(row) {
      return row.created_at;
    },
    sortField: "created_at",
    sortable: true,
    cell: function cell(row) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("span", {
        className: "badge bg-light-info",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("div", {
          className: "mb-1",
          children: row.time
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("div", {
          children: row.created_at
        })]
      });
    }
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("react-data-table.action.column.label"),
    right: true,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    cell: function cell(row) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_shared_action_buttons_ActionDropDownButton__WEBPACK_IMPORTED_MODULE_14__["default"], {
        item: row,
        isEditMode: true,
        isPdfIcon: true,
        onClickDeleteModel: onClickDeleteModel,
        onPdfClick: onPdfClick,
        title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("sale-return.title"),
        isViewIcon: true,
        goToDetailScreen: goToDetailScreen,
        onShowPaymentClick: onShowPaymentClick,
        goToEditProduct: goToEdit
        // isPaymentShow={true}
      });
    }
  }];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_7__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_17__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_8__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.placeholderText)("sales-return.title")
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("div", {
      className: "sale_return_table",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_shared_table_ReactDataTable__WEBPACK_IMPORTED_MODULE_9__["default"], {
        columns: columns,
        items: itemsValue,
        to: "#/app/sale-return/create",
        isShowDateRangeField: true
        // ButtonValue={getFormattedMessage('sale-return.create.title')}
        ,
        onChange: onChange,
        totalRows: totalRecord,
        goToEdit: goToEdit,
        isLoading: isLoading,
        isShowFilterField: true,
        isStatus: true
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_DeleteSaleReturn__WEBPACK_IMPORTED_MODULE_10__["default"], {
      onClickDeleteModel: onClickDeleteModel,
      deleteModel: deleteModel,
      onDelete: isDelete
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_shared_showPayment_ShowPayment__WEBPACK_IMPORTED_MODULE_16__["default"], {
      onShowPaymentClick: onShowPaymentClick,
      isShowPaymentModel: isShowPaymentModel
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var salesReturn = state.salesReturn,
    totalRecord = state.totalRecord,
    isLoading = state.isLoading,
    frontSetting = state.frontSetting,
    allConfigData = state.allConfigData;
  return {
    salesReturn: salesReturn,
    totalRecord: totalRecord,
    isLoading: isLoading,
    frontSetting: frontSetting,
    allConfigData: allConfigData
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_6__.connect)(mapStateToProps, {
  fetchSalesReturn: _store_action_salesReturnAction__WEBPACK_IMPORTED_MODULE_11__.fetchSalesReturn,
  fetchFrontSetting: _store_action_frontSettingAction__WEBPACK_IMPORTED_MODULE_13__.fetchFrontSetting,
  downloadPdf: _store_action_downloadReportAction__WEBPACK_IMPORTED_MODULE_15__.downloadPdf
})(SaleReturn));

/***/ },

/***/ "./resources/pos/src/components/saleReturn/SaleReturnDetails.js"
/*!**********************************************************************!*\
  !*** ./resources/pos/src/components/saleReturn/SaleReturnDetails.js ***!
  \**********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-bootstrap/Form */ "./node_modules/react-bootstrap/esm/Form.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Col.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Row.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Table.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "./node_modules/@fortawesome/react-fontawesome/index.es.js");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.mjs");
/* harmony import */ var _header_HeaderTitle__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../header/HeaderTitle */ "./resources/pos/src/components/header/HeaderTitle.js");
/* harmony import */ var _shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../shared/tab-title/TabTitle */ "./resources/pos/src/shared/tab-title/TabTitle.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _store_action_salesReturnDetailAction__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../store/action/salesReturnDetailAction */ "./resources/pos/src/store/action/salesReturnDetailAction.js");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");














var SaleReturnDetails = function SaleReturnDetails(props) {
  var fetchSaleReturnDetails = props.fetchSaleReturnDetails,
    saleReturnDetails = props.saleReturnDetails,
    frontSetting = props.frontSetting,
    allConfigData = props.allConfigData;
  var _useParams = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_7__.useParams)(),
    id = _useParams.id;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchSaleReturnDetails(id);
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_1__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_14__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_header_HeaderTitle__WEBPACK_IMPORTED_MODULE_10__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("sale-return.details.title"),
      to: "/app/sale-return"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_11__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.placeholderText)("sale-return.details.title")
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("div", {
      className: "card",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("div", {
        className: "card-body",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_2__["default"], {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("div", {
            className: "row",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("div", {
              className: "col-12",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("h4", {
                className: "font-weight-bold text-center mb-5",
                children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("sale-return.details.title"), " ", ":", " ", saleReturnDetails && saleReturnDetails.reference_code]
              })
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_5__["default"], {
            className: "custom-line-height",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_4__["default"], {
              md: 4,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("h5", {
                className: "text-gray-600 bg-light p-4 mb-0 text-uppercase",
                children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("sale.detail.customer.info")
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                className: "p-4",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                  className: "d-flex align-items-center pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_8__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_9__.faUser,
                    className: "text-primary me-2 fs-5"
                  }), saleReturnDetails.customer && saleReturnDetails.customer.name]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                  className: "d-flex align-items-center pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_8__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_9__.faEnvelope,
                    className: "text-primary me-2 fs-5"
                  }), saleReturnDetails.customer && saleReturnDetails.customer.email]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                  className: "d-flex align-items-center pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_8__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_9__.faMobileAlt,
                    className: "text-primary me-2 fs-5"
                  }), saleReturnDetails.customer && saleReturnDetails.customer.phone]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                  className: "d-flex align-items-center",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_8__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_9__.faLocationDot,
                    className: "text-primary me-2 fs-5"
                  }), saleReturnDetails.customer && saleReturnDetails.customer.address]
                })]
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_4__["default"], {
              md: 4,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("h5", {
                className: "text-gray-600 bg-light p-4 mb-0 text-uppercase",
                children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.company.info")
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                className: "p-4",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                  className: "d-flex align-items-center pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_8__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_9__.faUser,
                    className: "text-primary me-2 fs-5"
                  }), saleReturnDetails.company_info && saleReturnDetails.company_info.company_name]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                  className: "d-flex align-items-center pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_8__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_9__.faEnvelope,
                    className: "text-primary me-2 fs-5"
                  }), saleReturnDetails.company_info && saleReturnDetails.company_info.email]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                  className: "d-flex align-items-center pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_8__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_9__.faMobileAlt,
                    className: "text-primary me-2 fs-5"
                  }), saleReturnDetails.company_info && saleReturnDetails.company_info.phone]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                  className: "d-flex align-items-center",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_8__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_9__.faLocationDot,
                    className: "text-primary me-2 fs-5"
                  }), saleReturnDetails.company_info && saleReturnDetails.company_info.address]
                })]
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_4__["default"], {
              md: 4,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("h5", {
                className: "text-gray-600 bg-light p-4 mb-0 text-uppercase",
                children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("sale.detail.invoice.info")
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                className: "p-4",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                  className: "pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("span", {
                    className: "me-2",
                    children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.reference"), " ", ":"]
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("span", {
                    children: saleReturnDetails && saleReturnDetails.reference_code
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                  className: "pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("span", {
                    className: "me-2",
                    children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.status"), " ", ":"]
                  }), saleReturnDetails && saleReturnDetails.status === 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("span", {
                    className: "badge bg-light-success",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("span", {
                      children: "Received"
                    })
                  }) || saleReturnDetails.status === 2 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("span", {
                    className: "badge bg-light-primary",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("span", {
                      children: "Pending"
                    })
                  }) || saleReturnDetails.status === 3 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("span", {
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
                    children: saleReturnDetails.warehouse && saleReturnDetails.warehouse.name
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("span", {
                    className: "me-2",
                    children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.payment.status"), " ", ":"]
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("span", {
                    className: "badge bg-light-success",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("span", {
                      children: "Unpaid"
                    })
                  })]
                })]
              })]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
            className: "mt-5",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("h5", {
              className: "font-weight-bold text-center mb-5",
              children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.order.summary")
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_6__["default"], {
              responsive: true,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("thead", {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("tr", {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("th", {
                    className: "ps-3",
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.product")
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("th", {
                    className: "ps-3",
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.net-unit-price")
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("th", {
                    className: "ps-3",
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.quantity")
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("th", {
                    className: "ps-3",
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.unit-price")
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
                children: saleReturnDetails.sale_return_items && saleReturnDetails.sale_return_items.map(function (details, index) {
                  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("tr", {
                    className: "align-middle",
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("td", {
                      className: "ps-3",
                      children: [details.product && details.product.code, " ", "(", details.product && details.product.name, details.product && details.product.variation_type ? " - ".concat(details.product.variation_type.name) : "", ")"]
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("td", {
                      children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, details.net_unit_price)
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("td", {
                      children: details.quantity
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("td", {
                      children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, details.product_price)
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
                          children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, saleReturnDetails && saleReturnDetails.tax_amount > 0 ? saleReturnDetails.tax_amount : "0.00"), " ", "(", saleReturnDetails && parseFloat(saleReturnDetails.tax_rate).toFixed(2), "%)"]
                        })]
                      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("tr", {
                        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("td", {
                          className: "py-3",
                          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.discount")
                        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("td", {
                          className: "py-3",
                          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, saleReturnDetails && saleReturnDetails.discount)
                        })]
                      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("tr", {
                        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("td", {
                          className: "py-3",
                          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.shipping")
                        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("td", {
                          className: "py-3",
                          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, saleReturnDetails && saleReturnDetails.shipping)
                        })]
                      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("tr", {
                        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("td", {
                          className: "py-3 text-primary",
                          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.detail.grand.total")
                        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("td", {
                          className: "py-3 text-primary",
                          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, saleReturnDetails && saleReturnDetails.grand_total)
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
  var saleReturnDetails = state.saleReturnDetails,
    frontSetting = state.frontSetting,
    allConfigData = state.allConfigData;
  return {
    saleReturnDetails: saleReturnDetails,
    frontSetting: frontSetting,
    allConfigData: allConfigData
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_3__.connect)(mapStateToProps, {
  fetchSaleReturnDetails: _store_action_salesReturnDetailAction__WEBPACK_IMPORTED_MODULE_13__.fetchSaleReturnDetails
})(SaleReturnDetails));

/***/ },

/***/ "./resources/pos/src/components/saleReturn/SaleReturnForm.js"
/*!*******************************************************************!*\
  !*** ./resources/pos/src/components/saleReturn/SaleReturnForm.js ***!
  \*******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/InputGroup.js");
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
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _store_action_productAction__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../store/action/productAction */ "./resources/pos/src/store/action/productAction.js");
/* harmony import */ var _shared_components_sales_ProductRowTable__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../shared/components/sales/ProductRowTable */ "./resources/pos/src/shared/components/sales/ProductRowTable.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _shared_datepicker_ReactDatePicker__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../shared/datepicker/ReactDatePicker */ "./resources/pos/src/shared/datepicker/ReactDatePicker.js");
/* harmony import */ var _components_sales_ProductMainCalculation__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../components/sales/ProductMainCalculation */ "./resources/pos/src/components/sales/ProductMainCalculation.js");
/* harmony import */ var _shared_calculation_calculation__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../shared/calculation/calculation */ "./resources/pos/src/shared/calculation/calculation.js");
/* harmony import */ var _shared_prepareArray_prepareSaleArray__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../shared/prepareArray/prepareSaleArray */ "./resources/pos/src/shared/prepareArray/prepareSaleArray.js");
/* harmony import */ var _shared_components_modelFooter__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../shared/components/modelFooter */ "./resources/pos/src/shared/components/modelFooter.js");
/* harmony import */ var _store_action_salesReturnAction__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../store/action/salesReturnAction */ "./resources/pos/src/store/action/salesReturnAction.js");
/* harmony import */ var _store_action_frontSettingAction__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../store/action/frontSettingAction */ "./resources/pos/src/store/action/frontSettingAction.js");
/* harmony import */ var _store_action_toastAction__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../store/action/toastAction */ "./resources/pos/src/store/action/toastAction.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../shared/select/reactSelect */ "./resources/pos/src/shared/select/reactSelect.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
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
















var SaleReturnForm = function SaleReturnForm(props) {
  var addSaleData = props.addSaleData,
    editSaleReturn = props.editSaleReturn,
    id = props.id,
    singleSale = props.singleSale,
    fetchProductsByWarehouse = props.fetchProductsByWarehouse,
    fetchFrontSetting = props.fetchFrontSetting,
    frontSetting = props.frontSetting,
    allConfigData = props.allConfigData,
    isEdit = props.isEdit;
  var navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_1__.useNavigate)();
  var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_8__.useDispatch)();
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    updateProducts = _useState2[0],
    setUpdateProducts = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(1),
    _useState4 = _slicedToArray(_useState3, 2),
    quantity = _useState4[0],
    setQuantity = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(""),
    _useState6 = _slicedToArray(_useState5, 2),
    newCost = _useState6[0],
    setNewCost = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(""),
    _useState8 = _slicedToArray(_useState7, 2),
    newDiscount = _useState8[0],
    setNewDiscount = _useState8[1];
  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(""),
    _useState0 = _slicedToArray(_useState9, 2),
    newTax = _useState0[0],
    setNewTax = _useState0[1];
  var _useState1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(""),
    _useState10 = _slicedToArray(_useState1, 2),
    subTotal = _useState10[0],
    setSubTotal = _useState10[1];
  var _useState11 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(""),
    _useState12 = _slicedToArray(_useState11, 2),
    newSaleUnit = _useState12[0],
    setNewSaleUnit = _useState12[1];
  var _useState13 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      date: new Date(),
      customer_id: "",
      warehouse_id: "",
      tax_rate: "0.00",
      tax_amount: "0.00",
      discount: "0.00",
      shipping: "0.00",
      grand_total: 0.0,
      notes: "",
      received_amount: 0,
      payment_type: 1,
      paid_amount: 0,
      status: "",
      sale_reference: ""
    }),
    _useState14 = _slicedToArray(_useState13, 2),
    saleReturnValue = _useState14[0],
    setSaleReturnValue = _useState14[1];
  var _useState15 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      date: "",
      customer_id: "",
      warehouse_id: "",
      status: ""
    }),
    _useState16 = _slicedToArray(_useState15, 2),
    errors = _useState16[0],
    setErrors = _useState16[1];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    setUpdateProducts(updateProducts);
  }, [updateProducts, quantity, newCost, newDiscount, newTax, subTotal, newSaleUnit]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    updateProducts.length >= 1 ? dispatch({
      type: "DISABLE_OPTION",
      payload: true
    }) : dispatch({
      type: "DISABLE_OPTION",
      payload: false
    });
  }, [updateProducts]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (singleSale) {
      setSaleReturnValue({
        date: singleSale ? dayjs__WEBPACK_IMPORTED_MODULE_3___default()(singleSale.date).toDate() : "",
        customer_id: singleSale ? singleSale.customer_id : "",
        warehouse_id: singleSale ? singleSale.warehouse_id : "",
        tax_rate: singleSale ? singleSale.tax_rate.toFixed(2) : "0.00",
        tax_amount: singleSale ? singleSale.tax_amount.toFixed(2) : "0.00",
        discount: singleSale ? singleSale.discount.toFixed(2) : "0.00",
        shipping: singleSale ? singleSale.shipping.toFixed(2) : "0.00",
        grand_total: Number(singleSale ? singleSale.grand_total : "0.00"),
        status: singleSale ? singleSale.status_id === 1 ? {
          label: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)("status.filter.received.label"),
          value: 1
        } : {
          label: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)("status.filter.pending.label"),
          value: 2
        } : "",
        notes: singleSale ? singleSale.note === null ? "" : singleSale.note : "",
        sale_id: singleSale ? singleSale.sale_id : "",
        sale_reference: singleSale ? singleSale.sale_reference : ""
      });
    }
  }, [singleSale]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchFrontSetting();
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (singleSale) {
      setUpdateProducts(singleSale.sale_items);
    }
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    var _saleReturnValue$ware;
    saleReturnValue.warehouse_id.value && fetchProductsByWarehouse(saleReturnValue === null || saleReturnValue === void 0 || (_saleReturnValue$ware = saleReturnValue.warehouse_id) === null || _saleReturnValue$ware === void 0 ? void 0 : _saleReturnValue$ware.value);
  }, [saleReturnValue.warehouse_id.value]);
  var handleValidation = function handleValidation() {
    var error = {};
    var isValid = false;
    var qtyCart = updateProducts.filter(function (a) {
      return a.quantity === 0;
    });
    if (!saleReturnValue.date) {
      error["date"] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)("globally.date.validate.label");
    } else if (!saleReturnValue.warehouse_id) {
      error["warehouse_id"] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)("product.input.warehouse.validate.label");
    } else if (!saleReturnValue.customer_id) {
      error["customer_id"] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)("sale.select.customer.validate.label");
    } else if (qtyCart.length > 0) {
      dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_19__.addToast)({
        text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)("globally.product-quantity.validate.message"),
        type: _constants__WEBPACK_IMPORTED_MODULE_20__.toastType.ERROR
      }));
    } else if (updateProducts.length < 1) {
      dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_19__.addToast)({
        text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)("purchase.product-list.validate.message"),
        type: _constants__WEBPACK_IMPORTED_MODULE_20__.toastType.ERROR
      }));
    } else if (!saleReturnValue.status) {
      error["status"] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)("globally.status.validate.label");
    } else {
      isValid = true;
    }
    setErrors(error);
    return isValid;
  };
  var updatedQty = function updatedQty(qty) {
    setQuantity(qty);
  };
  var updateCost = function updateCost(cost) {
    setNewCost(cost);
  };
  var updateDiscount = function updateDiscount(discount) {
    setNewDiscount(discount);
  };
  var updateTax = function updateTax(tax) {
    setNewTax(tax);
  };
  var updateSubTotal = function updateSubTotal(subTotal) {
    setSubTotal(subTotal);
  };
  var updateSaleUnit = function updateSaleUnit(saleUnit) {
    setNewSaleUnit(saleUnit);
  };
  var handleCallback = function handleCallback(date) {
    setSaleReturnValue(function (previousState) {
      return _objectSpread(_objectSpread({}, previousState), {}, {
        date: date
      });
    });
    setErrors("");
  };
  var onChangeInput = function onChangeInput(e) {
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
    setSaleReturnValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, _defineProperty({}, e.target.name, value && value));
    });
  };
  var onStatusChange = function onStatusChange(obj) {
    setSaleReturnValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, {
        status: obj
      });
    });
  };
  var prepareFormData = function prepareFormData(prepareData) {
    var formValue = {
      date: dayjs__WEBPACK_IMPORTED_MODULE_3___default()(prepareData.date).toDate(),
      customer_id: prepareData.customer_id.value ? prepareData.customer_id.value : prepareData.customer_id,
      warehouse_id: prepareData.warehouse_id.value ? prepareData.warehouse_id.value : prepareData.warehouse_id,
      discount: prepareData.discount,
      tax_rate: prepareData.tax_rate,
      tax_amount: (0,_shared_calculation_calculation__WEBPACK_IMPORTED_MODULE_14__.calculateCartTotalTaxAmount)(updateProducts, saleReturnValue),
      sale_return_items: updateProducts,
      shipping: prepareData.shipping,
      grand_total: Number((0,_shared_calculation_calculation__WEBPACK_IMPORTED_MODULE_14__.calculateCartTotalAmount)(updateProducts, saleReturnValue)),
      received_amount: 0,
      payment_type: 0,
      paid_amount: 0,
      status: prepareData.status.value,
      note: prepareData.notes,
      sale_id: prepareData.sale_id,
      sale_reference: prepareData.sale_reference
    };
    return formValue;
  };
  var onSubmit = function onSubmit(event) {
    event.preventDefault();
    var valid = handleValidation();
    if (valid) {
      if (singleSale.isCreateSaleReturn) {
        addSaleData(prepareFormData(saleReturnValue), navigate);
      } else {
        editSaleReturn(id, prepareFormData(saleReturnValue), navigate);
        setSaleReturnValue(saleReturnValue);
      }
    }
  };
  var onNotesChangeInput = function onNotesChangeInput(e) {
    e.preventDefault();
    setSaleReturnValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, {
        notes: e.target.value
      });
    });
  };
  var onBlurInput = function onBlurInput(el) {
    if (el.target.value === "") {
      if (el.target.name === "shipping") {
        setSaleReturnValue(_objectSpread(_objectSpread({}, saleReturnValue), {}, {
          shipping: "0.00"
        }));
      }
      if (el.target.name === "discount") {
        setSaleReturnValue(_objectSpread(_objectSpread({}, saleReturnValue), {}, {
          discount: "0.00"
        }));
      }
      if (el.target.name === "tax_rate") {
        setSaleReturnValue(_objectSpread(_objectSpread({}, saleReturnValue), {}, {
          tax_rate: "0.00"
        }));
      }
    }
  };
  var saleReturnStatusFilterOptions = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedOptions)(_constants__WEBPACK_IMPORTED_MODULE_20__.saleReturnStatusOptions);
  var saleReturnStatusDefaultValue = saleReturnStatusFilterOptions.map(function (option) {
    return {
      value: option.id,
      label: option.name
    };
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)("div", {
    className: "card",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)("div", {
      className: "card-body",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsxs)("div", {
        className: "row",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsxs)("div", {
          className: "col-md-4",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)("react-data-table.date.column.label"), ":"]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)("span", {
            className: "required"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)("div", {
            className: "position-relative",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)(_shared_datepicker_ReactDatePicker__WEBPACK_IMPORTED_MODULE_12__["default"], {
              onChangeDate: handleCallback,
              newStartDate: saleReturnValue.date
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)("span", {
            className: "text-danger d-block fw-400 fs-small mt-2",
            children: errors["date"] ? errors["date"] : null
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsxs)("div", {
          className: "col-md-4 mb-5",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)("label", {
            className: "form-label",
            children: "Sale Reference"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)("span", {
            className: "required"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)("input", {
            type: "type",
            name: "title",
            className: "form-control"
            // onChange={(e) => onChangeInput(e)}
            ,
            readOnly: true,
            value: saleReturnValue.sale_reference
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)("span", {
            className: "text-danger d-block fw-400 fs-small mt-2",
            children: errors["title"] ? errors["title"] : null
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsxs)("div", {
          className: "col-md-4 mb-5",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)("purchase.select.status.label"), ":", " "]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)("span", {
            className: "required"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_21__["default"], {
            multiLanguageOption: saleReturnStatusFilterOptions,
            name: "status",
            value: saleReturnValue.status,
            isRequired: true,
            placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.placeholderText)("purchase.select.status.placeholder.label"),
            defaultValue: saleReturnStatusDefaultValue[0],
            onChange: onStatusChange
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)("span", {
            className: "text-danger d-block fw-400 fs-small mt-2",
            children: errors["status"] ? errors["status"] : null
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)("div", {
          className: "mb-5",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)("label", {
            className: "form-label",
            children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)("product-list.lable")
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsxs)("div", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)("purchase.order-item.table.label"), ":"]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)("span", {
            className: "required"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)(_shared_components_sales_ProductRowTable__WEBPACK_IMPORTED_MODULE_10__["default"], {
            updateProducts: updateProducts,
            setUpdateProducts: setUpdateProducts,
            updatedQty: updatedQty,
            frontSetting: frontSetting,
            isSaleReturn: true,
            updateCost: updateCost,
            updateDiscount: updateDiscount,
            updateTax: updateTax,
            updateSubTotal: updateSubTotal,
            updateSaleUnit: updateSaleUnit
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)("div", {
          className: "col-12",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)(_components_sales_ProductMainCalculation__WEBPACK_IMPORTED_MODULE_13__["default"], {
            inputValues: saleReturnValue,
            updateProducts: updateProducts,
            frontSetting: frontSetting,
            allConfigData: allConfigData
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsxs)("div", {
          className: "col-md-4 mb-5",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)("purchase.input.order-tax.label"), ":", " "]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__["default"], {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)("input", {
              "aria-label": "Dollar amount (with dot and two decimal places)",
              className: "form-control",
              type: "text",
              name: "tax_rate",
              value: saleReturnValue.tax_rate,
              onBlur: function onBlur(event) {
                return onBlurInput(event);
              },
              onFocus: function onFocus(event) {
                return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.onFocusInput)(event);
              },
              onKeyPress: function onKeyPress(event) {
                (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.decimalValidate)(event);
              },
              onChange: function onChange(e) {
                onChangeInput(e);
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__["default"].Text, {
              children: "%"
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsxs)("div", {
          className: "col-md-4 mb-5",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)("purchase.order-item.table.discount.column.label"), ":", " "]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__["default"], {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)("input", {
              "aria-label": "Dollar amount (with dot and two decimal places)",
              className: "form-control",
              type: "text",
              name: "discount",
              value: saleReturnValue.discount,
              onBlur: function onBlur(event) {
                return onBlurInput(event);
              },
              onFocus: function onFocus(event) {
                return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.onFocusInput)(event);
              },
              onKeyPress: function onKeyPress(event) {
                return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.decimalValidate)(event);
              },
              onChange: function onChange(e) {
                return onChangeInput(e);
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__["default"].Text, {
              children: frontSetting.value && frontSetting.value.currency_symbol
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsxs)("div", {
          className: "col-md-4 mb-5",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)("purchase.input.shipping.label"), ":", " "]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__["default"], {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)("input", {
              "aria-label": "Dollar amount (with dot and two decimal places)",
              className: "form-control",
              type: "text",
              name: "shipping",
              value: saleReturnValue.shipping,
              onBlur: function onBlur(event) {
                return onBlurInput(event);
              },
              onFocus: function onFocus(event) {
                return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.onFocusInput)(event);
              },
              onKeyPress: function onKeyPress(event) {
                return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.decimalValidate)(event);
              },
              onChange: function onChange(e) {
                return onChangeInput(e);
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__["default"].Text, {
              children: frontSetting.value && frontSetting.value.currency_symbol
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsxs)("div", {
          className: "mb-5",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)("globally.input.notes.label"), ":", " "]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)("textarea", {
            name: "notes",
            className: "form-control",
            onChange: function onChange(e) {
              return onNotesChangeInput(e);
            },
            value: saleReturnValue.notes,
            placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.placeholderText)("globally.input.notes.placeholder.label")
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_22__.jsx)(_shared_components_modelFooter__WEBPACK_IMPORTED_MODULE_16__["default"], {
          onEditRecord: singleSale,
          onSubmit: onSubmit,
          link: (singleSale === null || singleSale === void 0 ? void 0 : singleSale.isCreateSaleReturn) === true || isEdit === true ? "/app/sales" : "/app/sale-return"
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
    customProducts: (0,_shared_prepareArray_prepareSaleArray__WEBPACK_IMPORTED_MODULE_15__.prepareSaleProductArray)(products),
    purchaseProducts: purchaseProducts,
    products: products,
    frontSetting: frontSetting,
    allConfigData: allConfigData
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_8__.connect)(mapStateToProps, {
  editSaleReturn: _store_action_salesReturnAction__WEBPACK_IMPORTED_MODULE_17__.editSaleReturn,
  fetchProductsByWarehouse: _store_action_productAction__WEBPACK_IMPORTED_MODULE_9__.fetchProductsByWarehouse,
  fetchFrontSetting: _store_action_frontSettingAction__WEBPACK_IMPORTED_MODULE_18__.fetchFrontSetting
})(SaleReturnForm));

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
        payment_date: editSaleItem ? dayjs__WEBPACK_IMPORTED_MODULE_3___default()(editSaleItem.payment_date).toDate() : '',
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
    rideUrl = _props$rideUrl === void 0 ? null : _props$rideUrl;
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

/***/ "./resources/pos/src/shared/components/sales/ProductModal.js"
/*!*******************************************************************!*\
  !*** ./resources/pos/src/shared/components/sales/ProductModal.js ***!
  \*******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Button.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Form.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/InputGroup.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Modal.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Row.js");
/* harmony import */ var _calculation_calculation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../calculation/calculation */ "./resources/pos/src/shared/calculation/calculation.js");
/* harmony import */ var _sharedMethod__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _select_reactSelect__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../select/reactSelect */ "./resources/pos/src/shared/select/reactSelect.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
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
  var product = props.product,
    setIsShowModal = props.setIsShowModal,
    isShowModal = props.isShowModal,
    onProductUpdateInCart = props.onProductUpdateInCart,
    updateCost = props.updateCost,
    updateDiscount = props.updateDiscount,
    updateTax = props.updateTax,
    updateSubTotal = props.updateSubTotal,
    productSales = props.productSales,
    updateSaleUnit = props.updateSaleUnit,
    frontSetting = props.frontSetting;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(product),
    _useState2 = _slicedToArray(_useState, 2),
    productModalData = _useState2[0],
    setProductModalData = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(product.fix_net_unit),
    _useState4 = _slicedToArray(_useState3, 2),
    netUnit = _useState4[0],
    setNetUnit = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(product.tax_value),
    _useState6 = _slicedToArray(_useState5, 2),
    taxValue = _useState6[0],
    setTaxValue = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(product.tax_type),
    _useState8 = _slicedToArray(_useState7, 2),
    taxType = _useState8[0],
    setTaxType = _useState8[1];
  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(product.discount_value),
    _useState0 = _slicedToArray(_useState9, 2),
    discountValue = _useState0[0],
    setDiscountValue = _useState0[1];
  var _useState1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('0'),
    _useState10 = _slicedToArray(_useState1, 2),
    productUnit = _useState10[0],
    setProductUnit = _useState10[1];
  var _useState11 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState12 = _slicedToArray(_useState11, 2),
    selectedSaleUnit = _useState12[0],
    setSelectedSaleUnit = _useState12[1];
  var _useState13 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      taxValue: '',
      discountValue: '',
      netUnit: ''
    }),
    _useState14 = _slicedToArray(_useState13, 2),
    errors = _useState14[0],
    setErrors = _useState14[1];

  // tax type dropdown functionality
  var taxTypeFilterOptions = (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedOptions)(_constants__WEBPACK_IMPORTED_MODULE_9__.taxMethodOptions);
  // discount type dropdown functionality
  var discountTypeFilterOptions = (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedOptions)(_constants__WEBPACK_IMPORTED_MODULE_9__.discountMethodOptions);
  var _useState15 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(product.discount_type),
    _useState16 = _slicedToArray(_useState15, 2),
    discountType = _useState16[0],
    setDiscountType = _useState16[1];
  var onDiscountTypeChange = function onDiscountTypeChange(obj) {
    setDiscountType(obj);
  };
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    setSelectedSaleUnit(productSales.length && productSales.filter(function (item) {
      return Number(item.id) === Number(product.sale_unit && product.sale_unit.value ? product.sale_unit.value : product.sale_unit);
    }).map(function (item) {
      return {
        label: item.attributes.name,
        value: item.id
      };
    }));
    setProductUnit(product.sale_unit);
  }, [productSales]);
  var defaultTaxType = product.tax_type === '1' || product.tax_type === 1 ? {
    value: taxTypeFilterOptions[0].id,
    label: taxTypeFilterOptions[0].name
  } : {
    value: taxTypeFilterOptions[1].id,
    label: taxTypeFilterOptions[1].name
  };
  var defaultDiscountType = product.discount_type === '1' || product.discount_type === 1 ? {
    value: discountTypeFilterOptions[0].id,
    label: discountTypeFilterOptions[0].name
  } : {
    value: discountTypeFilterOptions[1].id,
    label: discountTypeFilterOptions[1].name
  };
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    setProductModalData(product);
    setNetUnit(netUnit ? netUnit.toFixed(2) : parseFloat(product.fix_net_unit.toFixed(2)));
    setTaxValue(product.tax_value ? parseFloat(product.tax_value).toFixed(2) : '0.00');
    setTaxType(product.tax_type === '1' || product.tax_type === 1 ? {
      value: taxTypeFilterOptions[0].id,
      label: taxTypeFilterOptions[0].name
    } : {
      value: taxTypeFilterOptions[1].id,
      label: taxTypeFilterOptions[1].name
    });
    setDiscountValue(product.discount_value ? parseFloat(product.discount_value).toFixed(2) : '0.00');
    setDiscountType(product.discount_type === '1' || product.discount_type === 1 ? {
      value: 1,
      label: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)('discount-type.filter.percentage.label')
    } : {
      value: 2,
      label: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)('discount-type.filter.fixed.label')
    });
    product.sub_total = Number((0,_calculation_calculation__WEBPACK_IMPORTED_MODULE_6__.subTotalCount)(product));
  }, [productModalData]);
  var handleValidation = function handleValidation() {
    var errorss = {};
    var isValid = false;
    if (taxValue > 100) {
      errorss['taxValue'] = (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)('globally.tax-length.validate.label');
    } else if (discountType.value === 1 && Number(discountValue) > 100) {
      errorss['discountValue'] = (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)('globally.discount-length.validate.label');
    } else if (discountType.value === 2 && Number(discountValue) >= netUnit) {
      errorss['discountValue'] = (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)('globally.discount-price-length.validate.label');
    } else if (netUnit === null) {
      errorss['netUnit'] = (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)('globally.require-input.validate.label');
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
    setNetUnit(value);
  };
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
    setErrors('');
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
    setErrors('');
  };
  var onSaleUnitChange = function onSaleUnitChange(newlySelectedUnit) {
    setProductUnit(newlySelectedUnit);
    setSelectedSaleUnit(newlySelectedUnit);
  };
  var onSaveDetailModal = function onSaveDetailModal(e) {
    e.preventDefault();
    var valid = handleValidation();
    if (valid) {
      var newProduct = product;
      newProduct.product_price = Number(netUnit);
      newProduct.fix_net_unit = Number(netUnit);
      newProduct.net_unit_price = (0,_calculation_calculation__WEBPACK_IMPORTED_MODULE_6__.amountBeforeTax)(product);
      newProduct.tax_type = taxType.value.toString();
      newProduct.tax_value = Number(taxValue);
      newProduct.tax_amount = (0,_calculation_calculation__WEBPACK_IMPORTED_MODULE_6__.taxAmountMultiply)(product);
      newProduct.discount_type = discountType.value.toString();
      newProduct.discount_value = Number(discountValue);
      newProduct.discount_amount = (0,_calculation_calculation__WEBPACK_IMPORTED_MODULE_6__.discountAmountMultiply)(product);
      newProduct.sub_total = (0,_calculation_calculation__WEBPACK_IMPORTED_MODULE_6__.subTotalCount)(product);
      if (productUnit) {
        newProduct.sale_unit = productUnit.value ? productUnit.value : productUnit;
      }
      onProductUpdateInCart(newProduct);
      setIsShowModal(false);
      setErrors('');
      updateCost(newProduct.net_unit_price = (0,_calculation_calculation__WEBPACK_IMPORTED_MODULE_6__.amountBeforeTax)(product));
      updateTax(newProduct.tax_value = taxValue);
      updateDiscount(newProduct.discount_value = discountValue);
      updateSaleUnit(newProduct.sale_unit = productUnit.value ? productUnit.value : productUnit);
      updateSubTotal((0,_calculation_calculation__WEBPACK_IMPORTED_MODULE_6__.subTotalCount)(product));
    }
  };
  var clearField = function clearField() {
    setIsShowModal(!isShowModal);
    setErrors('');
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_4__["default"], {
    show: isShowModal,
    onHide: clearField,
    keyboard: true,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__["default"], {
      onKeyPress: function onKeyPress(e) {
        if (e.key === 'Enter') {
          onSaveDetailModal(e);
        }
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_4__["default"].Header, {
        closeButton: true,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_4__["default"].Title, {
          children: product.name
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_4__["default"].Body, {
        className: "pb-3",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_5__["default"], {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
            className: "col-md-12 mb-5",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("label", {
              className: "form-label",
              children: [(0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)('product.input.product-price.label'), ":"]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
              className: "required"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"], {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("input", {
                type: "text",
                name: "product_price",
                className: "form-control",
                onKeyPress: function onKeyPress(event) {
                  return (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.decimalValidate)(event);
                },
                onChange: onChangePrice,
                value: netUnit,
                placeholder: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.placeholderText)('product.input.product-price.placeholder.label')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"].Text, {
                children: frontSetting.value && frontSetting.value.currency_symbol
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
              className: "text-danger d-block fw-400 fs-small mt-2",
              children: errors['netUnit'] ? errors['netUnit'] : null
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
            className: "col-md-12 mb-5",
            children: defaultTaxType && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_select_reactSelect__WEBPACK_IMPORTED_MODULE_8__["default"], {
              title: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)('product.input.tax-type.label'),
              multiLanguageOption: taxTypeFilterOptions,
              onChange: onTaxTypeChange,
              errors: '',
              defaultValue: defaultTaxType,
              placeholder: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.placeholderText)("product.input.tax-type.placeholder.label")
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
            className: "col-md-12 mb-5",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("label", {
              className: "form-label",
              children: [(0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)('purchase.input.order-tax.label'), ":"]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"], {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("input", {
                type: "text",
                name: "taxValue",
                className: "form-control",
                value: taxValue,
                onKeyPress: function onKeyPress(event) {
                  return (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.decimalValidate)(event);
                },
                onChange: onChangeTax
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"].Text, {
                children: "%"
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
              className: "text-danger d-block fw-400 fs-small mt-2",
              children: errors['taxValue'] ? errors['taxValue'] : null
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
            className: "col-md-12 mb-5",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_select_reactSelect__WEBPACK_IMPORTED_MODULE_8__["default"], {
              title: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)('purchase.product-modal.select.discount-type.label'),
              multiLanguageOption: discountTypeFilterOptions,
              onChange: onDiscountTypeChange,
              errors: '',
              defaultValue: defaultDiscountType,
              placeholder: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.placeholderText)("pos-sale.select.discount-type.placeholder")
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
            className: "col-md-12 mb-5",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("label", {
              className: "form-label",
              children: [(0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)('purchase.order-item.table.discount.column.label'), ":"]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
              className: "required"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("input", {
              type: "text",
              name: "discountValue",
              className: "form-control",
              onChange: onChangeDiscount,
              onKeyPress: function onKeyPress(event) {
                return (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.decimalValidate)(event);
              },
              value: discountValue
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
              className: "text-danger d-block fw-400 fs-small mt-2",
              children: errors['discountValue'] ? errors['discountValue'] : null
            })]
          }), product.newItem !== '' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
            className: "col-md-12 mb-5",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_select_reactSelect__WEBPACK_IMPORTED_MODULE_8__["default"], {
              title: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)('product.input.sale-unit.label'),
              defaultValue: selectedSaleUnit,
              value: selectedSaleUnit,
              data: productSales,
              onChange: onSaleUnitChange,
              errors: '',
              placeholder: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.placeholderText)("product.input.sale-unit.placeholder.label")
            })
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_4__["default"].Footer, _defineProperty({
        children: "justify-content-start",
        className: "pt-0"
      }, "children", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
        className: "d-flex",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"], {
          className: "btn btn-primary me-2",
          type: "submit",
          onClick: function onClick(e) {
            return onSaveDetailModal(e);
          },
          children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)('globally.save-btn')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"], {
          onClick: function onClick(e) {
            e.stopPropagation();
            setIsShowModal(false);
          },
          type: "reset",
          variant: "light",
          className: "btn btn-secondary",
          children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)('globally.cancel-btn')
        })]
      })))]
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProductModal);

/***/ },

/***/ "./resources/pos/src/shared/components/sales/ProductRowTable.js"
/*!**********************************************************************!*\
  !*** ./resources/pos/src/shared/components/sales/ProductRowTable.js ***!
  \**********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Table.js");
/* harmony import */ var _ProductTableBody__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ProductTableBody */ "./resources/pos/src/shared/components/sales/ProductTableBody.js");
/* harmony import */ var _sharedMethod__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");





var ProductRowTable = function ProductRowTable(props) {
  var updateProducts = props.updateProducts,
    setUpdateProducts = props.setUpdateProducts,
    updatedQty = props.updatedQty,
    updateCost = props.updateCost,
    updateDiscount = props.updateDiscount,
    updateTax = props.updateTax,
    frontSetting = props.frontSetting,
    updateSubTotal = props.updateSubTotal,
    updateSaleUnit = props.updateSaleUnit,
    isSaleReturn = props.isSaleReturn;
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
          children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_3__.getFormattedMessage)('sale.order-item.table.net-unit-price.column.label')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
          children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_3__.getFormattedMessage)('purchase.order-item.table.stock.column.label')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
          className: "text-lg-start text-center",
          children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_3__.getFormattedMessage)('purchase.order-item.table.qty.column.label')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
          children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_3__.getFormattedMessage)('purchase.order-item.table.discount.column.label')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
          children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_3__.getFormattedMessage)('purchase.order-item.table.tax.column.label')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
          children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_3__.getFormattedMessage)('purchase.order-item.table.sub-total.column.label')
        }), isSaleReturn ? null : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("th", {
          children: [" ", (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_3__.getFormattedMessage)('react-data-table.action.column.label')]
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("tbody", {
      children: [updateProducts && updateProducts.map(function (singleProduct, index) {
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ProductTableBody__WEBPACK_IMPORTED_MODULE_2__["default"], {
          singleProduct: singleProduct,
          index: index,
          updateProducts: updateProducts,
          setUpdateProducts: setUpdateProducts,
          frontSetting: frontSetting,
          updateQty: updatedQty,
          updateCost: updateCost,
          updateDiscount: updateDiscount,
          updateTax: updateTax,
          updateSubTotal: updateSubTotal,
          updateSaleUnit: updateSaleUnit
        }, index);
      }), !updateProducts.length && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("tr", {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("td", {
          colSpan: 8,
          className: "fs-5 px-3 py-6 custom-text-center",
          children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_3__.getFormattedMessage)('sale.product.table.no-data.label')
        })
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProductRowTable);

/***/ },

/***/ "./resources/pos/src/shared/components/sales/ProductTableBody.js"
/*!***********************************************************************!*\
  !*** ./resources/pos/src/shared/components/sales/ProductTableBody.js ***!
  \***********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/InputGroup.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap/Form */ "./node_modules/react-bootstrap/esm/Form.js");
/* harmony import */ var _calculation_calculation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../calculation/calculation */ "./resources/pos/src/shared/calculation/calculation.js");
/* harmony import */ var _ProductModal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ProductModal */ "./resources/pos/src/shared/components/sales/ProductModal.js");
/* harmony import */ var _store_action_productSaleUnitAction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../store/action/productSaleUnitAction */ "./resources/pos/src/store/action/productSaleUnitAction.js");
/* harmony import */ var _sharedMethod__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "./node_modules/@fortawesome/react-fontawesome/index.es.js");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.mjs");
/* harmony import */ var _store_action_toastAction__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../store/action/toastAction */ "./resources/pos/src/store/action/toastAction.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
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













var ProductTableBody = function ProductTableBody(props) {
  var _singleProduct$produc, _singleProduct$produc2;
  var singleProduct = props.singleProduct,
    index = props.index,
    updateProducts = props.updateProducts,
    setUpdateProducts = props.setUpdateProducts,
    productSales = props.productSales,
    productSalesDropdown = props.productSalesDropdown,
    updateCost = props.updateCost,
    updateDiscount = props.updateDiscount,
    updateTax = props.updateTax,
    updateSubTotal = props.updateSubTotal,
    updateSaleUnit = props.updateSaleUnit,
    frontSetting = props.frontSetting,
    allConfigData = props.allConfigData;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    isShowModal = _useState2[0],
    setIsShowModal = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState4 = _slicedToArray(_useState3, 2),
    updateProductData = _useState4[0],
    setUpdateProductData = _useState4[1];
  var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_2__.useDispatch)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    singleProduct.newItem !== "" && productSalesDropdown(singleProduct.product_unit);
  }, [updateProductData, singleProduct.sale_unit]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    singleProduct.sub_total = Number((0,_calculation_calculation__WEBPACK_IMPORTED_MODULE_4__.subTotalCount)(singleProduct));
  }, [singleProduct.sub_total]);
  var onProductUpdateInCart = function onProductUpdateInCart(item) {
    setUpdateProductData(item);
  };
  var onDeleteCartItem = function onDeleteCartItem(id) {
    var newProduct = updateProducts.filter(function (item) {
      return item.id !== id;
    });
    setUpdateProducts(newProduct);
  };
  var handleIncrement = function handleIncrement() {
    singleProduct.isSaleReturn || singleProduct.isSaleReturnEdit ? setUpdateProducts(function (updateProducts) {
      return updateProducts.map(function (item) {
        if (item.id === singleProduct.id) {
          if (item.quantity >= item.sold_quantity) {
            dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_10__.addToast)({
              text: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)("sale-return.product-qty.validate.message"),
              type: _constants__WEBPACK_IMPORTED_MODULE_11__.toastType.ERROR
            }));
            return item;
          } else {
            return _objectSpread(_objectSpread({}, item), {}, {
              quantity: Number(item.quantity) + 1
            });
          }
        } else {
          return item;
        }
      });
    }) : setUpdateProducts(function (updateProducts) {
      return updateProducts.map(function (item) {
        if (item.id === singleProduct.id) {
          var newQuantity = Number(item.quantity) + 1;
          // Si la línea es una presentación (ej. Six Pack),
          // el límite del producto está definido en unidades
          // sueltas, así que hay que convertir antes de comparar.
          var equivalence = item.presentation_equivalence || 1;
          var newQuantityInBaseUnits = newQuantity * equivalence;
          if (item.quantity_limit && newQuantityInBaseUnits > item.quantity_limit) {
            dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_10__.addToast)({
              text: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)("sale.product-qty.limit.validate.message"),
              type: _constants__WEBPACK_IMPORTED_MODULE_11__.toastType.ERROR
            }));
            return _objectSpread({}, item);
          }
          return _objectSpread(_objectSpread({}, item), {}, {
            quantity: newQuantity
          });
        } else {
          return item;
        }
      });
    });
  };
  var handleDecrement = function handleDecrement() {
    if (Number(singleProduct.quantity) - 1 > 0) {
      setUpdateProducts(function (updateProducts) {
        return updateProducts.map(function (item) {
          return item.id === singleProduct.id ? _objectSpread(_objectSpread({}, item), {}, {
            quantity: Number(item.quantity) - 1
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
    singleProduct.isSaleReturn || singleProduct.isSaleReturnEdit ? setUpdateProducts(function (updateProducts) {
      return updateProducts.map(function (item) {
        if (item.id === singleProduct.id) {
          if (item.sold_quantity < Number(e.target.value)) {
            dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_10__.addToast)({
              text: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)("sale-return.product-qty.validate.message"),
              type: _constants__WEBPACK_IMPORTED_MODULE_11__.toastType.ERROR
            }));
            return _objectSpread(_objectSpread({}, item), {}, {
              quantity: item.sold_quantity
            });
          } else {
            return _objectSpread(_objectSpread({}, item), {}, {
              quantity: Number(e.target.value)
            });
          }
        } else {
          return item;
        }
      });
    }) : setUpdateProducts(function (updateProducts) {
      return updateProducts.map(function (item) {
        return item.id === singleProduct.id ? _objectSpread(_objectSpread({}, item), {}, {
          quantity: Number(value)
        }) : item;
      });
    });
  };
  var onClickShowProductModal = function onClickShowProductModal() {
    setIsShowModal(true);
    productSalesDropdown(singleProduct.product_unit);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("tr", {
      className: "align-middle text-nowrap",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("td", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("h4", {
          className: "product-name",
          children: singleProduct.code
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("div", {
          className: "d-flex align-items-center",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("span", {
            className: "badge bg-light-success",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("span", {
              children: singleProduct.name
            })
          }), singleProduct.variation_type_name && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("span", {
            className: "badge bg-light-primary ms-1",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("span", {
              children: singleProduct.variation_type_name
            })
          }), singleProduct.product_presentation && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("span", {
            className: "badge bg-light-info ms-1",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("span", {
              children: ((_singleProduct$produc = singleProduct.product_presentation.variation_type) === null || _singleProduct$produc === void 0 ? void 0 : _singleProduct$produc.name) || "Presentación"
            })
          }), singleProduct.isSaleReturn === true || singleProduct.isSaleReturnEdit === true ? null : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("span", {
            className: "badge bg-light-primary p-1 ms-1",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_8__.FontAwesomeIcon, {
              icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_9__.faPencil,
              onClick: function onClick(e) {
                return onClickShowProductModal(e);
              },
              style: {
                cursor: "pointer"
              }
            })
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("td", {
        children: [(0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, (0,_calculation_calculation__WEBPACK_IMPORTED_MODULE_4__.amountBeforeTax)(singleProduct).toFixed(2)), singleProduct.product_presentation && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("div", {
          className: "text-muted fs-small",
          children: ["por ", ((_singleProduct$produc2 = singleProduct.product_presentation.variation_type) === null || _singleProduct$produc2 === void 0 ? void 0 : _singleProduct$produc2.name) || "presentación"]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
        children: singleProduct.isEdit ? singleProduct.stock.length >= 1 ? singleProduct.stock.map(function (item) {
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("span", {
            className: "badge bg-light-warning",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("span", {
              children: [item.quantity, "\xA0", singleProduct.short_name]
            })
          });
        }) : singleProduct.stock === "" ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("span", {
          className: "badge bg-light-warning",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("span", {
            children: [singleProduct.sold_quantity, "\xA0", singleProduct.short_name]
          })
        }) : null : singleProduct.stock >= 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("span", {
          className: "badge bg-light-warning",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("span", {
            children: [singleProduct.stock, "\xA0", singleProduct.short_name]
          })
        }) : null
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("div", {
          className: "custom-qty",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"], {
            className: "flex-nowrap",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"].Text, {
              className: "btn btn-primary btn-sm px-4 px-4 pt-2",
              onClick: function onClick(e) {
                return handleDecrement(e);
              },
              children: "-"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_3__["default"].Control, {
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
                return handleChange(e, singleProduct);
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"].Text, {
              className: "btn btn-primary btn-sm px-4 px-4 pt-2",
              onClick: function onClick(e) {
                return handleIncrement(e);
              },
              children: "+"
            })]
          }), singleProduct.product_presentation && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("div", {
            className: "text-muted fs-small mt-1 text-center",
            children: ["= ", singleProduct.quantity * (singleProduct.presentation_equivalence || 1), " unidades"]
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
        children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, (0,_calculation_calculation__WEBPACK_IMPORTED_MODULE_4__.discountAmountMultiply)(singleProduct))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
        children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, (0,_calculation_calculation__WEBPACK_IMPORTED_MODULE_4__.taxAmountMultiply)(singleProduct))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
        children: (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, (0,_calculation_calculation__WEBPACK_IMPORTED_MODULE_4__.subTotalCount)(singleProduct))
      }), singleProduct.isSaleReturn || singleProduct.isSaleReturnEdit ? null : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
        className: "text-start",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("button", {
          className: "btn px-2 text-danger fs-3",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_8__.FontAwesomeIcon, {
            icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_9__.faTrash,
            onClick: function onClick() {
              return onDeleteCartItem(singleProduct.id);
            }
          })
        })
      })]
    }, index), isShowModal && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_ProductModal__WEBPACK_IMPORTED_MODULE_5__["default"], {
      product: singleProduct,
      isShowModal: isShowModal,
      frontSetting: frontSetting,
      updateSubTotal: updateSubTotal,
      setIsShowModal: setIsShowModal,
      updateCost: updateCost,
      updateDiscount: updateDiscount,
      updateTax: updateTax,
      productSales: productSales,
      updateSaleUnit: updateSaleUnit,
      onProductUpdateInCart: onProductUpdateInCart
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var productSales = state.productSales,
    allConfigData = state.allConfigData;
  return {
    productSales: productSales,
    allConfigData: allConfigData
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_2__.connect)(mapStateToProps, {
  productSalesDropdown: _store_action_productSaleUnitAction__WEBPACK_IMPORTED_MODULE_6__.productSalesDropdown
})(ProductTableBody));

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
    var _product$attributes$v, _product$attributes, _product$attributes2;
    saleProductRowArray.push({
      name: product.attributes.name,
      code: product.attributes.code,
      variation_type_name: ((_product$attributes$v = product.attributes.variation_product) === null || _product$attributes$v === void 0 ? void 0 : _product$attributes$v.variation_type_name) || null,
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

/***/ "./resources/pos/src/store/action/customerAction.js"
/*!**********************************************************!*\
  !*** ./resources/pos/src/store/action/customerAction.js ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addCustomer: () => (/* binding */ addCustomer),
/* harmony export */   addImportCustomers: () => (/* binding */ addImportCustomers),
/* harmony export */   deleteCustomer: () => (/* binding */ deleteCustomer),
/* harmony export */   editCustomer: () => (/* binding */ editCustomer),
/* harmony export */   fetchAllCustomer: () => (/* binding */ fetchAllCustomer),
/* harmony export */   fetchCustomer: () => (/* binding */ fetchCustomer),
/* harmony export */   fetchCustomers: () => (/* binding */ fetchCustomers)
/* harmony export */ });
/* harmony import */ var _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config/apiConfig */ "./resources/pos/src/config/apiConfig.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _shared_requestParam__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/requestParam */ "./resources/pos/src/shared/requestParam.js");
/* harmony import */ var _toastAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./toastAction */ "./resources/pos/src/store/action/toastAction.js");
/* harmony import */ var _totalRecordAction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./totalRecordAction */ "./resources/pos/src/store/action/totalRecordAction.js");
/* harmony import */ var _loadingAction__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./loadingAction */ "./resources/pos/src/store/action/loadingAction.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _saveButtonAction__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./saveButtonAction */ "./resources/pos/src/store/action/saveButtonAction.js");
/* harmony import */ var _importProductApiAction__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./importProductApiAction */ "./resources/pos/src/store/action/importProductApiAction.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! dayjs */ "./node_modules/dayjs/dayjs.min.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(dayjs__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! dayjs/plugin/utc */ "./node_modules/dayjs/plugin/utc.js");
/* harmony import */ var dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! dayjs/plugin/localizedFormat */ "./node_modules/dayjs/plugin/localizedFormat.js");
/* harmony import */ var dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! dayjs/plugin/isoWeek */ "./node_modules/dayjs/plugin/isoWeek.js");
/* harmony import */ var dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! dayjs/plugin/relativeTime */ "./node_modules/dayjs/plugin/relativeTime.js");
/* harmony import */ var dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_13__);
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }














dayjs__WEBPACK_IMPORTED_MODULE_9___default().extend((dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_10___default()));
dayjs__WEBPACK_IMPORTED_MODULE_9___default().extend((dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_11___default()));
dayjs__WEBPACK_IMPORTED_MODULE_9___default().extend((dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_12___default()));
dayjs__WEBPACK_IMPORTED_MODULE_9___default().extend((dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_13___default()));
var fetchCustomers = function fetchCustomers() {
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
            url = _constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.CUSTOMERS;
            if (!_.isEmpty(filter) && (filter.page || filter.pageSize || filter.search || filter.order_By || filter.created_at)) {
              url += (0,_shared_requestParam__WEBPACK_IMPORTED_MODULE_2__["default"])(filter, null, null, null, url);
            }
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].get(url).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.customerActionType.FETCH_CUSTOMERS,
                payload: response.data.data
              });
              dispatch((0,_totalRecordAction__WEBPACK_IMPORTED_MODULE_4__.setTotalRecord)(response.data.meta.total !== undefined && response.data.meta.total >= 0 ? response.data.meta.total : response.data.data.total));
              if (isLoading) {
                dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_5__.setLoading)(false));
              }
            })["catch"](function (_ref2) {
              var response = _ref2.response;
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
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
var fetchCustomer = function fetchCustomer(customerId) {
  var isLoading = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(dispatch) {
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            if (isLoading) {
              dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_5__.setLoading)(true));
            }
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].get(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.CUSTOMERS + "/" + customerId).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.customerActionType.FETCH_CUSTOMER,
                payload: response.data.data
              });
              if (isLoading) {
                dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_5__.setLoading)(false));
              }
            })["catch"](function (_ref4) {
              var response = _ref4.response;
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
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
var addCustomer = function addCustomer(supplier, navigate) {
  return /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(dispatch) {
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_7__.setSavingButton)(true));
            _context3.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].post(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.CUSTOMERS, supplier).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.customerActionType.ADD_CUSTOMER,
                payload: response.data.data
              });
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("customer.success.create.message")
              }));
              navigate("/app/customers");
              dispatch((0,_totalRecordAction__WEBPACK_IMPORTED_MODULE_4__.addInToTotalRecord)(1));
              dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_7__.setSavingButton)(false));
            })["catch"](function (_ref6) {
              var response = _ref6.response;
              dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_7__.setSavingButton)(false));
              response && dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
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
var editCustomer = function editCustomer(customerId, customer, navigate) {
  return /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(dispatch) {
      var name, dob, email, phone, country, city, address, identification, tipo_identificacion, data;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_7__.setSavingButton)(true));
            name = customer.name, dob = customer.dob, email = customer.email, phone = customer.phone, country = customer.country, city = customer.city, address = customer.address, identification = customer.identification, tipo_identificacion = customer.tipo_identificacion;
            data = {
              name: name,
              dob: dob === null ? null : dayjs__WEBPACK_IMPORTED_MODULE_9___default()(dob).format("YYYY-MM-DD"),
              email: email,
              phone: phone,
              country: country,
              city: city,
              address: address,
              identification: identification,
              tipo_identificacion: tipo_identificacion
            };
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].patch(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.CUSTOMERS + "/" + customerId, data).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.customerActionType.EDIT_CUSTOMER,
                payload: response.data.data
              });
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("customer.success.edit.message")
              }));
              navigate("/app/customers");
              dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_7__.setSavingButton)(false));
            })["catch"](function (_ref8) {
              var response = _ref8.response;
              dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_7__.setSavingButton)(false));
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
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
var deleteCustomer = function deleteCustomer(customerId) {
  return /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(dispatch) {
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"]["delete"](_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.CUSTOMERS + "/" + customerId).then(function (response) {
              dispatch((0,_totalRecordAction__WEBPACK_IMPORTED_MODULE_4__.removeFromTotalRecord)(1));
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.customerActionType.DELETE_CUSTOMER,
                payload: customerId
              });
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("customer.success.delete.message")
              }));
            })["catch"](function (_ref0) {
              var response = _ref0.response;
              response && dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
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
var fetchAllCustomer = function fetchAllCustomer() {
  return /*#__PURE__*/function () {
    var _ref1 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(dispatch) {
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].get("customers?page[size]=0").then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.customerActionType.FETCH_ALL_CUSTOMER,
                payload: response.data.data
              });
            })["catch"](function (_ref10) {
              var response = _ref10.response;
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: response.data.message,
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.toastType.ERROR
              }));
            });
          case 1:
            return _context6.a(2);
        }
      }, _callee6);
    }));
    return function (_x6) {
      return _ref1.apply(this, arguments);
    };
  }();
};
var addImportCustomers = function addImportCustomers(importData) {
  return /*#__PURE__*/function () {
    var _ref11 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(dispatch) {
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.n) {
          case 0:
            _context7.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].post(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.IMPORT_CUSTOMERS, importData).then(function (response) {
              dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_5__.setLoading)(false));
              dispatch((0,_importProductApiAction__WEBPACK_IMPORTED_MODULE_8__.callImportProductApi)(true));
              // dispatch({type: productActionType.ADD_IMPORT_PRODUCT, payload: response.data.data});
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: "Customers Import Create Success "
              }));
              dispatch((0,_totalRecordAction__WEBPACK_IMPORTED_MODULE_4__.addInToTotalRecord)(1));
            })["catch"](function (_ref12) {
              var response = _ref12.response;
              response && dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: response.data.message,
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.toastType.ERROR
              }));
            });
          case 1:
            return _context7.a(2);
        }
      }, _callee7);
    }));
    return function (_x7) {
      return _ref11.apply(this, arguments);
    };
  }();
};

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

/***/ },

/***/ "./resources/pos/src/store/action/salesReturnAction.js"
/*!*************************************************************!*\
  !*** ./resources/pos/src/store/action/salesReturnAction.js ***!
  \*************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addSaleReturn: () => (/* binding */ addSaleReturn),
/* harmony export */   deleteSaleReturn: () => (/* binding */ deleteSaleReturn),
/* harmony export */   editSaleReturn: () => (/* binding */ editSaleReturn),
/* harmony export */   fetchSaleReturn: () => (/* binding */ fetchSaleReturn),
/* harmony export */   fetchSalesReturn: () => (/* binding */ fetchSalesReturn)
/* harmony export */ });
/* harmony import */ var _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config/apiConfig */ "./resources/pos/src/config/apiConfig.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _toastAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./toastAction */ "./resources/pos/src/store/action/toastAction.js");
/* harmony import */ var _totalRecordAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./totalRecordAction */ "./resources/pos/src/store/action/totalRecordAction.js");
/* harmony import */ var _loadingAction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./loadingAction */ "./resources/pos/src/store/action/loadingAction.js");
/* harmony import */ var _shared_requestParam__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../shared/requestParam */ "./resources/pos/src/shared/requestParam.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _saveButtonAction__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./saveButtonAction */ "./resources/pos/src/store/action/saveButtonAction.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }








var fetchSalesReturn = function fetchSalesReturn() {
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
            url = _constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.SALE_RETURN;
            if (!_.isEmpty(filter) && (filter.page || filter.pageSize || filter.search || filter.order_By || filter.created_at)) {
              url += (0,_shared_requestParam__WEBPACK_IMPORTED_MODULE_5__["default"])(filter, admin, null, null, url);
            }
            _context.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].get(url).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.saleReturnActionType.FETCH_SALES_RETURN,
                payload: response.data.data
              });
              dispatch((0,_totalRecordAction__WEBPACK_IMPORTED_MODULE_3__.setTotalRecord)(response.data.meta.total !== undefined && response.data.meta.total >= 0 ? response.data.meta.total : response.data.data.total));
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
var fetchSaleReturn = function fetchSaleReturn(saleId, isSaleReturnFromSale) {
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
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].get(!isSaleReturnFromSale ? _constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.SALE_RETURN + "/" + saleId + "/edit" : _constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.EDIT_SALE_FROM_SALE + "/" + saleId).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.saleReturnActionType.FETCH_SALE_RETURN,
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
var addSaleReturn = function addSaleReturn(sale, navigate) {
  return /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(dispatch) {
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_7__.setSavingButton)(true));
            _context3.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].post(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.SALE_RETURN, sale).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.saleReturnActionType.ADD_SALE_RETURN,
                payload: response.data.data
              });
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("sale-return.success.create.message")
              }));
              dispatch((0,_totalRecordAction__WEBPACK_IMPORTED_MODULE_3__.addInToTotalRecord)(1));
              navigate("/app/sale-return");
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
var editSaleReturn = function editSaleReturn(saleId, sale, navigate) {
  return /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(dispatch) {
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_7__.setSavingButton)(true));
            _context4.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].patch(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.SALE_RETURN + "/" + saleId, sale).then(function (response) {
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("sale-return.success.edit.message")
              }));
              navigate("/app/sale-return");
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.saleReturnActionType.EDIT_SALE_RETURN,
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
var deleteSaleReturn = function deleteSaleReturn(userId) {
  return /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(dispatch) {
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            _context5.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"]["delete"](_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.SALE_RETURN + "/" + userId).then(function () {
              dispatch((0,_totalRecordAction__WEBPACK_IMPORTED_MODULE_3__.removeFromTotalRecord)(1));
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.saleReturnActionType.DELETE_SALE_RETURN,
                payload: userId
              });
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("sale-return.success.delete.message")
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

/***/ "./resources/pos/src/store/action/salesReturnDetailAction.js"
/*!*******************************************************************!*\
  !*** ./resources/pos/src/store/action/salesReturnDetailAction.js ***!
  \*******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fetchSaleReturnDetails: () => (/* binding */ fetchSaleReturnDetails)
/* harmony export */ });
/* harmony import */ var _loadingAction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loadingAction */ "./resources/pos/src/store/action/loadingAction.js");
/* harmony import */ var _config_apiConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config/apiConfig */ "./resources/pos/src/config/apiConfig.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _toastAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./toastAction */ "./resources/pos/src/store/action/toastAction.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }




var fetchSaleReturnDetails = function fetchSaleReturnDetails(saleId) {
  var isLoading = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(dispatch) {
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            if (isLoading) {
              dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_0__.setLoading)(true));
            }
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_1__["default"].get(_constants__WEBPACK_IMPORTED_MODULE_2__.apiBaseURL.SALE_RETURN_DETAILS + '/' + saleId).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_2__.saleReturnActionType.FETCH_SALE_RETURN_DETAILS,
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

/***/ "./resources/pos/src/components/saleReturn/saleReturnStatus.json"
/*!***********************************************************************!*\
  !*** ./resources/pos/src/components/saleReturn/saleReturnStatus.json ***!
  \***********************************************************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('[{"label":"Received","value":1},{"label":"Pending","value":2}]');

/***/ }

}]);