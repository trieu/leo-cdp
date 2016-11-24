var express = require('express');
var Facebook = require('facebook-node-sdk');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');// pull information from HTML cookies (express4)
var expressSession = require('express-session');
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(expressSession({ secret: 'foo bar' }));
app.use(Facebook.middleware({ appId: '1223675781032708', secret: '487535b5c9c92b5c4b5654b4529019f4' }));

app.get('/', Facebook.loginRequired(), function (req, res) {
  req.facebook.api('/me', function(err, user) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello, ' + user.name + '!');
  });
});

app.listen(3000);