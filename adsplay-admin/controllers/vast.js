var express = require('express')
    , router = express.Router()
    , modelUtils = require('../helpers/model_utils');
var path = require('path');
var fs = require('fs');
var builder = require('xmlbuilder');
var Vast = require('../models/vast');

router.post('/save', function (req, res, next){
	var data = modelUtils.baseModel(req);

	if(data.editable){
		Vast.findOne({ _id: req.body._id })
	    .exec(function(err, doc){
	        if (err) { return next(err); }

	        if (!doc) {
	            //create new
	            var doc = new Vast();
	            doc._id = req.body._id;
	        }

	        doc.Name = req.body.Name;
	        doc.Impression = req.body.Impression;
	        doc.TrackingEvents = req.body.TrackingEvents;

	        doc.save(function(err) {
	            if(!err){
	                res.json({message: "success", url: data.site.base_domain+"/vast/"+doc._id });
	            }
	            else {
	                console.log(err);
	                res.sendStatus(500);
	            }
	        });
	         
	    });
	}
	else{
		res.json({message: "success"});
	}
    
});
router.get('/find/:id', function (req, res, next) {
	Vast.findOne({ _id: req.params.id })
	.exec(function(err, doc){
		if (err) { return next(err); }

		if (doc) {
			res.json(doc);
		}
	});
});
router.get('/:id', function (req, res, next) {

	Vast.findOne({ _id: req.params.id })
	.exec(function(err, doc){
		if (err) { return next(err); }

		if (doc) {
			var Impression = [];
			doc.Impression.forEach(function(item) {
				Impression.push({'#cdata': item});
			});

			var TrackingEvents = [];
			doc.TrackingEvents.forEach(function(item) {
				TrackingEvents.push({'@event': item.name, '#cdata': item.value});
			});

			var obj = {
				VAST: {
					'@version': '2.0',
					'Ad': {
						'Wrapper':{
							'AdSystem': {
								'#cdata': "Ad Serving System"
							},
							'Impression': Impression,
							'Creatives':{
								'Creative':{
									'@id': doc._id,
									'@AdID': doc._id,
									'@sequence': 1
								},
								'Linear':{
									'TrackingEvents': TrackingEvents
								}
							}
						}
					}
				}
			};

			var root = builder.create(obj).end({ pretty: true});

			res.set('Content-Type', 'application/xml');
			res.send(new Buffer(root));
		}
	});
	
});

module.exports = router;