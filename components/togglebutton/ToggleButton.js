"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToggleButton = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _Tooltip = _interopRequireDefault(require("../tooltip/Tooltip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ToggleButton extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.toggle = this.toggle.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  toggle(e) {
    if (this.props.onChange) {
      this.props.onChange({
        originalEvent: e,
        value: !this.props.checked,
        stopPropagation: () => {},
        preventDefault: () => {},
        target: {
          name: this.props.name,
          id: this.props.id,
          value: !this.props.checked
        }
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
      this.toggle(event);
      event.preventDefault();
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
      target: this.container,
      content: this.props.tooltip,
      options: this.props.tooltipOptions
    });
  }

  render() {
    var className = (0, _classnames.default)('p-button p-togglebutton p-component', this.props.className, {
      'p-button-text-icon-left': this.props.onIcon && this.props.offIcon,
      'p-button-text-only': !this.props.onIcon && !this.props.offIcon && (this.props.onLabel || this.props.offLabel),
      'p-highlight': this.props.checked,
      'p-disabled': this.props.disabled,
      'p-focus': this.state.focused
    }),
        iconStyleClass = null;

    if (this.props.onIcon || this.props.offIcon) {
      iconStyleClass = (0, _classnames.default)('p-c', this.props.checked ? this.props.onIcon : this.props.offIcon, {
        'p-button-icon-only': this.props.onIcon && this.props.offIcon && (!this.props.onLabel || !this.props.offLabel),
        'p-button-icon-left': this.props.onIcon && this.props.offIcon
      });
    }

    return _react.default.createElement("div", {
      ref: el => this.container = el,
      id: this.props.id,
      className: className,
      style: this.props.style,
      onClick: this.toggle
    }, _react.default.createElement("div", {
      className: "p-hidden-accessible"
    }, _react.default.createElement("input", {
      ref: el => this.input = el,
      type: "checkbox",
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onKeyDown: this.onKeyDown,
      tabIndex: this.props.tabIndex
    })), this.props.onIcon && this.props.offIcon && _react.default.createElement("span", {
      className: iconStyleClass
    }), _react.default.createElement("span", {
      className: "p-button-text p-unselectable-text"
    }, this.props.checked ? this.props.onLabel : this.props.offLabel));
  }

}

exports.ToggleButton = ToggleButton;

_defineProperty(ToggleButton, "defaultProps", {
  id: null,
  onIcon: null,
  offIcon: null,
  onLabel: 'Yes',
  offLabel: 'No',
  style: null,
  className: null,
  checked: false,
  tabIndex: 0,
  tooltip: null,
  tooltipOptions: null,
  onChange: null
});

_defineProperty(ToggleButton, "propTypes", {
  id: _propTypes.default.string,
  onIcon: _propTypes.default.string,
  offIcon: _propTypes.default.string,
  onLabel: _propTypes.default.string,
  offLabel: _propTypes.default.string,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  checked: _propTypes.default.bool,
  tabIndex: _propTypes.default.number,
  tooltip: _propTypes.default.string,
  tooltipOptions: _propTypes.default.object,
  onChange: _propTypes.default.func
});