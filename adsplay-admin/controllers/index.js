/**
 * Created by trieu on 5/27/15.
 */
var modelUtils = require('../helpers/model_utils');
var svgCaptcha = require('svg-captcha');
var fs = require('fs');

module.exports = function (app) {

    //______________ captcha
    var checkCaptcha = function(req, res, next){
        // if(NODE_ENV == 'product'){
        //     var captcha = req.body.captcha.toLowerCase();
        //     if( ! req.session.captcha){
        //         console.log("Recaptcha is NULL !");
        //         res.redirect('/login');
        //     }
        //     var sscaptcha = req.session.captcha.toLowerCase();
        //     if(sscaptcha == captcha){
        //         next();
        //     }
        //     else{
        //         console.log("Recaptcha verify failed !");
        //         res.redirect('/login');
        //     }
        // }
        // else{
        //     next();
        // }
        next();
    };

    //______________ router not authorization
    app.route('/ping').get(function (req, res) {
        res.writeHeader(200, {"Content-Type": "text/html"});
        res.end('PONG');
    });

    app.route('/403').get(function (req, res) {
        var data = modelUtils.baseModel(req);
        res.render('common/no-auth', data);
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
    
    //______________ passport
    var passport = require('passport');
    app.use(passport.initialize());
    app.use(passport.session());
    var passport_auth = require('../middlewares/passport-utils.js')(passport);

    app.use('/vast', require('./vast'));
    //______________ register
    app.route('/register').get(function (req, res, next) {
        var data = modelUtils.baseModel(req);
        data.dashboard_title = "Create your Adsplay Account";
        res.render('user/register', data);
    });
    app.route('/register').post(passport_auth.register);


    //______________ Authorization
    var auth = require('../middlewares/authorization.js')(authorizationConfigs);
    app.use(auth.privilege, auth.router);

    
    //______________ all router with authorization
    app.use('/creative', require('./creative'));
    app.use('/placement', require('./placement'));
    app.use('/publisher', require('./publisher'));
    app.use('/campaign', require('./campaign'));
    app.use('/campaign-details', require('./campaign-details'));
    app.use('/monitor', require('./monitor'));
    app.use('/device', require('./device'));
    app.use('/content', require('./content'));
    app.use('/user-profile', require('./user-profile'));
    app.use('/booking', require('./booking'));
    app.use('/export', require('./export_file'));
    app.use('/event', require('./event'));
    app.use('/flight', require('./flight'));
    app.use('/inventory', require('./inventory'));
    app.use('/epl-report', require('./epl-report'));
    app.use('/user', require('./user'));

    app.route('/').get(function (req, res) {
        var data = modelUtils.baseModel(req);
        data.graphName = req.query.graphName != null ? req.query.graphName : 'AdsPlay Home';

        if(data.isAdminGroup){
                res.render('monitor/home', data);
        } else {
                res.render('creative/list', data);
        }

    });

    app.route('/permission').get(function (req, res) {
        var data = modelUtils.baseModel(req);
        res.render('common/permission', data);
    });

    app.route('/login').get(function (req, res) {

        var data = modelUtils.baseModel(req);
        data.dashboard_title = "User";
        data.loginMessage = req.flash('loginMessage');

        // if(NODE_ENV == 'product'){
        //     // enable captcha in session
        //     var text = svgCaptcha.randomText();
        //     req.session.captcha = text;
        //     data.captcha = svgCaptcha(text);
        // }

        res.render('common/login', data);
    });

    app.route('/user/login').post(checkCaptcha, passport_auth.login_local);

    app.route('/user/logout').get(passport_auth.logout);

    app.route('/*').get(function (req, res) {
        var data = modelUtils.baseModel(req);
        data.dashboard_title = "PAGE NOT FOUND";
        res.render('common/404', data);
    });

};