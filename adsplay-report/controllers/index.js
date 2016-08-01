/**
 * Created by trieu on 5/27/15.
 */
var modelUtils = require('../helpers/model_utils');
var fs = require('fs');

module.exports = function (app) {
    //secret
    var svgCaptcha = require('svg-captcha');
    var checkCaptcha = function(req, res, next){
        if(req.session.captcha == req.body.captcha || req.session.captcha.toLowerCase() == req.body.captcha.toLowerCase()){
            next();
        }
        else{
            console.log("Recaptcha verify failed !");
            res.redirect('/login');
        }
    };
    //passport
    var passport = require('passport');
    app.use(passport.initialize());
    app.use(passport.session());

    var auth = require('../middlewares/passport-utils.js')(passport);

    /* all router */
    app.use('/creative_json', require('./creative_json'));
    app.use('/placement', auth.isLoggedIn, require('./placement'));
    app.use('/creative', auth.isLoggedIn, require('./creative'));
    app.use('/campaign', auth.isLoggedIn, require('./campaign'));
    app.use('/monitor', auth.isLoggedIn, require('./monitor'));
    app.use('/device', auth.isLoggedIn, require('./device'));
    app.use('/content', auth.isLoggedIn, require('./content'));
    app.use('/user-profile', auth.isLoggedIn, require('./user-profile'));
    app.use('/booking', auth.isLoggedIn, require('./booking'));


    app.route('/').get(auth.isLoggedIn, function (req, res) {
        var data = modelUtils.baseModel(req);
        data.graphName = req.query.graphName != null ? req.query.graphName : 'ImpressionVsClick';
        res.render('monitor/summary', data);
    });

    app.route('/display-banner/*').get(function (req, res) {
        var path = __dirname + '/../public/' + req.params[0];
        fs.readFile(path, function (err, data) {
            if (err) {
                res.send('Error: ENOENT: no such file or directory');
            }
            else {
                res.writeHeader(200, {"Content-Type": "text/html"});
                res.end(data);
            }
        });
    });

    app.route('/403').get(function (req, res) {
        var data = modelUtils.baseModel(req);
        res.render('common/no-auth', data);
    });

    app.route('/login').get(function (req, res) {
        var text = svgCaptcha.randomText();
        req.session.captcha = text;
        var data = modelUtils.baseModel(req);
        data.dashboard_title = "User";
        data.loginMessage = req.flash('loginMessage');
        data.captcha = svgCaptcha(text);
        res.render('common/login', data);
    })

    app.route('/ping').get(function (req, res) {
        res.writeHeader(200, {"Content-Type": "text/html"});
        res.end('PONG');
    })

    app.route('/user/login').post(checkCaptcha, auth.login_local);

    app.route('/user/logout').get(auth.logout);

};