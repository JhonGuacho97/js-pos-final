"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["quotation"],{

/***/ "./node_modules/@restart/ui/esm/Nav.js"
/*!*********************************************!*\
  !*** ./node_modules/@restart/ui/esm/Nav.js ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var dom_helpers_querySelectorAll__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dom-helpers/querySelectorAll */ "./node_modules/dom-helpers/esm/querySelectorAll.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _restart_hooks_useForceUpdate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @restart/hooks/useForceUpdate */ "./node_modules/@restart/ui/node_modules/@restart/hooks/esm/useForceUpdate.js");
/* harmony import */ var _restart_hooks_useMergedRefs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @restart/hooks/useMergedRefs */ "./node_modules/@restart/ui/node_modules/@restart/hooks/esm/useMergedRefs.js");
/* harmony import */ var _NavContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./NavContext */ "./node_modules/@restart/ui/esm/NavContext.js");
/* harmony import */ var _SelectableContext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./SelectableContext */ "./node_modules/@restart/ui/esm/SelectableContext.js");
/* harmony import */ var _TabContext__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./TabContext */ "./node_modules/@restart/ui/esm/TabContext.js");
/* harmony import */ var _DataKey__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./DataKey */ "./node_modules/@restart/ui/esm/DataKey.js");
/* harmony import */ var _NavItem__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./NavItem */ "./node_modules/@restart/ui/esm/NavItem.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
const _excluded = ["as", "onSelect", "activeKey", "role", "onKeyDown"];
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.indexOf(n) >= 0) continue; t[n] = r[n]; } return t; }











// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};
const EVENT_KEY_ATTR = (0,_DataKey__WEBPACK_IMPORTED_MODULE_7__.dataAttr)('event-key');
const Nav = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.forwardRef((_ref, ref) => {
  let {
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as: Component = 'div',
      onSelect,
      activeKey,
      role,
      onKeyDown
    } = _ref,
    props = _objectWithoutPropertiesLoose(_ref, _excluded);
  // A ref and forceUpdate for refocus, b/c we only want to trigger when needed
  // and don't want to reset the set in the effect
  const forceUpdate = (0,_restart_hooks_useForceUpdate__WEBPACK_IMPORTED_MODULE_2__["default"])();
  const needsRefocusRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(false);
  const parentOnSelect = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(_SelectableContext__WEBPACK_IMPORTED_MODULE_5__["default"]);
  const tabContext = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(_TabContext__WEBPACK_IMPORTED_MODULE_6__["default"]);
  let getControlledId, getControllerId;
  if (tabContext) {
    role = role || 'tablist';
    activeKey = tabContext.activeKey;
    // TODO: do we need to duplicate these?
    getControlledId = tabContext.getControlledId;
    getControllerId = tabContext.getControllerId;
  }
  const listNode = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  const getNextActiveTab = offset => {
    const currentListNode = listNode.current;
    if (!currentListNode) return null;
    const items = (0,dom_helpers_querySelectorAll__WEBPACK_IMPORTED_MODULE_0__["default"])(currentListNode, `[${EVENT_KEY_ATTR}]:not([aria-disabled=true])`);
    const activeChild = currentListNode.querySelector('[aria-selected=true]');
    if (!activeChild || activeChild !== document.activeElement) return null;
    const index = items.indexOf(activeChild);
    if (index === -1) return null;
    let nextIndex = index + offset;
    if (nextIndex >= items.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = items.length - 1;
    return items[nextIndex];
  };
  const handleSelect = (key, event) => {
    if (key == null) return;
    onSelect == null ? void 0 : onSelect(key, event);
    parentOnSelect == null ? void 0 : parentOnSelect(key, event);
  };
  const handleKeyDown = event => {
    onKeyDown == null ? void 0 : onKeyDown(event);
    if (!tabContext) {
      return;
    }
    let nextActiveChild;
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        nextActiveChild = getNextActiveTab(-1);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        nextActiveChild = getNextActiveTab(1);
        break;
      default:
        return;
    }
    if (!nextActiveChild) return;
    event.preventDefault();
    handleSelect(nextActiveChild.dataset[(0,_DataKey__WEBPACK_IMPORTED_MODULE_7__.dataProp)('EventKey')] || null, event);
    needsRefocusRef.current = true;
    forceUpdate();
  };
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (listNode.current && needsRefocusRef.current) {
      const activeChild = listNode.current.querySelector(`[${EVENT_KEY_ATTR}][aria-selected=true]`);
      activeChild == null ? void 0 : activeChild.focus();
    }
    needsRefocusRef.current = false;
  });
  const mergedRef = (0,_restart_hooks_useMergedRefs__WEBPACK_IMPORTED_MODULE_3__["default"])(ref, listNode);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_SelectableContext__WEBPACK_IMPORTED_MODULE_5__["default"].Provider, {
    value: handleSelect,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_NavContext__WEBPACK_IMPORTED_MODULE_4__["default"].Provider, {
      value: {
        role,
        // used by NavLink to determine it's role
        activeKey: (0,_SelectableContext__WEBPACK_IMPORTED_MODULE_5__.makeEventKey)(activeKey),
        getControlledId: getControlledId || noop,
        getControllerId: getControllerId || noop
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(Component, Object.assign({}, props, {
        onKeyDown: handleKeyDown,
        ref: mergedRef,
        role: role
      }))
    })
  });
});
Nav.displayName = 'Nav';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Object.assign(Nav, {
  Item: _NavItem__WEBPACK_IMPORTED_MODULE_8__["default"]
}));

/***/ },

/***/ "./node_modules/@restart/ui/esm/NavItem.js"
/*!*************************************************!*\
  !*** ./node_modules/@restart/ui/esm/NavItem.js ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   useNavItem: () => (/* binding */ useNavItem)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _restart_hooks_useEventCallback__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @restart/hooks/useEventCallback */ "./node_modules/@restart/ui/node_modules/@restart/hooks/esm/useEventCallback.js");
/* harmony import */ var _NavContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./NavContext */ "./node_modules/@restart/ui/esm/NavContext.js");
/* harmony import */ var _SelectableContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SelectableContext */ "./node_modules/@restart/ui/esm/SelectableContext.js");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Button */ "./node_modules/@restart/ui/esm/Button.js");
/* harmony import */ var _DataKey__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./DataKey */ "./node_modules/@restart/ui/esm/DataKey.js");
/* harmony import */ var _TabContext__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./TabContext */ "./node_modules/@restart/ui/esm/TabContext.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
const _excluded = ["as", "active", "eventKey"];
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.indexOf(n) >= 0) continue; t[n] = r[n]; } return t; }









function useNavItem({
  key,
  onClick,
  active,
  id,
  role,
  disabled
}) {
  const parentOnSelect = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_SelectableContext__WEBPACK_IMPORTED_MODULE_3__["default"]);
  const navContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_NavContext__WEBPACK_IMPORTED_MODULE_2__["default"]);
  const tabContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_TabContext__WEBPACK_IMPORTED_MODULE_6__["default"]);
  let isActive = active;
  const props = {
    role
  };
  if (navContext) {
    if (!role && navContext.role === 'tablist') props.role = 'tab';
    const contextControllerId = navContext.getControllerId(key != null ? key : null);
    const contextControlledId = navContext.getControlledId(key != null ? key : null);

    // @ts-ignore
    props[(0,_DataKey__WEBPACK_IMPORTED_MODULE_5__.dataAttr)('event-key')] = key;
    props.id = contextControllerId || id;
    isActive = active == null && key != null ? navContext.activeKey === key : active;

    /**
     * Simplified scenario for `mountOnEnter`.
     *
     * While it would make sense to keep 'aria-controls' for tabs that have been mounted at least
     * once, it would also complicate the code quite a bit, for very little gain.
     * The following implementation is probably good enough.
     *
     * @see https://github.com/react-restart/ui/pull/40#issuecomment-1009971561
     */
    if (isActive || !(tabContext != null && tabContext.unmountOnExit) && !(tabContext != null && tabContext.mountOnEnter)) props['aria-controls'] = contextControlledId;
  }
  if (props.role === 'tab') {
    props['aria-selected'] = isActive;
    if (!isActive) {
      props.tabIndex = -1;
    }
    if (disabled) {
      props.tabIndex = -1;
      props['aria-disabled'] = true;
    }
  }
  props.onClick = (0,_restart_hooks_useEventCallback__WEBPACK_IMPORTED_MODULE_1__["default"])(e => {
    if (disabled) return;
    onClick == null ? void 0 : onClick(e);
    if (key == null) {
      return;
    }
    if (parentOnSelect && !e.isPropagationStopped()) {
      parentOnSelect(key, e);
    }
  });
  return [props, {
    isActive
  }];
}
const NavItem = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((_ref, ref) => {
  let {
      as: Component = _Button__WEBPACK_IMPORTED_MODULE_4__["default"],
      active,
      eventKey
    } = _ref,
    options = _objectWithoutPropertiesLoose(_ref, _excluded);
  const [props, meta] = useNavItem(Object.assign({
    key: (0,_SelectableContext__WEBPACK_IMPORTED_MODULE_3__.makeEventKey)(eventKey, options.href),
    active
  }, options));

  // @ts-ignore
  props[(0,_DataKey__WEBPACK_IMPORTED_MODULE_5__.dataAttr)('active')] = meta.isActive;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Component, Object.assign({}, options, props, {
    ref: ref
  }));
});
NavItem.displayName = 'NavItem';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NavItem);

/***/ },

/***/ "./node_modules/@restart/ui/esm/TabContext.js"
/*!****************************************************!*\
  !*** ./node_modules/@restart/ui/esm/TabContext.js ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");

const TabContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TabContext);

/***/ },

/***/ "./node_modules/@restart/ui/esm/TabPanel.js"
/*!**************************************************!*\
  !*** ./node_modules/@restart/ui/esm/TabPanel.js ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   useTabPanel: () => (/* binding */ useTabPanel)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _TabContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TabContext */ "./node_modules/@restart/ui/esm/TabContext.js");
/* harmony import */ var _SelectableContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SelectableContext */ "./node_modules/@restart/ui/esm/SelectableContext.js");
/* harmony import */ var _NoopTransition__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./NoopTransition */ "./node_modules/@restart/ui/esm/NoopTransition.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
const _excluded = ["active", "eventKey", "mountOnEnter", "transition", "unmountOnExit", "role", "onEnter", "onEntering", "onEntered", "onExit", "onExiting", "onExited"],
  _excluded2 = ["activeKey", "getControlledId", "getControllerId"],
  _excluded3 = ["as"];
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.indexOf(n) >= 0) continue; t[n] = r[n]; } return t; }






function useTabPanel(_ref) {
  let {
      active,
      eventKey,
      mountOnEnter,
      transition,
      unmountOnExit,
      role = 'tabpanel',
      onEnter,
      onEntering,
      onEntered,
      onExit,
      onExiting,
      onExited
    } = _ref,
    props = _objectWithoutPropertiesLoose(_ref, _excluded);
  const context = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_TabContext__WEBPACK_IMPORTED_MODULE_1__["default"]);
  if (!context) return [Object.assign({}, props, {
    role
  }), {
    eventKey,
    isActive: active,
    mountOnEnter,
    transition,
    unmountOnExit,
    onEnter,
    onEntering,
    onEntered,
    onExit,
    onExiting,
    onExited
  }];
  const {
      activeKey,
      getControlledId,
      getControllerId
    } = context,
    rest = _objectWithoutPropertiesLoose(context, _excluded2);
  const key = (0,_SelectableContext__WEBPACK_IMPORTED_MODULE_2__.makeEventKey)(eventKey);
  return [Object.assign({}, props, {
    role,
    id: getControlledId(eventKey),
    'aria-labelledby': getControllerId(eventKey)
  }), {
    eventKey,
    isActive: active == null && key != null ? (0,_SelectableContext__WEBPACK_IMPORTED_MODULE_2__.makeEventKey)(activeKey) === key : active,
    transition: transition || rest.transition,
    mountOnEnter: mountOnEnter != null ? mountOnEnter : rest.mountOnEnter,
    unmountOnExit: unmountOnExit != null ? unmountOnExit : rest.unmountOnExit,
    onEnter,
    onEntering,
    onEntered,
    onExit,
    onExiting,
    onExited
  }];
}
const TabPanel = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
// Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
(_ref2, ref) => {
  let {
      as: Component = 'div'
    } = _ref2,
    props = _objectWithoutPropertiesLoose(_ref2, _excluded3);
  const [tabPanelProps, {
    isActive,
    onEnter,
    onEntering,
    onEntered,
    onExit,
    onExiting,
    onExited,
    mountOnEnter,
    unmountOnExit,
    transition: Transition = _NoopTransition__WEBPACK_IMPORTED_MODULE_3__["default"]
  }] = useTabPanel(props);
  // We provide an empty the TabContext so `<Nav>`s in `<TabPanel>`s don't
  // conflict with the top level one.
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_TabContext__WEBPACK_IMPORTED_MODULE_1__["default"].Provider, {
    value: null,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_SelectableContext__WEBPACK_IMPORTED_MODULE_2__["default"].Provider, {
      value: null,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(Transition, {
        in: isActive,
        onEnter: onEnter,
        onEntering: onEntering,
        onEntered: onEntered,
        onExit: onExit,
        onExiting: onExiting,
        onExited: onExited,
        mountOnEnter: mountOnEnter,
        unmountOnExit: unmountOnExit,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(Component, Object.assign({}, tabPanelProps, {
          ref: ref,
          hidden: !isActive,
          "aria-hidden": !isActive
        }))
      })
    })
  });
});
TabPanel.displayName = 'TabPanel';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TabPanel);

/***/ },

/***/ "./node_modules/@restart/ui/esm/Tabs.js"
/*!**********************************************!*\
  !*** ./node_modules/@restart/ui/esm/Tabs.js ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var uncontrollable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uncontrollable */ "./node_modules/@restart/ui/node_modules/uncontrollable/lib/esm/index.js");
/* harmony import */ var _ssr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ssr */ "./node_modules/@react-aria/ssr/dist/SSRProvider.mjs");
/* harmony import */ var _TabContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TabContext */ "./node_modules/@restart/ui/esm/TabContext.js");
/* harmony import */ var _SelectableContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SelectableContext */ "./node_modules/@restart/ui/esm/SelectableContext.js");
/* harmony import */ var _TabPanel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./TabPanel */ "./node_modules/@restart/ui/esm/TabPanel.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");








const Tabs = props => {
  const {
    id: userId,
    generateChildId: generateCustomChildId,
    onSelect: propsOnSelect,
    activeKey: propsActiveKey,
    defaultActiveKey,
    transition,
    mountOnEnter,
    unmountOnExit,
    children
  } = props;
  const [activeKey, onSelect] = (0,uncontrollable__WEBPACK_IMPORTED_MODULE_1__.useUncontrolledProp)(propsActiveKey, defaultActiveKey, propsOnSelect);
  const id = (0,_ssr__WEBPACK_IMPORTED_MODULE_2__.useSSRSafeId)(userId);
  const generateChildId = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => generateCustomChildId || ((key, type) => id ? `${id}-${type}-${key}` : null), [id, generateCustomChildId]);
  const tabContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    onSelect,
    activeKey,
    transition,
    mountOnEnter: mountOnEnter || false,
    unmountOnExit: unmountOnExit || false,
    getControlledId: key => generateChildId(key, 'tabpane'),
    getControllerId: key => generateChildId(key, 'tab')
  }), [onSelect, activeKey, transition, mountOnEnter, unmountOnExit, generateChildId]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_TabContext__WEBPACK_IMPORTED_MODULE_3__["default"].Provider, {
    value: tabContext,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_SelectableContext__WEBPACK_IMPORTED_MODULE_4__["default"].Provider, {
      value: onSelect || null,
      children: children
    })
  });
};
Tabs.Panel = _TabPanel__WEBPACK_IMPORTED_MODULE_5__["default"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Tabs);

/***/ },

/***/ "./resources/pos/src/components/customer/CustomerSalesHistoryModal.js"
/*!****************************************************************************!*\
  !*** ./resources/pos/src/components/customer/CustomerSalesHistoryModal.js ***!
  \****************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Modal.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Tab.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Tabs.js");
/* harmony import */ var _config_apiConfig__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../config/apiConfig */ "./resources/pos/src/config/apiConfig.js");
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




var useListado = function useListado(customerId, endpoint, activo) {
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    filas = _useState2[0],
    setFilas = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      current_page: 1,
      last_page: 1,
      total: 0
    }),
    _useState4 = _slicedToArray(_useState3, 2),
    meta = _useState4[0],
    setMeta = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(""),
    _useState6 = _slicedToArray(_useState5, 2),
    search = _useState6[0],
    setSearch = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(15),
    _useState8 = _slicedToArray(_useState7, 2),
    pageSize = _useState8[0],
    setPageSize = _useState8[1];
  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState0 = _slicedToArray(_useState9, 2),
    cargando = _useState0[0],
    setCargando = _useState0[1];
  var montado = react__WEBPACK_IMPORTED_MODULE_0__.useRef(true);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(function () {
    return function () {
      montado.current = false;
    };
  }, []);
  var cargar = function cargar() {
    var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var overrides = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!customerId) return;
    setCargando(true);
    var params = _objectSpread({
      search: search,
      per_page: pageSize,
      page: page
    }, overrides);
    _config_apiConfig__WEBPACK_IMPORTED_MODULE_4__["default"].get("/customers/".concat(customerId, "/").concat(endpoint), {
      params: params
    }).then(function (res) {
      if (!montado.current) return;
      var data = res.data.data;
      setFilas(data.data || []);
      setMeta({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total
      });
    })["finally"](function () {
      return montado.current && setCargando(false);
    });
  };
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (activo) cargar(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activo, customerId]);

  // Búsqueda en vivo con debounce -- mismo patrón que ya usa
  // Documentos Electrónicos, no depende de apretar Enter. No dispara
  // en el primer render de cada pestaña, solo cuando el usuario
  // efectivamente escribe algo.
  var primerRender = react__WEBPACK_IMPORTED_MODULE_0__.useRef(true);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (!activo) return;
    if (primerRender.current) {
      primerRender.current = false;
      return;
    }
    var timer = setTimeout(function () {
      return cargar(1, {
        search: search
      });
    }, 400);
    return function () {
      return clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);
  return {
    filas: filas,
    meta: meta,
    search: search,
    setSearch: setSearch,
    pageSize: pageSize,
    setPageSize: setPageSize,
    cargando: cargando,
    cargar: cargar
  };
};
var BarraFiltros = function BarraFiltros(_ref) {
  var search = _ref.search,
    setSearch = _ref.setSearch,
    onBuscar = _ref.onBuscar,
    pageSize = _ref.pageSize,
    setPageSize = _ref.setPageSize,
    onCambiarPageSize = _ref.onCambiarPageSize;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    className: "d-flex justify-content-between align-items-center mb-3",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
      type: "text",
      className: "form-control",
      style: {
        maxWidth: 280
      },
      placeholder: "B\xFAsqueda inteligente",
      value: search,
      onChange: function onChange(e) {
        return setSearch(e.target.value);
      },
      onKeyDown: function onKeyDown(e) {
        return e.key === "Enter" && onBuscar();
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "d-flex align-items-center gap-2",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
        className: "fw-bold",
        children: "Mostrar:"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("select", {
        className: "form-select",
        style: {
          width: 80
        },
        value: pageSize,
        onChange: function onChange(e) {
          return onCambiarPageSize(Number(e.target.value));
        },
        children: [15, 25, 50].map(function (n) {
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("option", {
            value: n,
            children: n
          }, n);
        })
      })]
    })]
  });
};
var PiePaginacion = function PiePaginacion(_ref2) {
  var meta = _ref2.meta,
    onCambiarPagina = _ref2.onCambiarPagina;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    className: "d-flex justify-content-between align-items-center mt-3",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "d-flex gap-1",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
        className: "btn btn-sm btn-light",
        disabled: meta.current_page <= 1,
        onClick: function onClick() {
          return onCambiarPagina(meta.current_page - 1);
        },
        children: "\u2039 Anterior"
      }), Array.from({
        length: meta.last_page
      }, function (_, i) {
        return i + 1;
      }).filter(function (p) {
        return p === 1 || p === meta.last_page || Math.abs(p - meta.current_page) <= 1;
      }).map(function (p, i, arr) {
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
          children: [i > 0 && arr[i - 1] !== p - 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
            className: "px-1",
            children: "\u2026"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
            className: "btn btn-sm ".concat(p === meta.current_page ? "btn-primary" : "btn-light"),
            onClick: function onClick() {
              return onCambiarPagina(p);
            },
            children: p
          })]
        }, p);
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
        className: "btn btn-sm btn-light",
        disabled: meta.current_page >= meta.last_page,
        onClick: function onClick() {
          return onCambiarPagina(meta.current_page + 1);
        },
        children: "Siguiente \u203A"
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("span", {
      className: "text-primary fw-bold small",
      children: ["Total registros: ", meta.total]
    })]
  });
};
var CustomerSalesHistoryModal = function CustomerSalesHistoryModal(_ref3) {
  var show = _ref3.show,
    onHide = _ref3.onHide,
    customer = _ref3.customer;
  var _useState1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("resumen"),
    _useState10 = _slicedToArray(_useState1, 2),
    tab = _useState10[0],
    setTab = _useState10[1];
  var resumen = useListado(customer === null || customer === void 0 ? void 0 : customer.id, "sales-summary", show && tab === "resumen");
  var detalle = useListado(customer === null || customer === void 0 ? void 0 : customer.id, "sales-detail", show && tab === "detalle");
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"], {
    show: show,
    onHide: onHide,
    size: "xl",
    centered: true,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Header, {
      closeButton: true,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Title, {
        children: ["Historial de ", customer === null || customer === void 0 ? void 0 : customer.name, " - ", (customer === null || customer === void 0 ? void 0 : customer.identification) || "9999999999999"]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Body, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["default"], {
        activeKey: tab,
        onSelect: setTab,
        className: "mb-3 gap-5",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["default"], {
          eventKey: "resumen",
          title: "Resumen de Ventas",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(BarraFiltros, {
            search: resumen.search,
            setSearch: resumen.setSearch,
            onBuscar: function onBuscar() {
              return resumen.cargar(1);
            },
            pageSize: resumen.pageSize,
            onCambiarPageSize: function onCambiarPageSize(n) {
              resumen.setPageSize(n);
              resumen.cargar(1, {
                per_page: n
              });
            }
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
            className: "table-responsive",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("table", {
              className: "table table-hover",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("thead", {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("tr", {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                    children: "Nro. Orden"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                    children: "Nro. Documento"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                    children: "Fecha Venta"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                    children: "Tipo Documento"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                    children: "Canal Venta"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                    children: "Forma de Pago"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                    children: "Total"
                  })]
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("tbody", {
                children: [resumen.cargando && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("tr", {
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                    colSpan: 7,
                    className: "text-center text-muted",
                    children: "Cargando..."
                  })
                }), !resumen.cargando && resumen.filas.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("tr", {
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                    colSpan: 7,
                    className: "text-center text-muted",
                    children: "Sin ventas registradas."
                  })
                }), resumen.filas.map(function (fila, i) {
                  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("tr", {
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                      children: fila.nro_orden
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                      className: "text-primary",
                      children: fila.nro_documento
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                      children: fila.fecha_venta
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                      children: fila.tipo_documento
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                      children: fila.canal_venta
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                      children: fila.forma_pago
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("td", {
                      children: ["$", Number(fila.total).toFixed(2)]
                    })]
                  }, i);
                })]
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(PiePaginacion, {
            meta: resumen.meta,
            onCambiarPagina: function onCambiarPagina(p) {
              return resumen.cargar(p);
            }
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["default"], {
          eventKey: "detalle",
          title: "Detalle de Ventas",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(BarraFiltros, {
            search: detalle.search,
            setSearch: detalle.setSearch,
            onBuscar: function onBuscar() {
              return detalle.cargar(1);
            },
            pageSize: detalle.pageSize,
            onCambiarPageSize: function onCambiarPageSize(n) {
              detalle.setPageSize(n);
              detalle.cargar(1, {
                per_page: n
              });
            }
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
            className: "table-responsive",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("table", {
              className: "table table-hover",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("thead", {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("tr", {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                    children: "Nro. Orden"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                    children: "Nro. Documento"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                    children: "Fecha Venta"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                    children: "C\xF3digo Producto"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                    children: "Producto/Servicio"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                    children: "Unidad Medida"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                    children: "Unidades"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                    children: "Precio"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                    children: "Descuento"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                    children: "IVA"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                    children: "Subtotal"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                    children: "Total"
                  })]
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("tbody", {
                children: [detalle.cargando && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("tr", {
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                    colSpan: 12,
                    className: "text-center text-muted",
                    children: "Cargando..."
                  })
                }), !detalle.cargando && detalle.filas.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("tr", {
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                    colSpan: 12,
                    className: "text-center text-muted",
                    children: "Sin l\xEDneas registradas."
                  })
                }), detalle.filas.map(function (fila, i) {
                  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("tr", {
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                      children: fila.nro_orden
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                      className: "text-primary",
                      children: fila.nro_documento
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                      children: fila.fecha_venta
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                      children: fila.codigo_producto
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                      children: fila.producto
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                      children: fila.unidad_medida
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                      children: fila.unidades
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("td", {
                      children: ["$", Number(fila.precio).toFixed(2)]
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("td", {
                      children: ["$", Number(fila.descuento).toFixed(2)]
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("td", {
                      children: ["$", Number(fila.iva).toFixed(2)]
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("td", {
                      children: ["$", Number(fila.subtotal).toFixed(2)]
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("td", {
                      children: ["$", Number(fila.total).toFixed(2)]
                    })]
                  }, i);
                })]
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(PiePaginacion, {
            meta: detalle.meta,
            onCambiarPagina: function onCambiarPagina(p) {
              return detalle.cargar(p);
            }
          })]
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Footer, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
        className: "btn btn-light",
        onClick: onHide,
        children: "Cerrar"
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CustomerSalesHistoryModal);

/***/ },

/***/ "./resources/pos/src/components/customer/identificacionField.js"
/*!**********************************************************************!*\
  !*** ./resources/pos/src/components/customer/identificacionField.js ***!
  \**********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _utils_identificacionValidator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/identificacionValidator */ "./resources/pos/src/utils/identificacionValidator.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");



var longitudRequeridaPorTipo = function longitudRequeridaPorTipo(tipo) {
  return tipo === "04" ? 13 : 10;
};
var IdentificacionField = function IdentificacionField(_ref) {
  var tipo = _ref.tipo,
    value = _ref.value,
    onChange = _ref.onChange,
    error = _ref.error,
    isEdit = _ref.isEdit,
    sriLoading = _ref.sriLoading,
    onSriLookup = _ref.onSriLookup;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "col-md-6 mb-3",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
      className: "form-label",
      children: (0,_utils_identificacionValidator__WEBPACK_IMPORTED_MODULE_1__.labelPorTipo)(tipo)
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "input-group",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
        type: "text",
        name: "identification",
        className: "form-control ".concat(error ? "is-invalid" : ""),
        maxLength: (0,_utils_identificacionValidator__WEBPACK_IMPORTED_MODULE_1__.maxLengthPorTipo)(tipo),
        value: value || "",
        onChange: onChange,
        disabled: tipo === "07" || isEdit,
        placeholder: (0,_utils_identificacionValidator__WEBPACK_IMPORTED_MODULE_1__.placeholderPorTipo)(tipo)
      }), !isEdit && (tipo === "05" || tipo === "04") && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
        type: "button",
        className: "btn btn-primary",
        disabled: sriLoading || (value || "").length !== longitudRequeridaPorTipo(tipo),
        onClick: onSriLookup,
        children: sriLoading ? "..." : "SRI"
      })]
    }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
      className: "text-danger",
      style: {
        fontSize: "0.85rem"
      },
      children: error
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (IdentificacionField);

/***/ },

/***/ "./resources/pos/src/components/quotations/CreateQuotation.js"
/*!********************************************************************!*\
  !*** ./resources/pos/src/components/quotations/CreateQuotation.js ***!
  \********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var _QuotationForm__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./QuotationForm */ "./resources/pos/src/components/quotations/QuotationForm.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _header_HeaderTitle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../header/HeaderTitle */ "./resources/pos/src/components/header/HeaderTitle.js");
/* harmony import */ var _store_action_customerAction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../store/action/customerAction */ "./resources/pos/src/store/action/customerAction.js");
/* harmony import */ var _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../store/action/warehouseAction */ "./resources/pos/src/store/action/warehouseAction.js");
/* harmony import */ var _store_action_quotationAction__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../store/action/quotationAction */ "./resources/pos/src/store/action/quotationAction.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");











var CreateQuotation = function CreateQuotation(props) {
  var customers = props.customers,
    fetchAllCustomer = props.fetchAllCustomer,
    warehouses = props.warehouses,
    fetchAllWarehouses = props.fetchAllWarehouses,
    addQuotation = props.addQuotation;
  var navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_2__.useNavigate)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchAllCustomer();
    fetchAllWarehouses();
  }, []);
  var addQuoationData = function addQuoationData(formValue) {
    addQuotation(formValue, navigate);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_4__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_header_HeaderTitle__WEBPACK_IMPORTED_MODULE_5__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.getFormattedMessage)("create-quotation.title"),
      to: "/app/quotations"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_QuotationForm__WEBPACK_IMPORTED_MODULE_3__["default"], {
      addQuoationData: addQuoationData,
      customers: customers,
      warehouses: warehouses
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var customers = state.customers,
    warehouses = state.warehouses,
    totalRecord = state.totalRecord;
  return {
    customers: customers,
    warehouses: warehouses,
    totalRecord: totalRecord
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, {
  fetchAllCustomer: _store_action_customerAction__WEBPACK_IMPORTED_MODULE_6__.fetchAllCustomer,
  fetchAllWarehouses: _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_7__.fetchAllWarehouses,
  addQuotation: _store_action_quotationAction__WEBPACK_IMPORTED_MODULE_8__.addQuotation
})(CreateQuotation));

/***/ },

/***/ "./resources/pos/src/components/quotations/CreateQuotationSale.js"
/*!************************************************************************!*\
  !*** ./resources/pos/src/components/quotations/CreateQuotationSale.js ***!
  \************************************************************************/
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
/* harmony import */ var _store_action_customerAction__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../store/action/customerAction */ "./resources/pos/src/store/action/customerAction.js");
/* harmony import */ var _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../store/action/warehouseAction */ "./resources/pos/src/store/action/warehouseAction.js");
/* harmony import */ var _shared_option_lists_status_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../shared/option-lists/status.json */ "./resources/pos/src/shared/option-lists/status.json");
/* harmony import */ var _shared_components_loaders_Spinner__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shared/components/loaders/Spinner */ "./resources/pos/src/shared/components/loaders/Spinner.js");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var _store_action_quotationAction__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../store/action/quotationAction */ "./resources/pos/src/store/action/quotationAction.js");
/* harmony import */ var _sales_SalesForm__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../sales/SalesForm */ "./resources/pos/src/components/sales/SalesForm.js");
/* harmony import */ var _store_action_salesAction__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../store/action/salesAction */ "./resources/pos/src/store/action/salesAction.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
















var CreateQuotationSale = function CreateQuotationSale(props) {
  var fetchQuotation = props.fetchQuotation,
    quotations = props.quotations,
    customers = props.customers,
    fetchAllCustomer = props.fetchAllCustomer,
    warehouses = props.warehouses,
    fetchAllWarehouses = props.fetchAllWarehouses,
    isLoading = props.isLoading,
    addSale = props.addSale;
  var _useParams = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_2__.useParams)(),
    id = _useParams.id;
  var navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_2__.useNavigate)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchAllCustomer();
    fetchAllWarehouses();
    fetchQuotation(id);
  }, []);
  var addSaleData = function addSaleData(formValue) {
    addSale(formValue, navigate);
  };
  var selectedStatus = quotations && quotations.attributes && quotations.attributes.status && _shared_option_lists_status_json__WEBPACK_IMPORTED_MODULE_7__.filter(function (item) {
    return item.value === quotations.attributes.status;
  });
  var itemsValue = quotations && quotations.attributes && {
    date: quotations.attributes.date,
    warehouse_id: {
      value: quotations.attributes.warehouse_id,
      label: quotations.attributes.warehouse_name
    },
    customer_id: {
      value: quotations.attributes.customer_id,
      label: quotations.attributes.customer_name
    },
    tax_rate: quotations.attributes.tax_rate,
    tax_amount: quotations.attributes.tax_amount,
    discount: quotations.attributes.discount,
    shipping: quotations.attributes.shipping,
    grand_total: quotations.attributes.grand_total,
    amount: quotations.attributes.amount,
    quotation_id: id,
    sale_items: quotations.attributes.quotation_items.map(function (item) {
      return {
        code: item.product && item.product.code,
        name: item.product && item.product.name,
        product_unit: item.product.product_unit,
        product_id: item.product_id,
        short_name: item.sale_unit && item.sale_unit.short_name && item.sale_unit.short_name,
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
        stock: item.product && item.product.stocks.filter(function (item) {
          return item.warehouse_id === quotations.attributes.warehouse_id;
        }),
        sub_total: item.sub_total,
        sale_unit: item.sale_unit && item.sale_unit.id && item.sale_unit.id,
        quantity: item.quantity,
        id: item.id,
        quotation_item_id: item.id,
        newItem: ''
      };
    }),
    id: quotations.id,
    notes: quotations.attributes.note,
    status_id: {
      label: selectedStatus && selectedStatus[0] && selectedStatus[0].label,
      value: selectedStatus && selectedStatus[0] && selectedStatus[0].value
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_3__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_9__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_header_HeaderTitle__WEBPACK_IMPORTED_MODULE_4__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_13__.getFormattedMessage)("sale.create.title"),
      to: "/app/quotations"
    }), isLoading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_shared_components_loaders_Spinner__WEBPACK_IMPORTED_MODULE_8__["default"], {}) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_sales_SalesForm__WEBPACK_IMPORTED_MODULE_11__["default"], {
      singleSale: itemsValue,
      id: id,
      addSaleData: addSaleData,
      isQuotation: true,
      customers: customers,
      warehouses: warehouses
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var customers = state.customers,
    warehouses = state.warehouses,
    isLoading = state.isLoading,
    quotations = state.quotations;
  return {
    customers: customers,
    warehouses: warehouses,
    isLoading: isLoading,
    quotations: quotations
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, {
  fetchQuotation: _store_action_quotationAction__WEBPACK_IMPORTED_MODULE_10__.fetchQuotation,
  editQuotation: _store_action_quotationAction__WEBPACK_IMPORTED_MODULE_10__.editQuotation,
  fetchAllCustomer: _store_action_customerAction__WEBPACK_IMPORTED_MODULE_5__.fetchAllCustomer,
  fetchAllWarehouses: _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_6__.fetchAllWarehouses,
  addSale: _store_action_salesAction__WEBPACK_IMPORTED_MODULE_12__.addSale
})(CreateQuotationSale));

/***/ },

/***/ "./resources/pos/src/components/quotations/DeleteQuotation.js"
/*!********************************************************************!*\
  !*** ./resources/pos/src/components/quotations/DeleteQuotation.js ***!
  \********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _shared_action_buttons_DeleteModel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/action-buttons/DeleteModel */ "./resources/pos/src/shared/action-buttons/DeleteModel.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _store_action_quotationAction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../store/action/quotationAction */ "./resources/pos/src/store/action/quotationAction.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");






var DeleteQuotation = function DeleteQuotation(props) {
  var onDelete = props.onDelete,
    deleteModel = props.deleteModel,
    onClickDeleteModel = props.onClickDeleteModel,
    deleteQuotation = props.deleteQuotation;
  var deleteSaleClick = function deleteSaleClick() {
    deleteQuotation(onDelete.id);
    onClickDeleteModel(false);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
    children: deleteModel && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_shared_action_buttons_DeleteModel__WEBPACK_IMPORTED_MODULE_2__["default"], {
      onClickDeleteModel: onClickDeleteModel,
      deleteModel: deleteModel,
      deleteUserClick: deleteSaleClick,
      name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_3__.getFormattedMessage)("quotation.title")
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(null, {
  deleteQuotation: _store_action_quotationAction__WEBPACK_IMPORTED_MODULE_4__.deleteQuotation
})(DeleteQuotation));

/***/ },

/***/ "./resources/pos/src/components/quotations/EditQuotation.js"
/*!******************************************************************!*\
  !*** ./resources/pos/src/components/quotations/EditQuotation.js ***!
  \******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var _QuotationForm__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./QuotationForm */ "./resources/pos/src/components/quotations/QuotationForm.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _header_HeaderTitle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../header/HeaderTitle */ "./resources/pos/src/components/header/HeaderTitle.js");
/* harmony import */ var _store_action_customerAction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../store/action/customerAction */ "./resources/pos/src/store/action/customerAction.js");
/* harmony import */ var _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../store/action/warehouseAction */ "./resources/pos/src/store/action/warehouseAction.js");
/* harmony import */ var _shared_components_loaders_Spinner__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shared/components/loaders/Spinner */ "./resources/pos/src/shared/components/loaders/Spinner.js");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var _store_action_quotationAction__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../store/action/quotationAction */ "./resources/pos/src/store/action/quotationAction.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");














var EditQuotation = function EditQuotation(props) {
  var fetchQuotation = props.fetchQuotation,
    quotations = props.quotations,
    customers = props.customers,
    fetchAllCustomer = props.fetchAllCustomer,
    warehouses = props.warehouses,
    fetchAllWarehouses = props.fetchAllWarehouses,
    isLoading = props.isLoading;
  var _useParams = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_2__.useParams)(),
    id = _useParams.id;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchAllCustomer();
    fetchAllWarehouses();
    fetchQuotation(id);
  }, []);
  var quotationStatusFilterOptions = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedOptions)(_constants__WEBPACK_IMPORTED_MODULE_12__.quotationStatusOptions);
  var quotationStatusDefaultValue = quotations && quotations.attributes && quotations.attributes.status && quotationStatusFilterOptions.filter(function (item) {
    return item.id === quotations.attributes.status;
  });
  var itemsValue = quotations && quotations.attributes && {
    date: quotations.attributes.date,
    warehouse_id: {
      value: quotations.attributes.warehouse_id,
      label: quotations.attributes.warehouse_name
    },
    customer_id: {
      value: quotations.attributes.customer_id,
      label: quotations.attributes.customer_name
    },
    tax_rate: quotations.attributes.tax_rate,
    tax_amount: quotations.attributes.tax_amount,
    discount: quotations.attributes.discount,
    shipping: quotations.attributes.shipping,
    grand_total: quotations.attributes.grand_total,
    amount: quotations.attributes.amount,
    quotation_items: quotations.attributes.quotation_items.map(function (item) {
      return {
        code: item.product && item.product.code,
        name: item.product && item.product.name,
        product_unit: item.product.product_unit,
        product_id: item.product_id,
        short_name: item.sale_unit && item.sale_unit.short_name && item.sale_unit.short_name,
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
        stock: item.product && item.product.stocks.filter(function (item) {
          return item.warehouse_id === quotations.attributes.warehouse_id;
        }),
        sub_total: item.sub_total,
        sale_unit: item.sale_unit && item.sale_unit.id && item.sale_unit.id,
        quantity: item.quantity,
        id: item.id,
        quotation_item_id: item.id,
        newItem: ''
      };
    }),
    id: quotations.id,
    notes: quotations.attributes.note,
    status_id: {
      label: quotationStatusDefaultValue && quotationStatusDefaultValue[0] && quotationStatusDefaultValue[0].name,
      value: quotationStatusDefaultValue && quotationStatusDefaultValue[0] && quotationStatusDefaultValue[0].id
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_4__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_9__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_header_HeaderTitle__WEBPACK_IMPORTED_MODULE_5__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_11__.getFormattedMessage)('edit-quotation.title'),
      to: "/app/quotations"
    }), isLoading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_shared_components_loaders_Spinner__WEBPACK_IMPORTED_MODULE_8__["default"], {}) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_QuotationForm__WEBPACK_IMPORTED_MODULE_3__["default"], {
      singleQuotation: itemsValue,
      id: id,
      customers: customers,
      warehouses: warehouses
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var customers = state.customers,
    warehouses = state.warehouses,
    isLoading = state.isLoading,
    quotations = state.quotations;
  return {
    customers: customers,
    warehouses: warehouses,
    isLoading: isLoading,
    quotations: quotations
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, {
  fetchQuotation: _store_action_quotationAction__WEBPACK_IMPORTED_MODULE_10__.fetchQuotation,
  editQuotation: _store_action_quotationAction__WEBPACK_IMPORTED_MODULE_10__.editQuotation,
  fetchAllCustomer: _store_action_customerAction__WEBPACK_IMPORTED_MODULE_6__.fetchAllCustomer,
  fetchAllWarehouses: _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_7__.fetchAllWarehouses
})(EditQuotation));

/***/ },

/***/ "./resources/pos/src/components/quotations/ProductMainCalculation.js"
/*!***************************************************************************!*\
  !*** ./resources/pos/src/components/quotations/ProductMainCalculation.js ***!
  \***************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _shared_calculation_calculation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/calculation/calculation */ "./resources/pos/src/shared/calculation/calculation.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");




var ProductMainCalculation = function ProductMainCalculation(props) {
  var inputValues = props.inputValues,
    updateProducts = props.updateProducts,
    frontSetting = props.frontSetting,
    allConfigData = props.allConfigData;
  var totalAmountAfterDiscount = (0,_shared_calculation_calculation__WEBPACK_IMPORTED_MODULE_1__.calculateSubTotal)(updateProducts) - inputValues.discount;
  var taxCal = (totalAmountAfterDiscount * inputValues.tax_rate / 100).toFixed(2);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: "col-xxl-5 col-lg-6 col-md-6 col-12 float-end",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "card",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "card-body pt-7 pb-2",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "table-responsive",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("table", {
            className: "table border",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("tbody", {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("tr", {
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("td", {
                  className: "py-3",
                  children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)("purchase.input.order-tax.label")
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("td", {
                  className: "py-3",
                  children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, taxCal), " ", "(", parseFloat(inputValues.tax_rate ? inputValues.tax_rate : 0).toFixed(2), ") %"]
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("tr", {
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("td", {
                  className: "py-3",
                  children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)("purchase.order-item.table.discount.column.label")
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("td", {
                  className: "py-3",
                  children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, inputValues.discount ? inputValues.discount : 0)
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("tr", {
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("td", {
                  className: "py-3",
                  children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)("purchase.input.shipping.label")
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("td", {
                  className: "py-3",
                  children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, inputValues.shipping ? inputValues.shipping : 0)
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("tr", {
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("td", {
                  className: "py-3 text-primary",
                  children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.getFormattedMessage)("purchase.grant-total.label")
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("td", {
                  className: "py-3 text-primary",
                  children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_2__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, (0,_shared_calculation_calculation__WEBPACK_IMPORTED_MODULE_1__.calculateCartTotalAmount)(updateProducts, inputValues))
                })]
              })]
            })
          })
        })
      })
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProductMainCalculation);

/***/ },

/***/ "./resources/pos/src/components/quotations/QuotationDetails.js"
/*!*********************************************************************!*\
  !*** ./resources/pos/src/components/quotations/QuotationDetails.js ***!
  \*********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap/Form */ "./node_modules/react-bootstrap/esm/Form.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Col.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Row.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Table.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _header_HeaderTitle__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../header/HeaderTitle */ "./resources/pos/src/components/header/HeaderTitle.js");
/* harmony import */ var _shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/tab-title/TabTitle */ "./resources/pos/src/shared/tab-title/TabTitle.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _store_action_frontSettingAction__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../store/action/frontSettingAction */ "./resources/pos/src/store/action/frontSettingAction.js");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "./node_modules/@fortawesome/react-fontawesome/index.es.js");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.mjs");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var _store_action_quotationDetails__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../store/action/quotationDetails */ "./resources/pos/src/store/action/quotationDetails.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");















var QuotationDetails = function QuotationDetails(props) {
  var quotationDetailsAction = props.quotationDetailsAction,
    quotationDetails = props.quotationDetails,
    fetchFrontSetting = props.fetchFrontSetting,
    frontSetting = props.frontSetting,
    allConfigData = props.allConfigData;
  var _useParams = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_6__.useParams)(),
    id = _useParams.id;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchFrontSetting();
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    quotationDetailsAction(id);
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_7__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_14__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_header_HeaderTitle__WEBPACK_IMPORTED_MODULE_8__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)("details-quotations.title"),
      to: "/app/quotations"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_9__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.placeholderText)("details-quotations.title")
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
      className: "card",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
        className: "card-body",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)(react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_1__["default"], {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
            className: "row",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
              className: "col-12",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("h4", {
                className: "font-weight-bold text-center mb-5",
                children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)("details-quotations.title"), " ", ":", " ", quotationDetails && quotationDetails.reference_code]
              })
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_4__["default"], {
            className: "custom-line-height",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"], {
              md: 4,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("h5", {
                className: "text-gray-600 bg-light p-4 mb-0 text-uppercase",
                children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)("sale.detail.customer.info")
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
                className: "p-4",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
                  className: "d-flex align-items-center pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_12__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_13__.faUser,
                    className: "text-primary me-2 fs-5"
                  }), quotationDetails.customer && quotationDetails.customer.name]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
                  className: "d-flex align-items-center pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_12__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_13__.faEnvelope,
                    className: "text-primary me-2 fs-5"
                  }), quotationDetails.customer && quotationDetails.customer.email]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
                  className: "d-flex align-items-center pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_12__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_13__.faMobileAlt,
                    className: "text-primary me-2 fs-5"
                  }), quotationDetails.customer && quotationDetails.customer.phone]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
                  className: "d-flex align-items-center",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_12__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_13__.faLocationDot,
                    className: "text-primary me-2 fs-5"
                  }), quotationDetails.customer && quotationDetails.customer.address]
                })]
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"], {
              md: 4,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("h5", {
                className: "text-gray-600 bg-light p-4 mb-0 text-uppercase",
                children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)("globally.detail.company.info")
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
                className: "p-4",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
                  className: "d-flex align-items-center pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_12__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_13__.faUser,
                    className: "text-primary me-2 fs-5"
                  }), quotationDetails.company_info && quotationDetails.company_info.company_name]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
                  className: "d-flex align-items-center pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_12__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_13__.faEnvelope,
                    className: "text-primary me-2 fs-5"
                  }), quotationDetails.company_info && quotationDetails.company_info.email]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
                  className: "d-flex align-items-center pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_12__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_13__.faMobileAlt,
                    className: "text-primary me-2 fs-5"
                  }), quotationDetails.company_info && quotationDetails.company_info.phone]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
                  className: "d-flex align-items-center",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_12__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_13__.faLocationDot,
                    className: "text-primary me-2 fs-5"
                  }), quotationDetails.company_info && quotationDetails.company_info.address]
                })]
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"], {
              md: 4,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("h5", {
                className: "text-gray-600 bg-light p-4 mb-0 text-uppercase",
                children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)("quotation.detail.invoice.info")
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
                className: "p-4",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
                  className: "pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("span", {
                    className: "me-2",
                    children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)("globally.detail.reference"), " ", ":"]
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("span", {
                    children: quotationDetails && quotationDetails.reference_code
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
                  className: "pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("span", {
                    className: "me-2",
                    children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)("globally.detail.status"), " ", ":"]
                  }), quotationDetails && quotationDetails.status === 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("span", {
                    className: "badge bg-light-warning",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("span", {
                      children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)("status.filter.sent.label")
                    })
                  }) || quotationDetails.status === 2 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("span", {
                    className: "badge bg-light-danger",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("span", {
                      children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)("status.filter.pending.label")
                    })
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
                  className: "pb-1",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("span", {
                    className: "me-2",
                    children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)("globally.detail.warehouse"), " ", ":"]
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("span", {
                    children: quotationDetails.warehouse && quotationDetails.warehouse.name
                  })]
                })]
              })]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
            className: "mt-5",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("h5", {
              className: "text-gray-600 bg-light p-4 mb-5 text-uppercase",
              children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)("globally.detail.order.summary")
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_5__["default"], {
              responsive: true,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("thead", {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("tr", {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("th", {
                    className: "ps-3",
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)("globally.detail.product")
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("th", {
                    className: "ps-3",
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)("globally.detail.net-unit-price")
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("th", {
                    className: "ps-3",
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)("globally.detail.quantity")
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("th", {
                    className: "ps-3",
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)("globally.detail.unit-price")
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("th", {
                    className: "ps-3",
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)("globally.detail.discount")
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("th", {
                    className: "ps-3",
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)("globally.detail.tax")
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("th", {
                    colSpan: 2,
                    children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)("globally.detail.subtotal")
                  })]
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("tbody", {
                children: quotationDetails.quotation_items && quotationDetails.quotation_items.map(function (details, index) {
                  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("tr", {
                    className: "align-middle",
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("td", {
                      className: "ps-3",
                      children: [details.product && details.product.code, " ", "(", details.product && details.product.name, details.product && details.product.variation_type ? " - ".concat(details.product.variation_type.name) : "", ")"]
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("td", {
                      children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, details.net_unit_price)
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("td", {
                      children: details.quantity
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("td", {
                      children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, details.product_price)
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("td", {
                      children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, details.discount_amount)
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("td", {
                      children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, details.tax_amount)
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("td", {
                      children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, details.sub_total)
                    })]
                  }, index);
                })
              })]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
            className: "col-xxl-5 col-lg-6 col-md-6 col-12 float-end",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
              className: "card",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
                className: "card-body pt-7 pb-2",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
                  className: "table-responsive",
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("table", {
                    className: "table border",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("tbody", {
                      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("tr", {
                        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("td", {
                          className: "py-3",
                          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)("globally.detail.order.tax")
                        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("td", {
                          className: "py-3",
                          children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, quotationDetails && quotationDetails.tax_amount > 0 ? quotationDetails.tax_amount : "0.00"), " ", "(", quotationDetails && parseFloat(quotationDetails.tax_rate).toFixed(2), "%)"]
                        })]
                      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("tr", {
                        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("td", {
                          className: "py-3",
                          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)("globally.detail.discount")
                        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("td", {
                          className: "py-3",
                          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, quotationDetails && quotationDetails.discount)
                        })]
                      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("tr", {
                        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("td", {
                          className: "py-3",
                          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)("globally.detail.shipping")
                        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("td", {
                          className: "py-3",
                          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, quotationDetails && quotationDetails.shipping)
                        })]
                      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("tr", {
                        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("td", {
                          className: "py-3 text-primary",
                          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.getFormattedMessage)("globally.detail.grand.total")
                        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("td", {
                          className: "py-3 text-primary",
                          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_10__.currencySymbolHandling)(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, quotationDetails && quotationDetails.grand_total)
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
  var quotationDetails = state.quotationDetails,
    frontSetting = state.frontSetting,
    allConfigData = state.allConfigData;
  return {
    quotationDetails: quotationDetails,
    frontSetting: frontSetting,
    allConfigData: allConfigData
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_2__.connect)(mapStateToProps, {
  quotationDetailsAction: _store_action_quotationDetails__WEBPACK_IMPORTED_MODULE_15__.quotationDetailsAction,
  fetchFrontSetting: _store_action_frontSettingAction__WEBPACK_IMPORTED_MODULE_11__.fetchFrontSetting
})(QuotationDetails));

/***/ },

/***/ "./resources/pos/src/components/quotations/QuotationForm.js"
/*!******************************************************************!*\
  !*** ./resources/pos/src/components/quotations/QuotationForm.js ***!
  \******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Form.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/InputGroup.js");
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
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _store_action_productAction__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../store/action/productAction */ "./resources/pos/src/store/action/productAction.js");
/* harmony import */ var _store_action_salesAction__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../store/action/salesAction */ "./resources/pos/src/store/action/salesAction.js");
/* harmony import */ var _shared_components_product_cart_search_ProductSearch__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../shared/components/product-cart/search/ProductSearch */ "./resources/pos/src/shared/components/product-cart/search/ProductSearch.js");
/* harmony import */ var _shared_components_sales_ProductRowTable__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../shared/components/sales/ProductRowTable */ "./resources/pos/src/shared/components/sales/ProductRowTable.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _shared_datepicker_ReactDatePicker__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../shared/datepicker/ReactDatePicker */ "./resources/pos/src/shared/datepicker/ReactDatePicker.js");
/* harmony import */ var _ProductMainCalculation__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./ProductMainCalculation */ "./resources/pos/src/components/quotations/ProductMainCalculation.js");
/* harmony import */ var _shared_calculation_calculation__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../shared/calculation/calculation */ "./resources/pos/src/shared/calculation/calculation.js");
/* harmony import */ var _shared_prepareArray_prepareSaleArray__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../shared/prepareArray/prepareSaleArray */ "./resources/pos/src/shared/prepareArray/prepareSaleArray.js");
/* harmony import */ var _shared_components_modelFooter__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../shared/components/modelFooter */ "./resources/pos/src/shared/components/modelFooter.js");
/* harmony import */ var _store_action_toastAction__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../store/action/toastAction */ "./resources/pos/src/store/action/toastAction.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _store_action_frontSettingAction__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../../store/action/frontSettingAction */ "./resources/pos/src/store/action/frontSettingAction.js");
/* harmony import */ var _shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../../shared/select/reactSelect */ "./resources/pos/src/shared/select/reactSelect.js");
/* harmony import */ var _store_action_quotationAction__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../../store/action/quotationAction */ "./resources/pos/src/store/action/quotationAction.js");
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








dayjs__WEBPACK_IMPORTED_MODULE_4___default().extend((dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_5___default()));
dayjs__WEBPACK_IMPORTED_MODULE_4___default().extend((dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_6___default()));
dayjs__WEBPACK_IMPORTED_MODULE_4___default().extend((dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_7___default()));
dayjs__WEBPACK_IMPORTED_MODULE_4___default().extend((dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_8___default()));

















var QuotationForm = function QuotationForm(props) {
  var addQuoationData = props.addQuoationData,
    id = props.id,
    customers = props.customers,
    warehouses = props.warehouses,
    singleQuotation = props.singleQuotation,
    customProducts = props.customProducts,
    products = props.products,
    fetchProductsByWarehouse = props.fetchProductsByWarehouse,
    fetchFrontSetting = props.fetchFrontSetting,
    frontSetting = props.frontSetting,
    editQuotation = props.editQuotation,
    allConfigData = props.allConfigData;
  var navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_1__.useNavigate)();
  var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_9__.useDispatch)();
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    updateProducts = _useState2[0],
    setUpdateProducts = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0),
    _useState4 = _slicedToArray(_useState3, 2),
    quantity = _useState4[0],
    setQuantity = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState6 = _slicedToArray(_useState5, 2),
    newCost = _useState6[0],
    setNewCost = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState8 = _slicedToArray(_useState7, 2),
    newDiscount = _useState8[0],
    setNewDiscount = _useState8[1];
  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState0 = _slicedToArray(_useState9, 2),
    newTax = _useState0[0],
    setNewTax = _useState0[1];
  var _useState1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState10 = _slicedToArray(_useState1, 2),
    subTotal = _useState10[0],
    setSubTotal = _useState10[1];
  var _useState11 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState12 = _slicedToArray(_useState11, 2),
    newSaleUnit = _useState12[0],
    setNewSaleUnit = _useState12[1];
  var _useState13 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      date: new Date(),
      customer_id: '',
      warehouse_id: '',
      tax_rate: "0.00",
      tax_amount: 0.00,
      discount: "0.00",
      shipping: "0.00",
      grand_total: 0.00,
      notes: singleQuotation ? singleQuotation.notes : '',
      received_amount: 0,
      paid_amount: 0,
      status_id: {
        label: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.getFormattedMessage)('status.filter.sent.label'),
        value: 1
      }
    }),
    _useState14 = _slicedToArray(_useState13, 2),
    saleValue = _useState14[0],
    setSaleValue = _useState14[1];
  var _useState15 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      date: '',
      customer_id: '',
      warehouse_id: '',
      status_id: ''
    }),
    _useState16 = _slicedToArray(_useState15, 2),
    errors = _useState16[0],
    setErrors = _useState16[1];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    setUpdateProducts(updateProducts);
  }, [updateProducts, quantity, newCost, newDiscount, newTax, subTotal, newSaleUnit]);
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
    if (singleQuotation) {
      setSaleValue({
        date: singleQuotation ? dayjs__WEBPACK_IMPORTED_MODULE_4___default()(singleQuotation.date).toDate() : '',
        customer_id: singleQuotation ? singleQuotation.customer_id : '',
        warehouse_id: singleQuotation ? singleQuotation.warehouse_id : '',
        tax_rate: singleQuotation ? singleQuotation.tax_rate.toFixed(2) : '0.00',
        tax_amount: singleQuotation ? singleQuotation.tax_amount.toFixed(2) : '0.00',
        discount: singleQuotation ? singleQuotation.discount.toFixed(2) : '0.00',
        shipping: singleQuotation ? singleQuotation.shipping.toFixed(2) : '0.00',
        grand_total: singleQuotation ? singleQuotation.grand_total : '0.00',
        status_id: singleQuotation ? singleQuotation.status_id : ''
      });
    }
  }, [singleQuotation]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (singleQuotation) {
      setUpdateProducts(singleQuotation.quotation_items);
    }
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    var _saleValue$warehouse_;
    saleValue.warehouse_id.value && fetchProductsByWarehouse(saleValue === null || saleValue === void 0 || (_saleValue$warehouse_ = saleValue.warehouse_id) === null || _saleValue$warehouse_ === void 0 ? void 0 : _saleValue$warehouse_.value);
  }, [saleValue.warehouse_id.value]);
  var handleValidation = function handleValidation() {
    var error = {};
    var isValid = false;
    var qtyCart = updateProducts.filter(function (a) {
      return a.quantity === 0;
    });
    if (!saleValue.date) {
      error['date'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.getFormattedMessage)('globally.date.validate.label');
    } else if (!saleValue.warehouse_id) {
      error['warehouse_id'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.getFormattedMessage)('product.input.warehouse.validate.label');
    } else if (!saleValue.customer_id) {
      error['customer_id'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.getFormattedMessage)('sale.select.customer.validate.label');
    } else if (qtyCart.length > 0) {
      dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_20__.addToast)({
        text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.getFormattedMessage)('globally.product-quantity.validate.message'),
        type: _constants__WEBPACK_IMPORTED_MODULE_21__.toastType.ERROR
      }));
    } else if (updateProducts.length < 1) {
      dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_20__.addToast)({
        text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.getFormattedMessage)('purchase.product-list.validate.message'),
        type: _constants__WEBPACK_IMPORTED_MODULE_21__.toastType.ERROR
      }));
    } else if (!saleValue.status_id) {
      error['status_id'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.getFormattedMessage)("globally.status.validate.label");
    } else {
      isValid = true;
    }
    setErrors(error);
    return isValid;
  };
  var onWarehouseChange = function onWarehouseChange(obj) {
    setSaleValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, {
        warehouse_id: obj
      });
    });
    setErrors('');
  };
  var onCustomerChange = function onCustomerChange(obj) {
    setSaleValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, {
        customer_id: obj
      });
    });
    setErrors('');
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
    setSaleValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, _defineProperty({}, e.target.name, value && value));
    });
  };
  var onNotesChangeInput = function onNotesChangeInput(e) {
    e.preventDefault();
    setSaleValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, {
        notes: e.target.value
      });
    });
  };
  var onStatusChange = function onStatusChange(obj) {
    setSaleValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, {
        status_id: obj
      });
    });
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
    setSaleValue(function (previousState) {
      return _objectSpread(_objectSpread({}, previousState), {}, {
        date: date
      });
    });
    setErrors('');
  };
  var quotationStatusFilterOptions = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.getFormattedOptions)(_constants__WEBPACK_IMPORTED_MODULE_21__.quotationStatusOptions);
  var prepareFormData = function prepareFormData(prepareData) {
    var formValue = {
      date: dayjs__WEBPACK_IMPORTED_MODULE_4___default()(prepareData.date).toDate(),
      customer_id: prepareData.customer_id.value ? prepareData.customer_id.value : prepareData.customer_id,
      warehouse_id: prepareData.warehouse_id.value ? prepareData.warehouse_id.value : prepareData.warehouse_id,
      discount: prepareData.discount,
      tax_rate: prepareData.tax_rate,
      tax_amount: (0,_shared_calculation_calculation__WEBPACK_IMPORTED_MODULE_17__.calculateCartTotalTaxAmount)(updateProducts, saleValue),
      quotation_items: updateProducts,
      shipping: prepareData.shipping,
      grand_total: (0,_shared_calculation_calculation__WEBPACK_IMPORTED_MODULE_17__.calculateCartTotalAmount)(updateProducts, saleValue),
      received_amount: 0,
      paid_amount: 0,
      note: prepareData.notes,
      status: prepareData.status_id.value ? prepareData.status_id.value : prepareData.status_id
    };
    return formValue;
  };
  var onSubmit = function onSubmit(event) {
    event.preventDefault();
    var valid = handleValidation();
    if (valid) {
      if (singleQuotation) {
        editQuotation(id, prepareFormData(saleValue), navigate);
      } else {
        addQuoationData(prepareFormData(saleValue));
        setSaleValue(saleValue);
      }
    }
  };
  var onBlurInput = function onBlurInput(el) {
    if (el.target.value === '') {
      if (el.target.name === "shipping") {
        setSaleValue(_objectSpread(_objectSpread({}, saleValue), {}, {
          shipping: "0.00"
        }));
      }
      if (el.target.name === "discount") {
        setSaleValue(_objectSpread(_objectSpread({}, saleValue), {}, {
          discount: "0.00"
        }));
      }
      if (el.target.name === "tax_rate") {
        setSaleValue(_objectSpread(_objectSpread({}, saleValue), {}, {
          tax_rate: "0.00"
        }));
      }
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("div", {
    className: "card",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("div", {
      className: "card-body",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("div", {
        className: "row",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("div", {
          className: "col-md-4",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.getFormattedMessage)('react-data-table.date.column.label'), ":"]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("span", {
            className: "required"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("div", {
            className: "position-relative",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_shared_datepicker_ReactDatePicker__WEBPACK_IMPORTED_MODULE_15__["default"], {
              onChangeDate: handleCallback,
              newStartDate: saleValue.date
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("span", {
            className: "text-danger d-block fw-400 fs-small mt-2",
            children: errors['date'] ? errors['date'] : null
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("div", {
          className: "col-md-4",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_23__["default"], {
            name: "warehouse_id",
            data: warehouses,
            onChange: onWarehouseChange,
            title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.getFormattedMessage)('warehouse.title'),
            errors: errors['warehouse_id'],
            defaultValue: saleValue.warehouse_id,
            value: saleValue.warehouse_id,
            addSearchItems: singleQuotation,
            isWarehouseDisable: true,
            placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.placeholderText)('purchase.select.warehouse.placeholder.label')
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("div", {
          className: "col-md-4",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_23__["default"], {
            name: "customer_id",
            data: customers,
            onChange: onCustomerChange,
            title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.getFormattedMessage)('customer.title'),
            errors: errors['customer_id'],
            defaultValue: saleValue.customer_id,
            value: saleValue.customer_id,
            placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.placeholderText)('sale.select.customer.placeholder.label')
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("div", {
          className: "mb-5",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.getFormattedMessage)('product.title'), ":"]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_shared_components_product_cart_search_ProductSearch__WEBPACK_IMPORTED_MODULE_12__["default"], {
            values: saleValue,
            products: products,
            handleValidation: handleValidation,
            updateProducts: updateProducts,
            setUpdateProducts: setUpdateProducts,
            customProducts: customProducts
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("div", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.getFormattedMessage)('purchase.order-item.table.label'), ":"]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("span", {
            className: "required"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_shared_components_sales_ProductRowTable__WEBPACK_IMPORTED_MODULE_13__["default"], {
            updateProducts: updateProducts,
            setUpdateProducts: setUpdateProducts,
            updatedQty: updatedQty,
            frontSetting: frontSetting,
            updateCost: updateCost,
            updateDiscount: updateDiscount,
            updateTax: updateTax,
            updateSubTotal: updateSubTotal,
            updateSaleUnit: updateSaleUnit
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("div", {
          className: "col-12",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ProductMainCalculation__WEBPACK_IMPORTED_MODULE_16__["default"], {
            inputValues: saleValue,
            allConfigData: allConfigData,
            updateProducts: updateProducts,
            frontSetting: frontSetting
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("div", {
          className: "col-md-4 mb-3",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.getFormattedMessage)('purchase.input.order-tax.label'), ": "]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"], {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("input", {
              "aria-label": "Dollar amount (with dot and two decimal places)",
              className: "form-control",
              type: "text",
              name: "tax_rate",
              value: saleValue.tax_rate,
              onBlur: function onBlur(event) {
                return onBlurInput(event);
              },
              onFocus: function onFocus(event) {
                return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.onFocusInput)(event);
              },
              onKeyPress: function onKeyPress(event) {
                return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.decimalValidate)(event);
              },
              onChange: function onChange(e) {
                onChangeInput(e);
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"].Text, {
              children: "%"
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("div", {
          className: "col-md-4 mb-3",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__["default"].Label, {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.getFormattedMessage)('purchase.order-item.table.discount.column.label'), ": "]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"], {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("input", {
              "aria-label": "Dollar amount (with dot and two decimal places)",
              className: "form-control",
              type: "text",
              name: "discount",
              value: saleValue.discount,
              onBlur: function onBlur(event) {
                return onBlurInput(event);
              },
              onFocus: function onFocus(event) {
                return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.onFocusInput)(event);
              },
              onKeyPress: function onKeyPress(event) {
                return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.decimalValidate)(event);
              },
              onChange: function onChange(e) {
                return onChangeInput(e);
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"].Text, {
              children: frontSetting.value && frontSetting.value.currency_symbol
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("div", {
          className: "col-md-4 mb-3",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.getFormattedMessage)('purchase.input.shipping.label'), ": "]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"], {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("input", {
              "aria-label": "Dollar amount (with dot and two decimal places)",
              type: "text",
              className: "form-control",
              name: "shipping",
              value: saleValue.shipping,
              onBlur: function onBlur(event) {
                return onBlurInput(event);
              },
              onFocus: function onFocus(event) {
                return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.onFocusInput)(event);
              },
              onKeyPress: function onKeyPress(event) {
                return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.decimalValidate)(event);
              },
              onChange: function onChange(e) {
                return onChangeInput(e);
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"].Text, {
              children: frontSetting.value && frontSetting.value.currency_symbol
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("div", {
          className: "col-md-4",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_23__["default"], {
            multiLanguageOption: quotationStatusFilterOptions,
            name: "status_id",
            onChange: onStatusChange,
            title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.getFormattedMessage)('purchase.select.status.label'),
            value: saleValue.status_id,
            errors: errors['status_id'],
            placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.placeholderText)('purchase.select.status.placeholder.label')
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("div", {
          className: "mb-3 mt-2",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("label", {
            className: "form-label",
            children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.getFormattedMessage)('globally.input.notes.label'), ": "]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("textarea", {
            name: "notes",
            className: "form-control",
            value: saleValue.notes,
            placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_14__.placeholderText)('globally.input.notes.placeholder.label'),
            onChange: function onChange(e) {
              return onNotesChangeInput(e);
            }
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_shared_components_modelFooter__WEBPACK_IMPORTED_MODULE_19__["default"], {
          onEditRecord: singleQuotation,
          onSubmit: onSubmit,
          link: "/app/quotations"
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
    customProducts: (0,_shared_prepareArray_prepareSaleArray__WEBPACK_IMPORTED_MODULE_18__.prepareSaleProductArray)(products),
    purchaseProducts: purchaseProducts,
    products: products,
    frontSetting: frontSetting,
    allConfigData: allConfigData
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_9__.connect)(mapStateToProps, {
  editSale: _store_action_salesAction__WEBPACK_IMPORTED_MODULE_11__.editSale,
  editQuotation: _store_action_quotationAction__WEBPACK_IMPORTED_MODULE_24__.editQuotation,
  fetchProductsByWarehouse: _store_action_productAction__WEBPACK_IMPORTED_MODULE_10__.fetchProductsByWarehouse,
  fetchFrontSetting: _store_action_frontSettingAction__WEBPACK_IMPORTED_MODULE_22__.fetchFrontSetting
})(QuotationForm));

/***/ },

/***/ "./resources/pos/src/components/quotations/Quotations.js"
/*!***************************************************************!*\
  !*** ./resources/pos/src/components/quotations/Quotations.js ***!
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
/* harmony import */ var _store_action_salesAction__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../store/action/salesAction */ "./resources/pos/src/store/action/salesAction.js");
/* harmony import */ var _DeleteQuotation__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./DeleteQuotation */ "./resources/pos/src/components/quotations/DeleteQuotation.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _shared_action_buttons_ActionDropDownButton__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../shared/action-buttons/ActionDropDownButton */ "./resources/pos/src/shared/action-buttons/ActionDropDownButton.js");
/* harmony import */ var _store_action_frontSettingAction__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../store/action/frontSettingAction */ "./resources/pos/src/store/action/frontSettingAction.js");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var _store_action_quotationAction__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../store/action/quotationAction */ "./resources/pos/src/store/action/quotationAction.js");
/* harmony import */ var _store_action_downloadReportAction__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../store/action/downloadReportAction */ "./resources/pos/src/store/action/downloadReportAction.js");
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













var Quotations = function Quotations(props) {
  var totalRecord = props.totalRecord,
    isLoading = props.isLoading,
    downloadPdf = props.downloadPdf,
    fetchFrontSetting = props.fetchFrontSetting,
    frontSetting = props.frontSetting,
    isCallSaleApi = props.isCallSaleApi,
    fetchQuotations = props.fetchQuotations,
    quotations = props.quotations,
    allConfigData = props.allConfigData;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    deleteModel = _useState2[0],
    setDeleteModel = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState4 = _slicedToArray(_useState3, 2),
    isDelete = _useState4[0],
    setIsDelete = _useState4[1];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchFrontSetting();
  }, []);
  var currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol;
  var onChange = function onChange(filter) {
    fetchQuotations(filter, true);
  };

  //quotation edit function
  var goToEdit = function goToEdit(item) {
    var id = item.id;
    window.location.href = "#/app/quotations/edit/" + id;
  };

  // delete quotation function
  var onClickDeleteModel = function onClickDeleteModel() {
    var isDelete = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    setDeleteModel(!deleteModel);
    setIsDelete(isDelete);
  };

  //quotation sale create function
  var onCreateSaleClick = function onCreateSaleClick(item) {
    var id = item.id;
    window.location.href = "#/app/quotations/Create_sale/" + id;
  };

  //quotation details function
  var goToDetailScreen = function goToDetailScreen(ProductId) {
    window.location.href = "#/app/quotations/detail/" + ProductId;
  };

  //onClick pdf function
  var onPdfClick = function onPdfClick(id) {
    downloadPdf("quotation-pdf-download/".concat(id), 'quotation_pdf_url');
  };
  var itemsValue = currencySymbol && quotations.length >= 0 && quotations.map(function (quotation) {
    return {
      date: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedDate)(quotation.attributes.date, allConfigData && allConfigData),
      // date_for_payment: sale.attributes.date,
      is_sale_created: quotation.attributes.is_sale_created,
      time: dayjs__WEBPACK_IMPORTED_MODULE_1___default()(quotation.attributes.created_at).format("LT"),
      reference_code: quotation.attributes.reference_code,
      customer_name: quotation.attributes.customer_name,
      warehouse_name: quotation.attributes.warehouse_name,
      status: quotation.attributes.status,
      grand_total: quotation.attributes.grand_total,
      paid_amount: quotation.attributes.paid_amount ? sale.attributes.paid_amount : 0.0.toFixed(2),
      id: quotation.id,
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
        className: "badge bg-light-warning",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("span", {
          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("status.filter.sent.label")
        })
      }) || row.status === 2 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("span", {
        className: "badge bg-light-danger",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("span", {
          children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("status.filter.pending.label")
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
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("globally.react-table.column.created-date.label"),
    selector: function selector(row) {
      return row.date;
    },
    sortField: "date",
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
    name: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("react-data-table.action.column.label"),
    right: true,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    cell: function cell(row) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_shared_action_buttons_ActionDropDownButton__WEBPACK_IMPORTED_MODULE_13__["default"], {
        item: row,
        goToEditProduct: goToEdit,
        isEditMode: true,
        isPdfIcon: true,
        onClickDeleteModel: onClickDeleteModel,
        onPdfClick: onPdfClick,
        title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("quotation.title"),
        isCreatesSales: true,
        onCreateSaleClick: onCreateSaleClick,
        isViewIcon: true,
        goToDetailScreen: goToDetailScreen
      });
    }
  }];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_7__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_15__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_8__["default"], {
      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.placeholderText)("quotations.title")
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_shared_table_ReactDataTable__WEBPACK_IMPORTED_MODULE_9__["default"], {
      columns: columns,
      items: itemsValue,
      to: "#/app/quotations/create",
      ButtonValue: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_12__.getFormattedMessage)("create-quotation.title"),
      isCallSaleApi: isCallSaleApi,
      isShowDateRangeField: true,
      onChange: onChange,
      totalRows: totalRecord,
      goToEdit: goToEdit,
      isLoading: isLoading,
      isShowFilterField: true,
      isStatus: true
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_DeleteQuotation__WEBPACK_IMPORTED_MODULE_11__["default"], {
      onClickDeleteModel: onClickDeleteModel,
      deleteModel: deleteModel,
      onDelete: isDelete
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var sales = state.sales,
    totalRecord = state.totalRecord,
    isLoading = state.isLoading,
    frontSetting = state.frontSetting,
    isCallSaleApi = state.isCallSaleApi,
    quotations = state.quotations,
    allConfigData = state.allConfigData;
  return {
    sales: sales,
    totalRecord: totalRecord,
    isLoading: isLoading,
    frontSetting: frontSetting,
    isCallSaleApi: isCallSaleApi,
    quotations: quotations,
    allConfigData: allConfigData
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_6__.connect)(mapStateToProps, {
  fetchSales: _store_action_salesAction__WEBPACK_IMPORTED_MODULE_10__.fetchSales,
  fetchFrontSetting: _store_action_frontSettingAction__WEBPACK_IMPORTED_MODULE_14__.fetchFrontSetting,
  fetchQuotations: _store_action_quotationAction__WEBPACK_IMPORTED_MODULE_16__.fetchQuotations,
  downloadPdf: _store_action_downloadReportAction__WEBPACK_IMPORTED_MODULE_17__.downloadPdf
})(Quotations));

/***/ },

/***/ "./resources/pos/src/components/sales/SalesForm.js"
/*!*********************************************************!*\
  !*** ./resources/pos/src/components/sales/SalesForm.js ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Button.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/Form.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/InputGroup.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Tab.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Tabs.js");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "./node_modules/@fortawesome/react-fontawesome/index.es.js");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.mjs");
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
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _store_action_productAction__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../store/action/productAction */ "./resources/pos/src/store/action/productAction.js");
/* harmony import */ var _store_action_salesAction__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../store/action/salesAction */ "./resources/pos/src/store/action/salesAction.js");
/* harmony import */ var _shared_components_product_cart_search_ProductSearch__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../shared/components/product-cart/search/ProductSearch */ "./resources/pos/src/shared/components/product-cart/search/ProductSearch.js");
/* harmony import */ var _shared_components_sales_ProductRowTable__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../shared/components/sales/ProductRowTable */ "./resources/pos/src/shared/components/sales/ProductRowTable.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _shared_datepicker_ReactDatePicker__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../shared/datepicker/ReactDatePicker */ "./resources/pos/src/shared/datepicker/ReactDatePicker.js");
/* harmony import */ var _ProductMainCalculation__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./ProductMainCalculation */ "./resources/pos/src/components/sales/ProductMainCalculation.js");
/* harmony import */ var _shared_calculation_calculation__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../../shared/calculation/calculation */ "./resources/pos/src/shared/calculation/calculation.js");
/* harmony import */ var _shared_prepareArray_prepareSaleArray__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../../shared/prepareArray/prepareSaleArray */ "./resources/pos/src/shared/prepareArray/prepareSaleArray.js");
/* harmony import */ var _shared_components_modelFooter__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../../shared/components/modelFooter */ "./resources/pos/src/shared/components/modelFooter.js");
/* harmony import */ var _store_action_toastAction__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../../store/action/toastAction */ "./resources/pos/src/store/action/toastAction.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _store_action_frontSettingAction__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ../../store/action/frontSettingAction */ "./resources/pos/src/store/action/frontSettingAction.js");
/* harmony import */ var _shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ../../shared/select/reactSelect */ "./resources/pos/src/shared/select/reactSelect.js");
/* harmony import */ var _frontend_components_customerModel_CustomerForm__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ../../frontend/components/customerModel/CustomerForm */ "./resources/pos/src/frontend/components/customerModel/CustomerForm.js");
/* harmony import */ var _customer_CustomerSalesHistoryModal__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ../customer/CustomerSalesHistoryModal */ "./resources/pos/src/components/customer/CustomerSalesHistoryModal.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
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











dayjs__WEBPACK_IMPORTED_MODULE_9___default().extend((dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_10___default()));
dayjs__WEBPACK_IMPORTED_MODULE_9___default().extend((dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_11___default()));
dayjs__WEBPACK_IMPORTED_MODULE_9___default().extend((dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_12___default()));
dayjs__WEBPACK_IMPORTED_MODULE_9___default().extend((dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_13___default()));


















var SalesForm = function SalesForm(props) {
  var _saleValue$payment_st;
  var addSaleData = props.addSaleData,
    editSale = props.editSale,
    id = props.id,
    customers = props.customers,
    warehouses = props.warehouses,
    singleSale = props.singleSale,
    customProducts = props.customProducts,
    products = props.products,
    fetchProductsByWarehouse = props.fetchProductsByWarehouse,
    fetchFrontSetting = props.fetchFrontSetting,
    frontSetting = props.frontSetting,
    isQuotation = props.isQuotation,
    allConfigData = props.allConfigData;
  var navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_1__.useNavigate)();
  var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_14__.useDispatch)();
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    updateProducts = _useState2[0],
    setUpdateProducts = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0),
    _useState4 = _slicedToArray(_useState3, 2),
    quantity = _useState4[0],
    setQuantity = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState6 = _slicedToArray(_useState5, 2),
    newCost = _useState6[0],
    setNewCost = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState8 = _slicedToArray(_useState7, 2),
    newDiscount = _useState8[0],
    setNewDiscount = _useState8[1];
  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState0 = _slicedToArray(_useState9, 2),
    newTax = _useState0[0],
    setNewTax = _useState0[1];
  var _useState1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState10 = _slicedToArray(_useState1, 2),
    subTotal = _useState10[0],
    setSubTotal = _useState10[1];
  var _useState11 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState12 = _slicedToArray(_useState11, 2),
    newSaleUnit = _useState12[0],
    setNewSaleUnit = _useState12[1];
  var _useState13 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState14 = _slicedToArray(_useState13, 2),
    isPaymentType = _useState14[0],
    setIsPaymentType = _useState14[1];
  var _useState15 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState16 = _slicedToArray(_useState15, 2),
    emitirFacturaSri = _useState16[0],
    setEmitirFacturaSri = _useState16[1];
  var _useState17 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState18 = _slicedToArray(_useState17, 2),
    modalShowCustomer = _useState18[0],
    setModalShowCustomer = _useState18[1];
  var _useState19 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState20 = _slicedToArray(_useState19, 2),
    modalEditCustomer = _useState20[0],
    setModalEditCustomer = _useState20[1];
  var _useState21 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState22 = _slicedToArray(_useState21, 2),
    modalHistorial = _useState22[0],
    setModalHistorial = _useState22[1];
  var _useState23 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      date: new Date(),
      customer_id: '',
      warehouse_id: '',
      tax_rate: "0.00",
      tax_amount: 0.00,
      discount: "0.00",
      shipping: "0.00",
      grand_total: 0.00,
      notes: singleSale ? singleSale.notes : '',
      received_amount: 0,
      paid_amount: 0,
      status_id: {
        label: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)("status.filter.complated.label"),
        value: 1
      },
      payment_status: {
        label: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)("payment-status.filter.unpaid.label"),
        value: 2
      },
      payment_type: {
        label: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)("payment-type.filter.cash.label"),
        value: 1
      }
    }),
    _useState24 = _slicedToArray(_useState23, 2),
    saleValue = _useState24[0],
    setSaleValue = _useState24[1];
  var _useState25 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      date: '',
      customer_id: '',
      warehouse_id: '',
      status_id: '',
      payment_status: '',
      payment_type: ''
    }),
    _useState26 = _slicedToArray(_useState25, 2),
    errors = _useState26[0],
    setErrors = _useState26[1];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    setUpdateProducts(updateProducts);
  }, [updateProducts, quantity, newCost, newDiscount, newTax, subTotal, newSaleUnit]);
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
    if (singleSale && !isQuotation) {
      setSaleValue({
        date: singleSale ? dayjs__WEBPACK_IMPORTED_MODULE_9___default()(singleSale.date, 'YYYY-MM-DD').toDate() : '',
        customer_id: singleSale ? singleSale.customer_id : '',
        quotation_id: singleSale ? singleSale.quotation_id : '',
        warehouse_id: singleSale ? singleSale.warehouse_id : '',
        tax_rate: singleSale ? singleSale.tax_rate.toFixed(2) : '0.00',
        tax_amount: singleSale ? singleSale.tax_amount.toFixed(2) : '0.00',
        discount: singleSale ? singleSale.discount.toFixed(2) : '0.00',
        shipping: singleSale ? singleSale.shipping.toFixed(2) : '0.00',
        grand_total: singleSale ? singleSale.grand_total : '0.00',
        status_id: singleSale ? singleSale.status_id : '',
        payment_status: singleSale.is_Partial === 3 ? {
          "label": (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)('payment-status.filter.partial.label'),
          "value": 3
        } : singleSale ? singleSale.payment_status : '',
        payment_type: singleSale ? singleSale.payment_type : ''
      });
    }
    if (singleSale && isQuotation) {
      setSaleValue({
        date: singleSale ? dayjs__WEBPACK_IMPORTED_MODULE_9___default()(singleSale.date, 'YYYY-MM-DD').toDate() : '',
        quotation_id: singleSale ? singleSale.quotation_id : '',
        customer_id: singleSale ? singleSale.customer_id : '',
        warehouse_id: singleSale ? singleSale.warehouse_id : '',
        tax_rate: singleSale ? singleSale.tax_rate.toFixed(2) : '0.00',
        tax_amount: singleSale ? singleSale.tax_amount.toFixed(2) : '0.00',
        discount: singleSale ? singleSale.discount.toFixed(2) : '0.00',
        shipping: singleSale ? singleSale.shipping.toFixed(2) : '0.00',
        grand_total: singleSale ? singleSale.grand_total : '0.00',
        status_id: singleSale ? singleSale.status_id : '',
        payment_status: saleValue.payment_status ? saleValue.payment_status : '',
        payment_type: {
          label: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)("payment-type.filter.cash.label"),
          value: 1
        }
      });
    }
  }, [singleSale]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (singleSale) {
      setUpdateProducts(singleSale.sale_items);
    }
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    var _saleValue$warehouse_;
    saleValue.warehouse_id.value && fetchProductsByWarehouse(saleValue === null || saleValue === void 0 || (_saleValue$warehouse_ = saleValue.warehouse_id) === null || _saleValue$warehouse_ === void 0 ? void 0 : _saleValue$warehouse_.value);
  }, [saleValue.warehouse_id.value]);
  var handleValidation = function handleValidation() {
    var error = {};
    var isValid = false;
    var qtyCart = updateProducts.filter(function (a) {
      return a.quantity === 0;
    });
    if (!saleValue.date) {
      error['date'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)('globally.date.validate.label');
    } else if (!saleValue.warehouse_id) {
      error['warehouse_id'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)('product.input.warehouse.validate.label');
    } else if (!saleValue.customer_id) {
      error['customer_id'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)('sale.select.customer.validate.label');
    } else if (qtyCart.length > 0) {
      dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_25__.addToast)({
        text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)('globally.product-quantity.validate.message'),
        type: _constants__WEBPACK_IMPORTED_MODULE_26__.toastType.ERROR
      }));
    } else if (updateProducts.length < 1) {
      dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_25__.addToast)({
        text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)('purchase.product-list.validate.message'),
        type: _constants__WEBPACK_IMPORTED_MODULE_26__.toastType.ERROR
      }));
    } else if (!saleValue.status_id) {
      error['status_id'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)("globally.status.validate.label");
    } else if (!saleValue.payment_status) {
      error['payment_status'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)("globally.payment.status.validate.label");
    } else if (!saleValue.payment_type) {
      error['payment_type'] = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)("globally.payment.type.validate.label");
    } else {
      isValid = true;
    }
    setErrors(error);
    return isValid;
  };
  var onWarehouseChange = function onWarehouseChange(obj) {
    setSaleValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, {
        warehouse_id: obj
      });
    });
    setErrors('');
  };
  var onCustomerChange = function onCustomerChange(obj) {
    setSaleValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, {
        customer_id: obj
      });
    });
    setErrors('');
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
    setSaleValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, _defineProperty({}, e.target.name, value && value));
    });
  };
  var onNotesChangeInput = function onNotesChangeInput(e) {
    e.preventDefault();
    setSaleValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, {
        notes: e.target.value
      });
    });
  };
  var onStatusChange = function onStatusChange(obj) {
    setSaleValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, {
        status_id: obj
      });
    });
  };
  var onPaymentStatusChange = function onPaymentStatusChange(obj) {
    setSaleValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, {
        payment_status: obj
      });
    });
    obj.value !== 2 ? setIsPaymentType(true) : setIsPaymentType(false);
    setSaleValue(function (input) {
      return _objectSpread(_objectSpread({}, input), {}, {
        payment_type: {
          label: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)("payment-type.filter.cash.label"),
          value: 1
        }
      });
    });
  };
  var onPaymentTypeChange = function onPaymentTypeChange(obj) {
    setSaleValue(function (inputs) {
      return _objectSpread(_objectSpread({}, inputs), {}, {
        payment_type: obj
      });
    });
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
    setSaleValue(function (previousState) {
      return _objectSpread(_objectSpread({}, previousState), {}, {
        date: date
      });
    });
    setErrors('');
  };
  var statusFilterOptions = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedOptions)(_constants__WEBPACK_IMPORTED_MODULE_26__.saleStatusOptions);
  var statusDefaultValue = statusFilterOptions.map(function (option) {
    return {
      value: option.id,
      label: option.name
    };
  });
  var paymentStatusFilterOptions = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedOptions)(_constants__WEBPACK_IMPORTED_MODULE_26__.salePaymentStatusOptions);
  var paymentStatusDefaultValue = paymentStatusFilterOptions.map(function (option) {
    return {
      value: option.id,
      label: option.name
    };
  });
  var paymentMethodOption = (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedOptions)(_constants__WEBPACK_IMPORTED_MODULE_26__.paymentMethodOptions);
  var paymentTypeDefaultValue = paymentMethodOption.map(function (option) {
    return {
      value: option.id,
      label: option.name
    };
  });
  var prepareFormData = function prepareFormData(prepareData) {
    var formValue = {
      date: dayjs__WEBPACK_IMPORTED_MODULE_9___default()(prepareData.date).format('YYYY-MM-DD'),
      is_sale_created: "true",
      quotation_id: prepareData ? prepareData.quotation_id : '',
      customer_id: prepareData.customer_id.value ? prepareData.customer_id.value : prepareData.customer_id,
      warehouse_id: prepareData.warehouse_id.value ? prepareData.warehouse_id.value : prepareData.warehouse_id,
      discount: prepareData.discount,
      tax_rate: prepareData.tax_rate,
      tax_amount: (0,_shared_calculation_calculation__WEBPACK_IMPORTED_MODULE_22__.calculateCartTotalTaxAmount)(updateProducts, saleValue),
      sale_items: updateProducts,
      shipping: prepareData.shipping,
      grand_total: (0,_shared_calculation_calculation__WEBPACK_IMPORTED_MODULE_22__.calculateCartTotalAmount)(updateProducts, saleValue),
      received_amount: 0,
      paid_amount: 0,
      note: prepareData.notes,
      status: prepareData.status_id.value ? prepareData.status_id.value : prepareData.status_id,
      payment_status: prepareData.payment_status.value ? prepareData.payment_status.value : prepareData.payment_status,
      payment_type: prepareData.payment_status.value === 2 ? 0 : prepareData.payment_type.value ? prepareData.payment_type.value : prepareData.payment_type
    };
    return formValue;
  };
  var onSubmit = function onSubmit(event) {
    event.preventDefault();
    var valid = handleValidation();
    if (valid) {
      if (singleSale && !isQuotation) {
        editSale(id, prepareFormData(saleValue), navigate);
      } else {
        addSaleData(prepareFormData(saleValue), emitirFacturaSri);
        setSaleValue(saleValue);
      }
    }
  };
  var onBlurInput = function onBlurInput(el) {
    if (el.target.value === '') {
      if (el.target.name === "shipping") {
        setSaleValue(_objectSpread(_objectSpread({}, saleValue), {}, {
          shipping: "0.00"
        }));
      }
      if (el.target.name === "discount") {
        setSaleValue(_objectSpread(_objectSpread({}, saleValue), {}, {
          discount: "0.00"
        }));
      }
      if (el.target.name === "tax_rate") {
        setSaleValue(_objectSpread(_objectSpread({}, saleValue), {}, {
          tax_rate: "0.00"
        }));
      }
    }
  };
  var selectedCustomerId = saleValue.customer_id && saleValue.customer_id.value;
  var selectedCustomer = selectedCustomerId ? (customers || []).find(function (c) {
    return String(c.id) === String(selectedCustomerId);
  }) : null;
  var selectedCustomerData = selectedCustomer ? selectedCustomer.attributes : null;
  var selectedCustomerFlat = selectedCustomer ? _objectSpread({
    id: selectedCustomer.id
  }, selectedCustomerData) : null;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("div", {
    className: "card",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("div", {
      className: "card-body",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("div", {
        className: "row g-3 mb-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("div", {
          className: "col-md-6",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("div", {
            className: "card border-0 shadow-sm h-100",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("div", {
              className: "card-header text-white py-2",
              style: {
                background: '#2F6FED'
              },
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("strong", {
                children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)('customer.title')
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("div", {
              className: "card-body",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("div", {
                className: "row g-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("div", {
                  className: "col-md-6",
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_4__["default"], {
                    className: "flex-nowrap dropdown-side-btn position-relative",
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_28__["default"], {
                      name: "customer_id",
                      data: customers,
                      onChange: onCustomerChange,
                      title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)('customer.title'),
                      errors: errors['customer_id'],
                      defaultValue: saleValue.customer_id,
                      value: saleValue.customer_id,
                      placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.placeholderText)('sale.select.customer.placeholder.label')
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__["default"], {
                      onClick: function onClick() {
                        return setModalShowCustomer(true);
                      },
                      className: "position-absolute model-dtn",
                      title: "Agregar nuevo cliente",
                      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_7__.FontAwesomeIcon, {
                        icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_8__.faPlus
                      })
                    })]
                  })
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("div", {
                  className: "col-md-6",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("label", {
                    className: "form-label",
                    children: "C\xE9dula/RUC:"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("div", {
                    className: "d-flex gap-2",
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("input", {
                      type: "text",
                      className: "form-control",
                      readOnly: true,
                      value: selectedCustomerData ? selectedCustomerData.identification || '' : ''
                    }), selectedCustomerFlat && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.Fragment, {
                      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__["default"], {
                        variant: "outline-primary",
                        className: "flex-shrink-0",
                        onClick: function onClick() {
                          return setModalEditCustomer(true);
                        },
                        title: "Editar cliente",
                        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_7__.FontAwesomeIcon, {
                          icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_8__.faPen
                        })
                      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_2__["default"], {
                        variant: "outline-primary",
                        className: "flex-shrink-0",
                        onClick: function onClick() {
                          return setModalHistorial(true);
                        },
                        title: "Historial de ventas",
                        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_7__.FontAwesomeIcon, {
                          icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_8__.faClockRotateLeft
                        })
                      })]
                    })]
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("div", {
                  className: "col-md-3",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("label", {
                    className: "form-label",
                    children: "Celular:"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("input", {
                    type: "text",
                    className: "form-control",
                    readOnly: true,
                    value: selectedCustomerData ? selectedCustomerData.phone || '' : ''
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("div", {
                  className: "col-md-3",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("label", {
                    className: "form-label",
                    children: "Correo:"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("input", {
                    type: "text",
                    className: "form-control",
                    readOnly: true,
                    value: selectedCustomerData ? selectedCustomerData.email || '' : ''
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("div", {
                  className: "col-md-3",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("label", {
                    className: "form-label",
                    children: "Raz\xF3n Social:"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("input", {
                    type: "text",
                    className: "form-control",
                    readOnly: true,
                    value: selectedCustomerData ? selectedCustomerData.name || '' : ''
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("div", {
                  className: "col-md-3",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("label", {
                    className: "form-label",
                    children: "Direcci\xF3n:"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("input", {
                    type: "text",
                    className: "form-control",
                    readOnly: true,
                    value: selectedCustomerData ? selectedCustomerData.address || '' : ''
                  })]
                })]
              })
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("div", {
          className: "col-md-6",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("div", {
            className: "card border-0 shadow-sm h-100",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("div", {
              className: "card-header text-white py-2",
              style: {
                background: '#2F6FED'
              },
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("strong", {
                children: "Datos de la Factura"
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("div", {
              className: "card-body",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("div", {
                className: "row g-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("div", {
                  className: "col-md-6",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("label", {
                    className: "form-label",
                    children: "Tipo de Documento:"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("select", {
                    className: "form-select",
                    value: emitirFacturaSri ? 'factura' : 'recibo',
                    onChange: function onChange(e) {
                      return setEmitirFacturaSri(e.target.value === 'factura');
                    },
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("option", {
                      value: "factura",
                      children: "Factura Electr\xF3nica"
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("option", {
                      value: "recibo",
                      children: "Recibo Electr\xF3nico"
                    })]
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("div", {
                  className: "col-md-6",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("label", {
                    className: "form-label",
                    children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)('react-data-table.date.column.label'), ":"]
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("span", {
                    className: "required"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("div", {
                    className: "position-relative",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(_shared_datepicker_ReactDatePicker__WEBPACK_IMPORTED_MODULE_20__["default"], {
                      onChangeDate: handleCallback,
                      newStartDate: saleValue.date
                    })
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("span", {
                    className: "text-danger d-block fw-400 fs-small mt-2",
                    children: errors['date'] ? errors['date'] : null
                  })]
                })]
              })
            })]
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("style", {
        children: "\n    .sale-tabs-card {\n    border-radius: 14px;\n\n}\n\n.sale-tabs-card .nav-tabs {\n    background: linear-gradient(135deg, #2F6FED 0%, #3D7CF6 100%);\n    border: none;\n    padding: 14px;\n    gap: 12px;\n    display: flex;\n}\n\n.sale-tabs-card .nav-tabs .nav-item {\n    display: flex;\n}\n\n.sale-tabs-card .nav-tabs .nav-link {\n    border: none !important;\n    border-radius: 12px;\n    padding: 12px 22px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-weight: 600;\n    color: rgba(255,255,255,.82);\n    background: transparent;\n    transition: all .25s ease;\n}\n\n.sale-tabs-card .nav-tabs .nav-link:hover {\n    color: #fff;\n    background: rgba(255,255,255,.12);\n}\n\n.sale-tabs-card .nav-tabs .nav-link.active {\n    background: #fff;\n    color: #2F6FED;\n    box-shadow: 0 8px 18px rgba(0,0,0,.12);\n    transform: translateY(-2px);\n    padding: 5px !important\n}\n\n.sale-tabs-card .tab-content {\n    background: #fff;\n    padding: 24px;\n}\n"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("div", {
        className: "card border-0 shadow-sm mb-4 sale-tabs-card",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__["default"], {
          defaultActiveKey: "detalles",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_5__["default"], {
            eventKey: "detalles",
            title: "Detalles",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("div", {
              className: "row g-3 pt-4",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("div", {
                className: "col-md-6",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_28__["default"], {
                  name: "warehouse_id",
                  data: warehouses,
                  onChange: onWarehouseChange,
                  title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)('warehouse.title'),
                  errors: errors['warehouse_id'],
                  defaultValue: saleValue.warehouse_id,
                  value: saleValue.warehouse_id,
                  addSearchItems: singleSale,
                  isWarehouseDisable: true,
                  placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.placeholderText)('purchase.select.warehouse.placeholder.label')
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("div", {
                className: "col-md-6",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("label", {
                  className: "form-label",
                  children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)('product.title'), ":"]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(_shared_components_product_cart_search_ProductSearch__WEBPACK_IMPORTED_MODULE_17__["default"], {
                  values: saleValue,
                  products: products,
                  handleValidation: handleValidation,
                  updateProducts: updateProducts,
                  setUpdateProducts: setUpdateProducts,
                  customProducts: customProducts,
                  presentationMode: "sale"
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("div", {
                className: "col-12",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("label", {
                  className: "form-label",
                  children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)('purchase.order-item.table.label'), ":"]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("span", {
                  className: "required"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(_shared_components_sales_ProductRowTable__WEBPACK_IMPORTED_MODULE_18__["default"], {
                  updateProducts: updateProducts,
                  setUpdateProducts: setUpdateProducts,
                  updatedQty: updatedQty,
                  frontSetting: frontSetting,
                  updateCost: updateCost,
                  updateDiscount: updateDiscount,
                  updateTax: updateTax,
                  updateSubTotal: updateSubTotal,
                  updateSaleUnit: updateSaleUnit
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("div", {
                className: "col-12",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(_ProductMainCalculation__WEBPACK_IMPORTED_MODULE_21__["default"], {
                  inputValues: saleValue,
                  allConfigData: allConfigData,
                  updateProducts: updateProducts,
                  frontSetting: frontSetting
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("div", {
                className: "col-md-4",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("label", {
                  className: "form-label",
                  children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)('purchase.input.order-tax.label'), ": "]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_4__["default"], {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("input", {
                    "aria-label": "Dollar amount (with dot and two decimal places)",
                    className: "form-control",
                    type: "text",
                    name: "tax_rate",
                    value: saleValue.tax_rate,
                    onBlur: function onBlur(event) {
                      return onBlurInput(event);
                    },
                    onFocus: function onFocus(event) {
                      return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.onFocusInput)(event);
                    },
                    onKeyPress: function onKeyPress(event) {
                      return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.decimalValidate)(event);
                    },
                    onChange: function onChange(e) {
                      onChangeInput(e);
                    }
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_4__["default"].Text, {
                    children: "%"
                  })]
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("div", {
                className: "col-md-4",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"].Label, {
                  className: "form-label",
                  children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)('purchase.order-item.table.discount.column.label'), ": "]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_4__["default"], {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("input", {
                    "aria-label": "Dollar amount (with dot and two decimal places)",
                    className: "form-control",
                    type: "text",
                    name: "discount",
                    value: saleValue.discount,
                    onBlur: function onBlur(event) {
                      return onBlurInput(event);
                    },
                    onFocus: function onFocus(event) {
                      return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.onFocusInput)(event);
                    },
                    onKeyPress: function onKeyPress(event) {
                      return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.decimalValidate)(event);
                    },
                    onChange: function onChange(e) {
                      return onChangeInput(e);
                    }
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_4__["default"].Text, {
                    children: frontSetting.value && frontSetting.value.currency_symbol
                  })]
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("div", {
                className: "col-md-4",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("label", {
                  className: "form-label",
                  children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)('purchase.input.shipping.label'), ": "]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_4__["default"], {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("input", {
                    "aria-label": "Dollar amount (with dot and two decimal places)",
                    type: "text",
                    className: "form-control",
                    name: "shipping",
                    value: saleValue.shipping,
                    onBlur: function onBlur(event) {
                      return onBlurInput(event);
                    },
                    onFocus: function onFocus(event) {
                      return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.onFocusInput)(event);
                    },
                    onKeyPress: function onKeyPress(event) {
                      return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.decimalValidate)(event);
                    },
                    onChange: function onChange(e) {
                      return onChangeInput(e);
                    }
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_4__["default"].Text, {
                    children: frontSetting.value && frontSetting.value.currency_symbol
                  })]
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("div", {
                className: "col-md-4",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_28__["default"], {
                  multiLanguageOption: statusFilterOptions,
                  onChange: onStatusChange,
                  name: "status_id",
                  title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)('purchase.select.status.label'),
                  value: saleValue.status_id,
                  errors: errors['status_id'],
                  defaultValue: statusDefaultValue[0],
                  placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)('purchase.select.status.label')
                })
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_5__["default"], {
            eventKey: "pagos",
            title: "Formas de Pago",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("div", {
              className: "row g-3 pt-4",
              children: [!singleSale && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("div", {
                className: "col-md-6",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_28__["default"], {
                  multiLanguageOption: paymentStatusFilterOptions,
                  onChange: onPaymentStatusChange,
                  name: "payment_status",
                  title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)('dashboard.recentSales.paymentStatus.label'),
                  value: saleValue.payment_status,
                  errors: errors['payment_status'],
                  defaultValue: paymentStatusDefaultValue[0],
                  placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.placeholderText)('sale.select.payment-status.placeholder')
                })
              }), !singleSale && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("div", {
                className: "col-md-6",
                style: {
                  display: (saleValue === null || saleValue === void 0 || (_saleValue$payment_st = saleValue.payment_status) === null || _saleValue$payment_st === void 0 ? void 0 : _saleValue$payment_st.value) === 2 ? "none" : "block"
                },
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_28__["default"], {
                  title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)("select.payment-type.label"),
                  name: "payment_type",
                  value: saleValue.payment_type,
                  errors: errors['payment_type'],
                  placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.placeholderText)('sale.select.payment-type.placeholder'),
                  defaultValue: paymentTypeDefaultValue[0],
                  multiLanguageOption: paymentMethodOption,
                  onChange: onPaymentTypeChange
                })
              }), isQuotation && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("div", {
                className: "col-md-6",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_28__["default"], {
                  multiLanguageOption: paymentStatusFilterOptions,
                  onChange: onPaymentStatusChange,
                  name: "payment_status",
                  title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)('dashboard.recentSales.paymentStatus.label'),
                  value: saleValue.payment_status,
                  errors: errors['payment_status'],
                  defaultValue: paymentStatusDefaultValue[0],
                  placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.placeholderText)('sale.select.payment-status.placeholder')
                })
              }), isQuotation && isPaymentType && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("div", {
                className: "col-md-6",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_28__["default"], {
                  title: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)('select.payment-type.label'),
                  name: "payment_type",
                  value: saleValue.payment_type,
                  errors: errors['payment_type'],
                  placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.placeholderText)('sale.select.payment-type.placeholder'),
                  defaultValue: paymentTypeDefaultValue[0],
                  multiLanguageOption: paymentMethodOption,
                  onChange: onPaymentTypeChange
                })
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_5__["default"], {
            eventKey: "adicional",
            title: "Informaci\xF3n Adicional",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("div", {
              className: "row g-3 pt-4",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("div", {
                className: "col-12",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsxs)("label", {
                  className: "form-label",
                  children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.getFormattedMessage)('globally.input.notes.label'), ": "]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("textarea", {
                  name: "notes",
                  className: "form-control",
                  rows: 4,
                  value: saleValue.notes,
                  placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_19__.placeholderText)('globally.input.notes.placeholder.label'),
                  onChange: function onChange(e) {
                    return onNotesChangeInput(e);
                  }
                })]
              })
            })
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)("div", {
        className: "row",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(_shared_components_modelFooter__WEBPACK_IMPORTED_MODULE_24__["default"], {
          onEditRecord: singleSale,
          onSubmit: onSubmit,
          link: "/app/sales"
        })
      })]
    }), modalShowCustomer && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(_frontend_components_customerModel_CustomerForm__WEBPACK_IMPORTED_MODULE_29__["default"], {
      show: modalShowCustomer,
      hide: setModalShowCustomer
    }), modalEditCustomer && selectedCustomerFlat && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(_frontend_components_customerModel_CustomerForm__WEBPACK_IMPORTED_MODULE_29__["default"], {
      show: modalEditCustomer,
      hide: setModalEditCustomer,
      singleCustomer: [selectedCustomerFlat]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_31__.jsx)(_customer_CustomerSalesHistoryModal__WEBPACK_IMPORTED_MODULE_30__["default"], {
      show: modalHistorial,
      onHide: function onHide() {
        return setModalHistorial(false);
      },
      customer: selectedCustomerFlat
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var purchaseProducts = state.purchaseProducts,
    products = state.products,
    frontSetting = state.frontSetting,
    allConfigData = state.allConfigData;
  return {
    customProducts: (0,_shared_prepareArray_prepareSaleArray__WEBPACK_IMPORTED_MODULE_23__.prepareSaleProductArray)(products),
    purchaseProducts: purchaseProducts,
    products: products,
    frontSetting: frontSetting,
    allConfigData: allConfigData
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_14__.connect)(mapStateToProps, {
  editSale: _store_action_salesAction__WEBPACK_IMPORTED_MODULE_16__.editSale,
  fetchProductsByWarehouse: _store_action_productAction__WEBPACK_IMPORTED_MODULE_15__.fetchProductsByWarehouse,
  fetchFrontSetting: _store_action_frontSettingAction__WEBPACK_IMPORTED_MODULE_27__.fetchFrontSetting
})(SalesForm));

/***/ },

/***/ "./resources/pos/src/frontend/components/customerModel/CustomerForm.js"
/*!*****************************************************************************!*\
  !*** ./resources/pos/src/frontend/components/customerModel/CustomerForm.js ***!
  \*****************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap/Modal */ "./node_modules/react-bootstrap/esm/Modal.js");
/* harmony import */ var react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-bootstrap/Form */ "./node_modules/react-bootstrap/esm/Form.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _store_action_customerAction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../store/action/customerAction */ "./resources/pos/src/store/action/customerAction.js");
/* harmony import */ var _store_action_pos_customerAction__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../store/action/pos/customerAction */ "./resources/pos/src/store/action/pos/customerAction.js");
/* harmony import */ var _shared_components_modelFooter__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../shared/components/modelFooter */ "./resources/pos/src/shared/components/modelFooter.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _components_customer_identificacionField__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../components/customer/identificacionField */ "./resources/pos/src/components/customer/identificacionField.js");
/* harmony import */ var _hooks_useCustomerFom__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../hooks/useCustomerFom */ "./resources/pos/src/hooks/useCustomerFom.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
// src/components/pos/CustomerForm.jsx












var CustomerForm = function CustomerForm(props) {
  var _singleCustomer$;
  var show = props.show,
    hide = props.hide,
    singleCustomer = props.singleCustomer;
  var _useCustomerForm = (0,_hooks_useCustomerFom__WEBPACK_IMPORTED_MODULE_9__.useCustomerForm)({
      singleCustomer: singleCustomer,
      addCustomerData: function addCustomerData(values) {
        return props.addCustomer(values, hide);
      },
      editCustomer: props.editCustomer,
      id: singleCustomer === null || singleCustomer === void 0 || (_singleCustomer$ = singleCustomer[0]) === null || _singleCustomer$ === void 0 ? void 0 : _singleCustomer$.id
    }),
    customerData = _useCustomerForm.customerData,
    customerValue = _useCustomerForm.customerValue,
    errors = _useCustomerForm.errors,
    sriLoading = _useCustomerForm.sriLoading,
    isDisabled = _useCustomerForm.isDisabled,
    onChangeInput = _useCustomerForm.onChangeInput,
    handleSriLookup = _useCustomerForm.handleSriLookup;
  var onSubmit = function onSubmit(event) {
    event.preventDefault();
    props.addCustomer(customerValue, hide);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_1__["default"], {
    show: show,
    onHide: function onHide() {
      return hide(false);
    },
    keyboard: true,
    size: "lg",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_1__["default"].Header, {
      closeButton: true,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_1__["default"].Title, {
        children: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)('customer.create.title')
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_1__["default"].Body, {
      className: "p-0",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
        className: "card",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
          className: "card-body",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_2__["default"], {
            onSubmit: onSubmit,
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
              className: "row",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
                className: "col-md-6 mb-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("label", {
                  className: "form-label",
                  children: "Tipo de identificaci\xF3n:"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("select", {
                  name: "tipo_identificacion",
                  className: "form-control",
                  value: customerValue.tipo_identificacion,
                  onChange: onChangeInput,
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("option", {
                    value: "05",
                    children: "C\xE9dula"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("option", {
                    value: "04",
                    children: "RUC"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("option", {
                    value: "06",
                    children: "Pasaporte"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("option", {
                    value: "07",
                    children: "Consumidor Final"
                  })]
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_components_customer_identificacionField__WEBPACK_IMPORTED_MODULE_8__["default"], {
                tipo: customerValue.tipo_identificacion,
                value: customerValue.identification,
                onChange: onChangeInput,
                error: errors.identification,
                isEdit: Boolean(singleCustomer),
                sriLoading: sriLoading,
                onSriLookup: handleSriLookup
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
                className: "col-md-6 mb-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("label", {
                  className: "form-label",
                  children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)('globally.input.name.label'), ":", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
                    className: "required"
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("input", {
                  type: "text",
                  name: "name",
                  className: "form-control ".concat(errors.name ? 'is-invalid' : ''),
                  placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.placeholderText)('globally.input.name.placeholder.label'),
                  value: customerValue.name,
                  onChange: onChangeInput,
                  disabled: Boolean(singleCustomer),
                  autoFocus: true
                }), errors.name && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
                  className: "text-danger d-block fw-400 fs-small mt-2",
                  children: errors.name
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
                className: "col-md-6 mb-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("label", {
                  className: "form-label",
                  children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)('globally.input.email.label'), ":", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
                    className: "required"
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("input", {
                  type: "text",
                  name: "email",
                  className: "form-control ".concat(errors.email ? 'is-invalid' : ''),
                  placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.placeholderText)('globally.input.email.placeholder.label'),
                  value: customerValue.email,
                  onChange: onChangeInput
                }), errors.email && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
                  className: "text-danger d-block fw-400 fs-small mt-2",
                  children: errors.email
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
                className: "col-md-6 mb-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("label", {
                  className: "form-label",
                  children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)('globally.input.phone-number.label'), ":", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
                    className: "required"
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("input", {
                  type: "text",
                  name: "phone",
                  className: "form-control ".concat(errors.phone ? 'is-invalid' : ''),
                  placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.placeholderText)('globally.input.phone-number.placeholder.label'),
                  onKeyPress: function onKeyPress(e) {
                    return (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.numValidate)(e);
                  },
                  value: customerValue.phone,
                  onChange: onChangeInput
                }), errors.phone && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
                  className: "text-danger d-block fw-400 fs-small mt-2",
                  children: errors.phone
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
                className: "col-md-6 mb-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("label", {
                  className: "form-label",
                  children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)('globally.input.country.label'), ":", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
                    className: "required"
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("input", {
                  type: "text",
                  name: "country",
                  className: "form-control ".concat(errors.country ? 'is-invalid' : ''),
                  placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.placeholderText)('globally.input.country.placeholder.label'),
                  value: customerValue.country,
                  onChange: onChangeInput
                }), errors.country && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
                  className: "text-danger d-block fw-400 fs-small mt-2",
                  children: errors.country
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
                className: "col-md-6 mb-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("label", {
                  className: "form-label",
                  children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)('globally.input.city.label'), ":", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
                    className: "required"
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("input", {
                  type: "text",
                  name: "city",
                  className: "form-control ".concat(errors.city ? 'is-invalid' : ''),
                  placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.placeholderText)('globally.input.city.placeholder.label'),
                  value: customerValue.city,
                  onChange: onChangeInput
                }), errors.city && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
                  className: "text-danger d-block fw-400 fs-small mt-2",
                  children: errors.city
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
                className: "col-md-6 mb-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("label", {
                  className: "form-label",
                  children: [(0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.getFormattedMessage)('globally.input.address.label'), ":", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
                    className: "required"
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("input", {
                  type: "text",
                  name: "address",
                  className: "form-control ".concat(errors.address ? 'is-invalid' : ''),
                  placeholder: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_7__.placeholderText)('globally.input.address.placeholder.label'),
                  value: customerValue.address,
                  onChange: onChangeInput
                }), errors.address && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
                  className: "text-danger d-block fw-400 fs-small mt-2",
                  children: errors.address
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_shared_components_modelFooter__WEBPACK_IMPORTED_MODULE_6__["default"], {
                onEditRecord: customerData,
                onSubmit: onSubmit,
                editDisabled: isDisabled,
                addDisabled: !customerValue.name,
                clearField: hide
              })]
            })
          })
        })
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_3__.connect)(null, {
  editCustomer: _store_action_customerAction__WEBPACK_IMPORTED_MODULE_4__.editCustomer,
  addCustomer: _store_action_pos_customerAction__WEBPACK_IMPORTED_MODULE_5__.addCustomer
})(CustomerForm));

/***/ },

/***/ "./resources/pos/src/hooks/useCustomerFom.js"
/*!***************************************************!*\
  !*** ./resources/pos/src/hooks/useCustomerFom.js ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useCustomerForm: () => (/* binding */ useCustomerForm)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var email_validator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! email-validator */ "./node_modules/email-validator/index.js");
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
/* harmony import */ var _store_action_toastAction__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../store/action/toastAction */ "./resources/pos/src/store/action/toastAction.js");
/* harmony import */ var _utils_identificacionValidator__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/identificacionValidator */ "./resources/pos/src/utils/identificacionValidator.js");
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









dayjs__WEBPACK_IMPORTED_MODULE_4___default().extend((dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_5___default()));
dayjs__WEBPACK_IMPORTED_MODULE_4___default().extend((dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_6___default()));
dayjs__WEBPACK_IMPORTED_MODULE_4___default().extend((dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_7___default()));
dayjs__WEBPACK_IMPORTED_MODULE_4___default().extend((dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_8___default()));


var useCustomerForm = function useCustomerForm(_ref) {
  var singleCustomer = _ref.singleCustomer,
    addCustomerData = _ref.addCustomerData,
    editCustomer = _ref.editCustomer,
    id = _ref.id;
  var navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_2__.useNavigate)();
  var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useDispatch)();
  var customerData = singleCustomer ? singleCustomer[0] : null;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      tipo_identificacion: (customerData === null || customerData === void 0 ? void 0 : customerData.tipo_identificacion) || "05",
      identification: (customerData === null || customerData === void 0 ? void 0 : customerData.identification) || "",
      name: (customerData === null || customerData === void 0 ? void 0 : customerData.name) || "",
      dob: customerData !== null && customerData !== void 0 && customerData.dob ? dayjs__WEBPACK_IMPORTED_MODULE_4___default()(customerData.dob).toDate() : null,
      email: (customerData === null || customerData === void 0 ? void 0 : customerData.email) || "",
      phone: (customerData === null || customerData === void 0 ? void 0 : customerData.phone) || "",
      country: (customerData === null || customerData === void 0 ? void 0 : customerData.country) || "",
      city: (customerData === null || customerData === void 0 ? void 0 : customerData.city) || "",
      address: (customerData === null || customerData === void 0 ? void 0 : customerData.address) || ""
    }),
    _useState2 = _slicedToArray(_useState, 2),
    customerValue = _useState2[0],
    setCustomerValue = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({}),
    _useState4 = _slicedToArray(_useState3, 2),
    errors = _useState4[0],
    setErrors = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    sriLoading = _useState6[0],
    setSriLoading = _useState6[1];
  var isDisabled = customerData && (customerData.identification || "") === (customerValue.identification || "") && customerData.name === customerValue.name && customerData.email === customerValue.email && customerData.phone === customerValue.phone && customerData.country === customerValue.country && customerData.city === customerValue.city && customerData.address === customerValue.address;
  var handleValidation = function handleValidation() {
    var e = {};
    if (!customerValue.name) e.name = "El nombre es obligatorio";
    if (!customerValue.email) e.email = "El email es obligatorio";else if (!email_validator__WEBPACK_IMPORTED_MODULE_3__.validate(customerValue.email)) e.email = "Email inválido";
    if (!customerValue.phone) e.phone = "El teléfono es obligatorio";
    if (!customerValue.country) e.country = "El país es obligatorio";
    if (!customerValue.city) e.city = "La ciudad es obligatoria";
    if (!customerValue.address) e.address = "La dirección es obligatoria";
    var errorId = (0,_utils_identificacionValidator__WEBPACK_IMPORTED_MODULE_10__.validarIdentificacion)(customerValue.tipo_identificacion, customerValue.identification);
    if (errorId) e.identification = errorId;
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  var onChangeInput = function onChangeInput(e) {
    var _e$target = e.target,
      name = _e$target.name,
      value = _e$target.value;
    var newValues = _objectSpread(_objectSpread({}, customerValue), {}, _defineProperty({}, name, value));
    if (name === "tipo_identificacion" && value === "07") {
      newValues.identification = "";
      newValues.name = "Consumidor Final";
    }

    // Validar identificación en tiempo real
    if (name === "identification" || name === "tipo_identificacion") {
      var tipo = name === "tipo_identificacion" ? value : customerValue.tipo_identificacion;
      var valor = name === "identification" ? value : customerValue.identification;
      setErrors(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          identification: (0,_utils_identificacionValidator__WEBPACK_IMPORTED_MODULE_10__.validarIdentificacion)(tipo, valor)
        });
      });
    } else {
      setErrors(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, name, null));
      });
    }
    setCustomerValue(newValues);
  };
  var onSubmit = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(event) {
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            event.preventDefault();
            if (handleValidation()) {
              _context.n = 1;
              break;
            }
            return _context.a(2);
          case 1:
            if (customerData) {
              if (!isDisabled) editCustomer(id, customerValue, navigate);
            } else {
              addCustomerData(customerValue);
            }
          case 2:
            return _context.a(2);
        }
      }, _callee);
    }));
    return function onSubmit(_x) {
      return _ref2.apply(this, arguments);
    };
  }();
  var handleSriLookup = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var identification, res, json, _t, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            identification = customerValue.identification || "";
            if (!(identification.length < 10)) {
              _context2.n = 1;
              break;
            }
            return _context2.a(2);
          case 1:
            setSriLoading(true);
            _context2.p = 2;
            _context2.n = 3;
            return fetch("/api/sri/lookup?identification=".concat(identification));
          case 3:
            res = _context2.v;
            _context2.p = 4;
            _context2.n = 5;
            return res.json();
          case 5:
            json = _context2.v;
            _context2.n = 7;
            break;
          case 6:
            _context2.p = 6;
            _t = _context2.v;
            console.error("Respuesta no es JSON válido. Status:", res.status);
            dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_9__.addToast)({
              text: "Error del servidor (status ".concat(res.status, ")"),
              type: "error"
            }));
            return _context2.a(2);
          case 7:
            if (res.ok) {
              _context2.n = 8;
              break;
            }
            console.error("Error SRI lookup:", json);
            dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_9__.addToast)({
              text: json.debug_message || json.message || "No encontrado en el SRI",
              type: "error"
            }));
            return _context2.a(2);
          case 8:
            setCustomerValue(function (prev) {
              return _objectSpread(_objectSpread({}, prev), {}, {
                name: json.name || prev.name,
                email: json.email || prev.email,
                phone: json.phone || prev.phone,
                address: json.address || prev.address,
                city: json.city || prev.city,
                country: json.country || prev.country
              });
            });
            dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_9__.addToast)({
              text: "Datos cargados desde el SRI"
            }));
            _context2.n = 10;
            break;
          case 9:
            _context2.p = 9;
            _t2 = _context2.v;
            console.error("Error de red en SRI lookup:", _t2);
            dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_9__.addToast)({
              text: "Error de red",
              type: "error"
            }));
          case 10:
            _context2.p = 10;
            setSriLoading(false);
            return _context2.f(10);
          case 11:
            return _context2.a(2);
        }
      }, _callee2, null, [[4, 6], [2, 9, 10, 11]]);
    }));
    return function handleSriLookup() {
      return _ref3.apply(this, arguments);
    };
  }();
  return {
    customerData: customerData,
    customerValue: customerValue,
    errors: errors,
    sriLoading: sriLoading,
    isDisabled: isDisabled,
    onChangeInput: onChangeInput,
    onSubmit: onSubmit,
    handleSriLookup: handleSriLookup
  };
};

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
    onEmitirFacturaClick = props.onEmitirFacturaClick;
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
          onEmitirFacturaClick(item);
        },
        eventKey: "emitir-factura",
        className: "py-3 px-4 d-flex align-items-center fs-6 text-primary",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("img", {
          src: "https://res.cloudinary.com/dxt0es7sj/image/upload/v1785960274/sri_negro_ct8qgt.svg",
          alt: "SRI",
          className: "me-2"
        }), "Emitir Factura"]
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

/***/ "./resources/pos/src/store/action/pos/customerAction.js"
/*!**************************************************************!*\
  !*** ./resources/pos/src/store/action/pos/customerAction.js ***!
  \**************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addCustomer: () => (/* binding */ addCustomer)
/* harmony export */ });
/* harmony import */ var _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../config/apiConfig */ "./resources/pos/src/config/apiConfig.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _toastAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../toastAction */ "./resources/pos/src/store/action/toastAction.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _saveButtonAction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../saveButtonAction */ "./resources/pos/src/store/action/saveButtonAction.js");
/* harmony import */ var _customerAction__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../customerAction */ "./resources/pos/src/store/action/customerAction.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }






var addCustomer = function addCustomer(supplier, hide) {
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(dispatch) {
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_4__.setSavingButton)(true));
            _context.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].post(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.CUSTOMERS, supplier).then(function (response) {
              dispatch((0,_customerAction__WEBPACK_IMPORTED_MODULE_5__.fetchAllCustomer)());
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_3__.getFormattedMessage)('customer.success.create.message')
              }));
              dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_4__.setSavingButton)(false));
              dispatch(hide(false));
            })["catch"](function (_ref2) {
              var response = _ref2.response;
              dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_4__.setSavingButton)(false));
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

/***/ "./resources/pos/src/store/action/quotationAction.js"
/*!***********************************************************!*\
  !*** ./resources/pos/src/store/action/quotationAction.js ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addQuotation: () => (/* binding */ addQuotation),
/* harmony export */   deleteQuotation: () => (/* binding */ deleteQuotation),
/* harmony export */   editQuotation: () => (/* binding */ editQuotation),
/* harmony export */   fetchQuotation: () => (/* binding */ fetchQuotation),
/* harmony export */   fetchQuotations: () => (/* binding */ fetchQuotations)
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









var fetchQuotations = function fetchQuotations() {
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
            url = _constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.QUOTATIONS;
            if (!_.isEmpty(filter) && (filter.page || filter.pageSize || filter.search || filter.order_By || filter.created_at)) {
              url += (0,_shared_requestParam__WEBPACK_IMPORTED_MODULE_5__["default"])(filter, admin, null, null, url);
            }
            _context.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].get(url).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.quotationActionType.FETCH_QUOTATIONS,
                payload: response.data.data
              });
              dispatch((0,_totalRecordAction__WEBPACK_IMPORTED_MODULE_3__.setTotalRecord)(response.data.meta.total !== undefined && response.data.meta.total >= 0 ? response.data.meta.total : response.data.data.total));
              dispatch((0,_saleApiAction__WEBPACK_IMPORTED_MODULE_7__.callSaleApi)(false));
              if (isLoading) {
                dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_4__.setLoading)(false));
              }
            })["catch"](function (response) {
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: response.response.data.message,
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
var fetchQuotation = function fetchQuotation(quotationId, singleQuotation) {
  var isLoading = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(dispatch) {
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            if (isLoading) {
              dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_4__.setLoading)(true));
            }
            _context2.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].get(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.QUOTATIONS + "/" + quotationId + "/edit", singleQuotation).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.quotationActionType.FETCH_QUOTATION,
                payload: response.data.data
              });
              if (isLoading) {
                dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_4__.setLoading)(false));
              }
            })["catch"](function (_ref3) {
              var response = _ref3.response;
              response && dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
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
      return _ref2.apply(this, arguments);
    };
  }();
};
var addQuotation = function addQuotation(quotation, navigate) {
  return /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(dispatch) {
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_8__.setSavingButton)(true));
            _context3.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].post(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.QUOTATIONS, quotation).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.quotationActionType.ADD_QUOTATION,
                payload: response.data.data
              });
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("quotation.success.create.message")
              }));
              dispatch((0,_totalRecordAction__WEBPACK_IMPORTED_MODULE_3__.addInToTotalRecord)(1));
              navigate("/app/quotations");
              dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_8__.setSavingButton)(false));
            })["catch"](function (_ref5) {
              var response = _ref5.response;
              dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_8__.setSavingButton)(false));
              response && dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
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
      return _ref4.apply(this, arguments);
    };
  }();
};
var editQuotation = function editQuotation(quotationId, quotation, navigate) {
  return /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(dispatch) {
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_8__.setSavingButton)(true));
            _context4.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"].patch(_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.QUOTATIONS + "/" + quotationId, quotation).then(function (response) {
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("quotation.success.edit.message")
              }));
              navigate("/app/quotations");
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.quotationActionType.EDIT_QUOTATION,
                payload: response.data.data
              });
              dispatch((0,_saveButtonAction__WEBPACK_IMPORTED_MODULE_8__.setSavingButton)(false));
            })["catch"](function (_ref7) {
              var response = _ref7.response;
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
      return _ref6.apply(this, arguments);
    };
  }();
};
var deleteQuotation = function deleteQuotation(userId) {
  return /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(dispatch) {
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            _context5.n = 1;
            return _config_apiConfig__WEBPACK_IMPORTED_MODULE_0__["default"]["delete"](_constants__WEBPACK_IMPORTED_MODULE_1__.apiBaseURL.QUOTATIONS + "/" + userId).then(function () {
              dispatch((0,_totalRecordAction__WEBPACK_IMPORTED_MODULE_3__.removeFromTotalRecord)(1));
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_1__.quotationActionType.DELETE_QUOTATION,
                payload: userId
              });
              dispatch((0,_toastAction__WEBPACK_IMPORTED_MODULE_2__.addToast)({
                text: (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_6__.getFormattedMessage)("quotation.success.delete.message")
              }));
            })["catch"](function (_ref9) {
              var response = _ref9.response;
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
      return _ref8.apply(this, arguments);
    };
  }();
};

/***/ },

/***/ "./resources/pos/src/store/action/quotationDetails.js"
/*!************************************************************!*\
  !*** ./resources/pos/src/store/action/quotationDetails.js ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   quotationDetailsAction: () => (/* binding */ quotationDetailsAction)
/* harmony export */ });
/* harmony import */ var _loadingAction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loadingAction */ "./resources/pos/src/store/action/loadingAction.js");
/* harmony import */ var _config_apiConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config/apiConfig */ "./resources/pos/src/config/apiConfig.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _toastAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./toastAction */ "./resources/pos/src/store/action/toastAction.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }




var quotationDetailsAction = function quotationDetailsAction(saleId, singleSale) {
  var isLoading = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(dispatch) {
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            if (isLoading) {
              dispatch((0,_loadingAction__WEBPACK_IMPORTED_MODULE_0__.setLoading)(true));
            }
            _config_apiConfig__WEBPACK_IMPORTED_MODULE_1__["default"].get(_constants__WEBPACK_IMPORTED_MODULE_2__.apiBaseURL.QUOTATIONS_DETAILS + '/' + saleId, singleSale).then(function (response) {
              dispatch({
                type: _constants__WEBPACK_IMPORTED_MODULE_2__.quotationActionType.QUOTATION_DETAILS,
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

/***/ "./resources/pos/src/utils/identificacionValidator.js"
/*!************************************************************!*\
  !*** ./resources/pos/src/utils/identificacionValidator.js ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   labelPorTipo: () => (/* binding */ labelPorTipo),
/* harmony export */   maxLengthPorTipo: () => (/* binding */ maxLengthPorTipo),
/* harmony export */   placeholderPorTipo: () => (/* binding */ placeholderPorTipo),
/* harmony export */   validarCedula: () => (/* binding */ validarCedula),
/* harmony export */   validarIdentificacion: () => (/* binding */ validarIdentificacion)
/* harmony export */ });
var validarCedula = function validarCedula(cedula) {
  if (!/^\d{10}$/.test(cedula)) return false;
  var provincia = parseInt(cedula.substring(0, 2));
  if (provincia < 1 || provincia > 24) return false;
  var digitos = cedula.split("").map(Number);
  var verificador = digitos[9];
  var suma = digitos.slice(0, 9).reduce(function (acc, digit, i) {
    var val = i % 2 === 0 ? digit * 2 : digit;
    return acc + (val > 9 ? val - 9 : val);
  }, 0);
  var residuo = suma % 10;
  return (residuo === 0 ? 0 : 10 - residuo) === verificador;
};
var validarIdentificacion = function validarIdentificacion(tipo, valor) {
  if (tipo === "07") return null;
  var num = (valor || "").trim();
  if (!num) return null;
  if (tipo === "05") {
    if (!/^\d{10}$/.test(num)) return "La cédula debe tener exactamente 10 dígitos";
    if (!validarCedula(num)) return "La cédula ingresada no es válida";
  }
  if (tipo === "04") {
    if (!/^\d{13}$/.test(num)) return "El RUC debe tener exactamente 13 dígitos";
    if (num.slice(10) === "000") return "El RUC ingresado no es válido";
  }
  if (tipo === "06") {
    if (num.length < 5 || num.length > 20) return "El pasaporte debe tener entre 5 y 20 caracteres";
  }
  return null;
};
var maxLengthPorTipo = function maxLengthPorTipo(tipo) {
  if (tipo === "04") return 13;
  if (tipo === "05") return 10;
  return 20;
};
var placeholderPorTipo = function placeholderPorTipo(tipo) {
  return {
    "04": "Ej: 0912345678001 (13 dígitos)",
    "05": "Ej: 0987654321 (10 dígitos)",
    "06": "Ej: P1234567"
  }[tipo] || "";
};
var labelPorTipo = function labelPorTipo(tipo) {
  return {
    "04": "RUC:",
    "05": "Cédula:",
    "06": "Pasaporte:",
    "07": "Identificación:"
  }[tipo] || "Identificación:";
};

/***/ },

/***/ "./node_modules/react-bootstrap/esm/Nav.js"
/*!*************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/Nav.js ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var uncontrollable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! uncontrollable */ "./node_modules/uncontrollable/lib/esm/index.js");
/* harmony import */ var _restart_ui_Nav__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @restart/ui/Nav */ "./node_modules/@restart/ui/esm/Nav.js");
/* harmony import */ var _ThemeProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ThemeProvider */ "./node_modules/react-bootstrap/esm/ThemeProvider.js");
/* harmony import */ var _NavbarContext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./NavbarContext */ "./node_modules/react-bootstrap/esm/NavbarContext.js");
/* harmony import */ var _CardHeaderContext__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./CardHeaderContext */ "./node_modules/react-bootstrap/esm/CardHeaderContext.js");
/* harmony import */ var _NavItem__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./NavItem */ "./node_modules/react-bootstrap/esm/NavItem.js");
/* harmony import */ var _NavLink__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./NavLink */ "./node_modules/react-bootstrap/esm/NavLink.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
"use client";












const Nav = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.forwardRef((uncontrolledProps, ref) => {
  const {
    as = 'div',
    bsPrefix: initialBsPrefix,
    variant,
    fill = false,
    justify = false,
    navbar,
    navbarScroll,
    className,
    activeKey,
    ...props
  } = (0,uncontrollable__WEBPACK_IMPORTED_MODULE_2__.useUncontrolled)(uncontrolledProps, {
    activeKey: 'onSelect'
  });
  const bsPrefix = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_4__.useBootstrapPrefix)(initialBsPrefix, 'nav');
  let navbarBsPrefix;
  let cardHeaderBsPrefix;
  let isNavbar = false;
  const navbarContext = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(_NavbarContext__WEBPACK_IMPORTED_MODULE_5__["default"]);
  const cardHeaderContext = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(_CardHeaderContext__WEBPACK_IMPORTED_MODULE_6__["default"]);
  if (navbarContext) {
    navbarBsPrefix = navbarContext.bsPrefix;
    isNavbar = navbar == null ? true : navbar;
  } else if (cardHeaderContext) {
    ({
      cardHeaderBsPrefix
    } = cardHeaderContext);
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_restart_ui_Nav__WEBPACK_IMPORTED_MODULE_3__["default"], {
    as: as,
    ref: ref,
    activeKey: activeKey,
    className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(className, {
      [bsPrefix]: !isNavbar,
      [`${navbarBsPrefix}-nav`]: isNavbar,
      [`${navbarBsPrefix}-nav-scroll`]: isNavbar && navbarScroll,
      [`${cardHeaderBsPrefix}-${variant}`]: !!cardHeaderBsPrefix,
      [`${bsPrefix}-${variant}`]: !!variant,
      [`${bsPrefix}-fill`]: fill,
      [`${bsPrefix}-justified`]: justify
    }),
    ...props
  });
});
Nav.displayName = 'Nav';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Object.assign(Nav, {
  Item: _NavItem__WEBPACK_IMPORTED_MODULE_7__["default"],
  Link: _NavLink__WEBPACK_IMPORTED_MODULE_8__["default"]
}));

/***/ },

/***/ "./node_modules/react-bootstrap/esm/NavItem.js"
/*!*****************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/NavItem.js ***!
  \*****************************************************/
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





const NavItem = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  bsPrefix,
  as: Component = 'div',
  ...props
}, ref) => {
  bsPrefix = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_2__.useBootstrapPrefix)(bsPrefix, 'nav-item');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(Component, {
    ref: ref,
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(className, bsPrefix),
    ...props
  });
});
NavItem.displayName = 'NavItem';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NavItem);

/***/ },

/***/ "./node_modules/react-bootstrap/esm/NavLink.js"
/*!*****************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/NavLink.js ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _restart_ui_Anchor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @restart/ui/Anchor */ "./node_modules/@restart/ui/esm/Anchor.js");
/* harmony import */ var _restart_ui_NavItem__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @restart/ui/NavItem */ "./node_modules/@restart/ui/esm/NavItem.js");
/* harmony import */ var _restart_ui_SelectableContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @restart/ui/SelectableContext */ "./node_modules/@restart/ui/esm/SelectableContext.js");
/* harmony import */ var _ThemeProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ThemeProvider */ "./node_modules/react-bootstrap/esm/ThemeProvider.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
"use client";








const NavLink = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({
  bsPrefix,
  className,
  as: Component = _restart_ui_Anchor__WEBPACK_IMPORTED_MODULE_2__["default"],
  active,
  eventKey,
  disabled = false,
  ...props
}, ref) => {
  bsPrefix = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_5__.useBootstrapPrefix)(bsPrefix, 'nav-link');
  const [navItemProps, meta] = (0,_restart_ui_NavItem__WEBPACK_IMPORTED_MODULE_3__.useNavItem)({
    key: (0,_restart_ui_SelectableContext__WEBPACK_IMPORTED_MODULE_4__.makeEventKey)(eventKey, props.href),
    active,
    disabled,
    ...props
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(Component, {
    ...props,
    ...navItemProps,
    ref: ref,
    disabled: disabled,
    className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(className, bsPrefix, disabled && 'disabled', meta.isActive && 'active')
  });
});
NavLink.displayName = 'NavLink';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NavLink);

/***/ },

/***/ "./node_modules/react-bootstrap/esm/Tab.js"
/*!*************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/Tab.js ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _TabContainer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TabContainer */ "./node_modules/react-bootstrap/esm/TabContainer.js");
/* harmony import */ var _TabContent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TabContent */ "./node_modules/react-bootstrap/esm/TabContent.js");
/* harmony import */ var _TabPane__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TabPane */ "./node_modules/react-bootstrap/esm/TabPane.js");




const propTypes = {
  eventKey: prop_types__WEBPACK_IMPORTED_MODULE_0___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_0___default().string), (prop_types__WEBPACK_IMPORTED_MODULE_0___default().number)]),
  /**
   * Content for the tab title.
   */
  title: (prop_types__WEBPACK_IMPORTED_MODULE_0___default().node).isRequired,
  /**
   * The disabled state of the tab.
   */
  disabled: (prop_types__WEBPACK_IMPORTED_MODULE_0___default().bool),
  /**
   * Class to pass to the underlying nav link.
   */
  tabClassName: (prop_types__WEBPACK_IMPORTED_MODULE_0___default().string),
  /**
   * Object containing attributes to pass to underlying nav link.
   */
  tabAttrs: (prop_types__WEBPACK_IMPORTED_MODULE_0___default().object)
};
const Tab = () => {
  throw new Error('ReactBootstrap: The `Tab` component is not meant to be rendered! ' + "It's an abstract component that is only valid as a direct Child of the `Tabs` Component. " + 'For custom tabs components use TabPane and TabsContainer directly');
};
Tab.propTypes = propTypes;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Object.assign(Tab, {
  Container: _TabContainer__WEBPACK_IMPORTED_MODULE_1__["default"],
  Content: _TabContent__WEBPACK_IMPORTED_MODULE_2__["default"],
  Pane: _TabPane__WEBPACK_IMPORTED_MODULE_3__["default"]
}));

/***/ },

/***/ "./node_modules/react-bootstrap/esm/TabContainer.js"
/*!**********************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/TabContainer.js ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _restart_ui_Tabs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @restart/ui/Tabs */ "./node_modules/@restart/ui/esm/Tabs.js");
/* harmony import */ var _getTabTransitionComponent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getTabTransitionComponent */ "./node_modules/react-bootstrap/esm/getTabTransitionComponent.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");



const TabContainer = ({
  transition,
  ...props
}) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_restart_ui_Tabs__WEBPACK_IMPORTED_MODULE_0__["default"], {
  ...props,
  transition: (0,_getTabTransitionComponent__WEBPACK_IMPORTED_MODULE_1__["default"])(transition)
});
TabContainer.displayName = 'TabContainer';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TabContainer);

/***/ },

/***/ "./node_modules/react-bootstrap/esm/TabContent.js"
/*!********************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/TabContent.js ***!
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





const TabContent = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  bsPrefix,
  as: Component = 'div',
  ...props
}, ref) => {
  bsPrefix = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_2__.useBootstrapPrefix)(bsPrefix, 'tab-content');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(Component, {
    ref: ref,
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(className, bsPrefix),
    ...props
  });
});
TabContent.displayName = 'TabContent';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TabContent);

/***/ },

/***/ "./node_modules/react-bootstrap/esm/TabPane.js"
/*!*****************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/TabPane.js ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _restart_ui_SelectableContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @restart/ui/SelectableContext */ "./node_modules/@restart/ui/esm/SelectableContext.js");
/* harmony import */ var _restart_ui_TabContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @restart/ui/TabContext */ "./node_modules/@restart/ui/esm/TabContext.js");
/* harmony import */ var _restart_ui_TabPanel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @restart/ui/TabPanel */ "./node_modules/@restart/ui/esm/TabPanel.js");
/* harmony import */ var _ThemeProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ThemeProvider */ "./node_modules/react-bootstrap/esm/ThemeProvider.js");
/* harmony import */ var _Fade__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Fade */ "./node_modules/react-bootstrap/esm/Fade.js");
/* harmony import */ var _getTabTransitionComponent__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./getTabTransitionComponent */ "./node_modules/react-bootstrap/esm/getTabTransitionComponent.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
"use client";










const TabPane = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({
  bsPrefix,
  transition,
  ...props
}, ref) => {
  const [{
    className,
    // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
    as: Component = 'div',
    ...rest
  }, {
    isActive,
    onEnter,
    onEntering,
    onEntered,
    onExit,
    onExiting,
    onExited,
    mountOnEnter,
    unmountOnExit,
    transition: Transition = _Fade__WEBPACK_IMPORTED_MODULE_6__["default"]
  }] = (0,_restart_ui_TabPanel__WEBPACK_IMPORTED_MODULE_4__.useTabPanel)({
    ...props,
    transition: (0,_getTabTransitionComponent__WEBPACK_IMPORTED_MODULE_7__["default"])(transition)
  });
  const prefix = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_5__.useBootstrapPrefix)(bsPrefix, 'tab-pane');

  // We provide an empty the TabContext so `<Nav>`s in `<TabPanel>`s don't
  // conflict with the top level one.
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_restart_ui_TabContext__WEBPACK_IMPORTED_MODULE_3__["default"].Provider, {
    value: null,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_restart_ui_SelectableContext__WEBPACK_IMPORTED_MODULE_2__["default"].Provider, {
      value: null,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(Transition, {
        in: isActive,
        onEnter: onEnter,
        onEntering: onEntering,
        onEntered: onEntered,
        onExit: onExit,
        onExiting: onExiting,
        onExited: onExited,
        mountOnEnter: mountOnEnter,
        unmountOnExit: unmountOnExit,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(Component, {
          ...rest,
          ref: ref,
          className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(className, prefix, isActive && 'active')
        })
      })
    })
  });
});
TabPane.displayName = 'TabPane';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TabPane);

/***/ },

/***/ "./node_modules/react-bootstrap/esm/Tabs.js"
/*!**************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/Tabs.js ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var uncontrollable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uncontrollable */ "./node_modules/uncontrollable/lib/esm/index.js");
/* harmony import */ var _restart_ui_Tabs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @restart/ui/Tabs */ "./node_modules/@restart/ui/esm/Tabs.js");
/* harmony import */ var _Nav__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Nav */ "./node_modules/react-bootstrap/esm/Nav.js");
/* harmony import */ var _NavLink__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./NavLink */ "./node_modules/react-bootstrap/esm/NavLink.js");
/* harmony import */ var _NavItem__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./NavItem */ "./node_modules/react-bootstrap/esm/NavItem.js");
/* harmony import */ var _TabContent__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./TabContent */ "./node_modules/react-bootstrap/esm/TabContent.js");
/* harmony import */ var _TabPane__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./TabPane */ "./node_modules/react-bootstrap/esm/TabPane.js");
/* harmony import */ var _ElementChildren__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ElementChildren */ "./node_modules/react-bootstrap/esm/ElementChildren.js");
/* harmony import */ var _getTabTransitionComponent__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./getTabTransitionComponent */ "./node_modules/react-bootstrap/esm/getTabTransitionComponent.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");












function getDefaultActiveKey(children) {
  let defaultActiveKey;
  (0,_ElementChildren__WEBPACK_IMPORTED_MODULE_8__.forEach)(children, child => {
    if (defaultActiveKey == null) {
      defaultActiveKey = child.props.eventKey;
    }
  });
  return defaultActiveKey;
}
function renderTab(child) {
  const {
    title,
    eventKey,
    disabled,
    tabClassName,
    tabAttrs,
    id
  } = child.props;
  if (title == null) {
    return null;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_NavItem__WEBPACK_IMPORTED_MODULE_5__["default"], {
    as: "li",
    role: "presentation",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_NavLink__WEBPACK_IMPORTED_MODULE_4__["default"], {
      as: "button",
      type: "button",
      eventKey: eventKey,
      disabled: disabled,
      id: id,
      className: tabClassName,
      ...tabAttrs,
      children: title
    })
  });
}
const Tabs = props => {
  const {
    id,
    onSelect,
    transition,
    mountOnEnter = false,
    unmountOnExit = false,
    variant = 'tabs',
    children,
    activeKey = getDefaultActiveKey(children),
    ...controlledProps
  } = (0,uncontrollable__WEBPACK_IMPORTED_MODULE_1__.useUncontrolled)(props, {
    activeKey: 'onSelect'
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_restart_ui_Tabs__WEBPACK_IMPORTED_MODULE_2__["default"], {
    id: id,
    activeKey: activeKey,
    onSelect: onSelect,
    transition: (0,_getTabTransitionComponent__WEBPACK_IMPORTED_MODULE_9__["default"])(transition),
    mountOnEnter: mountOnEnter,
    unmountOnExit: unmountOnExit,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_Nav__WEBPACK_IMPORTED_MODULE_3__["default"], {
      id: id,
      ...controlledProps,
      role: "tablist",
      as: "ul",
      variant: variant,
      children: (0,_ElementChildren__WEBPACK_IMPORTED_MODULE_8__.map)(children, renderTab)
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_TabContent__WEBPACK_IMPORTED_MODULE_6__["default"], {
      children: (0,_ElementChildren__WEBPACK_IMPORTED_MODULE_8__.map)(children, child => {
        const childProps = {
          ...child.props
        };
        delete childProps.title;
        delete childProps.disabled;
        delete childProps.tabClassName;
        delete childProps.tabAttrs;
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_TabPane__WEBPACK_IMPORTED_MODULE_7__["default"], {
          ...childProps
        });
      })
    })]
  });
};
Tabs.displayName = 'Tabs';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Tabs);

/***/ },

/***/ "./node_modules/react-bootstrap/esm/getTabTransitionComponent.js"
/*!***********************************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/getTabTransitionComponent.js ***!
  \***********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getTabTransitionComponent)
/* harmony export */ });
/* harmony import */ var _restart_ui_NoopTransition__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @restart/ui/NoopTransition */ "./node_modules/@restart/ui/esm/NoopTransition.js");
/* harmony import */ var _Fade__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Fade */ "./node_modules/react-bootstrap/esm/Fade.js");


function getTabTransitionComponent(transition) {
  if (typeof transition === 'boolean') {
    return transition ? _Fade__WEBPACK_IMPORTED_MODULE_1__["default"] : _restart_ui_NoopTransition__WEBPACK_IMPORTED_MODULE_0__["default"];
  }
  return transition;
}

/***/ },

/***/ "./resources/pos/src/shared/option-lists/status.json"
/*!***********************************************************!*\
  !*** ./resources/pos/src/shared/option-lists/status.json ***!
  \***********************************************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('[{"label":"Received","value":1},{"label":"Pending","value":2},{"label":"Ordered","value":3}]');

/***/ }

}]);