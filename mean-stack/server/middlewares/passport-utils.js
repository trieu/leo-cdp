var LocalStrategy = require('passport-local').Strategy;

var dataDemo = require('../configs/passport-config');

//bcrypt = require('bcryptjs'); //thư viện mã hóa
module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	passport.deserializeUser(function(id, done) {
		/*
		User.findById(id, function(err, user) {
			done(err, output(user));
		});
		*/
		for (var i in dataDemo) {
			if(dataDemo[i]._id == id){
				done(null, output(dataDemo[i]));
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
		/*
			step
			1. check username
			└──> true -> 2. check password
							└──> true -> return json 
		*/

		var obj = getObjects(dataDemo,'', username);

		if (typeof obj[0] !== 'undefined' && obj[0] !== null ) {

			if (typeof obj[0]['password'] !== "undefined" && obj[0]['password'] !== null ) {
				if (obj[0]['password'] == password) {
					return done(null, output(obj[0])); //return {id, username, roles}
				}
				return done(null, false, { message: false });

			}
			return done(null, false, { message: false });

		}
		else{
			return done(null, false, { message: false });
		}

	}));

	//output data user json
	var output = function(user){
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
		loginLocal: function(req, res, next) {
			passport.authenticate('login-local', function(err, user, info) {
				if (err) { return next(err); } 
				if (!user) {
					res.sendStatus(401); //unauthorized
				}
				else{
					req.logIn(user, function(err) {
						if (err) { return next(err); }
						res.json({ message: user });
					});
				}
			})(req, res, next);
		},
		isLoggedIn: function(req, res, next){
			if (req.isAuthenticated()){
				return next();
			}
			else{
				res.json({ message: false });
			}
		},
		logOut: function(req, res){
			req.logout();
			res.sendStatus(200);
		}

	}
}