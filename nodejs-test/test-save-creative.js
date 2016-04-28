var request = require('request');


var sampleAdData = 
{
	"id":188,
	"name":"FptPlay-TVC-EPL-Arsenal-Norwich City",
	"desc":"",
	"status":2,
	"adType":1,
	"prcModel":5,
	"cost":0,
	"tBk":0,
	"dBk":0,
	"hBk":0,
	"score":30,
	"media":"187-sd.mp4",

	"runDate": "2016-04-20",
	"expiredDate": "2016-04-30",
		
	"skip":"00:00:05",
	"dura":"00:00:30",
	"cliThr":"https://goo.gl/43rlje",
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

request('http://api.adsplay.net/creative/save/json', function (error, response, body) {
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
