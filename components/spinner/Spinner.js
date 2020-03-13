"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Spinner = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _InputText = require("../inputtext/InputText");

var _classnames = _interopRequireDefault(require("classnames"));

var _Tooltip = _interopRequireDefault(require("../tooltip/Tooltip"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Spinner extends _react.Component {
  constructor(props) {
    super(props);

    if (this.props.value && this.props.value.toString().indexOf('.') > 0) {
      this.precision = this.props.value.toString().split(/[.]/)[1].length;
    } else if (this.props.step % 1 !== 0) {
      // If step is not an integer then extract the length of the decimal part
      this.precision = this.props.step.toString().split(/[,]|[.]/)[1].length;
    }

    if (this.props.formatInput) {
      this.localeDecimalSeparator = 1.1.toLocaleString().substring(1, 2);
      this.localeThousandSeparator = 1000 .toLocaleString().substring(1, 2);
      this.thousandRegExp = new RegExp("[".concat(this.props.thousandSeparator || this.localeThousandSeparator, "]"), 'gim');

      if (this.props.decimalSeparator && this.props.thousandSeparator && this.props.decimalSeparator === this.props.thousandSeparator) {
        console.warn("thousandSeparator and decimalSeparator cannot have the same value.");
      }
    }

    this.formatValue(this.props.value);
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.onUpButtonMouseLeave = this.onUpButtonMouseLeave.bind(this);
    this.onUpButtonMouseDown = this.onUpButtonMouseDown.bind(this);
    this.onUpButtonMouseUp = this.onUpButtonMouseUp.bind(this);
    this.onUpButtonKeyDown = this.onUpButtonKeyDown.bind(this);
    this.onUpButtonKeyUp = this.onUpButtonKeyUp.bind(this);
    this.onDownButtonMouseLeave = this.onDownButtonMouseLeave.bind(this);
    this.onDownButtonMouseDown = this.onDownButtonMouseDown.bind(this);
    this.onDownButtonMouseUp = this.onDownButtonMouseUp.bind(this);
    this.onDownButtonKeyDown = this.onDownButtonKeyDown.bind(this);
    this.onDownButtonKeyUp = this.onDownButtonKeyUp.bind(this);
  }

  repeat(event, interval, dir) {
    let i = interval || 500;
    this.clearTimer();
    this.timer = setTimeout(() => {
      this.repeat(event, 40, dir);
    }, i);
    this.spin(event, dir);
  }

  spin(event, dir) {
    let step = this.props.step * dir;
    let currentValue;
    let newValue;
    if (this.props.value) currentValue = typeof this.props.value === 'string' ? this.parseValue(this.props.value) : this.props.value;else currentValue = 0;
    if (this.precision) newValue = parseFloat(this.toFixed(currentValue + step, this.precision));else newValue = currentValue + step;

    if (this.props.maxlength !== null && this.props.value.toString().length > this.props.maxlength) {
      newValue = currentValue;
    }

    if (this.props.min !== null && newValue < this.props.min) {
      newValue = this.props.min;
    }

    if (this.props.max !== null && newValue > this.props.max) {
      newValue = this.props.max;
    }

    if (this.props.onChange) {
      this.props.onChange({
        originalEvent: event,
        value: newValue,
        stopPropagation: () => {},
        preventDefault: () => {},
        target: {
          name: this.props.name,
          id: this.props.id,
          value: newValue
        }
      });
    }
  }

  toFixed(value, precision) {
    let power = Math.pow(10, precision || 0);
    return String(Math.round(value * power) / power);
  }

  onUpButtonMouseDown(event) {
    if (!this.props.disabled) {
      this.inputEl.focus();
      this.repeat(event, null, 1);
      event.preventDefault();
    }
  }

  onUpButtonMouseUp(event) {
    if (!this.props.disabled) {
      this.clearTimer();
    }
  }

  onUpButtonMouseLeave(event) {
    if (!this.props.disabled) {
      this.clearTimer();
    }
  }

  onUpButtonKeyUp(event) {
    if (!this.props.disabled) {
      this.clearTimer();
    }
  }

  onUpButtonKeyDown(event) {
    if (event.keyCode === 32 || event.keyCode === 13) {
      this.repeat(event, null, 1);
    }
  }

  onDownButtonMouseDown(event, focusInput) {
    if (!this.props.disabled) {
      this.inputEl.focus();
      this.repeat(event, null, -1);
      event.preventDefault();
    }
  }

  onDownButtonMouseUp(event) {
    if (!this.props.disabled) {
      this.clearTimer();
    }
  }

  onDownButtonMouseLeave(event) {
    if (!this.props.disabled) {
      this.clearTimer();
    }
  }

  onDownButtonKeyUp(event) {
    if (!this.props.disabled) {
      this.clearTimer();
    }
  }

  onDownButtonKeyDown(event) {
    if (event.keyCode === 32 || event.keyCode === 13) {
      this.repeat(event, null, -1);
    }
  }

  onInputKeyDown(event) {
    if (event.which === 38) {
      this.spin(event, 1);
      event.preventDefault();
    } else if (event.which === 40) {
      this.spin(event, -1);
      event.preventDefault();
    }
  }

  parseValue(val) {
    let value = val.trim();

    if (val === '') {
      value = this.props.min != null ? this.props.min : null;
    } else {
      if (this.props.formatInput) {
        val = val.replace(this.thousandRegExp, '');
      }

      if (this.precision) {
        val = this.props.formatInput ? val.replace(this.props.decimalSeparator || this.localeDecimalSeparator, '.') : val.replace(',', '.');
        value = parseFloat(val);
      } else {
        value = parseInt(val, 10);
      }

      if (!isNaN(value)) {
        if (this.props.max !== null && value > this.props.max) {
          value = this.props.max;
        }

        if (this.props.min !== null && value < this.props.min) {
          value = this.props.min;
        }
      } else {
        value = null;
      }
    }

    return value;
  }

  onInputFocus(event) {
    _DomHandler.default.addClass(this.element, 'p-inputwrapper-focus');
  }

  onInputChange(event) {
    if (this.props.onChange) {
      this.props.onChange({
        originalEvent: event,
        value: event.target.value,
        stopPropagation: () => {},
        preventDefault: () => {},
        target: {
          name: this.props.name,
          id: this.props.id,
          value: event.target.value
        }
      });
    }
  }

  onInputBlur(event) {
    _DomHandler.default.removeClass(this.element, 'p-inputwrapper-focus');

    if (this.props.onChange) {
      const parsedValue = this.parseValue(event.target.value);
      this.props.onChange({
        originalEvent: event,
        value: parsedValue,
        stopPropagation: () => {},
        preventDefault: () => {},
        target: {
          name: this.props.name,
          id: this.props.id,
          value: parsedValue
        }
      });
    }

    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  }

  formatValue(value) {
    if (value != null) {
      if (this.props.formatInput) {
        value = value.toLocaleString(undefined, {
          maximumFractionDigits: 20
        });

        if (this.props.decimalSeparator && this.props.thousandSeparator) {
          value = value.split(this.localeDecimalSeparator);

          if (this.precision && value[1]) {
            value[1] = (this.props.decimalSeparator || this.localeDecimalSeparator) + value[1];
          }

          if (this.props.thousandSeparator && value[0].length > 3) {
            value[0] = value[0].replace(new RegExp("[".concat(this.localeThousandSeparator, "]"), 'gim'), this.props.thousandSeparator);
          }

          value = value.join('');
        }
      }

      this.formattedValue = value.toString();
    }
  }

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  componentDidMount() {
    if (this.props.tooltip) {
      this.renderTooltip();
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.formatValue(nextProps.value);
    }

    return true;
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

  renderInputElement() {
    const className = (0, _classnames.default)('p-spinner-input', this.props.inputClassName);
    return _react.default.createElement(_InputText.InputText, {
      ref: el => this.inputEl = _reactDom.default.findDOMNode(el),
      id: this.props.inputId,
      style: this.props.inputStyle,
      className: className,
      value: this.formattedValue || '',
      type: "text",
      size: this.props.size,
      tabIndex: this.props.tabIndex,
      maxLength: this.props.maxlength,
      disabled: this.props.disabled,
      required: this.props.required,
      pattern: this.props.pattern,
      placeholder: this.props.placeholder,
      readOnly: this.props.readonly,
      name: this.props.name,
      onKeyDown: this.onInputKeyDown,
      onBlur: this.onInputBlur,
      onChange: this.onInputChange,
      onFocus: this.onInputFocus
    });
  }

  renderUpButton() {
    let className = (0, _classnames.default)("p-spinner-button p-spinner-button-up p-button p-component", {
      'p-disabled': this.props.disabled
    });
    return _react.default.createElement("button", {
      type: "button",
      className: className,
      onMouseLeave: this.onUpButtonMouseLeave,
      onMouseDown: this.onUpButtonMouseDown,
      onMouseUp: this.onUpButtonMouseUp,
      onKeyDown: this.onUpButtonKeyDown,
      onKeyUp: this.onUpButtonKeyUp,
      disabled: this.props.disabled,
      tabIndex: this.props.tabIndex
    }, _react.default.createElement("span", {
      className: "p-spinner-button-icon pi pi-caret-up"
    }));
  }

  renderDownButton() {
    let className = (0, _classnames.default)("p-spinner-button p-spinner-button-down p-button p-component", {
      'p-disabled': this.props.disabled
    });
    return _react.default.createElement("button", {
      type: "button",
      className: className,
      onMouseLeave: this.onDownButtonMouseLeave,
      onMouseDown: this.onDownButtonMouseDown,
      onMouseUp: this.onDownButtonMouseUp,
      onKeyDown: this.onDownButtonKeyDown,
      onKeyUp: this.onDownButtonKeyUp,
      disabled: this.props.disabled,
      tabIndex: this.props.tabIndex
    }, _react.default.createElement("span", {
      className: "p-spinner-button-icon pi pi-caret-down"
    }));
  }

  render() {
    let className = (0, _classnames.default)("p-spinner p-component", this.props.className, {
      'p-inputwrapper-filled': this.props.value != null
    });
    let inputElement = this.renderInputElement();
    let upButton = this.renderUpButton();
    let downButton = this.renderDownButton();
    return _react.default.createElement("span", {
      ref: el => this.element = el,
      id: this.props.id,
      className: className,
      style: this.props.style
    }, inputElement, upButton, downButton);
  }

}

exports.Spinner = Spinner;

_defineProperty(Spinner, "defaultProps", {
  id: null,
  value: null,
  name: null,
  step: 1,
  min: null,
  max: null,
  formatInput: false,
  decimalSeparator: null,
  thousandSeparator: null,
  disabled: false,
  required: false,
  tabIndex: null,
  pattern: null,
  placeholder: null,
  readonly: false,
  maxlength: null,
  size: null,
  style: null,
  className: null,
  inputId: null,
  inputStyle: null,
  inputClassName: null,
  tooltip: null,
  tooltipOptions: null,
  onChange: null,
  onBlur: null
});

_defineProperty(Spinner, "propTypes", {
  id: _propTypes.default.string,
  value: _propTypes.default.any,
  name: _propTypes.default.string,
  step: _propTypes.default.number,
  min: _propTypes.default.number,
  max: _propTypes.default.number,
  formatInput: _propTypes.default.bool,
  decimalSeparator: _propTypes.default.string,
  thousandSeparator: _propTypes.default.string,
  disabled: _propTypes.default.bool,
  required: _propTypes.default.bool,
  tabIndex: _propTypes.default.number,
  pattern: _propTypes.default.string,
  placeholder: _propTypes.default.string,
  readonly: _propTypes.default.bool,
  maxlength: _propTypes.default.number,
  size: _propTypes.default.number,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  inputId: _propTypes.default.string,
  inputStyle: _propTypes.default.object,
  inputClassName: _propTypes.default.string,
  tooltip: _propTypes.default.string,
  tooltipOptions: _propTypes.default.object,
  onChange: _propTypes.default.func,
  onBlur: _propTypes.default.func
});