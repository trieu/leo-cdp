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
            data.placements = [];
            for (var i in doc) {
                var tempDate = moment(doc[i].updatedDate).format('YYYY-MM-DD');

                data.placements.push({
                    id: doc[i].id,
                    name: doc[i].name,
                    publisher: doc[i].publisher,
                    type: doc[i].type,
                    width: doc[i].width,
                    height: doc[i].height,
                    updatedDate : tempDate
                })
            }

        }
        res.render('ad-placement/list-placement', data);
    });
        

    
});

router.post('/save', function (req, res, next){
    Placement.findOne({ id: req.body.id }, function(err, doc) {
        if (err) { return next(err); }

        if (!doc) {
            //create new
            var doc = new Placement();
        }
        doc.name = req.body.name;
        doc.publisher = req.body.publisher;
        doc.type = req.body.type;
        doc.width = req.body.width;
        doc.height = req.body.height;
        doc.updatedDate = req.body.updatedDate;
        
        doc.save(function(err) {
            if(!err){
                res.json(doc);
            }
            else {
                res.sendStatus(500);
            }
        });
         
    });
});

module.exports = router;