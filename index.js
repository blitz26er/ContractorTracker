var path = require('path');
var express = require('express');
var app = express();
// var session = require('express-session');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var http = require('http');
var jwt = require('jsonwebtoken');
var config = require('./config');

// ==================================================================
// Configuration 
// ==================================================================
app.set('http_port', (process.env.PORT || config.http_port)); // configuration port
mongoose.connect(config.database);		// connect to database

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname,'/public'))); // public path

// use for rendering template
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// session configuration
// app.use(cookieParser('notsosecretkey'));
// app.use(session({
//     resave: true,
//     saveUninitialized: true,
//     secret: "notsosecretkey",
// }));

// allow cross domain
app.use(function(req, res, next) {
  	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "access_token, Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// ==================================================================
// Routes
// ==================================================================
app.use('/signing', require('./routes/signing'));       // signing
app.use('/protected', require('./routes/validate'));    // user validation
app.use('/protected', require('./routes/company'));     // company manager
app.use('/protected', require('./routes/home'));        // home
app.use('/protected', require('./routes/user'));
app.get('/', function(req, res) {
	res.render('index');
});

app.listen(app.get('http_port'), function() {
  	console.log('Node app is running on port', app.get('http_port'));
});
