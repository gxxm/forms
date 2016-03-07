'use strict';

const Controller = require('../../../so-forms').controllers.edjax;

module.exports = class Reset extends Controller {

  constructor(options) {
    super(options);
  }

  getValues(req, res, callback) {
    req.sessionModel.reset();
    callback();
  }

  getNextStep(req) {
    let next = req.baseUrl;
    return next;
  }

};
