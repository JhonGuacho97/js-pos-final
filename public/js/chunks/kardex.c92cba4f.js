"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["kardex"],{

/***/ "./resources/pos/src/components/kardex/Kardex.js"
/*!*******************************************************!*\
  !*** ./resources/pos/src/components/kardex/Kardex.js ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _MasterLayout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../MasterLayout */ "./resources/pos/src/components/MasterLayout.js");
/* harmony import */ var _shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/tab-title/TabTitle */ "./resources/pos/src/shared/tab-title/TabTitle.js");
/* harmony import */ var _shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/components/loaders/TopProgressBar */ "./resources/pos/src/shared/components/loaders/TopProgressBar.js");
/* harmony import */ var _shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../shared/select/reactSelect */ "./resources/pos/src/shared/select/reactSelect.js");
/* harmony import */ var _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../store/action/warehouseAction */ "./resources/pos/src/store/action/warehouseAction.js");
/* harmony import */ var _store_action_productAction__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../store/action/productAction */ "./resources/pos/src/store/action/productAction.js");
/* harmony import */ var _store_action_kardexAction__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../store/action/kardexAction */ "./resources/pos/src/store/action/kardexAction.js");
/* harmony import */ var _shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/sharedMethod */ "./resources/pos/src/shared/sharedMethod.js");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "./node_modules/@fortawesome/react-fontawesome/index.es.js");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }













var movementOptions = [{
  value: "all",
  label: "TODOS"
}, {
  value: "entrada",
  label: "ENTRADAS"
}, {
  value: "salida",
  label: "SALIDAS"
}];

/**
 * Kardex: historial de movimientos de un producto en una bodega, con
 * existencias corrientes. Se arma al momento (no hay tabla propia) leyendo
 * Compras/Ventas/Transferencias ya existentes -- ver KardexAPIController.
 */
var Kardex = function Kardex(props) {
  var _frontSetting$value;
  var fetchAllWarehouses = props.fetchAllWarehouses,
    fetchAllProducts = props.fetchAllProducts,
    fetchKardex = props.fetchKardex,
    clearKardex = props.clearKardex,
    warehouses = props.warehouses,
    products = props.products,
    kardex = props.kardex,
    isLoading = props.isLoading,
    allConfigData = props.allConfigData,
    frontSetting = props.frontSetting;
  var today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Guayaquil"
  }).format(new Date());
  var firstOfMonth = today.slice(0, 8) + "01";
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(firstOfMonth),
    _useState2 = _slicedToArray(_useState, 2),
    startDate = _useState2[0],
    setStartDate = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(today),
    _useState4 = _slicedToArray(_useState3, 2),
    endDate = _useState4[0],
    setEndDate = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState6 = _slicedToArray(_useState5, 2),
    warehouseValue = _useState6[0],
    setWarehouseValue = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState8 = _slicedToArray(_useState7, 2),
    productValue = _useState8[0],
    setProductValue = _useState8[1];
  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(movementOptions[0]),
    _useState0 = _slicedToArray(_useState9, 2),
    movementValue = _useState0[0],
    setMovementValue = _useState0[1];
  var _useState1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(""),
    _useState10 = _slicedToArray(_useState1, 2),
    search = _useState10[0],
    setSearch = _useState10[1];
  var _useState11 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(10),
    _useState12 = _slicedToArray(_useState11, 2),
    pageSize = _useState12[0],
    setPageSize = _useState12[1];
  var _useState13 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(1),
    _useState14 = _slicedToArray(_useState13, 2),
    page = _useState14[0],
    setPage = _useState14[1];
  var currencySymbol = frontSetting === null || frontSetting === void 0 || (_frontSetting$value = frontSetting.value) === null || _frontSetting$value === void 0 ? void 0 : _frontSetting$value.currency_symbol;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchAllWarehouses();
    fetchAllProducts();
    return function () {
      return clearKardex();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  var onBuscar = function onBuscar() {
    if (!warehouseValue || !productValue) {
      return;
    }
    setPage(1);
    fetchKardex({
      warehouse_id: warehouseValue.value,
      product_id: productValue.value,
      start_date: startDate,
      end_date: endDate,
      movement_type: movementValue.value
    });
  };
  var filteredRows = (kardex.rows || []).filter(function (row) {
    var _row$detail;
    return !search || ((_row$detail = row.detail) === null || _row$detail === void 0 ? void 0 : _row$detail.toLowerCase().includes(search.toLowerCase()));
  });
  var totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  var pagedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);
  var money = function money(value) {
    return value === null || value === undefined ? "—" : (0,_shared_sharedMethod__WEBPACK_IMPORTED_MODULE_9__.currencySymbolHandling)(allConfigData, currencySymbol, Number(value).toFixed(2));
  };
  var exportToCsv = function exportToCsv() {
    var header = ["Fecha", "Detalle", "Entrada Cantidad", "Entrada Costo", "Entrada Total", "Salida Cantidad", "Salida Costo", "Salida Total", "Existencia Cantidad", "Existencia Costo", "Existencia Total"];
    var lines = filteredRows.map(function (r) {
      var _r$entrada_quantity, _r$entrada_cost, _r$entrada_total, _r$salida_quantity, _r$salida_cost, _r$salida_total;
      return [r.date, r.detail, (_r$entrada_quantity = r.entrada_quantity) !== null && _r$entrada_quantity !== void 0 ? _r$entrada_quantity : "", (_r$entrada_cost = r.entrada_cost) !== null && _r$entrada_cost !== void 0 ? _r$entrada_cost : "", (_r$entrada_total = r.entrada_total) !== null && _r$entrada_total !== void 0 ? _r$entrada_total : "", (_r$salida_quantity = r.salida_quantity) !== null && _r$salida_quantity !== void 0 ? _r$salida_quantity : "", (_r$salida_cost = r.salida_cost) !== null && _r$salida_cost !== void 0 ? _r$salida_cost : "", (_r$salida_total = r.salida_total) !== null && _r$salida_total !== void 0 ? _r$salida_total : "", r.balance_quantity, r.balance_cost, r.balance_total];
    });
    var csv = [header].concat(_toConsumableArray(lines)).map(function (row) {
      return row.join(",");
    }).join("\n");
    var blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;"
    });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "kardex-".concat((productValue === null || productValue === void 0 ? void 0 : productValue.label) || "producto", ".csv");
    link.click();
    URL.revokeObjectURL(url);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)(_MasterLayout__WEBPACK_IMPORTED_MODULE_2__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_shared_components_loaders_TopProgressBar__WEBPACK_IMPORTED_MODULE_4__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_shared_tab_title_TabTitle__WEBPACK_IMPORTED_MODULE_3__["default"], {
      title: "Kardex"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("div", {
      className: "card p-4 mb-4",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("div", {
        className: "row",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("div", {
          className: "col-md-4 mb-3",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("label", {
            className: "form-label",
            children: "Fecha de inicio:"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("input", {
            type: "date",
            className: "form-control",
            value: startDate,
            onChange: function onChange(e) {
              return setStartDate(e.target.value);
            }
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("div", {
          className: "col-md-4 mb-3",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("label", {
            className: "form-label",
            children: "Fecha de fin:"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("input", {
            type: "date",
            className: "form-control",
            value: endDate,
            onChange: function onChange(e) {
              return setEndDate(e.target.value);
            }
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("div", {
          className: "col-md-4 mb-3",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_5__["default"], {
            title: "Bodega",
            placeholder: "Elegir bodega",
            data: warehouses,
            value: warehouseValue,
            onChange: function onChange(obj) {
              return setWarehouseValue(obj);
            }
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("div", {
          className: "col-md-4 mb-3",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_5__["default"], {
            title: "Movimiento",
            data: movementOptions,
            value: movementValue,
            onChange: function onChange(obj) {
              return setMovementValue(obj);
            }
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("div", {
          className: "col-md-6 mb-3",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_shared_select_reactSelect__WEBPACK_IMPORTED_MODULE_5__["default"], {
            title: "Seleccionar Producto",
            placeholder: "Nombre del Producto",
            data: products,
            value: productValue,
            onChange: function onChange(obj) {
              return setProductValue(obj);
            }
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("div", {
          className: "col-md-2 mb-3 d-flex align-items-end",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("button", {
            className: "btn btn-primary w-100",
            onClick: onBuscar,
            disabled: !warehouseValue || !productValue,
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_10__.FontAwesomeIcon, {
              icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_11__.faSearch,
              className: "me-2"
            }), "Buscar"]
          })
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("div", {
      className: "card p-4",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("div", {
        className: "d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("div", {
          className: "input-group",
          style: {
            maxWidth: 320
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("span", {
            className: "input-group-text bg-white border-end-0",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_10__.FontAwesomeIcon, {
              icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_11__.faSearch,
              className: "text-muted"
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("input", {
            type: "text",
            className: "form-control border-start-0",
            placeholder: "B\xFAsqueda inteligente",
            value: search,
            onChange: function onChange(e) {
              setSearch(e.target.value);
              setPage(1);
            }
          }), search && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("button", {
            className: "btn btn-outline-secondary",
            onClick: function onClick() {
              return setSearch("");
            },
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_10__.FontAwesomeIcon, {
              icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_11__.faTimes
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("div", {
          className: "d-flex align-items-center gap-2",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("span", {
            className: "fw-bold",
            children: "Mostrar:"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("select", {
            className: "form-select",
            style: {
              width: 80
            },
            value: pageSize,
            onChange: function onChange(e) {
              setPageSize(Number(e.target.value));
              setPage(1);
            },
            children: [5, 10, 25, 50].map(function (n) {
              return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("option", {
                value: n,
                children: n
              }, n);
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("button", {
            className: "btn btn-light-success",
            title: "Descargar Excel/CSV",
            onClick: exportToCsv,
            disabled: !filteredRows.length,
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_10__.FontAwesomeIcon, {
              icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_11__.faFileExcel
            })
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("div", {
        className: "table-responsive",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("table", {
          className: "table table-bordered mb-0",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("thead", {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("tr", {
              className: "text-white text-center",
              style: {
                backgroundColor: "#2563eb"
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("th", {
                colSpan: 2,
                children: "DESCRIPCI\xD3N"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("th", {
                colSpan: 3,
                children: "ENTRADAS"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("th", {
                colSpan: 3,
                children: "SALIDAS"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("th", {
                colSpan: 3,
                children: "EXISTENCIAS"
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("tr", {
              className: "text-center",
              style: {
                backgroundColor: "#eff6ff"
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("th", {
                children: "Fecha"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("th", {
                children: "Detalle"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("th", {
                children: "Cantidad"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("th", {
                children: "Costo"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("th", {
                children: "Total"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("th", {
                children: "Cantidad"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("th", {
                children: "Costo"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("th", {
                children: "Total"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("th", {
                children: "Cantidad"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("th", {
                children: "Costo"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("th", {
                children: "Total"
              })]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("tbody", {
            children: !warehouseValue || !productValue ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("tr", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
                colSpan: 11,
                className: "text-center py-6 text-muted",
                children: "Elige bodega y producto, y dale a \"Buscar\"."
              })
            }) : isLoading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("tr", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
                colSpan: 11,
                className: "text-center py-6 text-muted",
                children: "Cargando..."
              })
            }) : !pagedRows.length ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("tr", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
                colSpan: 11,
                className: "text-center py-6 text-muted",
                children: "No hay movimientos en ese rango de fechas."
              })
            }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.Fragment, {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("tr", {
                className: "fw-bold",
                style: {
                  backgroundColor: "#f9fafb"
                },
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("td", {
                  colSpan: 8,
                  className: "text-end",
                  children: ["Saldo inicial (", startDate, "):"]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
                  className: "text-center",
                  children: kardex.opening_balance
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
                  className: "text-center",
                  children: money(kardex.opening_cost)
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
                  className: "text-center",
                  children: money((kardex.opening_balance || 0) * (kardex.opening_cost || 0))
                })]
              }), pagedRows.map(function (row, index) {
                var _row$entrada_quantity, _row$salida_quantity;
                return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("tr", {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
                    children: row.date
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
                    children: row.detail
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
                    className: "text-center",
                    children: (_row$entrada_quantity = row.entrada_quantity) !== null && _row$entrada_quantity !== void 0 ? _row$entrada_quantity : "—"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
                    className: "text-center",
                    children: row.entrada_cost !== null ? money(row.entrada_cost) : "—"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
                    className: "text-center",
                    children: row.entrada_total !== null ? money(row.entrada_total) : "—"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
                    className: "text-center",
                    children: (_row$salida_quantity = row.salida_quantity) !== null && _row$salida_quantity !== void 0 ? _row$salida_quantity : "—"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
                    className: "text-center",
                    children: row.salida_cost !== null ? money(row.salida_cost) : "—"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
                    className: "text-center",
                    children: row.salida_total !== null ? money(row.salida_total) : "—"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
                    className: "text-center fw-bold",
                    children: row.balance_quantity
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
                    className: "text-center",
                    children: money(row.balance_cost)
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("td", {
                    className: "text-center fw-bold",
                    children: money(row.balance_total)
                  })]
                }, index);
              })]
            })
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("div", {
        className: "d-flex justify-content-between align-items-center mt-3",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("div", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("button", {
            className: "btn btn-light me-2",
            disabled: page <= 1,
            onClick: function onClick() {
              return setPage(function (p) {
                return p - 1;
              });
            },
            children: "\u2039 Anterior"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("button", {
            className: "btn btn-light",
            disabled: page >= totalPages,
            onClick: function onClick() {
              return setPage(function (p) {
                return p + 1;
              });
            },
            children: "Siguiente \u203A"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("span", {
          className: "text-primary fw-bold",
          children: ["Total registros: ", filteredRows.length]
        })]
      })]
    })]
  });
};
var mapStateToProps = function mapStateToProps(state) {
  var warehouses = state.warehouses,
    products = state.products,
    kardex = state.kardex,
    isLoading = state.isLoading,
    allConfigData = state.allConfigData,
    frontSetting = state.frontSetting;
  return {
    warehouses: warehouses,
    products: products,
    kardex: kardex,
    isLoading: isLoading,
    allConfigData: allConfigData,
    frontSetting: frontSetting
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, {
  fetchAllWarehouses: _store_action_warehouseAction__WEBPACK_IMPORTED_MODULE_6__.fetchAllWarehouses,
  fetchAllProducts: _store_action_productAction__WEBPACK_IMPORTED_MODULE_7__.fetchAllProducts,
  fetchKardex: _store_action_kardexAction__WEBPACK_IMPORTED_MODULE_8__.fetchKardex,
  clearKardex: _store_action_kardexAction__WEBPACK_IMPORTED_MODULE_8__.clearKardex
})(Kardex));

/***/ }

}]);