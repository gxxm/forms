'use strict';

module.exports = {
  controllers: {
    base: require('./base-controller'),
    date: require('./date-controller'),
    error: require('./error-controller')
  },
  wizard: require('hmpo-form-wizard'),
  toolkit: require('hmpo-frontend-toolkit'),
  template: require('hmpo-govuk-template'),
  Model: require('hmpo-model'),
  mixins: require('hmpo-template-mixins'),
  i18n: require('i18n-future')
};

