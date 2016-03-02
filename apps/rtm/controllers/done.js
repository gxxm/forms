'use strict';

const Controller = require('../../../lib/base-controller');

module.exports = class DoneController extends Controller {

  constructor(options) {
    super(options);
  }

  getValues(req, res, callback) {
    var json = req.sessionModel.toJSON();
    delete json.errorValues;
    req.sessionModel.reset();
    callback(null, json);
  }

};
