var path = require('path');
var express = require('express');
var app = express();
var session = require('express-session');
var cookieParser = require('cookie-parser');
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
app.use(cookieParser('notsosecretkey'));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "notsosecretkey",
}));

// ==================================================================
// Routes
// ==================================================================
app.get('/', function(request, response) {
  	response.render('login');
});

app.listen(app.get('http_port'), function() {
  	console.log('Node app is running on port', app.get('http_port'));
});


