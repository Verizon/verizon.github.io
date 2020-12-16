"use strict";

var _chai = require("chai");

var _ = require(".");

/* eslint-env mocha */

/* eslint-disable no-unused-expressions */
describe('index', function () {
  it('should correctly export', function () {
    (0, _chai.expect)(_.BASE_CONF).to.be.ok;
    (0, _chai.expect)(_.Grid).to.be.ok;
    (0, _chai.expect)(_.Row).to.be.ok;
    (0, _chai.expect)(_.Col).to.be.ok;
  });
});