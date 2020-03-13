"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GrowlMessage = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class GrowlMessage extends _react.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  componentDidMount() {
    if (!this.props.message.sticky) {
      this.timeout = setTimeout(() => {
        this.onClose(null);
      }, this.props.message.life || 3000);
    }
  }

  onClose(event) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    if (this.props.onClose) {
      this.props.onClose(this.props.message);
    }

    if (event) {
      event.preventDefault();
    }
  }

  onClick() {
    if (this.props.onClick) {
      this.props.onClick(this.props.message);
    }
  }

  renderCloseIcon() {
    if (this.props.message.closable !== false) {
      return _react.default.createElement("button", {
        className: "p-growl-icon-close p-link",
        onClick: this.onClose
      }, _react.default.createElement("span", {
        className: "p-growl-icon-close-icon pi pi-times"
      }));
    } else {
      return null;
    }
  }

  render() {
    let className = (0, _classnames.default)('p-growl-item-container p-highlight', {
      'p-growl-message-info': this.props.message.severity === 'info',
      'p-growl-message-warn': this.props.message.severity === 'warn',
      'p-growl-message-error': this.props.message.severity === 'error',
      'p-growl-message-success': this.props.message.severity === 'success'
    });
    let iconClassName = (0, _classnames.default)('p-growl-image pi', {
      'pi-info-circle': this.props.message.severity === 'info',
      'pi-exclamation-triangle': this.props.message.severity === 'warn',
      'pi-times': this.props.message.severity === 'error',
      'pi-check': this.props.message.severity === 'success'
    });
    let closeIcon = this.renderCloseIcon();
    return _react.default.createElement("div", {
      ref: el => {
        this.element = el;
      },
      className: className,
      "aria-live": "polite",
      onClick: this.onClick
    }, _react.default.createElement("div", {
      className: "p-growl-item"
    }, closeIcon, _react.default.createElement("span", {
      className: iconClassName
    }), _react.default.createElement("div", {
      className: "p-growl-message"
    }, _react.default.createElement("span", {
      className: "p-growl-title"
    }, this.props.message.summary), _react.default.createElement("div", null, this.props.message.detail))));
  }

}

exports.GrowlMessage = GrowlMessage;

_defineProperty(GrowlMessage, "defaultProps", {
  message: null,
  onClose: null,
  onClick: null
});

_defineProperty(GrowlMessage, "propTypes", {
  message: _propTypes.default.object,
  onClose: _propTypes.default.func,
  onClick: _propTypes.default.func
});