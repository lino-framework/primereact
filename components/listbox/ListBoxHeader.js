"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListBoxHeader = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _InputText = require("../inputtext/InputText");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ListBoxHeader extends _react.Component {
  constructor() {
    super();
    this.onFilter = this.onFilter.bind(this);
  }

  onFilter(event) {
    if (this.props.onFilter) {
      this.props.onFilter({
        originalEvent: event,
        query: event.target.value
      });
    }
  }

  render() {
    return _react.default.createElement("div", {
      className: "p-listbox-header"
    }, _react.default.createElement("div", {
      className: "p-listbox-filter-container"
    }, _react.default.createElement(_InputText.InputText, {
      type: "text",
      role: "textbox",
      value: this.props.filter,
      onChange: this.onFilter,
      disabled: this.props.disabled
    }), _react.default.createElement("span", {
      className: "p-listbox-filter-icon pi pi-search"
    })));
  }

}

exports.ListBoxHeader = ListBoxHeader;

_defineProperty(ListBoxHeader, "defaultProps", {
  filter: null,
  disabled: false,
  onFilter: null
});

_defineProperty(ListBoxHeader, "propTypes", {
  filter: _propTypes.default.string,
  disabled: _propTypes.default.bool,
  onFilter: _propTypes.default.func
});