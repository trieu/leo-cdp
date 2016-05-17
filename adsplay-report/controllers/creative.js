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
    , upload = require('../helpers/upload_utils.js');

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
                if (crt.totalRevenue == 0) {
                    crt.totalRevenue = "-";
                }

                if(data.isAdminGroup){
                    filteredList.push(crt);
                }
                else if(data.ssid === 1002 && crt.name.toLowerCase().indexOf('vivid') >= 0){
                    filteredList.push(crt);
                }
                else if(data.ssid === 1003 && crt.name.toLowerCase().indexOf('fptplay') >= 0){
                    filteredList.push(crt);
                }
                else if(data.ssid === 1004 && crt.name.toLowerCase().indexOf('lava') >= 0){
                    filteredList.push(crt);
                }
                else if(data.ssid === 1005 && crt.name.toLowerCase().indexOf('ambient') >= 0){
                    filteredList.push(crt);
                }
            });
            data.creatives = filteredList;
        }
        Creative.allByUser(req.user.id, data, function (err, data) {
            res.render('ad-report/creative-list-all', data)
        });

    });
});

router.get('/visualize/metrics', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "Daily Ad Reports";

    data.begin = req.query.begin;
    data.end = req.query.end;
    if (!data.begin || !data.end) {
        var end = moment();
        var begin = end.clone().subtract(30, 'days');

        data.begin = begin.format("YYYY-MM-DD");
        data.end = end.format("YYYY-MM-DD");
    }
    request(data.site.api_domain + '/api/creative/summary/', function (error, response, body) {

        if (!error && response.statusCode == 200) {
            data.creatives = JSON.parse(body);
            data.creatives.forEach(function (crt) {
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
                crt.status = constantUtils.getStatus(crt.status);
                crt.ctr = (crt.ctr * 100).toFixed(2);
                crt.tvr = (crt.tvr * 100).toFixed(2);
            });
        }
        Creative.allByUser(req.user.id, data, function (err, data) {
            res.render('ad-report/creative-metrics-all', data)
        });

    });
});

router.get('/:id', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "Creative Details";

    data.crtId = req.params.id || -1;
    data.type = req.query.type || "daily";
    data.begin = req.query.begin;
    data.end = req.query.end;

    // TODO check permission on specify ad
    if(data.ssid === 1004 && data.crtId != 145){
        res.redirect('/login?errorcode=1');
    }

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
            if (crt.totalRevenue == 0) {
                crt.totalRevenue = "-";
            }
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

            // get platform data
            data.platforms = constantUtils.platforms;
            //get placements data
            data.placements = constantUtils.placements;
        }
        Creative.get(req.params.id, data, function (err, data) {
            try {
                res.render('ad-report/creative-details-' + data.crt.adType, data)
            }
            catch(e){
                console.error(e);
                data.errorMessage = JSON.stringify(e);
                res.render('common/system-error', data)
            }
        })
    });

});

router.get('/:id/edit', function (req, res) {
    var data = modelUtils.baseModel(req);
    if (data.isAdminGroup) {
        data.dashboard_title = "Update Creative Details";

        data.crtId = req.params.id || -1;
        data.type = req.query.type || "daily";
        data.begin = req.query.begin;
        data.end = req.query.end;
        request(data.site.api_domain + '/api/creatives/' + data.crtId, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var crt = JSON.parse(body);

                var createdDate = moment(crt.crtDateL);
                crt.crtDate = createdDate.format('LLL');
                var runDate = moment(crt.runDateL);
                crt.runDate = runDate.format('LLL');
                var expiredDate = moment(crt.expDateL);
                crt.expDate = expiredDate.format('LLL');

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
                data.stt = [];
                for (var k in constantUtils.statuses) {
                    data.stt.push({value: k, text: constantUtils.getStatus(k)});
                }
            }
            Creative.get(req.params.id, data, function (err, data) {
                res.render('ad-report/creative-details-' + data.crt.adType + '-edit', data)
            })
        });
    } else {
        res.redirect('/403');
    }
});

router.post('/:id/update', function (req, res) {
    var data = modelUtils.baseModel(req);
    if (data.isAdminGroup) {
        var crtId = req.params.id || -1;
        var name = req.body.name;
        var value = req.body.value;
        if (name) {
            var json = {};
            json[name] = value;
            request.patch(data.site.api_domain + '/api/creatives/' + crtId).form(JSON.stringify(json));
        }
        res.end();
    } else {
        res.status(403).end();
    }
});

router.get('/new/local-ad-unit', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "New Creative Details";

    res.render('ad-report/new-creative', data)

});

router.get('/new/local-ad-unit/display', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "New Creative Display Banner";

    res.render('ad-report/new-creative-display', data)

});

router.get('/new/local-ad-unit/news', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "New Creative Breaking News";

    res.render('ad-report/new-creative-news', data)

});

router.get('/new/local-ad-unit/overlay', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "New Creative Overlay Banner";

    res.render('ad-report/new-creative-overlay', data)

});

router.get('/new/local-ad-unit/video', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "New Creative Video";

    res.render('ad-report/new-creative-video', data)

});

router.post('/upload/video', function (req, res) {
    //require
    //var fs = require('fs');
    upload.video(req.body.link, function(obj){
        res.json(obj);
    });

});

router.post('/upload/image', function (req, res) {
    upload.image(req, function(obj){
        res.json(obj);
    });
});

router.post('/upload/unzip', function (req, res) {
    upload.unzip(req, function(obj){
        res.json(obj);
    });
});

router.post('/save', function(req, res) {
    var data = modelUtils.baseModel(req);
    if (data.isAdminGroup) {
        
        /* check adType = {'fm_tvc_video': 1, 'fm_overlay_banner': 2, 'fm_display_banner': 3, 'fm_breaking_news': 4}*/
        if (req.body.adType == 1) {
            upload.video(req.body.link, function(obj){
                upload.ftp_video(obj.url, function(data){
                    res.json({url: data.url, filename: data.filename, size: obj.size});
                });
            });
        }
    }
    else {
        res.status(403).end();
    }
});



router.post('/save/tvc-ad', function(req, res) {
    var data = modelUtils.baseModel(req);
    if (data.isAdminGroup) {
        var result = {};

        var rawCrt = req.body.creative;
        var adtype = req.body.adtype;
        var youtube_url = req.body.youtube_url;
        if (typeof rawCrt === 'string' && typeof youtube_url === 'string' && adtype === 'fm_tvc_video' ) {
            var crt = JSON.parse(rawCrt);
            console.log(crt);
            var seedStr = stringUtils.removeUnicodeSpace(crt.name) + (new Date()).getTime();
            var hash = crypto.createHash('md5').update(seedStr).digest('hex');
            var mediaName = hash + '.mp4';
            crt.media = mediaName;
            console.log(mediaName);

            var urlSave = 'http://api.adsplay.net/creative/save/json';
            request.post({url:urlSave, form: JSON.stringify(crt)}, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);

                    upload.video(youtube_url, function(obj){
                        console.log(obj);
                        upload.ftp_video(obj.url, mediaName, function(data){
                            var rs = {url: data.url, filename: data.filename, size: obj.size};
                            console.log(rs);
                        });
                    });
                    res.status(200).end(body);
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
