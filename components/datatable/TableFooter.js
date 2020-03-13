"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TableFooter = void 0;

var _react = _interopRequireWildcard(require("react"));

var _FooterCell = require("./FooterCell");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

class TableFooter extends _react.Component {
  createFooterCells(root, column, i) {
    let children = _react.default.Children.toArray(root.props.children);

    return _react.default.Children.map(children, (column, i) => {
      return _react.default.createElement(_FooterCell.FooterCell, _extends({
        key: i
      }, column.props));
    });
  }

  render() {
    let content;

    if (this.props.columnGroup) {
      let rows = _react.default.Children.toArray(this.props.columnGroup.props.children);

      content = rows.map((row, i) => {
        return _react.default.createElement("tr", {
          key: i
        }, this.createFooterCells(row));
      });
    } else {
      content = _react.default.createElement("tr", null, this.createFooterCells(this));
    }

    return _react.default.createElement("tfoot", {
      className: "p-datatable-tfoot"
    }, content);
  }

}

exports.TableFooter = TableFooter;