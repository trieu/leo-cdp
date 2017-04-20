/*
    controller user
*/
var passport = require('passport')
var Jwt = require('jsonwebtoken')
var Encryption = require('../../helpers/encryption')
var Parameter = require('../../helpers/parameter')
var User = require('./model').User
var Common = require('../../configs/common')
var _ = require('lodash')
var reCAPTCHA=require('recaptcha2')
var recaptcha=new reCAPTCHA({
  siteKey: Common.recaptcha.siteKey,
  secretKey:  Common.recaptcha.secretKey,
  ssl: Common.recaptcha.ssl
});
var last_token = '.adsplay';

exports.index = function (req, res){
    var data = {};
    data.pageTitle = "Home Page";
    data.USER = req.user;
    if(req.user){
        if(req.user.roles['superadmin']){
            User.find({})
                .exec(function(err, user){
                    //console.log(err, user)
                    if(!err && user){
                        data.userInfo = user;
                        return res.render('index', data);
                    }

                    res.render('index', data);
                });
        }
        else{
            res.render('index', data);
        }
    }
    else{
        res.render('index', data);
    }
};

exports.register = function (req, res){
    req.body.password = Encryption.hash(req.body.password);
    console.log(req.body.password)
    User.saveUser(req.body, function(err, user) {
        if (!err) {
            return res.json({success: true, message: "Success! register"});
        } else {
            if (11000 === err.code || 11001 === err.code) {
                return  res.json({success: false, message: "Please provide another username and email"});
            } else{
                return res.json({success: false, message: err }); // HTTP 403
            }
        }
    })
}

// ---------------------------------------------------------
// update contact
// ---------------------------------------------------------
exports.edit = function (req, res){
    User.findOne({"_id": req.params.id})
        .exec(function(err, user){
            console.log(err, user)
            if(!err && user){
                data = {};
                data.pageTitle = "update user";
                data.USER = req.user;
                data.userInfo = user;
                data.userInfo.roles = JSON.stringify(user.roles);
                return res.render('update', data);
            }
            else{
                return res.render('/');
            }
        });
}

exports.newPassword = function (req, res){
    data = {};
    data.pageTitle = "update user";
    data.USER = req.user;
    res.render('new-password', data);
}

exports.save = function (req, res){
    var data = {};
    if(req.body.password){
        req.body.password = Encryption.hash(req.body.password);
    }
    data = req.body;
    console.log(data)
    User.findUserUpdate({"_id": req.body._id}, data, function(err, user){
        if(err){
            return res.json({success: false, message: "Error! update"});
        }

        return res.json({success: true, message: "Success! updated"});
    });
}



// ---------------------------------------------------------
// login => user info
// ---------------------------------------------------------
exports.loginLocal = function (req, res, next){
    //console.log(req.body)
    //check recaptcha
    recaptcha.validateRequest(req)
    .then(function(){
        //use passport login-local
        passport.authenticate('login-local', function(err, user, info) {
            if (err) { return next(err); } 
            if (!user) {
                res.json({ success: false, status:401, message: info.message }); //unauthorized
            }
            else{
                req.logIn(user, function(err) {
                    if (err) { return next(err); }
                    
                    //create token with timers expires
                    var token = Jwt.sign(user, Common.privateKey, {
                        expiresIn: Common.tokenExpiry
                    });
                    token = token + last_token;

                    //redirect uri
                    var param_redirect = req.query.redirect_uri;

                    if(typeof (param_redirect) === "undefined" || param_redirect == ""){
                        return res.json({ success: true, redirect_uri: '/' }); //redirect home index
                    }
                    else{
                        var redirectUri = Parameter.insert(param_redirect, 'access_token', token, false);
                        var param_attach = req.query.attach;
                        if(typeof (param_attach) !== "undefined" && param_attach != ""){
                            var user_info = JSON.stringify(user);
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

	// decode token
	if (token && token.indexOf(last_token) != -1) {
		return res.json(decodeToken(token));
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
    try {
        token = token.replace(".adsplay", "");
        var decoded = Jwt.verify(token, Common.privateKey);
        return { success: true, user_info: decoded };
    } catch(err) {
        return { success: false, message: 'Failed to authenticate token.' };
    }
}

