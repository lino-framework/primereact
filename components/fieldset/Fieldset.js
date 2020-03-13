"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Fieldset = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _UniqueComponentId = _interopRequireDefault(require("../utils/UniqueComponentId"));

var _reactTransitionGroup = require("react-transition-group");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Fieldset extends _react.Component {
  constructor(props) {
    super(props);

    if (!this.props.onToggle) {
      this.state = {
        collapsed: this.props.collapsed
      };
    }

    this.toggle = this.toggle.bind(this);
    this.id = this.props.id || (0, _UniqueComponentId.default)();
  }

  toggle(event) {
    if (this.props.toggleable) {
      const collapsed = this.props.onToggle ? this.props.collapsed : this.state.collapsed;
      if (collapsed) this.expand(event);else this.collapse(event);

      if (this.props.onToggle) {
        this.props.onToggle({
          originalEvent: event,
          value: !collapsed
        });
      }
    }

    event.preventDefault();
  }

  expand(event) {
    if (!this.props.onToggle) {
      this.setState({
        collapsed: false
      });
    }

    if (this.props.onExpand) {
      this.props.onExpand(event);
    }
  }

  collapse(event) {
    if (!this.props.onToggle) {
      this.setState({
        collapsed: true
      });
    }

    if (this.props.onCollapse) {
      this.props.onCollapse(event);
    }
  }

  isCollapsed() {
    return this.props.toggleable ? this.props.onToggle ? this.props.collapsed : this.state.collapsed : false;
  }

  renderContent(collapsed) {
    const className = (0, _classnames.default)('p-toggleable-content', {
      'p-toggleable-content-collapsed': collapsed
    });
    const id = this.id + '_content';
    return _react.default.createElement(_reactTransitionGroup.CSSTransition, {
      classNames: "p-toggleable-content",
      timeout: {
        enter: 400,
        exit: 250
      },
      in: !this.isCollapsed()
    }, _react.default.createElement("div", {
      id: id,
      className: className,
      "aria-hidden": collapsed,
      role: "region"
    }, _react.default.createElement("div", {
      className: "p-fieldset-content"
    }, this.props.children)));
  }

  renderToggleIcon(collapsed) {
    if (this.props.toggleable) {
      const className = (0, _classnames.default)('p-fieldset-toggler pi', {
        'pi-plus': collapsed,
        'pi-minus': !collapsed
      });
      return _react.default.createElement("span", {
        className: className
      });
    } else {
      return null;
    }
  }

  renderLegendContent(collapsed) {
    if (this.props.toggleable) {
      const toggleIcon = this.renderToggleIcon(collapsed);
      const ariaControls = this.id + '_content';
      return _react.default.createElement("a", {
        href: '#' + ariaControls,
        "aria-controls": ariaControls,
        "aria-expanded": !collapsed,
        tabIndex: this.props.toggleable ? null : -1
      }, toggleIcon, _react.default.createElement("span", {
        className: "p-fieldset-legend-text"
      }, this.props.legend));
    } else {
      return _react.default.createElement("span", {
        className: "p-fieldset-legend-text"
      }, this.props.legend);
    }
  }

  renderLegend(collapsed) {
    const legendContent = this.renderLegendContent(collapsed);
    return _react.default.createElement("legend", {
      className: "p-fieldset-legend p-unselectable-text",
      onClick: this.toggle
    }, legendContent);
  }

  render() {
    const className = (0, _classnames.default)('p-fieldset p-component', this.props.className, {
      'p-fieldset-toggleable': this.props.toggleable
    });
    const collapsed = this.isCollapsed();
    const legend = this.renderLegend(collapsed);
    const content = this.renderContent(collapsed);
    return _react.default.createElement("fieldset", {
      id: this.props.id,
      className: className,
      style: this.props.style,
      onClick: this.props.onClick
    }, legend, content);
  }

}

exports.Fieldset = Fieldset;

_defineProperty(Fieldset, "defaultProps", {
  id: null,
  legend: null,
  className: null,
  style: null,
  toggleable: null,
  collapsed: null,
  onExpand: null,
  onCollapse: null,
  onToggle: null,
  onClick: null
});

_defineProperty(Fieldset, "propTypes", {
  id: _propTypes.default.string,
  legend: _propTypes.default.any,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  toggleable: _propTypes.default.bool,
  collapsed: _propTypes.default.bool,
  onExpand: _propTypes.default.func,
  onCollapse: _propTypes.default.func,
  onToggle: _propTypes.default.func,
  onClick: _propTypes.default.func
});