## test cases

* Anonymous (No Personal Information): from last tracking event (product-view) data
	1) Send Web Push
	2) Re-targeting Banner Ad 
	
* Registered User,  user submit to receive personalized information,
	1) send email marketing 
	2) push Web Push
	3) SMS !?


1) Profile Report

## JS Code at https://demobookshop.leocdp.com/wp-admin/themes.php?page=tc-custom-javascript	


var isProductView = location.href.indexOf('/product/') > 0;

// Facebook Pixel
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2757042544554702');
fbq('track', 'PageView');


// Leo Web Observer for channel: Demo Bookshop
(function() {
  window.leoObserverLogDomain = "cdp.bigdatavietnam.org";
  window.leoObserverCdnDomain = "cdp.bigdatavietnam.org";
  window.leoObserverId = "6QvW6AZViYFWuzMOOkfvSx";
  window.srcTouchpointName = encodeURIComponent(document.title);
  window.srcTouchpointUrl = encodeURIComponent(location.protocol + '//' + location.host + location.pathname);

  var leoproxyJsPath = '/public/js/leo-observer/leoproxy.js';
  var src = location.protocol + '//' + window.leoObserverCdnDomain + leoproxyJsPath;
  var jsNode = document.createElement('script');
  jsNode.async = true;
  jsNode.src = src;
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(jsNode, s);
})();
function leoObserverProxyReady() {
  //Leo is ready, record event data
  if( isProductView ) {
    var sku = jQuery('span.sku').text();
    LeoObserverProxy.recordViewEvent("product-view", {'product-sku': sku });
  } else {
    LeoObserverProxy.recordViewEvent("content-view");
  }
}


// Lava
if( isProductView ) {
  var jsNode = document.createElement('script');
  jsNode.async = true;
  jsNode.src = "https://vnexpress.lavamedia.vn/pixel.js";
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(jsNode, s);
}
	