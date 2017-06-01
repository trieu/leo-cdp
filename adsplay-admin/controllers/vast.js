var express = require('express')
    , router = express.Router()
    , modelUtils = require('../helpers/model_utils');
var crypto = require('crypto');
var path = require('path');
var fs = require('fs.extra');
var request = require('request');
var builder = require('xmlbuilder');
var Vast = require('../models/vast');
var formidable = require('formidable');
var destVast = "public/ads/vast/";

router.post('/save/upload', function (req, res, next){
	var data = modelUtils.baseModel(req);

	var form = new formidable.IncomingForm();
		form.parse(req, function (err, fields, files) {
			if (err) {
				console.error(err);
			}
			else {
				var file = files.files;
				console.log(fields);
				var filename = checkFileExists(fields.temp) == false ? hashName(file.name) : checkFileExists(fields.temp);
				var dest = destVast+filename;

				createFile(dest, fs.readFileSync(file.path), function (message){
					res.json({message: message, filename: filename});
				});

			}
		});
});

router.post('/save/url', function (req, res, next){
	var data = modelUtils.baseModel(req);

	var filename = checkFileExists(req.body.temp) == false ? hashName(req.body.url) : checkFileExists(req.body.temp);
	var dest = destVast+filename;
	request(req.body.url ,function (err, response, body) {
		if(!err && response.statusCode == 200){
			createFile(dest, body, function (message){
				res.json({message: message, filename: filename});
			});
		}
		else{
			res.json({message: false});
		}
	});
});

router.post('/save', function (req, res, next){
	var data = modelUtils.baseModel(req);
		var obj = xmlObj(req.body); //object xml
		var filename = checkFileExists(req.body.temp) == false ? hashName(req.body.Name) : checkFileExists(req.body.temp);
		var dest = destVast+filename;
		var body = builder.create(obj).end({ pretty: true});
		createFile(dest, body, function (message){
			res.json({message: message, filename: filename});
		});
});

router.get('/file/:name', function (req, res, next) {
	var path = __dirname + '/../public/ads/vast/' + req.params.name;
	fs.readFile(path, function (err, data) {
        if (err) {
            res.send('Error: ENOENT: no such file or directory');
        }
        else {
            res.writeHeader(200, {"Content-Type": "application/xml"});
            res.end(data);
        }
    });
});

var checkFileExists = function(name){
	if(name == ""){
		return false;
	}
	else{
		if(name.indexOf('monitor.adsplay.net') != -1){
			var splitUrl = name.split('/');
			return splitUrl[splitUrl.length-1];
		}
		else{
			return false;
		}
	}
}

var hashName = function(name){
	return crypto.createHash('md5').update(name).digest('hex') + ".xml";
}

var createFile = function(dest, body, cb){
	fs.writeFile(dest, body, function (err) {
		if (err){
			console.log(err);
			cb(false);
		}
		cb("success");
	});
}

var xmlObj = function(doc){
	console.log(doc)
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
								'@sequence': 1
							},
							'Linear':{
								'TrackingEvents': {
									Tracking: TrackingEvents
								}
							}
						}
					}
				}
			}
		};

		return obj;
}

module.exports = router;