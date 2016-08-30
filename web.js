var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engine = require('ejs-locals');
var Session = require('express-session');
var config = require('./helper/config.js');

var CookiePaser = cookieParser(config.secretKey);

var passport = require('./helper/passport.js').passport;

var session = new Session({
	//store: sessionStore,
	cookie:{
		maxAge: 1000 * 60 * 60,
		 secure: false 
	},
	key : config.sessionKey,
	resave : false,
    saveUninitialized : false,
    secret: config.secretKey
});


var app = express();

app.set('port', 8001);
app.listen(app.get('port'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(CookiePaser);
app.use(session);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));


exports.passport = passport;

app.engine('ejs' , engine);

var routes = require('./routes/index');
var login = require('./routes/login');
var signUp = require('./routes/signUp');
var board = require('./routes/board');
var members = require('./routes/members');
var about = require('./routes/about');
var act = require('./routes/activity');
var recruit = require('./routes/recruit');
var contact = require('./routes/contact');
var logout = require('./routes/logout');
var boardUnauthor = require('./routes/unAuthor');


function ensureAuthenticated(req, res, next) {
    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
    if (req.isAuthenticated()) { return next(); }
    // 로그인이 안되어 있으면, login 페이지로 진행
    res.redirect('/login');
}

app.use('/board', boardUnauthor);
app.use('/', routes);
app.use('/login', login);
app.use('/signUp', signUp);
app.use('/board' ,ensureAuthenticated , board);
app.use('/members' , members);
app.use('/about' , about);
app.use('/activity', act);
app.use('/recruit', recruit);
app.use('/contact', contact);
app.use('/logout' , ensureAuthenticated ,logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
