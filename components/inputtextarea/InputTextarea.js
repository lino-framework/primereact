"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InputTextarea = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _Tooltip = _interopRequireDefault(require("../tooltip/Tooltip"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

var _ObjectUtils = _interopRequireDefault(require("../utils/ObjectUtils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class InputTextarea extends _react.Component {
  constructor(props) {
    super(props);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onInput = this.onInput.bind(this);
  }

  onFocus(e) {
    if (this.props.autoResize) {
      this.resize();
    }

    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  onBlur(e) {
    if (this.props.autoResize) {
      this.resize();
    }

    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  onKeyUp(e) {
    if (this.props.autoResize) {
      this.resize();
    }

    if (this.props.onKeyUp) {
      this.props.onKeyUp(e);
    }
  }

  onInput(e) {
    if (this.props.autoResize) {
      this.resize();
    }

    if (!this.props.onChange) {
      if (e.target.value.length > 0) _DomHandler.default.addClass(e.target, 'p-filled');else _DomHandler.default.removeClass(e.target, 'p-filled');
    }

    if (this.props.onInput) {
      this.props.onInput(e);
    }
  }

  resize() {
    if (!this.cachedScrollHeight) {
      this.cachedScrollHeight = this.element.scrollHeight;
      this.element.style.overflow = "hidden";
    }

    if (this.cachedScrollHeight !== this.element.scrollHeight) {
      this.element.style.height = '';
      this.element.style.height = this.element.scrollHeight + 'px';

      if (parseFloat(this.element.style.height) >= parseFloat(this.element.style.maxHeight)) {
        this.element.style.overflowY = "scroll";
        this.element.style.height = this.element.style.maxHeight;
      } else {
        this.element.style.overflow = "hidden";
      }

      this.cachedScrollHeight = this.element.scrollHeight;
    }
  }

  componentDidMount() {
    if (this.props.tooltip) {
      this.renderTooltip();
    }

    if (this.props.autoResize) {
      this.resize();
    }
  }

  componentDidUpdate(prevProps) {
    if (!_DomHandler.default.isVisible(this.element)) {
      return;
    }

    if (prevProps.tooltip !== this.props.tooltip) {
      if (this.tooltip) this.tooltip.updateContent(this.props.tooltip);else this.renderTooltip();
    }

    if (this.props.autoResize) {
      this.resize();
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
    const className = (0, _classnames.default)('p-inputtext p-inputtextarea p-component', this.props.className, {
      'p-disabled': this.props.disabled,
      'p-filled': this.props.value != null && this.props.value.toString().length > 0 || this.props.defaultValue != null && this.props.defaultValue.toString().length > 0,
      'p-inputtextarea-resizable': this.props.autoResize
    });

    let textareaProps = _ObjectUtils.default.findDiffKeys(this.props, InputTextarea.defaultProps);

    return _react.default.createElement("textarea", _extends({}, textareaProps, {
      className: className,
      ref: input => this.element = input,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onKeyUp: this.onKeyUp,
      onInput: this.onInput
    }));
  }

}

exports.InputTextarea = InputTextarea;

_defineProperty(InputTextarea, "defaultProps", {
  autoResize: false,
  onInput: null,
  cols: 20,
  rows: 2,
  tooltip: null,
  tooltipOptions: null
});

_defineProperty(InputTextarea, "propTypes", {
  autoResize: _propTypes.default.bool,
  onInput: _propTypes.default.func,
  cols: _propTypes.default.number,
  rows: _propTypes.default.number,
  tooltip: _propTypes.default.string,
  tooltipOptions: _propTypes.default.object
});