'use strict';

module.exports = {
  controllers: {
    base: require('./controllers/base-controller'),
    date: require('./controllers/date-controller'),
    ajax: require('./controllers/ajax-controller'),
    edjax: require('./controllers/ajax-edit-controller'),
    edit: require('./controllers/edit-controller'),
    start: require('./controllers/ajax-controller'),

  },
  logger: require('./controllers/logger'),
  errors: require('./errors')

};
