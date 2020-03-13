"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Panel = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _UniqueComponentId = _interopRequireDefault(require("../utils/UniqueComponentId"));

var _reactTransitionGroup = require("react-transition-group");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Panel extends _react.Component {
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

  renderToggleIcon(collapsed) {
    if (this.props.toggleable) {
      const id = this.id + '_label';
      const ariaControls = this.id + '_content';
      const toggleIcon = collapsed ? this.props.expandIcon : this.props.collapseIcon;
      return _react.default.createElement("a", {
        href: '#' + ariaControls,
        className: "p-panel-titlebar-icon p-panel-titlebar-toggler",
        onClick: this.toggle,
        id: id,
        "aria-controls": ariaControls,
        "aria-expanded": !collapsed,
        role: "tab"
      }, _react.default.createElement("span", {
        className: toggleIcon
      }));
    } else {
      return null;
    }
  }

  renderHeader(collapsed) {
    if (this.props.header || this.props.toggleable) {
      const toggleIcon = this.renderToggleIcon(collapsed);
      return _react.default.createElement("div", {
        className: "p-panel-titlebar"
      }, _react.default.createElement("span", {
        className: "p-panel-title"
      }, this.props.header), toggleIcon);
    } else {
      return null;
    }
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
      className: className,
      "aria-hidden": collapsed,
      role: "region"
    }, _react.default.createElement("div", {
      id: id,
      className: "p-panel-content"
    }, this.props.children)));
  }

  render() {
    const className = (0, _classnames.default)('p-panel p-component', this.props.className);
    const collapsed = this.isCollapsed();
    const header = this.renderHeader(collapsed);
    const content = this.renderContent(collapsed);
    return _react.default.createElement("div", {
      id: this.props.id,
      className: className,
      style: this.props.style
    }, header, content);
  }

}

exports.Panel = Panel;

_defineProperty(Panel, "defaultProps", {
  id: null,
  header: null,
  toggleable: null,
  style: null,
  className: null,
  collapsed: null,
  expandIcon: 'pi pi-plus',
  collapseIcon: 'pi pi-minus',
  onExpand: null,
  onCollapse: null,
  onToggle: null
});

_defineProperty(Panel, "propTypes", {
  id: _propTypes.default.string,
  header: _propTypes.default.any,
  toggleable: _propTypes.default.bool,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  collapsed: _propTypes.default.bool,
  expandIcon: _propTypes.default.string,
  collapseIcon: _propTypes.default.string,
  onExpand: _propTypes.default.func,
  onCollapse: _propTypes.default.func,
  onToggle: _propTypes.default.func
});