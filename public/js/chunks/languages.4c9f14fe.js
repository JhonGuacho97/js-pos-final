"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["languages"],{

/***/ "./resources/pos/src/components/languages/CreateLanguage.js"
/*!******************************************************************!*\
  !*** ./resources/pos/src/components/languages/CreateLanguage.js ***!
  \******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Button.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _store_action_languageAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../store/action/languageAction */ "./resources/pos/src/store/action/languageAction.js");
/* harmony import */ var _LanguageForm__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./LanguageForm */ "./resources/pos/src/components/languages/LanguageForm.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }







var CreateBaseUnits = function CreateBaseUnits(props) {
  var addLanguage = props.addLanguage;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    show = _useState2[0],
    setShow = _useState2[1];
  var handleClose = function handleClose() {
    return setShow(!show);
  };
  var addLanguageData = function addLanguageData(productValue) {
    addLanguage(productValue);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
    className: "text-end w-sm-auto",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_1__["default"], {
      variant: "primary mb-lg-0 mb-4",
      onClick: handleClose,
      children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.getFormattedMessage)('language.create.title')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_LanguageForm__WEBPACK_IMPORTED_MODULE_4__["default"], {
      addLanguageData: addLanguageData,
      handleClose: handleClose,
      show: show,
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_5__.getFormattedMessage)('language.create.title')
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_2__.connect)(null, {
  addLanguage: _store_action_languageAction__WEBPACK_IMPORTED_MODULE_3__.addLanguage
})(CreateBaseUnits));

/***/ },

/***/ "./resources/pos/src/components/languages/DeleteLanguage.js"
/*!******************************************************************!*\
  !*** ./resources/pos/src/components/languages/DeleteLanguage.js ***!
  \******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _store_action_languageAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../store/action/languageAction */ "./resources/pos/src/store/action/languageAction.js");
/* harmony import */ var _shared_action_buttons_DeleteModel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/action-buttons/DeleteModel */ "./resources/pos/src/shared/action-buttons/DeleteModel.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");





var DeleteBaseUnits = function DeleteBaseUnits(props) {
  var deleteLanguage = props.deleteLanguage,
    onDelete = props.onDelete,
    deleteModel = props.deleteModel,
    onClickDeleteModel = props.onClickDeleteModel;
  var deleteUserClick = function deleteUserClick() {
    deleteLanguage(onDelete.id);
    onClickDeleteModel(false);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
    children: deleteModel && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_shared_action_buttons_DeleteModel__WEBPACK_IMPORTED_MODULE_3__["default"], {
      onClickDeleteModel: onClickDeleteModel,
      deleteModel: deleteModel,
      deleteUserClick: deleteUserClick,
      name: "Language"
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(null, {
  deleteLanguage: _store_action_languageAction__WEBPACK_IMPORTED_MODULE_2__.deleteLanguage
})(DeleteBaseUnits));

/***/ },

/***/ "./resources/pos/src/components/languages/EditLanguage.js"
/*!****************************************************************!*\
  !*** ./resources/pos/src/components/languages/EditLanguage.js ***!
  \****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _LanguageForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./LanguageForm */ "./resources/pos/src/components/languages/LanguageForm.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");





var EditLanguage = function EditLanguage(props) {
  var handleClose = props.handleClose,
    show = props.show,
    language = props.language;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
    children: language && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_LanguageForm__WEBPACK_IMPORTED_MODULE_2__["default"], {
      handleClose: handleClose,
      show: show,
      singleLanguage: language,
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_3__.getFormattedMessage)('language.edit.title')
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(null)(EditLanguage));

/***/ },

/***/ "./resources/pos/src/components/languages/EditLanguageData.js"
/*!********************************************************************!*\
  !*** ./resources/pos/src/components/languages/EditLanguageData.js ***!
  \********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _store_action_languageAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../store/action/languageAction */ "./resources/pos/src/store/action/languageAction.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _header_HeaderTitle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../header/HeaderTitle */ "./resources/pos/src/components/header/HeaderTitle.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shared/select/reactSelect */ "./resources/pos/src/shared/select/reactSelect.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
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










var EditLanguageData = function EditLanguageData(props) {
  var _language$, _language$2;
  var editLanguageData = props.editLanguageData,
    language = props.language,
    fetchLanguageData = props.fetchLanguageData;
  var _useParams = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_4__.useParams)(),
    id = _useParams.id;
  var navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_4__.useNavigate)();
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({}),
    _useState2 = _slicedToArray(_useState, 2),
    langJsonObj = _useState2[0],
    setLangJsonObj = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({}),
    _useState4 = _slicedToArray(_useState3, 2),
    langPhpObj = _useState4[0],
    setLangPhpObj = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({}),
    _useState6 = _slicedToArray(_useState5, 2),
    errorObj = _useState6[0],
    setErrorObj = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({}),
    _useState8 = _slicedToArray(_useState7, 2),
    successObj = _useState8[0],
    setSuccessObj = _useState8[1];
  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({}),
    _useState0 = _slicedToArray(_useState9, 2),
    pdfObj = _useState0[0],
    setPdfObj = _useState0[1];
  var _useState1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      type: 1
    }),
    _useState10 = _slicedToArray(_useState1, 2),
    fileType = _useState10[0],
    setFileType = _useState10[1];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchLanguageData(id);
  }, []);
  var lang_json_array = (_language$ = language[0]) === null || _language$ === void 0 ? void 0 : _language$.lang_json_array;
  var lang_php_array = (_language$2 = language[0]) === null || _language$2 === void 0 ? void 0 : _language$2.lang_php_array;
  var errorArray = lang_php_array === null || lang_php_array === void 0 ? void 0 : lang_php_array.error;
  var pdfArray = lang_php_array === null || lang_php_array === void 0 ? void 0 : lang_php_array.pdf;
  var successArray = lang_php_array === null || lang_php_array === void 0 ? void 0 : lang_php_array.success;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    setLangJsonObj(lang_json_array);
    setLangPhpObj(lang_php_array);
    setErrorObj(errorArray);
    setSuccessObj(successArray);
    setPdfObj(pdfArray);
  }, [lang_json_array, lang_php_array, errorArray, successArray, pdfArray]);
  var languageFileTypeOption = _constants__WEBPACK_IMPORTED_MODULE_7__.languageFileOptions.map(function (option) {
    return {
      value: option.id,
      label: option.name
    };
  });
  var onFileTypeChange = function onFileTypeChange(obj) {
    setFileType({
      type: obj.value
    });
  };
  function str_replace(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).replaceAll('.', ' ').replaceAll('-', ' ').replaceAll('_', ' ');
  }
  var onChangeInput = function onChangeInput(e) {
    e.preventDefault();
    var _e$target = e.target,
      name = _e$target.name,
      value = _e$target.value;
    if (fileType.type === 2) {
      setLangPhpObj(function (inputs) {
        return _objectSpread(_objectSpread({}, inputs), {}, _defineProperty({}, name, value));
      });
    } else if (fileType.type === 3) {
      setErrorObj(function (inputs) {
        return _objectSpread(_objectSpread({}, inputs), {}, _defineProperty({}, name, value));
      });
      setLangPhpObj(function (language) {
        return _objectSpread(_objectSpread({}, language), {}, {
          error: _objectSpread(_objectSpread({}, language.error), {}, _defineProperty({}, name, value))
        });
      });
    } else if (fileType.type === 4) {
      setSuccessObj(function (inputs) {
        return _objectSpread(_objectSpread({}, inputs), {}, _defineProperty({}, name, value));
      });
      setLangPhpObj(function (language) {
        return _objectSpread(_objectSpread({}, language), {}, {
          success: _objectSpread(_objectSpread({}, language.success), {}, _defineProperty({}, name, value))
        });
      });
    } else if (fileType.type === 5) {
      setPdfObj(function (inputs) {
        return _objectSpread(_objectSpread({}, inputs), {}, _defineProperty({}, name, value));
      });
      setLangPhpObj(function (language) {
        return _objectSpread(_objectSpread({}, language), {}, {
          pdf: _objectSpread(_objectSpread({}, language.pdf), {}, _defineProperty({}, name, value))
        });
      });
    } else {
      setLangJsonObj(function (inputs) {
        return _objectSpread(_objectSpread({}, inputs), {}, _defineProperty({}, name, value));
      });
    }
  };
  var FetchLung = function FetchLung() {
    var steps = [];
    if (fileType.type === 1 || fileType.type === 2) {
      for (var key in fileType.type === 2 ? langPhpObj : langJsonObj) {
        if (key === 'pdf' || key === 'success' || key === 'error') {
          steps.push('');
        } else {
          steps.push(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
            className: "col-md-4 mt-2",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("label", {
              className: "form-label",
              children: [str_replace(key), " : "]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("input", {
              type: "text",
              name: [key],
              value: fileType.type === 2 ? langPhpObj[key] : langJsonObj[key],
              placeholder: "Enter " + str_replace(key),
              className: "form-control",
              autoComplete: "off",
              onChange: function onChange(e) {
                return onChangeInput(e);
              }
            })]
          }, key));
        }
      }
    } else if (fileType.type === 3) {
      for (var _key in errorObj) {
        steps.push(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
          className: "col-md-4 mt-2",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("label", {
            className: "form-label",
            children: [str_replace(_key), " : "]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("input", {
            type: "text",
            name: [_key],
            value: errorObj[_key],
            placeholder: "Enter " + str_replace(_key),
            className: "form-control",
            autoComplete: "off",
            onChange: function onChange(e) {
              return onChangeInput(e);
            }
          })]
        }, _key));
      }
    } else if (fileType.type === 4) {
      for (var _key2 in successObj) {
        steps.push(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
          className: "col-md-4 mt-2",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("label", {
            className: "form-label",
            children: [str_replace(_key2), " : "]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("input", {
            type: "text",
            name: [_key2],
            value: successObj[_key2],
            placeholder: "Enter " + str_replace(_key2),
            className: "form-control",
            autoComplete: "off",
            onChange: function onChange(e) {
              return onChangeInput(e);
            }
          })]
        }, _key2));
      }
    } else if (fileType.type === 5) {
      for (var _key3 in pdfObj) {
        steps.push(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
          className: "col-md-4 mt-2",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("label", {
            className: "form-label",
            children: [str_replace(_key3), " : "]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("input", {
            type: "text",
            name: [_key3],
            value: pdfObj[_key3],
            placeholder: "Enter " + str_replace(_key3),
            className: "form-control",
            autoComplete: "off",
            onChange: function onChange(e) {
              return onChangeInput(e);
            }
          })]
        }, _key3));
      }
    }
    return steps;
  };
  var prepareFormData = function prepareFormData(prepareData, jsonArray) {
    var _language$3;
    var formValue = {
      lang_php_array: prepareData,
      lang_json_array: jsonArray,
      iso_code: (_language$3 = language[0]) === null || _language$3 === void 0 ? void 0 : _language$3.iso_code
    };
    return formValue;
  };
  var onSubmit = function onSubmit(event) {
    event.preventDefault();
    editLanguageData(id, prepareFormData(langPhpObj, langJsonObj));
    navigate("/app/languages");
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_5__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_header_HeaderTitle__WEBPACK_IMPORTED_MODULE_6__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)('translation.manager.title'),
      to: "/app/languages"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
      className: "card",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "card-body",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
          className: "row mb-3",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
            className: "col-md-4",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_8__["default"], {
              isRequired: true,
              data: languageFileTypeOption,
              onChange: onFileTypeChange,
              defaultValue: languageFileTypeOption[0]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
            className: "form-group col-sm-3 mb-7 d-flex justify-content-end offset-3 ms-auto",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("button", {
              onClick: function onClick(event) {
                return onSubmit(event);
              },
              className: "btn btn-primary",
              children: "Save"
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
          className: "row",
          children: FetchLung()
        })]
      })
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var language = state.language;
  return {
    language: language
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, {
  editLanguageData: _store_action_languageAction__WEBPACK_IMPORTED_MODULE_3__.editLanguageData,
  fetchLanguageData: _store_action_languageAction__WEBPACK_IMPORTED_MODULE_3__.fetchLanguageData
})(EditLanguageData));

/***/ },

/***/ "./resources/pos/src/components/languages/Language.js"
/*!************************************************************!*\
  !*** ./resources/pos/src/components/languages/Language.js ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _store_action_languageAction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../store/action/languageAction */ "./resources/pos/src/store/action/languageAction.js");
/* harmony import */ var _shared_table_ReactDataTable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../shared/table/ReactDataTable */ "./resources/pos/src/shared/table/ReactDataTable.js");
/* harmony import */ var _DeleteLanguage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./DeleteLanguage */ "./resources/pos/src/components/languages/DeleteLanguage.js");
/* harmony import */ var _EditLanguage__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./EditLanguage */ "./resources/pos/src/components/languages/EditLanguage.js");
/* harmony import */ var _shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shared/tab-title/TabTitle */ "./resources/pos/src/shared/tab-title/TabTitle.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _shared_action_buttons_ActionButton__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../shared/action-buttons/ActionButton */ "./resources/pos/src/shared/action-buttons/ActionButton.js");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var _CreateLanguage__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./CreateLanguage */ "./resources/pos/src/components/languages/CreateLanguage.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }














var Languages = function Languages(props) {
  var fetchLanguages = props.fetchLanguages,
    languages = props.languages,
    totalRecord = props.totalRecord,
    isLoading = props.isLoading;
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
    editModel = _useState6[0],
    setEditModel = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(),
    _useState8 = _slicedToArray(_useState7, 2),
    language = _useState8[0],
    setLanguage = _useState8[1];
  var handleClose = function handleClose(item) {
    setEditModel(!editModel);
    setLanguage(item);
  };
  var onClickDeleteModel = function onClickDeleteModel() {
    var isDelete = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    setDeleteModel(!deleteModel);
    setIsDelete(isDelete);
  };
  var onChange = function onChange(filter) {
    fetchLanguages(filter, false);
  };
  var itemsValue = languages.length >= 0 && languages.map(function (language) {
    var _language$attributes, _language$attributes2;
    return {
      name: (_language$attributes = language.attributes) === null || _language$attributes === void 0 ? void 0 : _language$attributes.name,
      iso_code: (_language$attributes2 = language.attributes) === null || _language$attributes2 === void 0 ? void 0 : _language$attributes2.iso_code,
      id: language === null || language === void 0 ? void 0 : language.id
    };
  });
  var columns = [{
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.getFormattedMessage)('globally.input.name.label'),
    selector: function selector(row) {
      return row.name;
    }
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.getFormattedMessage)('react-data-table.iso-date.column.label'),
    selector: function selector(row) {
      return row.iso_code;
    }
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.getFormattedMessage)("react-data-table.translation.column.label"),
    cell: function cell(row) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_2__.Link, {
        to: "/app/languages/".concat(row.id),
        className: "text-decoration-none",
        children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.getFormattedMessage)('edit-translation.title')
      });
    }
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.getFormattedMessage)('react-data-table.action.column.label'),
    right: true,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    cell: function cell(row) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_shared_action_buttons_ActionButton__WEBPACK_IMPORTED_MODULE_10__["default"], {
        item: row,
        goToEditProduct: handleClose,
        isEditMode: true,
        onClickDeleteModel: onClickDeleteModel
      });
    }
  }];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_3__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_11__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_8__["default"], {
      title: "Languages"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_shared_table_ReactDataTable__WEBPACK_IMPORTED_MODULE_5__["default"], {
      columns: columns,
      items: itemsValue,
      onChange: onChange,
      isLoading: isLoading,
      AddButton: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_CreateLanguage__WEBPACK_IMPORTED_MODULE_12__["default"], {}),
      title: "Languages",
      totalRows: totalRecord
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_EditLanguage__WEBPACK_IMPORTED_MODULE_7__["default"], {
      handleClose: handleClose,
      show: editModel,
      language: language
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_DeleteLanguage__WEBPACK_IMPORTED_MODULE_6__["default"], {
      onClickDeleteModel: onClickDeleteModel,
      deleteModel: deleteModel,
      onDelete: isDelete
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var languages = state.languages,
    totalRecord = state.totalRecord,
    isLoading = state.isLoading,
    allConfigData = state.allConfigData;
  return {
    languages: languages,
    totalRecord: totalRecord,
    isLoading: isLoading,
    allConfigData: allConfigData
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, {
  fetchLanguages: _store_action_languageAction__WEBPACK_IMPORTED_MODULE_4__.fetchLanguages
})(Languages));

/***/ },

/***/ "./resources/pos/src/components/languages/LanguageForm.js"
/*!****************************************************************!*\
  !*** ./resources/pos/src/components/languages/LanguageForm.js ***!
  \****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Form.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Modal.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _store_action_languageAction__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../store/action/languageAction */ "./resources/pos/src/store/action/languageAction.js");
/* harmony import */ var _shared_components_modelFooter__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../shared/components/modelFooter */ "./resources/pos/src/shared/components/modelFooter.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
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







var LanguageForm = function LanguageForm(props) {
  var handleClose = props.handleClose,
    show = props.show,
    title = props.title,
    singleLanguage = props.singleLanguage,
    addLanguageData = props.addLanguageData,
    editLanguage = props.editLanguage;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      name: singleLanguage ? singleLanguage.name : '',
      iso_code: singleLanguage ? singleLanguage.iso_code : ''
    }),
    _useState2 = _slicedToArray(_useState, 2),
    languageValue = _useState2[0],
    setLanguageValue = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      name: '',
      iso_code: ''
    }),
    _useState4 = _slicedToArray(_useState3, 2),
    errors = _useState4[0],
    setErrors = _useState4[1];
  var disabled = singleLanguage && singleLanguage.name === languageValue.name.trim() && singleLanguage.iso_code === languageValue.iso_code;
  var handleValidation = function handleValidation() {
    var errorss = {};
    var isValid = false;
    if (!languageValue['name'].trim() && languageValue['name'].length > 20) {
      errorss['name'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.getFormattedMessage)("globally.input.name.validate.label");
    } else if (!languageValue['iso_code']) {
      errorss['iso_code'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.getFormattedMessage)("globally.input.iso-code.validate.label");
    } else if (languageValue['iso_code'] && languageValue['iso_code'].length !== 2) {
      errorss['iso_code'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.getFormattedMessage)('globally.input.iso-code.character.validate.label');
    } else {
      isValid = true;
    }
    setErrors(errorss);
    return isValid;
  };
  var onChangeInput = function onChangeInput(e) {
    e.preventDefault();
    setLanguageValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, _defineProperty({}, e.target.name, e.target.value));
    });
    setErrors('');
  };
  var prepareFormData = function prepareFormData(data) {
    var params = new URLSearchParams();
    params.append('name', data.name);
    params.append('iso_code', data.iso_code);
    return params;
  };
  var onSubmit = function onSubmit(event) {
    event.preventDefault();
    var valid = handleValidation();
    if (singleLanguage && valid) {
      if (!disabled) {
        editLanguage(singleLanguage.id, prepareFormData(languageValue), handleClose);
        clearField(false);
      }
    } else {
      if (valid) {
        setLanguageValue(languageValue);
        addLanguageData(prepareFormData(languageValue));
        clearField(false);
      }
    }
  };
  var clearField = function clearField() {
    setLanguageValue({
      name: '',
      iso_code: ''
    });
    setErrors('');
    handleClose(false);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"], {
    show: show,
    onHide: clearField,
    keyboard: true,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__["default"], {
      onKeyPress: function onKeyPress(e) {
        if (e.key === 'Enter') {
          onSubmit(e);
        }
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"].Header, {
        closeButton: true,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"].Title, {
          children: title
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"].Body, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
          className: "row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
            className: "col-md-12 mb-3",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("label", {
              className: "form-label",
              children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.getFormattedMessage)("globally.input.name.label"), ": "]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
              className: "required"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("input", {
              type: "text",
              name: "name",
              value: languageValue.name,
              maxLength: 20,
              placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.placeholderText)("globally.input.name.placeholder.label"),
              className: "form-control",
              autoComplete: "off",
              onChange: function onChange(e) {
                return onChangeInput(e);
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
              className: "text-danger d-block fw-400 fs-small mt-2",
              children: errors['name'] ? errors['name'] : null
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
            className: "col-md-12 mb-3",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("label", {
              className: "form-label",
              children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.getFormattedMessage)('react-data-table.iso-date.column.label'), ":"]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
              className: "required"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("input", {
              type: "text",
              name: "iso_code",
              maxLength: 2,
              value: languageValue.iso_code,
              placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.placeholderText)('react-data-table.iso-date.column.label'),
              className: "form-control",
              autoFocus: true,
              onChange: function onChange(e) {
                return onChangeInput(e);
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
              className: "text-danger d-block fw-400 fs-small mt-2",
              children: errors['iso_code'] ? errors['iso_code'] : null
            })]
          })]
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_shared_components_modelFooter__WEBPACK_IMPORTED_MODULE_6__["default"], {
      onEditRecord: singleLanguage,
      onSubmit: onSubmit,
      editDisabled: disabled,
      clearField: clearField,
      addDisabled: !languageValue.name.trim()
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(null, {
  fetchLanguage: _store_action_languageAction__WEBPACK_IMPORTED_MODULE_5__.fetchLanguage,
  fetchLanguages: _store_action_languageAction__WEBPACK_IMPORTED_MODULE_5__.fetchLanguages,
  editLanguage: _store_action_languageAction__WEBPACK_IMPORTED_MODULE_5__.editLanguage
})(LanguageForm));

/***/ }

}]);