'use strict';

var toolkit = require('hmpo-frontend-toolkit');
var helpers = toolkit.helpers;
var progressiveReveal = toolkit.progressiveReveal;
var formFocus = toolkit.formFocus;

helpers.documentReady(progressiveReveal);
helpers.documentReady(formFocus);

