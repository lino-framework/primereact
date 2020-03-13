"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BodyRow = void 0;

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _BodyCell = require("./BodyCell");

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BodyRow extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
    this.onClick = this.onClick.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onRightClick = this.onRightClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onRowEditInit = this.onRowEditInit.bind(this);
    this.onRowEditSave = this.onRowEditSave.bind(this);
    this.onRowEditCancel = this.onRowEditCancel.bind(this);
  }

  onClick(event) {
    if (this.props.onClick) {
      this.props.onClick({
        originalEvent: event,
        data: this.props.rowData,
        index: this.props.rowIndex
      });
    }
  }

  onDoubleClick(event) {
    if (this.props.onDoubleClick) {
      this.props.onDoubleClick({
        originalEvent: event,
        data: this.props.rowData,
        index: this.props.rowIndex
      });
    }
  }

  onTouchEnd(event) {
    if (this.props.onTouchEnd) {
      this.props.onTouchEnd(event);
    }
  }

  onRightClick(event) {
    if (this.props.onRightClick) {
      this.props.onRightClick({
        originalEvent: event,
        data: this.props.rowData,
        index: this.props.rowIndex
      });
    }
  }

  onMouseDown(event) {
    if (_DomHandler.default.hasClass(event.target, 'p-table-reorderablerow-handle')) event.currentTarget.draggable = true;else event.currentTarget.draggable = false;
  }

  onDragEnd(event) {
    if (this.props.onDragEnd) {
      this.props.onDragEnd(event);
    }

    event.currentTarget.draggable = false;
  }

  onDragOver(event) {
    if (this.props.onDragOver) {
      this.props.onDragOver({
        originalEvent: event,
        rowElement: this.container
      });
    }

    event.preventDefault();
  }

  onDragLeave(event) {
    if (this.props.onDragLeave) {
      this.props.onDragLeave({
        originalEvent: event,
        rowElement: this.container
      });
    }
  }

  onDrop(event) {
    if (this.props.onDrop) {
      this.props.onDrop({
        originalEvent: event,
        rowElement: this.container
      });
    }

    event.preventDefault();
  }

  onKeyDown(event) {
    if (this.props.selectionMode) {
      const row = event.target;

      switch (event.which) {
        //down arrow
        case 40:
          let nextRow = this.findNextSelectableRow(row);

          if (nextRow) {
            nextRow.focus();
          }

          event.preventDefault();
          break;
        //up arrow

        case 38:
          let prevRow = this.findPrevSelectableRow(row);

          if (prevRow) {
            prevRow.focus();
          }

          event.preventDefault();
          break;
        //enter

        case 13:
          this.onClick(event);
          break;

        default:
          //no op
          break;
      }
    }
  }

  findNextSelectableRow(row) {
    let nextRow = row.nextElementSibling;

    if (nextRow) {
      if (_DomHandler.default.hasClass(nextRow, 'p-datatable-row')) return nextRow;else return this.findNextSelectableRow(nextRow);
    } else {
      return null;
    }
  }

  findPrevSelectableRow(row) {
    let prevRow = row.previousElementSibling;

    if (prevRow) {
      if (_DomHandler.default.hasClass(prevRow, 'p-datatable-row')) return prevRow;else return this.findPrevSelectableRow(prevRow);
    } else {
      return null;
    }
  }

  onRowEditInit(event) {
    if (this.props.onRowEditInit) {
      this.props.onRowEditInit({
        originalEvent: event,
        data: this.props.rowData
      });
    }

    this.setState({
      editing: true
    });
    event.preventDefault();
  }

  onRowEditSave(event) {
    let valid = true;

    if (this.props.rowEditorValidator) {
      valid = this.props.rowEditorValidator(this.props.rowData);
    }

    if (this.props.onRowEditSave) {
      this.props.onRowEditSave({
        originalEvent: event,
        data: this.props.rowData
      });
    }

    this.setState({
      editing: !valid
    });
    event.preventDefault();
  }

  onRowEditCancel(event) {
    if (this.props.onRowEditCancel) {
      this.props.onRowEditCancel({
        originalEvent: event,
        data: this.props.rowData,
        index: this.props.rowIndex
      });
    }

    this.setState({
      editing: false
    });
    event.preventDefault();
  }

  render() {
    let columns = _react.default.Children.toArray(this.props.children);

    let conditionalStyles = {
      'p-highlight': this.props.selected,
      'p-highlight-contextmenu': this.props.contextMenuSelected
    };

    if (this.props.rowClassName) {
      let rowClassNameCondition = this.props.rowClassName(this.props.rowData);
      conditionalStyles = _objectSpread({}, conditionalStyles, {}, rowClassNameCondition);
    }

    let className = (0, _classnames.default)('p-datatable-row', conditionalStyles);
    let hasRowSpanGrouping = this.props.rowGroupMode === 'rowspan';
    let cells = [];

    for (let i = 0; i < columns.length; i++) {
      let column = columns[i];
      let rowSpan;

      if (hasRowSpanGrouping) {
        if (this.props.sortField === column.props.field) {
          if (this.props.groupRowSpan) {
            rowSpan = this.props.groupRowSpan;
            className += ' p-datatable-rowspan-group';
          } else {
            continue;
          }
        }
      }

      let cell = _react.default.createElement(_BodyCell.BodyCell, _extends({
        key: i
      }, column.props, {
        value: this.props.value,
        rowSpan: rowSpan,
        rowData: this.props.rowData,
        rowIndex: this.props.rowIndex,
        onRowToggle: this.props.onRowToggle,
        expanded: this.props.expanded,
        onRadioClick: this.props.onRadioClick,
        onCheckboxClick: this.props.onCheckboxClick,
        responsive: this.props.responsive,
        selected: this.props.selected,
        editMode: this.props.editMode,
        editing: this.state.editing,
        onRowEditInit: this.onRowEditInit,
        onRowEditSave: this.onRowEditSave,
        onRowEditCancel: this.onRowEditCancel
      }));

      cells.push(cell);
    }

    return _react.default.createElement("tr", {
      tabIndex: this.props.selectionMode ? '0' : null,
      ref: el => {
        this.container = el;
      },
      className: className,
      onClick: this.onClick,
      onDoubleClick: this.onDoubleClick,
      onTouchEnd: this.onTouchEnd,
      onContextMenu: this.onRightClick,
      onMouseDown: this.onMouseDown,
      onDragStart: this.props.onDragStart,
      onDragEnd: this.onDragEnd,
      onDragOver: this.onDragOver,
      onDragLeave: this.onDragLeave,
      onDrop: this.onDrop,
      style: {
        height: this.props.virtualRowHeight
      },
      onKeyDown: this.onKeyDown
    }, cells);
  }

}

exports.BodyRow = BodyRow;