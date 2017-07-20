var _ = require('underscore');
var express = require('express'),
    router = express.Router(),
    app = express();

var check_roles = function(arr){
	return function(req, res, next){
		res.locals.roles = false;
		if(!_.isEmpty(arr)){
			for(var i in arr){
				if(arr[i] == req.session.user.roles || arr[i] == '*'){
					res.locals.roles = true;
				}
			}
		}
		return next();
	}
};

var check_routes = function(arr, handle){
	for (var i in arr) {
		var temp = arr[i];
		if (!_.isEmpty(temp.method)) {
			for (var j in temp.method) {
				var method = temp.method[j].toLowerCase();
				if(method == 'get' || method == 'post' || method == 'put' || method == 'delete'){
					router[method](temp.routes, check_roles(temp.roles), handle);
				}
				else{
					console.log('method error config: '+ method);
				}
			}
		}
		else{
			router.all(arr[i].routes, check_roles(temp.roles), handle);
		}
	}
};

var denied = function(req, res, next){
	if(res.locals.roles){
		res.redirect('/permission');
	}
	else{
		next();
	}
};

var access = function(req, res, next){
	if(res.locals.roles){
		next();
	}
	else{
		res.redirect('/permission');
	}
};

function check_auth(req, res, next){
	var log = "not logged";
	if (req.isAuthenticated()) {
		var log = JSON.stringify(req.session.user)+ "\n Request:   "+ req.originalUrl+"\n Time:      "+new Date().toJSON();
		console.log("\n"+ log);
		next();
	}
	else{
		console.log("\n"+ log);
		if (req.originalUrl.indexOf("login") == -1) {
			res.redirect('/login');
		}
		else{
			next();
		}
	}
}

module.exports = function(config) {

	if (!_.isEmpty(config.denied)) {
		check_routes(config.denied, denied);
	}

	if(!_.isEmpty(config.access)){
		check_routes(config.access, access);
	}

	return {
		privilege: check_auth,
		router: router
	}
};