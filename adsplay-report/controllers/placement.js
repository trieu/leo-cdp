/**
 * Created by trieu on 5/27/15.
 */

var express = require('express')
    , router = express.Router()
    , request = require('request')
    , modelUtils = require('../helpers/model_utils')
    , constantUtils = require('../helpers/constant_utils')
    , Summary = require('../models/summary')
    , moment = require('moment');

router.get('/list-all', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "All Placements";
    res.render('ad-placement/list-placement', data)
});

router.get('/new', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "New Ad Placement";
    res.render('ad-placement/new-placement', data)
});

module.exports = router;