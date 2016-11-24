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
var words = {}; //push result
var json = require('./json/alexa-topsites-VN-OUTPUT.json');

var casper = require('casper').create({
	waitTimeout: 12000,
	// stepTimeout: 2400,
	proxy: "192.30.252.153",
	pageSettings: {
		userAgent: useragent[Math.floor(Math.random() * useragent.length)],
		// javascriptEnabled: true,
		webSecurityEnabled: true,
		ignoreSslErrors: true,
		sslProtocol: "any"
		// loadImages:  false	// The WebPage instance used by Casper will
	},
	verbose: true,
	clientScripts: ["jquery.min.js"]
});


casper.start();

casper.each(json.alexa, function(casper, obj) {

	function randomTimeout(min,max){
		return Math.floor(Math.random()*(max-min+1)+min);
	}

	var link = obj.url;
	
	casper.thenOpen("http://www.alexa.com/siteinfo/"+link, function() {
		console.log(link);
		words[link] = [];

		casper.page.customHeaders = {
			'Accept-Language': 'en-US'
		};

		this.waitForSelector('.summary', function() {

			var getRank = this.evaluate(function() {
				var arr = [];
				$('#demographics_div_country_table tbody tr').each(function(){
					var item = {};
					item.country = $(this).find('td:eq(0) a').text();
					item.percentofVisitors = $(this).find('td:eq(1) span').text();
					item.rankinCountry = $(this).find('td:eq(2) span').text();
					arr.push(item);
				});
				return arr;
			});
			words[link].push({rank: getRank});
			

			/*________ ENTER ________*/

			var getMediaEngaged = this.evaluate(function() {
				var arr = {};
				arr.bounceRate = $('#engagement-content [data-cat="bounce_percent"] .metrics-data').text().trim();
				arr.dailyPageviews = $('#engagement-content [data-cat="pageviews_per_visitor"] .metrics-data').text().trim();
				arr.dailyTimeOnSite = $('#engagement-content [data-cat="time_on_site"] .metrics-data').text().trim();
				return arr;
			});
			words[link].push({mediaEngaged: getMediaEngaged});
			

			/*________ ENTER ________*/

			var getKeywordSearch = this.evaluate(function() {
				var arr = [];
				$('#keywords_top_keywords_table tbody tr').each(function(){
					var item = {};
					item.keyword = $(this).find('td:eq(0)').attr('title');
					item.percentOfSearchTraffic = $(this).find('td:eq(1) span').text();
					arr.push(item);
				});
				return arr;
			});
			words[link].push({keywordSearch: getKeywordSearch});
			

			/*________ ENTER ________*/

			var getBackLink = this.evaluate(function() {
				var arr = [];
				$('#keywords_upstream_site_table tbody tr').each(function(){
					var item = {};
					item.site = $(this).find('td:eq(0) a').text();
					item.percentOfUniqueVisits = $(this).find('td:eq(1) span').text();
					arr.push(item);
				});
				return arr;
			});
			words[link].push({backLink: getBackLink});
			

			/*________ ENTER ________*/

			var getLinkIn = this.evaluate(function() {
				var arr = {};
				arr.totalSiteLinkIn = $('#linksin-panel-content .box1-med3 .box1-r').text();
				arr.item = [];
				$('#linksin_table tbody tr').each(function(){
					var item = {};
					item.site = $(this).find('td:eq(1) a').text();
					item.page = $(this).find('td:eq(2) a span').text();
					arr.item.push(item);
				});
				return arr;
			});
			words[link].push({linkIn: getLinkIn});
			

			/*________ ENTER ________*/

			var getRelatedLinks = this.evaluate(function() {
				var arr = [];
				$('#related_link_table tbody tr').each(function(){
					item = {};
					item.site = $(this).find('td a').text();
					arr.push(item);
				});
				return arr;
			});
			words[link].push({relatedLinks: getRelatedLinks});
			

			/*________ ENTER ________*/

			var getSiteDescription = this.evaluate(function() {
				var arr = {};
				arr.description = $('#contact-panel-content .row-fluid .color-s3').text();
				return arr;
			});
			words[link].push({siteDescription: getSiteDescription});


			/*________ ENTER ________*/

			var getGender = this.evaluate(function() {
				var arr = {};
				arr.male = $('#demographics-content .demo-gender .pybar-row:eq(1) .WhatsThis .container').text().trim();
				arr.female = $('#demographics-content .demo-gender .pybar-row:eq(2) .WhatsThis .container').text().trim();
				
				return arr;
			});
			words[link].push({gender: getGender});

			/*________ ENTER ________*/

			var getEducation = this.evaluate(function() {
				var arr = {};
				arr.noCollege = $('#demographics-content .demo-education .pybar-row:eq(1) .WhatsThis .container').text().trim();
				arr.someCollege = $('#demographics-content .demo-education .pybar-row:eq(2) .WhatsThis .container').text().trim();
				arr.graduateSchool = $('#demographics-content .demo-education .pybar-row:eq(3) .WhatsThis .container').text().trim();
				arr.college = $('#demographics-content .demo-education .pybar-row:eq(4) .WhatsThis .container').text().trim();
				
				return arr;
			});
			words[link].push({education: getEducation});



			/*________ ENTER ________*/

			var getBrowsingLocation = this.evaluate(function() {
				var arr = {};
				arr.home = $('#demographics-content .demo-location .pybar-row:eq(1) .WhatsThis .container').text().trim();
				arr.school = $('#demographics-content .demo-location .pybar-row:eq(2) .WhatsThis .container').text().trim();
				arr.work = $('#demographics-content .demo-location .pybar-row:eq(3) .WhatsThis .container').text().trim();
				
				return arr;
			});
			words[link].push({browsingLocation: getBrowsingLocation});
		},function(){
			this.echo("I can't request.").exit();
		}, randomTimeout(1,9) * 5432);

	});

	casper.then(function(){
		var output = words;
		fs.write('./json/alexa-info.json', JSON.stringify(output, null, "\t"), 'w');
	});

});

casper.on("page.error", function(msg, trace) {
	this.echo("Error: " + msg, "ERROR");
});

casper.run(function(){
	this.exit();
});