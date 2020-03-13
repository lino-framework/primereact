"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataView = exports.DataViewLayoutOptions = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Paginator = require("../paginator/Paginator");

var _classnames = _interopRequireDefault(require("classnames"));

var _ObjectUtils = _interopRequireDefault(require("../utils/ObjectUtils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class DataViewLayoutOptions extends _react.Component {
  constructor(props) {
    super(props);
    this.changeLayout = this.changeLayout.bind(this);
  }

  changeLayout(event, layoutMode) {
    this.props.onChange({
      originalEvent: event,
      value: layoutMode
    });
    event.preventDefault();
  }

  render() {
    const className = (0, _classnames.default)('p-dataview-layout-options p-selectbutton p-buttonset', this.props.className);
    const buttonListClass = (0, _classnames.default)("p-button p-button-icon-only", {
      'p-highlight': this.props.layout === 'list'
    });
    const buttonGridClass = (0, _classnames.default)("p-button p-button-icon-only", {
      'p-highlight': this.props.layout === 'grid'
    });
    return _react.default.createElement("div", {
      id: this.props.id,
      style: this.props.style,
      className: className
    }, _react.default.createElement("button", {
      className: buttonListClass,
      onClick: event => this.changeLayout(event, 'list')
    }, _react.default.createElement("i", {
      className: "pi pi-bars p-button-icon-left"
    }), _react.default.createElement("span", {
      className: "p-button-text p-clickable"
    }, "p-btn")), _react.default.createElement("button", {
      className: buttonGridClass,
      onClick: event => this.changeLayout(event, 'grid')
    }, _react.default.createElement("i", {
      className: "pi pi-th-large p-button-icon-left"
    }), _react.default.createElement("span", {
      className: "p-button-text p-clickable"
    }, "p-btn")));
  }

}

exports.DataViewLayoutOptions = DataViewLayoutOptions;

_defineProperty(DataViewLayoutOptions, "defaultProps", {
  id: null,
  style: null,
  className: null,
  layout: null,
  onChange: null
});

_defineProperty(DataViewLayoutOptions, "propTypes", {
  id: _propTypes.default.string,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  layout: _propTypes.default.string,
  onChange: _propTypes.default.func.isRequired
});

class DataViewItem extends _react.Component {
  render() {
    return this.props.template(this.props.item, this.props.layout);
  }

}

_defineProperty(DataViewItem, "defaultProps", {
  template: null,
  item: null,
  layout: null
});

_defineProperty(DataViewItem, "propTypes", {
  template: _propTypes.default.func,
  item: _propTypes.default.any,
  layout: _propTypes.default.string
});

class DataView extends _react.Component {
  constructor(props) {
    super(props);

    if (!this.props.onPage) {
      this.state = {
        first: this.props.first,
        rows: this.props.rows
      };
    }

    this.sortChange = false;
    this.onPageChange = this.onPageChange.bind(this);
  }

  getTotalRecords() {
    if (this.props.totalRecords) return this.props.totalRecords;else return this.props.value ? this.props.value.length : 0;
  }

  createPaginator(position) {
    const className = 'p-paginator-' + position;
    const first = this.props.onPage ? this.props.first : this.state.first;
    const rows = this.props.onPage ? this.props.rows : this.state.rows;
    const totalRecords = this.getTotalRecords();
    return _react.default.createElement(_Paginator.Paginator, {
      first: first,
      rows: rows,
      pageLinkSize: this.props.pageLinkSize,
      className: className,
      onPageChange: this.onPageChange,
      template: this.props.paginatorTemplate,
      totalRecords: totalRecords,
      rowsPerPageOptions: this.props.rowsPerPageOptions,
      currentPageReportTemplate: this.props.currentPageReportTemplate,
      leftContent: this.props.paginatorLeft,
      rightContent: this.props.paginatorRight,
      alwaysShow: this.props.alwaysShowPaginator
    });
  }

  onPageChange(event) {
    if (this.props.onPage) {
      this.props.onPage({
        originalEvent: event,
        first: event.first,
        rows: event.rows
      });
    } else {
      this.setState({
        first: event.first,
        rows: event.rows
      });
    }
  }

  isEmpty() {
    return !this.props.value || this.props.value.length === 0;
  }

  sort() {
    if (this.props.value) {
      const value = [...this.props.value];
      value.sort((data1, data2) => {
        let value1 = _ObjectUtils.default.resolveFieldData(data1, this.props.sortField);

        let value2 = _ObjectUtils.default.resolveFieldData(data2, this.props.sortField);

        let result = null;
        if (value1 == null && value2 != null) result = -1;else if (value1 != null && value2 == null) result = 1;else if (value1 == null && value2 == null) result = 0;else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2, undefined, {
          numeric: true
        });else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
        return this.props.sortOrder * result;
      });
      return value;
    } else {
      return null;
    }
  }

  renderTopPaginator() {
    if (this.props.paginator && (this.props.paginatorPosition !== 'bottom' || this.props.paginatorPosition === 'both')) {
      return this.createPaginator('top');
    } else {
      return null;
    }
  }

  renderBottomPaginator() {
    if (this.props.paginator && (this.props.paginatorPosition !== 'top' || this.props.paginatorPosition === 'both')) {
      return this.createPaginator('bottom');
    } else {
      return null;
    }
  }

  renderEmptyMessage() {
    return _react.default.createElement("div", {
      className: "p-col-12"
    }, this.props.emptyMessage);
  }

  renderHeader() {
    if (this.props.header) {
      return _react.default.createElement("div", {
        className: "p-dataview-header"
      }, this.props.header);
    } else {
      return null;
    }
  }

  renderFooter() {
    if (this.props.footer) return _react.default.createElement("div", {
      className: "p-dataview-footer"
    }, " ", this.props.footer);else return null;
  }

  renderItems(value) {
    if (value && value.length) {
      if (this.props.paginator) {
        const rows = this.props.onPage ? this.props.rows : this.state.rows;
        const first = this.props.lazy ? 0 : this.props.onPage ? this.props.first : this.state.first;
        const last = rows + first;
        let items = [];

        for (let i = first; i < last; i++) {
          items.push(_react.default.createElement(DataViewItem, {
            key: i,
            template: this.props.itemTemplate,
            layout: this.props.layout,
            item: value[i]
          }));
        }

        return items;
      } else {
        return value.map((item, index) => {
          return _react.default.createElement(DataViewItem, {
            key: index,
            template: this.props.itemTemplate,
            layout: this.props.layout,
            item: item
          });
        });
      }
    } else {
      return this.renderEmptyMessage();
    }
  }

  renderContent(value) {
    const items = this.renderItems(value);
    return _react.default.createElement("div", {
      className: "p-dataview-content"
    }, _react.default.createElement("div", {
      className: "p-grid"
    }, items));
  }

  processData() {
    let data = this.props.value;

    if (data && data.length) {
      if (this.props.sortField) {
        data = this.sort();
      }
    }

    return data;
  }

  render() {
    const value = this.processData();
    const className = (0, _classnames.default)('p-dataview p-component', {
      'p-dataview-list': this.props.layout === 'list',
      'p-dataview-grid': this.props.layout === 'grid'
    }, this.props.className);
    const topPaginator = this.renderTopPaginator();
    const bottomPaginator = this.renderBottomPaginator();
    const header = this.renderHeader();
    const footer = this.renderFooter();
    const content = this.renderContent(value);
    return _react.default.createElement("div", {
      id: this.props.id,
      style: this.props.style,
      className: className
    }, header, topPaginator, content, bottomPaginator, footer);
  }

}

exports.DataView = DataView;

_defineProperty(DataView, "defaultProps", {
  id: null,
  header: null,
  footer: null,
  value: null,
  layout: 'list',
  rows: null,
  first: 0,
  totalRecords: null,
  paginator: false,
  paginatorPosition: 'bottom',
  alwaysShowPaginator: true,
  paginatorTemplate: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
  paginatorLeft: null,
  paginatorRight: null,
  pageLinkSize: 5,
  rowsPerPageOptions: null,
  currentPageReportTemplate: '({currentPage} of {totalPages})',
  emptyMessage: 'No records found',
  sortField: null,
  sortOrder: null,
  style: null,
  className: null,
  lazy: false,
  itemTemplate: null,
  onPage: null
});

_defineProperty(DataView, "propTypes", {
  id: _propTypes.default.string,
  header: _propTypes.default.any,
  footer: _propTypes.default.any,
  value: _propTypes.default.array,
  layout: _propTypes.default.string,
  rows: _propTypes.default.number,
  first: _propTypes.default.number,
  totalRecords: _propTypes.default.number,
  paginator: _propTypes.default.bool,
  paginatorPosition: _propTypes.default.string,
  alwaysShowPaginator: _propTypes.default.bool,
  paginatorTemplate: _propTypes.default.string,
  paginatorLeft: _propTypes.default.any,
  paginatorRight: _propTypes.default.any,
  pageLinkSize: _propTypes.default.number,
  rowsPerPageOptions: _propTypes.default.array,
  currentPageReportTemplate: _propTypes.default.string,
  emptyMessage: _propTypes.default.string,
  sortField: _propTypes.default.string,
  sortOrder: _propTypes.default.number,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  lazy: _propTypes.default.bool,
  itemTemplate: _propTypes.default.func.isRequired,
  onPage: _propTypes.default.func
});