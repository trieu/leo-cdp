var express = require('express')
    , router = express.Router()
    , Flight = require('../models/flight')
    , modelUtils = require('../helpers/model_utils')
    , constantUtils = require('../helpers/constant_utils')
    , moment = require('moment');
var dataUtils = require('../helpers/data_utils.js');    
var Sync = require('sync');    

var convert_data = function(doc){
	var obj = [];
	for(var i in doc){
		var schedules = [];
		var schArr = doc[i].schedules;
		for(var j = 0; j < schArr.length; j++){
			schedules.push({
				begin: moment(schArr[j].begin).format('YYYY-MM-DD, hh:mm A'),
				begin_hour: moment(schArr[j].begin).format('hh:mm A'),
				end: moment(schArr[j].end).format('YYYY-MM-DD, hh:mm A'),
				end_hour: moment(schArr[j].end).format('hh:mm A'),
				booking: schArr[j].booking
			});
		}
		obj.push({
			_id: doc[i]._id,
			name: doc[i].name,
			schedules: schedules
		});
	};
	return obj;
}


router.get('/', function (req, res, next) {
	var data = modelUtils.baseModel(req);
	data.statuses = constantUtils.statuses;
	data.dashboard_title = "Flight Management";

	var url = data.site.api_domain + '/api/creative/summary?begin=2015-05-01';

	Sync(function(){
		try{
			// result from callback
			var result = dataUtils.request.sync(null, url);
			data.ads = [];
			for(var i in result){
				data.ads.push({id: result[i].id, name: result[i].name});
			}
			res.render('flight/list', data);
		}

		catch (e) {
			console.error(e);
		}
	})
    
});

//find by id
router.get('/find/:id', function (req, res, next) {
	var data = modelUtils.baseModel(req);
	data.statuses = constantUtils.statuses;
	data.dashboard_title = "Flight Detail";
    
	Flight.findOne({_id: parseInt(req.params.id)}, function(err, doc){
		console.log(doc)
		if(doc == null){
			res.redirect('/flight');
		}
		else{
			data.flight = doc;
			res.render('flight/detail', data);
		}
		
	})
});
//select all
router.get('/find', function (req, res, next) {
	var data = modelUtils.baseModel(req);
	Flight.find({}, function(err, doc){
		if(err){
			return console.error(err);
		}
		var url = data.site.api_domain + '/api/creative/summary?begin=2015-05-01';

		Sync(function(){
			try{
				// result from callback
				var result = dataUtils.request.sync(null, url);
				var cdata = convert_data(doc);
				var obj = [];
				for(var i in result){
					for(var j in cdata){
						if(result[i].id == cdata[j]._id){
							obj.push({
								_id: cdata[j]._id,
								name: result[i].name,
								schedules: cdata[j].schedules
							});
						}

					}
				}
				res.json(obj);
			}

			catch (e) {
				console.error(e);
			}
		})
	})
});

//create
router.get('/create', function (req, res, next) {
var data = modelUtils.baseModel(req);
	data.statuses = constantUtils.statuses;
	data.dashboard_title = "New Flight";

	var url = data.site.api_domain + '/api/creative/summary?begin=2015-05-01';

	Sync(function(){
		try{
			// result from callback
			var result = dataUtils.request.sync(null, url);
			data.ads = [];
			for(var i in result){
				data.ads.push({id: result[i].id, name: result[i].name});
			}
			res.render('flight/create', data);
		}

		catch (e) {
			console.error(e);
		}
	})
});

router.post('/create', function (req, res, next) {
	var items = {};
	items = req.body;
	var obj = new flight(items);
	obj.save(function(err, obj){
		if(err){
			res.json({messege: false});
			return console.error(err);
		}
		console.log(obj);
		res.json({messege: true , data: obj});

	});
});

//update
router.get('/edit/:id', function (req, res, next) {
	var data = modelUtils.baseModel(req);

    data.dashboard_title = "Edit flight";
    data.statuses = constantUtils.statuses;

	Flight.findOne({_id: req.params.id}, function(err, doc){
		if(err){
			return console.error(err);
		}
		data.flight = convert_data([doc])[0];

		var url = data.site.api_domain + '/api/creative/summary?begin=2015-05-01';		
		Sync(function(){
			try{
				// result from callback
				var result = dataUtils.request.sync(null, url);
				data.ads = [];
				for(var i in result){
					data.ads.push({id: result[i].id, name: result[i].name});
				}
				res.render('flight/edit', data);
			}

			catch (e) {
				console.error(e);
			}
		});
	});
});

router.post('/edit/:id', function (req, res, next) {
	Flight.findOneAndUpdate({_id: req.params.id}, req.body, function(err, doc){

		if(err){
			return console.error(err);
		}
		res.redirect('/flight');
	});
});

module.exports = router;