"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SplitButton = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Button = require("../button/Button");

var _classnames = _interopRequireDefault(require("classnames"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

var _SplitButtonItem = require("./SplitButtonItem");

var _SplitButtonPanel = require("./SplitButtonPanel");

var _Tooltip = _interopRequireDefault(require("../tooltip/Tooltip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class SplitButton extends _react.Component {
  constructor(props) {
    super(props);
    this.onDropdownButtonClick = this.onDropdownButtonClick.bind(this);
  }

  onDropdownButtonClick(event) {
    if (this.documentClickListener) {
      this.dropdownClick = true;
    }

    if (this.panel.element.offsetParent) this.hide();else this.show();
  }

  show() {
    this.panel.element.style.zIndex = String(_DomHandler.default.generateZIndex());
    this.panel.element.style.display = 'block';
    setTimeout(() => {
      _DomHandler.default.addClass(this.panel.element, 'p-menu-overlay-visible');

      _DomHandler.default.removeClass(this.panel.element, 'p-menu-overlay-hidden');
    }, 1);
    this.alignPanel();
    this.bindDocumentListener();
  }

  hide() {
    if (this.panel && this.panel.element) {
      _DomHandler.default.addClass(this.panel.element, 'p-menu-overlay-hidden');

      _DomHandler.default.removeClass(this.panel.element, 'p-menu-overlay-visible');

      setTimeout(() => {
        if (this.panel && this.panel.element) {
          this.panel.element.style.display = 'none';

          _DomHandler.default.removeClass(this.panel.element, 'p-menu-overlay-hidden');
        }
      }, 150);
    }

    this.unbindDocumentListener();
    this.dropdownClick = false;
  }

  alignPanel() {
    if (this.props.appendTo) {
      this.panel.element.style.minWidth = _DomHandler.default.getWidth(this.container) + 'px';

      _DomHandler.default.absolutePosition(this.panel.element, this.container);
    } else {
      _DomHandler.default.relativePosition(this.panel.element, this.container);
    }
  }

  bindDocumentListener() {
    if (!this.documentClickListener) {
      this.documentClickListener = () => {
        if (this.dropdownClick) this.dropdownClick = false;else this.hide();
      };

      document.addEventListener('click', this.documentClickListener);
    }
  }

  unbindDocumentListener() {
    if (this.documentClickListener) {
      document.removeEventListener('click', this.documentClickListener);
      this.documentClickListener = null;
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
    this.unbindDocumentListener();

    if (this.tooltip) {
      this.tooltip.destroy();
      this.tooltip = null;
    }
  }

  renderTooltip() {
    this.tooltip = new _Tooltip.default({
      target: this.container,
      content: this.props.tooltip,
      options: this.props.tooltipOptions
    });
  }

  renderItems() {
    if (this.props.model) {
      return this.props.model.map((menuitem, index) => {
        return _react.default.createElement(_SplitButtonItem.SplitButtonItem, {
          menuitem: menuitem,
          key: index
        });
      });
    } else {
      return null;
    }
  }

  render() {
    let className = (0, _classnames.default)('p-splitbutton p-buttonset p-component', this.props.className, {
      'p-disabled': this.props.disabled
    });
    let items = this.renderItems();
    return _react.default.createElement("div", {
      id: this.props.id,
      className: className,
      style: this.props.style,
      ref: el => this.container = el
    }, _react.default.createElement(_Button.Button, {
      type: "button",
      icon: this.props.icon,
      label: this.props.label,
      onClick: this.props.onClick,
      disabled: this.props.disabled,
      tabIndex: this.props.tabIndex
    }), _react.default.createElement(_Button.Button, {
      type: "button",
      className: "p-splitbutton-menubutton",
      icon: "pi pi-caret-down",
      onClick: this.onDropdownButtonClick,
      disabled: this.props.disabled
    }), _react.default.createElement(_SplitButtonPanel.SplitButtonPanel, {
      ref: el => this.panel = el,
      appendTo: this.props.appendTo,
      menuStyle: this.props.menuStyle,
      menuClassName: this.props.menuClassName
    }, items));
  }

}

exports.SplitButton = SplitButton;

_defineProperty(SplitButton, "defaultProps", {
  id: null,
  label: null,
  icon: null,
  model: null,
  disabled: null,
  style: null,
  className: null,
  menuStyle: null,
  menuClassName: null,
  tabIndex: null,
  onClick: null,
  appendTo: null,
  tooltip: null,
  tooltipOptions: null
});

_defineProperty(SplitButton, "propTypes", {
  id: _propTypes.default.string,
  label: _propTypes.default.string,
  icon: _propTypes.default.string,
  model: _propTypes.default.array,
  disabled: _propTypes.default.bool,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  menustyle: _propTypes.default.object,
  menuClassName: _propTypes.default.string,
  tabIndex: _propTypes.default.string,
  onClick: _propTypes.default.func,
  appendTo: _propTypes.default.object,
  tooltip: _propTypes.default.string,
  tooltipOptions: _propTypes.default.object
});