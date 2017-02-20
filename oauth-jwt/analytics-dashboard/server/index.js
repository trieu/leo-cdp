global.NODE_ENV = process.env.NODE_ENV || 'prod'; //enviroment
var commonConfigs = require('./configs/common.js')(NODE_ENV);
global.SALT = commonConfigs.SALT;



/************************
	requirement
*/
var favicon = require('serve-favicon');
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var cookieParser = require('cookie-parser');// pull information from HTML cookies (express4)
var expressSession = require('express-session');
var express = require('express');
var app = express();



/************************
	config webpack
*/
if(NODE_ENV == "dev"){
	console.log('webpack')
	var webpack = require('webpack');
	var webpackConfig = require('../webpack.config.js');
	var compiler = webpack(webpackConfig);
	app.use(require('webpack-dev-middleware')(compiler, webpackConfig.devServer));
	//app.use(require('webpack-hot-middleware')(compiler));
}



/************************
	config app express
*/
app.use(favicon(__dirname + '/../public/img/favicon.ico'));
app.use('/public', express.static(__dirname + '/../public'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(expressSession({
	secret: commonConfigs.SALT,
	resave: false,
	saveUninitialized: false
}));
//app.use(morgan('dev'));
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);




/************************
	config mongoose
*/
var mongoose = require('mongoose');
mongoose.connect(commonConfigs.dbUrl);


//all routes
var routes = require('./configs/routes.js');
routes(app);

//listen port
app.listen(commonConfigs.port, function() {
console.log('React app listening on port '+ commonConfigs.port);
});



