"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TriStateCheckbox = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

var _Tooltip = _interopRequireDefault(require("../tooltip/Tooltip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TriStateCheckbox extends _react.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onClick(event) {
    this.toggle(event);
    this.inputEL.focus();
  }

  toggle(event) {
    var newValue;
    if (this.props.value === null || this.props.value === undefined) newValue = true;else if (this.props.value === true) newValue = false;else if (this.props.value === false) newValue = null;

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

  onFocus(e) {
    _DomHandler.default.addClass(this.box, 'p-focus');
  }

  onBlur(e) {
    _DomHandler.default.removeClass(this.box, 'p-focus');
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
    let containerClass = (0, _classnames.default)('p-checkbox p-tristatecheckbox p-component', this.props.className);
    let boxClass = (0, _classnames.default)('p-checkbox-box p-component', {
      'p-highlight': (this.props.value || !this.props.value) && this.props.value !== null
    });
    let iconClass = (0, _classnames.default)('p-checkbox-icon p-c', {
      'pi pi-check': this.props.value === true,
      'pi pi-times': this.props.value === false
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
      ref: el => this.inputEL = el,
      type: "checkbox",
      id: this.props.inputId,
      name: this.props.name,
      onFocus: this.onFocus,
      onBlur: this.onBlur
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

exports.TriStateCheckbox = TriStateCheckbox;

_defineProperty(TriStateCheckbox, "defaultProps", {
  id: null,
  inputId: null,
  value: null,
  name: null,
  style: null,
  className: null,
  tooltip: null,
  tooltipOptions: null,
  onChange: null
});

_defineProperty(TriStateCheckbox, "propTypes", {
  id: _propTypes.default.string,
  inputId: _propTypes.default.string,
  value: _propTypes.default.bool,
  name: _propTypes.default.string,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  tooltip: _propTypes.default.string,
  tooltipOptions: _propTypes.default.object,
  onChange: _propTypes.default.func
});