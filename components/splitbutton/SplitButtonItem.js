"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SplitButtonItem = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class SplitButtonItem extends _react.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    if (this.props.menuitem.command) {
      this.props.menuitem.command({
        originalEvent: e,
        item: this.props.menuitem
      });
    }

    e.preventDefault();
  }

  render() {
    var className = (0, _classnames.default)('p-menuitem-link', {
      'p-disabled': this.props.menuitem.disabled
    });
    var icon = this.props.menuitem.icon ? _react.default.createElement("span", {
      className: (0, _classnames.default)('p-menuitem-icon', this.props.menuitem.icon)
    }) : null;

    var label = _react.default.createElement("span", {
      className: "p-menuitem-text"
    }, this.props.menuitem.label);

    return _react.default.createElement("li", {
      className: "p-menuitem",
      role: "menuitem"
    }, _react.default.createElement("a", {
      href: this.props.menuitem.url || '#',
      className: className,
      target: this.props.menuitem.target,
      onClick: this.onClick
    }, icon, label));
  }

}

exports.SplitButtonItem = SplitButtonItem;

_defineProperty(SplitButtonItem, "defaultProps", {
  menuitem: null
});

_defineProperty(SplitButtonItem, "propTypes", {
  menuitem: _propTypes.default.any
});