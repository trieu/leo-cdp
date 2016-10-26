var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

var path = require('path');
global.__rootPath = path.resolve(__dirname);
global.__publicPath = path.resolve(__dirname)+'/public/';

module.exports = require('./app/video_kue');