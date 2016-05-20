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
var formidable = require('formidable');


router.get('/list/all', function (req, res) {
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

router.get('/list', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "All Advertising Units";
    data.statuses = constantUtils.statuses;
    var statuses = [];
    for (var stt in constantUtils.statuses) {
        statuses.push({value: stt, label: constantUtils.getStatus(stt)});
    }
    data.statuses = statuses;

    var status = req.query.status || -1;
    var url = data.site.api_domain + '/api/creative/summary?status=' + status;

    data.begin = req.query.begin;
    data.end = req.query.end;
    if (!data.begin || !data.end) {
        var end = moment();
        var begin = end.clone().subtract(20, 'days');

        data.begin = begin.format("YYYY-MM-DD");
        data.end = end.format("YYYY-MM-DD");
    }
    request(url, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            var creatives = JSON.parse(body);
            var filteredList = [];
            creatives.forEach(function (crt) {
                crt.name = crt.name || '-';
                if (crt.name === 'Default') {
                    crt.name = 'Default Creative';
                }
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
            res.json(filteredList);
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

            if (crt.crtDateL && crt.crtDateL > 0) {
                var createdDate = moment(crt.crtDateL);
                crt.crtDate = createdDate.format('LL');
            }
            if (crt.runDateL && crt.runDateL > 0) {
                var runDate = moment(crt.runDateL);
                crt.runDate = runDate.format('LL');
            }
            if (crt.expDateL && crt.expDateL > 0) {
                var expiredDate = moment(crt.expDateL);
                crt.expDate = expiredDate.format('LL');
            }
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
                res.render('ad-report/creative-details', data)
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
            
            var nameAdType;
            if (data.crt.adType == 1) {
                nameAdType = 'new-creative-video';
            }
            else if (data.crt.adType == 2) {
                nameAdType = 'new-creative-display';
            }
            else if (data.crt.adType == 3) {
                nameAdType = 'new-creative-overlay';
            }
            else if (data.crt.adType == 4) {
                nameAdType = 'new-creative-news';
            }
            else{
                nameAdType = 'new-creative';
            }
            Creative.get(req.params.id, data, function (err, data) {
                res.render('ad-report/' + nameAdType, data);
            });

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

router.post('/save/tvc-ad', function(req, res) {
    var data = modelUtils.baseModel(req);
    var urlSave = data.site.api_domain +'/creative/save/json';
    
    if (data.isAdminGroup) {
        var result = {};

        var rawCrt = req.body.creative;
        var adtype = req.body.adtype;
        var youtube_url = req.body.youtube_url;

        if (typeof rawCrt === 'string' && typeof youtube_url === 'string' && adtype === 'fm_tvc_video' ) {
            var crt = JSON.parse(rawCrt);
            crt.adType = 1;

            if(typeof(youtube_url) !== "undefined" && youtube_url !== null && youtube_url.indexOf(crt.media) < 0){

                var seedStr = stringUtils.removeUnicodeSpace(crt.name) + (new Date()).getTime();
                var hash = crypto.createHash('md5').update(seedStr).digest('hex');
                var mediaName = hash + '.mp4';
                crt.media = mediaName;

                upload.video(youtube_url, function(obj){
                    upload.ftp_video(obj.url, mediaName, function(data){
                        var rs = {url: data.url, filename: data.filename, size: obj.size};
                        saveJson({url: urlSave, form: JSON.stringify(crt)}, res);
                    });
                });
            }
            else{
                saveJson({url: urlSave, form: JSON.stringify(crt)}, res);
            }
            
        }

    }
    else {
        res.status(403).end();
    }
});

router.post('/save/display-banner', function(req, res) {
    var data = modelUtils.baseModel(req);
    var urlSave = data.site.api_domain +'/creative/save/json';

    if (data.isAdminGroup) {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            if(err){
                console.error(err);
            }
            else{
                var rawCrt = fields.creative;
                var adtype = fields.adtype;
                var file = files.file;

                if (typeof rawCrt === 'string' && adtype === 'fm_display_banner' ) {
                    var crt = JSON.parse(rawCrt);
                    crt.adType = 2;
                    
                    if(typeof(file) !== "undefined" && file !== null){
                        upload.unzip(file, function(obj){
                            //obj = {url: "local/folder/output.jpg", folder: "name folder"}
                            crt.media = obj.url;
                            saveJson({url: urlSave, form: JSON.stringify(crt)}, res);
                        });
                    }
                    else{
                        saveJson({url: urlSave, form: JSON.stringify(crt)}, res);
                    }

                }

            }
        });

    }
    else {
        res.status(403).end();
    }
});

router.post('/save/overlay-banner', function(req, res) {
    
    var data = modelUtils.baseModel(req);
    var urlSave = data.site.api_domain +'/creative/save/json';

    if (data.isAdminGroup) {

        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {
            if(err){
                console.error(err);
            }
            else{
                var rawCrt = fields.creative;
                var adtype = fields.adtype;
                var file = files.file;

                if (typeof rawCrt === 'string' && adtype === 'fm_overlay_banner' ) {
                    var crt = JSON.parse(rawCrt);
                    crt.adType = 3;

                    if(typeof(file) !== "undefined" && file !== null){
                        upload.image(file, function(obj){
                            //obj = {url: "local/folder/output.jpg", folder: "name folder", filename: "output.jpg"}
                            crt.media = obj.url;
                            saveJson({url: urlSave, form: JSON.stringify(crt)}, res);
                        });
                    }
                    else{
                        saveJson({url: urlSave, form: JSON.stringify(crt)}, res);
                    }

                }

            }
        });

    }
    else {
        res.status(403).end();
    }

});

router.post('/save/breaking-news', function(req, res) {

    var data = modelUtils.baseModel(req);
    var urlSave = data.site.api_domain +'/creative/save/json';

    if (data.isAdminGroup) {

        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {
            if(err){
                console.error(err);
            }
            else{
                var rawCrt = fields.creative;
                var adtype = fields.adtype;
                var text = fields.breakingNews;

                if (typeof rawCrt === 'string' && adtype === 'fm_breaking_news' ) {
                    var crt = JSON.parse(rawCrt);
                    crt.adType = 4;

                    if(typeof(text) !== "undefined" && text !== null){
                        crt.media = text;
                        saveJson({url: urlSave, form: JSON.stringify(crt)}, res);
                    }
                    else{
                        saveJson({url: urlSave, form: JSON.stringify(crt)}, res);
                    }

                }

            }
        });

    }
    else {
        res.status(403).end();
    }

});

var saveJson = function(obj, res){

    request.post(obj, function (error, response, body) {
        //console.log('==> request');
        if (!error && response.statusCode == 200) {
            res.status(200).end(body);
        } else {
            console.error(error)
        }
    });
};

module.exports = router;
