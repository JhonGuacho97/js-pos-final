"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["user"],{

/***/ "./resources/pos/src/components/user-profile/UpdateProfile.js"
/*!********************************************************************!*\
  !*** ./resources/pos/src/components/user-profile/UpdateProfile.js ***!
  \********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap/Form */ "./node_modules/react-bootstrap/esm/Form.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var email_validator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! email-validator */ "./node_modules/email-validator/index.js");
/* harmony import */ var _shared_image_picker_ImagePicker__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../shared/image-picker/ImagePicker */ "./resources/pos/src/shared/image-picker/ImagePicker.js");
/* harmony import */ var _store_action_updateProfileAction__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../store/action/updateProfileAction */ "./resources/pos/src/store/action/updateProfileAction.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/tab-title/TabTitle */ "./resources/pos/src/shared/tab-title/TabTitle.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _assets_images_avatar_png__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../assets/images/avatar.png */ "./resources/pos/src/assets/images/avatar.png");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var _user_profile_styles_UpdateProfileStyles_css__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../user-profile/styles/UpdateProfileStyles.css */ "./resources/pos/src/components/user-profile/styles/UpdateProfileStyles.css");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
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














var UpdateProfile = function UpdateProfile() {
  var _useSelector = (0,react_redux__WEBPACK_IMPORTED_MODULE_2__.useSelector)(function (state) {
      return state;
    }),
    userProfile = _useSelector.userProfile;
  var Dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_2__.useDispatch)();
  var navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_4__.useNavigate)();
  var imageTitle = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.placeholderText)('update-profile.input.change-image.label');
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      image: ''
    }),
    _useState2 = _slicedToArray(_useState, 2),
    profileValue = _useState2[0],
    setProfileValue = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      first_name: '',
      last_name: '',
      email: '',
      phone: ''
    }),
    _useState4 = _slicedToArray(_useState3, 2),
    errors = _useState4[0],
    setErrors = _useState4[1];
  var avtarName = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getAvatarName)(userProfile && userProfile.attributes && userProfile.attributes.image === '' && userProfile.attributes.last_name && userProfile.attributes.first_name + ' ' + userProfile.attributes.last_name);
  var newImg = userProfile && userProfile.attributes && userProfile.attributes.image === null && avtarName;
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(newImg && newImg),
    _useState6 = _slicedToArray(_useState5, 2),
    imagePreviewUrl = _useState6[0],
    setImagePreviewUrl = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState8 = _slicedToArray(_useState7, 2),
    selectImg = _useState8[0],
    setSelectImg = _useState8[1];
  var disabled = selectImg ? false : userProfile.attributes && userProfile.attributes.first_name === profileValue.first_name && userProfile.attributes.last_name === profileValue.last_name && userProfile.attributes.email === profileValue.email && userProfile.attributes.phone === profileValue.phone && userProfile.attributes.image === profileValue.image;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (userProfile) {
      var _userProfile$attribut, _userProfile$attribut2, _userProfile$attribut3, _userProfile$attribut4, _userProfile$attribut5, _userProfile$attribut6;
      setProfileValue({
        first_name: (userProfile === null || userProfile === void 0 || (_userProfile$attribut = userProfile.attributes) === null || _userProfile$attribut === void 0 ? void 0 : _userProfile$attribut.first_name) || '',
        last_name: (userProfile === null || userProfile === void 0 || (_userProfile$attribut2 = userProfile.attributes) === null || _userProfile$attribut2 === void 0 ? void 0 : _userProfile$attribut2.last_name) || '',
        email: (userProfile === null || userProfile === void 0 || (_userProfile$attribut3 = userProfile.attributes) === null || _userProfile$attribut3 === void 0 ? void 0 : _userProfile$attribut3.email) || '',
        phone: (userProfile === null || userProfile === void 0 || (_userProfile$attribut4 = userProfile.attributes) === null || _userProfile$attribut4 === void 0 ? void 0 : _userProfile$attribut4.phone) || '',
        image: (userProfile === null || userProfile === void 0 || (_userProfile$attribut5 = userProfile.attributes) === null || _userProfile$attribut5 === void 0 ? void 0 : _userProfile$attribut5.image) || ''
      });
      setImagePreviewUrl((userProfile === null || userProfile === void 0 || (_userProfile$attribut6 = userProfile.attributes) === null || _userProfile$attribut6 === void 0 ? void 0 : _userProfile$attribut6.image) || _assets_images_avatar_png__WEBPACK_IMPORTED_MODULE_11__["default"]);
    }
  }, [userProfile]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    Dispatch((0,_store_action_updateProfileAction__WEBPACK_IMPORTED_MODULE_7__.fetchProfile)());
  }, []);
  var handleValidation = function handleValidation() {
    var errorss = {};
    var isValid = false;
    if (!profileValue['first_name']) {
      errorss['first_name'] = 'Please enter first name';
    } else if (!profileValue['last_name']) {
      errorss['last_name'] = 'Please enter last name';
    } else if (!email_validator__WEBPACK_IMPORTED_MODULE_5__.validate(profileValue['email'])) {
      errorss['email'] = !profileValue['email'] ? 'Enter email address' : 'Please enter valid email address';
    } else if (!profileValue['phone']) {
      errorss['phone'] = 'Please enter phone number';
    } else {
      isValid = true;
    }
    setErrors(errorss);
    return isValid;
  };
  var onChangeInput = function onChangeInput(e) {
    e.preventDefault();
    setProfileValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, _defineProperty({}, e.target.name, e.target.value));
    });
    setErrors('');
  };
  var handleImageChanges = function handleImageChanges(e) {
    e.preventDefault();
    if (e.target.files.length > 0) {
      var file = e.target.files[0];
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        setSelectImg(file);
        var fileReader = new FileReader();
        fileReader.onloadend = function () {
          return setImagePreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
        setErrors('');
      }
    }
  };
  var prepareFormData = function prepareFormData(data) {
    var formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    if (selectImg) formData.append('image', data.image);
    return formData;
  };
  var onEdit = function onEdit(event) {
    event.preventDefault();
    var Valid = handleValidation();
    if (!disabled && Valid) {
      profileValue.image = selectImg;
      setProfileValue(profileValue);
      Dispatch((0,_store_action_updateProfileAction__WEBPACK_IMPORTED_MODULE_7__.updateProfile)(prepareFormData(profileValue), navigate));
    }
  };
  var fullName = "".concat(profileValue.first_name || '', " ").concat(profileValue.last_name || '').trim() || 'Tu Perfil';
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_8__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_12__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_9__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.placeholderText)('update-profile.title')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("div", {
      className: "update-profile-container",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("div", {
        className: "card",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)("div", {
          className: "card-body",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)("div", {
            className: "profile-header",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)("div", {
              className: "profile-avatar-wrap",
              children: [imagePreviewUrl && typeof imagePreviewUrl === 'string' && imagePreviewUrl.startsWith('data:') || imagePreviewUrl && imagePreviewUrl !== avtarName ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("img", {
                src: imagePreviewUrl || _assets_images_avatar_png__WEBPACK_IMPORTED_MODULE_11__["default"],
                alt: "avatar",
                style: {
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #fff',
                  boxShadow: '0 4px 16px rgba(47, 111, 237,0.2)'
                }
              }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("div", {
                style: {
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1D4ED8, #2F6FED)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 28,
                  fontWeight: 700,
                  border: '3px solid #fff',
                  boxShadow: '0 4px 16px rgba(47, 111, 237,0.2)',
                  fontFamily: 'Poppins, sans-serif'
                },
                children: (avtarName === null || avtarName === void 0 ? void 0 : avtarName[0]) || '?'
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("label", {
                htmlFor: "profile-image-input",
                style: {
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 26,
                  height: 26,
                  background: 'linear-gradient(135deg, #1D4ED8, #2F6FED)',
                  borderRadius: '50%',
                  border: '2px solid #fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'opacity 0.18s'
                },
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)("svg", {
                  viewBox: "0 0 24 24",
                  width: "12",
                  height: "12",
                  stroke: "#fff",
                  strokeWidth: "2",
                  fill: "none",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("path", {
                    d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("circle", {
                    cx: "12",
                    cy: "13",
                    r: "4"
                  })]
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("input", {
                id: "profile-image-input",
                type: "file",
                accept: "image/jpeg,image/png",
                style: {
                  display: 'none'
                },
                onChange: handleImageChanges
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)("div", {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("h2", {
                style: {
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#1f2937',
                  margin: '0 0 4px',
                  fontFamily: 'Poppins, sans-serif'
                },
                children: fullName
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("p", {
                style: {
                  fontSize: 13,
                  color: '#64748B',
                  margin: 0,
                  fontWeight: 500,
                  fontFamily: 'Poppins, sans-serif'
                },
                children: profileValue.email || 'Actualiza tu información'
              })]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)(react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_1__["default"], {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("p", {
              className: "profile-section-title",
              children: "Informaci\xF3n personal"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)("div", {
              className: "row",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)("div", {
                className: "col-md-6 mb-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)("label", {
                  className: "form-label",
                  children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)("user.input.first-name.label"), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("span", {
                    className: "required"
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("input", {
                  type: "text",
                  name: "first_name",
                  value: profileValue.first_name || '',
                  placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.placeholderText)("user.input.first-name.placeholder.label"),
                  className: "form-control",
                  autoFocus: true,
                  onChange: onChangeInput
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("span", {
                  className: "text-danger d-block fw-400 fs-small mt-2",
                  children: errors['first_name'] || null
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)("div", {
                className: "col-md-6 mb-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)("label", {
                  className: "form-label",
                  children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)("user.input.last-name.label"), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("span", {
                    className: "required"
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("input", {
                  type: "text",
                  name: "last_name",
                  value: profileValue.last_name || '',
                  placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.placeholderText)("user.input.last-name.placeholder.label"),
                  className: "form-control",
                  onChange: onChangeInput
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("span", {
                  className: "text-danger d-block fw-400 fs-small mt-2",
                  children: errors['last_name'] || null
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)("div", {
                className: "col-md-6 mb-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)("label", {
                  className: "form-label",
                  children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)('user.input.email.label'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("span", {
                    className: "required"
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("input", {
                  type: "text",
                  name: "email",
                  value: profileValue.email || '',
                  placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.placeholderText)('user.input.email.placeholder.label'),
                  className: "form-control",
                  onChange: onChangeInput
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("span", {
                  className: "text-danger d-block fw-400 fs-small mt-2",
                  children: errors['email'] || null
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)("div", {
                className: "col-md-6 mb-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)("label", {
                  className: "form-label",
                  children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)('user.input.phone-number.label'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("span", {
                    className: "required"
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("input", {
                  type: "number",
                  name: "phone",
                  value: profileValue.phone || '',
                  placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.placeholderText)('user.input.phone-number.placeholder.label'),
                  className: "form-control",
                  pattern: "[0-9]*",
                  min: 0,
                  onKeyPress: _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.numValidate,
                  onChange: onChangeInput
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("span", {
                  className: "text-danger d-block fs-small mt-2 fw-400",
                  children: errors['phone'] || null
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("div", {
                className: "col-12",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)("div", {
                  style: {
                    borderTop: '1px solid #f0ebff',
                    paddingTop: 24,
                    marginTop: 8,
                    display: 'flex',
                    gap: 12
                  },
                  children: [userProfile && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("div", {
                    onClick: onEdit,
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("input", {
                      className: "btn btn-primary",
                      type: "submit",
                      value: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.placeholderText)('globally.save-btn'),
                      disabled: disabled
                    })
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_3__.Link, {
                    to: "/dashboard",
                    className: "btn btn-secondary",
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)('globally.cancel-btn')
                  })]
                })
              })]
            })]
          })]
        })
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UpdateProfile);

/***/ },

/***/ "./resources/pos/src/components/users/CreateUser.js"
/*!**********************************************************!*\
  !*** ./resources/pos/src/components/users/CreateUser.js ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _UserForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./UserForm */ "./resources/pos/src/components/users/UserForm.js");
/* harmony import */ var _store_action_userAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../store/action/userAction */ "./resources/pos/src/store/action/userAction.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _header_HeaderTitle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../header/HeaderTitle */ "./resources/pos/src/components/header/HeaderTitle.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");










var CreateUser = function CreateUser(props) {
  var addUser = props.addUser;
  var navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_7__.useNavigate)();
  var addUserData = function addUserData(formValue) {
    addUser(formValue, navigate, _constants__WEBPACK_IMPORTED_MODULE_6__.Filters.OBJ);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_4__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_header_HeaderTitle__WEBPACK_IMPORTED_MODULE_5__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_8__.getFormattedMessage)('user.create.title'),
      to: "/app/users"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_UserForm__WEBPACK_IMPORTED_MODULE_2__["default"], {
      addUserData: addUserData
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(null, {
  addUser: _store_action_userAction__WEBPACK_IMPORTED_MODULE_3__.addUser
})(CreateUser));

/***/ },

/***/ "./resources/pos/src/components/users/DeleteUser.js"
/*!**********************************************************!*\
  !*** ./resources/pos/src/components/users/DeleteUser.js ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _store_action_userAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../store/action/userAction */ "./resources/pos/src/store/action/userAction.js");
/* harmony import */ var _shared_action_buttons_DeleteModel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/action-buttons/DeleteModel */ "./resources/pos/src/shared/action-buttons/DeleteModel.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");






var DeleteUser = function DeleteUser(props) {
  var deleteUser = props.deleteUser,
    onDelete = props.onDelete,
    deleteModel = props.deleteModel,
    onClickDeleteModel = props.onClickDeleteModel;
  var deleteUserClick = function deleteUserClick() {
    deleteUser(onDelete.id);
    onClickDeleteModel(false);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
    children: deleteModel && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_shared_action_buttons_DeleteModel__WEBPACK_IMPORTED_MODULE_3__["default"], {
      onClickDeleteModel: onClickDeleteModel,
      deleteModel: deleteModel,
      deleteUserClick: deleteUserClick,
      name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_4__.getFormattedMessage)('users.table.user.column.title')
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(null, {
  deleteUser: _store_action_userAction__WEBPACK_IMPORTED_MODULE_2__.deleteUser
})(DeleteUser));

/***/ },

/***/ "./resources/pos/src/components/users/EditUser.js"
/*!********************************************************!*\
  !*** ./resources/pos/src/components/users/EditUser.js ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _UserForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./UserForm */ "./resources/pos/src/components/users/UserForm.js");
/* harmony import */ var _store_action_userAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../store/action/userAction */ "./resources/pos/src/store/action/userAction.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _header_HeaderTitle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../header/HeaderTitle */ "./resources/pos/src/components/header/HeaderTitle.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }










var EditUser = function EditUser(props) {
  var fetchUser = props.fetchUser,
    users = props.users;
  var _useParams = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_4__.useParams)(),
    id = _useParams.id;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    isEdit = _useState2[0],
    setIsEdit = _useState2[1];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchUser(id);
    setIsEdit(true);
  }, []);
  var itemsValue = users && users.length === 1 && users.map(function (user) {
    return {
      image: user.attributes.image,
      first_name: user.attributes.first_name,
      last_name: user.attributes.last_name,
      email: user.attributes.email,
      phone: user.attributes.phone,
      role_id: {
        value: user.attributes.role.map(function (ro) {
          return ro.id;
        }),
        label: user.attributes.role.map(function (ro) {
          return ro.name;
        })
      },
      default_warehouse_id: user.attributes.default_warehouse_id,
      default_warehouse_name: user.attributes.default_warehouse_name,
      store_ids: user.attributes.store_ids,
      id: user.id
    };
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_5__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_8__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_header_HeaderTitle__WEBPACK_IMPORTED_MODULE_6__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)('user.edit.title'),
      to: "/app/users"
    }), users.length === 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_UserForm__WEBPACK_IMPORTED_MODULE_2__["default"], {
      singleUser: itemsValue,
      id: id,
      isEdit: isEdit
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var users = state.users;
  return {
    users: users
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, {
  fetchUser: _store_action_userAction__WEBPACK_IMPORTED_MODULE_3__.fetchUser
})(EditUser));

/***/ },

/***/ "./resources/pos/src/components/users/User.js"
/*!****************************************************!*\
  !*** ./resources/pos/src/components/users/User.js ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
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
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _shared_table_ReactDataTable__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/table/ReactDataTable */ "./resources/pos/src/shared/table/ReactDataTable.js");
/* harmony import */ var _store_action_userAction__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../store/action/userAction */ "./resources/pos/src/store/action/userAction.js");
/* harmony import */ var _DeleteUser__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./DeleteUser */ "./resources/pos/src/components/users/DeleteUser.js");
/* harmony import */ var _shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../shared/tab-title/TabTitle */ "./resources/pos/src/shared/tab-title/TabTitle.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _shared_action_buttons_ActionButton__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../shared/action-buttons/ActionButton */ "./resources/pos/src/shared/action-buttons/ActionButton.js");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Button.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Form.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/InputGroup.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Modal.js");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "./node_modules/@fortawesome/react-fontawesome/index.es.js");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.mjs");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_22___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_22__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
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















var User = function User(props) {
  var users = props.users,
    fetchUsers = props.fetchUsers,
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
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    passwordModal = _useState6[0],
    setPasswordModal = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState8 = _slicedToArray(_useState7, 2),
    selectedUser = _useState8[0],
    setSelectedUser = _useState8[1];
  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState0 = _slicedToArray(_useState9, 2),
    password = _useState0[0],
    setPassword = _useState0[1];
  var _useState1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState10 = _slicedToArray(_useState1, 2),
    passwordConfirmation = _useState10[0],
    setPasswordConfirmation = _useState10[1];
  var _useState11 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState12 = _slicedToArray(_useState11, 2),
    showPassword = _useState12[0],
    setShowPassword = _useState12[1];
  var _useState13 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState14 = _slicedToArray(_useState13, 2),
    showConfirmPassword = _useState14[0],
    setShowConfirmPassword = _useState14[1];
  var onClickDeleteModel = function onClickDeleteModel() {
    var isDelete = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    setDeleteModel(!deleteModel);
    setIsDelete(isDelete);
  };
  var itemsValue = users.length >= 0 && users.map(function (user) {
    return {
      date: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getFormattedDate)(user.attributes.created_at, allConfigData && allConfigData),
      time: dayjs__WEBPACK_IMPORTED_MODULE_3___default()(user.attributes.created_at).format('LT'),
      image: user.attributes.image,
      first_name: user.attributes.first_name,
      last_name: user.attributes.last_name,
      email: user.attributes.email,
      phone: user.attributes.phone,
      password: user.attributes.password,
      confirm_password: user.attributes.confirm_password,
      // role_id: user.attributes.role.map(ro => ro.name),
      role_name: user.attributes.role.map(function (role) {
        return role.name;
      }),
      id: user.id
    };
  });
  var onChange = function onChange(filter) {
    fetchUsers(filter, true);
  };
  var goToEdit = function goToEdit(item) {
    var id = item.id;
    window.location.href = '#/app/users/edit/' + id;
  };
  var openPasswordModal = function openPasswordModal(user) {
    setSelectedUser(user);
    setPassword('');
    setPasswordConfirmation('');
    setPasswordModal(true);
  };
  var savePassword = function savePassword() {
    if (!password) {
      return;
    }
    if (password !== passwordConfirmation) {
      return;
    }
    props.changeUserPassword(selectedUser.id, password, passwordConfirmation, function () {
      setPasswordModal(false);
      setPassword("");
      setPasswordConfirmation("");
      setSelectedUser(null);
    });
  };
  var columns = [{
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getFormattedMessage)('users.table.user.column.title'),
    selector: function selector(row) {
      return row.first_name;
    },
    sortField: 'first_name',
    sortable: true,
    cell: function cell(row) {
      var imageUrl = row.image ? row.image : null;
      var lastName = row.last_name ? row.last_name : '';
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
        className: "d-flex align-items-center",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("div", {
          className: "me-2",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_2__.Link, {
            to: "/app/users/detail/".concat(row.id),
            children: imageUrl ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("img", {
              src: imageUrl,
              height: "50",
              width: "50",
              alt: "User Image",
              className: "image image-circle image-mini"
            }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("span", {
              className: "custom-user-avatar fs-5",
              children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getAvatarName)(row.first_name + ' ' + row.last_name)
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
          className: "d-flex flex-column",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_2__.Link, {
            to: "/app/users/detail/".concat(row.id),
            className: "text-decoration-none",
            children: row.first_name + ' ' + lastName
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("span", {
            children: row.email
          })]
        })]
      });
    }
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getFormattedMessage)("user.input.role.label"),
    selector: function selector(row) {
      return row.role_name;
    },
    sortField: 'role_name',
    sortable: false
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getFormattedMessage)('users.table.phone-number.column.title'),
    selector: function selector(row) {
      return row.phone;
    },
    sortField: 'phone',
    sortable: true
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getFormattedMessage)('globally.react-table.column.created-date.label'),
    selector: function selector(row) {
      return row.date;
    },
    sortField: 'created_at',
    sortable: true,
    cell: function cell(row) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("span", {
        className: "badge bg-light-info",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("div", {
          className: "mb-1",
          children: row.time
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("div", {
          children: row.date
        })]
      });
    }
  }, {
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getFormattedMessage)('react-data-table.action.column.label'),
    right: true,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    cell: function cell(row) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(_shared_action_buttons_ActionButton__WEBPACK_IMPORTED_MODULE_14__["default"], {
        item: row,
        goToEditProduct: goToEdit,
        onClickDeleteModel: onClickDeleteModel,
        onClickPassword: openPasswordModal,
        isEditMode: true
      });
    }
  }];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_8__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_15__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(_shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_12__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.placeholderText)('users.title')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(_shared_table_ReactDataTable__WEBPACK_IMPORTED_MODULE_9__["default"], {
      columns: columns,
      items: itemsValue,
      onChange: onChange,
      ButtonValue: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getFormattedMessage)('user.create.title'),
      to: "#/app/users/create",
      totalRows: totalRecord,
      isLoading: isLoading
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(_DeleteUser__WEBPACK_IMPORTED_MODULE_11__["default"], {
      onClickDeleteModel: onClickDeleteModel,
      deleteModel: deleteModel,
      onDelete: isDelete
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_19__["default"], {
      show: passwordModal,
      onHide: function onHide() {
        return setPasswordModal(false);
      },
      centered: true,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_19__["default"].Header, {
        closeButton: true,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_19__["default"].Title, {
          children: "Cambiar contrase\xF1a"
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_19__["default"].Body, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_17__["default"].Group, {
          className: "mb-3",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_17__["default"].Label, {
            children: "Nueva contrase\xF1a"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_18__["default"], {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_17__["default"].Control, {
              type: showPassword ? "text" : "password",
              value: password,
              onChange: function onChange(e) {
                return setPassword(e.target.value);
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_16__["default"], {
              variant: "light",
              onClick: function onClick() {
                return setShowPassword(!showPassword);
              },
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_20__.FontAwesomeIcon, {
                icon: showPassword ? _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_21__.faEyeSlash : _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_21__.faEye
              })
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_17__["default"].Group, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_17__["default"].Label, {
            children: "Confirmar contrase\xF1a"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_18__["default"], {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_17__["default"].Control, {
              type: showConfirmPassword ? "text" : "password",
              value: passwordConfirmation,
              onChange: function onChange(e) {
                return setPasswordConfirmation(e.target.value);
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_16__["default"], {
              variant: "light",
              onClick: function onClick() {
                return setShowConfirmPassword(!showConfirmPassword);
              },
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_20__.FontAwesomeIcon, {
                icon: showConfirmPassword ? _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_21__.faEyeSlash : _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_21__.faEye
              })
            })]
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_19__["default"].Footer, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_16__["default"], {
          variant: "secondary",
          onClick: function onClick() {
            return setPasswordModal(false);
          },
          children: "Cancelar"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_16__["default"], {
          variant: "primary",
          onClick: savePassword,
          children: "Guardar"
        })]
      })]
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var users = state.users,
    totalRecord = state.totalRecord,
    isLoading = state.isLoading,
    allConfigData = state.allConfigData;
  return {
    users: users,
    totalRecord: totalRecord,
    isLoading: isLoading,
    allConfigData: allConfigData
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, {
  fetchUsers: _store_action_userAction__WEBPACK_IMPORTED_MODULE_10__.fetchUsers,
  changeUserPassword: _store_action_userAction__WEBPACK_IMPORTED_MODULE_10__.changeUserPassword
})(User));

/***/ },

/***/ "./resources/pos/src/components/users/UserDetail.js"
/*!**********************************************************!*\
  !*** ./resources/pos/src/components/users/UserDetail.js ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Card.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Table.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! dayjs */ "./node_modules/dayjs/dayjs.min.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(dayjs__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! dayjs/plugin/utc */ "./node_modules/dayjs/plugin/utc.js");
/* harmony import */ var dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! dayjs/plugin/localizedFormat */ "./node_modules/dayjs/plugin/localizedFormat.js");
/* harmony import */ var dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! dayjs/plugin/isoWeek */ "./node_modules/dayjs/plugin/isoWeek.js");
/* harmony import */ var dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! dayjs/plugin/relativeTime */ "./node_modules/dayjs/plugin/relativeTime.js");
/* harmony import */ var dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Image.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../shared/tab-title/TabTitle */ "./resources/pos/src/shared/tab-title/TabTitle.js");
/* harmony import */ var _header_HeaderTitle__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../header/HeaderTitle */ "./resources/pos/src/components/header/HeaderTitle.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var _store_action_userAction__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../store/action/userAction */ "./resources/pos/src/store/action/userAction.js");
/* harmony import */ var _shared_components_loaders_Spinner__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../shared/components/loaders/Spinner */ "./resources/pos/src/shared/components/loaders/Spinner.js");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }








dayjs__WEBPACK_IMPORTED_MODULE_4___default().extend((dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_5___default()));
dayjs__WEBPACK_IMPORTED_MODULE_4___default().extend((dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_6___default()));
dayjs__WEBPACK_IMPORTED_MODULE_4___default().extend((dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_7___default()));
dayjs__WEBPACK_IMPORTED_MODULE_4___default().extend((dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_8___default()));











var UserDetail = function UserDetail(props) {
  var users = props.users,
    isLoading = props.isLoading,
    fetchUser = props.fetchUser;
  var _useParams = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_14__.useParams)(),
    id = _useParams.id;
  var result = users.reduce(function (obj, cur) {
    return _objectSpread(_objectSpread({}, obj), {}, _defineProperty({}, cur.type, cur));
  }, {});
  var user = result.users;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchUser(id);
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_10__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_17__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_header_HeaderTitle__WEBPACK_IMPORTED_MODULE_12__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getFormattedMessage)('user-details.title'),
      to: "/app/users",
      editLink: "/app/users/edit/".concat(id)
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_11__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.placeholderText)('user-details.title')
    }), isLoading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_shared_components_loaders_Spinner__WEBPACK_IMPORTED_MODULE_16__["default"], {}) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("div", {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["default"], {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["default"].Body, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("div", {
              className: "row",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("div", {
                className: "col-xxl-5 col-12",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("div", {
                  className: "d-sm-flex align-items-center mb-5 mb-xxl-0 flex-row text-sm-start",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("div", {
                    className: "image image-circle image-lg-small w-100px",
                    children: user && user.attributes.image ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_9__["default"], {
                      src: user.attributes.image,
                      alt: "User Profile",
                      className: "object-fit-cover"
                    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("span", {
                      className: "user_avatar",
                      children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getAvatarName)(user && user.attributes.first_name + ' ' + user.attributes.last_name)
                    })
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("div", {
                    className: "ms-0 ms-md-10 mt-5 mt-sm-0",
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("span", {
                      className: "badge bg-light-success mb-2",
                      children: "Active"
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("h2", {
                      children: [" ", user && user.attributes.first_name + ' ' + user.attributes.last_name]
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("a", {
                      href: user && user.attributes.email,
                      className: "text-gray-600 text-decoration-none fs-4",
                      children: user && user.attributes.email
                    })]
                  })]
                })
              })
            })
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("div", {
        className: "pt-5",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["default"], {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["default"].Header, {
            as: "h5",
            children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getFormattedMessage)('user-details.table.title')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["default"].Body, {
            className: "pt-0",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["default"], {
              responsive: true,
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("tbody", {
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("tr", {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("td", {
                    className: "py-4",
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getFormattedMessage)('user.input.first-name.label')
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("td", {
                    className: "py-4",
                    children: user && user.attributes.first_name
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("tr", {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("td", {
                    className: "py-4",
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getFormattedMessage)('user.input.last-name.label')
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("td", {
                    className: "py-4",
                    children: user && user.attributes.last_name
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("tr", {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("td", {
                    className: "py-4",
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getFormattedMessage)('user.input.email.label')
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("td", {
                    className: "py-4",
                    children: user && user.attributes.email
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("tr", {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("td", {
                    className: "py-4",
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getFormattedMessage)('user.input.phone-number.label')
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("td", {
                    className: "py-4",
                    children: user && user.attributes.phone
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("tr", {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("td", {
                    className: "py-4",
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getFormattedMessage)('user-details.table.created-on.row.label')
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("td", {
                    className: "py-4",
                    children: dayjs__WEBPACK_IMPORTED_MODULE_4___default()(user && user.attributes.created_at).fromNow()
                  })]
                })]
              })
            })
          })]
        })
      })]
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var users = state.users,
    isLoading = state.isLoading;
  return {
    users: users,
    isLoading: isLoading
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, {
  fetchUser: _store_action_userAction__WEBPACK_IMPORTED_MODULE_15__.fetchUser
})(UserDetail));

/***/ },

/***/ "./resources/pos/src/components/users/UserForm.js"
/*!********************************************************!*\
  !*** ./resources/pos/src/components/users/UserForm.js ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap/Form */ "./node_modules/react-bootstrap/esm/Form.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var email_validator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! email-validator */ "./node_modules/email-validator/index.js");
/* harmony import */ var _store_action_userAction__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../store/action/userAction */ "./resources/pos/src/store/action/userAction.js");
/* harmony import */ var _shared_image_picker_ImagePicker__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../shared/image-picker/ImagePicker */ "./resources/pos/src/shared/image-picker/ImagePicker.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _assets_images_avatar_png__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../assets/images/avatar.png */ "./resources/pos/src/assets/images/avatar.png");
/* harmony import */ var _shared_components_modelFooter__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/components/modelFooter */ "./resources/pos/src/shared/components/modelFooter.js");
/* harmony import */ var _shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../shared/select/reactSelect */ "./resources/pos/src/shared/select/reactSelect.js");
/* harmony import */ var _store_action_roleAction__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../store/action/roleAction */ "./resources/pos/src/store/action/roleAction.js");
/* harmony import */ var _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../store/action/warehouseAction */ "./resources/pos/src/store/action/warehouseAction.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
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














var UserForm = function UserForm(props) {
  var addUserData = props.addUserData,
    id = props.id,
    singleUser = props.singleUser,
    isEdit = props.isEdit,
    isCreate = props.isCreate,
    fetchAllRoles = props.fetchAllRoles,
    roles = props.roles,
    warehouses = props.warehouses,
    fetchAllWarehouses = props.fetchAllWarehouses,
    myStores = props.myStores;
  var Dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_2__.useDispatch)();
  var navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_3__.useNavigate)();
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      first_name: singleUser ? singleUser[0].first_name : '',
      last_name: singleUser ? singleUser[0].last_name : '',
      email: singleUser ? singleUser[0].email : '',
      phone: singleUser ? singleUser[0].phone : '',
      password: '',
      confirm_password: '',
      role_id: singleUser ? singleUser[0].role_id : '',
      image: singleUser ? singleUser[0].image : '',
      default_warehouse_id: singleUser ? singleUser[0].default_warehouse_id : '',
      // Solo se pueden marcar tiendas a las que EL ADMIN que crea/edita
      // ya tiene acceso (ver UserRepository::resolveGrantableStoreIds())
      // -- por eso la lista de opciones sale de myStores, no de un
      // fetch aparte de "todas las tiendas".
      store_ids: singleUser && singleUser[0].store_ids ? singleUser[0].store_ids.map(function (id) {
        return +id;
      }) : []
    }),
    _useState2 = _slicedToArray(_useState, 2),
    userValue = _useState2[0],
    setUserValue = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
      confirm_password: '',
      role_id: ''
    }),
    _useState4 = _slicedToArray(_useState3, 2),
    errors = _useState4[0],
    setErrors = _useState4[1];
  var avatarName = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getAvatarName)(singleUser && singleUser[0].image === '' && singleUser[0].first_name && singleUser[0].last_name && singleUser[0].first_name + ' ' + singleUser[0].last_name);
  var newImg = singleUser && singleUser[0].image && singleUser[0].image === null && avatarName;
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(newImg && newImg),
    _useState6 = _slicedToArray(_useState5, 2),
    imagePreviewUrl = _useState6[0],
    setImagePreviewUrl = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState8 = _slicedToArray(_useState7, 2),
    selectImg = _useState8[0],
    setSelectImg = _useState8[1];
  var disabled = selectImg ? false : singleUser && singleUser[0].first_name === userValue.first_name && singleUser[0].last_name === userValue.last_name && singleUser[0].email === userValue.email && singleUser[0].phone === userValue.phone && singleUser[0].image === userValue.image && singleUser[0].role_id.label[0] === userValue.role_id.label[0] && (singleUser[0].default_warehouse_id || '') === (userValue.default_warehouse_id || '');
  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(singleUser && singleUser[0] ? [{
      label: singleUser[0].role_id.label[0],
      value: singleUser[0].role_id.value[0]
    }] : null),
    _useState0 = _slicedToArray(_useState9, 1),
    selectedRole = _useState0[0];
  var _useState1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(singleUser && singleUser[0] && singleUser[0].default_warehouse_id ? [{
      label: singleUser[0].default_warehouse_name,
      value: singleUser[0].default_warehouse_id
    }] : null),
    _useState10 = _slicedToArray(_useState1, 1),
    selectedWarehouse = _useState10[0];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchAllRoles();
    fetchAllWarehouses();
    setImagePreviewUrl(singleUser ? singleUser[0].image && singleUser[0].image : _assets_images_avatar_png__WEBPACK_IMPORTED_MODULE_8__["default"]);
  }, []);
  var onRolesChange = function onRolesChange(obj) {
    setUserValue(function (productValue) {
      return _objectSpread(_objectSpread({}, productValue), {}, {
        role_id: obj
      });
    });
    setErrors('');
  };
  var onWarehouseChange = function onWarehouseChange(obj) {
    setUserValue(function (productValue) {
      return _objectSpread(_objectSpread({}, productValue), {}, {
        default_warehouse_id: obj ? obj.value : ''
      });
    });
  };
  var availableStores = (myStores === null || myStores === void 0 ? void 0 : myStores.stores) || [];
  var onStoreToggle = function onStoreToggle(storeId) {
    setUserValue(function (prev) {
      var alreadyChecked = prev.store_ids.includes(storeId);
      return _objectSpread(_objectSpread({}, prev), {}, {
        store_ids: alreadyChecked ? prev.store_ids.filter(function (id) {
          return id !== storeId;
        }) : [].concat(_toConsumableArray(prev.store_ids), [storeId])
      });
    });
  };
  var onSelectAllStores = function onSelectAllStores(e) {
    setUserValue(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, {
        store_ids: e.target.checked ? availableStores.map(function (store) {
          return store.id;
        }) : []
      });
    });
  };
  var handleValidation = function handleValidation() {
    var errorss = {};
    var isValid = false;
    if (!userValue['first_name']) {
      errorss['first_name'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)("user.input.first-name.validate.label");
    } else if (!userValue['last_name']) {
      errorss['last_name'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)("user.input.last-name.validate.label");
    } else if (!email_validator__WEBPACK_IMPORTED_MODULE_4__.validate(userValue['email'])) {
      if (!userValue['email']) {
        errorss['email'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)("user.input.email.validate.label");
      } else {
        errorss['email'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)("user.input.email.valid.validate.label");
      }
    } else if (!userValue['phone']) {
      errorss['phone'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)("user.input.phone-number.validate.label");
    } else if (!userValue['role_id']) {
      errorss['role_id'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)("user.input.role.validate.label");
    } else {
      isValid = true;
    }
    setErrors(errorss);
    return isValid;
  };
  var onChangeInput = function onChangeInput(e) {
    e.preventDefault();
    setUserValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, _defineProperty({}, e.target.name, e.target.value));
    });
    setErrors('');
  };
  var handleImageChanges = function handleImageChanges(e) {
    e.preventDefault();
    if (e.target.files.length > 0) {
      var file = e.target.files[0];
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        setSelectImg(file);
        var fileReader = new FileReader();
        fileReader.onloadend = function () {
          setImagePreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
        setErrors('');
      }
    }
  };
  var prepareFormData = function prepareFormData(data) {
    var formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    if (!isEdit) {
      formData.append('password', data.password);
      formData.append('confirm_password', data.confirm_password);
    }
    if (data.role_id.value) {
      formData.append('role_id', data.role_id.value);
    } else {
      formData.append('role_id', data.role_id);
    }
    if (selectImg) {
      formData.append('image', data.image);
    }
    formData.append('default_warehouse_id', data.default_warehouse_id || '');
    (data.store_ids || []).forEach(function (storeId) {
      formData.append('store_ids[]', storeId);
    });
    return formData;
  };
  var onSubmit = function onSubmit(event) {
    event.preventDefault();
    userValue.image = selectImg;
    var valid = handleValidation();
    if (singleUser && valid) {
      if (!disabled) {
        userValue.image = selectImg;
        Dispatch((0,_store_action_userAction__WEBPACK_IMPORTED_MODULE_5__.editUser)(id, prepareFormData(userValue), navigate));
      }
    } else {
      if (valid) {
        setUserValue(userValue);
        addUserData(prepareFormData(userValue));
        setImagePreviewUrl(imagePreviewUrl ? imagePreviewUrl : _assets_images_avatar_png__WEBPACK_IMPORTED_MODULE_8__["default"]);
      }
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
    className: "card",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
      className: "card-body",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_1__["default"], {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
          className: "row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
            className: "mb-4",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_shared_image_picker_ImagePicker__WEBPACK_IMPORTED_MODULE_6__["default"], {
              user: _assets_images_avatar_png__WEBPACK_IMPORTED_MODULE_8__["default"],
              isCreate: isCreate,
              avtarName: avatarName,
              imageTitle: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.placeholderText)("globally.input.change-image.tooltip"),
              imagePreviewUrl: imagePreviewUrl,
              handleImageChange: handleImageChanges
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
            className: "col-md-6 mb-3",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("label", {
              htmlFor: "exampleInputEmail1",
              className: "form-label",
              children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)("user.input.first-name.label"), " :", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("span", {
                className: "required"
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("input", {
              type: "text",
              name: "first_name",
              value: userValue.first_name,
              placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.placeholderText)("user.input.first-name.placeholder.label"),
              className: "form-control",
              autoFocus: true,
              onChange: function onChange(e) {
                return onChangeInput(e);
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("span", {
              className: "text-danger d-block fw-400 fs-small mt-2",
              children: errors['first_name'] ? errors['first_name'] : null
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
            className: "col-md-6 mb-3",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("label", {
              className: "form-label",
              children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)("user.input.last-name.label"), ":"]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("span", {
              className: "required"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("input", {
              type: "text",
              name: "last_name",
              className: "form-control",
              placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.placeholderText)("user.input.last-name.placeholder.label"),
              onChange: function onChange(e) {
                return onChangeInput(e);
              },
              value: userValue.last_name
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("span", {
              className: "text-danger d-block fw-400 fs-small mt-2",
              children: errors['last_name'] ? errors['last_name'] : null
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
            className: "col-md-6 mb-3",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("label", {
              className: "form-label",
              children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)("user.input.email.label"), ":"]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("span", {
              className: "required"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("input", {
              type: "text",
              name: "email",
              className: "form-control",
              placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.placeholderText)("user.input.email.placeholder.label"),
              onChange: function onChange(e) {
                return onChangeInput(e);
              },
              value: userValue.email
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("span", {
              className: "text-danger d-block fw-400 fs-small mt-2",
              children: errors['email'] ? errors['email'] : null
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
            className: "col-md-6 mb-3",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("label", {
              className: "form-label",
              children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)("user.input.phone-number.label"), ":"]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("span", {
              className: "required"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("input", {
              type: "text",
              name: "phone",
              value: userValue.phone,
              placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.placeholderText)("user.input.phone-number.placeholder.label"),
              className: "form-control",
              pattern: "[0-9]*",
              min: 0,
              onKeyPress: function onKeyPress(event) {
                return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.numValidate)(event);
              },
              onChange: function onChange(e) {
                return onChangeInput(e);
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("span", {
              className: "text-danger d-block fw-400 fs-small mt-2",
              children: errors['phone'] ? errors['phone'] : null
            })]
          }), isEdit ? '' : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
            className: "col-md-6 mb-3",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("label", {
              className: "form-label",
              children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)("user.input.password.label"), ":"]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("span", {
              className: "required"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("input", {
              type: "password",
              name: "password",
              placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.placeholderText)("user.input.password.placeholder.label"),
              className: "form-control",
              value: userValue.password,
              onChange: function onChange(e) {
                return onChangeInput(e);
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("span", {
              className: "text-danger d-block fw-400 fs-small mt-2",
              children: errors['password'] ? errors['password'] : null
            })]
          }), isEdit ? '' : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
            className: "col-md-6 mb-3",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("label", {
              className: "form-label",
              children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)("user.input.confirm-password.label"), ":"]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("span", {
              className: "required"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("input", {
              type: "password",
              name: "confirm_password",
              className: "form-control",
              placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.placeholderText)("user.input.confirm-password.placeholder.label"),
              onChange: function onChange(e) {
                return onChangeInput(e);
              },
              value: userValue.confirm_password
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("span", {
              className: "text-danger d-block fw-400 fs-small mt-2",
              children: errors['confirm_password'] ? errors['confirm_password'] : null
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
            className: "col-md-6",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_10__["default"], {
              title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)("user.input.role.label"),
              placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.placeholderText)("user.input.role.placeholder.label"),
              defaultValue: selectedRole,
              data: roles,
              onChange: onRolesChange,
              errors: errors['role_id']
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
            className: "col-md-6 mb-3",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_10__["default"], {
              title: "Almac\xE9n por defecto",
              placeholder: "Sin asignar (usa el almac\xE9n global)",
              defaultValue: selectedWarehouse,
              data: warehouses,
              onChange: onWarehouseChange,
              isRequired: true
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("span", {
              className: "text-muted d-block fs-small mt-1",
              children: "Si no se asigna, este usuario entra al POS con el almac\xE9n configurado en Ajustes."
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
            className: "col-md-12 mb-3",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("label", {
              className: "form-label d-block",
              children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)("user.input.stores.label"), ":", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("span", {
                className: "required"
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
              className: "form-check mb-2",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("input", {
                type: "checkbox",
                className: "form-check-input",
                id: "select-all-stores",
                checked: availableStores.length > 0 && userValue.store_ids.length === availableStores.length,
                onChange: onSelectAllStores
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("label", {
                className: "form-check-label",
                htmlFor: "select-all-stores",
                children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)("user.input.stores.select-all.label")
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
              className: "d-flex flex-wrap gap-4",
              children: availableStores.map(function (store) {
                return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
                  className: "form-check",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("input", {
                    type: "checkbox",
                    className: "form-check-input",
                    id: "store-".concat(store.id),
                    checked: userValue.store_ids.includes(store.id),
                    onChange: function onChange() {
                      return onStoreToggle(store.id);
                    }
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("label", {
                    className: "form-check-label",
                    htmlFor: "store-".concat(store.id),
                    children: store.attributes ? store.attributes.name : store.name
                  })]
                }, store.id);
              })
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_shared_components_modelFooter__WEBPACK_IMPORTED_MODULE_9__["default"], {
            onEditRecord: singleUser,
            onSubmit: onSubmit,
            editDisabled: disabled,
            link: "/app/users",
            addDisabled: !userValue.first_name
          })]
        })
      })
    })
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var roles = state.roles,
    warehouses = state.warehouses,
    myStores = state.myStores;
  return {
    roles: roles,
    warehouses: warehouses,
    myStores: myStores
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_2__.connect)(mapStateToProps, {
  fetchAllRoles: _store_action_roleAction__WEBPACK_IMPORTED_MODULE_11__.fetchAllRoles,
  fetchAllWarehouses: _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_12__.fetchAllWarehouses
})(UserForm));

/***/ },

/***/ "./resources/pos/src/shared/image-picker/ImagePicker.js"
/*!**************************************************************!*\
  !*** ./resources/pos/src/shared/image-picker/ImagePicker.js ***!
  \**************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _sharedMethod__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.mjs");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "./node_modules/@fortawesome/react-fontawesome/index.es.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");





var ImagePicker = function ImagePicker(props) {
  var imagePreviewUrl = props.imagePreviewUrl,
    handleImageChange = props.handleImageChange,
    imageTitle = props.imageTitle,
    avtarName = props.avtarName,
    user = props.user;
  var fileInput = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createRef();
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: "col-12",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("label", {
      className: "form-label mb-4",
      children: [imageTitle ? imageTitle : (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_1__.getFormattedMessage)('globally.input.change-logo.tooltip'), ":"]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "d-block",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "image-picker",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "image previewImage imagePreviewUrl ".concat(imagePreviewUrl ? null : "d-flex justify-content-center align-items-center"),
          children: [imagePreviewUrl ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("img", {
            src: imagePreviewUrl ? imagePreviewUrl : null,
            alt: "img",
            width: 75,
            height: 100,
            className: "image image-circle image-mini h-100"
          }) : avtarName ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
            className: "custom-user-avatar w-100 h-100",
            children: avtarName
          }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("img", {
            src: user ? user : null,
            alt: "img",
            width: 75,
            height: 75,
            className: "image image-circle image-mini h-100"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("span", {
            className: "picker-edit rounded-circle text-gray-500 fs-small cursor-pointer",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
              className: "upload-file",
              title: "".concat(imageTitle ? imageTitle : (0,_sharedMethod__WEBPACK_IMPORTED_MODULE_1__.placeholderText)('globally.input.change-logo.tooltip')),
              type: "file",
              accept: ".png, .jpg, .jpeg",
              onChange: function onChange(e) {
                return handleImageChange(e);
              },
              ref: fileInput
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__.FontAwesomeIcon, {
              icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_2__.faPencil
            })]
          })]
        })
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ImagePicker);

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

/***/ },

/***/ "./resources/pos/src/store/action/updateProfileAction.js"
/*!***************************************************************!*\
  !*** ./resources/pos/src/store/action/updateProfileAction.js ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fetchProfile: () => (/* binding */ fetchProfile),
/* harmony export */   updateProfile: () => (/* binding */ updateProfile)
/* harmony export */ });
/* harmony import */ var _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config/apiConfig */ "./resources/pos/src/config/apiConfig.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _toastAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./toastAction */ "./resources/pos/src/store/action/toastAction.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }




var fetchProfile = function fetchProfile() {
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(dispatch) {
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].get(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.EDIT_PROFILE).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.profileActionType.FETCH_PROFILE,
                payload: response.data.data
              });
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
var updateProfile = function updateProfile(profile, navigate) {
  return /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(dispatch) {
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].post(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.UPDATE_PROFILE, profile).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.profileActionType.UPDATE_PROFILE,
                payload: response.data.data
              });
              localStorage.setItem(_constants__WEBPACK_IMPORTED_MODULE_1__.Tokens.USER_IMAGE_URL, response.data.data.attributes.image);
              localStorage.setItem(_constants__WEBPACK_IMPORTED_MODULE_1__.Tokens.UPDATED_EMAIL, response.data.data.attributes.email);
              localStorage.setItem(_constants__WEBPACK_IMPORTED_MODULE_1__.Tokens.UPDATED_FIRST_NAME, response.data.data.attributes.first_name);
              localStorage.setItem(_constants__WEBPACK_IMPORTED_MODULE_1__.Tokens.UPDATED_LAST_NAME, response.data.data.attributes.last_name);
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_3__.getFormattedMessage)('update-profile.success.update.message')
              }));
              navigate('/dashboard');
            })["catch"](function (error) {
              var _error$response;
              var message = (error === null || error === void 0 || (_error$response = error.response) === null || _error$response === void 0 || (_error$response = _error$response.data) === null || _error$response === void 0 ? void 0 : _error$response.message) || 'Something went wrong';
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: message,
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

/***/ },

/***/ "./resources/pos/src/store/action/userAction.js"
/*!******************************************************!*\
  !*** ./resources/pos/src/store/action/userAction.js ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addUser: () => (/* binding */ addUser),
/* harmony export */   changeUserPassword: () => (/* binding */ changeUserPassword),
/* harmony export */   deleteUser: () => (/* binding */ deleteUser),
/* harmony export */   editUser: () => (/* binding */ editUser),
/* harmony export */   fetchUser: () => (/* binding */ fetchUser),
/* harmony export */   fetchUsers: () => (/* binding */ fetchUsers)
/* harmony export */ });
/* harmony import */ var _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config/apiConfig */ "./resources/pos/src/config/apiConfig.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _shared_requestParam__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/requestParam */ "./resources/pos/src/shared/requestParam.js");
/* harmony import */ var _toastAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./toastAction */ "./resources/pos/src/store/action/toastAction.js");
/* harmony import */ var _totalRecordAction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./totalRecordAction */ "./resources/pos/src/store/action/totalRecordAction.js");
/* harmony import */ var _loadingAction__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./loadingAction */ "./resources/pos/src/store/action/loadingAction.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _saveButtonAction__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./saveButtonAction */ "./resources/pos/src/store/action/saveButtonAction.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }








var fetchUsers = function fetchUsers() {
  var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var isLoading = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var allUser = arguments.length > 2 ? arguments[2] : undefined;
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(dispatch) {
      var url;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            if (isLoading) {
              dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_5__.setLoading)(true));
            }
            url = _constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.USERS;
            if (!_.isEmpty(filter) && (filter.page || filter.pageSize || filter.search || filter.order_By || filter.created_at)) {
              url += (0,_shared_requestParam__WEBPACK_IMPORTED_MODULE_2__["default"])(filter, null, null, null, url);
            }
            url += allUser ? allUser : "";
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].get(url).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.userActionType.FETCH_USERS,
                payload: response.data.data
              });
              !allUser && dispatch((0,_totalRecordAction__WEBPACK_IMPORTED_MODULE_4__.setTotalRecord)(response.data.meta.total !== undefined && response.data.meta.total >= 0 ? response.data.meta.total : response.data.data.total));
              if (isLoading) {
                dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_5__.setLoading)(false));
              }
            })["catch"](function (_ref2) {
              var response = _ref2.response;
              if (isLoading) {
                dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_5__.setLoading)(false));
              }
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
var fetchUser = function fetchUser(userId) {
  var isLoading = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(dispatch) {
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            if (isLoading) {
              dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_5__.setLoading)(true));
            }
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].get(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.USERS + "/" + userId).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.userActionType.FETCH_USER,
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
var addUser = function addUser(users, navigate) {
  return /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(dispatch) {
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_7__.setSavingButton)(true));
            _context3.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].post(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.USERS, users).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.userActionType.ADD_USER,
                payload: response.data.data
              });
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("user.success.create.message")
              }));
              navigate("/app/users");
              dispatch((0,_totalRecordAction__WEBPACK_IMPORTED_MODULE_4__.addInToTotalRecord)(1));
              dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_7__.setSavingButton)(false));
            })["catch"](function (_ref6) {
              var response = _ref6.response;
              dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_7__.setSavingButton)(false));
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
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
var editUser = function editUser(userId, users, navigate) {
  return /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(dispatch) {
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_7__.setSavingButton)(true));
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].post(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.USERS + "/" + userId, users).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.userActionType.EDIT_USER,
                payload: response.data.data
              });
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("user.success.edit.message")
              }));
              navigate("/app/users");
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
var deleteUser = function deleteUser(userId) {
  return /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(dispatch) {
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"]["delete"](_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.USERS + "/" + userId).then(function (response) {
              dispatch((0,_totalRecordAction__WEBPACK_IMPORTED_MODULE_4__.removeFromTotalRecord)(1));
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.userActionType.DELETE_USER,
                payload: userId
              });
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("user.success.delete.message")
              }));
            })["catch"](function (_ref0) {
              var response = _ref0.response;
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
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
var changeUserPassword = function changeUserPassword(userId, password, passwordConfirmation) {
  var onSuccess = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  return /*#__PURE__*/function () {
    var _ref1 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(dispatch) {
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_7__.setSavingButton)(true));
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].post(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.USERS + "/" + userId + "/change-password", {
              password: password,
              password_confirmation: passwordConfirmation
            }).then(function (response) {
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: response.data.message || "Contraseña actualizada correctamente."
              }));
              dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_7__.setSavingButton)(false));
              if (onSuccess) {
                onSuccess();
              }
            })["catch"](function (_ref10) {
              var _response$data;
              var response = _ref10.response;
              dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_7__.setSavingButton)(false));
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_3__.addToast)({
                text: (response === null || response === void 0 || (_response$data = response.data) === null || _response$data === void 0 ? void 0 : _response$data.message) || "Ocurrió un error.",
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

/***/ },

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[5].oneOf[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[5].oneOf[1].use[2]!./resources/pos/src/components/user-profile/styles/UpdateProfileStyles.css"
/*!*********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[5].oneOf[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[5].oneOf[1].use[2]!./resources/pos/src/components/user-profile/styles/UpdateProfileStyles.css ***!
  \*********************************************************************************************************************************************************************************************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js */ "./node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/* ─────────────────────────────────────────\r\n   UPDATE PROFILE — Purple Theme\r\n   Importar en UpdateProfile.jsx:\r\n   import './UpdateProfile.css';\r\n───────────────────────────────────────── */\r\n\r\n/* ══════════════════════════════════════\r\n   CONTENEDOR\r\n══════════════════════════════════════ */\r\n.update-profile-container {\r\n    font-family: 'Poppins', sans-serif;\r\n}\r\n\r\n.update-profile-container .card {\r\n    border: 1px solid #ede9fe !important;\r\n    border-radius: 16px !important;\r\n    box-shadow: 0 4px 24px rgba(99, 102, 241, 0.07) !important;\r\n    background: #ffffff !important;\r\n    overflow: hidden !important;\r\n}\r\n\r\n.update-profile-container .card-body {\r\n    padding: 32px 36px !important;\r\n}\r\n\r\n/* ══════════════════════════════════════\r\n   HEADER DE PERFIL\r\n══════════════════════════════════════ */\r\n.profile-header {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 24px;\r\n    padding: 24px 28px;\r\n    background: linear-gradient(135deg, #667eea15, #764ba215);\r\n    border-bottom: 1px solid #ede9fe;\r\n    margin: -32px -36px 32px;\r\n}\r\n\r\n.profile-avatar-wrap {\r\n    position: relative;\r\n    flex-shrink: 0;\r\n}\r\n\r\n.profile-avatar-wrap img,\r\n.profile-avatar-wrap .avatar-circle {\r\n    width: 80px !important;\r\n    height: 80px !important;\r\n    border-radius: 50% !important;\r\n    -o-object-fit: cover !important;\r\n       object-fit: cover !important;\r\n    border: 3px solid #ffffff !important;\r\n    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2) !important;\r\n}\r\n\r\n.profile-avatar-label {\r\n    position: absolute;\r\n    bottom: 0;\r\n    right: 0;\r\n    width: 26px;\r\n    height: 26px;\r\n    background: linear-gradient(135deg, #667eea, #764ba2);\r\n    border-radius: 50%;\r\n    border: 2px solid #ffffff;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    cursor: pointer;\r\n    transition: opacity 0.18s;\r\n}\r\n\r\n.profile-avatar-label:hover {\r\n    opacity: 0.85;\r\n}\r\n\r\n.profile-avatar-label svg {\r\n    width: 12px;\r\n    height: 12px;\r\n    stroke: #ffffff;\r\n    fill: none;\r\n}\r\n\r\n.profile-header-info h2 {\r\n    font-size: 18px;\r\n    font-weight: 600;\r\n    color: #1f2937;\r\n    margin: 0 0 4px;\r\n}\r\n\r\n.profile-header-info p {\r\n    font-size: 13px;\r\n    color: #2F6FED;\r\n    margin: 0;\r\n    font-weight: 500;\r\n}\r\n\r\n/* ══════════════════════════════════════\r\n   SECTION TITLE\r\n══════════════════════════════════════ */\r\n.profile-section-title {\r\n    font-size: 11px;\r\n    font-weight: 700;\r\n    color: #2F6FED;\r\n    text-transform: uppercase;\r\n    letter-spacing: 0.08em;\r\n    margin-bottom: 16px;\r\n    padding-bottom: 8px;\r\n    border-bottom: 1px solid #f0ebff;\r\n}\r\n\r\n/* ══════════════════════════════════════\r\n   LABELS\r\n══════════════════════════════════════ */\r\n.update-profile-container .form-label {\r\n    font-size: 12px !important;\r\n    font-weight: 600 !important;\r\n    color: #4b5563 !important;\r\n    text-transform: uppercase !important;\r\n    letter-spacing: 0.04em !important;\r\n    margin-bottom: 6px !important;\r\n    font-family: 'Poppins', sans-serif !important;\r\n    display: block !important;\r\n}\r\n\r\n/* ══════════════════════════════════════\r\n   INPUTS\r\n══════════════════════════════════════ */\r\n.update-profile-container .form-control {\r\n    background: #ffffff !important;\r\n    border: 1.5px solid #abb6ec !important;\r\n    border-radius: 10px !important;\r\n    font-size: 13.5px !important;\r\n    font-family: 'Poppins', sans-serif !important;\r\n    color: #374151 !important;\r\n    padding: 10px 14px !important;\r\n    height: auto !important;\r\n    transition: border-color 0.18s, box-shadow 0.18s !important;\r\n    outline: none !important;\r\n    box-shadow: none !important;\r\n}\r\n\r\n.update-profile-container .form-control:focus {\r\n    border-color: #2F6FED !important;\r\n    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;\r\n    background: #ffffff !important;\r\n}\r\n\r\n.update-profile-container .form-control::-moz-placeholder {\r\n    color: #b5d9fd !important;\r\n    font-size: 13px !important;\r\n}\r\n\r\n.update-profile-container .form-control::placeholder {\r\n    color: #b5d9fd !important;\r\n    font-size: 13px !important;\r\n}\r\n\r\n/* ══════════════════════════════════════\r\n   ERRORES\r\n══════════════════════════════════════ */\r\n.update-profile-container .text-danger {\r\n    font-size: 11.5px !important;\r\n    color: #e24b4a !important;\r\n    font-weight: 500 !important;\r\n    font-family: 'Poppins', sans-serif !important;\r\n}\r\n\r\n/* ══════════════════════════════════════\r\n   BOTONES\r\n══════════════════════════════════════ */\r\n.update-profile-container .btn-primary {\r\n    background: linear-gradient(135deg, #667eea, #2F6FED) !important;\r\n    border: none !important;\r\n    color: #ffffff !important;\r\n    border-radius: 10px !important;\r\n    font-size: 13.5px !important;\r\n    font-weight: 600 !important;\r\n    font-family: 'Poppins', sans-serif !important;\r\n    padding: 10px 28px !important;\r\n    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.28) !important;\r\n    transition: opacity 0.18s, transform 0.12s !important;\r\n    cursor: pointer !important;\r\n}\r\n\r\n.update-profile-container .btn-primary:hover:not(:disabled) {\r\n    opacity: 0.9 !important;\r\n}\r\n\r\n.update-profile-container .btn-primary:active:not(:disabled) {\r\n    transform: scale(0.98) !important;\r\n}\r\n\r\n.update-profile-container .btn-primary:disabled {\r\n    opacity: 0.45 !important;\r\n    cursor: not-allowed !important;\r\n}\r\n\r\n.update-profile-container .btn-secondary {\r\n    background: #f5f3ff !important;\r\n    border: 1.5px solid #ddd6fe !important;\r\n    color: #6366f1 !important;\r\n    border-radius: 10px !important;\r\n    font-size: 13.5px !important;\r\n    font-weight: 500 !important;\r\n    font-family: 'Poppins', sans-serif !important;\r\n    padding: 10px 28px !important;\r\n    transition: all 0.18s !important;\r\n    box-shadow: none !important;\r\n    text-decoration: none !important;\r\n    display: inline-flex !important;\r\n    align-items: center !important;\r\n}\r\n\r\n.update-profile-container .btn-secondary:hover {\r\n    background: #ede9fe !important;\r\n    border-color: #809df5 !important;\r\n    color: #4f46e5 !important;\r\n}\r\n\r\n/* ══════════════════════════════════════\r\n   IMAGE PICKER — ocultar el default feo\r\n══════════════════════════════════════ */\r\n.update-profile-container .image-picker-wrap input[type=\"file\"] {\r\n    display: none !important;\r\n}\r\n\r\n.update-profile-container .image-picker-wrap label {\r\n    display: inline-flex !important;\r\n    align-items: center !important;\r\n    gap: 8px !important;\r\n    background: #f5f3ff !important;\r\n    border: 1.5px dashed #c4b5fd !important;\r\n    border-radius: 10px !important;\r\n    padding: 8px 16px !important;\r\n    font-size: 12.5px !important;\r\n    font-weight: 500 !important;\r\n    color: #6366f1 !important;\r\n    cursor: pointer !important;\r\n    transition: all 0.18s !important;\r\n    font-family: 'Poppins', sans-serif !important;\r\n}\r\n\r\n.update-profile-container .image-picker-wrap label:hover {\r\n    background: #ede9fe !important;\r\n    border-color: #a78bfa !important;\r\n}\r\n\r\n/* ══════════════════════════════════════\r\n   CAMPO REQUERIDO\r\n══════════════════════════════════════ */\r\n.update-profile-container .required::after {\r\n    content: ' *';\r\n    color: #e24b4a;\r\n    font-size: 13px;\r\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "./resources/pos/src/components/user-profile/styles/UpdateProfileStyles.css"
/*!**********************************************************************************!*\
  !*** ./resources/pos/src/components/user-profile/styles/UpdateProfileStyles.css ***!
  \**********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_laravel_mix_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../node_modules/laravel-mix/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/laravel-mix/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_laravel_mix_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_laravel_mix_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_5_oneOf_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_5_oneOf_1_use_2_UpdateProfileStyles_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[5].oneOf[1].use[1]!../../../../../../node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[5].oneOf[1].use[2]!./UpdateProfileStyles.css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[5].oneOf[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[5].oneOf[1].use[2]!./resources/pos/src/components/user-profile/styles/UpdateProfileStyles.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_laravel_mix_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_5_oneOf_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_5_oneOf_1_use_2_UpdateProfileStyles_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_5_oneOf_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_5_oneOf_1_use_2_UpdateProfileStyles_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ },

/***/ "./node_modules/react-bootstrap/esm/Card.js"
/*!**************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/Card.js ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _ThemeProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ThemeProvider */ "./node_modules/react-bootstrap/esm/ThemeProvider.js");
/* harmony import */ var _CardBody__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CardBody */ "./node_modules/react-bootstrap/esm/CardBody.js");
/* harmony import */ var _CardFooter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./CardFooter */ "./node_modules/react-bootstrap/esm/CardFooter.js");
/* harmony import */ var _CardHeader__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./CardHeader */ "./node_modules/react-bootstrap/esm/CardHeader.js");
/* harmony import */ var _CardImg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./CardImg */ "./node_modules/react-bootstrap/esm/CardImg.js");
/* harmony import */ var _CardImgOverlay__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./CardImgOverlay */ "./node_modules/react-bootstrap/esm/CardImgOverlay.js");
/* harmony import */ var _CardLink__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./CardLink */ "./node_modules/react-bootstrap/esm/CardLink.js");
/* harmony import */ var _CardSubtitle__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./CardSubtitle */ "./node_modules/react-bootstrap/esm/CardSubtitle.js");
/* harmony import */ var _CardText__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./CardText */ "./node_modules/react-bootstrap/esm/CardText.js");
/* harmony import */ var _CardTitle__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./CardTitle */ "./node_modules/react-bootstrap/esm/CardTitle.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
"use client";














const Card = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({
  bsPrefix,
  className,
  bg,
  text,
  border,
  body = false,
  children,
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  as: Component = 'div',
  ...props
}, ref) => {
  const prefix = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_2__.useBootstrapPrefix)(bsPrefix, 'card');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(Component, {
    ref: ref,
    ...props,
    className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(className, prefix, bg && `bg-${bg}`, text && `text-${text}`, border && `border-${border}`),
    children: body ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_CardBody__WEBPACK_IMPORTED_MODULE_3__["default"], {
      children: children
    }) : children
  });
});
Card.displayName = 'Card';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Object.assign(Card, {
  Img: _CardImg__WEBPACK_IMPORTED_MODULE_6__["default"],
  Title: _CardTitle__WEBPACK_IMPORTED_MODULE_11__["default"],
  Subtitle: _CardSubtitle__WEBPACK_IMPORTED_MODULE_9__["default"],
  Body: _CardBody__WEBPACK_IMPORTED_MODULE_3__["default"],
  Link: _CardLink__WEBPACK_IMPORTED_MODULE_8__["default"],
  Text: _CardText__WEBPACK_IMPORTED_MODULE_10__["default"],
  Header: _CardHeader__WEBPACK_IMPORTED_MODULE_5__["default"],
  Footer: _CardFooter__WEBPACK_IMPORTED_MODULE_4__["default"],
  ImgOverlay: _CardImgOverlay__WEBPACK_IMPORTED_MODULE_7__["default"]
}));

/***/ },

/***/ "./node_modules/react-bootstrap/esm/CardBody.js"
/*!******************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/CardBody.js ***!
  \******************************************************/
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





const CardBody = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  bsPrefix,
  as: Component = 'div',
  ...props
}, ref) => {
  bsPrefix = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_2__.useBootstrapPrefix)(bsPrefix, 'card-body');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(Component, {
    ref: ref,
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(className, bsPrefix),
    ...props
  });
});
CardBody.displayName = 'CardBody';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CardBody);

/***/ },

/***/ "./node_modules/react-bootstrap/esm/CardFooter.js"
/*!********************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/CardFooter.js ***!
  \********************************************************/
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





const CardFooter = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  bsPrefix,
  as: Component = 'div',
  ...props
}, ref) => {
  bsPrefix = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_2__.useBootstrapPrefix)(bsPrefix, 'card-footer');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(Component, {
    ref: ref,
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(className, bsPrefix),
    ...props
  });
});
CardFooter.displayName = 'CardFooter';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CardFooter);

/***/ },

/***/ "./node_modules/react-bootstrap/esm/CardHeader.js"
/*!********************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/CardHeader.js ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _ThemeProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ThemeProvider */ "./node_modules/react-bootstrap/esm/ThemeProvider.js");
/* harmony import */ var _CardHeaderContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CardHeaderContext */ "./node_modules/react-bootstrap/esm/CardHeaderContext.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
"use client";







const CardHeader = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({
  bsPrefix,
  className,
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  as: Component = 'div',
  ...props
}, ref) => {
  const prefix = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_2__.useBootstrapPrefix)(bsPrefix, 'card-header');
  const contextValue = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => ({
    cardHeaderBsPrefix: prefix
  }), [prefix]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_CardHeaderContext__WEBPACK_IMPORTED_MODULE_3__["default"].Provider, {
    value: contextValue,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(Component, {
      ref: ref,
      ...props,
      className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(className, prefix)
    })
  });
});
CardHeader.displayName = 'CardHeader';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CardHeader);

/***/ },

/***/ "./node_modules/react-bootstrap/esm/CardHeaderContext.js"
/*!***************************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/CardHeaderContext.js ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
"use client";


const context = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
context.displayName = 'CardHeaderContext';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (context);

/***/ },

/***/ "./node_modules/react-bootstrap/esm/CardImg.js"
/*!*****************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/CardImg.js ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _ThemeProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ThemeProvider */ "./node_modules/react-bootstrap/esm/ThemeProvider.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
"use client";





const CardImg = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(
// Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
({
  bsPrefix,
  className,
  variant,
  as: Component = 'img',
  ...props
}, ref) => {
  const prefix = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_2__.useBootstrapPrefix)(bsPrefix, 'card-img');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(Component, {
    ref: ref,
    className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(variant ? `${prefix}-${variant}` : prefix, className),
    ...props
  });
});
CardImg.displayName = 'CardImg';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CardImg);

/***/ },

/***/ "./node_modules/react-bootstrap/esm/CardImgOverlay.js"
/*!************************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/CardImgOverlay.js ***!
  \************************************************************/
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





const CardImgOverlay = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  bsPrefix,
  as: Component = 'div',
  ...props
}, ref) => {
  bsPrefix = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_2__.useBootstrapPrefix)(bsPrefix, 'card-img-overlay');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(Component, {
    ref: ref,
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(className, bsPrefix),
    ...props
  });
});
CardImgOverlay.displayName = 'CardImgOverlay';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CardImgOverlay);

/***/ },

/***/ "./node_modules/react-bootstrap/esm/CardLink.js"
/*!******************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/CardLink.js ***!
  \******************************************************/
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





const CardLink = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  bsPrefix,
  as: Component = 'a',
  ...props
}, ref) => {
  bsPrefix = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_2__.useBootstrapPrefix)(bsPrefix, 'card-link');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(Component, {
    ref: ref,
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(className, bsPrefix),
    ...props
  });
});
CardLink.displayName = 'CardLink';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CardLink);

/***/ },

/***/ "./node_modules/react-bootstrap/esm/CardSubtitle.js"
/*!**********************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/CardSubtitle.js ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ThemeProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ThemeProvider */ "./node_modules/react-bootstrap/esm/ThemeProvider.js");
/* harmony import */ var _divWithClassName__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./divWithClassName */ "./node_modules/react-bootstrap/esm/divWithClassName.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
"use client";






const DivStyledAsH6 = (0,_divWithClassName__WEBPACK_IMPORTED_MODULE_3__["default"])('h6');
const CardSubtitle = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  bsPrefix,
  as: Component = DivStyledAsH6,
  ...props
}, ref) => {
  bsPrefix = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_2__.useBootstrapPrefix)(bsPrefix, 'card-subtitle');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(Component, {
    ref: ref,
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(className, bsPrefix),
    ...props
  });
});
CardSubtitle.displayName = 'CardSubtitle';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CardSubtitle);

/***/ },

/***/ "./node_modules/react-bootstrap/esm/CardText.js"
/*!******************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/CardText.js ***!
  \******************************************************/
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





const CardText = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  bsPrefix,
  as: Component = 'p',
  ...props
}, ref) => {
  bsPrefix = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_2__.useBootstrapPrefix)(bsPrefix, 'card-text');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(Component, {
    ref: ref,
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(className, bsPrefix),
    ...props
  });
});
CardText.displayName = 'CardText';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CardText);

/***/ },

/***/ "./node_modules/react-bootstrap/esm/CardTitle.js"
/*!*******************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/CardTitle.js ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ThemeProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ThemeProvider */ "./node_modules/react-bootstrap/esm/ThemeProvider.js");
/* harmony import */ var _divWithClassName__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./divWithClassName */ "./node_modules/react-bootstrap/esm/divWithClassName.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
"use client";






const DivStyledAsH5 = (0,_divWithClassName__WEBPACK_IMPORTED_MODULE_3__["default"])('h5');
const CardTitle = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  bsPrefix,
  as: Component = DivStyledAsH5,
  ...props
}, ref) => {
  bsPrefix = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_2__.useBootstrapPrefix)(bsPrefix, 'card-title');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(Component, {
    ref: ref,
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(className, bsPrefix),
    ...props
  });
});
CardTitle.displayName = 'CardTitle';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CardTitle);

/***/ }

}]);