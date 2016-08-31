var site = require('../configs/site');
var flighting_hourly = require('../models/flighting').flighting_hourly;
var Sync = require('sync');
var moment = require('moment');
var _ = require('underscore');
var request = require('request');
var schedule = require('node-schedule');

var nodemon = require('nodemon');

//____  create data  with { id = id creative , begin <= "running booking" < end } 

var io_create = function(items, callback){
	for (var i in items) {
		flighting_hourly.findOneAndUpdate({id: items[i].id}, items[i], {upsert:true}, function(err, doc){
			if(err){
				return console.error(err);
			}
		});	
	}
	callback();
};

//hanlde schedule
var io_schedule = function(callback){
	flighting_hourly.find({}, function(err, doc){
		if(err){
			return console.error(err);
		}

		if(_.isEmpty(doc)){
			return console.error('no data !');
		}

		for(var i in doc){
			var now = new Date().getTime();
			var begin = new Date(doc[i].begin).getTime();
			var end = new Date(doc[i].end).getTime();

			//first set
			if(begin >= end){
				return console.error('data error');
			}
			else if(now >= begin && now < end){
				api_update(doc[i].id, '2');
			}
			else{
				api_update(doc[i].id, '1');
			}

			//set auto running
			set_schedule(doc[i].id, doc[i].begin, '2');

			//set auto pending
			set_schedule(doc[i].id, doc[i].end, '1');
		}
		//callback();
	});

};

var	set_schedule = function(id, time, status){
	var rule = new schedule.RecurrenceRule();
			rule.dayOfWeek = [0, new schedule.Range(0, 6)];
			rule.hour = moment(time).get('hour');
			rule.minute = moment(time).get('minute');

	//status = running check total booking
	schedule.scheduleJob(rule, function(){
		api_update(id, status);
	});

};

var api_update = function(id, status){
	if(status == '2'){
		api_checkBooking(id, function(data){
			if(data != null){
				request.patch(site.api_domain + '/api/creatives/' + id).form(JSON.stringify({ status: status }));
				console.log('updated : id ' +id+ ' status '+ status);
			};
		});
	}
	else{
		request.patch(site.api_domain + '/api/creatives/' + id).form(JSON.stringify({ status: status }));
		console.log('updated : id ' +id+ ' status '+ status);
	}
}

var api_checkBooking = function(id, callback){
	request(site.api_domain + '/api/creatives/' + id ,function (error, response, body) {
		if (!error && response.statusCode == 200) {
			if(body.tBk < 0 || body.tBk >= body.totalRevenue ){
				callback(null);
			}
			else{
				callback(JSON.parse(body));
			}
		}
    });
};

Sync(function(){
	var items = [
		{id: '1064', booking: 0, begin: '8/31/2016, 9:00:00 AM' , end: '8/31/2016, 1:28:00 PM'},
		{id: '1052', booking: 0, begin: '8/31/2016, 9:00:00 AM' , end: '8/31/2016, 1:27:00 PM'}
	];

	try {
		//create 
        io_create.sync(null, items);
        //set schedule
        io_schedule.sync(null);

    }
    catch (e) {
        console.error(e); // something went wrong 
    }

});