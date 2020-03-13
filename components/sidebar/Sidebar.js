"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sidebar = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Sidebar extends _react.Component {
  constructor(props) {
    super(props);
    this.onCloseClick = this.onCloseClick.bind(this);
  }

  componentDidMount() {
    if (this.props.visible) {
      this.onShow();
    }
  }

  componentWillUnmount() {
    this.unbindMaskClickListener();
    this.disableModality();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) this.onShow();else this.onHide();
    }

    if (this.mask && prevProps.dismissable !== this.props.dismissable) {
      if (this.props.dismissable) {
        this.bindMaskClickListener();
      } else {
        this.unbindMaskClickListener();
      }
    }
  }

  onShow() {
    this.container.style.zIndex = String(this.props.baseZIndex + _DomHandler.default.generateZIndex());

    if (this.props.modal) {
      this.enableModality();
    }

    if (this.props.closeOnEscape) {
      this.bindDocumentEscapeListener();
    }

    if (this.closeIcon) {
      this.closeIcon.focus();
    }

    if (this.props.onShow) {
      this.props.onShow();
    }
  }

  enableModality() {
    if (!this.mask) {
      this.mask = document.createElement('div');
      this.mask.style.zIndex = String(parseInt(this.container.style.zIndex, 10) - 1);
      let maskStyleClass = 'p-component-overlay p-sidebar-mask';

      if (this.props.blockScroll) {
        maskStyleClass += ' p-sidebar-mask-scrollblocker';
      }

      _DomHandler.default.addMultipleClasses(this.mask, maskStyleClass);

      if (this.props.dismissable) {
        this.bindMaskClickListener();
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
        let bodyChildren = document.body.children;
        let hasBlockerMasks;

        for (let i = 0; i < bodyChildren.length; i++) {
          let bodyChild = bodyChildren[i];

          if (_DomHandler.default.hasClass(bodyChild, 'p-sidebar-mask-scrollblocker')) {
            hasBlockerMasks = true;
            break;
          }
        }

        if (!hasBlockerMasks) {
          _DomHandler.default.removeClass(document.body, 'p-overflow-hidden');
        }
      }

      this.mask = null;
    }
  }

  onCloseClick(event) {
    this.props.onHide();
    event.preventDefault();
  }

  onHide() {
    this.unbindMaskClickListener();
    this.unbindDocumentEscapeListener();

    if (this.props.modal) {
      this.disableModality();
    }
  }

  bindDocumentEscapeListener() {
    this.documentEscapeListener = event => {
      if (event.which === 27) {
        if (parseInt(this.container.style.zIndex, 10) === _DomHandler.default.getCurrentZIndex() + this.props.baseZIndex) {
          this.onCloseClick(event);
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

  bindMaskClickListener() {
    if (!this.maskClickListener) {
      this.maskClickListener = event => {
        this.onCloseClick(event);
      };

      this.mask.addEventListener('click', this.maskClickListener);
    }
  }

  unbindMaskClickListener() {
    if (this.maskClickListener) {
      this.mask.removeEventListener('click', this.maskClickListener);
      this.maskClickListener = null;
    }
  }

  renderCloseIcon() {
    if (this.props.showCloseIcon) {
      return _react.default.createElement("button", {
        ref: el => this.closeIcon = el,
        className: "p-sidebar-close p-link",
        onClick: this.onCloseClick
      }, _react.default.createElement("span", {
        className: "p-sidebar-close-icon pi pi-times"
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

  render() {
    const className = (0, _classnames.default)('p-sidebar p-component', this.props.className, 'p-sidebar-' + this.props.position, {
      'p-sidebar-active': this.props.visible,
      'p-sidebar-full': this.props.fullScreen
    });
    const closeIcon = this.renderCloseIcon();
    const iconsTemplate = this.renderIconsTemplate();
    return _react.default.createElement("div", {
      ref: el => this.container = el,
      id: this.props.id,
      className: className,
      style: this.props.style
    }, closeIcon, iconsTemplate, this.props.children);
  }

}

exports.Sidebar = Sidebar;

_defineProperty(Sidebar, "defaultProps", {
  id: null,
  style: null,
  className: null,
  visible: false,
  position: 'left',
  fullScreen: false,
  blockScroll: false,
  baseZIndex: 0,
  dismissable: true,
  showCloseIcon: true,
  closeOnEscape: true,
  iconsTemplate: null,
  modal: true,
  onShow: null,
  onHide: null
});

_defineProperty(Sidebar, "propTypes", {
  id: _propTypes.default.string,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  visible: _propTypes.default.bool,
  position: _propTypes.default.string,
  fullScreen: _propTypes.default.bool,
  blockScroll: _propTypes.default.bool,
  baseZIndex: _propTypes.default.number,
  dismissable: _propTypes.default.bool,
  showCloseIcon: _propTypes.default.bool,
  closeOnEscape: _propTypes.default.bool,
  iconsTemplate: _propTypes.default.func,
  modal: _propTypes.default.bool,
  onShow: _propTypes.default.func,
  onHide: _propTypes.default.func.isRequired
});