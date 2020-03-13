"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DropdownItem = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class DropdownItem extends _react.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    if (this.props.onClick) {
      this.props.onClick({
        originalEvent: event,
        option: this.props.option
      });
    }
  }

  render() {
    let className = (0, _classnames.default)('p-dropdown-item', {
      'p-highlight': this.props.selected,
      'p-disabled': this.props.disabled,
      'p-dropdown-item-empty': !this.props.label || this.props.label.length === 0
    });
    let content = this.props.template ? this.props.template(this.props.option) : this.props.label;
    return _react.default.createElement("li", {
      className: className,
      onClick: this.onClick
    }, content);
  }

}

exports.DropdownItem = DropdownItem;

_defineProperty(DropdownItem, "defaultProps", {
  option: null,
  label: null,
  template: null,
  selected: false,
  disabled: false,
  onClick: null
});

_defineProperty(DropdownItem, "propTypes", {
  option: _propTypes.default.object,
  label: _propTypes.default.any,
  template: _propTypes.default.func,
  selected: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  onClick: _propTypes.default.func
});