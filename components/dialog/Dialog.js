"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dialog = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

var _classnames = _interopRequireDefault(require("classnames"));

var _UniqueComponentId = _interopRequireDefault(require("../utils/UniqueComponentId"));

var _reactTransitionGroup = require("react-transition-group");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Dialog extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      maximized: false
    };
    this.onClose = this.onClose.bind(this);
    this.toggleMaximize = this.toggleMaximize.bind(this);
    this.id = this.props.id || (0, _UniqueComponentId.default)();
  }

  onClose(event) {
    this.props.onHide();
    event.preventDefault();
  }

  hide() {
    this.unbindMaskClickListener();
    this.unbindGlobalListeners();
    this.props.onHide();

    if (this.props.modal) {
      this.disableModality();
    }

    if (this.state.maximized) {
      _DomHandler.default.removeClass(document.body, 'p-overflow-hidden');
    }
  }

  focus() {
    let focusable = _DomHandler.default.findSingle(this.container, 'button');

    if (focusable) {
      focusable.focus();
    }
  }

  show() {
    this.unbindMaskClickListener();
    this.unbindGlobalListeners();
    this.bindGlobalListeners();

    if (this.props.onShow) {
      this.props.onShow();
    }

    this.container.style.zIndex = String(this.props.baseZIndex + _DomHandler.default.generateZIndex());

    if (this.props.focusOnShow) {
      this.focus();
    }

    if (this.props.modal) {
      this.enableModality();
    }

    if (this.state.maximized) {
      _DomHandler.default.removeClass(document.body, 'p-overflow-hidden');
    }
  }

  toggleMaximize(event) {
    this.setState({
      maximized: !this.state.maximized
    });
    event.preventDefault();
  }

  maximize() {
    _DomHandler.default.addClass(this.container, 'p-dialog-maximized');

    _DomHandler.default.addClass(document.body, 'p-overflow-hidden');

    const diffHeight = _DomHandler.default.getOuterHeight(this.headerElement) + _DomHandler.default.getOuterHeight(this.footerElement);

    this.contentElement.style.minHeight = 'calc(100vh - ' + diffHeight + 'px)';
  }

  restoreMaximize() {
    _DomHandler.default.removeClass(this.container, 'p-dialog-maximized');

    _DomHandler.default.removeClass(document.body, 'p-overflow-hidden');

    this.contentElement.style.minHeight = 'auto';
  }

  enableModality() {
    if (!this.mask) {
      this.mask = document.createElement('div');
      this.mask.style.zIndex = String(parseInt(this.container.style.zIndex, 10) - 1);

      _DomHandler.default.addMultipleClasses(this.mask, 'p-component-overlay p-dialog-mask');

      if (this.props.closable && this.props.dismissableMask) {
        this.maskClickListener = event => {
          this.onClose(event);
        };

        this.mask.addEventListener('click', this.maskClickListener);
      }

      document.body.appendChild(this.mask);

      if (this.props.blockScroll) {
        _DomHandler.default.addClass(document.body, 'p-overflow-hidden');
      }
    }
  }

  disableModality() {
    if (this.mask) {
      this.unbindMaskClickListener();
      document.body.removeChild(this.mask);

      if (this.props.blockScroll) {
        _DomHandler.default.removeClass(document.body, 'p-overflow-hidden');
      }

      this.mask = null;
    }
  }

  unbindMaskClickListener() {
    if (this.maskClickListener) {
      this.mask.removeEventListener('click', this.maskClickListener);
      this.maskClickListener = null;
    }
  }

  bindGlobalListeners() {
    if (this.props.closeOnEscape && this.props.closable) {
      this.bindDocumentEscapeListener();
    }
  }

  unbindGlobalListeners() {
    this.unbindDocumentEscapeListener();
  }

  bindDocumentEscapeListener() {
    this.documentEscapeListener = event => {
      if (event.which === 27) {
        if (parseInt(this.container.style.zIndex, 10) === _DomHandler.default.getCurrentZIndex()) {
          this.onClose(event);
        }
      }
    };

    document.addEventListener('keydown', this.documentEscapeListener);
  }

  unbindDocumentEscapeListener() {
    if (this.documentEscapeListener) {
      document.removeEventListener('keydown', this.documentEscapeListener);
      this.documentEscapeListener = null;
    }
  }

  componentDidMount() {
    if (this.props.visible) {
      this.show();
      this.currentHeight = _DomHandler.default.getOuterHeight(this.container);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) this.show();else this.hide();
    }

    if (prevState.maximized !== this.state.maximized) {
      if (this.state.maximized) {
        this.maximize();
      } else {
        this.restoreMaximize();
      }
    }
  }

  componentWillUnmount() {
    this.disableModality();
    this.unbindGlobalListeners();
    this.unbindMaskClickListener();
  }

  renderCloseIcon() {
    if (this.props.closable) {
      return _react.default.createElement("button", {
        className: "p-dialog-titlebar-icon p-dialog-titlebar-close p-link",
        "aria-label": this.props.ariaCloseIconLabel,
        onClick: this.onClose
      }, _react.default.createElement("span", {
        className: "p-dialog-titlebar-close-icon pi pi-times"
      }));
    } else {
      return null;
    }
  }

  renderMaximizeIcon() {
    const iconClassName = (0, _classnames.default)('p-dialog-titlebar-maximize-icon pi', {
      'pi-window-maximize': !this.state.maximized,
      'pi-window-minimize': this.state.maximized
    });

    if (this.props.maximizable) {
      return _react.default.createElement("button", {
        className: "p-dialog-titlebar-icon p-dialog-titlebar-maximize p-link",
        onClick: this.toggleMaximize
      }, _react.default.createElement("span", {
        className: iconClassName
      }));
    } else {
      return null;
    }
  }

  renderIconsTemplate() {
    if (this.props.iconsTemplate) {
      return this.props.iconsTemplate(this);
    } else {
      return null;
    }
  }

  renderHeader() {
    if (this.props.showHeader) {
      const closeIcon = this.renderCloseIcon();
      const maximizeIcon = this.renderMaximizeIcon();
      const iconsTemplate = this.renderIconsTemplate();
      return _react.default.createElement("div", {
        ref: el => this.headerElement = el,
        className: "p-dialog-titlebar"
      }, _react.default.createElement("span", {
        id: this.id + '_label',
        className: "p-dialog-title"
      }, this.props.header), _react.default.createElement("div", {
        className: "p-dialog-titlebar-icons"
      }, iconsTemplate, maximizeIcon, closeIcon));
    } else {
      return null;
    }
  }

  renderContent() {
    return _react.default.createElement("div", {
      ref: el => this.contentElement = el,
      className: "p-dialog-content",
      style: this.props.contentStyle
    }, this.props.children);
  }

  renderFooter() {
    if (this.props.footer) {
      return _react.default.createElement("div", {
        ref: el => this.footerElement = el,
        className: "p-dialog-footer"
      }, this.props.footer);
    } else {
      return null;
    }
  }

  renderElement() {
    const className = (0, _classnames.default)('p-dialog p-component', this.props.className, {
      'p-dialog-rtl': this.props.rtl,
      'p-dialog-visible': this.props.visible
    });
    const header = this.renderHeader();
    const content = this.renderContent();
    const footer = this.renderFooter();
    return _react.default.createElement(_reactTransitionGroup.CSSTransition, {
      classNames: "p-dialog",
      timeout: {
        enter: 150,
        exit: 75
      },
      in: this.props.visible
    }, _react.default.createElement("div", {
      id: this.id,
      className: className,
      style: this.props.style,
      ref: el => this.container = el,
      "aria-labelledby": this.id + '_label',
      role: "dialog"
    }, header, content, footer));
  }

  render() {
    const element = this.renderElement();
    if (this.props.appendTo) return _reactDom.default.createPortal(element, this.props.appendTo);else return element;
  }

}

exports.Dialog = Dialog;

_defineProperty(Dialog, "defaultProps", {
  id: null,
  header: null,
  footer: null,
  visible: false,
  modal: true,
  onHide: null,
  onShow: null,
  contentStyle: null,
  closeOnEscape: true,
  dismissableMask: false,
  rtl: false,
  closable: true,
  style: null,
  className: null,
  showHeader: true,
  appendTo: null,
  baseZIndex: 0,
  maximizable: false,
  blockScroll: true,
  iconsTemplate: null,
  ariaCloseIconLabel: 'Close',
  focusOnShow: true
});

_defineProperty(Dialog, "propTypes", {
  id: _propTypes.default.string,
  header: _propTypes.default.any,
  footer: _propTypes.default.any,
  visible: _propTypes.default.bool,
  modal: _propTypes.default.bool,
  onHide: _propTypes.default.func.isRequired,
  onShow: _propTypes.default.func,
  contentStyle: _propTypes.default.object,
  closeOnEscape: _propTypes.default.bool,
  dismissableMask: _propTypes.default.bool,
  rtl: _propTypes.default.bool,
  closable: _propTypes.default.bool,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  showHeader: _propTypes.default.bool,
  appendTo: _propTypes.default.object,
  baseZIndex: _propTypes.default.number,
  maximizable: _propTypes.default.bool,
  blockScroll: _propTypes.default.bool,
  iconsTemplate: _propTypes.default.func,
  ariaCloseIconLabel: _propTypes.default.string,
  focusOnShow: _propTypes.default.bool
});