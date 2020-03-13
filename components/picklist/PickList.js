"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PickList = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

var _classnames = _interopRequireDefault(require("classnames"));

var _PickListSubList = require("./PickListSubList");

var _PickListControls = require("./PickListControls");

var _PickListTransferControls = require("./PickListTransferControls");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class PickList extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItemsSource: [],
      selectedItemsTarget: []
    };
    this.onSourceReorder = this.onSourceReorder.bind(this);
    this.onTargetReorder = this.onTargetReorder.bind(this);
    this.onTransfer = this.onTransfer.bind(this);
  }

  onSourceReorder(event) {
    this.handleChange(event, event.value, this.props.target);
    this.reorderedListElement = this.sourceListElement;
    this.reorderDirection = event.direction;
  }

  onTargetReorder(event) {
    this.handleChange(event, this.props.source, event.value);
    this.reorderedListElement = this.targetListElement;
    this.reorderDirection = event.direction;
  }

  handleScrollPosition(listElement, direction) {
    switch (direction) {
      case 'up':
        this.scrollInView(listElement, -1);
        break;

      case 'top':
        listElement.scrollTop = 0;
        break;

      case 'down':
        this.scrollInView(listElement, 1);
        break;

      case 'bottom':
        listElement.scrollTop = listElement.scrollHeight;
        break;

      default:
        break;
    }
  }

  handleChange(event, source, target) {
    if (this.props.onChange) {
      this.props.onChange({
        event: event.originalEvent,
        source: source,
        target: target
      });
    }
  }

  onTransfer(event) {
    switch (event.direction) {
      case 'toTarget':
        if (this.props.onMoveToTarget) {
          this.props.onMoveToTarget({
            originalEvent: event.originalEvent,
            value: this.state.selectedItemsSource
          });
        }

        break;

      case 'allToTarget':
        if (this.props.onMoveAllToTarget) {
          this.props.onMoveAllToTarget({
            originalEvent: event.originalEvent,
            value: this.props.source
          });
        }

        break;

      case 'toSource':
        if (this.props.onMoveToSource) {
          this.props.onMoveToSource({
            originalEvent: event.originalEvent,
            value: this.state.selectedItemsTarget
          });
        }

        break;

      case 'allToSource':
        if (this.props.onMoveAllToSource) {
          this.props.onMoveAllToSource({
            originalEvent: event.originalEvent,
            value: this.props.target
          });
        }

        break;

      default:
        break;
    }

    this.setState({
      selectedItemsSource: [],
      selectedItemsTarget: []
    });
    this.handleChange(event, event.source, event.target);
  }

  scrollInView(listElement, direction) {
    let listContainer = _DomHandler.default.findSingle(listElement, '.p-picklist-list');

    let listItems = listContainer.getElementsByClassName('p-highlight');
    let listItem;
    if (direction === -1) listItem = listItems[0];else if (direction === 1) listItem = listItems[listItems.length - 1];

    _DomHandler.default.scrollInView(listContainer, listItem);
  }

  onSelectionChange(e, stateKey, callback) {
    this.setState({
      [stateKey]: e.value
    });

    if (callback) {
      callback(e);
    }
  }

  componentDidUpdate() {
    if (this.reorderedListElement) {
      this.handleScrollPosition(this.reorderedListElement, this.reorderDirection);
      this.reorderedListElement = null;
      this.reorderDirection = null;
    }
  }

  render() {
    let className = (0, _classnames.default)('p-picklist p-component', this.props.className, {
      'p-picklist-responsive': this.props.responsive
    });
    return _react.default.createElement("div", {
      id: this.props.id,
      className: className,
      style: this.props.style
    }, this.props.showSourceControls && _react.default.createElement(_PickListControls.PickListControls, {
      list: this.props.source,
      selection: this.state.selectedItemsSource,
      onReorder: this.onSourceReorder,
      className: "p-picklist-source-controls"
    }), _react.default.createElement(_PickListSubList.PickListSubList, {
      ref: el => this.sourceListElement = _reactDom.default.findDOMNode(el),
      list: this.props.source,
      selection: this.state.selectedItemsSource,
      onSelectionChange: e => this.onSelectionChange(e, 'selectedItemsSource', this.props.onSourceSelect),
      itemTemplate: this.props.itemTemplate,
      header: this.props.sourceHeader,
      style: this.props.sourceStyle,
      className: "p-picklist-source-wrapper",
      listClassName: "p-picklist-source",
      metaKeySelection: this.props.metaKeySelection,
      tabIndex: this.props.tabIndex
    }), _react.default.createElement(_PickListTransferControls.PickListTransferControls, {
      onTransfer: this.onTransfer,
      source: this.props.source,
      target: this.props.target,
      sourceSelection: this.state.selectedItemsSource,
      targetSelection: this.state.selectedItemsTarget
    }), _react.default.createElement(_PickListSubList.PickListSubList, {
      ref: el => this.targetListElement = _reactDom.default.findDOMNode(el),
      list: this.props.target,
      selection: this.state.selectedItemsTarget,
      onSelectionChange: e => this.onSelectionChange(e, 'selectedItemsTarget', this.props.onTargetSelect),
      itemTemplate: this.props.itemTemplate,
      header: this.props.targetHeader,
      style: this.props.targetStyle,
      className: "p-picklist-target-wrapper",
      listClassName: "p-picklist-targe",
      metaKeySelection: this.props.metaKeySelection,
      tabIndex: this.props.tabIndex
    }), this.props.showTargetControls && _react.default.createElement(_PickListControls.PickListControls, {
      list: this.props.target,
      selection: this.state.selectedItemsTarget,
      onReorder: this.onTargetReorder,
      className: "p-picklist-target-controls"
    }));
  }

}

exports.PickList = PickList;

_defineProperty(PickList, "defaultProps", {
  id: null,
  source: null,
  target: null,
  sourceHeader: null,
  targetHeader: null,
  style: null,
  className: null,
  sourceStyle: null,
  targetStyle: null,
  responsive: false,
  showSourceControls: true,
  showTargetControls: true,
  metaKeySelection: true,
  tabIndex: '0',
  itemTemplate: null,
  onChange: null,
  onMoveToSource: null,
  onMoveAllToSource: null,
  onMoveToTarget: null,
  onMoveAllToTarget: null,
  onSourceSelect: null,
  onTargetSelect: null
});

_defineProperty(PickList, "propTypes", {
  id: _propTypes.default.string,
  source: _propTypes.default.array,
  target: _propTypes.default.array,
  sourceHeader: _propTypes.default.string,
  targetHeader: _propTypes.default.string,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  sourcestyle: _propTypes.default.object,
  targetstyle: _propTypes.default.object,
  responsive: _propTypes.default.bool,
  showSourceControls: _propTypes.default.bool,
  showTargetControls: _propTypes.default.bool,
  metaKeySelection: _propTypes.default.bool,
  tabIndex: _propTypes.default.string,
  itemTemplate: _propTypes.default.func,
  onChange: _propTypes.default.func,
  onMoveToSource: _propTypes.default.func,
  onMoveAllToSource: _propTypes.default.func,
  onMoveToTarget: _propTypes.default.func,
  onMoveAllToTarget: _propTypes.default.func,
  onSourceSelect: _propTypes.default.func,
  onTargetSelect: _propTypes.default.func
});