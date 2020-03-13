"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MenubarSub = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MenubarSub extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: null
    };
    this.onLeafClick = this.onLeafClick.bind(this);
    this.onChildItemKeyDown = this.onChildItemKeyDown.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.parentActive && !this.props.parentActive) {
      this.setState({
        activeItem: null
      });
    }
  }

  componentDidMount() {
    if (!this.documentClickListener) {
      this.documentClickListener = event => {
        if (this.element && !this.element.contains(event.target)) {
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

  onItemMouseEnter(event, item) {
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    if (this.props.root) {
      if (this.state.activeItem || this.props.popup) {
        this.setState({
          activeItem: item
        });
      }
    } else {
      this.setState({
        activeItem: item
      });
    }
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

    if (this.props.root) {
      if (item.items) {
        if (this.state.activeItem && item === this.state.activeItem) {
          this.setState({
            activeItem: null
          });
        } else {
          this.setState({
            activeItem: item
          });
        }
      }
    }

    if (!item.items) {
      this.onLeafClick();
    }
  }

  onItemKeyDown(event, item) {
    let listItem = event.currentTarget.parentElement;

    switch (event.which) {
      //down
      case 40:
        if (this.props.root) {
          if (item.items) {
            this.expandSubmenu(item, listItem);
          }
        } else {
          this.navigateToNextItem(listItem);
        }

        event.preventDefault();
        break;
      //up

      case 38:
        if (!this.props.root) {
          this.navigateToPrevItem(listItem);
        }

        event.preventDefault();
        break;
      //right

      case 39:
        if (this.props.root) {
          var nextItem = this.findNextItem(listItem);

          if (nextItem) {
            nextItem.children[0].focus();
          }
        } else {
          if (item.items) {
            this.expandSubmenu(item, listItem);
          }
        }

        event.preventDefault();
        break;
      //left

      case 37:
        if (this.props.root) {
          this.navigateToPrevItem(listItem);
        }

        event.preventDefault();
        break;

      default:
        break;
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(event, listItem);
    }
  }

  onChildItemKeyDown(event, childListItem) {
    if (this.props.root) {
      //up
      if (event.which === 38 && childListItem.previousElementSibling == null) {
        this.collapseMenu(childListItem);
      }
    } else {
      //left
      if (event.which === 37) {
        this.collapseMenu(childListItem);
      }
    }
  }

  expandSubmenu(item, listItem) {
    this.setState({
      activeItem: item
    });
    setTimeout(() => {
      listItem.children[1].children[0].children[0].focus();
    }, 50);
  }

  collapseMenu(listItem) {
    this.setState({
      activeItem: null
    });
    listItem.parentElement.previousElementSibling.focus();
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

  findNextItem(item) {
    let nextItem = item.nextElementSibling;
    if (nextItem) return _DomHandler.default.hasClass(nextItem, 'p-disabled') || !_DomHandler.default.hasClass(nextItem, 'p-menuitem') ? this.findNextItem(nextItem) : nextItem;else return null;
  }

  findPrevItem(item) {
    let prevItem = item.previousElementSibling;
    if (prevItem) return _DomHandler.default.hasClass(prevItem, 'p-disabled') || !_DomHandler.default.hasClass(prevItem, 'p-menuitem') ? this.findPrevItem(prevItem) : prevItem;else return null;
  }

  onLeafClick() {
    this.setState({
      activeItem: null
    });

    if (this.props.onLeafClick) {
      this.props.onLeafClick();
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

  renderSubmenuIcon(item) {
    const icon = (0, _classnames.default)('p-submenu-icon pi pi-fw', {
      'pi-caret-down': this.props.root,
      'pi-caret-right': !this.props.root
    });

    if (item.items) {
      return _react.default.createElement("span", {
        className: icon
      });
    } else {
      return null;
    }
  }

  renderSubmenu(item) {
    if (item.items) {
      return _react.default.createElement(MenubarSub, {
        model: item.items,
        onLeafClick: this.onLeafClick,
        onKeyDown: this.onChildItemKeyDown,
        parentActive: item === this.state.activeItem
      });
    } else {
      return null;
    }
  }

  renderMenuitem(item, index) {
    const className = (0, _classnames.default)('p-menuitem', {
      'p-menuitem-active': this.state.activeItem === item,
      'p-disabled': item.disabled
    }, item.className);
    const icon = this.renderIcon(item);
    const submenuIcon = this.renderSubmenuIcon(item);
    const submenu = this.renderSubmenu(item);
    return _react.default.createElement("li", {
      key: item.label + '_' + index,
      className: className,
      style: item.style,
      onMouseEnter: event => this.onItemMouseEnter(event, item)
    }, _react.default.createElement("a", {
      href: item.url || '#',
      className: "p-menuitem-link",
      target: item.target,
      onClick: event => this.onItemClick(event, item),
      onKeyDown: event => this.onItemKeyDown(event, item)
    }, icon, _react.default.createElement("span", {
      className: "p-menuitem-text"
    }, item.label), submenuIcon), submenu);
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
    const className = (0, _classnames.default)({
      'p-submenu-list': !this.props.root,
      'p-menubar-root-list': this.props.root
    });
    const submenu = this.renderMenu();
    return _react.default.createElement("ul", {
      ref: el => this.element = el,
      className: className
    }, submenu);
  }

}

exports.MenubarSub = MenubarSub;

_defineProperty(MenubarSub, "defaultProps", {
  model: null,
  root: false,
  className: null,
  popup: false,
  onLeafClick: null,
  onKeyDown: null,
  parentActive: false
});

_defineProperty(MenubarSub, "propTypes", {
  model: _propTypes.default.any,
  root: _propTypes.default.bool,
  className: _propTypes.default.string,
  popup: _propTypes.default.bool,
  onLeafClick: _propTypes.default.func,
  onKeyDown: _propTypes.default.func,
  parentActive: _propTypes.default.bool
});