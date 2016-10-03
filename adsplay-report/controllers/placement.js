/**
 * Created by trieu on 5/27/15.
 */

var express = require('express')
    , router = express.Router()
    , request = require('request')
    , modelUtils = require('../helpers/model_utils')
    , constantUtils = require('../helpers/constant_utils')
    , Summary = require('../models/summary')
    , Placement = require('../models/placement')
    , moment = require('moment');

router.get('/list-all', function (req, res, next) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "All Placements";
    data.size_display = constantUtils.size_display;

    Placement.find({}).populate('publisher')
    .exec(function(err, doc){
        if (err) { return next(err); }
        if (doc.length > 0) {
            data.placements = [];
            for (var i in doc) {
                var tempDate = moment(doc[i].updatedDate).format('YYYY-MM-DD');
                data.placements.push({
                    _id: doc[i]._id,
                    name: doc[i].name,
                    publisher: doc[i].publisher['name'],
                    type: get_type(doc[i].type),
                    width: doc[i].width,
                    height: doc[i].height,
                    updatedDate : tempDate
                })
            }

        }
        res.render('ad-placement/list-placement', data);
    });
    
    var get_type = function (id){
        var type = {1: "video", 2: "Display Banner", 3: "Overlay Banner"};
        for(var i in type){
            if (id == i) {
                return type[i];
            }
        }
        return false;
    }

});

router.get('/find/:id', function (req, res, next) {
    Placement.findOne({ _id: req.params.id }).populate('publisher')
    .exec(function(err, doc){
        if (err) { return next(err); }
        res.json(doc);
    });
})

router.post('/save', function (req, res, next){
    console.log(req.body)
    Placement.findOne({ _id: req.body.id }).populate('publisher')
    .exec(function(err, doc){
        if (err) { return next(err); }

        if (!doc) {
            //create new
            var doc = new Placement();
        }

        doc.name = req.body.name;
        doc.publisher = req.body.publisher;
        doc.type = parseInt(req.body.type);
        doc.width = parseInt(req.body.width);
        doc.height = parseInt(req.body.height);

        doc.enabled = req.body.enabled;
        doc.adCode3rd = req.body.adCode3rd;
        doc.weight3rd = req.body.weight3rd;
        doc.baseDomain = req.body.baseDomain;
        doc.checkBaseDomain = req.body.checkBaseDomain;

        doc.save(function(err) {
            if(!err){
                res.json(doc);
            }
            else {
                console.log(err)
                res.sendStatus(500);
            }
        });
         
    });
});

router.get('/api', function (req, res, next) {
    var width = req.query.width;
    var height = req.query.height;
    Placement.findOne({ width: width, height: height }).populate({
        path: 'publisher'//,match: { name: 'req.params.publisherName' }
    })
    .exec(function(err, doc){
        if (err) { return next(err); }
        res.json(doc);
    });
})

module.exports = router;