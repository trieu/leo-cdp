var _ = require('underscore');
var express = require('express'),
    router = express.Router(),
    app = express();

var config_default = {
		access: [
			//if method array is empty => method using all
			{routes: '/creative/*', roles: ['admin', 'operator']},
			{routes: '/placement/*', roles: ['admin', 'operator']},
			{routes: '/campaign/*', roles: ['admin', 'operator']},
			{routes: '/monitor/*', roles: ['admin', 'operator']},
			{routes: '/content/*', roles: ['admin', 'operator']},
			{routes: '/user-profile/*', roles: ['admin', 'operator']},
			{routes: '/booking/*', roles: ['admin', 'operator']},
		],
		denied: [
			//disable roles operator in routes: /creative/list/all with method get
			{routes: '/creative/list/all', roles: ['operator'], method: ['get']},
		]
	};

var check_roles = function(temp, arr){
	if(!_.isEmpty(arr)){
		for(var i in arr){
			var roles = arr[i].roles;
			if(!_.isEmpty(roles)){
				for(var j in roles){
					if(temp == roles[j]){
						return true;
					}
				}
			}
		}
	}
	return false;
};

var check_routes = function(arr, handle){
	for (var i in arr) {
		var temp = arr[i];
		if (!_.isEmpty(temp.method)) {
			for (var j in temp.method) {
				var method = temp.method[j].toLowerCase();
				if(method == 'get' || method == 'post' || method == 'put' || method == 'delete'){
					router[method](temp.routes, handle);
				}
				else{
					console.log('method error config: '+ method);
				}
			}
		}
		else{
			router.all(arr[i].routes, handle);
		}
	}
};

var denied = function(req, res, next){
	if(check_roles(req.user.roles, config_default.denied)){
		res.redirect('/permission');
	}
	else{
		next();
	}
};

var access = function(req, res, next){
	if(check_roles(req.user.roles, config_default.access)){
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

function HasRole() {
	if (!_.isEmpty(config_default.denied)) {
		check_routes(config_default.denied, denied);
	}

	if(!_.isEmpty(config_default.access)){
		check_routes(config_default.access, access);
	}
}
HasRole();

module.exports = {
	privilege: check_auth,
	router: router
};