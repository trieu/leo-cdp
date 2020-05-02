/*
 * LEO JS code for Real-time Analytics 360 - version 1.0 - built on 01/05/2020
 */

// ------------ LEO Proxy ------------------
(function() {
    if (typeof window.LeoObserverProxy === "undefined") {
        var proxyHtmlUrl = "//" + window.leoObserverLogDomain + "/public/html/leo-event-proxy.html#";
        var leoObserverId = window.leoObserverId;

        var LeoObserverProxy = {};
        window.LeoObserverProxy = LeoObserverProxy;

        // addEventListener support for IE8
        function bindEvent(element, eventName, eventHandler) {
            if (element.addEventListener) {
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
        ifProxy.src = proxyHtmlUrl + window.leoObserverLogDomain;

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

        LeoObserverProxy.messageHandler = function(data) {
            if (data === "LeoObserverProxyLoaded") {
 				initLeoContextSession()
            } else if (data === "LeoObserverProxyReady") {
                if (typeof LeoObserverProxyReady === "function") LeoObserverProxyReady();
            }
        }


        // Listen to message from child window
        bindEvent(window, 'message', function(e) {
            LeoObserverProxy.messageHandler(e.data);
        });

        var getObserverParams = function(eventData) {
            var mediaHost = encodeURIComponent(document.location.host);
			var tprefurl =  encodeURIComponent(document.referrer ? document.referrer : "");
			var tpname = encodeURIComponent(document.title);
            var tpurl = encodeURIComponent(document.location.href);
            
            //build params
            var params = {
                'obsid': leoObserverId,
                'mediahost': mediaHost,
                'tprefurl': tprefurl,
                'tpurl': tpurl,
                'tpname' : tpname
            };
            if(eventData){
             	var event = encodeURIComponent(JSON.stringify(eventData))
            }
            return params;
        }

		var initLeoContextSession = function(){
            var payload = JSON.stringify({
                'call': 'getContextSession',
                'params': getObserverParams(false)
            });
            sendMessage(payload);
		}
		
		

        // event-view(pageview|screenview|storeview|trueview|placeview,contentId,sessionKey,visitorId)
        LeoObserverProxy.recordViewEvent = function(eventName, eventData) {
            if (typeof eventData === "object") {
                var params = getObserverParams(eventData);
                var payload = JSON.stringify({
                    'call': 'doTracking',
                    'params': params,
                    'eventType': 'view'
                });
                sendMessage(payload);
            }
        }

        // event-action(click|play|touch|contact|watch|test,sessionKey,visitorId)
        LeoObserverProxy.recordActionEvent = function(eventName, eventData) {
            if (typeof eventData === "object") {
                var params = getObserverParams(eventData);
                var payload = JSON.stringify({
                    'call': 'doTracking',
                    'params': params,
                    'eventType': 'action'
                });
                sendMessage(payload);
            }
        }

        // event-conversion(add_to_cart|submit_form|checkout|join,sessionKey,visitorId)
        LeoObserverProxy.recordConversionEvent = function(eventName, eventData) {
            if (typeof eventData === "object") {
                var params = getObserverParams(eventData);
                var payload = JSON.stringify({
                    'call': 'doTracking',
                    'params': params,
                    'eventType': 'conversion'
                });
                sendMessage(payload);
            }
        }


        window.LeoObserverProxy = LeoObserverProxy;
    }

})();