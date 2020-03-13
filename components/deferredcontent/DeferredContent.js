"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeferredContent = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class DeferredContent extends _react.Component {
  constructor() {
    super();
    this.state = {
      loaded: false
    };
  }

  componentDidMount() {
    if (!this.state.loaded) {
      if (this.shouldLoad()) this.load();else this.bindScrollListener();
    }
  }

  bindScrollListener() {
    this.documentScrollListener = () => {
      if (this.shouldLoad()) {
        this.load();
        this.unbindScrollListener();
      }
    };

    window.addEventListener('scroll', this.documentScrollListener);
  }

  unbindScrollListener() {
    if (this.documentScrollListener) {
      window.removeEventListener('scroll', this.documentScrollListener);
      this.documentScrollListener = null;
    }
  }

  shouldLoad() {
    if (this.state.loaded) {
      return false;
    } else {
      let rect = this.container.getBoundingClientRect();
      let docElement = document.documentElement;
      let winHeight = docElement.clientHeight;
      return winHeight >= rect.top;
    }
  }

  load(event) {
    this.setState({
      loaded: true
    });

    if (this.props.onLoad) {
      this.props.onLoad(event);
    }
  }

  componentWillUnmount() {
    this.unbindScrollListener();
  }

  render() {
    return _react.default.createElement("div", {
      ref: el => this.container = el
    }, this.state.loaded ? this.props.children : null);
  }

}

exports.DeferredContent = DeferredContent;

_defineProperty(DeferredContent, "defaultProps", {
  onload: null
});

_defineProperty(DeferredContent, "propTypes", {
  onLoad: _propTypes.default.func
});