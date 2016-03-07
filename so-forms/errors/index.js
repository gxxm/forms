'use strict';
const path = require('path');
const i18n = require('i18n-future')({
  path: path.resolve(__dirname, '../translations/__lng__/__ns__.json')
});
const config = require('./../../config');
const logger = require('../controllers/logger');

/*eslint no-unused-vars: 0*/
module.exports = function errorHandler(err, req, res, next) {
  /*eslint no-unused-vars: 1*/
  const content = {};

  if (err.code === 'SESSION_TIMEOUT') {
    content.title = i18n.translate('errors.session.title');
    content.message = i18n.translate('errors.session.message');
  }

  err.template = 'error';
  content.title = content.title || i18n.translate('errors.default.title');
  content.message = content.message || i18n.translate('errors.default.message');

  res.statusCode = err.status || 500;

  logger.error(err.message || err.error, err);

  res.render(err.template, {
    error: err,
    content,
    backLink: false,
    showStack: config.env === 'development',
    startLink: req.path.replace(/^\/([^\/]*).*$/, '$1')
  });
};
