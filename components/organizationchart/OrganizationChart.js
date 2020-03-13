"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OrganizationChart = exports.OrganizationChartNode = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class OrganizationChartNode extends _react.Component {
  constructor(props) {
    super(props);
    this.node = this.props.node;
    this.state = {
      expanded: this.node.expanded
    };
  }

  getLeaf() {
    return this.node.leaf === false ? false : !(this.node.children && this.node.children.length);
  }

  getColspan() {
    return this.node.children && this.node.children.length ? this.node.children.length * 2 : null;
  }

  onNodeClick(event, node) {
    this.props.onNodeClick(event, node);
  }

  toggleNode(event, node) {
    let _expanded = !this.state.expanded;

    this.setState({
      expanded: _expanded
    });
    event.preventDefault();
  }

  isSelected() {
    return this.props.isSelected(this.node);
  }

  render() {
    this.node = this.props.node;
    var colspan = this.getColspan();

    let nodeStyleClass = (0, _classnames.default)('p-organizationchart-node-content', this.node.className, {
      'p-organizationchart-selectable-node': this.props.selectionMode && this.node.selectable !== false,
      'p-highlight': this.isSelected()
    }),
        nodeLabel = this.props.nodeTemplate && this.props.nodeTemplate(this.node) ? _react.default.createElement("div", null, this.props.nodeTemplate(this.node)) : _react.default.createElement("div", null, this.node.label),
        toggleIcon = (0, _classnames.default)('p-node-toggler-icon', {
      'pi pi-chevron-down': this.state.expanded,
      'pi pi-chevron-up': !this.state.expanded
    }),
        nodeContent = _react.default.createElement("tr", null, _react.default.createElement("td", {
      colSpan: colspan
    }, _react.default.createElement("div", {
      className: nodeStyleClass,
      onClick: e => this.onNodeClick(e, this.node)
    }, nodeLabel, !this.getLeaf() && _react.default.createElement("button", {
      className: "p-node-toggler p-link",
      onClick: e => this.toggleNode(e, this.node)
    }, _react.default.createElement("i", {
      className: toggleIcon
    })))));

    let _visibility = !this.getLeaf() && this.state.expanded ? 'inherit' : 'hidden',
        linesDown = _react.default.createElement("tr", {
      style: {
        visibility: _visibility
      },
      className: "p-organizationchart-lines"
    }, _react.default.createElement("td", {
      colSpan: colspan
    }, _react.default.createElement("div", {
      className: "p-organizationchart-line-down"
    }))),
        nodeChildLength = this.node.children && this.node.children.length,
        linesMiddle = _react.default.createElement("tr", {
      style: {
        visibility: _visibility
      },
      className: "p-organizationchart-lines"
    }, this.node.children && this.node.children.map((item, index) => {
      let leftClass = (0, _classnames.default)('p-organizationchart-line-left', {
        'p-organizationchart-line-top': index !== 0
      }),
          rightClass = (0, _classnames.default)('p-organizationchart-line-right', {
        'p-organizationchart-line-top': index !== nodeChildLength - 1
      });
      return [_react.default.createElement("td", {
        key: index + '_lineleft',
        className: leftClass
      }, "\xA0"), _react.default.createElement("td", {
        key: index + '_lineright',
        className: rightClass
      }, "\xA0")];
    })),
        childNodes = _react.default.createElement("tr", {
      style: {
        visibility: _visibility
      },
      className: "p-organizationchart-nodes"
    }, this.node.children && this.node.children.map((child, index) => {
      return _react.default.createElement("td", {
        key: index,
        colSpan: "2"
      }, _react.default.createElement(OrganizationChartNode, {
        node: child,
        nodeTemplate: this.props.nodeTemplate,
        selectionMode: this.props.selectionMode,
        onNodeClick: this.props.onNodeClick,
        isSelected: this.props.isSelected
      }));
    }));

    return _react.default.createElement("table", {
      className: "p-organizationchart-table"
    }, _react.default.createElement("tbody", null, nodeContent, linesDown, linesMiddle, childNodes));
  }

}

exports.OrganizationChartNode = OrganizationChartNode;

_defineProperty(OrganizationChartNode, "defaultProps", {
  node: null,
  nodeTemplate: null,
  root: false,
  first: false,
  last: false,
  selectionMode: null,
  onNodeClick: null,
  isSelected: null
});

_defineProperty(OrganizationChartNode, "propTypes", {
  node: _propTypes.default.any,
  nodeTemplate: _propTypes.default.any,
  root: _propTypes.default.bool,
  first: _propTypes.default.bool,
  last: _propTypes.default.bool,
  selectionMode: _propTypes.default.string,
  onNodeClick: _propTypes.default.func,
  isSelected: _propTypes.default.func
});

class OrganizationChart extends _react.Component {
  constructor(props) {
    super(props);
    this.root = this.props.value && this.props.value.length ? this.props.value[0] : null;
    this.onNodeClick = this.onNodeClick.bind(this);
    this.isSelected = this.isSelected.bind(this);
  }

  onNodeClick(event, node) {
    if (this.props.selectionMode) {
      let eventTarget = event.target;

      if (eventTarget.className && (eventTarget.className.indexOf('p-node-toggler') !== -1 || eventTarget.className.indexOf('p-node-toggler-icon') !== -1)) {
        return;
      }

      if (node.selectable === false) {
        return;
      }

      let index = this.findIndexInSelection(node);
      let selected = index >= 0;
      let selection;

      if (this.props.selectionMode === 'single') {
        if (selected) {
          selection = null;

          if (this.props.onNodeUnselect) {
            this.props.onNodeUnselect({
              originalEvent: event,
              node: node
            });
          }
        } else {
          selection = node;

          if (this.props.onNodeSelect) {
            this.props.onNodeSelect({
              originalEvent: event,
              node: node
            });
          }
        }
      } else if (this.props.selectionMode === 'multiple') {
        if (selected) {
          selection = this.props.selection.filter((val, i) => i !== index);

          if (this.props.onNodeUnselect) {
            this.props.onNodeUnselect({
              originalEvent: event,
              node: node
            });
          }
        } else {
          selection = [...(this.props.selection || []), node];

          if (this.props.onNodeSelect) {
            this.props.onNodeSelect({
              originalEvent: event,
              node: node
            });
          }
        }
      }

      if (this.props.onSelectionChange) {
        this.props.onSelectionChange({
          originalEvent: event,
          data: selection
        });
      }
    }
  }

  findIndexInSelection(node) {
    let index = -1;

    if (this.props.selectionMode && this.props.selection) {
      if (this.props.selectionMode === 'single') {
        index = this.props.selection === node ? 0 : -1;
      } else if (this.props.selectionMode === 'multiple') {
        for (let i = 0; i < this.props.selection.length; i++) {
          if (this.props.selection[i] === node) {
            index = i;
            break;
          }
        }
      }
    }

    return index;
  }

  isSelected(node) {
    return this.findIndexInSelection(node) !== -1;
  }

  render() {
    this.root = this.props.value && this.props.value.length ? this.props.value[0] : null;
    var className = (0, _classnames.default)('p-organizationchart p-component', this.props.className);
    return _react.default.createElement("div", {
      id: this.props.id,
      style: this.props.style,
      className: className
    }, _react.default.createElement(OrganizationChartNode, {
      node: this.root,
      nodeTemplate: this.props.nodeTemplate,
      selectionMode: this.props.selectionMode,
      onNodeClick: this.onNodeClick,
      isSelected: this.isSelected
    }));
  }

}

exports.OrganizationChart = OrganizationChart;

_defineProperty(OrganizationChart, "defaultProps", {
  id: null,
  value: null,
  style: null,
  className: null,
  selectionMode: null,
  selection: null,
  nodeTemplate: null,
  onSelectionChange: null,
  onNodeSelect: null,
  onNodeUnselect: null
});

_defineProperty(OrganizationChart, "propTypes", {
  id: _propTypes.default.string,
  value: _propTypes.default.any,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  selectionMode: _propTypes.default.string,
  selection: _propTypes.default.any,
  nodeTemplate: _propTypes.default.any,
  onSelectionChange: _propTypes.default.func,
  onNodeSelect: _propTypes.default.func,
  onNodeUnselect: _propTypes.default.func
});