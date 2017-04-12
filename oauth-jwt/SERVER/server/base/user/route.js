/*
    route user
*/
var Common = require('../../configs/common')

module.exports = function(app){
	// API Server Endpoints
var User = require('./controller');

    app.get('/register', function(req, res) {
        var data = { siteKey: Common.recaptcha.siteKey }
        res.render('register', data);
    });

    app.get('/login', function(req, res) {
        var data = { siteKey: Common.recaptcha.siteKey }
        res.render('login', data);
        //res.sendFile(pathRoot + '/server/views/login.html');
    });

	app.post('/register', User.register);
	app.post('/login', User.loginLocal);
    app.get('/logout', User.logout);

    app.get('/user/:token', User.userInfo); //get user info from token
	// app.post('/forgotPassword', User.forgotPassword);
	// app.post('/resendVerificationEmail', User.resendVerificationEmail);
	// app.get('/verifyEmail/:token', User.verifyEmail);

    // app.get('/check', User.check);
    // 

}