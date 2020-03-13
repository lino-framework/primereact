"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AutoComplete = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _InputText = require("../inputtext/InputText");

var _Button = require("../button/Button");

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

var _ObjectUtils = _interopRequireDefault(require("../utils/ObjectUtils"));

var _AutoCompletePanel = require("./AutoCompletePanel");

var _classnames = _interopRequireDefault(require("classnames"));

var _Tooltip = _interopRequireDefault(require("../tooltip/Tooltip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AutoComplete extends _react.Component {
  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.onInputClick = this.onInputClick.bind(this);
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
    this.onDropdownClick = this.onDropdownClick.bind(this);
    this.onMultiContainerClick = this.onMultiContainerClick.bind(this);
    this.onMultiInputFocus = this.onMultiInputFocus.bind(this);
    this.onMultiInputBlur = this.onMultiInputBlur.bind(this);
    this.selectItem = this.selectItem.bind(this);
  }

  onInputChange(event) {
    //Cancel the search request if user types within the timeout
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    let query = event.target.value;

    if (!this.props.multiple) {
      this.updateModel(event, query);
    }

    if (query.length === 0) {
      this.hidePanel();

      if (this.props.onClear) {
        this.props.onClear(event);
      }
    } else {
      if (query.length >= this.props.minLength) {
        this.timeout = setTimeout(() => {
          this.search(event, query, 'input');
        }, this.props.delay);
      } else {
        this.hidePanel();
      }
    }
  }

  onInputClick(event) {
    if (this.documentClickListener) {
      this.inputClick = true;
    }

    if (this.props.onClick) {
      this.props.onClick(event);
    }
  }

  search(event, query, source) {
    //allow empty string but not undefined or null
    if (query === undefined || query === null) {
      return;
    } //do not search blank values on input change


    if (source === 'input' && query.trim().length === 0) {
      return;
    }

    if (this.props.completeMethod) {
      this.searching = true;
      this.showLoader();
      this.props.completeMethod({
        originalEvent: event,
        query: query
      });
    }
  }

  selectItem(event, option) {
    if (this.props.multiple) {
      this.inputEl.value = '';

      if (!this.isSelected(option)) {
        let newValue = this.props.value ? [...this.props.value, option] : [option];
        this.updateModel(event, newValue);
      }
    } else {
      this.updateInputField(option);
      this.updateModel(event, option);
    }

    if (this.props.onSelect) {
      this.props.onSelect({
        originalEvent: event,
        value: option
      });
    }

    this.inputEl.focus();
  }

  updateModel(event, value) {
    if (this.props.onChange) {
      this.props.onChange({
        originalEvent: event,
        value: value,
        stopPropagation: () => {},
        preventDefault: () => {},
        target: {
          name: this.props.name,
          id: this.props.id,
          value: value
        }
      });
    }
  }

  formatValue(value) {
    if (value) {
      if (this.props.selectedItemTemplate) {
        const resolvedFieldData = this.props.selectedItemTemplate(value);
        return resolvedFieldData ? resolvedFieldData : value;
      } else if (this.props.field) {
        const resolvedFieldData = _ObjectUtils.default.resolveFieldData(value, this.props.field);

        return resolvedFieldData !== null && resolvedFieldData !== undefined ? resolvedFieldData : value;
      } else return value;
    } else return '';
  }

  updateInputField(value) {
    const formattedValue = this.formatValue(value);
    this.inputEl.value = formattedValue;
  }

  showPanel() {
    if (this.focus) {
      this.alignPanel();

      if (this.panel && this.panel.element && !this.panel.element.offsetParent) {
        this.panel.element.style.zIndex = String(_DomHandler.default.generateZIndex());
        this.panel.element.style.display = "block";
        setTimeout(() => {
          if (this.panel && this.panel.element) {
            _DomHandler.default.addClass(this.panel.element, 'p-input-overlay-visible');

            _DomHandler.default.removeClass(this.panel.element, 'p-input-overlay-hidden');
          }
        }, 1);
        this.alignPanel();
        this.bindDocumentClickListener();
      }
    }
  }

  alignPanel() {
    if (this.panel.element.offsetParent) {
      let target = this.props.multiple ? this.multiContainer : this.inputEl;

      if (this.props.appendTo) {
        this.panel.element.style.minWidth = _DomHandler.default.getWidth(target) + 'px';

        _DomHandler.default.absolutePosition(this.panel.element, target, this.props.container);
      } else {
        _DomHandler.default.relativePosition(this.panel.element, target, this.props.container);
      }
    }
  }

  hidePanel() {
    _DomHandler.default.addClass(this.panel.element, 'p-input-overlay-hidden');

    _DomHandler.default.removeClass(this.panel.element, 'p-input-overlay-visible');

    setTimeout(() => {
      if (this.panel && this.panel.element) {
        this.panel.element.style.display = 'none';

        _DomHandler.default.removeClass(this.panel.element, 'p-input-overlay-hidden');
      }
    }, 150);
    this.unbindDocumentClickListener();
  }

  onDropdownClick(event) {
    this.inputEl.focus();

    if (this.documentClickListener) {
      this.dropdownClick = true;
    }

    if (this.props.dropdownMode === 'blank') this.search(event, '', 'dropdown');else if (this.props.dropdownMode === 'current') this.search(event, this.inputEl.value, 'dropdown');

    if (this.props.onDropdownClick) {
      this.props.onDropdownClick({
        originalEvent: event,
        query: this.inputEl.value
      });
    }
  }

  removeItem(event, index) {
    let removedValue = this.props.value[index];
    let newValue = this.props.value.filter((val, i) => index !== i);
    this.updateModel(event, newValue);

    if (this.props.onUnselect) {
      this.props.onUnselect({
        originalEvent: event,
        value: removedValue
      });
    }
  }

  onInputKeyDown(event) {
    if (this.isPanelVisible()) {
      let highlightItem = _DomHandler.default.findSingle(this.panel.element, 'li.p-highlight');

      switch (event.which) {
        //down
        case 40:
          if (highlightItem) {
            let nextElement = highlightItem.nextElementSibling;

            if (nextElement) {
              _DomHandler.default.addClass(nextElement, 'p-highlight');

              _DomHandler.default.removeClass(highlightItem, 'p-highlight');

              _DomHandler.default.scrollInView(this.panel.element, nextElement);
            }
          } else {
            _DomHandler.default.addClass(this.panel.element.firstChild.firstChild, 'p-highlight');
          }

          event.preventDefault();
          break;
        //up

        case 38:
          if (highlightItem) {
            let previousElement = highlightItem.previousElementSibling;

            if (previousElement) {
              _DomHandler.default.addClass(previousElement, 'p-highlight');

              _DomHandler.default.removeClass(highlightItem, 'p-highlight');

              _DomHandler.default.scrollInView(this.panel.element, previousElement);
            }
          }

          event.preventDefault();
          break;
        //enter,tab

        case 13:
          if (highlightItem) {
            this.selectItem(event, this.props.suggestions[_DomHandler.default.index(highlightItem)]);
            this.hidePanel();
          }

          event.preventDefault();
          break;
        //escape

        case 27:
          this.hidePanel();
          event.preventDefault();
          break;
        //tab

        case 9:
          if (highlightItem) {
            this.selectItem(event, this.props.suggestions[_DomHandler.default.index(highlightItem)]);
          }

          this.hidePanel();
          break;

        default:
          break;
      }
    }

    if (this.props.multiple) {
      switch (event.which) {
        //backspace
        case 8:
          if (this.props.value && this.props.value.length && !this.inputEl.value) {
            let removedValue = this.props.value[this.props.value.length - 1];
            let newValue = this.props.value.slice(0, -1);

            if (this.props.onUnselect) {
              this.props.onUnselect({
                originalEvent: event,
                value: removedValue
              });
            }

            this.updateModel(event, newValue);
          }

          break;

        default:
          break;
      }
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }
  }

  onInputFocus(event) {
    this.focus = true;

    if (this.props.onFocus) {
      this.props.onFocus(event);
    }

    _DomHandler.default.addClass(this.container, 'p-inputwrapper-focus');
  }

  onInputBlur(event) {
    this.focus = false;

    if (this.props.onBlur) {
      this.props.onBlur(event);
    }

    _DomHandler.default.removeClass(this.container, 'p-inputwrapper-focus');
  }

  onMultiContainerClick(event) {
    this.inputEl.focus();

    if (this.documentClickListener) {
      this.inputClick = true;
    }

    if (this.props.onClick) {
      this.props.onClick(event);
    }
  }

  onMultiInputFocus(event) {
    this.onInputFocus(event);

    _DomHandler.default.addClass(this.multiContainer, 'p-focus');
  }

  onMultiInputBlur(event) {
    this.onInputBlur(event);

    _DomHandler.default.removeClass(this.multiContainer, 'p-focus');
  }

  isSelected(val) {
    let selected = false;

    if (this.props.value && this.props.value.length) {
      for (let i = 0; i < this.props.value.length; i++) {
        if (_ObjectUtils.default.equals(this.props.value[i], val)) {
          selected = true;
          break;
        }
      }
    }

    return selected;
  }

  findOptionIndex(option) {
    let index = -1;

    if (this.suggestions) {
      for (let i = 0; i < this.suggestions.length; i++) {
        if (_ObjectUtils.default.equals(option, this.suggestions[i])) {
          index = i;
          break;
        }
      }
    }

    return index;
  }

  componentDidMount() {
    if (this.props.autoFocus && this.inputEl) {
      this.inputEl.focus();
    }

    if (this.props.tooltip) {
      this.renderTooltip();
    }
  }

  componentWillUnmount() {
    this.unbindDocumentClickListener();

    if (this.tooltip) {
      this.tooltip.destroy();
      this.tooltip = null;
    }
  }

  componentDidUpdate(prevProps) {
    if (this.searching) {
      if (this.props.suggestions && this.props.suggestions.length) this.showPanel();else this.hidePanel();
      this.hideLoader();
    }

    this.searching = false;

    if (this.inputEl && !this.props.multiple) {
      this.updateInputField(this.props.value);
    }

    if (prevProps.tooltip !== this.props.tooltip) {
      if (this.tooltip) this.tooltip.updateContent(this.props.tooltip);else this.renderTooltip();
    }
  }

  showLoader() {
    this.loader.style.visibility = 'visible';
    console.log("show");
    this.props.onShowLoader && this.props.onShowLoader();
  }

  hideLoader() {
    this.loader.style.visibility = 'hidden';
    console.log("hide");
    this.props.onHideLoader && this.props.onHideLoader();
  }

  renderTooltip() {
    this.tooltip = new _Tooltip.default({
      target: this.container,
      content: this.props.tooltip,
      options: this.props.tooltipOptions
    });
  }

  renderSimpleAutoComplete() {
    const inputClassName = (0, _classnames.default)('p-autocomplete-input', this.props.inputClassName, {
      'p-autocomplete-dd-input': this.props.dropdown
    });
    return _react.default.createElement(_InputText.InputText, {
      ref: el => this.inputEl = _reactDom.default.findDOMNode(el),
      id: this.props.inputId,
      type: this.props.type,
      name: this.props.name,
      defaultValue: this.formatValue(this.props.value),
      className: inputClassName,
      style: this.props.inputStyle,
      autoComplete: "off",
      readOnly: this.props.readonly,
      disabled: this.props.disabled,
      placeholder: this.props.placeholder,
      size: this.props.size,
      maxLength: this.props.maxlength,
      tabIndex: this.props.tabindex,
      onBlur: this.onInputBlur,
      onFocus: this.onInputFocus,
      onChange: this.onInputChange,
      onMouseDown: this.props.onMouseDown,
      onKeyUp: this.props.onKeyUp,
      onKeyDown: this.onInputKeyDown,
      onKeyPress: this.props.onKeyPress,
      onContextMenu: this.props.onContextMenu,
      onClick: this.onInputClick,
      onDoubleClick: this.props.onDblClick
    });
  }

  renderChips() {
    if (this.props.value && this.props.value.length) {
      return this.props.value.map((val, index) => {
        return _react.default.createElement("li", {
          key: index + 'multi-item',
          className: "p-autocomplete-token p-highlight"
        }, _react.default.createElement("span", {
          className: "p-autocomplete-token-icon pi pi-fw pi-times",
          onClick: e => this.removeItem(e, index)
        }), _react.default.createElement("span", {
          className: "p-autocomplete-token-label"
        }, this.formatValue(val)));
      });
    } else {
      return null;
    }
  }

  renderMultiInput() {
    return _react.default.createElement("li", {
      className: "p-autocomplete-input-token"
    }, _react.default.createElement("input", {
      ref: el => this.inputEl = el,
      type: this.props.type,
      disabled: this.props.disabled,
      placeholder: this.props.placeholder,
      autoComplete: "off",
      tabIndex: this.props.tabindex,
      onChange: this.onInputChange,
      id: this.props.inputId,
      name: this.props.name,
      style: this.props.inputStyle,
      className: this.props.inputClassName,
      maxLength: this.props.maxlength,
      onKeyUp: this.props.onKeyUp,
      onKeyDown: this.onInputKeyDown,
      onKeyPress: this.props.onKeyPress,
      onFocus: this.onMultiInputFocus,
      onBlur: this.onMultiInputBlur
    }));
  }

  renderMultipleAutoComplete() {
    let multiContainerClass = (0, _classnames.default)("p-autocomplete-multiple-container p-component p-inputtext", {
      'p-disabled': this.props.disabled
    });
    let tokens = this.renderChips();
    let input = this.renderMultiInput();
    return _react.default.createElement("ul", {
      ref: el => {
        this.multiContainer = el;
      },
      className: multiContainerClass,
      onContextMenu: this.props.onContextMenu,
      onMouseDown: this.props.onMouseDown,
      onClick: this.onMultiContainerClick,
      onDoubleClick: this.props.onDblClick
    }, tokens, input);
  }

  renderDropdown() {
    return _react.default.createElement(_Button.Button, {
      type: "button",
      icon: "pi pi-fw pi-chevron-down",
      className: "p-autocomplete-dropdown",
      disabled: this.props.disabled,
      onClick: this.onDropdownClick
    });
  }

  renderLoader() {
    return _react.default.createElement("i", {
      ref: el => this.loader = el,
      className: "p-autocomplete-loader pi pi-spinner pi-spin",
      style: {
        visibility: 'hidden'
      }
    });
  }

  bindDocumentClickListener() {
    if (!this.documentClickListener) {
      this.documentClickListener = event => {
        if (event.which === 3) {
          return;
        }

        if (!this.inputClick && !this.dropdownClick) {
          this.hidePanel();
        }

        this.inputClick = false;
        this.dropdownClick = false;
      };

      document.addEventListener('click', this.documentClickListener);
    }
  }

  unbindDocumentClickListener() {
    if (this.documentClickListener) {
      document.removeEventListener('click', this.documentClickListener);
      this.documentClickListener = null;
    }
  }

  isPanelVisible() {
    return this.panel.element.offsetParent != null;
  }

  render() {
    let input, dropdown;
    let className = (0, _classnames.default)('p-autocomplete p-component', this.props.className, {
      'p-autocomplete-dd': this.props.dropdown,
      'p-autocomplete-multiple': this.props.multiple,
      'p-inputwrapper-filled': this.props.value,
      'p-inputwrapper-focus': this.focus
    });
    let loader = this.renderLoader();
    if (this.props.multiple) input = this.renderMultipleAutoComplete();else input = this.renderSimpleAutoComplete();

    if (this.props.dropdown) {
      dropdown = this.renderDropdown();
    }

    return _react.default.createElement("span", {
      ref: el => this.container = el,
      id: this.props.id,
      style: this.props.style,
      className: className
    }, input, loader, dropdown, _react.default.createElement(_AutoCompletePanel.AutoCompletePanel, {
      ref: el => this.panel = el,
      suggestions: this.props.suggestions,
      field: this.props.field,
      appendTo: this.props.appendTo,
      itemTemplate: this.props.itemTemplate,
      onItemClick: this.selectItem
    }));
  }

}

exports.AutoComplete = AutoComplete;

_defineProperty(AutoComplete, "defaultProps", {
  id: null,
  value: null,
  name: null,
  type: 'text',
  suggestions: null,
  field: null,
  scrollHeight: '200px',
  dropdown: false,
  dropdownMode: 'blank',
  multiple: false,
  minLength: 1,
  delay: 300,
  style: null,
  className: null,
  inputId: null,
  inputStyle: null,
  inputClassName: null,
  placeholder: null,
  readonly: false,
  disabled: false,
  maxlength: null,
  size: null,
  appendTo: null,
  tabindex: null,
  autoFocus: false,
  tooltip: null,
  tooltipOptions: null,
  completeMethod: null,
  itemTemplate: null,
  selectedItemTemplate: null,
  onChange: null,
  onFocus: null,
  onBlur: null,
  onSelect: null,
  onUnselect: null,
  onDropdownClick: null,
  onClick: null,
  onDblClick: null,
  onMouseDown: null,
  onKeyUp: null,
  onKeyPress: null,
  onKeyDown: null,
  onContextMenu: null,
  onClear: null
});

_defineProperty(AutoComplete, "propTypes", {
  id: _propTypes.default.string,
  value: _propTypes.default.any,
  name: _propTypes.default.string,
  type: _propTypes.default.string,
  suggestions: _propTypes.default.array,
  field: _propTypes.default.string,
  scrollHeight: _propTypes.default.string,
  dropdown: _propTypes.default.bool,
  dropdownMode: _propTypes.default.string,
  multiple: _propTypes.default.bool,
  minLength: _propTypes.default.number,
  delay: _propTypes.default.number,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  inputId: _propTypes.default.string,
  inputStyle: _propTypes.default.object,
  inputClassName: _propTypes.default.string,
  placeholder: _propTypes.default.string,
  readonly: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  maxlength: _propTypes.default.number,
  size: _propTypes.default.number,
  appendTo: _propTypes.default.any,
  tabindex: _propTypes.default.number,
  autoFocus: _propTypes.default.bool,
  tooltip: _propTypes.default.string,
  tooltipOptions: _propTypes.default.object,
  completeMethod: _propTypes.default.func,
  itemTemplate: _propTypes.default.func,
  selectedItemTemplate: _propTypes.default.func,
  onChange: _propTypes.default.func,
  onFocus: _propTypes.default.func,
  onBlur: _propTypes.default.func,
  onSelect: _propTypes.default.func,
  onUnselect: _propTypes.default.func,
  onDropdownClick: _propTypes.default.func,
  onClick: _propTypes.default.func,
  onDblClick: _propTypes.default.func,
  onMouseDown: _propTypes.default.func,
  onKeyUp: _propTypes.default.func,
  onKeyPress: _propTypes.default.func,
  onKeyDown: _propTypes.default.func,
  onContextMenu: _propTypes.default.func,
  onClear: _propTypes.default.func
});