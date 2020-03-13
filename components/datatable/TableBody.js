"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TableBody = void 0;

var _react = _interopRequireWildcard(require("react"));

var _BodyRow = require("./BodyRow");

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

var _ObjectUtils = _interopRequireDefault(require("../utils/ObjectUtils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TableBody extends _react.Component {
  constructor(props) {
    super(props);
    this.onRowClick = this.onRowClick.bind(this);
    this.onRowRightClick = this.onRowRightClick.bind(this);
    this.onRowTouchEnd = this.onRowTouchEnd.bind(this);
    this.onRowToggle = this.onRowToggle.bind(this);
    this.onRadioClick = this.onRadioClick.bind(this);
    this.onCheckboxClick = this.onCheckboxClick.bind(this);
    this.onRowDragEnd = this.onRowDragEnd.bind(this);
    this.onRowDragLeave = this.onRowDragLeave.bind(this);
    this.onRowDrop = this.onRowDrop.bind(this);
  }

  onRowClick(event) {
    let targetNode = event.originalEvent.target.nodeName;

    if (targetNode === 'INPUT' || targetNode === 'BUTTON' || targetNode === 'A' || _DomHandler.default.hasClass(event.originalEvent.target, 'p-clickable')) {
      return;
    }

    if (this.props.onRowClick) {
      this.props.onRowClick(event);
    }

    if (this.props.selectionMode) {
      let rowData = event.data;
      let rowIndex = event.index;
      let selection;

      if (this.isMultipleSelectionMode() && event.originalEvent.shiftKey && this.anchorRowIndex !== null) {
        _DomHandler.default.clearSelection();

        this.rangeRowIndex = rowIndex;
        selection = this.selectRange(event);
      } else {
        let selected = this.isSelected(rowData);
        let metaSelection = this.rowTouched ? false : this.props.metaKeySelection;
        this.anchorRowIndex = rowIndex;
        this.rangeRowIndex = rowIndex;

        if (metaSelection) {
          let metaKey = event.originalEvent.metaKey || event.originalEvent.ctrlKey;

          if (selected && metaKey) {
            if (this.isSingleSelectionMode()) {
              selection = null;
            } else {
              let selectionIndex = this.findIndexInSelection(rowData);
              selection = this.props.selection.filter((val, i) => i !== selectionIndex);
            }

            if (this.props.onRowUnselect) {
              this.props.onRowUnselect({
                originalEvent: event.originalEvent,
                data: rowData,
                type: 'row'
              });
            }
          } else {
            if (this.isSingleSelectionMode()) {
              selection = rowData;
            } else if (this.isMultipleSelectionMode()) {
              if (metaKey) selection = this.props.selection ? [...this.props.selection] : [];else selection = [];
              selection = [...selection, rowData];
            }

            if (this.props.onRowSelect) {
              this.props.onRowSelect({
                originalEvent: event.originalEvent,
                data: rowData,
                type: 'row'
              });
            }
          }
        } else {
          if (this.isSingleSelectionMode()) {
            if (selected) {
              selection = null;

              if (this.props.onRowUnselect) {
                this.props.onRowUnselect({
                  originalEvent: event.originalEvent,
                  data: rowData,
                  type: 'row'
                });
              }
            } else {
              selection = rowData;

              if (this.props.onRowSelect) {
                this.props.onRowSelect({
                  originalEvent: event.originalEvent,
                  data: rowData,
                  type: 'row'
                });
              }
            }
          } else {
            if (selected) {
              let selectionIndex = this.findIndexInSelection(rowData);
              selection = this.props.selection.filter((val, i) => i !== selectionIndex);

              if (this.props.onRowSelect) {
                this.props.onRowSelect({
                  originalEvent: event.originalEvent,
                  data: rowData,
                  type: 'row'
                });
              }
            } else {
              selection = [...(this.props.selection || []), rowData];

              if (this.props.onRowSelect) {
                this.props.onRowSelect({
                  originalEvent: event.originalEvent,
                  data: rowData,
                  type: 'row'
                });
              }
            }
          }
        }
      }

      if (this.props.onSelectionChange) {
        this.props.onSelectionChange({
          originalEvent: event.originalEvent,
          value: selection
        });
      }
    }

    this.rowTouched = false;
  }

  selectRange(event) {
    let rangeStart, rangeEnd;

    if (this.rangeRowIndex > this.anchorRowIndex) {
      rangeStart = this.anchorRowIndex;
      rangeEnd = this.rangeRowIndex;
    } else if (this.rangeRowIndex < this.anchorRowIndex) {
      rangeStart = this.rangeRowIndex;
      rangeEnd = this.anchorRowIndex;
    } else {
      rangeStart = this.rangeRowIndex;
      rangeEnd = this.rangeRowIndex;
    }

    if (this.props.lazy && this.props.paginator) {
      rangeStart -= this.first;
      rangeEnd -= this.first;
    }

    const value = this.props.value;
    let selection = [];

    for (let i = rangeStart; i <= rangeEnd; i++) {
      let rangeRowData = value[i];
      selection.push(rangeRowData);

      if (this.props.onRowSelect) {
        this.props.onRowSelect({
          originalEvent: event.originalEvent,
          data: rangeRowData,
          type: 'row'
        });
      }
    }

    return selection;
  }

  onRowTouchEnd(event) {
    this.rowTouched = true;
  }

  onRowRightClick(event) {
    if (this.props.onContextMenu) {
      _DomHandler.default.clearSelection();

      if (this.props.onContextMenuSelectionChange) {
        this.props.onContextMenuSelectionChange({
          originalEvent: event.originalEvent,
          value: event.data
        });
      }

      if (this.props.onContextMenu) {
        this.props.onContextMenu({
          originalEvent: event.originalEvent,
          value: this.props.node
        });
      }

      event.originalEvent.preventDefault();
    }
  }

  onRadioClick(event) {
    let rowData = event.data;
    let selection;

    if (this.isSelected(rowData)) {
      selection = null;

      if (this.props.onRowUnselect) {
        this.props.onRowUnselect({
          originalEvent: event.originalEvent,
          data: rowData,
          type: 'radio'
        });
      }
    } else {
      selection = rowData;

      if (this.props.onRowSelect) {
        this.props.onRowSelect({
          originalEvent: event.originalEvent,
          data: rowData,
          type: 'radio'
        });
      }
    }

    if (this.props.onSelectionChange) {
      this.props.onSelectionChange({
        originalEvent: event.originalEvent,
        value: selection
      });
    }
  }

  onCheckboxClick(event) {
    let rowData = event.data;
    let selection;

    if (this.isSelected(rowData)) {
      let selectionIndex = this.findIndexInSelection(rowData);
      selection = this.props.selection.filter((val, i) => i !== selectionIndex);

      if (this.props.onRowUnselect) {
        this.props.onRowUnselect({
          originalEvent: event.originalEvent,
          data: rowData,
          type: 'checkbox'
        });
      }
    } else {
      selection = [...(this.props.selection || []), rowData];

      if (this.props.onRowSelect) {
        this.props.onRowSelect({
          originalEvent: event.originalEvent,
          data: rowData,
          type: 'checkbox'
        });
      }
    }

    if (this.props.onSelectionChange) {
      this.props.onSelectionChange({
        originalEvent: event.originalEvent,
        value: selection
      });
    }
  }

  isSingleSelectionMode() {
    return this.props.selectionMode === 'single';
  }

  isMultipleSelectionMode() {
    return this.props.selectionMode === 'multiple';
  }

  isSelected(rowData) {
    if (rowData && this.props.selection) {
      if (this.props.selection instanceof Array) return this.findIndexInSelection(rowData) > -1;else return this.equals(rowData, this.props.selection);
    }

    return false;
  }

  isContextMenuSelected(rowData) {
    if (rowData && this.props.contextMenuSelection) {
      return this.equals(rowData, this.props.contextMenuSelection);
    }

    return false;
  }

  equals(data1, data2) {
    return this.props.compareSelectionBy === 'equals' ? data1 === data2 : _ObjectUtils.default.equals(data1, data2, this.props.dataKey);
  }

  findIndexInSelection(rowData) {
    let index = -1;

    if (this.props.selection) {
      for (let i = 0; i < this.props.selection.length; i++) {
        if (this.equals(rowData, this.props.selection[i])) {
          index = i;
          break;
        }
      }
    }

    return index;
  }

  onRowToggle(event) {
    let expandedRows;

    if (this.props.dataKey) {
      let dataKeyValue = String(_ObjectUtils.default.resolveFieldData(event.data, this.props.dataKey));
      expandedRows = this.props.expandedRows ? _objectSpread({}, this.props.expandedRows) : {};

      if (expandedRows[dataKeyValue] != null) {
        delete expandedRows[dataKeyValue];

        if (this.props.onRowCollapse) {
          this.props.onRowCollapse({
            originalEvent: event,
            data: event.data
          });
        }
      } else {
        expandedRows[dataKeyValue] = true;

        if (this.props.onRowExpand) {
          this.props.onRowExpand({
            originalEvent: event,
            data: event.data
          });
        }
      }
    } else {
      let expandedRowIndex = this.findExpandedRowIndex(event.data);
      expandedRows = this.props.expandedRows ? [...this.props.expandedRows] : [];

      if (expandedRowIndex !== -1) {
        expandedRows = expandedRows.filter((val, i) => i !== expandedRowIndex);

        if (this.props.onRowCollapse) {
          this.props.onRowCollapse({
            originalEvent: event,
            data: event.data
          });
        }
      } else {
        expandedRows.push(event.data);

        if (this.props.onRowExpand) {
          this.props.onRowExpand({
            originalEvent: event,
            data: event.data
          });
        }
      }
    }

    this.props.onRowToggle({
      data: expandedRows
    });
  }

  findExpandedRowIndex(row) {
    let index = -1;

    if (this.props.expandedRows) {
      for (let i = 0; i < this.props.expandedRows.length; i++) {
        if (_ObjectUtils.default.equals(this.props.expandedRows[i], row)) {
          index = i;
          break;
        }
      }
    }

    return index;
  }

  isRowExpanded(row) {
    if (this.props.dataKey) {
      let dataKeyValue = String(_ObjectUtils.default.resolveFieldData(row, this.props.dataKey));
      return this.props.expandedRows && this.props.expandedRows[dataKeyValue] != null;
    } else {
      return this.findExpandedRowIndex(row) !== -1;
    }
  }

  isSelectionEnabled() {
    if (this.props.selectionMode || this.props.frozenSelectionMode != null) {
      return true;
    } else {
      if (Array.isArray(this.props.children)) {
        for (let i = 0; i < this.props.children.length; i++) {
          if (this.props.children[i].props.selectionMode) {
            return true;
          }
        }
      } else {
        return this.props.children && this.props.children.selectionMode != null;
      }
    }

    return false;
  }

  onRowDragStart(event, index) {
    this.rowDragging = true;
    this.draggedRowIndex = index;
    event.dataTransfer.setData('text', 'b'); // For firefox
  }

  onRowDragEnd(event, index) {
    this.rowDragging = false;
    this.draggedRowIndex = null;
    this.droppedRowIndex = null;
  }

  onRowDragOver(event, index) {
    if (this.rowDragging && this.draggedRowIndex !== index) {
      let rowElement = event.rowElement;

      let rowY = _DomHandler.default.getOffset(rowElement).top + _DomHandler.default.getWindowScrollTop();

      let pageY = event.originalEvent.pageY;
      let rowMidY = rowY + _DomHandler.default.getOuterHeight(rowElement) / 2;
      let prevRowElement = rowElement.previousElementSibling;

      if (pageY < rowMidY) {
        _DomHandler.default.removeClass(rowElement, 'p-datatable-dragpoint-bottom');

        this.droppedRowIndex = index;
        if (prevRowElement) _DomHandler.default.addClass(prevRowElement, 'p-datatable-dragpoint-bottom');else _DomHandler.default.addClass(rowElement, 'p-datatable-dragpoint-top');
      } else {
        if (prevRowElement) _DomHandler.default.removeClass(prevRowElement, 'p-datatable-dragpoint-bottom');else _DomHandler.default.addClass(rowElement, 'p-datatable-dragpoint-top');
        this.droppedRowIndex = index + 1;

        _DomHandler.default.addClass(rowElement, 'p-datatable-dragpoint-bottom');
      }
    }
  }

  onRowDragLeave(event) {
    let rowElement = event.rowElement;
    let prevRowElement = rowElement.previousElementSibling;

    if (prevRowElement) {
      _DomHandler.default.removeClass(prevRowElement, 'p-datatable-dragpoint-bottom');
    }

    _DomHandler.default.removeClass(rowElement, 'p-datatable-dragpoint-bottom');

    _DomHandler.default.removeClass(rowElement, 'p-datatable-dragpoint-top');
  }

  onRowDrop(event) {
    if (this.droppedRowIndex != null) {
      let dropIndex = this.draggedRowIndex > this.droppedRowIndex ? this.droppedRowIndex : this.droppedRowIndex === 0 ? 0 : this.droppedRowIndex - 1;
      let val = [...this.props.value];

      _ObjectUtils.default.reorderArray(val, this.draggedRowIndex, dropIndex);

      if (this.props.onRowReorder) {
        this.props.onRowReorder({
          originalEvent: event,
          value: val,
          dragIndex: this.draggedRowIndex,
          dropIndex: this.droppedRowIndex
        });
      }
    } //cleanup


    this.onRowDragLeave(event);
    this.onRowDragEnd(event);
  }

  renderRowGroupHeader(rowData, index) {
    return _react.default.createElement("tr", {
      key: index + '_rowgroupheader',
      className: "p-rowgroup-header"
    }, _react.default.createElement("td", {
      colSpan: _react.default.Children.count(this.props.children)
    }, _react.default.createElement("span", {
      className: "p-rowgroup-header-name"
    }, this.props.rowGroupHeaderTemplate(rowData, index))));
  }

  renderRowGroupFooter(rowData, index) {
    return _react.default.createElement("tr", {
      key: index + '_rowgroupfooter',
      className: "p-rowgroup-footer"
    }, this.props.rowGroupFooterTemplate(rowData, index));
  }

  render() {
    let rows;
    let rpp = this.props.rows || 0;
    let first = this.props.first || 0;
    let selectionEnabled = this.isSelectionEnabled();
    let rowGroupMode = this.props.rowGroupMode;
    let hasSubheaderGrouping = rowGroupMode && rowGroupMode === 'subheader';
    let rowSpanGrouping = rowGroupMode && rowGroupMode === 'rowspan';

    if (this.props.value && this.props.value.length) {
      rows = [];
      let startIndex = this.props.lazy ? 0 : first;
      let endIndex = this.props.virtualScroll ? startIndex + rpp * 2 : startIndex + rpp || this.props.value.length;

      for (let i = startIndex; i < endIndex; i++) {
        if (i >= this.props.value.length) {
          break;
        }

        let rowData = this.props.value[i];
        let expanded = this.isRowExpanded(rowData);
        let selected = selectionEnabled ? this.isSelected(this.props.value[i]) : false;
        let contextMenuSelected = this.isContextMenuSelected(rowData);
        let groupRowSpan; //header row group

        if (hasSubheaderGrouping) {
          let currentRowFieldData = _ObjectUtils.default.resolveFieldData(rowData, this.props.groupField);

          let previousRowFieldData = _ObjectUtils.default.resolveFieldData(this.props.value[i - 1], this.props.groupField);

          if (i === 0 || currentRowFieldData !== previousRowFieldData) {
            rows.push(this.renderRowGroupHeader(rowData, i));
          }
        }

        if (rowSpanGrouping) {
          let rowSpanIndex = i;

          let currentRowFieldData = _ObjectUtils.default.resolveFieldData(rowData, this.props.sortField);

          let shouldCountRowSpan = i === startIndex || _ObjectUtils.default.resolveFieldData(this.props.value[i - 1], this.props.sortField) !== currentRowFieldData;

          if (shouldCountRowSpan) {
            let nextRowFieldData = currentRowFieldData;
            groupRowSpan = 0;

            while (currentRowFieldData === nextRowFieldData) {
              groupRowSpan++;
              let nextRowData = this.props.value[++rowSpanIndex];

              if (nextRowData) {
                nextRowFieldData = _ObjectUtils.default.resolveFieldData(nextRowData, this.props.sortField);
              } else {
                break;
              }
            }
          }
        } //row content


        let bodyRow = _react.default.createElement(_BodyRow.BodyRow, {
          key: i,
          value: this.props.value,
          rowData: rowData,
          rowIndex: i,
          onClick: this.onRowClick,
          onDoubleClick: this.props.onRowDoubleClick,
          onRightClick: this.onRowRightClick,
          onTouchEnd: this.onRowTouchEnd,
          onRowToggle: this.onRowToggle,
          expanded: expanded,
          responsive: this.props.responsive,
          selectionMode: this.props.selectionMode,
          onRadioClick: this.onRadioClick,
          onCheckboxClick: this.onCheckboxClick,
          selected: selected,
          contextMenuSelected: contextMenuSelected,
          rowClassName: this.props.rowClassName,
          sortField: this.props.sortField,
          rowGroupMode: this.props.rowGroupMode,
          groupRowSpan: groupRowSpan,
          onDragStart: e => this.onRowDragStart(e, i),
          onDragEnd: this.onRowDragEnd,
          onDragOver: e => this.onRowDragOver(e, i),
          onDragLeave: this.onRowDragLeave,
          onDrop: this.onRowDrop,
          virtualRowHeight: this.props.virtualRowHeight,
          editMode: this.props.editMode,
          rowEditorValidator: this.props.rowEditorValidator,
          onRowEditInit: this.props.onRowEditInit,
          onRowEditSave: this.props.onRowEditSave,
          onRowEditCancel: this.props.onRowEditCancel
        }, this.props.children);

        rows.push(bodyRow); //row expansion

        if (expanded) {
          let expandedRowContent = this.props.rowExpansionTemplate(rowData);

          let expandedRow = _react.default.createElement("tr", {
            key: i + '_expanded'
          }, _react.default.createElement("td", {
            colSpan: this.props.children.length
          }, expandedRowContent));

          rows.push(expandedRow);
        } //footer row group


        if (hasSubheaderGrouping) {
          let currentRowFieldData = _ObjectUtils.default.resolveFieldData(rowData, this.props.groupField);

          let nextRowFieldData = _ObjectUtils.default.resolveFieldData(this.props.value[i + 1], this.props.groupField);

          if (i === this.props.value.length - 1 || currentRowFieldData !== nextRowFieldData) {
            rows.push(this.renderRowGroupFooter(rowData, i));
          }
        }
      }
    } else {
      rows = !this.props.loading && this.props.emptyMessage ? _react.default.createElement("tr", {
        className: "p-datatable-emptymessage"
      }, _react.default.createElement("td", {
        colSpan: this.props.children.length
      }, this.props.emptyMessage)) : null;
    }

    return _react.default.createElement("tbody", {
      className: "p-datatable-tbody"
    }, rows);
  }

}

exports.TableBody = TableBody;