"use strict";

var _chai = require("chai");

var _react = _interopRequireDefault(require("react"));

var _Grid = _interopRequireDefault(require("./Grid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-env mocha */

/* eslint-disable no-unused-expressions */
describe('Grid', function () {
  it('should work', function () {
    (0, _chai.expect)(_react["default"].createElement(_Grid["default"], null)).to.be.ok;
  });
});