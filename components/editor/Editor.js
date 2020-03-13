"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Editor = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _quill = _interopRequireDefault(require("quill"));

require("quill/dist/quill.snow.css");

require("quill/dist/quill.bubble.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Editor extends _react.Component {
  componentDidMount() {
    this.quill = new _quill.default(this.editorElement, {
      modules: _objectSpread({
        toolbar: this.toolbarElement
      }, this.props.modules),
      placeholder: this.props.placeholder,
      readOnly: this.props.readOnly,
      theme: this.props.theme,
      formats: this.props.formats
    });

    if (this.props.value) {
      this.quill.pasteHTML(this.props.value);
    }

    this.quill.on('text-change', (delta, source) => {
      let html = this.editorElement.children[0].innerHTML;
      let text = this.quill.getText();

      if (html === '<p><br></p>') {
        html = null;
      }

      if (this.props.onTextChange) {
        this.props.onTextChange({
          htmlValue: html,
          textValue: text,
          delta: delta,
          source: source
        });
      }
    });
    this.quill.on('selection-change', (range, oldRange, source) => {
      if (this.props.onSelectionChange) {
        this.props.onSelectionChange({
          range: range,
          oldRange: oldRange,
          source: source
        });
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value && this.quill && !this.quill.hasFocus()) {
      if (this.props.value) this.quill.pasteHTML(this.props.value);else this.quill.setText('');
    }
  }

  render() {
    let containerClass = (0, _classnames.default)('p-component p-editor-container', this.props.className);
    let toolbarHeader = null;

    if (this.props.headerTemplate) {
      toolbarHeader = _react.default.createElement("div", {
        ref: el => this.toolbarElement = el,
        className: "p-editor-toolbar"
      }, this.props.headerTemplate);
    } else {
      toolbarHeader = _react.default.createElement("div", {
        ref: el => this.toolbarElement = el,
        className: "p-editor-toolbar"
      }, _react.default.createElement("span", {
        className: "ql-formats"
      }, _react.default.createElement("select", {
        className: "ql-header",
        defaultValue: "0"
      }, _react.default.createElement("option", {
        value: "1"
      }, "Heading"), _react.default.createElement("option", {
        value: "2"
      }, "Subheading"), _react.default.createElement("option", {
        value: "0"
      }, "Normal")), _react.default.createElement("select", {
        className: "ql-font"
      }, _react.default.createElement("option", null), _react.default.createElement("option", {
        value: "serif"
      }), _react.default.createElement("option", {
        value: "monospace"
      }))), _react.default.createElement("span", {
        className: "ql-formats"
      }, _react.default.createElement("button", {
        className: "ql-bold",
        "aria-label": "Bold"
      }), _react.default.createElement("button", {
        className: "ql-italic",
        "aria-label": "Italic"
      }), _react.default.createElement("button", {
        className: "ql-underline",
        "aria-label": "Underline"
      })), _react.default.createElement("span", {
        className: "ql-formats"
      }, _react.default.createElement("select", {
        className: "ql-color"
      }), _react.default.createElement("select", {
        className: "ql-background"
      })), _react.default.createElement("span", {
        className: "ql-formats"
      }, _react.default.createElement("button", {
        className: "ql-list",
        value: "ordered",
        "aria-label": "Ordered List"
      }), _react.default.createElement("button", {
        className: "ql-list",
        value: "bullet",
        "aria-label": "Unordered List"
      }), _react.default.createElement("select", {
        className: "ql-align"
      }, _react.default.createElement("option", {
        defaultValue: true
      }), _react.default.createElement("option", {
        value: "center"
      }), _react.default.createElement("option", {
        value: "right"
      }), _react.default.createElement("option", {
        value: "justify"
      }))), _react.default.createElement("span", {
        className: "ql-formats"
      }, _react.default.createElement("button", {
        className: "ql-link",
        "aria-label": "Insert Link"
      }), _react.default.createElement("button", {
        className: "ql-image",
        "aria-label": "Insert Image"
      }), _react.default.createElement("button", {
        className: "ql-code-block",
        "aria-label": "Insert Code Block"
      })), _react.default.createElement("span", {
        className: "ql-formats"
      }, _react.default.createElement("button", {
        className: "ql-clean",
        "aria-label": "Remove Styles"
      })));
    }

    let content = _react.default.createElement("div", {
      ref: el => this.editorElement = el,
      className: "p-editor-content",
      style: this.props.style
    });

    return _react.default.createElement("div", {
      id: this.props.id,
      className: containerClass
    }, toolbarHeader, content);
  }

}

exports.Editor = Editor;

_defineProperty(Editor, "defaultProps", {
  id: null,
  value: null,
  style: null,
  className: null,
  placeholder: null,
  readOnly: false,
  modules: null,
  formats: null,
  theme: 'snow',
  headerTemplate: null,
  onTextChange: null,
  onSelectionChange: null
});

_defineProperty(Editor, "propTypes", {
  id: _propTypes.default.string,
  value: _propTypes.default.string,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  placeholder: _propTypes.default.string,
  readOnly: _propTypes.default.bool,
  modules: _propTypes.default.object,
  formats: _propTypes.default.array,
  theme: _propTypes.default.string,
  headerTemplate: _propTypes.default.any,
  onTextChange: _propTypes.default.func,
  onSelectionChange: _propTypes.default.func
});