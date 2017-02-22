/*
    controller user
*/
var passport = require('passport')
var Jwt = require('jsonwebtoken')
var Crypto = require('../../helpers/crypto')
var Parameter = require('../../helpers/parameter')
var User = require('./model').User
var Common = require('../../configs/common')
var _ = require('lodash')
var reCAPTCHA=require('recaptcha2')
var recaptcha=new reCAPTCHA({
  siteKey: Common.recaptcha.siteKey,
  secretKey:  Common.recaptcha.secretKey,
  ssl: Common.recaptcha.ssl
})

exports.register = function (req, res){
    req.body.password = Crypto.encrypt(req.body.password);
    User.saveUser(req.body, function(err, user) {
        if (!err) {
            return res.json({success: true, message: "Success register"});
        } else {
            if (11000 === err.code || 11001 === err.code) {
                return  res.json({success: false, message: "Please provide another username and email"});
            } else{
                return res.json({success: false, message: err }); // HTTP 403
            }
        }
    })
}

exports.loginLocal = function (req, res, next){
    console.log(req.body)
    //check recaptcha
    recaptcha.validateRequest(req)
    .then(function(){
        //use passport login-local
        passport.authenticate('login-local', function(err, user, info) {
            console.log(user)
            if (err) { return next(err); } 
            if (!user) {
                res.json({ success: false, status:401, message: "Unauthorized." }); //unauthorized
            }
            else{
                req.logIn(user, function(err) {
                    if (err) { return next(err); }
                    
                    //create token with timers expires
                    var token = Jwt.sign(user, Common.privateKey, {
                        expiresIn: Common.tokenExpiry
                    });

                    //redirect uri
                    var param_redirect = req.query.redirect_uri;

                    if(typeof (param_redirect) == "undefined" || param_redirect == ""){
                        return res.json({ success: true, redirect_uri: '/' }); //redirect home index
                    }
                    else{
                        var redirectUri = Parameter.insert(param_redirect, 'access_token', token, false);
                        var param_attach = req.query.attach;
                        console.log(param_attach)
                        if(typeof (param_attach) != "undefined" || param_attach != ""){
                            var user_info = JSON.stringify(decodeToken(token))
                            redirectUri = Parameter.insert(redirectUri, 'user_info', user_info, false);
                        }
                        return res.json({ success: true, redirect_uri: redirectUri });
                    }

                });
            }
        })(req, res, next);
    })
    .catch(function(errorCodes){
        return res.json({ success: false, message:recaptcha.translateErrors(errorCodes) });
    });

}

// ---------------------------------------------------------
// decode token => user info
// ---------------------------------------------------------
exports.userInfo = function (req, res, next){

	// check header or url parameters or post parameters for token
	var token = req.query.access_token || req.headers['x-access-token'];
    console.log(token)
	// decode token
	if (token) {

		// verifies secret and checks exp
		Jwt.verify(token, Common.privateKey, function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				return res.json({ success: true, user_info: JSON.stringify(decoded) });	
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
		
	}
}

exports.logout = function (req, res, next){
    req.logout();
    return res.json({ success: true, message: "log out success !!" });
}

// ---------------------------------------------------------
// decode token
// ---------------------------------------------------------
var decodeToken = function(token){
    return Jwt.verify(token, Common.privateKey);
}

