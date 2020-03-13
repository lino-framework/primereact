"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FullCalendar = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ObjectUtils = _interopRequireDefault(require("../utils/ObjectUtils"));

var _core = require("@fullcalendar/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class FullCalendar extends _react.Component {
  componentDidMount() {
    this.config = {
      theme: true
    };

    if (this.props.options) {
      for (let prop in this.props.options) {
        this.config[prop] = this.props.options[prop];
      }
    }

    this.initialize();
  }

  componentDidUpdate(prevProps) {
    if (!this.calendar) {
      this.initialize();
    } else {
      if (!_ObjectUtils.default.equals(prevProps.events, this.props.events)) {
        this.calendar.removeAllEventSources();
        this.calendar.addEventSource(this.props.events);
      }

      if (!_ObjectUtils.default.equals(prevProps.options, this.props.options)) {
        for (let prop in this.props.options) {
          let optionValue = this.props.options[prop];
          this.config[prop] = optionValue;
          this.calendar.setOption(prop, optionValue);
        }
      }
    }
  }

  initialize() {
    this.calendar = new _core.Calendar(this.element, this.config);
    this.calendar.render();

    if (this.props.events) {
      this.calendar.removeAllEventSources();
      this.calendar.addEventSource(this.props.events);
    }
  }

  componentWillUnmount() {
    if (this.calendar) {
      this.calendar.destroy();
    }
  }

  render() {
    return _react.default.createElement("div", {
      id: this.props.id,
      ref: el => this.element = el,
      style: this.props.style,
      className: this.props.className
    });
  }

}

exports.FullCalendar = FullCalendar;

_defineProperty(FullCalendar, "defaultProps", {
  id: null,
  events: [],
  style: null,
  className: null,
  options: null
});

_defineProperty(FullCalendar, "propTypes", {
  id: _propTypes.default.string,
  events: _propTypes.default.array,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  options: _propTypes.default.object
});