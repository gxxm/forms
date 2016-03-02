'use strict';

const _ = require('underscore');
const BaseController = require('../../../lib/base-controller');

module.exports = class Controller extends BaseController {

  constructor(options) {
    super(options);
  }

  getReports(req) {
    const sessionData = _.pick(req.sessionModel.toJSON(), _.identity);
    let data = sessionData.report || [];
    return data;
  }

};
