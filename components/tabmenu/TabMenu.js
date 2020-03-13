"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabMenu = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TabMenu extends _react.Component {
  constructor(props) {
    super(props);

    if (!this.props.onTabChange) {
      this.state = {
        activeItem: props.activeItem
      };
    }
  }

  itemClick(event, item) {
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    if (!item.url) {
      event.preventDefault();
    }

    if (item.command) {
      item.command({
        originalEvent: event,
        item: item
      });
    }

    if (this.props.onTabChange) {
      this.props.onTabChange({
        originalEvent: event,
        value: item
      });
    } else {
      this.setState({
        activeItem: item
      });
    }
  }

  renderMenuItem(item, index) {
    const activeItem = this.props.onTabChange ? this.props.activeItem : this.state.activeItem;
    const className = (0, _classnames.default)('p-tabmenuitem', item.className, {
      'p-highlight': activeItem ? activeItem === item : index === 0,
      'p-disabled': item.disabled
    });
    const iconClassName = (0, _classnames.default)(item.icon, 'p-menuitem-icon');
    const icon = item.icon ? _react.default.createElement("span", {
      className: iconClassName
    }) : null;
    return _react.default.createElement("li", {
      key: item.label + '_' + index,
      className: className,
      style: item.style
    }, _react.default.createElement("a", {
      href: item.url || '#',
      className: "p-menuitem-link",
      target: item.target,
      onClick: event => this.itemClick(event, item)
    }, icon, _react.default.createElement("span", {
      className: "p-menuitem-text"
    }, item.label)));
  }

  renderItems() {
    return this.props.model.map((item, index) => {
      return this.renderMenuItem(item, index);
    });
  }

  render() {
    if (this.props.model) {
      const className = (0, _classnames.default)('p-tabmenu p-component', this.props.className);
      const items = this.renderItems();
      return _react.default.createElement("div", {
        id: this.props.id,
        className: className,
        style: this.props.style
      }, _react.default.createElement("ul", {
        className: "p-tabmenu-nav p-reset",
        role: "tablist"
      }, items));
    } else {
      return null;
    }
  }

}

exports.TabMenu = TabMenu;

_defineProperty(TabMenu, "defaultProps", {
  id: null,
  model: null,
  activeItem: null,
  style: null,
  className: null,
  onTabChange: null
});

_defineProperty(TabMenu, "propTypes", {
  id: _propTypes.default.string,
  model: _propTypes.default.array,
  activeItem: _propTypes.default.any,
  style: _propTypes.default.any,
  className: _propTypes.default.string,
  onTabChange: _propTypes.default.func
});