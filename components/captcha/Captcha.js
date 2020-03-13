"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Captcha = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Captcha extends _react.Component {
  init() {
    this._instance = window.grecaptcha.render(this.targetEL, {
      'sitekey': this.props.siteKey,
      'theme': this.props.theme,
      'type': this.props.type,
      'size': this.props.size,
      'tabindex': this.props.tabIndex,
      'hl': this.props.language,
      'callback': response => {
        this.recaptchaCallback(response);
      },
      'expired-callback': () => {
        this.recaptchaExpiredCallback();
      }
    });
  }

  reset() {
    if (this._instance === null) return;
    window.grecaptcha.reset(this._instance);
  }

  getResponse() {
    if (this._instance === null) return null;
    return window.grecaptcha.getResponse(this._instance);
  }

  recaptchaCallback(response) {
    if (this.props.onResponse) {
      this.props.onResponse({
        response: response
      });
    }
  }

  recaptchaExpiredCallback() {
    if (this.props.onExpire) {
      this.props.onExpire();
    }
  }

  addRecaptchaScript() {
    this.recaptchaScript = null;

    if (!window.grecaptcha) {
      var head = document.head || document.getElementsByTagName('head')[0];
      this.recaptchaScript = document.createElement('script');
      this.recaptchaScript.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      this.recaptchaScript.async = true;
      this.recaptchaScript.defer = true;
      head.appendChild(this.recaptchaScript);
    }
  }

  componentDidMount() {
    this.addRecaptchaScript();

    if (window.grecaptcha) {
      this.init();
    } else {
      setTimeout(() => {
        if (!window.grecaptcha) {
          console.warn("Recaptcha is not loaded");
          return;
        }

        this.init();
      }, 500);
    }
  }

  componentWillUnmount() {
    if (this.recaptchaScript) {
      this.recaptchaScript.parentNode.removeChild(this.recaptchaScript);
    }
  }

  render() {
    return _react.default.createElement("div", {
      id: this.props.id,
      ref: el => this.targetEL = _reactDom.default.findDOMNode(el)
    });
  }

}

exports.Captcha = Captcha;

_defineProperty(Captcha, "defaultProps", {
  id: null,
  siteKey: null,
  theme: "light",
  type: "image",
  size: "normal",
  tabIndex: 0,
  language: "en",
  onResponse: null,
  onExpire: null
});

_defineProperty(Captcha, "propTypes", {
  id: _propTypes.default.string,
  sitekey: _propTypes.default.string,
  theme: _propTypes.default.string,
  type: _propTypes.default.string,
  size: _propTypes.default.string,
  tabindex: _propTypes.default.number,
  language: _propTypes.default.string,
  onResponse: _propTypes.default.func,
  onExpire: _propTypes.default.func
});