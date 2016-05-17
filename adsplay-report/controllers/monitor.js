/**
 * Created by trieu on 5/27/15.
 */

var express = require('express')
    , router = express.Router()
    , modelUtils = require('../helpers/model_utils')
    , constantUtils = require('../helpers/constant_utils')
    , Summary = require('../models/summary')
    , moment = require('moment');

router.get('/geolocation', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "Geo-Location";
    res.render('monitor/geo-heatmap', data)
});

router.get('/inventory', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "Ad Inventory";
    data.platforms = constantUtils.platforms
    res.render('monitor/inventory', data)
});
router.get('/pageview', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "Pageview Analytics";
    data.sites = [];
    for (var prop in constantUtils.sites) {
        data.sites.push({value: prop, label: constantUtils.sites[prop]});
    }
    res.render('monitor/pageview', data)
});

router.get('/live-tv-ad-manager', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "Live TV Ad Manager";
    res.render('monitor/live-tv-ad-manager', data)
});

router.get('/live-tv-ad-manager/on', function (req, res) {
    res.json({ok:1});
});

router.get('/live-tv-ad-manager/off', function (req, res) {
    res.json({ok:1});
});

router.get('/user', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.placements = constantUtils.placements;
    data.dashboard_title = "User Analytics";
    data.begin = req.query.begin;
    data.end = req.query.end;
    if (!data.begin || !data.end) {
        var end = moment();
        var begin = end.clone().subtract(20, 'days');

        data.begin = begin.format("YYYY-MM-DD");
        data.end = end.format("YYYY-MM-DD");
    }

    res.render('monitor/user-analytics', data)
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
// res.send('ok');


module.exports = router;