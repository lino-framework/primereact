"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DropdownPanel = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class DropdownPanel extends _react.Component {
  renderElement() {
    let className = (0, _classnames.default)('p-dropdown-panel p-hidden p-input-overlay', this.props.panelClassName);
    return _react.default.createElement("div", {
      ref: el => this.element = el,
      className: className,
      style: this.props.panelStyle,
      onClick: this.props.onClick
    }, this.props.filter, _react.default.createElement("div", {
      ref: el => this.itemsWrapper = el,
      className: "p-dropdown-items-wrapper",
      style: {
        maxHeight: this.props.scrollHeight || 'auto'
      }
    }, _react.default.createElement("ul", {
      className: "p-dropdown-items p-dropdown-list p-component"
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

exports.DropdownPanel = DropdownPanel;

_defineProperty(DropdownPanel, "defaultProps", {
  appendTo: null,
  filter: null,
  scrollHeight: null,
  panelClassName: null,
  panelStyle: null,
  onClick: null
});

_defineProperty(DropdownPanel, "propTypes", {
  appendTo: _propTypes.default.object,
  filter: _propTypes.default.any,
  scrollHeight: _propTypes.default.string,
  panelClassName: _propTypes.default.string,
  panelstyle: _propTypes.default.object,
  onClick: _propTypes.default.func
});