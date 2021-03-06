var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./moduli/db');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var routes = require('./routes/index.js');
var login_routes = require('./routes/login.js');
var stats_routes = require('./routes/stats');
var list_routes = require('./routes/list');
var donation_routes = require('./routes/donations');
var admin_routes = require('./routes/admin');
var statistics_routes = require('./routes/statistic');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*	host : 'localhost',
	user : 'uporabnik',
	password : 'uporabnik',
	database : 'me_logger',
	checkExpirationInterval: 3600000,
	createDatabaseTable : true,
	schema :{
		tableName : 'seja',
		columnNames : {
			session_id : 'session_id',
			expires : 'expires',
			data : 'data'
		}
	}*/

var sesStore = new MySQLStore({}, db);

app.use(session({
	secret : "PERICAREZERACIREP",
	name : "Me logger site",
	saveUninitialized : true,
	resave : true,
	store : sesStore,
	cookie : {
		maxAge : 3600000
	}
}));

app.use('/', routes);
app.use('/login', login_routes);
app.use('/stats', stats_routes);
app.use('/list', list_routes);
app.use('/donations', donation_routes);
app.use('/admin', admin_routes);
app.use('/statistic', statistics_routes);

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
		if(!req.session.user){
			res.redirect('/login');
			return;
		}
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err,
			prod: false,
			user : req.session.user
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	if(!req.session.user){
		res.redirect('/login');
		return;
	}
	res.status(err.status || 500);
	res.render('error', {
		message: err.status + " " + err.message,
		error: {},
		prod : true,
		user : req.session.user
	});
});




module.exports = app;
