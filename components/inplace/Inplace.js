"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Inplace = exports.InplaceContent = exports.InplaceDisplay = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _Button = require("../button/Button");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class InplaceDisplay extends _react.Component {
  render() {
    return _react.default.createElement(_react.default.Fragment, null, this.props.children);
  }

}

exports.InplaceDisplay = InplaceDisplay;

class InplaceContent extends _react.Component {
  render() {
    return _react.default.createElement(_react.default.Fragment, null, this.props.children);
  }

}

exports.InplaceContent = InplaceContent;

class Inplace extends _react.Component {
  constructor(props) {
    super(props);

    if (!this.props.onToggle) {
      this.state = {
        active: false
      };
    }

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onDisplayKeyDown = this.onDisplayKeyDown.bind(this);
  }

  open(event) {
    if (this.props.disabled) {
      return;
    }

    if (this.props.onOpen) {
      this.props.onOpen(event);
    }

    if (this.props.onToggle) {
      this.props.onToggle({
        originalEvent: event,
        value: true
      });
    } else {
      this.setState({
        active: true
      });
    }
  }

  close(event) {
    if (this.props.onClose) {
      this.props.onClose(event);
    }

    if (this.props.onToggle) {
      this.props.onToggle({
        originalEvent: event,
        value: false
      });
    } else {
      this.setState({
        active: false
      });
    }
  }

  onDisplayKeyDown(event) {
    if (event.key === 'Enter') {
      this.open(event);
      event.preventDefault();
    }
  }

  isActive() {
    return this.props.onToggle ? this.props.active : this.state.active;
  }

  renderDisplay(content) {
    const className = (0, _classnames.default)('p-inplace-display', {
      'p-disabled': this.props.disabled
    });
    return _react.default.createElement("div", {
      className: className,
      onClick: this.open,
      onKeyDown: this.onDisplayKeyDown,
      tabIndex: this.props.tabIndex
    }, content);
  }

  renderCloseButton() {
    if (this.props.closable) {
      return _react.default.createElement(_Button.Button, {
        type: "button",
        icon: "pi pi-times",
        onClick: this.close
      });
    } else {
      return null;
    }
  }

  renderContent(content) {
    const closeButton = this.renderCloseButton();
    return _react.default.createElement("div", {
      className: "p-inplace-content"
    }, content, closeButton);
  }

  renderChildren() {
    const active = this.isActive();
    return _react.default.Children.map(this.props.children, (child, i) => {
      if (active && child.type === InplaceContent) {
        return this.renderContent(child);
      } else if (!active && child.type === InplaceDisplay) {
        return this.renderDisplay(child);
      }
    });
  }

  render() {
    const className = (0, _classnames.default)('p-inplace p-component', {
      'p-inplace-closable': this.props.closable
    }, this.props.className);
    return _react.default.createElement("div", {
      className: className
    }, this.renderChildren());
  }

}

exports.Inplace = Inplace;

_defineProperty(Inplace, "defaultProps", {
  style: null,
  className: null,
  active: false,
  closable: false,
  disabled: false,
  tabIndex: '0',
  onOpen: null,
  onClose: null,
  onToggle: null
});

_defineProperty(Inplace, "propTypes", {
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  active: _propTypes.default.bool,
  closable: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  tabIndex: _propTypes.default.string,
  onOpen: _propTypes.default.func,
  onClose: _propTypes.default.func,
  onToggle: _propTypes.default.func
});