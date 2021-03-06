'use strict';

const express = require('express');
const app = express();
const path = require('path');
const logger = require('./so-forms').logger;
const churchill = require('churchill');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis-crypto')(session);
const config = require('./config');
const servestatic = require('serve-static');

require('moment-business');

global.__base = path.join(__dirname, '/');

if (config.env !== 'ci') {
  app.use(churchill(logger));
}
if (config.env === 'development' || config.env === 'so-ci' || config.env === 'ci-build') {
  app.use('/public', express.static(path.resolve(__dirname, './public')));
}

app.use(function injectLocals(req, res, next) {
  req.baseUrl = config.siteroot + req.baseUrl;
  res.locals.assetPath = config.siteroot + '/public';
  res.locals.gaTagId = config.ga.tagId;
  next();
});

app.set('view engine', 'html');

const hofTemplate = require('hmpo-govuk-template');
hofTemplate.setup(app, {
  path: config.siteroot + '/govuk-assets'
});

app.use('/govuk-assets', servestatic(hofTemplate.assetPath));

app.set('views', path.resolve(__dirname, './so-forms/views'));
app.enable('view cache');
app.use(require('express-partial-templates')(app));
app.engine('html', require('hogan-express-strict'));

app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('body-parser').json());

app.use(function setBaseUrl(req, res, next) {
  res.locals.baseUrl = req.baseUrl;
  next();
});

/*************************************/
/******* Redis session storage *******/
/*************************************/

logger.info('connecting to redis on ', config.redis.port, config.redis.host);

var client = redis.createClient(config.redis.port, config.redis.host);

client.on('error', function clientErrorHandler(e) {
  throw e;
});

var redisStore = new RedisStore({
  client,
  ttl: config.session.ttl,
  secret: config.session.secret
});

function secureCookies(req, res, next) {
  var cookie = res.cookie.bind(res);
  res.cookie = function cookieHandler(name, value, options) {
    options = options || {};
    options.secure = (req.protocol === 'https');
    options.httpOnly = true;
    options.path = '/';
    cookie(name, value, options);
  };
  next();
}

app.use(require('cookie-parser')(config.session.secret));
app.use(secureCookies);

function initSession(req, res, next) {
  session({
    store: redisStore,
    cookie: {
      secure: (req.protocol === 'https')
    },
    key: 'hmbrp.sid',
    secret: config.session.secret,
    resave: true,
    saveUninitialized: true
  })(req, res, next);
}
app.use(initSession);

// apps
app.use(require('./apps/rtm/'));

// errors
app.use(require('./so-forms').errors);

/*eslint camelcase: 0*/
app.listen(config.port, config.listen_host);
/*eslint camelcase: 1*/
logger.info('App listening on port', config.port);
