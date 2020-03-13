"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Card = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Card extends _react.Component {
  renderHeader() {
    return _react.default.createElement("div", {
      className: "p-card-header"
    }, this.props.header);
  }

  renderBody() {
    let title, subTitle, footer, children;

    if (this.props.title) {
      title = _react.default.createElement("div", {
        className: "p-card-title"
      }, this.props.title);
    }

    if (this.props.subTitle) {
      subTitle = _react.default.createElement("div", {
        className: "p-card-subtitle"
      }, this.props.subTitle);
    }

    if (this.props.footer) {
      footer = _react.default.createElement("div", {
        className: "p-card-footer"
      }, " ", this.props.footer);
    }

    if (this.props.children) {
      children = _react.default.createElement("div", {
        className: "p-card-content"
      }, " ", this.props.children, " ");
    }

    return _react.default.createElement("div", {
      className: "p-card-body"
    }, title, subTitle, children, footer);
  }

  render() {
    let header, body;
    let className = (0, _classnames.default)('p-card p-component', this.props.className);

    if (this.props.header) {
      header = this.renderHeader();
    }

    body = this.renderBody();
    return _react.default.createElement("div", {
      className: className,
      style: this.props.style
    }, header, body);
  }

}

exports.Card = Card;

_defineProperty(Card, "defaultProps", {
  id: null,
  header: null,
  footer: null,
  title: null,
  subTitle: null,
  style: null,
  className: null
});

_defineProperty(Card, "propTypes", {
  id: _propTypes.default.string,
  header: _propTypes.default.any,
  footer: _propTypes.default.any,
  title: _propTypes.default.string,
  subTitle: _propTypes.default.string,
  style: _propTypes.default.object,
  className: _propTypes.default.string
});