/**
 * Created by trieu on 12/06/16.
 */

var express = require('express')
    , router = express.Router()
    , modelUtils = require('../helpers/model_utils')
    , constantUtils = require('../helpers/constant_utils')
    , request = require('request')
    , moment = require('moment');

router.get('/check', function (req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = "Check Inventory";
    res.render('inventory/check', data);
});


module.exports = router