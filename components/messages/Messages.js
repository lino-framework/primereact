"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Messages = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _UIMessage = require("./UIMessage");

var _reactTransitionGroup = require("react-transition-group");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var messageIdx = 0;

class Messages extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
    this.onClose = this.onClose.bind(this);
  }

  show(value) {
    if (value) {
      let newMessages = [];

      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          value[i].id = messageIdx++;
          newMessages = [...this.state.messages, ...value];
        }
      } else {
        value.id = messageIdx++;
        newMessages = this.state.messages ? [...this.state.messages, value] : [value];
      }

      this.setState({
        messages: newMessages
      });
    }
  }

  clear() {
    this.setState({
      messages: []
    });
  }

  replace(value) {
    this.setState({
      messages: []
    }, () => this.show(value));
  }

  onClose(message) {
    let newMessages = this.state.messages.filter(msg => msg.id !== message.id);
    this.setState({
      messages: newMessages
    });

    if (this.props.onRemove) {
      this.props.onRemove(message);
    }
  }

  render() {
    return _react.default.createElement("div", {
      id: this.props.id,
      className: this.props.className,
      style: this.props.style
    }, _react.default.createElement(_reactTransitionGroup.TransitionGroup, null, this.state.messages.map((message, index) => _react.default.createElement(_reactTransitionGroup.CSSTransition, {
      key: message.id,
      classNames: "p-messages",
      timeout: {
        enter: 250,
        exit: 500
      }
    }, _react.default.createElement(_UIMessage.UIMessage, {
      message: message,
      onClick: this.props.onClick,
      onClose: this.onClose
    })))));
  }

}

exports.Messages = Messages;

_defineProperty(Messages, "defaultProps", {
  id: null,
  className: null,
  style: null,
  onRemove: null,
  onClick: null
});

_defineProperty(Messages, "propTypes", {
  id: _propTypes.default.string,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  onRemove: _propTypes.default.func,
  onClick: _propTypes.default.func
});