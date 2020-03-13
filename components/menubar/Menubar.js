"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Menubar = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _MenubarSub = require("./MenubarSub");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Menubar extends _react.Component {
  renderCustomContent() {
    if (this.props.children) {
      return _react.default.createElement("div", {
        className: "p-menubar-custom"
      }, this.props.children);
    } else {
      return null;
    }
  }

  render() {
    const className = (0, _classnames.default)('p-menubar p-component', this.props.className);
    const customContent = this.renderCustomContent();
    return _react.default.createElement("div", {
      id: this.props.id,
      className: className,
      style: this.props.style
    }, _react.default.createElement(_MenubarSub.MenubarSub, {
      model: this.props.model,
      root: true
    }), customContent);
  }

}

exports.Menubar = Menubar;

_defineProperty(Menubar, "defaultProps", {
  id: null,
  model: null,
  style: null,
  className: null
});

_defineProperty(Menubar, "propTypes", {
  id: _propTypes.default.string,
  model: _propTypes.default.array,
  style: _propTypes.default.object,
  className: _propTypes.default.string
});