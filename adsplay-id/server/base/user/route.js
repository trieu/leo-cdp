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
    app.get('/register', Roles(['superadmin', 'admin']), User.register);
	app.post('/register', Roles(['superadmin', 'admin']), User.registerSave);

    /**
     * update
     */
    app.get('/update/:id', Roles(['*']), User.edit);
    app.post('/update', Roles(['*']), User.save);

    app.get('/new-password/:id', Roles(['*']), User.newPassword);
	app.post('/new-password', Roles(['superadmin', 'admin', 'operator']), User.save);
    app.get('/change-password', Roles(['*']), User.changePasswordPage);
    app.post('/change-password', Roles(['*']), User.changePassword);

	// app.post('/forgotPassword', User.forgotPassword);
	// app.post('/resendVerificationEmail', User.resendVerificationEmail);
	// app.get('/verifyEmail/:token', User.verifyEmail);

}