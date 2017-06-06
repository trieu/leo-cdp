global.NODE = require('./configs/env.js')(process.env);
console.log(global.NODE)
console.log('*******************');
console.log('******** Enviroment '+ NODE.ENV);
console.log('*******************','\n');

var Common = require('./configs/common.js');

var webpack = require('webpack');
var path = require('path');
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var cookieParser = require('cookie-parser');// pull information from HTML cookies (express4)
var expressSession = require('express-session');
var express = require('express');

var app = express();
app.use('/', express.static(__dirname + '/public'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser(Common.SALT));
app.use(expressSession({
	secret: Common.SALT,
	resave: false,
	saveUninitialized: false,
	cookie :{ 
		path: '/', httpOnly: true, maxAge: Common.session
	}
}));


if(NODE.ENV == 'dev'){
    console.log('\x1b[33m', '                -> webpack: Running... <-', '\n', '\x1b[0m');
	var webpackConfig = require('./webpack.config.dev.js');
	var compiler = webpack(webpackConfig);
	app.use(require('webpack-dev-middleware')(compiler, webpackConfig.devServer));
	app.use(require('webpack-hot-middleware')(compiler ,{
        'log': false, 
        'path': '/__webpack_hmr', 
        'heartbeat': 10 * 1000
    }));    
}
else{
    var webpackConfig = require('./webpack.config.js');
	var compiler = webpack(webpackConfig);
}

//all routes
var routes = require('./server/routes.js')(app);

//listen port
app.listen(NODE.PORT, function(err) {
    if (err) {
        console.log(err);
        return;
    }
	console.log('*******************');
    console.log('App listening on port '+ NODE.PORT);
	console.log('*******************','\n');
});