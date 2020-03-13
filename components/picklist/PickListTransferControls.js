"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PickListTransferControls = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _Button = require("../button/Button");

var _ObjectUtils = _interopRequireDefault(require("../utils/ObjectUtils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class PickListTransferControls extends _react.Component {
  constructor() {
    super();
    this.moveRight = this.moveRight.bind(this);
    this.moveAllRight = this.moveAllRight.bind(this);
    this.moveLeft = this.moveLeft.bind(this);
    this.moveAllLeft = this.moveAllLeft.bind(this);
  }

  moveRight(event) {
    let selection = this.props.sourceSelection;

    if (selection && selection.length) {
      let targetList = [...this.props.target];
      let sourceList = [...this.props.source];

      for (let i = 0; i < selection.length; i++) {
        let selectedItem = selection[i];

        if (_ObjectUtils.default.findIndexInList(selectedItem, targetList) === -1) {
          targetList.push(sourceList.splice(_ObjectUtils.default.findIndexInList(selectedItem, sourceList), 1)[0]);
        }
      }

      if (this.props.onTransfer) {
        this.props.onTransfer({
          originalEvent: event,
          source: sourceList,
          target: targetList,
          direction: 'toTarget'
        });
      }
    }
  }

  moveAllRight(event) {
    if (this.props.source) {
      let targetList = [...this.props.target, ...this.props.source];
      let sourceList = [];

      if (this.props.onTransfer) {
        this.props.onTransfer({
          originalEvent: event,
          source: sourceList,
          target: targetList,
          direction: 'allToTarget'
        });
      }
    }
  }

  moveLeft(event) {
    let selection = this.props.targetSelection;

    if (selection && selection.length) {
      let targetList = [...this.props.target];
      let sourceList = [...this.props.source];

      for (let i = 0; i < selection.length; i++) {
        let selectedItem = selection[i];

        if (_ObjectUtils.default.findIndexInList(selectedItem, sourceList) === -1) {
          sourceList.push(targetList.splice(_ObjectUtils.default.findIndexInList(selectedItem, targetList), 1)[0]);
        }
      }

      if (this.props.onTransfer) {
        this.props.onTransfer({
          originalEvent: event,
          source: sourceList,
          target: targetList,
          direction: 'toSource'
        });
      }
    }
  }

  moveAllLeft(event) {
    if (this.props.source) {
      let sourceList = [...this.props.source, ...this.props.target];
      let targetList = [];

      if (this.props.onTransfer) {
        this.props.onTransfer({
          originalEvent: event,
          source: sourceList,
          target: targetList,
          direction: 'allToSource'
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
      icon: "pi pi-angle-right",
      onClick: this.moveRight
    }), _react.default.createElement(_Button.Button, {
      type: "button",
      icon: "pi pi-angle-double-right",
      onClick: this.moveAllRight
    }), _react.default.createElement(_Button.Button, {
      type: "button",
      icon: "pi pi-angle-left",
      onClick: this.moveLeft
    }), _react.default.createElement(_Button.Button, {
      type: "button",
      icon: "pi pi-angle-double-left",
      onClick: this.moveAllLeft
    })));
  }

}

exports.PickListTransferControls = PickListTransferControls;

_defineProperty(PickListTransferControls, "defaultProps", {
  source: null,
  target: null,
  sourceSelection: null,
  targetSelection: null,
  onTransfer: null
});

_defineProperty(PickListTransferControls, "propTypes", {
  source: _propTypes.default.array,
  target: _propTypes.default.array,
  sourceSelection: _propTypes.default.array,
  targetSelection: _propTypes.default.array,
  onTransfer: _propTypes.default.func
});