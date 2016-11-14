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
var dataUtils = require('../helpers/data_utils.js');    
var Sync = require('sync');    

/**
 *  Crud
**/

router.get('/', function (req, res, next) {
    var data = modelUtils.baseModel(req);
    data.statuses = constantUtils.statuses;
    data.dashboard_title = "Campaign list";

    res.render('campaign/list', data);
});

//create
router.get('/create', function (req, res, next) {
var data = modelUtils.baseModel(req);
    data.statuses = constantUtils.statuses;
    data.dashboard_title = "campaign list";

    var url = data.site.api_domain + '/api/creative/summary?begin=2015-05-01';

    Sync(function(){
        try{
            // result from callback
            var result = dataUtils.request.sync(null, url);
            data.ads = [];
            for(var i in result){
                data.ads.push({id: result[i].id, name: result[i].name});
            }
            res.render('campaign/create', data);
        }

        catch (e) {
            console.error(e);
        }
    });
});
router.post('/create', function (req, res, next) {
    console.log('ddd')
    var items = {};
    items.name = req.body.name;
    items.ads = [];
    var ads = req.body.ads;
    if (!Array.isArray(ads)) {
        items.ads.push(parseInt(ads));
    }
    else{
        for(var i in ads){
            items.ads.push(parseInt(ads[i]));
        }
    }
    console.log(items)
    var obj = new Campaign(items);
    obj.save(function(err, obj){
        if(err){
            return console.error(err);
        }
        res.redirect('/');
    });
});

//update
router.get('/edit/:id', function (req, res, next) {
    var data = modelUtils.baseModel(req);
    data.statuses = constantUtils.statuses;
    data.dashboard_title = "Edit Campaign";

    var url = data.site.api_domain + '/api/creative/summary?begin=2015-05-01';

    Campaign.findOne({_id: req.params.id}, function(err, doc){
        if(err){
            return console.error(err);
        }
        
        if (!doc) {
            data.errorMessage = 'Not data for campaign id:' + req.params.id;
            res.render('common/system-error', data);
        }
        else{
            data.campaign = doc;
            Sync(function(){
                try{
                    // result from callback
                    var result = dataUtils.request.sync(null, url);
                    data.ads = [];
                    for(var i in result){
                        data.ads.push({id: result[i].id, name: result[i].name});
                    }
                    console.log(data.campaign)
                    res.render('campaign/edit', data);
                }

                catch (e) {
                    console.error(e);
                }
            });
            
        }
        
    })
});

router.post('/edit/:id', function (req, res, next) {
    console.log('POST Campaign')
    var items = {};
    items.name = req.body.name;
    items.ads = [];
    var ads = req.body.ads;
    console.log(ads)
    if (!Array.isArray(ads)) {
        items.ads.push(parseInt(ads));
    }
    else{
        for(var i in ads){
            items.ads.push(parseInt(ads[i]));
        }
    }

    Campaign.findOneAndUpdate({_id: req.params.id}, items, function(err, doc){

        if(err){
            return console.error(err);
        }
        res.redirect('/campaign');
    });
});

//select all
router.get('/find', function (req, res, next) {
    var data = modelUtils.baseModel(req);
    data.statuses = constantUtils.statuses;
    var url = data.site.api_domain + '/api/creative/summary?begin=2015-05-01';

    Campaign.find({}, function(err, doc){
        if(err){
            return console.error(err);
        }

        Sync(function(){
            try{
                // result from callback
                var result = dataUtils.request.sync(null, url);
                var obj = [];
                
                for(var j in doc){
                    var adsArr = doc[j].ads;
                    var adsName = [];
                    for(var k in adsArr){
                        for(var i in result){
                            if(result[i].id == adsArr[k]){
                               adsName.push(result[i].name); 
                            }
                        }
                    }
                    obj.push({_id: doc[j]._id, name: doc[j].name, ads: adsName});
                }
                
                console.log(obj)
                res.json(obj);
            }

            catch (e) {
                console.error(e);
            }
        });
        
    });
});

//find by id
router.get('/find/:id', function (req, res, next) {
    var data = modelUtils.baseModel(req);
    data.statuses = constantUtils.statuses;

    Campaign.findOne({_id: req.params.id}, function(err, doc){
        if(err){
            return console.error(err);
        }
        if(doc){
            data.campaign = doc;
            res.render('campaign/detail', data);
        }
        
    });
});

/**
 *  End Crud
**/

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
            var campaign = new Campaign();
            campaign.allByUser(req.user.id, data, function (err, data) {
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
            var campaign = new Campaign();
            campaign.getAll(req.params.id, data, function (err, data) {
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
    var campaign = new Campaign();
    campaign.getAll(req.params.id, data, function (err, data) {
        res.render('ad-report/campaign-details', data)
    })
}
module.exports = router