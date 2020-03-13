"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Slider = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Slider extends _react.Component {
  constructor(props) {
    super(props);
    this.onBarClick = this.onBarClick.bind(this);
  }

  componentWillUnmount() {
    this.unbindDragListeners();
    this.unbindTouchListeners();
  }

  onDragStart(event, index) {
    if (this.disabled) {
      return;
    }

    this.dragging = true;
    this.updateDomData();
    this.sliderHandleClick = true;
    this.handleIndex = index;
    event.preventDefault();
  }

  onMouseDown(event, index) {
    this.bindDragListeners();
    this.onDragStart(event, index);
  }

  onTouchStart(event, index) {
    this.bindTouchListeners();
    this.onDragStart(event, index);
  }

  onBarClick(event) {
    if (this.props.disabled) {
      return;
    }

    if (!this.sliderHandleClick) {
      this.updateDomData();
      this.setValue(event);
    }

    this.sliderHandleClick = false;
  }

  onDrag(event) {
    if (this.dragging) {
      this.setValue(event);
      event.preventDefault();
    }
  }

  onDragEnd(event) {
    if (this.dragging) {
      this.dragging = false;

      if (this.props.onSlideEnd) {
        if (this.props.range) this.props.onSlideEnd({
          originalEvent: event,
          values: this.props.value
        });else this.props.onSlideEnd({
          originalEvent: event,
          value: this.props.value
        });
      }

      this.unbindDragListeners();
      this.unbindTouchListeners();
    }
  }

  bindDragListeners() {
    if (!this.dragListener) {
      this.dragListener = this.onDrag.bind(this);
      document.addEventListener('mousemove', this.dragListener);
    }

    if (!this.dragEndListener) {
      this.dragEndListener = this.onDragEnd.bind(this);
      document.addEventListener('mouseup', this.dragEndListener);
    }
  }

  unbindDragListeners() {
    if (this.dragListener) {
      document.removeEventListener('mousemove', this.dragListener);
      this.dragListener = null;
    }

    if (this.dragEndListener) {
      document.removeEventListener('mouseup', this.dragEndListener);
      this.dragEndListener = null;
    }
  }

  bindTouchListeners() {
    if (!this.dragListener) {
      this.dragListener = this.onDrag.bind(this);
      document.addEventListener('touchmove', this.dragListener);
    }

    if (!this.dragEndListener) {
      this.dragEndListener = this.onDragEnd.bind(this);
      document.addEventListener('touchend', this.dragEndListener);
    }
  }

  unbindTouchListeners() {
    if (this.dragListener) {
      document.removeEventListener('touchmove', this.dragListener);
      this.dragListener = null;
    }

    if (this.dragEndListener) {
      document.removeEventListener('touchend', this.dragEndListener);
      this.dragEndListener = null;
    }
  }

  updateDomData() {
    let rect = this.el.getBoundingClientRect();
    this.initX = rect.left + _DomHandler.default.getWindowScrollLeft();
    this.initY = rect.top + _DomHandler.default.getWindowScrollTop();
    this.barWidth = this.el.offsetWidth;
    this.barHeight = this.el.offsetHeight;
  }

  setValue(event) {
    let handleValue;
    let pageX = event.touches ? event.touches[0].pageX : event.pageX;
    if (this.props.orientation === 'horizontal') handleValue = (pageX - this.initX) * 100 / this.barWidth;else handleValue = (this.initY + this.barHeight - event.pageY) * 100 / this.barHeight;
    let newValue = (this.props.max - this.props.min) * (handleValue / 100) + this.props.min;

    if (this.props.step) {
      const oldValue = this.props.range ? this.props.value[this.handleIndex] : this.props.value;
      const diff = newValue - oldValue;
      if (diff < 0) newValue = oldValue + Math.ceil(newValue / this.props.step - oldValue / this.props.step) * this.props.step;else if (diff > 0) newValue = oldValue + Math.floor(newValue / this.props.step - oldValue / this.props.step) * this.props.step;
    }

    this.updateValue(event, newValue);
  }

  updateValue(event, value) {
    if (this.props.range) {
      let newValue = value;

      if (this.handleIndex === 0) {
        if (newValue < this.props.min) newValue = this.props.min;else if (newValue > this.props.value[1]) newValue = this.props.value[1];
      } else {
        if (newValue > this.props.max) newValue = this.props.max;else if (newValue < this.props.value[0]) newValue = this.props.value[0];
      }

      let newValues = [...this.props.value];
      newValues[this.handleIndex] = Math.floor(newValue);

      if (this.props.onChange) {
        this.props.onChange({
          originalEvent: event,
          value: newValues
        });
      }
    } else {
      let newValue = value;
      if (newValue < this.props.min) newValue = this.props.min;else if (newValue > this.props.max) newValue = this.props.max;

      if (this.props.onChange) {
        this.props.onChange({
          originalEvent: event,
          value: Math.floor(newValue)
        });
      }
    }
  }

  renderHandle(leftValue, bottomValue, index) {
    return _react.default.createElement("span", {
      onMouseDown: event => this.onMouseDown(event, index),
      onTouchStart: event => this.onTouchStart(event, index),
      tabIndex: this.props.tabIndex,
      className: "p-slider-handle",
      style: {
        transition: this.dragging ? 'none' : null,
        left: leftValue + '%',
        bottom: bottomValue + '%'
      }
    });
  }

  renderRangeSlider() {
    let values = this.props.value || [0, 0];
    let horizontal = this.props.orientation === 'horizontal';
    const handleValueStart = (values[0] < this.props.min ? 0 : values[0] - this.props.min) * 100 / (this.props.max - this.props.min);
    const handleValueEnd = (values[1] > this.props.max ? 100 : values[1] - this.props.min) * 100 / (this.props.max - this.props.min);
    const rangeStartHandle = horizontal ? this.renderHandle(handleValueStart, 'auto', 0) : this.renderHandle('auto', handleValueStart, 0);
    const rangeEndHandle = horizontal ? this.renderHandle(handleValueEnd, 'auto', 1) : this.renderHandle('auto', handleValueEnd, 1);
    const rangeStyle = horizontal ? {
      left: handleValueStart + '%',
      width: handleValueEnd - handleValueStart + '%'
    } : {
      bottom: handleValueStart + '%',
      height: handleValueEnd - handleValueStart + '%'
    };
    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("span", {
      className: "p-slider-range",
      style: rangeStyle
    }), rangeStartHandle, rangeEndHandle);
  }

  renderSingleSlider() {
    let value = this.props.value || 0;
    let handleValue;
    if (value < this.props.min) handleValue = 0;else if (value > this.props.max) handleValue = 100;else handleValue = (value - this.props.min) * 100 / (this.props.max - this.props.min);
    const rangeStyle = this.props.orientation === 'horizontal' ? {
      width: handleValue + '%'
    } : {
      height: handleValue + '%'
    };
    const handle = this.props.orientation === 'horizontal' ? this.renderHandle(handleValue, 'auto', null) : this.renderHandle('auto', handleValue, null);
    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("span", {
      className: "p-slider-range p-slider-range-min ui-widget-header ui-corner-all",
      style: rangeStyle
    }), handle);
  }

  render() {
    const className = (0, _classnames.default)('p-slider p-component', this.props.className, {
      'p-disabled': this.props.disabled,
      'p-slider-horizontal': this.props.orientation === 'horizontal',
      'p-slider-vertical': this.props.orientation === 'vertical'
    });
    const content = this.props.range ? this.renderRangeSlider() : this.renderSingleSlider();
    return _react.default.createElement("div", {
      id: this.props.id,
      ref: el => this.el = el,
      style: this.props.style,
      className: className,
      onClick: this.onBarClick
    }, content);
  }

}

exports.Slider = Slider;

_defineProperty(Slider, "defaultProps", {
  id: null,
  value: null,
  min: 0,
  max: 100,
  orientation: "horizontal",
  step: null,
  range: false,
  style: null,
  className: null,
  disabled: false,
  tabIndex: '0',
  onChange: null,
  onSlideEnd: null
});

_defineProperty(Slider, "propTypes", {
  id: _propTypes.default.string,
  value: _propTypes.default.any,
  min: _propTypes.default.number,
  max: _propTypes.default.number,
  orientation: _propTypes.default.string,
  step: _propTypes.default.number,
  range: _propTypes.default.bool,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  disabled: _propTypes.default.bool,
  tabIndex: _propTypes.default.string,
  onChange: _propTypes.default.func,
  onSlideEnd: _propTypes.default.func
});