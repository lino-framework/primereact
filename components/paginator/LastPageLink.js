"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LastPageLink = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class LastPageLink extends _react.Component {
  render() {
    let className = (0, _classnames.default)('p-paginator-last p-paginator-element p-link', {
      'p-disabled': this.props.disabled
    });
    return _react.default.createElement("button", {
      className: className,
      onClick: this.props.onClick,
      disabled: this.props.disabled
    }, _react.default.createElement("span", {
      className: "p-paginator-icon pi pi-step-forward"
    }));
  }

}

exports.LastPageLink = LastPageLink;

_defineProperty(LastPageLink, "defaultProps", {
  disabled: false,
  onClick: null
});

_defineProperty(LastPageLink, "propTypes", {
  disabled: _propTypes.default.bool,
  onClick: _propTypes.default.func
});