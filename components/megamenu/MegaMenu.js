"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MegaMenu = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MegaMenu extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: null
    };
    this.onLeafClick = this.onLeafClick.bind(this);
  }

  onLeafClick(event, item) {
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

    this.setState({
      activeItem: null
    });
  }

  componentDidMount() {
    if (!this.documentClickListener) {
      this.documentClickListener = event => {
        if (this.container && !this.container.contains(event.target)) {
          this.setState({
            activeItem: null
          });
        }
      };

      document.addEventListener('click', this.documentClickListener);
    }
  }

  componentWillUnmount() {
    if (this.documentClickListener) {
      document.removeEventListener('click', this.documentClickListener);
      this.documentClickListener = null;
    }
  }

  onCategoryMouseEnter(event, item) {
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    if (this.state.activeItem) {
      this.setState({
        activeItem: item
      });
    }
  }

  onCategoryClick(event, item) {
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
        item: this.props.item
      });
    }

    if (item.items) {
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

    event.preventDefault();
  }

  onCategoryKeyDown(event, item) {
    let listItem = event.currentTarget.parentElement;

    switch (event.which) {
      //down
      case 40:
        if (this.isHorizontal()) this.expandMenu(item);else this.navigateToNextItem(listItem);
        event.preventDefault();
        break;
      //up

      case 38:
        if (this.isVertical()) this.navigateToPrevItem(listItem);else if (item.items && item === this.state.activeItem) this.collapseMenu();
        event.preventDefault();
        break;
      //right

      case 39:
        if (this.isHorizontal()) this.navigateToNextItem(listItem);else this.expandMenu(item);
        event.preventDefault();
        break;
      //left

      case 37:
        if (this.isHorizontal()) this.navigateToPrevItem(listItem);else if (item.items && item === this.state.activeItem) this.collapseMenu();
        event.preventDefault();
        break;

      default:
        break;
    }
  }

  expandMenu(item) {
    if (item.items) {
      this.setState({
        activeItem: item
      });
    }
  }

  collapseMenu(item) {
    this.setState({
      activeItem: null
    });
  }

  findNextItem(item) {
    let nextItem = item.nextElementSibling;
    if (nextItem) return _DomHandler.default.hasClass(nextItem, 'p-disabled') || !_DomHandler.default.hasClass(nextItem, 'p-menuitem') ? this.findNextItem(nextItem) : nextItem;else return null;
  }

  findPrevItem(item) {
    let prevItem = item.previousElementSibling;
    if (prevItem) return _DomHandler.default.hasClass(prevItem, 'p-disabled') || !_DomHandler.default.hasClass(prevItem, 'p-menuitem') ? this.findPrevItem(prevItem) : prevItem;else return null;
  }

  navigateToNextItem(listItem) {
    var nextItem = this.findNextItem(listItem);

    if (nextItem) {
      nextItem.children[0].focus();
    }
  }

  navigateToPrevItem(listItem) {
    var prevItem = this.findPrevItem(listItem);

    if (prevItem) {
      prevItem.children[0].focus();
    }
  }

  isHorizontal() {
    return this.props.orientation === 'horizontal';
  }

  isVertical() {
    return this.props.orientation === 'vertical';
  }

  getColumnClassName(category) {
    let length = category.items ? category.items.length : 0;
    let columnClass;

    switch (length) {
      case 2:
        columnClass = 'p-col-6';
        break;

      case 3:
        columnClass = 'p-col-4';
        break;

      case 4:
        columnClass = 'p-col-3';
        break;

      case 6:
        columnClass = 'p-col-2';
        break;

      default:
        columnClass = 'p-col-12';
        break;
    }

    return columnClass;
  }

  renderSeparator(index) {
    return _react.default.createElement("li", {
      key: 'separator_' + index,
      className: "p-menu-separator"
    });
  }

  renderSubmenuIcon(item) {
    if (item.items) {
      const className = (0, _classnames.default)('p-submenu-icon pi pi-fw', {
        'pi-caret-down': this.isHorizontal(),
        'pi-caret-right': this.isVertical()
      });
      return _react.default.createElement("span", {
        className: className
      });
    } else {
      return null;
    }
  }

  renderSubmenuItem(item, index) {
    if (item.separator) {
      return _react.default.createElement("li", {
        key: 'separator_' + index,
        className: "p-menu-separator"
      });
    } else {
      const className = (0, _classnames.default)('p-menuitem', item.className, {
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
        onClick: event => this.onLeafClick(event, item)
      }, icon, _react.default.createElement("span", {
        className: "p-menuitem-text"
      }, item.label)));
    }
  }

  renderSubmenu(submenu) {
    const className = (0, _classnames.default)('p-megamenu-submenu-header', submenu.className, {
      'p-disabled': submenu.disabled
    });
    const items = submenu.items.map((item, index) => {
      return this.renderSubmenuItem(item, index);
    });
    return _react.default.createElement(_react.default.Fragment, {
      key: submenu.label
    }, _react.default.createElement("li", {
      className: className,
      style: submenu.style
    }, submenu.label), items);
  }

  renderSubmenus(column) {
    return column.map((submenu, index) => {
      return this.renderSubmenu(submenu, index);
    });
  }

  renderColumn(category, column, index, columnClassName) {
    const submenus = this.renderSubmenus(column);
    return _react.default.createElement("div", {
      key: category.label + '_column_' + index,
      className: columnClassName
    }, _react.default.createElement("ul", {
      className: "p-megamenu-submenu"
    }, submenus));
  }

  renderColumns(category) {
    if (category.items) {
      const columnClassName = this.getColumnClassName(category);
      return category.items.map((column, index) => {
        return this.renderColumn(category, column, index, columnClassName);
      });
    } else {
      return null;
    }
  }

  renderCategoryPanel(category) {
    if (category.items) {
      const columns = this.renderColumns(category);
      return _react.default.createElement("div", {
        className: "p-megamenu-panel"
      }, _react.default.createElement("div", {
        className: "p-grid"
      }, columns));
    } else {
      return null;
    }
  }

  renderCategory(category, index) {
    const className = (0, _classnames.default)('p-menuitem', {
      'p-menuitem-active': category === this.state.activeItem,
      'p-disabled': category.disabled
    }, category.className);
    const iconClassName = (0, _classnames.default)(category.icon, 'p-menuitem-icon');
    const icon = category.icon ? _react.default.createElement("span", {
      className: iconClassName
    }) : null;
    const submenuIcon = this.renderSubmenuIcon(category);
    const panel = this.renderCategoryPanel(category);
    return _react.default.createElement("li", {
      key: category.label + '_' + index,
      className: className,
      style: category.style,
      onMouseEnter: e => this.onCategoryMouseEnter(e, category)
    }, _react.default.createElement("a", {
      href: category.url || '#',
      className: "p-menuitem-link",
      target: category.target,
      onClick: e => this.onCategoryClick(e, category),
      onKeyDown: e => this.onCategoryKeyDown(e, category)
    }, icon, _react.default.createElement("span", {
      className: "p-menuitem-text"
    }, category.label), submenuIcon), panel);
  }

  renderMenu() {
    if (this.props.model) {
      return this.props.model.map((item, index) => {
        return this.renderCategory(item, index, true);
      });
    } else {
      return null;
    }
  }

  renderCustomContent() {
    if (this.props.children) {
      return _react.default.createElement("div", {
        className: "p-megamenu-custom"
      }, this.props.children);
    } else {
      return null;
    }
  }

  render() {
    const className = (0, _classnames.default)('p-megamenu p-component', {
      'p-megamenu-horizontal': this.props.orientation === 'horizontal',
      'p-megamenu-vertical': this.props.orientation === 'vertical'
    }, this.props.className);
    const menu = this.renderMenu();
    const customContent = this.renderCustomContent();
    return _react.default.createElement("div", {
      ref: el => this.container = el,
      id: this.props.id,
      className: className,
      style: this.props.style
    }, _react.default.createElement("ul", {
      className: "p-megamenu-root-list"
    }, menu), customContent);
  }

}

exports.MegaMenu = MegaMenu;

_defineProperty(MegaMenu, "defaultProps", {
  id: null,
  model: null,
  style: null,
  className: null,
  orientation: 'horizontal'
});

_defineProperty(MegaMenu, "propTypes", {
  id: _propTypes.default.string,
  model: _propTypes.default.array,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  orientation: _propTypes.default.string
});