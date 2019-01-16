/**
 * Created by trieu on 5/27/15.
 */
var modelUtils = require('../helpers/model_utils');
var request = require('request');

var express = require('express'),
	auth = require('../middlewares/auth'),
	router = express.Router();

var database = require('../configs/database.js');
var Ping = database.ping;

var pingUtils = require('../helpers/ping_utils.js');
//auto ping
pingUtils.pingSave();
setInterval(function () {
	pingUtils.pingSave()
}, 5000); //Auto Ping after 1 hour
//end autoping

router.get('/api/current', function (req, res, next) {
	pingUtils.pingUrl(pingUtils.hosts, function (obj) {
		res.json(obj);
	});
});

router.get('/api/all', function (req, res, next) {
	Ping.find({
			"time": {
				$gt: new Date(Date.now() - 24 * 60 * 60 * 1000)
			}
		})
		.sort({
			time: 'desc'
		})
		.exec(function (err, doc) {
			if (err) {
				return next(err);
			}
			if (doc.length > 0) {
				res.json(doc);
			} else {
				res.json(null);
			}
		});
});

router.get('/api/history', function (req, res, next) {
	Ping.find({
			"time": {
				$gt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 30)
			}
		})
		.sort({
			time: 'desc'
		})
		.exec(function (err, doc) {
			if (err) {
				return next(err);
			}
			if (doc.length > 0) {
				console.log(doc)
				res.json(doc);
			} else {
				res.json(null);
			}
		});
});

router.get('/', function (req, res) {
	var data = {
		dashboard_title: 'trang chu'
	};
	res.render('home/default', data);
});

router.get('/details', function (req, res) {
	var data = {
		dashboard_title: 'chi tiet'
	};
	res.render('home/details', data);
});

router.get('/403', function (req, res) {
	var data = modelUtils.baseModel(req);
	res.render('common/no-auth', data);
});

module.exports = router;