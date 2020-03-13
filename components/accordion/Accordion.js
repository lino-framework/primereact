"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Accordion = exports.AccordionTab = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _UniqueComponentId = _interopRequireDefault(require("../utils/UniqueComponentId"));

var _reactTransitionGroup = require("react-transition-group");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AccordionTab extends _react.Component {}

exports.AccordionTab = AccordionTab;

_defineProperty(AccordionTab, "defaultProps", {
  header: null,
  disabled: false,
  headerStyle: null,
  headerClassName: null,
  contentStyle: null,
  contentClassName: null
});

_defineProperty(AccordionTab, "propTypes", {
  header: _propTypes.default.any,
  disabled: _propTypes.default.bool,
  headerStyle: _propTypes.default.object,
  headerClassName: _propTypes.default.string,
  contentStyle: _propTypes.default.object,
  contentClassName: _propTypes.default.string
});

class Accordion extends _react.Component {
  constructor(props) {
    super(props);

    if (!this.props.onTabChange) {
      this.state = {
        activeIndex: props.activeIndex
      };
    }

    this.contentWrappers = [];
    this.id = this.props.id || (0, _UniqueComponentId.default)();
  }

  onTabHeaderClick(event, tab, index) {
    if (!tab.props.disabled) {
      const selected = this.isSelected(index);
      let newActiveIndex = null;

      if (this.props.multiple) {
        let indexes = (this.props.onTabChange ? this.props.activeIndex : this.state.activeIndex) || [];
        if (selected) indexes = indexes.filter(i => i !== index);else indexes = [...indexes, index];
        newActiveIndex = indexes;
      } else {
        newActiveIndex = selected ? null : index;
      }

      let callback = selected ? this.props.onTabClose : this.props.onTabOpen;

      if (callback) {
        callback({
          originalEvent: event,
          index: index
        });
      }

      if (this.props.onTabChange) {
        this.props.onTabChange({
          originalEvent: event,
          index: newActiveIndex
        });
      } else {
        this.setState({
          activeIndex: newActiveIndex
        });
      }
    }

    event.preventDefault();
  }

  isSelected(index) {
    const activeIndex = this.props.onTabChange ? this.props.activeIndex : this.state.activeIndex;
    return this.props.multiple ? activeIndex && activeIndex.indexOf(index) >= 0 : activeIndex === index;
  }

  renderTabHeader(tab, selected, index) {
    const tabHeaderClass = (0, _classnames.default)(tab.props.headerClassName, 'p-accordion-header', {
      'p-highlight': selected,
      'p-disabled': tab.props.disabled
    });
    const id = this.id + '_header_' + index;
    const ariaControls = this.id + '_content_' + index;
    const tabIndex = tab.props.disabled ? -1 : null;
    return _react.default.createElement("div", {
      className: tabHeaderClass,
      style: tab.props.headerStyle
    }, _react.default.createElement("a", {
      href: '#' + ariaControls,
      id: id,
      "aria-controls": ariaControls,
      role: "tab",
      "aria-expanded": selected,
      onClick: event => this.onTabHeaderClick(event, tab, index),
      tabIndex: tabIndex
    }, _react.default.createElement("span", {
      className: (0, _classnames.default)('p-accordion-toggle-icon pi pi-fw', {
        'pi-caret-right': !selected,
        'pi-caret-down': selected
      })
    }), _react.default.createElement("span", {
      className: "p-accordion-header-text"
    }, tab.props.header)));
  }

  renderTabContent(tab, selected, index) {
    const className = (0, _classnames.default)(tab.props.contentClassName, 'p-toggleable-content', {
      'p-toggleable-content-collapsed': !selected
    });
    const id = this.id + '_content_' + index;
    return _react.default.createElement(_reactTransitionGroup.CSSTransition, {
      classNames: "p-toggleable-content",
      timeout: {
        enter: 400,
        exit: 250
      },
      in: selected
    }, _react.default.createElement("div", {
      id: id,
      className: className,
      style: tab.props.contentStyle
    }, _react.default.createElement("div", {
      className: "p-accordion-content"
    }, tab.props.children)));
  }

  renderTab(tab, index) {
    const selected = this.isSelected(index);
    const tabHeader = this.renderTabHeader(tab, selected, index);
    const tabContent = this.renderTabContent(tab, selected, index);
    return _react.default.createElement("div", {
      key: tab.props.header,
      className: "p-accordion-tab"
    }, tabHeader, tabContent);
  }

  renderTabs() {
    return _react.default.Children.map(this.props.children, (tab, index) => {
      return this.renderTab(tab, index);
    });
  }

  render() {
    const className = (0, _classnames.default)('p-accordion p-component p-reset', this.props.className);
    const tabs = this.renderTabs();
    return _react.default.createElement("div", {
      ref: el => this.container = el,
      id: this.id,
      className: className,
      style: this.props.style
    }, tabs);
  }

}

exports.Accordion = Accordion;

_defineProperty(Accordion, "defaultProps", {
  id: null,
  activeIndex: null,
  className: null,
  style: null,
  multiple: false,
  onTabOpen: null,
  onTabClose: null,
  onTabChange: null
});

_defineProperty(Accordion, "propTypes", {
  id: _propTypes.default.string,
  activeIndex: _propTypes.default.any,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  multiple: _propTypes.default.bool,
  onTabOpen: _propTypes.default.func,
  onTabClose: _propTypes.default.func,
  onTabChange: _propTypes.default.func
});