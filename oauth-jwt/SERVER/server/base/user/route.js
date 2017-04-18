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
    app.get('/user/:token', User.userInfo); //get user info from token

    app.get('/login', function(req, res) {
        if(req.user){
            return res.redirect('/');
        }
        var data = {};
        data.pageTitle = "Login";
        data.siteKey = Common.recaptcha.siteKey;
        res.render('login', data);
        //res.sendFile(pathRoot + '/server/views/login.html');
    });
    app.post('/login', User.loginLocal);


    app.get('/register', function(req, res) {
        var data = {};
        data.pageTitle = "Register";
        res.render('register', data);
    });
	app.post('/register', User.register);

    app.get('/edit/:id', User.edit);
    app.post('/save', User.save);

	// app.post('/forgotPassword', User.forgotPassword);
	// app.post('/resendVerificationEmail', User.resendVerificationEmail);
	// app.get('/verifyEmail/:token', User.verifyEmail);

    // app.get('/check', User.check);
    // 

}