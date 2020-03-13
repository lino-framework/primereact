"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CalendarPanel = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDom = _interopRequireDefault(require("react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CalendarPanel extends _react.Component {
  renderElement() {
    return _react.default.createElement("div", {
      ref: el => this.element = el,
      className: this.props.className,
      style: this.props.style
    }, this.props.children);
  }

  render() {
    let element = this.renderElement();
    if (this.props.appendTo) return _reactDom.default.createPortal(element, this.props.appendTo);else return element;
  }

}

exports.CalendarPanel = CalendarPanel;

_defineProperty(CalendarPanel, "defaultProps", {
  appendTo: null,
  style: null,
  className: null
});

_defineProperty(CalendarPanel, "propTypes", {
  appendTo: _propTypes.default.object,
  style: _propTypes.default.object,
  className: _propTypes.default.string
});