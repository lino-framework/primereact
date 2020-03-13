"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RadioButton = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _Tooltip = _interopRequireDefault(require("../tooltip/Tooltip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RadioButton extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onClick = this.onClick.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  select(e) {
    this.input.checked = true;
    this.onClick(e);
  }

  onClick(e) {
    if (!this.props.disabled && this.props.onChange) {
      this.props.onChange({
        originalEvent: e,
        value: this.props.value,
        checked: !this.props.checked,
        stopPropagation: () => {},
        preventDefault: () => {},
        target: {
          name: this.props.name,
          id: this.props.id,
          value: this.props.value
        }
      });
      this.input.checked = !this.props.checked;
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
    if (this.input) {
      this.input.checked = this.props.checked;
    }

    let containerClass = (0, _classnames.default)('p-radiobutton p-component', this.props.className);
    let boxClass = (0, _classnames.default)('p-radiobutton-box p-component', {
      'p-highlight': this.props.checked,
      'p-disabled': this.props.disabled,
      'p-focus': this.state.focused
    });
    let iconClass = (0, _classnames.default)('p-radiobutton-icon p-c', {
      'pi pi-circle-on': this.props.checked
    });
    return _react.default.createElement("div", {
      ref: el => this.element = el,
      id: this.props.id,
      className: containerClass,
      style: this.props.style,
      onClick: this.onClick
    }, _react.default.createElement("div", {
      className: "p-hidden-accessible"
    }, _react.default.createElement("input", {
      id: this.props.inputId,
      ref: el => this.input = el,
      type: "radio",
      name: this.props.name,
      defaultChecked: this.props.checked,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      disabled: this.props.disabled,
      required: this.props.required,
      tabIndex: this.props.tabIndex
    })), _react.default.createElement("div", {
      className: boxClass,
      ref: el => {
        this.box = el;
      }
    }, _react.default.createElement("span", {
      className: iconClass
    })));
  }

}

exports.RadioButton = RadioButton;

_defineProperty(RadioButton, "defaultProps", {
  id: null,
  inputId: null,
  name: null,
  value: null,
  checked: false,
  style: null,
  className: null,
  disabled: false,
  required: false,
  tabIndex: null,
  tooltip: null,
  tooltipOptions: null,
  onChange: null
});

_defineProperty(RadioButton, "propTypes", {
  id: _propTypes.default.string,
  inputId: _propTypes.default.string,
  value: _propTypes.default.any,
  checked: _propTypes.default.bool,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  disabled: _propTypes.default.bool,
  required: _propTypes.default.bool,
  tabIndex: _propTypes.default.number,
  onChange: _propTypes.default.func,
  tooltip: _propTypes.default.string,
  tooltipOptions: _propTypes.default.object
});