/**
 * Created by trieu on 5/27/15.
 */
var modelUtils = require('../helpers/model_utils');

var express = require('express')
    , auth = require('../middlewares/auth')
    , router = express.Router();

router.use('/user', require('./user'))


router.get('/', function(req, res) {
    var data = modelUtils.baseModel(req);
    res.render('home/content', data);
})

router.get('/play-content/:source/:id', function(req, res) {
    var data = modelUtils.baseModel(req);
    data.dashboard_title = data.dashboard_title + " - " + "‘One Day’ - một ngày để yêu";
    res.render('home/play-content', data);
})

router.get('/profile', auth, function(req, res) {
    var data = modelUtils.baseModel(req);
    res.render('home/default', data);
})

router.get('/403', function (req, res) {
    var data = modelUtils.baseModel(req);
    res.render('common/no-auth', data);
});

module.exports = router;