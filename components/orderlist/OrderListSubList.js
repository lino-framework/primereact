"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OrderListSubList = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _ObjectUtils = _interopRequireDefault(require("../utils/ObjectUtils"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class OrderListSubList extends _react.Component {
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onListMouseMove = this.onListMouseMove.bind(this);
  }

  isSelected(item) {
    return _ObjectUtils.default.findIndexInList(item, this.props.selection) !== -1;
  }

  onDragStart(event, index) {
    this.dragging = true;
    this.draggedItemIndex = index;

    if (this.props.dragdropScope) {
      event.dataTransfer.setData('text', 'orderlist');
    }
  }

  onDragOver(event, index) {
    if (this.draggedItemIndex !== index && this.draggedItemIndex + 1 !== index) {
      this.dragOverItemIndex = index;

      _DomHandler.default.addClass(event.target, 'p-orderlist-droppoint-highlight');

      event.preventDefault();
    }
  }

  onDragLeave(event) {
    this.dragOverItemIndex = null;

    _DomHandler.default.removeClass(event.target, 'p-orderlist-droppoint-highlight');
  }

  onDrop(event) {
    let dropIndex = this.draggedItemIndex > this.dragOverItemIndex ? this.dragOverItemIndex : this.dragOverItemIndex === 0 ? 0 : this.dragOverItemIndex - 1;
    let value = [...this.props.value];

    _ObjectUtils.default.reorderArray(value, this.draggedItemIndex, dropIndex);

    this.dragOverItemIndex = null;

    _DomHandler.default.removeClass(event.target, 'p-orderlist-droppoint-highlight');

    if (this.props.onChange) {
      this.props.onChange({
        originalEvent: event,
        value: value
      });
    }
  }

  onDragEnd(event) {
    this.dragging = false;
  }

  onListMouseMove(event) {
    if (this.dragging) {
      let offsetY = this.listElement.getBoundingClientRect().top + _DomHandler.default.getWindowScrollTop();

      let bottomDiff = offsetY + this.listElement.clientHeight - event.pageY;
      let topDiff = event.pageY - offsetY;
      if (bottomDiff < 25 && bottomDiff > 0) this.listElement.scrollTop += 15;else if (topDiff < 25 && topDiff > 0) this.listElement.scrollTop -= 15;
    }
  }

  renderDropPoint(index, key) {
    return _react.default.createElement("li", {
      key: key,
      className: "p-orderlist-droppoint",
      onDragOver: e => this.onDragOver(e, index + 1),
      onDragLeave: this.onDragLeave,
      onDrop: this.onDrop
    });
  }

  render() {
    let header = null;
    let items = null;

    if (this.props.header) {
      header = _react.default.createElement("div", {
        className: "p-orderlist-caption"
      }, this.props.header);
    }

    if (this.props.value) {
      items = this.props.value.map((item, i) => {
        let content = this.props.itemTemplate ? this.props.itemTemplate(item) : item;
        let itemClassName = (0, _classnames.default)('p-orderlist-item', this.props.className, {
          'p-highlight': this.isSelected(item)
        });
        let key = JSON.stringify(item);

        if (this.props.dragdrop) {
          let items = [this.renderDropPoint(i, key + '_droppoint'), _react.default.createElement("li", {
            key: key,
            className: itemClassName,
            onClick: e => this.props.onItemClick({
              originalEvent: e,
              value: item,
              index: i
            }),
            onKeyDown: e => this.props.onItemKeyDown({
              originalEvent: e,
              value: item,
              index: i
            }),
            draggable: "true",
            onDragStart: e => this.onDragStart(e, i),
            onDragEnd: this.onDragEnd,
            tabIndex: this.props.tabIndex
          }, content)];

          if (i === this.props.value.length - 1) {
            items.push(this.renderDropPoint(item, i, key + '_droppoint_end'));
          }

          return items;
        } else {
          return _react.default.createElement("li", {
            key: JSON.stringify(item),
            className: itemClassName,
            onClick: e => this.props.onItemClick({
              originalEvent: e,
              value: item,
              index: i
            }),
            onKeyDown: e => this.props.onItemKeyDown({
              originalEvent: e,
              value: item,
              index: i
            }),
            tabIndex: this.props.tabIndex
          }, content);
        }
      });
    }

    return _react.default.createElement("div", {
      className: "p-orderlist-list-container"
    }, header, _react.default.createElement("ul", {
      ref: el => this.listElement = el,
      className: "p-orderlist-list",
      style: this.props.listStyle,
      onDragOver: this.onListMouseMove
    }, items));
  }

}

exports.OrderListSubList = OrderListSubList;

_defineProperty(OrderListSubList, "defaultProps", {
  value: null,
  selection: null,
  header: null,
  listStyle: null,
  itemTemplate: null,
  dragdrop: false,
  tabIndex: null,
  onItemClick: null,
  onItemKeyDown: null,
  onChange: null
});

_defineProperty(OrderListSubList, "propTypes", {
  value: _propTypes.default.array,
  selection: _propTypes.default.array,
  header: _propTypes.default.string,
  listStyle: _propTypes.default.object,
  itemTemplate: _propTypes.default.func,
  dragdrop: _propTypes.default.bool,
  tabIndex: _propTypes.default.string,
  onItemClick: _propTypes.default.func,
  onItemKeyDown: _propTypes.default.func,
  onChange: _propTypes.default.func
});