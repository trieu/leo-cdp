var request = require('request');


var sampleAdData = 
{
	"id":0,
	"name":"unit-test",
	"desc":"",
	"status":2,
	"adType":1,
	"prcModel":2,
	"cost":0,
	"tBk":200000,
	"dBk":0,
	"hBk":0,
	"score":30,
	"media":"1005-sd.mp4",

	"runDate":"Apr 26, 2016 12:00:00 AM",
	"expiredDate":"May 15, 2016 12:00:00 AM",
		
	"skip":"00:00:05",
	"dura":"00:00:29",
	"cliThr":"",
	"cliId":0,
	"cpnId":0,
	"flId":0,
	"fqcCap":0,
	
	"is3rdAd":false,
	"vastXml3rd":"",	
	
	"discount":0.0,	
	"tgpms":[101,102,201],
	"tgpfs":[1,5,4],
	"tggds":[2]
};
request('http://d1.adsplay.net/ping', function (error, response, body) {
    if (!error && response.statusCode == 200) {
		console.log(body);
	}
});

var urlSave = 'http://api.adsplay.net/creative/save/json';
request.post({url:urlSave, form: JSON.stringify(sampleAdData)}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
                console.log(body);
        } else {
		console.error(error)
	}
});
