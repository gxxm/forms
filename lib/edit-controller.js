'use strict';

var _ = require('lodash');
const Controller = require('./base-controller');

module.exports = class EditController extends Controller {
  constructor(options) {
    super(options);
  }

  process(req, res, callback) {
    // Don't try to process missing fields
    req.form.values = _.pick(req.form.values, _.keys(req.body));
    callback();
  }

};
