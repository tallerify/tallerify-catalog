/**
 * Load env file
 */
require('dotenv').config();

// *** main dependencies *** //
const express = require('express');
const path = require('path');
const logger = require('./utils/logger');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const ejs = require('ejs');
const expressJwt = require('express-jwt');
const pathToRegexp = require('path-to-regexp');
const config = require('./config');

// *** routes *** //
const routes = require('./routes/index.js');

// *** express instance *** //
const app = express();

// *** view engine *** //
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '../public'));

// *** static directory *** //
app.use(express.static(path.join(__dirname, '../dist')));

// *** config middleware *** //
app.use(morgan('combined', { stream: logger.stream }));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// *** jwt secret *** //
const unprotectedRoutes = (req) => {
  let baseRE = pathToRegexp('/');
  let tokensRE = pathToRegexp('/api/tokens');
  let adminTokensRE = pathToRegexp('/api/admins/tokens');
  let usersRE = pathToRegexp('/api/users');
  let userRE = pathToRegexp('/api/users/:id');
  let usersMeRE = pathToRegexp('/api/users/me');
  let usersMediaRE = pathToRegexp('/media/*');

  if (usersMeRE.exec(req.path)) {
    return false;
  }
  if (baseRE.exec(req.path) || usersMediaRE.exec(req.path) || tokensRE.exec(req.path) || adminTokensRE.exec(req.path)) {
    return true;
  }
  if ((usersRE.exec(req.path) && req.method === 'POST') || (userRE.exec(req.path) && req.method === 'PUT')) {
    return true;
  }
  return false;
};
app.use(expressJwt({ secret: config.secret }).unless(unprotectedRoutes));
app.set('secret', config.secret);

// *** main routes *** //
app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// *** error handlers *** //

// development and test error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    code: err.status,
    message: err.message,
  });
});


module.exports = app;
