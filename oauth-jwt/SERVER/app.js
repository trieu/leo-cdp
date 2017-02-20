var express = require('express')
var bodyParser = require('body-parser')
var expressSession = require('express-session')
var app = express()

var path = require('path')
global.pathRoot = path.resolve(__dirname);

var Common = require('./server/configs/common')
var db = require('./server/configs/database')

/*
    //allow cross-origin
    var cors = require('cors')
    app.use(cors());
    //OTHER CASE
*/
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(expressSession({
    cookie: {
		path: '/', httpOnly: true, maxAge: Common.tokenExpiry
	},
    secret: Common.privateKey,
    resave: false,
	saveUninitialized: true,
}));
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public/')));

/** load routes*/
require('./server/routes')(app);

var port = Common.server.port;

app.listen(process.env.PORT || port);

console.log('App started on port ' + port);