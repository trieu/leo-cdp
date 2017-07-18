/**
 * Created by trieu on 5/27/15.
 */
var modelUtils = require('../helpers/model_utils');
var svgCaptcha = require('svg-captcha');
var fs = require('fs');
var adsplayid = require('../middlewares/adsplayid');

module.exports = function (app) {


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

    app.use('/vast', require('./vast'));
    //______________ middleware auth
    var config = {
        sso_url: "http://id.adsplay.net",
        callback_url: "/callback"
    }
    app.use(adsplayid(config).authentication);
    app.route('/user/logout').get(adsplayid(config).logout);

    //______________ all router with authorization
    app.use('/creative', require('./creative'));
    app.use('/placement', require('./placement'));
    app.use('/publisher', require('./publisher'));
    app.use('/campaign', require('./campaign'));
    app.use('/campaign-details', require('./campaign-details'));
    app.use('/monitor', require('./monitor'));
    app.use('/device', require('./device'));
    app.use('/content', require('./content'));
    app.use('/booking', require('./booking'));
    app.use('/export', require('./export_file'));
    app.use('/event', require('./event'));
    app.use('/flight', require('./flight'));
    app.use('/inventory', require('./inventory'));
    app.use('/epl-report', require('./epl-report'));
    //app.use('/user', require('./user'));
    //app.use('/user-profile', require('./user-profile'));
    
    app.route('/').get(function (req, res) {
        var data = modelUtils.baseModel(req);
        data.graphName = req.query.graphName != null ? req.query.graphName : 'AdsPlay Home';
        
        res.render('monitor/home', data);

    });

    app.route('/permission').get(function (req, res) {
        var data = modelUtils.baseModel(req);
        res.render('common/permission', data);
    });

    app.route('/*').get(function (req, res) {
        var data = modelUtils.baseModel(req);
        data.dashboard_title = "PAGE NOT FOUND";
        res.render('common/404', data);
    });

};
