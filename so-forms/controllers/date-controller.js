'use strict';

const Controller = require('./base-controller');
const ErrorClass = require('./base-error');
const moment = require('moment');
const _ = require('lodash');
const dateFormat = 'DD-MM-YYYY';
const prettyDate = 'D MMMM YYYY';

/*eslint no-unused-vars: 0*/
var validators = [
  {
    method: function isEmpty(value) {
      return value === '' || value === undefined;
    },
    type: 'required'
  },
  {
    method: function isInvalidChars(value) {
      const valueParts = value.split('-');
      return _.some(valueParts, function testForNumeric(part) {
        return /\D/.test(part);
      });
    },
    type: 'numeric'
  },
  {
    method: function isInvalidDateFormat(value) {
      return moment(value, dateFormat).isValid(dateFormat) === false;
    },
    type: 'format'
  },
  {
    method: function isFutureDate(value) {
      return moment(value, dateFormat).isAfter(moment()) === true;
    },
    type: 'future'
  }
];

/*eslint no-unused-vars: 0*/
function validateDateField(value) {
  var type = _.result(_.find(validators, function findErrorType(validator) {
    return validator.method(value);
  }), 'type');

  if (type) {
    return new ErrorClass(this.dateKey, {
      key: this.dateKey,
      type: type,
      redirect: undefined
    });
  }
}

function isDateField(key) {
  return key.indexOf(this.dateKey) !== -1;
}

function isDateKey(key) {
  return key === this.dateKey;
}

function hasValue(req, key) {
  return _.identity(req.form.values[key]);
}

function doValidate(key, req) {
  return isDateKey.call(this, key) &&
    _.filter(_.keys(req.form.values), isDateField.bind(this)).some(hasValue.bind(null, req));
}

module.exports = class DateController extends Controller {
  constructor(options) {
    super(options);
  }

  validateField(keyToValidate, req, required) {

    if (typeof required !== 'boolean') {
      required = true;
    }

    if (required && isDateKey(keyToValidate)) {
      return this.validateDateField(req.form.values[keyToValidate]);
    }

    if (!required && doValidate(keyToValidate, req)) {
      return this.validateDateField(req.form.values[keyToValidate]);
    }

    return super.validateField(keyToValidate, req, required);

  }

  saveValues(req) {
    this.format(req);
    super.saveValues(req);
  }

  process(req, res, callback) {

    let dateParts = {};
    const keys = _.keys(req.form.values);

    _.each(keys, function eachValue(id) {

      const idParts = id.split('-');
      const name = idParts[idParts.length - 1];
      const value = req.form.values[id];

      if (value) {
        dateParts[name] = value;
      }
    });

    if (dateParts.day && dateParts.month && dateParts.year) {
      req.form.values[this.dateKey] = [dateParts.day, dateParts.month, dateParts.year].join('-');
    }

    callback();
  }

  format(req) {
    if (req.form.values[this.dateKey + '-day']) {
      const day = req.form.values[this.dateKey + '-day'];
      let month = req.form.values[this.dateKey + '-month'];
      const year = req.form.values[this.dateKey + '-year'];
      month = parseInt(month, 10) - 1;
      const formattedDate = moment([year, month, day]);
      req.form.values[this.dateKey + '-formatted'] = formattedDate.format(prettyDate);
    }
  }

};
