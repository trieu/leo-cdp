var express = require('express')
var router = express.Router();
var Sync = require('sync');
var site = require('../configs/site.js');
var dataUtils = require('../helpers/data_utils.js');
var modelUtils = require('../helpers/model_utils');
var constantUtils = require('../helpers/constant_utils');
var creativeModel = require('../models/creative.js');
var ArrayUtils = require('../helpers/array_utils');
var moment = require('moment');
var formidable = require('formidable');

// >->->->-> api

//--- list json
router.get('/api/list', function (req, res) {
	var data = modelUtils.baseModel(req);

	data.begin = req.query.begin;
    data.end = req.query.end;
    if (!data.begin || !data.end) {
        data.begin = new moment().format("YYYY-MM-DD");
        data.end = new moment().subtract(60, 'days').format("YYYY-MM-DD");
    }
	var url = data.site.api_domain + '/api/creative/summary?begin='+data.begin+'&end='+data.end;

	Sync(function(){
		try{
			// result from callback
			var result = creativeModel.list.sync(null, url, data);
			//console.log(result);
			res.json(result);
		}

		catch (e) {
			console.error(e);
		}
	})
});

// <-<-<-<-< end api



// >->->->->  crud

//--- list page
router.get('/list', function (req, res) {
    var data = modelUtils.baseModel(req);

    data.dashboard_title = "All Advertising Units";
    data.statuses = constantUtils.statuses;
    data.adTypes = constantUtils.adTypes;
    var statuses = [];
    for (var stt in constantUtils.statuses) {
        statuses.push({value: stt, label: constantUtils.getStatus(stt)});
    }
    data.statuses = statuses;
    console.log("_______________")
    console.log(data.adTypes)
    res.render('creative/list', data);

});


//--- create page
router.get('/new', function (req, res) {
	var data = modelUtils.baseModel(req);
	data.dashboard_title = "New Creative";
	res.render('creative/new', data);
});


//--- create page type
router.get('/new/:typeId', function (req, res) {
	var data = modelUtils.baseModel(req);

	data.dashboard_title = "New Ad Unit: " + constantUtils.getAdType(req.params.typeId);
	data.fptplayCategories = ArrayUtils.concatUnique(constantUtils.getFemaleKeywords().concat(constantUtils.getMaleKeywords()));
	data.locationCodes = constantUtils.getLocationCodes().Location;
	data.adsSize = constantUtils.size_display;
	data.payTVCategories = constantUtils.getPayTVCategories();

	var page = 'creative/new-'+req.params.typeId;

	console.log(constantUtils.getAdType(req.params.typeId));
	if(req.params.typeId == "video-paytv"){
		data.dashboard_title = "New Video Ad Unit - PayTV";
		data.locationCodes = constantUtils.getLocationCodes().Area;
		res.render('creative/new-video-paytv', data);
	}
	else if(constantUtils.getAdType(req.params.typeId)){
		res.render(page, data);
	}
	else{
		data.dashboard_title = "New Ad Unit";
		res.render('creative/new', data);
	}
});


//--- edit page
router.get('/edit/:id', function (req, res) {
	var data = modelUtils.baseModel(req);
	var url = data.site.api_domain + '/api/creatives/' + req.params.id;
	data.dashboard_title = "Edit Ad Unit";
	data.fptplayCategories = ArrayUtils.concatUnique(constantUtils.getFemaleKeywords().concat(constantUtils.getMaleKeywords()));
	data.locationCodes = constantUtils.getLocationCodes().Location;
	data.adsSize = constantUtils.size_display;
	data.payTVCategories = constantUtils.getPayTVCategories();

	Sync(function(){
		try{
			// result from callback
			result = creativeModel.edit.sync(null, url, data);

			//page paytv edit
			if (result.crt && result.crt.adType && result.crt.name && result.crt.tgpfs == 6){
				data.locationCodes = constantUtils.getLocationCodes().Area;
				res.render('creative/new-video-paytv', result);
			}
			else if (result.crt && result.crt.adType && result.crt.name) {
				res.render('creative/new-' + result.crt.adType, result);
			} else {
				data.errorMessage = 'Not data for creative id:' + result.crt.id;
				res.render('common/system-error', result);
			}
		}

		catch (e) {
			console.error(e);
		}

	})
});


//--- details page id
router.get('/:id', function (req, res) {
	var data = modelUtils.baseModel(req);
	data.dashboard_title = "Detail Creative";
	var url = data.site.api_domain + '/api/creatives/' + req.params.id;

	Sync(function(){
		try{
			// result from callback
			result = creativeModel.detail.sync(null, url, data);

			if (result.crt && result.crt.adType && result.crt.name) {
				res.render('creative/detail-' + result.crt.adType, result)
			} else {
				data.errorMessage = 'Not data for creative id:' + result.crt.id;
				res.render('common/system-error', result)
			}
		}

		catch (e) {
			console.error(e);
		}

	});
});

//--- save
router.post('/save/:adType', function (req, res) {
	var data = modelUtils.baseModel(req);
	var url = data.site.api_domain + '/creative/save/json';

	var form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		if (err) {
			console.error(err);
		}
		else {
			// console.log(files);
			// console.log(fields);
			// permission isAdminGroup {1000: 1, 1001: 1};
			// permission editable {1000: 1, 1001: 1, 1007: 1, 1003: 1, 1006: 1};
			if(data.editable){
				var option = {
					url: url,
					user: req.user,
					adType: req.params.adType,
					fields: fields,
					files: files,
				}
				creativeModel.save(option, res);
			}
			else{
				res.render('common/permission');
			}
		}
	});
});

//--- update
router.post('/:id/update', function (req, res) {
    var data = modelUtils.baseModel(req);
    var id = req.params.id || -1;
    var url = data.site.api_domain + '/api/creatives/' + id;

    if (data.editable) {
    	var body = req.body;
        creativeModel.update(url, body, res);
    } else {
        res.json({message: 'error'});
    }
});

// <-<-<-<-< end crud



// >->->->->  other page
router.get('/visualize/metrics', function (req, res) {
	var data = modelUtils.baseModel(req);
	data.dashboard_title = "Daily Ad Reports";

	var url = data.site.api_domain + '/api/creative/summary';

	Sync(function(){
		// result from callback
		result = creativeModel.metrics.sync(null, url, data);
		res.render('ad-report/creative-metrics-all', data);
	});
});

module.exports = router;