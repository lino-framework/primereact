"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Lightbox = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Lightbox extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currentImage: null
    };
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.onImageLoad = this.onImageLoad.bind(this);
    this.onTargetClick = this.onTargetClick.bind(this);
  }

  bindDocumentClickListener() {
    if (!this.documentClickListener) {
      this.documentClickListener = event => {
        if (this.panel && !this.panel.contains(event.target)) {
          this.hide();
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

  componentWillMount() {
    this.unbindDocumentClickListener();
  }

  onImageClick(event, image, i) {
    this.index = i;
    this.setState({
      loading: true
    });
    this.content.style.width = 32 + 'px';
    this.content.style.height = 32 + 'px';
    this.show();
    this.displayImage(image);
    this.preventDocumentClickListener = true;
    event.preventDefault();
  }

  onTargetClick(event) {
    this.show();
    event.preventDefault();
  }

  show() {
    this.mask = document.createElement('div');
    this.mask.style.zIndex = String(_DomHandler.default.generateZIndex());

    _DomHandler.default.addMultipleClasses(this.mask, 'p-component-overlay p-dialog-mask');

    document.body.appendChild(this.mask);
    this.panel.style.zIndex = String(_DomHandler.default.generateZIndex());
    this.setState({
      visible: true
    });
    this.bindDocumentClickListener();
  }

  hide() {
    this.index = null;
    this.setState({
      currentImage: null
    });

    if (this.mask) {
      document.body.removeChild(this.mask);
      this.mask = null;
    }

    this.setState({
      visible: false
    });
    this.unbindDocumentClickListener();
  }

  displayImage(image) {
    setTimeout(() => {
      this.setState({
        currentImage: image
      });
    }, 1000);
  }

  prev() {
    this.setState({
      loading: true
    });

    if (this.index > 0) {
      this.displayImage(this.props.images[--this.index]);
    }
  }

  next() {
    this.setState({
      loading: true
    });

    if (this.index <= this.props.images.length - 1) {
      this.displayImage(this.props.images[++this.index]);
    }
  }

  onImageLoad(event) {
    let image = event.target;
    image.style.visibility = 'hidden';
    image.style.display = 'block';

    let imageWidth = _DomHandler.default.getOuterWidth(image);

    let imageHeight = _DomHandler.default.getOuterHeight(image);

    image.style.display = 'none';
    image.style.visibility = 'visible';
    this.content.style.width = imageWidth + 'px';
    this.content.style.height = imageHeight + 'px';
    this.panel.style.left = parseInt(this.panel.style.left, 10) + (_DomHandler.default.getOuterWidth(this.panel) - imageWidth) / 2 + 'px';
    this.panel.style.top = parseInt(this.panel.style.top, 10) + (_DomHandler.default.getOuterHeight(this.panel) - imageHeight) / 2 + 'px';
    setTimeout(() => {
      _DomHandler.default.fadeIn(image, 500);

      image.style.display = 'block';
      this.setState({
        loading: false
      });
    }, parseInt(this.props.effectDuration, 10));
  }

  renderLeftNav() {
    const className = (0, _classnames.default)('p-lightbox-nav-left p-link', {
      'p-hidden': !(this.props.images && this.props.images.length && this.index !== 0 && this.state.currentImage)
    });
    return _react.default.createElement("button", {
      className: className,
      onClick: this.prev
    }, _react.default.createElement("span", {
      className: "p-lightbox-nav-icon pi pi-chevron-left"
    }));
  }

  renderRightNav() {
    const className = (0, _classnames.default)('p-lightbox-nav-right p-link', {
      'p-hidden': !(this.props.images && this.props.images.length && this.index < this.props.images.length - 1 && this.state.currentImage)
    });
    return _react.default.createElement("button", {
      className: className,
      onClick: this.next
    }, _react.default.createElement("span", {
      className: "p-lightbox-nav-icon pi pi-chevron-right"
    }));
  }

  renderImages() {
    return _react.default.createElement("div", {
      style: this.props.style,
      className: this.props.className
    }, this.props.images && this.props.images.map((image, index) => {
      var imageItem = _react.default.createElement("a", {
        href: image.source,
        onClick: event => this.onImageClick(event, image, index),
        key: index,
        className: "p-lightbox-image-target"
      }, _react.default.createElement("img", {
        src: image.thumbnail,
        title: image.title,
        alt: image.alt
      }));

      return imageItem;
    }));
  }

  renderTarget() {
    if (this.props.target) {
      return _react.default.createElement("span", {
        onClick: this.onTargetClick
      }, this.props.target);
    } else {
      return this.renderImages();
    }
  }

  renderContent() {
    let content;

    if (this.state.visible) {
      if (this.props.target) content = this.props.children;else content = _react.default.createElement("img", {
        src: this.state.currentImage ? this.state.currentImage.source : null,
        onLoad: this.onImageLoad,
        alt: "",
        style: {
          display: this.state.loading ? 'none' : 'inline'
        }
      });
    }

    return _react.default.createElement("div", {
      className: "p-lightbox-content",
      ref: el => this.content = el,
      style: {
        transitionDuration: this.props.effectDuration,
        transitionTimingFunction: this.props.easing
      }
    }, content);
  }

  render() {
    const leftButton = this.renderLeftNav();
    const rightButton = this.renderRightNav();
    const target = this.renderTarget();
    const content = this.renderContent();
    const containerClassName = (0, _classnames.default)('p-lightbox p-component p-hidden', {
      'p-lightbox-loading': this.state.loading
    });
    return _react.default.createElement("div", {
      id: this.props.id
    }, target, _react.default.createElement("div", {
      className: containerClassName,
      style: {
        transitionProperty: 'all',
        transitionDuration: this.props.effectDuration,
        transitionTimingFunction: this.props.easing,
        display: this.state.visible ? 'block' : 'none'
      },
      ref: el => this.panel = el
    }, _react.default.createElement("div", {
      className: "p-lightbox-content-wrapper"
    }, leftButton, content, rightButton)));
  }

}

exports.Lightbox = Lightbox;

_defineProperty(Lightbox, "defaultProps", {
  id: null,
  images: null,
  target: null,
  style: null,
  className: null,
  easing: 'ease-out',
  effectDuration: '500ms'
});

_defineProperty(Lightbox, "propTypes", {
  id: _propTypes.default.string,
  images: _propTypes.default.array,
  target: _propTypes.default.any,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  easing: _propTypes.default.string,
  effectDuration: _propTypes.default.string
});