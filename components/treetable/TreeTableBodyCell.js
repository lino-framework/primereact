"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TreeTableBodyCell = void 0;

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _ObjectUtils = _interopRequireDefault(require("../utils/ObjectUtils"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class TreeTableBodyCell extends _react.Component {
  constructor(props) {
    super(props);

    if (this.props.editor) {
      this.state = {};
    }

    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onEditorFocus = this.onEditorFocus.bind(this);
  }

  onClick() {
    if (this.props.editor) {
      this.setState({
        editing: true
      });
      if (this.documentEditListener) this.cellClick = true;else this.bindDocumentEditListener();
    }
  }

  onKeyDown(event) {
    if (event.which === 13 || event.which === 9) {
      this.switchCellToViewMode();
    }
  }

  bindDocumentEditListener() {
    if (!this.documentEditListener) {
      this.documentEditListener = event => {
        if (!this.cellClick) {
          this.switchCellToViewMode();
        }

        this.cellClick = false;
      };

      document.addEventListener('click', this.documentEditListener);
    }
  }

  unbindDocumentEditListener() {
    if (this.documentEditListener) {
      document.removeEventListener('click', this.documentEditListener);
      this.documentEditListener = null;
    }
  }

  closeCell() {
    this.setState({
      editing: false
    });
    this.unbindDocumentEditListener();
  }

  onEditorFocus(event) {
    this.onClick(event);
  }

  switchCellToViewMode() {
    if (this.props.editorValidator) {
      let valid = this.props.editorValidator(this.props);

      if (valid) {
        this.closeCell();
      }
    } else {
      this.closeCell();
    }
  }

  componentDidUpdate() {
    if (this.container && this.props.editor) {
      if (this.state && this.state.editing) {
        let focusable = _DomHandler.default.findSingle(this.container, 'input');

        if (focusable) {
          focusable.setAttribute('data-isCellEditing', true);
          focusable.focus();
        }

        this.keyHelper.tabIndex = -1;
      } else {
        setTimeout(() => {
          if (this.keyHelper) {
            this.keyHelper.removeAttribute('tabindex');
          }
        }, 50);
      }
    }
  }

  render() {
    const className = (0, _classnames.default)(this.props.bodyClassName || this.props.className, {
      'p-editable-column': this.props.editor,
      'p-cell-editing': this.props.editor ? this.state.editing : false
    });
    const style = this.props.bodyStyle || this.props.style;
    let content;

    if (this.state && this.state.editing) {
      if (this.props.editor) content = this.props.editor(this.props);else throw new Error("Editor is not found on column.");
    } else {
      if (this.props.body) content = this.props.body(this.props.node, this.props.column);else content = _ObjectUtils.default.resolveFieldData(this.props.node.data, this.props.field);
    }
    /* eslint-disable */


    const editorKeyHelper = this.props.editor && _react.default.createElement("a", {
      tabIndex: "0",
      ref: el => {
        this.keyHelper = el;
      },
      className: "p-cell-editor-key-helper p-hidden-accessible",
      onFocus: this.onEditorFocus
    }, _react.default.createElement("span", null));
    /* eslint-enable */


    return _react.default.createElement("td", {
      ref: el => this.container = el,
      className: className,
      style: style,
      onClick: this.onClick,
      onKeyDown: this.onKeyDown
    }, this.props.children, editorKeyHelper, content);
  }

}

exports.TreeTableBodyCell = TreeTableBodyCell;