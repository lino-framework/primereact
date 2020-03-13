"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Message = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Message extends _react.Component {
  render() {
    let className = (0, _classnames.default)('p-message p-component', {
      'p-message-info': this.props.severity === 'info',
      'p-message-warn': this.props.severity === 'warn',
      'p-message-error': this.props.severity === 'error',
      'p-message-success': this.props.severity === 'success',
      'p-message-icon-only': !this.props.text
    }, this.props.className);
    let icon = (0, _classnames.default)('p-message-icon pi pi-fw', {
      'pi-info-circle': this.props.severity === 'info',
      'pi-exclamation-triangle': this.props.severity === 'warn',
      'pi-times': this.props.severity === 'error',
      'pi-check': this.props.severity === 'success'
    });
    return _react.default.createElement("div", {
      id: this.props.id,
      "aria-live": "polite",
      className: className,
      style: this.props.style
    }, _react.default.createElement("span", {
      className: icon
    }), _react.default.createElement("span", {
      className: "p-message-text"
    }, this.props.text));
  }

}

exports.Message = Message;

_defineProperty(Message, "defaultProps", {
  id: null,
  className: null,
  style: null,
  text: null,
  severity: 'info'
});

_defineProperty(Message, "propTypes", {
  id: _propTypes.default.string,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  text: _propTypes.default.string,
  severity: _propTypes.default.string
});