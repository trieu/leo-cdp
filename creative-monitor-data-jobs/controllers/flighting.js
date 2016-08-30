var site = require('../configs/site');
var flighting_daily = require('../models/flighting').flighting_daily;
var moment = require('moment');
var _ = require('underscore');
var request = require('request');
var schedule = require('node-schedule');


//___ create data 
// id = id creative , begin <= "running booking" < end 
// var items = [
// 	{id: '1052', booking: 0, begin: '8/30/2016, 1:53:33 PM' , end: '8/30/2016, 2:53:33 PM'}
// ];
// for (var i in items) {

// 	flighting_daily.findOne({id: items[i].id}, function(err, doc){

// 		if(err){
// 			return console.error(err);
// 		}
// 		if(_.isEmpty(doc)){
// 			var obj = new flighting_daily(items[i]);
// 			obj.save(function(err, obj){
// 				if(err){
// 					return console.error(err);
// 				}
// 			});
// 		}
// 	});
// }

flighting_daily.find({}, function(err, doc){
	if(err){
		return console.error(err);
	}

	if(_.isEmpty(doc)){
		return console.log('no data !');
	}

	for(var i in doc){
		var now = new Date().getTime();
		var begin = new Date(doc[i].begin).getTime();
		var end = new Date(doc[i].end).getTime();

		//first set
		if(now >= begin && now < end){
			update(doc[i].id, '2');
		}
		else{
			update(doc[i].id, '1');
		}

		//____auto run schedule job____

		//set auto running
		set_schedule(doc[i].id, doc[i].begin, '2');

		//set auto pending
		set_schedule(doc[i].id, doc[i].end, '1');
	}

});

var	set_schedule = function(id, time, status){
	var rule = new schedule.RecurrenceRule();
	rule.dayOfWeek = [0, new schedule.Range(0, 6)];
	rule.hour = moment(time).get('hour');
	rule.minute = moment(time).get('minute');
	
	schedule.scheduleJob(rule, function(){
		console.log('update : id ' +id+ ' status '+ status);
		update(id, status);
	});
};

var update = function(id, status){
	request.patch(site.api_domain + '/api/creatives/' + id).form(JSON.stringify({ status: status }));
	// console.log(site.api_domain + '/api/creatives/' + id +' ____updated....')
}