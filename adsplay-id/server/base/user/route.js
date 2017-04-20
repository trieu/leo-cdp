/*
    route user
*/
var Common = require('../../configs/common')
var Roles = require('../../middlewares/roles');

module.exports = function(app){
	// API Server Endpoints
var User = require('./controller');

    app.get('/', User.index);

    app.get('/logout', User.logout);
    app.get('/userinfo', User.userInfo); //get user info from token

/**
 * login
 */
    app.get('/login', function(req, res) {
        if(req.user && typeof(req.query.redirect_uri) == undefined){
            return res.redirect('/');
        }
        var data = {};
        data.pageTitle = "Login";
        data.siteKey = Common.recaptcha.siteKey;
        res.render('login', data);
    });
    app.post('/login', User.loginLocal);

/**
 * create
 */
    app.get('/register', function(req, res) {
        var data = {};
        data.pageTitle = "Register";
        data.USER = req.user;
        res.render('register', data);
    });
	app.post('/register', User.register);

/**
 * update
 */
    app.get('/update/:id', User.edit);
    app.post('/update', User.save);

    app.get('/new-password/:id', User.newPassword);
	app.post('/new-password', User.save);

	// app.post('/forgotPassword', User.forgotPassword);
	// app.post('/resendVerificationEmail', User.resendVerificationEmail);
	// app.get('/verifyEmail/:token', User.verifyEmail);

}