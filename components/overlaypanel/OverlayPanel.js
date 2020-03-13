"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OverlayPanel = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _classnames = _interopRequireDefault(require("classnames"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class OverlayPanel extends _react.Component {
  constructor(props) {
    super(props);
    this.onCloseClick = this.onCloseClick.bind(this);
  }

  bindDocumentClickListener() {
    if (!this.documentClickListener && this.props.dismissable) {
      this.documentClickListener = this.onDocumentClick.bind(this);
      document.addEventListener('click', this.documentClickListener);
    }
  }

  unbindDocumentClickListener() {
    if (this.documentClickListener) {
      document.removeEventListener('click', this.documentClickListener);
      this.documentClickListener = null;
    }
  }

  componentWillUnmount() {
    this.unbindDocumentClickListener();
  }

  onDocumentClick(event) {
    if (!this.container.contains(event.target) && this.target && this.target !== event.target && !this.target.contains(event.target)) {
      this.hide();
    }
  }

  onCloseClick(event) {
    this.hide();
    event.preventDefault();
  }

  toggle(event, target) {
    if (this.isVisible()) {
      this.hide();

      if (this.hasTargetChanged(event, target)) {
        this.target = target || event.currentTarget || event.target;
        setTimeout(() => {
          this.show(event, this.target);
        }, 200);
      }
    } else {
      this.show(event, target);
    }
  }

  show(event, target) {
    this.target = target || event.currentTarget || event.target;
    this.bindDocumentClickListener();
    this.container.style.zIndex = String(_DomHandler.default.generateZIndex());

    if (this.isVisible()) {
      this.align();
    } else {
      this.container.style.display = 'block';
      this.align();

      _DomHandler.default.fadeIn(this.container, 250);
    }
  }

  align() {
    if (this.target) {
      _DomHandler.default.absolutePosition(this.container, this.target);

      if (_DomHandler.default.getOffset(this.container).top < _DomHandler.default.getOffset(this.target).top) {
        _DomHandler.default.addClass(this.container, 'p-overlaypanel-flipped');
      }
    }
  }

  hide() {
    if (this.isVisible()) {
      this.container.style.display = 'none';

      _DomHandler.default.removeClass(this.container, 'p-overlaypanel-flipped');

      this.unbindDocumentClickListener();

      if (this.props.onHide) {
        this.props.onHide();
      }
    }
  }

  isVisible() {
    return this.container && this.container.offsetParent;
  }

  hasTargetChanged(event, target) {
    return this.target != null && this.target !== (target || event.currentTarget || event.target);
  }

  renderCloseIcon() {
    if (this.props.showCloseIcon) {
      return _react.default.createElement("button", {
        className: "p-overlaypanel-close p-link",
        onClick: this.onCloseClick
      }, _react.default.createElement("span", {
        className: "p-overlaypanel-close-icon pi pi-times"
      }));
    } else {
      return null;
    }
  }

  renderElement() {
    let className = (0, _classnames.default)('p-overlaypanel p-component', this.props.className);
    let closeIcon = this.renderCloseIcon();
    return _react.default.createElement("div", {
      ref: el => this.container = el,
      id: this.props.id,
      className: className,
      style: this.props.style
    }, _react.default.createElement("div", {
      className: "p-overlaypanel-content"
    }, this.props.children), closeIcon);
  }

  render() {
    let element = this.renderElement();

    if (this.props.appendTo) {
      return _reactDom.default.createPortal(element, this.props.appendTo);
    } else {
      return element;
    }
  }

}

exports.OverlayPanel = OverlayPanel;

_defineProperty(OverlayPanel, "defaultProps", {
  id: null,
  dismissable: true,
  showCloseIcon: false,
  style: null,
  className: null,
  appendTo: null,
  onHide: null
});

_defineProperty(OverlayPanel, "propTypes", {
  id: _propTypes.default.string,
  dismissable: _propTypes.default.bool,
  showCloseIcon: _propTypes.default.bool,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  appendTo: _propTypes.default.any,
  onHide: _propTypes.default.func
});