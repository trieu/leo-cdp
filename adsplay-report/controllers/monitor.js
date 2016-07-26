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

router.get('/geolocation', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "Geo-Location";
    res.render('monitor/geo-heatmap', data)
});

router.get('/inventory-report', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "Inventory Report";
    data.placements = constantUtils.placements;
    data.platforms = constantUtils.platforms_default;
    data.locationCodes = constantUtils.getLocationCodes();

    res.render('monitor/inventory-report', data);
});

router.post('/inventory-report/api', function (req, res){
    var data = modelUtils.baseModel(req);

    var url = 'http://api.adsplay.net/api/platform/summary/stats/';
    var body = req.body;
    var date_query = '?begin='+req.body.begin+'&end='+req.body.end;

    if (body.platforms != null) {
        data.placements = constantUtils.placements_default;
        var platformsArr = [];
        for (var i in body.platforms) {
            var number = parseInt(body.platforms[i]);

            for (var j in data.placements){
                if(number == j){
                    platformsArr.push(data.placements[j]);
                }
            }
            
        }
        var merged = [].concat.apply([], platformsArr);
        var platforms_query = '&pmId=' + merged.join('&pmId=');
    }
    
    // console.log(url + date_query + platforms_query);
    var queryUrl = url + date_query + platforms_query;
    console.log('inventory-report '+queryUrl);
    request(queryUrl,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.json(JSON.parse(body));
            }
        }    
    )
});

router.get('/inventory', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "Ad Inventory";
    data.platforms = constantUtils.platforms;
    res.render('monitor/inventory', data)
});
//paytv
router.get('/inventory-paytv', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "Ad Inventory-PayTV";
    data.platforms = constantUtils.platforms;
    res.render('monitor/inventory-paytv', data)
});

router.get('/inventory-paytv/api/:begin/:end', function(req, res){
    var begin = req.params.begin;
    var end = req.params.end;
    request("http://fbox-onetv.fpt.vn/OneTVWS.ashx?method=ITVad_TotalView&begintime="+begin+"&endtime="+end,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.json(JSON.parse(body));
            }
    });
});

//paytv-ads
router.get('/inventory-paytv-ads', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "Ad Inventory-PayTV";
    data.platforms = constantUtils.platforms
    res.render('monitor/inventory-paytv-ads', data)
});

router.get('/inventory-paytv-ads/api/:begin/:end', function(req, res){
    var begin = req.params.begin;
    var end = req.params.end;
    request("http://fbox-onetv.fpt.vn/OneTVWS.ashx?method=ITVad_TotalViewAds&begintime="+begin+"&endtime="+end,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.json(JSON.parse(body));
            }
    });
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