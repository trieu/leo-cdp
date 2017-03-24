var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

//bcrypt = require('bcryptjs'); //thư viện mã hóa
module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, output(user));
		});
	});
	// setup default field
	passport.use('login-local', new LocalStrategy({
		usernameField : 'username',
		passwordField : 'password'
	},
	function(username, password, done) {
		process.nextTick(function(){
			User.findOne({ 'username' :  username }, function(err, user) {
				if (err){ return done(err); }
				else{
					if(user && user.validPassword(password, user.password)){
						return done(null, output(user));// all is well, return successful user
					}
					return done(null, false, { message: false });
				}
			});
		});

	}));

	//output data user json
	var output = function(user){
		return {
			id: user._id,
			username: user.username,
			roles: user.roles
		};
	};

	return {
		loginLocal: function(req, res, next) {
			passport.authenticate('login-local', function(err, user, info) {
				if (err) { return next(err); } 
				if (!user) {
					//res.sendStatus(401); //unauthorized
					res.json({ USER: {} }); //unauthorized
				}
				else{
					req.logIn(user, function(err) {
						if (err) { return next(err); }
						res.json({ USER: user });
					});
				}
			})(req, res, next);
		},
		isLoggedIn: function(req, res, next){
			if (req.isAuthenticated()){
				res.json({ USER: req.user });
			}
			else{
				res.json({ USER: {} }); //unauthorized
			}
		},
		logOut: function(req, res){
			req.logout();
			res.sendStatus(200);
		}

	}
}