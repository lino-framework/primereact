"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UIMessage = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class UIMessage extends _react.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  componentDidMount() {
    if (!this.props.message.sticky) {
      this.timeout = setTimeout(() => {
        this.onClose(null);
      }, this.props.message.life || 3000);
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
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
      event.stopPropagation();
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
        className: "p-messages-close p-link",
        onClick: this.onClose
      }, _react.default.createElement("i", {
        className: "p-messages-close-icon pi pi-times"
      }));
    } else {
      return null;
    }
  }

  renderMessages() {
    if (this.props.message) {
      return _react.default.createElement("ul", null, _react.default.createElement("li", {
        key: this.props.message.id
      }, _react.default.createElement("span", {
        className: "p-messages-summary"
      }, this.props.message.summary), _react.default.createElement("span", {
        className: "p-messages-detail"
      }, this.props.message.detail)));
    } else {
      return null;
    }
  }

  render() {
    let className = 'p-messages p-component p-messages-' + this.props.message.severity;
    let icon = (0, _classnames.default)('p-messages-icon pi ', {
      'pi-info-circle': this.props.message.severity === 'info',
      'pi-exclamation-triangle': this.props.message.severity === 'warn',
      'pi-times': this.props.message.severity === 'error',
      'pi-check': this.props.message.severity === 'success'
    });
    let closeIcon = this.renderCloseIcon();
    let messages = this.renderMessages();
    return _react.default.createElement("div", {
      ref: el => {
        this.container = el;
      },
      className: className,
      onClick: this.onClick
    }, _react.default.createElement("div", {
      className: "p-messages-wrapper"
    }, closeIcon, _react.default.createElement("span", {
      className: icon
    }), messages));
  }

}

exports.UIMessage = UIMessage;

_defineProperty(UIMessage, "defaultProps", {
  message: null,
  onClose: null,
  onClick: null
});

_defineProperty(UIMessage, "propTypes", {
  message: _propTypes.default.object,
  onClose: _propTypes.default.func,
  onClick: _propTypes.default.func
});