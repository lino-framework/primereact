"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PickListControls = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Button = require("../button/Button");

var _classnames = _interopRequireDefault(require("classnames"));

var _ObjectUtils = _interopRequireDefault(require("../utils/ObjectUtils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class PickListControls extends _react.Component {
  constructor() {
    super();
    this.moveUp = this.moveUp.bind(this);
    this.moveTop = this.moveTop.bind(this);
    this.moveDown = this.moveDown.bind(this);
    this.moveBottom = this.moveBottom.bind(this);
  }

  moveUp(event) {
    let selectedItems = this.props.selection;

    if (selectedItems && selectedItems.length) {
      let list = [...this.props.list];

      for (let i = 0; i < selectedItems.length; i++) {
        let selectedItem = selectedItems[i];

        let selectedItemIndex = _ObjectUtils.default.findIndexInList(selectedItem, list);

        if (selectedItemIndex !== 0) {
          let movedItem = list[selectedItemIndex];
          let temp = list[selectedItemIndex - 1];
          list[selectedItemIndex - 1] = movedItem;
          list[selectedItemIndex] = temp;
        } else {
          break;
        }
      }

      if (this.props.onReorder) {
        this.props.onReorder({
          originalEvent: event,
          value: list,
          direction: 'up'
        });
      }
    }
  }

  moveTop(event) {
    let selectedItems = this.props.selection;

    if (selectedItems && selectedItems.length) {
      let list = [...this.props.list];

      for (let i = 0; i < selectedItems.length; i++) {
        let selectedItem = selectedItems[i];

        let selectedItemIndex = _ObjectUtils.default.findIndexInList(selectedItem, list);

        if (selectedItemIndex !== 0) {
          let movedItem = list.splice(selectedItemIndex, 1)[0];
          list.unshift(movedItem);
        } else {
          break;
        }
      }

      if (this.props.onReorder) {
        this.props.onReorder({
          originalEvent: event,
          value: list,
          direction: 'top'
        });
      }
    }
  }

  moveDown(event) {
    let selectedItems = this.props.selection;

    if (selectedItems && selectedItems.length) {
      let list = [...this.props.list];

      for (let i = selectedItems.length - 1; i >= 0; i--) {
        let selectedItem = selectedItems[i];

        let selectedItemIndex = _ObjectUtils.default.findIndexInList(selectedItem, list);

        if (selectedItemIndex !== list.length - 1) {
          let movedItem = list[selectedItemIndex];
          let temp = list[selectedItemIndex + 1];
          list[selectedItemIndex + 1] = movedItem;
          list[selectedItemIndex] = temp;
        } else {
          break;
        }
      }

      if (this.props.onReorder) {
        this.props.onReorder({
          originalEvent: event,
          value: list,
          direction: 'down'
        });
      }

      this.movedDown = true;
    }
  }

  moveBottom(event) {
    let selectedItems = this.props.selection;

    if (selectedItems && selectedItems.length) {
      let list = [...this.props.list];

      for (let i = selectedItems.length - 1; i >= 0; i--) {
        let selectedItem = selectedItems[i];

        let selectedItemIndex = _ObjectUtils.default.findIndexInList(selectedItem, list);

        if (selectedItemIndex !== list.length - 1) {
          let movedItem = list.splice(selectedItemIndex, 1)[0];
          list.push(movedItem);
        } else {
          break;
        }
      }

      if (this.props.onReorder) {
        this.props.onReorder({
          originalEvent: event,
          value: list,
          direction: 'bottom'
        });
      }
    }
  }

  render() {
    let className = (0, _classnames.default)('p-picklist-buttons', this.props.className);
    return _react.default.createElement("div", {
      className: className
    }, _react.default.createElement("div", {
      className: "p-picklist-buttons-cell"
    }, _react.default.createElement(_Button.Button, {
      type: "button",
      icon: "pi pi-angle-up",
      onClick: this.moveUp
    }), _react.default.createElement(_Button.Button, {
      type: "button",
      icon: "pi pi-angle-double-up",
      onClick: this.moveTop
    }), _react.default.createElement(_Button.Button, {
      type: "button",
      icon: "pi pi-angle-down",
      onClick: this.moveDown
    }), _react.default.createElement(_Button.Button, {
      type: "button",
      icon: "pi pi-angle-double-down",
      onClick: this.moveBottom
    })));
  }

}

exports.PickListControls = PickListControls;

_defineProperty(PickListControls, "defaultProps", {
  className: null,
  list: null,
  selection: null,
  onReorder: null
});

_defineProperty(PickListControls, "propTypes", {
  className: _propTypes.default.string,
  list: _propTypes.default.array,
  selection: _propTypes.default.array,
  onReorder: _propTypes.default.func
});