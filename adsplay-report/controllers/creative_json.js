/**
 * Created by trieu on 6/1/15.
 */

var express = require('express')
    , router = express.Router()
    , Creative = require('../models/creative')
    , User = require('../models/user')
    , modelUtils = require('../helpers/model_utils')
    , constantUtils = require('../helpers/constant_utils')
    , stringUtils = require('../helpers/string_utils')
    , request = require('request')
    , crypto = require('crypto')
    , moment = require('moment')
    , commonConfigs = require('../configs/common')
    , fs = require('fs.extra')
    , upload = require('../helpers/upload_utils.js')
    , convert = require('../helpers/convert_utils.js');
var formidable = require('formidable');

router.get('/list', function (req, res) {
    var data = modelUtils.baseModel(req);

    data.dashboard_title = "All Advertising Units";
    data.statuses = constantUtils.statuses;
    var statuses = [];
    for (var stt in constantUtils.statuses) {
        statuses.push({value: stt, label: constantUtils.getStatus(stt)});
    }
    data.statuses = statuses;

    data.begin = req.query.begin;
    data.end = req.query.end;
    if (!data.begin || !data.end) {
        data.begin = new moment().format("YYYY-MM-DD");
        data.end = new moment().subtract(60, 'days').format("YYYY-MM-DD");
    }

    request(data.site.api_domain + '/api/creative/summary?begin='+data.begin+'&end='+data.end, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            var creatives = JSON.parse(body);
            var filteredList = [];
            creatives.forEach(function (crt) {
                crt.name = crt.name || '-';
                if (crt.name === 'Default') {
                    crt.name = 'Default Creative';
                }
                // crt.runDate = crt.runDate || 'Jul 1, 2015 12:00:00 AM';
                // crt.expiredDate = crt.expiredDate || 'Jul 21, 2015 12:00:00 AM';

                if (crt.runDate) {
                    var runDate = moment(crt.runDate, 'MMM D, YYYY hh:mm:ss A');
                    crt.runDate = runDate.format('YYYY-MM-DD');
                } else {
                    crt.runDate = 'N/A';
                }
                if (crt.expiredDate) {
                    var expiredDate = moment(crt.expiredDate, 'MMM D, YYYY hh:mm:ss A');
                    crt.expiredDate = expiredDate.format('YYYY-MM-DD');
                } else {
                    crt.expiredDate = 'N/A';
                }
                crt.active = crt.status == 2;
                crt.status = constantUtils.getStatus(crt.status);
                crt.ctr = (crt.ctr * 100).toFixed(2);
                crt.tvr = (crt.tvr * 100).toFixed(2);

                var idUser = crt.idUser || 0;
                crt.totalRevenue = (crt.totalRevenue == 0) ? "-" : crt.totalRevenue;

                var username = req.user.username.toLowerCase();
                var nameshort = (username == 'customer' || username == 'epl_fptplay') ? 'fptplay' : username.split("_")[0];
                var adName = crt.name.toLowerCase();

                if (req.user.roles == 'admin') {
                    filteredList.push(crt);
                }
                else if(req.user.roles == 'operator'){
                    //check adname relation username or userid of creative
                    if(adName.indexOf(nameshort) >= 0 || req.user.id == idUser){
                        filteredList.push(crt);
                    }
                }
            });
            res.json(filteredList);

        } else {
            res.json([]);
        }

    });
});

module.exports = router;
