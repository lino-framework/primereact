"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Chart = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var ChartJS = _interopRequireWildcard(require("chart.js"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Chart extends _react.Component {
  initChart() {
    this.chart = new ChartJS.Chart(this.canvas, {
      type: this.props.type,
      data: this.props.data,
      options: this.props.options
    });
  }

  getCanvas() {
    return this.canvas;
  }

  getBase64Image() {
    return this.chart.toBase64Image();
  }

  generateLegend() {
    if (this.chart) {
      this.chart.generateLegend();
    }
  }

  refresh() {
    if (this.chart) {
      this.chart.update();
    }
  }

  reinit() {
    if (this.chart) {
      this.chart.destroy();
      this.initChart();
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.data === this.props.data) {
      return false;
    }

    return true;
  }

  componentDidMount() {
    this.initChart();
  }

  componentDidUpdate(prevProps, prevState) {
    this.reinit();
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  render() {
    let className = (0, _classnames.default)('p-chart', this.props.className),
        style = Object.assign({
      width: this.props.width,
      height: this.props.height
    }, this.props.style);
    return _react.default.createElement("div", {
      id: this.props.id,
      style: style,
      className: className
    }, _react.default.createElement("canvas", {
      ref: el => {
        this.canvas = el;
      },
      width: this.props.width,
      height: this.props.height
    }));
  }

}

exports.Chart = Chart;

_defineProperty(Chart, "defaultProps", {
  id: null,
  type: null,
  data: null,
  options: null,
  width: null,
  height: null,
  style: null,
  className: null
});

_defineProperty(Chart, "propTypes", {
  id: _propTypes.default.string,
  type: _propTypes.default.string,
  data: _propTypes.default.object,
  options: _propTypes.default.object,
  width: _propTypes.default.string,
  height: _propTypes.default.string,
  style: _propTypes.default.object,
  className: _propTypes.default.string
});