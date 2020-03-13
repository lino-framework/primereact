"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileUpload = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Button = require("../button/Button");

var _Messages = require("../messages/Messages");

var _ProgressBar = require("../progressbar/ProgressBar");

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class FileUpload extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      msgs: []
    };
    this.upload = this.upload.bind(this);
    this.clear = this.clear.bind(this);
    this.onFileSelect = this.onFileSelect.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onSimpleUploaderClick = this.onSimpleUploaderClick.bind(this);
  }

  hasFiles() {
    return this.state.files && this.state.files.length > 0;
  }

  isImage(file) {
    return /^image\//.test(file.type);
  }

  remove(index) {
    this.clearInputElement();
    let currentFiles = [...this.state.files];
    currentFiles.splice(index, 1);
    this.setState({
      files: currentFiles
    });
  }

  clearInputElement() {
    this.fileInput.value = '';

    if (this.props.mode === 'basic') {
      this.fileInput.style.display = 'inline';
    }
  }

  formatSize(bytes) {
    if (bytes === 0) {
      return '0 B';
    }

    let k = 1000,
        dm = 3,
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  onFileSelect(event) {
    this.setState({
      msgs: []
    });
    this.files = this.state.files || [];
    let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;

    for (let i = 0; i < files.length; i++) {
      let file = files[i];

      if (!this.isFileSelected(file)) {
        if (this.validate(file)) {
          if (this.isImage(file)) {
            file.objectURL = window.URL.createObjectURL(file);
          }

          this.files.push(file);
        }
      }
    }

    this.setState({
      files: this.files
    }, () => {
      if (this.hasFiles() && this.props.auto) {
        this.upload();
      }
    });

    if (this.props.onSelect) {
      this.props.onSelect({
        originalEvent: event,
        files: files
      });
    }

    this.clearInputElement();

    if (this.props.mode === 'basic') {
      this.fileInput.style.display = 'none';
    }
  }

  isFileSelected(file) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.state.files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        let sFile = _step.value;
        if (sFile.name + sFile.type + sFile.size === file.name + file.type + file.size) return true;
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

    return false;
  }

  validate(file) {
    if (this.props.maxFileSize && file.size > this.props.maxFileSize) {
      const message = {
        severity: 'error',
        summary: this.props.invalidFileSizeMessageSummary.replace('{0}', file.name),
        detail: this.props.invalidFileSizeMessageDetail.replace('{0}', this.formatSize(this.props.maxFileSize))
      };

      if (this.props.mode === 'advanced') {
        this.messagesUI.show(message);
      }

      if (this.props.onValidationFail) {
        this.props.onValidationFail(file);
      }

      return false;
    }

    return true;
  }

  upload() {
    if (this.props.customUpload) {
      if (this.props.uploadHandler) {
        this.props.uploadHandler({
          files: this.state.files
        });
      }
    } else {
      this.setState({
        msgs: []
      });
      let xhr = new XMLHttpRequest();
      let formData = new FormData();

      if (this.props.onBeforeUpload) {
        this.props.onBeforeUpload({
          'xhr': xhr,
          'formData': formData
        });
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.state.files[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          let file = _step2.value;
          formData.append(this.props.name, file, file.name);
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

      xhr.upload.addEventListener('progress', event => {
        if (event.lengthComputable) {
          this.setState({
            progress: Math.round(event.loaded * 100 / event.total)
          });
        }

        if (this.props.onProgress) {
          this.props.onProgress({
            originalEvent: event,
            progress: this.progress
          });
        }

        ;
      });

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          this.setState({
            progress: 0
          });

          if (xhr.status >= 200 && xhr.status < 300) {
            if (this.props.onUpload) {
              this.props.onUpload({
                xhr: xhr,
                files: this.files
              });
            }
          } else {
            if (this.props.onError) {
              this.props.onError({
                xhr: xhr,
                files: this.files
              });
            }
          }

          this.clear();
        }
      };

      xhr.open('POST', this.props.url, true);

      if (this.props.onBeforeSend) {
        this.props.onBeforeSend({
          'xhr': xhr,
          'formData': formData
        });
      }
    }

    ;
    xhr.open('POST', this.props.url, true);

    if (this.props.onBeforeSend) {
      let doSend = this.props.onBeforeSend({
        'xhr': xhr,
        'formData': formData
      });

      if (doSend === false) {
        return;
      }
    }
  }

  clear() {
    this.setState({
      files: []
    });

    if (this.props.onClear) {
      this.props.onClear();
    }

    this.clearInputElement();
  }

  onFocus(event) {
    _DomHandler.default.addClass(event.currentTarget.parentElement, 'p-focus');
  }

  onBlur(event) {
    _DomHandler.default.removeClass(event.currentTarget.parentElement, 'p-focus');
  }

  onDragEnter(event) {
    if (!this.props.disabled) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  onDragOver(event) {
    if (!this.props.disabled) {
      _DomHandler.default.addClass(this.content, 'p-fileupload-highlight');

      event.stopPropagation();
      event.preventDefault();
    }
  }

  onDragLeave(event) {
    if (!this.props.disabled) {
      _DomHandler.default.removeClass(this.content, 'p-fileupload-highlight');
    }
  }

  onDrop(event) {
    if (!this.props.disabled) {
      _DomHandler.default.removeClass(this.content, 'p-fileupload-highlight');

      event.stopPropagation();
      event.preventDefault();
      let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
      let allowDrop = this.props.multiple || files && files.length === 1;

      if (allowDrop) {
        this.onFileSelect(event);
      }
    }
  }

  onSimpleUploaderClick() {
    if (this.hasFiles()) {
      this.upload();
    }
  }

  renderChooseButton() {
    let className = (0, _classnames.default)('p-button p-fileupload-choose p-component p-button-text-icon-left');
    return _react.default.createElement("span", {
      icon: "pi pi-plus",
      className: className
    }, _react.default.createElement("input", {
      ref: el => this.fileInput = el,
      type: "file",
      onChange: this.onFileSelect,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      multiple: this.props.multiple,
      accept: this.props.accept,
      disabled: this.props.disabled
    }), _react.default.createElement("span", {
      className: "p-button-icon p-button-icon-left p-clickable pi pi-fw pi-plus"
    }), _react.default.createElement("span", {
      className: "p-button-text p-clickable"
    }, this.props.chooseLabel));
  }

  renderFiles() {
    return _react.default.createElement("div", {
      className: "p-fileupload-files"
    }, this.state.files.map((file, index) => {
      let preview = this.isImage(file) ? _react.default.createElement("div", null, _react.default.createElement("img", {
        alt: file.name,
        role: "presentation",
        src: file.objectURL,
        width: this.props.previewWidth
      })) : null;

      let fileName = _react.default.createElement("div", null, file.name);

      let size = _react.default.createElement("div", null, this.formatSize(file.size));

      let removeButton = _react.default.createElement("div", null, _react.default.createElement(_Button.Button, {
        type: "button",
        icon: "pi pi-times",
        onClick: () => this.remove(index)
      }));

      return _react.default.createElement("div", {
        className: "p-fileupload-row",
        key: file.name + file.type + file.size
      }, preview, fileName, size, removeButton);
    }));
  }

  renderAdvanced() {
    let className = (0, _classnames.default)('p-fileupload p-component', this.props.className);
    let uploadButton, cancelButton, filesList, progressBar;
    let chooseButton = this.renderChooseButton();

    if (!this.props.auto) {
      uploadButton = _react.default.createElement(_Button.Button, {
        label: this.props.uploadLabel,
        icon: "pi pi-upload",
        onClick: this.upload,
        disabled: this.props.disabled || !this.hasFiles()
      });
      cancelButton = _react.default.createElement(_Button.Button, {
        label: this.props.cancelLabel,
        icon: "pi pi-times",
        onClick: this.clear,
        disabled: this.props.disabled || !this.hasFiles()
      });
    }

    if (this.hasFiles()) {
      filesList = this.renderFiles();
      progressBar = _react.default.createElement(_ProgressBar.ProgressBar, {
        value: this.state.progress,
        showValue: false
      });
    }

    return _react.default.createElement("div", {
      id: this.props.id,
      className: className,
      style: this.props.style
    }, _react.default.createElement("div", {
      className: "p-fileupload-buttonbar"
    }, chooseButton, uploadButton, cancelButton), _react.default.createElement("div", {
      ref: el => {
        this.content = el;
      },
      className: "p-fileupload-content",
      onDragEnter: this.onDragEnter,
      onDragOver: this.onDragOver,
      onDragLeave: this.onDragLeave,
      onDrop: this.onDrop
    }, progressBar, _react.default.createElement(_Messages.Messages, {
      ref: el => this.messagesUI = el
    }), filesList));
  }

  renderBasic() {
    let buttonClassName = (0, _classnames.default)('p-button p-fileupload-choose p-component p-button-text-icon-left', {
      'p-fileupload-choose-selected': this.hasFiles()
    });
    let iconClassName = (0, _classnames.default)('p-button-icon-left pi', {
      'pi-plus': !this.hasFiles() || this.props.auto,
      'pi-upload': this.hasFiles() && !this.props.auto
    });
    return _react.default.createElement("span", {
      className: buttonClassName,
      onMouseUp: this.onSimpleUploaderClick
    }, _react.default.createElement("span", {
      className: iconClassName
    }), _react.default.createElement("span", {
      className: "p-button-text p-clickable"
    }, this.hasFiles() ? this.state.files[0].name : this.props.chooseLabel), _react.default.createElement("input", {
      ref: el => this.fileInput = el,
      type: "file",
      multiple: this.props.multiple,
      accept: this.props.accept,
      disabled: this.props.disabled,
      onChange: this.onFileSelect,
      onFocus: this.onFocus,
      onBlur: this.onBlur
    }));
  }

  render() {
    if (this.props.mode === 'advanced') return this.renderAdvanced();else if (this.props.mode === 'basic') return this.renderBasic();
  }

}

exports.FileUpload = FileUpload;

_defineProperty(FileUpload, "defaultProps", {
  id: null,
  name: null,
  url: null,
  mode: 'advanced',
  multiple: false,
  accept: null,
  disabled: false,
  auto: false,
  maxFileSize: null,
  invalidFileSizeMessageSummary: '{0}: Invalid file size, ',
  invalidFileSizeMessageDetail: 'maximum upload size is {0}.',
  style: null,
  className: null,
  widthCredentials: false,
  previewWidth: 50,
  chooseLabel: 'Choose',
  uploadLabel: 'Upload',
  cancelLabel: 'Cancel',
  customUpload: false,
  onBeforeUpload: null,
  onBeforeSend: null,
  onUpload: null,
  onError: null,
  onClear: null,
  onSelect: null,
  onProgress: null,
  onValidationFail: null,
  uploadHandler: null
});

_defineProperty(FileUpload, "propTypes", {
  id: _propTypes.default.string,
  name: _propTypes.default.string,
  url: _propTypes.default.string,
  mode: _propTypes.default.string,
  multiple: _propTypes.default.bool,
  accept: _propTypes.default.string,
  disabled: _propTypes.default.bool,
  auto: _propTypes.default.bool,
  maxFileSize: _propTypes.default.number,
  invalidFileSizeMessageSummary: _propTypes.default.string,
  invalidFileSizeMessageDetail: _propTypes.default.string,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  widthCredentials: _propTypes.default.bool,
  previewWidth: _propTypes.default.number,
  chooseLabel: _propTypes.default.string,
  uploadLabel: _propTypes.default.string,
  cancelLabel: _propTypes.default.string,
  customUpload: _propTypes.default.bool,
  onBeforeUpload: _propTypes.default.func,
  onBeforeSend: _propTypes.default.func,
  onUpload: _propTypes.default.func,
  onError: _propTypes.default.func,
  onClear: _propTypes.default.func,
  onSelect: _propTypes.default.func,
  onProgress: _propTypes.default.func,
  onValidationFail: _propTypes.default.func,
  uploadHandler: _propTypes.default.func
});