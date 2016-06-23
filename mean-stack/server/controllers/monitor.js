var Sync = require('sync');
var site = require('../configs/site.js');
var req_utils = require('../helpers/request_utils.js');

module.exports = function(app) {

	app.get('/api/monitor/content', function(req, res, next) {

		var begin = req.query.begin;
		var end = req.query.end;

		result = [
			{label:'Thể thao', value : 454233},
			{label:'Live TV', value : 325545},
			{label:'Phim lẻ', value : 234534},
			{label:'Phim bộ', value : 233355},
			{label:'TV Show', value : 45954}
		];
		
		Sync(function(){
			// result from callback
			res.json(result);
		})
	});
};