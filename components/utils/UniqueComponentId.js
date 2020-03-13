"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var lastId = 0;

function _default(prefix = 'pr_id_') {
  lastId++;
  return "".concat(prefix).concat(lastId);
}