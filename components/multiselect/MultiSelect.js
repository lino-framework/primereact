"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MultiSelect = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

var _ObjectUtils = _interopRequireDefault(require("../utils/ObjectUtils"));

var _classnames = _interopRequireDefault(require("classnames"));

var _MultiSelectPanel = require("./MultiSelectPanel");

var _MultiSelectItem = require("./MultiSelectItem");

var _MultiSelectHeader = require("./MultiSelectHeader");

var _Tooltip = _interopRequireDefault(require("../tooltip/Tooltip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MultiSelect extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: ''
    };
    this.onClick = this.onClick.bind(this);
    this.onPanelClick = this.onPanelClick.bind(this);
    this.onOptionClick = this.onOptionClick.bind(this);
    this.onOptionKeyDown = this.onOptionKeyDown.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
    this.onToggleAll = this.onToggleAll.bind(this);
  }

  onOptionClick(event) {
    let optionValue = this.getOptionValue(event.option);
    let selectionIndex = this.findSelectionIndex(optionValue);
    let newValue;
    if (selectionIndex !== -1) newValue = this.props.value.filter((val, i) => i !== selectionIndex);else newValue = [...(this.props.value || []), optionValue];
    this.updateModel(event.originalEvent, newValue);
  }

  onOptionKeyDown(event) {
    let listItem = event.originalEvent.currentTarget;

    switch (event.originalEvent.which) {
      //down
      case 40:
        var nextItem = this.findNextItem(listItem);

        if (nextItem) {
          nextItem.focus();
        }

        event.originalEvent.preventDefault();
        break;
      //up

      case 38:
        var prevItem = this.findPrevItem(listItem);

        if (prevItem) {
          prevItem.focus();
        }

        event.originalEvent.preventDefault();
        break;
      //enter

      case 13:
        this.onOptionClick(event);
        event.originalEvent.preventDefault();
        break;

      default:
        break;
    }
  }

  findNextItem(item) {
    let nextItem = item.nextElementSibling;
    if (nextItem) return !_DomHandler.default.hasClass(nextItem, 'p-multiselect-item') ? this.findNextItem(nextItem) : nextItem;else return null;
  }

  findPrevItem(item) {
    let prevItem = item.previousElementSibling;
    if (prevItem) return !_DomHandler.default.hasClass(prevItem, 'p-multiselect-item') ? this.findPrevItem(prevItem) : prevItem;else return null;
  }

  onClick() {
    if (this.props.disabled) {
      return;
    }

    if (this.documentClickListener) {
      this.selfClick = true;
    }

    if (!this.panelClick) {
      if (this.panel.element.offsetParent) {
        this.hide();
      } else {
        this.focusInput.focus();
        this.show();
      }
    }
  }

  onToggleAll(event) {
    let newValue;

    if (event.checked) {
      newValue = [];
    } else {
      let options = this.hasFilter() ? this.filterOptions(this.props.options) : this.props.options;

      if (options) {
        newValue = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            let option = _step.value;
            newValue.push(this.getOptionValue(option));
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
    }

    this.updateModel(event.originalEvent, newValue);
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

  onFilter(event) {
    this.setState({
      filter: event.query
    });
  }

  onPanelClick() {
    this.panelClick = true;
  }

  show() {
    if (this.props.options && this.props.options.length) {
      this.panel.element.style.zIndex = String(_DomHandler.default.generateZIndex());
      this.panel.element.style.display = 'block';
      setTimeout(() => {
        _DomHandler.default.addClass(this.panel.element, 'p-input-overlay-visible');

        _DomHandler.default.removeClass(this.panel.element, 'p-input-overlay-hidden');
      }, 1);
      this.alignPanel();
      this.bindDocumentClickListener();
    }
  }

  hide() {
    _DomHandler.default.addClass(this.panel.element, 'p-input-overlay-hidden');

    _DomHandler.default.removeClass(this.panel.element, 'p-input-overlay-visible');

    this.unbindDocumentClickListener();
    this.clearClickState();
    setTimeout(() => {
      this.panel.element.style.display = 'none';

      _DomHandler.default.removeClass(this.panel.element, 'p-input-overlay-hidden');
    }, 150);
  }

  alignPanel() {
    if (this.props.appendTo) {
      this.panel.element.style.minWidth = _DomHandler.default.getWidth(this.container) + 'px';

      _DomHandler.default.absolutePosition(this.panel.element, this.container);
    } else {
      _DomHandler.default.relativePosition(this.panel.element, this.container);
    }
  }

  onCloseClick(event) {
    this.hide();
    event.preventDefault();
    event.stopPropagation();
  }

  findSelectionIndex(value) {
    let index = -1;

    if (this.props.value) {
      for (let i = 0; i < this.props.value.length; i++) {
        if (_ObjectUtils.default.equals(this.props.value[i], value, this.props.dataKey)) {
          index = i;
          break;
        }
      }
    }

    return index;
  }

  isSelected(option) {
    return this.findSelectionIndex(this.getOptionValue(option)) !== -1;
  }

  findLabelByValue(val) {
    let label = null;

    for (let i = 0; i < this.props.options.length; i++) {
      let option = this.props.options[i];
      let optionValue = this.getOptionValue(option);

      if (_ObjectUtils.default.equals(optionValue, val)) {
        label = this.getOptionLabel(option);
        break;
      }
    }

    return label;
  }

  onFocus(event) {
    _DomHandler.default.addClass(this.container, 'p-focus');

    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  }

  onBlur(event) {
    _DomHandler.default.removeClass(this.container, 'p-focus');

    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  }

  bindDocumentClickListener() {
    if (!this.documentClickListener) {
      this.documentClickListener = this.onDocumentClick.bind(this);
      document.addEventListener('click', this.documentClickListener);
    }
  }

  unbindDocumentClickListener() {
    if (this.documentClickListener) {
      document.removeEventListener('click', this.documentClickListener);
      this.documentClickListener = null;
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
    this.unbindDocumentClickListener();

    if (this.tooltip) {
      this.tooltip.destroy();
      this.tooltip = null;
    }
  }

  onDocumentClick() {
    if (!this.selfClick && !this.panelClick && this.panel.element.offsetParent) {
      this.hide();
    }

    this.clearClickState();
  }

  clearClickState() {
    this.selfClick = false;
    this.panelClick = false;
  }

  filterOption(option) {
    let filterValue = this.state.filter.trim().toLowerCase();
    let optionLabel = this.getOptionLabel(option);
    return optionLabel.toLowerCase().indexOf(filterValue.toLowerCase()) > -1;
  }

  hasFilter() {
    return this.state.filter && this.state.filter.trim().length > 0;
  }

  isAllChecked(visibleOptions) {
    if (this.hasFilter()) return this.props.value && visibleOptions && visibleOptions.length && this.props.value.length === visibleOptions.length;else return this.props.value && this.props.options && this.props.value.length === this.props.options.length;
  }

  filterOptions(options) {
    return options.filter(option => {
      return this.filterOption(option);
    });
  }

  getOptionValue(option) {
    return this.props.optionLabel ? option : option.value;
  }

  getOptionLabel(option) {
    return this.props.optionLabel ? _ObjectUtils.default.resolveFieldData(option, this.props.optionLabel) : option.label;
  }

  isEmpty() {
    return !this.props.value || this.props.value.length === 0;
  }

  getSelectedItemsLabel() {
    let pattern = /{(.*?)}/;

    if (pattern.test(this.props.selectedItemsLabel)) {
      return this.props.selectedItemsLabel.replace(this.props.selectedItemsLabel.match(pattern)[0], this.props.value.length + '');
    }

    return this.props.selectedItemsLabel;
  }

  getLabel() {
    let label;

    if (!this.isEmpty() && !this.props.fixedPlaceholder) {
      label = '';

      for (let i = 0; i < this.props.value.length; i++) {
        if (i !== 0) {
          label += ',';
        }

        label += this.findLabelByValue(this.props.value[i]);
      }

      if (this.props.value.length <= this.props.maxSelectedLabels) {
        return label;
      } else {
        return this.getSelectedItemsLabel();
      }
    }

    return label;
  }

  getLabelContent() {
    if (this.props.selectedItemTemplate) {
      if (!this.isEmpty()) {
        if (this.props.value.length <= this.props.maxSelectedLabels) {
          return this.props.value.map((val, index) => {
            return _react.default.createElement(_react.default.Fragment, {
              key: index
            }, this.props.selectedItemTemplate(val));
          });
        } else {
          return this.getSelectedItemsLabel();
        }
      } else {
        return this.props.selectedItemTemplate();
      }
    } else {
      return this.getLabel();
    }
  }

  renderTooltip() {
    this.tooltip = new _Tooltip.default({
      target: this.container,
      content: this.props.tooltip,
      options: this.props.tooltipOptions
    });
  }

  renderHeader(items) {
    return _react.default.createElement(_MultiSelectHeader.MultiSelectHeader, {
      filter: this.props.filter,
      filterValue: this.state.filter,
      onFilter: this.onFilter,
      onClose: this.onCloseClick,
      onToggleAll: this.onToggleAll,
      allChecked: this.isAllChecked(items)
    });
  }

  renderLabel() {
    const empty = this.isEmpty();
    const content = this.getLabelContent();
    const className = (0, _classnames.default)('p-multiselect-label', {
      'p-placeholder': empty && this.props.placeholder,
      'p-multiselect-label-empty': empty && !this.props.placeholder && !this.props.selectedItemTemplate
    });
    return _react.default.createElement("div", {
      className: "p-multiselect-label-container"
    }, _react.default.createElement("label", {
      className: className
    }, content || this.props.placeholder || 'empty'));
  }

  render() {
    let className = (0, _classnames.default)('p-multiselect p-component', this.props.className, {
      'p-disabled': this.props.disabled
    });
    let label = this.renderLabel();
    let items = this.props.options;

    if (items) {
      if (this.hasFilter()) {
        items = this.filterOptions(items);
      }

      items = items.map((option, index) => {
        let optionLabel = this.getOptionLabel(option);
        return _react.default.createElement(_MultiSelectItem.MultiSelectItem, {
          key: optionLabel + '_' + index,
          label: optionLabel,
          option: option,
          template: this.props.itemTemplate,
          selected: this.isSelected(option),
          onClick: this.onOptionClick,
          onKeyDown: this.onOptionKeyDown,
          tabIndex: this.props.tabIndex
        });
      });
    }

    let header = this.renderHeader(items);
    return _react.default.createElement("div", {
      id: this.props.id,
      className: className,
      onClick: this.onClick,
      ref: el => this.container = el,
      style: this.props.style
    }, _react.default.createElement("div", {
      className: "p-hidden-accessible"
    }, _react.default.createElement("input", {
      readOnly: true,
      type: "text",
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      ref: el => this.focusInput = el
    })), label, _react.default.createElement("div", {
      className: "p-multiselect-trigger"
    }, _react.default.createElement("span", {
      className: "p-multiselect-trigger-icon pi pi-chevron-down p-c"
    })), _react.default.createElement(_MultiSelectPanel.MultiSelectPanel, {
      ref: el => this.panel = el,
      header: header,
      appendTo: this.props.appendTo,
      onClick: this.onPanelClick,
      scrollHeight: this.props.scrollHeight
    }, items));
  }

}

exports.MultiSelect = MultiSelect;

_defineProperty(MultiSelect, "defaultProps", {
  id: null,
  value: null,
  options: null,
  optionLabel: null,
  style: null,
  className: null,
  scrollHeight: '200px',
  placeholder: null,
  fixedPlaceholder: false,
  disabled: false,
  filter: false,
  tabIndex: '0',
  dataKey: null,
  appendTo: null,
  tooltip: null,
  tooltipOptions: null,
  maxSelectedLabels: 3,
  selectedItemsLabel: '{0} items selected',
  itemTemplate: null,
  selectedItemTemplate: null,
  onChange: null,
  onFocus: null,
  onBlur: null
});

_defineProperty(MultiSelect, "propTypes", {
  id: _propTypes.default.string,
  value: _propTypes.default.any,
  options: _propTypes.default.array,
  optionLabel: _propTypes.default.string,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  scrollHeight: _propTypes.default.string,
  placeholder: _propTypes.default.string,
  fixedPlaceholder: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  filter: _propTypes.default.bool,
  tabIndex: _propTypes.default.string,
  dataKey: _propTypes.default.string,
  appendTo: _propTypes.default.object,
  tooltip: _propTypes.default.string,
  tooltipOptions: _propTypes.default.object,
  maxSelectedLabels: _propTypes.default.number,
  selectedItemsLabel: _propTypes.default.string,
  itemTemplate: _propTypes.default.func,
  selectedItemTemplate: _propTypes.default.func,
  onChange: _propTypes.default.func,
  onFocus: _propTypes.default.func,
  onBlur: _propTypes.default.func
});