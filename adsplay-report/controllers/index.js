/**
 * Created by trieu on 5/27/15.
 */
var modelUtils = require('../helpers/model_utils');
var authorizationConfig = require('../configs/authorization-config');
var fs = require('fs');

module.exports = function (app) {

    //passport
    var passport = require('passport');
    app.use(passport.initialize());
    app.use(passport.session());
    var passport_auth = require('../middlewares/passport-utils.js')(passport);

    //Authorization
    var auth = require('../middlewares/authorization.js')(authorizationConfig);
    app.use(auth.privilege, auth.router);

    /* all router */
    app.use('/creative', require('./creative'));
    app.use('/placement', require('./placement'));
    app.use('/publisher', require('./publisher'));
    app.use('/campaign', require('./campaign'));
    app.use('/monitor', require('./monitor'));
    app.use('/device', require('./device'));
    app.use('/content', require('./content'));
    app.use('/user-profile', require('./user-profile'));
    app.use('/booking', require('./booking'));
    app.use('/export', require('./export_file'));
    app.use('/event', require('./event'));


    app.route('/').get(function (req, res) {
        var data = modelUtils.baseModel(req);
	if(data.isAdminGroup){
		res.render('monitor/home', data);
	} else {
		res.render('creative/list', data);
	}
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

    app.route('/permission').get(function (req, res) {
        var data = modelUtils.baseModel(req);
        res.render('common/permission', data);
    });

    app.route('/login').get(function (req, res) {
        var data = modelUtils.baseModel(req);
        data.dashboard_title = "User";
        data.loginMessage = req.flash('loginMessage');
        res.render('common/login', data);
    })

    app.route('/ping').get(function (req, res) {
        res.writeHeader(200, {"Content-Type": "text/html"});
        res.end('PONG');
    })

    app.route('/user/login').post(passport_auth.login_local);

    app.route('/user/logout').get(passport_auth.logout);

};
