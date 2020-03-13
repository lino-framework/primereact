"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContextMenu = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ContextMenuSub extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: null
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.resetMenu === true) {
      return {
        activeItem: null
      };
    }

    return null;
  }

  onItemMouseEnter(event, item) {
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    this.setState({
      activeItem: item
    });
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

    if (!item.items) {
      this.props.onLeafClick(event);
    }
  }

  componentDidUpdate() {
    if (this.element.offsetParent) {
      this.position();
    }
  }

  position() {
    const parentItem = this.element.parentElement;

    const containerOffset = _DomHandler.default.getOffset(this.element.parentElement);

    const viewport = _DomHandler.default.getViewport();

    const sublistWidth = this.element.offsetParent ? this.element.offsetWidth : _DomHandler.default.getHiddenElementOuterWidth(this.element);

    const itemOuterWidth = _DomHandler.default.getOuterWidth(parentItem.children[0]);

    this.element.style.top = '0px';

    if (parseInt(containerOffset.left, 10) + itemOuterWidth + sublistWidth > viewport.width - _DomHandler.default.calculateScrollbarWidth()) {
      this.element.style.left = -1 * sublistWidth + 'px';
    } else {
      this.element.style.left = itemOuterWidth + 'px';
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
      return _react.default.createElement(ContextMenuSub, {
        model: item.items,
        resetMenu: item !== this.state.activeItem,
        onLeafClick: this.props.onLeafClick
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
      onClick: event => this.onItemClick(event, item, index)
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
      'p-submenu-list': !this.props.root
    });
    const submenu = this.renderMenu();
    return _react.default.createElement("ul", {
      ref: el => this.element = el,
      className: className
    }, submenu);
  }

}

_defineProperty(ContextMenuSub, "defaultProps", {
  model: null,
  root: false,
  className: null,
  resetMenu: false,
  onLeafClick: null
});

_defineProperty(ContextMenuSub, "propTypes", {
  model: _propTypes.default.any,
  root: _propTypes.default.bool,
  className: _propTypes.default.string,
  resetMenu: _propTypes.default.bool,
  onLeafClick: _propTypes.default.func
});

class ContextMenu extends _react.Component {
  constructor(props) {
    super();
    this.state = {
      resetMenu: false
    };
    this.onMenuClick = this.onMenuClick.bind(this);
    this.onLeafClick = this.onLeafClick.bind(this);
    this.onMenuMouseEnter = this.onMenuMouseEnter.bind(this);
  }

  componentDidMount() {
    this.bindDocumentClickListener();

    if (this.props.global) {
      this.bindDocumentContextMenuListener();
    }
  }

  onMenuClick() {
    this.selfClick = true;
    this.setState({
      resetMenu: false
    });
  }

  onMenuMouseEnter() {
    this.setState({
      resetMenu: false
    });
  }

  show(event) {
    this.container.style.display = 'block';
    this.position(event);

    if (this.props.autoZIndex) {
      this.container.style.zIndex = String(this.props.baseZIndex + _DomHandler.default.generateZIndex());
    }

    _DomHandler.default.fadeIn(this.container, 250);

    this.bindDocumentResizeListener();

    if (this.props.onShow) {
      this.props.onShow(event);
    }

    event.stopPropagation();
    event.preventDefault();
  }

  hide(event) {
    if (this.container) {
      this.container.style.display = 'none';
    }

    if (this.props.onHide) {
      this.props.onHide(event);
    }

    this.unbindDocumentResizeListener();
  }

  position(event) {
    if (event) {
      let left = event.pageX + 1;
      let top = event.pageY + 1;
      let width = this.container.offsetParent ? this.container.offsetWidth : _DomHandler.default.getHiddenElementOuterWidth(this.container);
      let height = this.container.offsetParent ? this.container.offsetHeight : _DomHandler.default.getHiddenElementOuterHeight(this.container);

      let viewport = _DomHandler.default.getViewport(); //flip


      if (left + width - document.body.scrollLeft > viewport.width) {
        left -= width;
      } //flip


      if (top + height - document.body.scrollTop > viewport.height) {
        top -= height;
      } //fit


      if (left < document.body.scrollLeft) {
        left = document.body.scrollLeft;
      } //fit


      if (top < document.body.scrollTop) {
        top = document.body.scrollTop;
      }

      this.container.style.left = left + 'px';
      this.container.style.top = top + 'px';
    }
  }

  onLeafClick(event) {
    this.setState({
      resetMenu: true
    });
    event.stopPropagation();
  }

  bindDocumentClickListener() {
    if (!this.documentClickListener) {
      this.documentClickListener = event => {
        if (!this.selfClick && event.button !== 2) {
          this.hide(event);
          this.setState({
            resetMenu: true
          });
        }

        this.selfClick = false;
      };

      document.addEventListener('click', this.documentClickListener);
    }
  }

  bindDocumentContextMenuListener() {
    if (!this.documentContextMenuListener) {
      this.documentContextMenuListener = event => {
        this.show(event);
      };

      document.addEventListener('contextmenu', this.documentContextMenuListener);
    }
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

  unbindDocumentContextMenuListener() {
    if (this.documentContextMenuListener) {
      document.removeEventListener('contextmenu', this.documentContextMenuListener);
      this.documentContextMenuListener = null;
    }
  }

  unbindDocumentResizeListener() {
    if (this.documentResizeListener) {
      window.removeEventListener('resize', this.documentResizeListener);
      this.documentResizeListener = null;
    }
  }

  componentWillUnmount() {
    this.unbindDocumentClickListener();
    this.unbindDocumentResizeListener();
    this.unbindDocumentContextMenuListener();
  }

  renderContextMenu() {
    const className = (0, _classnames.default)('p-contextmenu p-component', this.props.className);
    return _react.default.createElement("div", {
      id: this.props.id,
      className: className,
      style: this.props.style,
      ref: el => this.container = el,
      onClick: this.onMenuClick,
      onMouseEnter: this.onMenuMouseEnter
    }, _react.default.createElement(ContextMenuSub, {
      model: this.props.model,
      root: true,
      resetMenu: this.state.resetMenu,
      onLeafClick: this.onLeafClick
    }));
  }

  render() {
    const element = this.renderContextMenu();
    if (this.props.appendTo) return _reactDom.default.createPortal(element, this.props.appendTo);else return element;
  }

}

exports.ContextMenu = ContextMenu;

_defineProperty(ContextMenu, "defaultProps", {
  id: null,
  model: null,
  style: null,
  className: null,
  global: false,
  autoZIndex: true,
  baseZIndex: 0,
  appendTo: null,
  onShow: null,
  onHide: null
});

_defineProperty(ContextMenu, "propTypes", {
  id: _propTypes.default.string,
  model: _propTypes.default.array,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  global: _propTypes.default.bool,
  autoZIndex: _propTypes.default.bool,
  baseZIndex: _propTypes.default.number,
  appendTo: _propTypes.default.any,
  onShow: _propTypes.default.func,
  onHide: _propTypes.default.func
});