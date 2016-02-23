/**
 * Created by trieu on 5/27/15.
 */
var modelUtils = require('../helpers/model_utils');
var stringUtils = require('../helpers/string_utils');

var express = require('express')
    , auth = require('../middlewares/auth')
    , router = express.Router();

router.use('/user', require('./user'))


router.get('/', function (req, res) {
    var data = modelUtils.baseModel(req);
    res.render('home/content', data);
})

router.get('/play-content/:source/:id', function (req, res) {

    console.log("source = " + req.params.source);
    console.log("id = " + req.params.id);

    var playUrl = '';
    if(req.params.source == 1){
        playUrl = 'https://www.youtube.com/embed/' + req.params.id;
    }

    var PlayableContent = require('../models/playable_content');
    PlayableContent.find({'playUrl': playUrl},function (err, list) {
        if (err) {
            console.error(err);
        }

        var data = modelUtils.baseModel(req);
        data.playContent =  list.length > 0 ? list[0]: false;

        data.dashboard_title = stringUtils.escapeHtml(data.playContent.title + " - " + data.dashboard_title);
        data.og_image = data.playContent.thumbnail;
        data.og_description = stringUtils.escapeHtml(data.playContent.description);

        console.log(data);

        res.render('home/play-content', data);
    })


})

router.get('/profile', auth, function (req, res) {
    var data = modelUtils.baseModel(req);
    res.render('home/default', data);
})

router.get('/403', function (req, res) {
    var data = modelUtils.baseModel(req);
    res.render('common/no-auth', data);
});

module.exports = router;