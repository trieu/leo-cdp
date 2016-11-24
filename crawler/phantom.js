var page = require('webpage').create();
console.log('The default user agent is ' + page.settings.userAgent);
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
page.open('http://www.httpuseragent.org', function (status) {
    if (status !== 'success') {
        console.log('Unable to access network');
    } else {
        var ua = page.evaluate(function () {
            return document.body.innerHTML;
        });
        console.log(ua);
    }
    phantom.exit();
});