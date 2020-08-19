/*
 * LEO JS code for Real-time Analytics 360 - version 1.0 - built on 01/05/2020
 */

// ------------ LEO Proxy ------------------
(function() {
    if (typeof window.LeoObserverProxy === "undefined") {
    	var leoProxyOrigin = location.protocol + '//' + location.hostname;
    	var targetPostMessage = 'https://' + window.leoObserverLogDomain;
        var proxyHtmlUrl = 'https://' + window.leoObserverLogDomain + "/public/html/leo-event-proxy.html#";
        var leoObserverId = window.leoObserverId;
        var srcTouchpointUrl = window.srcTouchpointUrl;
        var srcTouchpointName = window.srcTouchpointName;

        var LeoObserverProxy = {};
        window.LeoObserverProxy = LeoObserverProxy;

        // addEventListener support for IE8
        function bindEvent(element, metricName, eventHandler) {
            if (element.addEventListener) {
                element.addEventListener(metricName, eventHandler, false);
            } else if (element.attachEvent) {
                element.attachEvent('on' + metricName, eventHandler);
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
        ifProxy.src = proxyHtmlUrl + window.leoObserverLogDomain + '_' + leoProxyOrigin;

        //append to trigger iframe post back data to server
        var body = document.getElementsByTagName("body");
        if (body.length > 0) {
            body[0].appendChild(ifProxy);
        }


        // Send a message to the child iframe
        var sendMessage = function(msg) {
            // Make sure you are sending a string, and to stringify JSON
            ifProxy.contentWindow.postMessage(msg, targetPostMessage);
        };

        LeoObserverProxy.messageHandler = function(hash) {
            if (hash === "LeoObserverProxyLoaded") {
 				initLeoContextSession()
            } 
            else if (hash === "LeoObserverProxyReady") {
            	var f = window.leoObserverProxyReady;
                if (typeof f === "function") {
                	f();
                }
            }
        }
        
        // Listen to messages from parent window
        
        bindEvent(window, 'message', function(e) {
        	//console.log("===> host.e.origin " + e.origin + " data " + e.data)
        	if (e.origin !== targetPostMessage)
        	    return;
        	LeoObserverProxy.messageHandler(e.data);
        });

        var getObserverParams = function(metricName, eventData, profileObject) {
			var tprefurl =  encodeURIComponent(document.referrer);
			var tprefdomain = extractRootDomain(document.referrer);
			
			var tpname = srcTouchpointName || encodeURIComponent(document.title);
			var mediaHost = extractRootDomain(document.location.href);
            var tpurl = srcTouchpointUrl || encodeURIComponent(document.location.href);
            
            //build params
            var params = {
                'obsid': leoObserverId,
                'mediahost': mediaHost,
                'tprefurl': tprefurl,
                'tprefdomain': tprefdomain,
                'tpurl': tpurl,
                'tpname' : tpname
            };
            if(metricName && eventData){
            	params['metric'] = metricName;
             	params['eventdata'] = encodeURIComponent(JSON.stringify(eventData)); 
            }
            if(profileObject){
            	params['profiledata'] = JSON.stringify(profileObject); 
            }
            return params;
        }
        
        
        var extractRootDomain = function(url){
        	try {
        	    return new URL(url).hostname.split('.').slice(-2).join('.');
        	} catch(e) {} return "";
        };

		var initLeoContextSession = function(){
            var payload = JSON.stringify({
                'call': 'getContextSession',
                'params': getObserverParams(false)
            });
            sendMessage(payload);
            console.log('LeoObserverProxy.initLeoContextSession')
		}
		

        // event-view(pageview|screenview|storeview|trueview|placeview,contentId,sessionKey,visitorId)
        LeoObserverProxy.recordViewEvent = function(metricName, eventData) {
            if (typeof eventData !== "object") {
            	eventData = {};
            }
            var params = getObserverParams(metricName, eventData);
            var payload = JSON.stringify({
                'call': 'doTracking',
                'params': params,
                'eventType': 'view'
            });
            sendMessage(payload);
        }

        // event-action(click|play|touch|contact|watch|test,sessionKey,visitorId)
        LeoObserverProxy.recordActionEvent = function(metricName, eventData) {
            if (typeof eventData === "object") {
                var params = getObserverParams(metricName, eventData);
                var payload = JSON.stringify({
                    'call': 'doTracking',
                    'params': params,
                    'eventType': 'action'
                });
                sendMessage(payload);
            }
        }

        // event-conversion(add_to_cart|submit_form|checkout|join,sessionKey,visitorId)
        LeoObserverProxy.recordConversionEvent = function(metricName, eventData) {
            if (typeof eventData === "object") {
                var params = getObserverParams(metricName,eventData);
                var payload = JSON.stringify({
                    'call': 'doTracking',
                    'params': params,
                    'eventType': 'conversion'
                });
                sendMessage(payload);
            }
        }
        
        LeoObserverProxy.updateProfileBySession = function(profileObject) {
            if (typeof profileObject === "object") {
                var payload = JSON.stringify({
                    'call': 'updateProfile',
                    'params': getObserverParams(false,false,profileObject)
                });
                sendMessage(payload);
            }
        }

        window.LeoObserverProxy = LeoObserverProxy;
    }

})();