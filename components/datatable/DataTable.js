"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataTable = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _Paginator = require("../paginator/Paginator");

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

var _ObjectUtils = _interopRequireDefault(require("../utils/ObjectUtils"));

var _ScrollableView = require("./ScrollableView");

var _TableBody = require("./TableBody");

var _TableFooter = require("./TableFooter");

var _TableHeader = require("./TableHeader");

var _TableLoadingBody = require("./TableLoadingBody");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class DataTable extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {};

    if (!this.props.onPage) {
      this.state.first = props.first;
      this.state.rows = props.rows;
    }

    if (!this.props.onSort) {
      this.state.sortField = props.sortField;
      this.state.sortOrder = props.sortOrder;
      this.state.multiSortMeta = props.multiSortMeta;
    }

    if (!this.props.onFilter) {
      this.state.filters = props.filters;
    }

    if (this.isStateful()) {
      this.restoreState(this.state);
    }

    this.onPageChange = this.onPageChange.bind(this);
    this.onSort = this.onSort.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onColumnResizeStart = this.onColumnResizeStart.bind(this);
    this.onHeaderCheckboxClick = this.onHeaderCheckboxClick.bind(this);
    this.onColumnDragStart = this.onColumnDragStart.bind(this);
    this.onColumnDragOver = this.onColumnDragOver.bind(this);
    this.onColumnDragLeave = this.onColumnDragLeave.bind(this);
    this.onColumnDrop = this.onColumnDrop.bind(this);
    this.onVirtualScroll = this.onVirtualScroll.bind(this);
    this.frozenSelectionMode = null;
  }

  getFirst() {
    return this.props.onPage ? this.props.first : this.state.first;
  }

  getRows() {
    return this.props.onPage ? this.props.rows : this.state.rows;
  }

  getSortField() {
    return this.props.onSort ? this.props.sortField : this.state.sortField;
  }

  getSortOrder() {
    return this.props.onSort ? this.props.sortOrder : this.state.sortOrder;
  }

  getMultiSortMeta() {
    return this.props.onSort ? this.props.multiSortMeta : this.state.multiSortMeta;
  }

  getFilters() {
    return this.props.onFilter ? this.props.filters : this.state.filters;
  }

  getStorage() {
    switch (this.props.stateStorage) {
      case 'local':
        return window.localStorage;

      case 'session':
        return window.sessionStorage;

      default:
        throw new Error(this.props.stateStorage + ' is not a valid value for the state storage, supported values are "local" and "session".');
    }
  }

  isStateful() {
    return this.props.stateKey != null;
  }

  saveState() {
    const storage = this.getStorage();
    let state = {};

    if (this.props.paginator) {
      state.first = this.getFirst();
      state.rows = this.getRows();
    }

    if (this.getSortField()) {
      state.sortField = this.getSortField();
      state.sortOrder = this.getSortOrder();
      state.multiSortMeta = this.getMultiSortMeta();
    }

    if (this.hasFilter()) {
      state.filters = this.getFilters();
    }

    if (this.props.resizableColumns) {
      this.saveColumnWidths(state);
    }

    if (this.props.reorderableColumns) {
      state.columnOrder = this.state.columnOrder;
    }

    if (this.props.expandedRows) {
      state.expandedRows = this.props.expandedRows;
    }

    if (this.props.selection && this.props.onSelectionChange) {
      state.selection = this.props.selection;
    }

    if (Object.keys(state).length) {
      storage.setItem(this.props.stateKey, JSON.stringify(state));
    }
  }

  clearState() {
    const storage = this.getStorage();

    if (this.props.stateKey) {
      storage.removeItem(this.props.stateKey);
    }
  }

  restoreState(state) {
    const storage = this.getStorage();
    const stateString = storage.getItem(this.props.stateKey);

    if (stateString) {
      let restoredState = JSON.parse(stateString);

      if (this.props.paginator) {
        if (this.props.onPage) {
          this.props.onPage({
            first: restoredState.first,
            rows: restoredState.rows
          });
        } else {
          state.first = restoredState.first;
          state.rows = restoredState.rows;
        }
      }

      if (restoredState.sortField) {
        if (this.props.onSort) {
          this.props.onSort({
            sortField: restoredState.sortField,
            sortOrder: restoredState.sortOrder,
            multiSortMeta: restoredState.multiSortMeta
          });
        } else {
          state.sortField = restoredState.sortField;
          state.sortOrder = restoredState.sortOrder;
          state.multiSortMeta = restoredState.multiSortMeta;
        }
      }

      if (restoredState.filters) {
        if (this.props.onFilter) {
          this.props.onFilter({
            filters: restoredState.filters
          });
        } else {
          state.filters = restoredState.filters;
        }
      }

      if (this.props.resizableColumns) {
        this.columnWidthsState = restoredState.columnWidths;
        this.tableWidthState = restoredState.tableWidth;
      }

      if (this.props.reorderableColumns) {
        state.columnOrder = restoredState.columnOrder;
      }

      if (restoredState.expandedRows && this.props.onRowToggle) {
        this.props.onRowToggle({
          data: restoredState.expandedRows
        });
      }

      if (restoredState.selection && this.props.onSelectionChange) {
        this.props.onSelectionChange({
          value: restoredState.selection
        });
      }
    }
  }

  saveColumnWidths(state) {
    let widths = [];

    let headers = _DomHandler.default.find(this.container, '.p-datatable-thead > tr > th');

    headers.map(header => widths.push(_DomHandler.default.getOuterWidth(header)));
    state.columnWidths = widths.join(',');

    if (this.props.columnResizeMode === 'expand') {
      state.tableWidth = this.props.scrollable ? _DomHandler.default.findSingle(this.container, '.p-datatable-scrollable-header-table').style.width : _DomHandler.default.getOuterWidth(this.table) + 'px';
    }
  }

  restoreColumnWidths() {
    if (this.columnWidthsState) {
      let widths = this.columnWidthsState.split(',');

      if (this.props.columnResizeMode === 'expand' && this.tableWidthState) {
        if (this.props.scrollable) {
          this.setScrollableItemsWidthOnExpandResize(null, this.tableWidthState, 0);
        } else {
          this.table.style.width = this.tableWidthState;
          this.container.style.width = this.tableWidthState;
        }
      }

      if (this.props.scrollable) {
        let headerCols = _DomHandler.default.find(this.container, '.p-datatable-scrollable-header-table > colgroup > col');

        let bodyCols = _DomHandler.default.find(this.container, '.p-datatable-scrollable-body-table > colgroup > col');

        headerCols.map((col, index) => col.style.width = widths[index] + 'px');
        bodyCols.map((col, index) => col.style.width = widths[index] + 'px');
      } else {
        let headers = _DomHandler.default.find(this.table, '.p-datatable-thead > tr > th');

        headers.map((header, index) => header.style.width = widths[index] + 'px');
      }
    }
  }

  onPageChange(event) {
    if (this.props.onPage) this.props.onPage(event);else this.setState({
      first: event.first,
      rows: event.rows
    });

    if (this.props.onValueChange) {
      this.props.onValueChange();
    }
  }

  createPaginator(position, totalRecords, data) {
    let className = 'p-paginator-' + position;
    return _react.default.createElement(_Paginator.Paginator, {
      first: this.getFirst(),
      rows: this.getRows(),
      pageLinkSize: this.props.pageLinkSize,
      className: className,
      onPageChange: this.onPageChange,
      template: this.props.paginatorTemplate,
      totalRecords: totalRecords,
      rowsPerPageOptions: this.props.rowsPerPageOptions,
      currentPageReportTemplate: this.props.currentPageReportTemplate,
      leftContent: this.props.paginatorLeft,
      rightContent: this.props.paginatorRight,
      alwaysShow: this.props.alwaysShowPaginator
    });
  }

  onSort(event) {
    let sortField = event.sortField;
    let sortOrder = this.props.defaultSortOrder;
    let multiSortMeta;
    this.columnSortable = event.sortable;
    this.columnSortFunction = event.sortFunction;

    if (this.props.sortMode === 'multiple') {
      let metaKey = event.originalEvent.metaKey || event.originalEvent.ctrlKey;
      multiSortMeta = this.getMultiSortMeta();

      if (multiSortMeta && multiSortMeta instanceof Array) {
        const sortMeta = multiSortMeta.find(sortMeta => sortMeta.field === sortField);
        sortOrder = sortMeta ? sortMeta.order * -1 : sortOrder;
      }

      if (!multiSortMeta || !metaKey) {
        multiSortMeta = [];
      }

      this.addSortMeta({
        field: sortField,
        order: sortOrder
      }, multiSortMeta);
    } else {
      sortOrder = this.getSortField() === sortField ? this.getSortOrder() * -1 : sortOrder;
    }

    if (this.props.onSort) {
      this.props.onSort({
        sortField: sortField,
        sortOrder: sortOrder,
        multiSortMeta: multiSortMeta
      });
    } else {
      this.setState({
        sortField: sortField,
        sortOrder: sortOrder,
        first: 0,
        multiSortMeta: multiSortMeta
      });
    }

    if (this.props.onValueChange) {
      this.props.onValueChange(this.processData({
        sortField: sortField,
        sortOrder: sortOrder,
        multiSortMeta: multiSortMeta
      }));
    }
  }

  addSortMeta(meta, multiSortMeta) {
    let index = -1;

    for (let i = 0; i < multiSortMeta.length; i++) {
      if (multiSortMeta[i].field === meta.field) {
        index = i;
        break;
      }
    }

    if (index >= 0) multiSortMeta[index] = meta;else multiSortMeta.push(meta);
  }

  sortSingle(data, sortField, sortOrder) {
    let value = [...data];

    if (this.columnSortable && this.columnSortFunction) {
      value = this.columnSortFunction({
        field: this.getSortField(),
        order: this.getSortOrder()
      });
    } else {
      value.sort((data1, data2) => {
        const value1 = _ObjectUtils.default.resolveFieldData(data1, sortField);

        const value2 = _ObjectUtils.default.resolveFieldData(data2, sortField);

        let result = null;
        if (value1 == null && value2 != null) result = -1;else if (value1 != null && value2 == null) result = 1;else if (value1 == null && value2 == null) result = 0;else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2, undefined, {
          numeric: true
        });else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
        return sortOrder * result;
      });
    }

    return value;
  }

  sortMultiple(data, multiSortMeta) {
    let value = [...data];
    value.sort((data1, data2) => {
      return this.multisortField(data1, data2, multiSortMeta, 0);
    });
    return value;
  }

  multisortField(data1, data2, multiSortMeta, index) {
    const value1 = _ObjectUtils.default.resolveFieldData(data1, multiSortMeta[index].field);

    const value2 = _ObjectUtils.default.resolveFieldData(data2, multiSortMeta[index].field);

    let result = null;

    if (typeof value1 === 'string' || value1 instanceof String) {
      if (value1.localeCompare && value1 !== value2) {
        return multiSortMeta[index].order * value1.localeCompare(value2, undefined, {
          numeric: true
        });
      }
    } else {
      result = value1 < value2 ? -1 : 1;
    }

    if (value1 === value2) {
      return multiSortMeta.length - 1 > index ? this.multisortField(data1, data2, multiSortMeta, index + 1) : 0;
    }

    return multiSortMeta[index].order * result;
  }

  filter(value, field, mode) {
    this.onFilter({
      value: value,
      field: field,
      matchMode: mode
    });
  }

  onFilter(event) {
    let currentFilters = this.getFilters();
    let newFilters = currentFilters ? _objectSpread({}, currentFilters) : {};
    if (!this.isFilterBlank(event.value)) newFilters[event.field] = {
      value: event.value,
      matchMode: event.matchMode
    };else if (newFilters[event.field]) delete newFilters[event.field];

    if (this.props.onFilter) {
      this.props.onFilter({
        filters: newFilters
      });
    } else {
      this.setState({
        first: 0,
        filters: newFilters
      });
    }

    if (this.props.onValueChange) {
      this.props.onValueChange(this.processData({
        filters: newFilters
      }));
    }
  }

  hasFilter() {
    let filters = this.getFilters() || this.props.globalFilter;
    return filters && Object.keys(filters).length > 0;
  }

  isFilterBlank(filter) {
    if (filter !== null && filter !== undefined) {
      if (typeof filter === 'string' && filter.trim().length === 0 || filter instanceof Array && filter.length === 0) return true;else return false;
    }

    return true;
  }

  hasFooter() {
    if (this.props.children) {
      if (this.props.footerColumnGroup) {
        return true;
      } else {
        return this.hasChildrenFooter(this.props.children);
      }
    } else {
      return false;
    }
  }

  hasChildrenFooter(children) {
    let hasFooter = false;

    if (children) {
      if (children instanceof Array) {
        for (let i = 0; i < children.length; i++) {
          hasFooter = hasFooter || this.hasChildrenFooter(children[i]);
        }
      } else {
        return children.props && children.props.footer !== null;
      }
    }

    return hasFooter;
  }

  onColumnResizeStart(event) {
    let containerLeft = _DomHandler.default.getOffset(this.container).left;

    this.resizeColumn = event.columnEl;
    this.resizeColumnProps = event.columnProps;
    this.columnResizing = true;
    this.lastResizerHelperX = event.originalEvent.pageX - containerLeft + this.container.scrollLeft;
    this.bindColumnResizeEvents();
  }

  onColumnResize(event) {
    let containerLeft = _DomHandler.default.getOffset(this.container).left;

    _DomHandler.default.addClass(this.container, 'p-unselectable-text');

    this.resizerHelper.style.height = this.container.offsetHeight + 'px';
    this.resizerHelper.style.top = 0 + 'px';
    this.resizerHelper.style.left = event.pageX - containerLeft + this.container.scrollLeft + 'px';
    this.resizerHelper.style.display = 'block';
  }

  onColumnResizeEnd(event) {
    let delta = this.resizerHelper.offsetLeft - this.lastResizerHelperX;
    let columnWidth = this.resizeColumn.offsetWidth;
    let newColumnWidth = columnWidth + delta;
    let minWidth = this.resizeColumn.style.minWidth || 15;

    if (columnWidth + delta > parseInt(minWidth, 10)) {
      if (this.props.columnResizeMode === 'fit') {
        let nextColumn = this.resizeColumn.nextElementSibling;
        let nextColumnWidth = nextColumn.offsetWidth - delta;

        if (newColumnWidth > 15 && nextColumnWidth > 15) {
          if (this.props.scrollable) {
            let scrollableView = this.findParentScrollableView(this.resizeColumn);

            let scrollableBodyTable = _DomHandler.default.findSingle(scrollableView, 'table.p-datatable-scrollable-body-table');

            let scrollableHeaderTable = _DomHandler.default.findSingle(scrollableView, 'table.p-datatable-scrollable-header-table');

            let scrollableFooterTable = _DomHandler.default.findSingle(scrollableView, 'table.p-datatable-scrollable-footer-table');

            let resizeColumnIndex = _DomHandler.default.index(this.resizeColumn);

            this.resizeColGroup(scrollableHeaderTable, resizeColumnIndex, newColumnWidth, nextColumnWidth);
            this.resizeColGroup(scrollableBodyTable, resizeColumnIndex, newColumnWidth, nextColumnWidth);
            this.resizeColGroup(scrollableFooterTable, resizeColumnIndex, newColumnWidth, nextColumnWidth);
          } else {
            this.resizeColumn.style.width = newColumnWidth + 'px';

            if (nextColumn) {
              nextColumn.style.width = nextColumnWidth + 'px';
            }
          }
        }
      } else if (this.props.columnResizeMode === 'expand') {
        if (this.props.scrollable) {
          this.setScrollableItemsWidthOnExpandResize(this.resizeColumn, newColumnWidth, delta);
        } else {
          this.table.style.width = this.table.offsetWidth + delta + 'px';
          this.resizeColumn.style.width = newColumnWidth + 'px';
        }
      }

      if (this.props.onColumnResizeEnd) {
        this.props.onColumnResizeEnd({
          element: this.resizeColumn,
          column: this.resizeColumnProps,
          delta: delta
        });
      }

      if (this.isStateful()) {
        this.saveState();
      }
    }

    this.resizerHelper.style.display = 'none';
    this.resizeColumn = null;
    this.resizeColumnProps = null;

    _DomHandler.default.removeClass(this.container, 'p-unselectable-text');

    this.unbindColumnResizeEvents();
  }

  setScrollableItemsWidthOnExpandResize(column, newColumnWidth, delta) {
    let scrollableView = column ? this.findParentScrollableView(column) : this.container;

    let scrollableBody = _DomHandler.default.findSingle(scrollableView, '.p-datatable-scrollable-body');

    let scrollableHeader = _DomHandler.default.findSingle(scrollableView, '.p-datatable-scrollable-header');

    let scrollableFooter = _DomHandler.default.findSingle(scrollableView, '.p-datatable-scrollable-footer');

    let scrollableBodyTable = _DomHandler.default.findSingle(scrollableBody, 'table.p-datatable-scrollable-body-table');

    let scrollableHeaderTable = _DomHandler.default.findSingle(scrollableHeader, 'table.p-datatable-scrollable-header-table');

    let scrollableFooterTable = _DomHandler.default.findSingle(scrollableFooter, 'table.p-datatable-scrollable-footer-table');

    const scrollableBodyTableWidth = column ? scrollableBodyTable.offsetWidth + delta : newColumnWidth;
    const scrollableHeaderTableWidth = column ? scrollableHeaderTable.offsetWidth + delta : newColumnWidth;
    const isContainerInViewport = this.container.offsetWidth >= scrollableBodyTableWidth;

    let setWidth = (container, table, width, isContainerInViewport) => {
      if (container && table) {
        container.style.width = isContainerInViewport ? width + _DomHandler.default.calculateScrollbarWidth(scrollableBody) + 'px' : 'auto';
        table.style.width = width + 'px';
      }
    };

    setWidth(scrollableBody, scrollableBodyTable, scrollableBodyTableWidth, isContainerInViewport);
    setWidth(scrollableHeader, scrollableHeaderTable, scrollableHeaderTableWidth, isContainerInViewport);
    setWidth(scrollableFooter, scrollableFooterTable, scrollableHeaderTableWidth, isContainerInViewport);

    if (column) {
      let resizeColumnIndex = _DomHandler.default.index(column);

      this.resizeColGroup(scrollableHeaderTable, resizeColumnIndex, newColumnWidth, null);
      this.resizeColGroup(scrollableBodyTable, resizeColumnIndex, newColumnWidth, null);
      this.resizeColGroup(scrollableFooterTable, resizeColumnIndex, newColumnWidth, null);
    }
  }

  findParentScrollableView(column) {
    if (column) {
      let parent = column.parentElement;

      while (parent && !_DomHandler.default.hasClass(parent, 'p-datatable-scrollable-view')) {
        parent = parent.parentElement;
      }

      return parent;
    } else {
      return null;
    }
  }

  resizeColGroup(table, resizeColumnIndex, newColumnWidth, nextColumnWidth) {
    if (table) {
      let colGroup = table.children[0].nodeName === 'COLGROUP' ? table.children[0] : null;

      if (colGroup) {
        let col = colGroup.children[resizeColumnIndex];
        let nextCol = col.nextElementSibling;
        col.style.width = newColumnWidth + 'px';

        if (nextCol && nextColumnWidth) {
          nextCol.style.width = nextColumnWidth + 'px';
        }
      } else {
        throw new Error("Scrollable tables require a colgroup to support resizable columns");
      }
    }
  }

  bindColumnResizeEvents() {
    this.documentColumnResizeListener = document.addEventListener('mousemove', event => {
      if (this.columnResizing) {
        this.onColumnResize(event);
      }
    });
    this.documentColumnResizeEndListener = document.addEventListener('mouseup', event => {
      if (this.columnResizing) {
        this.columnResizing = false;
        this.onColumnResizeEnd(event);
      }
    });
  }

  unbindColumnResizeEvents() {
    document.removeEventListener('document', this.documentColumnResizeListener);
    document.removeEventListener('document', this.documentColumnResizeEndListener);
  }

  findParentHeader(element) {
    if (element.nodeName === 'TH') {
      return element;
    } else {
      let parent = element.parentElement;

      while (parent.nodeName !== 'TH') {
        parent = parent.parentElement;
        if (!parent) break;
      }

      return parent;
    }
  }

  onColumnDragStart(event) {
    if (this.columnResizing) {
      event.preventDefault();
      return;
    }

    this.iconWidth = _DomHandler.default.getHiddenElementOuterWidth(this.reorderIndicatorUp);
    this.iconHeight = _DomHandler.default.getHiddenElementOuterHeight(this.reorderIndicatorUp);
    this.draggedColumn = this.findParentHeader(event.target);
    event.dataTransfer.setData('text', 'b'); // Firefox requires this to make dragging possible
  }

  onColumnDragOver(event) {
    let dropHeader = this.findParentHeader(event.target);

    if (this.props.reorderableColumns && this.draggedColumn && dropHeader) {
      event.preventDefault();

      let containerOffset = _DomHandler.default.getOffset(this.container);

      let dropHeaderOffset = _DomHandler.default.getOffset(dropHeader);

      if (this.draggedColumn !== dropHeader) {
        let targetLeft = dropHeaderOffset.left - containerOffset.left; //let targetTop =  containerOffset.top - dropHeaderOffset.top;

        let columnCenter = dropHeaderOffset.left + dropHeader.offsetWidth / 2;
        this.reorderIndicatorUp.style.top = dropHeaderOffset.top - containerOffset.top - (this.iconHeight - 1) + 'px';
        this.reorderIndicatorDown.style.top = dropHeaderOffset.top - containerOffset.top + dropHeader.offsetHeight + 'px';

        if (event.pageX > columnCenter) {
          this.reorderIndicatorUp.style.left = targetLeft + dropHeader.offsetWidth - Math.ceil(this.iconWidth / 2) + 'px';
          this.reorderIndicatorDown.style.left = targetLeft + dropHeader.offsetWidth - Math.ceil(this.iconWidth / 2) + 'px';
          this.dropPosition = 1;
        } else {
          this.reorderIndicatorUp.style.left = targetLeft - Math.ceil(this.iconWidth / 2) + 'px';
          this.reorderIndicatorDown.style.left = targetLeft - Math.ceil(this.iconWidth / 2) + 'px';
          this.dropPosition = -1;
        }

        this.reorderIndicatorUp.style.display = 'block';
        this.reorderIndicatorDown.style.display = 'block';
      }
    }
  }

  onColumnDragLeave(event) {
    if (this.props.reorderableColumns && this.draggedColumn) {
      event.preventDefault();
      this.reorderIndicatorUp.style.display = 'none';
      this.reorderIndicatorDown.style.display = 'none';
    }
  }

  onColumnDrop(event) {
    event.preventDefault();

    if (this.draggedColumn) {
      let dragIndex = _DomHandler.default.index(this.draggedColumn);

      let dropIndex = _DomHandler.default.index(this.findParentHeader(event.target));

      let allowDrop = dragIndex !== dropIndex;

      if (allowDrop && (dropIndex - dragIndex === 1 && this.dropPosition === -1 || dragIndex - dropIndex === 1 && this.dropPosition === 1)) {
        allowDrop = false;
      }

      if (allowDrop) {
        let columns = this.state.columnOrder ? this.getColumns() : _react.default.Children.toArray(this.props.children);

        _ObjectUtils.default.reorderArray(columns, dragIndex, dropIndex);

        let columnOrder = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = columns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            let column = _step.value;
            columnOrder.push(column.props.columnKey || column.props.field);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        this.setState({
          columnOrder: columnOrder
        });

        if (this.props.onColReorder) {
          this.props.onColReorder({
            originalEvent: event,
            dragIndex: dragIndex,
            dropIndex: dropIndex,
            columns: columns
          });
        }
      }

      this.reorderIndicatorUp.style.display = 'none';
      this.reorderIndicatorDown.style.display = 'none';
      this.draggedColumn.draggable = false;
      this.draggedColumn = null;
      this.dropPosition = null;
    }
  }

  onVirtualScroll(event) {
    if (this.virtualScrollTimer) {
      clearTimeout(this.virtualScrollTimer);
    }

    this.virtualScrollTimer = setTimeout(() => {
      if (this.props.onVirtualScroll) {
        this.props.onVirtualScroll({
          first: (event.page - 1) * this.props.rows,
          rows: this.props.virtualScroll ? this.props.rows * 2 : this.props.rows
        });
      }
    }, this.props.virtualScrollDelay);
  }

  exportCSV() {
    let data = this.processData();
    let csv = '\ufeff';

    let columns = _react.default.Children.toArray(this.props.children); //headers


    for (let i = 0; i < columns.length; i++) {
      if (columns[i].props.field) {
        csv += '"' + (columns[i].props.header || columns[i].props.field) + '"';

        if (i < columns.length - 1) {
          csv += this.props.csvSeparator;
        }
      }
    } //body        


    data.forEach((record, i) => {
      csv += '\n';

      for (let i = 0; i < columns.length; i++) {
        let column = columns[i],
            field = column.props.field;

        if (column.props.exportable && field) {
          let cellData = _ObjectUtils.default.resolveFieldData(record, field);

          if (cellData != null) {
            if (this.props.exportFunction) {
              cellData = this.props.exportFunction({
                data: cellData,
                field: field
              });
            } else cellData = String(cellData).replace(/"/g, '""');
          } else cellData = '';

          csv += '"' + cellData + '"';

          if (i < columns.length - 1) {
            csv += this.props.csvSeparator;
          }
        }
      }
    });
    let blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    });

    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, this.props.exportFilename + '.csv');
    } else {
      let link = document.createElement("a");
      link.style.display = 'none';
      document.body.appendChild(link);

      if (link.download !== undefined) {
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', this.props.exportFilename + '.csv');
        link.click();
      } else {
        csv = 'data:text/csv;charset=utf-8,' + csv;
        window.open(encodeURI(csv));
      }

      document.body.removeChild(link);
    }
  }

  closeEditingCell() {
    if (this.props.editMode !== "row") {
      document.body.click();
    }
  }

  onHeaderCheckboxClick(event) {
    let selection;

    if (!event.checked) {
      let visibleData = this.hasFilter() ? this.processData() : this.props.value;
      selection = [...visibleData];
    } else {
      selection = [];
    }

    if (this.props.onSelectionChange) {
      const originalEvent = event.originalEvent,
            rest = _objectWithoutProperties(event, ["originalEvent"]);

      this.props.onSelectionChange(_objectSpread({
        originalEvent,
        value: selection
      }, rest));
    }
  }

  filterLocal(value, localFilters) {
    let filteredValue = [];
    let filters = localFilters || this.getFilters();

    let columns = _react.default.Children.toArray(this.props.children);

    for (let i = 0; i < value.length; i++) {
      let localMatch = true;
      let globalMatch = false;

      for (let j = 0; j < columns.length; j++) {
        let col = columns[j];
        let filterMeta = filters ? filters[col.props.field] : null; //local

        if (filterMeta) {
          let filterValue = filterMeta.value;
          let filterField = col.props.field;
          let filterMatchMode = filterMeta.matchMode || col.props.filterMatchMode;

          let dataFieldValue = _ObjectUtils.default.resolveFieldData(value[i], filterField);

          let filterConstraint = filterMatchMode === 'custom' ? col.props.filterFunction : _ObjectUtils.default.filterConstraints[filterMatchMode];

          if (!filterConstraint(dataFieldValue, filterValue)) {
            localMatch = false;
          }

          if (!localMatch) {
            break;
          }
        } //global


        if (!col.props.excludeGlobalFilter && this.props.globalFilter && !globalMatch) {
          globalMatch = _ObjectUtils.default.filterConstraints['contains'](_ObjectUtils.default.resolveFieldData(value[i], col.props.field), this.props.globalFilter);
        }
      }

      let matches = localMatch;

      if (this.props.globalFilter) {
        matches = localMatch && globalMatch;
      }

      if (matches) {
        filteredValue.push(value[i]);
      }
    }

    if (filteredValue.length === value.length) {
      filteredValue = value;
    }

    return filteredValue;
  }

  processData(localState) {
    let data = this.props.value;

    if (!this.props.lazy) {
      if (data && data.length) {
        let sortField = localState && localState.sortField || this.getSortField();
        let sortOrder = localState && localState.sortOrder || this.getSortOrder();
        let multiSortMeta = localState && localState.multiSortMeta || this.getMultiSortMeta();

        if (sortField || multiSortMeta) {
          if (this.props.sortMode === 'single') data = this.sortSingle(data, sortField, sortOrder);else if (this.props.sortMode === 'multiple') data = this.sortMultiple(data, multiSortMeta);
        }

        let localFilters = localState && localState.filters || this.getFilters();

        if (localFilters || this.props.globalFilter) {
          data = this.filterLocal(data, localFilters);
        }
      }
    }

    return data;
  }

  isAllSelected() {
    let visibleData = this.hasFilter() ? this.processData() : this.props.value;
    return this.props.selection && visibleData && visibleData.length && this.props.selection.length === visibleData.length;
  }

  getFrozenColumns(columns) {
    let frozenColumns = null;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = columns[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        let col = _step2.value;

        if (col.props.frozen) {
          frozenColumns = frozenColumns || [];
          frozenColumns.push(col);
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return frozenColumns;
  }

  getScrollableColumns(columns) {
    let scrollableColumns = null;
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = columns[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        let col = _step3.value;

        if (!col.props.frozen) {
          scrollableColumns = scrollableColumns || [];
          scrollableColumns.push(col);
        }
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    return scrollableColumns;
  }

  getFrozenSelectionModeInColumn(columns) {
    if (Array.isArray(columns)) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = columns[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          let col = _step4.value;
          if (col.props.selectionMode) return col.props.selectionMode;
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }

    return null;
  }

  createTableHeader(value, columns, columnGroup) {
    return _react.default.createElement(_TableHeader.TableHeader, {
      value: value,
      onSort: this.onSort,
      sortField: this.getSortField(),
      sortOrder: this.getSortOrder(),
      multiSortMeta: this.getMultiSortMeta(),
      columnGroup: columnGroup,
      resizableColumns: this.props.resizableColumns,
      onColumnResizeStart: this.onColumnResizeStart,
      onFilter: this.onFilter,
      onHeaderCheckboxClick: this.onHeaderCheckboxClick,
      headerCheckboxSelected: this.isAllSelected(),
      reorderableColumns: this.props.reorderableColumns,
      onColumnDragStart: this.onColumnDragStart,
      filters: this.getFilters(),
      onColumnDragOver: this.onColumnDragOver,
      onColumnDragLeave: this.onColumnDragLeave,
      onColumnDrop: this.onColumnDrop,
      tabIndex: this.props.tabIndex
    }, columns);
  }

  createTableBody(value, columns) {
    return _react.default.createElement(_TableBody.TableBody, {
      value: value,
      first: this.getFirst(),
      rows: this.getRows(),
      lazy: this.props.lazy,
      paginator: this.props.paginator,
      dataKey: this.props.dataKey,
      compareSelectionBy: this.props.compareSelectionBy,
      selectionMode: this.props.selectionMode,
      selection: this.props.selection,
      metaKeySelection: this.props.metaKeySelection,
      frozenSelectionMode: this.frozenSelectionMode,
      onSelectionChange: this.props.onSelectionChange,
      onRowClick: this.props.onRowClick,
      onRowDoubleClick: this.props.onRowDoubleClick,
      onRowSelect: this.props.onRowSelect,
      onRowUnselect: this.props.onRowUnselect,
      contextMenuSelection: this.props.contextMenuSelection,
      onContextMenuSelectionChange: this.props.onContextMenuSelectionChange,
      onContextMenu: this.props.onContextMenu,
      expandedRows: this.props.expandedRows,
      onRowToggle: this.props.onRowToggle,
      rowExpansionTemplate: this.props.rowExpansionTemplate,
      onRowExpand: this.props.onRowExpand,
      onRowCollapse: this.props.onRowCollapse,
      responsive: this.props.responsive,
      emptyMessage: this.props.emptyMessage,
      virtualScroll: this.props.virtualScroll,
      virtualRowHeight: this.props.virtualRowHeight,
      loading: this.props.loading,
      groupField: this.props.groupField,
      rowGroupMode: this.props.rowGroupMode,
      rowGroupHeaderTemplate: this.props.rowGroupHeaderTemplate,
      rowGroupFooterTemplate: this.props.rowGroupFooterTemplate,
      sortField: this.getSortField(),
      rowClassName: this.props.rowClassName,
      onRowReorder: this.props.onRowReorder,
      editMode: this.props.editMode,
      rowEditorValidator: this.props.rowEditorValidator,
      onRowEditInit: this.props.onRowEditInit,
      onRowEditSave: this.props.onRowEditSave,
      onRowEditCancel: this.props.onRowEditCancel
    }, columns);
  }

  createTableLoadingBody(columns) {
    if (this.props.virtualScroll) {
      return _react.default.createElement(_TableLoadingBody.TableLoadingBody, {
        columns: columns,
        rows: this.getRows()
      });
    } else {
      return null;
    }
  }

  createTableFooter(columns, columnGroup) {
    if (this.hasFooter()) return _react.default.createElement(_TableFooter.TableFooter, {
      columnGroup: columnGroup
    }, columns);else return null;
  }

  createScrollableView(value, columns, frozen, headerColumnGroup, footerColumnGroup, totalRecords) {
    return _react.default.createElement(_ScrollableView.ScrollableView, {
      columns: columns,
      header: this.createTableHeader(value, columns, headerColumnGroup),
      body: this.createTableBody(value, columns),
      loadingBody: this.createTableLoadingBody(columns),
      frozenBody: this.props.frozenValue ? this.createTableBody(this.props.frozenValue, columns) : null,
      footer: this.createTableFooter(columns, footerColumnGroup),
      tableStyle: this.props.tableStyle,
      tableClassName: this.props.tableClassName,
      scrollHeight: this.props.scrollHeight,
      frozen: frozen,
      frozenWidth: this.props.frozenWidth,
      virtualScroll: this.props.virtualScroll,
      virtualRowHeight: this.props.virtualRowHeight,
      rows: this.props.rows,
      totalRecords: totalRecords,
      onVirtualScroll: this.onVirtualScroll,
      loading: this.props.loading
    });
  }

  getColumns() {
    let columns = _react.default.Children.toArray(this.props.children);

    if (columns && columns.length) {
      if (this.props.reorderableColumns && this.state.columnOrder) {
        let orderedColumns = [];
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = this.state.columnOrder[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            let columnKey = _step5.value;
            let column = this.findColumnByKey(columns, columnKey);

            if (column) {
              orderedColumns.push(column);
            }
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        return [...orderedColumns, ...columns.filter(item => {
          return orderedColumns.indexOf(item) < 0;
        })];
      } else {
        return columns;
      }
    }

    return null;
  }

  findColumnByKey(columns, key) {
    if (columns && columns.length) {
      for (let i = 0; i < columns.length; i++) {
        let child = columns[i];

        if (child.props.columnKey === key || child.props.field === key) {
          return child;
        }
      }
    }

    return null;
  }

  getTotalRecords(data) {
    return this.props.lazy ? this.props.totalRecords : data ? data.length : 0;
  }

  reset() {
    let state = {};

    if (!this.props.onPage) {
      state.first = this.props.first;
      state.rows = this.props.rows;
    }

    if (!this.props.onSort) {
      state.sortField = this.props.sortField;
      state.sortOrder = this.props.sortOrder;
      state.multiSortMeta = this.props.multiSortMeta;
    }

    if (!this.props.onFilter) {
      state.filters = this.props.filters;
    }

    this.resetColumnOrder();

    if (Object.keys(state).length) {
      this.setState(state);
    }
  }

  resetColumnOrder() {
    let columns = _react.default.Children.toArray(this.props.children);

    let columnOrder = [];
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = columns[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        let column = _step6.value;
        columnOrder.push(column.props.columnKey || column.props.field);
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
          _iterator6.return();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }

    this.setState({
      columnOrder
    });
  }

  renderLoader() {
    let iconClassName = (0, _classnames.default)('p-datatable-loading-icon pi-spin', this.props.loadingIcon);
    return _react.default.createElement("div", {
      className: "p-datatable-loading"
    }, _react.default.createElement("div", {
      className: "p-datatable-loading-overlay p-component-overlay"
    }), _react.default.createElement("div", {
      className: "p-datatable-loading-content"
    }, _react.default.createElement("i", {
      className: iconClassName
    })));
  }

  componentDidMount() {
    if (this.isStateful() && this.props.resizableColumns) {
      this.restoreColumnWidths();
    }
  }

  componentDidUpdate() {
    if (this.isStateful()) {
      this.saveState();
    }
  }

  render() {
    let value = this.processData();
    let columns = this.getColumns();
    let totalRecords = this.getTotalRecords(value);
    let className = (0, _classnames.default)('p-datatable p-component', {
      'p-datatable-responsive': this.props.responsive,
      'p-datatable-resizable': this.props.resizableColumns,
      'p-datatable-resizable-fit': this.props.resizableColumns && this.props.columnResizeMode === 'fit',
      'p-datatable-scrollable': this.props.scrollable,
      'p-datatable-virtual-scrollable': this.props.virtualScroll,
      'p-datatable-auto-layout': this.props.autoLayout,
      'p-datatable-hoverable-rows': this.props.selectionMode
    }, this.props.className);
    let paginatorTop = this.props.paginator && this.props.paginatorPosition !== 'bottom' && this.createPaginator('top', totalRecords);
    let paginatorBottom = this.props.paginator && this.props.paginatorPosition !== 'top' && this.createPaginator('bottom', totalRecords);

    let headerFacet = this.props.header && _react.default.createElement("div", {
      className: "p-datatable-header"
    }, this.props.header);

    let footerFacet = this.props.footer && _react.default.createElement("div", {
      className: "p-datatable-footer"
    }, this.props.footer);

    let resizeHelper = this.props.resizableColumns && _react.default.createElement("div", {
      ref: el => {
        this.resizerHelper = el;
      },
      className: "p-column-resizer-helper p-highlight",
      style: {
        display: 'none'
      }
    });

    let tableContent = null;

    let resizeIndicatorUp = this.props.reorderableColumns && _react.default.createElement("span", {
      ref: el => {
        this.reorderIndicatorUp = el;
      },
      className: "pi pi-arrow-down p-datatable-reorder-indicator-up",
      style: {
        position: 'absolute',
        display: 'none'
      }
    });

    let resizeIndicatorDown = this.props.reorderableColumns && _react.default.createElement("span", {
      ref: el => {
        this.reorderIndicatorDown = el;
      },
      className: "pi pi-arrow-up p-datatable-reorder-indicator-down",
      style: {
        position: 'absolute',
        display: 'none'
      }
    });

    let loader;

    if (this.props.loading) {
      loader = this.renderLoader();
    }

    if (Array.isArray(columns)) {
      if (this.props.scrollable) {
        this.frozenSelectionMode = this.frozenSelectionMode || this.getFrozenSelectionModeInColumn(columns);
        let frozenColumns = this.getFrozenColumns(columns);
        let scrollableColumns = frozenColumns ? this.getScrollableColumns(columns) : columns;
        let frozenView, scrollableView;

        if (frozenColumns) {
          frozenView = this.createScrollableView(value, frozenColumns, true, this.props.frozenHeaderColumnGroup, this.props.frozenFooterColumnGroup, totalRecords);
        }

        scrollableView = this.createScrollableView(value, scrollableColumns, false, this.props.headerColumnGroup, this.props.footerColumnGroup, totalRecords);
        tableContent = _react.default.createElement("div", {
          className: "p-datatable-scrollable-wrapper"
        }, frozenView, scrollableView);
      } else {
        let tableHeader = this.createTableHeader(value, columns, this.props.headerColumnGroup);
        let tableBody = this.createTableBody(value, columns);
        let tableFooter = this.createTableFooter(columns, this.props.footerColumnGroup);
        tableContent = _react.default.createElement("div", {
          className: "p-datatable-wrapper"
        }, _react.default.createElement("table", {
          style: this.props.tableStyle,
          className: this.props.tableClassName,
          ref: el => {
            this.table = el;
          }
        }, tableHeader, tableFooter, tableBody));
      }
    }

    return _react.default.createElement("div", {
      id: this.props.id,
      className: className,
      style: this.props.style,
      ref: el => {
        this.container = el;
      }
    }, headerFacet, paginatorTop, tableContent, paginatorBottom, footerFacet, resizeHelper, resizeIndicatorUp, resizeIndicatorDown);
  }

}

exports.DataTable = DataTable;

_defineProperty(DataTable, "defaultProps", {
  id: null,
  value: null,
  header: null,
  footer: null,
  style: null,
  className: null,
  tableStyle: null,
  tableClassName: null,
  paginator: false,
  paginatorPosition: 'bottom',
  alwaysShowPaginator: true,
  paginatorTemplate: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
  paginatorLeft: null,
  paginatorRight: null,
  pageLinkSize: 5,
  rowsPerPageOptions: null,
  currentPageReportTemplate: '({currentPage} of {totalPages})',
  first: null,
  rows: null,
  totalRecords: null,
  lazy: false,
  sortField: null,
  sortOrder: null,
  multiSortMeta: null,
  sortMode: 'single',
  defaultSortOrder: 1,
  emptyMessage: null,
  selectionMode: null,
  selection: null,
  onSelectionChange: null,
  contextMenuSelection: null,
  onContextMenuSelectionChange: null,
  compareSelectionBy: 'deepEquals',
  dataKey: null,
  metaKeySelection: true,
  headerColumnGroup: null,
  footerColumnGroup: null,
  frozenHeaderColumnGroup: null,
  frozenFooterColumnGroup: null,
  rowExpansionTemplate: null,
  expandedRows: null,
  onRowToggle: null,
  responsive: false,
  resizableColumns: false,
  columnResizeMode: 'fit',
  reorderableColumns: false,
  filters: null,
  globalFilter: null,
  scrollable: false,
  scrollHeight: null,
  virtualScroll: false,
  virtualScrollDelay: 150,
  virtualRowHeight: 28,
  frozenWidth: null,
  frozenValue: null,
  csvSeparator: ',',
  exportFilename: 'download',
  rowGroupMode: null,
  autoLayout: false,
  rowClassName: null,
  rowGroupHeaderTemplate: null,
  rowGroupFooterTemplate: null,
  loading: false,
  loadingIcon: 'pi pi-spinner',
  tabIndex: '0',
  stateKey: null,
  stateStorage: 'session',
  editMode: 'cell',
  onColumnResizeEnd: null,
  onSort: null,
  onPage: null,
  onFilter: null,
  onVirtualScroll: null,
  onRowClick: null,
  onRowDoubleClick: null,
  onRowSelect: null,
  onRowUnselect: null,
  onRowExpand: null,
  onRowCollapse: null,
  onContextMenu: null,
  onColReorder: null,
  onRowReorder: null,
  onValueChange: null,
  rowEditorValidator: null,
  onRowEditInit: null,
  onRowEditSave: null,
  onRowEditCancel: null,
  exportFunction: null
});

_defineProperty(DataTable, "propTypes", {
  id: _propTypes.default.string,
  value: _propTypes.default.array,
  header: _propTypes.default.any,
  footer: _propTypes.default.any,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  tableStyle: _propTypes.default.any,
  tableClassName: _propTypes.default.string,
  paginator: _propTypes.default.bool,
  paginatorPosition: _propTypes.default.string,
  alwaysShowPaginator: _propTypes.default.bool,
  paginatorTemplate: _propTypes.default.string,
  paginatorLeft: _propTypes.default.any,
  paginatorRight: _propTypes.default.any,
  pageLinkSize: _propTypes.default.number,
  rowsPerPageOptions: _propTypes.default.array,
  currentPageReportTemplate: _propTypes.default.string,
  first: _propTypes.default.number,
  rows: _propTypes.default.number,
  totalRecords: _propTypes.default.number,
  lazy: _propTypes.default.bool,
  sortField: _propTypes.default.string,
  sortOrder: _propTypes.default.number,
  multiSortMeta: _propTypes.default.array,
  sortMode: _propTypes.default.string,
  defaultSortOrder: _propTypes.default.number,
  emptyMessage: _propTypes.default.string,
  selectionMode: _propTypes.default.string,
  selection: _propTypes.default.any,
  onSelectionChange: _propTypes.default.func,
  compareSelectionBy: _propTypes.default.string,
  dataKey: _propTypes.default.string,
  metaKeySelection: _propTypes.default.bool,
  headerColumnGroup: _propTypes.default.any,
  footerColumnGroup: _propTypes.default.any,
  frozenHeaderColumnGroup: _propTypes.default.any,
  frozenFooterColumnGroup: _propTypes.default.any,
  rowExpansionTemplate: _propTypes.default.func,
  expandedRows: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.object]),
  onRowToggle: _propTypes.default.func,
  responsive: _propTypes.default.bool,
  resizableColumns: _propTypes.default.bool,
  columnResizeMode: _propTypes.default.string,
  reorderableColumns: _propTypes.default.bool,
  filters: _propTypes.default.object,
  globalFilter: _propTypes.default.any,
  scrollable: _propTypes.default.bool,
  scrollHeight: _propTypes.default.string,
  virtualScroll: _propTypes.default.bool,
  virtualScrollDelay: _propTypes.default.number,
  virtualRowHeight: _propTypes.default.number,
  frozenWidth: _propTypes.default.string,
  frozenValue: _propTypes.default.array,
  csvSeparator: _propTypes.default.string,
  exportFilename: _propTypes.default.string,
  rowGroupMode: _propTypes.default.string,
  autoLayout: _propTypes.default.bool,
  rowClassName: _propTypes.default.func,
  rowGroupHeaderTemplate: _propTypes.default.func,
  rowGroupFooterTemplate: _propTypes.default.func,
  loading: _propTypes.default.bool,
  loadingIcon: _propTypes.default.string,
  tabIndex: _propTypes.default.string,
  stateKey: _propTypes.default.string,
  stateStorage: _propTypes.default.string,
  editMode: _propTypes.default.string,
  onColumnResizeEnd: _propTypes.default.func,
  onSort: _propTypes.default.func,
  onPage: _propTypes.default.func,
  onFilter: _propTypes.default.func,
  onVirtualScroll: _propTypes.default.func,
  onRowClick: _propTypes.default.func,
  onRowDoubleClick: _propTypes.default.func,
  onRowSelect: _propTypes.default.func,
  onRowUnselect: _propTypes.default.func,
  onRowExpand: _propTypes.default.func,
  onRowCollapse: _propTypes.default.func,
  onContextMenu: _propTypes.default.func,
  onColReorder: _propTypes.default.func,
  onRowReorder: _propTypes.default.func,
  onValueChange: _propTypes.default.func,
  rowEditorValidator: _propTypes.default.func,
  onRowEditInit: _propTypes.default.func,
  onRowEditSave: _propTypes.default.func,
  onRowEditCancel: _propTypes.default.func,
  exportFunction: _propTypes.default.func
});