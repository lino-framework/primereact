"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Menu = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Menu extends _react.Component {
  constructor(props) {
    super(props);
    this.onMenuClick = this.onMenuClick.bind(this);
  }

  onMenuClick() {
    if (this.documentClickListener) {
      this.selfClick = true;
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

    if (this.props.popup) {
      this.hide(event);
    }
  }

  onItemKeyDown(event, item) {
    let listItem = event.currentTarget.parentElement;

    switch (event.which) {
      //down
      case 40:
        var nextItem = this.findNextItem(listItem);

        if (nextItem) {
          nextItem.children[0].focus();
        }

        event.preventDefault();
        break;
      //up

      case 38:
        var prevItem = this.findPrevItem(listItem);

        if (prevItem) {
          prevItem.children[0].focus();
        }

        event.preventDefault();
        break;

      default:
        break;
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

  toggle(event) {
    if (this.props.popup) {
      if (this.documentClickListener) {
        this.selfClick = true;
      }

      if (this.container.offsetParent) this.hide(event);else this.show(event);
    }
  }

  show(event) {
    this.container.style.zIndex = String(this.props.baseZIndex + _DomHandler.default.generateZIndex());
    this.container.style.display = 'block';
    setTimeout(() => {
      _DomHandler.default.addClass(this.container, 'p-menu-overlay-visible');

      _DomHandler.default.removeClass(this.container, 'p-menu-overlay-hidden');
    }, 1);

    _DomHandler.default.absolutePosition(this.container, event.currentTarget);

    this.bindDocumentListeners();

    if (this.props.onShow) {
      this.props.onShow(event);
    }
  }

  hide(event) {
    if (this.container) {
      _DomHandler.default.addClass(this.container, 'p-menu-overlay-hidden');

      _DomHandler.default.removeClass(this.container, 'p-menu-overlay-visible');

      setTimeout(() => {
        if (this.container) {
          this.container.style.display = 'none';

          _DomHandler.default.removeClass(this.container, 'p-menu-overlay-hidden');
        }
      }, 150);
    }

    if (this.props.onHide) {
      this.props.onHide(event);
    }

    this.unbindDocumentListeners();
    this.selfClick = false;
  }

  bindDocumentListeners() {
    if (!this.documentClickListener) {
      this.documentClickListener = event => {
        if (this.selfClick) this.selfClick = false;else this.hide(event);
      };

      document.addEventListener('click', this.documentClickListener);
    }

    if (!this.documentResizeListener) {
      this.documentResizeListener = event => {
        if (this.container.offsetParent) {
          this.hide(event);
        }
      };

      window.addEventListener('resize', this.documentResizeListener);
    }
  }

  unbindDocumentListeners() {
    if (this.documentClickListener) {
      document.removeEventListener('click', this.documentClickListener);
      this.documentClickListener = null;
    }

    if (this.documentResizeListener) {
      window.removeEventListener('resize', this.documentResizeListener);
      this.documentResizeListener = null;
    }
  }

  componentWillUnmount() {
    this.unbindDocumentListeners();
  }

  renderSubmenu(submenu, index) {
    const className = (0, _classnames.default)('p-submenu-header', submenu.className, {
      'p-disabled': submenu.disabled
    });
    const items = submenu.items.map((item, index) => {
      return this.renderMenuitem(item, index);
    });
    return _react.default.createElement(_react.default.Fragment, {
      key: submenu.label + '_' + index
    }, _react.default.createElement("li", {
      className: className,
      style: submenu.style
    }, submenu.label), items);
  }

  renderSeparator(index) {
    return _react.default.createElement("li", {
      key: 'separator_' + index,
      className: "p-menu-separator"
    });
  }

  renderMenuitem(item, index) {
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
      onClick: e => this.onItemClick(e, item),
      onKeyDown: e => this.onItemKeyDown(e, item)
    }, icon, _react.default.createElement("span", {
      className: "p-menuitem-text"
    }, item.label)));
  }

  renderItem(item, index) {
    if (item.separator) {
      return this.renderSeparator(index);
    } else {
      if (item.items) return this.renderSubmenu(item, index);else return this.renderMenuitem(item, index);
    }
  }

  renderMenu() {
    return this.props.model.map((item, index) => {
      return this.renderItem(item, index);
    });
  }

  renderElement() {
    if (this.props.model) {
      const className = (0, _classnames.default)('p-menu p-component', this.props.className, {
        'p-menu-dynamic p-menu-overlay': this.props.popup
      });
      const menuitems = this.renderMenu();
      return _react.default.createElement("div", {
        id: this.props.id,
        className: className,
        style: this.props.style,
        ref: el => this.container = el,
        onClick: this.onMenuClick
      }, _react.default.createElement("ul", {
        className: "p-menu-list p-reset"
      }, menuitems));
    } else {
      return null;
    }
  }

  render() {
    const element = this.renderElement();
    if (this.props.appendTo) return _reactDom.default.createPortal(element, this.props.appendTo);else return element;
  }

}

exports.Menu = Menu;

_defineProperty(Menu, "defaultProps", {
  id: null,
  model: null,
  popup: false,
  style: null,
  className: null,
  autoZIndex: true,
  baseZIndex: 0,
  appendTo: null,
  onShow: null,
  onHide: null
});

_defineProperty(Menu, "propTypes", {
  id: _propTypes.default.string,
  model: _propTypes.default.array,
  popup: _propTypes.default.bool,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  autoZIndex: _propTypes.default.bool,
  baseZIndex: _propTypes.default.number,
  appendTo: _propTypes.default.any,
  onShow: _propTypes.default.func,
  onHide: _propTypes.default.func
});