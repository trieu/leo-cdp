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
    app.get('/logoutJSON', User.logoutJSON);
    app.get('/userinfo', User.userInfo); //get user info from token

    /**
     * login
     */
    app.get('/login', User.login);
    app.post('/login', User.loginLocal);

    /**
     * create
     */
    app.get('/register', User.register);
	app.post('/register', User.registerSave);

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