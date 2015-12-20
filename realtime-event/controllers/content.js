/**
 * Created by trieu on 5/27/15.
 */

var express = require('express')
    , router = express.Router()
    , Campaign = require('../models/campaign')
    , auth = require('../middlewares/auth')
    , modelUtils = require('../helpers/model_utils')
    , constantUtils = require('../helpers/constant_utils')
    , request = require('request')
    , moment = require('moment');

router.get('/monitor', auth, function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "Top most popular content categories";
    res.render('monitor/content', data)
});

router.get('/top-most-viewed-categories/json', auth, function (req, res) {
    var data = [];
    data.push({'label':'aa',value:1});
    res.json(data);
});

module.exports = router