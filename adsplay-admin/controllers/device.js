/**
 * Created by trieu on 5/27/15.
 */

var express = require('express')
    , router = express.Router()
    , Campaign = require('../models/campaign')
    , modelUtils = require('../helpers/model_utils')
    , constantUtils = require('../helpers/constant_utils')
    , request = require('request')
    , moment = require('moment');

router.get('/monitor', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "Top 50 - Most popular devices from user";
    res.render('monitor/device', data)
});

router.get('/top-50/json', function (req, res) {
    var data = [];
    data.push({'label':'PC',value:1});
    res.json(data);
});

module.exports = router