var log4js = require('log4js');
var logs = require('../configs/logs.js');
log4js.configure(logs);
var error = log4js.getLogger('adsplaylog');
var debug = log4js.getLogger('adsplaylogdebug');
var ads = log4js.getLogger('ads');

module.exports = {
    error: error,
    debug: debug,
    ads: ads
}