"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MultiSelectPanel = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDom = _interopRequireDefault(require("react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MultiSelectPanel extends _react.Component {
  renderElement() {
    return _react.default.createElement("div", {
      className: "p-multiselect-panel p-hidden p-input-overlay",
      ref: el => this.element = el,
      onClick: this.props.onClick
    }, this.props.header, _react.default.createElement("div", {
      className: "p-multiselect-items-wrapper",
      style: {
        maxHeight: this.props.scrollHeight
      }
    }, _react.default.createElement("ul", {
      className: "p-multiselect-items p-multiselect-list p-component"
    }, this.props.children)));
  }

  render() {
    let element = this.renderElement();

    if (this.props.appendTo) {
      return _reactDom.default.createPortal(element, this.props.appendTo);
    } else {
      return element;
    }
  }

}

exports.MultiSelectPanel = MultiSelectPanel;

_defineProperty(MultiSelectPanel, "defaultProps", {
  appendTo: null,
  header: null,
  onClick: null,
  scrollHeight: null
});

_defineProperty(MultiSelectPanel, "propTypes", {
  appendTo: _propTypes.default.object,
  header: _propTypes.default.any,
  onClick: _propTypes.default.func,
  scrollHeight: _propTypes.default.string
});