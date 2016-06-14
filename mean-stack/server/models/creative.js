var moment = require('moment');
var req_utils = require('../helpers/request_utils.js');


exports.list = function (url) {
	
	req_utils.get(url, function(data){
		var filteredList = [];
		data.forEach(function (crt) {
	        crt.name = crt.name || '-';
	        if (crt.name === 'Default') {
	            crt.name = 'Default Creative';
	        }
	        // crt.runDate = crt.runDate || 'Jul 1, 2015 12:00:00 AM';
	        // crt.expiredDate = crt.expiredDate || 'Jul 21, 2015 12:00:00 AM';

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
	        //crt.status = constantUtils.getStatus(crt.status);
	        crt.ctr = (crt.ctr * 100).toFixed(2);
	        crt.tvr = (crt.tvr * 100).toFixed(2);
	        if (crt.totalRevenue == 0) {
	            crt.totalRevenue = "-";
	        }

	        filteredList.push(crt);
	    });

	    console.log('2');
		return filteredList;

		
	});
	console.log('3');
};