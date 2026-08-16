"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["roles"],{

/***/ "./resources/pos/src/components/roles/CreateRole.js"
/*!**********************************************************!*\
  !*** ./resources/pos/src/components/roles/CreateRole.js ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _RoleForm__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./RoleForm */ "./resources/pos/src/components/roles/RoleForm.js");
/* harmony import */ var _store_action_roleAction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../store/action/roleAction */ "./resources/pos/src/store/action/roleAction.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _header_HeaderTitle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../header/HeaderTitle */ "./resources/pos/src/components/header/HeaderTitle.js");
/* harmony import */ var _store_action_permissionAction__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../store/action/permissionAction */ "./resources/pos/src/store/action/permissionAction.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }











var CreateRole = function CreateRole(props) {
  var addRole = props.addRole,
    fetchPermissions = props.fetchPermissions,
    permissions = props.permissions;
  var navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_1__.useNavigate)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchPermissions();
  }, []);
  var addRolesData = function addRolesData(formValue) {
    addRole(formValue, navigate);
  };
  var prepareFormOption = {
    addRolesData: addRolesData,
    permissionsArray: permissions
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.Fragment, {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_5__["default"], {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_9__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_header_HeaderTitle__WEBPACK_IMPORTED_MODULE_6__["default"], {
        title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)("role.create.title"),
        to: "/app/roles"
      }), permissions.length !== 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_RoleForm__WEBPACK_IMPORTED_MODULE_3__["default"], _objectSpread({}, prepareFormOption))]
    })
  });
};
var preparePermissions = function preparePermissions(permissions) {
  var permissionArray = [];
  permissions.forEach(function (permission) {
    permissionArray.push({
      id: permission.id,
      name: permission.attributes.display_name,
      slug: permission.attributes.name,
      selected: false
    });
  });
  return permissionArray;
};
var mapStateToProps = function mapStateToProps(state) {
  var permissions = state.permissions;
  return {
    permissions: preparePermissions(permissions)
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_2__.connect)(mapStateToProps, {
  addRole: _store_action_roleAction__WEBPACK_IMPORTED_MODULE_4__.addRole,
  fetchPermissions: _store_action_permissionAction__WEBPACK_IMPORTED_MODULE_7__.fetchPermissions
})(CreateRole));

/***/ },

/***/ "./resources/pos/src/components/roles/DeleteRole.js"
/*!**********************************************************!*\
  !*** ./resources/pos/src/components/roles/DeleteRole.js ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _store_action_roleAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../store/action/roleAction */ "./resources/pos/src/store/action/roleAction.js");
/* harmony import */ var _shared_action_buttons_DeleteModel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/action-buttons/DeleteModel */ "./resources/pos/src/shared/action-buttons/DeleteModel.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");






var DeleteRole = function DeleteRole(props) {
  var deleteRole = props.deleteRole,
    onDelete = props.onDelete,
    deleteModel = props.deleteModel,
    onClickDeleteModel = props.onClickDeleteModel;
  var deleteUserClick = function deleteUserClick() {
    deleteRole(onDelete.id);
    onClickDeleteModel(false);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
    children: deleteModel && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_shared_action_buttons_DeleteModel__WEBPACK_IMPORTED_MODULE_3__["default"], {
      onClickDeleteModel: onClickDeleteModel,
      deleteModel: deleteModel,
      deleteUserClick: deleteUserClick,
      name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.getFormattedMessage)("role.title")
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(null, {
  deleteRole: _store_action_roleAction__WEBPACK_IMPORTED_MODULE_2__.deleteRole
})(DeleteRole));

/***/ },

/***/ "./resources/pos/src/components/roles/EditRole.js"
/*!********************************************************!*\
  !*** ./resources/pos/src/components/roles/EditRole.js ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var _RoleForm__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./RoleForm */ "./resources/pos/src/components/roles/RoleForm.js");
/* harmony import */ var _store_action_roleAction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../store/action/roleAction */ "./resources/pos/src/store/action/roleAction.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _header_HeaderTitle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../header/HeaderTitle */ "./resources/pos/src/components/header/HeaderTitle.js");
/* harmony import */ var _store_action_permissionAction__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../store/action/permissionAction */ "./resources/pos/src/store/action/permissionAction.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var _shared_components_loaders_Spinner__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../shared/components/loaders/Spinner */ "./resources/pos/src/shared/components/loaders/Spinner.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");












var EditRole = function EditRole(props) {
  var roles = props.roles,
    fetchRole = props.fetchRole,
    fetchPermissions = props.fetchPermissions,
    isLoading = props.isLoading,
    permissions = props.permissions;
  var _useParams = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_2__.useParams)(),
    id = _useParams.id;
  var itemsValue = roles.length === 1 && roles.map(function (role) {
    return {
      name: role.attributes.name,
      description: role.attributes.description,
      permissions: role.attributes.permissions
    };
  });
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchPermissions();
    fetchRole(id);
  }, []);
  var preparePermissions = function preparePermissions(permissions, selectedPermission) {
    var permissionArray = [];
    permissions.length !== 0 && permissions.forEach(function (permission) {
      var perm = selectedPermission && selectedPermission.find(function (perm) {
        return perm.id === permission.id;
      });
      var selected = false;
      if (perm) {
        selected = true;
      }
      permissionArray.push({
        id: permission.id,
        name: permission.attributes.display_name,
        slug: permission.attributes.name,
        selected: selected,
        isChecked: selected
      });
    });
    return permissionArray;
  };
  var newPermission = roles[0] && roles[0].attributes && preparePermissions(permissions, roles[0].attributes.permissions);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_5__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_9__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_header_HeaderTitle__WEBPACK_IMPORTED_MODULE_6__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)("role.edit.title"),
      to: "/app/roles"
    }), isLoading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_shared_components_loaders_Spinner__WEBPACK_IMPORTED_MODULE_10__["default"], {}) : roles.length === 1 && newPermission && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_RoleForm__WEBPACK_IMPORTED_MODULE_3__["default"], {
      singleRole: itemsValue[0],
      id: id,
      permissionsArray: newPermission
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var roles = state.roles,
    permissions = state.permissions,
    isLoading = state.isLoading;
  return {
    roles: roles,
    permissions: permissions,
    // newPermission: roles.length === 1 && roles[0] && roles[0].attributes && preparePermissions(permissions, roles[0].attributes.permissions),
    isLoading: isLoading
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, {
  fetchRole: _store_action_roleAction__WEBPACK_IMPORTED_MODULE_4__.fetchRole,
  fetchPermissions: _store_action_permissionAction__WEBPACK_IMPORTED_MODULE_7__.fetchPermissions
})(/*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(EditRole)));

/***/ },

/***/ "./resources/pos/src/components/roles/Role.js"
/*!****************************************************!*\
  !*** ./resources/pos/src/components/roles/Role.js ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _shared_table_ReactDataTable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/table/ReactDataTable */ "./resources/pos/src/shared/table/ReactDataTable.js");
/* harmony import */ var _shared_action_buttons_ActionButton__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/action-buttons/ActionButton */ "./resources/pos/src/shared/action-buttons/ActionButton.js");
/* harmony import */ var _store_action_roleAction__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../store/action/roleAction */ "./resources/pos/src/store/action/roleAction.js");
/* harmony import */ var _DeleteRole__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./DeleteRole */ "./resources/pos/src/components/roles/DeleteRole.js");
/* harmony import */ var _shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../shared/tab-title/TabTitle */ "./resources/pos/src/shared/tab-title/TabTitle.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }











var Role = function Role(props) {
  var roles = props.roles,
    fetchRoles = props.fetchRoles,
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
  var onClickDeleteModel = function onClickDeleteModel() {
    var isDelete = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    setDeleteModel(!deleteModel);
    setIsDelete(isDelete);
  };
  var itemsValue = roles.length >= 0 && roles.map(function (role) {
    return {
      date: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedDate)(role.attributes.created_at, allConfigData && allConfigData),
      name: role.attributes.name,
      id: role.id
    };
  });
  var onChange = function onChange(filter) {
    fetchRoles(filter, true);
  };
  var goToEdit = function goToEdit(item) {
    var id = item.id;
    window.location.href = "#/app/roles/edit/" + id;
  };
  var columns = [{
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)("globally.input.name.label"),
    selector: function selector(row) {
      return row.name;
    },
    sortable: true,
    sortField: "name"
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)("react-data-table.date.column.label"),
    selector: function selector(row) {
      return row.date;
    },
    sortField: "date",
    sortable: false
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)("react-data-table.action.column.label"),
    right: true,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    cell: function cell(row) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_shared_action_buttons_ActionButton__WEBPACK_IMPORTED_MODULE_4__["default"], {
        item: row,
        goToEditProduct: goToEdit,
        isEditMode: true,
        onClickDeleteModel: onClickDeleteModel
      });
    }
  }];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_2__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_9__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_7__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.placeholderText)("roles.title")
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_shared_table_ReactDataTable__WEBPACK_IMPORTED_MODULE_3__["default"], {
      columns: columns,
      items: itemsValue,
      onChange: onChange,
      ButtonValue: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)("role.create.title"),
      to: "#/app/roles/create",
      totalRows: totalRecord,
      isLoading: isLoading
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_DeleteRole__WEBPACK_IMPORTED_MODULE_6__["default"], {
      onClickDeleteModel: onClickDeleteModel,
      deleteModel: deleteModel,
      onDelete: isDelete
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var roles = state.roles,
    totalRecord = state.totalRecord,
    isLoading = state.isLoading,
    allConfigData = state.allConfigData;
  return {
    roles: roles,
    totalRecord: totalRecord,
    isLoading: isLoading,
    allConfigData: allConfigData
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, {
  fetchRoles: _store_action_roleAction__WEBPACK_IMPORTED_MODULE_5__.fetchRoles
})(Role));

/***/ },

/***/ "./resources/pos/src/components/roles/RoleForm.js"
/*!********************************************************!*\
  !*** ./resources/pos/src/components/roles/RoleForm.js ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Form.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "./node_modules/@fortawesome/react-fontawesome/index.es.js");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.mjs");
/* harmony import */ var _store_action_roleAction__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../store/action/roleAction */ "./resources/pos/src/store/action/roleAction.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _config_permissionGroups__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../config/permissionGroups */ "./resources/pos/src/config/permissionGroups.js");
/* harmony import */ var _config_permissionLabels__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../config/permissionLabels */ "./resources/pos/src/config/permissionLabels.js");
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











var RoleForm = function RoleForm(props) {
  var addRolesData = props.addRolesData,
    singleRole = props.singleRole,
    editRole = props.editRole,
    permissionsArray = props.permissionsArray,
    id = props.id;
  var navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_4__.useNavigate)();
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(permissionsArray),
    _useState2 = _slicedToArray(_useState, 2),
    permissions = _useState2[0],
    setNewPer = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState4 = _slicedToArray(_useState3, 2),
    saveButtonEnable = _useState4[0],
    setSaveButtonEnable = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    allChecked = _useState6[0],
    setAllChecked = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({}),
    _useState8 = _slicedToArray(_useState7, 2),
    collapsedGroups = _useState8[0],
    setCollapsedGroups = _useState8[1];
  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      name: '',
      description: '',
      permissions: []
    }),
    _useState0 = _slicedToArray(_useState9, 2),
    rolesValue = _useState0[0],
    setRolesValue = _useState0[1];
  var _useState1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      name: '',
      permissions: ''
    }),
    _useState10 = _slicedToArray(_useState1, 2),
    errors = _useState10[0],
    setErrors = _useState10[1];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    setRolesValue({
      name: singleRole ? singleRole.name : "",
      description: singleRole ? singleRole.description || '' : "",
      permissions: singleRole ? singleRole.permissions : ''
    });
  }, [singleRole]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    var permissionsArrays = permissions.filter(function (perm) {
      return perm.selected === true;
    }).map(function (rodeId) {
      return rodeId.id;
    });
    setSaveButtonEnable(permissionsArrays);
    setAllChecked(permissions.every(function (item) {
      return item.selected;
    }));
  }, [permissions, allChecked]);
  var disabled = saveButtonEnable.length === 0 ? true : singleRole && singleRole.name === rolesValue.name && (singleRole.description || '') === rolesValue.description && JSON.stringify(singleRole.permissions.map(function (item) {
    return item.id;
  })) === JSON.stringify(saveButtonEnable);
  var handleValidation = function handleValidation() {
    var errorss = {};
    var isValid = false;
    if (!rolesValue['name']) {
      errorss['name'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)("role.input.name.validate.label");
    } else if (rolesValue['name'] && rolesValue['name'].length > 50) {
      errorss['name'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)("role.input.name.valid.validate.label");
    } else if (!saveButtonEnable) {
      errorss['permissions'] = 'Please select permissions';
    } else {
      isValid = true;
    }
    setErrors(errorss);
    return isValid;
  };
  var handleValidations = function handleValidations() {
    var errorss = {};
    var isValid = false;
    if (!rolesValue['name']) {
      errorss['name'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)("globally.input.name.label");
    } else if (!rolesValue['permissions']) {
      errorss['permissions'] = 'Please select permissions';
    } else {
      isValid = true;
    }
    setErrors(errorss);
    return isValid;
  };
  var onChangeInput = function onChangeInput(event) {
    event.preventDefault();
    setRolesValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, _defineProperty({}, event.target.name, event.target.value));
    });
    setErrors('');
  };
  var handleChanged = function handleChanged(event) {
    var itemName = event.target.name;
    var checked = event.target.checked;
    if (itemName === "all_check") {
      setAllChecked(!allChecked);
      setNewPer(permissions.map(function (item) {
        return _objectSpread(_objectSpread({}, item), {}, {
          selected: checked
        });
      }));
    } else {
      setNewPer(permissions.map(function (item) {
        return item.name === itemName ? _objectSpread(_objectSpread({}, item), {}, {
          selected: checked
        }) : item;
      }));
    }
  };
  var handleGroupChanged = function handleGroupChanged(groupKey, checked) {
    setNewPer(permissions.map(function (item) {
      return (0,_config_permissionGroups__WEBPACK_IMPORTED_MODULE_9__.getPermissionGroup)(item.slug) === groupKey ? _objectSpread(_objectSpread({}, item), {}, {
        selected: checked
      }) : item;
    }));
  };
  var toggleGroupCollapsed = function toggleGroupCollapsed(groupKey) {
    setCollapsedGroups(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, groupKey, !prev[groupKey]));
    });
  };
  var groupedPermissions = _config_permissionGroups__WEBPACK_IMPORTED_MODULE_9__.PERMISSION_GROUP_ORDER.map(function (groupKey) {
    return [groupKey, permissions.filter(function (item) {
      return (0,_config_permissionGroups__WEBPACK_IMPORTED_MODULE_9__.getPermissionGroup)(item.slug) === groupKey;
    })];
  }).filter(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      items = _ref2[1];
    return items.length > 0;
  });
  var selectedCount = permissions.filter(function (item) {
    return item.selected;
  }).length;
  var onSubmit = function onSubmit(event, rolesValue) {
    event.preventDefault();
    var Valid = handleValidation();
    if (Valid) {
      var permissionsArrays = permissions.filter(function (perm) {
        return perm.selected === true;
      }).map(function (rodeId) {
        return rodeId.id;
      });
      rolesValue.permissions = permissionsArrays;
      setRolesValue(rolesValue);
      addRolesData(rolesValue);
      setSaveButtonEnable(permissionsArrays);
    }
  };
  var onEdit = function onEdit(event) {
    event.preventDefault();
    var Valid = handleValidations();
    if (Valid && !disabled) {
      var permissionsArrays = permissions.filter(function (perm) {
        return perm.selected === true;
      }).map(function (rodeId) {
        return rodeId.id;
      });
      rolesValue.permissions = permissionsArrays;
      setRolesValue(rolesValue);
      editRole(id, rolesValue, navigate);
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
    className: "container-fluid pt-10",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"], {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
        className: "role-form-layout",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
          className: "role-form-sidebar",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
            className: "card custom-card p-5 bg-white role-form-sidebar-card",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"].Group, {
              className: "mb-5 form-group",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"].Label, {
                className: "form-label fs-6 fw-bolder text-gray-700 mb-3",
                children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)("globally.input.name.label"), ": "]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
                className: "required"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"].Control, {
                type: "text",
                name: "name",
                placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.placeholderText)("globally.input.name.placeholder.label"),
                className: "form-control-solid",
                autoFocus: true,
                onChange: function onChange(event) {
                  return onChangeInput(event);
                },
                value: rolesValue.name
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
                className: "text-danger",
                children: errors['name'] ? errors['name'] : null
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"].Group, {
              className: "mb-5 form-group",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"].Label, {
                className: "form-label fs-6 fw-bolder text-gray-700 mb-3",
                children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)("role.input.description.label"), ": "]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"].Control, {
                as: "textarea",
                rows: 4,
                name: "description",
                placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.placeholderText)("role.input.description.placeholder.label"),
                className: "form-control-solid",
                onChange: function onChange(event) {
                  return onChangeInput(event);
                },
                value: rolesValue.description
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
              className: "role-form-selected-count",
              children: [selectedCount, " ", (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)('role.selected-count.label')]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
              className: "text-danger",
              children: errors['permissions'] ? errors['permissions'] : null
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
          className: "role-form-permissions",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
            className: "role-permissions-toolbar",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("label", {
              className: "role-permission-select-all role-permission-select-all-global",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("input", {
                type: "checkbox",
                checked: allChecked,
                name: "all_check",
                onChange: function onChange(event) {
                  return handleChanged(event);
                },
                className: "form-check-input cursor-pointer"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
                children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)("role.select.all-permission.label")
              })]
            })
          }), groupedPermissions.map(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
              groupKey = _ref4[0],
              items = _ref4[1];
            var isCollapsed = !!collapsedGroups[groupKey];
            var selectedInGroup = items.filter(function (item) {
              return item.selected;
            }).length;
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
              className: "role-permission-accordion",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
                className: "role-permission-accordion-header",
                onClick: function onClick() {
                  return toggleGroupCollapsed(groupKey);
                },
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
                  className: "role-permission-accordion-header-left",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__.faAngleDown,
                    className: "role-permission-chevron".concat(isCollapsed ? ' role-permission-chevron-collapsed' : '')
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
                    className: "role-permission-accordion-title",
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)(_config_permissionGroups__WEBPACK_IMPORTED_MODULE_9__.PERMISSION_GROUP_LABEL_KEYS[groupKey])
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("span", {
                    className: "role-permission-count-badge",
                    children: [selectedInGroup, " / ", items.length]
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("label", {
                  className: "role-permission-select-all",
                  onClick: function onClick(event) {
                    return event.stopPropagation();
                  },
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("input", {
                    type: "checkbox",
                    checked: items.every(function (item) {
                      return item.selected;
                    }),
                    onChange: function onChange(event) {
                      return handleGroupChanged(groupKey, event.target.checked);
                    },
                    className: "form-check-input cursor-pointer"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)('role.select-all.label')
                  })]
                })]
              }), !isCollapsed && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
                className: "role-permission-accordion-body",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
                  className: "role-permission-grid",
                  children: items.map(function (permission) {
                    var labelKey = (0,_config_permissionLabels__WEBPACK_IMPORTED_MODULE_10__.getPermissionLabelKey)(permission.slug);
                    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("label", {
                      className: "role-permission-card",
                      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("input", {
                        type: "checkbox",
                        checked: permission.selected,
                        name: permission.name,
                        value: permission.name,
                        onChange: function onChange(event) {
                          return handleChanged(event);
                        },
                        className: "form-check-input cursor-pointer"
                      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
                        className: "role-permission-card-text",
                        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
                          className: "role-permission-card-label",
                          children: labelKey ? (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)(labelKey) : permission.name
                        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("code", {
                          className: "role-permission-card-slug",
                          children: permission.slug
                        })]
                      })]
                    }, permission.id);
                  })
                })
              })]
            }, groupKey);
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
        className: "d-flex mt-5",
        children: [singleRole ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
          onClick: function onClick(event) {
            return onEdit(event);
          },
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("input", {
            className: "btn btn-primary me-3",
            type: "submit",
            value: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.placeholderText)("globally.save-btn"),
            disabled: disabled
          })
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
          onClick: function onClick(event) {
            return onSubmit(event, rolesValue);
          },
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("input", {
            className: "btn btn-primary me-3",
            type: "submit",
            value: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.placeholderText)("globally.save-btn"),
            disabled: !rolesValue.name || !(saveButtonEnable.length !== 0)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_3__.Link, {
          to: "/app/roles",
          className: "btn btn-light btn-active-light-primary me-3",
          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)("globally.cancel-btn")
        })]
      })]
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_2__.connect)(null, {
  editRole: _store_action_roleAction__WEBPACK_IMPORTED_MODULE_7__.editRole
})(RoleForm));

/***/ },

/***/ "./resources/pos/src/config/permissionGroups.js"
/*!******************************************************!*\
  !*** ./resources/pos/src/config/permissionGroups.js ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PERMISSION_GROUP_LABEL_KEYS: () => (/* binding */ PERMISSION_GROUP_LABEL_KEYS),
/* harmony export */   PERMISSION_GROUP_ORDER: () => (/* binding */ PERMISSION_GROUP_ORDER),
/* harmony export */   getPermissionGroup: () => (/* binding */ getPermissionGroup)
/* harmony export */ });
/**
 * Agrupación puramente visual de los permisos (planos, uno por módulo,
 * todo-o-nada -- no hay granularidad view/create/update/delete real en
 * el backend) para RoleForm.js. Reutiliza las mismas 7 secciones del
 * sidebar (ver asideConfig.js) más "Reportes" y "Configuración", que en
 * el sidebar quedaron como accordions propios sin un groupHeader.
 * Cualquier permiso que no matchee ningún slug de abajo cae en "general"
 * como red de seguridad -- así un permiso nuevo que se nos olvide mapear
 * sigue siendo visible (no desaparece), solo queda mal agrupado.
 */
var PERMISSION_GROUP_ORDER = ['general', 'sales', 'purchases', 'catalog', 'inventory', 'expenses', 'people', 'reports', 'settings'];
var PERMISSION_GROUP_LABEL_KEYS = {
  general: 'sidebar.group.general',
  sales: 'sidebar.group.sales',
  purchases: 'sidebar.group.purchases',
  catalog: 'sidebar.group.catalog',
  inventory: 'sidebar.group.inventory',
  expenses: 'sidebar.group.expenses',
  people: 'sidebar.group.people',
  reports: 'role.permission-group.reports',
  settings: 'role.permission-group.settings'
};
var SLUG_TO_GROUP = {
  manage_dashboard: 'general',
  'manage_my-sales': 'general',
  manage_pos_screen: 'general',
  manage_sale: 'sales',
  manage_sale_return: 'sales',
  manage_quotations: 'sales',
  manage_electronic_invoices: 'sales',
  manage_purchase: 'purchases',
  manage_purchase_return: 'purchases',
  manage_products: 'catalog',
  manage_product_categories: 'catalog',
  manage_variations: 'catalog',
  manage_brands: 'catalog',
  manage_units: 'catalog',
  manage_print_barcode: 'catalog',
  manage_warehouses: 'inventory',
  manage_adjustments: 'inventory',
  manage_transfers: 'inventory',
  manage_kardex: 'inventory',
  manage_expenses: 'expenses',
  manage_expense_categories: 'expenses',
  manage_suppliers: 'people',
  manage_customers: 'people',
  manage_users: 'people',
  manage_login_logs: 'people',
  manage_report: 'reports',
  manage_reports: 'reports',
  manage_roles: 'settings',
  manage_stores: 'settings',
  manage_setting: 'settings',
  manage_currency: 'settings',
  manage_language: 'settings',
  manage_email_templates: 'settings',
  manage_sms_apis: 'settings',
  manage_sms_templates: 'settings',
  manage_sri_config: 'settings'
};
var getPermissionGroup = function getPermissionGroup(slug) {
  return SLUG_TO_GROUP[slug] || 'general';
};

/***/ },

/***/ "./resources/pos/src/config/permissionLabels.js"
/*!******************************************************!*\
  !*** ./resources/pos/src/config/permissionLabels.js ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getPermissionLabelKey: () => (/* binding */ getPermissionLabelKey)
/* harmony export */ });
/**
 * Traducción puramente de presentación para los permisos: el backend
 * sigue guardando/devolviendo `display_name` en inglés tal cual está en
 * la tabla `permissions` (ver Permission::prepareAttributes()) -- no se
 * toca nada de ahí. Este mapa slug -> clave de i18n vive solo en el
 * frontend y se usa para mostrar una etiqueta traducida en RoleForm.js
 * en vez del display_name crudo. Si un slug no está mapeado acá (un
 * permiso nuevo que todavía no se tradujo), el caller debe caer de
 * vuelta al display_name original -- así ningún permiso desaparece o
 * rompe la pantalla, sólo se ve en inglés hasta que se agregue su
 * entrada.
 */
var SLUG_TO_LABEL_KEY = {
  manage_dashboard: 'role.permission.manage_dashboard',
  'manage_my-sales': 'role.permission.manage_my-sales',
  manage_pos_screen: 'role.permission.manage_pos_screen',
  manage_sale: 'role.permission.manage_sale',
  manage_sale_return: 'role.permission.manage_sale_return',
  manage_quotations: 'role.permission.manage_quotations',
  manage_electronic_invoices: 'role.permission.manage_electronic_invoices',
  manage_purchase: 'role.permission.manage_purchase',
  manage_purchase_return: 'role.permission.manage_purchase_return',
  manage_products: 'role.permission.manage_products',
  manage_product_categories: 'role.permission.manage_product_categories',
  manage_variations: 'role.permission.manage_variations',
  manage_brands: 'role.permission.manage_brands',
  manage_units: 'role.permission.manage_units',
  manage_print_barcode: 'role.permission.manage_print_barcode',
  manage_warehouses: 'role.permission.manage_warehouses',
  manage_adjustments: 'role.permission.manage_adjustments',
  manage_transfers: 'role.permission.manage_transfers',
  manage_kardex: 'role.permission.manage_kardex',
  manage_expenses: 'role.permission.manage_expenses',
  manage_expense_categories: 'role.permission.manage_expense_categories',
  manage_suppliers: 'role.permission.manage_suppliers',
  manage_customers: 'role.permission.manage_customers',
  manage_users: 'role.permission.manage_users',
  manage_login_logs: 'role.permission.manage_login_logs',
  manage_report: 'role.permission.manage_report',
  manage_reports: 'role.permission.manage_reports',
  manage_roles: 'role.permission.manage_roles',
  manage_stores: 'role.permission.manage_stores',
  manage_setting: 'role.permission.manage_setting',
  manage_currency: 'role.permission.manage_currency',
  manage_language: 'role.permission.manage_language',
  manage_email_templates: 'role.permission.manage_email_templates',
  manage_sms_apis: 'role.permission.manage_sms_apis',
  manage_sms_templates: 'role.permission.manage_sms_templates',
  manage_sri_config: 'role.permission.manage_sri_config'
};
var getPermissionLabelKey = function getPermissionLabelKey(slug) {
  return SLUG_TO_LABEL_KEY[slug] || null;
};

/***/ },

/***/ "./resources/pos/src/store/action/roleAction.js"
/*!******************************************************!*\
  !*** ./resources/pos/src/store/action/roleAction.js ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addRole: () => (/* binding */ addRole),
/* harmony export */   deleteRole: () => (/* binding */ deleteRole),
/* harmony export */   editRole: () => (/* binding */ editRole),
/* harmony export */   fetchAllRoles: () => (/* binding */ fetchAllRoles),
/* harmony export */   fetchRole: () => (/* binding */ fetchRole),
/* harmony export */   fetchRoles: () => (/* binding */ fetchRoles)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _config_apiConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config/apiConfig */ "./resources/pos/src/config/apiConfig.js");
/* harmony import */ var _totalRecordAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./totalRecordAction */ "./resources/pos/src/store/action/totalRecordAction.js");
/* harmony import */ var _toastAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./toastAction */ "./resources/pos/src/store/action/toastAction.js");
/* harmony import */ var _shared_requestParam__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/requestParam */ "./resources/pos/src/shared/requestParam.js");
/* harmony import */ var _loadingAction__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./loadingAction */ "./resources/pos/src/store/action/loadingAction.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }







var fetchRoles = function fetchRoles() {
  var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var isLoading = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(dispatch) {
      var admin, url;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            if (isLoading) {
              dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_5__.setLoading)(true));
            }
            admin = true;
            url = _constants__WEBPACK_IMPORTED_MODULE_0__.apiBaseURL.ROLES;
            if (!_.isEmpty(filter) && (filter.page || filter.pageSize || filter.search || filter.order_By || filter.created_at)) {
              url += (0,_shared_requestParam__WEBPACK_IMPORTED_MODULE_4__["default"])(filter, admin, null, null, url);
            }
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_1__["default"].get(url).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_0__.rolesActionType.FETCH_ROLES,
                payload: response.data.data
              });
              dispatch((0,_totalRecordAction__WEBPACK_IMPORTED_MODULE_2__.setTotalRecord)(response.data.meta.total !== undefined && response.data.meta.total >= 0 ? response.data.meta.total : response.data.data.total));
              if (isLoading) {
                dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_5__.setLoading)(false));
              }
            })["catch"](function (_ref2) {
              var response = _ref2.response;
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: response.data.message,
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
var fetchRole = function fetchRole(rolesId, singleRole) {
  var isLoading = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(dispatch) {
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            if (isLoading) {
              dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_5__.setLoading)(true));
            }
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_1__["default"].get(_constants__WEBPACK_IMPORTED_MODULE_0__.apiBaseURL.ROLES + "/" + rolesId, singleRole).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_0__.rolesActionType.FETCH_ROLE,
                payload: response.data.data
              });
              if (isLoading) {
                dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_5__.setLoading)(false));
              }
            })["catch"](function (_ref4) {
              var response = _ref4.response;
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: response.data.message,
                type: _constants__WEBPACK_IMPORTED_MODULE_0__.toastType.ERROR
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
var addRole = function addRole(roles, navigate) {
  return /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(dispatch) {
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            _context3.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_1__["default"].post(_constants__WEBPACK_IMPORTED_MODULE_0__.apiBaseURL.ROLES, roles).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_0__.rolesActionType.ADD_ROLES,
                payload: response.data.data
              });
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("role.success.create.message")
              }));
              navigate("/app/roles");
              dispatch((0,_totalRecordAction__WEBPACK_IMPORTED_MODULE_2__.addInToTotalRecord)(1));
            })["catch"](function (_ref6) {
              var response = _ref6.response;
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: response.data.message,
                type: _constants__WEBPACK_IMPORTED_MODULE_0__.toastType.ERROR
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
var editRole = function editRole(rolesId, role, navigate) {
  return /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(dispatch) {
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            _context4.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_1__["default"].patch(_constants__WEBPACK_IMPORTED_MODULE_0__.apiBaseURL.ROLES + "/" + rolesId, role).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_0__.rolesActionType.EDIT_ROLES,
                payload: response.data.data
              });
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("role.success.edit.message")
              }));
              navigate("/app/roles");
            })["catch"](function (_ref8) {
              var response = _ref8.response;
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: response.data.message,
                type: _constants__WEBPACK_IMPORTED_MODULE_0__.toastType.ERROR
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
var deleteRole = function deleteRole(rolesId) {
  return /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(dispatch) {
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_1__["default"]["delete"](_constants__WEBPACK_IMPORTED_MODULE_0__.apiBaseURL.ROLES + "/" + rolesId).then(function (response) {
              dispatch((0,_totalRecordAction__WEBPACK_IMPORTED_MODULE_2__.removeFromTotalRecord)(1));
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_0__.rolesActionType.DELETE_ROLES,
                payload: rolesId
              });
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("role.success.delete.message")
              }));
            })["catch"](function (_ref0) {
              var response = _ref0.response;
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: response.data.message,
                type: _constants__WEBPACK_IMPORTED_MODULE_0__.toastType.ERROR
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
var fetchAllRoles = function fetchAllRoles() {
  return /*#__PURE__*/function () {
    var _ref1 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(dispatch) {
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_1__["default"].get("roles?page[size]=0").then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_0__.rolesActionType.FETCH_ALL_ROLES,
                payload: response.data.data
              });
            })["catch"](function (_ref10) {
              var response = _ref10.response;
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: response.data.message,
                type: _constants__WEBPACK_IMPORTED_MODULE_0__.toastType.ERROR
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

/***/ }

}]);