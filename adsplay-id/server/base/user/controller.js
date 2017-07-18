/*
    controller user
*/
var passport = require('passport')
var Encryption = require('../../helpers/encryption')
var Parameter = require('../../helpers/parameter')
var User = require('./model').User
var Common = require('../../configs/common')
var Token = require('../../helpers/token')
var _ = require('lodash')
var reCAPTCHA=require('recaptcha2')
var recaptcha=new reCAPTCHA({
  siteKey: Common.recaptcha.siteKey,
  secretKey:  Common.recaptcha.secretKey,
  ssl: Common.recaptcha.ssl
});

exports.index = function (req, res){
    var data = {};
    data.pageTitle = "Home Page";
    
    if(req.user){
        data.USER = req.user;
        data.isRegister = data.USER.roles['superadmin'] || data.USER.roles['admin'];
        
        if(data.USER.roles['superadmin']){
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
        else if(data.USER.roles['admin']){
            User.find({})
                .or({"username": data.USER.username})
                .or({"managedby": data.USER.username})
                .exec(function(err, user){
                    if(!err && user){
                        data.userInfo = user;
                        return res.render('index', data);
                    }

                    res.render('index', data);
                });
        }
        else{
            User.find({"username": data.USER.username})
                .exec(function(err, user){
                    
                    if(!err && user){
                        data.userInfo = user;
                        return res.render('index', data);
                    }

                    res.render('index', data);
                });
        }
    }
    else{
        res.redirect('/login');
    }
};


// ---------------------------------------------------------
// register
// ---------------------------------------------------------
exports.register = function (req, res){
    var data = {};
        data.pageTitle = "Register";
        data.USER = req.user;
        res.render('register', data);
}

exports.registerSave = function (req, res){
    var body = req.body;
    var managedby = (req.body.managedby) ? req.body.managedby : Common.superuser.username;
    body.managedby = managedby;
    body.password = Encryption.hash(req.body.password);
    
    //console.log(req.body.password)
    User.saveUser(body, function(err, user) {
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
            //console.log(err, user)
            if(!err && user){
                data = {};
                data.pageTitle = "Update " + user.username;
                data.USER = req.user;
                data.notMe = (data.USER._id == user._id) ? false : true;
                data.isSuperAdmin = (data.USER.roles['superadmin']) ? true : false;
                data.userInfo = user;
                data.userInfo.dataSources = JSON.stringify(user.dataSources);
                data.userInfo.roles = JSON.stringify(user.roles);
                data.userInfo.rolesAds = JSON.stringify(user.rolesAds) || "{}";
                data.userInfo.rolesPlacement = JSON.stringify(user.rolesPlacement) || "{}";
                return res.render('update', data);
            }
            else{
                return res.render('/');
            }
        });
}

exports.newPassword = function (req, res){
    data = {};
    data.pageTitle = "update password";
    data.USER = req.user;
    res.render('new-password', data);
}

exports.save = function (req, res){
    var data = {};
    
    if(req.body.password){
        req.body.password = Encryption.hash(req.body.password);
    }

    if(req.user.roles['superadmin'] || req.user.roles['admin']){

        if(req.body.dataSources){
            req.body.dataSources = convertObjBoolean(req.body.dataSources);
        }
        if(req.body.roles){
            req.body.roles = convertObjBoolean(req.body.roles);
            if(!req.user.roles['superadmin']){
                delete req.body.roles['admin'];
            }
        }

        if(req.body.rolesAds){
            req.body.rolesAds = convertObjBoolean(req.body.rolesAds, true);
        }
        else{
            req.body.rolesAds = {};
        }

        if(req.body.rolesPlacement){
            req.body.rolesPlacement = convertObjBoolean(req.body.rolesPlacement, true);
        }
        else{
            req.body.rolesPlacement = {};
        }

    }

    data = req.body;
    
    User.findUserUpdate({"_id": req.body._id}, data, function(err, user){
        if(err){
            return res.json({success: false, message: "Error! update"});
        }

        return res.json({success: true, message: "Success! updated"});
    });
}


// ---------------------------------------------------------
// logout
// ---------------------------------------------------------
exports.logout = function (req, res, next){
    console.log('log out success !');
    var redirect_uri = req.originalUrl.replace('/logout','');
    req.logout();
    return res.redirect('/login'+redirect_uri);
}

exports.logoutAPI = function (req, res, next){
    req.logout();
    return res.json({ success: true, message: "log out success !!" });
}


// ---------------------------------------------------------
// login 
// ---------------------------------------------------------
var loginLocal = function(req, res, next){
    passport.authenticate('login-local', function(err, user, info) {
        if (err) { return next(err); } 
        if (!user) {
            res.json({ success: false, status:401, message: info.message }); //unauthorized
        }
        else{
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                
                //create token with timers expires
                var token = Token.createToken(user);
                //console.log(token)
                //redirect uri
                var param_redirect = req.query.redirect_uri;
                if(typeof (param_redirect) === "undefined" || param_redirect == ""){
                    return res.json({ success: true, redirect_uri: '/', access_token: token }); //redirect home index
                }
                else{
                    var redirectUri = Parameter.insert(param_redirect, 'access_token', token, false);

                    // attach user info
                    var param_attach = req.query.attach;
                    if(typeof (param_attach) !== "undefined" && param_attach != ""){
                        var user_info = JSON.stringify(user);
                        redirectUri = Parameter.insert(redirectUri, 'user_info', user_info, false);
                    }

                    return res.json({ success: true, redirect_uri: redirectUri, access_token: token });
                }

            });
        }
    })(req, res, next);
};

//login 
exports.loginLocal = loginLocal;

//login view
exports.login = function (req, res){
    if(req.user){
        if(typeof(req.query.redirect_uri) === "undefined"){
            return res.redirect('/');
        }
        else{
            // check loggin redirect webapp client attach token
            var token = Token.createToken(req.user);
            var param_redirect = req.query.redirect_uri;
            var redirectUri = Parameter.insert(param_redirect, 'access_token', token, false);
            var param_attach = req.query.attach;
            if(typeof (param_attach) !== "undefined" && param_attach != ""){
                var user_info = JSON.stringify(user);
                redirectUri = Parameter.insert(redirectUri, 'user_info', user_info, false);
            }
            return res.redirect(redirectUri);
        }
    }
    var data = {};
    data.pageTitle = "Login";
    data.siteKey = Common.recaptcha.siteKey;
    res.render('login', data);
}

exports.loginOnSite = function (req, res, next){
    //console.log(req.body)
    //check recaptcha
    recaptcha.validateRequest(req)
    .then(function(){
        //use passport login-local
        loginLocal(req, res, next);
    })
    .catch(function(errorCodes){
        return res.json({ success: false, message:recaptcha.translateErrors(errorCodes) });
    });

}


// ---------------------------------------------------------
// authentication
// ---------------------------------------------------------
exports.checkToken = function (req, res, next){
    var token = req.query.access_token || req.headers['x-access-token'];
    var checkToken = Token.checkToken(token);// check token
    if (checkToken.success) {
        return res.json({success: true, message: "token good"})
    }
    else{
        return res.json({success: false, message: checkToken.message || "token not valid"});
    }
}

exports.authenticationView = function (req, res, next){
    var data = {};
    data.pageTitle = "Authentication Page";
    
    res.render('authentication', data);
}

exports.authentication = function (req, res, next){
    var redirect_uri = (req.query.redirect_uri.indexOf('id.adsplay') == -1) ? '?redirect_uri='+req.query.redirect_uri : "";
    
    if(req.isAuthenticated()){
        req.body = req.user;
        passport.authenticate('refresh-token', function(err, user, info) {
            if (err) { return next(err); } 
            if (!user) {
                res.json({ success: false, status:401, message: info.message, redirect_uri: '/login'+redirect_uri }); //unauthorized
            }
            else{
                
                req.logIn(user, function(err) {
                    if (err) { return next(err); }
                    
                    //create token with timers expires
                    var refreshToken = Token.createToken(user);

                    var redirect_format = redirect_uri.replace("?redirect_uri=", "");
                        redirect_uri = Parameter.insert(redirect_format, 'access_token', refreshToken, false);
                    
                    return res.json({ success: true, redirect_uri: redirect_uri });

                });
            }
        })(req, res, next);
    }
    else{
        return res.json({ success: false, message: 'Not logged in !', redirect_uri: '/login'+redirect_uri });
    }
}

// ---------------------------------------------------------
// get user info from token
// ---------------------------------------------------------
exports.userInfo = function (req, res, next){

	// check header or url parameters or post parameters for token
	var token = req.query.access_token || req.headers['x-access-token'];

	// decode token
	if (token && token.indexOf(Token.lastToken) != -1) {
		return res.json(Token.decodeToken(token));
	} else {

		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'token not valid'
		});
		
	}
}


// ---------------------------------------------------------
// helper
// ---------------------------------------------------------
var convertObjBoolean = function(temp, int){
    var data = {};
    var regex = /^[0-9a-zA-Z\-]+$/;
    for(var i in temp){
        if(i.match(regex)){
            var key = (int) ? parseInt(i) : i;
            data[key] = true;
        }
    }
    return data;
}

/** @flow
 * 1. client login
 *          -> true -> create session (sessionExpiry) & create token (tokenExpiry)
 *          -> return token for client
 * 2. client use token
 *          -> create cookie token or set headers : { Authorization : 'adsplayid '+ jwt},
 *          -> get user info with token (tokenExpiry default 30 minutes)
 * 3. client refresh token
 *          -> refresh client application -> check authentication and refresh token
 */