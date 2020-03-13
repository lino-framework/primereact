"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SlideMenu = exports.SlideMenuSub = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class SlideMenuSub extends _react.Component {
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

    if (item.items) {
      this.setState({
        activeItem: item
      });
      this.props.onForward();
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
    if (item.items) {
      return _react.default.createElement("span", {
        className: "p-submenu-icon pi pi-fw pi-caret-right"
      });
    } else {
      return null;
    }
  }

  renderSubmenu(item) {
    if (item.items) {
      return _react.default.createElement(SlideMenuSub, {
        model: item.items,
        index: this.props.index + 1,
        menuWidth: this.props.menuWidth,
        effectDuration: this.props.effectDuration,
        onForward: this.props.onForward,
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
      style: item.style
    }, _react.default.createElement("a", {
      href: item.url || '#',
      className: "p-menuitem-link",
      target: item.target,
      onClick: event => this.onItemClick(event, item, index)
    }, icon, _react.default.createElement("span", {
      className: "p-menuitem-text"
    }, item.label), submenuIcon), submenu);
  }

  renderItem(item, index) {
    if (item.separator) return this.renderSeparator(index);else return this.renderMenuitem(item, index);
  }

  renderItems() {
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
      'p-slidemenu-rootlist': this.props.root,
      'p-submenu-list': !this.props.root,
      'p-active-submenu': this.props.parentActive
    });
    const style = {
      width: this.props.menuWidth + 'px',
      left: this.props.root ? -1 * this.props.level * this.props.menuWidth + 'px' : this.props.menuWidth + 'px',
      transitionProperty: this.props.root ? 'left' : 'none',
      transitionDuration: this.props.effectDuration + 'ms',
      transitionTimingFunction: this.props.easing
    };
    const items = this.renderItems();
    return _react.default.createElement("ul", {
      className: className,
      style: style
    }, items);
  }

}

exports.SlideMenuSub = SlideMenuSub;

_defineProperty(SlideMenuSub, "defaultProps", {
  model: null,
  level: 0,
  easing: 'ease-out',
  effectDuration: 250,
  menuWidth: 190,
  parentActive: false,
  onForward: null
});

_defineProperty(SlideMenuSub, "propTypes", {
  model: _propTypes.default.any,
  level: _propTypes.default.number,
  easing: _propTypes.default.string,
  effectDuration: _propTypes.default.number,
  menuWidth: _propTypes.default.number,
  parentActive: _propTypes.default.bool,
  onForward: _propTypes.default.func
});

class SlideMenu extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      level: 0
    };
    this.onMenuClick = this.onMenuClick.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.navigateForward = this.navigateForward.bind(this);
  }

  onMenuClick(event) {
    this.selfClick = true;
  }

  navigateForward() {
    this.setState({
      level: this.state.level + 1
    });
  }

  navigateBack() {
    this.setState({
      level: this.state.level - 1
    });
  }

  renderBackward() {
    const className = (0, _classnames.default)('p-slidemenu-backward', {
      'p-hidden': this.state.level === 0
    });
    return _react.default.createElement("div", {
      ref: el => this.backward = el,
      className: className,
      onClick: this.navigateBack
    }, _react.default.createElement("span", {
      className: "p-slidemenu-backward-icon pi pi-fw pi-caret-left"
    }), _react.default.createElement("span", null, this.props.backLabel));
  }

  componentDidMount() {
    if (this.props.popup) {
      this.bindDocumentClickListener();
    }
  }

  toggle(event) {
    if (this.props.popup) {
      this.selfClick = true;
      if (this.container.offsetParent) this.hide(event);else this.show(event);
    }
  }

  show(event) {
    if (this.props.autoZIndex) {
      this.container.style.zIndex = String(this.props.baseZIndex + _DomHandler.default.generateZIndex());
    }

    this.container.style.display = 'block';
    setTimeout(() => {
      _DomHandler.default.addClass(this.container, 'p-menu-overlay-visible');

      _DomHandler.default.removeClass(this.container, 'p-menu-overlay-hidden');
    }, 1);

    _DomHandler.default.absolutePosition(this.container, event.currentTarget);

    this.bindDocumentResizeListener();

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

    this.unbindDocumentResizeListener();
  }

  bindDocumentClickListener() {
    if (!this.documentClickListener) {
      this.documentClickListener = event => {
        if (!this.selfClick && this.container.offsetParent) {
          this.hide(event);
        }

        this.selfClick = false;
      };

      document.addEventListener('click', this.documentClickListener);
    }
  }

  onLeafClick(event) {
    this.setState({
      resetMenu: true
    });
    event.stopPropagation();
  }

  bindDocumentResizeListener() {
    if (!this.documentResizeListener) {
      this.documentResizeListener = event => {
        if (this.container.offsetParent) {
          this.hide(event);
        }
      };

      window.addEventListener('resize', this.documentResizeListener);
    }
  }

  unbindDocumentClickListener() {
    if (this.documentClickListener) {
      document.removeEventListener('click', this.documentClickListener);
      this.documentClickListener = null;
    }
  }

  unbindDocumentResizeListener() {
    if (this.documentResizeListener) {
      window.removeEventListener('resize', this.documentResizeListener);
      this.documentResizeListener = null;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.model !== prevProps.model) {
      this.setState({
        level: 0
      });
    }
  }

  componentWillUnmount() {
    this.unbindDocumentClickListener();
    this.unbindDocumentResizeListener();
  }

  renderElement() {
    const className = (0, _classnames.default)('p-slidemenu p-component', {
      'p-slidemenu-dynamic p-menu-overlay': this.props.popup
    });
    const backward = this.renderBackward();
    return _react.default.createElement("div", {
      id: this.props.id,
      className: className,
      style: this.props.style,
      ref: el => this.container = el,
      onClick: this.onMenuClick
    }, _react.default.createElement("div", {
      className: "p-slidemenu-wrapper",
      style: {
        height: this.props.viewportHeight + 'px'
      }
    }, _react.default.createElement("div", {
      className: "p-slidemenu-content",
      ref: el => this.slideMenuContent = el
    }, _react.default.createElement(SlideMenuSub, {
      model: this.props.model,
      root: true,
      index: 0,
      menuWidth: this.props.menuWidth,
      effectDuration: this.props.effectDuration,
      level: this.state.level,
      parentActive: this.state.level === 0,
      onForward: this.navigateForward
    })), backward));
  }

  render() {
    const element = this.renderElement();
    if (this.props.appendTo) return _reactDom.default.createPortal(element, this.props.appendTo);else return element;
  }

}

exports.SlideMenu = SlideMenu;

_defineProperty(SlideMenu, "defaultProps", {
  id: null,
  model: null,
  popup: false,
  style: null,
  className: null,
  easing: 'ease-out',
  effectDuration: 250,
  backLabel: 'Back',
  menuWidth: 190,
  viewportHeight: 175,
  autoZIndex: true,
  baseZIndex: 0,
  appendTo: null,
  onShow: null,
  onHide: null
});

_defineProperty(SlideMenu, "propTypes", {
  id: _propTypes.default.string,
  model: _propTypes.default.array,
  popup: _propTypes.default.bool,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  easing: _propTypes.default.string,
  effectDuration: _propTypes.default.number,
  backLabel: _propTypes.default.string,
  menuWidth: _propTypes.default.number,
  viewportHeight: _propTypes.default.number,
  autoZIndex: _propTypes.default.bool,
  baseZIndex: _propTypes.default.number,
  appendTo: _propTypes.default.any,
  onShow: _propTypes.default.func,
  onHide: _propTypes.default.func
});