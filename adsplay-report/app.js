var fs = require('fs');
var express = require('express');
var app = express();
var expressHbs = require('express-handlebars');
var favicon = require('serve-favicon');

var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var cookieParser = require('cookie-parser');// pull information from HTML cookies (express4)
var expressSession = require('express-session');
var flash = require('connect-flash');


//______________ config enviroment common ______________
global.NODE_ENV = process.env.NODE_ENV || 'product'; //enviroment
console.log('Enviroment: ' + NODE_ENV)
var commonConfigs = require('./configs/common.js')(NODE_ENV);
global.siteConfigs = commonConfigs.siteConfigs;
global.authorizationConfigs = commonConfigs.authorizationConfigs;
//______________ config enviroment common ______________



//______________ config mongoose ______________
var dbConfigs = commonConfigs.dbConfigs;
var mongoose = require('mongoose');
mongoose.connect(dbConfigs.url);
//______________ config mongoose ______________



//______________ config express ______________
app.use(favicon(__dirname + '/public/css/images/favicon.ico'));
app.use(require('express-promise')());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(cookieParser());
app.use(expressSession({
	secret: 'adsplay123',
	resave: false,
	saveUninitialized: true,
	cookie :{ 
		path: '/', httpOnly: true, maxAge: 48*60*60*1000
	}
}));
app.use(flash());
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
app.use(morgan('dev'));  // log every request to the console

//config view engine
var hbsConfigs = {extname: 'hbs', defaultLayout: 'admin'};
app.engine('hbs', expressHbs(hbsConfigs));
app.set('view engine', 'hbs');
if(NODE_ENV == 'product'){
	//TODO enable cache for production only
	app.enable('view cache');
}

//______________ config express ______________



//______________ create folder ______________
var exportFolder = __dirname + '/public/export/';
if(!fs.existsSync(exportFolder)){
	fs.mkdirSync(exportFolder);
}

var folder = ['overlay','display','video'];
var adsFolder = __dirname + '/public/ads/';
if (!fs.existsSync(adsFolder)) {
	fs.mkdirSync(adsFolder);
}
else{
	for (var i = 0; i < folder.length; i++) {

		var dir = adsFolder+folder[i]+'/';

		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir); 
		}
	}
}
//______________ end create folder



//TODO
app.listen(8181);
//passport and router
require('./controllers/index.js')(app);