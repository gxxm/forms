'use strict';

const ErrorClass = require('hmpo-form-wizard').Error;

module.exports = class BaseError extends ErrorClass {
  constructor(options) {
    super(options);
  }
};
