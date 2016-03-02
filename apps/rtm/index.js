'use strict';

const wizard = require('hmpo-form-wizard');
const mixins = require('hmpo-template-mixins');
const i18nFuture = require('i18n-future');
const router = require('express').Router();
const path = require('path');
const _ = require('lodash');

var fields = _.extend({}, require('./fields/'));
var i18n = i18nFuture({
  path: path.resolve(__dirname, './translations/__lng__/__ns__.json')
});

router.use(mixins(fields, {
  translate: i18n.translate.bind(i18n)
}));

router.use('/report-terrorism/', wizard(require('./steps'), fields, {
  controller: require('../../lib/base-controller'),
  templatePath: path.resolve(__dirname, 'views'),
  translate: i18n.translate.bind(i18n),
  params: '/:action?'
}));

module.exports = router;
