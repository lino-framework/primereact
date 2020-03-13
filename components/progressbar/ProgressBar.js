"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProgressBar = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ProgressBar extends _react.Component {
  renderLabel() {
    if (this.props.showValue && this.props.value != null) {
      let label = this.props.displayValueTemplate ? this.props.displayValueTemplate(this.props.value) : this.props.value + this.props.unit;
      return _react.default.createElement("div", {
        className: "p-progressbar-label"
      }, label);
    } else {
      return null;
    }
  }

  renderDeterminate() {
    let className = (0, _classnames.default)('p-progressbar p-component p-progressbar-determinate', this.props.className);
    let label = this.renderLabel();
    return _react.default.createElement("div", {
      role: "progressbar",
      id: this.props.id,
      className: className,
      style: this.props.style,
      "aria-valuemin": "0",
      "aria-valuenow": this.props.value,
      "aria-valuemax": "100",
      "aria-label": this.props.value
    }, _react.default.createElement("div", {
      className: "p-progressbar-value p-progressbar-value-animate",
      style: {
        width: this.props.value + '%',
        display: 'block'
      }
    }), label);
  }

  renderIndeterminate() {
    let className = (0, _classnames.default)('p-progressbar p-component p-progressbar-indeterminate', this.props.className);
    return _react.default.createElement("div", {
      role: "progressbar",
      id: this.props.id,
      className: className,
      style: this.props.style
    }, _react.default.createElement("div", {
      className: "p-progressbar-indeterminate-container"
    }, _react.default.createElement("div", {
      className: "p-progressbar-value p-progressbar-value-animate"
    })));
  }

  render() {
    if (this.props.mode === 'determinate') return this.renderDeterminate();else if (this.props.mode === 'indeterminate') return this.renderIndeterminate();else throw new Error(this.props.mode + " is not a valid mode for the ProgressBar. Valid values are 'determinate' and 'indeterminate'");
  }

}

exports.ProgressBar = ProgressBar;

_defineProperty(ProgressBar, "defaultProps", {
  id: null,
  value: null,
  showValue: true,
  unit: '%',
  style: null,
  className: null,
  mode: 'determinate',
  displayValueTemplate: null
});

_defineProperty(ProgressBar, "propTypes", {
  id: _propTypes.default.string,
  value: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  showValue: _propTypes.default.bool,
  unit: _propTypes.default.string,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  mode: _propTypes.default.string,
  displayValueTemplate: _propTypes.default.func
});