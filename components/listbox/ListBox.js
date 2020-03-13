"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListBox = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _ObjectUtils = _interopRequireDefault(require("../utils/ObjectUtils"));

var _ListBoxItem = require("./ListBoxItem");

var _ListBoxHeader = require("./ListBoxHeader");

var _Tooltip = _interopRequireDefault(require("../tooltip/Tooltip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ListBox extends _react.Component {
  constructor() {
    super();
    this.state = {
      filter: ''
    };
    this.onFilter = this.onFilter.bind(this);
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

    if (this.props.multiple) this.onOptionClickMultiple(event.originalEvent, event.option);else this.onOptionClickSingle(event.originalEvent, event.option);
    this.optionTouched = false;
  }

  onOptionTouchEnd(event, option) {
    if (this.props.disabled) {
      return;
    }

    this.optionTouched = true;
  }

  onOptionClickSingle(event, option) {
    let selected = this.isSelected(option);
    let valueChanged = false;
    let value = null;
    let metaSelection = this.optionTouched ? false : this.props.metaKeySelection;

    if (metaSelection) {
      let metaKey = event.metaKey || event.ctrlKey;

      if (selected) {
        if (metaKey) {
          value = null;
          valueChanged = true;
        }
      } else {
        value = this.getOptionValue(option);
        valueChanged = true;
      }
    } else {
      value = selected ? null : this.getOptionValue(option);
      valueChanged = true;
    }

    if (valueChanged) {
      this.updateModel(event, value);
    }
  }

  onOptionClickMultiple(event, option) {
    let selected = this.isSelected(option);
    let valueChanged = false;
    let value = null;
    let metaSelection = this.optionTouched ? false : this.props.metaKeySelection;

    if (metaSelection) {
      let metaKey = event.metaKey || event.ctrlKey;

      if (selected) {
        if (metaKey) value = this.removeOption(option);else value = [this.getOptionValue(option)];
        valueChanged = true;
      } else {
        value = metaKey ? this.props.value || [] : [];
        value = [...value, this.getOptionValue(option)];
        valueChanged = true;
      }
    } else {
      if (selected) value = this.removeOption(option);else value = [...(this.props.value || []), this.getOptionValue(option)];
      valueChanged = true;
    }

    if (valueChanged) {
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

  removeOption(option) {
    return this.props.value.filter(val => !_ObjectUtils.default.equals(val, this.getOptionValue(option), this.props.dataKey));
  }

  isSelected(option) {
    let selected = false;
    let optionValue = this.getOptionValue(option);

    if (this.props.multiple) {
      if (this.props.value) {
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

  filter(option) {
    let filterValue = this.state.filter.trim().toLowerCase();
    let optionLabel = this.getOptionLabel(option);
    return optionLabel.toLowerCase().indexOf(filterValue.toLowerCase()) > -1;
  }

  hasFilter() {
    return this.state.filter && this.state.filter.trim().length > 0;
  }

  getOptionValue(option) {
    return this.props.optionLabel ? option : option.value;
  }

  getOptionLabel(option) {
    return this.props.optionLabel ? _ObjectUtils.default.resolveFieldData(option, this.props.optionLabel) : option.label;
  }

  render() {
    let className = (0, _classnames.default)('p-listbox p-inputtext p-component', this.props.className, {
      'p-disabled': this.props.disabled
    });
    let items = this.props.options;
    let header;

    if (this.props.options) {
      if (this.hasFilter()) {
        items = items.filter(option => {
          return this.filter(option);
        });
      }

      items = items.map((option, index) => {
        let optionLabel = this.getOptionLabel(option);
        return _react.default.createElement(_ListBoxItem.ListBoxItem, {
          key: optionLabel,
          label: optionLabel,
          option: option,
          template: this.props.itemTemplate,
          selected: this.isSelected(option),
          onClick: this.onOptionClick,
          onTouchEnd: e => this.onOptionTouchEnd(e, option, index),
          tabIndex: this.props.tabIndex
        });
      });
    }

    if (this.props.filter) {
      header = _react.default.createElement(_ListBoxHeader.ListBoxHeader, {
        filter: this.state.filter,
        onFilter: this.onFilter,
        disabled: this.props.disabled
      });
    }

    return _react.default.createElement("div", {
      ref: el => this.element = el,
      id: this.props.id,
      className: className,
      style: this.props.style
    }, header, _react.default.createElement("div", {
      className: "p-listbox-list-wrapper"
    }, _react.default.createElement("ul", {
      className: "p-listbox-list",
      style: this.props.listStyle
    }, items)));
  }

}

exports.ListBox = ListBox;

_defineProperty(ListBox, "defaultProps", {
  id: null,
  value: null,
  options: null,
  optionLabel: null,
  itemTemplate: null,
  style: null,
  listStyle: null,
  className: null,
  disabled: null,
  dataKey: null,
  multiple: false,
  metaKeySelection: false,
  filter: false,
  tabIndex: '0',
  tooltip: null,
  tooltipOptions: null,
  onChange: null
});

_defineProperty(ListBox, "propTypes", {
  id: _propTypes.default.string,
  value: _propTypes.default.any,
  options: _propTypes.default.array,
  optionLabel: _propTypes.default.string,
  itemTemplate: _propTypes.default.func,
  style: _propTypes.default.object,
  listStyle: _propTypes.default.object,
  className: _propTypes.default.string,
  dataKey: _propTypes.default.string,
  multiple: _propTypes.default.bool,
  metaKeySelection: _propTypes.default.bool,
  filter: _propTypes.default.bool,
  tabIndex: _propTypes.default.string,
  tooltip: _propTypes.default.string,
  tooltipOptions: _propTypes.default.object,
  onChange: _propTypes.default.func
});