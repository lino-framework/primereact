"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PickListItem = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class PickListItem extends _react.Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onClick(event) {
    if (this.props.onClick) {
      this.props.onClick({
        originalEvent: event,
        value: this.props.value
      });
    }
  }

  onKeyDown(event) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown({
        originalEvent: event,
        value: this.props.value
      });
    }
  }

  render() {
    let content = this.props.template ? this.props.template(this.props.value) : this.props.value;
    let className = (0, _classnames.default)('p-picklist-item', this.props.className, {
      'p-highlight': this.props.selected
    });
    return _react.default.createElement("li", {
      className: className,
      onClick: this.onClick,
      onKeyDown: this.onKeyDown,
      tabIndex: this.props.tabIndex
    }, content);
  }

}

exports.PickListItem = PickListItem;

_defineProperty(PickListItem, "defaultProps", {
  value: null,
  className: null,
  template: null,
  selected: false,
  tabIndex: null,
  onClick: null,
  onKeyDown: null
});

_defineProperty(PickListItem, "propTypes", {
  value: _propTypes.default.any,
  className: _propTypes.default.string,
  template: _propTypes.default.func,
  selected: _propTypes.default.bool,
  tabIndex: _propTypes.default.string,
  onClick: _propTypes.default.func,
  onKeyDown: _propTypes.default.func
});