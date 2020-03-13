"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Chips = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _InputText = require("../inputtext/InputText");

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

var _classnames = _interopRequireDefault(require("classnames"));

var _Tooltip = _interopRequireDefault(require("../tooltip/Tooltip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Chips extends _react.Component {
  constructor(props) {
    super(props);
    this.focusInput = this.focusInput.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  componentDidMount() {
    if (this.props.tooltip) {
      this.renderTooltip();
    }
  }

  componentDidUpdate(prevProps) {
    let isValueSame = this.props.value && prevProps.value.length === this.props.value.length;

    if (this.props.tooltip) {
      if (prevProps.tooltip !== this.props.tooltip) {
        if (this.tooltip) this.tooltip.updateContent(this.props.tooltip);else this.renderTooltip();
      } else if (!isValueSame && this.tooltip) {
        this.tooltip.deactivate();
        this.tooltip.activate();
      }
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
      target: this.inputElement,
      targetContainer: this.listElement,
      content: this.props.tooltip,
      options: this.props.tooltipOptions
    });
  }

  removeItem(event, index) {
    if (this.props.disabled) {
      return;
    }

    let values = [...this.props.value];
    const removedItem = values.splice(index, 1);

    if (this.props.onRemove) {
      this.props.onRemove({
        originalEvent: event,
        value: removedItem
      });
    }

    if (this.props.onChange) {
      this.props.onChange({
        originalEvent: event,
        value: values,
        stopPropagation: () => {},
        preventDefault: () => {},
        target: {
          name: this.props.name,
          id: this.props.id,
          value: values
        }
      });
    }
  }

  focusInput() {
    this.inputElement.focus();
  }

  onKeyDown(event) {
    const inputValue = event.target.value;

    switch (event.which) {
      //backspace
      case 8:
        if (this.inputElement.value.length === 0 && this.props.value && this.props.value.length > 0) {
          this.removeItem(event, this.props.value.length - 1);
        }

        break;
      //enter

      case 13:
        if (inputValue && inputValue.trim().length && (!this.props.max || this.props.max > this.props.value.length)) {
          let values = [...this.props.value];
          values.push(inputValue);
          this.setState({
            values: values
          });

          if (this.props.onAdd) {
            this.props.onAdd({
              originalEvent: event,
              value: inputValue
            });
          }

          if (this.props.onChange) {
            this.props.onChange({
              originalEvent: event,
              value: values,
              stopPropagation: () => {},
              preventDefault: () => {},
              target: {
                name: this.props.name,
                id: this.props.id,
                value: values
              }
            });
          }
        }

        this.inputElement.value = '';
        event.preventDefault();
        break;

      default:
        if (this.isMaxedOut()) {
          event.preventDefault();
        }

        break;
    }
  }

  onFocus(event) {
    _DomHandler.default.addClass(this.listElement, 'p-focus');

    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  }

  onBlur(event) {
    _DomHandler.default.removeClass(this.listElement, 'p-focus');

    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  }

  isMaxedOut() {
    return this.props.max && this.props.value && this.props.max === this.props.value.length;
  }

  renderItem(value, index) {
    const content = this.props.itemTemplate ? this.props.itemTemplate(value) : value;
    const icon = this.props.disabled ? null : _react.default.createElement("span", {
      className: "p-chips-token-icon pi pi-fw pi-times",
      onClick: event => this.removeItem(event, index)
    });
    return _react.default.createElement("li", {
      key: index,
      className: "p-chips-token p-highlight"
    }, icon, _react.default.createElement("span", {
      className: "p-chips-token-label"
    }, content));
  }

  renderInputElement() {
    return _react.default.createElement("li", {
      className: "p-chips-input-token"
    }, _react.default.createElement(_InputText.InputText, {
      ref: el => this.inputElement = _reactDom.default.findDOMNode(el),
      placeholder: this.props.placeholder,
      type: "text",
      name: this.props.name,
      disabled: this.props.disabled || this.isMaxedOut(),
      onKeyDown: this.onKeyDown,
      onFocus: this.onFocus,
      onBlur: this.onBlur
    }));
  }

  renderItems() {
    if (this.props.value) {
      return this.props.value.map((value, index) => {
        return this.renderItem(value, index);
      });
    } else {
      return null;
    }
  }

  renderList() {
    const className = (0, _classnames.default)('p-inputtext', {
      'p-disabled': this.props.disabled
    });
    const items = this.renderItems();
    const inputElement = this.renderInputElement();

    if (this.props.value) {
      return _react.default.createElement("ul", {
        ref: el => this.listElement = el,
        className: className,
        onClick: this.focusInput
      }, items, inputElement);
    } else {
      return null;
    }
  }

  render() {
    const className = (0, _classnames.default)('p-chips p-component', this.props.className);
    const list = this.renderList();
    return _react.default.createElement("div", {
      ref: el => this.element = el,
      id: this.props.id,
      className: className,
      style: this.props.style
    }, list);
  }

}

exports.Chips = Chips;

_defineProperty(Chips, "defaultProps", {
  id: null,
  name: null,
  placeholder: null,
  value: null,
  max: null,
  disabled: null,
  style: null,
  className: null,
  tooltip: null,
  tooltipOptions: null,
  itemTemplate: null,
  onAdd: null,
  onRemove: null,
  onChange: null,
  onFocus: null,
  onBlur: null
});

_defineProperty(Chips, "propTypes", {
  id: _propTypes.default.string,
  name: _propTypes.default.string,
  placeholder: _propTypes.default.string,
  value: _propTypes.default.array,
  max: _propTypes.default.number,
  disabled: _propTypes.default.bool,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  tooltip: _propTypes.default.string,
  tooltipOptions: _propTypes.default.object,
  itemTemplate: _propTypes.default.func,
  onAdd: _propTypes.default.func,
  onRemove: _propTypes.default.func,
  onChange: _propTypes.default.func,
  onFocus: _propTypes.default.func,
  onBlur: _propTypes.default.func
});