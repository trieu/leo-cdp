var useragent = [
'Opera/9.80 (X11; Linux x86_64; U; fr) Presto/2.9.168 Version/11.50',
'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36',
'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.100 Safari/537.36',
'Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16',
'Mozilla/5.0 (Windows NT 6.0; rv:2.0) Gecko/20100101 Firefox/4.0 Opera 12.14',
'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.117 Safari/537.36',
'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/600.3.18 (KHTML, like Gecko) Version/8.0.3 Safari/600.3.18',
'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/601.6.17 (KHTML, like Gecko) Version/9.1.1 Safari/601.6.17'
];

var fs = require('fs');
var words = []; //push result
var json = require('./json/alexa-topsites-VN-GET.json');

var casper = require('casper').create({
	proxy: "120.52.72.56",
	pageSettings: {
		userAgent: useragent[Math.floor(Math.random() * useragent.length)],
		javascriptEnabled: true
	},
	verbose: true,
	clientScripts: ["./public/js/jquery.min.js"]
});


casper.start();

casper.each(json.alexa, function(casper, item) {
	var link = item.url;
	casper.thenOpen(link, function() {
		console.log(link);
		var getLink = this.evaluate(function() {
			var arr = [];
			$('.site-listing .desc-paragraph a').each(function(){
				arr.push($(this).text());
			})
			return arr;
		});

		for(var i in getLink){
			words.push({url: getLink[i]});
		}

	});

});

casper.on("page.error", function(msg, trace) {
	this.echo("Error: " + msg, "ERROR");
});

casper.run(function(){
	var output = {alexa: words};
	fs.write('./json/alexa-topsites-VN-OUTPUT.json', JSON.stringify(output, null, "\t"), 'w');
	this.exit();
});