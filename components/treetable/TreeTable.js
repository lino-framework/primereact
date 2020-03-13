"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TreeTable = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _ObjectUtils = _interopRequireDefault(require("../utils/ObjectUtils"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

var _Paginator = require("../paginator/Paginator");

var _TreeTableHeader = require("./TreeTableHeader");

var _TreeTableBody = require("./TreeTableBody");

var _TreeTableFooter = require("./TreeTableFooter");

var _TreeTableScrollableView = require("./TreeTableScrollableView");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TreeTable extends _react.Component {
  constructor(props) {
    super(props);
    let state = {};

    if (!this.props.onToggle) {
      this.state = {
        expandedKeys: this.props.expandedKeys
      };
    }

    if (!this.props.onPage) {
      state.first = props.first;
      state.rows = props.rows;
    }

    if (!this.props.onSort) {
      state.sortField = props.sortField;
      state.sortOrder = props.sortOrder;
      state.multiSortMeta = props.multiSortMeta;
    }

    if (!this.props.onFilter) {
      state.filters = props.filters;
    }

    if (Object.keys(state).length) {
      this.state = state;
    }

    this.onToggle = this.onToggle.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onSort = this.onSort.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onColumnResizeStart = this.onColumnResizeStart.bind(this);
    this.onColumnDragStart = this.onColumnDragStart.bind(this);
    this.onColumnDragOver = this.onColumnDragOver.bind(this);
    this.onColumnDragLeave = this.onColumnDragLeave.bind(this);
    this.onColumnDrop = this.onColumnDrop.bind(this);
  }

  onToggle(event) {
    if (this.props.onToggle) {
      this.props.onToggle(event);
    } else {
      this.setState({
        expandedKeys: event.value
      });
    }
  }

  onPageChange(event) {
    if (this.props.onPage) this.props.onPage(event);else this.setState({
      first: event.first,
      rows: event.rows
    });
  }

  onSort(event) {
    let sortField = event.sortField;
    let sortOrder = this.getSortField() === event.sortField ? this.getSortOrder() * -1 : this.props.defaultSortOrder;
    let multiSortMeta;
    this.columnSortable = event.sortable;
    this.columnSortFunction = event.sortFunction;

    if (this.props.sortMode === 'multiple') {
      let metaKey = event.originalEvent.metaKey || event.originalEvent.ctrlKey;
      multiSortMeta = this.getMultiSortMeta();

      if (!multiSortMeta || !metaKey) {
        multiSortMeta = [];
      }

      multiSortMeta = this.addSortMeta({
        field: sortField,
        order: sortOrder
      }, multiSortMeta);
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
  }

  addSortMeta(meta, multiSortMeta) {
    let index = -1;

    for (let i = 0; i < multiSortMeta.length; i++) {
      if (multiSortMeta[i].field === meta.field) {
        index = i;
        break;
      }
    }

    let value = [...multiSortMeta];
    if (index >= 0) value[index] = meta;else value.push(meta);
    return value;
  }

  sortSingle(data) {
    return this.sortNodes(data);
  }

  sortNodes(data) {
    let value = [...data];

    if (this.columnSortable && this.columnSortable === 'custom' && this.columnSortFunction) {
      value = this.columnSortFunction({
        field: this.getSortField(),
        order: this.getSortOrder()
      });
    } else {
      value.sort((node1, node2) => {
        const sortField = this.getSortField();

        const value1 = _ObjectUtils.default.resolveFieldData(node1.data, sortField);

        const value2 = _ObjectUtils.default.resolveFieldData(node2.data, sortField);

        let result = null;
        if (value1 == null && value2 != null) result = -1;else if (value1 != null && value2 == null) result = 1;else if (value1 == null && value2 == null) result = 0;else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2, undefined, {
          numeric: true
        });else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
        return this.getSortOrder() * result;
      });

      for (let i = 0; i < value.length; i++) {
        if (value[i].children && value[i].children.length) {
          value[i].children = this.sortNodes(value[i].children);
        }
      }
    }

    return value;
  }

  sortMultiple(data) {
    let multiSortMeta = this.getMultiSortMeta();
    if (multiSortMeta) return this.sortMultipleNodes(data, multiSortMeta);else return data;
  }

  sortMultipleNodes(data, multiSortMeta) {
    let value = [...data];
    value.sort((node1, node2) => {
      return this.multisortField(node1, node2, multiSortMeta, 0);
    });

    for (let i = 0; i < value.length; i++) {
      if (value[i].children && value[i].children.length) {
        value[i].children = this.sortMultipleNodes(value[i].children, multiSortMeta);
      }
    }

    return value;
  }

  multisortField(node1, node2, multiSortMeta, index) {
    const value1 = _ObjectUtils.default.resolveFieldData(node1.data, multiSortMeta[index].field);

    const value2 = _ObjectUtils.default.resolveFieldData(node2.data, multiSortMeta[index].field);

    let result = null;
    if (value1 == null && value2 != null) result = -1;else if (value1 != null && value2 == null) result = 1;else if (value1 == null && value2 == null) result = 0;else {
      if (value1 === value2) {
        return multiSortMeta.length - 1 > index ? this.multisortField(node1, node2, multiSortMeta, index + 1) : 0;
      } else {
        if ((typeof value1 === 'string' || value1 instanceof String) && (typeof value2 === 'string' || value2 instanceof String)) return multiSortMeta[index].order * value1.localeCompare(value2, undefined, {
          numeric: true
        });else result = value1 < value2 ? -1 : 1;
      }
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
  }

  hasFilter() {
    let filters = this.getFilters();
    return filters && Object.keys(filters).length > 0;
  }

  isFilterBlank(filter) {
    if (filter !== null && filter !== undefined) {
      if (typeof filter === 'string' && filter.trim().length === 0 || filter instanceof Array && filter.length === 0) return true;else return false;
    }

    return true;
  }

  onColumnResizeStart(event) {
    let containerLeft = _DomHandler.default.getOffset(this.container).left;

    this.resizeColumn = event.columnEl;
    this.resizeColumnProps = event.column;
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

            let scrollableBodyTable = _DomHandler.default.findSingle(scrollableView, 'table.p-treetable-scrollable-body-table');

            let scrollableHeaderTable = _DomHandler.default.findSingle(scrollableView, 'table.p-treetable-scrollable-header-table');

            let scrollableFooterTable = _DomHandler.default.findSingle(scrollableView, 'table.p-treetable-scrollable-footer-table');

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
          let scrollableView = this.findParentScrollableView(this.resizeColumn);

          let scrollableBodyTable = _DomHandler.default.findSingle(scrollableView, 'table.p-treetable-scrollable-body-table');

          let scrollableHeaderTable = _DomHandler.default.findSingle(scrollableView, 'table.p-treetable-scrollable-header-table');

          let scrollableFooterTable = _DomHandler.default.findSingle(scrollableView, 'table.p-treetable-scrollable-footer-table');

          scrollableBodyTable.style.width = scrollableBodyTable.offsetWidth + delta + 'px';
          scrollableHeaderTable.style.width = scrollableHeaderTable.offsetWidth + delta + 'px';

          if (scrollableFooterTable) {
            scrollableFooterTable.style.width = scrollableHeaderTable.offsetWidth + delta + 'px';
          }

          let resizeColumnIndex = _DomHandler.default.index(this.resizeColumn);

          this.resizeColGroup(scrollableHeaderTable, resizeColumnIndex, newColumnWidth, null);
          this.resizeColGroup(scrollableBodyTable, resizeColumnIndex, newColumnWidth, null);
          this.resizeColGroup(scrollableFooterTable, resizeColumnIndex, newColumnWidth, null);
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
    }

    this.resizerHelper.style.display = 'none';
    this.resizeColumn = null;
    this.resizeColumnProps = null;

    _DomHandler.default.removeClass(this.container, 'p-unselectable-text');

    this.unbindColumnResizeEvents();
  }

  findParentScrollableView(column) {
    if (column) {
      let parent = column.parentElement;

      while (parent && !_DomHandler.default.hasClass(parent, 'p-treetable-scrollable-view')) {
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

  getExpandedKeys() {
    return this.props.onToggle ? this.props.expandedKeys : this.state.expandedKeys;
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

  getColumns() {
    let columns = _react.default.Children.toArray(this.props.children);

    if (this.props.reorderableColumns && this.state.columnOrder) {
      let orderedColumns = [];

      for (let i = 0; i < this.state.columnOrder.length; i++) {
        orderedColumns.push(this.findColumnByKey(columns, this.state.columnOrder[i]));
      }

      return orderedColumns;
    } else {
      return columns;
    }
  }

  getTotalRecords(data) {
    return this.props.lazy ? this.props.totalRecords : data ? data.length : 0;
  }

  isSingleSelectionMode() {
    return this.props.selectionMode && this.props.selectionMode === 'single';
  }

  isMultipleSelectionMode() {
    return this.props.selectionMode && this.props.selectionMode === 'multiple';
  }

  isRowSelectionMode() {
    return this.isSingleSelectionMode() || this.isMultipleSelectionMode();
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

  filterLocal(value) {
    let filteredNodes = [];
    let filters = this.getFilters();

    let columns = _react.default.Children.toArray(this.props.children);

    const isStrictMode = this.props.filterMode === 'strict';
    let isValueChanged = false;
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = value[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        let node = _step4.value;

        let copyNode = _objectSpread({}, node);

        let localMatch = true;
        let globalMatch = false;

        for (let j = 0; j < columns.length; j++) {
          let col = columns[j];
          let filterMeta = filters ? filters[col.props.field] : null;
          let filterField = col.props.field;
          let filterValue, filterConstraint, paramsWithoutNode; //local

          if (filterMeta) {
            let filterMatchMode = filterMeta.matchMode || col.props.filterMatchMode;
            filterValue = filterMeta.value;
            filterConstraint = filterMatchMode === 'custom' ? col.props.filterFunction : _ObjectUtils.default.filterConstraints[filterMatchMode];
            paramsWithoutNode = {
              filterField,
              filterValue,
              filterConstraint,
              isStrictMode
            };

            if (isStrictMode && !(this.findFilteredNodes(copyNode, paramsWithoutNode) || this.isFilterMatched(copyNode, paramsWithoutNode)) || !isStrictMode && !(this.isFilterMatched(copyNode, paramsWithoutNode) || this.findFilteredNodes(copyNode, paramsWithoutNode))) {
              localMatch = false;
            }

            if (!localMatch) {
              break;
            }
          } //global


          if (this.props.globalFilter && !globalMatch) {
            let copyNodeForGlobal = _objectSpread({}, copyNode);

            filterValue = this.props.globalFilter;
            filterConstraint = _ObjectUtils.default.filterConstraints['contains'];
            paramsWithoutNode = {
              filterField,
              filterValue,
              filterConstraint,
              isStrictMode
            };

            if (isStrictMode && (this.findFilteredNodes(copyNodeForGlobal, paramsWithoutNode) || this.isFilterMatched(copyNodeForGlobal, paramsWithoutNode)) || !isStrictMode && (this.isFilterMatched(copyNodeForGlobal, paramsWithoutNode) || this.findFilteredNodes(copyNodeForGlobal, paramsWithoutNode))) {
              globalMatch = true;
              copyNode = copyNodeForGlobal;
            }
          }
        }

        let matches = localMatch;

        if (this.props.globalFilter) {
          matches = localMatch && globalMatch;
        }

        if (matches) {
          filteredNodes.push(copyNode);
        }

        isValueChanged = isValueChanged || !localMatch || globalMatch;
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

    return isValueChanged ? filteredNodes : value;
  }

  findFilteredNodes(node, paramsWithoutNode) {
    if (node) {
      let matched = false;

      if (node.children) {
        let childNodes = [...node.children];
        node.children = [];

        for (var _i = 0, _childNodes = childNodes; _i < _childNodes.length; _i++) {
          let childNode = _childNodes[_i];

          let copyChildNode = _objectSpread({}, childNode);

          if (this.isFilterMatched(copyChildNode, paramsWithoutNode)) {
            matched = true;
            node.children.push(copyChildNode);
          }
        }
      }

      if (matched) {
        return true;
      }
    }
  }

  isFilterMatched(node, {
    filterField,
    filterValue,
    filterConstraint,
    isStrictMode
  }) {
    let matched = false;

    let dataFieldValue = _ObjectUtils.default.resolveFieldData(node.data, filterField);

    if (filterConstraint(dataFieldValue, filterValue)) {
      matched = true;
    }

    if (!matched || isStrictMode && !this.isNodeLeaf(node)) {
      matched = this.findFilteredNodes(node, {
        filterField,
        filterValue,
        filterConstraint,
        isStrictMode
      }) || matched;
    }

    return matched;
  }

  isNodeLeaf(node) {
    return node.leaf === false ? false : !(node.children && node.children.length);
  }

  processValue() {
    let data = this.props.value;

    if (!this.props.lazy) {
      if (data && data.length) {
        if (this.getSortField() || this.getMultiSortMeta()) {
          if (this.props.sortMode === 'single') data = this.sortSingle(data);else if (this.props.sortMode === 'multiple') data = this.sortMultiple(data);
        }

        let localFilters = this.getFilters();

        if (localFilters || this.props.globalFilter) {
          data = this.filterLocal(data, localFilters);
        }
      }
    }

    return data;
  }

  createTableHeader(columns, columnGroup) {
    return _react.default.createElement(_TreeTableHeader.TreeTableHeader, {
      columns: columns,
      columnGroup: columnGroup,
      tabIndex: this.props.tabIndex,
      onSort: this.onSort,
      sortField: this.getSortField(),
      sortOrder: this.getSortOrder(),
      multiSortMeta: this.getMultiSortMeta(),
      resizableColumns: this.props.resizableColumns,
      onResizeStart: this.onColumnResizeStart,
      reorderableColumns: this.props.reorderableColumns,
      onDragStart: this.onColumnDragStart,
      onDragOver: this.onColumnDragOver,
      onDragLeave: this.onColumnDragLeave,
      onDrop: this.onColumnDrop,
      onFilter: this.onFilter,
      filters: this.getFilters()
    });
  }

  createTableFooter(columns, columnGroup) {
    return _react.default.createElement(_TreeTableFooter.TreeTableFooter, {
      columns: columns,
      columnGroup: columnGroup
    });
  }

  createTableBody(value, columns) {
    return _react.default.createElement(_TreeTableBody.TreeTableBody, {
      value: value,
      columns: columns,
      expandedKeys: this.getExpandedKeys(),
      onToggle: this.onToggle,
      onExpand: this.props.onExpand,
      onCollapse: this.props.onCollapse,
      paginator: this.props.paginator,
      first: this.getFirst(),
      rows: this.getRows(),
      selectionMode: this.props.selectionMode,
      selectionKeys: this.props.selectionKeys,
      onSelectionChange: this.props.onSelectionChange,
      metaKeySelection: this.props.metaKeySelection,
      onRowClick: this.props.onRowClick,
      onSelect: this.props.onSelect,
      onUnselect: this.props.onUnselect,
      propagateSelectionUp: this.props.propagateSelectionUp,
      propagateSelectionDown: this.props.propagateSelectionDown,
      lazy: this.props.lazy,
      rowClassName: this.props.rowClassName,
      emptyMessage: this.props.emptyMessage,
      loading: this.props.loading,
      contextMenuSelectionKey: this.props.contextMenuSelectionKey,
      onContextMenuSelectionChange: this.props.onContextMenuSelectionChange,
      onContextMenu: this.props.onContextMenu
    });
  }

  createPaginator(position, totalRecords) {
    const className = 'p-paginator-' + position;
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

  createScrollableView(value, columns, frozen, headerColumnGroup, footerColumnGroup) {
    const header = this.createTableHeader(columns, headerColumnGroup);
    const footer = this.createTableFooter(columns, footerColumnGroup);
    const body = this.createTableBody(value, columns);
    return _react.default.createElement(_TreeTableScrollableView.TreeTableScrollableView, {
      columns: columns,
      header: header,
      body: body,
      footer: footer,
      scrollHeight: this.props.scrollHeight,
      frozen: frozen,
      frozenWidth: this.props.frozenWidth
    });
  }

  renderScrollableTable(value) {
    const columns = this.getColumns();
    let frozenColumns = this.getFrozenColumns(columns);
    let scrollableColumns = frozenColumns ? this.getScrollableColumns(columns) : columns;
    let frozenView, scrollableView;

    if (frozenColumns) {
      frozenView = this.createScrollableView(value, frozenColumns, true, this.props.frozenHeaderColumnGroup, this.props.frozenFooterColumnGroup);
    }

    scrollableView = this.createScrollableView(value, scrollableColumns, false, this.props.headerColumnGroup, this.props.footerColumnGroup);
    return _react.default.createElement("div", {
      className: "p-treetable-scrollable-wrapper"
    }, frozenView, scrollableView);
  }

  renderRegularTable(value) {
    const columns = this.getColumns();
    const header = this.createTableHeader(columns, this.props.headerColumnGroup);
    const footer = this.createTableFooter(columns, this.props.footerColumnGroup);
    const body = this.createTableBody(value, columns);
    return _react.default.createElement("div", {
      className: "p-treetable-tablewrapper"
    }, _react.default.createElement("table", {
      style: this.props.tableStyle,
      className: this.props.tableClassName,
      ref: el => this.table = el
    }, header, footer, body));
  }

  renderTable(value) {
    if (this.props.scrollable) return this.renderScrollableTable(value);else return this.renderRegularTable(value);
  }

  renderLoader() {
    if (this.props.loading) {
      const iconClassName = (0, _classnames.default)('p-treetable-loading-icon pi-spin', this.props.loadingIcon);
      return _react.default.createElement("div", {
        className: "p-treetable-loading"
      }, _react.default.createElement("div", {
        className: "p-treetable-loading-overlay p-component-overlay"
      }), _react.default.createElement("div", {
        className: "p-treetable-loading-content"
      }, _react.default.createElement("i", {
        className: iconClassName
      })));
    } else {
      return null;
    }
  }

  render() {
    const value = this.processValue();
    const className = (0, _classnames.default)('p-treetable p-component', {
      'p-treetable-hoverable-rows': this.isRowSelectionMode(),
      'p-treetable-resizable': this.props.resizableColumns,
      'p-treetable-resizable-fit': this.props.resizableColumns && this.props.columnResizeMode === 'fit',
      'p-treetable-auto-layout': this.props.autoLayout
    });
    const table = this.renderTable(value);
    const totalRecords = this.getTotalRecords(value);

    const headerFacet = this.props.header && _react.default.createElement("div", {
      className: "p-treetable-header"
    }, this.props.header);

    const footerFacet = this.props.footer && _react.default.createElement("div", {
      className: "p-treetable-footer"
    }, this.props.footer);

    const paginatorTop = this.props.paginator && this.props.paginatorPosition !== 'bottom' && this.createPaginator('top', totalRecords);
    const paginatorBottom = this.props.paginator && this.props.paginatorPosition !== 'top' && this.createPaginator('bottom', totalRecords);
    const loader = this.renderLoader();

    const resizeHelper = this.props.resizableColumns && _react.default.createElement("div", {
      ref: el => {
        this.resizerHelper = el;
      },
      className: "p-column-resizer-helper",
      style: {
        display: 'none'
      }
    });

    const reorderIndicatorUp = this.props.reorderableColumns && _react.default.createElement("span", {
      ref: el => this.reorderIndicatorUp = el,
      className: "pi pi-arrow-down p-datatable-reorder-indicator-up",
      style: {
        position: 'absolute',
        display: 'none'
      }
    });

    const reorderIndicatorDown = this.props.reorderableColumns && _react.default.createElement("span", {
      ref: el => this.reorderIndicatorDown = el,
      className: "pi pi-arrow-up p-datatable-reorder-indicator-down",
      style: {
        position: 'absolute',
        display: 'none'
      }
    });

    return _react.default.createElement("div", {
      id: this.props.id,
      className: className,
      style: this.props.style,
      ref: el => this.container = el
    }, loader, headerFacet, paginatorTop, table, paginatorBottom, footerFacet, resizeHelper, reorderIndicatorUp, reorderIndicatorDown);
  }

}

exports.TreeTable = TreeTable;

_defineProperty(TreeTable, "defaultProps", {
  id: null,
  value: null,
  header: null,
  footer: null,
  style: null,
  className: null,
  tableStyle: null,
  tableClassName: null,
  expandedKeys: null,
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
  selectionMode: null,
  selectionKeys: null,
  contextMenuSelectionKey: null,
  metaKeySelection: true,
  propagateSelectionUp: true,
  propagateSelectionDown: true,
  autoLayout: false,
  rowClassName: null,
  loading: false,
  loadingIcon: 'pi pi-spinner',
  tabIndex: '0',
  scrollable: false,
  scrollHeight: null,
  reorderableColumns: false,
  headerColumnGroup: null,
  footerColumnGroup: null,
  frozenHeaderColumnGroup: null,
  frozenFooterColumnGroup: null,
  frozenWidth: null,
  resizableColumns: false,
  columnResizeMode: 'fit',
  emptyMessage: "No records found",
  filters: null,
  globalFilter: null,
  filterMode: 'lenient',
  onFilter: null,
  onExpand: null,
  onCollapse: null,
  onToggle: null,
  onPage: null,
  onSort: null,
  onSelect: null,
  onUnselect: null,
  onRowClick: null,
  onSelectionChange: null,
  onContextMenuSelectionChange: null,
  onColumnResizeEnd: null,
  onColReorder: null,
  onContextMenu: null
});

_defineProperty(TreeTable, "propTypes", {
  id: _propTypes.default.string,
  value: _propTypes.default.any,
  header: _propTypes.default.any,
  footer: _propTypes.default.any,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  tableStyle: _propTypes.default.any,
  tableClassName: _propTypes.default.string,
  expandedKeys: _propTypes.default.object,
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
  selectionMode: _propTypes.default.string,
  selectionKeys: _propTypes.default.any,
  contextMenuSelectionKey: _propTypes.default.any,
  metaKeySelection: _propTypes.default.bool,
  propagateSelectionUp: _propTypes.default.bool,
  propagateSelectionDown: _propTypes.default.bool,
  autoLayout: _propTypes.default.bool,
  rowClassName: _propTypes.default.func,
  loading: _propTypes.default.bool,
  loadingIcon: _propTypes.default.string,
  tabIndex: _propTypes.default.string,
  scrollable: _propTypes.default.bool,
  scrollHeight: _propTypes.default.string,
  reorderableColumns: _propTypes.default.bool,
  headerColumnGroup: _propTypes.default.any,
  footerColumnGroup: _propTypes.default.any,
  frozenHeaderColumnGroup: _propTypes.default.any,
  frozenFooterColumnGroup: _propTypes.default.any,
  frozenWidth: _propTypes.default.string,
  resizableColumns: _propTypes.default.bool,
  columnResizeMode: _propTypes.default.string,
  emptyMessage: _propTypes.default.string,
  filters: _propTypes.default.object,
  globalFilter: _propTypes.default.any,
  filterMode: _propTypes.default.string,
  onFilter: _propTypes.default.func,
  onExpand: _propTypes.default.func,
  onCollapse: _propTypes.default.func,
  onToggle: _propTypes.default.func,
  onPage: _propTypes.default.func,
  onSort: _propTypes.default.func,
  onSelect: _propTypes.default.func,
  onUnselect: _propTypes.default.func,
  onRowClick: _propTypes.default.func,
  onSelectionChange: _propTypes.default.func,
  onContextMenuSelectionChange: _propTypes.default.func,
  onColumnResizeEnd: _propTypes.default.func,
  onColReorder: _propTypes.default.func,
  onContextMenu: _propTypes.default.func
});