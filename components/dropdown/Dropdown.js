"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dropdown = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

var _ObjectUtils = _interopRequireDefault(require("../utils/ObjectUtils"));

var _classnames = _interopRequireDefault(require("classnames"));

var _DropdownPanel = require("./DropdownPanel");

var _DropdownItem = require("./DropdownItem");

var _Tooltip = _interopRequireDefault(require("../tooltip/Tooltip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Dropdown extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: ''
    };
    this.onClick = this.onClick.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
    this.onEditableInputClick = this.onEditableInputClick.bind(this);
    this.onEditableInputChange = this.onEditableInputChange.bind(this);
    this.onEditableInputFocus = this.onEditableInputFocus.bind(this);
    this.onOptionClick = this.onOptionClick.bind(this);
    this.onFilterInputChange = this.onFilterInputChange.bind(this);
    this.onFilterInputKeyDown = this.onFilterInputKeyDown.bind(this);
    this.panelClick = this.panelClick.bind(this);
    this.clear = this.clear.bind(this);
  }

  onClick(event) {
    if (this.props.disabled) {
      return;
    }

    if (this.documentClickListener) {
      this.selfClick = true;
    }

    let clearClick = _DomHandler.default.hasClass(event.target, 'p-dropdown-clear-icon');

    if (!this.overlayClick && !this.editableInputClick && !clearClick) {
      this.focusInput.focus();

      if (this.panel.element.offsetParent) {
        this.hide();
      } else {
        this.show();

        if (this.props.filter && this.props.filterInputAutoFocus) {
          setTimeout(() => {
            this.filterInput.focus();
          }, 200);
        }
      }
    }

    if (this.editableInputClick) {
      this.expeditableInputClick = false;
    }
  }

  panelClick() {
    this.overlayClick = true;
  }

  onInputFocus(event) {
    _DomHandler.default.addClass(this.container, 'p-focus');
  }

  onInputBlur(event) {
    _DomHandler.default.removeClass(this.container, 'p-focus');
  }

  onUpKey(event) {
    if (this.props.options) {
      let selectedItemIndex = this.findOptionIndex(this.props.value);
      let prevItem = this.findPrevVisibleItem(selectedItemIndex);

      if (prevItem) {
        this.selectItem({
          originalEvent: event,
          option: prevItem
        });
      }
    }

    event.preventDefault();
  }

  onDownKey(event) {
    if (this.props.options) {
      if (!this.panel.element.offsetParent && event.altKey) {
        this.show();
      } else {
        let selectedItemIndex = this.findOptionIndex(this.props.value);
        let nextItem = this.findNextVisibleItem(selectedItemIndex);

        if (nextItem) {
          this.selectItem({
            originalEvent: event,
            option: nextItem
          });
        }
      }
    }

    event.preventDefault();
  }

  onInputKeyDown(event) {
    switch (event.which) {
      //down
      case 40:
        this.onDownKey(event);
        break;
      //up

      case 38:
        this.onUpKey(event);
        break;
      //space

      case 32:
        if (!this.panel.element.offsetParent) {
          this.show();
          event.preventDefault();
        }

        break;
      //enter

      case 13:
        this.hide();
        event.preventDefault();
        break;
      //escape and tab

      case 27:
      case 9:
        this.hide();
        break;

      default:
        this.search(event);
        break;
    }
  }

  search(event) {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    const char = String.fromCharCode(event.keyCode);
    this.previousSearchChar = this.currentSearchChar;
    this.currentSearchChar = char;
    if (this.previousSearchChar === this.currentSearchChar) this.searchValue = this.currentSearchChar;else this.searchValue = this.searchValue ? this.searchValue + char : char;
    let searchIndex = this.props.value ? this.findOptionIndex(this.props.value) : -1;
    let newOption = this.searchOption(++searchIndex);

    if (newOption) {
      this.selectItem({
        originalEvent: event,
        option: newOption
      });
      this.selectedOptionUpdated = true;
    }

    this.searchTimeout = setTimeout(() => {
      this.searchValue = null;
    }, 250);
  }

  searchOption(index) {
    let option;

    if (this.searchValue) {
      option = this.searchOptionInRange(index, this.props.options.length);

      if (!option) {
        option = this.searchOptionInRange(0, index);
      }
    }

    return option;
  }

  searchOptionInRange(start, end) {
    for (let i = start; i < end; i++) {
      let opt = this.props.options[i];
      let label = this.getOptionLabel(opt).toString().toLowerCase();

      if (label.startsWith(this.searchValue.toLowerCase())) {
        return opt;
      }
    }

    return null;
  }

  findNextVisibleItem(index) {
    let i = index + 1;

    if (i === this.props.options.length) {
      return null;
    }

    let option = this.props.options[i];

    if (option.disabled) {
      return this.findNextVisibleItem(i);
    }

    if (this.hasFilter()) {
      if (this.filter(option)) return option;else return this.findNextVisibleItem(i);
    } else {
      return option;
    }
  }

  findPrevVisibleItem(index) {
    let i = index - 1;

    if (i === -1) {
      return null;
    }

    let option = this.props.options[i];

    if (option.disabled) {
      return this.findPrevVisibleItem(i);
    }

    if (this.hasFilter()) {
      if (this.filter(option)) return option;else return this.findPrevVisibleItem(i);
    } else {
      return option;
    }
  }

  onEditableInputClick(event) {
    this.editableInputClick = true;
    this.bindDocumentClickListener();
  }

  onEditableInputChange(event) {
    this.props.onChange({
      originalEvent: event.originalEvent,
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

  onEditableInputFocus(event) {
    _DomHandler.default.addClass(this.container, 'p-focus');

    this.hide();
  }

  onOptionClick(event) {
    const option = event.option;

    if (!option.disabled) {
      this.selectItem(event);
      this.focusInput.focus();
    }

    setTimeout(() => {
      this.hide();
    }, 100);
  }

  onFilterInputChange(event) {
    this.setState({
      filter: event.target.value
    });
  }

  onFilterInputKeyDown(event) {
    switch (event.which) {
      //down
      case 40:
        this.onDownKey(event);
        break;
      //up

      case 38:
        this.onUpKey(event);
        break;
      //enter

      case 13:
        this.hide();
        event.preventDefault();
        break;

      default:
        break;
    }
  }

  clear(event) {
    this.props.onChange({
      originalEvent: event,
      value: null,
      stopPropagation: () => {},
      preventDefault: () => {},
      target: {
        name: this.props.name,
        id: this.props.id,
        value: null
      }
    });
    this.updateEditableLabel();
  }

  selectItem(event) {
    let currentSelectedOption = this.findOption(this.props.value);

    if (currentSelectedOption !== event.option) {
      this.updateEditableLabel(event.option);
      this.props.onChange({
        originalEvent: event.originalEvent,
        value: this.props.optionLabel ? event.option : event.option.value,
        stopPropagation: () => {},
        preventDefault: () => {},
        target: {
          name: this.props.name,
          id: this.props.id,
          value: this.props.optionLabel ? event.option : event.option.value
        }
      });
    }
  }

  findOptionIndex(value) {
    let index = -1;

    if (this.props.options) {
      for (let i = 0; i < this.props.options.length; i++) {
        let optionValue = this.props.optionLabel ? this.props.options[i] : this.props.options[i].value;

        if (value === null && optionValue == null || _ObjectUtils.default.equals(value, optionValue, this.props.dataKey)) {
          index = i;
          break;
        }
      }
    }

    return index;
  }

  findOption(value) {
    let index = this.findOptionIndex(value);
    return index !== -1 ? this.props.options[index] : null;
  }

  show() {
    this.panel.element.style.zIndex = String(_DomHandler.default.generateZIndex());
    this.panel.element.style.display = 'block';
    setTimeout(() => {
      _DomHandler.default.addClass(this.panel.element, 'p-input-overlay-visible');

      _DomHandler.default.removeClass(this.panel.element, 'p-input-overlay-hidden');
    }, 1);
    this.alignPanel();
    this.bindDocumentClickListener();
  }

  hide() {
    if (this.panel && this.panel.element && this.panel.element.offsetParent) {
      _DomHandler.default.addClass(this.panel.element, 'p-input-overlay-hidden');

      _DomHandler.default.removeClass(this.panel.element, 'p-input-overlay-visible');

      this.unbindDocumentClickListener();
      this.clearClickState();
      this.hideTimeout = setTimeout(() => {
        this.panel.element.style.display = 'none';

        _DomHandler.default.removeClass(this.panel.element, 'p-input-overlay-hidden');
      }, 150);
    }
  }

  alignPanel() {
    if (this.props.appendTo) {
      this.panel.element.style.minWidth = _DomHandler.default.getWidth(this.container) + 'px';

      _DomHandler.default.absolutePosition(this.panel.element, this.container, this.props.container);
    } else {
      _DomHandler.default.relativePosition(this.panel.element, this.container, this.props.container);
    }
  }

  bindDocumentClickListener() {
    if (!this.documentClickListener) {
      this.documentClickListener = () => {
        if (!this.selfClick && !this.overlayClick) {
          this.hide();
        }

        this.clearClickState();
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

  clearClickState() {
    this.selfClick = false;
    this.editableInputClick = false;
    this.overlayClick = false;
  }

  updateEditableLabel(option) {
    if (this.editableInput) {
      this.editableInput.value = option ? this.getOptionLabel(option) : this.props.value || '';
    }
  }

  filter(option) {
    let filterValue = this.state.filter.trim().toLowerCase();
    let optionLabel = this.getOptionLabel(option);
    return optionLabel.toLowerCase().indexOf(filterValue.toLowerCase()) > -1;
  }

  hasFilter() {
    return this.state.filter && this.state.filter.trim().length > 0;
  }

  renderHiddenSelect(selectedOption) {
    let placeHolderOption = _react.default.createElement("option", {
      value: ""
    }, this.props.placeholder);

    let option = selectedOption ? _react.default.createElement("option", {
      value: selectedOption.value
    }, this.getOptionLabel(selectedOption)) : null;
    return _react.default.createElement("div", {
      className: "p-hidden-accessible p-dropdown-hidden-select"
    }, _react.default.createElement("select", {
      ref: el => this.nativeSelect = el,
      required: this.props.required,
      name: this.props.name,
      tabIndex: "-1",
      "aria-hidden": "true"
    }, placeHolderOption, option));
  }

  renderKeyboardHelper() {
    return _react.default.createElement("div", {
      className: "p-hidden-accessible"
    }, _react.default.createElement("input", {
      ref: el => this.focusInput = el,
      id: this.props.inputId,
      type: "text",
      role: "listbox",
      readOnly: true,
      onFocus: this.onInputFocus,
      onBlur: this.onInputBlur,
      onKeyDown: this.onInputKeyDown,
      disabled: this.props.disabled,
      tabIndex: this.props.tabIndex,
      "aria-label": this.props.ariaLabel,
      "aria-labelledby": this.props.ariaLabelledBy
    }));
  }

  renderLabel(label) {
    if (this.props.editable) {
      let value = label || this.props.value || '';
      return _react.default.createElement("input", {
        ref: el => this.editableInput = el,
        type: "text",
        defaultValue: value,
        className: "p-dropdown-label p-inputtext",
        disabled: this.props.disabled,
        placeholder: this.props.placeholder,
        maxLength: this.props.maxLength,
        onClick: this.onEditableInputClick,
        onInput: this.onEditableInputChange,
        onFocus: this.onEditableInputFocus,
        onBlur: this.onInputBlur,
        "aria-label": this.props.ariaLabel,
        "aria-labelledby": this.props.ariaLabelledBy
      });
    } else {
      let className = (0, _classnames.default)('p-dropdown-label p-inputtext', {
        'p-placeholder': label === null && this.props.placeholder,
        'p-dropdown-label-empty': label === null && !this.props.placeholder
      });
      return _react.default.createElement("label", {
        className: className
      }, label || this.props.placeholder || 'empty');
    }
  }

  renderClearIcon() {
    if (this.props.value != null && this.props.showClear && !this.props.disabled) {
      return _react.default.createElement("i", {
        className: "p-dropdown-clear-icon pi pi-times",
        onClick: this.clear
      });
    } else {
      return null;
    }
  }

  renderDropdownIcon() {
    return _react.default.createElement("div", {
      className: "p-dropdown-trigger"
    }, _react.default.createElement("span", {
      className: "p-dropdown-trigger-icon pi pi-chevron-down p-clickable"
    }));
  }

  renderItems(selectedOption) {
    let items = this.props.options;

    if (items && this.hasFilter()) {
      items = items && items.filter(option => {
        return this.filter(option);
      });
    }

    if (items) {
      return items.map(option => {
        let optionLabel = this.getOptionLabel(option);
        return _react.default.createElement(_DropdownItem.DropdownItem, {
          key: this.getOptionKey(option),
          label: optionLabel,
          option: option,
          template: this.props.itemTemplate,
          selected: selectedOption === option,
          disabled: option.disabled,
          onClick: this.onOptionClick
        });
      });
    } else {
      return null;
    }
  }

  renderFilter() {
    if (this.props.filter) {
      return _react.default.createElement("div", {
        className: "p-dropdown-filter-container"
      }, _react.default.createElement("input", {
        ref: el => this.filterInput = el,
        type: "text",
        autoComplete: "off",
        className: "p-dropdown-filter p-inputtext p-component",
        placeholder: this.props.filterPlaceholder,
        onKeyDown: this.onFilterInputKeyDown,
        onChange: this.onFilterInputChange
      }), _react.default.createElement("span", {
        className: "p-dropdown-filter-icon pi pi-search"
      }));
    } else {
      return null;
    }
  }

  getOptionLabel(option) {
    return this.props.optionLabel ? _ObjectUtils.default.resolveFieldData(option, this.props.optionLabel) : option.label;
  }

  getOptionKey(option) {
    return this.props.dataKey ? _ObjectUtils.default.resolveFieldData(option, this.props.dataKey) : this.getOptionLabel(option);
  }

  checkValidity() {
    return this.nativeSelect.checkValidity;
  }

  componentDidMount() {
    if (this.props.autoFocus && this.focusInput) {
      this.focusInput.focus();
    }

    if (this.props.tooltip) {
      this.renderTooltip();
    }

    this.nativeSelect.selectedIndex = 1;
  }

  componentWillUnmount() {
    this.unbindDocumentClickListener();

    if (this.tooltip) {
      this.tooltip.destroy();
      this.tooltip = null;
    }

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.filter) {
      this.alignPanel();
    }

    if (this.panel.element.offsetParent) {
      let highlightItem = _DomHandler.default.findSingle(this.panel.element, 'li.p-highlight');

      if (highlightItem) {
        _DomHandler.default.scrollInView(this.panel.itemsWrapper, highlightItem);
      }
    }

    if (prevProps.tooltip !== this.props.tooltip) {
      if (this.tooltip) this.tooltip.updateContent(this.props.tooltip);else this.renderTooltip();
    }

    this.nativeSelect.selectedIndex = 1;
  }

  renderTooltip() {
    this.tooltip = new _Tooltip.default({
      target: this.container,
      content: this.props.tooltip,
      options: this.props.tooltipOptions
    });
  }

  render() {
    let className = (0, _classnames.default)('p-dropdown p-component', this.props.className, {
      'p-disabled': this.props.disabled,
      'p-dropdown-clearable': this.props.showClear && !this.props.disabled
    });
    let selectedOption = this.findOption(this.props.value);
    let label = selectedOption ? this.getOptionLabel(selectedOption) : null;
    let hiddenSelect = this.renderHiddenSelect(selectedOption);
    let keyboardHelper = this.renderKeyboardHelper();
    let labelElement = this.renderLabel(label);
    let dropdownIcon = this.renderDropdownIcon();
    let items = this.renderItems(selectedOption);
    let filterElement = this.renderFilter();
    let clearIcon = this.renderClearIcon();

    if (this.props.editable && this.editableInput) {
      let value = label || this.props.value || '';
      this.editableInput.value = value;
    }

    return _react.default.createElement("div", {
      id: this.props.id,
      ref: el => this.container = el,
      className: className,
      style: this.props.style,
      onClick: this.onClick,
      onMouseDown: this.props.onMouseDown,
      onContextMenu: this.props.onContextMenu
    }, keyboardHelper, hiddenSelect, labelElement, clearIcon, dropdownIcon, _react.default.createElement(_DropdownPanel.DropdownPanel, {
      ref: el => this.panel = el,
      appendTo: this.props.appendTo,
      panelStyle: this.props.panelStyle,
      panelClassName: this.props.panelClassName,
      scrollHeight: this.props.scrollHeight,
      onClick: this.panelClick,
      filter: filterElement
    }, items));
  }

}

exports.Dropdown = Dropdown;

_defineProperty(Dropdown, "defaultProps", {
  id: null,
  name: null,
  value: null,
  options: null,
  optionLabel: null,
  itemTemplate: null,
  style: null,
  className: null,
  scrollHeight: '200px',
  filter: false,
  filterPlaceholder: null,
  editable: false,
  placeholder: null,
  required: false,
  disabled: false,
  appendTo: null,
  tabIndex: null,
  autoFocus: false,
  filterInputAutoFocus: true,
  panelClassName: null,
  panelStyle: null,
  dataKey: null,
  inputId: null,
  showClear: false,
  maxLength: null,
  tooltip: null,
  tooltipOptions: null,
  ariaLabel: null,
  ariaLabelledBy: null,
  onChange: null,
  onMouseDown: null,
  onContextMenu: null
});

_defineProperty(Dropdown, "propTypes", {
  id: _propTypes.default.string,
  name: _propTypes.default.string,
  value: _propTypes.default.any,
  options: _propTypes.default.array,
  optionLabel: _propTypes.default.string,
  itemTemplate: _propTypes.default.func,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  scrollHeight: _propTypes.default.string,
  filter: _propTypes.default.bool,
  filterPlaceholder: _propTypes.default.string,
  editable: _propTypes.default.bool,
  placeholder: _propTypes.default.string,
  required: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  appendTo: _propTypes.default.any,
  tabIndex: _propTypes.default.number,
  autoFocus: _propTypes.default.bool,
  filterInputAutoFocus: _propTypes.default.bool,
  lazy: _propTypes.default.bool,
  panelClassName: _propTypes.default.string,
  panelstyle: _propTypes.default.object,
  dataKey: _propTypes.default.string,
  inputId: _propTypes.default.string,
  showClear: _propTypes.default.bool,
  maxLength: _propTypes.default.number,
  tooltip: _propTypes.default.string,
  tooltipOptions: _propTypes.default.object,
  ariaLabel: _propTypes.default.string,
  ariaLabelledBy: _propTypes.default.string,
  onChange: _propTypes.default.func,
  onMouseDown: _propTypes.default.func,
  onContextMenu: _propTypes.default.func
});