global.NODE = require('./configs/env.js')(process.env);
console.log(global.NODE)
console.log('*******************');
console.log('******** Enviroment '+ NODE.ENV);
console.log('*******************','\n');

var webpack = require('webpack');
var path = require('path');
var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/public'));


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