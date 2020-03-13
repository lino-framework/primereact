"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Button = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _Tooltip = _interopRequireDefault(require("../tooltip/Tooltip"));

var _ObjectUtils = _interopRequireDefault(require("../utils/ObjectUtils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Button extends _react.Component {
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

  renderIcon() {
    if (this.props.icon) {
      let className = (0, _classnames.default)(this.props.icon, 'p-c', {
        'p-button-icon-left': this.props.iconPos !== 'right',
        'p-button-icon-right': this.props.iconPos === 'right'
      });
      return _react.default.createElement("span", {
        className: className
      });
    } else {
      return null;
    }
  }

  renderLabel() {
    const buttonLabel = this.props.label || 'p-btn';
    return _react.default.createElement("span", {
      className: "p-button-text p-c"
    }, buttonLabel);
  }

  render() {
    let className = (0, _classnames.default)('p-button p-component', this.props.className, {
      'p-button-icon-only': this.props.icon && !this.props.label,
      'p-button-text-icon-left': this.props.icon && this.props.label && this.props.iconPos === 'left',
      'p-button-text-icon-right': this.props.icon && this.props.label && this.props.iconPos === 'right',
      'p-button-text-only': !this.props.icon && this.props.label,
      'p-disabled': this.props.disabled
    });
    let icon = this.renderIcon();
    let label = this.renderLabel();

    let buttonProps = _ObjectUtils.default.findDiffKeys(this.props, Button.defaultProps);

    return _react.default.createElement("button", _extends({
      ref: el => this.element = el
    }, buttonProps, {
      className: className
    }), this.props.iconPos === 'left' && icon, label, this.props.iconPos === 'right' && icon, this.props.children);
  }

}

exports.Button = Button;

_defineProperty(Button, "defaultProps", {
  label: null,
  icon: null,
  iconPos: 'left',
  tooltip: null,
  tooltipOptions: null
});

_defineProperty(Button, "propTypes", {
  label: _propTypes.default.string,
  icon: _propTypes.default.string,
  iconPos: _propTypes.default.string,
  tooltip: _propTypes.default.string,
  tooltipOptions: _propTypes.default.object
});