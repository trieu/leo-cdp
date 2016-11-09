var express = require('express')
    , router = express.Router()
    , flight = require('../models/flight')
    , modelUtils = require('../helpers/model_utils')
    , constantUtils = require('../helpers/constant_utils')
    , moment = require('moment');
var dataUtils = require('../helpers/data_utils.js');    
var Sync = require('sync');    

router.get('/', function (req, res, next) {
	var data = modelUtils.baseModel(req);
	data.statuses = constantUtils.statuses;
	data.dashboard_title = "Flight list";

	var url = data.site.api_domain + '/api/creative/summary?begin=2016-05-01';

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

    
	flight.findOne({id: req.params.id}, function(err, doc){
		if(err){
			return console.error(err);
		}
		if(doc == null){
			res.render('flight/list', data);
		}
		else{
			
			data.flight = convert_data([doc])[0];
			res.render('flight/detail', data);
		}
		
	})
});
//select all
router.get('/find', function (req, res, next) {
	var begin = req.query.begin || moment().subtract(30, 'days').format("YYYY-MM-DD");
	var end = req.query.end || moment.add(30, 'days').format("YYYY-MM-DD");

	flight.find({begin: {$gte: begin}, end: {$lte: end}}, function(err, doc){
		if(err){
			return console.error(err);
		}
		res.json(convert_data(doc));
	})
});

//create
router.get('/create', function (req, res, next) {
var data = modelUtils.baseModel(req);
	data.statuses = constantUtils.statuses;
	data.dashboard_title = "Flight list";

	var url = data.site.api_domain + '/api/creative/summary?begin=2016-05-01';

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
	items.name = req.body.name;
	items.begin = req.body.begin_date +" "+ req.body.begin_time;
	items.end = req.body.end_date +" "+ req.body.end_time;
	items.status = 2;
	var obj = new flight(items);
	obj.save(function(err, obj){
		if(err){
			return console.error(err);
		}
		res.redirect('/flight');
	});
});

//update
router.get('/edit/:id', function (req, res, next) {
	var data = modelUtils.baseModel(req);

    data.dashboard_title = "Edit flight";
    data.statuses = constantUtils.statuses;

	flight.findOne({id: req.params.id}, function(err, doc){
		if(err){
			return console.error(err);
		}
		
		data.flight = doc;
		data.begin_time = moment(doc.begin).format('LT');
		data.end_time = moment(doc.end).format('LT');
		res.render('flight/edit', data);
	})
});

router.post('/edit/:id', function (req, res, next) {
	hourly_demo = [{view: 3101},{view: 2000}];

	var items = {};
	items.name = req.body.name;
	items.begin = req.body.begin_date +" "+ req.body.begin_time;
	items.end = req.body.end_date +" "+ req.body.end_time;
	items.status = req.body.status;
	items.hourly = hourly_demo;
	items.view = sumView(items.hourly);

	flight.findOneAndUpdate({id: req.params.id}, items, function(err, doc){

		if(err){
			return console.error(err);
		}
		res.redirect('/flight');
	});
});

var sumView = function(hourly){
	var count = 0;
	if(typeof (hourly) != 'undefined' && hourly != null){
		for(var i in hourly){
			count += hourly[i].view;
		}
	}
	return count;
}

//delete
// router.post('/delete/:id', function (req, res, next) {
// 	flight.findOneAndRemove({id: req.params.id}, function(err, doc){
// 		if(err){
// 			return console.error(err);
// 		}
// 		res.sendStatus(200);
// 	});
// });

module.exports = router;