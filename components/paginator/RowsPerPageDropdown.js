"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RowsPerPageDropdown = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Dropdown = require("../dropdown/Dropdown");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RowsPerPageDropdown extends _react.Component {
  render() {
    if (this.props.options) {
      let options = this.props.options.map((opt, i) => {
        return {
          label: String(opt),
          value: opt
        };
      });
      return _react.default.createElement(_Dropdown.Dropdown, {
        value: this.props.value,
        options: options,
        onChange: this.props.onChange
      });
    } else {
      return null;
    }
  }

}

exports.RowsPerPageDropdown = RowsPerPageDropdown;

_defineProperty(RowsPerPageDropdown, "defaultProps", {
  options: null,
  value: null,
  onChange: null
});

_defineProperty(RowsPerPageDropdown, "propTypes", {
  options: _propTypes.default.array,
  value: _propTypes.default.number,
  onChange: _propTypes.default.func
});