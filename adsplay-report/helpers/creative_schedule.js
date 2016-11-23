var Sync = require('sync');
var moment = require('moment');
var ArrayUtils = require('./array_utils');
var site = require('../configs/site');
var dataUtils = require('./data_utils.js');
var creativeModel = require('../models/creative.js');

function Schedule(period){
    this.period = period;
    var _this = this;
    _this.updateStatus();
    setInterval(function(){
        _this.updateStatus();
    }, _this.period);
}

Schedule.prototype.updateStatus = function (){
    console.log("==> run schedule with ",this.period)
	var current = new Date().getTime();

    // check ads creative in 30 days    
    // var now = new moment().format("YYYY-MM-DD");
    // var begin = new moment().subtract(30, 'days').format("YYYY-MM-DD");
    // var urlGet = site.api_domain + '/api/creative/summary?begin='+begin+'&end'+now;

	var urlGet = site.api_domain + '/api/creative/summary?begin=2015-05-01';

	Sync(function(){
        try{
            // result from callback
            var result = dataUtils.request.sync(null, urlGet);
            for(var i in result){
            	var expDate = new Date(result[i].expiredDate).getTime();

                //check is running & expired date
            	if(result[i].status == '2' && expDate <= current){
            		console.log("Ads expired date is",result[i].id);
                    // api update
                    var url = site.api_domain + '/api/creatives/' + result[i].id;
                    creativeModel.update(url, {status: '4'}, null);
            	}
            }
        }

        catch (e) {
            console.error(e);
        }
    });


}

module.exports = Schedule;