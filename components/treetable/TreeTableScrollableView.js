"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TreeTableScrollableView = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TreeTableScrollableView extends _react.Component {
  constructor(props) {
    super(props);
    this.onHeaderScroll = this.onHeaderScroll.bind(this);
    this.onBodyScroll = this.onBodyScroll.bind(this);
  }

  componentDidMount() {
    this.setScrollHeight();

    if (!this.props.frozen) {
      this.alignScrollBar();
    } else {
      this.scrollBody.style.paddingBottom = _DomHandler.default.calculateScrollbarWidth() + 'px';
    }
  }

  componentDidUpdate() {
    if (!this.props.frozen) {
      this.alignScrollBar();
    }
  }

  setScrollHeight() {
    if (this.props.scrollHeight) {
      if (this.props.scrollHeight.indexOf('%') !== -1) {
        let datatableContainer = this.findDataTableContainer(this.container);
        this.scrollBody.style.visibility = 'hidden';
        this.scrollBody.style.height = '100px'; //temporary height to calculate static height

        let containerHeight = _DomHandler.default.getOuterHeight(datatableContainer);

        let relativeHeight = _DomHandler.default.getOuterHeight(datatableContainer.parentElement) * parseInt(this.props.scrollHeight, 10) / 100;
        let staticHeight = containerHeight - 100; //total height of headers, footers, paginators

        let scrollBodyHeight = relativeHeight - staticHeight;
        this.scrollBody.style.height = 'auto';
        this.scrollBody.style.maxHeight = scrollBodyHeight + 'px';
        this.scrollBody.style.visibility = 'visible';
      } else {
        this.scrollBody.style.maxHeight = this.props.scrollHeight;
      }
    }
  }

  findDataTableContainer(element) {
    if (element) {
      let el = element;

      while (el && !_DomHandler.default.hasClass(el, 'p-treetable')) {
        el = el.parentElement;
      }

      return el;
    } else {
      return null;
    }
  }

  onHeaderScroll() {
    this.scrollHeader.scrollLeft = 0;
  }

  onBodyScroll() {
    let frozenView = this.container.previousElementSibling;
    let frozenScrollBody;

    if (frozenView) {
      frozenScrollBody = _DomHandler.default.findSingle(frozenView, '.p-treetable-scrollable-body');
    }

    this.scrollHeaderBox.style.marginLeft = -1 * this.scrollBody.scrollLeft + 'px';

    if (this.scrollFooterBox) {
      this.scrollFooterBox.style.marginLeft = -1 * this.scrollBody.scrollLeft + 'px';
    }

    if (frozenScrollBody) {
      frozenScrollBody.scrollTop = this.scrollBody.scrollTop;
    }
  }

  hasVerticalOverflow() {
    return _DomHandler.default.getOuterHeight(this.scrollTable) > _DomHandler.default.getOuterHeight(this.scrollBody);
  }

  alignScrollBar() {
    let scrollBarWidth = this.hasVerticalOverflow() ? _DomHandler.default.calculateScrollbarWidth() : 0;
    this.scrollHeaderBox.style.marginRight = scrollBarWidth + 'px';

    if (this.scrollFooterBox) {
      this.scrollFooterBox.style.marginRight = scrollBarWidth + 'px';
    }
  }

  calculateRowHeight() {
    let row = _DomHandler.default.findSingle(this.scrollTable, 'tr:not(.p-treetable-emptymessage-row)');

    if (row) {
      this.rowHeight = _DomHandler.default.getOuterHeight(row);
    }
  }

  renderColGroup() {
    if (this.props.columns && this.props.columns.length) {
      return _react.default.createElement("colgroup", {
        className: "p-treetable-scrollable-colgroup"
      }, this.props.columns.map((col, i) => _react.default.createElement("col", {
        key: col.field + '_' + i
      })));
    } else {
      return null;
    }
  }

  render() {
    let className = (0, _classnames.default)('p-treetable-scrollable-view', {
      'p-treetable-frozen-view': this.props.frozen,
      'p-treetable-unfrozen-view': !this.props.frozen && this.props.frozenWidth
    });
    let width = this.props.frozen ? this.props.frozenWidth : 'calc(100% - ' + this.props.frozenWidth + ')';
    let left = this.props.frozen ? null : this.props.frozenWidth;
    let colGroup = this.renderColGroup();
    return _react.default.createElement("div", {
      className: className,
      style: {
        width: width,
        left: left
      },
      ref: el => {
        this.container = el;
      }
    }, _react.default.createElement("div", {
      className: "p-treetable-scrollable-header",
      ref: el => {
        this.scrollHeader = el;
      },
      onScroll: this.onHeaderScroll
    }, _react.default.createElement("div", {
      className: "p-treetable-scrollable-header-box",
      ref: el => {
        this.scrollHeaderBox = el;
      }
    }, _react.default.createElement("table", {
      className: "p-treetable-scrollable-header-table"
    }, colGroup, this.props.header))), _react.default.createElement("div", {
      className: "p-treetable-scrollable-body",
      ref: el => {
        this.scrollBody = el;
      },
      onScroll: this.onBodyScroll
    }, _react.default.createElement("table", {
      ref: el => {
        this.scrollTable = el;
      },
      style: {
        top: '0'
      },
      className: "p-treetable-scrollable-body-table"
    }, colGroup, this.props.body)), _react.default.createElement("div", {
      className: "p-treetable-scrollable-footer",
      ref: el => {
        this.scrollFooter = el;
      }
    }, _react.default.createElement("div", {
      className: "p-treetable-scrollable-footer-box",
      ref: el => {
        this.scrollFooterBox = el;
      }
    }, _react.default.createElement("table", {
      className: "p-treetable-scrollable-footer-table"
    }, colGroup, this.props.footer))));
  }

}

exports.TreeTableScrollableView = TreeTableScrollableView;

_defineProperty(TreeTableScrollableView, "defaultProps", {
  header: null,
  body: null,
  footer: null,
  columns: null,
  frozen: null,
  frozenWidth: null,
  frozenBody: null
});

_defineProperty(TreeTableScrollableView, "propTypes", {
  header: _propTypes.default.any,
  body: _propTypes.default.any,
  footer: _propTypes.default.any,
  columns: _propTypes.default.array,
  frozen: _propTypes.default.bool,
  frozenWidth: _propTypes.default.string,
  frozenBody: _propTypes.default.any
});