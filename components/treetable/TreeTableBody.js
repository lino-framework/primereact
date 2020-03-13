"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TreeTableBody = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _TreeTableRow = require("./TreeTableRow");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TreeTableBody extends _react.Component {
  createRow(node) {
    return _react.default.createElement(_TreeTableRow.TreeTableRow, {
      key: node.key || JSON.stringify(node.data),
      level: 0,
      node: node,
      columns: this.props.columns,
      expandedKeys: this.props.expandedKeys,
      onToggle: this.props.onToggle,
      onExpand: this.props.onExpand,
      onCollapse: this.props.onCollapse,
      selectionMode: this.props.selectionMode,
      selectionKeys: this.props.selectionKeys,
      onSelectionChange: this.props.onSelectionChange,
      metaKeySelection: this.props.metaKeySelection,
      onRowClick: this.props.onRowClick,
      onSelect: this.props.onSelect,
      onUnselect: this.props.onUnselect,
      propagateSelectionUp: this.props.propagateSelectionUp,
      propagateSelectionDown: this.props.propagateSelectionDown,
      rowClassName: this.props.rowClassName,
      contextMenuSelectionKey: this.props.contextMenuSelectionKey,
      onContextMenuSelectionChange: this.props.onContextMenuSelectionChange,
      onContextMenu: this.props.onContextMenu
    });
  }

  renderRows() {
    if (this.props.paginator && !this.props.lazy) {
      let rpp = this.props.rows || 0;
      let startIndex = this.props.first || 0;
      let endIndex = startIndex + rpp;
      let rows = [];

      for (let i = startIndex; i < endIndex; i++) {
        let rowData = this.props.value[i];
        if (rowData) rows.push(this.createRow(this.props.value[i]));else break;
      }

      return rows;
    } else {
      return this.props.value.map(node => this.createRow(node));
    }
  }

  renderEmptyMessage() {
    if (this.props.loading) {
      return null;
    } else {
      const colSpan = this.props.columns ? this.props.columns.length : null;
      return _react.default.createElement("tr", null, _react.default.createElement("td", {
        className: "p-treetable-emptymessage",
        colSpan: colSpan
      }, this.props.emptyMessage));
    }
  }

  render() {
    const content = this.props.value && this.props.value.length ? this.renderRows() : this.renderEmptyMessage();
    return _react.default.createElement("tbody", {
      className: "p-treetable-tbody"
    }, content);
  }

}

exports.TreeTableBody = TreeTableBody;

_defineProperty(TreeTableBody, "defaultProps", {
  value: null,
  columns: null,
  expandedKeys: null,
  contextMenuSelectionKey: null,
  paginator: false,
  first: null,
  rows: null,
  selectionMode: null,
  selectionKeys: null,
  metaKeySelection: true,
  propagateSelectionUp: true,
  propagateSelectionDown: true,
  lazy: false,
  rowClassName: null,
  emptyMessage: "No records found",
  loading: false,
  onExpand: null,
  onCollapse: null,
  onToggle: null,
  onRowClick: null,
  onSelect: null,
  onUnselect: null,
  onSelectionChange: null,
  onContextMenuSelectionChange: null,
  onContextMenu: null
});

_defineProperty(TreeTableBody, "propTypes", {
  value: _propTypes.default.array,
  columns: _propTypes.default.array,
  expandedKeys: _propTypes.default.object,
  contextMenuSelectionKey: _propTypes.default.any,
  paginator: _propTypes.default.bool,
  first: _propTypes.default.number,
  rows: _propTypes.default.number,
  selectionMode: _propTypes.default.string,
  selectionKeys: _propTypes.default.any,
  metaKeySelection: _propTypes.default.bool,
  propagateSelectionUp: _propTypes.default.bool,
  propagateSelectionDown: _propTypes.default.bool,
  lazy: _propTypes.default.bool,
  rowClassName: _propTypes.default.func,
  emptyMessage: _propTypes.default.string,
  loading: _propTypes.default.bool,
  onExpand: _propTypes.default.func,
  onCollapse: _propTypes.default.func,
  onToggle: _propTypes.default.func,
  onRowClick: _propTypes.default.func,
  onSelect: _propTypes.default.func,
  onUnselect: _propTypes.default.func,
  onSelectionChange: _propTypes.default.func,
  onContextMenuSelectionChange: _propTypes.default.func,
  onContextMenu: _propTypes.default.func
});