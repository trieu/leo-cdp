var express = require('express');
var morgan = require('morgan'); // logger
var assert = require('assert');
var bodyParser = require('body-parser');

var app = express();

app.use('/public', express.static(__dirname + '/../public'));
app.use('/app', express.static(__dirname + '/../app'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

require('./configs/database.js');
//router
var routes = require('./configs/routes.js');
routes(app);

//listen port
app.listen(3000, function() {
  console.log('Angular app listening on port 3000');
});

