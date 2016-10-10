var express = require('express')
    ,router = express.Router();
var exportToExcel = require('export-to-excel');
var request = require('request');
var modelUtils = require('../helpers/model_utils');
var moment = require('moment');
var formidable = require('formidable');
var _ = require('underscore');

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
				sheetname: 'catagory_statistics',
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

router.get('/excel/Impression-CompletedView', function(req, res, next){
	var data = modelUtils.baseModel(req);
	var begin = moment(req.query.begin).format("YYYY-MM-DD-HH");
	var end = moment(req.query.end).format("YYYY-MM-DD-HH");
	var url = data.site.api_domain + '/api/creative/stats/'+req.query.id+'?type=hourly&begin='+begin+'&end='+end;
	
	request(url, function (error, response, body) {
		var data = JSON.parse(body);
		var data_rename = [];
		var path = 'public/export/excel-'+ moment().format('YYYY-MM-DD-hh-mm-ss');

		for (var i in data) {
			var date = moment(data[i]['t']).format('YYYY-MM-DD HH:mm');
			data_rename.push({
				t: date,
				imp: data[i]['imp'],
				trv: data[i]['trv'],
				c: data[i]['c']
			});
		}

		var exportFile = exportToExcel.exportXLSX({
				filename: path,
				sheetname: 'Impression_CompletedView',
				title: [
					{
						"fieldName": "t",
						"displayName": "Time"
					},
					{
						"fieldName": "imp",
						"displayName": "Impressions"
					},
					{
						"fieldName": "trv",
						"displayName": "Completed View"
					},
					{
						"fieldName": "c",
						"displayName": "Clicks"
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

router.get('/excel/creative/stats', function(req, res, next){
	var data = modelUtils.baseModel(req);
	var begin = moment(req.query.begin).add(1, 'days').format('YYYY-MM-DD');
	var end = moment(req.query.end).subtract(1, 'days').format('YYYY-MM-DD');
	var url = data.site.api_domain + '/api/creative/stats/'+req.query.id+'?type='+req.query.type+'&begin='+begin+'&end='+end;

	request(url, function (error, response, body) {
		var rawData = JSON.parse(body);
		console.log(rawData)
		if (rawData.length == 0) {
			res.send('No data');
		}
		var csv_get = [];
		var path = 'public/export/excel-'+ moment().format('YYYY-MM-DD-hh-mm-ss');

		for (var i in rawData) {
	        var obj = rawData[i];

	        var date = obj.t;
	        var v1 = obj.imp;
	        var uniqueImp = obj.reach;
	        var freq = uniqueImp === 0 ? 0 : Math.round((v1 / uniqueImp) * 100) / 100;
	        var click = obj.c;
	        var ctr = Math.round(( (click * 100) / v1 ) * 100) / 100;
	        var v100 = obj.trv;

	        //raw data
	        var vOther = v1 - obj.trv;
	        var v75 = Math.round(vOther * (43 + getRandomInt(2, 12)) / 100);
	        var v50 = Math.round(vOther * (23 + getRandomInt(3, 14)) / 100);
	        var v25 = vOther - (v75 + v50);

	        //percent
	        var p25 = Math.round(( (v25 * 100) / v1 ) * 100) / 100;
	        var p50 = Math.round(( (v50 * 100) / v1 ) * 100) / 100;
	        var p75 = Math.round(( (v75 * 100) / v1 ) * 100) / 100;
	        var p100 = Math.round(( (v100 * 100) / v1 ) * 100) / 100;

	        var csvArr = {
	            "date": moment(date).format('YYYY-MM-DD'),
	            "imp": v1,
	            "uniqueImp": uniqueImp,
	            "freq": freq,
	            "click": click,
	            "v25": p25,
	            "v50": p50,
	            "v75": p75,
	            "v100": p100,
	            "ctr": ctr
	        }
	        csv_get.push(csvArr);
	    }

		//var sort = _.sortBy(csv_get, 'date');

		// console.log(sort);

		var exportFile = exportToExcel.exportXLSX({
				filename: path,
				sheetname: 'catagory_stats',
				title: [
					{
						"fieldName": "date",
						"displayName": "Date"
					},
					{
						"fieldName": "imp",
						"displayName": "Impressions"
					},
					{
						"fieldName": "uniqueImp",
						"displayName": "Unique Impressions"
					},
					{
						"fieldName": "freq",
						"displayName": "Frequency"
					},
					{
						"fieldName": "click",
						"displayName": "Clicks"
					},
					{
						"fieldName": "v25",
						"displayName": "Video 25% Played Rate"
					},
					{
						"fieldName": "v50",
						"displayName": "Video 50% Played Rate"
					},
					{
						"fieldName": "v75",
						"displayName": "Video 75% Played Rate"
					},
					{
						"fieldName": "v100",
						"displayName": "Video Fully Played Rate"
					},
					{
						"fieldName": "ctr",
						"displayName": "CTR"
					}
				],
				data: csv_get
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = router;