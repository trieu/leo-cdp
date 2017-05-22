var log4js = require('log4js');
var logs = require('../configs/logs.js');
log4js.configure(logs);
var logger = log4js.getLogger('adsplaylog');

module.exports = logger;