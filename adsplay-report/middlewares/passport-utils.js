var LocalStrategy = require('passport-local').Strategy;

var passportConfig = require('../configs/passport-config');

//bcrypt = require('bcryptjs'); //thư viện mã hóa
module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	passport.deserializeUser(function(id, done) {
		/*
		User.findById(id, function(err, user) {
			done(err, data_return(user));
		});
		*/
		for (var i in passportConfig) {
			if(passportConfig[i]._id == id){
				done(null, data_return(passportConfig[i]));
			}
		}
	});
	// setup default field
	passport.use('login-local', new LocalStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, username, password, done) {
		//check username return object
		var obj = getObjects(passportConfig,'', username);

		if (typeof obj[0] !== 'undefined' && obj[0] !== null ) {

			if (typeof obj[0]['password'] !== "undefined" && obj[0]['password'] !== null ) {
				if (obj[0]['password'] == password) {
					return done(null, data_return(obj[0]));
				}
				return done(null, false, { message: false });

			}
			return done(null, false, { message: false });

		}
		else{
			return done(null, false, { message: false });
		}

	}));



	var data_return = function(user){
		return {
			id: user._id,
			username: user.username,
			roles: user.roles
		};
	};

	var	getObjects = function (obj, key, val) {
		var objects = [];
		for (var i in obj) {
			if (!obj.hasOwnProperty(i)) continue;
			if (typeof obj[i] == 'object') {
				objects = objects.concat(getObjects(obj[i], key, val));    
			} 
			else if (i == key && obj[i] == val || i == key && val == '') {
				//if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
				objects.push(obj);
			}
			else if (obj[i] == val && key == ''){
				//only add if the object is not already in the array
				if (objects.lastIndexOf(obj) == -1){
					objects.push(obj);
				}
			}
		}
		return objects;
	}

	return {
		login_local: function(req, res, next) {
			passport.authenticate('login-local', function(err, user, info) {
				if (err) { return next(err); } 
				if (!user) {
					info.message == false ? req.flash('loginMessage','Wrong username or password') : req.flash('loginMessage','Input empty');
					res.redirect('/login');
				}
				else{
					req.logIn(user, function(err) {
						if (err) { return next(err); }
						res.redirect('/creative/list');
					});
				}
			})(req, res, next);
		},
		logout: function(req, res){
			req.logout();
			res.redirect('/login');
		}
	}
}