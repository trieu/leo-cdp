/**
 * Created by trieu on 5/28/15.
 */
/**
 * Created by trieu on 5/27/15.
 */

var express = require('express'),
    router = express.Router(),
    User = require('../models/user'),
    auth = require('../middlewares/auth'),
    modelUtils = require('../helpers/model_utils');

router.get('/login', auth, function (req, res) {

    var data = modelUtils.baseModel(req);
    data.dashboard_title = "User";
    User.get(0, data, function (err, data) {
        data.error = req.query.errorcode === "1";
        res.render('common/login', data)
    })
});

router.get('/logout', function (req, res) {
    res.clearCookie('sessionid');
    res.redirect('/');
});

router.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    // console.log((req.body));
    if (username === "admin" && password === "qazxsw") {
        res.cookie('sessionid', '1000', {
            httpOnly: true,
            path: '/',
            maxAge: 18000000
        });
        res.redirect('/');
    } else if (username === "user" && password === '123456') {
        res.cookie('sessionid', '1002', {
            httpOnly: true,
            path: '/',
            maxAge: 18000000
        });
        res.redirect('/');
    } else {
        res.redirect('/user/login?errorcode=1');
    }
});
module.exports = router