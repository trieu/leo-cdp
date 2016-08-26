var express = require('express')
    , router = express.Router()
    , Event = require('../models/event')
    , modelUtils = require('../helpers/model_utils')
    , constantUtils = require('../helpers/constant_utils')
    , moment = require('moment');

var convert_data = function(doc){
	var statuses = {0: 'Invalid', 1: 'Pending', 2: 'Running', 3: 'Finished', 4: 'Expired'};
	var obj = [];
	for(var i in doc){
		obj.push({
			id: doc[i].id,
			name: doc[i].name,
			view: doc[i].view,
			status: statuses[doc[i].status],
			begin: moment(doc[i].begin).format('YYYY-MM-DD, hh:mm:ss A'),
			end: moment(doc[i].end).format('YYYY-MM-DD, hh:mm:ss A')
		});
	};
	return obj;
}

router.get('/', function (req, res, next) {
	var data = modelUtils.baseModel(req);
	data.statuses = constantUtils.statuses;
	console.log(data.statuses[1])
    data.dashboard_title = "Event list";
    res.render('event/list', data);
});

//select all
router.get('/find', function (req, res, next) {
	var begin = req.query.begin || moment().add(1, 'days').format("YYYY-MM-DD");
	var end = req.query.end || moment.add(30, 'days').format("YYYY-MM-DD");

	Event.find({begin: {$gte: begin}, end: {$lte: end}}, function(err, doc){
		if(err){
			return console.error(err);
		}
		res.json(convert_data(doc));
	})
});
//find by id
router.get('/find/:id', function (req, res, next) {
	Event.findOne({id: req.params.id}, function(err, doc){
		if(err){
			return console.error(err);
		}
		res.json(convert_data(doc));
	})
});


//create
router.get('/create', function (req, res, next) {
	var data = modelUtils.baseModel(req);

    data.dashboard_title = "Create Event";
    data.statuses = constantUtils.statuses;

    res.render('event/create', data);
});

router.post('/create', function (req, res, next) {
	var items = {};
	items.name = req.body.name;
	items.begin = req.body.begin_date +" "+ req.body.begin_time;
	items.end = req.body.end_date +" "+ req.body.end_time;
	items.status = 2;
	var obj = new Event(items);
	obj.save(function(err, obj){
		if(err){
			return console.error(err);
		}
		res.json(obj);
	});
});

//update
router.get('/edit/:id', function (req, res, next) {
	var data = modelUtils.baseModel(req);

    data.dashboard_title = "Edit Event";
    data.statuses = constantUtils.statuses;

	Event.findOne({id: req.params.id}, function(err, doc){
		if(err){
			return console.error(err);
		}
		
		data.event = doc;
		data.begin_time = moment(doc.begin).format('LT');
		data.end_time = moment(doc.end).format('LT');
		res.render('event/edit', data);
	})
});
router.post('/edit/:id', function (req, res, next) {
	var items = {};
	items.name = req.body.name;
	items.begin = req.body.begin_date +" "+ req.body.begin_time;
	items.end = req.body.end_date +" "+ req.body.end_time;
	items.status = req.body.status;
	console.log(items.begin)
	Event.findOneAndUpdate({id: req.params.id}, items, function(err, doc){

		if(err){
			return console.error(err);
		}
		res.redirect('/event');
	});
});

//delete
// router.post('/delete/:id', function (req, res, next) {
// 	Event.findOneAndRemove({id: req.params.id}, function(err, doc){
// 		if(err){
// 			return console.error(err);
// 		}
// 		res.sendStatus(200);
// 	});
// });

module.exports = router;