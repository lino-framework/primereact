"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AutoCompletePanel = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _ObjectUtils = _interopRequireDefault(require("../utils/ObjectUtils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AutoCompletePanel extends _react.Component {
  renderElement() {
    let items;

    if (this.props.suggestions) {
      items = this.props.suggestions.map((suggestion, index) => {
        let itemContent = this.props.itemTemplate ? this.props.itemTemplate(suggestion) : this.props.field ? _ObjectUtils.default.resolveFieldData(suggestion, this.props.field) : suggestion;
        return _react.default.createElement("li", {
          key: index + '_item',
          className: "p-autocomplete-list-item",
          onClick: e => this.props.onItemClick(e, suggestion)
        }, itemContent);
      });
    }

    return _react.default.createElement("div", {
      ref: el => this.element = el,
      className: "p-autocomplete-panel p-input-overlay",
      style: {
        maxHeight: this.props.scrollHeight
      }
    }, _react.default.createElement("ul", {
      className: "p-autocomplete-items p-autocomplete-list p-component p-reset"
    }, items));
  }

  render() {
    let element = this.renderElement();

    if (this.props.appendTo) {
      return _reactDom.default.createPortal(element, this.props.appendTo);
    } else {
      return element;
    }
  }

}

exports.AutoCompletePanel = AutoCompletePanel;

_defineProperty(AutoCompletePanel, "defaultProps", {
  suggestions: null,
  field: null,
  appendTo: null,
  itemTemplate: null,
  onItemClick: null,
  scrollHeight: '200px'
});

_defineProperty(AutoCompletePanel, "propTypes", {
  suggestions: _propTypes.default.array,
  field: _propTypes.default.string,
  appendTo: _propTypes.default.any,
  itemTemplate: _propTypes.default.func,
  onItemClick: _propTypes.default.func,
  scrollHeight: _propTypes.default.string
});