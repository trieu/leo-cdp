var express = require('express')
    ,router = express.Router();
var exportToExcel = require('export-to-excel');
var request = require('request');
var modelUtils = require('../helpers/model_utils');
var moment = require('moment');

router.get('/excel/statistics', function(req, res, next){
	var data = modelUtils.baseModel(req);
	var url = data.site.api_domain + '/api/adstats?begin='+req.query.begin+'&end='+req.query.end;

	request(url, function (error, response, body) {
		var data = JSON.parse(body);
		var data_rename = [];
		var path = 'public/export/excel-'+ moment().format('YYYY-MM-DD-hh-mm-ss');

		for (var i in data) {
			var date = moment(data[i]['period']).format('YYYY-MM-DD');
			data_rename.push({
				period: date,
				Total_Play_View: data[i]['totalPv'],
				Total_Impression: data[i]['totalImp'],
				Total_Completed_View: data[i]['totalTrv'],
				Total_Click: data[i]['totalClick']
			});
		}

		//console.log(data_rename)
		var exportFile = exportToExcel.exportXLSX({
				filename: path,
				sheetname: 'catagory_name',
					title: [
						{
							"fieldName": "period",
							"displayName": "Date"
						},
						{
							"fieldName": "Total_Play_View",
							"displayName": "Total PlayView"
						},
						{
							"fieldName": "Total_Impression",
							"displayName": "Total Impression"
						},
						{
							"fieldName": "Total_Completed_View",
							"displayName": "Total Completed-View"
						},
						{
							"fieldName": "Total_Click",
							"displayName": "Total Click"
						}
					],
				data: data_rename
			});

		res.download(exportFile, function(err){
			if (err) {
				console.log(err);
			} else {
				console.log('Success ! Send download ' + exportFile);
			}
		});

	});
});

module.exports = router;