'use strict';

const Controller = require('./base-controller');

module.exports = class StartController extends Controller {

  constructor(options) {
    super(options);
  }

  getValues(req) {
    req.sessionModel.reset();
    super.successHandler(req);
  }
};
