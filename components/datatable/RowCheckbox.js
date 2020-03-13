"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RowCheckbox = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RowCheckbox extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onClick = this.onClick.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onClick(event) {
    if (this.props.onClick && !this.props.disabled) {
      this.props.onClick({
        originalEvent: event,
        data: this.props.rowData,
        checked: this.props.selected
      });
    }
  }

  onFocus() {
    this.setState({
      focused: true
    });
  }

  onBlur() {
    this.setState({
      focused: false
    });
  }

  onKeyDown(event) {
    if (event.key === 'Enter') {
      this.onClick(event);
      event.preventDefault();
    }
  }

  render() {
    let className = (0, _classnames.default)('p-checkbox-box p-component', {
      'p-highlight': this.props.selected,
      'p-disabled': this.props.disabled,
      'p-focus': this.state.focused
    });
    let iconClassName = (0, _classnames.default)('p-checkbox-icon p-clickable', {
      'pi pi-check': this.props.selected
    });
    return _react.default.createElement("div", {
      className: "p-checkbox p-component",
      onClick: this.onClick
    }, _react.default.createElement("div", {
      className: "p-hidden-accessible"
    }, _react.default.createElement("input", {
      type: "checkbox",
      defaultChecked: this.props.selected,
      disabled: this.props.disabled,
      "aria-checked": this.props.selected,
      onKeyDown: this.onKeyDown,
      onFocus: this.onFocus,
      onBlur: this.onBlur
    })), _react.default.createElement("div", {
      className: className
    }, _react.default.createElement("span", {
      className: iconClassName
    })));
  }

}

exports.RowCheckbox = RowCheckbox;

_defineProperty(RowCheckbox, "defaultProps", {
  rowData: null,
  onClick: null,
  disabled: false
});

_defineProperty(RowCheckbox, "propTypes", {
  rowData: _propTypes.default.object,
  onClick: _propTypes.default.func,
  disabled: _propTypes.default.bool
});