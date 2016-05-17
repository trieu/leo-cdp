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

router.get('/:id', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "Campaign";

    if (req.params.id === 'all') {
        request(data.site.api_domain + '/api/campaign/summary/', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                data.campaigns = JSON.parse(body);
                data.campaigns.forEach(function (cpn) {
                    cpn.name = cpn.name || '-';
                    if (cpn.name === 'Default') {
                        cpn.name = 'Default Campaign';
                    }
                    cpn.status = constantUtils.getStatus(cpn.status);
                    cpn.ctr = (cpn.ctr * 100).toFixed(2);
                    cpn.tvr = (cpn.tvr * 100).toFixed(2);
                });
            }
            Campaign.allByUser(req.user.id, data, function (err, data) {
                res.render('ad-report/campaigns', data)
            })
        })
    } else {
        //var waiting = 2;
        data.cpnId = req.params.id || -1;
        data.type = req.query.type || "daily";
        data.begin = req.query.begin;
        data.end = req.query.end;
        if (!data.begin || !data.end) {
            var end = moment();
            var begin = end.clone().subtract(9, 'days');

            data.begin = begin.format("YYYY-MM-DD");
            data.end = end.format("YYYY-MM-DD");
        }
        request(data.site.api_domain + '/api/campaigns/' + data.cpnId, function (error, response, body) {
            data.campaign = JSON.parse(body);
            var crts = data.campaign.crts;
            request(data.site.api_domain + '/api/creative/summary/' + crts, function (error, response, body) {
                var creatives = JSON.parse(body);
                data.creatives = creatives;
                creatives.forEach(function(crt) {
                    crt.adType = constantUtils.getAdType(crt.adType);
                });
            });
            Campaign.get(req.params.id, data, function (err, data) {
                res.render('ad-report/campaign-details', data)
            })
        });
    }
});

router.get('/json/:id', function(req, res){
    var data = [];
    data.push({key: 'Impression', values :[ [1435597200000, 1234], [1435600800000, 1000], [1435604400000, 5000]] , mean : 2500});
    data.push({key: 'Click', values :[ [1435597200000, 50], [1435600800000, 13], [1435604400000, 50]]  , mean : 50});
    data.push({key: 'Complete View', values :[ [1435597200000, 500], [1435600800000, 458], [1435604400000, 3000]] , mean : 1500 });
    res.json(data);
});
function renderCreativeDetial(req, res, data) {
    Campaign.get(req.params.id, data, function (err, data) {
        res.render('ad-report/campaign-details', data)
    })
}
module.exports = router