"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageLinks = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class PageLinks extends _react.Component {
  onPageLinkClick(event, pageLink) {
    if (this.props.onClick) {
      this.props.onClick({
        originalEvent: event,
        value: pageLink
      });
    }

    event.preventDefault();
  }

  render() {
    let elements = this.props.value.map((pageLink, i) => {
      let pageClassName = (0, _classnames.default)('p-paginator-page p-paginator-element p-link', {
        'p-highlight': pageLink - 1 === this.props.page
      });
      return _react.default.createElement("button", {
        key: pageLink,
        className: pageClassName,
        onClick: e => this.onPageLinkClick(e, pageLink)
      }, pageLink);
    });
    return _react.default.createElement("span", {
      className: "p-paginator-pages"
    }, elements);
  }

}

exports.PageLinks = PageLinks;

_defineProperty(PageLinks, "defaultProps", {
  value: null,
  page: null,
  links: null
});

_defineProperty(PageLinks, "propTypes", {
  value: _propTypes.default.array,
  page: _propTypes.default.number,
  onClick: _propTypes.default.func
});