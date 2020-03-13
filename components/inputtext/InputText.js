"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InputText = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _KeyFilter = _interopRequireDefault(require("../keyfilter/KeyFilter"));

var _Tooltip = _interopRequireDefault(require("../tooltip/Tooltip"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

var _ObjectUtils = _interopRequireDefault(require("../utils/ObjectUtils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class InputText extends _react.Component {
  constructor(props) {
    super(props);
    this.onInput = this.onInput.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  onKeyPress(event) {
    if (this.props.onKeyPress) {
      this.props.onKeyPress(event);
    }

    if (this.props.keyfilter) {
      _KeyFilter.default.onKeyPress(event, this.props.keyfilter, this.props.validateOnly);
    }
  }

  onInput(event) {
    let validatePattern = true;

    if (this.props.keyfilter && this.props.validateOnly) {
      validatePattern = _KeyFilter.default.validate(event, this.props.keyfilter);
    }

    if (this.props.onInput) {
      this.props.onInput(event, validatePattern);
    }

    if (!this.props.onChange) {
      if (event.target.value.length > 0) _DomHandler.default.addClass(event.target, 'p-filled');else _DomHandler.default.removeClass(event.target, 'p-filled');
    }
  }

  componentDidMount() {
    if (this.props.tooltip) {
      this.renderTooltip();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tooltip !== this.props.tooltip) {
      if (this.tooltip) this.tooltip.updateContent(this.props.tooltip);else this.renderTooltip();
    }
  }

  componentWillUnmount() {
    if (this.tooltip) {
      this.tooltip.destroy();
      this.tooltip = null;
    }
  }

  renderTooltip() {
    this.tooltip = new _Tooltip.default({
      target: this.element,
      content: this.props.tooltip,
      options: this.props.tooltipOptions
    });
  }

  render() {
    const className = (0, _classnames.default)('p-inputtext p-component', this.props.className, {
      'p-disabled': this.props.disabled,
      'p-filled': this.props.value != null && this.props.value.toString().length > 0 || this.props.defaultValue != null && this.props.defaultValue.toString().length > 0
    });

    let inputProps = _ObjectUtils.default.findDiffKeys(this.props, InputText.defaultProps);

    return _react.default.createElement("input", _extends({
      ref: el => this.element = el
    }, inputProps, {
      className: className,
      onInput: this.onInput,
      onKeyPress: this.onKeyPress
    }));
  }

}

exports.InputText = InputText;

_defineProperty(InputText, "defaultProps", {
  onInput: null,
  onKeyPress: null,
  keyfilter: null,
  validateOnly: false,
  tooltip: null,
  tooltipOptions: null
});

_defineProperty(InputText, "propTypes", {
  onInput: _propTypes.default.func,
  onKeyPress: _propTypes.default.func,
  keyfilter: _propTypes.default.any,
  validateOnly: _propTypes.default.bool,
  tooltip: _propTypes.default.string,
  tooltipOptions: _propTypes.default.object
});