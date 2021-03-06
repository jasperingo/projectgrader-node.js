
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var dotevn = require('dotenv').config();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var logger = require('morgan');
var i18n = require('i18n');
var { db } = require('./database/db');
var MySQLStore = require('express-mysql-session')(session);


var sessionStore = new MySQLStore({}, db);

var indexRouter = require('./routes/index');
var hodRouter = require('./routes/hod');
var isRouter = require('./routes/is');
var esRouter = require('./routes/es');
var projectRouter = require('./routes/project');
var adminRouter = require('./routes/admin');


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

i18n.configure({
  locales: ['en'],
  directory: path.join(__dirname, '/locales'),
  defaultLocale: 'en',
  updateFiles: false,
  objectNotation: true,
  autoReload: true,
});

app.use(i18n.init);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  name: 'projectgrader-sid',
	secret: "abcdefghijklmnopqrstuvwxyz",
  store: sessionStore,
	resave: false,
	saveUninitialized: false
}));

app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/hod', hodRouter);
app.use('/is', isRouter);
app.use('/es', esRouter);
app.use('/project', projectRouter);
app.use('/admin', adminRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;




