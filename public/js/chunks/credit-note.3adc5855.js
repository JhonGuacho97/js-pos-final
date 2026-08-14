"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["credit-note"],{

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

/***/ "./resources/pos/src/components/creditNote/CreateCreditNote.js"
/*!*********************************************************************!*\
  !*** ./resources/pos/src/components/creditNote/CreateCreditNote.js ***!
  \*********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _CreditNoteForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CreditNoteForm */ "./resources/pos/src/components/creditNote/CreditNoteForm.js");
/* harmony import */ var _header_HeaderTitle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../header/HeaderTitle */ "./resources/pos/src/components/header/HeaderTitle.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");





var CreateCreditNote = function CreateCreditNote() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_1__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_header_HeaderTitle__WEBPACK_IMPORTED_MODULE_3__["default"], {
      title: "Nota de Cr\xE9dito",
      to: "/app/credit-notes"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_CreditNoteForm__WEBPACK_IMPORTED_MODULE_2__["default"], {})]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CreateCreditNote);

/***/ },

/***/ "./resources/pos/src/components/creditNote/CreditNoteCategoryModal.js"
/*!****************************************************************************!*\
  !*** ./resources/pos/src/components/creditNote/CreditNoteCategoryModal.js ***!
  \****************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Modal.js");
/* harmony import */ var _config_apiConfig__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config/apiConfig */ "./resources/pos/src/config/apiConfig.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }




var CreditNoteCategoryModal = function CreditNoteCategoryModal(_ref) {
  var show = _ref.show,
    onHide = _ref.onHide,
    onCreated = _ref.onCreated;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(""),
    _useState2 = _slicedToArray(_useState, 2),
    name = _useState2[0],
    setName = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(""),
    _useState4 = _slicedToArray(_useState3, 2),
    description = _useState4[0],
    setDescription = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(""),
    _useState6 = _slicedToArray(_useState5, 2),
    error = _useState6[0],
    setError = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState8 = _slicedToArray(_useState7, 2),
    guardando = _useState8[0],
    setGuardando = _useState8[1];
  var handleGuardar = function handleGuardar() {
    if (!name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    setGuardando(true);
    _config_apiConfig__WEBPACK_IMPORTED_MODULE_2__["default"].post("/credit-note-categories", {
      name: name,
      description: description
    }).then(function (res) {
      onCreated === null || onCreated === void 0 || onCreated(res.data.data);
      setName("");
      setDescription("");
      setError("");
      onHide();
    })["catch"](function () {
      return setError("No se pudo guardar la categoría.");
    })["finally"](function () {
      return setGuardando(false);
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"], {
    show: show,
    onHide: onHide,
    centered: true,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Header, {
      closeButton: true,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Title, {
        children: "Nueva categor\xEDa"
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Body, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "mb-3",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("label", {
          className: "form-label",
          children: ["Nombre: ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
            className: "text-danger",
            children: "*"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
          type: "text",
          className: "form-control",
          value: name,
          onChange: function onChange(e) {
            return setName(e.target.value);
          },
          placeholder: "Ej: Devoluciones por garant\xEDa"
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "mb-3",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
          className: "form-label",
          children: "Descripci\xF3n:"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("textarea", {
          className: "form-control",
          rows: 3,
          value: description,
          onChange: function onChange(e) {
            return setDescription(e.target.value);
          }
        })]
      }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "text-danger small",
        children: error
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Footer, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
        className: "btn btn-light",
        onClick: onHide,
        children: "Cancelar"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
        className: "btn btn-primary",
        onClick: handleGuardar,
        disabled: guardando,
        children: "Guardar"
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CreditNoteCategoryModal);

/***/ },

/***/ "./resources/pos/src/components/creditNote/CreditNoteDetails.js"
/*!**********************************************************************!*\
  !*** ./resources/pos/src/components/creditNote/CreditNoteDetails.js ***!
  \**********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var react_bootstrap_sweetalert__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap-sweetalert */ "./node_modules/react-bootstrap-sweetalert/dist/index.js");
/* harmony import */ var react_bootstrap_sweetalert__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap_sweetalert__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_apiConfig__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../config/apiConfig */ "./resources/pos/src/config/apiConfig.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }






var CONCEPTO_LABEL = {
  POR_DEVOLUCION: "Por Devolución (ajustó stock)",
  POR_DESCUENTO: "Por Descuento",
  POR_CORRECCION_PRECIO: "Por Corrección de Precio",
  POR_ERROR_FACTURACION: "Por Error de Facturación",
  OTRO: "Otro"
};
var GENERAR_COMO_LABEL = {
  SALDO: "Normal (Saldo)",
  ANTICIPO: "Anticipo del cliente"
};
var CreditNoteDetails = function CreditNoteDetails() {
  var _useParams = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_2__.useParams)(),
    id = _useParams.id;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    creditNote = _useState2[0],
    setCreditNote = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true),
    _useState4 = _slicedToArray(_useState3, 2),
    cargando = _useState4[0],
    setCargando = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    emitiendo = _useState6[0],
    setEmitiendo = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState8 = _slicedToArray(_useState7, 2),
    mensajeEmision = _useState8[0],
    setMensajeEmision = _useState8[1];
  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState0 = _slicedToArray(_useState9, 2),
    confirmandoCancelacion = _useState0[0],
    setConfirmandoCancelacion = _useState0[1];
  var _useState1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState10 = _slicedToArray(_useState1, 2),
    cancelando = _useState10[0],
    setCancelando = _useState10[1];
  var recargar = function recargar() {
    _config_apiConfig__WEBPACK_IMPORTED_MODULE_4__["default"].get("/credit-notes/".concat(id)).then(function (res) {
      return setCreditNote(res.data.data);
    });
  };
  var cancelarNota = function cancelarNota() {
    setCancelando(true);
    _config_apiConfig__WEBPACK_IMPORTED_MODULE_4__["default"].post("/credit-notes/".concat(id, "/cancelar")).then(function (res) {
      setMensajeEmision({
        tipo: 'success',
        texto: res.data.message
      });
      recargar();
    })["catch"](function (error) {
      var _error$response;
      setMensajeEmision({
        tipo: 'danger',
        texto: (error === null || error === void 0 || (_error$response = error.response) === null || _error$response === void 0 || (_error$response = _error$response.data) === null || _error$response === void 0 ? void 0 : _error$response.message) || 'No se pudo cancelar la nota de crédito.'
      });
    })["finally"](function () {
      setCancelando(false);
      setConfirmandoCancelacion(false);
    });
  };
  var emitir = function emitir() {
    setEmitiendo(true);
    setMensajeEmision(null);
    _config_apiConfig__WEBPACK_IMPORTED_MODULE_4__["default"].post("/credit-notes/".concat(id, "/emitir")).then(function (res) {
      setMensajeEmision({
        tipo: 'success',
        texto: res.data.message
      });
      setTimeout(recargar, 4000);
    })["catch"](function (error) {
      var _error$response2;
      setMensajeEmision({
        tipo: 'danger',
        texto: (error === null || error === void 0 || (_error$response2 = error.response) === null || _error$response2 === void 0 || (_error$response2 = _error$response2.data) === null || _error$response2 === void 0 ? void 0 : _error$response2.message) || 'No se pudo iniciar la emisión.'
      });
    })["finally"](function () {
      return setEmitiendo(false);
    });
  };
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    _config_apiConfig__WEBPACK_IMPORTED_MODULE_4__["default"].get("/credit-notes/".concat(id)).then(function (res) {
      return setCreditNote(res.data.data);
    })["finally"](function () {
      return setCargando(false);
    });
  }, [id]);
  if (cargando) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_MasterLayout__WEBPACK_IMPORTED_MODULE_5__["default"], {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
        className: "text-muted",
        children: "Cargando..."
      })
    });
  }
  if (!creditNote) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_MasterLayout__WEBPACK_IMPORTED_MODULE_5__["default"], {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
        className: "alert alert-danger",
        children: "No se encontr\xF3 la nota de cr\xE9dito."
      })
    });
  }
  var items = creditNote.credit_note_items || [];
  var subtotal = items.reduce(function (acc, it) {
    return acc + (it.sub_total || 0);
  }, 0);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_5__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: "d-flex justify-content-between align-items-center mb-4",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("h4", {
        className: "mb-0 d-flex align-items-center gap-2",
        children: ["Nota de Cr\xE9dito ", creditNote.reference_code, creditNote.esta_cancelada && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
          className: "badge bg-secondary",
          children: "Cancelada"
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "d-flex gap-2",
        children: [!creditNote.electronic_invoice_estado && !creditNote.esta_cancelada && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("button", {
          className: "btn btn-primary d-inline-flex align-items-center gap-2",
          onClick: emitir,
          disabled: emitiendo,
          children: emitiendo ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
              className: "spinner-border spinner-border-sm",
              role: "status",
              "aria-hidden": "true"
            }), "Emitiendo..."]
          }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("i", {
              className: "bi bi-send",
              style: {
                fontSize: 14
              }
            }), "Emitir nota de cr\xE9dito"]
          })
        }), creditNote.puede_cancelarse && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("button", {
          className: "btn btn-outline-danger d-inline-flex align-items-center gap-2",
          onClick: function onClick() {
            return setConfirmandoCancelacion(true);
          },
          disabled: cancelando,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("i", {
            className: "bi bi-x-circle",
            style: {
              fontSize: 14
            }
          }), "Cancelar nota"]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Link, {
          to: "/app/credit-notes",
          className: "btn btn-outline-primary",
          children: "\u2039 Volver al listado"
        })]
      })]
    }), confirmandoCancelacion && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)((react_bootstrap_sweetalert__WEBPACK_IMPORTED_MODULE_3___default()), {
      custom: true,
      confirmBtnBsStyle: "danger mb-3 fs-5 rounded",
      cancelBtnBsStyle: "secondary mb-3 fs-5 rounded text-white",
      confirmBtnText: "S\xED, cancelar nota",
      cancelBtnText: "Volver",
      title: "\xBFCancelar esta nota de cr\xE9dito?",
      onConfirm: cancelarNota,
      onCancel: function onCancel() {
        return setConfirmandoCancelacion(false);
      },
      showCancel: true,
      focusCancelBtn: true,
      disabled: cancelando,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
        className: "sweet-text",
        children: creditNote.concepto === 'POR_DEVOLUCION' ? 'Esto revierte el stock que esta nota había devuelto al inventario y anula su efecto sobre el saldo disponible de la factura. Esta acción no se puede deshacer.' : 'Esto anula el efecto de esta nota sobre el saldo disponible de la factura. Esta acción no se puede deshacer.'
      })
    }), mensajeEmision && function () {
      var iconMap = {
        success: 'bi-check-circle',
        danger: 'bi-x-circle',
        warning: 'bi-exclamation-circle',
        info: 'bi-info-circle'
      };
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "d-flex align-items-start gap-2 border rounded-3 p-3 mb-3 border-".concat(mensajeEmision.tipo, "-subtle bg-").concat(mensajeEmision.tipo, "-subtle"),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("i", {
          className: "bi ".concat(iconMap[mensajeEmision.tipo] || 'bi-info-circle', " text-").concat(mensajeEmision.tipo, " flex-shrink-0"),
          style: {
            fontSize: 16,
            marginTop: 2
          }
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
          className: "mb-0 flex-grow-1 text-".concat(mensajeEmision.tipo, "-emphasis"),
          style: {
            fontSize: 14
          },
          children: mensajeEmision.texto
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("button", {
          type: "button",
          className: "btn-close",
          style: {
            fontSize: 11
          },
          "aria-label": "Cerrar",
          onClick: function onClick() {
            return setMensajeEmision(null);
          }
        })]
      });
    }(), creditNote.electronic_invoice_estado && function () {
      var estado = creditNote.electronic_invoice_estado;
      var config = {
        AUTORIZADA: {
          icon: 'bi-check-lg',
          color: 'success',
          label: 'Autorizada'
        },
        'NO AUTORIZADA': {
          icon: 'bi-x-lg',
          color: 'danger',
          label: 'No autorizada'
        },
        DEVUELTA: {
          icon: 'bi-x-lg',
          color: 'danger',
          label: 'Devuelta'
        },
        PENDIENTE: {
          icon: 'bi-clock',
          color: 'warning',
          label: 'Pendiente'
        },
        PROCESANDO: {
          icon: 'bi-clock',
          color: 'warning',
          label: 'En proceso'
        }
      }[estado] || {
        icon: 'bi-question-lg',
        color: 'secondary',
        label: estado
      };
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
        className: "border rounded-3 p-3 mb-2 bg-white",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
          className: "d-flex align-items-start gap-3",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "d-flex align-items-center justify-content-center flex-shrink-0 bg-".concat(config.color, "-subtle"),
            style: {
              width: 36,
              height: 36,
              borderRadius: '50%'
            },
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("i", {
              className: "bi ".concat(config.icon, " text-").concat(config.color),
              style: {
                fontSize: 16
              }
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
            className: "flex-grow-1 min-w-0",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
              className: "text-uppercase text-muted mb-1",
              style: {
                fontSize: 12,
                letterSpacing: '0.03em'
              },
              children: "Comprobante electr\xF3nico"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
              className: "fw-medium mb-0 text-".concat(config.color),
              style: {
                fontSize: 16
              },
              children: config.label
            }), creditNote.electronic_invoice_numero_autorizacion && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
              className: "mt-2 pt-2 border-top",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
                className: "text-muted mb-1",
                style: {
                  fontSize: 12
                },
                children: "N\xFAmero de autorizaci\xF3n"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
                className: "mb-0 text-break",
                style: {
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: 13
                },
                children: creditNote.electronic_invoice_numero_autorizacion
              })]
            }), estado === 'AUTORIZADA' && creditNote.electronic_invoice_id && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("a", {
              href: "/api/electronic-invoices/".concat(creditNote.electronic_invoice_id, "/ride"),
              target: "_blank",
              rel: "noreferrer",
              className: "d-inline-flex align-items-center gap-1 mt-2 text-decoration-none",
              style: {
                fontSize: 13
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("i", {
                className: "bi bi-file-earmark-pdf",
                style: {
                  fontSize: 16
                }
              }), "Ver PDF"]
            })]
          })]
        })
      });
    }(), ",", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: "row g-3 mb-4",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
        className: "col-md-6",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
          className: "card border-0 shadow-sm h-100",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "card-header text-white py-2",
            style: {
              background: "#2F6FED"
            },
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("strong", {
              children: "Datos de Factura"
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "card-body",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
              className: "row g-3",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
                className: "col-md-6",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
                  className: "form-label text-muted small",
                  children: "Cliente"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                  className: "fw-semibold",
                  children: creditNote.customer_name
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
                className: "col-md-6",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
                  className: "form-label text-muted small",
                  children: "Tipo Comprobante"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                  className: "fw-semibold",
                  children: creditNote.tipo_comprobante_modificado
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
                className: "col-md-6",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
                  className: "form-label text-muted small",
                  children: "Nro. Comprobante"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                  className: "fw-semibold",
                  children: creditNote.numero_comprobante_modificado
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
                className: "col-md-6",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
                  className: "form-label text-muted small",
                  children: "Generar como"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                  className: "fw-semibold",
                  children: GENERAR_COMO_LABEL[creditNote.generar_como] || creditNote.generar_como
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
                className: "col-md-6",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
                  className: "form-label text-muted small",
                  children: "Almac\xE9n"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                  className: "fw-semibold",
                  children: creditNote.warehouse_name || "-"
                })]
              })]
            })
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
        className: "col-md-6",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
          className: "card border-0 shadow-sm h-100",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "card-header text-white py-2",
            style: {
              background: "#2F6FED"
            },
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("strong", {
              children: "Datos de Nota de Cr\xE9dito"
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "card-body",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
              className: "row g-3",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
                className: "col-md-6",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
                  className: "form-label text-muted small",
                  children: "Fecha de Emisi\xF3n"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                  className: "fw-semibold",
                  children: creditNote.date
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
                className: "col-md-6",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
                  className: "form-label text-muted small",
                  children: "Vendedor"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                  className: "fw-semibold",
                  children: creditNote.vendedor || "-"
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
                className: "col-md-6",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
                  className: "form-label text-muted small",
                  children: "Concepto"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                  className: "fw-semibold",
                  children: CONCEPTO_LABEL[creditNote.concepto] || creditNote.concepto
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
                className: "col-md-6",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
                  className: "form-label text-muted small",
                  children: "Categor\xEDa"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                  className: "fw-semibold",
                  children: creditNote.category_name || "-"
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
                className: "col-12",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
                  className: "form-label text-muted small",
                  children: "Motivo"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                  className: "fw-semibold",
                  children: creditNote.motivo
                })]
              })]
            })
          })]
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: "card border-0 shadow-sm mb-4",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
        className: "card-header text-white py-2",
        style: {
          background: "#2F6FED"
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("strong", {
          children: "Detalles"
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "card-body",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "table-responsive",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("table", {
            className: "table table-hover",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("thead", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("tr", {
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("th", {
                  children: "C\xF3digo"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("th", {
                  children: "Producto"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("th", {
                  children: "Cantidad"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("th", {
                  children: "Precio"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("th", {
                  children: "Descuento"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("th", {
                  children: "IVA"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("th", {
                  children: "Total"
                })]
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("tbody", {
              children: [items.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("tr", {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("td", {
                  colSpan: 7,
                  className: "text-center text-muted",
                  children: "Sin productos."
                })
              }), items.map(function (item) {
                var _item$product, _item$product2, _item$product3, _item$product4, _item$product5;
                return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("tr", {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("td", {
                    children: ((_item$product = item.product) === null || _item$product === void 0 || (_item$product = _item$product.attributes) === null || _item$product === void 0 ? void 0 : _item$product.code) || ((_item$product2 = item.product) === null || _item$product2 === void 0 ? void 0 : _item$product2.code)
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("td", {
                    children: [((_item$product3 = item.product) === null || _item$product3 === void 0 || (_item$product3 = _item$product3.attributes) === null || _item$product3 === void 0 ? void 0 : _item$product3.name) || ((_item$product4 = item.product) === null || _item$product4 === void 0 ? void 0 : _item$product4.name), ((_item$product5 = item.product) === null || _item$product5 === void 0 || (_item$product5 = _item$product5.attributes) === null || _item$product5 === void 0 ? void 0 : _item$product5.variation_type_name) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
                      className: "badge bg-light-primary ms-1",
                      children: item.product.attributes.variation_type_name
                    })]
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("td", {
                    children: item.quantity
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("td", {
                    children: ["$", Number(item.product_price || 0).toFixed(2)]
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("td", {
                    children: ["$", Number(item.discount_amount || 0).toFixed(2)]
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("td", {
                    children: ["$", Number(item.tax_amount || 0).toFixed(2)]
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("td", {
                    children: ["$", Number(item.sub_total || 0).toFixed(2)]
                  })]
                }, item.id);
              })]
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "row justify-content-end mt-3",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
            className: "col-md-4",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
              className: "d-flex justify-content-between",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
                children: "Subtotal"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("span", {
                children: ["$", subtotal.toFixed(2)]
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
              className: "d-flex justify-content-between",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
                children: "Descuento"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("span", {
                children: ["$", Number(creditNote.discount || 0).toFixed(2)]
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
              className: "d-flex justify-content-between",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
                children: "IVA"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("span", {
                children: ["$", Number(creditNote.tax_amount || 0).toFixed(2)]
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("hr", {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
              className: "d-flex justify-content-between fs-5 fw-bold text-danger",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
                children: "Total Nota Cr\xE9dito"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("span", {
                children: ["$", Number(creditNote.grand_total || 0).toFixed(2)]
              })]
            })]
          })
        })]
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CreditNoteDetails);

/***/ },

/***/ "./resources/pos/src/components/creditNote/CreditNoteForm.js"
/*!*******************************************************************!*\
  !*** ./resources/pos/src/components/creditNote/CreditNoteForm.js ***!
  \*******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap-v5 */ "./node_modules/react-bootstrap-v5/lib/esm/InputGroup.js");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "./node_modules/@fortawesome/react-fontawesome/index.es.js");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.mjs");
/* harmony import */ var _config_apiConfig__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../config/apiConfig */ "./resources/pos/src/config/apiConfig.js");
/* harmony import */ var _shared_components_product_cart_search_ProductSearch__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../shared/components/product-cart/search/ProductSearch */ "./resources/pos/src/shared/components/product-cart/search/ProductSearch.js");
/* harmony import */ var _shared_components_sales_ProductRowTable__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shared/components/sales/ProductRowTable */ "./resources/pos/src/shared/components/sales/ProductRowTable.js");
/* harmony import */ var _shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/select/reactSelect */ "./resources/pos/src/shared/select/reactSelect.js");
/* harmony import */ var _store_action_productAction__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../store/action/productAction */ "./resources/pos/src/store/action/productAction.js");
/* harmony import */ var _store_action_customerAction__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../store/action/customerAction */ "./resources/pos/src/store/action/customerAction.js");
/* harmony import */ var _shared_prepareArray_prepareSaleArray__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../shared/prepareArray/prepareSaleArray */ "./resources/pos/src/shared/prepareArray/prepareSaleArray.js");
/* harmony import */ var _shared_calculation_calculation__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../shared/calculation/calculation */ "./resources/pos/src/shared/calculation/calculation.js");
/* harmony import */ var _store_action_toastAction__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../store/action/toastAction */ "./resources/pos/src/store/action/toastAction.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../constants */ "./resources/pos/src/constants/index.js");
/* harmony import */ var _CreditNoteCategoryModal__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./CreditNoteCategoryModal */ "./resources/pos/src/components/creditNote/CreditNoteCategoryModal.js");
/* harmony import */ var _FacturaListModal__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./FacturaListModal */ "./resources/pos/src/components/creditNote/FacturaListModal.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! dayjs */ "./node_modules/dayjs/dayjs.min.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(dayjs__WEBPACK_IMPORTED_MODULE_18__);
/* harmony import */ var dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! dayjs/plugin/utc */ "./node_modules/dayjs/plugin/utc.js");
/* harmony import */ var dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_19__);
/* harmony import */ var dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! dayjs/plugin/localizedFormat */ "./node_modules/dayjs/plugin/localizedFormat.js");
/* harmony import */ var dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_20___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_20__);
/* harmony import */ var dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! dayjs/plugin/isoWeek */ "./node_modules/dayjs/plugin/isoWeek.js");
/* harmony import */ var dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_21___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_21__);
/* harmony import */ var dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! dayjs/plugin/relativeTime */ "./node_modules/dayjs/plugin/relativeTime.js");
/* harmony import */ var dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_22___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_22__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
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

























dayjs__WEBPACK_IMPORTED_MODULE_18___default().extend((dayjs_plugin_utc__WEBPACK_IMPORTED_MODULE_19___default()));
dayjs__WEBPACK_IMPORTED_MODULE_18___default().extend((dayjs_plugin_localizedFormat__WEBPACK_IMPORTED_MODULE_20___default()));
dayjs__WEBPACK_IMPORTED_MODULE_18___default().extend((dayjs_plugin_isoWeek__WEBPACK_IMPORTED_MODULE_21___default()));
dayjs__WEBPACK_IMPORTED_MODULE_18___default().extend((dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_22___default()));
var CONCEPTOS = [{
  value: 'POR_DEVOLUCION',
  label: 'Por Devolución (ajusta stock)'
}, {
  value: 'POR_DESCUENTO',
  label: 'Por Descuento'
}, {
  value: 'POR_CORRECCION_PRECIO',
  label: 'Por Corrección de Precio'
}, {
  value: 'POR_ERROR_FACTURACION',
  label: 'Por Error de Facturación'
}, {
  value: 'OTRO',
  label: 'Otro'
}];
var CreditNoteForm = function CreditNoteForm(props) {
  var _factura$customer, _factura$customer2, _factura$customer3, _factura$customer4, _factura$customer5, _factura$customer6;
  var products = props.products,
    fetchProductsByWarehouse = props.fetchProductsByWarehouse,
    customers = props.customers,
    fetchAllCustomer = props.fetchAllCustomer;
  var navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_1__.useNavigate)();
  var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_2__.useDispatch)();
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    clienteSeleccionado = _useState2[0],
    setClienteSeleccionado = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    showFacturaListModal = _useState4[0],
    setShowFacturaListModal = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState6 = _slicedToArray(_useState5, 2),
    busquedaFactura = _useState6[0],
    setBusquedaFactura = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState8 = _slicedToArray(_useState7, 2),
    factura = _useState8[0],
    setFactura = _useState8[1];
  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState0 = _slicedToArray(_useState9, 2),
    buscandoFactura = _useState0[0],
    setBuscandoFactura = _useState0[1];
  var _useState1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState10 = _slicedToArray(_useState1, 2),
    errorFactura = _useState10[0],
    setErrorFactura = _useState10[1];
  var _useState11 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState12 = _slicedToArray(_useState11, 2),
    categorias = _useState12[0],
    setCategorias = _useState12[1];
  var _useState13 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState14 = _slicedToArray(_useState13, 2),
    showCategoryModal = _useState14[0],
    setShowCategoryModal = _useState14[1];
  var _useState15 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState16 = _slicedToArray(_useState15, 2),
    updateProducts = _useState16[0],
    setUpdateProducts = _useState16[1];
  var _useState17 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0),
    _useState18 = _slicedToArray(_useState17, 2),
    quantity = _useState18[0],
    setQuantity = _useState18[1];
  var _useState19 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState20 = _slicedToArray(_useState19, 2),
    newCost = _useState20[0],
    setNewCost = _useState20[1];
  var _useState21 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState22 = _slicedToArray(_useState21, 2),
    newDiscount = _useState22[0],
    setNewDiscount = _useState22[1];
  var _useState23 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState24 = _slicedToArray(_useState23, 2),
    newTax = _useState24[0],
    setNewTax = _useState24[1];
  var _useState25 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState26 = _slicedToArray(_useState25, 2),
    subTotal = _useState26[0],
    setSubTotal = _useState26[1];
  var _useState27 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState28 = _slicedToArray(_useState27, 2),
    newSaleUnit = _useState28[0],
    setNewSaleUnit = _useState28[1];
  var _useState29 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState30 = _slicedToArray(_useState29, 2),
    enviando = _useState30[0],
    setEnviando = _useState30[1];
  var _useState31 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({}),
    _useState32 = _slicedToArray(_useState31, 2),
    errors = _useState32[0],
    setErrors = _useState32[1];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    setUpdateProducts(updateProducts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateProducts, quantity, newCost, newDiscount, newTax, subTotal, newSaleUnit]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchAllCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  var _useState33 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      date: dayjs__WEBPACK_IMPORTED_MODULE_18___default()().format('YYYY-MM-DD'),
      vendedor: '',
      generar_como: 'SALDO',
      concepto: 'POR_DEVOLUCION',
      credit_note_category_id: '',
      motivo: '',
      tax_rate: '0.00',
      discount: '0.00',
      shipping: '0.00'
    }),
    _useState34 = _slicedToArray(_useState33, 2),
    creditNoteValue = _useState34[0],
    setCreditNoteValue = _useState34[1];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    cargarCategorias();
  }, []);
  var cargarCategorias = function cargarCategorias() {
    _config_apiConfig__WEBPACK_IMPORTED_MODULE_6__["default"].get('/credit-note-categories').then(function (res) {
      return setCategorias(res.data.data || []);
    });
  };
  var buscarFactura = function buscarFactura(textoOverride) {
    var texto = textoOverride !== null && textoOverride !== void 0 ? textoOverride : busquedaFactura;
    if (!texto || !texto.trim()) return;
    setBuscandoFactura(true);
    setErrorFactura('');
    _config_apiConfig__WEBPACK_IMPORTED_MODULE_6__["default"].get('/credit-notes/buscar-factura', {
      params: {
        busqueda: texto
      }
    }).then(function (res) {
      setFactura(res.data.data);
      setBusquedaFactura(res.data.data.numero_comprobante || texto);
      if (res.data.data.customer) {
        var _res$data$data$custom;
        setClienteSeleccionado({
          value: res.data.data.customer_id,
          label: ((_res$data$data$custom = res.data.data.customer.attributes) === null || _res$data$data$custom === void 0 ? void 0 : _res$data$data$custom.name) || res.data.data.customer.name
        });
      }
      if (res.data.data.warehouse_id) {
        fetchProductsByWarehouse(res.data.data.warehouse_id);
      }
      // Precarga los productos de la factura original -- el
      // usuario puede ajustar cantidades, quitar líneas que
      // no correspondan, o agregar productos nuevos aparte
      // con el buscador (para casos especiales).
      setUpdateProducts(res.data.data.sale_items || []);
    })["catch"](function () {
      setFactura(null);
      setErrorFactura('No se encontró ninguna factura con ese número.');
    })["finally"](function () {
      return setBuscandoFactura(false);
    });
  };
  var limpiarFactura = function limpiarFactura() {
    setFactura(null);
    setBusquedaFactura('');
    setErrorFactura('');
    setUpdateProducts([]);
  };
  var onClienteChange = function onClienteChange(obj) {
    setClienteSeleccionado(obj);
    // Cambiar de cliente invalida la factura ya elegida.
    limpiarFactura();
  };
  var onClienteClear = function onClienteClear() {
    setClienteSeleccionado(null);
    limpiarFactura();
  };
  var onClickOjo = function onClickOjo() {
    if (!clienteSeleccionado) {
      dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_14__.addToast)({
        text: 'Seleccionar Factura',
        type: _constants__WEBPACK_IMPORTED_MODULE_15__.toastType.WARNING
      }));
      return;
    }
    setShowFacturaListModal(true);
  };
  var onSeleccionarFacturaDelModal = function onSeleccionarFacturaDelModal(fila) {
    setShowFacturaListModal(false);
    buscarFactura(fila.numero_comprobante);
  };
  var onChangeInput = function onChangeInput(e) {
    setCreditNoteValue(function (v) {
      return _objectSpread(_objectSpread({}, v), {}, _defineProperty({}, e.target.name, e.target.value));
    });
  };

  // Pasado a <ProductSearch>, que lo llama cuando se intenta buscar un
  // producto sin haber seleccionado factura todavía (values.warehouse_id
  // vacío -- ver ProductSearch.js:50-51). Antes esto era un stub que no
  // hacía nada, así que el usuario tecleaba en el buscador sin ningún
  // resultado ni explicación de por qué.
  var handleValidation = function handleValidation() {
    dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_14__.addToast)({
      text: 'Buscá y seleccioná una factura antes de agregar productos.',
      type: _constants__WEBPACK_IMPORTED_MODULE_15__.toastType.ERROR
    }));
    return false;
  };
  var onCategoryCreated = function onCategoryCreated(nuevaCategoria) {
    cargarCategorias();
    setCreditNoteValue(function (v) {
      return _objectSpread(_objectSpread({}, v), {}, {
        credit_note_category_id: nuevaCategoria.id
      });
    });
  };
  var onSubmit = function onSubmit(e) {
    e.preventDefault();
    if (!factura) {
      dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_14__.addToast)({
        text: 'Buscá y seleccioná una factura primero.',
        type: _constants__WEBPACK_IMPORTED_MODULE_15__.toastType.ERROR
      }));
      return;
    }
    if (updateProducts.length < 1) {
      dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_14__.addToast)({
        text: 'Agregá al menos un producto.',
        type: _constants__WEBPACK_IMPORTED_MODULE_15__.toastType.ERROR
      }));
      return;
    }
    // El backend ya rechaza quantity <= 0 (422), pero antes acá no
    // había ningún control -- el usuario se enteraba recién después
    // de enviar, con un error genérico en vez de saber qué línea
    // corregir.
    var lineaInvalida = updateProducts.find(function (p) {
      return !(Number(p.quantity) > 0);
    });
    if (lineaInvalida) {
      dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_14__.addToast)({
        text: 'Hay un producto con cantidad inválida (debe ser mayor a 0).',
        type: _constants__WEBPACK_IMPORTED_MODULE_15__.toastType.ERROR
      }));
      return;
    }
    if (!creditNoteValue.motivo.trim()) {
      setErrors({
        motivo: 'El motivo es obligatorio.'
      });
      return;
    }
    var payload = {
      date: creditNoteValue.date,
      sale_id: factura.sale_id,
      customer_id: factura.customer_id,
      warehouse_id: factura.warehouse_id,
      vendedor: creditNoteValue.vendedor,
      generar_como: creditNoteValue.generar_como,
      concepto: creditNoteValue.concepto,
      credit_note_category_id: creditNoteValue.credit_note_category_id || null,
      motivo: creditNoteValue.motivo,
      tax_rate: creditNoteValue.tax_rate,
      tax_amount: (0,_shared_calculation_calculation__WEBPACK_IMPORTED_MODULE_13__.calculateCartTotalTaxAmount)(updateProducts, creditNoteValue),
      discount: creditNoteValue.discount,
      shipping: creditNoteValue.shipping,
      grand_total: (0,_shared_calculation_calculation__WEBPACK_IMPORTED_MODULE_13__.calculateCartTotalAmount)(updateProducts, creditNoteValue),
      credit_note_items: updateProducts
    };
    setEnviando(true);
    _config_apiConfig__WEBPACK_IMPORTED_MODULE_6__["default"].post('/credit-notes', payload).then(function () {
      dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_14__.addToast)({
        text: 'Nota de crédito creada correctamente.'
      }));
      navigate('/app/credit-notes');
    })["catch"](function (error) {
      var _error$response;
      var mensaje = (error === null || error === void 0 || (_error$response = error.response) === null || _error$response === void 0 || (_error$response = _error$response.data) === null || _error$response === void 0 ? void 0 : _error$response.message) || 'No se pudo crear la nota de crédito.';
      dispatch((0,_store_action_toastAction__WEBPACK_IMPORTED_MODULE_14__.addToast)({
        text: mensaje,
        type: _constants__WEBPACK_IMPORTED_MODULE_15__.toastType.ERROR
      }));
    })["finally"](function () {
      return setEnviando(false);
    });
  };
  var categoriaOptions = categorias.map(function (c) {
    return {
      value: c.id,
      label: c.name
    };
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
    className: "card",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
      className: "card-body",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
        className: "row g-3 mb-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("div", {
          className: "col-md-6",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
            className: "card border-0 shadow-sm h-100",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("div", {
              className: "card-header text-white py-2",
              style: {
                background: '#2F6FED'
              },
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("strong", {
                children: "Datos de Factura"
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
              className: "card-body",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"], {
                className: "flex-nowrap position-relative mb-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_9__["default"], {
                  name: "cliente_credit_note",
                  data: customers,
                  onChange: onClienteChange,
                  title: "Seleccionar Cliente",
                  defaultValue: clienteSeleccionado,
                  value: clienteSeleccionado,
                  placeholder: "Buscar Cliente"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("button", {
                  variant: "danger",
                  onClick: onClienteClear,
                  className: "btn btn-danger clear-btn",
                  title: "Limpiar cliente",
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_5__.faTimes
                  })
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("label", {
                className: "form-label",
                children: "N\xFAmero de Factura:"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"], {
                className: "mb-2",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(react_bootstrap_v5__WEBPACK_IMPORTED_MODULE_3__["default"].Text, {
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_5__.faSearch
                  })
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("input", {
                  type: "text",
                  className: "form-control",
                  placeholder: "000-000-000000000",
                  value: busquedaFactura,
                  onChange: function onChange(e) {
                    return setBusquedaFactura(e.target.value);
                  },
                  onKeyDown: function onKeyDown(e) {
                    return e.key === 'Enter' && buscarFactura();
                  }
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("button", {
                  className: "btn btn-danger",
                  type: "button",
                  onClick: limpiarFactura,
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_5__.faTimes
                  })
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("button", {
                  className: "btn btn-outline-primary",
                  type: "button",
                  onClick: onClickOjo,
                  disabled: buscandoFactura,
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__.FontAwesomeIcon, {
                    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_5__.faEye
                  })
                })]
              }), errorFactura && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("div", {
                className: "text-danger small mb-2",
                children: errorFactura
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
                className: "row g-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
                  className: "col-md-6",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("label", {
                    className: "form-label",
                    children: "Saldo Fac.:"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("input", {
                    type: "text",
                    className: "form-control",
                    readOnly: true,
                    value: factura ? factura.saldo.toFixed(2) : '0.00'
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
                  className: "col-md-6",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("label", {
                    className: "form-label",
                    children: "Generar como:"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("select", {
                    className: "form-select",
                    name: "generar_como",
                    value: creditNoteValue.generar_como,
                    onChange: onChangeInput,
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("option", {
                      value: "SALDO",
                      children: "Normal (Saldo)"
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("option", {
                      value: "ANTICIPO",
                      children: "Anticipo del cliente"
                    })]
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
                  className: "col-md-6",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("label", {
                    className: "form-label",
                    children: "C\xE9dula/RUC:"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("input", {
                    type: "text",
                    className: "form-control",
                    readOnly: true,
                    value: (factura === null || factura === void 0 || (_factura$customer = factura.customer) === null || _factura$customer === void 0 || (_factura$customer = _factura$customer.attributes) === null || _factura$customer === void 0 ? void 0 : _factura$customer.identification) || (factura === null || factura === void 0 || (_factura$customer2 = factura.customer) === null || _factura$customer2 === void 0 ? void 0 : _factura$customer2.identification) || ''
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
                  className: "col-md-6",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("label", {
                    className: "form-label",
                    children: "Correo:"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("input", {
                    type: "text",
                    className: "form-control",
                    readOnly: true,
                    value: (factura === null || factura === void 0 || (_factura$customer3 = factura.customer) === null || _factura$customer3 === void 0 || (_factura$customer3 = _factura$customer3.attributes) === null || _factura$customer3 === void 0 ? void 0 : _factura$customer3.email) || (factura === null || factura === void 0 || (_factura$customer4 = factura.customer) === null || _factura$customer4 === void 0 ? void 0 : _factura$customer4.email) || ''
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
                  className: "col-md-6",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("label", {
                    className: "form-label",
                    children: "Direcci\xF3n:"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("input", {
                    type: "text",
                    className: "form-control",
                    readOnly: true,
                    value: (factura === null || factura === void 0 || (_factura$customer5 = factura.customer) === null || _factura$customer5 === void 0 || (_factura$customer5 = _factura$customer5.attributes) === null || _factura$customer5 === void 0 ? void 0 : _factura$customer5.address) || (factura === null || factura === void 0 || (_factura$customer6 = factura.customer) === null || _factura$customer6 === void 0 ? void 0 : _factura$customer6.address) || ''
                  })]
                })]
              })]
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("div", {
          className: "col-md-6",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
            className: "card border-0 shadow-sm h-100",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("div", {
              className: "card-header text-white py-2",
              style: {
                background: '#2F6FED'
              },
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("strong", {
                children: "Datos de Nota de Cr\xE9dito"
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("div", {
              className: "card-body",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
                className: "row g-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
                  className: "col-md-4",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("label", {
                    className: "form-label",
                    children: "Tipo Comprobante:"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("input", {
                    type: "text",
                    className: "form-control",
                    readOnly: true,
                    value: (factura === null || factura === void 0 ? void 0 : factura.tipo_comprobante) || ''
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
                  className: "col-md-4",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("label", {
                    className: "form-label",
                    children: "Fecha de Emisi\xF3n:"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("input", {
                    type: "date",
                    className: "form-control",
                    name: "date",
                    value: creditNoteValue.date,
                    onChange: onChangeInput
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
                  className: "col-md-4",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("label", {
                    className: "form-label",
                    children: "Nro. Comprobante:"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("input", {
                    type: "text",
                    className: "form-control",
                    readOnly: true,
                    value: (factura === null || factura === void 0 ? void 0 : factura.numero_comprobante) || ''
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
                  className: "col-md-6",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("label", {
                    className: "form-label",
                    children: "Vendedor:"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("input", {
                    type: "text",
                    className: "form-control",
                    name: "vendedor",
                    value: creditNoteValue.vendedor,
                    onChange: onChangeInput,
                    placeholder: "Vendedor"
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
                  className: "col-md-6",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("label", {
                    className: "form-label",
                    children: "Concepto:"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("select", {
                    className: "form-select",
                    name: "concepto",
                    value: creditNoteValue.concepto,
                    onChange: onChangeInput,
                    children: CONCEPTOS.map(function (c) {
                      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("option", {
                        value: c.value,
                        children: c.label
                      }, c.value);
                    })
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
                  className: "col-md-11",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("label", {
                    className: "form-label",
                    children: "Categor\xEDa:"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("select", {
                    className: "form-select",
                    name: "credit_note_category_id",
                    value: creditNoteValue.credit_note_category_id,
                    onChange: onChangeInput,
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("option", {
                      value: "",
                      children: "--Seleccionar--"
                    }), categoriaOptions.map(function (c) {
                      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("option", {
                        value: c.value,
                        children: c.label
                      }, c.value);
                    })]
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("div", {
                  className: "col-md-1 d-flex align-items-end",
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("button", {
                    type: "button",
                    className: "btn btn-primary",
                    onClick: function onClick() {
                      return setShowCategoryModal(true);
                    },
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__.FontAwesomeIcon, {
                      icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_5__.faPlus
                    })
                  })
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
                  className: "col-12",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("label", {
                    className: "form-label",
                    children: ["Motivo: ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("span", {
                      className: "text-danger",
                      children: "*"
                    })]
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("input", {
                    type: "text",
                    className: "form-control ".concat(errors.motivo ? 'is-invalid' : ''),
                    name: "motivo",
                    value: creditNoteValue.motivo,
                    onChange: onChangeInput,
                    placeholder: "Ingrese motivo..."
                  }), errors.motivo && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("span", {
                    className: "text-danger small",
                    children: errors.motivo
                  })]
                })]
              })
            })]
          })
        })]
      }), !(factura !== null && factura !== void 0 && factura.warehouse_id) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("div", {
        className: "alert alert-light border small",
        children: "Busc\xE1 una factura arriba para poder agregar productos."
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
        className: "card border-0 shadow-sm mb-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("div", {
          className: "card-header text-white py-2",
          style: {
            background: '#2F6FED'
          },
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("strong", {
            children: "Detalles"
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
          className: "card-body",
          children: [(factura === null || factura === void 0 ? void 0 : factura.warehouse_id) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("div", {
            className: "row g-3 mb-3",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
              className: "col-md-6",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("label", {
                className: "form-label",
                children: "Agregar producto adicional (opcional -- los de la factura ya est\xE1n cargados abajo):"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(_shared_components_product_cart_search_ProductSearch__WEBPACK_IMPORTED_MODULE_7__["default"], {
                values: {
                  warehouse_id: {
                    value: factura.warehouse_id
                  }
                },
                products: products,
                handleValidation: handleValidation,
                updateProducts: updateProducts,
                setUpdateProducts: setUpdateProducts,
                customProducts: (0,_shared_prepareArray_prepareSaleArray__WEBPACK_IMPORTED_MODULE_12__.prepareSaleProductArray)(products),
                presentationMode: "sale"
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(_shared_components_sales_ProductRowTable__WEBPACK_IMPORTED_MODULE_8__["default"], {
            updateProducts: updateProducts,
            setUpdateProducts: setUpdateProducts,
            updatedQty: setQuantity,
            frontSetting: {
              value: {
                currency_symbol: '$'
              }
            },
            updateCost: setNewCost,
            updateDiscount: setNewDiscount,
            updateTax: setNewTax,
            updateSubTotal: setSubTotal,
            updateSaleUnit: setNewSaleUnit
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("div", {
        className: "row",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
          className: "col-12 d-flex justify-content-end gap-2",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("button", {
            className: "btn btn-light",
            onClick: function onClick() {
              return navigate('/app/credit-notes');
            },
            children: "Cancelar"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)("button", {
            className: "btn btn-primary",
            onClick: onSubmit,
            disabled: enviando,
            children: enviando ? 'Guardando...' : 'Guardar Nota de Crédito'
          })]
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(_CreditNoteCategoryModal__WEBPACK_IMPORTED_MODULE_16__["default"], {
      show: showCategoryModal,
      onHide: function onHide() {
        return setShowCategoryModal(false);
      },
      onCreated: onCategoryCreated
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(_FacturaListModal__WEBPACK_IMPORTED_MODULE_17__["default"], {
      show: showFacturaListModal,
      onHide: function onHide() {
        return setShowFacturaListModal(false);
      },
      customerId: clienteSeleccionado === null || clienteSeleccionado === void 0 ? void 0 : clienteSeleccionado.value,
      onSeleccionar: onSeleccionarFacturaDelModal
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var products = state.products,
    customers = state.customers;
  return {
    products: products,
    customers: customers
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_2__.connect)(mapStateToProps, {
  fetchProductsByWarehouse: _store_action_productAction__WEBPACK_IMPORTED_MODULE_10__.fetchProductsByWarehouse,
  fetchAllCustomer: _store_action_customerAction__WEBPACK_IMPORTED_MODULE_11__.fetchAllCustomer
})(CreditNoteForm));

/***/ },

/***/ "./resources/pos/src/components/creditNote/CreditNotes.js"
/*!****************************************************************!*\
  !*** ./resources/pos/src/components/creditNote/CreditNotes.js ***!
  \****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
/* harmony import */ var _config_apiConfig__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config/apiConfig */ "./resources/pos/src/config/apiConfig.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }





var CONCEPTO_LABEL = {
  POR_DEVOLUCION: "Por Devolución",
  POR_DESCUENTO: "Por Descuento",
  POR_CORRECCION_PRECIO: "Por Corrección de Precio",
  POR_ERROR_FACTURACION: "Por Error de Facturación",
  OTRO: "Otro"
};
var CreditNotes = function CreditNotes() {
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    creditNotes = _useState2[0],
    setCreditNotes = _useState2[1];
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
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState8 = _slicedToArray(_useState7, 2),
    cargando = _useState8[0],
    setCargando = _useState8[1];
  var cargar = function cargar() {
    var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    setCargando(true);
    _config_apiConfig__WEBPACK_IMPORTED_MODULE_2__["default"].get("/credit-notes", {
      params: {
        search: search,
        page: page
      }
    }).then(function (res) {
      var data = res.data.data;
      setCreditNotes(data.data || []);
      setMeta({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total
      });
    })["finally"](function () {
      return setCargando(false);
    });
  };
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    cargar(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_3__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "d-flex justify-content-between align-items-center mb-4",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h4", {
        className: "mb-0",
        children: "Notas de Cr\xE9dito"
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "card",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "card-body",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "d-flex justify-content-between align-items-center mb-3",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
            type: "text",
            className: "form-control",
            style: {
              maxWidth: 280
            },
            placeholder: "Buscar por n\xFAmero, motivo...",
            value: search,
            onChange: function onChange(e) {
              return setSearch(e.target.value);
            },
            onKeyDown: function onKeyDown(e) {
              return e.key === "Enter" && cargar(1);
            }
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Link, {
            to: "/app/credit-notes/create",
            className: "btn btn-primary",
            children: "+ Nueva Nota de Cr\xE9dito"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "table-responsive",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("table", {
            className: "table table-hover",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("thead", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("tr", {
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
                  children: "Fecha"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
                  children: "N\xB0 Nota de Cr\xE9dito"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
                  children: "Comprobante Corregido"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
                  children: "Cliente"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
                  children: "Concepto"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
                  children: "Motivo"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
                  children: "Total"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
                  children: "Estado"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
                  children: "Acciones"
                })]
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("tbody", {
              children: [cargando && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("tr", {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("td", {
                  colSpan: 9,
                  className: "text-center text-muted",
                  children: "Cargando..."
                })
              }), !cargando && creditNotes.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("tr", {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("td", {
                  colSpan: 9,
                  className: "text-center text-muted",
                  children: "Sin notas de cr\xE9dito registradas."
                })
              }), creditNotes.map(function (cn) {
                return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("tr", {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("td", {
                    children: cn.date
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("td", {
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Link, {
                      to: "/app/credit-notes/".concat(cn.id),
                      className: "text-primary",
                      children: cn.reference_code
                    })
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("td", {
                    children: cn.numero_comprobante_modificado
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("td", {
                    children: cn.customer_name
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("td", {
                    children: CONCEPTO_LABEL[cn.concepto] || cn.concepto
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("td", {
                    children: cn.motivo
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("td", {
                    children: ["$", Number(cn.grand_total || 0).toFixed(2)]
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("td", {
                    children: cn.esta_cancelada ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                      className: "badge bg-secondary",
                      children: "Cancelada"
                    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                      className: "badge bg-success",
                      children: "Activa"
                    })
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("td", {
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Link, {
                      to: "/app/credit-notes/".concat(cn.id),
                      className: "btn btn-sm btn-outline-primary",
                      children: "Ver detalle"
                    })
                  })]
                }, cn.id);
              })]
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "d-flex justify-content-between align-items-center mt-3",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "d-flex gap-1",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
              className: "btn btn-sm btn-light",
              disabled: meta.current_page <= 1,
              onClick: function onClick() {
                return cargar(meta.current_page - 1);
              },
              children: "\u2039 Anterior"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
              className: "btn btn-sm btn-light",
              disabled: meta.current_page >= meta.last_page,
              onClick: function onClick() {
                return cargar(meta.current_page + 1);
              },
              children: "Siguiente \u203A"
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("span", {
            className: "text-primary fw-bold small",
            children: ["Total registros: ", meta.total]
          })]
        })]
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CreditNotes);

/***/ },

/***/ "./resources/pos/src/components/creditNote/FacturaListModal.js"
/*!*********************************************************************!*\
  !*** ./resources/pos/src/components/creditNote/FacturaListModal.js ***!
  \*********************************************************************/
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




var FacturaListModal = function FacturaListModal(_ref) {
  var show = _ref.show,
    onHide = _ref.onHide,
    customerId = _ref.customerId,
    onSeleccionar = _ref.onSeleccionar;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    facturas = _useState2[0],
    setFacturas = _useState2[1];
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
  var cargar = function cargar() {
    var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var overrides = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!customerId) return;
    setCargando(true);
    _config_apiConfig__WEBPACK_IMPORTED_MODULE_4__["default"].get("/credit-notes/facturas-cliente/".concat(customerId), {
      params: _objectSpread({
        search: search,
        per_page: pageSize,
        page: page
      }, overrides)
    }).then(function (res) {
      var data = res.data.data;
      setFacturas(data.data || []);
      setMeta({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total
      });
    })["finally"](function () {
      return setCargando(false);
    });
  };
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (show) cargar(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, customerId]);
  var primerRender = react__WEBPACK_IMPORTED_MODULE_0__.useRef(true);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (!show) return;
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
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"], {
    show: show,
    onHide: onHide,
    size: "xl",
    centered: true,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Header, {
      closeButton: true,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Title, {
        children: "Listado de Comprobante"
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Body, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["default"], {
        defaultActiveKey: "facturas",
        className: "mb-3",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["default"], {
          eventKey: "facturas",
          title: "Facturas",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            className: "d-flex justify-content-between align-items-center my-3",
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
                  setPageSize(Number(e.target.value));
                  cargar(1, {
                    per_page: Number(e.target.value)
                  });
                },
                children: [15, 25, 50].map(function (n) {
                  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("option", {
                    value: n,
                    children: n
                  }, n);
                })
              })]
            })]
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
                    children: "Fecha Emisi\xF3n"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                    children: "Tipo Documento"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                    children: "Forma de Pago"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                    children: "Total"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                    children: "Saldo"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                    children: "Acciones"
                  })]
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("tbody", {
                children: [cargando && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("tr", {
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                    colSpan: 8,
                    className: "text-center text-muted",
                    children: "Cargando..."
                  })
                }), !cargando && facturas.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("tr", {
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                    colSpan: 8,
                    className: "text-center text-muted",
                    children: "Sin comprobantes registrados."
                  })
                }), facturas.map(function (f) {
                  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("tr", {
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                      children: f.nro_orden
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                      className: "text-primary",
                      children: f.numero_comprobante
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                      children: f.fecha_emision
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                      children: f.tipo_comprobante
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                      children: f.forma_pago
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("td", {
                      children: ["$", Number(f.total).toFixed(2)]
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("td", {
                      children: ["$", Number(f.saldo).toFixed(2)]
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
                        type: "button",
                        className: "btn btn-sm btn-primary",
                        onClick: function onClick() {
                          return onSeleccionar(f);
                        },
                        children: "Seleccionar"
                      })
                    })]
                  }, f.sale_id);
                })]
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            className: "d-flex justify-content-between align-items-center mt-3",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
              className: "d-flex gap-1",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
                className: "btn btn-sm btn-light",
                disabled: meta.current_page <= 1,
                onClick: function onClick() {
                  return cargar(meta.current_page - 1);
                },
                children: "\u2039 Anterior"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
                className: "btn btn-sm btn-light",
                disabled: meta.current_page >= meta.last_page,
                onClick: function onClick() {
                  return cargar(meta.current_page + 1);
                },
                children: "Siguiente \u203A"
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("span", {
              className: "text-primary fw-bold small",
              children: ["Total registros: ", meta.total]
            })]
          })]
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["default"].Footer, {
      className: "justify-content-center",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
        className: "btn btn-warning text-dark px-4",
        onClick: onHide,
        children: "\u2715 Cerrar"
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FacturaListModal);

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

/***/ }

}]);