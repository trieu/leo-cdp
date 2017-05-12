var express = require('express')
var router = express.Router();
var modelUtils = require('../helpers/model_utils');

//--- new
router.get('/new', function (req, res) {
	var data = modelUtils.baseModel(req);
	data.dashboard_title = "New campaign details";
	res.render('campaign-details/new', data);
});


module.exports = router;