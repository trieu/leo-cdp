var express = require('express');
var morgan = require('morgan'); // logger
var assert = require('assert');
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var cookieParser = require('cookie-parser');// pull information from HTML cookies (express4)
var expressSession = require('express-session');

var app = express();

app.use('/public', express.static(__dirname + '/../public'));
app.use('/app', express.static(__dirname + '/../app'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(expressSession({
	secret: 'mySecretKey',
	resave: false,
	saveUninitialized: false
}));

app.use(morgan('dev'));

require('./configs/database.js');
//router
var routes = require('./configs/routes.js');
routes(app);

//listen port
app.listen(8181, function() {
  console.log('Angular app listening on port 8181');
});

