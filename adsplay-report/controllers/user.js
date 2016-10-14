var express = require('express')
    , router = express.Router()
    , User = require('../models/user')
    , modelUtils = require('../helpers/model_utils')
    , constantUtils = require('../helpers/constant_utils')
    , moment = require('moment');

router.get('/', function (req, res, next) {
	var data = modelUtils.baseModel(req);
	data.statuses = constantUtils.statuses;
	data.dashboard_title = "User Detail";
	res.render('user/list', data);
});


module.exports = router;