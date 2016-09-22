/**
 * Created by trieu on 5/27/15.
 */

var express = require('express')
    , router = express.Router()
    , request = require('request')
    , modelUtils = require('../helpers/model_utils')
    , constantUtils = require('../helpers/constant_utils')
    , publisher = require('../models/publisher')
    , moment = require('moment');

router.get('/list-all', function (req, res, next) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "All Publishers";
    data.size_display = constantUtils.size_display;

    publisher.find({})
    .exec(function(err, doc){
        if (err) { return next(err); }
        if (doc.length > 0) {
            data.publishers = [];
            for (var i in doc) {
                var tempDate = moment(doc[i].updatedDate).format('YYYY-MM-DD');

                data.publishers.push({
                    _id: doc[i]._id,
                    name: doc[i].name,
                    updatedDate : tempDate
                })
            }

        }
        res.render('publisher/list', data);
    });

});

router.get('/getAll', function (req, res, next) {
    publisher.find({})
    .exec(function(err, doc){
        if (err) { return next(err); }
        res.json(doc);
    });
})

router.get('/find/:id', function (req, res, next) {
    publisher.findOne({ _id: req.params.id })
    .exec(function(err, doc){
        if (err) { return next(err); }
        res.json(doc);
    });
})

router.post('/save', function (req, res, next){

    publisher.findOne({ _id: req.body.id })
    .exec(function(err, doc){
        if (err) { return next(err); }

        if (!doc) {
            //create new
            var doc = new publisher();
        }

        doc.name = req.body.name;

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

module.exports = router;