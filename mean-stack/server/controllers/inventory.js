var Sync = require('sync');
var site = require('../configs/site.js');
var req_utils = require('../helpers/request_utils.js');

module.exports = function(app) {

	app.get('/api/inventory/paytv', function(req, res, next) {

		var begin = req.query.begin;
		var end = req.query.end;

		var url = "http://fbox-onetv.fpt.vn/OneTVWS.ashx?method=ITVad_TotalView&begintime="+begin+"&endtime="+end;
		
		Sync(function(){
			// result from callback
			var result = req_utils.get.sync(null, url);
			res.json(result);
		})
	});
};