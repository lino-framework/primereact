"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RowRadioButton = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RowRadioButton extends _react.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    if (this.props.onClick) {
      this.props.onClick({
        originalEvent: event,
        data: this.props.rowData
      });
    }
  }

  render() {
    let className = (0, _classnames.default)('p-radiobutton-box p-component p-radiobutton-relative', {
      'p-highlight': this.props.selected
    });
    let iconClassName = (0, _classnames.default)('p-radiobutton-icon p-clickable', {
      'pi pi-circle-on': this.props.selected
    });
    return _react.default.createElement("div", {
      className: "p-radiobutton p-component"
    }, _react.default.createElement("div", {
      className: "p-hidden-accessible"
    }, _react.default.createElement("input", {
      type: "radio"
    })), _react.default.createElement("div", {
      className: className,
      onClick: this.onClick
    }, _react.default.createElement("span", {
      className: iconClassName
    })));
  }

}

exports.RowRadioButton = RowRadioButton;

_defineProperty(RowRadioButton, "defaultProps", {
  rowData: null,
  onClick: null,
  selected: false
});

_defineProperty(RowRadioButton, "propTypes", {
  rowData: _propTypes.default.object,
  onClick: _propTypes.default.func,
  selected: _propTypes.default.bool
});