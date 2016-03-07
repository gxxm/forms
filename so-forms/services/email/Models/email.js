'use strict';

const emailService = require('../index');
const Model = require('hmpo-model');
const _ = require('lodash');

module.exports = class EmailModel extends Model {

  constructor(options) {
    super(options);
  }

  save(callback) {
    // we omit keys that are not part of the session data
    emailService.send({
      template: this.get('template'),
      to: this.get('email'),
      subject: this.get('subject'),
      dataToSend: _.omit(this.toJSON(), ['steps', 'csrf-secret', 'template'])
    }, callback);
  }
};
