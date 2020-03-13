"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TreeTableHeader = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

var _InputText = require("../inputtext/InputText");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TreeTableHeader extends _react.Component {
  constructor(props) {
    super(props);
    this.onHeaderMouseDown = this.onHeaderMouseDown.bind(this);
    this.onFilterInput = this.onFilterInput.bind(this);
  }

  onHeaderClick(event, column) {
    if (column.props.sortable) {
      const targetNode = event.target;

      if (_DomHandler.default.hasClass(targetNode, 'p-sortable-column') || _DomHandler.default.hasClass(targetNode, 'p-column-title') || _DomHandler.default.hasClass(targetNode, 'p-sortable-column-icon') || _DomHandler.default.hasClass(targetNode.parentElement, 'p-sortable-column-icon')) {
        this.props.onSort({
          originalEvent: event,
          sortField: column.props.field,
          sortFunction: column.props.sortFunction,
          sortable: column.props.sortable
        });

        _DomHandler.default.clearSelection();
      }
    }
  }

  onHeaderMouseDown(event) {
    if (this.props.reorderableColumns) {
      if (event.target.nodeName !== 'INPUT') event.currentTarget.draggable = true;else if (event.target.nodeName === 'INPUT') event.currentTarget.draggable = false;
    }
  }

  onHeaderKeyDown(event, column) {
    if (event.key === 'Enter') {
      this.onHeaderClick(event, column);
      event.preventDefault();
    }
  }

  getMultiSortMetaData(column) {
    if (this.props.multiSortMeta) {
      for (let i = 0; i < this.props.multiSortMeta.length; i++) {
        if (this.props.multiSortMeta[i].field === column.props.field) {
          return this.props.multiSortMeta[i];
        }
      }
    }

    return null;
  }

  onResizerMouseDown(event, column) {
    if (this.props.resizableColumns && this.props.onResizeStart) {
      this.props.onResizeStart({
        originalEvent: event,
        columnEl: event.target.parentElement,
        column: column
      });
    }
  }

  onFilterInput(e, column) {
    if (column.props.filter && this.props.onFilter) {
      if (this.filterTimeout) {
        clearTimeout(this.filterTimeout);
      }

      let filterValue = e.target.value;
      this.filterTimeout = setTimeout(() => {
        this.props.onFilter({
          value: filterValue,
          field: column.props.field,
          matchMode: column.props.filterMatchMode
        });
        this.filterTimeout = null;
      }, this.filterDelay);
    }
  }

  renderSortIcon(column, sorted, sortOrder) {
    if (column.props.sortable) {
      const sortIcon = sorted ? sortOrder < 0 ? 'pi-sort-down' : 'pi-sort-up' : 'pi-sort';
      const sortIconClassName = (0, _classnames.default)('p-sortable-column-icon', 'pi pi-fw', sortIcon);
      return _react.default.createElement("span", {
        className: sortIconClassName
      });
    } else {
      return null;
    }
  }

  renderResizer(column) {
    if (this.props.resizableColumns) {
      return _react.default.createElement("span", {
        className: "p-column-resizer p-clickable",
        onMouseDown: e => this.onResizerMouseDown(e, column)
      });
    } else {
      return null;
    }
  }

  renderHeaderCell(column, index) {
    const multiSortMetaData = this.getMultiSortMetaData(column);
    const singleSorted = column.props.field === this.props.sortField;
    const multipleSorted = multiSortMetaData !== null;
    const sorted = column.props.sortable && (singleSorted || multipleSorted);
    let sortOrder = 0;
    let filterElement;
    if (singleSorted) sortOrder = this.props.sortOrder;else if (multipleSorted) sortOrder = multiSortMetaData.order;
    const sortIconElement = this.renderSortIcon(column, sorted, sortOrder);
    const className = (0, _classnames.default)(column.props.headerClassName || column.props.className, {
      'p-sortable-column': column.props.sortable,
      'p-highlight': sorted,
      'p-resizable-column': this.props.resizableColumns
    });

    if (column.props.filter) {
      filterElement = column.props.filterElement || _react.default.createElement(_InputText.InputText, {
        onInput: e => this.onFilterInput(e, column),
        type: this.props.filterType,
        defaultValue: this.props.filters && this.props.filters[this.props.field] ? this.props.filters[this.props.field].value : null,
        className: "p-column-filter",
        placeholder: column.props.filterPlaceholder,
        maxLength: column.props.filterMaxLength
      });
    }

    const resizer = this.renderResizer(column);
    return _react.default.createElement("th", {
      key: column.field || index,
      className: className,
      style: column.props.headerStyle || column.props.style,
      tabIndex: column.props.sortable ? this.props.tabIndex : null,
      onClick: e => this.onHeaderClick(e, column),
      onMouseDown: this.onHeaderMouseDown,
      onKeyDown: e => this.onHeaderKeyDown(e, column),
      rowSpan: column.props.rowSpan,
      colSpan: column.props.colSpan,
      onDragStart: this.props.onDragStart,
      onDragOver: this.props.onDragOver,
      onDragLeave: this.props.onDragLeave,
      onDrop: this.props.onDrop
    }, resizer, _react.default.createElement("span", {
      className: "p-column-title"
    }, column.props.header), sortIconElement, filterElement);
  }

  renderHeaderRow(row, index) {
    const rowColumns = _react.default.Children.toArray(row.props.children);

    const rowHeaderCells = rowColumns.map((col, index) => this.renderHeaderCell(col, index));
    return _react.default.createElement("tr", {
      key: index
    }, rowHeaderCells);
  }

  renderColumnGroup() {
    let rows = _react.default.Children.toArray(this.props.columnGroup.props.children);

    return rows.map((row, i) => this.renderHeaderRow(row, i));
  }

  renderColumns(columns) {
    if (columns) {
      const headerCells = columns.map((col, index) => this.renderHeaderCell(col, index));
      return _react.default.createElement("tr", null, headerCells);
    } else {
      return null;
    }
  }

  render() {
    const content = this.props.columnGroup ? this.renderColumnGroup() : this.renderColumns(this.props.columns);
    return _react.default.createElement("thead", {
      className: "p-treetable-thead"
    }, content);
  }

}

exports.TreeTableHeader = TreeTableHeader;

_defineProperty(TreeTableHeader, "defaultProps", {
  columns: null,
  columnGroup: null,
  sortField: null,
  sortOrder: null,
  multiSortMeta: null,
  resizableColumns: false,
  reorderableColumns: false,
  onSort: null,
  onResizeStart: null,
  onDragStart: null,
  onDragOver: null,
  onDragLeave: null,
  onDrop: null,
  onFilter: null
});

_defineProperty(TreeTableHeader, "propTypes", {
  columns: _propTypes.default.array,
  columnGroup: _propTypes.default.any,
  sortField: _propTypes.default.string,
  sortOrder: _propTypes.default.number,
  multiSortMeta: _propTypes.default.array,
  resizableColumns: _propTypes.default.bool,
  reorderableColumns: _propTypes.default.bool,
  onSort: _propTypes.default.func,
  onResizeStart: _propTypes.default.func,
  onDragStart: _propTypes.default.func,
  onDragOver: _propTypes.default.func,
  onDragLeave: _propTypes.default.func,
  onDrop: _propTypes.default.func,
  onFilter: _propTypes.default.func
});