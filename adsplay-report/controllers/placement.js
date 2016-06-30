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
    Placement.find({})
    .exec(function(err, doc){
        if (err) { return next(err); }
        if (doc.length > 0) {
            data.placements = doc;
        }
        res.render('ad-placement/list-placement', data);
    });
        

    
});

router.post('/save', function (req, res, next){
    console.log("_________________")
    console.log(req.body)
    Placement.findOne({ id: req.body.id }, function(err, doc) {
        console.log("dddd")
        if (err) { return next(err); }

        if (!doc) {
            console.log("new")
            var doc = new Placement();
        }
        doc.name = req.body.name;
        doc.publisher = req.body.publisher;
        doc.type = req.body.type;
        doc.width = req.body.width;
        doc.height = req.body.height;
        doc.updatedDate = req.body.updatedDate;
        
        doc.save(function(err) {
            console.log("save")
            if(!err){
                res.json(doc);
            }
            else {
                res.sendStatus(500);
            }
        });
         
    });
});
router.get('/new', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "New Ad Placement";
    res.render('ad-placement/new-placement', data)
});

module.exports = router;