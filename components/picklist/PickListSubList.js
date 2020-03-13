"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PickListSubList = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _ObjectUtils = _interopRequireDefault(require("../utils/ObjectUtils"));

var _PickListItem = require("./PickListItem");

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class PickListSubList extends _react.Component {
  constructor() {
    super();
    this.onItemClick = this.onItemClick.bind(this);
    this.onItemKeyDown = this.onItemKeyDown.bind(this);
  }

  onItemClick(event) {
    let originalEvent = event.originalEvent;
    let item = event.value;
    let selection = [...this.props.selection];

    let index = _ObjectUtils.default.findIndexInList(item, selection);

    let selected = index !== -1;
    let metaSelection = this.props.metaKeySelection;

    if (metaSelection) {
      let metaKey = originalEvent.metaKey || originalEvent.ctrlKey;

      if (selected && metaKey) {
        selection.splice(index, 1);
      } else {
        if (!metaKey) {
          selection.length = 0;
        }

        selection.push(item);
      }
    } else {
      if (selected) selection.splice(index, 1);else selection.push(item);
    }

    if (this.props.onSelectionChange) {
      this.props.onSelectionChange({
        event: originalEvent,
        value: selection
      });
    }
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
    if (nextItem) return !_DomHandler.default.hasClass(nextItem, 'p-picklist-item') ? this.findNextItem(nextItem) : nextItem;else return null;
  }

  findPrevItem(item) {
    let prevItem = item.previousElementSibling;
    if (prevItem) return !_DomHandler.default.hasClass(prevItem, 'p-picklist-item') ? this.findPrevItem(prevItem) : prevItem;else return null;
  }

  isSelected(item) {
    return _ObjectUtils.default.findIndexInList(item, this.props.selection) !== -1;
  }

  render() {
    let header = null;
    let items = null;
    let wrapperClassName = (0, _classnames.default)('p-picklist-listwrapper', this.props.className, {
      'p-picklist-listwrapper-nocontrols': !this.props.showControls
    });
    let listClassName = (0, _classnames.default)('p-picklist-list', this.props.listClassName);

    if (this.props.header) {
      header = _react.default.createElement("div", {
        className: "p-picklist-caption"
      }, this.props.header);
    }

    if (this.props.list) {
      items = this.props.list.map((item, i) => {
        return _react.default.createElement(_PickListItem.PickListItem, {
          key: JSON.stringify(item),
          value: item,
          template: this.props.itemTemplate,
          selected: this.isSelected(item),
          onClick: this.onItemClick,
          onKeyDown: this.onItemKeyDown,
          tabIndex: this.props.tabIndex
        });
      });
    }

    return _react.default.createElement("div", {
      className: wrapperClassName
    }, header, _react.default.createElement("ul", {
      className: listClassName,
      style: this.props.style
    }, items));
  }

}

exports.PickListSubList = PickListSubList;

_defineProperty(PickListSubList, "defaultProps", {
  list: null,
  selection: null,
  header: null,
  className: null,
  listClassName: null,
  style: null,
  showControls: true,
  metaKeySelection: true,
  tabIndex: null,
  itemTemplate: null,
  onItemClick: null,
  onSelectionChange: null
});

_defineProperty(PickListSubList, "propTypes", {
  list: _propTypes.default.array,
  selection: _propTypes.default.array,
  header: _propTypes.default.string,
  className: _propTypes.default.string,
  listClassName: _propTypes.default.string,
  style: _propTypes.default.object,
  showControls: _propTypes.default.bool,
  metaKeySelection: _propTypes.default.bool,
  tabIndex: _propTypes.default.string,
  itemTemplate: _propTypes.default.func,
  onItemClick: _propTypes.default.func,
  onSelectionChange: _propTypes.default.func
});