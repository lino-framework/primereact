"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Paginator = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _FirstPageLink = require("./FirstPageLink");

var _NextPageLink = require("./NextPageLink");

var _PrevPageLink = require("./PrevPageLink");

var _LastPageLink = require("./LastPageLink");

var _PageLinks = require("./PageLinks");

var _RowsPerPageDropdown = require("./RowsPerPageDropdown");

var _CurrentPageReport = require("./CurrentPageReport");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Paginator extends _react.Component {
  constructor(props) {
    super(props);
    this.changePageToFirst = this.changePageToFirst.bind(this);
    this.changePageToPrev = this.changePageToPrev.bind(this);
    this.changePageToNext = this.changePageToNext.bind(this);
    this.changePageToLast = this.changePageToLast.bind(this);
    this.onRowsChange = this.onRowsChange.bind(this);
    this.onPageLinkClick = this.onPageLinkClick.bind(this);
  }

  isFirstPage() {
    return this.getPage() === 0;
  }

  isLastPage() {
    return this.getPage() === this.getPageCount() - 1;
  }

  getPageCount() {
    return Math.ceil(this.props.totalRecords / this.props.rows) || 1;
  }

  calculatePageLinkBoundaries() {
    var numberOfPages = this.getPageCount();
    var visiblePages = Math.min(this.props.pageLinkSize, numberOfPages); //calculate range, keep current in middle if necessary

    var start = Math.max(0, Math.ceil(this.getPage() - visiblePages / 2));
    var end = Math.min(numberOfPages - 1, start + visiblePages - 1); //check when approaching to last page

    var delta = this.props.pageLinkSize - (end - start + 1);
    start = Math.max(0, start - delta);
    return [start, end];
  }

  updatePageLinks() {
    var pageLinks = [];
    var boundaries = this.calculatePageLinkBoundaries();
    var start = boundaries[0];
    var end = boundaries[1];

    for (var i = start; i <= end; i++) {
      pageLinks.push(i + 1);
    }

    return pageLinks;
  }

  changePage(first, rows) {
    var pc = this.getPageCount();
    var p = Math.floor(first / rows);

    if (p >= 0 && p < pc) {
      var newPageState = {
        first: first,
        rows: rows,
        page: p,
        pageCount: pc
      };

      if (this.props.onPageChange) {
        this.props.onPageChange(newPageState);
      }
    }
  }

  getPage() {
    return Math.floor(this.props.first / this.props.rows);
  }

  changePageToFirst(event) {
    this.changePage(0, this.props.rows);
    event.preventDefault();
  }

  changePageToPrev(event) {
    this.changePage(this.props.first - this.props.rows, this.props.rows);
    event.preventDefault();
  }

  onPageLinkClick(event) {
    this.changePage((event.value - 1) * this.props.rows, this.props.rows);
  }

  changePageToNext(event) {
    this.changePage(this.props.first + this.props.rows, this.props.rows);
    event.preventDefault();
  }

  changePageToLast(event) {
    this.changePage((this.getPageCount() - 1) * this.props.rows, this.props.rows);
    event.preventDefault();
  }

  onRowsChange(event) {
    this.changePage(0, event.value);
  }

  render() {
    if (!this.props.alwaysShow && this.getPageCount() === 1) {
      return null;
    } else {
      let className = (0, _classnames.default)('p-paginator p-component p-unselectable-text', this.props.className);
      let paginatorElements = this.props.template.split(' ').map(value => {
        let key = value.trim();
        let element;

        switch (key) {
          case 'FirstPageLink':
            element = _react.default.createElement(_FirstPageLink.FirstPageLink, {
              key: key,
              onClick: this.changePageToFirst,
              disabled: this.isFirstPage()
            });
            break;

          case 'PrevPageLink':
            element = _react.default.createElement(_PrevPageLink.PrevPageLink, {
              key: key,
              onClick: this.changePageToPrev,
              disabled: this.isFirstPage()
            });
            break;

          case 'NextPageLink':
            element = _react.default.createElement(_NextPageLink.NextPageLink, {
              key: key,
              onClick: this.changePageToNext,
              disabled: this.isLastPage()
            });
            break;

          case 'LastPageLink':
            element = _react.default.createElement(_LastPageLink.LastPageLink, {
              key: key,
              onClick: this.changePageToLast,
              disabled: this.isLastPage()
            });
            break;

          case 'PageLinks':
            element = _react.default.createElement(_PageLinks.PageLinks, {
              key: key,
              value: this.updatePageLinks(),
              page: this.getPage(),
              onClick: this.onPageLinkClick
            });
            break;

          case 'RowsPerPageDropdown':
            element = _react.default.createElement(_RowsPerPageDropdown.RowsPerPageDropdown, {
              key: key,
              value: this.props.rows,
              options: this.props.rowsPerPageOptions,
              onChange: this.onRowsChange
            });
            break;

          case 'CurrentPageReport':
            element = _react.default.createElement(_CurrentPageReport.CurrentPageReport, {
              template: this.props.currentPageReportTemplate,
              key: key,
              page: this.getPage(),
              pageCount: this.getPageCount()
            });
            break;

          default:
            element = null;
            break;
        }

        return element;
      });

      let leftContent = this.props.leftContent && _react.default.createElement("div", {
        className: "p-paginator-left-content"
      }, this.props.leftContent);

      let rightContent = this.props.rightContent && _react.default.createElement("div", {
        className: "p-paginator-right-content"
      }, this.props.rightContent);

      return _react.default.createElement("div", {
        className: className,
        style: this.props.style
      }, leftContent, paginatorElements, rightContent);
    }
  }

}

exports.Paginator = Paginator;

_defineProperty(Paginator, "defaultProps", {
  totalRecords: 0,
  rows: 0,
  first: 0,
  pageLinkSize: 5,
  rowsPerPageOptions: null,
  style: null,
  className: null,
  template: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
  onPageChange: null,
  leftContent: null,
  rightContent: null,
  currentPageReportTemplate: '({currentPage} of {totalPages})',
  alwaysShow: true
});

_defineProperty(Paginator, "propTypes", {
  totalRecords: _propTypes.default.number,
  rows: _propTypes.default.number,
  first: _propTypes.default.number,
  pageLinkSize: _propTypes.default.number,
  rowsPerPageOptions: _propTypes.default.array,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  template: _propTypes.default.string,
  onPageChange: _propTypes.default.func,
  leftContent: _propTypes.default.any,
  rightContent: _propTypes.default.any,
  currentPageReportTemplate: _propTypes.default.any,
  alwaysShow: _propTypes.default.bool
});