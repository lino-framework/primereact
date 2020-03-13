"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Rating = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _Tooltip = _interopRequireDefault(require("../tooltip/Tooltip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Rating extends _react.Component {
  constructor(props) {
    super(props);
    this.clear = this.clear.bind(this);
    this.onStarKeyDown = this.onStarKeyDown.bind(this);
    this.onCancelKeyDown = this.onCancelKeyDown.bind(this);
  }

  rate(event, i) {
    if (!this.props.readonly && !this.props.disabled && this.props.onChange) {
      this.props.onChange({
        originalEvent: event,
        value: i,
        stopPropagation: () => {},
        preventDefault: () => {},
        target: {
          name: this.props.name,
          id: this.props.id,
          value: i
        }
      });
    }

    event.preventDefault();
  }

  clear(event) {
    if (!this.props.readonly && !this.props.disabled && this.props.onChange) {
      this.props.onChange({
        originalEvent: event,
        value: null,
        stopPropagation: () => {},
        preventDefault: () => {},
        target: {
          name: this.props.name,
          id: this.props.id,
          value: null
        }
      });
    }

    event.preventDefault();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.value === this.props.value && nextProps.disabled === this.props.disabled) {
      return false;
    }

    return true;
  }

  onStarKeyDown(event, value) {
    if (event.key === 'Enter') {
      this.rate(event, value);
    }
  }

  onCancelKeyDown(event) {
    if (event.key === 'Enter') {
      this.clear(event);
    }
  }

  renderStars() {
    let starsArray = [];

    for (var i = 0; i < this.props.stars; i++) {
      starsArray[i] = i + 1;
    }

    let stars = starsArray.map(value => {
      let iconClass = (0, _classnames.default)('p-rating-icon pi', {
        'pi-star-o': !this.props.value || value > this.props.value,
        'pi-star': value <= this.props.value
      });
      return _react.default.createElement("span", {
        className: iconClass,
        onClick: e => this.rate(e, value),
        key: value,
        tabIndex: this.props.disabled || this.props.readonly ? null : '0',
        onKeyDown: e => this.onStarKeyDown(e, value)
      });
    });
    return stars;
  }

  renderCancelIcon() {
    if (this.props.cancel) {
      return _react.default.createElement("span", {
        className: "p-rating-icon p-rating-cancel pi pi-ban",
        onClick: this.clear,
        tabIndex: this.props.disabled || this.props.readonly ? null : '0',
        onKeyDown: this.onCancelKeyDown
      });
    } else {
      return null;
    }
  }

  componentDidMount() {
    if (this.props.tooltip) {
      this.renderTooltip();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tooltip !== this.props.tooltip) {
      if (this.tooltip) this.tooltip.updateContent(this.props.tooltip);else this.renderTooltip();
    }
  }

  componentWillUnmount() {
    if (this.tooltip) {
      this.tooltip.destroy();
      this.tooltip = null;
    }
  }

  renderTooltip() {
    this.tooltip = new _Tooltip.default({
      target: this.element,
      content: this.props.tooltip,
      options: this.props.tooltipOptions
    });
  }

  render() {
    let className = (0, _classnames.default)('p-rating', this.props.className, {
      'p-disabled': this.props.disabled,
      'p-rating-readonly': this.props.readonly
    });
    let cancelIcon = this.renderCancelIcon();
    let stars = this.renderStars();
    return _react.default.createElement("div", {
      ref: el => this.element = el,
      id: this.props.id,
      className: className,
      style: this.props.style
    }, cancelIcon, stars);
  }

}

exports.Rating = Rating;

_defineProperty(Rating, "defaultProps", {
  id: null,
  value: null,
  disabled: false,
  readonly: false,
  stars: 5,
  cancel: true,
  style: null,
  className: null,
  tooltip: null,
  tooltipOptions: null,
  onChange: null
});

_defineProperty(Rating, "propTypes", {
  id: _propTypes.default.string,
  value: _propTypes.default.number,
  disabled: _propTypes.default.bool,
  readonly: _propTypes.default.bool,
  stars: _propTypes.default.number,
  cancel: _propTypes.default.bool,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  tooltip: _propTypes.default.string,
  tooltipOptions: _propTypes.default.object,
  onChange: _propTypes.default.func
});