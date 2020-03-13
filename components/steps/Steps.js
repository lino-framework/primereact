"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Steps = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Steps extends _react.Component {
  itemClick(event, item, index) {
    if (this.props.readOnly || item.disabled) {
      event.preventDefault();
      return;
    }

    if (this.props.onSelect) {
      this.props.onSelect({
        originalEvent: event,
        item: item,
        index: index
      });
    }

    if (!item.url) {
      event.preventDefault();
    }

    if (item.command) {
      item.command({
        originalEvent: event,
        item: item,
        index: index
      });
    }
  }

  renderItem(item, index) {
    const className = (0, _classnames.default)('p-steps-item', item.className, {
      'p-highlight p-steps-current': index === this.props.activeIndex,
      'p-state-default': index !== this.props.activeIndex,
      'p-disabled': item.disabled || index !== this.props.activeIndex && this.props.readOnly
    });
    return _react.default.createElement("li", {
      key: item.label + '_' + index,
      className: className,
      style: item.style
    }, _react.default.createElement("a", {
      href: item.url || '#',
      className: "p-menuitem-link",
      target: item.target,
      onClick: event => this.itemClick(event, item, index)
    }, _react.default.createElement("span", {
      className: "p-steps-number"
    }, index + 1), _react.default.createElement("span", {
      className: "p-steps-title"
    }, item.label)));
  }

  renderItems() {
    if (this.props.model) {
      const items = this.props.model.map((item, index) => {
        return this.renderItem(item, index);
      });
      return _react.default.createElement("ul", {
        role: "tablist"
      }, items);
    } else {
      return null;
    }
  }

  render() {
    const className = (0, _classnames.default)('p-steps p-component', this.props.className, {
      'p-steps-readonly': this.props.readonly
    });
    const items = this.renderItems();
    return _react.default.createElement("div", {
      id: this.props.id,
      className: className,
      style: this.props.style
    }, items);
  }

}

exports.Steps = Steps;

_defineProperty(Steps, "defaultProps", {
  id: null,
  model: null,
  activeIndex: 0,
  readOnly: true,
  style: null,
  className: null,
  onSelect: null
});

_defineProperty(Steps, "propTypes", {
  id: _propTypes.default.string,
  model: _propTypes.default.array.isRequired,
  activeIndex: _propTypes.default.number,
  readOnly: _propTypes.default.bool,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  onSelect: _propTypes.default.func
});