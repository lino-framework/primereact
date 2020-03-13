"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TieredMenu = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

var _TieredMenuSub = require("./TieredMenuSub");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TieredMenu extends _react.Component {
  toggle(event) {
    if (this.props.popup) {
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
  }

  bindDocumentListeners() {
    this.bindDocumentClickListener();
    this.bindDocumentResizeListener();
  }

  unbindDocumentListeners() {
    this.unbindDocumentClickListener();
    this.unbindDocumentResizeListener();
  }

  bindDocumentClickListener() {
    if (!this.documentClickListener) {
      this.documentClickListener = event => {
        if (this.props.popup && !this.container.contains(event.target)) {
          this.hide(event);
        }
      };

      document.addEventListener('click', this.documentClickListener);
    }
  }

  unbindDocumentClickListener() {
    if (this.documentClickListener) {
      document.removeEventListener('click', this.documentClickListener);
      this.documentClickListener = null;
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

  unbindDocumentResizeListener() {
    if (this.documentResizeListener) {
      window.removeEventListener('resize', this.documentResizeListener);
      this.documentResizeListener = null;
    }
  }

  componentWillUnmount() {
    this.unbindDocumentListeners();
  }

  renderElement() {
    const className = (0, _classnames.default)('p-tieredmenu p-component', {
      'p-tieredmenu-dynamic p-menu-overlay': this.props.popup
    }, this.props.className);
    return _react.default.createElement("div", {
      ref: el => this.container = el,
      id: this.props.id,
      className: className,
      style: this.props.style
    }, _react.default.createElement(_TieredMenuSub.TieredMenuSub, {
      model: this.props.model,
      root: true,
      popup: this.props.popup
    }));
  }

  render() {
    const element = this.renderElement();
    if (this.props.appendTo) return _reactDom.default.createPortal(element, this.props.appendTo);else return element;
  }

}

exports.TieredMenu = TieredMenu;

_defineProperty(TieredMenu, "defaultProps", {
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

_defineProperty(TieredMenu, "propTypes", {
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