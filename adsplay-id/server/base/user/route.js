/*
    route user
*/
// var Common = require('../../configs/common')
var Roles = require('../../middlewares/roles');

module.exports = function(app){
	// API Server Endpoints
    var User = require('./controller');

    app.get('/', User.index);

    /**
     * logout
     */
    app.get('/logout', User.logout);
    app.get('/logout/api', User.logoutAPI);

    /**
     * login
     */
    app.get('/login', User.login);
    app.post('/login', User.loginOnSite);
    app.post('/login/api', User.loginLocal);

    /**
     * user 
     */
    app.get('/authentication', User.authenticationView); //authentication check login
    app.post('/authentication', User.authentication); //authentication check login
    app.get('/check-token', User.checkToken);
    app.get('/userinfo', User.userInfo); //get user info from token

    /**
     * create
     */
    app.get('/register', Roles(['superadmin']), User.register);
	app.post('/register', User.registerSave);

    /**
     * update
     */
    app.get('/update/:id', Roles(['superadmin']), User.edit);
    app.post('/update', User.save);

    app.get('/new-password/:id', Roles(['superadmin']), User.newPassword);
	app.post('/new-password', User.save);

	// app.post('/forgotPassword', User.forgotPassword);
	// app.post('/resendVerificationEmail', User.resendVerificationEmail);
	// app.get('/verifyEmail/:token', User.verifyEmail);

}