var site = require('../configs/site.js');
var creativeModel = require('../models/creative.js');

module.exports = function(app) {
	
	var _list = function(req, res, next) {

		var data = creativeModel.list(site.api_domain + '/api/creative/summary/');
		console.log('1');
		res.json(data);

	};

	app.get('/creative/api', _list);
};