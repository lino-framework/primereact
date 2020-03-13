"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OrderListControls = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Button = require("../button/Button");

var _ObjectUtils = _interopRequireDefault(require("../utils/ObjectUtils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class OrderListControls extends _react.Component {
  constructor() {
    super();
    this.moveUp = this.moveUp.bind(this);
    this.moveTop = this.moveTop.bind(this);
    this.moveDown = this.moveDown.bind(this);
    this.moveBottom = this.moveBottom.bind(this);
  }

  moveUp(event) {
    if (this.props.selection) {
      let value = [...this.props.value];

      for (let i = 0; i < this.props.selection.length; i++) {
        let selectedItem = this.props.selection[i];

        let selectedItemIndex = _ObjectUtils.default.findIndexInList(selectedItem, value);

        if (selectedItemIndex !== 0) {
          let movedItem = value[selectedItemIndex];
          let temp = value[selectedItemIndex - 1];
          value[selectedItemIndex - 1] = movedItem;
          value[selectedItemIndex] = temp;
        } else {
          break;
        }
      }

      if (this.props.onReorder) {
        this.props.onReorder({
          originalEvent: event,
          value: value,
          direction: 'up'
        });
      }
    }
  }

  moveTop(event) {
    if (this.props.selection) {
      let value = [...this.props.value];

      for (let i = 0; i < this.props.selection.length; i++) {
        let selectedItem = this.props.selection[i];

        let selectedItemIndex = _ObjectUtils.default.findIndexInList(selectedItem, value);

        if (selectedItemIndex !== 0) {
          let movedItem = value.splice(selectedItemIndex, 1)[0];
          value.unshift(movedItem);
        } else {
          break;
        }
      }

      if (this.props.onReorder) {
        this.props.onReorder({
          originalEvent: event,
          value: value,
          direction: 'top'
        });
      }
    }
  }

  moveDown(event) {
    if (this.props.selection) {
      let value = [...this.props.value];

      for (let i = this.props.selection.length - 1; i >= 0; i--) {
        let selectedItem = this.props.selection[i];

        let selectedItemIndex = _ObjectUtils.default.findIndexInList(selectedItem, value);

        if (selectedItemIndex !== value.length - 1) {
          let movedItem = value[selectedItemIndex];
          let temp = value[selectedItemIndex + 1];
          value[selectedItemIndex + 1] = movedItem;
          value[selectedItemIndex] = temp;
        } else {
          break;
        }
      }

      if (this.props.onReorder) {
        this.props.onReorder({
          originalEvent: event,
          value: value,
          direction: 'down'
        });
      }
    }
  }

  moveBottom(event) {
    if (this.props.selection) {
      let value = [...this.props.value];

      for (let i = this.props.selection.length - 1; i >= 0; i--) {
        let selectedItem = this.props.selection[i];

        let selectedItemIndex = _ObjectUtils.default.findIndexInList(selectedItem, value);

        if (selectedItemIndex !== value.length - 1) {
          let movedItem = value.splice(selectedItemIndex, 1)[0];
          value.push(movedItem);
        } else {
          break;
        }
      }

      if (this.props.onReorder) {
        this.props.onReorder({
          originalEvent: event,
          value: value,
          direction: 'bottom'
        });
      }
    }
  }

  render() {
    return _react.default.createElement("div", {
      className: "p-orderlist-controls"
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
    }));
  }

}

exports.OrderListControls = OrderListControls;

_defineProperty(OrderListControls, "defaultProps", {
  value: null,
  selection: null,
  onReorder: null
});

_defineProperty(OrderListControls, "propTypes", {
  value: _propTypes.default.array,
  selection: _propTypes.default.array,
  onReorder: _propTypes.default.func
});