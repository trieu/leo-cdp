var Sync = require('sync');
var site = require('../configs/site.js');
var req_utils = require('../helpers/request_utils.js');
var creativeModel = require('../models/creative.js');

module.exports = function(app) {

	app.get('/api/creative', function(req, res, next) {

		var url = site.api_domain + '/api/creative/summary/';
		
		Sync(function(){
			// result from callback
			var result = creativeModel.list.sync(null, url, req.user);
			res.json(result);
		})
	});

	app.get('/api/creative/summary', function(req, res, next) {

		var begin = req.query.begin;
		var end = req.query.end;

		var url = site.api_domain + '/api/adstats?begin='+begin+'&end='+end;
		
		Sync(function(){
			// result from callback
			var result = req_utils.get.sync(null, url);
			res.json(result);
		})
	});
};