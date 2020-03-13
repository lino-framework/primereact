"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tree = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _ObjectUtils = _interopRequireDefault(require("../utils/ObjectUtils"));

var _UITreeNode = require("./UITreeNode");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Tree extends _react.Component {
  constructor(props) {
    super(props);

    if (!this.props.onToggle) {
      this.state = {
        expandedKeys: this.props.expandedKeys,
        filter: ''
      };
    }

    this.isNodeLeaf = this.isNodeLeaf.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDropPoint = this.onDropPoint.bind(this);
    this.onFilterInputChange = this.onFilterInputChange.bind(this);
    this.onFilterInputKeyDown = this.onFilterInputKeyDown.bind(this);
  }

  getExpandedKeys() {
    return this.props.onToggle ? this.props.expandedKeys : this.state.expandedKeys;
  }

  getRootNode() {
    return this.props.filter && this.filteredNodes ? this.filteredNodes : this.props.value;
  }

  onToggle(event) {
    if (this.props.onToggle) {
      this.props.onToggle(event);
    } else {
      this.setState({
        expandedKeys: event.value
      });
    }
  }

  onDragStart(event) {
    this.dragState = {
      path: event.path,
      index: event.index
    };
  }

  onDragEnd() {
    this.dragState = null;
  }

  onDrop(event) {
    if (this.validateDropNode(this.dragState.path, event.path)) {
      let value = JSON.parse(JSON.stringify(this.props.value));
      let dragPaths = this.dragState.path.split('-');
      dragPaths.pop();
      let dragNodeParent = this.findNode(value, dragPaths);
      let dragNode = dragNodeParent ? dragNodeParent.children[this.dragState.index] : value[this.dragState.index];
      let dropNode = this.findNode(value, event.path.split('-'));
      if (dropNode.children) dropNode.children.push(dragNode);else dropNode.children = [dragNode];
      if (dragNodeParent) dragNodeParent.children.splice(this.dragState.index, 1);else value.splice(this.dragState.index, 1);

      if (this.props.onDragDrop) {
        this.props.onDragDrop({
          originalEvent: event.originalEvent,
          value: value
        });
      }
    }
  }

  onDropPoint(event) {
    if (this.validateDropPoint(event)) {
      let value = JSON.parse(JSON.stringify(this.props.value));
      let dragPaths = this.dragState.path.split('-');
      dragPaths.pop();
      let dropPaths = event.path.split('-');
      dropPaths.pop();
      let dragNodeParent = this.findNode(value, dragPaths);
      let dropNodeParent = this.findNode(value, dropPaths);
      let dragNode = dragNodeParent ? dragNodeParent.children[this.dragState.index] : value[this.dragState.index];
      let siblings = this.areSiblings(this.dragState.path, event.path);
      if (dragNodeParent) dragNodeParent.children.splice(this.dragState.index, 1);else value.splice(this.dragState.index, 1);

      if (event.position < 0) {
        let dropIndex = siblings ? this.dragState.index > event.index ? event.index : event.index - 1 : event.index;
        if (dropNodeParent) dropNodeParent.children.splice(dropIndex, 0, dragNode);else value.splice(dropIndex, 0, dragNode);
      } else {
        if (dropNodeParent) dropNodeParent.children.push(dragNode);else value.push(dragNode);
      }

      if (this.props.onDragDrop) {
        this.props.onDragDrop({
          originalEvent: event.originalEvent,
          value: value
        });
      }
    }
  }

  validateDrop(dragPath, dropPath) {
    if (!dragPath) {
      return false;
    } else {
      //same node
      if (dragPath === dropPath) {
        return false;
      } //parent dropped on an descendant


      if (dropPath.indexOf(dragPath) === 0) {
        return false;
      }

      return true;
    }
  }

  validateDropNode(dragPath, dropPath) {
    let validateDrop = this.validateDrop(dragPath, dropPath);

    if (validateDrop) {
      //child dropped on parent
      if (dragPath.indexOf('-') > 0 && dragPath.substring(0, dragPath.lastIndexOf('-')) === dropPath) {
        return false;
      }

      return true;
    } else {
      return false;
    }
  }

  validateDropPoint(event) {
    let validateDrop = this.validateDrop(this.dragState.path, event.path);

    if (validateDrop) {
      //child dropped to next sibling's drop point
      if (event.position === -1 && this.areSiblings(this.dragState.path, event.path) && this.dragState.index + 1 === event.index) {
        return false;
      }

      return true;
    } else {
      return false;
    }
  }

  areSiblings(path1, path2) {
    if (path1.length === 1 && path2.length === 1) return true;else return path1.substring(0, path1.lastIndexOf('-')) === path2.substring(0, path2.lastIndexOf('-'));
  }

  findNode(value, path) {
    if (path.length === 0) {
      return null;
    } else {
      const index = parseInt(path[0], 10);
      const nextSearchRoot = value.children ? value.children[index] : value[index];

      if (path.length === 1) {
        return nextSearchRoot;
      } else {
        path.shift();
        return this.findNode(nextSearchRoot, path);
      }
    }
  }

  isNodeLeaf(node) {
    return node.leaf === false ? false : !(node.children && node.children.length);
  }

  onFilterInputKeyDown(event) {
    //enter
    if (event.which === 13) {
      event.preventDefault();
    }
  }

  onFilterInputChange(event) {
    this.filterChanged = true;
    this.setState({
      filter: event.target.value
    });
  }

  filter() {
    if (!this.filterChanged) {
      return;
    }

    if (this.state.filter === '') {
      this.filteredNodes = this.props.value;
    } else {
      this.filteredNodes = [];
      const searchFields = this.props.filterBy.split(',');
      const filterText = this.state.filter.toLowerCase();
      const isStrictMode = this.props.filterMode === 'strict';
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.props.value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          let node = _step.value;

          let copyNode = _objectSpread({}, node);

          let paramsWithoutNode = {
            searchFields,
            filterText,
            isStrictMode
          };

          if (isStrictMode && (this.findFilteredNodes(copyNode, paramsWithoutNode) || this.isFilterMatched(copyNode, paramsWithoutNode)) || !isStrictMode && (this.isFilterMatched(copyNode, paramsWithoutNode) || this.findFilteredNodes(copyNode, paramsWithoutNode))) {
            this.filteredNodes.push(copyNode);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    this.filterChanged = false;
  }

  findFilteredNodes(node, paramsWithoutNode) {
    if (node) {
      let matched = false;

      if (node.children) {
        let childNodes = [...node.children];
        node.children = [];

        for (var _i = 0, _childNodes = childNodes; _i < _childNodes.length; _i++) {
          let childNode = _childNodes[_i];

          let copyChildNode = _objectSpread({}, childNode);

          if (this.isFilterMatched(copyChildNode, paramsWithoutNode)) {
            matched = true;
            node.children.push(copyChildNode);
          }
        }
      }

      if (matched) {
        return true;
      }
    }
  }

  isFilterMatched(node, {
    searchFields,
    filterText,
    isStrictMode
  }) {
    let matched = false;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = searchFields[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        let field = _step2.value;
        let fieldValue = String(_ObjectUtils.default.resolveFieldData(node, field)).toLowerCase();

        if (fieldValue.indexOf(filterText) > -1) {
          matched = true;
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    if (!matched || isStrictMode && !this.isNodeLeaf(node)) {
      matched = this.findFilteredNodes(node, {
        searchFields,
        filterText,
        isStrictMode
      }) || matched;
    }

    return matched;
  }

  renderRootChild(node, index, last) {
    return _react.default.createElement(_UITreeNode.UITreeNode, {
      key: node.key || node.label,
      node: node,
      index: index,
      last: last,
      path: String(index),
      disabled: this.props.disabled,
      selectionMode: this.props.selectionMode,
      selectionKeys: this.props.selectionKeys,
      onSelectionChange: this.props.onSelectionChange,
      metaKeySelection: this.props.metaKeySelection,
      contextMenuSelectionKey: this.props.contextMenuSelectionKey,
      onContextMenuSelectionChange: this.props.onContextMenuSelectionChange,
      onContextMenu: this.props.onContextMenu,
      propagateSelectionDown: this.props.propagateSelectionDown,
      propagateSelectionUp: this.props.propagateSelectionUp,
      onExpand: this.props.onExpand,
      onCollapse: this.props.onCollapse,
      onSelect: this.props.onSelect,
      onUnselect: this.props.onUnselect,
      expandedKeys: this.getExpandedKeys(),
      onToggle: this.onToggle,
      nodeTemplate: this.props.nodeTemplate,
      isNodeLeaf: this.isNodeLeaf,
      dragdropScope: this.props.dragdropScope,
      onDragStart: this.onDragStart,
      onDragEnd: this.onDragEnd,
      onDrop: this.onDrop,
      onDropPoint: this.onDropPoint
    });
  }

  renderRootChildren() {
    if (this.props.filter) {
      this.filter();
    }

    const value = this.getRootNode();
    return value.map((node, index) => this.renderRootChild(node, index, index === value.length - 1));
  }

  renderModel() {
    if (this.props.value) {
      const rootNodes = this.renderRootChildren();
      let contentClass = (0, _classnames.default)('p-tree-container', this.props.contentClassName);
      return _react.default.createElement("ul", {
        className: contentClass,
        role: "tree",
        "aria-label": this.props.ariaLabel,
        "aria-labelledby": this.props.ariaLabelledBy,
        style: this.props.contentStyle
      }, rootNodes);
    } else {
      return null;
    }
  }

  renderLoader() {
    if (this.props.loading) {
      let icon = (0, _classnames.default)('p-tree-loading-icon pi-spin', this.props.loadingIcon);
      return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("div", {
        className: "p-tree-loading-mask p-component-overlay"
      }), _react.default.createElement("div", {
        className: "p-tree-loading-content"
      }, _react.default.createElement("i", {
        className: icon
      })));
    } else {
      return null;
    }
  }

  renderFilter() {
    if (this.props.filter) {
      return _react.default.createElement("div", {
        className: "p-tree-filter-container"
      }, _react.default.createElement("input", {
        type: "text",
        autoComplete: "off",
        className: "p-tree-filter p-inputtext p-component",
        placeholder: this.props.filterPlaceholder,
        onKeyDown: this.onFilterInputKeyDown,
        onChange: this.onFilterInputChange,
        disabled: this.props.disabled
      }), _react.default.createElement("span", {
        className: "p-tree-filter-icon pi pi-search"
      }));
    } else {
      return null;
    }
  }

  render() {
    const className = (0, _classnames.default)('p-tree p-component', this.props.className, {
      'p-tree-selectable': this.props.selectionMode,
      'p-tree-loading': this.props.loading,
      'p-disabled': this.props.disabled
    });
    const loader = this.renderLoader();
    const content = this.renderModel();
    const filter = this.renderFilter();
    return _react.default.createElement("div", {
      id: this.props.id,
      className: className,
      style: this.props.style
    }, loader, filter, content);
  }

}

exports.Tree = Tree;

_defineProperty(Tree, "defaultProps", {
  id: null,
  value: null,
  disabled: false,
  selectionMode: null,
  selectionKeys: null,
  onSelectionChange: null,
  contextMenuSelectionKey: null,
  onContextMenuSelectionChange: null,
  expandedKeys: null,
  style: null,
  className: null,
  contentStyle: null,
  contentClassName: null,
  metaKeySelection: true,
  propagateSelectionUp: true,
  propagateSelectionDown: true,
  loading: false,
  loadingIcon: 'pi pi-spinner',
  dragdropScope: null,
  filter: false,
  filterBy: 'label',
  filterMode: 'lenient',
  filterPlaceholder: null,
  nodeTemplate: null,
  onSelect: null,
  onUnselect: null,
  onExpand: null,
  onCollapse: null,
  onToggle: null,
  onDragDrop: null,
  onContextMenu: null
});

_defineProperty(Tree, "propTypes", {
  id: _propTypes.default.string,
  value: _propTypes.default.any,
  disabled: _propTypes.default.bool,
  selectionMode: _propTypes.default.string,
  selectionKeys: _propTypes.default.any,
  onSelectionChange: _propTypes.default.func,
  contextMenuSelectionKey: _propTypes.default.any,
  onContextMenuSelectionChange: _propTypes.default.func,
  expandedKeys: _propTypes.default.object,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  contentStyle: _propTypes.default.object,
  contentClassName: _propTypes.default.string,
  metaKeySelection: _propTypes.default.bool,
  propagateSelectionUp: _propTypes.default.bool,
  propagateSelectionDown: _propTypes.default.bool,
  loading: _propTypes.default.bool,
  loadingIcon: _propTypes.default.string,
  dragdropScope: _propTypes.default.string,
  filter: _propTypes.default.bool,
  filterBy: _propTypes.default.any,
  filterMode: _propTypes.default.string,
  filterPlaceholder: _propTypes.default.string,
  nodeTemplate: _propTypes.default.func,
  onSelect: _propTypes.default.func,
  onUnselect: _propTypes.default.func,
  onExpand: _propTypes.default.func,
  onCollapse: _propTypes.default.func,
  onToggle: _propTypes.default.func,
  onDragDrop: _propTypes.default.func,
  onContextMenu: _propTypes.default.func
});