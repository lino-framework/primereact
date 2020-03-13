"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectButtonItem = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class SelectButtonItem extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onClick = this.onClick.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onClick(event) {
    if (this.props.onClick) {
      this.props.onClick({
        originalEvent: event,
        option: this.props.option
      });
      this.input.focus();
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

  componentDidUpdate() {
    this.input.checked = this.props.selected;
  }

  render() {
    let className = (0, _classnames.default)('p-button p-component p-button-text-only', this.props.className, {
      'p-highlight': this.props.selected,
      'p-disabled': this.props.disabled,
      'p-focus': this.state.focused
    });
    return _react.default.createElement("div", {
      ref: el => this.el = el,
      className: className,
      onClick: this.onClick
    }, _react.default.createElement("span", {
      className: "p-button-text p-c"
    }, this.props.label), _react.default.createElement("div", {
      className: "p-hidden-accessible"
    }, _react.default.createElement("input", {
      ref: el => this.input = el,
      type: "checkbox",
      defaultChecked: this.props.selected,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onKeyDown: this.onKeyDown,
      tabIndex: this.props.tabIndex,
      disabled: this.props.disabled,
      value: this.props.label
    })));
  }

}

exports.SelectButtonItem = SelectButtonItem;

_defineProperty(SelectButtonItem, "defaultProps", {
  option: null,
  label: null,
  className: null,
  selected: null,
  tabIndex: null,
  onClick: null
});

_defineProperty(SelectButtonItem, "propTypes", {
  option: _propTypes.default.object,
  label: _propTypes.default.string,
  className: _propTypes.default.string,
  selected: _propTypes.default.bool,
  tabIndex: _propTypes.default.number,
  onClick: _propTypes.default.func
});