var Sync = require('sync');
var moment = require('moment');
var later = require('later');
var ArrayUtils = require('./array_utils');
var site = require('../configs/site');
var dataUtils = require('./data_utils.js');
var creativeModel = require('../models/creative.js');
var scheduler = require('node-schedule');

function Schedule(period){
    this.period = period;
    var _this = this;
    _this.updateStatus();
    setInterval(function(){
        _this.updateStatus();
    }, _this.period);

    // schedule daily
    // schedule every 00:02am
    scheduler.scheduleJob({hour: 0, minute: 02, dayOfWeek: [0, 1, 2, 3, 4, 5, 6]}, _this.handleDailyBooking);

}

Schedule.prototype.updateStatus = function (){
    console.log("==> run schedule with ",this.period)
	var current = new Date().getTime();

    // check ads creative in 30 days    
    // var now = new moment().format("YYYY-MM-DD");
    // var begin = new moment().subtract(30, 'days').format("YYYY-MM-DD");
    // var urlList = site.api_domain + '/api/creative/summary?begin='+begin+'&end'+now;
    var now = new moment().format("YYYY-MM-DD");
	var urlList = site.api_domain + '/api/creative/summary?begin=2016-09-01';
    var urlDetail = site.api_domain + '/api/creatives/';
    var urlDaily = site.api_domain + '/api/creative/stats/';

	Sync(function(){
        try{
            // result from callback
            var result = dataUtils.request.sync(null, urlList);
            
            for(var i in result){
            	var expDate = new Date(result[i].expiredDate).getTime();
                //check is running
            	if(result[i].status == '2'){

                    // expired date
            		if(expDate < current){
                        console.log("Ads expired date is",result[i].id);

                        // api update status
                        var url = site.api_domain + '/api/creatives/' + result[i].id;
                        creativeModel.update(url, {status: '4'}, null);
                    }

                    else{

                        /**
                         * check total daily booking and pause
                         */
                        if(result[i].adType == 1){
                            var resultDetail = dataUtils.request.sync(null, urlDetail + result[i].id);
                            
                            if(resultDetail.dBk > 0){
                                
                                //console.log(urlDaily + result[i].id + '?type=daily&begin='+ now +'&end='+ now)
                                var resultDaily = dataUtils.request.sync(null, urlDaily + result[i].id + '?type=daily&begin='+ now +'&end='+ now);
                                var countImp = 0;
                                for(var k in resultDaily){
                                    countImp = countImp + resultDaily[k].imp;
                                }

                                //pending if impression >= dailybooking
                                if(countImp >= resultDetail.dBk){
                                    // api update status
                                    console.log('pending dailybooking '+ result[i].id)
                                    console.log(result[i].id, resultDetail.dBk, countImp)
                                    var url = site.api_domain + '/api/creatives/' + result[i].id;
                                    creativeModel.update(url, {status: '1'}, null);
                                }
                            }
                        }
                    }


            	}
                    
            }
        }

        catch (e) {
            console.error(e);
        }
    });
}

Schedule.prototype.handleDailyBooking = function (){
    console.log('running daily booking at 01:01am every weekday');
	var current = new Date().getTime();

    var now = new moment().format("YYYY-MM-DD");
	var urlList = site.api_domain + '/api/creative/summary?begin=2016-09-01';
    var urlDetail = site.api_domain + '/api/creatives/';
    var urlDaily = site.api_domain + '/api/creative/stats/';

    Sync(function(){
        try{
            // result from callback
            var result = dataUtils.request.sync(null, urlList);
            
            for(var i in result){
            	var expDate = new Date(result[i].expiredDate).getTime();

                // check condition
            	if(result[i].status == '1' && expDate > current){

                    console.log('passing 1 with ads ', result[i].id);

                    if(result[i].adType == 1){
                        console.log('passing 2 with ads ', result[i].id);

                        var resultDetail = dataUtils.request.sync(null, urlDetail + result[i].id);
                        
                        if(resultDetail.dBk > 0){
                            console.log('passing 3');
                            console.log("On running creative id ",result[i].id);

                            var url = site.api_domain + '/api/creatives/' + result[i].id;
                            creativeModel.update(url, {status: '2'}, null);
                        }
                    }

            	}
                    
            }
        }

        catch (e) {
            console.error(e);
        }
    });
}

module.exports = Schedule;