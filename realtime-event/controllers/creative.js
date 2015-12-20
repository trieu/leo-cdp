/**
 * Created by trieu on 6/1/15.
 */

var express = require('express')
    , router = express.Router()
    , Creative = require('../models/creative')
    , User = require('../models/user')
    , auth = require('../middlewares/auth')
    , modelUtils = require('../helpers/model_utils')
    , constantUtils = require('../helpers/constant_utils')
    , request = require('request')
    , moment = require('moment')
 ;




router.get('/list/all', auth, function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "All Advertising Units";

    data.begin = req.query.begin;
    data.end = req.query.end;
    if (!data.begin || !data.end) {
        var end = moment();
        var begin = end.clone().subtract(20, 'days');

        data.begin = begin.format("YYYY-MM-DD");
        data.end = end.format("YYYY-MM-DD");
    }
    request(data.site.api_domain + '/api/creative/summary/', function (error, response, body) {

        if (!error && response.statusCode == 200) {
            var creatives = JSON.parse(body);
            var filteredList = [];
            creatives.forEach(function (crt) {
                crt.name = crt.name || '-';
                if (crt.name === 'Default') {
                    crt.name = 'Default Creative';
                }
                crt.runDate = crt.runDate || 'Jul 1, 2015 12:00:00 AM';
                crt.expiredDate = crt.expiredDate || 'Jul 21, 2015 12:00:00 AM';

                var runDate = moment(crt.runDate, 'MMM D, YYYY hh:mm:ss A');
                crt.runDate = runDate.format('YYYY-MM-DD');
                var expiredDate = moment(crt.expiredDate, 'MMM D, YYYY hh:mm:ss A');
                crt.expiredDate = expiredDate.format('YYYY-MM-DD');

                crt.active = crt.status == 2;
                crt.status = constantUtils.getStatus(crt.status);
                crt.ctr = (crt.ctr * 100).toFixed(2);
                crt.tvr = (crt.tvr * 100).toFixed(2);

                if(crt.name.toLowerCase().indexOf('tiger') >= 0){
                    filteredList.push(crt);
                }
            });
            data.creatives = filteredList;
        }
        Creative.allByUser(req.sessionid, data, function (err, data) {
            res.render('ad-report/creative-list-all', data)
        });

    });
});


router.get('/:id', auth, function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "Creative Details";

    data.crtId = req.params.id || -1;
    data.type = req.query.type || "daily";
    data.begin = req.query.begin;
    data.end = req.query.end;
    request(data.site.api_domain + '/api/creatives/' + data.crtId, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var crt = JSON.parse(body);

            var createdDate = moment(crt.crtDateL);
            crt.crtDate = createdDate.format('LL');
            var runDate = moment(crt.runDateL);
            crt.runDate = runDate.format('LL');
            var expiredDate = moment(crt.expDateL);
            crt.expDate = expiredDate.format('LL');
            crt.status = constantUtils.getStatus(crt.status);
            data.crt = crt;

            if (!data.begin || !data.end) {
                var end = moment();
                if (crt.expDateL > 0) {
                    var expMoment = moment(crt.expDateL);
                    if (end.isAfter(expMoment)) {
                        end = expMoment.add(1, 'days');
                    }
                }
                var begin = moment(crt.runDateL).subtract(1, 'days');

                data.begin = begin.format("YYYY-MM-DD");
                data.end = end.format("YYYY-MM-DD");
            }

            data.editUrl = '/creative/' + data.crtId + '/edit';
        }
        Creative.get(req.params.id, data, function (err, data) {
            res.render('ad-report/creative-details-' + data.crt.adType, data)
        })
    });
});


module.exports = router;
