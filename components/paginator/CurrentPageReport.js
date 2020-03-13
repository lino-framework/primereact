"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CurrentPageReport = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CurrentPageReport extends _react.Component {
  render() {
    let text = this.props.template.replace("{currentPage}", this.props.page + 1).replace("{totalPages}", this.props.pageCount);
    return _react.default.createElement("span", {
      className: "p-paginator-current"
    }, text);
  }

}

exports.CurrentPageReport = CurrentPageReport;

_defineProperty(CurrentPageReport, "defaultProps", {
  pageCount: null,
  page: null,
  template: '({currentPage} of {totalPages})'
});

_defineProperty(CurrentPageReport, "propTypes", {
  pageCount: _propTypes.default.number,
  page: _propTypes.default.number,
  template: _propTypes.default.string
});