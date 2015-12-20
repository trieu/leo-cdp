/**
 * Created by trieu on 5/27/15.
 */
var modelUtils = require('../helpers/model_utils');

var express = require('express')
    , auth = require('../middlewares/auth')
    , router = express.Router();

router.use('/monitor', require('./monitor'))
router.use('/campaign', require('./campaign'))
router.use('/creative', require('./creative'))
router.use('/user', require('./user'))
router.use('/content', require('./content'))

router.get('/', auth, function(req, res) {
    var data = modelUtils.baseModel(req);
    data.graphName = req.query.graphName != null ? req.query.graphName : 'ImpressionVsClick';
    res.render('monitor/summary', data);
})

router.get('/403', function (req, res) {
    var data = modelUtils.baseModel(req);
    res.render('common/no-auth', data);
});

module.exports = router;