"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderCell = void 0;

var _react = _interopRequireWildcard(require("react"));

var _InputText = require("../inputtext/InputText");

var _classnames = _interopRequireDefault(require("classnames"));

var _RowCheckbox = require("./RowCheckbox");

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class HeaderCell extends _react.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onFilterInput = this.onFilterInput.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onResizerMouseDown = this.onResizerMouseDown.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onClick(event) {
    if (this.props.sortable) {
      let targetNode = event.target;

      if (_DomHandler.default.hasClass(targetNode, 'p-sortable-column') || _DomHandler.default.hasClass(targetNode, 'p-column-title') || _DomHandler.default.hasClass(targetNode, 'p-sortable-column-icon') || _DomHandler.default.hasClass(targetNode.parentElement, 'p-sortable-column-icon')) {
        this.props.onSort({
          originalEvent: event,
          sortField: this.props.columnSortField || this.props.field,
          sortFunction: this.props.sortFunction,
          sortable: this.props.sortable
        });

        _DomHandler.default.clearSelection();
      }
    }
  }

  onFilterInput(e) {
    if (this.props.filter && this.props.onFilter) {
      if (this.filterTimeout) {
        clearTimeout(this.filterTimeout);
      }

      let filterValue = e.target.value;
      this.filterTimeout = setTimeout(() => {
        this.props.onFilter({
          value: filterValue,
          field: this.props.field,
          matchMode: this.props.filterMatchMode
        });
        this.filterTimeout = null;
      }, this.filterDelay);
    }
  }

  onResizerMouseDown(event) {
    if (this.props.resizableColumns && this.props.onColumnResizeStart) {
      this.props.onColumnResizeStart({
        originalEvent: event,
        columnEl: event.target.parentElement,
        columnProps: this.props
      });
      event.preventDefault();
    }
  }

  onMouseDown(event) {
    if (this.props.reorderableColumns) {
      if (event.target.nodeName !== 'INPUT') this.el.draggable = true;else if (event.target.nodeName === 'INPUT') this.el.draggable = false;
    }
  }

  onKeyDown(event) {
    if (event.key === 'Enter' && event.currentTarget === this.el) {
      this.onClick(event);
      event.preventDefault();
    }
  }

  getMultiSortMetaData() {
    if (this.props.multiSortMeta) {
      for (let i = 0; i < this.props.multiSortMeta.length; i++) {
        if (this.props.multiSortMeta[i].field === this.props.field) {
          return this.props.multiSortMeta[i];
        }
      }
    }

    return null;
  }

  renderSortIcon(sorted, sortOrder) {
    if (this.props.sortable) {
      let sortIcon = sorted ? sortOrder < 0 ? 'pi-sort-down' : 'pi-sort-up' : 'pi-sort';
      let sortIconClassName = (0, _classnames.default)('p-sortable-column-icon pi pi-fw', sortIcon);
      return _react.default.createElement("span", {
        className: sortIconClassName
      });
    } else {
      return null;
    }
  }

  render() {
    let multiSortMetaData = this.getMultiSortMetaData();
    let singleSorted = this.props.field === this.props.sortField || this.props.columnSortField != null && this.props.columnSortField === this.props.sortField;
    let multipleSorted = multiSortMetaData !== null;
    let sortOrder = 0;

    let resizer = this.props.resizableColumns && _react.default.createElement("span", {
      className: "p-column-resizer p-clickable",
      onMouseDown: this.onResizerMouseDown
    });

    let filterElement, headerCheckbox;
    if (singleSorted) sortOrder = this.props.sortOrder;else if (multipleSorted) sortOrder = multiSortMetaData.order;
    let sorted = this.props.sortable && (singleSorted || multipleSorted);
    let className = (0, _classnames.default)({
      'p-sortable-column': this.props.sortable,
      'p-highlight': sorted,
      'p-resizable-column': this.props.resizableColumns,
      'p-selection-column': this.props.selectionMode
    }, this.props.headerClassName || this.props.className);
    let sortIconElement = this.renderSortIcon(sorted, sortOrder);

    if (this.props.filter) {
      filterElement = this.props.filterElement || _react.default.createElement(_InputText.InputText, {
        onInput: this.onFilterInput,
        type: this.props.filterType,
        defaultValue: this.props.filters && this.props.filters[this.props.field] ? this.props.filters[this.props.field].value : null,
        className: "p-column-filter",
        placeholder: this.props.filterPlaceholder,
        maxLength: this.props.filterMaxLength
      });
    }

    if (this.props.selectionMode === 'multiple') {
      headerCheckbox = _react.default.createElement(_RowCheckbox.RowCheckbox, {
        onClick: this.props.onHeaderCheckboxClick,
        selected: this.props.headerCheckboxSelected,
        disabled: !this.props.value || this.props.value.length === 0
      });
    }

    return _react.default.createElement("th", {
      ref: el => this.el = el,
      tabIndex: this.props.sortable ? this.props.tabIndex : null,
      className: className,
      style: this.props.headerStyle || this.props.style,
      onClick: this.onClick,
      onMouseDown: this.onMouseDown,
      onKeyDown: this.onKeyDown,
      colSpan: this.props.colSpan,
      rowSpan: this.props.rowSpan,
      onDragStart: this.props.onDragStart,
      onDragOver: this.props.onDragOver,
      onDragLeave: this.props.onDragLeave,
      onDrop: this.props.onDrop
    }, resizer, _react.default.createElement("span", {
      className: "p-column-title"
    }, this.props.header), sortIconElement, filterElement, headerCheckbox);
  }

}

exports.HeaderCell = HeaderCell;