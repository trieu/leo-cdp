var fs = require('fs');
var express = require('express');
var app = express();
var expressHbs = require('express-handlebars');
var favicon = require('serve-favicon');

var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var cookieParser = require('cookie-parser');// pull information from HTML cookies (express4)
var expressSession = require('express-session');
var flash = require('connect-flash');


global.siteConfigs = require('./configs/site-product.js');
var dbConfig = require('./configs/database');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);

app.use(favicon(__dirname + '/public/css/images/favicon.ico'));
app.use(require('express-promise')());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(multer({ dest: './uploads/'}));
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


//config view engine
//admin.hbs or admin-product.hbs
var layout = 'admin-product.hbs';
var hbsConfigs = {extname: 'hbs', defaultLayout: layout};
app.engine('hbs', expressHbs(hbsConfigs));
app.set('view engine', 'hbs');

//app.enable('view cache');// enable cache for production only


//++++++++create folder
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
//++++++++end create folder

//TODO
app.listen(8181);
//passport and router
require('./controllers/index-product.js')(app);
