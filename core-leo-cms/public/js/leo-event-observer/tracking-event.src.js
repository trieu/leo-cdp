/*
 * LEO JS code for Real-time Analytics 360 - version 1.0 - built on 01/05/2020
 */
 
 // ------------ LEO Proxy ------------------
 
(function() {
  var proxyHtmlUrl = "//"+window.LeoObserverLogDomain+"/public/html/leo-event-proxy.html#";
  var observerId = window.LeoObserverId;
  
  var LeoObserverProxy = {};
  window.LeoObserverProxy = LeoObserverProxy;
  
	// addEventListener support for IE8
	function bindEvent(element, eventName, eventHandler) {
	    if (element.addEventListener){
	        element.addEventListener(eventName, eventHandler, false);
	    } else if (element.attachEvent) {
	        element.attachEvent('on' + eventName, eventHandler);
	    }
	}
  
  //cross domain iframe
  var ifProxy = document.createElement("iframe");
  ifProxy.width = 0;
  ifProxy.height = 0;
  ifProxy.id = 'leotech_event_proxy';
  ifProxy.name = 'leotech_event_proxy';
  ifProxy.height = 0;
  ifProxy.setAttribute("style", "display:none!important");
  ifProxy.src = proxyHtmlUrl + window.LeoObserverLogDomain;

  //append to trigger iframe post back data to server
  var body = document.getElementsByTagName("body");
  if (body.length > 0) {
    body[0].appendChild(ifProxy);
  }
  
  
   // Send a message to the child iframe
    var sendMessage = function(msg) {
        // Make sure you are sending a string, and to stringify JSON
        ifProxy.contentWindow.postMessage(msg, '*');
    };
    
    LeoObserverProxy.messageHandler = function(data){
    	if(data === "LeoObserverProxyLoaded"){
	    	
			var host = encodeURIComponent(document.location.host);
			var contextUrl = encodeURIComponent(document.location.href);
			var params = {'observerId':observerId,'host':host,'contextUrl':contextUrl}
			
			var payload = JSON.stringify({'call':'getContextSession','params':params});
			sendMessage(payload);
			
    	} 
    	else if(data === "LeoObserverProxyReady"){
    		if(typeof LeoObserverProxyReady === "function") LeoObserverProxyReady();
    	}
    }
  
  
   // Listen to message from child window
    bindEvent(window, 'message', function (e) {
        LeoObserverProxy.messageHandler(e.data);
    });


  LeoObserverProxy.trackEvent = function(eventData) {
    if (typeof eventData === "object") {
      //build params
      var event = encodeURIComponent(JSON.stringify(eventData))
      var q ="referrer=" + encodeURIComponent(document.referrer ? document.referrer : "");
      q += "&url=" + encodeURIComponent(document.location.href);
      q += "&host=" + encodeURIComponent(document.location.host);
      q += "&t=" + new Date().getTime();
      
      var host = encodeURIComponent(document.location.host);
	  var contextUrl = encodeURIComponent(document.location.href);
      var params = {'observerId':observerId,'host':host,'contextUrl':contextUrl} 
	  var payload = JSON.stringify({'call':'doTracking','params':params,'eventType':'view'});
      
    }
  };
  
  
 LeoObserverProxy.sendMessage = sendMessage;

  if (typeof window.LeoObserverProxy === "undefined") {
	window.LeoObserverProxy = LeoObserverProxy;
	if (typeof window.LeoObserverProxy_Ready === "function") {
		//LeoObserverProxy.getContextSession(window.LeoObserverProxy_Ready)
	}
  }
 
  
})();
