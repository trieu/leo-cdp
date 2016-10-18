var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var passportConfig = require('../configs/passport-config');

//bcrypt = require('bcryptjs'); //thư viện mã hóa
module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		if (NODE_ENV == 'dev') {
			find_user_local_id(id, done);
		}
		else{
			User.findById(id, function(err, user) {
				done(err, data_show(user));
			});
		}
	});
	// setup default field
	passport.use('login-local', new LocalStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, username, password, done) {
		
		if(NODE_ENV == 'dev'){
			find_user_local(username, password, done);
		}
		else{
			// Delay the execution of findOrCreateUser and execute 
			// the method in the next tick of the event loop
			process.nextTick(function(){
				User.findOne({ 'username' :  username }, function(err, user) {
					if (err){ return done(err); }
					else{
						//console.log(password, user.password)
						if(user && user.validPassword(password, user.password)){
							return done(null, data_show(user));// all is well, return successful user
						}
						else{
							return done(null, false, { success: false });
						}
					}
				});
			});
		}
		

	}));


	// find user local with _id
	var find_user_local_id = function(id, done){
		for (var i in passportConfig) {
			if(passportConfig[i]._id == id){
				done(null, data_show(passportConfig[i]));
			}
		}
	}
	// user local file passport-config
	var find_user_local = function(username, password, done){
		//check username return object
		var obj = getObjects(passportConfig,'', username);

		if (typeof obj[0] !== 'undefined' && obj[0] !== null ) {

			if (typeof obj[0]['password'] !== "undefined" && obj[0]['password'] !== null ) {
				if (obj[0]['password'] == password) {
					return done(null, data_show(obj[0]));
				}
				return done(null, false, { message: false });

			}
			return done(null, false, { message: false });

		}
		else{
			return done(null, false, { message: false });
		}
	}

	var data_show = function(user){
		return {
			id: user._id,
			username: user.username,
			roles: user.roles,
			status: user.status || 1
		};
	};

	function login_local(req, res, next) {
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
	};

	function register(req, res, next){
		process.nextTick(function() {
			var query = User.findOne({}).select('_id email').or([{'username' : req.body.username}, {'email' : req.body.email}]);

			query.exec(function (err, user) {
				console.log(err, user)
				if (err) return done(err);
				if (user) {
					var message;
					if(user.username == req.body.username){
						message = 'That username is taken. ';
					}
					else if(user.email == req.body.email){
						message = message + 'That email is taken. ';
					}
					req.flash('registerMessage', message);
					res.redirect('/register');
				}
				else {
					var user = new User();
					user.username = req.body.username;
					user.email = req.body.email;
					user.password = user.generateHash(req.body.password);
					user.gender = req.body.gender;
					user.status = 1;
					
					user.save(function(err, obj){
						if(err){
							return console.error(err);
						}
						res.redirect('/user/details/'+obj._id);
					});

				}
			});
		});
	};

	return {
		login_local: login_local,
		register: register,
		logout: function(req, res){
			req.logout();
			res.redirect('/login');
		}
	}
}

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
