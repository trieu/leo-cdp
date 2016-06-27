var moment = require('moment');
var Sync = require('sync');
var req_utils = require('../helpers/request_utils.js');
var constantUtils = require('../helpers/constant_utils');
var stringUtils = require('../helpers/string_utils');

exports.list = function (url, user, callback) {

	Sync(function(){
		try{
			var result = req_utils.get.sync(null, url);
		
			var filteredList = [];
			result.forEach(function (crt) {

				crt.name = crt.name || '-';
				crt.name = (crt.name === 'Default') ? 'Default Creative' : crt.name;

				if (crt.runDate) {
					var runDate = moment(crt.runDate, 'MMM D, YYYY hh:mm:ss A');
					crt.runDate = runDate.format('YYYY-MM-DD');
				} else {
					crt.runDate = 'N/A';
				}
				if (crt.expiredDate) {
					var expiredDate = moment(crt.expiredDate, 'MMM D, YYYY hh:mm:ss A');
					crt.expiredDate = expiredDate.format('YYYY-MM-DD');
				} else {
					crt.expiredDate = 'N/A';
				}

				crt.active = crt.status == 2;
				crt.status = constantUtils.getStatus(crt.status);
				crt.ctr = (crt.ctr * 100).toFixed(2);
				crt.tvr = (crt.tvr * 100).toFixed(2);

				crt.imp = stringUtils.formatCurrency(crt.imp);
				crt.c = stringUtils.formatCurrency(crt.c);
				crt.totalRevenue = (crt.totalRevenue == 0) ? "-" : stringUtils.formatCurrency(crt.totalRevenue);

				if(user.roles == 'all'){
					filteredList.push(crt);
				}
				else if(user.id == 1002 && crt.name.toLowerCase().indexOf('vivid') >= 0){
					filteredList.push(crt);
				}
				else if(user.id == 1003 && crt.name.toLowerCase().indexOf('fptplay') >= 0){
					filteredList.push(crt);
				}
				else if(user.id == 1004 && crt.name.toLowerCase().indexOf('lava') >= 0){
					filteredList.push(crt);
				}
				else if(user.id == 1005 && crt.name.toLowerCase().indexOf('ambient') >= 0){
					filteredList.push(crt);
				}

			});

			callback(null, filteredList);
		}

		catch (e) {
			console.error(e);
		}
		
	});

};

exports.read = function (url, callback) {

	Sync(function(){
		try{
			var result = req_utils.get.sync(null, url);

			callback(null, result);
		}

		catch (e) {
			console.error(e);
		}
		
	});

};