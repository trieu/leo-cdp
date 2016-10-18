var express = require('express')
    , router = express.Router()
    , User = require('../models/user')
    , modelUtils = require('../helpers/model_utils')
    , stringUtils = require('../helpers/string_utils')
    , constantUtils = require('../helpers/constant_utils')
    , moment = require('moment')
    , request = require('request');

router.get('/', function (req, res, next) {
	var data = modelUtils.baseModel(req);
	data.statuses = constantUtils.statuses;
	data.dashboard_title = "User Detail";
	res.render('user/list', data);
});

router.get('/find', function (req, res, next) {
	//find all user (except id 1000)
	User.find({ "_id" : {$ne:"1000"} }).select('-password')
	.exec(function(err, doc){
		if(err){
			return console.error(err);
		}
		res.json(doc);
	})
});

router.get('/find/:id', function (req, res, next) {
	var data = modelUtils.baseModel(req);
	data.statuses = constantUtils.statuses;

	User.findOne({_id: req.params.id}, function(err, doc){
		if(err){
			return console.error(err);
		};

		if(!doc){
			res.redirect('/');
		}
		else{
			data.user = doc;
			res.render('user/detail', data);
		}
		
	})
});

router.get('/update/:id/:status', function (req, res, next) {
	var data = modelUtils.baseModel(req);
	if(data.isSuperAdminGroup){

		User.findOne({ _id: req.params.id })
		.exec(function(err, doc){
        	if (err) { return next(err); }

        	doc.status = parseInt(req.params.status);
        	doc.save(function(err, obj){
				if(err){
					return console.error(err);
				}
				res.json({message: 'success'});
			});	
    	});

	}
	else{
		res.json({message: 'You do not have permission'});
	}
	
});

module.exports = router;