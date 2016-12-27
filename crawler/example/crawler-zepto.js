var request = require('request')
	,domino = require('domino')
	Zepto = require('zepto-node');
var async = require('async');	


// for(var i in arr){
// 		var url = arr[i];
// 		if(url.indexOf("https://") == 0){
// 			url = url.replace("https://", "http://");
// 		}
// 		if(url.indexOf("http://") != -1){
// 			url = "http://"+url;
// 		}

// 		this.url.push(url);
// 	}


// var Crawler = function(urls, elements[i]){
// 	this.urls = urls;
// 	this.elements[i] = elements[i];
// }
// Crawler.prototype.getData = function(){
// 	for(var i in this.urls){
// 		var window = domino.createWindow(body);
// 		var $ = Zepto(window);
		
// 		$(this.urls[i]).each(function(){
// 			console.log($(this).attr('href'))
// 		})
// 	}
// };

var elements = [
	{"tag": "a", "attr": "href"},
	{"tag": "img", "attr": "src"}
];

var urls = ["http://getbootstrap.com/"];

function httpGet(url, callback) {
	var options = {
		uri : url,
		method : 'GET'
	};
	request(options,
		function(err, res, body) {
		callback(err, {url: url, body: body});
	});
}

async.map(urls, httpGet,
function (err, result){
	if (err) return console.log(err);
	console.log(result[0].url)
	var window = domino.createWindow(result[0].body);
	var $ = Zepto(window);
	var data = [];
	var urlArr = result[0].url.split("/");
	var urlName = urlArr[2];
	for(i in elements){
		console.log(i)
		if(elements[i].attr){
			$(elements[i].tag + "["+elements[i].attr+"]").each(function(){
				var attrValue = $(this).attr(elements[i].attr);
				
				if(attrValue.indexOf('http') !== 0){
					if(attrValue.indexOf(urlName) === -1){
						var str = attrValue.replace("../", "");
						var clean = (urlName+"//"+str).replace(/\/+/g, "/");
						data.push("http://"+clean);
					}
				}
			});
		}
		else{
			$(elements[i].tag).each(function(){
				data.push($(this).text());
			});
		}
	}
	
	console.log(data);
});
