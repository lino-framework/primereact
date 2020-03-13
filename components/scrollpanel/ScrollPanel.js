"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollPanel = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ScrollPanel extends _react.Component {
  constructor(props) {
    super(props);
    this.moveBar = this.moveBar.bind(this);
    this.onXBarMouseDown = this.onXBarMouseDown.bind(this);
    this.onYBarMouseDown = this.onYBarMouseDown.bind(this);
    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
    this.onDocumentMouseUp = this.onDocumentMouseUp.bind(this);
  }

  calculateContainerHeight() {
    let containerStyles = getComputedStyle(this.container),
        xBarStyles = getComputedStyle(this.xBar),
        pureContainerHeight = _DomHandler.default.getHeight(this.container) - parseInt(xBarStyles['height'], 10);

    if (containerStyles['max-height'] !== "none" && pureContainerHeight === 0) {
      if (this.content.offsetHeight + parseInt(xBarStyles['height'], 10) > parseInt(containerStyles['max-height'], 10)) {
        this.container.style.height = containerStyles['max-height'];
      } else {
        this.container.style.height = this.content.offsetHeight + parseFloat(containerStyles.paddingTop) + parseFloat(containerStyles.paddingBottom) + parseFloat(containerStyles.borderTopWidth) + parseFloat(containerStyles.borderBottomWidth) + "px";
      }
    }
  }

  moveBar() {
    /* horizontal scroll */
    let totalWidth = this.content.scrollWidth;
    let ownWidth = this.content.clientWidth;
    let bottom = (this.container.clientHeight - this.xBar.clientHeight) * -1;
    this.scrollXRatio = ownWidth / totalWidth;
    /* vertical scroll */

    let totalHeight = this.content.scrollHeight;
    let ownHeight = this.content.clientHeight;
    let right = (this.container.clientWidth - this.yBar.clientWidth) * -1;
    this.scrollYRatio = ownHeight / totalHeight;
    this.frame = this.requestAnimationFrame(() => {
      if (this.scrollXRatio >= 1) {
        _DomHandler.default.addClass(this.xBar, 'p-scrollpanel-hidden');
      } else {
        _DomHandler.default.removeClass(this.xBar, 'p-scrollpanel-hidden');

        this.xBar.style.cssText = 'width:' + Math.max(this.scrollXRatio * 100, 10) + '%; left:' + this.content.scrollLeft / totalWidth * 100 + '%;bottom:' + bottom + 'px;';
      }

      if (this.scrollYRatio >= 1) {
        _DomHandler.default.addClass(this.yBar, 'p-scrollpanel-hidden');
      } else {
        _DomHandler.default.removeClass(this.yBar, 'p-scrollpanel-hidden');

        this.yBar.style.cssText = 'height:' + Math.max(this.scrollYRatio * 100, 10) + '%; top: calc(' + this.content.scrollTop / totalHeight * 100 + '% - ' + this.xBar.clientHeight + 'px);right:' + right + 'px;';
      }
    });
  }

  onYBarMouseDown(e) {
    this.isYBarClicked = true;
    this.lastPageY = e.pageY;

    _DomHandler.default.addClass(this.yBar, 'p-scrollpanel-grabbed');

    _DomHandler.default.addClass(document.body, 'p-scrollpanel-grabbed');

    document.addEventListener('mousemove', this.onDocumentMouseMove);
    document.addEventListener('mouseup', this.onDocumentMouseUp);
    e.preventDefault();
  }

  onXBarMouseDown(e) {
    this.isXBarClicked = true;
    this.lastPageX = e.pageX;

    _DomHandler.default.addClass(this.xBar, 'p-scrollpanel-grabbed');

    _DomHandler.default.addClass(document.body, 'p-scrollpanel-grabbed');

    document.addEventListener('mousemove', this.onDocumentMouseMove);
    document.addEventListener('mouseup', this.onDocumentMouseUp);
    e.preventDefault();
  }

  onDocumentMouseMove(e) {
    if (this.isXBarClicked) {
      this.onMouseMoveForXBar(e);
    } else if (this.isYBarClicked) {
      this.onMouseMoveForYBar(e);
    } else {
      this.onMouseMoveForXBar(e);
      this.onMouseMoveForYBar(e);
    }
  }

  onMouseMoveForXBar(e) {
    let deltaX = e.pageX - this.lastPageX;
    this.lastPageX = e.pageX;
    this.frame = this.requestAnimationFrame(() => {
      this.content.scrollLeft += deltaX / this.scrollXRatio;
    });
  }

  onMouseMoveForYBar(e) {
    let deltaY = e.pageY - this.lastPageY;
    this.lastPageY = e.pageY;
    this.frame = this.requestAnimationFrame(() => {
      this.content.scrollTop += deltaY / this.scrollYRatio;
    });
  }

  onDocumentMouseUp(e) {
    _DomHandler.default.removeClass(this.yBar, 'p-scrollpanel-grabbed');

    _DomHandler.default.removeClass(this.xBar, 'p-scrollpanel-grabbed');

    _DomHandler.default.removeClass(document.body, 'p-scrollpanel-grabbed');

    document.removeEventListener('mousemove', this.onDocumentMouseMove);
    document.removeEventListener('mouseup', this.onDocumentMouseUp);
    this.isXBarClicked = false;
    this.isYBarClicked = false;
  }

  requestAnimationFrame(f) {
    let frame = window.requestAnimationFrame || this.timeoutFrame;
    return frame(f);
  }

  refresh() {
    this.moveBar();
  }

  componentDidMount() {
    this.moveBar();
    this.moveBar = this.moveBar.bind(this);
    window.addEventListener('resize', this.moveBar);
    this.calculateContainerHeight();
    this.initialized = true;
  }

  componentWillUnmount() {
    if (this.initialized) {
      window.removeEventListener('resize', this.moveBar);
    }

    if (this.frame) {
      window.cancelAnimationFrame(this.frame);
    }
  }

  render() {
    let className = (0, _classnames.default)('p-scrollpanel p-component', this.props.className);
    return _react.default.createElement("div", {
      ref: el => {
        this.container = el;
      },
      id: this.props.id,
      className: className,
      style: this.props.style
    }, _react.default.createElement("div", {
      className: "p-scrollpanel-wrapper"
    }, _react.default.createElement("div", {
      ref: el => {
        this.content = el;
      },
      className: "p-scrollpanel-content",
      onScroll: this.moveBar,
      onMouseEnter: this.moveBar
    }, this.props.children)), _react.default.createElement("div", {
      ref: el => {
        this.xBar = el;
      },
      className: "p-scrollpanel-bar p-scrollpanel-bar-x",
      onMouseDown: this.onXBarMouseDown
    }), _react.default.createElement("div", {
      ref: el => {
        this.yBar = el;
      },
      className: "p-scrollpanel-bar p-scrollpanel-bar-y",
      onMouseDown: this.onYBarMouseDown
    }));
  }

}

exports.ScrollPanel = ScrollPanel;

_defineProperty(ScrollPanel, "defaultProps", {
  id: null,
  style: null,
  className: null
});

_defineProperty(ScrollPanel, "propTypes", {
  id: _propTypes.default.string,
  style: _propTypes.default.object,
  className: _propTypes.default.string
});