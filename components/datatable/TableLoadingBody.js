"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TableLoadingBody = void 0;

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class TableLoadingBody extends _react.Component {
  renderRow(index) {
    let cells = [];

    for (let i = 0; i < this.props.columns.length; i++) {
      cells.push(_react.default.createElement("td", {
        key: i
      }, this.props.columns[i].props.loadingBody()));
    }

    return _react.default.createElement("tr", {
      key: index
    }, cells);
  }

  renderRows() {
    let rows = [];

    for (let i = 0; i < this.props.rows; i++) {
      rows.push(this.renderRow(i));
    }

    return rows;
  }

  render() {
    const rows = this.renderRows();
    return _react.default.createElement("tbody", {
      className: "p-datatable-tbody"
    }, rows);
  }

}

exports.TableLoadingBody = TableLoadingBody;