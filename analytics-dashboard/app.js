/************
enviroment common
************/
global.NODE_ENV = process.env.NODE_ENV || 'prod';
console.log('******** Enviroment '+ NODE_ENV +' ********');
/************
enviroment common
************/

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var cookieParser = require('cookie-parser');// pull information from HTML cookies (express4)
var expressSession = require('express-session');
var app = express();


/************
config webpack
************/
console.log(NODE_ENV);
if(NODE_ENV == "dev"){
	console.log('webpack')
	var webpack = require('webpack');
	var webpackConfig = require('./webpack.config.js');
	var compiler = webpack(webpackConfig);
	app.use(require('webpack-dev-middleware')(compiler, webpackConfig.devServer));
	//app.use(require('webpack-hot-middleware')(compiler));
}
/************
config webpack
************/


/************
config app express
************/
app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use('/public', express.static(__dirname + '/public'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(expressSession({
	secret: 'mySecretKey',
	resave: false,
	saveUninitialized: false
}));
//app.use(morgan('dev'));
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);

/************
config app express
************/

//all routes
var routes = require('./server/configs/routes.js');
routes(app);

//listen port
app.listen(3000, function() {
  console.log('Angular app listening on port 3000');
});


