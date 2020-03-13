"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BreadCrumb = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BreadCrumb extends _react.Component {
  itemClick(event, item) {
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    if (!item.url) {
      event.preventDefault();
    }

    if (item.command) {
      item.command({
        originalEvent: event,
        item: item
      });
    }
  }

  renderHome() {
    if (this.props.home) {
      const className = (0, _classnames.default)('p-breadcrumb-home', this.props.home.className, {
        'p-disabled': this.props.home.disabled
      });
      return _react.default.createElement("li", {
        className: className,
        style: this.props.home.style
      }, _react.default.createElement("a", {
        href: this.props.home.url || '#',
        className: "p-menuitem-link",
        target: this.props.home.target,
        onClick: event => this.itemClick(event, this.props.home)
      }, _react.default.createElement("span", {
        className: this.props.home.icon
      })));
    } else {
      return null;
    }
  }

  renderSeparator() {
    return _react.default.createElement("li", {
      className: "p-breadcrumb-chevron pi pi-chevron-right"
    });
  }

  renderMenuitem(item, index) {
    const className = (0, _classnames.default)(item.className, {
      'p-disabled': item.disabled
    });
    return _react.default.createElement("li", {
      role: "menuitem",
      className: className,
      style: item.style
    }, _react.default.createElement("a", {
      href: item.url || '#',
      className: "p-menuitem-link",
      target: item.target,
      onClick: event => this.itemClick(event, item)
    }, _react.default.createElement("span", {
      className: "p-menuitem-text"
    }, item.label)));
  }

  renderMenuitems() {
    if (this.props.model) {
      const items = this.props.model.map((item, index) => {
        const menuitem = this.renderMenuitem(item, index);
        const separator = index === this.props.model.length - 1 ? null : this.renderSeparator();
        return _react.default.createElement(_react.default.Fragment, {
          key: item.label + '_' + index
        }, menuitem, separator);
      });
      return items;
    } else {
      return null;
    }
  }

  render() {
    const className = (0, _classnames.default)('p-breadcrumb p-component', this.props.className);
    const home = this.renderHome();
    const items = this.renderMenuitems();
    const separator = this.renderSeparator();
    return _react.default.createElement("div", {
      id: this.props.id,
      className: className,
      style: this.props.style
    }, _react.default.createElement("ul", null, home, separator, items));
  }

}

exports.BreadCrumb = BreadCrumb;

_defineProperty(BreadCrumb, "defaultProps", {
  id: null,
  model: null,
  home: null,
  style: null,
  className: null
});

_defineProperty(BreadCrumb, "propTypes", {
  id: _propTypes.default.string,
  model: _propTypes.default.array,
  home: _propTypes.default.any,
  style: _propTypes.default.object,
  className: _propTypes.default.string
});