"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollableView = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ScrollableView extends _react.Component {
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.scrollHeight !== prevProps.scrollHeight) {
      this.setScrollHeight();
    }

    if (!this.props.frozen) {
      this.alignScrollBar();

      if (this.props.virtualScroll) {
        this.virtualScroller.style.height = this.props.totalRecords * this.props.virtualRowHeight + 'px';
      }
    }

    if (this.virtualScrollCallback && !this.props.loading) {
      this.virtualScrollCallback();
      this.virtualScrollCallback = null;
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

      while (el && !_DomHandler.default.hasClass(el, 'p-datatable')) {
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
      frozenScrollBody = _DomHandler.default.findSingle(frozenView, '.p-datatable-scrollable-body');
    }

    this.scrollHeaderBox.style.marginLeft = -1 * this.scrollBody.scrollLeft + 'px';

    if (this.scrollFooterBox) {
      this.scrollFooterBox.style.marginLeft = -1 * this.scrollBody.scrollLeft + 'px';
    }

    if (frozenScrollBody) {
      frozenScrollBody.scrollTop = this.scrollBody.scrollTop;
    }

    if (this.props.virtualScroll) {
      let viewport = _DomHandler.default.getClientHeight(this.scrollBody);

      let tableHeight = _DomHandler.default.getOuterHeight(this.scrollTable);

      let pageHeight = this.props.virtualRowHeight * this.props.rows;

      let virtualTableHeight = _DomHandler.default.getOuterHeight(this.virtualScroller);

      let pageCount = virtualTableHeight / pageHeight || 1;
      let scrollBodyTop = this.scrollTable.style.top || '0';

      if (this.scrollBody.scrollTop + viewport > parseFloat(scrollBodyTop) + tableHeight || this.scrollBody.scrollTop < parseFloat(scrollBodyTop)) {
        if (this.loadingTable) {
          this.loadingTable.style.display = 'table';
          this.loadingTable.style.top = this.scrollBody.scrollTop + 'px';
        }

        let page = Math.floor(this.scrollBody.scrollTop * pageCount / this.scrollBody.scrollHeight) + 1;

        if (this.props.onVirtualScroll) {
          this.props.onVirtualScroll({
            page: page
          });

          this.virtualScrollCallback = () => {
            if (this.loadingTable) {
              this.loadingTable.style.display = 'none';
            }

            this.scrollTable.style.top = (page - 1) * pageHeight + 'px';
          };
        }
      }
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

  renderColGroup() {
    if (this.props.columns && this.props.columns.length) {
      return _react.default.createElement("colgroup", {
        className: "p-datatable-scrollable-colgroup"
      }, this.props.columns.map((col, i) => _react.default.createElement("col", {
        key: col.props.field + '_' + i,
        style: col.props.headerStyle || col.props.style
      })));
    } else {
      return null;
    }
  }

  renderLoadingTable(colGroup) {
    if (this.props.virtualScroll) {
      return _react.default.createElement("table", {
        ref: el => this.loadingTable = el,
        style: {
          top: '0',
          display: 'none'
        },
        className: "p-datatable-scrollable-body-table p-datatable-loading-virtual-table p-datatable-virtual-table"
      }, colGroup, this.props.loadingBody);
    } else {
      return null;
    }
  }

  render() {
    let className = (0, _classnames.default)('p-datatable-scrollable-view', {
      'p-datatable-frozen-view': this.props.frozen,
      'p-datatable-unfrozen-view': !this.props.frozen && this.props.frozenWidth
    });
    let tableBodyClassName = (0, _classnames.default)('p-datatable-scrollable-body-table', this.props.tableClassName, {
      'p-datatable-virtual-table': this.props.virtualScroll
    });
    let tableHeaderClassName = (0, _classnames.default)('p-datatable-scrollable-header-table', this.props.tableClassName);
    let tableFooterClassName = (0, _classnames.default)('p-datatable-scrollable-footer-table', this.props.tableClassName);
    let tableBodyStyle = Object.assign({
      top: '0'
    }, this.props.tableStyle);
    let width = this.props.frozen ? this.props.frozenWidth : 'calc(100% - ' + this.props.frozenWidth + ')';
    let left = this.props.frozen ? null : this.props.frozenWidth;
    let colGroup = this.renderColGroup();
    let loadingTable = this.renderLoadingTable(colGroup);
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
      className: "p-datatable-scrollable-header",
      ref: el => {
        this.scrollHeader = el;
      },
      onScroll: this.onHeaderScroll
    }, _react.default.createElement("div", {
      className: "p-datatable-scrollable-header-box",
      ref: el => {
        this.scrollHeaderBox = el;
      }
    }, _react.default.createElement("table", {
      className: tableHeaderClassName,
      style: this.props.tableStyle
    }, colGroup, this.props.header, this.props.frozenBody))), _react.default.createElement("div", {
      className: "p-datatable-scrollable-body",
      ref: el => {
        this.scrollBody = el;
      },
      onScroll: this.onBodyScroll
    }, _react.default.createElement("table", {
      ref: el => this.scrollTable = el,
      style: tableBodyStyle,
      className: tableBodyClassName
    }, colGroup, this.props.body), loadingTable, _react.default.createElement("div", {
      className: "p-datatable-virtual-scroller",
      ref: el => {
        this.virtualScroller = el;
      }
    })), _react.default.createElement("div", {
      className: "p-datatable-scrollable-footer",
      ref: el => {
        this.scrollFooter = el;
      }
    }, _react.default.createElement("div", {
      className: "p-datatable-scrollable-footer-box",
      ref: el => {
        this.scrollFooterBox = el;
      }
    }, _react.default.createElement("table", {
      className: tableFooterClassName,
      style: this.props.tableStyle
    }, colGroup, this.props.footer))));
  }

}

exports.ScrollableView = ScrollableView;

_defineProperty(ScrollableView, "defaultProps", {
  header: null,
  body: null,
  footer: null,
  columns: null,
  frozen: null,
  frozenWidth: null,
  frozenBody: null,
  virtualScroll: false,
  virtualRowHeight: null,
  rows: null,
  totalRecords: null,
  loading: false,
  tableStyle: null,
  tableClassName: null,
  onVirtualScroll: null
});

_defineProperty(ScrollableView, "propTypes", {
  header: _propTypes.default.any,
  body: _propTypes.default.any,
  footer: _propTypes.default.any,
  columns: _propTypes.default.array,
  frozen: _propTypes.default.bool,
  frozenWidth: _propTypes.default.string,
  frozenBody: _propTypes.default.any,
  virtualScroll: _propTypes.default.bool,
  virtualRowHeight: _propTypes.default.number,
  rows: _propTypes.default.number,
  totalRcords: _propTypes.default.number,
  loading: _propTypes.default.bool,
  tableStyle: _propTypes.default.any,
  tableClassName: _propTypes.default.string,
  onVirtualScroll: _propTypes.default.func
});