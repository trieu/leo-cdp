var express = require('express')
    ,router = express.Router();

var Sync = require('sync');
var moment = require('moment');
var xl = require('excel4node');

var Redis = require('ioredis'),  
    redis = new Redis({port: 6482, host: '42.119.252.87'});

//https://monitor.adsplay.net/epl-report/excel?match=2016-12-04,01,22&match=2016-12-05,04,22

router.get('/excel', function(req, res, next){
	Sync(function(){
		try{
			//-------------------------------calculate form redis
			//req.query.match 2016-12-04,00,20 
			//          		  date  ,hour

			var item = [];
			if(Array.isArray(req.query.match)){
				var query = req.query.match; //array match
				for (var i in query) {
					item.push(query[i]);
				}
			}
			else{
				item.push(req.query.match);
			}
			
			var MATCH = [];
			for(i in item){
				var result = DATE_HANDLE.sync(null, item[i]); //Group match of 1 day
				//console.log(result);
				
				//sum all match
				var pre = 0, mid = 0, post = 0;
				var key = result[0].key;
				for(m in result){
					pre+=result[m].view[0];
					mid+=result[m].view[1];
					post+=result[m].view[2];
				}
				MATCH.push({key: key, pre: pre, mid: mid, post:post});
			}
			//-------------------------------calculate form redis



			//--------------------------------export excel
			var wb = new xl.Workbook();// Create a new instance of a Workbook class 
			var ws = wb.addWorksheet('Sheet Toshiba');// Add Worksheets to the workbook 
			var bold = wb.createStyle({
				font: {
					bold: true,
				}
			});
			var numFormat = wb.createStyle({
				numberFormat: '#,##0; (#,##0); -'
			});
			
			//title
			ws.cell(1, 1, 1, 4, true).string('Toshiba Livestream TVC Ad in EPL').style(bold);
			//category
			ws.cell(3,1).string('Pre-match');
			ws.cell(4,1).string('Haft-match');
			ws.cell(5,1).string('Post-match');
			ws.cell(6,1).string('Daily total').style(bold);
			ws.cell(7,1).string('Total summary').style(bold);

			//date title
			var col_date = 2;
			for(var i in MATCH){
				ws.cell(2,col_date).string(MATCH[i].key).style(bold);
				col_date++;
			}
			
			//calculator target
			var target = 0;
			var targetDefault = req.query.target || 2000000;
			for(var i in MATCH){
				target = target + MATCH[i].pre + MATCH[i].mid + MATCH[i].post;
			}
			var xTarget = (targetDefault > target) ? Math.ceil(targetDefault/target) : 1;

			//number
			var sum = 0;
			var col_number = 2;
			for(var i in MATCH){
				ws.cell(3,col_number).number(MATCH[i].pre * xTarget).style(numFormat);
				ws.cell(4,col_number).number(MATCH[i].mid * xTarget).style(numFormat);
				ws.cell(5,col_number).number(MATCH[i].post * xTarget).style(numFormat);
				col_number++;
				sum++;
			}
			
			// Sum 
			var sumAll = "";
			var charCode = 66; // = B
			var col_sum = 2;
			for(var k = 0; k < sum; k++){
				var charStr = String.fromCharCode(charCode);
				var sumDay = charStr+ "3+" + charStr + "4+" + charStr + "5";
				sumAll = sumAll + charStr + "6+";
				ws.cell(6, col_sum).formula(sumDay).style(numFormat);
				
				charCode++;
				col_sum++;
			}

			// total Sum
			var col_sumAll = sumAll.slice(0, -1);
			ws.cell(7, 2, 7, sum+1, true).formula(col_sumAll).style(numFormat).style(bold);

			var nameXml = "Livestream-tvc-xtarget" + xTarget + ".xlsx";
			wb.write(nameXml, res);
			//--------------------------------export excel
			
		}
		catch (e) {
			console.error(e);
		}
	});

	function MHGETALL_P(keys, cb) {
		var group = {};
		group.key = keys[0].slice(0,10); //get date
		group.time = keys[0].slice(11);	//get hour start match
	    var pipeline = redis.pipeline();

	    keys.forEach(function(key, index){
	        pipeline.hgetall('m:'+key);
	    });

	    pipeline.exec(function(err, result){
	    	group.view = [];
	    	for(var k in result){
	    		var arr = result[k][1];
	    		var count = 0;
	    		for (var i in arr) {
					if(i == 'pvpm-101' || i == 'pvpm-201' || i == 'pvpm-301' || i == 'pvpm-307'){
						count += parseInt(arr[i]); //sum
					}
				}
				group.view.push(count);
	    	}
	        cb(err, group);
	    });
	}

	function DATE_HANDLE(item, callback){
		Sync(function(){
			try{
				var itemSplit = item.split(',');
				var iDate = itemSplit[0];
				var Match = new Array();

				for (var i = 0; i < itemSplit.length; i++) {
					if(i > 0){
						var iMatch = [];
						var temp = iDate + " " + itemSplit[i];
						iMatch.push(moment(temp).format('YYYY-MM-DD-HH')); //Pre-match
						iMatch.push(moment(temp).add(1, 'hour').format('YYYY-MM-DD-HH')); //Haft-match
						iMatch.push(moment(temp).add(2, 'hours').format('YYYY-MM-DD-HH')); //Post-match

						//hgetall
						var result = MHGETALL_P.sync(null, iMatch);
						Match.push(result);
					}
				}
				callback(null, Match);

			}
			catch (e) {
				console.error(e);
			}
		});
		
	}
});

router.get('/banner-view', function(req, res, next){
	Sync(function(){
		try{
			//https://monitor.adsplay.net/epl-report/banner-view?begin=2017-01-01&end=2017-01-03
			var begin = req.query.begin;
			var end = req.query.end;
			function between_date(begin, end){
				var dateArray = [];
				var get_time_begin = new Date(begin).getTime();
				var get_time_end = new Date(end).getTime();
				while (get_time_begin <= get_time_end) {
					dateArray.push(moment(get_time_begin).format('YYYY-MM-DD'));
					get_time_begin = moment(get_time_begin).add(1, 'day');
				}
				return dateArray;
			}
			
			var result = COUNTVIEW.sync(null, between_date(begin, end));
			//console.log(result);

			//--------------------------------export excel
			var wb = new xl.Workbook();// Create a new instance of a Workbook class 
			var ws = wb.addWorksheet('Sheet Toshiba');// Add Worksheets to the workbook 
			var bold = wb.createStyle({
				font: {
					bold: true,
				}
			});
			var numFormat = wb.createStyle({
				numberFormat: '#,##0; (#,##0); -'
			});
			
			//title
			ws.cell(1, 1, 1, 4, true).string('Toshiba Banner View').style(bold);
			//category
			ws.cell(2,2).string('View Number');

			//date title
			var col_date = 3;
			for(var i in result){
				ws.cell(col_date, 1).string(result[i].date);
				col_date++;
			}
			
			//number
			var sum_view = 0;
			var col_number = 3;
			for(var i in result){
				ws.cell(col_number, 2).number(result[i].view).style(numFormat);
				col_number++;
				sum_view += result[i].view;
			}
			
			// Sum 
			ws.cell(col_number, 1).string('Sum View').style(bold);
			ws.cell(col_number, 2).number(sum_view).style(numFormat);

			var nameXml = "Toshiba-Banner-View-" + sum_view + ".xlsx";
			wb.write(nameXml, res);
			//--------------------------------export excel
		}
		catch (e) {
			console.error(e);
		}
	});

	function COUNTVIEW(keys, cb) {
		var group = {};
	    var pipeline = redis.pipeline();

	    keys.forEach(function(key, index){
	        pipeline.pfcount('pv:'+key+':u:fptplay.net:web-home-epl');
	    });

	    pipeline.exec(function(err, result){
	    	group.view = [];
			for(var k in result){
				group.view.push({
					date: keys[k],
					view: result[k][1]
				});
			}
	        cb(err, group.view);
	    });
	}

})
module.exports = router;