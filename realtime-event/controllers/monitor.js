/**
 * Created by trieu on 5/27/15.
 */

var express = require('express')
    , router = express.Router()
    , auth = require('../middlewares/auth')
    , modelUtils = require('../helpers/model_utils')
    , constantUtils = require('../helpers/constant_utils')
    , Summary = require('../models/summary')
    , moment = require('moment');

router.get('/geolocation', auth, function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "Geo-Location";
    res.render('monitor/geo-heatmap', data)
});

router.get('/event', auth, function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "Real-time Marketing - Event Analytics";
    data.sites = [];
    data.sites.push({value: "tgrm2016-imp", label: "Tiger Remix 2016 - Ad Impression" });
    data.sites.push({value: "tgrm2016-pv", label: "Tiger Remix 2016 - PageView" });
    res.render('monitor/event', data)
});

router.get('/event-manager', auth, function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "Live TV Ad Manager";
    res.render('monitor/event-manager', data)
});

router.get('/event-manager/on', auth, function (req, res) {
    res.json({ok:1});
});

router.get('/event-manager/off', auth, function (req, res) {
    res.json({ok:1});
});

router.get('/summary/:graphId', function (req, res) {
    var cb = function (data) {
        //console.log(data.length)
        res.json(data);
    }
    var filterDate = req.query.filterDate != null ? req.query.filterDate : '2015-07-30';

    if(req.params.graphId === 'chartImpVsPv'){
        Summary.getSummaryImpressionAndPageView(cb)
    }
    else if(req.params.graphId === 'chartImpVsView100'){
        Summary.getSummaryImpressionVsCompleteView(cb)
    }
    else if(req.params.graphId === 'chartImpVsClick'){
        Summary.getSummaryImpressionAndClick(cb)
    }
    else if(req.params.graphId === 'chartPieOS'){
        Summary.processPieChartData('os-', filterDate, cb)
    }
    else if(req.params.graphId === 'chartPiePlatform'){
        Summary.processPieChartData('pf-', filterDate, cb)
    }
    else {
        Summary.getSummaryImpressionAndClick(cb)
    }
});

module.exports = router;