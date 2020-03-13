"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataScroller = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class DataScroller extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.dataToRender = [];
    this.value = this.props.value;
    this.first = 0;
  }

  handleDataChange() {
    if (this.props.lazy) {
      this.dataToRender = this.value;
      this.setState({
        dataToRender: this.dataToRender
      });
    } else {
      this.load();
    }
  }

  load() {
    if (this.props.lazy) {
      if (this.props.onLazyLoad) {
        this.props.onLazyLoad(this.createLazyLoadMetadata());
      }

      this.first = this.first + this.props.rows;
    } else {
      if (this.value) {
        for (var i = this.first; i < this.first + this.props.rows; i++) {
          if (i >= this.value.length) {
            break;
          }

          this.dataToRender.push(this.value[i]);
        }

        this.first = this.first + this.props.rows;
        this.setState({
          dataToRender: this.dataToRender
        });
      }
    }
  }

  reset() {
    this.first = 0;
    this.dataToRender = [];
    this.setState({
      dataToRender: this.dataToRender
    });
    this.load();
  }

  isEmpty() {
    return !this.dataToRender || this.dataToRender.length === 0;
  }

  createLazyLoadMetadata() {
    return {
      first: this.first,
      rows: this.props.rows
    };
  }

  bindScrollListener() {
    if (this.props.inline) {
      this.scrollFunction = () => {
        var scrollTop = this.contentElement.scrollTop,
            scrollHeight = this.contentElement.scrollHeight,
            viewportHeight = this.contentElement.clientHeight;

        if (scrollTop >= scrollHeight * this.props.buffer - viewportHeight) {
          this.load();
        }
      };

      this.contentElement.addEventListener('scroll', this.scrollFunction);
    } else {
      this.scrollFunction = () => {
        var docBody = document.body,
            docElement = document.documentElement,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop,
            winHeight = docElement.clientHeight,
            docHeight = Math.max(docBody.scrollHeight, docBody.offsetHeight, winHeight, docElement.scrollHeight, docElement.offsetHeight);

        if (scrollTop >= docHeight * this.props.buffer - winHeight) {
          this.load();
        }
      };

      window.addEventListener('scroll', this.scrollFunction);
    }
  }

  unbindScrollListener() {
    if (this.scrollFunction) {
      if (this.props.inline) {
        this.contentElement.removeEventListener('scroll', this.scrollFunction);
        this.contentElement = null;
      } else if (this.loader && this.isLoaded) {
        this.loader.removeEventListener('click', this.scrollFunction);
      } else {
        window.removeEventListener('scroll', this.scrollFunction);
      }
    }
  }

  componentDidMount() {
    this.load();

    if (this.props.loader) {
      this.scrollFunction = () => {
        this.load();
      };

      this.loader = _reactDom.default.findDOMNode(this.props.loader);
      this.loader.addEventListener('click', this.scrollFunction);
      this.isLoaded = true;
    } else {
      this.bindScrollListener();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    var newValue = this.props.value;

    if (newValue && this.value !== newValue) {
      this.value = newValue;
      this.handleDataChange();
    }

    if (this.props.loader && !this.isLoaded) {
      this.unbindScrollListener();

      this.scrollFunction = () => {
        this.load();
      };

      this.loader = _reactDom.default.findDOMNode(this.props.loader);
      this.loader.addEventListener('click', this.scrollFunction);
      this.isLoaded = true;
    }
  }

  componentWillUnmount() {
    if (this.scrollFunction) {
      this.unbindScrollListener();
    }
  }

  render() {
    var className = (0, _classnames.default)('p-datascroller p-component', this.props.className, {
      'p-datascroller-inline': this.props.inline
    });

    var header = this.props.header && _react.default.createElement("div", {
      className: "p-datascroller-header"
    }, " ", this.props.header),
        footer = this.props.footer && _react.default.createElement("div", {
      className: "p-datascroller-footer"
    }, " ", this.props.footer, " "),
        content = _react.default.createElement("div", {
      ref: el => this.contentElement = _reactDom.default.findDOMNode(el),
      className: "p-datascroller-content",
      style: {
        'maxHeight': this.props.scrollHeight
      }
    }, _react.default.createElement("ul", {
      className: "p-datascroller-list"
    }, this.state.dataToRender && this.state.dataToRender.map((val, i) => {
      var listItemContent = this.props.itemTemplate ? this.props.itemTemplate(val) : val;
      return _react.default.createElement("li", {
        key: i + '_datascrollitem'
      }, listItemContent);
    })));

    return _react.default.createElement("div", {
      id: this.props.id,
      className: className
    }, header, content, footer);
  }

}

exports.DataScroller = DataScroller;

_defineProperty(DataScroller, "defaultProps", {
  id: null,
  value: null,
  rows: 0,
  inline: false,
  scrollHeight: null,
  loader: null,
  buffer: 0.9,
  style: null,
  className: null,
  onLazyLoad: null,
  itemTemplate: null,
  header: null,
  footer: null,
  lazy: false
});

_defineProperty(DataScroller, "propTypes", {
  id: _propTypes.default.string,
  value: _propTypes.default.array,
  rows: _propTypes.default.number,
  inline: _propTypes.default.bool,
  scrollHeight: _propTypes.default.any,
  loader: _propTypes.default.any,
  buffer: _propTypes.default.number,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  onLazyLoad: _propTypes.default.func,
  itemTemplate: _propTypes.default.func,
  header: _propTypes.default.any,
  footer: _propTypes.default.any,
  lazy: _propTypes.default.bool
});