"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MultiSelectHeader = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _InputText = require("../inputtext/InputText");

var _Checkbox = require("../checkbox/Checkbox");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MultiSelectHeader extends _react.Component {
  constructor() {
    super();
    this.onFilter = this.onFilter.bind(this);
    this.onToggleAll = this.onToggleAll.bind(this);
  }

  onFilter(event) {
    if (this.props.onFilter) {
      this.props.onFilter({
        originalEvent: event,
        query: event.target.value
      });
    }
  }

  onToggleAll(event) {
    if (this.props.onToggleAll) {
      this.props.onToggleAll({
        originalEvent: event,
        checked: this.props.allChecked
      });
    }
  }

  renderFilterElement() {
    if (this.props.filter) {
      return _react.default.createElement("div", {
        className: "p-multiselect-filter-container"
      }, _react.default.createElement(_InputText.InputText, {
        type: "text",
        role: "textbox",
        value: this.props.filterValue,
        onChange: this.onFilter,
        className: "p-inputtext p-component"
      }), _react.default.createElement("span", {
        className: "p-multiselect-filter-icon pi pi-search"
      }));
    } else {
      return null;
    }
  }

  render() {
    let filterElement = this.renderFilterElement();
    return _react.default.createElement("div", {
      className: "p-multiselect-header"
    }, _react.default.createElement(_Checkbox.Checkbox, {
      checked: this.props.allChecked,
      onChange: this.onToggleAll
    }), filterElement, _react.default.createElement("button", {
      className: "p-multiselect-close p-link",
      onClick: this.props.onClose
    }, _react.default.createElement("span", {
      className: "p-multiselect-close-icon pi pi-times"
    })));
  }

}

exports.MultiSelectHeader = MultiSelectHeader;

_defineProperty(MultiSelectHeader, "defaultProps", {
  filter: false,
  filterValue: null,
  onFilter: null,
  onClose: null,
  onToggleAll: null,
  allChecked: false
});

_defineProperty(MultiSelectHeader, "propTypes", {
  filter: _propTypes.default.bool,
  filterValue: _propTypes.default.string,
  allChecked: _propTypes.default.bool,
  onFilter: _propTypes.default.func,
  onClose: _propTypes.default.func,
  onToggleAll: _propTypes.default.func
});