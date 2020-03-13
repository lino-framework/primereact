"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectButton = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _ObjectUtils = _interopRequireDefault(require("../utils/ObjectUtils"));

var _SelectButtonItem = require("./SelectButtonItem");

var _Tooltip = _interopRequireDefault(require("../tooltip/Tooltip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class SelectButton extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onOptionClick = this.onOptionClick.bind(this);
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

  onOptionClick(event) {
    if (this.props.disabled) {
      return;
    }

    let selected = this.isSelected(event.option);
    let optionValue = this.getOptionValue(event.option);
    let newValue;

    if (this.props.multiple) {
      let currentValue = this.props.value ? [...this.props.value] : [];
      if (selected) newValue = currentValue.filter(val => !_ObjectUtils.default.equals(val, optionValue, this.props.dataKey));else newValue = [...currentValue, optionValue];
    } else {
      if (selected) newValue = null;else newValue = optionValue;
    }

    if (this.props.onChange) {
      this.props.onChange({
        originalEvent: event.originalEvent,
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

  getOptionValue(option) {
    return this.props.optionLabel ? option : option.value;
  }

  getOptionLabel(option) {
    return this.props.optionLabel ? _ObjectUtils.default.resolveFieldData(option, this.props.optionLabel) : option.label;
  }

  isSelected(option) {
    let selected = false;
    let optionValue = this.getOptionValue(option);

    if (this.props.multiple) {
      if (this.props.value && this.props.value.length) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.props.value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            let val = _step.value;

            if (_ObjectUtils.default.equals(val, optionValue, this.props.dataKey)) {
              selected = true;
              break;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    } else {
      selected = _ObjectUtils.default.equals(this.props.value, optionValue, this.props.dataKey);
    }

    return selected;
  }

  renderItems() {
    if (this.props.options && this.props.options.length) {
      return this.props.options.map((option, index) => {
        let optionLabel = this.getOptionLabel(option);
        return _react.default.createElement(_SelectButtonItem.SelectButtonItem, {
          key: optionLabel,
          label: optionLabel,
          className: option.className,
          option: option,
          onClick: this.onOptionClick,
          selected: this.isSelected(option),
          tabIndex: this.props.tabIndex,
          disabled: this.props.disabled
        });
      });
    } else {
      return null;
    }
  }

  render() {
    let className = (0, _classnames.default)('p-selectbutton p-buttonset p-component p-buttonset-3', this.props.className);
    let items = this.renderItems();
    return _react.default.createElement("div", {
      id: this.props.id,
      ref: el => this.element = el
    }, _react.default.createElement("div", {
      className: className,
      style: this.props.style
    }, items));
  }

}

exports.SelectButton = SelectButton;

_defineProperty(SelectButton, "defaultProps", {
  id: null,
  value: null,
  options: null,
  optionLabel: null,
  tabIndex: null,
  multiple: null,
  disabled: null,
  style: null,
  className: null,
  dataKey: null,
  tooltip: null,
  tooltipOptions: null,
  onChange: null
});

_defineProperty(SelectButton, "propTypes", {
  id: _propTypes.default.string,
  value: _propTypes.default.any,
  options: _propTypes.default.array,
  optionLabel: _propTypes.default.string,
  tabIndex: _propTypes.default.string,
  multiple: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  dataKey: _propTypes.default.string,
  tooltip: _propTypes.default.string,
  tooltipOptions: _propTypes.default.object,
  onChange: _propTypes.default.func
});