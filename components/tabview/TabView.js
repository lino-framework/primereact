"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabView = exports.TabPanel = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _UniqueComponentId = _interopRequireDefault(require("../utils/UniqueComponentId"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TabPanel extends _react.Component {}

exports.TabPanel = TabPanel;

_defineProperty(TabPanel, "defaultProps", {
  header: null,
  leftIcon: null,
  rightIcon: null,
  disabled: false,
  headerStyle: null,
  headerClassName: null,
  contentStyle: null,
  contentClassName: null
});

_defineProperty(TabPanel, "propTypes", {
  header: _propTypes.default.string,
  leftIcon: _propTypes.default.string,
  rightIcon: _propTypes.default.string,
  disabled: _propTypes.default.bool,
  headerStyle: _propTypes.default.object,
  headerClassName: _propTypes.default.string,
  contentStyle: _propTypes.default.object,
  contentClassName: _propTypes.default.string
});

class TabView extends _react.Component {
  constructor(props) {
    super(props);

    if (!this.props.onTabChange) {
      this.state = {
        activeIndex: this.props.activeIndex
      };
    }

    this.id = this.props.id || (0, _UniqueComponentId.default)();
  }

  isSelected(index) {
    const activeIndex = this.props.onTabChange ? this.props.activeIndex : this.state.activeIndex;
    return activeIndex === index;
  }

  onTabHeaderClick(event, tab, index) {
    if (!tab.props.disabled) {
      if (this.props.onTabChange) {
        this.props.onTabChange({
          originalEvent: event,
          index: index
        });
      } else {
        this.setState({
          activeIndex: index
        });
      }
    }

    event.preventDefault();
  }

  renderTabHeader(tab, index) {
    const selected = this.isSelected(index);
    const className = (0, _classnames.default)(tab.props.headerClassName, 'p-unselectable-text', {
      'p-tabview-selected p-highlight': selected,
      'p-disabled': tab.props.disabled
    });
    const id = this.id + '_header_' + index;
    const ariaControls = this.id + '_content_' + index;
    return _react.default.createElement("li", {
      className: className,
      style: tab.props.headerStyle,
      role: "presentation"
    }, _react.default.createElement("a", {
      role: "tab",
      href: '#' + ariaControls,
      onClick: event => this.onTabHeaderClick(event, tab, index),
      id: id,
      "aria-controls": ariaControls,
      "aria-selected": selected
    }, tab.props.leftIcon && _react.default.createElement("span", {
      className: (0, _classnames.default)('p-tabview-left-icon ', tab.props.leftIcon)
    }), _react.default.createElement("span", {
      className: "p-tabview-title"
    }, tab.props.header), tab.props.rightIcon && _react.default.createElement("span", {
      className: (0, _classnames.default)('p-tabview-right-icon ', tab.props.rightIcon)
    })));
  }

  renderTabHeaders() {
    return _react.default.Children.map(this.props.children, (tab, index) => {
      return this.renderTabHeader(tab, index);
    });
  }

  renderNavigator() {
    const headers = this.renderTabHeaders();
    return _react.default.createElement("ul", {
      className: "p-tabview-nav p-reset",
      role: "tablist"
    }, headers);
  }

  renderContent() {
    const contents = _react.default.Children.map(this.props.children, (tab, index) => {
      if (!this.props.renderActiveOnly || this.isSelected(index)) {
        return this.createContent(tab, index);
      }
    });

    return _react.default.createElement("div", {
      className: "p-tabview-panels"
    }, contents);
  }

  createContent(tab, index) {
    const selected = this.isSelected(index);
    const className = (0, _classnames.default)(tab.props.contentClassName, 'p-tabview-panel', {
      'p-hidden': !selected
    });
    const id = this.id + '_content_' + index;
    const ariaLabelledBy = this.id + '_header_' + index;
    return _react.default.createElement("div", {
      id: id,
      "aria-labelledby": ariaLabelledBy,
      "aria-hidden": !selected,
      className: className,
      style: tab.props.contentStyle,
      role: "tabpanel"
    }, !this.props.renderActiveOnly ? tab.props.children : selected && tab.props.children);
  }

  render() {
    const className = (0, _classnames.default)('p-tabview p-component p-tabview-top', this.props.className);
    const navigator = this.renderNavigator();
    const content = this.renderContent();
    return _react.default.createElement("div", {
      id: this.props.id,
      className: className,
      style: this.props.style
    }, navigator, content);
  }

}

exports.TabView = TabView;

_defineProperty(TabView, "defaultProps", {
  id: null,
  activeIndex: 0,
  style: null,
  className: null,
  renderActiveOnly: true,
  onTabChange: null
});

_defineProperty(TabView, "propTypes", {
  id: _propTypes.default.string,
  activeIndex: _propTypes.default.number,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  renderActiveOnly: _propTypes.default.bool,
  onTabChange: _propTypes.default.func
});