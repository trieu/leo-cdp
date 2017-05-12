/**
 * Created by trieu on 5/27/15.
 */

var express = require('express')
    , router = express.Router()
    , modelUtils = require('../helpers/model_utils')
    , Booking = require('../models/booking')
    , constantUtils = require('../helpers/constant_utils')
    , Summary = require('../models/summary')
    , request = require('request')
    , moment = require('moment');

router.get('/all', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "Geo-Location";
    res.render('monitor/geo-heatmap', data)
});

router.get('/list/all', function (req, res) {
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
    request(data.site.api_domain + '/api/bookings/', function (error, response, body) {

        if (!error && response.statusCode == 200) {
            var bookings = JSON.parse(body);
            var filteredList = [];
            bookings.forEach(function (bk) {
                console.log(bk);
                bk.name = bk.name || '-';
                if (bk.name === 'Default') {
                    bk.name = 'Default Booking';
                }
                if (bk.runDateL) {
                    console.log(bk.runDateL);
                    var runDate = moment(bk.runDateL);
                    bk.runDate = runDate.format('YYYY-MM-DD');
                } else {
                    bk.runDate = '-';
                }

                if(data.isAdminGroup){
                    filteredList.push(bk);
                }
            });
            data.bookings = filteredList;
        }
        Booking.allByUser(req.user.id, data, function (err, data) {
            res.render('ad-report/booking-list-all', data)
        });

    });
});

router.get('/new', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "New Booking";

    res.render('ad-report/new-booking', data)

});

router.post('/save', function(req, res) {
    var data = modelUtils.baseModel(req);
    if (data.isAdminGroup) {

        var rawBk = req.body.booking;
        if (typeof rawBk === 'string') {
            var bk = JSON.parse(rawBk);
            console.log(bk);
        
            var urlSave = data.site.api_domain + '/api/bookings/';
            request.post({url:urlSave, form: JSON.stringify(bk)}, function (error, response, body) {
                if (!error && response.statusCode == 201) {
                    data.bkId = JSON.parse(body);
                    res.status(201).send(data);
                } else {
                    console.error(error)
                }
            });
        }

    }
    else {
        res.status(403).end();
    }
});

module.exports = router;