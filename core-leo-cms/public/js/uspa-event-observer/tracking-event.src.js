/*
 * tracking-event.js for USPA Analytics - version 1.0 - date:22/01/2020
 */
(function() {
  var USPA_Proxy = {};
  const cssIframe = "width:0px!important;height:0px!important;display:none!important";
  const baseUrl = "//xemgiday.com/public/html/uspa-event-proxy.html#";

  USPA_Proxy.trackEvent = function(eventData) {
    if (typeof eventData === "object") {
      //build query string
      var q ="referrer=" + encodeURIComponent(document.referrer ? document.referrer : "");
      q += "&url=" + encodeURIComponent(document.location.href);
      q += "&host=" + encodeURIComponent(document.location.host);
      q += "&t=" + new Date().getTime();
      q += "&event=" + encodeURIComponent(JSON.stringify(eventData));

      //cross domain iframe
      var iframe = document.createElement("iframe");
      iframe.width = 0;
      iframe.height = 0;
      iframe.setAttribute("style", cssIframe);
      const fullUrl = baseUrl + q;
      iframe.src = fullUrl;

      //append to trigger iframe post back data to server
      var body = document.getElementsByTagName("body");
      if (body.length > 0) {
        body[0].appendChild(iframe);
      }
    }
  };

  if (typeof window.USPA_Proxy === "undefined") {
    window.USPA_Proxy = USPA_Proxy;
    if (typeof window.USPA_Proxy_Ready === "function") {
      window.USPA_Proxy_Ready();
    }
  }
})();
