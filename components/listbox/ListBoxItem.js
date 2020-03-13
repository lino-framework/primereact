"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListBoxItem = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ListBoxItem extends _react.Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onClick(event) {
    if (this.props.onClick) {
      this.props.onClick({
        originalEvent: event,
        option: this.props.option
      });
    }

    event.preventDefault();
  }

  onTouchEnd(event) {
    if (this.props.onTouchEnd) {
      this.props.onTouchEnd({
        originalEvent: event,
        option: this.props.option
      });
    }
  }

  onKeyDown(event) {
    let item = event.currentTarget;

    switch (event.which) {
      //down
      case 40:
        var nextItem = this.findNextItem(item);

        if (nextItem) {
          nextItem.focus();
        }

        event.preventDefault();
        break;
      //up

      case 38:
        var prevItem = this.findPrevItem(item);

        if (prevItem) {
          prevItem.focus();
        }

        event.preventDefault();
        break;
      //enter

      case 13:
        this.onClick(event);
        event.preventDefault();
        break;

      default:
        break;
    }
  }

  findNextItem(item) {
    let nextItem = item.nextElementSibling;
    if (nextItem) return _DomHandler.default.hasClass(nextItem, 'p-disabled') ? this.findNextItem(nextItem) : nextItem;else return null;
  }

  findPrevItem(item) {
    let prevItem = item.previousElementSibling;
    if (prevItem) return _DomHandler.default.hasClass(prevItem, 'p-disabled') ? this.findPrevItem(prevItem) : prevItem;else return null;
  }

  render() {
    let className = (0, _classnames.default)('p-listbox-item', {
      'p-highlight': this.props.selected
    });
    let content = this.props.template ? this.props.template(this.props.option) : this.props.label;
    return _react.default.createElement("li", {
      className: className,
      onClick: this.onClick,
      onTouchEnd: this.onTouchEnd,
      onKeyDown: this.onKeyDown,
      tabIndex: this.props.tabIndex
    }, content);
  }

}

exports.ListBoxItem = ListBoxItem;

_defineProperty(ListBoxItem, "defaultProps", {
  option: null,
  label: null,
  selected: false,
  tabIndex: null,
  onClick: null,
  onTouchEnd: null,
  template: null
});

_defineProperty(ListBoxItem, "propTypes", {
  option: _propTypes.default.any,
  label: _propTypes.default.string,
  selected: _propTypes.default.bool,
  tabIndex: _propTypes.default.string,
  onClick: _propTypes.default.func,
  onTouchEnd: _propTypes.default.func,
  template: _propTypes.default.func
});