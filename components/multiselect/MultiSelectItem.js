"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MultiSelectItem = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MultiSelectItem extends _react.Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onClick(event) {
    if (this.props.onClick) {
      this.props.onClick({
        originalEvent: event,
        option: this.props.option
      });
    }

    event.preventDefault();
  }

  onKeyDown(event) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown({
        originalEvent: event,
        option: this.props.option
      });
    }
  }

  render() {
    const className = (0, _classnames.default)('p-multiselect-item', {
      'p-highlight': this.props.selected
    });
    const checkboxClassName = (0, _classnames.default)('p-checkbox-box p-component', {
      'p-highlight': this.props.selected
    });
    const checkboxIcon = (0, _classnames.default)('p-checkbox-icon p-c', {
      'pi pi-check': this.props.selected
    });
    const content = this.props.template ? this.props.template(this.props.option) : this.props.label;
    return _react.default.createElement("li", {
      className: className,
      onClick: this.onClick,
      tabIndex: this.props.tabIndex,
      onKeyDown: this.onKeyDown
    }, _react.default.createElement("div", {
      className: "p-checkbox p-component"
    }, _react.default.createElement("div", {
      className: checkboxClassName
    }, _react.default.createElement("span", {
      className: checkboxIcon
    }))), _react.default.createElement("label", null, content));
  }

}

exports.MultiSelectItem = MultiSelectItem;

_defineProperty(MultiSelectItem, "defaultProps", {
  option: null,
  label: null,
  selected: false,
  tabIndex: null,
  template: null,
  onClick: null,
  onKeyDown: null
});

_defineProperty(MultiSelectItem, "propTypes", {
  option: _propTypes.default.object,
  label: _propTypes.default.string,
  selected: _propTypes.default.bool,
  tabIndex: _propTypes.default.string,
  template: _propTypes.default.func,
  onClick: _propTypes.default.func,
  onKeyDown: _propTypes.default.func
});