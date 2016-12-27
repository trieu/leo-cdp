var webPage = require('webpage');
var page = webPage.create();
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
page.settings.userAgent = useragent[Math.floor(Math.random() * useragent.length)];
page.settings.javascriptEnabled = true;


var urls = ['http://example.com','http://emptys.com/'];

function handle_page(url){
    console.log(url)
    page.open(url, function(status){
        console.log(status)
        if (status !== 'success') {
            console.log('ss');
        }
        else{
            console.log('dd')
            page.injectJs('./zepto.min.js');
            var html = page.evaluate(function(){
                // ...do stuff...
                return $('body').html();
            });

            console.log(html);
        }
        next_page();
    });
}

function next_page(){
    var url = urls.shift();
    if(!url){
        phantom.exit(0);
    }
    handle_page(url);
}

next_page();