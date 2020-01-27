"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BodyCell = void 0;

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _ObjectUtils = _interopRequireDefault(require("../utils/ObjectUtils"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

var _RowRadioButton = require("./RowRadioButton");

var _RowCheckbox = require("./RowCheckbox");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BodyCell =
/*#__PURE__*/
function (_Component) {
  _inherits(BodyCell, _Component);

  function BodyCell(props) {
    var _this;

    _classCallCheck(this, BodyCell);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BodyCell).call(this, props));
    _this.state = {
      editing: _this.props.editing
    };
    _this.onExpanderClick = _this.onExpanderClick.bind(_assertThisInitialized(_this));
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_this));
    _this.onBlur = _this.onBlur.bind(_assertThisInitialized(_this));
    _this.onKeyDown = _this.onKeyDown.bind(_assertThisInitialized(_this));
    _this.onEditorFocus = _this.onEditorFocus.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(BodyCell, [{
    key: "onExpanderClick",
    value: function onExpanderClick(event) {
      if (this.props.onRowToggle) {
        this.props.onRowToggle({
          originalEvent: event,
          data: this.props.rowData
        });
      }

      event.preventDefault();
    }
  }, {
    key: "onKeyDown",
    value: function onKeyDown(event) {
      var el = event.target,
          tr = el.closest("tr");

      if (event.which === 13 || event.which === 9) {
        // enter || tab
        event.preventDefault();
        this.switchCellToViewMode(event, true);
      }

      if (event.which === 13) {
        tr = event.shiftKey ? tr.previousSibling : tr.nextSibling;

        if (tr) {
          //might be end of table
          tr.children[this.props.cellIndex].getElementsByClassName("p-cell-editor-key-helper")[0].focus(); // if (helper.length) {
          //     helper[0].focus()
        }
      }

      if (event.which === 9) {
        var tbl = el.closest("table"); // bad logic, should just find all of that class, find the one containing self, and + / - 1 and focus.

        var cols = Array.apply(void 0, _toConsumableArray(tbl.getElementsByClassName("p-cell-editor-key-helper"))),
            i = cols.findIndex(function (n) {
          return n.parentElement.contains(el);
        });
        i = event.shiftKey ? i - 1 : i + 1; // if (i === cols.length || i < 0) { // if out of index range of cols
        // Gotta goto next tr..
        // tr = event.shiftKey ? tr.previousSibling :
        //                       tr.nextSibling;
        // cols = Array(...tr.getElementsByClassName("p-cell-editor-key-helper"));
        // i = i < 0 ? cols.length-1 : 0; // last or first col.
        // }

        cols[i].focus(); // Open next / prev editor
      }

      if (event.which === 27) // escape
        {
          this.switchCellToViewMode(event, false);
        }
    }
  }, {
    key: "onClick",
    value: function onClick() {
      if (this.props.editMode !== 'row') {
        this.editingCellClick = true;

        if (this.props.editor && !this.state.editing && (!this.props.isDisabled || !this.props.isDisabled(this.props))) {
          this.setState({
            editing: true
          });

          if (this.props.editorValidatorEvent === 'click') {
            this.bindDocumentEditListener();
          }

          this.props.onEditorOpen && this.props.onEditorOpen(this.props);
        }
      }
    }
  }, {
    key: "onBlur",
    value: function onBlur(event) {
      if (this.props.editMode !== 'row' && this.state.editing && this.props.editorValidatorEvent === 'blur') {
        this.switchCellToViewMode(event, true);
      }
    }
  }, {
    key: "onEditorFocus",
    value: function onEditorFocus(event) {
      this.onClick(event);
    }
  }, {
    key: "bindDocumentEditListener",
    value: function bindDocumentEditListener() {
      var _this2 = this;

      if (!this.documentEditListener) {
        this.documentEditListener = function (event) {
          if (!_this2.editingCellClick) {
            _this2.switchCellToViewMode(event, true);
          }

          _this2.editingCellClick = false;
        };

        this.editingCellClick = false;
        document.addEventListener('click', this.documentEditListener);
      }
    }
  }, {
    key: "closeCell",
    value: function closeCell() {
      this.setState({
        editing: false
      });
      this.unbindDocumentEditListener();
    }
  }, {
    key: "switchCellToViewMode",
    value: function switchCellToViewMode(event, submit) {
      if (this.props.editorValidator && submit) {
        var valid = this.props.editorValidator(this.props);

        if (valid) {
          if (this.props.onEditorSubmit) {
            this.props.onEditorSubmit(event, this.props);
          }

          this.closeCell();
        } // as per previous version if not valid and another editor is open, keep invalid data editor open.

      } else {
        if (submit && this.props.onEditorSubmit) {
          this.props.onEditorSubmit(event, this.props);
        } else if (this.props.onEditorCancel) {
          this.props.onEditorCancel(event, this.props);
        }

        this.closeCell();
      }
    }
  }, {
    key: "unbindDocumentEditListener",
    value: function unbindDocumentEditListener() {
      if (this.documentEditListener) {
        document.removeEventListener('click', this.documentEditListener);
        this.documentEditListener = null;
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this3 = this;

      if (this.props.editMode !== 'row' && this.container && this.props.editor) {
        clearTimeout(this.tabindexTimeout);

        if (this.state.editing) {
          var focusable = _DomHandler.default.findSingle(this.container, 'input');

          if (focusable) {
            focusable.setAttribute('data-isCellEditing', true);
            focusable.focus();
          }

          this.keyHelper && (this.keyHelper.tabIndex = -1);
        } else {
          this.tabindexTimeout = setTimeout(function () {
            if (_this3.keyHelper) {
              _this3.keyHelper.setAttribute('tabindex', 0);
            }
          }, 50);
        }
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.unbindDocumentEditListener();
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var content, header, editorKeyHelper;
      var cellClassName = (0, _classnames.default)(this.props.bodyClassName || this.props.className, {
        'p-selection-column': this.props.selectionMode,
        'p-editable-column': this.props.editor,
        'p-cell-editing': this.state.editing && this.props.editor
      });

      if (this.props.expander) {
        var iconClassName = (0, _classnames.default)('p-row-toggler-icon pi pi-fw p-clickable', {
          'pi-chevron-down': this.props.expanded,
          'pi-chevron-right': !this.props.expanded
        });
        content = _react.default.createElement("button", {
          onClick: this.onExpanderClick,
          className: "p-row-toggler p-link"
        }, _react.default.createElement("span", {
          className: iconClassName
        }));
      } else if (this.props.selectionMode) {
        if (this.props.selectionMode === 'single') content = _react.default.createElement(_RowRadioButton.RowRadioButton, {
          onClick: this.props.onRadioClick,
          rowData: this.props.rowData,
          selected: this.props.selected
        });else content = _react.default.createElement(_RowCheckbox.RowCheckbox, {
          onClick: this.props.onCheckboxClick,
          rowData: this.props.rowData,
          selected: this.props.selected
        });
      } else if (this.props.rowReorder) {
        var reorderIcon = (0, _classnames.default)('p-table-reorderablerow-handle', this.props.rowReorderIcon);
        content = _react.default.createElement("i", {
          className: reorderIcon
        });
      } else if (this.props.rowEditor) {
        if (this.state.editing) {
          content = _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("button", {
            onClick: this.props.onRowEditSave,
            className: "p-row-editor-save p-link"
          }, _react.default.createElement("span", {
            className: "p-row-editor-save-icon pi pi-fw pi-check p-clickable"
          })), _react.default.createElement("button", {
            onClick: this.props.onRowEditCancel,
            className: "p-row-editor-cancel p-link"
          }, _react.default.createElement("span", {
            className: "p-row-editor-cancel-icon pi pi-fw pi-times p-clickable"
          })));
        } else {
          content = _react.default.createElement("button", {
            onClick: this.props.onRowEditInit,
            className: "p-row-editor-init p-link"
          }, _react.default.createElement("span", {
            className: "p-row-editor-init-icon pi pi-fw pi-pencil p-clickable"
          }));
        }
      } else {
        if (this.state.editing && this.props.editor) {
          content = this.props.editor(this.props);
        } else {
          if (this.props.body) content = this.props.body(this.props.rowData, this.props);else content = _ObjectUtils.default.resolveFieldData(this.props.rowData, this.props.field);
        }
      }

      if (this.props.responsive) {
        header = _react.default.createElement("span", {
          className: "p-column-title"
        }, this.props.header);
      }
      /* eslint-disable */


      editorKeyHelper = this.props.editor && (!this.props.isDisabled || !this.props.isDisabled(this.props)) && _react.default.createElement("a", {
        tabIndex: "0",
        ref: function ref(el) {
          _this4.keyHelper = el;
        },
        className: "p-cell-editor-key-helper p-hidden-accessible",
        onFocus: this.onEditorFocus
      }, _react.default.createElement("span", null));
      /* eslint-enable */

      return _react.default.createElement("td", {
        ref: function ref(el) {
          _this4.container = el;
        },
        className: cellClassName,
        style: this.props.bodyStyle || this.props.style,
        onClick: this.onClick,
        onKeyDown: this.onKeyDown,
        rowSpan: this.props.rowSpan,
        onBlur: this.onBlur
      }, header, editorKeyHelper, content);
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.editMode === 'row' && nextProps.editing !== prevState.editing) {
        return {
          editing: nextProps.editing
        };
      }

      return null;
    }
  }]);

  return BodyCell;
}(_react.Component);

exports.BodyCell = BodyCell;