"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OrderList = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _OrderListControls = require("./OrderListControls");

var _OrderListSubList = require("./OrderListSubList");

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

var _ObjectUtils = _interopRequireDefault(require("../utils/ObjectUtils"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class OrderList extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: []
    };
    this.onItemClick = this.onItemClick.bind(this);
    this.onItemKeyDown = this.onItemKeyDown.bind(this);
    this.onReorder = this.onReorder.bind(this);
  }

  onItemClick(event) {
    let metaKey = event.originalEvent.metaKey || event.originalEvent.ctrlKey;

    let index = _ObjectUtils.default.findIndexInList(event.value, this.state.selection);

    let selected = index !== -1;
    let selection;

    if (selected) {
      if (metaKey) selection = this.state.selection.filter((val, i) => i !== index);else selection = [event.value];
    } else {
      if (metaKey) selection = [...this.state.selection, event.value];else selection = [event.value];
    }

    this.setState({
      selection: selection
    });
  }

  onItemKeyDown(event) {
    let listItem = event.originalEvent.currentTarget;

    switch (event.originalEvent.which) {
      //down
      case 40:
        var nextItem = this.findNextItem(listItem);

        if (nextItem) {
          nextItem.focus();
        }

        event.originalEvent.preventDefault();
        break;
      //up

      case 38:
        var prevItem = this.findPrevItem(listItem);

        if (prevItem) {
          prevItem.focus();
        }

        event.originalEvent.preventDefault();
        break;
      //enter

      case 13:
        this.onItemClick(event);
        event.originalEvent.preventDefault();
        break;

      default:
        break;
    }
  }

  findNextItem(item) {
    let nextItem = item.nextElementSibling;
    if (nextItem) return !_DomHandler.default.hasClass(nextItem, 'p-orderlist-item') ? this.findNextItem(nextItem) : nextItem;else return null;
  }

  findPrevItem(item) {
    let prevItem = item.previousElementSibling;
    if (prevItem) return !_DomHandler.default.hasClass(prevItem, 'p-orderlist-item') ? this.findPrevItem(prevItem) : prevItem;else return null;
  }

  onReorder(event) {
    if (this.props.onChange) {
      this.props.onChange({
        event: event.originalEvent,
        value: event.value
      });
    }

    this.reorderDirection = event.direction;
  }

  componentDidUpdate() {
    if (this.reorderDirection) {
      this.updateListScroll();
      this.reorderDirection = null;
    }
  }

  updateListScroll() {
    let listItems = _DomHandler.default.find(this.subList.listElement, '.p-orderlist-item.p-highlight');

    if (listItems && listItems.length) {
      switch (this.reorderDirection) {
        case 'up':
          _DomHandler.default.scrollInView(this.subList.listElement, listItems[0]);

          break;

        case 'top':
          this.subList.listElement.scrollTop = 0;
          break;

        case 'down':
          _DomHandler.default.scrollInView(this.subList.listElement, listItems[listItems.length - 1]);

          break;

        case 'bottom':
          this.subList.listElement.scrollTop = this.subList.listElement.scrollHeight;
          break;

        default:
          break;
      }
    }
  }

  render() {
    let className = (0, _classnames.default)('p-orderlist p-component', this.props.className, {
      'p-orderlist-responsive': this.props.responsive
    });
    return _react.default.createElement("div", {
      ref: el => this.element = el,
      id: this.props.id,
      className: className,
      style: this.props.style
    }, _react.default.createElement(_OrderListControls.OrderListControls, {
      value: this.props.value,
      selection: this.state.selection,
      onReorder: this.onReorder
    }), _react.default.createElement(_OrderListSubList.OrderListSubList, {
      ref: el => this.subList = el,
      value: this.props.value,
      selection: this.state.selection,
      onItemClick: this.onItemClick,
      onItemKeyDown: this.onItemKeyDown,
      itemTemplate: this.props.itemTemplate,
      header: this.props.header,
      listStyle: this.props.listStyle,
      dragdrop: this.props.dragdrop,
      onDragStart: this.onDragStart,
      onDragEnter: this.onDragEnter,
      onDragEnd: this.onDragEnd,
      onDragLeave: this.onDragEnter,
      onDrop: this.onDrop,
      onChange: this.props.onChange,
      tabIndex: this.props.tabIndex
    }));
  }

}

exports.OrderList = OrderList;

_defineProperty(OrderList, "defaultProps", {
  id: null,
  value: null,
  header: null,
  style: null,
  className: null,
  listStyle: null,
  responsive: false,
  dragdrop: false,
  tabIndex: '0',
  onChange: null,
  itemTemplate: null
});

_defineProperty(OrderList, "propTypes", {
  id: _propTypes.default.string,
  value: _propTypes.default.array,
  header: _propTypes.default.string,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  listStyle: _propTypes.default.object,
  responsive: _propTypes.default.bool,
  dragdrop: _propTypes.default.bool,
  tabIndex: _propTypes.default.string,
  onChange: _propTypes.default.func,
  itemTemplate: _propTypes.default.func
});