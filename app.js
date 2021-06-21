
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var logger = require('morgan');
var i18n = require('i18n');
var mysql = require('mysql');


var indexRouter = require('./routes/index');
var hodRouter = require('./routes/hod');


var db = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '6332',
	database : 'projectgrader'
});

db.connect((err) => {
	if (err) {
		throw err;
	}

	console.log('mysql connected');
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

i18n.configure({
  locales: ['en'],
  directory: path.join(__dirname, '/locales')
});

app.use(i18n.init);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret: "abcdefghijklmnopqrstuvwxyz",
	resave : false,
	saveUninitialized : false
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/hod', hodRouter);

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





