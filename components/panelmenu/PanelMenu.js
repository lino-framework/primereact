"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PanelMenu = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _reactTransitionGroup = require("react-transition-group");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class PanelMenuSub extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: null
    };
  }

  onItemClick(event, item) {
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

    if (this.state.activeItem && this.state.activeItem === item) {
      this.setState({
        activeItem: null
      });
    } else {
      this.setState({
        activeItem: item
      });
    }
  }

  renderSeparator(index) {
    return _react.default.createElement("li", {
      key: 'separator_' + index,
      className: "p-menu-separator"
    });
  }

  renderIcon(item) {
    const className = (0, _classnames.default)('p-menuitem-icon', item.icon);

    if (item.icon) {
      return _react.default.createElement("span", {
        className: className
      });
    } else {
      return null;
    }
  }

  renderSubmenuIcon(item, active) {
    const className = (0, _classnames.default)('p-panelmenu-icon pi pi-fw', {
      'pi-caret-right': !active,
      'pi-caret-down': active
    });

    if (item.items) {
      return _react.default.createElement("span", {
        className: className
      });
    } else {
      return null;
    }
  }

  renderSubmenu(item, active) {
    const submenuWrapperClassName = (0, _classnames.default)('p-toggleable-content', {
      'p-toggleable-content-collapsed': !active
    });

    if (item.items) {
      return _react.default.createElement(_reactTransitionGroup.CSSTransition, {
        classNames: "p-toggleable-content",
        timeout: {
          enter: 400,
          exit: 250
        },
        in: active
      }, _react.default.createElement("div", {
        className: submenuWrapperClassName
      }, _react.default.createElement(PanelMenuSub, {
        model: item.items
      })));
    } else {
      return null;
    }
  }

  renderMenuitem(item, index) {
    const active = this.state.activeItem === item;
    const className = (0, _classnames.default)('p-menuitem', item.className, {
      'p-disabled': item.disabled
    });
    const icon = this.renderIcon(item, active);
    const submenuIcon = this.renderSubmenuIcon(item, active);
    const submenu = this.renderSubmenu(item, active);
    return _react.default.createElement("li", {
      key: item.label + '_' + index,
      className: className,
      style: item.style
    }, _react.default.createElement("a", {
      href: item.url || '#',
      className: "p-menuitem-link",
      target: item.target,
      onClick: event => this.onItemClick(event, item, index)
    }, submenuIcon, icon, _react.default.createElement("span", {
      className: "p-menuitem-text"
    }, item.label)), submenu);
  }

  renderItem(item, index) {
    if (item.separator) return this.renderSeparator(index);else return this.renderMenuitem(item, index);
  }

  renderMenu() {
    if (this.props.model) {
      return this.props.model.map((item, index) => {
        return this.renderItem(item, index);
      });
    } else {
      return null;
    }
  }

  render() {
    const className = (0, _classnames.default)('p-submenu-list', this.props.className);
    const menu = this.renderMenu();
    return _react.default.createElement("ul", {
      className: className
    }, menu);
  }

}

_defineProperty(PanelMenuSub, "defaultProps", {
  model: null
});

_defineProperty(PanelMenuSub, "propTypes", {
  model: _propTypes.default.any
});

class PanelMenu extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: null
    };
  }

  onItemClick(event, item) {
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

    if (this.state.activeItem && this.state.activeItem === item) {
      this.setState({
        activeItem: null
      });
    } else {
      this.setState({
        activeItem: item
      });
    }
  }

  renderPanelIcon(item) {
    const className = (0, _classnames.default)('p-menuitem-icon', item.icon);

    if (item.items) {
      return _react.default.createElement("span", {
        className: className
      });
    } else {
      return null;
    }
  }

  renderPanelToggleIcon(item, active) {
    const className = (0, _classnames.default)('p-panelmenu-icon pi pi-fw', {
      'pi-caret-right': !active,
      ' pi-caret-down': active
    });

    if (item.items) {
      return _react.default.createElement("span", {
        className: className
      });
    } else {
      return null;
    }
  }

  renderPanel(item, index) {
    const active = this.state.activeItem === item;
    const className = (0, _classnames.default)('p-panelmenu-panel', item.className, {
      'p-disabled': item.disabled
    });
    const headerClassName = (0, _classnames.default)('p-component p-panelmenu-header', {
      'p-highlight': active
    });
    const toggleIcon = this.renderPanelToggleIcon(item, active);
    const itemIcon = this.renderPanelIcon(item);
    const contentWrapperClassName = (0, _classnames.default)('p-toggleable-content', {
      'p-toggleable-content-collapsed': !active
    });
    return _react.default.createElement("div", {
      key: item.label + '_' + index,
      className: className,
      style: item.style
    }, _react.default.createElement("div", {
      className: headerClassName,
      style: item.style
    }, _react.default.createElement("a", {
      href: item.url || '#',
      className: "p-panelmenu-header-link",
      onClick: e => this.onItemClick(e, item)
    }, toggleIcon, itemIcon, _react.default.createElement("span", {
      className: "p-menuitem-text"
    }, item.label))), _react.default.createElement(_reactTransitionGroup.CSSTransition, {
      classNames: "p-toggleable-content",
      timeout: {
        enter: 400,
        exit: 250
      },
      in: active
    }, _react.default.createElement("div", {
      className: contentWrapperClassName
    }, _react.default.createElement("div", {
      className: "p-panelmenu-content"
    }, _react.default.createElement(PanelMenuSub, {
      model: item.items,
      className: "p-panelmenu-root-submenu"
    })))));
  }

  renderPanels() {
    if (this.props.model) {
      return this.props.model.map((item, index) => {
        return this.renderPanel(item, index);
      });
    } else {
      return null;
    }
  }

  render() {
    const className = (0, _classnames.default)('p-panelmenu p-component', this.props.className);
    const panels = this.renderPanels();
    return _react.default.createElement("div", {
      id: this.props.id,
      className: className,
      style: this.props.style
    }, panels);
  }

}

exports.PanelMenu = PanelMenu;

_defineProperty(PanelMenu, "defaultProps", {
  id: null,
  model: null,
  style: null,
  className: null
});

_defineProperty(PanelMenu, "propTypes", {
  id: _propTypes.default.string,
  model: _propTypes.default.array,
  style: _propTypes.default.object,
  className: _propTypes.default.string
});