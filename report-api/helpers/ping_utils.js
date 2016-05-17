var request = require('request');
var nodemailer = require("nodemailer");
var mailer = require('./mailer_utils');
var database = require('../configs/database.js');
var Ping = database.ping;
// var statusCodes = require('http').STATUS_CODES;
var	hosts = [
				'http://d1.adsplay.net/ping',
				'http://d2.adsplay.net/ping',
				'http://d3.adsplay.net/ping',
				'http://d4.adsplay.net/ping',
				'http://d5.adsplay.net/ping',
				'http://d6.adsplay.net/ping',
				'http://monitor.adsplay.net/ping',
				'http://api.adsplay.net/ping'
			];

var Ping_Utils = function () {};

Ping_Utils.prototype.hosts = hosts;

Ping_Utils.prototype.pingUrl =  function(hosts, callback){
	ping_url(hosts, callback);
	//using ping_url('array link',callback) => return json {host, startTime, responseTime, status}
};

Ping_Utils.prototype.pingSave = function(){

	ping_url(hosts, function(obj){
		var doc = new Ping;
		doc.time = obj.time;
		for(var k in obj.fields) {
			doc.fields.push(obj.fields[k]);
			doc.save(function(err) {
				if (err) return handleError(err);
			});
		}
	});

}

var ping_url = function(hosts, callback){
	var startTime = new Date();
	var count = hosts.length;
	var temp = [];
	hosts.forEach(function(url , index){
		// send request
		request(
		{
			method: 'GET'
		    , uri: url
		    , timeout: 5000
		}, function (error, res, body) {
			var	responseTime = new Date().getTime() - startTime.getTime();
			
			if(error){
				temp.push({api: url, responseTime: responseTime , status: 0});

				//add mail
				sendMail();
	           
			}
			else{
				
				if(!error && res.statusCode === 200){
					temp.push({api: url, responseTime: responseTime , status: 1});
				}
				else{
					temp.push({api: url, responseTime: responseTime , status: 0});
					
					//add mail
					sendMail();
					
				}
			}

			if (--count === 0) {
				var obj = {
					 time: startTime.toString(),
					 fields: temp
				}
				callback(obj);
			}


			//function send mail
			function sendMail(){
					htmlMsg = '<h1>'+'Report server die'+'<h1/>'
	           		htmlMsg += '<p>Time: ' + startTime.toString();
		            htmlMsg += '<p>ResponseTime: ' + responseTime;
		            htmlMsg +='</p><p>Website: ' + url;
		            htmlMsg += '</p><p>Message: ' + 'Server error sorry' + '</p>';
			        // Send yourself an email
			        mailer({
			            from: 'tuananh.spktit09@gmail.com',
			            to: 'tuananh.spktit09@gmail.com, raymond2102.it09@gmail.com',
			            subject: url + ' is down',
			            body: htmlMsg
			        }, function (error, res) {
			            if (error) {
			                console.log(error);
			            }
			            else {
			                console.log(res.message || 'Failed to send email');
			            }
			        });
	           }

		});

	});
};

module.exports = new Ping_Utils();

			 
	 
	            
				
				
				
				
					
					
		            
