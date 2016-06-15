var Sync = require('sync');
var site = require('../configs/site.js');
var req_utils = require('../helpers/request_utils.js');
var creativeModel = require('../models/creative.js');

module.exports = function(app) {

	app.get('/creative/api', function(req, res, next) {

		var url = site.api_domain + '/api/creative/summary/';
		
		Sync(function(){
			// result from callback
			var result = creativeModel.list.sync(null, url, req.user);
			res.json(result);
		})
	});
};