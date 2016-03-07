'use strict';

const Controller = require('hmpo-form-wizard').Controller;
const _ = require('lodash');
const logger = require('./logger');

module.exports = class BaseController extends Controller {

  constructor(options) {
    super(options);
    this.next = options.next;
    this.confirmStep = '/confirm';
  }

  getNextStep(req) {
    let next = super.getNextStep(req);
    if (req.params.action === 'edit' && !this.options.continueOnEdit) {
      next = req.baseUrl === '/' ? this.confirmStep : req.baseUrl + this.confirmStep;
    } else if (req.params.action === 'edit') {
      next += '/edit';
    }
    return next;
  }

  getErrorStep(err, req) {
    let redirect = super.getErrorStep(err, req);
    if (req.params.action === 'edit' && !redirect.match(/\/edit$/)) {
      redirect += '/edit';
    }
    return redirect;
  }

  locals(req, res) {
    const locals = super.locals(req, res);
    return _.extend({}, locals, {
      baseUrl: req.baseUrl,
      nextPage: this.getNextStep(req, res),
      errorLength: this.getErrorLength(req, res)
    });
  }

  getErrorLength(req, res) {
    const errors = super.getErrors(req, res);
    const errorLength = Object.keys(errors).length;

    if (errorLength === 1) {
      return {single: true};
    }
    if (errorLength > 1) {
      return {multiple: true};
    }
  }

  getValues(req, res, callback) {
    if (_.isEmpty(super.getErrors(req, res))) {
      super.referrer = req.header('Referer');
    }

    super.getValues(req, res, callback);

    // clear the session if there's no next step or we request to clear the session
    if ((_.isUndefined(this.options.next) && this.options.clearSession) || this.options.clearSession) {
      logger.info('Clearing session at endpoint', req.url);
      req.sessionModel.reset();
    }
  }
};
