/*
    route user
*/
var Common = require('../../configs/common')
var Roles = require('../../middlewares/roles');

module.exports = function(app){
	// API Server Endpoints
var User = require('./controller');

    app.get('/register', Roles(['superadmin']), function(req, res) {
        var data = { siteKey: Common.recaptcha.siteKey }
        res.render('register', data);
    });

    app.get('/login', function(req, res) {
        if(req.user){
            return res.redirect('/');
        }
        var data = { siteKey: Common.recaptcha.siteKey }
        res.render('login', data);
        //res.sendFile(pathRoot + '/server/views/login.html');
    });

	app.post('/register', User.register);
	app.post('/login', User.loginLocal);
    app.get('/logout', User.logout);

    app.get('/user/:token', User.userInfo); //get user info from token

    app.get('/forbidden', function(req, res){
        res.setHeader('Content-Type', 'text/html');
        return res.send('<h1>403 Forbidden ! Permission denied</h1>');
    })
	// app.post('/forgotPassword', User.forgotPassword);
	// app.post('/resendVerificationEmail', User.resendVerificationEmail);
	// app.get('/verifyEmail/:token', User.verifyEmail);

    // app.get('/check', User.check);
    // 

}