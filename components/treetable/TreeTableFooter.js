"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TreeTableFooter = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TreeTableFooter extends _react.Component {
  renderFooterCell(column, index) {
    return _react.default.createElement("td", {
      key: column.field || index,
      className: column.props.footerClassName || column.props.className,
      style: column.props.footerStyle || column.props.style,
      rowSpan: column.props.rowSpan,
      colSpan: column.props.colSpan
    }, column.props.footer);
  }

  renderFooterRow(row, index) {
    const rowColumns = _react.default.Children.toArray(row.props.children);

    const rowFooterCells = rowColumns.map((col, index) => this.renderFooterCell(col, index));
    return _react.default.createElement("tr", {
      key: index
    }, rowFooterCells);
  }

  renderColumnGroup() {
    let rows = _react.default.Children.toArray(this.props.columnGroup.props.children);

    return rows.map((row, i) => this.renderFooterRow(row, i));
  }

  renderColumns(columns) {
    if (columns) {
      const headerCells = columns.map((col, index) => this.renderFooterCell(col, index));
      return _react.default.createElement("tr", null, headerCells);
    } else {
      return null;
    }
  }

  hasFooter() {
    if (this.props.columnGroup) {
      return true;
    } else {
      for (let i = 0; i < this.props.columns.length; i++) {
        if (this.props.columns[i].props.footer) {
          return true;
        }
      }
    }

    return false;
  }

  render() {
    let content = this.props.columnGroup ? this.renderColumnGroup() : this.renderColumns(this.props.columns);

    if (this.hasFooter()) {
      return _react.default.createElement("tfoot", {
        className: "p-treetable-tfoot"
      }, content);
    } else {
      return null;
    }
  }

}

exports.TreeTableFooter = TreeTableFooter;

_defineProperty(TreeTableFooter, "defaultProps", {
  columns: null,
  columnGroup: null
});

_defineProperty(TreeTableFooter, "propTypes", {
  columns: _propTypes.default.array,
  columnGroup: _propTypes.default.any
});