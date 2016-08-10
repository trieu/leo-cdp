var _ = require('underscore');
var express = require('express'),
    router = express.Router(),
    app = express();

var config_default = {
		// enable roles 
		access: [
			{routes: '/creative/*', roles: ['*']}, //all roles and all method
			{routes: '/placement/*', roles: ['admin', 'operator']}, //roles admin and operator
			{routes: '/campaign/*', roles: ['admin', 'operator'], method: ['get', 'post']}, //with method get and post
			{routes: '/monitor/*', roles: ['admin', 'operator']},
			{routes: '/content/*', roles: ['admin', 'operator']},
			{routes: '/user-profile/*', roles: ['admin', 'operator']},
			{routes: '/booking/*', roles: ['admin', 'operator']},
		],
		// disable roles
		// denied: [
		// 	{routes: '/creative/list/all', roles: ['operator'], method: ['get']}, //disable operator only routes /creative/list/all
		// ]
	};

var check_roles = function(arr){
	return function(req, res, next){
		res.locals.roles = false;
		if(!_.isEmpty(arr)){
			for(var i in arr){
				if(arr[i] == req.user.roles || arr[i] == '*'){
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
		var log = JSON.stringify(req.user)+ "\n Request:   "+ req.originalUrl+"\n Time:      "+new Date().toJSON();
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

if (!_.isEmpty(config_default.denied)) {
	check_routes(config_default.denied, denied);
}

if(!_.isEmpty(config_default.access)){
	check_routes(config_default.access, access);
}

module.exports = {
	privilege: check_auth,
	router: router
};