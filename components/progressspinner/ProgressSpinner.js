"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProgressSpinner = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ProgressSpinner extends _react.Component {
  render() {
    let spinnerClass = (0, _classnames.default)('p-progress-spinner', this.props.className);
    return _react.default.createElement("div", {
      id: this.props.id,
      style: this.props.style,
      className: spinnerClass
    }, _react.default.createElement("svg", {
      className: "p-progress-spinner-svg",
      viewBox: "25 25 50 50",
      style: {
        animationDuration: this.props.animationDuration
      }
    }, _react.default.createElement("circle", {
      className: "p-progress-spinner-circle",
      cx: "50",
      cy: "50",
      r: "20",
      fill: this.props.fill,
      strokeWidth: this.props.strokeWidth,
      strokeMiterlimit: "10"
    })));
  }

}

exports.ProgressSpinner = ProgressSpinner;

_defineProperty(ProgressSpinner, "defaultProps", {
  id: null,
  style: null,
  className: null,
  strokeWidth: "2",
  fill: "none",
  animationDuration: "2s"
});

_defineProperty(ProgressSpinner, "propTypes", {
  id: _propTypes.default.string,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  strokeWidth: _propTypes.default.string,
  fill: _propTypes.default.string,
  animationDuration: _propTypes.default.string
});